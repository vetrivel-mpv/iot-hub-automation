import { test as baseTest, expect } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { NavigationMenu } from '../pages/NavigationMenu';

import { AccountsPage } from '../pages/AccountsPage';
import { AccountDetailsPage } from '../pages/AccountDetailsPage';
import { SubscriptionsPage } from '../pages/SubscriptionsPage';
import { AuditLogsPage } from '../pages/AuditLogsPage';
import { ResourcesPage } from '../pages/ResourcesPage';
import { RatingPage } from '../pages/RatingPage';
import { ReportsPage } from '../pages/ReportsPage';
import { AdministrationPage } from '../pages/AdministrationPage';
import { AutomationRulesPage } from '../pages/AutomationRulesPage';
import { InvoiceDataPage } from '../pages/InvoiceDataPage';
import { OrderingPage } from '../pages/OrderingPage';
import { config } from '../config/environment';
import { ConfigValidator } from '../utils/configValidator';
import { ApiPerformanceTracker } from '../utils/apiPerformanceTracker';
import { ComplianceAudit } from '../utils/complianceAudit';
import { DataFactory } from '../utils/dataFactory';
import { ChaosInterceptor } from '../utils/chaosInterceptor';

export interface PageFixtures {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  navigationMenu: NavigationMenu;
  accountsPage: AccountsPage;
  accountDetailsPage: AccountDetailsPage;
  subscriptionsPage: SubscriptionsPage;
  auditLogsPage: AuditLogsPage;
  resourcesPage: ResourcesPage;
  ratingPage: RatingPage;
  reportsPage: ReportsPage;
  administrationPage: AdministrationPage;
  automationRulesPage: AutomationRulesPage;
  invoiceDataPage: InvoiceDataPage;
  orderingPage: OrderingPage;
  apiTracker: ApiPerformanceTracker;
  complianceAudit: typeof ComplianceAudit;
  dataFactory: typeof DataFactory;
  chaos: ChaosInterceptor;
  appConfig: typeof config;
  autoConfigCheck: void;
}

export const test = baseTest.extend<PageFixtures>({
  complianceAudit: async ({}, use) => {
    await use(ComplianceAudit);
  },

  dataFactory: async ({}, use) => {
    await use(DataFactory);
  },

  chaos: async ({ page }, use) => {
    const chaos = new ChaosInterceptor(page);
    await use(chaos);
    await chaos.reset(); // Auto-cleanup after test
  },



  // Automatic Config Validator Fixture - Runs on EVERY single test execution
  autoConfigCheck: [
    async ({ page }, use, testInfo) => {
      // 1. Assert and validate configuration integrity
      ConfigValidator.assertValid(config, testInfo.title);

      // Extract Test ID (e.g. TC_SUB_001) or sanitize title for artifact naming
      const tcMatch = testInfo.title.match(/\[(TC_[A-Z0-9_]+|CFG-\d+)\]/);
      const testId = tcMatch ? tcMatch[1] : 'TEST';
      const cleanTitle = testInfo.title.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 80);

      // 2. Attach Environment Configuration to Test Report Annotations
      testInfo.annotations.push({
        type: 'Environment',
        description: `[${config.environment}] ${config.activeEnvironmentId}`,
      });
      testInfo.annotations.push({
        type: 'Target Base URL',
        description: config.baseUrl,
      });
      testInfo.annotations.push({
        type: 'Authenticated User',
        description: config.credentials.username,
      });
      testInfo.annotations.push({
        type: 'Config Timeouts',
        description: `Short: ${config.timeouts.short}ms | Med: ${config.timeouts.medium}ms | Long: ${config.timeouts.long}ms`,
      });

      await use();

      // 3. Automated Test Artifact Capture with exact Test Case Name
      try {
        const screenshotDir = path.resolve('reports/artifacts/screenshots');
        if (!fs.existsSync(screenshotDir)) {
          fs.mkdirSync(screenshotDir, { recursive: true });
        }
        const status = testInfo.status || 'completed';
        const filename = `${testId}__${cleanTitle}__${status}.png`;
        const targetPath = path.join(screenshotDir, filename);

        await page.screenshot({ path: targetPath, fullPage: false });
      } catch {
        // Handled if page context closed
      }
    },
    { auto: true },
  ],


  apiTracker: async ({ page }, use) => {
    const tracker = new ApiPerformanceTracker(page);
    await use(tracker);
  },

  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  dashboardPage: async ({ page }, use) => {
    const dashboardPage = new DashboardPage(page);
    await use(dashboardPage);
  },

  navigationMenu: async ({ page }, use) => {
    const navigationMenu = new NavigationMenu(page);
    await use(navigationMenu);
  },

  accountsPage: async ({ page }, use) => {
    const accountsPage = new AccountsPage(page);
    await use(accountsPage);
  },

  accountDetailsPage: async ({ page }, use) => {
    const accountDetailsPage = new AccountDetailsPage(page);
    await use(accountDetailsPage);
  },

  subscriptionsPage: async ({ page }, use) => {
    const subscriptionsPage = new SubscriptionsPage(page);
    await use(subscriptionsPage);
  },

  auditLogsPage: async ({ page }, use) => {
    const auditLogsPage = new AuditLogsPage(page);
    await use(auditLogsPage);
  },

  resourcesPage: async ({ page }, use) => {
    const resourcesPage = new ResourcesPage(page);
    await use(resourcesPage);
  },

  ratingPage: async ({ page }, use) => {
    const ratingPage = new RatingPage(page);
    await use(ratingPage);
  },

  reportsPage: async ({ page }, use) => {
    const reportsPage = new ReportsPage(page);
    await use(reportsPage);
  },

  administrationPage: async ({ page }, use) => {
    const administrationPage = new AdministrationPage(page);
    await use(administrationPage);
  },

  automationRulesPage: async ({ page }, use) => {
    const automationRulesPage = new AutomationRulesPage(page);
    await use(automationRulesPage);
  },

  invoiceDataPage: async ({ page }, use) => {
    const invoiceDataPage = new InvoiceDataPage(page);
    await use(invoiceDataPage);
  },

  orderingPage: async ({ page }, use) => {
    const orderingPage = new OrderingPage(page);
    await use(orderingPage);
  },

  appConfig: async ({}, use) => {
    await use(config);
  },
});

export { expect };
