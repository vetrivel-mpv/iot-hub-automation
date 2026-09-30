import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { Logger } from '../utils/logger';

export class AutomationRulesPage extends BasePage {
  readonly pageTitle: Locator;
  readonly searchInput: Locator;
  readonly dataTable: Locator;
  readonly tableRows: Locator;
  readonly tableHeaders: Locator;
  readonly createRuleBtn: Locator;

  // Tabs
  readonly globalRulesTab: Locator;
  readonly enterpriseRulesTab: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('h1, h2, h3, .page-title, .MuiTypography-h5').first();
    this.searchInput = page.locator('input[placeholder*="Search" i], input[type="search"], .MuiInputBase-input').first();
    this.dataTable = page.locator('table, [role="grid"], .MuiTable-root');
    this.tableRows = page.locator('table tbody tr, [role="row"]:not([role="columnheader"])');
    this.tableHeaders = page.locator('table th, [role="columnheader"]');
    this.createRuleBtn = page.locator('button:has-text("CREATE RULE"), button:has-text("+ RULE"), button:has-text("+")').first();

    this.globalRulesTab = page.locator('button:has-text("Global"), a:has-text("Global")');
    this.enterpriseRulesTab = page.locator('button:has-text("Enterprise"), a:has-text("Enterprise")');
  }

  /**
   * Search in rules grid
   */
  async search(query: string): Promise<void> {
    Logger.info(`Searching Automation Rules table for: "${query}"`);
    await this.searchInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.searchInput.fill(query);
    await this.page.keyboard.press('Enter');
    await this.waitForLoadingSpinnerToDisappear();
  }

  /**
   * Verify table headers
   */
  async verifyTableHeaders(expectedHeaders: string[]): Promise<void> {
    Logger.info(`Verifying automation rules table headers: ${expectedHeaders.join(', ')}`);
    await this.dataTable.first().waitFor({ state: 'visible', timeout: 15000 });
    for (const header of expectedHeaders) {
      const headerLocator = this.tableHeaders.filter({ hasText: new RegExp(header, 'i') });
      await expect(headerLocator.first()).toBeVisible({ timeout: 10000 });
    }
  }
}
