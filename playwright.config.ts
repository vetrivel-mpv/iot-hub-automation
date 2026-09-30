import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

/**
 * Load environment variables from .env file
 */
dotenv.config({ path: path.resolve(__dirname, '.env') });

const BASE_URL = process.env.WDH_BASE_URL || 'https://wdh-sitstg2.nokiawing.com';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
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
      'allure-playwright',
      {
        outputFolder: 'reports/allure-results',
        detail: true,
        suiteTitle: true,
        environmentInfo: {
          Portal: 'IoT Hub',
          Framework: 'Playwright TypeScript',
        },
      },
    ],
  ],
  use: {
    baseURL: BASE_URL,
    ignoreHTTPSErrors: true,
    actionTimeout: 15000,
    navigationTimeout: 30000,
    trace: process.env.CI ? 'on-first-retry' : 'on',
    screenshot: 'on',
    video: 'on',
    viewport: { width: 1440, height: 900 },
  },
  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },
  ],
  outputDir: 'reports/artifacts',
});

