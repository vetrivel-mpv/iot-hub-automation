import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { Logger } from '../utils/logger';

export class ResourcesPage extends BasePage {
  // Page Title and Core Table Controls
  readonly pageTitle: Locator;
  readonly searchInput: Locator;
  readonly dataTable: Locator;
  readonly tableRows: Locator;
  readonly tableHeaders: Locator;
  readonly createBtn: Locator;
  readonly actionToolbar: Locator;
  readonly paginationInfo: Locator;

  // Global Grid Toolbar (From ACM Report 3 Inspection)
  readonly columnChooserBtn: Locator;
  readonly refreshBtn: Locator;
  readonly exportDataBtn: Locator;
  readonly clearSearchBtn: Locator;

  // Resource Navigation Tabs
  readonly apnTab: Locator;
  readonly qosTab: Locator;
  readonly networkProfileTab: Locator;
  readonly numberingPlanTab: Locator;
  readonly roamingProfileTab: Locator;
  readonly ccsOfferTab: Locator;
  readonly simInventoryTab: Locator;
  readonly sliceTab: Locator;

  // ==========================================
  // APN / DNN Form & Modal Elements
  // ==========================================
  readonly apnCreateModal: Locator;
  readonly apnNameInput: Locator;
  readonly apnPdpNameInput: Locator;
  readonly apnAgingPeriodInput: Locator;
  readonly apnPlmnAttOption: Locator;
  readonly apnPlmnAllOption: Locator;
  readonly apnIpDynamicV4Option: Locator;
  readonly apnIpStaticV4Option: Locator;
  readonly apnSubmitCreateBtn: Locator;
  readonly apnEditModal: Locator;
  readonly apnDescriptionInput: Locator;
  readonly apnSubmitUpdateBtn: Locator;

  // ==========================================
  // QoS Profile Form & Modal Elements
  // ==========================================
  readonly qosCreateModal: Locator;
  readonly qosNameInput: Locator;
  readonly qosQciInput: Locator;
  readonly qosArpInput: Locator;
  readonly qosMbrUplinkInput: Locator;
  readonly qosMbrDownlinkInput: Locator;
  readonly qosSubmitCreateBtn: Locator;
  readonly qosEditModal: Locator;
  readonly qosSubmitUpdateBtn: Locator;

  // ==========================================
  // Network Profile Form & Modal Elements
  // ==========================================
  readonly networkProfileCreateModal: Locator;
  readonly networkProfileNameInput: Locator;
  readonly netProf5GDataRow: Locator;
  readonly netProf4GDataRoamingRow: Locator;
  readonly netProf2G3GDataRoamingRow: Locator;
  readonly netProfSaveBtn: Locator;

  // ==========================================
  // Numbering Plan & MSISDN Upload Elements
  // ==========================================
  readonly numberingPlanCreateModal: Locator;
  readonly numberingPlanNameInput: Locator;
  readonly numberingPlanAgingInput: Locator;
  readonly numberingPlanDescInput: Locator;
  readonly numberingPlanSubmitCreateBtn: Locator;
  readonly downloadSampleMsisdnTemplateLink: Locator;
  readonly uploadMsisdnFileBtn: Locator;
  readonly uploadMsisdnFileInput: Locator;
  readonly msisdnAllocationPreviewBtn: Locator;

  // ==========================================
  // Roaming Profile Form & Modal Elements
  // ==========================================
  readonly roamingProfileCreateModal: Locator;
  readonly roamingProfileNameInput: Locator;
  readonly roamingProfilePlmnAttBtn: Locator;
  readonly roamingProfileDrepNameInput: Locator;
  readonly roamingProfileDescInput: Locator;
  readonly roamingProfileSubmitCreateBtn: Locator;
  readonly roamingProfileEditModal: Locator;
  readonly roamingProfileSubmitUpdateBtn: Locator;

  // ==========================================
  // CCS Offer ID Form & Modal Elements
  // ==========================================
  readonly ccsOfferCreateModal: Locator;
  readonly ccsOfferIdInput: Locator;
  readonly ccsOfferTypePrivateRadio: Locator;
  readonly ccsOfferTypePublicRadio: Locator;
  readonly ccsOfferDescInput: Locator;
  readonly ccsOfferSubmitCreateBtn: Locator;
  readonly ccsOfferEditModal: Locator;
  readonly ccsOfferSubmitUpdateBtn: Locator;

  // ==========================================
  // Common Dialog & Contextual Actions
  // ==========================================
  readonly menuItemEdit: Locator;
  readonly menuItemDelete: Locator;
  readonly modalOkBtn: Locator;
  readonly modalConfirmBtn: Locator;
  readonly modalCancelBtn: Locator;
  readonly modalYesBtn: Locator;

  constructor(page: Page) {
    super(page);

    // Page Title & Data Grid
    this.pageTitle = page.locator('h1, h2, h3, .page-title, .MuiTypography-h5').first();
    this.searchInput = page.locator('input[placeholder*="Search" i], input[type="search"], .MuiInputBase-input').first();
    this.dataTable = page.locator('table, [role="grid"], .MuiTable-root');
    this.tableRows = page.locator('table tbody tr, [role="row"]:not([role="columnheader"])');
    this.tableHeaders = page.locator('table th, [role="columnheader"]');
    this.createBtn = page.locator('button:has-text("CREATE"), button:has-text("ADD"), button:has-text("+"), button:has-text("Create")').first();
    this.actionToolbar = page.locator('.toolbar, .action-bar, .MuiToolbar-root');
    this.paginationInfo = page.locator('.MuiTablePagination-displayedRows, .pagination-info, .page-info');

    // Global Toolbar Controls (from ACM Playwright element audit)
    this.columnChooserBtn = page.locator('[data-testid="column-chooser"], button:has-text("Choose columns"), [aria-label*="column" i]').first();
    this.refreshBtn = page.locator('[data-testid="refresh-button"], button:has-text("refresh"), [aria-label*="refresh" i]').first();
    this.exportDataBtn = page.locator('[data-testid="export-data"], button:has-text("Export Report"), [aria-label*="export" i]').first();
    this.clearSearchBtn = page.locator('[data-testid="clear-search"], button:has-text("Clear Search"), [aria-label*="clear" i]').first();

    // Resource Tabs
    this.apnTab = page.locator('a[href*="/resources/apn"], button:has-text("APN/DNN"), [role="tab"]:has-text("APN"), a:has-text("APN/DNN")').first();
    this.qosTab = page.locator('a[href*="/resources/qos"], button:has-text("QoS"), [role="tab"]:has-text("QoS"), a:has-text("QoS")').first();
    this.networkProfileTab = page.locator('a[href*="/resources/network-profile"], button:has-text("Network Profile"), a:has-text("Network Profile")').first();
    this.numberingPlanTab = page.locator('a[href*="/resources/numbering-plan"], button:has-text("Numbering Plan"), a:has-text("Numbering Plan")').first();
    this.roamingProfileTab = page.locator('a[href*="/resources/roaming-profile"], button:has-text("Roaming Profile"), a:has-text("Roaming Profile")').first();
    this.ccsOfferTab = page.locator('a[href*="/resources/ccs-offer"], button:has-text("CCS Offer ID"), a:has-text("CCS Offer ID")').first();
    this.simInventoryTab = page.locator('a[href*="/resources/sim"], button:has-text("SIM Inventory"), a:has-text("SIM Inventory")').first();
    this.sliceTab = page.locator('a[href*="/resources/slice"], button:has-text("Slice"), a:has-text("Slice")').first();

    // APN / DNN Elements
    this.apnCreateModal = page.locator('[role="dialog"], .MuiDialog-root').filter({ hasText: /Create New APN/i }).first();
    this.apnNameInput = page.getByLabel('Name').or(page.locator('input[name="name"], input[name="apnName"]')).first();
    this.apnPdpNameInput = page.getByLabel('PDP NAME').or(page.locator('input[name="pdpName"], input[name="pdp_name"]')).first();
    this.apnAgingPeriodInput = page.getByLabel('Aging Period').or(page.locator('input[name="agingPeriod"], input[name="aging_period"]')).first();
    this.apnPlmnAttOption = page.getByRole('button', { name: 'ATT' }).or(page.locator('div:has-text("ATT")')).first();
    this.apnPlmnAllOption = page.getByRole('button', { name: 'ALLPLMN' }).or(page.locator('div:has-text("ALLPLMN")')).first();
    this.apnIpDynamicV4Option = page.getByRole('button', { name: 'Dynamic-V4' }).or(page.locator('div:has-text("Dynamic-V4")')).first();
    this.apnIpStaticV4Option = page.getByRole('button', { name: 'Static-V4' }).or(page.locator('div:has-text("Static-V4")')).first();
    this.apnSubmitCreateBtn = page.locator('[role="dialog"]').getByRole('button', { name: 'Create' }).or(page.locator('[role="dialog"] button:has-text("Create")')).first();
    this.apnEditModal = page.locator('[role="dialog"], .MuiDialog-root').filter({ hasText: /Edit APN/i }).first();
    this.apnDescriptionInput = page.getByLabel('Description').or(page.locator('textarea[name="description"], input[name="description"]')).first();
    this.apnSubmitUpdateBtn = page.locator('[role="dialog"]').getByRole('button', { name: 'Update' }).or(page.locator('[role="dialog"] button:has-text("Update")')).first();

    // QoS Elements
    this.qosCreateModal = page.locator('[role="dialog"], .MuiDialog-root').filter({ hasText: /Create New QoS/i }).first();
    this.qosNameInput = page.getByLabel('QoS Name').or(page.getByLabel('Name')).first();
    this.qosQciInput = page.getByLabel('QCI').or(page.locator('input[name="qci"], .MuiSelect-root')).first();
    this.qosArpInput = page.getByLabel('ARP Priority').or(page.locator('input[name="arpPriority"], input[name="arp"]')).first();
    this.qosMbrUplinkInput = page.getByLabel('MBR Uplink').or(page.locator('input[name="mbrUplink"]')).first();
    this.qosMbrDownlinkInput = page.getByLabel('MBR Downlink').or(page.locator('input[name="mbrDownlink"]')).first();
    this.qosSubmitCreateBtn = page.locator('[role="dialog"]').getByRole('button', { name: 'Create' }).first();
    this.qosEditModal = page.locator('[role="dialog"], .MuiDialog-root').filter({ hasText: /Edit QoS/i }).first();
    this.qosSubmitUpdateBtn = page.locator('[role="dialog"]').getByRole('button', { name: 'Update' }).first();

    // Network Profile Elements
    this.networkProfileCreateModal = page.locator('[role="dialog"], .MuiDialog-root').filter({ hasText: /Network Profile/i }).first();
    this.networkProfileNameInput = page.getByLabel('Network Profile Name').or(page.getByLabel('Profile Name')).or(page.getByLabel('Name')).first();
    this.netProf5GDataRow = page.locator('tr:has-text("5G Data")');
    this.netProf4GDataRoamingRow = page.locator('tr:has-text("4G Data Roaming"), tr:has-text("4G Data")');
    this.netProf2G3GDataRoamingRow = page.locator('tr:has-text("2G/3G Data Roaming"), tr:has-text("2G/3G Data")');
    this.netProfSaveBtn = page.locator('[role="dialog"]').getByRole('button', { name: 'Save' }).or(page.locator('[role="dialog"] button:has-text("Save")')).first();

    // Numbering Plan & MSISDN Elements
    this.numberingPlanCreateModal = page.locator('[role="dialog"], .MuiDialog-root').filter({ hasText: /Create Numbering Plan/i }).first();
    this.numberingPlanNameInput = page.getByLabel('Numbering Plan Name').first();
    this.numberingPlanAgingInput = page.getByLabel('Aging Period').first();
    this.numberingPlanDescInput = page.getByLabel('Description').first();
    this.numberingPlanSubmitCreateBtn = page.locator('[role="dialog"]').getByRole('button', { name: 'Create' }).first();
    this.downloadSampleMsisdnTemplateLink = page.getByRole('link', { name: 'Download sample file template' }).or(page.getByText('Download sample file template')).first();
    this.uploadMsisdnFileBtn = page.getByRole('button', { name: 'Upload MSISDN File' }).or(page.locator('label:has-text("Upload MSISDN")')).first();
    this.uploadMsisdnFileInput = page.locator('#sampleFile, input[type="file"][name="sampleFile"]');
    this.msisdnAllocationPreviewBtn = page.locator('button:has-text("preview"), [data-testid="PreviewIcon"]').first();

    // Roaming Profile Elements
    this.roamingProfileCreateModal = page.locator('[role="dialog"], .MuiDialog-root').filter({ hasText: /Create Roaming Profile/i }).first();
    this.roamingProfileNameInput = page.getByLabel('Roaming Profiles Name').first();
    this.roamingProfilePlmnAttBtn = page.locator('[role="dialog"]').getByRole('button', { name: 'ATT' }).or(page.locator('[role="dialog"] div:has-text("ATT")')).first();
    this.roamingProfileDrepNameInput = page.getByLabel('Roaming Profile DREP Name').first();
    this.roamingProfileDescInput = page.locator('[role="dialog"]').getByLabel('Description').first();
    this.roamingProfileSubmitCreateBtn = page.locator('[role="dialog"]').getByRole('button', { name: 'Create' }).first();
    this.roamingProfileEditModal = page.locator('[role="dialog"], .MuiDialog-root').filter({ hasText: /Edit Roaming Profile/i }).first();
    this.roamingProfileSubmitUpdateBtn = page.locator('[role="dialog"]').getByRole('button', { name: 'Update' }).first();

    // CCS Offer ID Elements
    this.ccsOfferCreateModal = page.locator('[role="dialog"], .MuiDialog-root').filter({ hasText: /Create CCS Offer/i }).first();
    this.ccsOfferIdInput = page.getByLabel('CCS Offer ID').first();
    this.ccsOfferTypePrivateRadio = page.locator('input[value="private"], [role="radio"][value="private"]').first();
    this.ccsOfferTypePublicRadio = page.locator('input[value="public"], [role="radio"][value="public"]').first();
    this.ccsOfferDescInput = page.locator('[role="dialog"]').getByLabel('Description').first();
    this.ccsOfferSubmitCreateBtn = page.locator('[role="dialog"]').getByRole('button', { name: 'Create' }).first();
    this.ccsOfferEditModal = page.locator('[role="dialog"], .MuiDialog-root').filter({ hasText: /Edit CCS Offer ID/i }).first();
    this.ccsOfferSubmitUpdateBtn = page.locator('[role="dialog"]').getByRole('button', { name: 'Update' }).first();

    // Common Dialog Buttons & Actions
    this.menuItemEdit = page.getByRole('menuitem', { name: /Edit/i }).or(page.locator('[role="menuitem"]:has-text("Edit")')).first();
    this.menuItemDelete = page.getByRole('menuitem', { name: /Delete/i }).or(page.locator('[role="menuitem"]:has-text("Delete")')).first();
    this.modalOkBtn = page.getByRole('button', { name: /^OK$/i }).or(page.locator('button:has-text("OK"), button:has-text("Ok")')).first();
    this.modalConfirmBtn = page.getByRole('button', { name: /^Confirm$/i }).or(page.locator('button:has-text("Confirm")')).first();
    this.modalCancelBtn = page.getByRole('button', { name: /^Cancel$/i }).or(page.locator('button:has-text("Cancel")')).first();
    this.modalYesBtn = page.getByRole('button', { name: /^Yes$/i }).or(page.locator('button:has-text("Yes")')).first();
  }

  /**
   * Search within the active resource table
   */
  async search(query: string): Promise<void> {
    Logger.info(`Searching Resources table for: "${query}"`);
    await this.searchInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.searchInput.fill(query);
    await this.page.keyboard.press('Enter');
    await this.waitForLoadingSpinnerToDisappear();
  }

  /**
   * Verify table headers are visible
   */
  async verifyTableHeaders(expectedHeaders: string[]): Promise<void> {
    Logger.info(`Verifying table headers: ${expectedHeaders.join(', ')}`);
    await this.dataTable.first().waitFor({ state: 'visible', timeout: 15000 });
    for (const header of expectedHeaders) {
      const headerLocator = this.tableHeaders.filter({ hasText: new RegExp(header, 'i') });
      await expect(headerLocator.first()).toBeVisible({ timeout: 10000 });
    }
  }

  /**
   * Get row count in the current view
   */
  async getRowCount(): Promise<number> {
    await this.waitForLoadingSpinnerToDisappear();
    return await this.tableRows.count();
  }

  /**
   * Open the 3-dots action menu (`more_vert`) for a specific row
   */
  async openRowActionMenu(rowIdentifier: string | number): Promise<void> {
    Logger.info(`Opening action menu for row: ${rowIdentifier}`);
    let row: Locator;
    if (typeof rowIdentifier === 'number') {
      row = this.tableRows.nth(rowIdentifier);
    } else {
      row = this.tableRows.filter({ hasText: rowIdentifier }).first();
    }
    const actionBtn = row.locator('button:has-text("more_vert"), [data-testid="MoreVertIcon"], button').last();
    await actionBtn.waitFor({ state: 'visible', timeout: 5000 });
    await actionBtn.click();
    await this.page.waitForTimeout(300);
  }

  /**
   * Dismiss modal dialog safely if present
   */
  async dismissModalIfOpen(): Promise<void> {
    if (await this.modalCancelBtn.isVisible({ timeout: 1500 })) {
      await this.modalCancelBtn.click();
      if (await this.modalYesBtn.isVisible({ timeout: 1500 })) {
        await this.modalYesBtn.click();
      }
    }
  }

  /**
   * Helper to fill APN creation modal with guaranteed unique names
   */
  async fillApnModalUnique(options?: { apnName?: string; pdpName?: string; agingPeriod?: string }): Promise<{ apnName: string; pdpName: string }> {
    const apnName = options?.apnName || (await this.fillUnique(this.apnNameInput, 'apn'));
    const pdpName = options?.pdpName || (await this.fillUnique(this.apnPdpNameInput, 'PDP'));
    if (await this.apnAgingPeriodInput.isVisible({ timeout: 1500 })) {
      await this.apnAgingPeriodInput.fill(options?.agingPeriod || '5');
    }
    return { apnName, pdpName };
  }

  /**
   * Helper to fill Network Profile creation modal with guaranteed unique profile name
   */
  async fillNetworkProfileModalUnique(options?: { name?: string }): Promise<string> {
    const name = options?.name || (await this.fillUnique(this.networkProfileNameInput, 'networkProfile'));
    return name;
  }
}
