import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { Logger } from '../utils/logger';

export class SubscriptionsPage extends BasePage {
  // Account Context Selection (Top Dropdown / Selector)
  readonly accountContextSelector: Locator;
  readonly accountContextOptionAll: Locator;
  readonly accountContextSearchInput: Locator;

  // Action Toolbar Controls (Bulk Operations)
  readonly actionToolbarGroupSubscriptions: Locator;
  readonly actionToolbarSendSms: Locator;
  readonly actionToolbarBulkSimState: Locator;
  readonly actionToolbarBulkApnGroup: Locator;
  readonly actionToolbarBulkRoamingProfile: Locator;
  readonly actionToolbarBulkNetworkProfile: Locator;
  readonly actionToolbarBulkCustomFields: Locator;
  readonly actionToolbarBulkRatePlan: Locator;
  readonly actionToolbarBulkPairing: Locator;
  readonly actionToolbarBulkUnpairing: Locator;
  readonly actionToolbarMoveSim: Locator;
  readonly actionToolbarBulkTagManagement: Locator;
  readonly actionToolbarChooseColumns: Locator;
  readonly actionToolbarRefresh: Locator;
  readonly actionToolbarExportSubscriptions: Locator;
  readonly actionToolbarBulkCancelLocation: Locator;

  // Single SIM Row / Action Menu Operations
  readonly singleSimRowActionMenu: Locator;
  readonly singleSimTagManagement: Locator;
  readonly singleSimChangeApnGroup: Locator;
  readonly singleSimChangeRatePlan: Locator;
  readonly singleSimChangeNetworkProfile: Locator;
  readonly singleSimChangeRoamingProfile: Locator;
  readonly singleSimCdrHistory: Locator;
  readonly singleSimGroupSubscriptions: Locator;
  readonly singleSimLifecycleTrial: Locator;
  readonly singleSimLifecycleActive: Locator;
  readonly singleSimLifecycleSuspend: Locator;
  readonly singleSimLifecycleReactivate: Locator;
  readonly singleSimLifecycleDeactivate: Locator;
  readonly singleSimLifecycleRetire: Locator;
  readonly singleSimPairing: Locator;
  readonly singleSimUnpairing: Locator;

  // Search, Table, and Action properties
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly exportButton: Locator;
  readonly refreshButton: Locator;
  readonly columnVisibilityButton: Locator;
  readonly filterIccid: Locator;
  readonly filterImsi: Locator;
  readonly filterMsisdn: Locator;
  readonly filterAccount: Locator;
  readonly filterStateDropdown: Locator;
  readonly filterRatePlan: Locator;
  readonly changeStateButton: Locator;
  readonly changeRatePlanButton: Locator;
  readonly addAddonButton: Locator;
  readonly assignTagButton: Locator;
  readonly simTable: Locator;
  readonly tableRows: Locator;
  readonly selectAllCheckbox: Locator;
  readonly rowsPerPageDropdown: Locator;
  readonly paginationInfo: Locator;

  constructor(page: Page) {
    super(page);


    // Account Context Selection
    this.accountContextSelector = page.locator('.account-context-selector, .tenant-select, button:has-text("Account:"), [aria-label*="Select Account" i], .account-select').first();
    this.accountContextOptionAll = page.locator('[role="option"]:has-text("ALL"), [role="menuitem"]:has-text("ALL"), text="All Accounts", text="ALL"').first();
    this.accountContextSearchInput = page.locator('input[placeholder*="Search Account" i], input[placeholder*="Filter Account" i]');

    // Action Toolbar
    this.actionToolbarGroupSubscriptions = page.locator('button:has-text("Group Subscriptions"), [title*="Group Subscriptions" i], [aria-label*="Group Subscriptions" i]');
    this.actionToolbarSendSms = page.locator('button:has-text("Send SMS"), [title*="Send SMS" i], [aria-label*="Send SMS" i]');
    this.actionToolbarBulkSimState = page.locator('button:has-text("Change State"), button:has-text("Bulk Change - SIM State"), [title*="SIM State" i]');
    this.actionToolbarBulkApnGroup = page.locator('button:has-text("Change APN"), button:has-text("Bulk Change - APN Group"), [title*="APN Group" i]');
    this.actionToolbarBulkRoamingProfile = page.locator('button:has-text("Roaming Profile"), button:has-text("Bulk Change - Roaming Profile"), [title*="Roaming Profile" i]');
    this.actionToolbarBulkNetworkProfile = page.locator('button:has-text("Network Profile"), button:has-text("Bulk Change - Network Profile"), [title*="Network Profile" i]');
    this.actionToolbarBulkCustomFields = page.locator('button:has-text("Custom Fields"), button:has-text("Bulk Change - Custom Fields"), [title*="Custom Fields" i]');
    this.actionToolbarBulkRatePlan = page.locator('button:has-text("Change Rate Plan"), button:has-text("Bulk Change - Rate Plan"), [title*="Rate Plan" i]');
    this.actionToolbarBulkPairing = page.locator('button:has-text("Pairing"), button:has-text("Bulk Change - Pairing"), [title*="Pairing" i]');
    this.actionToolbarBulkUnpairing = page.locator('button:has-text("Unpairing"), button:has-text("Bulk Change - Unpairing"), [title*="Unpairing" i]');
    this.actionToolbarMoveSim = page.locator('button:has-text("Move SIM"), [title*="Move SIM" i], [aria-label*="Move SIM" i]');
    this.actionToolbarBulkTagManagement = page.locator('button:has-text("Tag Management"), button:has-text("Bulk Tag Management"), [title*="Tag Management" i]');
    this.actionToolbarChooseColumns = page.locator('[data-testid="VisibilityIcon"], button:has-text("Choose Columns"), [title*="Choose Columns" i]');
    this.actionToolbarRefresh = page.locator('[data-testid="RefreshIcon"], button:has-text("Refresh"), [title*="Refresh" i]');
    this.actionToolbarExportSubscriptions = page.locator('[data-testid="SaveAltIcon"], button:has-text("Export"), [title*="Export" i]');
    this.actionToolbarBulkCancelLocation = page.locator('button:has-text("Cancel Location"), button:has-text("Bulk Cancel Location"), [title*="Cancel Location" i]');

    // Single SIM Operations
    this.singleSimRowActionMenu = page.locator('tbody tr button[aria-label*="action" i], tbody tr [data-testid="MoreVertIcon"], tbody tr .action-menu-trigger').first();
    this.singleSimTagManagement = page.locator('[role="menuitem"]:has-text("Tag Management"), a:has-text("Tag Management"), button:has-text("Tag Management")');
    this.singleSimChangeApnGroup = page.locator('[role="menuitem"]:has-text("Change APN Group"), a:has-text("Change APN Group")');
    this.singleSimChangeRatePlan = page.locator('[role="menuitem"]:has-text("Change Rate Plan"), a:has-text("Change Rate Plan")');
    this.singleSimChangeNetworkProfile = page.locator('[role="menuitem"]:has-text("Change Network Profile"), a:has-text("Change Network Profile")');
    this.singleSimChangeRoamingProfile = page.locator('[role="menuitem"]:has-text("Change Roaming Profile"), a:has-text("Change Roaming Profile")');
    this.singleSimCdrHistory = page.locator('[role="menuitem"]:has-text("CDR History"), a:has-text("CDR History")');
    this.singleSimGroupSubscriptions = page.locator('[role="menuitem"]:has-text("Group Subscriptions"), a:has-text("Group Subscriptions")');
    this.singleSimLifecycleTrial = page.locator('[role="menuitem"]:has-text("Trial"), a:has-text("Trial")');
    this.singleSimLifecycleActive = page.locator('[role="menuitem"]:has-text("Active"), [role="menuitem"]:has-text("Activate"), a:has-text("Activate")');
    this.singleSimLifecycleSuspend = page.locator('[role="menuitem"]:has-text("Suspend"), a:has-text("Suspend")');
    this.singleSimLifecycleReactivate = page.locator('[role="menuitem"]:has-text("Reactivate"), [role="menuitem"]:has-text("Resume"), a:has-text("Reactivate")');
    this.singleSimLifecycleDeactivate = page.locator('[role="menuitem"]:has-text("Deactivate"), a:has-text("Deactivate")');
    this.singleSimLifecycleRetire = page.locator('[role="menuitem"]:has-text("Retire"), a:has-text("Retire")');
    this.singleSimPairing = page.locator('[role="menuitem"]:has-text("Pairing"), a:has-text("Pairing")');
    this.singleSimUnpairing = page.locator('[role="menuitem"]:has-text("Unpairing"), a:has-text("Unpairing")');

    this.searchInput = page.locator('input[placeholder*="Search" i], input[type="search"]');
    this.searchButton = page.locator('button:has-text("search"), .MuiSvgIcon-root[data-testid="SearchIcon"], button:has(svg[data-testid="SearchIcon"])');
    this.exportButton = page.locator('[data-testid="SaveAltIcon"], [data-testid="SaveIcon"], button:has(svg[data-testid*="Save" i])');
    this.refreshButton = page.locator('[data-testid="RefreshIcon"], button:has(svg[data-testid*="Refresh" i])');
    this.columnVisibilityButton = page.locator('[data-testid="VisibilityIcon"], button:has(svg[data-testid*="Visibility" i])');

    // Filter Fields
    this.filterIccid = page.locator('input[placeholder*="ICCID" i], input[name*="iccid" i]');
    this.filterImsi = page.locator('input[placeholder*="IMSI" i], input[name*="imsi" i]');
    this.filterMsisdn = page.locator('input[placeholder*="MSISDN" i], input[name*="msisdn" i]');
    this.filterAccount = page.locator('input[placeholder*="Account" i], input[name*="account" i]');
    this.filterStateDropdown = page.locator('div:has-text("Select to Filter"), select[name*="state" i]');
    this.filterRatePlan = page.locator('input[placeholder*="Rate Plan" i], input[name*="ratePlan" i]');

    // Action Controls
    this.changeStateButton = page.locator('button:has-text("Change State"), button:has-text("Set State")');
    this.changeRatePlanButton = page.locator('button:has-text("Change Rate Plan"), button:has-text("Rate Plan")');
    this.addAddonButton = page.locator('button:has-text("Add-on"), button:has-text("Add Addon")');
    this.assignTagButton = page.locator('button:has-text("Tag"), button:has-text("Assign Tag")');

    // Table elements
    this.simTable = page.locator('table, [role="grid"], .MuiTable-root');
    this.tableRows = page.locator('table tbody tr, [role="row"]');
    this.selectAllCheckbox = page.locator('th input[type="checkbox"], [aria-label*="Select all" i]');
    this.rowsPerPageDropdown = page.locator('.MuiTablePagination-select, [aria-label*="Rows per page" i], div:has-text("Rows Per Page")');
    this.paginationInfo = page.locator('.MuiTablePagination-displayedRows, div:has-text("of")');
  }

  /**
   * Selects an Account Context at top of portal ('ALL' or a specific Account name)
   */
  async selectAccountContext(accountName: string = 'ALL'): Promise<void> {
    Logger.info(`Setting Account Context to: "${accountName}"`);
    if (await this.accountContextSelector.isVisible({ timeout: 3000 })) {
      await this.click(this.accountContextSelector, 'Account Context Selector');
      await this.page.waitForTimeout(400);

      if (accountName.toUpperCase() === 'ALL') {
        const allOpt = this.page.locator('[role="option"]:has-text("ALL"), [role="menuitem"]:has-text("ALL"), li:has-text("ALL")').first();
        if (await allOpt.isVisible({ timeout: 2000 })) {
          await this.click(allOpt, 'Option ALL Accounts');
        } else {
          await this.page.keyboard.press('Escape');
        }
      } else {
        if (await this.accountContextSearchInput.first().isVisible({ timeout: 1500 })) {
          await this.fill(this.accountContextSearchInput.first(), accountName, 'Account Search');
          await this.page.keyboard.press('Enter');
        }
        const targetOpt = this.page.locator(`[role="option"]:has-text("${accountName}"), [role="menuitem"]:has-text("${accountName}"), li:has-text("${accountName}")`).first();
        if (await targetOpt.isVisible({ timeout: 2000 })) {
          await this.click(targetOpt, `Account Option "${accountName}"`);
        } else {
          await this.page.keyboard.press('Escape');
        }
      }
      await this.waitForLoadingSpinnerToDisappear();
    }
  }

  /**
   * Navigates to Subscriptions -> SIM page
   */
  async goto(): Promise<void> {
    Logger.info('Navigating to Subscriptions page');
    await this.navigate('/subscriptions');
    await this.waitForPageReady();
  }

  /**
   * Performs global search on subscriptions
   */
  async search(query: string): Promise<void> {
    Logger.info(`Searching subscriptions for: "${query}"`);
    await this.fill(this.searchInput.first(), query, 'Subscriptions Search');
    await this.page.keyboard.press('Enter');
    await this.waitForLoadingSpinnerToDisappear();
  }

  /**
   * Selects all rows via table master checkbox
   */
  async selectAllRows(): Promise<void> {
    Logger.info('Selecting all rows in subscriptions table');
    if (await this.selectAllCheckbox.first().isVisible({ timeout: 2000 })) {
      await this.click(this.selectAllCheckbox.first());
    }
  }
}
