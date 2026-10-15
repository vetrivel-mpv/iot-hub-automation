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

  // Monthly Rating Report Locators
  readonly monthlyRatingReportTab: Locator;
  readonly billingPeriodSelector: Locator;
  readonly ratingSummaryCard: Locator;
  readonly chargeLineItemRows: Locator;
  readonly subscriptionRentalCharge: Locator;
  readonly dataUsageOverageCharge: Locator;
  readonly smsUsageCharge: Locator;
  readonly voiceUsageCharge: Locator;
  readonly poolAddonCharge: Locator;
  readonly oneTimeServiceFeesCharge: Locator;
  readonly discountsAndCredits: Locator;
  readonly applicableTaxCharge: Locator;
  readonly netTotalCharge: Locator;
  readonly exportRatingReportBtn: Locator;

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

    // Monthly Rating Report specific elements
    this.monthlyRatingReportTab = page.locator('button:has-text("Monthly Rating"), a:has-text("Monthly Rating"), [role="tab"]:has-text("Rating Report")').first();
    this.billingPeriodSelector = page.locator('.billing-period-selector, input[placeholder*="Billing Period" i], select[name*="cycle" i], [aria-label*="Billing Period" i]').first();
    this.ratingSummaryCard = page.locator('.rating-summary-card, .rating-breakdown, [data-testid="rating-summary"]').first();
    this.chargeLineItemRows = page.locator('.line-item-row, tbody tr.charge-item, [role="row"].rating-charge');
    this.subscriptionRentalCharge = page.locator('[data-charge="subscription_rental"], tr:has-text("Subscription Rental"), tr:has-text("Line Rental")');
    this.dataUsageOverageCharge = page.locator('[data-charge="data_overage"], tr:has-text("Data Overage"), tr:has-text("Data Usage")');
    this.smsUsageCharge = page.locator('[data-charge="sms_usage"], tr:has-text("SMS Usage"), tr:has-text("SMS Charges")');
    this.voiceUsageCharge = page.locator('[data-charge="voice_usage"], tr:has-text("Voice Usage"), tr:has-text("Voice Charges")');
    this.poolAddonCharge = page.locator('[data-charge="pool_addon"], tr:has-text("Pool Add-on"), tr:has-text("Add-on Bundle")');
    this.oneTimeServiceFeesCharge = page.locator('[data-charge="service_fees"], tr:has-text("Service Fee"), tr:has-text("Admin Fee")');
    this.discountsAndCredits = page.locator('[data-charge="discount"], tr:has-text("Discount"), tr:has-text("Credit Adjustment")');
    this.applicableTaxCharge = page.locator('[data-charge="tax"], tr:has-text("VAT"), tr:has-text("Tax")');
    this.netTotalCharge = page.locator('[data-charge="total"], tr:has-text("Net Total"), tr:has-text("Total Amount"), .total-amount');
    this.exportRatingReportBtn = page.locator('button:has-text("Export Report"), button:has-text("Download Rating"), [aria-label*="Export Rating" i]').first();
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
   * Selects billing period (e.g., '2026-09' or 'Current Billing Cycle')
   */
  async selectBillingPeriod(period: string = 'Current'): Promise<void> {
    Logger.info(`Selecting Monthly Rating Report Billing Period: "${period}"`);
    if (await this.billingPeriodSelector.isVisible({ timeout: 3000 })) {
      await this.click(this.billingPeriodSelector, 'Billing Period Selector');
      const opt = this.page.locator(`[role="option"]:has-text("${period}"), [role="menuitem"]:has-text("${period}")`).first();
      if (await opt.isVisible({ timeout: 2000 })) {
        await this.click(opt, `Billing Period Option: ${period}`);
      } else {
        await this.page.keyboard.press('Escape');
      }
      await this.waitForLoadingSpinnerToDisappear();
    }
  }

  /**
   * Verify all individual charge categories in Monthly Rating Report
   */
  async verifyAllChargeComponents(): Promise<{
    hasRental: boolean;
    hasData: boolean;
    hasSms: boolean;
    hasVoice: boolean;
    hasPool: boolean;
    hasFees: boolean;
    hasTax: boolean;
    hasTotal: boolean;
  }> {
    Logger.info('Validating individual charge components in Monthly Rating Report');
    const results = {
      hasRental: await this.subscriptionRentalCharge.first().isVisible({ timeout: 2000 }).catch(() => false),
      hasData: await this.dataUsageOverageCharge.first().isVisible({ timeout: 2000 }).catch(() => false),
      hasSms: await this.smsUsageCharge.first().isVisible({ timeout: 2000 }).catch(() => false),
      hasVoice: await this.voiceUsageCharge.first().isVisible({ timeout: 2000 }).catch(() => false),
      hasPool: await this.poolAddonCharge.first().isVisible({ timeout: 2000 }).catch(() => false),
      hasFees: await this.oneTimeServiceFeesCharge.first().isVisible({ timeout: 2000 }).catch(() => false),
      hasTax: await this.applicableTaxCharge.first().isVisible({ timeout: 2000 }).catch(() => false),
      hasTotal: await this.netTotalCharge.first().isVisible({ timeout: 2000 }).catch(() => false),
    };
    Logger.info(`Charge components inspection: ${JSON.stringify(results)}`);
    return results;
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
