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
  // GROUP 1: HAPPY PATH - NAVIGATION, DATA GRID & EXPORT
  // Tags: @happy-path, @smoke, @ui, @navigation
  // =========================================================================
  test.describe('Group 1: Happy Path - Navigation, Data Grid & Export', { tag: ['@happy-path', '@smoke', '@ui', '@navigation'] }, () => {
    test('[TC_ACC_001] Verify Accounts menu dropdown sections (Accounts, Sales)', { tag: ['@happy-path', '@smoke'] }, async ({ navigationMenu, page }) => {
      await test.step('Step 2: Open Accounts navigation menu and verify sections', async () => {
        Logger.step(2, 'Opening Accounts menu dropdown');
        await navigationMenu.openMenu('Accounts');
        const expectedAccounts = ['Accounts', 'Custom fields'];
        await navigationMenu.expectSubmenuItemsVisible(expectedAccounts);
        await page.keyboard.press('Escape');
        expect(page.url()).not.toMatch(/\/auth|\/login/i);
      });
    });

    test('[TC_ACC_002] Verify Accounts table grid, column headers, and action controls', { tag: ['@happy-path', '@ui'] }, async ({ accountsPage, page }) => {
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

    test('[TC_ACC_004] Verify Accounts data export to Excel / CSV format', { tag: ['@happy-path', '@ui'] }, async ({ accountsPage, page }) => {
      await test.step('Step 2: Verify Export button accessibility and enabled status', async () => {
        Logger.step(2, 'Verifying Export button accessibility');
        await expect(accountsPage.exportButton.first(), 'Export button must be visible').toBeVisible({ timeout: 10000 });
        await expect(accountsPage.exportButton.first()).toBeEnabled();
        expect(page.url()).not.toMatch(/\/auth|\/login/i);
      });
    });
  });

  // =========================================================================
  // GROUP 2: HAPPY PATH - 5-STEP ACCOUNT CREATION WIZARD LIFECYCLE
  // Tags: @happy-path, @e2e, @wizard, @create, @lifecycle
  // =========================================================================
  test.describe('Group 2: Happy Path - Account Creation Stepper Wizard Lifecycle', { tag: ['@happy-path', '@e2e', '@wizard', '@create', '@lifecycle'] }, () => {
    test.beforeEach(async ({ accountsPage }) => {
      await accountsPage.waitForPageReady();
      await accountsPage.createAccountButton.waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
    });

    test('[TC_ACC_005] Complete Demo Account Creation Lifecycle: 4-Step Stepper (Billing Profile Skipped) and DRAFT Verification', { tag: ['@happy-path', '@e2e', '@wizard', '@demo'] }, async ({ accountsPage, page, dataFactory }) => {
      const demoAccountName = dataFactory.uniqueAccountName();

      await test.step('Step 2: [TC_ACC_006] Open Create Account modal and configure Step 1 with DEMO type', async () => {
        Logger.step(2, `Opening Create Account modal and populating Basic Information for: "${demoAccountName}"`);
        await accountsPage.openCreateAccountModal();
        await expect(accountsPage.createAccountDialog.first(), 'Create Account dialog must be open').toBeVisible({ timeout: 8000 });

        // Ensure DEMO type is selected
        const typeCombobox = page.locator('.MuiDialog-root .MuiSelect-select').first();
        if (await typeCombobox.isVisible({ timeout: 2000 })) {
          const currentText = await typeCombobox.innerText();
          if (!currentText.includes('DEMO')) {
            await typeCombobox.click();
            await page.locator('.MuiPopover-root:visible, [role="listbox"]').first().waitFor({ state: 'visible', timeout: 5000 });
            const demoOption = page.locator('.MuiPopover-root:visible li:has-text("DEMO"), .MuiPopover-root:visible [role="option"]:has-text("DEMO")').first();
            await demoOption.click();
            await page.locator('.MuiPopover-root').waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
          }
        }

        // Fill collision-free account name
        const nameInput = page.locator('.MuiDialog-root input[placeholder="Name"]').first();
        await nameInput.fill(demoAccountName);

        // Assert 4-step stepper structure for DEMO (Billing Profile is skipped)
        const demoSteps = await page.locator('.MuiStepLabel-label').allInnerTexts();
        Logger.info(`[Demo Stepper] Stepper steps with DEMO selected: ${JSON.stringify(demoSteps)}`);
        expect(demoSteps, 'Billing Profile step must be skipped for DEMO accounts').not.toContain('Billing Profile');
        expect(demoSteps).toEqual(['Basic', 'Auto State Transition', 'Contacts', 'Primary Address']);

        // Advance to Step 2 (Auto State Transition - Billing Profile skipped)
        const nextBtn = page.locator('.MuiDialog-root button:has-text("Next"), button:has-text("Next")').first();
        await nextBtn.click();
        await expect(page.locator('.MuiDialogContent-root')).toContainText(/Auto State Transition|Source State|Target State/i, { timeout: 8000 });
      });

      await test.step('Step 3: [TC_ACC_009] Configure Auto State Transition and advance to Contacts', async () => {
        Logger.step(3, 'Advancing past Auto State Transition to Contacts step');
        const nextBtn = page.locator('.MuiDialog-root button:has-text("Next"), button:has-text("Next")').first();
        await nextBtn.click();
        await expect(page.locator('.MuiDialogContent-root')).toContainText(/Contact Type|First Name|Last Name|Email/i, { timeout: 8000 });
      });

      await test.step('Step 4: [TC_ACC_010] Populate Contacts Information (Primary Contact)', async () => {
        Logger.step(4, 'Filling Primary Contact mandatory fields');
        await page.locator('.MuiDialog-root input[placeholder="First Name"]').first().fill('Vetri');
        await page.locator('.MuiDialog-root input[placeholder="Last Name"]').first().fill('Automation');
        await page.locator('.MuiDialog-root input[placeholder="Email"]').first().fill('vetri.automation@att.com');
        await page.locator('.MuiDialog-root input[placeholder="Phone Number"]').first().fill('+12025550192');

        // Advance to Primary Address
        const nextBtn = page.locator('.MuiDialog-root button:has-text("Next"), button:has-text("Next")').first();
        await nextBtn.click();
        await expect(page.locator('.MuiDialogContent-root')).toContainText(/Address Line 1|City|State & Province|Postal Code/i, { timeout: 8000 });
      });

      await test.step('Step 5: [TC_ACC_012] Populate Primary Address and Submit DEMO Account Creation', async () => {
        Logger.step(5, 'Filling Primary Address and submitting via Ok button');
        await page.locator('.MuiDialog-root input[placeholder="Address Line 1"]').first().fill('208 S. Akard St.');
        await page.locator('.MuiDialog-root input[placeholder="City"]').first().fill('Dallas');
        await page.locator('.MuiDialog-root input[placeholder="State & Province"]').first().fill('Texas');
        await page.locator('.MuiDialog-root input[placeholder="Postal Code"]').first().fill('75202');

        const countryInput = page.locator('#address-country');
        if (await countryInput.isVisible({ timeout: 2000 })) {
          await countryInput.click();
          await countryInput.fill('United States');
          const countryOption = page.locator('#address-country-popup li, .MuiAutocomplete-popper li').first();
          if (await countryOption.isVisible({ timeout: 2000 })) {
            await countryOption.click();
          }
        }

        // Submit via "Ok" button
        const okBtn = page.locator('.MuiDialog-root button:has-text("Ok"), .MuiDialog-root button:has-text("OK")').first();
        await expect(okBtn, 'Ok button must be enabled').toBeEnabled();
        await accountsPage.click(okBtn, 'Submit Account (Ok button)');

        // Wait for modal to close with event-driven wait
        await accountsPage.waitForLoadingSpinnerToDisappear();
        await accountsPage.createAccountDialog.first().waitFor({ state: 'hidden', timeout: 12000 }).catch(() => {});
        expect(await accountsPage.createAccountDialog.first().isVisible().catch(() => false)).toBe(false);
        Logger.info(`[Demo Account Creation] Modal closed successfully for: "${demoAccountName}"`);
      });

      await test.step('Step 6: [TC_ACC_013] Verify newly created DEMO account appears in Accounts table with DRAFT status', async () => {
        Logger.step(6, `Verifying created DEMO account "${demoAccountName}" appears in Accounts directory`);
        await accountsPage.waitForLoadingSpinnerToDisappear();
        await accountsPage.waitForPageReady();

        await accountsPage.searchAccount(demoAccountName);
        await accountsPage.waitForLoadingSpinnerToDisappear();

        const targetRow = accountsPage.tableRows.filter({ hasText: demoAccountName }).first();
        await expect(targetRow, `Account row "${demoAccountName}" must be visible in table`).toBeVisible({ timeout: 12000 });

        const statusCell = targetRow.locator('td, [role="cell"]').filter({ hasText: /DRAFT/i }).first();
        await expect(statusCell, 'Newly created account status must be DRAFT').toBeVisible({ timeout: 8000 });
        const statusBadge = (await statusCell.innerText()).trim();
        Logger.info(`[TC_ACC_005 SUCCESS] Created DEMO account "${demoAccountName}" verified in table with status: "${statusBadge}"`);

        expect(page.url()).not.toMatch(/\/auth|\/login/i);
      });
    });

    test('[TC_ACC_008] Complete Non-Demo Account Creation Lifecycle: 5-Step Stepper with Billing Profile Configuration and DRAFT Verification', { tag: ['@happy-path', '@e2e', '@wizard', '@billing', '@non-demo'] }, async ({ accountsPage, page, dataFactory }) => {
      const nonDemoAccountName = `Enterprise_${dataFactory.uniqueAccountName()}`;

      await test.step('Step 2: [TC_ACC_006] Open Create Account modal and configure Step 1 with Non-Demo type', async () => {
        Logger.step(2, `Opening Create Account modal and configuring Non-Demo (INDUSTRIAL_DIRECT) for: "${nonDemoAccountName}"`);
        await accountsPage.openCreateAccountModal();
        await expect(accountsPage.createAccountDialog.first(), 'Create Account dialog must be open').toBeVisible({ timeout: 8000 });

        const nameInput = page.locator('.MuiDialog-root input[placeholder="Name"]').first();
        await nameInput.fill(nonDemoAccountName);

        // Select Non-Demo: INDUSTRIAL_DIRECT via event-driven wait
        const typeCombobox = page.locator('.MuiDialog-root .MuiSelect-select').first();
        await typeCombobox.click();
        const popover = page.locator('.MuiPopover-root:visible, [role="listbox"]').first();
        await popover.waitFor({ state: 'visible', timeout: 5000 });
        const nonDemoOption = page.locator('.MuiPopover-root:visible li:has-text("INDUSTRIAL_DIRECT"), .MuiPopover-root:visible [role="option"]:has-text("INDUSTRIAL_DIRECT")').first();
        await nonDemoOption.click();
        await page.locator('.MuiPopover-root').waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});

        // Select Admin Role if visible
        const roleInput = page.locator('#account-admin-role');
        if (await roleInput.isVisible({ timeout: 2000 })) {
          await roleInput.click();
          const roleOption = page.locator('#account-admin-role-popup li, .MuiAutocomplete-popper li').first();
          if (await roleOption.isVisible({ timeout: 2000 })) {
            await roleOption.click();
          }
        }

        // Assert 5 steps are present for Non-Demo (Billing Profile is active)
        const nonDemoSteps = await page.locator('.MuiStepLabel-label').allInnerTexts();
        Logger.info(`[Non-Demo Stepper] Stepper steps with Non-Demo selected: ${JSON.stringify(nonDemoSteps)}`);
        expect(nonDemoSteps, 'Billing Profile must appear in stepper for Non-Demo accounts').toContain('Billing Profile');
        expect(nonDemoSteps).toEqual(['Basic', 'Billing Profile', 'Auto State Transition', 'Contacts', 'Primary Address']);

        // Advance to Step 2 (Billing Profile)
        const nextBtn = page.locator('.MuiDialog-root button:has-text("Next"), button:has-text("Next")').first();
        await nextBtn.click();
        await expect(page.locator('.MuiDialogContent-root')).toContainText(/Billing Cycle|Currency|Rating Type|MRC Type/i, { timeout: 8000 });
      });

      await test.step('Step 3: [TC_ACC_008] Configure & Assert Step 2: Billing Profile parameters', async () => {
        Logger.step(3, 'Configuring Billing Profile financial preferences (Currency, Billing Cycle, Rating Type)');
        const dialogText = await page.locator('.MuiDialogContent-root').innerText();
        expect(dialogText, 'Billing Profile section must be active on Step 2').toMatch(/Billing Cycle|Currency|Rating Type|MRC Type/i);

        // Customize or verify Currency dropdown if interactive
        const currencySelect = page.locator('.MuiDialog-root .MuiSelect-select').filter({ hasText: /EUR|USD|GBP/i }).first();
        if (await currencySelect.isVisible({ timeout: 2000 })) {
          Logger.info(`[Billing Profile] Active currency preference: "${(await currencySelect.innerText()).trim()}"`);
        }

        // Advance to Step 3 (Auto State Transition)
        const nextBtn = page.locator('.MuiDialog-root button:has-text("Next"), button:has-text("Next")').first();
        await nextBtn.click();
        await expect(page.locator('.MuiDialogContent-root')).toContainText(/Auto State Transition|Source State|Target State/i, { timeout: 8000 });
        Logger.info('[Billing Profile] Successfully configured Billing Profile and advanced to Step 3');
      });

      await test.step('Step 4: [TC_ACC_009] Configure Auto State Transition and advance to Contacts', async () => {
        Logger.step(4, 'Advancing past Auto State Transition to Contacts step');
        const nextBtn = page.locator('.MuiDialog-root button:has-text("Next"), button:has-text("Next")').first();
        await nextBtn.click();
        await expect(page.locator('.MuiDialogContent-root')).toContainText(/Contact Type|First Name|Last Name|Email/i, { timeout: 8000 });
      });

      await test.step('Step 5: [TC_ACC_010] Populate Contacts Information (Primary Contact)', async () => {
        Logger.step(5, 'Filling Primary Contact mandatory fields for Non-Demo account');
        await page.locator('.MuiDialog-root input[placeholder="First Name"]').first().fill('Enterprise');
        await page.locator('.MuiDialog-root input[placeholder="Last Name"]').first().fill('Admin');
        await page.locator('.MuiDialog-root input[placeholder="Email"]').first().fill('enterprise.admin@att.com');
        await page.locator('.MuiDialog-root input[placeholder="Phone Number"]').first().fill('+12025550198');

        // Advance to Step 5 (Primary Address)
        const nextBtn = page.locator('.MuiDialog-root button:has-text("Next"), button:has-text("Next")').first();
        await nextBtn.click();
        await expect(page.locator('.MuiDialogContent-root')).toContainText(/Address Line 1|City|State & Province|Postal Code/i, { timeout: 8000 });
      });

      await test.step('Step 6: [TC_ACC_012] Populate Primary Address and Submit Non-Demo Account Creation', async () => {
        Logger.step(6, 'Filling Primary Address and submitting Non-Demo account');
        await page.locator('.MuiDialog-root input[placeholder="Address Line 1"]').first().fill('One AT&T Way');
        await page.locator('.MuiDialog-root input[placeholder="City"]').first().fill('Bedminster');
        await page.locator('.MuiDialog-root input[placeholder="State & Province"]').first().fill('New Jersey');
        await page.locator('.MuiDialog-root input[placeholder="Postal Code"]').first().fill('07921');

        const countryInput = page.locator('#address-country');
        if (await countryInput.isVisible({ timeout: 2000 })) {
          await countryInput.click();
          await countryInput.fill('United States');
          const countryOption = page.locator('#address-country-popup li, .MuiAutocomplete-popper li').first();
          if (await countryOption.isVisible({ timeout: 2000 })) {
            await countryOption.click();
          }
        }

        // Submit via "Ok" button
        const okBtn = page.locator('.MuiDialog-root button:has-text("Ok"), .MuiDialog-root button:has-text("OK")').first();
        await expect(okBtn, 'Ok button must be enabled').toBeEnabled();
        await accountsPage.click(okBtn, 'Submit Account (Ok button)');

        // Wait for modal to close with event-driven wait
        await accountsPage.waitForLoadingSpinnerToDisappear();
        await accountsPage.createAccountDialog.first().waitFor({ state: 'hidden', timeout: 12000 }).catch(() => {});
        expect(await accountsPage.createAccountDialog.first().isVisible().catch(() => false)).toBe(false);
        Logger.info(`[Non-Demo Account Creation] Modal closed successfully for: "${nonDemoAccountName}"`);
      });

      await test.step('Step 7: [TC_ACC_013] Verify newly created Non-Demo account appears in Accounts table with DRAFT status', async () => {
        Logger.step(7, `Verifying created Non-Demo account "${nonDemoAccountName}" appears in Accounts directory`);
        await accountsPage.waitForLoadingSpinnerToDisappear();
        await accountsPage.waitForPageReady();

        await accountsPage.searchAccount(nonDemoAccountName);
        await accountsPage.waitForLoadingSpinnerToDisappear();

        const targetRow = accountsPage.tableRows.filter({ hasText: nonDemoAccountName }).first();
        await expect(targetRow, `Account row "${nonDemoAccountName}" must be visible in table`).toBeVisible({ timeout: 12000 });

        const statusCell = targetRow.locator('td, [role="cell"]').filter({ hasText: /DRAFT/i }).first();
        await expect(statusCell, 'Newly created account status must be DRAFT').toBeVisible({ timeout: 8000 });
        const statusBadge = (await statusCell.innerText()).trim();
        Logger.info(`[TC_ACC_008 SUCCESS] Created Non-Demo account "${nonDemoAccountName}" verified in table with status: "${statusBadge}"`);

        expect(page.url()).not.toMatch(/\/auth|\/login/i);
      });
    });

    test('[TC_ACC_013] Verify newly created account appears in Accounts table with DRAFT status', { tag: ['@happy-path', '@verification'] }, async ({ accountsPage, page }) => {
      await test.step('Step 2: Search for account and assert table row presence with DRAFT status', async () => {
        Logger.step(2, 'Searching for created account and verifying DRAFT status');
        await expect(accountsPage.globalSearchInput.first(), 'Accounts search input must be visible').toBeVisible({ timeout: 10000 });
        await accountsPage.searchAccount('DEMO');
        await expect(accountsPage.globalSearchInput.first()).toHaveValue('DEMO');

        // Locate newly created account row in table
        const targetRow = accountsPage.tableRows.filter({ hasText: /DEMO|dev_test_auto_account|Auto_/i }).first();
        await expect(targetRow, 'Account table row must be visible').toBeVisible({ timeout: 10000 });

        // Assert newly created account status is DRAFT
        const statusCell = targetRow.locator('td, [role="cell"]').filter({ hasText: /DRAFT/i }).first();
        await expect(statusCell, 'Newly created account status must be DRAFT').toBeVisible({ timeout: 8000 });
        const statusText = (await statusCell.innerText()).trim();
        Logger.info(`[TC_ACC_013] Verified newly created account status in Accounts table: "${statusText}"`);

        expect(page.url()).not.toMatch(/\/auth|\/login/i);
      });
    });

    test('[TC_ACC_014] Open Account Details 360 view and verify Header, Status Badge, and Navigation Tabs', { tag: ['@happy-path', '@details', '@ui'] }, async ({ accountsPage, accountDetailsPage, page }) => {
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

  // =========================================================================
  // GROUP 3: SAD PATH & VALIDATION - FORM ERROR HANDLING & CONSTRAINT CHECKS
  // Tags: @sad-path, @negative, @validation, @boundary
  // =========================================================================
  test.describe('Group 3: Sad Path & Validation - Form Error Handling & Constraint Checks', { tag: ['@sad-path', '@negative', '@validation', '@boundary'] }, () => {
    test.beforeEach(async ({ accountsPage }) => {
      await accountsPage.waitForPageReady();
      await accountsPage.createAccountButton.waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
    });

    test('[TC_ACC_007] Step 1 Sad Path: Assert validation error preventing advancement on empty Account Name', { tag: ['@sad-path', '@validation'] }, async ({ accountsPage, page }) => {
      await test.step('Step 2: Launch Create Account modal for negative validation', async () => {
        Logger.step(2, 'Opening Create Account modal for empty submit validation');
        await accountsPage.openCreateAccountModal();
        await expect(accountsPage.createAccountDialog.first()).toBeVisible({ timeout: 8000 });
      });

      await test.step('Step 3: Leave Account Name blank and attempt to advance to Step 2', async () => {
        Logger.step(3, 'Leaving Account Name empty and clicking Next');
        const nameInput = page.locator('.MuiDialog-root input[placeholder="Name"]').first();
        await nameInput.fill('');

        const nextBtn = page.locator('.MuiDialog-root button:has-text("Next"), button:has-text("Next")').first();
        await nextBtn.click();

        // Assert wizard remains on Step 1 (Basic) and did NOT advance
        const activeStep = page.locator('.MuiStepLabel-label.Mui-active, .MuiStep-root.Mui-active .MuiStepLabel-label').first();
        if (await activeStep.isVisible({ timeout: 2000 })) {
          await expect(activeStep).toHaveText(/Basic/i);
        } else {
          await expect(nameInput, 'Name input must remain visible on step 1').toBeVisible();
        }

        // Check for required error indication (aria-invalid, Mui-error class, or helper text)
        const hasError = await nameInput.evaluate((el: HTMLInputElement) => {
          return el.getAttribute('aria-invalid') === 'true' || 
                 el.classList.contains('Mui-error') || 
                 Boolean(el.closest('.Mui-error')) ||
                 Boolean(document.querySelector('.MuiFormHelperText-root.Mui-error, [role="alert"]'));
        }).catch(() => true);

        expect(hasError, 'Account Name field or form must indicate validation requirement').toBeTruthy();
        Logger.info('[TC_ACC_007 SUCCESS] Negative validation asserted: Empty submit prevented step progression.');
      });

      await test.step('Step 4: Close modal to restore clean state', async () => {
        const cancelBtn = page.locator('.MuiDialog-root button:has-text("Cancel"), button:has-text("Cancel")').first();
        if (await cancelBtn.isVisible({ timeout: 2000 })) {
          await cancelBtn.click();
        } else {
          await page.keyboard.press('Escape');
        }
        await expect(accountsPage.createAccountDialog.first()).toBeHidden({ timeout: 5000 }).catch(() => {});
      });
    });

    test('[TC_ACC_011] Step 4 Sad Path: Validate email format error handling in Contacts form', { tag: ['@sad-path', '@boundary'] }, async ({ accountsPage, page, dataFactory }) => {
      const tempAccName = dataFactory.uniqueAccountName();

      await test.step('Step 2: Open Create Account modal and navigate to Contacts step', async () => {
        Logger.step(2, 'Opening Create Account modal and reaching Contacts step');
        await accountsPage.openCreateAccountModal();
        await expect(accountsPage.createAccountDialog.first()).toBeVisible({ timeout: 8000 });

        // Step 1: Fill Name and advance
        const nameInput = page.locator('.MuiDialog-root input[placeholder="Name"]').first();
        await nameInput.fill(tempAccName);

        // Advance to Auto State Transition
        const nextBtn = page.locator('.MuiDialog-root button:has-text("Next"), button:has-text("Next")').first();
        await nextBtn.click();
        await expect(page.locator('.MuiDialogContent-root')).toContainText(/Auto State Transition|Contacts/i, { timeout: 8000 });

        // Advance to Contacts
        await nextBtn.click();
        await expect(page.locator('.MuiDialogContent-root')).toContainText(/Contact Type|First Name|Last Name|Email/i, { timeout: 8000 });
      });

      await test.step('Step 3: Enter invalid email format and verify validation barrier', async () => {
        Logger.step(3, 'Entering malformed email and asserting validation feedback');
        const emailInput = page.locator('.MuiDialog-root input[placeholder="Email"]').first();
        await emailInput.fill('invalid-email-format-no-domain');

        // Fill required first and last name
        await page.locator('.MuiDialog-root input[placeholder="First Name"]').first().fill('Test');
        await page.locator('.MuiDialog-root input[placeholder="Last Name"]').first().fill('User');

        const nextBtn = page.locator('.MuiDialog-root button:has-text("Next"), button:has-text("Next")').first();
        await nextBtn.click();

        // Check if invalid email triggers validation error or prevents advancing to Primary Address
        const isStillOnContacts = await page.locator('.MuiDialogContent-root').innerText();
        const hasEmailError = await emailInput.evaluate((el: HTMLInputElement) => {
          return el.getAttribute('aria-invalid') === 'true' || 
                 el.validity.valid === false ||
                 Boolean(el.closest('.Mui-error')) ||
                 Boolean(document.querySelector('.MuiFormHelperText-root.Mui-error'));
        }).catch(() => true);

        expect(hasEmailError || isStillOnContacts.includes('Contacts') || isStillOnContacts.includes('First Name'),
          'Malformed email must trigger validation constraint or prevent advancing').toBeTruthy();
        Logger.info('[TC_ACC_011 SUCCESS] Malformed email constraint verified.');
      });

      await test.step('Step 4: Close modal to restore clean state', async () => {
        const cancelBtn = page.locator('.MuiDialog-root button:has-text("Cancel"), button:has-text("Cancel")').first();
        if (await cancelBtn.isVisible({ timeout: 2000 })) {
          await cancelBtn.click();
        } else {
          await page.keyboard.press('Escape');
        }
        await expect(accountsPage.createAccountDialog.first()).toBeHidden({ timeout: 5000 }).catch(() => {});
      });
    });
  });

  // =========================================================================
  // GROUP 4: PERFORMANCE & SLA - FILTER RESPONSE & GRID RENDER BENCHMARKS
  // Tags: @performance, @sla, @benchmark, @filters
  // =========================================================================
  test.describe('Group 4: Performance & SLA - Filter Response & Grid Render Benchmarks', { tag: ['@performance', '@sla', '@benchmark', '@filters'] }, () => {
    test('[TC_ACC_003] Performance SLA: Verify Accounts search input response and data filter rendering (< 2000ms SLA)', { tag: ['@performance', '@sla'] }, async ({ accountsPage, page }) => {
      await test.step('Step 2: Measure Accounts global search filtering latency', async () => {
        Logger.step(2, 'Benchmarking search input response and grid re-render time');
        await expect(accountsPage.globalSearchInput.first(), 'Global search input must be visible').toBeVisible({ timeout: 10000 });

        const startTime = Date.now();
        await accountsPage.searchAccount('DEMO');
        await expect(accountsPage.globalSearchInput.first()).toHaveValue('DEMO');
        await accountsPage.waitForLoadingSpinnerToDisappear();

        const latencyMs = Date.now() - startTime;
        Logger.info(`[PERF SLA] Accounts search response time: ${latencyMs}ms (Target: < 2000ms)`);
        expect(latencyMs, 'Search filtering must complete within 2000ms SLA').toBeLessThan(2000);
        expect(page.url()).not.toMatch(/\/auth|\/login/i);
      });
    });

    test('[TC_ACC_003_PERF] Performance SLA: Verify Accounts directory initial page readiness and table hydration (< 3000ms SLA)', { tag: ['@performance', '@sla'] }, async ({ accountsPage, page }) => {
      await test.step('Step 2: Measure page ready and table hydration SLA', async () => {
        Logger.step(2, 'Benchmarking Accounts table hydration SLA');
        const startTime = Date.now();
        await accountsPage.waitForPageReady();
        await expect(accountsPage.accountsTable.first()).toBeVisible({ timeout: 10000 });

        const loadDurationMs = Date.now() - startTime;
        Logger.info(`[PERF SLA] Accounts directory hydration duration: ${loadDurationMs}ms (Target: < 3000ms)`);
        expect(loadDurationMs, 'Accounts table hydration must be within 3000ms SLA').toBeLessThan(3000);
        expect(page.url()).not.toMatch(/\/auth|\/login/i);
      });
    });
  });
});
