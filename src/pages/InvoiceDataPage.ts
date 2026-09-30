import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { Logger } from '../utils/logger';

export class InvoiceDataPage extends BasePage {
  readonly pageTitle: Locator;
  readonly searchInput: Locator;
  readonly dataTable: Locator;
  readonly tableRows: Locator;
  readonly tableHeaders: Locator;
  readonly dateRangeBtn: Locator;

  // Tabs
  readonly accountInvoicesTab: Locator;
  readonly feedsTab: Locator;
  readonly finalInvoicesTab: Locator;
  readonly adjustmentsTab: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('h1, h2, h3, .page-title, .MuiTypography-h5').first();
    this.searchInput = page.locator('input[placeholder*="Search" i], input[type="search"], .MuiInputBase-input').first();
    this.dataTable = page.locator('table, [role="grid"], .MuiTable-root');
    this.tableRows = page.locator('table tbody tr, [role="row"]:not([role="columnheader"])');
    this.tableHeaders = page.locator('table th, [role="columnheader"]');
    this.dateRangeBtn = page.locator('button:has-text("Date"), button:has-text("Billing")').first();

    this.accountInvoicesTab = page.locator('button:has-text("Invoices"), a:has-text("Invoices")');
    this.feedsTab = page.locator('button:has-text("Feeds"), a:has-text("Feeds")');
    this.finalInvoicesTab = page.locator('button:has-text("Final"), a:has-text("Final")');
    this.adjustmentsTab = page.locator('button:has-text("Adjustment"), a:has-text("Adjustment")');
  }

  /**
   * Search invoice data
   */
  async search(query: string): Promise<void> {
    Logger.info(`Searching Invoice Data table for: "${query}"`);
    await this.searchInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.searchInput.fill(query);
    await this.page.keyboard.press('Enter');
    await this.waitForLoadingSpinnerToDisappear();
  }

  /**
   * Verify table headers
   */
  async verifyTableHeaders(expectedHeaders: string[]): Promise<void> {
    Logger.info(`Verifying invoice table headers: ${expectedHeaders.join(', ')}`);
    await this.dataTable.first().waitFor({ state: 'visible', timeout: 15000 });
    for (const header of expectedHeaders) {
      const headerLocator = this.tableHeaders.filter({ hasText: new RegExp(header, 'i') });
      await expect(headerLocator.first()).toBeVisible({ timeout: 10000 });
    }
  }
}
