import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { Logger } from '../utils/logger';

export class RatingPage extends BasePage {
  readonly pageTitle: Locator;
  readonly searchInput: Locator;
  readonly dataTable: Locator;
  readonly tableRows: Locator;
  readonly tableHeaders: Locator;
  readonly createBtn: Locator;
  readonly filterSelect: Locator;

  // Specific rating catalog views
  readonly ratePlansTab: Locator;
  readonly addonBundleTab: Locator;
  readonly serviceFeesTab: Locator;
  readonly discountsTab: Locator;
  readonly quotaTab: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('h1, h2, h3, .page-title, .MuiTypography-h5').first();
    this.searchInput = page.locator('input[placeholder*="Search" i], input[type="search"], .MuiInputBase-input').first();
    this.dataTable = page.locator('table, [role="grid"], .MuiTable-root');
    this.tableRows = page.locator('table tbody tr, [role="row"]:not([role="columnheader"])');
    this.tableHeaders = page.locator('table th, [role="columnheader"]');
    this.createBtn = page.locator('button:has-text("CREATE"), button:has-text("ADD"), button:has-text("+")').first();
    this.filterSelect = page.locator('.MuiSelect-select, select').first();

    this.ratePlansTab = page.locator('button:has-text("Rate Plans"), a:has-text("Rate Plans")');
    this.addonBundleTab = page.locator('button:has-text("Add-on Bundle"), a:has-text("Add-on Bundle")');
    this.serviceFeesTab = page.locator('button:has-text("Service Fee"), a:has-text("Service Fee")');
    this.discountsTab = page.locator('button:has-text("Discount"), a:has-text("Discount")');
    this.quotaTab = page.locator('button:has-text("Quota"), a:has-text("Quota")');
  }

  /**
   * Search in the active rating table
   */
  async search(query: string): Promise<void> {
    Logger.info(`Searching Rating table for: "${query}"`);
    await this.searchInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.searchInput.fill(query);
    await this.page.keyboard.press('Enter');
    await this.waitForLoadingSpinnerToDisappear();
  }

  /**
   * Verify table headers
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
   * Get row count
   */
  async getRowCount(): Promise<number> {
    await this.waitForLoadingSpinnerToDisappear();
    return await this.tableRows.count();
  }
}
