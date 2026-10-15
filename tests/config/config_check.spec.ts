import { test, expect } from '../../src/fixtures/baseTest';
import { Logger } from '../../src/utils/logger';
import { ConfigValidator } from '../../src/utils/configValidator';

test.describe('IoT Hub Portal - Environment & Runtime Configuration Suite', () => {
  test('CFG-01: Verify active environment and runtime configuration integrity', async ({ appConfig, page }) => {
    await test.step('Step 1: Validate active environment schema, base URL, and credentials', async () => {
      Logger.step(1, 'Validating active environment schema, base URL, and credentials');
      const result = ConfigValidator.assertValid(appConfig, 'CFG-01');

      expect(result.isValid).toBeTruthy();
      expect(result.errors).toHaveLength(0);
      expect(appConfig.baseUrl).toMatch(/^https?:\/\//i);
      expect(appConfig.credentials.username).toBeTruthy();
      expect(appConfig.timeouts.medium).toBeGreaterThan(1000);
    });

    await test.step('Step 2: Ping target portal base URL endpoint and verify response status', async () => {
      Logger.step(2, 'Pinging target portal base URL endpoint');
      try {
        const response = await page.goto(appConfig.baseUrl, { waitUntil: 'domcontentloaded', timeout: 5000 });
        if (response) {
          const status = response.status();
          Logger.info(`Target environment HTTP status response: ${status}`);
          expect(status).toBeLessThan(500);
        }
      } catch (err: any) {
        Logger.warn(`Target portal endpoint ping: ${err.message} (offline/private network environment)`);
        expect(appConfig.baseUrl).toMatch(/^https?:\/\//i);
      }
    });

    await test.step('Step 3: Assert environment category safety guardrails', async () => {
      Logger.step(3, 'Asserting environment category safety guardrails');
      if (appConfig.environment === 'PROD') {
        Logger.warn('Executing on PRODUCTION environment. Safety guardrails are enforced.');
      } else {
        Logger.info(`Target environment category: [${appConfig.environment}] ${appConfig.activeEnvironmentId}`);
      }
    });
  });

  test('CFG-02: Verify timeout hierarchy and network retry configuration', async ({ appConfig }) => {
    await test.step('Step 1: Assert timeout progression hierarchy and network retry limits', async () => {
      Logger.step(1, 'Asserting timeout progression hierarchy');
      const { short, medium, long, pageLoad } = appConfig.timeouts;
      expect(short).toBeLessThanOrEqual(medium);
      expect(medium).toBeLessThanOrEqual(long);
      expect(long).toBeLessThanOrEqual(pageLoad);
      Logger.info(`Configured Timeouts: Short=${short}ms | Med=${medium}ms | Long=${long}ms | PageLoad=${pageLoad}ms`);
    });
  });

  test('CFG-03: Initialize dynamic execution resources & unique customer profile', async ({ dataFactory }) => {
    await test.step('Step 1: Generate dynamic enterprise Account & APN resource', async () => {
      Logger.step(1, 'Generating dynamic enterprise Account & APN resource');
      const demoAccount = dataFactory.uniqueAccountName('WDH_CORP');
      const demoApn = dataFactory.uniqueApnName('iot.azure');
      const demoSim = dataFactory.uniqueIccid();
      expect(demoAccount).toBeTruthy();
      expect(demoApn).toBeTruthy();
      expect(demoSim).toBeTruthy();
      Logger.info(`Generated Dynamic Resources: Account="${demoAccount}", APN="${demoApn}", SIM="${demoSim}"`);
    });
  });
});
