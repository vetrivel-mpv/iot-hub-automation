import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

/**
 * Load environment variables from .env file
 */
dotenv.config({ path: path.resolve(__dirname, '.env') });

const BASE_URL = process.env.WDH_BASE_URL || 'https://wdh-sitstg2.nokiawing.com';
const WORKERS_COUNT = process.env.CI ? 2 : (process.env.WORKERS ? parseInt(process.env.WORKERS, 10) : 4);

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : (process.env.RETRIES ? parseInt(process.env.RETRIES, 10) : 1),
  workers: WORKERS_COUNT,
  timeout: 60000,
  expect: {
    timeout: 10000,
  },
  reporter: [
    ['list'],
    [
      'html',
      {
        outputFolder: 'reports/html-report',
        open: 'never',
      },
    ],
    [
      'json',
      {
        outputFile: 'reports/test-results.json',
      },
    ],
    [
      'blob',
      {
        outputDir: 'reports/blob-report',
      },
    ],
  ],
  use: {
    baseURL: BASE_URL,
    headless: process.env.HEADLESS !== 'false',
    ignoreHTTPSErrors: true,
    actionTimeout: process.env.ACTION_TIMEOUT ? parseInt(process.env.ACTION_TIMEOUT, 10) : 15000,
    navigationTimeout: process.env.NAVIGATION_TIMEOUT ? parseInt(process.env.NAVIGATION_TIMEOUT, 10) : 30000,
    trace: process.env.CI ? 'on-first-retry' : (process.env.ENABLE_TRACING === 'false' ? 'off' : 'on'),
    screenshot: 'on',
    video: 'on',
    viewport: { width: 1440, height: 900 },
    launchOptions: {
      slowMo: process.env.SLOW_MO ? parseInt(process.env.SLOW_MO, 10) : 0,
    },
  },
  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: 'chromium',
      testIgnore: /.*\.setup\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },
    {
      name: 'firefox',
      testIgnore: /.*\.setup\.ts/,
      use: {
        ...devices['Desktop Firefox'],
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },
    {
      name: 'webkit',
      testIgnore: /.*\.setup\.ts/,
      use: {
        ...devices['Desktop Safari'],
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },
  ],
  outputDir: 'reports/artifacts',
});
