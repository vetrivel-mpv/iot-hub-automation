export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'SILENT';

export interface LogContext {
  workerIndex?: number;
  testId?: string;
  testTitle?: string;
  runId?: string;
}

export class Logger {
  private static context: LogContext = {};

  private static getLogLevelPriority(level: LogLevel): number {
    switch (level) {
      case 'DEBUG': return 0;
      case 'INFO': return 1;
      case 'WARN': return 2;
      case 'ERROR': return 3;
      case 'SILENT': return 4;
      default: return 1;
    }
  }

  private static currentLogLevel(): LogLevel {
    const envLevel = (process.env.LOG_LEVEL || 'INFO').toUpperCase() as LogLevel;
    return ['DEBUG', 'INFO', 'WARN', 'ERROR', 'SILENT'].includes(envLevel) ? envLevel : 'INFO';
  }

  private static shouldLog(level: LogLevel): boolean {
    return this.getLogLevelPriority(level) >= this.getLogLevelPriority(this.currentLogLevel());
  }

  public static setContext(context: LogContext): void {
    this.context = { ...this.context, ...context };
  }

  public static getContext(): LogContext {
    return { ...this.context };
  }

  public static clearContext(): void {
    this.context = {};
  }

  private static format(level: string, message: string): string {
    const timestamp = new Date().toISOString();
    const parts: string[] = [`[${timestamp}]`];

    if (this.context.workerIndex !== undefined) {
      parts.push(`[W#${this.context.workerIndex}]`);
    }
    if (this.context.testId) {
      parts.push(`[${this.context.testId}]`);
    }
    parts.push(`[${level.toUpperCase()}]`);
    parts.push(message);

    return parts.join(' ');
  }

  static debug(message: string, ...args: any[]): void {
    if (!this.shouldLog('DEBUG')) return;
    const formatted = this.format('DEBUG', message);
    if (args.length > 0) {
      console.log(`\x1b[90m${formatted}\x1b[0m`, ...args);
    } else {
      console.log(`\x1b[90m${formatted}\x1b[0m`);
    }
  }

  static info(message: string): void {
    if (!this.shouldLog('INFO')) return;
    console.log(`\x1b[36m${this.format('INFO', message)}\x1b[0m`);
  }

  static success(message: string): void {
    if (!this.shouldLog('INFO')) return;
    console.log(`\x1b[32m${this.format('SUCCESS', message)}\x1b[0m`);
  }

  static warn(message: string): void {
    if (!this.shouldLog('WARN')) return;
    console.warn(`\x1b[33m${this.format('WARN', message)}\x1b[0m`);
  }

  static error(message: string, error?: unknown): void {
    if (!this.shouldLog('ERROR')) return;
    console.error(`\x1b[31m${this.format('ERROR', message)}\x1b[0m`);
    if (error) {
      console.error(error);
    }
  }

  static step(stepNumber: number, description: string): void {
    if (!this.shouldLog('INFO')) return;
    const timestamp = new Date().toISOString();
    const ctx: string[] = [];
    if (this.context.workerIndex !== undefined) ctx.push(`[W#${this.context.workerIndex}]`);
    if (this.context.testId) ctx.push(`[${this.context.testId}]`);
    const prefix = ctx.length > 0 ? ` ${ctx.join(' ')}` : '';
    console.log(`\x1b[35m[${timestamp}]${prefix} [STEP ${stepNumber}] ${description}\x1b[0m`);
  }

  static action(actionName: string, target?: string): void {
    if (!this.shouldLog('INFO')) return;
    const targetStr = target ? ` -> ${target}` : '';
    console.log(`\x1b[34m${this.format('ACTION', `${actionName}${targetStr}`)}\x1b[0m`);
  }

  static assert(description: string, passed: boolean = true, details?: string): void {
    if (!this.shouldLog('INFO')) return;
    const status = passed ? 'PASS' : 'FAIL';
    const color = passed ? '\x1b[32m' : '\x1b[31m';
    const detailStr = details ? ` (${details})` : '';
    console.log(`${color}${this.format(`ASSERT: ${status}`, `${description}${detailStr}`)}\x1b[0m`);
  }

  static data(label: string, data: any): void {
    if (!this.shouldLog('INFO')) return;
    const val = typeof data === 'object' ? JSON.stringify(data) : String(data);
    console.log(`\x1b[33m${this.format('DATA', `${label}: ${val}`)}\x1b[0m`);
  }

  static network(method: string, url: string, status?: number, durationMs?: number): void {
    if (!this.shouldLog('DEBUG') && (!status || status < 400)) return;
    const statusStr = status ? `[HTTP ${status}]` : '[HTTP]';
    const durStr = durationMs !== undefined ? ` (${durationMs}ms)` : '';
    const color = (status && status >= 400) ? '\x1b[31m' : '\x1b[32m';
    console.log(`${color}${this.format('NETWORK', `${statusStr} ${method.toUpperCase()} ${url}${durStr}`)}\x1b[0m`);
  }

  static diagnostic(title: string, details?: any): void {
    if (!this.shouldLog('INFO')) return;
    const detailStr = details ? (typeof details === 'object' ? JSON.stringify(details, null, 2) : String(details)) : '';
    console.log(`\x1b[35m${this.format('DIAGNOSTIC', `${title}${detailStr ? ' ' + detailStr : ''}`)}\x1b[0m`);
  }
}
