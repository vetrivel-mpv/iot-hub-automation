import { Page, Locator, expect, test } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { Logger } from '../utils/logger';
import { ApiPerformanceTracker, ActionPerformanceReport } from '../utils/apiPerformanceTracker';
import { ResilientLocator } from '../utils/resilientLocator';
import { ComplianceAudit, AccessibilityAuditOptions, VisualComparisonOptions } from '../utils/complianceAudit';
import { DataFactory } from '../utils/dataFactory';

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
   * Executes a business action wrapped in a native Playwright Step with timing and screenshot-on-failure
   */
  async step<T>(stepTitle: string, action: () => Promise<T>): Promise<T> {
    Logger.info(`[STEP] ${stepTitle}`);
    return await test.step(stepTitle, async () => {
      const startTime = Date.now();
      try {
        const result = await action();
        const duration = Date.now() - startTime;
        try {
          test.info().annotations.push({
            type: 'Step Timing',
            description: `${stepTitle}: ${duration}ms`,
          });
        } catch (e) {}
        return result;
      } catch (err: any) {
        const duration = Date.now() - startTime;
        Logger.error(`[STEP FAILED] ${stepTitle} (${duration}ms): ${err.message}`);
        if (!this.page.isClosed()) {
          const shot = await this.page.screenshot({ fullPage: false }).catch(() => null);
          if (shot) {
            try {
              await test.info().attach(`Screenshot on Step Failure - ${stepTitle.slice(0, 50)}`, {
                body: shot,
                contentType: 'image/png',
              });
            } catch (e) {}
          }
        }
        throw err;
      }
    });
  }

  /**
   * Navigates to a specific path or root if not specified
   */
  async navigate(path: string = ''): Promise<void> {
    Logger.action('Navigate', path || '/');
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
    await this.waitForLoadingSpinnerToDisappear();
  }

  /**
   * Waits for loading spinners or pacman loaders to finish
   */
  async waitForLoadingSpinnerToDisappear(timeout: number = 20000): Promise<void> {
    try {
      if (await this.loadingSpinner.first().isVisible({ timeout: 1500 })) {
        Logger.debug('Waiting for loading spinner to disappear...');
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
    Logger.action('Click', desc);
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
    Logger.action('Fill Input', desc);
    Logger.data(desc, maskedValue);
    await locator.waitFor({ state: 'visible', timeout: 10000 });
    await locator.fill(value);
  }

  /**
   * Automatically fills an input box with a guaranteed-unique value
   * based on the entity type hint or input field attributes.
   * Prevents duplicate constraint failures across test runs and parallel workers.
   *
   * @param locator The input locator to fill
   * @param entityType Optional hint ('account', 'apn', 'networkProfile', 'qos', 'email', etc.)
   * @param description Optional description for test logs
   * @returns The generated unique string that was filled
   */
  async fillUnique(
    locator: Locator,
    entityType?: 'account' | 'apn' | 'networkProfile' | 'qos' | 'roaming' | 'numberingPlan' | 'ccsOffer' | 'slice' | 'email' | string,
    description?: string
  ): Promise<string> {
    const workerIndex = (this.page as any).__workerIndex ?? 0;
    let uniqueValue: string;

    if (entityType) {
      const typeKey = entityType.toLowerCase().replace(/[-_]/g, '');
      switch (typeKey) {
        case 'account':
        case 'accountname':
          uniqueValue = DataFactory.uniqueAccountName('ATT_ACC', workerIndex);
          break;
        case 'apn':
        case 'dnn':
        case 'apnname':
          uniqueValue = DataFactory.uniqueApnName('att.iot', workerIndex);
          break;
        case 'networkprofile':
        case 'netprof':
          uniqueValue = DataFactory.uniqueNetworkProfileName('ATT_NETPROF', workerIndex);
          break;
        case 'qos':
        case 'qosprofile':
          uniqueValue = DataFactory.uniqueQosProfileName('ATT_QOS', workerIndex);
          break;
        case 'roaming':
        case 'roamingprofile':
          uniqueValue = DataFactory.uniqueRoamingProfileName('ATT_ROAM', workerIndex);
          break;
        case 'numberingplan':
        case 'msisdnplan':
          uniqueValue = DataFactory.uniqueNumberingPlanName('ATT_NUMPLAN', workerIndex);
          break;
        case 'ccsoffer':
        case 'offer':
          uniqueValue = DataFactory.uniqueCcsOfferId('OFFER', workerIndex);
          break;
        case 'slice':
          uniqueValue = DataFactory.uniqueSliceName('ATT_SLICE', workerIndex);
          break;
        case 'email':
          uniqueValue = DataFactory.uniqueEmail('att-iot.com', workerIndex);
          break;
        default:
          uniqueValue = DataFactory.uniqueString(entityType, 28, workerIndex);
          break;
      }
    } else {
      // Auto-detect from input attributes
      const placeholder = (await locator.getAttribute('placeholder').catch(() => '')) || '';
      const nameAttr = (await locator.getAttribute('name').catch(() => '')) || '';
      const idAttr = (await locator.getAttribute('id').catch(() => '')) || '';
      const ariaLabel = (await locator.getAttribute('aria-label').catch(() => '')) || '';
      const combined = `${placeholder} ${nameAttr} ${idAttr} ${ariaLabel}`.toLowerCase();

      if (combined.includes('account')) {
        uniqueValue = DataFactory.uniqueAccountName('ATT_ACC', workerIndex);
      } else if (combined.includes('apn') || combined.includes('dnn')) {
        uniqueValue = DataFactory.uniqueApnName('att.iot', workerIndex);
      } else if (combined.includes('network profile') || combined.includes('netprof')) {
        uniqueValue = DataFactory.uniqueNetworkProfileName('ATT_NETPROF', workerIndex);
      } else if (combined.includes('qos')) {
        uniqueValue = DataFactory.uniqueQosProfileName('ATT_QOS', workerIndex);
      } else if (combined.includes('roam')) {
        uniqueValue = DataFactory.uniqueRoamingProfileName('ATT_ROAM', workerIndex);
      } else if (combined.includes('numbering') || combined.includes('msisdn')) {
        uniqueValue = DataFactory.uniqueNumberingPlanName('ATT_NUMPLAN', workerIndex);
      } else if (combined.includes('email')) {
        uniqueValue = DataFactory.uniqueEmail('att-iot.com', workerIndex);
      } else if (combined.includes('slice')) {
        uniqueValue = DataFactory.uniqueSliceName('ATT_SLICE', workerIndex);
      } else {
        uniqueValue = DataFactory.uniqueString('ATT_INP', 28, workerIndex);
      }
    }

    const desc = description || (await locator.toString());
    Logger.data(`Generated Unique [${entityType || 'field'}]`, uniqueValue);
    Logger.action('Fill Unique', `${desc} = ${uniqueValue}`);
    await this.fill(locator, uniqueValue, desc);
    return uniqueValue;
  }

  /**
   * Automatically discovers all visible text inputs within a modal or form container
   * and fills each one with a context-aware unique value.
   */
  async autoFillFormUnique(container?: Locator): Promise<Record<string, string>> {
    const root = container || this.modalContainer.first();
    const inputs = root.locator('input[type="text"]:visible, input:not([type]):visible, input[type="email"]:visible');
    const count = await inputs.count();
    const generatedValues: Record<string, string> = {};

    for (let i = 0; i < count; i++) {
      const input = inputs.nth(i);
      const isReadOnly = (await input.getAttribute('readonly').catch(() => null)) !== null;
      const isDisabled = (await input.getAttribute('disabled').catch(() => null)) !== null;
      if (!isReadOnly && !isDisabled) {
        const fieldKey = (await input.getAttribute('name').catch(() => '')) ||
                         (await input.getAttribute('id').catch(() => '')) ||
                         (await input.getAttribute('aria-label').catch(() => '')) ||
                         `field_${i}`;
        const val = await this.fillUnique(input);
        generatedValues[fieldKey] = val;
      }
    }
    return generatedValues;
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
    const customFolder = (this.page as any).__testArtifactFolder;
    const screenshotDir = customFolder || path.resolve('reports/artifacts/screenshots');
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }
    const cleanName = name.replace(/[^a-zA-Z0-9_-]/g, '_');
    const screenshotPath = path.join(screenshotDir, `${Date.now()}_${cleanName}.png`);
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

  /**
   * Logs a structured verification/assertion result
   */
  logAssertion(description: string, passed: boolean = true, details?: string): void {
    Logger.assert(description, passed, details);
  }

  /**
   * Logs data table grid summary (row count, visible headers)
   */
  logGridState(gridName: string, rowCount: number, visibleColumns?: string[]): void {
    const cols = visibleColumns && visibleColumns.length > 0 ? ` | Columns: [${visibleColumns.join(', ')}]` : '';
    Logger.info(`[GRID: ${gridName}] Visible Rows: ${rowCount}${cols}`);
  }
}
