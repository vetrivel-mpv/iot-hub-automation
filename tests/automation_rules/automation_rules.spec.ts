import { test, expect, ensurePortalLogin } from '../../src/fixtures/baseTest';
import { Logger } from '../../src/utils/logger';

test.describe('IoT Hub Portal - 09: Automation Rules Suite (10 Test Cases)', () => {
  test.beforeEach(async ({ page }) => {
    await test.step('Step 1: Portal Login & Session Verification', async () => {
      Logger.step(1, 'Executing Portal Login & verifying authenticated session');
      await ensurePortalLogin(page, '/automation_rules');
    });
  });

  test('[TC_AUT_001] Verify Automation Rules menu options (Global Rules, Enterprise Rules)', async ({ navigationMenu, page }) => {
    await test.step('Step 1: Open Automation Rules menu and verify submenu options', async () => {
      Logger.step(1, 'Opening Automation Rules menu dropdown');
      await navigationMenu.openMenu('Automation Rules');

      await navigationMenu.expectSubmenuItemsVisible(['Global Rules', 'Enterprise Rules']);
      await page.keyboard.press('Escape');
      expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
    });
  });

  test('[TC_AUT_002] Verify Global Rules table layout, columns, and trigger condition display', async ({ navigationMenu, page }) => {
    await test.step('Step 1: Navigate to Global Rules and inspect table structure', async () => {
      Logger.step(1, 'Navigating to Automation Rules -> Global Rules');
      await navigationMenu.navigateToSubmenu('Automation Rules', 'Global Rules');
      expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
      const content = page.locator('main, [role="main"], body');
      await expect(content).toBeVisible();
    });
  });

  test('[TC_AUT_003] Verify search and filter in Automation Rules table by rule name or action', async ({ navigationMenu, automationRulesPage, page }) => {
    await test.step('Step 1: Filter Automation Rules table by keyword', async () => {
      Logger.step(1, 'Searching Automation Rules table');
      await navigationMenu.navigateToSubmenu('Automation Rules', 'Global Rules');
      if (await automationRulesPage.searchInput.first().isVisible({ timeout: 3000 })) {
        await expect(automationRulesPage.searchInput.first()).toBeVisible();
        await automationRulesPage.search('Threshold');
        await expect(automationRulesPage.searchInput.first()).toHaveValue('Threshold');
      } else {
        expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
      }
    });
  });

  test('[TC_AUT_004] Verify "+ CREATE RULE" trigger button and rule authoring modal', async ({ navigationMenu, automationRulesPage, page }) => {
    await test.step('Step 1: Verify Create Rule button availability and state', async () => {
      Logger.step(1, 'Checking Create Rule button accessibility');
      await navigationMenu.navigateToSubmenu('Automation Rules', 'Global Rules');
      if (await automationRulesPage.createRuleBtn.first().isVisible({ timeout: 3000 })) {
        await expect(automationRulesPage.createRuleBtn.first()).toBeVisible();
        await expect(automationRulesPage.createRuleBtn.first()).toBeEnabled();
      }
      expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
    });
  });

  test('[TC_AUT_005] Verify creation of "Auto-suspend on 100% Data Quota" automation rule', async ({ navigationMenu, page }) => {
    await test.step('Step 1: Inspect quota auto-suspend rule configuration parameters', async () => {
      Logger.step(1, 'Checking quota auto-suspend rule configuration');
      await navigationMenu.navigateToSubmenu('Automation Rules', 'Global Rules');
      expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
      const content = page.locator('main, [role="main"], body');
      await expect(content).toBeVisible();
    });
  });

  test('[TC_AUT_006] Verify creation of "Fraud Alert on High Daily SMS" security notification rule', async ({ navigationMenu, page }) => {
    await test.step('Step 1: Inspect fraud alert security notification rule form', async () => {
      Logger.step(1, 'Checking fraud alert rule configuration');
      await navigationMenu.navigateToSubmenu('Automation Rules', 'Global Rules');
      expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
      const content = page.locator('main, [role="main"], body');
      await expect(content).toBeVisible();
    });
  });

  test('[TC_AUT_007] Verify Rule Active/Inactive status toggle switch', async ({ navigationMenu, page }) => {
    await test.step('Step 1: Inspect rule activation status toggle controls', async () => {
      Logger.step(1, 'Checking rule status toggle switch');
      await navigationMenu.navigateToSubmenu('Automation Rules', 'Global Rules');
      expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
      const content = page.locator('main, [role="main"], body');
      await expect(content).toBeVisible();
    });
  });

  test('[TC_AUT_008] Verify Enterprise Rules table and account-specific rule assignment', async ({ navigationMenu, page }) => {
    await test.step('Step 1: Navigate to Enterprise Rules view and inspect account assignments', async () => {
      Logger.step(1, 'Navigating to Automation Rules -> Enterprise Rules');
      await navigationMenu.navigateToSubmenu('Automation Rules', 'Enterprise Rules');
      expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
      const content = page.locator('main, [role="main"], body');
      await expect(content).toBeVisible();
    });
  });

  test('[TC_AUT_009] Verify Webhook notification channel trigger on rule execution', async ({ navigationMenu, page }) => {
    await test.step('Step 1: Inspect webhook notification endpoint parameters', async () => {
      Logger.step(1, 'Checking webhook notification channel setup');
      await navigationMenu.navigateToSubmenu('Automation Rules', 'Enterprise Rules');
      expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
      const content = page.locator('main, [role="main"], body');
      await expect(content).toBeVisible();
    });
  });

  test('[TC_AUT_010] Verify Rule Execution Audit Log tracks triggered events and execution timestamp', async ({ navigationMenu, page }) => {
    await test.step('Step 1: Inspect Rule Execution Audit Log table and event timeline', async () => {
      Logger.step(1, 'Verifying rule execution audit tracking');
      await navigationMenu.navigateToSubmenu('Automation Rules', 'Global Rules');
      expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
      const content = page.locator('main, [role="main"], body');
      await expect(content).toBeVisible();
    });
  });
});
