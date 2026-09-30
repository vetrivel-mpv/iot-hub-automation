import { Page, Locator } from '@playwright/test';
import { Logger } from './logger';

export interface ResilientSelectorOptions {
  timeout?: number;
  description?: string;
}

/**
 * Enterprise Resilient Selector & Self-Healing Engine
 * Automatically attempts multi-tier locator fallbacks (data-testid, aria-role/label, text, css)
 * and logs selector health and healing events to the console and metrics.
 */
export class ResilientLocator {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Resolves a locator using priority order fallback candidates
   * @param candidates Array of selector candidates ordered by specificity/resilience
   * @param options Configuration options
   */
  async find(candidates: string[], options: ResilientSelectorOptions = {}): Promise<Locator> {
    const timeout = options.timeout ?? 5000;
    const desc = options.description ? `[${options.description}] ` : '';

    for (let i = 0; i < candidates.length; i++) {
      const selector = candidates[i];
      try {
        const locator = this.page.locator(selector).first();
        const isVisible = await locator.isVisible({ timeout: Math.min(timeout, 2000) });
        if (isVisible) {
          if (i > 0) {
            Logger.warn(
              `⚡ [SELF-HEALING] ${desc}Primary selector failed. Auto-healed using fallback candidate #${i + 1}: "${selector}"`
            );
          }
          return locator;
        }
      } catch {
        // Continue trying next candidate
      }
    }

    // Default to the first candidate for clear Playwright error traces
    return this.page.locator(candidates[0]).first();
  }

  /**
   * Clicks an element with automatic self-healing fallback retry
   */
  async safeClick(candidates: string[], options: ResilientSelectorOptions = {}): Promise<void> {
    const locator = await this.find(candidates, options);
    await locator.waitFor({ state: 'visible', timeout: options.timeout ?? 8000 });
    await locator.click();
  }

  /**
   * Types or fills input text with automatic self-healing fallback retry
   */
  async safeFill(candidates: string[], value: string, options: ResilientSelectorOptions = {}): Promise<void> {
    const locator = await this.find(candidates, options);
    await locator.waitFor({ state: 'visible', timeout: options.timeout ?? 8000 });
    await locator.fill(value);
  }
}
