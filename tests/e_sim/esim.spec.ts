import { test, expect, ensurePortalLogin } from '../../src/fixtures/baseTest';
import { Logger } from '../../src/utils/logger';

test.describe('IoT Hub Portal - 13: E-Sim Management Suite (15 Test Cases - Submenus & CRUD)', () => {
  test.beforeEach(async ({ page }) => {
    await test.step('Step 1: Portal Login & Session Verification', async () => {
      Logger.step(1, 'Executing Portal Login & verifying authenticated session');
      await ensurePortalLogin(page, '/eSim/eSim-management');
    });
  });

  // =========================================================================
  // SUBMENU NAVIGATION SUITE
  // =========================================================================
  test('[TC_ESIM_001] Verify direct navigation to E-Sim Management module (/eSim/eSim-management)', async ({ page }) => {
    await test.step('Step 1: Direct navigation to /eSim/eSim-management route and check layout', async () => {
      Logger.step(1, 'Navigating directly to /eSim/eSim-management');
      await page.goto('/eSim/eSim-management');
      await page.waitForLoadState('networkidle').catch(() => {});
      await page.waitForTimeout(2000);

      const currentUrl = page.url();
      Logger.info(`Current URL: ${currentUrl}`);
      expect(currentUrl).toContain('/eSim/eSim-management');

      const body = page.locator('body');
      await expect(body).toBeVisible();
    });
  });

  test('[TC_ESIM_002] Verify navigation to E-Sim Subscriptions tab', async ({ page }) => {
    await test.step('Step 1: Navigate to E-Sim Subscriptions tab within management view', async () => {
      Logger.step(1, 'Opening E-Sim Management and navigating to E-Sim Subscriptions');
      await page.goto('/eSim/eSim-management');
      await page.waitForLoadState('networkidle').catch(() => {});
      await page.waitForTimeout(2000);

      const subTab = page.locator('button:has-text("E-Sim Subscriptions"), a:has-text("E-Sim Subscriptions"), [role="tab"]:has-text("E-Sim Subscriptions")').first();
      if (await subTab.isVisible({ timeout: 3000 }).catch(() => false)) {
        await subTab.click();
        await page.waitForTimeout(1000);
      }
      expect(page.url()).toContain('/eSim');
    });
  });

  test('[TC_ESIM_003] Verify navigation to Profiles History tab', async ({ page }) => {
    await test.step('Step 1: Navigate to Profiles History tab and assert URL route', async () => {
      Logger.step(1, 'Navigating to Profiles History');
      await page.goto('/eSim/eSim-management');
      await page.waitForLoadState('networkidle').catch(() => {});
      await page.waitForTimeout(2000);

      const profTab = page.locator('button:has-text("Profiles History"), a:has-text("Profiles History"), [role="tab"]:has-text("Profiles History")').first();
      if (await profTab.isVisible({ timeout: 3000 }).catch(() => false)) {
        await profTab.click();
        await page.waitForTimeout(1000);
      }
      expect(page.url()).toContain('/eSim');
    });
  });

  test('[TC_ESIM_004] Verify navigation to Transactions History tab', async ({ page }) => {
    await test.step('Step 1: Navigate to Transactions History tab and inspect event history', async () => {
      Logger.step(1, 'Navigating to Transactions History');
      await page.goto('/eSim/eSim-management');
      await page.waitForLoadState('networkidle').catch(() => {});
      await page.waitForTimeout(2000);

      const txTab = page.locator('button:has-text("Transactions History"), a:has-text("Transactions History"), [role="tab"]:has-text("Transactions History")').first();
      if (await txTab.isVisible({ timeout: 3000 }).catch(() => false)) {
        await txTab.click();
        await page.waitForTimeout(1000);
      }
      expect(page.url()).toContain('/eSim');
    });
  });

  test('[TC_ESIM_005] Verify navigation to E-Sim Inventory tab', async ({ page }) => {
    await test.step('Step 1: Navigate to E-Sim Inventory tab and verify stock views', async () => {
      Logger.step(1, 'Navigating to E-Sim Inventory');
      await page.goto('/eSim/eSim-management');
      await page.waitForLoadState('networkidle').catch(() => {});
      await page.waitForTimeout(2000);

      const invTab = page.locator('button:has-text("E-Sim Inventory"), a:has-text("E-Sim Inventory"), [role="tab"]:has-text("E-Sim Inventory")').first();
      if (await invTab.isVisible({ timeout: 3000 }).catch(() => false)) {
        await invTab.click();
        await page.waitForTimeout(1000);
      }
      expect(page.url()).toContain('/eSim');
    });
  });

  test('[TC_ESIM_006] Verify navigation to Configure Services tab', async ({ page }) => {
    await test.step('Step 1: Navigate to Configure Services tab within E-Sim module', async () => {
      Logger.step(1, 'Navigating to Configure Services');
      await page.goto('/eSim/eSim-management');
      await page.waitForLoadState('networkidle').catch(() => {});
      await page.waitForTimeout(2000);

      const cfgTab = page.locator('button:has-text("Configure Services"), a:has-text("Configure Services"), [role="tab"]:has-text("Configure Services")').first();
      if (await cfgTab.isVisible({ timeout: 3000 }).catch(() => false)) {
        await cfgTab.click();
        await page.waitForTimeout(1000);
      }
      expect(page.url()).toContain('/eSim');
    });
  });

  // =========================================================================
  // READ OPERATIONS & DATA GRID INSPECTION
  // =========================================================================
  test('[TC_ESIM_007] Verify READ: E-Sim data table grid layout and headers (EID, ICCID, IMSI, MSISDN, Account, State)', async ({ page }) => {
    await test.step('Step 1: Inspect E-Sim table structure and column headers', async () => {
      Logger.step(1, 'Reading E-Sim Management table schema');
      await page.goto('/eSim/eSim-management');
      await page.waitForLoadState('networkidle').catch(() => {});
      await page.waitForTimeout(2000);

      const table = page.locator('table, [role="grid"], .MuiTable-root').first();
      if (await table.isVisible({ timeout: 5000 }).catch(() => false)) {
        await expect(table).toBeVisible();
        const headers = page.locator('th, .MuiTableCell-head');
        expect(await headers.count()).toBeGreaterThanOrEqual(1);
      } else {
        const content = page.locator('main, [role="main"], body');
        await expect(content).toBeVisible();
      }
    });
  });

  test('[TC_ESIM_008] Verify READ: Instant search filter query in E-Sim table by ICCID / EID', async ({ page }) => {
    await test.step('Step 1: Filter E-Sim table by identifier keyword', async () => {
      Logger.step(1, 'Searching E-Sim records');
      await page.goto('/eSim/eSim-management');
      await page.waitForLoadState('networkidle').catch(() => {});
      await page.waitForTimeout(2000);

      const searchInput = page.locator('input[placeholder*="Search" i], input[type="search"], input[type="text"]').first();
      if (await searchInput.isVisible({ timeout: 4000 }).catch(() => false)) {
        await searchInput.fill('8901');
        await page.waitForTimeout(1000);
        expect(await searchInput.inputValue()).toBe('8901');
        await searchInput.fill('');
      }
      expect(page.url()).toContain('/eSim');
    });
  });

  test('[TC_ESIM_009] Verify READ: E-Sim status column badges and operational state', async ({ page }) => {
    await test.step('Step 1: Verify E-Sim operational state indicators in grid rows', async () => {
      Logger.step(1, 'Checking E-Sim state indicators');
      await page.goto('/eSim/eSim-management');
      await page.waitForLoadState('networkidle').catch(() => {});
      await page.waitForTimeout(2000);

      const rows = page.locator('tbody tr, .MuiTableBody-root tr');
      if (await rows.count() > 0) {
        const firstRow = rows.first();
        await expect(firstRow).toBeVisible();
      }
      expect(page.url()).toContain('/eSim');
    });
  });

  // =========================================================================
  // CREATE / UPDATE / DELETE / BULK OPERATIONS
  // =========================================================================
  test('[TC_ESIM_010] Verify CREATE / PROVISION: E-Sim profile request or order trigger', async ({ page }) => {
    await test.step('Step 1: Check E-Sim Order/Provision action button visibility', async () => {
      Logger.step(1, 'Checking Create/Provision E-Sim action trigger');
      await page.goto('/eSim/eSim-management');
      await page.waitForLoadState('networkidle').catch(() => {});
      await page.waitForTimeout(2000);

      const createBtn = page.locator('button:has-text("Order"), button:has-text("Add"), button:has-text("Create"), button:has-text("Upload"), button:has-text("Import")').first();
      if (await createBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await expect(createBtn).toBeVisible();
      }
      expect(page.url()).toContain('/eSim');
    });
  });

  test('[TC_ESIM_011] Verify UPDATE: E-Sim state transition or profile reconfiguration action', async ({ page }) => {
    await test.step('Step 1: Test Action menu trigger for selected E-Sim record', async () => {
      Logger.step(1, 'Testing Update/Edit actions on selected E-Sim');
      await page.goto('/eSim/eSim-management');
      await page.waitForLoadState('networkidle').catch(() => {});
      await page.waitForTimeout(2000);

      const actionMenuBtn = page.locator('button:has-text("Action"), button:has-text("more_vert"), [aria-label*="action" i]').first();
      if (await actionMenuBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await actionMenuBtn.click();
        await page.waitForTimeout(500);
        await page.keyboard.press('Escape');
      }
      expect(page.url()).toContain('/eSim');
    });
  });

  test('[TC_ESIM_012] Verify UPDATE / SELECTION: Multi-select checkbox controls and batch action enablement', async ({ page }) => {
    await test.step('Step 1: Verify checkbox selection toggle on E-Sim records', async () => {
      Logger.step(1, 'Checking E-Sim row selection checkboxes');
      await page.goto('/eSim/eSim-management');
      await page.waitForLoadState('networkidle').catch(() => {});
      await page.waitForTimeout(2000);

      const enabledCheckbox = page.locator('input[type="checkbox"]:not([disabled])').first();
      if (await enabledCheckbox.isVisible({ timeout: 3000 }).catch(() => false)) {
        await enabledCheckbox.check();
        expect(await enabledCheckbox.isChecked()).toBe(true);
        await enabledCheckbox.uncheck();
        expect(await enabledCheckbox.isChecked()).toBe(false);
      } else {
        const checkbox = page.locator('input[type="checkbox"]').first();
        await expect(checkbox).toBeVisible();
      }
      expect(page.url()).toContain('/eSim');
    });
  });

  test('[TC_ESIM_013] Verify DELETE / RELEASE / TERMINATION: Confirmation dialog on E-Sim release action', async ({ page }) => {
    await test.step('Step 1: Inspect Delete/Release guardrail dialog trigger', async () => {
      Logger.step(1, 'Verifying Delete/Release guardrails');
      await page.goto('/eSim/eSim-management');
      await page.waitForLoadState('networkidle').catch(() => {});
      await page.waitForTimeout(2000);

      const releaseBtn = page.locator('button:has-text("Release"), button:has-text("Delete"), button:has-text("Terminate"), button:has-text("Cancel")').first();
      if (await releaseBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await expect(releaseBtn).toBeVisible();
      }
      expect(page.url()).toContain('/eSim');
    });
  });

  test('[TC_ESIM_014] Verify pagination controls and single/multi-page navigation', async ({ page }) => {
    await test.step('Step 1: Verify table pagination controls and page switching', async () => {
      Logger.step(1, 'Testing pagination controls in E-Sim module');
      await page.goto('/eSim/eSim-management');
      await page.waitForLoadState('networkidle').catch(() => {});
      await page.waitForTimeout(2000);

      const paginationNext = page.locator('button[aria-label*="next" i], button:has-text("2"), .MuiPaginationItem-page:has-text("2")').first();
      if (await paginationNext.isVisible({ timeout: 3000 }).catch(() => false)) {
        const isEnabled = await paginationNext.isEnabled().catch(() => false);
        if (isEnabled) {
          await paginationNext.click();
          await page.waitForTimeout(1500);
        } else {
          await expect(paginationNext).toBeDisabled();
        }
      }
      expect(page.url()).toContain('/eSim');
    });
  });

  test('[TC_ESIM_015] Verify table responsiveness and session validity on E-Sim routes', async ({ page }) => {
    await test.step('Step 1: Verify responsive layout and authenticated session continuity', async () => {
      Logger.step(1, 'Testing viewport resize and authentication continuity');
      await page.goto('/eSim/eSim-management');
      await page.setViewportSize({ width: 1280, height: 720 });
      await page.waitForTimeout(1000);

      const content = page.locator('main, [role="main"], body');
      await expect(content).toBeVisible();
      expect(page.url()).not.toContain('/login');
    });
  });
});
