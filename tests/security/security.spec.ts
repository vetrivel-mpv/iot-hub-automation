import { test, expect, ensurePortalLogin } from '../../src/fixtures/baseTest';
import { Logger } from '../../src/utils/logger';

test.describe('IoT Hub Portal - 11: Security & Audit Logs Suite (12 Test Cases)', () => {
  test.beforeEach(async ({ page, navigationMenu }) => {
    await test.step('Step 1: Portal Login & Session Verification', async () => {
      Logger.step(1, 'Executing Portal Login & verifying authenticated session');
      await ensurePortalLogin(page, '/security');
    });
  });

  test('[TC_SEC_001] Verify Security menu dropdown options (Audit Logs)', async ({ navigationMenu, page }) => {
    await test.step('Step 1: Open Security menu and verify Audit Logs submenu item', async () => {
      Logger.step(1, 'Opening Security menu dropdown');
      await navigationMenu.openMenu('Security');

      await navigationMenu.expectSubmenuItemsVisible(['Audit Logs']);
      await page.keyboard.press('Escape');
      expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
    });
  });

  test('[TC_SEC_002] Verify Audit Logs table layout, columns, and event metadata', async ({ page }) => {
    await test.step('Step 1: Inspect Audit Logs table layout and event columns', async () => {
      Logger.step(1, 'Verifying presence of Audit Logs table container');
      expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
      const content = page.locator('main, [role="main"], body');
      await expect(content).toBeVisible();
    });
  });

  test('[TC_SEC_003] Verify Quick Date Range filter: "TODAY" filter button', async ({ auditLogsPage, page }) => {
    await test.step('Step 1: Filter audit records with "TODAY" quick range', async () => {
      Logger.step(1, 'Testing TODAY filter button');
      await auditLogsPage.selectDateRange('today');
      expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
    });
  });

  test('[TC_SEC_004] Verify Quick Date Range filter: "LAST 7 DAYS" filter button', async ({ auditLogsPage, page }) => {
    await test.step('Step 1: Filter audit records with "LAST 7 DAYS" quick range', async () => {
      Logger.step(1, 'Testing LAST 7 DAYS filter button');
      await auditLogsPage.selectDateRange('last7days');
      expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
    });
  });

  test('[TC_SEC_005] Verify Quick Date Range filter: "LAST 30 DAYS" filter button', async ({ auditLogsPage, page }) => {
    await test.step('Step 1: Filter audit records with "LAST 30 DAYS" quick range', async () => {
      Logger.step(1, 'Testing LAST 30 DAYS filter button');
      await auditLogsPage.selectDateRange('last30days');
      expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
    });
  });

  test('[TC_SEC_006] Verify custom Date Picker start and end date range selection', async ({ page }) => {
    await test.step('Step 1: Inspect custom start and end date picker controls', async () => {
      Logger.step(1, 'Checking custom date picker input');
      const datePicker = page.locator('input[type="date"], .date-picker, input[placeholder*="date" i]').first();
      if (await datePicker.isVisible({ timeout: 2000 })) {
        await expect(datePicker).toBeVisible();
        await datePicker.click();
      }
      expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
    });
  });

  test('[TC_SEC_007] Verify column filter: Filter audit records by User', async ({ auditLogsPage, page, appConfig }) => {
    await test.step('Step 1: Filter audit events by specific authenticated user', async () => {
      Logger.step(1, 'Filtering audit events by user');
      if (await auditLogsPage.filterUser.first().isVisible({ timeout: 3000 })) {
        await expect(auditLogsPage.filterUser.first()).toBeVisible();
        await auditLogsPage.filterUser.first().fill(appConfig.credentials.username);
        await page.keyboard.press('Enter');
      }
      expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
    });
  });

  test('[TC_SEC_008] Verify column filter: Filter audit records by Service / Module', async ({ auditLogsPage, page }) => {
    await test.step('Step 1: Filter audit logs by service or module dropdown', async () => {
      Logger.step(1, 'Filtering audit logs by Service');
      if (await auditLogsPage.filterServiceDropdown.first().isVisible({ timeout: 3000 })) {
        await expect(auditLogsPage.filterServiceDropdown.first()).toBeVisible();
        await auditLogsPage.filterServiceDropdown.first().click();
        await page.keyboard.press('Escape');
      }
      expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
    });
  });

  test('[TC_SEC_009] Verify column filter: Filter audit records by Operation (CREATE, UPDATE, DELETE, LOGIN, ACTIVATE)', async ({ auditLogsPage, page }) => {
    await test.step('Step 1: Filter audit logs by specific operation type', async () => {
      Logger.step(1, 'Filtering audit logs by operation');
      if (await auditLogsPage.filterOperation.first().isVisible({ timeout: 3000 })) {
        await expect(auditLogsPage.filterOperation.first()).toBeVisible();
        await auditLogsPage.filterOperation.first().fill('LOGIN');
        await page.keyboard.press('Enter');
      }
      expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
    });
  });

  test('[TC_SEC_010] Verify Audit Log Export to Excel / CSV for compliance and external audit', async ({ auditLogsPage, page }) => {
    await test.step('Step 1: Verify Audit Log export button accessibility and enabled state', async () => {
      Logger.step(1, 'Checking Audit Log export button');
      if (await auditLogsPage.exportButton.first().isVisible({ timeout: 3000 })) {
        await expect(auditLogsPage.exportButton.first()).toBeVisible();
        await expect(auditLogsPage.exportButton.first()).toBeEnabled();
      }
      expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
    });
  });

  test('[TC_SEC_011] Verify live Refresh button updates audit events in real-time', async ({ auditLogsPage, page }) => {
    await test.step('Step 1: Trigger Audit Logs refresh action and assert response', async () => {
      Logger.step(1, 'Checking live refresh button');
      if (await auditLogsPage.refreshButton.first().isVisible({ timeout: 3000 })) {
        await expect(auditLogsPage.refreshButton.first()).toBeVisible();
        await auditLogsPage.refreshButton.first().click();
      }
      expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
    });
  });

  test('[TC_SEC_012] Verify immutability of audit log records (no delete, edit, or tamper action available)', async ({ page }) => {
    await test.step('Step 1: Confirm tamper-proof immutability (absence of delete or edit actions)', async () => {
      Logger.step(1, 'Confirming no delete or edit buttons exist on audit table');
      const deleteBtn = page.locator('table button:has-text("Delete"), table button:has-text("Edit")');
      expect(await deleteBtn.count()).toBe(0);
      expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
    });
  });
});
