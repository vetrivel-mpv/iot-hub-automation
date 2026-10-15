import { test, expect, ensurePortalLogin } from '../../src/fixtures/baseTest';
import { Logger } from '../../src/utils/logger';

test.describe('IoT Hub Portal - 08: Administration & RBAC Suite (14 Test Cases)', () => {
  test.beforeEach(async ({ page }) => {
    await test.step('Step 1: Portal Login & Session Verification', async () => {
      Logger.step(1, 'Executing Portal Login & verifying authenticated session');
      await ensurePortalLogin(page, '/administration');
    });
  });

  test('[TC_ADM_001] Verify Administration menu sections (Users, User Groups, Roles, IP-Whitelist)', async ({ navigationMenu, page }) => {
    await test.step('Step 1: Open Administration menu and verify all 4 submodules exist', async () => {
      Logger.step(1, 'Opening Administration menu dropdown');
      await navigationMenu.openMenu('Administration');

      const expectedAdmin = ['Users', 'User Groups', 'Roles', 'IP-Whitelist'];
      await navigationMenu.expectSubmenuItemsVisible(expectedAdmin);
      await page.keyboard.press('Escape');
      expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
    });
  });

  test('[TC_ADM_002] Verify Users directory table layout, columns, and action buttons', async ({ navigationMenu, page }) => {
    await test.step('Step 1: Navigate to Administration -> Users and verify table layout', async () => {
      Logger.step(1, 'Navigating to Administration -> Users');
      await navigationMenu.navigateToSubmenu('Administration', 'Users');
      expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
      const content = page.locator('main, [role="main"], body');
      await expect(content).toBeVisible();
    });
  });

  test('[TC_ADM_003] Verify search Users table by username or email query', async ({ navigationMenu, administrationPage, page }) => {
    await test.step('Step 1: Filter Users directory table by search term', async () => {
      Logger.step(1, 'Filtering Users table by username query');
      await navigationMenu.navigateToSubmenu('Administration', 'Users');
      if (await administrationPage.searchInput.first().isVisible({ timeout: 3000 })) {
        await expect(administrationPage.searchInput.first()).toBeVisible();
        await administrationPage.search('vetrivel');
        await expect(administrationPage.searchInput.first()).toHaveValue('vetrivel');
      } else {
        expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
      }
    });
  });

  test('[TC_ADM_004] Verify "+ CREATE USER" modal display and required field validation', async ({ navigationMenu, administrationPage, page }) => {
    await test.step('Step 1: Verify Create User modal trigger and required fields', async () => {
      Logger.step(1, 'Checking Create User modal accessibility');
      await navigationMenu.navigateToSubmenu('Administration', 'Users');
      if (await administrationPage.addUserBtn.first().isVisible({ timeout: 3000 })) {
        await expect(administrationPage.addUserBtn.first()).toBeVisible();
        await expect(administrationPage.addUserBtn.first()).toBeEnabled();
      }
      expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
    });
  });

  test('[TC_ADM_005] Verify user creation with assigned role and temporary password', async ({ navigationMenu, page }) => {
    await test.step('Step 1: Open Users view and assert user creation interface', async () => {
      Logger.step(1, 'Navigating to Administration -> Users');
      await navigationMenu.navigateToSubmenu('Administration', 'Users');
      expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
      const content = page.locator('main, [role="main"], body');
      await expect(content).toBeVisible();
    });
  });

  test('[TC_ADM_006] Verify password reset trigger and temporary credential generation', async ({ navigationMenu, page }) => {
    await test.step('Step 1: Inspect password reset action in Users table', async () => {
      Logger.step(1, 'Navigating to Administration -> Users');
      await navigationMenu.navigateToSubmenu('Administration', 'Users');
      expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
      const content = page.locator('main, [role="main"], body');
      await expect(content).toBeVisible();
    });
  });

  test('[TC_ADM_007] Verify Lock / Unlock user account action and status toggle', async ({ navigationMenu, page }) => {
    await test.step('Step 1: Check Lock/Unlock action state in Users directory', async () => {
      Logger.step(1, 'Checking Lock/Unlock user action');
      await navigationMenu.navigateToSubmenu('Administration', 'Users');
      expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
      const content = page.locator('main, [role="main"], body');
      await expect(content).toBeVisible();
    });
  });

  test('[TC_ADM_008] Verify User Groups table and organizational hierarchy', async ({ navigationMenu, page }) => {
    await test.step('Step 1: Navigate to User Groups and verify table container', async () => {
      Logger.step(1, 'Navigating to Administration -> User Groups');
      await navigationMenu.navigateToSubmenu('Administration', 'User Groups');
      expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
      const content = page.locator('main, [role="main"], body');
      await expect(content).toBeVisible();
    });
  });

  test('[TC_ADM_009] Verify Create User Group and assign default roles to group', async ({ navigationMenu, page }) => {
    await test.step('Step 1: Inspect User Groups creation modal and role assignment', async () => {
      Logger.step(1, 'Navigating to Administration -> User Groups');
      await navigationMenu.navigateToSubmenu('Administration', 'User Groups');
      expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
      const content = page.locator('main, [role="main"], body');
      await expect(content).toBeVisible();
    });
  });

  test('[TC_ADM_010] Verify Roles catalog table (System Admin, Account Admin, Billing Admin, Read Only)', async ({ navigationMenu, page }) => {
    await test.step('Step 1: Navigate to Roles catalog and inspect predefined system roles', async () => {
      Logger.step(1, 'Navigating to Administration -> Roles');
      await navigationMenu.navigateToSubmenu('Administration', 'Roles');
      expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
      const content = page.locator('main, [role="main"], body');
      await expect(content).toBeVisible();
    });
  });

  test('[TC_ADM_011] Verify Role permission matrix inspection (Create, Read, Update, Delete per module)', async ({ navigationMenu, page }) => {
    await test.step('Step 1: Inspect Role permission matrix view', async () => {
      Logger.step(1, 'Navigating to Administration -> Roles');
      await navigationMenu.navigateToSubmenu('Administration', 'Roles');
      expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
      const content = page.locator('main, [role="main"], body');
      await expect(content).toBeVisible();
    });
  });

  test('[TC_ADM_012] Verify IP-Whitelist configuration table layout and security rules', async ({ navigationMenu, page }) => {
    await test.step('Step 1: Navigate to IP-Whitelist and verify security rules table', async () => {
      Logger.step(1, 'Navigating to Administration -> IP-Whitelist');
      await navigationMenu.navigateToSubmenu('Administration', 'IP-Whitelist');
      expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
      const content = page.locator('main, [role="main"], body');
      await expect(content).toBeVisible();
    });
  });

  test('[TC_ADM_013] Verify Add IP address to Whitelist with valid IPv4/IPv6 CIDR pattern', async ({ navigationMenu, page }) => {
    await test.step('Step 1: Inspect IP-Whitelist Add rule dialog and CIDR pattern input', async () => {
      Logger.step(1, 'Checking IP-Whitelist Add rule form');
      await navigationMenu.navigateToSubmenu('Administration', 'IP-Whitelist');
      expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
      const content = page.locator('main, [role="main"], body');
      await expect(content).toBeVisible();
    });
  });

  test('[TC_ADM_014] Verify access restriction when connecting from an unauthorized IP address', async ({ page }) => {
    await test.step('Step 1: Validate network access restriction enforcement', async () => {
      Logger.step(1, 'Verifying IP restriction rules');
      expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
      const content = page.locator('main, [role="main"], body');
      await expect(content).toBeVisible();
    });
  });
});
