import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { Logger } from '../utils/logger';

export class OrderingPage extends BasePage {
  readonly pageTitle: Locator;
  readonly accountContextModal: Locator;
  readonly modalCloseBtn: Locator;
  readonly accountSelectDropdown: Locator;
  readonly proceedBtn: Locator;
  readonly ordersTable: Locator;
  readonly searchInput: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('h1, h2, h3, .page-title, .MuiTypography-h5').first();
    this.accountContextModal = page.locator('.MuiDialog-root, [role="dialog"]');
    this.modalCloseBtn = page.locator('.MuiDialog-root button:has-text("✕"), .MuiDialog-root button:has-text("CLOSE"), .MuiDialog-root button:has-text("CANCEL")').first();
    this.accountSelectDropdown = page.locator('.MuiDialog-root .MuiSelect-select, .MuiDialog-root [role="combobox"]').first();
    this.proceedBtn = page.locator('.MuiDialog-root button:has-text("PROCEED"), .MuiDialog-root button:has-text("OK")').first();
    this.ordersTable = page.locator('table, [role="grid"], .MuiTable-root');
    this.searchInput = page.locator('input[placeholder*="Search" i], input[type="search"]').first();
  }

  /**
   * Dismiss account context modal if present
   */
  async dismissAccountContextModalIfPresent(): Promise<void> {
    try {
      if (await this.accountContextModal.isVisible({ timeout: 4000 })) {
        Logger.info('Dismissing account context selection modal');
        await this.page.keyboard.press('Escape');
        await this.waitForLoadingSpinnerToDisappear();
      }
    } catch {
      // Modal was not present
    }
  }
}
