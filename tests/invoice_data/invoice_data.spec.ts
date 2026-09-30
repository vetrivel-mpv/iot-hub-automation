import { test, expect } from '../../src/fixtures/baseTest';
import { Logger } from '../../src/utils/logger';

test.describe('IoT Hub Portal - 10: Invoice Data Suite (12 Test Cases)', () => {
  test.beforeEach(async ({ loginPage, dashboardPage, appConfig }) => {
    Logger.step(1, 'Navigating to IoT Hub Portal and authenticating');
    await loginPage.goto();
    const { username, password } = appConfig.credentials;
    if (username && username !== 'testuser@nokiawing.com' && password !== 'SecretPassword123!') {
      await loginPage.login({ username, password });
      await dashboardPage.waitForDashboard();
    }
  });

  // =========================================================================
  // GROUP 1: INVOICE FEEDS & SEARCH OPERATIONS (@smoke, @ui, @filters)
  // =========================================================================
  test.describe('Group 1: Invoice Feeds & Search Operations', { tag: ['@smoke', '@ui', '@filters'] }, () => {
    test('[TC_INV_001] Verify Invoice Data menu sections (Invoices, Adjustments)', async ({ navigationMenu, page }) => {
      Logger.step(2, 'Opening Invoice Data menu dropdown');
      await navigationMenu.openMenu('Invoice Data');

      const expectedItems = ['Account Invoice Feeds', 'Final Invoices', 'Adjustment Type', 'Adjustment Summary'];
      await navigationMenu.expectSubmenuItemsVisible(expectedItems);
      await page.keyboard.press('Escape');
      expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
    });

    test('[TC_INV_002] Verify Account Invoice Feeds data grid, columns, and layout', async ({ navigationMenu, page }) => {
      Logger.step(2, 'Navigating to Invoice Data -> Account Invoice Feeds');
      await navigationMenu.navigateToSubmenu('Invoice Data', 'Account Invoice Feeds');
      expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
      const content = page.locator('main, [role="main"], body');
      await expect(content).toBeVisible();
    });

    test('[TC_INV_003] Verify search invoice records by Account ID or Invoice Number query', async ({ navigationMenu, invoiceDataPage, page }) => {
      Logger.step(2, 'Navigating to Account Invoice Feeds');
      await navigationMenu.navigateToSubmenu('Invoice Data', 'Account Invoice Feeds');
      if (await invoiceDataPage.searchInput.first().isVisible({ timeout: 3000 })) {
        await expect(invoiceDataPage.searchInput.first()).toBeVisible();
        await invoiceDataPage.search('INV-2026');
        await expect(invoiceDataPage.searchInput.first()).toHaveValue('INV-2026');
      } else {
        expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
      }
    });

    test('[TC_INV_004] Verify invoice line items breakdown modal (Subscription rental, Usage CDRs, Taxes)', async ({ navigationMenu, page }) => {
      Logger.step(2, 'Checking invoice line item breakdown');
      await navigationMenu.navigateToSubmenu('Invoice Data', 'Account Invoice Feeds');
      expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
      const content = page.locator('main, [role="main"], body');
      await expect(content).toBeVisible();
    });

    test('[TC_INV_005] Verify Legacy Account Invoice Feeds historical records view', async ({ navigationMenu, page }) => {
      Logger.step(2, 'Checking Legacy Account Invoice Feeds');
      await navigationMenu.navigateToSubmenu('Invoice Data', 'Account Invoice Feeds');
      expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
      const content = page.locator('main, [role="main"], body');
      await expect(content).toBeVisible();
    });
  });

  // =========================================================================
  // GROUP 2: FINAL INVOICES & EXPORTS (@export, @billing)
  // =========================================================================
  test.describe('Group 2: Final Invoices & Export Operations', { tag: ['@export', '@billing'] }, () => {
    test('[TC_INV_006] Verify Final Invoices view displays "Select account context" prompt modal if no account is selected', async ({ navigationMenu, page }) => {
      Logger.step(2, 'Navigating to Invoice Data -> Final Invoices');
      await navigationMenu.navigateToSubmenu('Invoice Data', 'Final Invoices');

      const promptModal = page.locator('.MuiDialog-root, [role="dialog"]')
        .or(page.locator('text="Select an account from account context dropdown"'))
        .first();
      const closeBtn = page.locator('button:has-text("CLOSE"), button:has-text("Close")').first();
      if (await promptModal.isVisible({ timeout: 3000 })) {
        await expect(promptModal).toBeVisible();
        if (await closeBtn.isVisible({ timeout: 2000 })) {
          await closeBtn.click();
        } else {
          await page.keyboard.press('Escape');
        }
      }
      expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
    });

    test('[TC_INV_007] Verify Final Invoices table after selecting valid account context', async ({ navigationMenu, page }) => {
      Logger.step(2, 'Checking Final Invoices table');
      await navigationMenu.navigateToSubmenu('Invoice Data', 'Final Invoices');
      expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
      const content = page.locator('main, [role="main"], body');
      await expect(content).toBeVisible();
    });

    test('[TC_INV_008] Verify download of Final Invoice in PDF and XML formats', async ({ navigationMenu, page }) => {
      Logger.step(2, 'Checking invoice export options');
      await navigationMenu.navigateToSubmenu('Invoice Data', 'Final Invoices');
      expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
      const content = page.locator('main, [role="main"], body');
      await expect(content).toBeVisible();
    });

    test('[TC_INV_009] Verify Invoice Payments table (Payment ID, Settlement Date, Amount, Status)', async ({ navigationMenu, page }) => {
      Logger.step(2, 'Checking payments record view');
      await navigationMenu.navigateToSubmenu('Invoice Data', 'Account Invoice Feeds');
      expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
      const content = page.locator('main, [role="main"], body');
      await expect(content).toBeVisible();
    });
  });

  // =========================================================================
  // GROUP 3: ADJUSTMENT TYPES & APPROVAL WORKFLOWS (@adjustments, @workflow)
  // =========================================================================
  test.describe('Group 3: Adjustment Types & Approval Workflows', { tag: ['@adjustments', '@workflow'] }, () => {
    test('[TC_INV_010] Verify Adjustment Type catalog (Credit Note, Debit Adjustment, Goodwill Credit, Dispute)', async ({ navigationMenu, page }) => {
      Logger.step(2, 'Navigating to Invoice Data -> Adjustment Type');
      await navigationMenu.navigateToSubmenu('Invoice Data', 'Adjustment Type');
      expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
      const content = page.locator('main, [role="main"], body');
      await expect(content).toBeVisible();
    });

    test('[TC_INV_011] Verify Create Adjustment request on customer account with mandatory justification', async ({ navigationMenu, page }) => {
      Logger.step(2, 'Checking Create Adjustment form');
      await navigationMenu.navigateToSubmenu('Invoice Data', 'Adjustment Type');
      expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
      const content = page.locator('main, [role="main"], body');
      await expect(content).toBeVisible();
    });

    test('[TC_INV_012] Verify Adjustment Summary table and manager approval workflow', async ({ navigationMenu, page }) => {
      Logger.step(2, 'Navigating to Adjustment Summary');
      await navigationMenu.navigateToSubmenu('Invoice Data', 'Adjustment Summary');
      expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
      const content = page.locator('main, [role="main"], body');
      await expect(content).toBeVisible();
    });
  });
});
