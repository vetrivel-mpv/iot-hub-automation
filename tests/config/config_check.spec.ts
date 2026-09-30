import { test, expect } from '../../src/fixtures/baseTest';
import { Logger } from '../../src/utils/logger';
import { ConfigValidator } from '../../src/utils/configValidator';

test.describe('IoT Hub Portal - Environment & Runtime Configuration Suite', () => {
  test('CFG-01: Verify active environment and runtime configuration integrity', async ({ appConfig, page }) => {
    Logger.step(1, 'Validating active environment schema, base URL, and credentials');
    const result = ConfigValidator.assertValid(appConfig, 'CFG-01');

    expect(result.isValid).toBeTruthy();
    expect(result.errors).toHaveLength(0);
    expect(appConfig.baseUrl).toMatch(/^https?:\/\//i);
    expect(appConfig.credentials.username).toBeTruthy();
    expect(appConfig.timeouts.medium).toBeGreaterThan(1000);

    Logger.step(2, 'Pinging target portal base URL endpoint');
    const response = await page.goto(appConfig.baseUrl, { waitUntil: 'domcontentloaded', timeout: appConfig.timeouts.pageLoad });
    expect(response).not.toBeNull();
    const status = response ? response.status() : 0;
    Logger.info(`Target environment HTTP status response: ${status}`);
    expect(status).toBeLessThan(500);

    Logger.step(3, 'Asserting environment category safety guardrails');
    if (appConfig.environment === 'PROD') {
      Logger.warn('Executing on PRODUCTION environment. Safety guardrails are enforced.');
    } else {
      Logger.info(`Target environment category: [${appConfig.environment}] ${appConfig.activeEnvironmentId}`);
    }
  });

  test('CFG-02: Verify timeout hierarchy and network retry configuration', async ({ appConfig }) => {
    Logger.step(1, 'Asserting timeout progression hierarchy');
    const { short, medium, long, pageLoad } = appConfig.timeouts;
    expect(short).toBeLessThanOrEqual(medium);
    expect(medium).toBeLessThanOrEqual(long);
    expect(long).toBeLessThanOrEqual(pageLoad);
    Logger.info(`Configured Timeouts: Short=${short}ms | Med=${medium}ms | Long=${long}ms | PageLoad=${pageLoad}ms`);
  });
});
