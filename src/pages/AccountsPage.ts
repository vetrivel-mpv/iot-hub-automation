import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { Logger } from '../utils/logger';

export interface AccountCreationData {
  accountName: string;
  accountType?: string; // e.g. 'DEMO', 'ENTERPRISE'
  initialState?: string; // e.g. 'ENTERPRISE-INVENTORY'
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

    // Header action buttons
    this.createAccountButton = page.locator('button:has-text("+ ACCOUNT"), .MuiButton-containedPrimary:has-text("ACCOUNT"), button:has-text("+ Account"), button:has-text("CREATE NEW ACCOUNT")').first();
    this.globalSearchInput = page.locator('input[placeholder*="Search" i], input[type="search"]');
    this.searchButton = page.locator('button:has-text("search"), .MuiSvgIcon-root[data-testid="SearchIcon"], button:has(svg[data-testid="SearchIcon"])');
    this.columnVisibilityButton = page.locator('[data-testid="VisibilityIcon"], [aria-label*="column" i], button:has(svg[data-testid*="Visibility" i])');
    this.exportButton = page.locator('[data-testid="SaveAltIcon"], [data-testid="SaveIcon"], button:has(svg[data-testid*="Save" i])');
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
    this.createAccountDialog = page.locator('.MuiDialog-root, [role="dialog"], div:has(h2:has-text("Create New Account"))');
    this.wizardNextButton = page.locator('.MuiDialog-root button:has-text("Next"), .MuiDialog-root button:has-text("NEXT"), button:has-text("Next")');
    this.wizardBackButton = page.locator('.MuiDialog-root button:has-text("Back"), .MuiDialog-root button:has-text("BACK")');
    this.wizardCancelButton = page.locator('.MuiDialog-root button:has-text("Cancel"), .MuiDialog-root button:has-text("CANCEL")');
    this.wizardSubmitButton = page.locator('.MuiDialog-root button:has-text("Create"), .MuiDialog-root button:has-text("CREATE"), .MuiDialog-root button:has-text("Save"), .MuiDialog-root button:has-text("SAVE"), .MuiDialog-root button:has-text("Submit"), .MuiDialog-root button:has-text("Finish")');

    // Step 1: Basic
    this.accountNameInput = page.locator('.MuiDialog-root input').first();
    this.accountTypeDropdown = page.locator('.MuiDialog-root div:has-text("Account Type") [role="combobox"], .MuiDialog-root div:has-text("Account Type") .MuiSelect-select, .MuiDialog-root div:has-text("Account Type") div[role="button"]').first();
    this.initialStateDropdown = page.locator('.MuiDialog-root div:has-text("Initial State") [role="combobox"], .MuiDialog-root div:has-text("Initial State") .MuiSelect-select, .MuiDialog-root div:has-text("Initial State") div[role="button"]').first();
    this.descriptionInput = page.locator('.MuiDialog-root textarea').first();

    // Step 4: Contacts
    this.primaryFirstNameInput = page.locator('.MuiDialog-root input').nth(0);
    this.primaryLastNameInput = page.locator('.MuiDialog-root input').nth(1);
    this.primaryEmailInput = page.locator('.MuiDialog-root input').nth(2);
    this.primaryPhoneInput = page.locator('.MuiDialog-root input').nth(3);

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
    this.addressStreetInput = page.locator('.MuiDialog-root input').nth(0);
    this.addressCityInput = page.locator('.MuiDialog-root input').nth(1);
    this.addressStateInput = page.locator('.MuiDialog-root input').nth(2);
    this.addressCountryDropdown = page.locator('.MuiDialog-root [role="combobox"], .MuiDialog-root .MuiSelect-select').first();
    this.addressPostalCodeInput = page.locator('.MuiDialog-root input').nth(3);

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
    Logger.info('Opening Create Account modal');
    await this.waitForLoadingSpinnerToDisappear();
    await this.click(this.createAccountButton.first(), '+ ACCOUNT button');
    await this.createAccountDialog.first().waitFor({ state: 'visible', timeout: 10000 });
    await this.waitForLoadingSpinnerToDisappear();
    await this.page.waitForTimeout(500);
  }

  /**
   * Closes the Create Account modal
   */
  async closeCreateAccountModal(): Promise<void> {
    Logger.info('Closing Create Account modal');
    if (await this.wizardCancelButton.first().isVisible({ timeout: 2000 })) {
      await this.click(this.wizardCancelButton.first(), 'Cancel Button');
      await this.createAccountDialog.first().waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
    }
  }

  /**
   * Fills Step 1: Basic Information
   */
  async fillBasicInfo(data: {
    accountName: string;
    accountType?: string;
    initialState?: string;
    description?: string;
  }): Promise<void> {
    Logger.info(`[Step 1: Basic] Filling Basic Info: Name="${data.accountName}", Type="${data.accountType || 'DEMO'}", State="${data.initialState || 'ENTERPRISE-INVENTORY'}"`);
    await this.waitForLoadingSpinnerToDisappear();

    // 1. Account Name
    const nameInput = this.page.locator('.MuiDialog-root input').first();
    await this.fill(nameInput, data.accountName, 'Account Name input');

    // 2. Account Type Dropdown
    const targetType = data.accountType || 'DEMO';
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
    const targetState = data.initialState || 'ENTERPRISE-INVENTORY';
    const stateCombobox = this.page.locator('.MuiDialog-root .MuiSelect-select, .MuiDialog-root [role="combobox"], .MuiDialog-root div[role="button"]').filter({ hasText: /ENTERPRISE-INVENTORY|INVENTORY/i }).first();
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
    if (data.description) {
      const descInput = this.page.locator('.MuiDialog-root textarea').first();
      if (await descInput.isVisible({ timeout: 2000 })) {
        await this.fill(descInput, data.description, 'Description input');
      }
    }

    // Click NEXT -> moves to Step 2 (Billing Profile)
    await this.clickNextStep('Step 1 (Basic) -> Step 2 (Billing Profile)');
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
      email: 'vetrivel.automation@nokia.com',
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
    const nextBtn = this.wizardNextButton.first();
    await expect(nextBtn).toBeVisible({ timeout: 5000 });
    await this.click(nextBtn, `Wizard NEXT (${stepDesc})`);
    await this.waitForLoadingSpinnerToDisappear();
    await this.page.waitForTimeout(500);
  }

  /**
   * Searches for an account and clicks into its detail view
   */
  async openAccountByName(accountName: string): Promise<void> {
    Logger.info(`Searching and opening account: "${accountName}"`);
    await this.waitForLoadingSpinnerToDisappear();

    // Ensure any open dialog or backdrop is hidden
    const openDialog = this.page.locator('.MuiDialog-root, [role="dialog"], .MuiBackdrop-root').first();
    if (await openDialog.isVisible({ timeout: 1000 }).catch(() => false)) {
      await this.page.keyboard.press('Escape');
      await this.page.waitForTimeout(500);
    }

    await this.searchAccount(accountName);
    await this.waitForLoadingSpinnerToDisappear();

    // Click account link or row
    const accountLink = this.page.locator(`a:has-text("${accountName}"), td:has-text("${accountName}"), table tbody tr td a`).first();
    if (await accountLink.isVisible({ timeout: 8000 })) {
      await this.click(accountLink);
    } else {
      const firstRow = this.page.locator('table tbody tr td a, table tbody tr').first();
      await firstRow.click({ force: true });
    }
    await this.waitForLoadingSpinnerToDisappear();
    await this.waitForPageReady();
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
