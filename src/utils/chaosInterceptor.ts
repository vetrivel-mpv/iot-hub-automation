import { Page, Route } from '@playwright/test';
import { Logger } from './logger';

export interface ChaosOptions {
  delayMs?: number;
  status?: number;
  errorMessage?: string;
  urlPattern?: string | RegExp;
}

/**
 * Enterprise Resilience & Chaos Engineering Interceptor
 * Injects synthetic latency, gateway timeouts (500/502/504), network disconnects,
 * and malformed payloads to validate UI resilience, skeletons, and graceful degradation.
 */
export class ChaosInterceptor {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Simulates synthetic latency (Slow 3G / backend throttling) on matching endpoints
   */
  async injectLatency(urlPattern: string | RegExp = /api|rest|graphql/i, delayMs: number = 3000): Promise<void> {
    Logger.warn(`⚡ [CHAOS] Injecting ${delayMs}ms artificial latency on matching pattern: ${urlPattern}`);
    await this.page.route(urlPattern, async (route: Route) => {
      await new Promise(resolve => setTimeout(resolve, delayMs));
      await route.continue();
    });
  }

  /**
   * Simulates server outage / Gateway Failure (500 / 502 / 503 / 504)
   */
  async injectServerError(urlPattern: string | RegExp, status: number = 503, errorMessage: string = 'Service Temporarily Unavailable'): Promise<void> {
    Logger.warn(`⚡ [CHAOS] Injecting HTTP ${status} error on: ${urlPattern}`);
    await this.page.route(urlPattern, async (route: Route) => {
      await route.fulfill({
        status,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'ChaosInducedFailure',
          statusCode: status,
          message: errorMessage,
          timestamp: new Date().toISOString(),
        }),
      });
    });
  }

  /**
   * Simulates sudden client offline disconnect
   */
  async simulateOffline(): Promise<void> {
    Logger.warn('⚡ [CHAOS] Simulating client offline network mode');
    await this.page.context().setOffline(true);
  }

  /**
   * Restores client online network connectivity
   */
  async restoreOnline(): Promise<void> {
    Logger.info('[CHAOS] Restoring client network connectivity to online');
    await this.page.context().setOffline(false);
  }

  /**
   * Removes all active chaos routes and restores native network flow
   */
  async reset(): Promise<void> {
    await this.page.unrouteAll();
    await this.page.context().setOffline(false);
    Logger.info('[CHAOS] Reset all chaos interception routes');
  }
}
