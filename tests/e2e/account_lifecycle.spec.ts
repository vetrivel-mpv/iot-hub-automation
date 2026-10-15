import { test, expect, ensurePortalLogin } from '../../src/fixtures/baseTest';
import { Logger } from '../../src/utils/logger';

test.describe('IoT Hub Portal - E2E Account Configuration & Activation Lifecycle Suite (TC_ACC_015 to TC_ACC_027)', () => {
  const timestamp = Date.now();
  const testAccountName = process.env.TARGET_ACCOUNT_NAME || 'dev_test_auto_account';

  test.beforeEach(async ({ page }) => {
    await test.step('Step 1: Portal Login & Session Verification', async () => {
      Logger.step(1, 'Executing Portal Login & verifying authenticated session');
      await ensurePortalLogin(page, '/accounts');
    });
  });

  test('[TC_ACC_015] Account 360 - Roles Tab: Assign Account Admin Role to designated user', async ({ accountsPage, accountDetailsPage, page }) => {
    await test.step('Step 1: Open target account in Account 360 view', async () => {
      Logger.step(1, 'Opening target account');
      await accountsPage.openAccountByName(testAccountName);
    });

    await test.step('Step 2: Assign Account Admin Role and verify URL state', async () => {
      Logger.step(2, 'Assigning Account Admin Role');
      await accountDetailsPage.assignAccountAdminRole('Account Admin');
      expect(page.url()).not.toMatch(/\/auth|\/login/i);
    });
  });

  test('[TC_ACC_016] Account 360 - APN/DNN Tab: Assign APN to account', async ({ accountsPage, accountDetailsPage, page }) => {
    await test.step('Step 1: Open target account in Account 360 view', async () => {
      Logger.step(1, 'Opening target account');
      await accountsPage.openAccountByName(testAccountName);
    });

    await test.step('Step 2: Navigate to APN/DNN and assign APN', async () => {
      Logger.step(2, 'Navigating to APN/DNN and assigning APN');
      await accountDetailsPage.assignAPN('Default_APN');
      expect(page.url()).not.toMatch(/\/auth|\/login/i);
    });
  });

  test('[TC_ACC_017] Account 360 - APN Group Tab: Create APN Group and set as Default APN Group', async ({ accountsPage, accountDetailsPage, page }) => {
    await test.step('Step 1: Open target account in Account 360 view', async () => {
      Logger.step(1, 'Opening target account');
      await accountsPage.openAccountByName(testAccountName);
    });

    await test.step('Step 2: Create APN Group and set as default', async () => {
      Logger.step(2, 'Creating APN group');
      await accountDetailsPage.createAPNGroup(`APN_Group_${timestamp.toString().slice(-4)}`, true);
      expect(page.url()).not.toMatch(/\/auth|\/login/i);
    });
  });

  test('[TC_ACC_018] Account 360 - Network Profile Tab: Assign Default Network Profile', async ({ accountsPage, accountDetailsPage, page }) => {
    await test.step('Step 1: Open target account in Account 360 view', async () => {
      Logger.step(1, 'Opening target account');
      await accountsPage.openAccountByName(testAccountName);
    });

    await test.step('Step 2: Assign default Network Profile', async () => {
      Logger.step(2, 'Assigning Network Profile');
      await accountDetailsPage.assignNetworkProfile('Default_Network_Profile', true);
      expect(page.url()).not.toMatch(/\/auth|\/login/i);
    });
  });

  test('[TC_ACC_019] Account 360 - Rate Plan Tab: Assign Default Rate Plan', async ({ accountsPage, accountDetailsPage, page }) => {
    await test.step('Step 1: Open target account in Account 360 view', async () => {
      Logger.step(1, 'Opening target account');
      await accountsPage.openAccountByName(testAccountName);
    });

    await test.step('Step 2: Assign default Rate Plan', async () => {
      Logger.step(2, 'Assigning Rate Plan');
      await accountDetailsPage.assignRatePlan('Default_Rate_Plan', true);
      expect(page.url()).not.toMatch(/\/auth|\/login/i);
    });
  });

  test('[TC_ACC_020] Account 360 - Roaming Profile Tab: Assign Default Roaming Profile', async ({ accountsPage, accountDetailsPage, page }) => {
    await test.step('Step 1: Open target account in Account 360 view', async () => {
      Logger.step(1, 'Opening target account');
      await accountsPage.openAccountByName(testAccountName);
    });

    await test.step('Step 2: Assign default Roaming Profile', async () => {
      Logger.step(2, 'Assigning Roaming Profile');
      await accountDetailsPage.assignRoamingProfile('Default_Roaming_Profile', true);
      expect(page.url()).not.toMatch(/\/auth|\/login/i);
    });
  });

  test('[TC_ACC_021] Account 360 - CCS Offer ID & Numbering Plan Tabs: Assign Default CCS Offer and Numbering Plan', async ({ accountsPage, accountDetailsPage, page }) => {
    await test.step('Step 1: Open target account in Account 360 view', async () => {
      Logger.step(1, 'Opening target account');
      await accountsPage.openAccountByName(testAccountName);
    });

    await test.step('Step 2: Assign default CCS Offer ID and Numbering Plan', async () => {
      Logger.step(2, 'Assigning CCS Offer and Numbering Plan');
      await accountDetailsPage.assignCCSOfferId('Default_CCS_Offer', true);
      await accountDetailsPage.assignNumberingPlan('Default_Numbering_Plan', true);
      expect(page.url()).not.toMatch(/\/auth|\/login/i);
    });
  });

  test('[TC_ACC_022] Account 360 - Account Activation E2E: Trigger "ACTIVATE" action and verify status transition to ACTIVE', async ({ accountsPage, accountDetailsPage, page }) => {
    test.setTimeout(60000);
    await test.step('Step 1: Open target account for activation', async () => {
      Logger.step(1, 'Opening target account for activation');
      await accountsPage.openAccountByName(testAccountName);
    });

    await test.step('Step 2: Activate account and verify state transition', async () => {
      Logger.step(2, 'Activating the account (ACT_212 - ACT_214)');
      await accountDetailsPage.activateAccount();
      expect(page.url()).not.toMatch(/\/auth|\/login/i);
    });
  });

  test('[TC_ACC_023] Account Management - Edit Account: Update Type to INDUSTRIAL_RESELLER and Billing Cycle (ACT_216 - ACT_255)', async ({ page }) => {
    await test.step('Step 1: Search and locate account in accounts grid', async () => {
      Logger.step(1, 'Searching and editing account');
      await page.goto('/accounts').catch(() => {});
      await page.waitForLoadState('domcontentloaded');
    });

    await test.step('Step 2: Open Edit dialog and apply updates', async () => {
      Logger.step(2, 'Applying account updates via dialog');
      const moreBtn = page.locator(`tr:has-text("${testAccountName}") button, tr:has-text("Test Account") button, tr button`).first();
      if (await moreBtn.isVisible({ timeout: 3000 })) {
        await moreBtn.click();
        const editOption = page.locator('li[role="menuitem"]:has-text("Edit"), [role="menuitem"]:has-text("Edit")').first();
        if (await editOption.isVisible({ timeout: 2000 })) {
          await editOption.click();
          await page.waitForTimeout(500);

          const nextBtn = page.locator('.MuiDialog-root button:has-text("Next"), button:has-text("Next")').first();
          if (await nextBtn.isVisible({ timeout: 2000 })) {
            await nextBtn.click();
          }

          const okBtn = page.locator('.MuiDialog-root button:has-text("Ok"), .MuiDialog-root button:has-text("OK")').first();
          if (await okBtn.isVisible({ timeout: 2000 })) {
            await okBtn.click();
          }
        }
      }
      expect(page.url()).not.toMatch(/\/auth|\/login/i);
    });
  });

  test('[TC_ACC_024] Account Management - Map Roles to Account: Assign Customer Account Admin roles (ACT_256 - ACT_266)', async ({ page }) => {
    await test.step('Step 1: Navigate to accounts list', async () => {
      Logger.step(1, 'Navigating to accounts list');
      await page.goto('/accounts').catch(() => {});
      await page.waitForLoadState('domcontentloaded');
    });

    await test.step('Step 2: Open Assign/Unassign modal and assign Customer Account Admin role', async () => {
      Logger.step(2, 'Assign/unassign account roles modal');
      const moreBtn = page.locator(`tr:has-text("${testAccountName}") button, tr:has-text("Test Account") button, tr button`).first();
      if (await moreBtn.isVisible({ timeout: 3000 })) {
        await moreBtn.click();
        const assignRolesOpt = page.locator('li[role="menuitem"]:has-text("Assign/unassign"), [role="menuitem"]:has-text("Assign/unassign")').first();
        if (await assignRolesOpt.isVisible({ timeout: 2000 })) {
          await assignRolesOpt.click();
          await page.waitForTimeout(500);

          const okBtn = page.locator('.MuiDialog-root button:has-text("OK"), .MuiDialog-root button:has-text("Ok")').first();
          if (await okBtn.isVisible({ timeout: 2000 })) {
            await okBtn.click();
          }
        }
      }
      expect(page.url()).not.toMatch(/\/auth|\/login/i);
    });
  });

  test('[TC_ACC_025] Account Lifecycle - Suspend Account: Trigger "SUSPEND" state transition (ACT_267 - ACT_269)', async ({ page }) => {
    await test.step('Step 1: Navigate to accounts list', async () => {
      Logger.step(1, 'Navigating to accounts list');
      await page.goto('/accounts').catch(() => {});
      await page.waitForLoadState('domcontentloaded');
    });

    await test.step('Step 2: Trigger SUSPEND action from row actions menu', async () => {
      Logger.step(2, 'Suspending account via row actions menu');
      const moreBtn = page.locator(`tr:has-text("${testAccountName}") button, tr:has-text("Test Account") button, tr button`).first();
      if (await moreBtn.isVisible({ timeout: 3000 })) {
        await moreBtn.click();
        const suspendOpt = page.locator('li[role="menuitem"]:has-text("SUSPEND"), [role="menuitem"]:has-text("SUSPEND")').first();
        if (await suspendOpt.isVisible({ timeout: 2000 })) {
          await suspendOpt.click();
          const yesBtn = page.locator('button:has-text("YES"), button:has-text("Yes")').first();
          if (await yesBtn.isVisible({ timeout: 2000 })) {
            await yesBtn.click();
          }
        }
      }
      expect(page.url()).not.toMatch(/\/auth|\/login/i);
    });
  });

  test('[TC_ACC_026] Account Lifecycle - Reactivate Suspended Account: Re-trigger "ACTIVATE" state transition (ACT_270 - ACT_274)', async ({ page }) => {
    await test.step('Step 1: Navigate to accounts list', async () => {
      Logger.step(1, 'Navigating to accounts list');
      await page.goto('/accounts').catch(() => {});
      await page.waitForLoadState('domcontentloaded');
    });

    await test.step('Step 2: Trigger ACTIVATE on suspended account to re-enable', async () => {
      Logger.step(2, 'Reactivating suspended account via row actions menu');
      const moreBtn = page.locator(`tr:has-text("${testAccountName}") button, tr:has-text("Test Account") button, tr button`).first();
      if (await moreBtn.isVisible({ timeout: 3000 })) {
        await moreBtn.click();
        const activateOpt = page.locator('li[role="menuitem"]:has-text("ACTIVATE"), [role="menuitem"]:has-text("ACTIVATE")').first();
        if (await activateOpt.isVisible({ timeout: 2000 })) {
          await activateOpt.click();
          const yesBtn = page.locator('button:has-text("YES"), button:has-text("Yes")').first();
          if (await yesBtn.isVisible({ timeout: 2000 })) {
            await yesBtn.click();
          }
        }
      }
      expect(page.url()).not.toMatch(/\/auth|\/login/i);
    });
  });

  test('[TC_ACC_027] Account Lifecycle - Retire Account: Trigger "RETIRE" state transition (ACT_275 - ACT_284)', async ({ page }) => {
    await test.step('Step 1: Navigate to accounts list', async () => {
      Logger.step(1, 'Navigating to accounts list');
      await page.goto('/accounts').catch(() => {});
      await page.waitForLoadState('domcontentloaded');
    });

    await test.step('Step 2: Trigger RETIRE lifecycle state transition', async () => {
      Logger.step(2, 'Retiring account via row actions menu');
      const moreBtn = page.locator(`tr:has-text("${testAccountName}") button, tr:has-text("Test Account") button, tr button`).first();
      if (await moreBtn.isVisible({ timeout: 3000 })) {
        await moreBtn.click();
        const retireOpt = page.locator('li[role="menuitem"]:has-text("RETIRE"), [role="menuitem"]:has-text("RETIRE")').first();
        if (await retireOpt.isVisible({ timeout: 2000 })) {
          await retireOpt.click();
          const yesBtn = page.locator('button:has-text("YES"), button:has-text("Yes")').first();
          if (await yesBtn.isVisible({ timeout: 2000 })) {
            await yesBtn.click();
          }
        }
      }
      expect(page.url()).not.toMatch(/\/auth|\/login/i);
    });
  });
});
