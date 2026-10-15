import { execFile } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

export interface SimProfile {
  iccid: string;
  imsi: string;
  msisdn: string;
  sim_type: string;
  profile_status: string;
  apn_group: string;
  rate_plan: string;
  pin1: string;
  puk1: string;
  pin2: string;
  puk2: string;
  lpa_activation_code?: string;
  created_timestamp: number;
}

export interface CdrAuditSummary {
  tariff_plan: any;
  summary: {
    total_records: number;
    total_billed: number;
    total_expected: number;
    net_variance: number;
    accuracy_rate_pct: number;
    counts: {
      exact_matches: number;
      rounding_diffs: number;
      overcharged: number;
      undercharged: number;
    };
  };
  service_breakdown: Record<string, any>;
  discrepancies: any[];
}

export interface InvoiceAuditResult {
  invoice_id: string;
  account_id: string;
  account_name: string;
  billing_period: string;
  currency: string;
  verdict: 'PASSED' | 'FAILED';
  audit_timestamp: number;
  verified_values: {
    reported_subtotal: number;
    computed_subtotal: number;
    reported_tax: number;
    computed_tax: number;
    discounts_applied: number;
    reported_total_due: number;
    computed_total_due: number;
  };
  discrepancies_count: number;
  discrepancies: Array<{ type: string; message: string; delta: number }>;
  cdr_cross_reconciliation?: any;
}

export class PythonBridge {
  private static get scriptPath(): string {
    return path.resolve(process.cwd(), 'python-services/cli.py');
  }

  public static async generateBulkSims(options: { count?: number; out?: string; apn?: string; ratePlan?: string } = {}): Promise<{ count: number; exported_file: string; sample_profiles: SimProfile[] }> {
    const count = options.count || 25;
    const out = options.out || path.resolve('reports/python-audit', `sims_batch_${Date.now()}.csv`);
    const apn = options.apn || 'iot.carrier.com';
    const ratePlan = options.ratePlan || 'Enterprise-5G-Tier1';

    const args = [
      this.scriptPath,
      'generate-sims',
      '--count', count.toString(),
      '--apn', apn,
      '--rate-plan', ratePlan,
      '--out', out,
    ];

    const stdout = await this.execPython(args);
    return JSON.parse(stdout);
  }

  public static async runCdrRatingAudit(count: number = 100): Promise<{ audit: CdrAuditSummary; exported_file: string }> {
    const out = path.resolve('reports/python-audit', `cdr_audit_${Date.now()}.json`);
    const args = [
      this.scriptPath,
      'cdr-audit',
      '--count', count.toString(),
      '--out', out,
    ];

    const stdout = await this.execPython(args);
    return JSON.parse(stdout);
  }

  public static async reconcileInvoice(options: { account?: string; sims?: number } = {}): Promise<{ audit: InvoiceAuditResult; exported_file: string }> {
    const account = options.account || 'Enterprise IoT Logistics Corp';
    const sims = options.sims || 100;
    const out = path.resolve('reports/python-audit', `invoice_audit_${Date.now()}.json`);

    const args = [
      this.scriptPath,
      'invoice-audit',
      '--account', account,
      '--sims', sims.toString(),
      '--out', out,
    ];

    const stdout = await this.execPython(args);
    return JSON.parse(stdout);
  }

  public static async runFullTelecomAudit(sims: number = 100): Promise<any> {
    const out = path.resolve('reports/python-audit', `full_audit_${Date.now()}.json`);
    const args = [
      this.scriptPath,
      'full-audit',
      '--sims', sims.toString(),
      '--out', out,
    ];

    const stdout = await this.execPython(args);
    return JSON.parse(stdout);
  }

  private static execPython(args: string[]): Promise<string> {
    return new Promise((resolve, reject) => {
      execFile('python3', args, { maxBuffer: 10 * 1024 * 1024 }, (error, stdout, stderr) => {
        if (error) {
          return reject(new Error(`[PythonBridge] Execution failed: ${stderr || error.message}`));
        }
        resolve(stdout);
      });
    });
  }
}
