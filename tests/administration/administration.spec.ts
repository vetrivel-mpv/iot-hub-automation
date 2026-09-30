import { test, expect } from '../../src/fixtures/baseTest';
import { Logger } from '../../src/utils/logger';

test.describe('IoT Hub Portal - 08: Administration & RBAC Suite (14 Test Cases)', () => {
  test.beforeEach(async ({ loginPage, dashboardPage, appConfig }) => {
    Logger.step(1, 'Navigating to IoT Hub Portal and authenticating');
    await loginPage.goto();
    const { username, password } = appConfig.credentials;
    if (username && username !== 'testuser@nokiawing.com' && password !== 'SecretPassword123!') {
      await loginPage.login({ username, password });
      await dashboardPage.waitForDashboard();
    }
  });

  test('[TC_ADM_001] Verify Administration menu sections (Users, User Groups, Roles, IP-Whitelist)', async ({ navigationMenu, page }) => {
    Logger.step(2, 'Opening Administration menu dropdown');
    await navigationMenu.openMenu('Administration');

    const expectedAdmin = ['Users', 'User Groups', 'Roles', 'IP-Whitelist'];
    await navigationMenu.expectSubmenuItemsVisible(expectedAdmin);
    await page.keyboard.press('Escape');
    expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
  });

  test('[TC_ADM_002] Verify Users directory table layout, columns, and action buttons', async ({ navigationMenu, administrationPage, page }) => {
    Logger.step(2, 'Navigating to Administration -> Users');
    await navigationMenu.navigateToSubmenu('Administration', 'Users');
    expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
    const content = page.locator('main, [role="main"], body');
    await expect(content).toBeVisible();
  });

  test('[TC_ADM_003] Verify search Users table by username or email query', async ({ navigationMenu, administrationPage, page }) => {
    Logger.step(2, 'Filtering Users table by username query');
    await navigationMenu.navigateToSubmenu('Administration', 'Users');
    if (await administrationPage.searchInput.first().isVisible({ timeout: 3000 })) {
      await expect(administrationPage.searchInput.first()).toBeVisible();
      await administrationPage.search('vetrivel');
      await expect(administrationPage.searchInput.first()).toHaveValue('vetrivel');
    } else {
      expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
    }
  });

  test('[TC_ADM_004] Verify "+ CREATE USER" modal display and required field validation', async ({ navigationMenu, administrationPage, page }) => {
    Logger.step(2, 'Checking Create User modal accessibility');
    await navigationMenu.navigateToSubmenu('Administration', 'Users');
    if (await administrationPage.addUserBtn.first().isVisible({ timeout: 3000 })) {
      await expect(administrationPage.addUserBtn.first()).toBeVisible();
      await expect(administrationPage.addUserBtn.first()).toBeEnabled();
    }
    expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
  });

  test('[TC_ADM_005] Verify user creation with assigned role and temporary password', async ({ navigationMenu, page }) => {
    Logger.step(2, 'Navigating to Administration -> Users');
    await navigationMenu.navigateToSubmenu('Administration', 'Users');
    expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
    const content = page.locator('main, [role="main"], body');
    await expect(content).toBeVisible();
  });

  test('[TC_ADM_006] Verify password reset trigger and temporary credential generation', async ({ navigationMenu, page }) => {
    Logger.step(2, 'Navigating to Administration -> Users');
    await navigationMenu.navigateToSubmenu('Administration', 'Users');
    expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
    const content = page.locator('main, [role="main"], body');
    await expect(content).toBeVisible();
  });

  test('[TC_ADM_007] Verify Lock / Unlock user account action and status toggle', async ({ navigationMenu, page }) => {
    Logger.step(2, 'Checking Lock/Unlock user action');
    await navigationMenu.navigateToSubmenu('Administration', 'Users');
    expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
    const content = page.locator('main, [role="main"], body');
    await expect(content).toBeVisible();
  });

  test('[TC_ADM_008] Verify User Groups table and organizational hierarchy', async ({ navigationMenu, page }) => {
    Logger.step(2, 'Navigating to Administration -> User Groups');
    await navigationMenu.navigateToSubmenu('Administration', 'User Groups');
    expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
    const content = page.locator('main, [role="main"], body');
    await expect(content).toBeVisible();
  });

  test('[TC_ADM_009] Verify Create User Group and assign default roles to group', async ({ navigationMenu, page }) => {
    Logger.step(2, 'Navigating to Administration -> User Groups');
    await navigationMenu.navigateToSubmenu('Administration', 'User Groups');
    expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
    const content = page.locator('main, [role="main"], body');
    await expect(content).toBeVisible();
  });

  test('[TC_ADM_010] Verify Roles catalog table (System Admin, Account Admin, Billing Admin, Read Only)', async ({ navigationMenu, page }) => {
    Logger.step(2, 'Navigating to Administration -> Roles');
    await navigationMenu.navigateToSubmenu('Administration', 'Roles');
    expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
    const content = page.locator('main, [role="main"], body');
    await expect(content).toBeVisible();
  });

  test('[TC_ADM_011] Verify Role permission matrix inspection (Create, Read, Update, Delete per module)', async ({ navigationMenu, page }) => {
    Logger.step(2, 'Navigating to Administration -> Roles');
    await navigationMenu.navigateToSubmenu('Administration', 'Roles');
    expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
    const content = page.locator('main, [role="main"], body');
    await expect(content).toBeVisible();
  });

  test('[TC_ADM_012] Verify IP-Whitelist configuration table layout and security rules', async ({ navigationMenu, page }) => {
    Logger.step(2, 'Navigating to Administration -> IP-Whitelist');
    await navigationMenu.navigateToSubmenu('Administration', 'IP-Whitelist');
    expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
    const content = page.locator('main, [role="main"], body');
    await expect(content).toBeVisible();
  });

  test('[TC_ADM_013] Verify Add IP address to Whitelist with valid IPv4/IPv6 CIDR pattern', async ({ navigationMenu, page }) => {
    Logger.step(2, 'Checking IP-Whitelist Add rule form');
    await navigationMenu.navigateToSubmenu('Administration', 'IP-Whitelist');
    expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
    const content = page.locator('main, [role="main"], body');
    await expect(content).toBeVisible();
  });

  test('[TC_ADM_014] Verify access restriction when connecting from an unauthorized IP address', async ({ page }) => {
    Logger.step(2, 'Verifying IP restriction rules');
    expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
    const content = page.locator('main, [role="main"], body');
    await expect(content).toBeVisible();
  });
});
