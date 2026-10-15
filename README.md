# IoT Hub Automation Framework

Enterprise End-to-End Test Automation Framework for the **IoT Hub** portal built with **Playwright**, **TypeScript**, and the **Page Object Model (POM)** pattern.

---

## 🚀 Key Features

- **Page Object Model (POM)**: Modular, maintainable, and decoupled page object abstractions (`BasePage`, `LoginPage`, `DashboardPage`, `NavigationMenu`).
- **Custom Playwright Fixtures**: Easy dependency injection of pages directly into test specs (`baseTest.ts`).
- **Multi-Browser Support**: Pre-configured for Chromium, Firefox, WebKit (Safari), and Mobile Viewports.
- **Dynamic Waiting & Resilience**: Handles React single-page app loading masks, pacman loading animations (`.lds-pacman`), and network state changes.
- **Reporting & Diagnostics**:
  - Interactive HTML Reports (`reports/html-report`)
  - Automated Screenshots on Failure
  - Full Execution Traces with DOM snapshot inspection
  - JSON and formatted CLI logs
- **Environment Driven**: Seamless multi-environment switching (DEV, SIT, PROD) via `.env`.

---

## 📁 Project Structure

```
IOT HUB Automation/
├── .env.example              # Environment variables template
├── .env                      # Active test environment variables
├── .gitignore                # Git ignore rules
├── package.json              # NPM dependencies & scripts
├── tsconfig.json             # TypeScript compiler configuration
├── playwright.config.ts      # Playwright test runner configuration
├── README.md                 # Framework documentation
├── src/
│   ├── config/
│   │   └── environment.ts    # Config reader for URLs, credentials, timeouts
│   ├── fixtures/
│   │   └── baseTest.ts       # Custom Playwright test fixture with POM injection
│   ├── pages/
│   │   ├── BasePage.ts       # Common base page with spinner handlers & wait utilities
│   │   ├── LoginPage.ts      # Login form actions and UAM/SSO authentication locators
│   │   ├── DashboardPage.ts  # Top header, profile dropdown, widgets, search
│   │   └── NavigationMenu.ts # Sidebar menus, submenus, and togglers
│   ├── types/
│   │   └── index.ts          # TypeScript interfaces & types
│   └── utils/
│       ├── logger.ts         # Colored step & diagnostic logging
│       └── testData.ts       # Test data generators & negative scenario fixtures
├── tests/
│   ├── auth/
│   │   └── login.spec.ts     # Authentication & access test scenarios
│   └── dashboard/
│       └── navigation.spec.ts# Dashboard layout & navigation scenarios
└── reports/                  # Generated reports and failure artifacts
```

---

## 🛠️ Setup & Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Install Playwright Browsers
```bash
npx playwright install chromium
# Or install all browsers:
# npx playwright install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env` and fill in your portal URL and credentials:
```bash
cp .env.example .env
```

Edit `.env`:
```env
WDH_BASE_URL=https://wdh-sitstg2.nokiawing.com
WDH_USERNAME=your_username@iothub.com
WDH_PASSWORD=your_password
WDH_ENV=SIT
```

---

## 🧪 Running Tests

### Run All Tests (Headless)
```bash
npm test
```

### Run Tests in Headed Mode (See Browser Window)
```bash
npm run test:headed
```

### Run with Playwright Interactive UI Mode
```bash
npm run test:ui
```

### Run Specific Test Suites
```bash
# Authentication tests
npm run test:auth

# Dashboard tests
npm run test:dashboard
```

### Run on Specific Browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Run in Debug Mode
```bash
npm run test:debug
```

---

## 📊 Viewing Test Reports & Traces

### Open HTML Report
```bash
npm run test:report
```

### Inspect Playwright Trace for Failed Runs
```bash
npx playwright show-trace reports/artifacts/traces/<trace-name>.zip
```

---

## 🧩 Adding New Page Objects & Tests

1. **Create Page Object**: Add a new class in `src/pages/` extending `BasePage`.
2. **Register in Fixture**: Add the page instance to `src/fixtures/baseTest.ts`.
3. **Write Test Spec**: Create your test file in `tests/<module>/<feature>.spec.ts` using `test` from `@fixtures/baseTest`.

---

## 📜 Continuous Integration (CI/CD)

The framework is configured to run in CI environments (e.g. GitLab CI, GitHub Actions, Jenkins) with:
- Retry on failure enabled in CI (`retries: 2`)
- Single worker mode in CI for stability
- Headless execution with screenshot and trace recording on failure
