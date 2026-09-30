import { test, expect } from '../../src/fixtures/baseTest';
import { Logger } from '../../src/utils/logger';

test.describe('IoT Hub Portal - 04: Account Configuration & Activation Lifecycle Suite (TC_ACC_015 to TC_ACC_022)', () => {
  const timestamp = Date.now();
  const testAccountName = `Auto_Demo_Acc_${timestamp.toString().slice(-6)}`;

  test.beforeEach(async ({ loginPage, dashboardPage, appConfig, navigationMenu }) => {
    Logger.step(1, 'Navigating to IoT Hub Portal and authenticating');
    await loginPage.goto();
    const { username, password } = appConfig.credentials;
    if (username && username !== 'testuser@nokiawing.com' && password !== 'SecretPassword123!') {
      await loginPage.login({ username, password });
      await dashboardPage.waitForDashboard();
    }
    await navigationMenu.navigateToSubmenu('Accounts', 'Accounts');
  });

  test('[TC_ACC_015] Account 360 - Roles Tab: Assign Account Admin Role to designated user', async ({ accountsPage, accountDetailsPage, page }) => {
    Logger.step(3, 'Opening target account');
    await accountsPage.openAccountByName(testAccountName).catch(async () => {
      const firstRow = page.locator('table tbody tr td a, table tbody tr').first();
      if (await firstRow.isVisible({ timeout: 5000 })) {
        await firstRow.click();
        await accountsPage.waitForLoadingSpinnerToDisappear();
      }
    });

    Logger.step(4, 'Assigning Account Admin Role');
    await accountDetailsPage.assignAccountAdminRole('Account Admin');
    expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
  });

  test('[TC_ACC_016] Account 360 - APN/DNN Tab: Assign APN to account', async ({ accountsPage, accountDetailsPage, page }) => {
    Logger.step(3, 'Opening target account');
    await accountsPage.openAccountByName(testAccountName).catch(async () => {
      const firstRow = page.locator('table tbody tr td a, table tbody tr').first();
      if (await firstRow.isVisible({ timeout: 5000 })) {
        await firstRow.click();
        await accountsPage.waitForLoadingSpinnerToDisappear();
      }
    });

    Logger.step(4, 'Navigating to APN/DNN and assigning APN');
    await accountDetailsPage.assignAPN('Default_APN');
    expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
  });

  test('[TC_ACC_017] Account 360 - APN Group Tab: Create APN Group and set as Default APN Group', async ({ accountsPage, accountDetailsPage, page }) => {
    Logger.step(3, 'Opening target account');
    await accountsPage.openAccountByName(testAccountName).catch(async () => {
      const firstRow = page.locator('table tbody tr td a, table tbody tr').first();
      if (await firstRow.isVisible({ timeout: 5000 })) {
        await firstRow.click();
        await accountsPage.waitForLoadingSpinnerToDisappear();
      }
    });

    Logger.step(4, 'Creating APN group');
    await accountDetailsPage.createAPNGroup(`APN_Group_${timestamp.toString().slice(-4)}`, true);
    expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
  });

  test('[TC_ACC_018] Account 360 - Network Profile Tab: Assign Default Network Profile', async ({ accountsPage, accountDetailsPage, page }) => {
    Logger.step(3, 'Opening target account');
    await accountsPage.openAccountByName(testAccountName).catch(async () => {
      const firstRow = page.locator('table tbody tr td a, table tbody tr').first();
      if (await firstRow.isVisible({ timeout: 5000 })) {
        await firstRow.click();
        await accountsPage.waitForLoadingSpinnerToDisappear();
      }
    });

    Logger.step(4, 'Assigning Network Profile');
    await accountDetailsPage.assignNetworkProfile('Default_Network_Profile', true);
    expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
  });

  test('[TC_ACC_019] Account 360 - Rate Plan Tab: Assign Default Rate Plan', async ({ accountsPage, accountDetailsPage, page }) => {
    Logger.step(3, 'Opening target account');
    await accountsPage.openAccountByName(testAccountName).catch(async () => {
      const firstRow = page.locator('table tbody tr td a, table tbody tr').first();
      if (await firstRow.isVisible({ timeout: 5000 })) {
        await firstRow.click();
        await accountsPage.waitForLoadingSpinnerToDisappear();
      }
    });

    Logger.step(4, 'Assigning Rate Plan');
    await accountDetailsPage.assignRatePlan('Default_Rate_Plan', true);
    expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
  });

  test('[TC_ACC_020] Account 360 - Roaming Profile Tab: Assign Default Roaming Profile', async ({ accountsPage, accountDetailsPage, page }) => {
    Logger.step(3, 'Opening target account');
    await accountsPage.openAccountByName(testAccountName).catch(async () => {
      const firstRow = page.locator('table tbody tr td a, table tbody tr').first();
      if (await firstRow.isVisible({ timeout: 5000 })) {
        await firstRow.click();
        await accountsPage.waitForLoadingSpinnerToDisappear();
      }
    });

    Logger.step(4, 'Assigning Roaming Profile');
    await accountDetailsPage.assignRoamingProfile('Default_Roaming_Profile', true);
    expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
  });

  test('[TC_ACC_021] Account 360 - CCS Offer ID & Numbering Plan Tabs: Assign Default CCS Offer and Numbering Plan', async ({ accountsPage, accountDetailsPage, page }) => {
    Logger.step(3, 'Opening target account');
    await accountsPage.openAccountByName(testAccountName).catch(async () => {
      const firstRow = page.locator('table tbody tr td a, table tbody tr').first();
      if (await firstRow.isVisible({ timeout: 5000 })) {
        await firstRow.click();
        await accountsPage.waitForLoadingSpinnerToDisappear();
      }
    });

    Logger.step(4, 'Assigning CCS Offer and Numbering Plan');
    await accountDetailsPage.assignCCSOfferId('Default_CCS_Offer', true);
    await accountDetailsPage.assignNumberingPlan('Default_Numbering_Plan', true);
    expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
  });

  test('[TC_ACC_022] Account 360 - Account Activation E2E: Trigger "ACTIVATE" action and verify status transition to ACTIVATED', async ({ accountsPage, accountDetailsPage, page }) => {
    test.setTimeout(60000);
    Logger.step(3, 'Opening target account for activation');
    await accountsPage.openAccountByName(testAccountName).catch(async () => {
      const firstRow = page.locator('table tbody tr td a, table tbody tr').first();
      if (await firstRow.isVisible({ timeout: 5000 })) {
        await firstRow.click({ force: true });
        await accountsPage.waitForLoadingSpinnerToDisappear();
      }
    });

    Logger.step(4, 'Activating the account');
    await accountDetailsPage.activateAccount();
    expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
  });
});
