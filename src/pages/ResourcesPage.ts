import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { Logger } from '../utils/logger';

export class ResourcesPage extends BasePage {
  readonly pageTitle: Locator;
  readonly searchInput: Locator;
  readonly dataTable: Locator;
  readonly tableRows: Locator;
  readonly tableHeaders: Locator;
  readonly createBtn: Locator;
  readonly actionToolbar: Locator;
  readonly paginationInfo: Locator;

  // Specific resource tabs/views
  readonly apnTab: Locator;
  readonly qosTab: Locator;
  readonly networkProfileTab: Locator;
  readonly simInventoryTab: Locator;
  readonly sliceTab: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('h1, h2, h3, .page-title, .MuiTypography-h5').first();
    this.searchInput = page.locator('input[placeholder*="Search" i], input[type="search"], .MuiInputBase-input').first();
    this.dataTable = page.locator('table, [role="grid"], .MuiTable-root');
    this.tableRows = page.locator('table tbody tr, [role="row"]:not([role="columnheader"])');
    this.tableHeaders = page.locator('table th, [role="columnheader"]');
    this.createBtn = page.locator('button:has-text("CREATE"), button:has-text("ADD"), button:has-text("+")').first();
    this.actionToolbar = page.locator('.toolbar, .action-bar, .MuiToolbar-root');
    this.paginationInfo = page.locator('.MuiTablePagination-displayedRows, .pagination-info, .page-info');

    this.apnTab = page.locator('button:has-text("APN"), a:has-text("APN"), [role="tab"]:has-text("APN")');
    this.qosTab = page.locator('button:has-text("QoS"), a:has-text("QoS"), [role="tab"]:has-text("QoS")');
    this.networkProfileTab = page.locator('button:has-text("Network Profile"), a:has-text("Network Profile")');
    this.simInventoryTab = page.locator('button:has-text("SIM Inventory"), a:has-text("SIM Inventory")');
    this.sliceTab = page.locator('button:has-text("Slice"), a:has-text("Slice")');
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
}
