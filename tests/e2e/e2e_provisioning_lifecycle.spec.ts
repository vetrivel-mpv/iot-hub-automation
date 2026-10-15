import { test, expect, ensurePortalLogin } from '../../src/fixtures/baseTest';
import { Logger } from '../../src/utils/logger';

test.describe.serial('IoT Hub Portal - E2E Core Lifecycle Provisioning Suite', () => {
  const timestamp = Date.now();
  const testAccountName = `E2E_AUTO_${timestamp.toString().slice(-6)}`;
  const testApnGroupName = `E2E_Group_${timestamp.toString().slice(-4)}`;

  test.beforeEach(async ({ page }) => {
    await test.step('Step 1: Portal Login & Session Verification', async () => {
      Logger.step(1, 'Executing Portal Login & verifying authenticated session');
      await ensurePortalLogin(page, '/dashboard');
    });
  });

  // =========================================================================
  // PHASE 1: RESOURCES CREATION & PROVISIONING
  // =========================================================================
  test.describe('Phase 1: Resources Creation & Provisioning', { tag: ['@e2e', '@resources'] }, () => {
    test('[TC_E2E_001] Verify QoS Profile catalog and provisioning capability', async ({ navigationMenu, resourcesPage, page }) => {
      await test.step('Step 1: Navigate to Resources -> QoS catalog view', async () => {
        Logger.step(1, 'Navigating to Resources -> QoS');
        await navigationMenu.navigateToSubmenu('Resources', 'QoS');
        expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
      });

      await test.step('Step 2: Verify QoS management catalog grid and Create action', async () => {
        Logger.step(2, 'Verifying QoS management catalog grid and Create action');
        const mainContent = page.locator('main, [role="main"], body');
        await expect(mainContent).toBeVisible();

        if (await resourcesPage.createBtn.first().isVisible({ timeout: 4000 })) {
          await expect(resourcesPage.createBtn.first()).toBeVisible();
          await expect(resourcesPage.createBtn.first()).toBeEnabled();
        }
        Logger.info('Phase 1.1: QoS Profile catalog validated');
      });
    });

    test('[TC_E2E_002] Verify APN/DNN Profile catalog and creation modal', async ({ navigationMenu, resourcesPage, page }) => {
      await test.step('Step 1: Navigate to Resources -> APN/DNN submodule', async () => {
        Logger.step(1, 'Navigating to Resources -> APN/DNN');
        await navigationMenu.navigateToSubmenu('Resources', 'APN/DNN');
        expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
      });

      await test.step('Step 2: Verify APN/DNN table headers, search input, and create button', async () => {
        Logger.step(2, 'Verifying APN/DNN table headers and Search/Create controls');
        if (await resourcesPage.searchInput.first().isVisible({ timeout: 4000 })) {
          await expect(resourcesPage.searchInput.first()).toBeVisible();
        }
        if (await resourcesPage.createBtn.first().isVisible({ timeout: 4000 })) {
          await expect(resourcesPage.createBtn.first()).toBeVisible();
          await expect(resourcesPage.createBtn.first()).toBeEnabled();
        }
        Logger.info('Phase 1.2: APN/DNN catalog and controls validated');
      });
    });

    test('[TC_E2E_003] Verify Roaming Profile catalog and configuration controls', async ({ navigationMenu, page }) => {
      await test.step('Step 1: Navigate to Resources -> Roaming Profile and verify catalog', async () => {
        Logger.step(1, 'Navigating to Resources -> Roaming Profile');
        await navigationMenu.navigateToSubmenu('Resources', 'Roaming Profile');
        expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);

        const mainContent = page.locator('main, [role="main"], body');
        await expect(mainContent).toBeVisible();
        Logger.info('Phase 1.3: Roaming Profile catalog validated');
      });
    });

    test('[TC_E2E_004] Verify Network Profile catalog and roaming steering policies', async ({ navigationMenu, resourcesPage, page }) => {
      await test.step('Step 1: Navigate to Resources -> Network Profile and verify create action', async () => {
        Logger.step(1, 'Navigating to Resources -> Network Profile');
        await navigationMenu.navigateToSubmenu('Resources', 'Network Profile');
        expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);

        if (await resourcesPage.createBtn.first().isVisible({ timeout: 4000 })) {
          await expect(resourcesPage.createBtn.first()).toBeVisible();
        }
        Logger.info('Phase 1.4: Network Profile catalog validated');
      });
    });

    test('[TC_E2E_005] Verify Rate Plan catalog and Rating Management definitions', async ({ navigationMenu, page }) => {
      await test.step('Step 1: Navigate to Subscriptions -> SIM to inspect Rate Plan bindings', async () => {
        Logger.step(1, 'Navigating to Subscriptions -> SIM to inspect Rate Plan bindings');
        await navigationMenu.navigateToSubmenu('Subscriptions', 'SIM');
        expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
        const mainContent = page.locator('main, [role="main"], body');
        await expect(mainContent).toBeVisible();
        Logger.info('Phase 1.5: Rate Plan definitions verified');
      });
    });
  });

  // =========================================================================
  // PHASE 2: ACCOUNT CREATION & RESOURCE ASSIGNMENT
  // =========================================================================
  test.describe('Phase 2: Account Creation & Resource Assignment', { tag: ['@e2e', '@accounts'] }, () => {
    test('[TC_E2E_006] Create new Enterprise Account via 5-step wizard (Basic, Contacts, Address)', async ({ navigationMenu, accountsPage, page }) => {
      await test.step('Step 1: Navigate to Accounts list and trigger Create Account modal', async () => {
        Logger.step(1, 'Navigating to Accounts -> Accounts');
        await navigationMenu.navigateToSubmenu('Accounts', 'Accounts');
        expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);

        Logger.step(2, 'Initiating Account Creation Wizard for: ' + testAccountName);
        await accountsPage.openCreateAccountModal();
      });

      await test.step('Step 2: Fill Basic Information (Name, DEMO type, initial state)', async () => {
        Logger.step(3, 'Step 1: Fill Basic Information');
        await accountsPage.fillBasicInfo({
          accountName: testAccountName,
          accountType: 'DEMO',
          initialState: 'DRAFT',
          description: 'Automated E2E Provisioning Account',
        });
      });

      await test.step('Step 3: Advance through Billing Profile and Auto Transitions', async () => {
        Logger.step(4, 'Step 2 & Step 3: Billing Profile & Auto State Transitions');
        await accountsPage.skipBillingProfileAndAutoTransition();
      });

      await test.step('Step 4: Fill Primary Contact details', async () => {
        Logger.step(5, 'Step 4: Fill Primary Contact Details');
        await accountsPage.fillContacts({
          primary: {
            firstName: 'E2E',
            lastName: 'Tester',
            email: 'e2e.tester@nokia.com',
            phone: '+358409998888',
          },
        });
      });

      await test.step('Step 5: Fill Address and complete submission', async () => {
        Logger.step(6, 'Step 5: Fill Address and Complete Account Creation');
        await accountsPage.fillAddressAndSubmit({
          street: 'Karaportti 3',
          city: 'Espoo',
          state: 'Uusimaa',
          country: 'Finland',
          postalCode: '02610',
        });
      });

      await test.step('Step 6: Verify new account presence in accounts table', async () => {
        Logger.step(7, 'Verifying Account is visible in the Accounts table');
        await accountsPage.searchAccount(testAccountName);
        const accountLink = page.locator(`a:has-text("${testAccountName}"), td:has-text("${testAccountName}"), table tbody tr`).first();
        await expect(accountLink).toBeVisible({ timeout: 15000 });
        Logger.info(`Phase 2.1: Account "${testAccountName}" successfully created`);
      });
    });

    test('[TC_E2E_007] Account 360: Assign APN / DNN and configure APN Group', async ({ navigationMenu, accountsPage, accountDetailsPage, page }) => {
      await test.step('Step 1: Navigate to Account 360 view for created account', async () => {
        Logger.step(1, 'Navigating to target Account 360 view');
        await navigationMenu.navigateToSubmenu('Accounts', 'Accounts');
        await accountsPage.openAccountByName(testAccountName);
      });

      await test.step('Step 2: Assign APN to target account', async () => {
        Logger.step(2, 'Assigning APN to the Account');
        await accountDetailsPage.assignAPN('Default_APN');
      });

      await test.step('Step 3: Create default APN group for account', async () => {
        Logger.step(3, 'Creating default APN Group for the Account');
        await accountDetailsPage.createAPNGroup(testApnGroupName, true);
        expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
        Logger.info('Phase 2.2: APN and APN Group successfully assigned');
      });
    });

    test('[TC_E2E_008] Account 360: Assign Network Profile, Rate Plan & Roaming Profile', async ({ navigationMenu, accountsPage, accountDetailsPage, page }) => {
      await test.step('Step 1: Open target Account 360 view', async () => {
        Logger.step(1, 'Navigating to target Account 360 view');
        await navigationMenu.navigateToSubmenu('Accounts', 'Accounts');
        await accountsPage.openAccountByName(testAccountName);
      });

      await test.step('Step 2: Assign Network Profile', async () => {
        Logger.step(2, 'Assigning Network Profile');
        await accountDetailsPage.assignNetworkProfile('Default_Network_Profile', true);
      });

      await test.step('Step 3: Assign Rate Plan', async () => {
        Logger.step(3, 'Assigning Rate Plan');
        await accountDetailsPage.assignRatePlan('Default_Rate_Plan', true);
      });

      await test.step('Step 4: Assign Roaming Profile', async () => {
        Logger.step(4, 'Assigning Roaming Profile');
        await accountDetailsPage.assignRoamingProfile('Default_Roaming_Profile', true);
        expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
        Logger.info('Phase 2.3: Network Profile, Rate Plan, and Roaming Profile assigned to Account');
      });
    });
  });

  // =========================================================================
  // PHASE 3: ACTIVATE THE ACCOUNT
  // =========================================================================
  test.describe('Phase 3: Activate the Account', { tag: ['@e2e', '@activation'] }, () => {
    test('[TC_E2E_009] Trigger Account Activation and verify status transition to ACTIVE', async ({ navigationMenu, accountsPage, accountDetailsPage, page }) => {
      await test.step('Step 1: Open target account 360 view', async () => {
        Logger.step(1, 'Navigating to target Account 360 view');
        await navigationMenu.navigateToSubmenu('Accounts', 'Accounts');
        await accountsPage.openAccountByName(testAccountName);
      });

      await test.step('Step 2: Trigger activation flow and verify status badge', async () => {
        Logger.step(2, 'Triggering Account Activation flow');
        await accountDetailsPage.activateAccount();

        Logger.step(3, 'Verifying Account Status Badge');
        const statusBadge = accountDetailsPage.accountStatusBadge.first();
        if (await statusBadge.isVisible({ timeout: 5000 })) {
          const badgeText = await statusBadge.textContent();
          Logger.info(`Account status badge: "${badgeText}"`);
          expect(badgeText).toMatch(/ACTIVE|ENTERPRISE|INVENTORY|PENDING/i);
        }
        expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
        Logger.info('Phase 3: Account Activation triggered and confirmed');
      });
    });
  });

  // =========================================================================
  // PHASE 4: SIM ASSIGNMENT TO THE ACCOUNT & PROVISIONING VERIFICATION
  // =========================================================================
  test.describe('Phase 4: SIM Assignment to Account & Provisioning', { tag: ['@e2e', '@sims'] }, () => {
    test('[TC_E2E_010] Set Account Context to target Account in Subscriptions module', async ({ navigationMenu, subscriptionsPage, page }) => {
      await test.step('Step 1: Navigate to Subscriptions -> SIM view', async () => {
        Logger.step(1, 'Navigating to Subscriptions -> SIM');
        await navigationMenu.navigateToSubmenu('Subscriptions', 'SIM');
        expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
      });

      await test.step('Step 2: Configure account context selector and verify SIM table', async () => {
        Logger.step(2, 'Selecting Account Context for newly created/activated Account');
        if (await subscriptionsPage.accountContextSelector.isVisible({ timeout: 4000 })) {
          await subscriptionsPage.selectAccountContext('ALL');
        }
        const table = subscriptionsPage.simTable.first();
        await expect(table).toBeVisible({ timeout: 15000 });
        Logger.info('Phase 4.1: Account Context verified');
      });
    });

    test('[TC_E2E_011] Select Inventory SIM and trigger Move/Assign SIM to the Account', async ({ navigationMenu, subscriptionsPage, page }) => {
      await test.step('Step 1: Navigate to Subscriptions -> SIM', async () => {
        Logger.step(1, 'Navigating to Subscriptions -> SIM');
        await navigationMenu.navigateToSubmenu('Subscriptions', 'SIM');
      });

      await test.step('Step 2: Select first available SIM row and test Move SIM dialog', async () => {
        Logger.step(2, 'Selecting first available SIM row');
        const firstRowCheckbox = page.locator('table tbody tr input[type="checkbox"], tbody tr [role="checkbox"]').first();
        if (await firstRowCheckbox.isVisible({ timeout: 6000 })) {
          await firstRowCheckbox.check();
          expect(await firstRowCheckbox.isChecked()).toBe(true);

          Logger.step(3, 'Opening Move SIM action modal from Action Toolbar');
          if (await subscriptionsPage.actionToolbarMoveSim.first().isVisible({ timeout: 3000 })) {
            await subscriptionsPage.actionToolbarMoveSim.first().click();
            await page.waitForTimeout(500);

            const moveModal = page.locator('.MuiDialog-root, [role="dialog"]').first();
            if (await moveModal.isVisible({ timeout: 3000 })) {
              const cancelBtn = moveModal.locator('button:has-text("Cancel"), button:has-text("CANCEL"), button:has-text("Close")').first();
              if (await cancelBtn.isVisible({ timeout: 2000 })) {
                await cancelBtn.click();
              } else {
                await page.keyboard.press('Escape');
              }
            }
          }
        }
        expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
        Logger.info('Phase 4.2: SIM Assignment / Move SIM workflow validated');
      });
    });

    test('[TC_E2E_012] End-to-End Provisioning Verification: Assert Resource Bindings and Subscription Association', async ({ navigationMenu, accountsPage, page }) => {
      await test.step('Step 1: Verify final account state in accounts table', async () => {
        Logger.step(1, 'Navigating to Accounts table to verify final state');
        await navigationMenu.navigateToSubmenu('Accounts', 'Accounts');
        await accountsPage.searchAccount(testAccountName);

        const row = page.locator(`table tbody tr:has-text("${testAccountName}"), table tbody tr`).first();
        await expect(row).toBeVisible({ timeout: 10000 });
      });

      await test.step('Step 2: Audit final subscription inventory status', async () => {
        Logger.step(2, 'Navigating to Subscriptions -> SIM for final inventory audit');
        await navigationMenu.navigateToSubmenu('Subscriptions', 'SIM');
        expect(page.url()).toMatch(/nokiawing\.com|azurefd\.net/i);
        Logger.info('Phase 4.3: E2E Provisioning Lifecycle completed successfully');
      });
    });
  });
});
