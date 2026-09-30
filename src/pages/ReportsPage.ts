import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { Logger } from '../utils/logger';

export class ReportsPage extends BasePage {
  readonly pageTitle: Locator;
  readonly searchInput: Locator;
  readonly dataTable: Locator;
  readonly tableRows: Locator;
  readonly tableHeaders: Locator;
  readonly filterChips: Locator;
  readonly dateFilterBtn: Locator;
  readonly exportBtn: Locator;

  // Tabs
  readonly batchExecutionsTab: Locator;
  readonly offTheShelfTab: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('h1, h2, h3, .page-title, .MuiTypography-h5').first();
    this.searchInput = page.locator('input[placeholder*="Search" i], input[type="search"], .MuiInputBase-input').first();
    this.dataTable = page.locator('table, [role="grid"], .MuiTable-root');
    this.tableRows = page.locator('table tbody tr, [role="row"]:not([role="columnheader"])');
    this.tableHeaders = page.locator('table th, [role="columnheader"]');
    this.filterChips = page.locator('.MuiChip-root, .filter-chip, .badge');
    this.dateFilterBtn = page.locator('button:has-text("Date"), button:has-text("Filter"), .date-picker-btn').first();
    this.exportBtn = page.locator('button:has-text("EXPORT"), button:has-text("DOWNLOAD")').first();

    this.batchExecutionsTab = page.locator('button:has-text("Batch"), a:has-text("Batch")');
    this.offTheShelfTab = page.locator('button:has-text("Off-the-shelf"), a:has-text("Off-the-shelf"), a:has-text("Standard")');
  }

  /**
   * Search in reports grid
   */
  async search(query: string): Promise<void> {
    Logger.info(`Searching Reports table for: "${query}"`);
    await this.searchInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.searchInput.fill(query);
    await this.page.keyboard.press('Enter');
    await this.waitForLoadingSpinnerToDisappear();
  }

  /**
   * Filter by status chip
   */
  async filterByStatus(status: string): Promise<void> {
    Logger.info(`Filtering reports by status: ${status}`);
    const chip = this.filterChips.filter({ hasText: new RegExp(status, 'i') }).first();
    if (await chip.isVisible({ timeout: 3000 })) {
      await this.click(chip);
      await this.waitForLoadingSpinnerToDisappear();
    }
  }

  /**
   * Verify table headers
   */
  async verifyTableHeaders(expectedHeaders: string[]): Promise<void> {
    Logger.info(`Verifying report table headers: ${expectedHeaders.join(', ')}`);
    await this.dataTable.first().waitFor({ state: 'visible', timeout: 15000 });
    for (const header of expectedHeaders) {
      const headerLocator = this.tableHeaders.filter({ hasText: new RegExp(header, 'i') });
      await expect(headerLocator.first()).toBeVisible({ timeout: 10000 });
    }
  }
}
