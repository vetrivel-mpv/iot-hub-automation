export class Logger {
  private static format(level: string, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
  }

  static info(message: string): void {
    console.log(`\x1b[36m${this.format('INFO', message)}\x1b[0m`);
  }

  static success(message: string): void {
    console.log(`\x1b[32m${this.format('SUCCESS', message)}\x1b[0m`);
  }

  static warn(message: string): void {
    console.warn(`\x1b[33m${this.format('WARN', message)}\x1b[0m`);
  }

  static error(message: string, error?: unknown): void {
    console.error(`\x1b[31m${this.format('ERROR', message)}\x1b[0m`);
    if (error) {
      console.error(error);
    }
  }

  static step(stepNumber: number, description: string): void {
    console.log(`\x1b[35m[STEP ${stepNumber}] ${description}\x1b[0m`);
  }
}
