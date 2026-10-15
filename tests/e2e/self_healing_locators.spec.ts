import { test, expect } from '../../src/fixtures/baseTest';
import { ResilientLocator } from '../../src/utils/resilientLocator';
import { Logger } from '../../src/utils/logger';
import * as fs from 'fs';

test.describe('IoT Hub Portal - 18: Self-Healing Locators & Resilient POM Suite (Option B)', { tag: ['@selfhealing', '@resilient', '@pom'] }, () => {
  test.describe.configure({ mode: 'serial' });

  test('[TC_SH_001] Verify Multi-Tier Candidate Fallback Self-Healing on Refactored DOM', async ({ page, resilient }) => {
    await test.step('Step 1: Mount HTML with changed button ID and attributes', async () => {
      Logger.step(1, 'Mounting mock DOM simulating an unexpected frontend button refactor');
      await page.setContent(`
        <div id="portal-root">
          <nav>
            <!-- Original button had id="create-account-old-v1", refactored to data-testid -->
            <button data-testid="create-account-btn" class="btn btn-primary" aria-label="Create New Enterprise Account">
              Create Account
            </button>
          </nav>
        </div>
      `);
    });

    await test.step('Step 2: Lookup element using intentionally broken primary selector', async () => {
      Logger.step(2, 'Calling resilient.find with broken primary selector and working fallback');
      const locator = await resilient.find([
        '#create-account-old-v1', // Broken legacy selector
        'button.legacy-broken-class', // Broken secondary selector
        '[data-testid="create-account-btn"]', // Working modern selector
        'button:has-text("Create Account")', // Semantic fallback
      ], {
        description: 'Create Account Modal Trigger',
        timeout: 2000,
      });

      await expect(locator).toBeVisible();
      await expect(locator).toHaveText('Create Account');

      // Verify healing telemetry was persisted
      const stats = ResilientLocator.getStats();
      expect(stats.healedCount).toBeGreaterThanOrEqual(1);

      const match = stats.recentHeals.find(h => h.originalSelector === '#create-account-old-v1');
      expect(match).toBeDefined();
      expect(match?.healedSelector).toBe('[data-testid="create-account-btn"]');
      expect(match?.healingStrategy).toBe('CANDIDATE_FALLBACK');
      expect(match?.confidenceScore).toBeGreaterThanOrEqual(0.7);

      Logger.info(`Successfully self-healed selector: "${match?.originalSelector}" -> "${match?.healedSelector}" (Confidence: ${Math.round((match?.confidenceScore || 0) * 100)}%)`);
    });
  });

  test('[TC_SH_002] Verify Dynamic Fuzzy Heuristic Inference when ALL Explicit Selectors Fail', async ({ page, resilient }) => {
    await test.step('Step 1: Mount HTML with dynamic generated IDs', async () => {
      Logger.step(1, 'Mounting mock DOM with randomized dynamic IDs');
      await page.setContent(`
        <div class="account-details-view">
          <input type="text" id="random_id_99214" name="subscriber_search_query" placeholder="Search by ICCID, IMSI or Account Name..." />
          <button id="random_btn_3389" aria-label="Execute Subscriber Search">Search Fleet</button>
        </div>
      `);
    });

    await test.step('Step 2: Locate search button purely via heuristic intent inference', async () => {
      Logger.step(2, 'Executing fuzzy heuristic recovery for button');
      const locator = await resilient.find([
        '#btn-search-static-legacy', // Missing legacy
        '.non-existent-button-class', // Missing legacy
      ], {
        description: 'Execute Subscriber Search',
        expectedText: 'Search Fleet',
        allowFuzzyHeal: true,
        timeout: 2000,
      });

      await expect(locator).toBeVisible();
      await locator.click();

      const stats = ResilientLocator.getStats();
      const fuzzyHeal = stats.recentHeals.find(h => h.healingStrategy === 'FUZZY_TEXT_HEURISTIC');
      expect(fuzzyHeal).toBeDefined();
      Logger.info(`Fuzzy heuristic auto-inferred selector: "${fuzzyHeal?.healedSelector}"`);
    });
  });

  test('[TC_SH_003] Verify Learned Selector Registry & Instant Zero-Delay Recovery', async ({ page, resilient }) => {
    await test.step('Step 1: Mount HTML and evaluate instant learned patch retrieval', async () => {
      Logger.step(1, 'Verifying instant cached patch execution without waiting for timeout');
      await page.setContent(`
        <div class="portal-actions">
          <button data-testid="create-account-btn">Create Account</button>
        </div>
      `);

      // Repeat lookup for the same broken selector '#create-account-old-v1' learned in TC_SH_001
      const start = Date.now();
      const locator = await resilient.find([
        '#create-account-old-v1',
        '[data-testid="create-account-btn"]'
      ], { description: 'Cached Learned Resolution Test' });

      const duration = Date.now() - start;
      await expect(locator).toBeVisible();
      // Should resolve almost instantaneously from learned registry
      expect(duration).toBeLessThan(1000);
      Logger.info(`Learned cache resolved in ${duration}ms without timeout wait.`);
    });
  });
});
