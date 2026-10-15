import { config, loadEnvironmentsRegistry } from '../config/environment';
import { Logger } from './logger';
import * as fs from 'fs';
import * as path from 'path';

export interface GuardrailCheckResult {
  allowed: boolean;
  isProtected: boolean;
  isDestructive: boolean;
  reason?: string;
  auditMessage: string;
}

export class ProdGuardrail {
  private static readonly DESTRUCTIVE_KEYWORDS = [
    '@destructive',
    '@mutation',
    '@delete',
    '@wipe',
    '@purge',
    '@chaos',
    'delete',
    'purge',
    'terminate',
    'destroy',
    'wipe',
    'reset',
    'mass_',
    'bulk_delete',
  ];

  public static readonly BYPASS_SECRET = 'CONFIRM-PROD-SAFETY-OVERRIDE';

  /**
   * Check if current configured environment is marked as PROD or isProtected
   */
  static isProtectedEnvironment(): boolean {
    const registry = loadEnvironmentsRegistry();
    const active = registry.environments.find((e) => e.id === registry.activeEnvironmentId);
    
    if (active) {
      if (active.isProtected === true || active.category === 'PROD') {
        return true;
      }
    }
    
    // Check environment variable fallback
    return (
      process.env.WDH_ENV === 'PROD' ||
      process.env.IS_PROTECTED === 'true' ||
      (config.environment === 'PROD')
    );
  }

  /**
   * Checks whether a test case contains destructive or mutating operations
   */
  static isDestructiveTest(title: string, tags: string[] = []): boolean {
    const lowerTitle = title.toLowerCase();
    const hasKeyword = this.DESTRUCTIVE_KEYWORDS.some((kw) => 
      lowerTitle.includes(kw.toLowerCase())
    );
    const hasTag = tags.some((tag) => 
      this.DESTRUCTIVE_KEYWORDS.some((kw) => tag.toLowerCase().includes(kw.toLowerCase()))
    );
    return hasKeyword || hasTag;
  }

  /**
   * Evaluates if a test case can safely execute against the active environment
   */
  static evaluateExecution(title: string, tags: string[] = []): GuardrailCheckResult {
    const isProtected = this.isProtectedEnvironment();
    const isDestructive = this.isDestructiveTest(title, tags);
    const bypassToken = process.env.PROD_SAFETY_BYPASS;
    const isBypassAuthorized = bypassToken === this.BYPASS_SECRET;

    if (!isProtected) {
      return {
        allowed: true,
        isProtected: false,
        isDestructive,
        auditMessage: `[GUARDRAIL PASSED] Non-production environment (${config.activeEnvironmentId}). Full execution permitted.`,
      };
    }

    // Protected environment handling
    if (isDestructive && !isBypassAuthorized) {
      const reason = `CRITICAL: Blocked destructive execution against protected environment (${config.activeEnvironmentId}). Bypass token missing or invalid.`;
      this.recordAuditLog(title, 'BLOCKED', reason);
      return {
        allowed: false,
        isProtected: true,
        isDestructive: true,
        reason,
        auditMessage: reason,
      };
    }

    if (isDestructive && isBypassAuthorized) {
      const auditMsg = `[GUARDRAIL OVERRIDE] Destructive test authorized via manual bypass token on protected env (${config.activeEnvironmentId}).`;
      this.recordAuditLog(title, 'AUTHORIZED_OVERRIDE', auditMsg);
      return {
        allowed: true,
        isProtected: true,
        isDestructive: true,
        auditMessage: auditMsg,
      };
    }

    // Read-only tests on PROD are allowed
    return {
      allowed: true,
      isProtected: true,
      isDestructive: false,
      auditMessage: `[GUARDRAIL ALLOWED] Read-only / verification test permitted on protected env (${config.activeEnvironmentId}).`,
    };
  }

  /**
   * Records audit entries to audit-trail.json for corporate compliance
   */
  private static recordAuditLog(testTitle: string, status: 'BLOCKED' | 'AUTHORIZED_OVERRIDE' | 'ALLOWED', reason: string): void {
    try {
      const auditDir = path.resolve('reports/artifacts');
      if (!fs.existsSync(auditDir)) {
        fs.mkdirSync(auditDir, { recursive: true });
      }
      const logPath = path.join(auditDir, 'guardrail-audit.json');
      let records: any[] = [];
      if (fs.existsSync(logPath)) {
        try {
          records = JSON.parse(fs.readFileSync(logPath, 'utf8'));
        } catch {
          records = [];
        }
      }
      records.push({
        timestamp: new Date().toISOString(),
        environment: config.activeEnvironmentId,
        testTitle,
        status,
        reason,
      });
      // Keep last 200 records
      if (records.length > 200) {
        records = records.slice(-200);
      }
      fs.writeFileSync(logPath, JSON.stringify(records, null, 2), 'utf8');
    } catch (err: any) {
      Logger.warn(`[ProdGuardrail] Audit log write failed: ${err.message}`);
    }
  }
}
