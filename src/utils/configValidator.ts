import { Logger } from './logger';
import { config, EnvironmentDefinition } from '../config/environment';

export interface ConfigValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  configSummary: {
    activeEnvironmentId: string;
    environment: string;
    baseUrl: string;
    username: string;
    isProtected: boolean;
    timeouts: {
      short: number;
      medium: number;
      long: number;
      pageLoad: number;
    };
  };
}

export class ConfigValidator {
  /**
   * Validates the configuration and returns validation details
   */
  static validate(cfg = config): ConfigValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 1. Validate Base URL
    if (!cfg.baseUrl) {
      errors.push('Base URL (WDH_BASE_URL) is missing or empty.');
    } else {
      try {
        const parsed = new URL(cfg.baseUrl);
        if (!['http:', 'https:'].includes(parsed.protocol)) {
          errors.push(`Invalid URL protocol: "${parsed.protocol}". Expected "http:" or "https:".`);
        }
        if (!parsed.hostname.includes('.')) {
          warnings.push(`Base URL hostname "${parsed.hostname}" may not be a fully qualified domain.`);
        }
      } catch {
        errors.push(`Base URL "${cfg.baseUrl}" is not a valid URL format.`);
      }
    }

    // 2. Validate Credentials
    if (!cfg.credentials?.username) {
      errors.push('Authentication username (WDH_USERNAME) is not configured.');
    } else if (cfg.credentials.username.includes('testuser@') || cfg.credentials.username === 'changeme') {
      warnings.push('Using default placeholder username. Live authenticated tests may fail or be skipped.');
    }

    if (!cfg.credentials?.password) {
      warnings.push('Password is not provided. Authenticated modules will fail if authentication is required.');
    }

    // 3. Validate Timeouts
    if (!cfg.timeouts) {
      warnings.push('Timeouts not configured, using fallback default thresholds.');
    } else {
      if (cfg.timeouts.short < 1000) errors.push('Short timeout cannot be less than 1000ms.');
      if (cfg.timeouts.medium < cfg.timeouts.short) errors.push('Medium timeout cannot be less than short timeout.');
      if (cfg.timeouts.long < cfg.timeouts.medium) errors.push('Long timeout cannot be less than medium timeout.');
    }

    const isProtected = cfg.environment === 'PROD';

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      configSummary: {
        activeEnvironmentId: cfg.activeEnvironmentId || 'unknown',
        environment: cfg.environment || 'SIT',
        baseUrl: cfg.baseUrl,
        username: cfg.credentials?.username || 'anonymous',
        isProtected,
        timeouts: cfg.timeouts || { short: 5000, medium: 15000, long: 30000, pageLoad: 45000 },
      },
    };
  }

  /**
   * Asserts valid configuration and logs summary before test execution
   */
  static assertValid(cfg = config, testTitle?: string): ConfigValidationResult {
    const result = this.validate(cfg);
    const titlePrefix = testTitle ? `[${testTitle}] ` : '';

    if (!result.isValid) {
      const errMsg = `${titlePrefix}Configuration check failed:\n- ${result.errors.join('\n- ')}`;
      Logger.error(errMsg);
      throw new Error(errMsg);
    }

    if (result.warnings.length > 0) {
      for (const warn of result.warnings) {
        Logger.warn(`${titlePrefix}Config Warning: ${warn}`);
      }
    }

    const isDebug = process.env.LOG_LEVEL === 'DEBUG';
    if (isDebug) {
      Logger.info(
        `${titlePrefix}[CONFIG: OK] Env: [${result.configSummary.environment}] ${result.configSummary.activeEnvironmentId} | URL: ${result.configSummary.baseUrl} | User: ${result.configSummary.username} | Timeout: ${result.configSummary.timeouts.medium}ms`
      );
    } else {
      Logger.info(
        `${titlePrefix}[CONFIG: OK] [${result.configSummary.environment}:${result.configSummary.activeEnvironmentId}]`
      );
    }

    return result;
  }
}
