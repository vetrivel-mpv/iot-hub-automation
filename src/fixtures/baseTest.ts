import { test as baseTest, expect, Page } from '@playwright/test';
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
import { ProdGuardrail } from '../utils/prodGuardrail';
import { PythonBridge } from '../utils/pythonBridge';
import { ResilientLocator } from '../utils/resilientLocator';
import { ContractDriftSniffer } from '../utils/contractDriftSniffer';
import { DataSweeper } from '../utils/dataSweeper';
import { Logger } from '../utils/logger';

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
  prodGuardrail: typeof ProdGuardrail;
  pythonBridge: typeof PythonBridge;
  resilient: ResilientLocator;
  contractSniffer: ContractDriftSniffer;
  dataSweeper: typeof DataSweeper;
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

  prodGuardrail: async ({}, use) => {
    await use(ProdGuardrail);
  },

  pythonBridge: async ({}, use) => {
    await use(PythonBridge);
  },

  resilient: async ({ page }, use) => {
    const resilient = new ResilientLocator(page);
    await use(resilient);
  },

  contractSniffer: async ({ page }, use, testInfo) => {
    const sniffer = new ContractDriftSniffer(page, testInfo.title);
    await use(sniffer);
  },

  dataSweeper: async ({}, use) => {
    await use(DataSweeper);
  },

  chaos: async ({ page }, use) => {
    const chaos = new ChaosInterceptor(page);
    await use(chaos);
    await chaos.reset(); // Auto-cleanup after test
  },



  // Automatic Config Validator, PROD Guardrail & Test Artifact Capture Fixture - Runs on EVERY test execution
  autoConfigCheck: [
    async ({ page }, use, testInfo) => {
      // 1. Assert and validate configuration integrity
      ConfigValidator.assertValid(config, testInfo.title);

      // 2. Production Safety Lock Enforcement
      const testTags = (testInfo as any).tags || [];
      const guardrail = ProdGuardrail.evaluateExecution(testInfo.title, testTags);
      testInfo.annotations.push({
        type: 'PROD Guardrail',
        description: guardrail.auditMessage,
      });

      if (!guardrail.allowed) {
        baseTest.skip(true, `[PROD GUARDRAIL ACTIVE] ${guardrail.reason}`);
      }

      // Extract Execution ID injected by Server Orchestrator
      const runId = process.env.TEST_RUN_ID || process.env.WDH_RUN_ID || `RUN-${Date.now().toString().slice(-6)}`;

      // Extract Test ID or clean test case name for directory naming
      const tcMatch = testInfo.title.match(/\[(TC_[A-Z0-9_]+|CFG-\d+|E2E-\d+)\]/);
      const testId = tcMatch ? tcMatch[1] : 'TEST';
      const cleanTestCaseName = testInfo.title
        .replace(/[\[\]]/g, '')
        .replace(/[^a-zA-Z0-9_-]/g, '_')
        .replace(/_+/g, '_')
        .slice(0, 100);

      // Set Logger Execution Context for worker and test ID correlation (normalized 1..N thread index)
      const threadIndex = (testInfo as any).parallelIndex !== undefined ? (testInfo as any).parallelIndex + 1 : testInfo.workerIndex + 1;
      Logger.setContext({
        workerIndex: threadIndex,
        testId,
        testTitle: testInfo.title,
        runId,
      });

      // Create dedicated folder for THIS test case under reports/artifacts/screenshots/<testCaseName>
      const testArtifactFolder = path.resolve('reports/artifacts/screenshots', cleanTestCaseName);
      if (!fs.existsSync(testArtifactFolder)) {
        fs.mkdirSync(testArtifactFolder, { recursive: true });
      }

      // Attach Execution ID & Environment to Test Report Annotations & Native HTML Report
      testInfo.annotations.push({
        type: 'Execution ID',
        description: runId,
      });
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

      testInfo.annotations.push({
        type: 'Worker',
        description: `Worker #${testInfo.workerIndex}`,
      });

      // Track created entities starting snapshot
      const entityStartIndex = DataFactory.registeredEntities.length;

      // Passive Console, Page Error & Full Network API Transaction Interceptor
      const executionLogs: string[] = [];
      interface FailedApiTransaction {
        timestamp: string;
        method: string;
        url: string;
        status: number;
        statusText: string;
        postData?: string | null;
        responseBody?: string;
      }
      const failedApiTransactions: FailedApiTransaction[] = [];

      const onConsole = (msg: any) => {
        executionLogs.push(`[${new Date().toISOString()}] [${msg.type().toUpperCase()}] ${msg.text()}`);
      };
      const onPageError = (err: Error) => {
        const errMsg = `[PAGE ERROR] ${err.message}`;
        executionLogs.push(`[${new Date().toISOString()}] ${errMsg}\n${err.stack || ''}`);
        Logger.error(errMsg);
      };
      const onResponse = async (response: any) => {
        const status = response.status();
        const req = response.request();
        const url = response.url();
        if (status >= 400 && !url.includes('favicon.ico')) {
          let postData: string | null = null;
          try { postData = req.postData(); } catch(e) {}

          let responseBody = '';
          try {
            const body = await response.text().catch(() => null);
            if (body) {
              responseBody = body.length > 4000 ? body.slice(0, 4000) + '... [TRUNCATED]' : body;
            }
          } catch(e) {}

          const tx: FailedApiTransaction = {
            timestamp: new Date().toISOString(),
            method: req.method(),
            url,
            status,
            statusText: response.statusText() || '',
            postData,
            responseBody,
          };
          failedApiTransactions.push(tx);
          Logger.network(req.method(), url, status);
        }
      };

      page.on('console', onConsole);
      page.on('pageerror', onPageError);
      page.on('response', onResponse);

      // Expose screenshot folder and worker index on page object
      (page as any).__testArtifactFolder = testArtifactFolder;
      (page as any).__testCaseName = cleanTestCaseName;
      (page as any).__workerIndex = testInfo.workerIndex;
      (page as any).__runId = runId;

      // Auto-attach Contract Drift Sniffer to passively monitor in-flight network API contracts
      new ContractDriftSniffer(page, testInfo.title);

      // 3. Structured Business Module Hierarchy for Executive Reporting
      try {
        const filePath = testInfo.file || '';
        const normPath = filePath.replace(/\\/g, '/');
        const MODULE_MAP: Array<{ match: RegExp; name: string; feature: string }> = [
          { match: /accounts/i, name: '🏢 Accounts Management', feature: 'Account Lifecycle & Billing Profiles' },
          { match: /auth\/(login|setup)/i, name: '🔐 Authentication & Access', feature: 'Keycloak SSO & Access Control' },
          { match: /setup/i, name: '🚀 Global Auth & Worker Session Bootstrap', feature: '100ms Fast Session Injection' },
          { match: /config/i, name: '🛠️ Environment Configuration & Health', feature: 'Fleet Diagnostics & Health Checks' },
          { match: /subscriptions/i, name: '📱 Subscriptions & SIM Lifecycle', feature: 'SIM Activation & State Machine' },
          { match: /administration/i, name: '⚙️ System Administration & Users', feature: 'User Roles & Tenant Management' },
          { match: /automation_rules/i, name: '⚡ Automation & Business Rules', feature: 'Trigger & Action Workflows' },
          { match: /dashboard/i, name: '📊 Portal Dashboard & Metrics', feature: 'KPI Cards & Real-Time Widgets' },
          { match: /e2e/i, name: '🔄 End-to-End Customer Lifecycle Journeys', feature: 'Full SIM Provisioning E2E Flow' },
          { match: /e_sim/i, name: '📶 eSIM Provisioning & Profiles', feature: 'eSIM Profile Download & Swap' },
          { match: /invoice_data/i, name: '🧾 Billing & Invoice Processing', feature: 'Invoices, Credit Notes & Disputes' },
          { match: /ordering/i, name: '🛒 Enterprise Ordering & Catalog', feature: 'Device Catalog & Order Submissions' },
          { match: /rating/i, name: '🏷️ Rating & Tariff Plans', feature: 'Tariff Matrix & Rate Plans' },
          { match: /reports/i, name: '📈 Analytics & Executive Reports', feature: 'Operational & Financial Reports' },
          { match: /resources/i, name: '💾 Resources & Asset Inventory', feature: 'SIM Cards & Network Resources' },
          { match: /security/i, name: '🛡️ Security & Access Control', feature: 'RBAC, Audit Logs & Threat Defense' },
        ];

        const matchedMod = MODULE_MAP.find((m) => m.match.test(normPath));
        const moduleName = matchedMod ? matchedMod.name : '🌐 Portal Operations';
        const featureName = matchedMod ? matchedMod.feature : 'Core Navigation';

        testInfo.annotations.push({
          type: 'Module',
          description: moduleName,
        });
        testInfo.annotations.push({
          type: 'Feature',
          description: featureName,
        });
      } catch {
        // Safe fallback
      }

      await use();

      // Automated Full Test Evidence Capture - Prefix every artifact with [Execution ID]
      try {
        const status = testInfo.status || 'completed';
        const timestamp = Date.now();
        const runPrefix = `${runId}__${cleanTestCaseName}`;
        const finalScreenshotName = `${runPrefix}__${status.toUpperCase()}__final_${timestamp}.png`;
        const finalTargetPath = path.join(testArtifactFolder, finalScreenshotName);
        const rootGalleryPath = path.resolve('reports/artifacts/screenshots', `${runPrefix}__${status}.png`);

        let b64Final = '';
        let b64Viewport = '';

        if (!page.isClosed()) {
          const finalBuffer = await page.screenshot({ path: finalTargetPath, fullPage: true }).catch(() => null);
          const viewportBuffer = await page.screenshot({ path: rootGalleryPath, fullPage: false }).catch(() => null);

          if (finalBuffer) b64Final = finalBuffer.toString('base64');
          if (viewportBuffer) b64Viewport = viewportBuffer.toString('base64');

          if (fs.existsSync(rootGalleryPath)) {
            await testInfo.attach(`${runId} Screenshot - ${status.toUpperCase()}`, {
              path: rootGalleryPath,
              contentType: 'image/png',
            }).catch(() => {});
          }

          // Embedded Interactive Screenshot Carousel HTML Attachment in Native Playwright HTML Report
          if (b64Viewport || b64Final) {
            const carouselHtml = `
              <!DOCTYPE html>
              <html>
              <head>
                <meta charset="utf-8">
                <style>
                  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #f8fafc; padding: 14px; margin: 0; }
                  .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #334155; padding-bottom: 10px; margin-bottom: 12px; }
                  .title { font-size: 15px; font-weight: bold; color: ${status === 'passed' ? '#10b981' : '#ef4444'}; display: flex; align-items: center; gap: 8px; }
                  .badge { font-size: 11px; padding: 3px 8px; border-radius: 4px; font-weight: 600; background: #1e293b; color: #94a3b8; }
                  .tabs { display: flex; gap: 8px; margin-bottom: 12px; }
                  .tab-btn { background: #1e293b; color: #94a3b8; border: 1px solid #334155; padding: 6px 14px; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 600; transition: all 0.2s; }
                  .tab-btn:hover { background: #334155; color: #fff; }
                  .tab-btn.active { background: #0066ff; color: #fff; border-color: #0066ff; }
                  .img-container { background: #020617; border: 1px solid #334155; border-radius: 8px; padding: 10px; text-align: center; max-height: 650px; overflow: auto; }
                  .img-container img { max-width: 100%; border-radius: 4px; box-shadow: 0 4px 14px rgba(0,0,0,0.5); }
                </style>
              </head>
              <body>
                <div class="header">
                  <div class="title">
                    <span>${status === 'passed' ? '✅ Visual Execution Evidence' : '🚨 Failure Visual State'}</span>
                    <span class="badge">${runId}</span>
                    <span class="badge">${status.toUpperCase()}</span>
                  </div>
                  <div style="font-size: 12px; color: #94a3b8;">Captured at: ${new Date().toISOString()}</div>
                </div>
                <div class="tabs">
                  <button class="tab-btn active" onclick="switchView('viewport', this)">📱 Active Viewport</button>
                  <button class="tab-btn" onclick="switchView('fullpage', this)">📜 Full-Page Scroll</button>
                </div>
                <div class="img-container">
                  <img id="active-screenshot" src="data:image/png;base64,${b64Viewport || b64Final}" alt="Visual Evidence" />
                </div>
                <script>
                  const b64Viewport = "data:image/png;base64,${b64Viewport}";
                  const b64Full = "data:image/png;base64,${b64Final}";
                  function switchView(type, btn) {
                    const img = document.getElementById('active-screenshot');
                    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    img.src = (type === 'viewport') ? b64Viewport : b64Full;
                  }
                </script>
              </body>
              </html>
            `;
            await testInfo.attach('📸 Visual Evidence Carousel', {
              body: carouselHtml,
              contentType: 'text/html',
            }).catch(() => {});
          }
        }

        // Embedded Playwright Interactive Trace Viewer Link & Inline Frame
        const traceAttachment = testInfo.attachments.find(a => a.name === 'trace' && a.path);
        if (traceAttachment && traceAttachment.path) {
          const traceFileName = path.basename(traceAttachment.path);
          const viewerUrl = `https://trace.playwright.dev/?trace=${encodeURIComponent(`http://localhost:3030/traces/${traceFileName}`)}`;
          const traceEmbedHtml = `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, sans-serif; background: #0b0f19; color: #fff; padding: 14px; }
                .top-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
                .btn { display: inline-flex; align-items: center; gap: 8px; background: #0066ff; color: #fff; text-decoration: none; padding: 8px 18px; border-radius: 6px; font-weight: 600; font-size: 13px; }
                .btn:hover { background: #0052cc; }
                iframe { width: 100%; height: 750px; border: 1px solid #334155; border-radius: 8px; background: #fff; }
              </style>
            </head>
            <body>
              <div class="top-bar">
                <div>
                  <h3 style="margin: 0; color: #38bdf8;">Playwright Interactive Trace Viewer</h3>
                  <span style="font-size: 12px; color: #94a3b8;">Full execution action timeline, live DOM inspection, and network waterfalls</span>
                </div>
                <a href="${viewerUrl}" target="_blank" class="btn">🚀 Fullscreen Trace Viewer ↗</a>
              </div>
              <iframe src="${viewerUrl}"></iframe>
            </body>
            </html>
          `;
          await testInfo.attach('🔍 Playwright Interactive Trace Viewer', {
            body: traceEmbedHtml,
            contentType: 'text/html',
          }).catch(() => {});
        }

        // Save execution console & error logs tagged with Run ID
        if (executionLogs.length > 0) {
          const logDir = path.resolve('reports/artifacts');
          if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
          const logFilePath = path.join(logDir, `${runPrefix}__execution.log`);
          fs.writeFileSync(logFilePath, executionLogs.join('\n'), 'utf8');
          await testInfo.attach(`${runId} Execution Logs`, {
            path: logFilePath,
            contentType: 'text/plain',
          }).catch(() => {});
        }

        // Capture newly registered resources & accounts created during this test
        const testCreatedEntities = DataFactory.registeredEntities.slice(entityStartIndex);
        if (testCreatedEntities.length > 0) {
          const auditDir = path.resolve('reports/artifacts');
          const auditFilePath = path.join(auditDir, `${runPrefix}__created_resources.json`);
          fs.writeFileSync(auditFilePath, JSON.stringify(testCreatedEntities, null, 2), 'utf8');

          testInfo.annotations.push({
            type: 'Created Resources',
            description: testCreatedEntities.map(e => `${e.type}: ${e.value}`).join(' | '),
          });

          await testInfo.attach(`${runId} Created Resources Audit`, {
            path: auditFilePath,
            contentType: 'application/json',
          }).catch(() => {});
        }

        // Automated API Payloads & Network Error Interceptor Attachments
        if (failedApiTransactions.length > 0) {
          const jsonContent = JSON.stringify(failedApiTransactions, null, 2);
          await testInfo.attach(`Failed API Calls & Payloads (${failedApiTransactions.length})`, {
            body: jsonContent,
            contentType: 'application/json',
          }).catch(() => {});

          const htmlTable = `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 14px; background: #0f172a; color: #f8fafc; margin: 0; }
                h3 { margin-top: 0; color: #ef4444; font-size: 15px; display: flex; align-items: center; gap: 8px; }
                table { width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 10px; }
                th { background: #1e293b; color: #94a3b8; text-align: left; padding: 8px; border-bottom: 2px solid #334155; }
                td { padding: 8px; border-bottom: 1px solid #1e293b; vertical-align: top; }
                .badge-err { background: rgba(239, 68, 68, 0.2); color: #f87171; padding: 2px 6px; border-radius: 4px; font-weight: bold; }
                .code-box { font-family: monospace; font-size: 11px; background: #020617; border: 1px solid #334155; border-radius: 4px; padding: 6px; max-height: 120px; overflow: auto; white-space: pre-wrap; word-break: break-all; }
              </style>
            </head>
            <body>
              <h3>🚨 ${failedApiTransactions.length} Failed HTTP API Transaction(s) Intercepted</h3>
              <table>
                <thead>
                  <tr>
                    <th style="width: 70px;">Method</th>
                    <th style="width: 100px;">Status</th>
                    <th>Target Endpoint URL</th>
                    <th style="width: 260px;">Request Payload</th>
                    <th style="width: 320px;">Response Payload</th>
                  </tr>
                </thead>
                <tbody>
                  ${failedApiTransactions.map(tx => `
                    <tr>
                      <td style="font-weight: bold; color: ${tx.method === 'POST' ? '#38bdf8' : '#a855f7'};">${tx.method}</td>
                      <td><span class="badge-err">${tx.status} ${tx.statusText || ''}</span></td>
                      <td style="font-family: monospace; font-size: 11px; word-break: break-all;">${tx.url}</td>
                      <td><div class="code-box">${tx.postData ? tx.postData : '<no request body>'}</div></td>
                      <td><div class="code-box">${tx.responseBody ? tx.responseBody : '<no response body>'}</div></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </body>
            </html>
          `;
          await testInfo.attach('Failed HTTP Transactions Summary (HTML)', {
            body: htmlTable,
            contentType: 'text/html',
          }).catch(() => {});
        }

        // Automated Failure Diagnostics: URL, Title, Failed Requests & Visible Alerts
        if (testInfo.status !== 'passed' && !page.isClosed()) {
          const currentUrl = page.url();
          const pageTitle = await page.title().catch(() => 'N/A');
          Logger.diagnostic(`[FAILURE DIAGNOSTIC] Current URL: ${currentUrl} | Page Title: "${pageTitle}"`);
          if (failedApiTransactions.length > 0) {
            Logger.diagnostic(`[FAILED HTTP CALLS (${failedApiTransactions.length})]`, failedApiTransactions.slice(-5));
          }
          const alerts = await page.locator('.toast, .alert, .notification, [role="alert"], .ant-message, .MuiAlert-root').allInnerTexts().catch(() => []);
          if (alerts.length > 0) {
            Logger.diagnostic(`[VISIBLE NOTIFICATIONS/ALERTS]`, alerts.join(' | '));
          }
        }
      } catch (postErr: any) {
        // Handled if page context closed
      } finally {
        page.off('response', onResponse);
        Logger.clearContext();
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

/**
 * Global Portal Pre-condition Engine:
 * Ensures the browser session is authenticated to the IoT Hub / ACM Portal.
 * If the session is unauthenticated, expired, or on the login page:
 *   - Performs portal login with the active environment credentials.
 *   - Verifies the user lands on the authenticated portal.
 *   - Persists the refreshed storageState for parallel workers.
 * If Portal Login fails or does not happen:
 *   - THROWS A HARD ASSERTION FAILURE, FAILING THE TEST IMMEDIATELY AT STEP 1.
 */
export async function ensurePortalLogin(
  page: Page,
  targetRoute: string = '/dashboard',
  options: { timeout?: number; forceRelogin?: boolean } = {}
): Promise<void> {
  const timeout = options.timeout || 25000;
  const baseUrl = config.baseUrl;
  const { username, password } = config.credentials;

  const currentUrl = page.url();
  const targetFullUrl = targetRoute.startsWith('http')
    ? targetRoute
    : `${baseUrl.replace(/\/+$/, '')}${targetRoute.startsWith('/') ? targetRoute : '/' + targetRoute}`;

  // Step A: Initial navigation if page is on blank state or different origin
  if (currentUrl === 'about:blank' || !currentUrl.startsWith('http')) {
    Logger.info(`[PORTAL PRE-CONDITION] Initial navigation to: ${targetRoute}`);
    await page.goto(targetFullUrl, { waitUntil: 'domcontentloaded', timeout }).catch(() => {});
  }

  // Fail-Fast Check: If browser landed on an error page (DNS unresolvable / offline), abort immediately
  const postNavUrl = page.url();
  if (postNavUrl.startsWith('chrome-error://') || postNavUrl === 'about:blank') {
    throw new Error(
      `[NETWORK UNREACHABLE] Target portal "${targetFullUrl}" could not be reached (Browser landed on: "${postNavUrl}"). Check AT&T Corporate VPN connection or network access.`
    );
  }

  // Step B: Detect unauthenticated / login state
  const isOnAuth = () => {
    const u = page.url();
    return u.includes('/auth') || u.includes('/login') || u.includes('protocol/openid-connect');
  };

  const isLoginVisible = async () => {
    try {
      const loginMarker = page.locator('#kc-login, form#kc-form-login, input#username').first();
      return await loginMarker.isVisible({ timeout: 2000 });
    } catch {
      return false;
    }
  };

  const needsLogin = isOnAuth() || (await isLoginVisible()) || options.forceRelogin;

  if (needsLogin) {
    Logger.info(`[PORTAL LOGIN] Unauthenticated or session expired at ${page.url()}. Executing Step 1: Portal Login...`);

    if (!username || !password) {
      throw new Error(
        `[PORTAL LOGIN FAILED] Missing credentials for active environment (${config.activeEnvironmentId}). Username: "${username || ''}". Test aborted.`
      );
    }

    const userInput = page.locator('input#username, input[name="username"], input[name="email"], input[type="email"]').first();
    const passInput = page.locator('input#password, input[name="password"], input[type="password"]').first();
    const submitBtn = page.locator('#kc-login, button[type="submit"], input[type="submit"], button:has-text("Sign In"), button:has-text("Log In")').first();

    await userInput.waitFor({ state: 'visible', timeout: 12000 });
    await userInput.fill(username);
    await passInput.waitFor({ state: 'visible', timeout: 6000 });
    await passInput.fill(password);

    Logger.info(`[PORTAL LOGIN] Submitting login form for "${username}"`);
    await submitBtn.click();

    // Wait for URL to leave auth/login
    await page.waitForURL(
      (url) => !url.pathname.includes('/auth') && !url.pathname.includes('/login') && !url.pathname.includes('openid-connect'),
      { timeout }
    );
    await page.waitForLoadState('domcontentloaded');

    // Persist refreshed storageState so other parallel workers share this active session
    try {
      const authDir = path.resolve('playwright/.auth');
      if (!fs.existsSync(authDir)) fs.mkdirSync(authDir, { recursive: true });
      const authFile = path.join(authDir, 'user.json');
      await page.context().storageState({ path: authFile });
      Logger.info(`[PORTAL LOGIN] Refreshed storage state saved to ${authFile}`);
    } catch {
      // Non-fatal if context storageState write encounters parallel lock
    }
  }

  // Step C: Ensure page reaches requested module route
  if (targetRoute && targetRoute !== '/' && !targetRoute.includes('dashboard')) {
    const currentPath = new URL(page.url()).pathname;
    const cleanTarget = targetRoute.replace(/^\//, '');
    if (!currentPath.includes(cleanTarget)) {
      Logger.info(`[PORTAL LOGIN] Session authenticated. Navigating to module route: ${targetRoute}`);
      await page.goto(targetFullUrl, { waitUntil: 'domcontentloaded', timeout }).catch(() => {});
    }
  }

  // Step D: STRICT ASSERTIONS - IF PORTAL LOGIN FAILS, FAIL THE TEST IMMEDIATELY!
  const finalUrl = page.url();
  expect(finalUrl, `[PORTAL LOGIN FAILED] Test aborted: Browser is stuck on login screen (${finalUrl})`).not.toMatch(
    /\/auth\b|\/login\b|openid-connect/i
  );

  const kcLoginCount = await page.locator('#kc-login').count();
  expect(kcLoginCount, `[PORTAL LOGIN FAILED] Login button (#kc-login) is still visible on page`).toBe(0);

  const portalLayout = page
    .locator('header, nav, [role="navigation"], .main-nav, .MuiAppBar-root, .navbar, table, #root, #app')
    .or(page.getByText('AT&T Connection Manager'))
    .or(page.getByText('cmpaas-csp-user'))
    .or(page.getByText('Subscriptions'))
    .or(page.getByText('Accounts'))
    .first();
  await expect(
    portalLayout,
    `[PORTAL LOGIN FAILED] Authenticated portal navigation/header not visible at ${finalUrl}`
  ).toBeVisible({ timeout: 15000 });

  Logger.info(`[PORTAL LOGIN] Portal session validated successfully at: ${finalUrl}`);
}

export { expect };
