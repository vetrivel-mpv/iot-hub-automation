import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { Logger } from '../utils/logger';

export class AuditLogsPage extends BasePage {
  // Quick Date Range Filter Buttons
  readonly todayFilterButton: Locator;
  readonly last7DaysFilterButton: Locator;
  readonly last30DaysFilterButton: Locator;

  // Date Pickers
  readonly startDatePicker: Locator;
  readonly endDatePicker: Locator;

  // Header Actions
  readonly columnVisibilityButton: Locator;
  readonly exportButton: Locator;
  readonly refreshButton: Locator;

  // Column Filter Inputs
  readonly filterUserContext: Locator;
  readonly filterUser: Locator;
  readonly filterServiceDropdown: Locator;
  readonly filterOperation: Locator;
  readonly filterDescription: Locator;

  // Table Data
  readonly auditTable: Locator;
  readonly tableRows: Locator;
  readonly totalRecordsInfo: Locator;

  constructor(page: Page) {
    super(page);

    // Quick filters
    this.todayFilterButton = page.locator('button, [role="button"], a, div').filter({ hasText: /^TODAY$/i });
    this.last7DaysFilterButton = page.locator('button, [role="button"], a, div').filter({ hasText: /^LAST 7 DAYS$/i });
    this.last30DaysFilterButton = page.locator('button, [role="button"], a, div').filter({ hasText: /^LAST 30 DAYS$/i });

    // Date inputs
    this.startDatePicker = page.locator('input[placeholder*="YYYY-MM-DD" i]').nth(0);
    this.endDatePicker = page.locator('input[placeholder*="YYYY-MM-DD" i]').nth(1);

    // Actions
    this.columnVisibilityButton = page.locator('[data-testid="VisibilityIcon"], button:has(svg[data-testid*="Visibility" i])');
    this.exportButton = page.locator('[data-testid="SaveAltIcon"], [data-testid="SaveIcon"], button:has(svg[data-testid*="Save" i])');
    this.refreshButton = page.locator('[data-testid="RefreshIcon"], button:has(svg[data-testid*="Refresh" i])');

    // Column Filters
    this.filterUserContext = page.locator('input[placeholder*="Filter" i]').nth(0);
    this.filterUser = page.locator('input[placeholder*="Filter" i]').nth(1);
    this.filterServiceDropdown = page.locator('div:has-text("Filter"), select[name*="service" i]').nth(0);
    this.filterOperation = page.locator('input[placeholder*="Filter" i]').nth(2);
    this.filterDescription = page.locator('input[placeholder*="Filter" i]').nth(3);

    // Table elements
    this.auditTable = page.locator('table, [role="grid"], .MuiTable-root');
    this.tableRows = page.locator('table tbody tr, [role="row"]');
    this.totalRecordsInfo = page.locator('.MuiTablePagination-displayedRows, div:has-text("of")');
  }

  /**
   * Navigates directly to Audit Logs page
   */
  async goto(): Promise<void> {
    Logger.info('Navigating to Audit Logs page');
    await this.navigate('/security/audit-logs');
    await this.waitForPageReady();
  }

  /**
   * Clicks one of the date range filter buttons
   */
  async selectDateRange(range: 'today' | 'last7days' | 'last30days'): Promise<void> {
    Logger.info(`Selecting date range filter: ${range}`);
    if (range === 'today') {
      await this.click(this.todayFilterButton.first(), 'TODAY Filter Button');
    } else if (range === 'last7days') {
      await this.click(this.last7DaysFilterButton.first(), 'LAST 7 DAYS Filter Button');
    } else {
      await this.click(this.last30DaysFilterButton.first(), 'LAST 30 DAYS Filter Button');
    }
    await this.waitForLoadingSpinnerToDisappear();
  }

  /**
   * Filters audit logs by user
   */
  async filterByUser(username: string): Promise<void> {
    Logger.info(`Filtering audit logs by user: "${username}"`);
    await this.fill(this.filterUser.first(), username, 'User Filter Input');
    await this.page.keyboard.press('Enter');
    await this.waitForLoadingSpinnerToDisappear();
  }

  /**
   * Gets the total number of table rows currently displayed
   */
  async getDisplayedRowsCount(): Promise<number> {
    return await this.tableRows.count();
  }
}
