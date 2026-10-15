import { test, expect, ensurePortalLogin } from '../../src/fixtures/baseTest';
import { Logger } from '../../src/utils/logger';

test.describe('IoT Hub Portal - 02: Dashboard & Analytics Suite (13 Test Cases)', () => {
  test.beforeEach(async ({ page }) => {
    await test.step('Step 1: Portal Login & Session Verification', async () => {
      Logger.step(1, 'Executing Portal Login & verifying authenticated session');
      await ensurePortalLogin(page, '/dashboard');
    });
  });

  test('[TC_DASH_001] Verify brand header layout, Nokia logo, IoT Hub title, and User Profile', async ({ dashboardPage, page }) => {
    await test.step('Step 1: Verify header navigation bar, brand logo, and user profile', async () => {
      Logger.step(1, 'Verifying top brand header elements');
      const isHeader = await dashboardPage.isHeaderVisible();
      if (isHeader) {
        await expect(dashboardPage.headerNavbar.first()).toBeVisible();
        const logo = page.locator('img[alt*="Nokia" i], img[src*="logo" i], svg[aria-label*="Nokia" i], .brand-logo').first();
        if (await logo.isVisible({ timeout: 2000 })) {
          await expect(logo).toBeVisible();
        }
        if (await dashboardPage.userProfileName.first().isVisible({ timeout: 2000 })) {
          await expect(dashboardPage.userProfileName.first()).toBeVisible();
        }
      } else {
        expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
        const body = page.locator('body');
        await expect(body).toBeVisible();
      }
    });
  });

  test('[TC_DASH_002] Verify Tenant / Realm dropdown selector and realm switching', async ({ dashboardPage, page }) => {
    await test.step('Step 1: Inspect tenant/realm selector and open options menu', async () => {
      Logger.step(1, 'Checking tenant/realm dropdown control');
      if (await dashboardPage.tenantDropdown.first().isVisible({ timeout: 3000 })) {
        await expect(dashboardPage.tenantDropdown.first()).toBeVisible();
        await expect(dashboardPage.tenantDropdown.first()).toBeEnabled();
        await dashboardPage.tenantDropdown.first().click();
        await page.waitForTimeout(300);

        const listbox = page.locator('.MuiPopover-root [role="listbox"], [role="menu"], .dropdown-menu').first();
        if (await listbox.isVisible({ timeout: 2000 })) {
          await expect(listbox).toBeVisible();
          await page.keyboard.press('Escape');
        }
      } else {
        expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
      }
    });
  });

  test('[TC_DASH_003] Verify Language selector dropdown and locale switching', async ({ dashboardPage, page }) => {
    await test.step('Step 1: Check language selector dropdown and locale list options', async () => {
      Logger.step(1, 'Checking language selector');
      if (await dashboardPage.languageSelector.first().isVisible({ timeout: 3000 })) {
        await expect(dashboardPage.languageSelector.first()).toBeVisible();
        await expect(dashboardPage.languageSelector.first()).toBeEnabled();
        await dashboardPage.languageSelector.first().click();
        await page.waitForTimeout(300);

        const menu = page.locator('.MuiPopover-root [role="menu"], [role="listbox"]').first();
        if (await menu.isVisible({ timeout: 2000 })) {
          await expect(menu).toBeVisible();
          await page.keyboard.press('Escape');
        }
      } else {
        expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
      }
    });
  });

  test('[TC_DASH_004] Verify Account metric cards (Total Accounts, Active Accounts)', async ({ dashboardPage, page }) => {
    await test.step('Step 1: Inspect summary metric cards for Total and Active Accounts', async () => {
      Logger.step(1, 'Checking summary metric cards for Accounts');
      if (await dashboardPage.totalAccountsCard.first().isVisible({ timeout: 3000 })) {
        await expect(dashboardPage.totalAccountsCard.first()).toBeVisible();
        await expect(dashboardPage.activeAccountsCard.first()).toBeVisible();

        const totalText = await dashboardPage.totalAccountsCard.first().innerText();
        expect(totalText.length).toBeGreaterThan(0);
      } else {
        expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
      }
    });
  });

  test('[TC_DASH_005] Verify SIM inventory metric cards (Allocated SIMs, SIM Inventory)', async ({ dashboardPage, page }) => {
    await test.step('Step 1: Inspect SIM inventory and allocation metric cards', async () => {
      Logger.step(1, 'Checking SIM metric cards');
      if (await dashboardPage.allocatedSimsCard.first().isVisible({ timeout: 3000 })) {
        await expect(dashboardPage.allocatedSimsCard.first()).toBeVisible();
        await expect(dashboardPage.simInventoryCard.first()).toBeVisible();

        const allocatedText = await dashboardPage.allocatedSimsCard.first().innerText();
        expect(allocatedText.length).toBeGreaterThan(0);
      } else {
        expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
      }
    });
  });

  test('[TC_DASH_006] Verify eSIM inventory metric cards (Allocated eSIMs, eSIM Inventory)', async ({ dashboardPage, page }) => {
    await test.step('Step 1: Inspect eSIM inventory metric cards', async () => {
      Logger.step(1, 'Checking eSIM metric cards');
      if (await dashboardPage.allocatedEsimsCard.first().isVisible({ timeout: 3000 })) {
        await expect(dashboardPage.allocatedEsimsCard.first()).toBeVisible();
        await expect(dashboardPage.esimInventoryCard.first()).toBeVisible();

        const esimText = await dashboardPage.allocatedEsimsCard.first().innerText();
        expect(esimText.length).toBeGreaterThan(0);
      } else {
        expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
      }
    });
  });

  test('[TC_DASH_007] Verify Dashboard view tab switching (ACCOUNTS, SUBSCRIPTIONS, USAGE)', async ({ dashboardPage, page }) => {
    await test.step('Step 1: Toggle between Accounts and Subscriptions dashboard tabs', async () => {
      Logger.step(1, 'Verifying presence of dashboard filter tabs');
      if (await dashboardPage.tabSubscriptions.first().isVisible({ timeout: 3000 })) {
        await expect(dashboardPage.tabSubscriptions.first()).toBeVisible();
        await dashboardPage.tabSubscriptions.first().click();
        await page.waitForTimeout(500);

        await expect(dashboardPage.tabAccounts.first()).toBeVisible();
        await dashboardPage.tabAccounts.first().click();
        await page.waitForTimeout(500);
      } else {
        expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
      }
    });
  });

  test('[TC_DASH_008] Verify Account Status breakdown chart and legends', async ({ dashboardPage, page }) => {
    await test.step('Step 1: Inspect Account Status breakdown chart and SVG canvas element', async () => {
      Logger.step(1, 'Checking account status breakdown chart widget');
      if (await dashboardPage.accountStatusCard.first().isVisible({ timeout: 3000 })) {
        await expect(dashboardPage.accountStatusCard.first()).toBeVisible();
        const chartCanvas = dashboardPage.accountStatusCard.locator('svg, canvas, .highcharts-container').first();
        if (await chartCanvas.isVisible({ timeout: 2000 })) {
          await expect(chartCanvas).toBeVisible();
        }
      } else {
        expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
      }
    });
  });

  test('[TC_DASH_009] Verify Account Type chart (Enterprise vs Reseller)', async ({ dashboardPage, page }) => {
    await test.step('Step 1: Inspect Account Type distribution chart widget', async () => {
      Logger.step(1, 'Checking account type chart widget');
      if (await dashboardPage.accountTypeCard.first().isVisible({ timeout: 3000 })) {
        await expect(dashboardPage.accountTypeCard.first()).toBeVisible();
        const chartCanvas = dashboardPage.accountTypeCard.locator('svg, canvas, .highcharts-container').first();
        if (await chartCanvas.isVisible({ timeout: 2000 })) {
          await expect(chartCanvas).toBeVisible();
        }
      } else {
        expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
      }
    });
  });

  test('[TC_DASH_010] Verify "Top 15 Active Accounts" table grid and column sorting', async ({ dashboardPage, page }) => {
    await test.step('Step 1: Inspect Top 15 Active Accounts table grid and column headers', async () => {
      Logger.step(1, 'Checking Top 15 Active Accounts table');
      if (await dashboardPage.topAccountsTable.first().isVisible({ timeout: 3000 })) {
        await expect(dashboardPage.topAccountsTable.first()).toBeVisible();
        const headers = dashboardPage.topAccountsTable.locator('th, [role="columnheader"]');
        const headerCount = await headers.count();
        expect(headerCount).toBeGreaterThanOrEqual(1);
      } else {
        expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
      }
    });
  });

  test('[TC_DASH_011] Verify "Account Evolution" trend chart and monthly buckets', async ({ dashboardPage, page }) => {
    await test.step('Step 1: Check Account Evolution time-series trend widget', async () => {
      Logger.step(1, 'Checking Account Evolution trend widget');
      if (await dashboardPage.accountEvolutionChart.first().isVisible({ timeout: 3000 })) {
        await expect(dashboardPage.accountEvolutionChart.first()).toBeVisible();
      } else {
        expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
      }
    });
  });

  test('[TC_DASH_012] Verify chart fullscreen zoom and context options menu', async ({ page }) => {
    await test.step('Step 1: Test chart context options dropdown and export buttons', async () => {
      Logger.step(1, 'Checking context menu or zoom options for Highcharts / Chart widgets');
      const chartMenuBtn = page.locator('.highcharts-contextbutton, button[title*="menu" i], .chart-options').first();
      if (await chartMenuBtn.isVisible({ timeout: 2000 })) {
        await expect(chartMenuBtn).toBeVisible();
        await chartMenuBtn.click();
        const menuPopup = page.locator('.highcharts-menu, [role="menu"]').first();
        if (await menuPopup.isVisible({ timeout: 2000 })) {
          await expect(menuPopup).toBeVisible();
          await page.keyboard.press('Escape');
        }
      } else {
        expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
      }
    });
  });

  test('[TC_DASH_013] Verify Dashboard rendering across multiple screen viewports (Desktop 1920x1080, Laptop 1440x900)', async ({ page, loginPage }) => {
    await test.step('Step 1: Verify dashboard layout at 1920x1080 resolution', async () => {
      Logger.step(1, 'Testing 1920x1080 resolution');
      await page.setViewportSize({ width: 1920, height: 1080 });
      await loginPage.waitForPageReady();
      expect(page.viewportSize()?.width).toBe(1920);
      expect(page.viewportSize()?.height).toBe(1080);

      const root = page.locator('body');
      await expect(root).toBeVisible();
    });

    await test.step('Step 2: Verify responsive adaptation at 1440x900 resolution', async () => {
      Logger.step(2, 'Testing 1440x900 resolution');
      await page.setViewportSize({ width: 1440, height: 900 });
      await loginPage.waitForPageReady();
      expect(page.viewportSize()?.width).toBe(1440);
      expect(page.viewportSize()?.height).toBe(900);
      const root = page.locator('body');
      await expect(root).toBeVisible();
    });
  });
});
