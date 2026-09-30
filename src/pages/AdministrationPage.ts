import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { Logger } from '../utils/logger';

export class AdministrationPage extends BasePage {
  readonly pageTitle: Locator;
  readonly searchInput: Locator;
  readonly dataTable: Locator;
  readonly tableRows: Locator;
  readonly tableHeaders: Locator;
  readonly addUserBtn: Locator;
  readonly roleBadges: Locator;

  // Tabs
  readonly usersTab: Locator;
  readonly userGroupsTab: Locator;
  readonly rolesTab: Locator;
  readonly ipWhitelistTab: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('h1, h2, h3, .page-title, .MuiTypography-h5').first();
    this.searchInput = page.locator('input[placeholder*="Search" i], input[type="search"], .MuiInputBase-input').first();
    this.dataTable = page.locator('table, [role="grid"], .MuiTable-root');
    this.tableRows = page.locator('table tbody tr, [role="row"]:not([role="columnheader"])');
    this.tableHeaders = page.locator('table th, [role="columnheader"]');
    this.addUserBtn = page.locator('button:has-text("CREATE USER"), button:has-text("ADD USER"), button:has-text("+")').first();
    this.roleBadges = page.locator('.badge, .MuiChip-root');

    this.usersTab = page.locator('button:has-text("Users"), a:has-text("Users")');
    this.userGroupsTab = page.locator('button:has-text("User Groups"), a:has-text("User Groups")');
    this.rolesTab = page.locator('button:has-text("Roles"), a:has-text("Roles")');
    this.ipWhitelistTab = page.locator('button:has-text("IP Whitelist"), a:has-text("IP Whitelist")');
  }

  /**
   * Search in user / admin grid
   */
  async search(query: string): Promise<void> {
    Logger.info(`Searching Administration table for: "${query}"`);
    await this.searchInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.searchInput.fill(query);
    await this.page.keyboard.press('Enter');
    await this.waitForLoadingSpinnerToDisappear();
  }

  /**
   * Verify table headers
   */
  async verifyTableHeaders(expectedHeaders: string[]): Promise<void> {
    Logger.info(`Verifying admin table headers: ${expectedHeaders.join(', ')}`);
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
