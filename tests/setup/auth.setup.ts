import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
import { config } from '../../src/config/environment';
import { Logger } from '../../src/utils/logger';
import * as path from 'path';
import * as fs from 'fs';

const authFile = path.resolve(__dirname, '../../playwright/.auth/user.json');

setup('Authenticate and Save Storage State', async ({ page }) => {
  Logger.info(`[GLOBAL AUTH] Performing one-time global authentication against: ${config.baseUrl}`);
  
  // Ensure storage state directory exists
  const authDir = path.dirname(authFile);
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  const loginPage = new LoginPage(page);
  await loginPage.goto();

  const { username, password } = config.credentials;
  if (username && password) {
    try {
      await loginPage.login({ username, password });
      await page.waitForLoadState('domcontentloaded');
      Logger.info(`[GLOBAL AUTH] Successfully authenticated user: ${username}`);
    } catch {
      Logger.warn('[GLOBAL AUTH] Fallback storage state capture');
    }
  }

  // Save authenticated cookies and local storage tokens
  await page.context().storageState({ path: authFile });
  Logger.info(`[GLOBAL AUTH] Storage state successfully saved to ${authFile}`);
});
