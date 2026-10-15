import { Page, Response } from '@playwright/test';
import { Logger } from './logger';
import * as fs from 'fs';
import * as path from 'path';

export type DriftSeverity = 'CRITICAL' | 'WARNING' | 'INFO';

export interface ContractDriftEvent {
  id: string;
  endpoint: string;
  method: string;
  status: number;
  latencyMs: number;
  driftType: 'MISSING_FIELD' | 'EXTRA_UNDOCUMENTED_FIELD' | 'TYPE_MISMATCH' | 'STATUS_CODE_DEVIATION' | 'SLA_LATENCY_BREACH';
  severity: DriftSeverity;
  field?: string;
  expectedType?: string;
  actualType?: string;
  message: string;
  timestamp: number;
  testTitle?: string;
}

export interface ContractDriftStats {
  totalInspected: number;
  driftCount: number;
  complianceRatePct: number;
  criticalCount: number;
  warningCount: number;
  infoCount: number;
  recentDrifts: ContractDriftEvent[];
}

// Known core contracts for the IoT Hub Portal endpoints
const KNOWN_CONTRACTS: Record<string, { required: string[]; types: Record<string, string>; maxLatencyMs?: number }> = {
  '/api/v1/users/available-languages': {
    required: ['languages', 'default'],
    types: { languages: 'object', default: 'string' },
    maxLatencyMs: 1200,
  },
  '/api/v1/users/assigned-accounts': {
    required: ['accounts'],
    types: { accounts: 'object' },
    maxLatencyMs: 1500,
  },
  '/api/v1/graphql': {
    required: ['data'],
    types: { data: 'object' },
    maxLatencyMs: 2000,
  },
  '/api/v1/auth/session': {
    required: ['authenticated', 'user'],
    types: { authenticated: 'boolean', user: 'object' },
    maxLatencyMs: 1000,
  },
};

/**
 * Enterprise In-Flight API Contract Drift Sniffer (Option C)
 * Passively monitors network API traffic and identifies schema regressions,
 * undocumented payload expansions, type anomalies, and latency SLA breaches.
 */
export class ContractDriftSniffer {
  private page: Page;
  private static storagePath = path.resolve('reports/contract-drift/drift-audit.json');
  private static totalInspectedCounter = 0;
  private currentTestTitle?: string;

  constructor(page: Page, testTitle?: string) {
    this.page = page;
    this.currentTestTitle = testTitle;
    ContractDriftSniffer.ensureStorageDirs();
    this.attachResponseListener();
  }

  private static ensureStorageDirs(): void {
    const dir = path.resolve('reports/contract-drift');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  /**
   * Attaches passive listener to page network responses
   */
  private attachResponseListener(): void {
    this.page.on('response', async (response: Response) => {
      const url = response.url();
      if (!url.includes('/api/') && !url.includes('/uam/')) return;

      ContractDriftSniffer.totalInspectedCounter++;
      const request = response.request();
      const method = request.method();
      const status = response.status();
      const timing = response.request().timing();
      const latencyMs = timing ? Math.round(timing.responseEnd - timing.requestStart) : 0;

      // Extract endpoint path
      let endpointPath = '';
      try {
        const parsed = new URL(url);
        endpointPath = parsed.pathname;
      } catch {
        endpointPath = url;
      }

      // Check SLA Latency
      const contract = Object.entries(KNOWN_CONTRACTS).find(([k]) => endpointPath.includes(k))?.[1];
      if (contract?.maxLatencyMs && latencyMs > contract.maxLatencyMs) {
        this.recordDrift({
          endpoint: endpointPath,
          method,
          status,
          latencyMs,
          driftType: 'SLA_LATENCY_BREACH',
          severity: 'WARNING',
          message: `Endpoint latency (${latencyMs}ms) breached SLA contract target (${contract.maxLatencyMs}ms)`,
        });
      }

      // Inspect JSON payload
      const contentType = response.headers()['content-type'] || '';
      if (contentType.includes('application/json') && status >= 200 && status < 300) {
        try {
          const body = await response.json();
          this.evaluatePayloadContract(endpointPath, method, status, latencyMs, body, contract);
        } catch {
          // Payload parsing skipped
        }
      }
    });
  }

  /**
   * Evaluates live JSON against expected schema contract
   */
  private evaluatePayloadContract(
    endpoint: string,
    method: string,
    status: number,
    latencyMs: number,
    body: any,
    contract?: { required: string[]; types: Record<string, string> }
  ): void {
    if (!contract || typeof body !== 'object' || body === null) return;

    // 1. Missing Required Fields
    for (const reqField of contract.required) {
      if (!(reqField in body)) {
        this.recordDrift({
          endpoint,
          method,
          status,
          latencyMs,
          driftType: 'MISSING_FIELD',
          severity: 'CRITICAL',
          field: reqField,
          message: `Mandatory contract field "${reqField}" missing in live response payload`,
        });
      }
    }

    // 2. Type Mismatch Checks
    for (const [field, expectedType] of Object.entries(contract.types)) {
      if (field in body) {
        const actualType = Array.isArray(body[field]) ? 'array' : typeof body[field];
        if (expectedType === 'object' && actualType === 'array') {
          // Arrays are objects in JSON schema context
          continue;
        }
        if (actualType !== expectedType && body[field] !== null) {
          this.recordDrift({
            endpoint,
            method,
            status,
            latencyMs,
            driftType: 'TYPE_MISMATCH',
            severity: 'CRITICAL',
            field,
            expectedType,
            actualType,
            message: `Contract type violation for "${field}": expected ${expectedType}, received ${actualType}`,
          });
        }
      }
    }

    // 3. Extra Undocumented Fields (Drift Detection)
    const allowedFields = new Set([...contract.required, ...Object.keys(contract.types)]);
    const liveFields = Object.keys(body);
    for (const liveField of liveFields) {
      if (!allowedFields.has(liveField) && !liveField.startsWith('_')) {
        this.recordDrift({
          endpoint,
          method,
          status,
          latencyMs,
          driftType: 'EXTRA_UNDOCUMENTED_FIELD',
          severity: 'INFO',
          field: liveField,
          message: `Undocumented field "${liveField}" detected in API response (forward contract drift)`,
        });
      }
    }
  }

  /**
   * Records a contract drift incident to persistent disk storage
   */
  public recordDrift(drift: Omit<ContractDriftEvent, 'id' | 'timestamp' | 'testTitle'>): void {
    try {
      ContractDriftSniffer.ensureStorageDirs();
      const history = ContractDriftSniffer.getDriftHistory();
      const newEvent: ContractDriftEvent = {
        id: `drift_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        ...drift,
        timestamp: Date.now(),
        testTitle: this.currentTestTitle,
      };

      // De-duplicate if same endpoint and message within 5 seconds
      const exists = history.some(
        (h) => h.endpoint === newEvent.endpoint && h.message === newEvent.message && Date.now() - h.timestamp < 5000
      );
      if (!exists) {
        history.unshift(newEvent);
        if (history.length > 200) history.pop();
        fs.writeFileSync(ContractDriftSniffer.storagePath, JSON.stringify(history, null, 2), 'utf-8');
        Logger.warn(`📡 [CONTRACT DRIFT: ${newEvent.severity}] ${newEvent.endpoint}: ${newEvent.message}`);
      }
    } catch {
      // Ignore write errors
    }
  }

  public static getDriftHistory(): ContractDriftEvent[] {
    try {
      if (fs.existsSync(this.storagePath)) {
        return JSON.parse(fs.readFileSync(this.storagePath, 'utf-8'));
      }
    } catch {
      // Ignore read errors
    }
    return [];
  }

  public static getStats(): ContractDriftStats {
    const history = this.getDriftHistory();
    const driftCount = history.length;
    const total = Math.max(this.totalInspectedCounter, driftCount + 10);
    const critical = history.filter((d) => d.severity === 'CRITICAL').length;
    const warning = history.filter((d) => d.severity === 'WARNING').length;
    const info = history.filter((d) => d.severity === 'INFO').length;

    const complianceRate = total > 0 ? Math.max(0, ((total - critical * 2 - warning) / total) * 100) : 100;

    return {
      totalInspected: total,
      driftCount,
      complianceRatePct: parseFloat(complianceRate.toFixed(1)),
      criticalCount: critical,
      warningCount: warning,
      infoCount: info,
      recentDrifts: history.slice(0, 15),
    };
  }

  public static clearDriftLog(): void {
    try {
      this.ensureStorageDirs();
      fs.writeFileSync(this.storagePath, JSON.stringify([], null, 2), 'utf-8');
    } catch {
      // Ignore
    }
  }
}
