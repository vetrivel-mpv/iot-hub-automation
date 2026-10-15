import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
import { config } from '../../src/config/environment';
import { Logger } from '../../src/utils/logger';
import * as path from 'path';
import * as fs from 'fs';

const authFile = path.resolve(__dirname, '../../playwright/.auth/user.json');

setup('Authenticate and Save Storage State', async ({ page }) => {
  const authDir = path.dirname(authFile);
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  const startTime = Date.now();
  const isForceAuth = process.env.FORCE_AUTH === 'true';

  // 1. Live probe cached storageState: Check if server session is ACTUALLY active
  if (!isForceAuth && fs.existsSync(authFile)) {
    try {
      const rawContent = fs.readFileSync(authFile, 'utf-8');
      const parsed = JSON.parse(rawContent);
      if (Array.isArray(parsed.cookies) && parsed.cookies.length > 0) {
        // Quick probe against /dashboard to check if server redirects to Keycloak login
        Logger.info(`[GLOBAL AUTH] Probing cached session against: ${config.baseUrl}/dashboard`);
        await page.goto(`${config.baseUrl}/dashboard`, { timeout: 12000, waitUntil: 'domcontentloaded' }).catch(() => {});
        const currentUrl = page.url();

        // Fail-Fast: Check if network / DNS failed and browser landed on error page
        if (currentUrl.startsWith('chrome-error://') || currentUrl === 'about:blank' || !currentUrl.startsWith('http')) {
          throw new Error(
            `[CONNECTIVITY FAILED] Cannot reach target environment at ${config.baseUrl} (Browser reached: "${currentUrl}"). AT&T Corporate VPN or internal network access required.`
          );
        }

        const isStillValid =
          !currentUrl.includes('/auth') &&
          !currentUrl.includes('/login') &&
          !currentUrl.includes('protocol/openid-connect') &&
          !(await page.locator('#kc-login').isVisible({ timeout: 1500 }).catch(() => false));

        if (isStillValid) {
          const bootstrapDurationMs = Date.now() - startTime;
          Logger.info(`[GLOBAL AUTH] Live session probe PASSED. Session is active (~${bootstrapDurationMs}ms startup).`);

          // Write session telemetry manifest
          const telemetryDir = path.resolve('reports/artifacts');
          if (!fs.existsSync(telemetryDir)) fs.mkdirSync(telemetryDir, { recursive: true });
          fs.writeFileSync(
            path.join(telemetryDir, 'session-telemetry.json'),
            JSON.stringify(
              {
                status: 'VERIFIED_ACTIVE',
                bootstrapDurationMs,
                cookieCount: parsed.cookies.length,
                lastVerified: new Date().toISOString(),
                targetBaseUrl: config.baseUrl,
                workerReadiness: 'Instant parallel worker start verified',
              },
              null,
              2
            ),
            'utf-8'
          );
          return;
        } else {
          Logger.warn(`[GLOBAL AUTH] Cached session has expired on server (Redirected to: ${currentUrl}). Re-authenticating...`);
        }
      }
    } catch {
      Logger.warn('[GLOBAL AUTH] Cached storageState could not be read. Re-authenticating fresh session.');
    }
  }

  Logger.info(`[GLOBAL AUTH] Performing one-time global authentication against: ${config.baseUrl}`);

  const { username, password } = config.credentials;
  if (!username || !password) {
    throw new Error(
      `[GLOBAL AUTH FAILED] Missing credentials for active environment (${config.activeEnvironmentId}). Please verify credentials in environments.json or .env.`
    );
  }

  // Navigate to login or portal root
  const loginPage = new LoginPage(page);
  await loginPage.goto().catch((err: Error) => {
    Logger.warn(`[GLOBAL AUTH] Navigation to login page failed: ${err.message}`);
    throw err;
  });

  const userInput = page.locator('input#username, input[name="username"], input[name="email"], input[type="email"]').first();
  const passInput = page.locator('input#password, input[name="password"], input[type="password"]').first();
  const submitBtn = page.locator('#kc-login, button[type="submit"], input[type="submit"], button:has-text("Sign In"), button:has-text("Log In")').first();

  await userInput.waitFor({ state: 'visible', timeout: 15000 });
  await userInput.fill(username);
  await passInput.waitFor({ state: 'visible', timeout: 8000 });
  await passInput.fill(password);

  Logger.info(`[GLOBAL AUTH] Submitting login credentials for user "${username}"...`);
  await submitBtn.click();

  // Wait for redirect to portal away from auth/login
  await page.waitForURL(
    (url) => !url.pathname.includes('/auth') && !url.pathname.includes('/login') && !url.pathname.includes('openid-connect'),
    { timeout: 25000 }
  );
  await page.waitForLoadState('domcontentloaded');

  // Hard assertion: Must NOT be on login page
  const postUrl = page.url();
  expect(postUrl, `[GLOBAL AUTH FAILED] Authentication failed: Browser remained on ${postUrl}`).not.toMatch(
    /\/auth\b|\/login\b|openid-connect/i
  );

  // Save authenticated cookies and storage tokens atomically
  const tempAuthFile = `${authFile}.tmp`;
  await page.context().storageState({ path: tempAuthFile });

  if (fs.existsSync(tempAuthFile)) {
    fs.renameSync(tempAuthFile, authFile);
  }

  Logger.info(`[GLOBAL AUTH] Storage state successfully verified and saved to ${authFile} (Current URL: ${postUrl})`);
});
