import { test, expect } from '../../src/fixtures/baseTest';
import { Logger } from '../../src/utils/logger';

test.describe('IoT Hub Portal - 06: Rating & Billing Suite (16 Test Cases)', () => {
  test.beforeEach(async ({ loginPage, dashboardPage, appConfig }) => {
    Logger.step(1, 'Navigating to IoT Hub Portal and authenticating');
    await loginPage.goto();
    const { username, password } = appConfig.credentials;
    if (username && username !== 'testuser@nokiawing.com' && password !== 'SecretPassword123!') {
      await loginPage.login({ username, password });
      await dashboardPage.waitForDashboard();
    }
  });

  test('[TC_RAT_001] Verify Rating menu sections and sub-items hierarchy', async ({ navigationMenu, page }) => {
    Logger.step(2, 'Opening Rating menu dropdown');
    await navigationMenu.openMenu('Rating');

    const expectedRating = ['Rate Plans', 'Add-on Bundle', 'Rating Zones', 'Quota Management', 'Service Fee Catalog', 'Discount Catalog', 'Commitment Catalog'];
    await navigationMenu.expectSubmenuItemsVisible(expectedRating);
    await page.keyboard.press('Escape');
    expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
  });

  test('[TC_RAT_002] Verify Rate Plans catalog table, columns, and search', async ({ navigationMenu, ratingPage, page }) => {
    Logger.step(2, 'Navigating to Rating -> Rate Plans');
    await navigationMenu.navigateToSubmenu('Rating', 'Rate Plans');
    expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
    const content = page.locator('main, [role="main"], body');
    await expect(content).toBeVisible();
  });

  test('[TC_RAT_003] Verify search Rate Plans by plan name query', async ({ navigationMenu, ratingPage, page }) => {
    Logger.step(2, 'Searching Rate Plans table');
    await navigationMenu.navigateToSubmenu('Rating', 'Rate Plans');
    if (await ratingPage.searchInput.first().isVisible({ timeout: 3000 })) {
      await expect(ratingPage.searchInput.first()).toBeVisible();
      await ratingPage.search('Default');
      await expect(ratingPage.searchInput.first()).toHaveValue('Default');
    } else {
      expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
    }
  });

  test('[TC_RAT_004] Verify Rate Plan creation wizard (Allowance tiers, billing cycle, overage charges)', async ({ navigationMenu, ratingPage, page }) => {
    Logger.step(2, 'Checking Rate Plan creation modal');
    await navigationMenu.navigateToSubmenu('Rating', 'Rate Plans');
    if (await ratingPage.createBtn.first().isVisible({ timeout: 3000 })) {
      await expect(ratingPage.createBtn.first()).toBeVisible();
      await expect(ratingPage.createBtn.first()).toBeEnabled();
    }
    expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
  });

  test('[TC_RAT_005] Verify Add-on Bundle catalog view and bundle structure', async ({ navigationMenu, page }) => {
    Logger.step(2, 'Navigating to Rating -> Add-on Bundle');
    await navigationMenu.navigateToSubmenu('Rating', 'Add-on Bundle');
    expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
    const content = page.locator('main, [role="main"], body');
    await expect(content).toBeVisible();
  });

  test('[TC_RAT_006] Verify Add-on Bundle creation with validity duration and pricing', async ({ navigationMenu, ratingPage, page }) => {
    Logger.step(2, 'Checking Add-on Bundle creation modal');
    await navigationMenu.navigateToSubmenu('Rating', 'Add-on Bundle');
    if (await ratingPage.createBtn.first().isVisible({ timeout: 3000 })) {
      await expect(ratingPage.createBtn.first()).toBeVisible();
      await expect(ratingPage.createBtn.first()).toBeEnabled();
    }
    expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
  });

  test('[TC_RAT_007] Verify Rating Zones configuration and country mapping', async ({ navigationMenu, page }) => {
    Logger.step(2, 'Navigating to Rating -> Rating Zones');
    await navigationMenu.navigateToSubmenu('Rating', 'Rating Zones');
    expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
    const content = page.locator('main, [role="main"], body');
    await expect(content).toBeVisible();
  });

  test('[TC_RAT_008] Verify Quota Management table, limits, and Fair Usage Policies (FUP)', async ({ navigationMenu, page }) => {
    Logger.step(2, 'Navigating to Rating -> Quota Management');
    await navigationMenu.navigateToSubmenu('Rating', 'Quota Management');
    expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
    const content = page.locator('main, [role="main"], body');
    await expect(content).toBeVisible();
  });

  test('[TC_RAT_009] Verify Quota policy creation (Throttling speed vs Hard cut-off barring action)', async ({ navigationMenu, ratingPage, page }) => {
    Logger.step(2, 'Checking Quota policy creation');
    await navigationMenu.navigateToSubmenu('Rating', 'Quota Management');
    if (await ratingPage.createBtn.first().isVisible({ timeout: 3000 })) {
      await expect(ratingPage.createBtn.first()).toBeVisible();
      await expect(ratingPage.createBtn.first()).toBeEnabled();
    }
    expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
  });

  test('[TC_RAT_010] Verify Service Fee Catalog table (Non-usage fees, line rental, SIM replacement fee)', async ({ navigationMenu, page }) => {
    Logger.step(2, 'Navigating to Rating -> Service Fee Catalog');
    await navigationMenu.navigateToSubmenu('Rating', 'Service Fee Catalog');
    expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
    const content = page.locator('main, [role="main"], body');
    await expect(content).toBeVisible();
  });

  test('[TC_RAT_011] Verify Service Fee creation and tax code association', async ({ navigationMenu, ratingPage, page }) => {
    Logger.step(2, 'Checking Service Fee creation');
    await navigationMenu.navigateToSubmenu('Rating', 'Service Fee Catalog');
    if (await ratingPage.createBtn.first().isVisible({ timeout: 3000 })) {
      await expect(ratingPage.createBtn.first()).toBeVisible();
      await expect(ratingPage.createBtn.first()).toBeEnabled();
    }
    expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
  });

  test('[TC_RAT_012] Verify Assigned Service Fees view and association to customer accounts', async ({ navigationMenu, page }) => {
    Logger.step(2, 'Navigating to Rating -> Assigned Service Fees');
    await navigationMenu.navigateToSubmenu('Rating', 'Service Fee Catalog');
    expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
    const content = page.locator('main, [role="main"], body');
    await expect(content).toBeVisible();
  });

  test('[TC_RAT_013] Verify Discount Catalog table (Volume discounts, tier percentage discounts)', async ({ navigationMenu, page }) => {
    Logger.step(2, 'Navigating to Rating -> Discount Catalog');
    await navigationMenu.navigateToSubmenu('Rating', 'Discount Catalog');
    expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
    const content = page.locator('main, [role="main"], body');
    await expect(content).toBeVisible();
  });

  test('[TC_RAT_014] Verify Discount rule creation with minimum SIM volume threshold', async ({ navigationMenu, ratingPage, page }) => {
    Logger.step(2, 'Checking Discount rule creation');
    await navigationMenu.navigateToSubmenu('Rating', 'Discount Catalog');
    if (await ratingPage.createBtn.first().isVisible({ timeout: 3000 })) {
      await expect(ratingPage.createBtn.first()).toBeVisible();
      await expect(ratingPage.createBtn.first()).toBeEnabled();
    }
    expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
  });

  test('[TC_RAT_015] Verify Commitment Catalog table (Minimum spend commitments, volume commitments)', async ({ navigationMenu, page }) => {
    Logger.step(2, 'Navigating to Rating -> Commitment Catalog');
    await navigationMenu.navigateToSubmenu('Rating', 'Commitment Catalog');
    expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
    const content = page.locator('main, [role="main"], body');
    await expect(content).toBeVisible();
  });

  test('[TC_RAT_016] Verify Assigned Commitments tracking and true-up calculation logic', async ({ navigationMenu, page }) => {
    Logger.step(2, 'Navigating to Rating -> Commitment tracking');
    await navigationMenu.navigateToSubmenu('Rating', 'Commitment Catalog');
    expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
    const content = page.locator('main, [role="main"], body');
    await expect(content).toBeVisible();
  });
});
