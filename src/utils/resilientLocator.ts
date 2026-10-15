import { Page, Locator } from '@playwright/test';
import { Logger } from './logger';
import * as fs from 'fs';
import * as path from 'path';

export interface ResilientSelectorOptions {
  timeout?: number;
  description?: string;
  expectedText?: string;
  expectedTag?: string;
  allowFuzzyHeal?: boolean;
}

export interface HealedLocatorRecord {
  id: string;
  testTitle?: string;
  description: string;
  originalSelector: string;
  healedSelector: string;
  healingStrategy: 'CANDIDATE_FALLBACK' | 'FUZZY_TEXT_HEURISTIC' | 'ARIA_ROLE_INFERENCE' | 'ATTRIBUTE_SIMILARITY';
  confidenceScore: number; // 0.0 - 1.0
  timestamp: number;
  approved: boolean;
}

export interface SelfHealingStats {
  totalLookups: number;
  exactMatches: number;
  healedCount: number;
  recoveryRatePct: number;
  recentHeals: HealedLocatorRecord[];
  activePatchesCount: number;
}

/**
 * Enterprise Resilient Selector & Self-Healing Locator Engine (Option B)
 * Multi-attribute locator fallback with dynamic DOM heuristic inference,
 * fuzzy similarity scoring, and persistent healing ledger.
 */
export class ResilientLocator {
  private page: Page;
  private static healingLogPath = path.resolve('reports/self-healing/healing-log.json');
  private static cachedRegistryPath = path.resolve('reports/self-healing/healed-registry.json');
  private static inMemoryRegistry: Map<string, string> = new Map();
  private static lookupCounter = 0;
  private static exactMatchCounter = 0;

  constructor(page: Page) {
    this.page = page;
    ResilientLocator.ensureStorageDirs();
    ResilientLocator.loadRegistry();
  }

  private static ensureStorageDirs(): void {
    const dir = path.resolve('reports/self-healing');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  private static loadRegistry(): void {
    if (this.inMemoryRegistry.size > 0) return;
    try {
      if (fs.existsSync(this.cachedRegistryPath)) {
        const data = JSON.parse(fs.readFileSync(this.cachedRegistryPath, 'utf-8'));
        for (const [k, v] of Object.entries(data)) {
          this.inMemoryRegistry.set(k, v as string);
        }
      }
    } catch {
      // Ignore load error
    }
  }

  private static saveRegistry(): void {
    try {
      this.ensureStorageDirs();
      const obj: Record<string, string> = {};
      this.inMemoryRegistry.forEach((v, k) => (obj[k] = v));
      fs.writeFileSync(this.cachedRegistryPath, JSON.stringify(obj, null, 2), 'utf-8');
    } catch {
      // Ignore save error
    }
  }

  /**
   * Resolves a locator using priority order fallback candidates and fuzzy DOM heuristics
   */
  async find(candidates: string[], options: ResilientSelectorOptions = {}): Promise<Locator> {
    ResilientLocator.lookupCounter++;
    const timeout = options.timeout ?? 4000;
    const desc = options.description ? `[${options.description}] ` : '';
    const primarySelector = candidates[0];

    // 1. Check if we already have a learned/healed patch for this primary selector
    if (ResilientLocator.inMemoryRegistry.has(primarySelector)) {
      const cached = ResilientLocator.inMemoryRegistry.get(primarySelector)!;
      try {
        const cachedLocator = this.page.locator(cached).first();
        if (await cachedLocator.isVisible({ timeout: 1500 })) {
          Logger.info(`🔮 [SELF-HEALING CACHE] ${desc}Resolved instantly via learned patch: "${cached}"`);
          return cachedLocator;
        }
      } catch {
        // Cached patch outdated, proceed to evaluation
      }
    }

    // 2. Try explicit candidates in priority order
    for (let i = 0; i < candidates.length; i++) {
      const selector = candidates[i];
      try {
        const locator = this.page.locator(selector).first();
        const isVisible = await locator.isVisible({ timeout: Math.min(timeout, 1500) });
        if (isVisible) {
          if (i === 0) {
            ResilientLocator.exactMatchCounter++;
          } else {
            // Self-healed via secondary candidate
            Logger.warn(`⚡ [SELF-HEALING] ${desc}Primary selector failed. Auto-healed using candidate #${i + 1}: "${selector}"`);
            this.recordHealingEvent({
              description: options.description || 'Element Lookup',
              originalSelector: primarySelector,
              healedSelector: selector,
              healingStrategy: 'CANDIDATE_FALLBACK',
              confidenceScore: Math.max(0.75, 1 - i * 0.08),
            });
            ResilientLocator.inMemoryRegistry.set(primarySelector, selector);
            ResilientLocator.saveRegistry();
          }
          return locator;
        }
      } catch {
        // Continue
      }
    }

    // 3. Dynamic Heuristic DOM Inference (Fuzzy text / ARIA matching)
    if (options.allowFuzzyHeal !== false && (options.expectedText || options.description)) {
      const fuzzyTarget = options.expectedText || options.description || '';
      const heuristicSelector = await this.inferSelectorHeuristically(fuzzyTarget, options.expectedTag);
      if (heuristicSelector) {
        try {
          const heuristicLocator = this.page.locator(heuristicSelector).first();
          if (await heuristicLocator.isVisible({ timeout: 1500 })) {
            Logger.warn(`🔮 [SELF-HEALING INFERENCE] ${desc}Auto-inferred dynamic selector: "${heuristicSelector}"`);
            this.recordHealingEvent({
              description: options.description || 'Fuzzy Heuristic Healing',
              originalSelector: primarySelector,
              healedSelector: heuristicSelector,
              healingStrategy: 'FUZZY_TEXT_HEURISTIC',
              confidenceScore: 0.88,
            });
            ResilientLocator.inMemoryRegistry.set(primarySelector, heuristicSelector);
            ResilientLocator.saveRegistry();
            return heuristicLocator;
          }
        } catch {
          // Heuristic failed
        }
      }
    }

    // Fallback to primary candidate for standard Playwright error reporting
    return this.page.locator(primarySelector).first();
  }

  /**
   * Evaluates the DOM to find elements matching semantic intent
   */
  private async inferSelectorHeuristically(targetText: string, targetTag?: string): Promise<string | null> {
    try {
      const result = await this.page.evaluate(
        ({ text, tag }) => {
          const cleanText = text.toLowerCase().trim();
          const tagSelector = tag ? tag.toLowerCase() : 'button, a, input, select, [role="button"], span';
          const elements = Array.from(document.querySelectorAll(tagSelector));

          for (const el of elements) {
            const elText = (el.textContent || '').toLowerCase().trim();
            const ariaLabel = (el.getAttribute('aria-label') || '').toLowerCase();
            const placeholder = (el.getAttribute('placeholder') || '').toLowerCase();
            const title = (el.getAttribute('title') || '').toLowerCase();
            const testId = (el.getAttribute('data-testid') || '').toLowerCase();

            if (
              elText.includes(cleanText) ||
              ariaLabel.includes(cleanText) ||
              placeholder.includes(cleanText) ||
              title.includes(cleanText) ||
              testId.includes(cleanText)
            ) {
              if (el.id) return `#${el.id}`;
              if (el.getAttribute('data-testid')) return `[data-testid="${el.getAttribute('data-testid')}"]`;
              if (el.getAttribute('aria-label')) return `[aria-label="${el.getAttribute('aria-label')}"]`;
              if (el.getAttribute('name')) return `[name="${el.getAttribute('name')}"]`;
              const tagName = el.tagName.toLowerCase();
              return `${tagName}:has-text("${el.textContent?.trim().slice(0, 30)}")`;
            }
          }
          return null;
        },
        { text: targetText, tag: targetTag }
      );
      return result;
    } catch {
      return null;
    }
  }

  private recordHealingEvent(params: {
    description: string;
    originalSelector: string;
    healedSelector: string;
    healingStrategy: HealedLocatorRecord['healingStrategy'];
    confidenceScore: number;
    testTitle?: string;
  }): void {
    try {
      ResilientLocator.ensureStorageDirs();
      const records = ResilientLocator.getHealingHistory();
      const newRecord: HealedLocatorRecord = {
        id: `heal_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        testTitle: params.testTitle,
        description: params.description,
        originalSelector: params.originalSelector,
        healedSelector: params.healedSelector,
        healingStrategy: params.healingStrategy,
        confidenceScore: params.confidenceScore,
        timestamp: Date.now(),
        approved: false,
      };

      // Keep up to 200 recent records
      records.unshift(newRecord);
      if (records.length > 200) records.pop();
      fs.writeFileSync(ResilientLocator.healingLogPath, JSON.stringify(records, null, 2), 'utf-8');
    } catch {
      // Ignore write errors
    }
  }

  public static getHealingHistory(): HealedLocatorRecord[] {
    try {
      if (fs.existsSync(this.healingLogPath)) {
        return JSON.parse(fs.readFileSync(this.healingLogPath, 'utf-8'));
      }
    } catch {
      // Ignore read errors
    }
    return [];
  }

  public static getStats(): SelfHealingStats {
    const history = this.getHealingHistory();
    const healedCount = history.length;
    const total = Math.max(this.lookupCounter, healedCount + this.exactMatchCounter);
    const recoveryRate = total > 0 ? ((total - Math.max(0, total - this.exactMatchCounter - healedCount)) / total) * 100 : 100;

    return {
      totalLookups: total,
      exactMatches: this.exactMatchCounter,
      healedCount: healedCount,
      recoveryRatePct: parseFloat(recoveryRate.toFixed(1)),
      recentHeals: history.slice(0, 15),
      activePatchesCount: this.inMemoryRegistry.size,
    };
  }

  public static approvePatch(id: string): boolean {
    const history = this.getHealingHistory();
    const record = history.find((r) => r.id === id);
    if (record) {
      record.approved = true;
      fs.writeFileSync(this.healingLogPath, JSON.stringify(history, null, 2), 'utf-8');
      return true;
    }
    return false;
  }

  /**
   * Safe Click with automatic resilient self-healing
   */
  async safeClick(candidates: string[], options: ResilientSelectorOptions = {}): Promise<void> {
    const locator = await this.find(candidates, options);
    await locator.waitFor({ state: 'visible', timeout: options.timeout ?? 6000 });
    await locator.click();
  }

  /**
   * Safe Fill with automatic resilient self-healing
   */
  async safeFill(candidates: string[], value: string, options: ResilientSelectorOptions = {}): Promise<void> {
    const locator = await this.find(candidates, options);
    await locator.waitFor({ state: 'visible', timeout: options.timeout ?? 6000 });
    await locator.fill(value);
  }
}
