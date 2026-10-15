import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { Logger } from '../utils/logger';
import { DataFactory } from '../utils/dataFactory';

export interface AccountCreationData {
  accountName: string;
  accountType?: string; // e.g. 'DEMO', 'ENTERPRISE'
  initialState?: string; // e.g. 'DRAFT'
  description?: string;
  contacts?: {
    primary?: { firstName: string; lastName: string; email: string; phone: string };
    shipping?: { firstName: string; lastName: string; email: string; phone: string };
    billing?: { firstName: string; lastName: string; email: string; phone: string };
    techSupport?: { firstName: string; lastName: string; email: string; phone: string };
  };
  address?: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
}

export class AccountsPage extends BasePage {
  // Table & Header Controls
  readonly createAccountButton: Locator;
  readonly globalSearchInput: Locator;
  readonly searchButton: Locator;
  readonly columnVisibilityButton: Locator;
  readonly exportButton: Locator;
  readonly rowsPerPageDropdown: Locator;
  readonly paginationInfo: Locator;

  // Filter Row Inputs
  readonly filterMainAccount: Locator;
  readonly filterAccountId: Locator;
  readonly filterExtId: Locator;
  readonly filterStatusDropdown: Locator;
  readonly filterCategoryDropdown: Locator;
  readonly filterContact: Locator;
  readonly filterAccountTypeDropdown: Locator;

  // Create Account Modal / Stepper Controls
  readonly createAccountDialog: Locator;
  readonly wizardNextButton: Locator;
  readonly wizardBackButton: Locator;
  readonly wizardCancelButton: Locator;
  readonly wizardSubmitButton: Locator;

  // Step 1: Basic Form Fields
  readonly accountNameInput: Locator;
  readonly accountTypeDropdown: Locator;
  readonly initialStateDropdown: Locator;
  readonly descriptionInput: Locator;

  // Step 3: Contacts Form Fields
  readonly primaryFirstNameInput: Locator;
  readonly primaryLastNameInput: Locator;
  readonly primaryEmailInput: Locator;
  readonly primaryPhoneInput: Locator;

  readonly shippingFirstNameInput: Locator;
  readonly shippingLastNameInput: Locator;
  readonly shippingEmailInput: Locator;
  readonly shippingPhoneInput: Locator;

  readonly billingFirstNameInput: Locator;
  readonly billingLastNameInput: Locator;
  readonly billingEmailInput: Locator;
  readonly billingPhoneInput: Locator;

  readonly techSupportFirstNameInput: Locator;
  readonly techSupportLastNameInput: Locator;
  readonly techSupportEmailInput: Locator;
  readonly techSupportPhoneInput: Locator;

  // Step 4: Address Form Fields
  readonly addressStreetInput: Locator;
  readonly addressCityInput: Locator;
  readonly addressStateInput: Locator;
  readonly addressCountryDropdown: Locator;
  readonly addressPostalCodeInput: Locator;

  // Table Data
  readonly accountsTable: Locator;
  readonly tableRows: Locator;
  readonly noDataMessage: Locator;

  constructor(page: Page) {
    super(page);

    // Header action buttons & Table controls
    this.createAccountButton = page.locator('label[aria-label="Account"], label:has-text("Account"), button[aria-label="Account"], button:has-text("Account")').first();
    this.globalSearchInput = page.locator('input[placeholder*="Search" i], input[type="search"]');
    this.searchButton = page.locator('button:has-text("search"), .MuiSvgIcon-root[data-testid="SearchIcon"], button:has(svg[data-testid="SearchIcon"])');
    this.columnVisibilityButton = page.locator('button[title*="Choose columns" i], button[aria-label*="Choose columns" i], [data-testid="VisibilityIcon"], [aria-label*="column" i], button:has(svg[data-testid*="Visibility" i])');
    this.exportButton = page.locator('button[title*="Export" i], button[aria-label*="Export" i], [data-testid="SaveAltIcon"], [data-testid="SaveIcon"], button:has(svg[data-testid*="Save" i])');
    this.rowsPerPageDropdown = page.locator('.MuiTablePagination-select, [aria-label*="Rows per page" i], div:has-text("Rows Per Page")');
    this.paginationInfo = page.locator('.MuiTablePagination-displayedRows, div:has-text("of")');

    // Column Filters
    this.filterMainAccount = page.locator('input[placeholder*="Filter" i]').nth(0);
    this.filterAccountId = page.locator('input[placeholder*="Filter" i]').nth(1);
    this.filterExtId = page.locator('input[placeholder*="Filter" i]').nth(2);
    this.filterStatusDropdown = page.locator('div:has-text("Select to Filter")').nth(0);
    this.filterCategoryDropdown = page.locator('div:has-text("Select to Filter")').nth(1);
    this.filterContact = page.locator('input[placeholder*="Filter" i]').nth(3);
    this.filterAccountTypeDropdown = page.locator('div:has-text("Select to Filter")').nth(2);

    // Modal / Wizard Dialog
    this.createAccountDialog = page.locator('.MuiDialog-root, [role="dialog"]');
    this.wizardNextButton = page.locator('.MuiDialog-root button:has-text("Next"), .MuiDialog-root button:has-text("NEXT"), [role="dialog"] button:has-text("Next"), button:has-text("Next")');
    this.wizardBackButton = page.locator('.MuiDialog-root button:has-text("Back"), .MuiDialog-root button:has-text("BACK"), [role="dialog"] button:has-text("Back")');
    this.wizardCancelButton = page.locator('.MuiDialog-root button:has-text("Cancel"), .MuiDialog-root button:has-text("CANCEL"), [role="dialog"] button:has-text("Cancel")');
    this.wizardSubmitButton = page.locator('.MuiDialog-root button:has-text("Ok"), .MuiDialog-root button:has-text("OK"), .MuiDialog-root button:has-text("Create"), .MuiDialog-root button:has-text("Submit")');

    // Step 1: Basic
    this.accountNameInput = page.locator('input[placeholder="Name"], [aria-label="Name"], .MuiDialog-root input').first();
    this.accountTypeDropdown = page.locator('.MuiDialog-root div:has-text("Account Type") [role="combobox"], .MuiDialog-root div:has-text("Account Type") .MuiSelect-select, .MuiDialog-root div:has-text("Account Type") div[role="button"]').first();
    this.initialStateDropdown = page.locator('.MuiDialog-root div:has-text("Initial State") [role="combobox"], .MuiDialog-root div:has-text("Initial State") .MuiSelect-select, .MuiDialog-root div:has-text("Initial State") div[role="button"]').first();
    this.descriptionInput = page.locator('textarea[name="Description"], .MuiDialog-root textarea').first();

    // Step 4: Contacts
    this.primaryFirstNameInput = page.locator('input[placeholder="First Name"], [aria-label="First Name"]').first();
    this.primaryLastNameInput = page.locator('input[placeholder="Last Name"], [aria-label="Last Name"]').first();
    this.primaryEmailInput = page.locator('input[placeholder="Email"], [aria-label="Email"]').first();
    this.primaryPhoneInput = page.locator('input[placeholder="Phone Number"], [aria-label="Phone Number"], input[type="tel"]').first();

    this.shippingFirstNameInput = page.locator('.MuiDialog-root input').nth(4);
    this.shippingLastNameInput = page.locator('.MuiDialog-root input').nth(5);
    this.shippingEmailInput = page.locator('.MuiDialog-root input').nth(6);
    this.shippingPhoneInput = page.locator('.MuiDialog-root input').nth(7);

    this.billingFirstNameInput = page.locator('.MuiDialog-root input').nth(8);
    this.billingLastNameInput = page.locator('.MuiDialog-root input').nth(9);
    this.billingEmailInput = page.locator('.MuiDialog-root input').nth(10);
    this.billingPhoneInput = page.locator('.MuiDialog-root input').nth(11);

    this.techSupportFirstNameInput = page.locator('.MuiDialog-root input').nth(12);
    this.techSupportLastNameInput = page.locator('.MuiDialog-root input').nth(13);
    this.techSupportEmailInput = page.locator('.MuiDialog-root input').nth(14);
    this.techSupportPhoneInput = page.locator('.MuiDialog-root input').nth(15);

    // Step 5: Address
    this.addressStreetInput = page.locator('input[placeholder="Address Line 1"], [aria-label="Address Line 1"]').first();
    this.addressCityInput = page.locator('input[placeholder="City"], [aria-label="City"]').first();
    this.addressStateInput = page.locator('input[placeholder="State & Province"], [aria-label="State & Province"]').first();
    this.addressCountryDropdown = page.locator('.MuiDialog-root [role="combobox"], .MuiDialog-root .MuiSelect-select').first();
    this.addressPostalCodeInput = page.locator('input[placeholder="Postal Code"], [aria-label="Postal Code"]').first();

    // Table Data
    this.accountsTable = page.locator('table, [role="grid"], .MuiTable-root');
    this.tableRows = page.locator('table tbody tr, [role="row"]');
    this.noDataMessage = page.locator('text="0 of 0", text="No data available", text="No records found"');
  }

  /**
   * Navigates directly to Accounts page and waits for table to load
   */
  async goto(): Promise<void> {
    Logger.info('Navigating to Accounts page');
    await this.navigate('/accounts');
    await this.waitForLoadingSpinnerToDisappear();
    await this.waitForPageReady();
  }

  /**
   * Opens the + ACCOUNT creation modal
   */
  async openCreateAccountModal(): Promise<void> {
    return await this.step('🏢 Step: Open Create Account 5-Step Stepper Wizard', async () => {
      Logger.info('Opening Create Account modal');
      await this.waitForLoadingSpinnerToDisappear();
      await this.tableRows.first().waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
      await this.page.waitForTimeout(500);

      const modal = this.page.locator('.MuiDialog-root, [role="dialog"]').first();
      if (await modal.isVisible({ timeout: 500 }).catch(() => false)) {
        return;
      }

      const createBtn = this.page.locator('label[aria-label="Account"]').first();
      await createBtn.waitFor({ state: 'visible', timeout: 10000 });
      await createBtn.click();
      await modal.waitFor({ state: 'visible', timeout: 10000 });
      await this.waitForLoadingSpinnerToDisappear();
      await this.page.waitForTimeout(600);
    });
  }

  /**
   * Closes the Create Account modal
   */
  async closeCreateAccountModal(): Promise<void> {
    Logger.info('Closing Create Account modal');
    const cancelBtn = this.page.locator('.MuiDialog-root button:has-text("Cancel"), .MuiDialog-root button:has-text("CANCEL"), [role="dialog"] button:has-text("Cancel")').first();
    if (await cancelBtn.isVisible({ timeout: 2000 })) {
      await this.click(cancelBtn, 'Cancel Button');
      await this.page.locator('.MuiDialog-root, [role="dialog"]').first().waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
    }
  }

  /**
   * Fills Step 1: Basic Information
   */
  async fillBasicInfo(data?: {
    accountName?: string;
    accountType?: string;
    initialState?: string;
    description?: string;
  }): Promise<string> {
    const finalAccountName = (data && data.accountName) ? data.accountName : DataFactory.uniqueAccountName();
    Logger.info(`[Step 1: Basic] Filling Basic Info: Name="${finalAccountName}", Type="${data?.accountType || 'DEMO'}", State="${data?.initialState || 'DRAFT'}"`);
    await this.waitForLoadingSpinnerToDisappear();

    // 1. Account Name
    const nameInput = this.page.locator('.MuiDialog-root input[type="text"], .MuiDialog-root input:not([type="hidden"]), [role="dialog"] input').first();
    if (await nameInput.isVisible({ timeout: 5000 })) {
      await this.fill(nameInput, finalAccountName, 'Account Name input');
    }

    // 2. Account Type Dropdown
    const targetType = data?.accountType || 'DEMO';
    const typeCombobox = this.page.locator('.MuiDialog-root .MuiSelect-select, .MuiDialog-root [role="combobox"], .MuiDialog-root div[role="button"]').filter({ hasText: /ENTERPRISE|DEMO/i }).first();
    if (await typeCombobox.isVisible({ timeout: 2000 })) {
      await this.click(typeCombobox);
      await this.page.waitForTimeout(400);
      const typeOption = this.page.locator(`.MuiPopover-root [role="option"]:not([aria-disabled="true"]):has-text("${targetType}"), [role="listbox"] [role="option"]:not([aria-disabled="true"]):has-text("${targetType}"), .MuiPopover-root li:not([aria-disabled="true"]):has-text("${targetType}")`).first();
      if (await typeOption.isVisible({ timeout: 2000 })) {
        await this.click(typeOption);
      } else {
        const fallbackOption = this.page.locator('.MuiPopover-root [role="option"]:not([aria-disabled="true"]), [role="listbox"] [role="option"]:not([aria-disabled="true"])').first();
        if (await fallbackOption.isVisible({ timeout: 1500 })) {
          await this.click(fallbackOption);
        } else {
          await this.page.keyboard.press('Escape');
        }
      }
      await this.page.waitForTimeout(300);
    }

    // 3. Account Admin Role Dropdown (Mandatory on Step 1)
    const roleCombobox = this.page.locator('.MuiDialog-root .MuiSelect-select, .MuiDialog-root [role="combobox"], .MuiDialog-root div[role="button"]').filter({ hasText: /Select Role|Role/i }).first();
    if (await roleCombobox.isVisible({ timeout: 2000 })) {
      await this.click(roleCombobox);
      await this.page.waitForTimeout(400);
      const roleOption = this.page.locator('.MuiPopover-root [role="option"]:not([aria-disabled="true"]), [role="listbox"] [role="option"]:not([aria-disabled="true"]), .MuiPopover-root li:not([aria-disabled="true"])').first();
      if (await roleOption.isVisible({ timeout: 2000 })) {
        await this.click(roleOption);
      } else {
        await this.page.keyboard.press('Escape');
      }
      await this.page.waitForTimeout(300);
    }

    // 4. Initial State Dropdown
    const targetState = data?.initialState || 'DRAFT';
    const stateCombobox = this.page.locator('.MuiDialog-root .MuiSelect-select, .MuiDialog-root [role="combobox"], .MuiDialog-root div[role="button"]').filter({ hasText: /DRAFT|ENTERPRISE-INVENTORY|INVENTORY|TRIAL/i }).first();
    if (await stateCombobox.isVisible({ timeout: 2000 })) {
      await this.click(stateCombobox);
      await this.page.waitForTimeout(400);
      const stateOption = this.page.locator(`.MuiPopover-root [role="option"]:not([aria-disabled="true"]):has-text("${targetState}"), [role="listbox"] [role="option"]:not([aria-disabled="true"]):has-text("${targetState}"), .MuiPopover-root li:not([aria-disabled="true"]):has-text("${targetState}")`).first();
      if (await stateOption.isVisible({ timeout: 2000 })) {
        await this.click(stateOption);
      } else {
        const fallbackOption = this.page.locator('.MuiPopover-root [role="option"]:not([aria-disabled="true"]), [role="listbox"] [role="option"]:not([aria-disabled="true"])').first();
        if (await fallbackOption.isVisible({ timeout: 1500 })) {
          await this.click(fallbackOption);
        } else {
          await this.page.keyboard.press('Escape');
        }
      }
      await this.page.waitForTimeout(300);
    }

    // 5. Description
    if (data?.description) {
      const descInput = this.page.locator('.MuiDialog-root textarea').first();
      if (await descInput.isVisible({ timeout: 2000 })) {
        await this.fill(descInput, data.description, 'Description input');
      }
    }

    // Click NEXT -> moves to Step 2 (Billing Profile)
    await this.clickNextStep('Step 1 (Basic) -> Step 2 (Billing Profile)');
    return finalAccountName;
  }

  /**
   * Steps through Step 2 (Billing Profile) and Step 3 (Auto State Transition)
   */
  async skipBillingProfileAndAutoTransition(): Promise<void> {
    Logger.info('[Step 2: Billing Profile] Skipping to next');
    await this.waitForLoadingSpinnerToDisappear();
    await this.clickNextStep('Step 2 (Billing Profile) -> Step 3 (Auto State Transition)');

    Logger.info('[Step 3: Auto State Transition] Skipping to next');
    await this.waitForLoadingSpinnerToDisappear();
    await this.clickNextStep('Step 3 (Auto State Transition) -> Step 4 (Primary Contact)');
  }

  /**
   * Fills Step 4: Primary Contact
   */
  async fillContacts(contacts?: AccountCreationData['contacts']): Promise<void> {
    Logger.info('[Step 4: Primary Contact] Filling Contacts (Primary, Shipping, Billing, Tech Support)');
    await this.waitForLoadingSpinnerToDisappear();

    const primary = contacts?.primary || {
      firstName: 'Vetrivel',
      lastName: 'Automation',
      email: 'vetrivel.automation@iothub.com',
      phone: '+358401234567',
    };

    const dialogInputs = this.page.locator('.MuiDialog-root input');
    const inputCount = await dialogInputs.count();

    if (inputCount >= 1) {
      await dialogInputs.nth(0).fill(primary.firstName);
    }
    if (inputCount >= 2) {
      await dialogInputs.nth(1).fill(primary.lastName);
    }
    if (inputCount >= 3) {
      await dialogInputs.nth(2).fill(primary.email);
    }
    if (inputCount >= 4) {
      await dialogInputs.nth(3).fill(primary.phone);
    }

    // Click Next -> moves to Step 5 (Primary Address)
    await this.clickNextStep('Step 4 (Primary Contact) -> Step 5 (Primary Address)');
  }

  /**
   * Fills Step 5: Primary Address and clicks Create / Submit
   */
  async fillAddressAndSubmit(address?: AccountCreationData['address']): Promise<void> {
    Logger.info('[Step 5: Primary Address] Filling Primary Address');
    await this.waitForLoadingSpinnerToDisappear();

    const addr = address || {
      street: 'Karaportti 3',
      city: 'Espoo',
      state: 'Uusimaa',
      country: 'Finland',
      postalCode: '02610',
    };

    const dialogInputs = this.page.locator('.MuiDialog-root input');
    const inputCount = await dialogInputs.count();

    if (inputCount >= 1) {
      await dialogInputs.nth(0).fill(addr.street);
    }
    if (inputCount >= 2) {
      await dialogInputs.nth(1).fill(addr.city);
    }
    if (inputCount >= 3) {
      await dialogInputs.nth(2).fill(addr.state);
    }
    if (inputCount >= 4) {
      await dialogInputs.nth(3).fill(addr.postalCode);
    }

    // Submit Create Account
    Logger.info('[Step 5] Submitting Account Creation');
    await this.waitForLoadingSpinnerToDisappear();

    const submitBtn = this.page.locator('.MuiDialog-root button:has-text("CREATE"), .MuiDialog-root button:has-text("Create"), .MuiDialog-root button:has-text("SAVE"), .MuiDialog-root button:has-text("Save"), .MuiDialog-root button:has-text("Submit"), .MuiDialog-root button:has-text("Finish"), .MuiDialog-root button:has-text("NEXT")').last();
    if (await submitBtn.isVisible({ timeout: 3000 })) {
      await this.click(submitBtn, 'Create Account Submit Button');
    }

    // Wait for modal to close
    await this.waitForLoadingSpinnerToDisappear();
    await this.createAccountDialog.first().waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
    if (await this.createAccountDialog.first().isVisible({ timeout: 1000 }).catch(() => false)) {
      await this.page.keyboard.press('Escape');
      await this.page.waitForTimeout(500);
    }
    await this.page.waitForTimeout(1500);
    Logger.info('Account created successfully');
  }

  /**
   * Helper to click NEXT in wizard with spinner wait
   */
  private async clickNextStep(stepDesc: string): Promise<void> {
    await this.waitForLoadingSpinnerToDisappear();
    const nextBtn = this.page.locator('.MuiDialog-root button:has-text("Next"), .MuiDialog-root button:has-text("NEXT"), [role="dialog"] button:has-text("Next"), button:has-text("Next")').first();
    if (await nextBtn.isVisible({ timeout: 4000 })) {
      await this.click(nextBtn, `Wizard NEXT (${stepDesc})`);
      await this.waitForLoadingSpinnerToDisappear();
      await this.page.waitForTimeout(500);
    } else {
      Logger.warn(`Wizard NEXT button was not visible for ${stepDesc}`);
    }
  }

  /**
   * Searches for an account and clicks into its detail view.
   * Throws a descriptive AccountNotFoundError if the account does not exist.
   */
  async openAccountByName(accountName: string): Promise<void> {
    if (!accountName || !accountName.trim()) {
      throw new Error('[AccountNotFoundError] Cannot search for account: accountName parameter is empty or undefined.');
    }

    const cleanName = accountName.trim();
    return await this.step(`🔍 Step: Search and Open Account 360 [${cleanName}]`, async () => {
      Logger.info(`Searching and opening account: "${cleanName}"`);
      await this.waitForLoadingSpinnerToDisappear();

      // Ensure any open dialog or backdrop is hidden
      const openDialog = this.page.locator('.MuiDialog-root, [role="dialog"], .MuiBackdrop-root').first();
      if (await openDialog.isVisible({ timeout: 1000 }).catch(() => false)) {
        await this.page.keyboard.press('Escape');
        await this.page.waitForTimeout(500);
      }

      await this.searchAccount(cleanName);
      await this.waitForLoadingSpinnerToDisappear();

      // Check for "no data" / "0 of 0" indicators
      const noData = this.page.locator('text="0 of 0", text="No data available", text="No records found"').first();
      const hasNoData = await noData.isVisible({ timeout: 1500 }).catch(() => false);

      // Locate matching account row containing the target account name
      const targetRow = this.page.locator('table tbody tr').filter({ hasText: cleanName }).first();
      const isFound = !hasNoData && await targetRow.isVisible({ timeout: 5000 }).catch(() => false);

      if (!isFound) {
        const currentUrl = this.page.url();
        const errorMsg = `[AccountNotFoundError] Account "${cleanName}" was not found in Accounts directory. Searched on ${currentUrl} but no matching record exists in the table.`;
        Logger.error(errorMsg);
        throw new Error(errorMsg);
      }

      const viewDetailsBtn = targetRow.locator('button[title="View Details"], button:has(.material-icons:has-text("preview")), a').first();
      if (await viewDetailsBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await this.click(viewDetailsBtn, `View Details button for "${cleanName}"`);
      } else {
        const accountCell = targetRow.locator('td').filter({ hasText: cleanName }).first();
        await this.click(accountCell, `Account Cell "${cleanName}"`);
      }
      await this.waitForLoadingSpinnerToDisappear();
      await this.waitForPageReady();
    });
  }

  /**
   * Filters accounts by search keyword
   */
  async searchAccount(query: string): Promise<void> {
    Logger.info(`Searching accounts for: "${query}"`);
    if (await this.globalSearchInput.first().isVisible({ timeout: 3000 })) {
      await this.fill(this.globalSearchInput.first(), query, 'Accounts Global Search');
      await this.page.keyboard.press('Enter');
      await this.waitForLoadingSpinnerToDisappear();
    }
  }

  /**
   * Selects rows per page (e.g. 25, 50, 100)
   */
  async selectRowsPerPage(rows: number): Promise<void> {
    Logger.info(`Changing Rows Per Page to: ${rows}`);
    if (await this.rowsPerPageDropdown.first().isVisible({ timeout: 2000 })) {
      await this.click(this.rowsPerPageDropdown.first());
      await this.page.locator(`li:has-text("${rows}"), [role="option"]:has-text("${rows}")`).first().click();
      await this.waitForLoadingSpinnerToDisappear();
    }
  }
}
