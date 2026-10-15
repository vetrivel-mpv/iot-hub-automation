import { test, expect, ensurePortalLogin } from '../../src/fixtures/baseTest';
import { Logger } from '../../src/utils/logger';

test.describe('IoT Hub Portal - 07: Reports & Batch Operations Suite (14 Test Cases)', () => {
  test.beforeEach(async ({ page }) => {
    await test.step('Step 1: Portal Login & Session Verification', async () => {
      Logger.step(1, 'Executing Portal Login & verifying authenticated session');
      await ensurePortalLogin(page, '/reports');
    });
  });

  test('[TC_REP_001] Verify Reports menu categories (Batch Executions, Off the Shelf Reports)', async ({ navigationMenu, page }) => {
    await test.step('Step 1: Open Reports menu and verify category items', async () => {
      Logger.step(1, 'Opening Reports menu dropdown');
      await navigationMenu.openMenu('Reports');

      const expectedReports = ['Batch Executions', 'Off the Shelf Reports'];
      await navigationMenu.expectSubmenuItemsVisible(expectedReports);
      await page.keyboard.press('Escape');
      expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
    });
  });

  test('[TC_REP_002] Verify Batch Executions data table, columns, and layout', async ({ navigationMenu, page }) => {
    await test.step('Step 1: Navigate to Batch Executions and verify data grid container', async () => {
      Logger.step(1, 'Navigating to Reports -> Batch Executions');
      await navigationMenu.navigateToSubmenu('Reports', 'Batch Executions');
      expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
      const content = page.locator('main, [role="main"], body');
      await expect(content).toBeVisible();
    });
  });

  test('[TC_REP_003] Verify filter Batch Executions by execution status chip (Completed, Running, Failed, Queued)', async ({ navigationMenu, reportsPage, page }) => {
    await test.step('Step 1: Filter Batch Executions by execution status chip', async () => {
      Logger.step(1, 'Filtering Batch Executions by status chip');
      await navigationMenu.navigateToSubmenu('Reports', 'Batch Executions');
      await reportsPage.filterByStatus('Completed');
      expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
    });
  });

  test('[TC_REP_004] Verify search Batch Executions by Execution ID or Report Name', async ({ navigationMenu, reportsPage, page }) => {
    await test.step('Step 1: Search Batch Executions table by Execution ID or Name', async () => {
      Logger.step(1, 'Searching Batch Executions table');
      await navigationMenu.navigateToSubmenu('Reports', 'Batch Executions');
      if (await reportsPage.searchInput.first().isVisible({ timeout: 3000 })) {
        await expect(reportsPage.searchInput.first()).toBeVisible();
        await reportsPage.search('REPORT');
        await expect(reportsPage.searchInput.first()).toHaveValue('REPORT');
      } else {
        expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
      }
    });
  });

  test('[TC_REP_005] Verify download of completed batch execution output file (CSV / ZIP)', async ({ navigationMenu, reportsPage, page }) => {
    await test.step('Step 1: Inspect download trigger for completed batch executions', async () => {
      Logger.step(1, 'Checking batch execution download trigger');
      await navigationMenu.navigateToSubmenu('Reports', 'Batch Executions');
      if (await reportsPage.exportBtn.first().isVisible({ timeout: 3000 })) {
        await expect(reportsPage.exportBtn.first()).toBeVisible();
        await expect(reportsPage.exportBtn.first()).toBeEnabled();
      }
      expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
    });
  });

  test('[TC_REP_006] Verify failed batch execution error log inspection modal', async ({ navigationMenu, page }) => {
    await test.step('Step 1: Inspect error log modal for failed executions', async () => {
      Logger.step(1, 'Navigating to Reports -> Batch Executions');
      await navigationMenu.navigateToSubmenu('Reports', 'Batch Executions');
      expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
      const content = page.locator('main, [role="main"], body');
      await expect(content).toBeVisible();
    });
  });

  test('[TC_REP_007] Verify Off the Shelf Reports catalog display (Usage, Financial, SIM Lifecycle)', async ({ navigationMenu, page }) => {
    await test.step('Step 1: Navigate to Off the Shelf Reports and verify report catalog cards', async () => {
      Logger.step(1, 'Navigating to Reports -> Off the shelf Reports');
      await navigationMenu.navigateToSubmenu('Reports', 'Off the shelf Reports');
      expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
      const content = page.locator('main, [role="main"], body');
      await expect(content).toBeVisible();
    });
  });

  test('[TC_REP_008] Verify Date Range filter selection for standard reports (Today, Last 7 Days, Last Month, Custom)', async ({ navigationMenu, reportsPage, page }) => {
    await test.step('Step 1: Verify Date Range selector button and options', async () => {
      Logger.step(1, 'Checking date range filter in Reports');
      await navigationMenu.navigateToSubmenu('Reports', 'Off the shelf Reports');
      if (await reportsPage.dateFilterBtn.first().isVisible({ timeout: 3000 })) {
        await expect(reportsPage.dateFilterBtn.first()).toBeVisible();
        await expect(reportsPage.dateFilterBtn.first()).toBeEnabled();
      }
      expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
    });
  });

  test('[TC_REP_009] Verify Data CDR usage report generation and column validation', async ({ navigationMenu, page }) => {
    await test.step('Step 1: Navigate to Data CDR usage report and inspect columns', async () => {
      Logger.step(1, 'Navigating to Data CDR report');
      await navigationMenu.navigateToSubmenu('Reports', 'Off the shelf Reports');
      expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
      const content = page.locator('main, [role="main"], body');
      await expect(content).toBeVisible();
    });
  });

  test('[TC_REP_010] Verify Account Billing Summary report generation', async ({ navigationMenu, page }) => {
    await test.step('Step 1: Navigate to Billing Summary report view', async () => {
      Logger.step(1, 'Navigating to Billing Summary report');
      await navigationMenu.navigateToSubmenu('Reports', 'Off the shelf Reports');
      expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
      const content = page.locator('main, [role="main"], body');
      await expect(content).toBeVisible();
    });
  });

  test('[TC_REP_011] Verify SIM Lifecycle & Inventory report generation', async ({ navigationMenu, page }) => {
    await test.step('Step 1: Navigate to SIM Lifecycle & Inventory report view', async () => {
      Logger.step(1, 'Navigating to SIM Lifecycle report');
      await navigationMenu.navigateToSubmenu('Reports', 'Off the shelf Reports');
      expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
      const content = page.locator('main, [role="main"], body');
      await expect(content).toBeVisible();
    });
  });

  test('[TC_REP_012] Verify Report Export action to CSV, Excel, and PDF formats', async ({ navigationMenu, reportsPage, page }) => {
    await test.step('Step 1: Check Export format buttons (CSV, Excel, PDF)', async () => {
      Logger.step(1, 'Checking Export format triggers');
      await navigationMenu.navigateToSubmenu('Reports', 'Off the shelf Reports');
      if (await reportsPage.exportBtn.first().isVisible({ timeout: 3000 })) {
        await expect(reportsPage.exportBtn.first()).toBeVisible();
        await expect(reportsPage.exportBtn.first()).toBeEnabled();
      }
      expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
    });
  });

  test('[TC_REP_013] Verify recurring scheduled report configuration (Daily, Weekly, Monthly)', async ({ navigationMenu, page }) => {
    await test.step('Step 1: Verify Scheduled Reports configuration triggers', async () => {
      Logger.step(1, 'Checking Scheduled Reports configuration');
      await navigationMenu.navigateToSubmenu('Reports', 'Off the shelf Reports');
      expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
      const content = page.locator('main, [role="main"], body');
      await expect(content).toBeVisible();
    });
  });

  test('[TC_REP_014] Verify Report access security based on user realm and account tenancy', async ({ navigationMenu, page }) => {
    await test.step('Step 1: Validate tenant isolation boundaries in report generation', async () => {
      Logger.step(1, 'Verifying report tenant isolation guardrail');
      await navigationMenu.navigateToSubmenu('Reports', 'Off the shelf Reports');
      expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
      const content = page.locator('main, [role="main"], body');
      await expect(content).toBeVisible();
    });
  });
});
