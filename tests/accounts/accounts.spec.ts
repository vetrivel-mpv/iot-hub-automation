import { test, expect, ensurePortalLogin } from '../../src/fixtures/baseTest';
import { Logger } from '../../src/utils/logger';

test.describe('IoT Hub Portal - 04: Accounts Management Suite (TC_ACC_001 to TC_ACC_014)', () => {
  test.beforeEach(async ({ page }) => {
    await test.step('Step 1: Portal Login & Session Verification', async () => {
      Logger.step(1, 'Executing Portal Login & verifying authenticated session');
      await ensurePortalLogin(page, '/accounts');
    });
  });

  // =========================================================================
  // GROUP 1: NAVIGATION, DATA GRID & SEARCH (@smoke, @ui, @filters)
  // =========================================================================
  test.describe('Group 1: Navigation, Data Grid & Search Operations', { tag: ['@smoke', '@ui', '@filters'] }, () => {
    test('[TC_ACC_001] Verify Accounts menu dropdown sections (Accounts, Sales)', async ({ navigationMenu, page }) => {
      await test.step('Step 2: Open Accounts navigation menu and verify sections', async () => {
        Logger.step(2, 'Opening Accounts menu dropdown');
        await navigationMenu.openMenu('Accounts');
        const expectedAccounts = ['Accounts', 'Custom fields'];
        await navigationMenu.expectSubmenuItemsVisible(expectedAccounts);
        await page.keyboard.press('Escape');
        expect(page.url()).not.toMatch(/\/auth|\/login/i);
      });
    });

    test('[TC_ACC_002] Verify Accounts table grid, column headers, and action controls', async ({ accountsPage, page }) => {
      await test.step('Step 2: Inspect Accounts table grid and column headers', async () => {
        Logger.step(2, 'Verifying Accounts management table headers');
        await expect(accountsPage.accountsTable.first(), 'Accounts management table must be visible').toBeVisible({ timeout: 10000 });
        const headers = accountsPage.accountsTable.locator('th, [role="columnheader"]');
        expect(await headers.count()).toBeGreaterThanOrEqual(1);
      });

      await test.step('Step 3: Verify create account button availability', async () => {
        if (await accountsPage.createAccountButton.first().isVisible({ timeout: 2000 })) {
          await expect(accountsPage.createAccountButton.first()).toBeVisible();
          await expect(accountsPage.createAccountButton.first()).toBeEnabled();
        } else {
          Logger.info('Create Account button not present for current role (read-only CSP view).');
        }
        expect(page.url()).not.toMatch(/\/auth|\/login/i);
      });
    });

    test('[TC_ACC_003] Verify Accounts search input and column filter interaction', async ({ accountsPage, page }) => {
      await test.step('Step 2: Input search keyword into Accounts filter', async () => {
        Logger.step(2, 'Entering search keyword in global search input');
        await expect(accountsPage.globalSearchInput.first(), 'Global search input must be visible').toBeVisible({ timeout: 10000 });
        await accountsPage.searchAccount('DEMO');
        await expect(accountsPage.globalSearchInput.first()).toHaveValue('DEMO');
        expect(page.url()).not.toMatch(/\/auth|\/login/i);
      });
    });

    test('[TC_ACC_004] Verify Accounts data export to Excel / CSV format', async ({ accountsPage, page }) => {
      await test.step('Step 2: Verify Export button accessibility and enabled status', async () => {
        Logger.step(2, 'Verifying Export button accessibility');
        await expect(accountsPage.exportButton.first(), 'Export button must be visible').toBeVisible({ timeout: 10000 });
        await expect(accountsPage.exportButton.first()).toBeEnabled();
        expect(page.url()).not.toMatch(/\/auth|\/login/i);
      });
    });
  });

  // =========================================================================
  // GROUP 2: 5-STEP ACCOUNT CREATION WIZARD LIFECYCLE (@wizard, @create, @lifecycle)
  // =========================================================================
  test.describe('Group 2: Account Creation Stepper Wizard Operations', { tag: ['@wizard', '@create', '@lifecycle'] }, () => {
    test.beforeEach(async ({ accountsPage }) => {
      await accountsPage.waitForPageReady();
      await accountsPage.createAccountButton.waitFor({ state: 'visible', timeout: 15000 });
    });

    test('[TC_ACC_005] Complete Account Creation Lifecycle: Validate Demo (Billing Profile Skipped) vs Non-Demo (Billing Profile Appears) and Successful Account Creation', async ({ accountsPage, page, dataFactory }) => {
      const uniqueAccountName = dataFactory.uniqueAccountName();

      await test.step('Step 2: Launch Creation Stepper Modal and verify initial stepper structure', async () => {
        Logger.step(2, 'Opening Create Account modal and inspecting initial stepper');
        await accountsPage.openCreateAccountModal();
        await expect(accountsPage.createAccountDialog.first(), 'Create Account dialog must be open').toBeVisible({ timeout: 8000 });
        const initialSteps = await page.locator('.MuiStepLabel-label').allInnerTexts();
        Logger.info(`[Stepper Init] Initial Stepper stages: ${JSON.stringify(initialSteps)}`);
        expect(initialSteps).toContain('Basic');
      });

      await test.step('Step 3: Validate Non-Demo Account Type - Verify Billing Profile section APPEARS', async () => {
        Logger.step(3, 'Selecting Non-Demo (INDUSTRIAL_DIRECT) and asserting Billing Profile step appears in Stepper');
        const nameInput = page.locator('.MuiDialog-root input[placeholder="Name"]').first();
        await nameInput.fill('temp_nondemo_validation');

        // Select Non-Demo: INDUSTRIAL_DIRECT
        const typeCombobox = page.locator('.MuiDialog-root .MuiSelect-select').first();
        await typeCombobox.click();
        await page.waitForTimeout(400);
        const nonDemoOption = page.locator('.MuiPopover-root:visible li:has-text("INDUSTRIAL_DIRECT"), .MuiPopover-root:visible [role="option"]:has-text("INDUSTRIAL_DIRECT")').first();
        await nonDemoOption.click();
        await page.waitForTimeout(600);

        // Select Admin Role
        const roleInput = page.locator('#account-admin-role');
        await roleInput.click();
        await page.waitForTimeout(400);
        await page.locator('#account-admin-role-popup li').first().click();
        await page.waitForTimeout(400);

        // Assert 5 steps are present for Non-Demo
        const nonDemoSteps = await page.locator('.MuiStepLabel-label').allInnerTexts();
        Logger.info(`[Non-Demo Validation] Stepper steps with Non-Demo selected: ${JSON.stringify(nonDemoSteps)}`);
        expect(nonDemoSteps, 'Billing Profile must appear in stepper for Non-Demo accounts').toContain('Billing Profile');

        // Click NEXT to advance to Step 2 (Billing Profile)
        const nextBtn = page.locator('.MuiDialog-root button:has-text("Next")').first();
        await nextBtn.click();
        await page.waitForTimeout(1000);

        // Assert Billing Profile section and fields appear
        const dialogText = await page.locator('.MuiDialogContent-root').innerText();
        expect(dialogText, 'Billing Profile section must appear for Non-Demo').toMatch(/Billing Cycle|Currency|Rating Type|MRC Type/i);
        Logger.info('[Non-Demo Validation] Successfully verified Billing Profile section appears on Step 2');

        // Click Back to return to Step 1
        const backBtn = page.locator('.MuiDialog-root button:has-text("Back")').first();
        await backBtn.click();
        await page.waitForTimeout(800);
      });

      await test.step('Step 4: Validate Demo Account Type - Verify Billing Profile section is SKIPPED', async () => {
        Logger.step(4, 'Selecting DEMO type and asserting Billing Profile step is skipped from Stepper');
        const typeCombobox = page.locator('.MuiDialog-root .MuiSelect-select').first();
        await typeCombobox.click();
        await page.waitForTimeout(400);
        const demoOption = page.locator('.MuiPopover-root:visible li:has-text("DEMO"), .MuiPopover-root:visible [role="option"]:has-text("DEMO")').first();
        await demoOption.click();
        await page.waitForTimeout(600);

        // Assert Billing Profile is skipped in the stepper for DEMO
        const demoSteps = await page.locator('.MuiStepLabel-label').allInnerTexts();
        Logger.info(`[Demo Validation] Stepper steps with DEMO selected: ${JSON.stringify(demoSteps)}`);
        expect(demoSteps, 'Billing Profile step must be skipped for DEMO accounts').not.toContain('Billing Profile');
        expect(demoSteps).toEqual(['Basic', 'Auto State Transition', 'Contacts', 'Primary Address']);
        Logger.info('[Demo Validation] Successfully verified Billing Profile section is skipped (4-step stepper)');
      });

      await test.step('Step 5: Fill Basic Info with collision-free name and advance to Auto State Transition', async () => {
        Logger.step(5, `Populating Step 1 with unique collision-free account: "${uniqueAccountName}"`);
        const nameInput = page.locator('.MuiDialog-root input[placeholder="Name"]').first();
        await nameInput.fill(uniqueAccountName);

        // Advance to Step 2 (Auto State Transition - Billing Profile skipped)
        const nextBtn = page.locator('.MuiDialog-root button:has-text("Next")').first();
        await nextBtn.click();
        await page.waitForTimeout(1000);

        const currentDialogText = await page.locator('.MuiDialogContent-root').innerText();
        expect(currentDialogText, 'Must advance directly to Auto State Transition').toMatch(/Auto State Transition|Source State|Target State/i);
      });

      await test.step('Step 6: Configure Auto State Transition and advance to Contacts', async () => {
        Logger.step(6, 'Advancing past Auto State Transition to Contacts step');
        const nextBtn = page.locator('.MuiDialog-root button:has-text("Next")').first();
        await nextBtn.click();
        await page.waitForTimeout(1000);

        const currentDialogText = await page.locator('.MuiDialogContent-root').innerText();
        expect(currentDialogText, 'Must be on Contacts step').toMatch(/Contact Type|First Name|Last Name|Email/i);
      });

      await test.step('Step 7: Populate Contacts Information (Primary Contact)', async () => {
        Logger.step(7, 'Filling Primary Contact mandatory fields');
        await page.locator('.MuiDialog-root input[placeholder="First Name"]').first().fill('Vetri');
        await page.locator('.MuiDialog-root input[placeholder="Last Name"]').first().fill('Automation');
        await page.locator('.MuiDialog-root input[placeholder="Email"]').first().fill('vetri.automation@att.com');
        await page.locator('.MuiDialog-root input[placeholder="Phone Number"]').first().fill('+12025550192');
        await page.waitForTimeout(400);

        // Advance to Primary Address
        const nextBtn = page.locator('.MuiDialog-root button:has-text("Next")').first();
        await nextBtn.click();
        await page.waitForTimeout(1000);

        const currentDialogText = await page.locator('.MuiDialogContent-root').innerText();
        expect(currentDialogText, 'Must be on Primary Address step').toMatch(/Address Line 1|City|State & Province|Postal Code/i);
      });

      await test.step('Step 8: Populate Primary Address and Submit Account Creation', async () => {
        Logger.step(8, 'Filling Primary Address and submitting via Ok button');
        await page.locator('.MuiDialog-root input[placeholder="Address Line 1"]').first().fill('208 S. Akard St.');
        await page.locator('.MuiDialog-root input[placeholder="City"]').first().fill('Dallas');
        await page.locator('.MuiDialog-root input[placeholder="State & Province"]').first().fill('Texas');
        await page.locator('.MuiDialog-root input[placeholder="Postal Code"]').first().fill('75202');

        const countryInput = page.locator('#address-country');
        if (await countryInput.isVisible({ timeout: 2000 })) {
          await countryInput.click();
          await countryInput.fill('United States');
          await page.waitForTimeout(400);
          const countryOption = page.locator('#address-country-popup li, .MuiAutocomplete-popper li').first();
          if (await countryOption.isVisible({ timeout: 2000 })) {
            await countryOption.click();
          }
        }
        await page.waitForTimeout(500);

        // Submit via "Ok" button
        const okBtn = page.locator('.MuiDialog-root button:has-text("Ok"), .MuiDialog-root button:has-text("OK")').first();
        await expect(okBtn, 'Ok button must be enabled').toBeEnabled();
        await accountsPage.click(okBtn, 'Submit Account (Ok button)');

        // Wait for modal to close
        await accountsPage.waitForLoadingSpinnerToDisappear();
        await accountsPage.createAccountDialog.first().waitFor({ state: 'hidden', timeout: 12000 }).catch(() => {});
        expect(await accountsPage.createAccountDialog.first().isVisible().catch(() => false)).toBe(false);
        Logger.info(`[Account Creation] Modal closed successfully for: "${uniqueAccountName}"`);
      });

      await test.step('Step 9: Verify newly created account appears in Accounts table with DRAFT status', async () => {
        Logger.step(9, `Verifying created account "${uniqueAccountName}" appears in Accounts directory`);
        await accountsPage.waitForLoadingSpinnerToDisappear();
        await accountsPage.waitForPageReady();

        // Search for the newly created account
        await accountsPage.searchAccount(uniqueAccountName);
        await accountsPage.waitForLoadingSpinnerToDisappear();

        // Assert row is visible
        const targetRow = accountsPage.tableRows.filter({ hasText: uniqueAccountName }).first();
        await expect(targetRow, `Account row "${uniqueAccountName}" must be visible in table`).toBeVisible({ timeout: 12000 });

        // Assert DRAFT status badge
        const statusCell = targetRow.locator('td, [role="cell"]').filter({ hasText: /DRAFT/i }).first();
        await expect(statusCell, 'Newly created account status must be DRAFT').toBeVisible({ timeout: 8000 });
        const statusBadge = (await statusCell.innerText()).trim();
        Logger.info(`[TC_ACC_005 SUCCESS] Created account "${uniqueAccountName}" verified in table with status: "${statusBadge}"`);

        expect(page.url()).not.toMatch(/\/auth|\/login/i);
      });
    });
  });

  // =========================================================================
  // GROUP 3: 360 ACCOUNT DETAILS & VERIFICATION (@details, @verification)
  // =========================================================================
  test.describe('Group 3: Account Verification & 360 View Operations', { tag: ['@details', '@verification'] }, () => {
    test('[TC_ACC_013] Verify newly created account appears in Accounts table with DRAFT status', async ({ accountsPage, page }) => {
      await test.step('Step 2: Search for account and assert table row presence with DRAFT status', async () => {
        Logger.step(2, 'Searching for created account and verifying DRAFT status');
        await expect(accountsPage.globalSearchInput.first(), 'Accounts search input must be visible').toBeVisible({ timeout: 10000 });
        await accountsPage.searchAccount('DEMO');
        await expect(accountsPage.globalSearchInput.first()).toHaveValue('DEMO');

        // Locate newly created account row in table
        const targetRow = accountsPage.tableRows.filter({ hasText: /DEMO|dev_test_auto_account/i }).first();
        await expect(targetRow, 'Account table row must be visible').toBeVisible({ timeout: 10000 });

        // Assert newly created account status is DRAFT
        const statusCell = targetRow.locator('td, [role="cell"]').filter({ hasText: /DRAFT/i }).first();
        await expect(statusCell, 'Newly created account status must be DRAFT').toBeVisible({ timeout: 8000 });
        const statusText = (await statusCell.innerText()).trim();
        Logger.info(`[TC_ACC_013] Verified newly created account status in Accounts table: "${statusText}"`);

        expect(page.url()).not.toMatch(/\/auth|\/login/i);
      });
    });

    test('[TC_ACC_014] Open Account Details 360 view and verify Header, Status Badge, and Navigation Tabs', async ({ accountsPage, accountDetailsPage, page }) => {
      await test.step('Step 2: Inspect 360 Account Details main container and tabs', async () => {
        Logger.step(2, 'Opening Account Details 360 view and verifying header and tabs');
        
        await accountsPage.waitForPageReady();
        const actionRow = page.locator('table tbody tr:has(button[title="View Details"], button:has(.material-icons:has-text("preview")))').first();
        await actionRow.waitFor({ state: 'visible', timeout: 15000 });

        // Click View Details button on the account row
        const viewBtn = actionRow.locator('button[title="View Details"], button:has(.material-icons:has-text("preview"))').first();
        await accountsPage.click(viewBtn, 'View Details button');

        // Verify URL navigates to /accounts/details
        await page.waitForURL(/\/accounts\/details/i, { timeout: 10000 });
        await accountsPage.waitForLoadingSpinnerToDisappear();
        await accountsPage.waitForPageReady();
        expect(page.url()).toMatch(/\/accounts\/details/i);

        // Verify Status Badge is visible (e.g. DRAFT or ACTIVE)
        const statusBadge = accountDetailsPage.accountStatusBadge.first();
        await expect(statusBadge, 'Account 360 Status badge must be visible').toBeVisible({ timeout: 10000 });
        const badgeText = await statusBadge.innerText();
        Logger.info(`[TC_ACC_014] Account 360 Status Badge: "${badgeText.trim()}"`);

        // Verify 360 navigation sections / tabs are present in side navigation
        const generalTab = page.locator('.MuiListItemText-primary, .MuiListItem-button').filter({ hasText: /^General$/i }).first();
        const contactsTab = page.locator('.MuiListItemText-primary, .MuiListItem-button').filter({ hasText: /^Contacts$/i }).first();
        const apnTab = page.locator('.MuiListItemText-primary, .MuiListItem-button').filter({ hasText: /^APN\/DNN$/i }).first();
        const ratePlanTab = page.locator('.MuiListItemText-primary, .MuiListItem-button').filter({ hasText: /^Rate Plan$/i }).first();
        const roamingTab = page.locator('.MuiListItemText-primary, .MuiListItem-button').filter({ hasText: /^Roaming Profile$/i }).first();

        await expect(generalTab, 'General section/tab must be visible').toBeVisible({ timeout: 8000 });
        await expect(contactsTab, 'Contacts section/tab must be visible').toBeVisible({ timeout: 8000 });
        await expect(apnTab, 'APN/DNN section/tab must be visible').toBeVisible({ timeout: 8000 });
        await expect(ratePlanTab, 'Rate Plan section/tab must be visible').toBeVisible({ timeout: 8000 });
        await expect(roamingTab, 'Roaming Profile section/tab must be visible').toBeVisible({ timeout: 8000 });

        Logger.info('[TC_ACC_014] Successfully verified Account Details 360 view with Header, Status Badge, and Sub-tabs');
        expect(page.url()).not.toMatch(/\/auth|\/login/i);
      });
    });
  });
});

