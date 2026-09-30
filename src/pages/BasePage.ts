import { Page, Locator, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { Logger } from '../utils/logger';
import { ApiPerformanceTracker, ActionPerformanceReport } from '../utils/apiPerformanceTracker';
import { ResilientLocator } from '../utils/resilientLocator';
import { ComplianceAudit, AccessibilityAuditOptions, VisualComparisonOptions } from '../utils/complianceAudit';

export abstract class BasePage {
  readonly page: Page;
  readonly apiTracker: ApiPerformanceTracker;
  readonly resilient: ResilientLocator;

  // Common locators
  readonly loadingSpinner: Locator;
  readonly appLoadingMask: Locator;
  readonly toastAlert: Locator;
  readonly modalContainer: Locator;

  constructor(page: Page) {
    this.page = page;
    this.apiTracker = new ApiPerformanceTracker(page);
    this.resilient = new ResilientLocator(page);
    this.loadingSpinner = page.locator('.lds-pacman, .lds-css, .spinner-border, [role="progressbar"]');
    this.appLoadingMask = page.locator('.app-loading');
    this.toastAlert = page.locator('.toast, .alert, .notification, [role="alert"], .ant-message, .MuiAlert-root');
    this.modalContainer = page.locator('.modal, [role="dialog"], .MuiDialog-root');
  }

  /**
   * Navigates to a specific path or root if not specified
   */
  async navigate(path: string = ''): Promise<void> {
    Logger.info(`Navigating to: ${path || '/'}`);
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
    await this.waitForLoadingSpinnerToDisappear();
  }

  /**
   * Waits for loading spinners or pacman loaders to finish
   */
  async waitForLoadingSpinnerToDisappear(timeout: number = 20000): Promise<void> {
    try {
      if (await this.loadingSpinner.first().isVisible({ timeout: 1500 })) {
        Logger.info('Waiting for loading spinner to disappear...');
        await this.loadingSpinner.first().waitFor({ state: 'hidden', timeout });
      }
      if (await this.appLoadingMask.first().isVisible({ timeout: 1000 })) {
        await this.appLoadingMask.first().waitFor({ state: 'hidden', timeout });
      }
    } catch {
      // Spinner might have completed immediately or was not present
    }
  }

  /**
   * Waits for the page to reach a stable state
   */
  async waitForPageReady(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
    await this.waitForLoadingSpinnerToDisappear();
  }

  /**
   * Internal click implementation with retry and force handling
   */
  private async performClick(locator: Locator, description?: string): Promise<void> {
    const desc = description || (await locator.toString());
    Logger.info(`Clicking element: ${desc}`);
    await this.waitForLoadingSpinnerToDisappear();
    await locator.waitFor({ state: 'visible', timeout: 10000 });
    try {
      await locator.click({ timeout: 8000 });
    } catch {
      await this.waitForLoadingSpinnerToDisappear();
      await locator.click({ force: true, timeout: 5000 });
    }
  }

  /**
   * Clicks an element with auto-waiting, logging, and automatic API performance tracking
   */
  async click(locator: Locator, description?: string, settleWaitMs: number = 600): Promise<void> {
    const desc = description || (await locator.toString());
    await this.apiTracker.measureAction(
      `Click: ${desc}`,
      async () => {
        await this.performClick(locator, desc);
      },
      settleWaitMs
    );
  }

  /**
   * Clicks an element and returns the detailed performance report object
   */
  async clickAndMeasure(locator: Locator, description?: string, settleWaitMs: number = 800): Promise<ActionPerformanceReport> {
    const desc = description || (await locator.toString());
    const { report } = await this.apiTracker.measureAction(
      `Click: ${desc}`,
      async () => {
        await this.performClick(locator, desc);
      },
      settleWaitMs
    );
    return report;
  }

  /**
   * Executes any generic UI action function and measures its triggered network API calls and latency
   */
  async trackAction<T>(actionName: string, actionFn: () => Promise<T>, settleWaitMs: number = 800): Promise<{ result: T; report: ActionPerformanceReport }> {
    return await this.apiTracker.measureAction(actionName, actionFn, settleWaitMs);
  }

  /**
   * Fills text in an input element
   */
  async fill(locator: Locator, value: string, description?: string): Promise<void> {
    const desc = description || (await locator.toString());
    const maskedValue = desc.toLowerCase().includes('password') ? '********' : value;
    Logger.info(`Filling "${maskedValue}" into: ${desc}`);
    await locator.waitFor({ state: 'visible', timeout: 10000 });
    await locator.fill(value);
  }

  /**
   * Checks if an element is visible within a timeout
   */
  async isVisible(locator: Locator, timeout: number = 5000): Promise<boolean> {
    try {
      await locator.first().waitFor({ state: 'visible', timeout });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Gets the current page title
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Gets current URL
   */
  getCurrentUrl(): string {
    return this.page.url();
  }

  /**
   * Captures a screenshot attached to reports
   */
  async captureScreenshot(name: string): Promise<Buffer> {
    const screenshotDir = path.resolve('reports/artifacts/screenshots');
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }
    const screenshotPath = path.join(screenshotDir, `${Date.now()}_${name}.png`);
    Logger.info(`Saving screenshot to ${screenshotPath}`);
    return await this.page.screenshot({ path: screenshotPath, fullPage: true });
  }

  /**
   * Asserts page title contains expected text
   */
  async expectTitle(expected: string | RegExp): Promise<void> {
    await expect(this.page).toHaveTitle(expected);
  }

  /**
   * Asserts URL matches expected regex or string
   */
  async expectUrl(expected: string | RegExp): Promise<void> {
    await expect(this.page).toHaveURL(expected);
  }

  /**
   * Runs an accessibility audit on this page
   */
  async auditAccessibility(pageName: string, options?: AccessibilityAuditOptions) {
    return ComplianceAudit.auditAccessibility(this.page, pageName, options);
  }

  /**
   * Asserts visual match for this page or element
   */
  async assertVisualMatch(snapshotName: string, options?: VisualComparisonOptions) {
    return ComplianceAudit.assertVisualMatch(this.page, snapshotName, options);
  }
}
