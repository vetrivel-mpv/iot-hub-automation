import { test, expect } from '../../src/fixtures/baseTest';
import { ContractDriftSniffer } from '../../src/utils/contractDriftSniffer';
import { Logger } from '../../src/utils/logger';

test.describe('IoT Hub Portal - 19: In-Flight API Contract Drift Sniffer Suite (Option C)', { tag: ['@contract', '@drift', '@api'] }, () => {
  test.describe.configure({ mode: 'serial' });

  test('[TC_DRIFT_001] Verify Detection of Missing Mandatory Fields in API Response', async ({ page, contractSniffer }) => {
    await test.step('Step 1: Route mock API returning payload missing mandatory "languages" key', async () => {
      Logger.step(1, 'Routing /api/v1/users/available-languages with missing required field');
      await page.setContent('<base href="https://wdh-ekbbe2e2bbe4addc.a02.azurefd.net/"><div>Testing Drift</div>');
      await page.route('**/api/v1/users/available-languages', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            // Missing 'languages'
            default: 'en-US',
            unannouncedField: true,
          }),
        });
      });
    });

    await test.step('Step 2: Trigger network call and assert drift recording', async () => {
      Logger.step(2, 'Triggering fetch request from page context');
      await page.evaluate(async () => {
        await fetch('/api/v1/users/available-languages');
      });

      // Small delay for response listener to process
      await page.waitForTimeout(300);

      const stats = ContractDriftSniffer.getStats();
      expect(stats.driftCount).toBeGreaterThanOrEqual(1);

      const missingFieldDrift = stats.recentDrifts.find(d => d.driftType === 'MISSING_FIELD');
      expect(missingFieldDrift).toBeDefined();
      expect(missingFieldDrift?.field).toBe('languages');
      expect(missingFieldDrift?.severity).toBe('CRITICAL');

      Logger.info(`Successfully detected contract violation: ${missingFieldDrift?.message}`);
    });
  });

  test('[TC_DRIFT_002] Verify Detection of Type Mutation & Undocumented Extra Fields', async ({ page }) => {
    await test.step('Step 1: Route mock API returning type mutation (number instead of string) and extra field', async () => {
      Logger.step(1, 'Routing /api/v1/users/available-languages with type mismatch');
      await page.setContent('<base href="https://wdh-ekbbe2e2bbe4addc.a02.azurefd.net/"><div>Testing Drift</div>');
      await page.route('**/api/v1/users/available-languages', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            languages: ['en', 'es', 'fr'],
            default: 12345, // Expected string, received number!
            betaFeatureFlag: 'enabled', // Undocumented field
          }),
        });
      });
    });

    await test.step('Step 2: Trigger request and verify type mismatch & forward drift detection', async () => {
      Logger.step(2, 'Triggering API call');
      await page.evaluate(async () => {
        await fetch('/api/v1/users/available-languages');
      });

      await page.waitForTimeout(300);

      const stats = ContractDriftSniffer.getStats();
      const typeMismatch = stats.recentDrifts.find(d => d.driftType === 'TYPE_MISMATCH');
      const extraField = stats.recentDrifts.find(d => d.driftType === 'EXTRA_UNDOCUMENTED_FIELD');

      expect(typeMismatch).toBeDefined();
      expect(typeMismatch?.expectedType).toBe('string');
      expect(typeMismatch?.actualType).toBe('number');

      expect(extraField).toBeDefined();
      expect(extraField?.field).toBe('betaFeatureFlag');

      Logger.info(`Drift detection verified: Type mismatch flagged (${typeMismatch?.message}) and undocumented field captured (${extraField?.message})`);
    });
  });
});
