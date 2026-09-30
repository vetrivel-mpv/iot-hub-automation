const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

// Test Case Data Definition
const testCases = [
  // ==========================================
  // DOMAIN 1: AUTHENTICATION, ACCESS CONTROL & SECURITY (15 TCs)
  // ==========================================
  {
    id: 'TC_AUTH_001',
    module: 'Authentication & Security',
    subModule: 'Landing & Redirection',
    title: 'Verify IoT Hub Portal landing page loads and redirects to Keycloak SSO login page',
    objective: 'Ensure users navigating to root URL are redirected to the official Keycloak/Nokia SSO login interface.',
    preconditions: 'Browser is open; no active session exists.',
    steps: '1. Open browser\n2. Navigate to portal base URL (https://wdh-sitstg2.nokiawing.com/)\n3. Observe redirection and page elements',
    testData: 'Base URL: https://wdh-sitstg2.nokiawing.com/',
    expectedResult: 'Portal loads successfully with HTTP 200/302, displays "Sign in to wdh-sitstg2" or "IoT Hub" in title, and renders SSO login card.',
    testType: 'Smoke',
    priority: 'Critical',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/auth/login.spec.ts -> [TC_AUTH_001]',
    status: 'Automated & Passed',
    sheetTab: '01_Auth_and_Security'
  },
  {
    id: 'TC_AUTH_002',
    module: 'Authentication & Security',
    subModule: 'Login Form Elements',
    title: 'Verify UI components and accessibility of Login form',
    objective: 'Confirm all required authentication elements (Username, Password, Submit button, Logo) are visible and accessible.',
    preconditions: 'User is on the portal login page.',
    steps: '1. Navigate to login page\n2. Inspect presence of Username input field\n3. Inspect presence of Password input field\n4. Inspect presence of Log In button\n5. Inspect Nokia / WING brand logo',
    testData: 'N/A (Static UI elements)',
    expectedResult: 'All fields (Username, Password, Submit button, Brand Logo) are visible, enabled, and conform to accessibility contrast standards.',
    testType: 'UI/UX',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/auth/login.spec.ts -> [TC_AUTH_002]',
    status: 'Automated & Passed',
    sheetTab: '01_Auth_and_Security'
  },
  {
    id: 'TC_AUTH_003',
    module: 'Authentication & Security',
    subModule: 'Valid Authentication',
    title: 'Verify successful login with valid enterprise credentials and redirection to Dashboard',
    objective: 'Validate that a registered portal user can authenticate successfully and access the main dashboard.',
    preconditions: 'User has active, valid credentials in SIT/STG environment.',
    steps: '1. Navigate to login page\n2. Enter valid username in Username field\n3. Enter valid password in Password field\n4. Click Log In button\n5. Wait for page navigation',
    testData: 'Username: vetrivel_m | Password: Valid credentials from .env',
    expectedResult: 'Authentication succeeds without error banner; user is redirected to /dashboard; top navigation header displays username.',
    testType: 'Functional',
    priority: 'Critical',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/auth/login.spec.ts -> [TC_AUTH_003]',
    status: 'Automated & Passed',
    sheetTab: '01_Auth_and_Security'
  },
  {
    id: 'TC_AUTH_004',
    module: 'Authentication & Security',
    subModule: 'Negative Authentication',
    title: 'Verify error feedback when entering an invalid password',
    objective: 'Confirm the system denies access and provides secure error feedback on password mismatch.',
    preconditions: 'User is on login page.',
    steps: '1. Enter valid username "vetrivel_m"\n2. Enter incorrect password "WrongPassword123!"\n3. Click Log In button',
    testData: 'Username: vetrivel_m | Password: WrongPassword123!',
    expectedResult: 'Login is rejected; user remains on login page; an alert displays "Invalid username or password"; no dashboard access.',
    testType: 'Negative',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/auth/login.spec.ts -> [TC_AUTH_004]',
    status: 'Automated & Passed',
    sheetTab: '01_Auth_and_Security'
  },
  {
    id: 'TC_AUTH_005',
    module: 'Authentication & Security',
    subModule: 'Negative Authentication',
    title: 'Verify error feedback when entering a non-existent username',
    objective: 'Confirm access denial for unauthorized / non-existent user accounts.',
    preconditions: 'User is on login page.',
    steps: '1. Enter unregistered username "nonexistent.user999@nokiawing.com"\n2. Enter standard password "Pass12345!"\n3. Click Log In button',
    testData: 'Username: nonexistent.user999@nokiawing.com | Password: Pass12345!',
    expectedResult: 'Login is rejected; generic error message "Invalid username or password" is shown to prevent account enumeration.',
    testType: 'Negative',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/auth/login.spec.ts -> [TC_AUTH_005]',
    status: 'Automated & Passed',
    sheetTab: '01_Auth_and_Security'
  },
  {
    id: 'TC_AUTH_006',
    module: 'Authentication & Security',
    subModule: 'Field Validation',
    title: 'Verify client-side validation when submitting empty credentials',
    objective: 'Ensure empty form submissions are blocked before network dispatch.',
    preconditions: 'User is on login page with empty input fields.',
    steps: '1. Leave Username field empty\n2. Leave Password field empty\n3. Click Log In button',
    testData: 'Username: "" | Password: ""',
    expectedResult: 'Form submission is prevented; browser or inline validation highlights required fields; user remains on login page.',
    testType: 'Boundary',
    priority: 'Medium',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/auth/login.spec.ts -> [TC_AUTH_006]',
    status: 'Automated & Passed',
    sheetTab: '01_Auth_and_Security'
  },
  {
    id: 'TC_AUTH_007',
    module: 'Authentication & Security',
    subModule: 'Security Testing',
    title: 'Verify immunity against SQL injection and XSS in login fields',
    objective: 'Confirm authentication inputs are sanitized and immune to injection attacks.',
    preconditions: 'User is on login page.',
    steps: '1. Enter injection payload "\' OR \'1\'=\'1" in Username\n2. Enter "<script>alert(1)</script>" in Password\n3. Click Log In button',
    testData: 'Payload: \' OR \'1\'=\'1 --',
    expectedResult: 'System handles payloads safely; no script execution or DB syntax error occurs; access is denied gracefully.',
    testType: 'Security',
    priority: 'Critical',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/auth/login.spec.ts -> [TC_AUTH_007]',
    status: 'Automated & Passed',
    sheetTab: '01_Auth_and_Security'
  },
  {
    id: 'TC_AUTH_008',
    module: 'Authentication & Security',
    subModule: 'Auxiliary Controls',
    title: 'Verify "Show Password" toggle functionality',
    objective: 'Ensure password characters can be toggled between masked (bullets) and plain text.',
    preconditions: 'User has entered text into password field.',
    steps: '1. Enter password text "MySecretPass"\n2. Verify input type is "password"\n3. Click "Show Password" checkbox / eye icon\n4. Verify input type changes to "text"\n5. Toggle back and verify masking',
    testData: 'Password: MySecretPass',
    expectedResult: 'Password text alternates between masked and visible plain text in accordance with toggle state.',
    testType: 'Functional',
    priority: 'Low',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/auth/login.spec.ts -> [TC_AUTH_008]',
    status: 'Automated & Passed',
    sheetTab: '01_Auth_and_Security'
  },
  {
    id: 'TC_AUTH_009',
    module: 'Authentication & Security',
    subModule: 'Auxiliary Controls',
    title: 'Verify "Remember Me" checkbox retains username across browser restarts',
    objective: 'Confirm checking "Remember Me" stores user identifier in persistent client cookie/storage.',
    preconditions: 'User is logging in.',
    steps: '1. Enter valid username\n2. Check "Remember Me" checkbox\n3. Complete login\n4. Logout and return to login page',
    testData: 'Username: vetrivel_m',
    expectedResult: 'Username field is pre-populated upon returning to login page.',
    testType: 'Functional',
    priority: 'Medium',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/auth/login.spec.ts -> [TC_AUTH_009]',
    status: 'Automated & Passed',
    sheetTab: '01_Auth_and_Security'
  },
  {
    id: 'TC_AUTH_010',
    module: 'Authentication & Security',
    subModule: 'Auxiliary Controls',
    title: 'Verify "Forgot Password" link navigates to password reset workflow',
    objective: 'Confirm forgot password link redirects to self-service recovery page.',
    preconditions: 'User is on login page.',
    steps: '1. Click "Forgot Password?" link\n2. Verify target page URL and form fields',
    testData: 'N/A',
    expectedResult: 'User is redirected to password recovery page prompting for registered username or email address.',
    testType: 'Functional',
    priority: 'Medium',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/auth/login.spec.ts -> [TC_AUTH_010]',
    status: 'Automated & Passed',
    sheetTab: '01_Auth_and_Security'
  },
  {
    id: 'TC_AUTH_011',
    module: 'Authentication & Security',
    subModule: 'Session Management',
    title: 'Verify automatic session timeout on extended user inactivity',
    objective: 'Ensure user session expires after configured idle threshold for security compliance.',
    preconditions: 'User is logged in.',
    steps: '1. Authenticate to dashboard\n2. Remain idle without mouse or keyboard interactions for 15 minutes\n3. Attempt to click a navigation item',
    testData: 'Idle duration: 15 minutes',
    expectedResult: 'Session timeout modal displays or user is automatically redirected to login page with session expired message.',
    testType: 'Security',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/auth/login.spec.ts -> [TC_AUTH_011]',
    status: 'Ready to Execute',
    sheetTab: '01_Auth_and_Security'
  },
  {
    id: 'TC_AUTH_012',
    module: 'Authentication & Security',
    subModule: 'Logout Flow',
    title: 'Verify User Profile menu and successful Logout action',
    objective: 'Ensure user can terminate their active session from user profile dropdown.',
    preconditions: 'User is authenticated and on dashboard.',
    steps: '1. Click on User Profile dropdown in top-right header\n2. Verify dropdown menu displays user details and Logout option\n3. Click "Logout"\n4. Wait for redirection',
    testData: 'User: vetrivel_m',
    expectedResult: 'User session is invalidated; cookies cleared; user is redirected back to Keycloak login page.',
    testType: 'Smoke',
    priority: 'Critical',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/auth/login.spec.ts -> [TC_AUTH_012]',
    status: 'Automated & Passed',
    sheetTab: '01_Auth_and_Security'
  },
  {
    id: 'TC_AUTH_013',
    module: 'Authentication & Security',
    subModule: 'Session Security',
    title: 'Verify browser back button is prevented after logout',
    objective: 'Ensure logged-out users cannot re-enter portal by clicking browser Back button.',
    preconditions: 'User has just logged out of portal.',
    steps: '1. Complete logout\n2. Click browser "Back" button\n3. Verify page response',
    testData: 'N/A',
    expectedResult: 'Browser does not render cached authenticated views; user is redirected back to login page.',
    testType: 'Security',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/auth/login.spec.ts -> [TC_AUTH_013]',
    status: 'Automated & Passed',
    sheetTab: '01_Auth_and_Security'
  },
  {
    id: 'TC_AUTH_014',
    module: 'Authentication & Security',
    subModule: 'Security Headers',
    title: 'Verify HTTPS protocol enforcement and HTTP security headers',
    objective: 'Validate portal enforces SSL/TLS and security headers (CSP, HSTS, X-Content-Type-Options, X-Frame-Options).',
    preconditions: 'Portal is reachable over network.',
    steps: '1. Inspect HTTP response headers on landing page\n2. Verify Strict-Transport-Security\n3. Verify Content-Security-Policy\n4. Verify X-Frame-Options',
    testData: 'Target: https://wdh-sitstg2.nokiawing.com',
    expectedResult: 'HSTS max-age >= 15724800, X-Frame-Options=SAMEORIGIN, X-Content-Type-Options=nosniff are present.',
    testType: 'Security',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/auth/login.spec.ts -> [TC_AUTH_014]',
    status: 'Automated & Passed',
    sheetTab: '01_Auth_and_Security'
  },
  {
    id: 'TC_AUTH_015',
    module: 'Authentication & Security',
    subModule: 'Multi-Tab Session',
    title: 'Verify multi-tab session termination upon logging out from one tab',
    objective: 'Ensure logout in one browser tab immediately terminates session across all open tabs.',
    preconditions: 'User has portal open in two separate browser tabs in same session.',
    steps: '1. Open portal in Tab A and Tab B\n2. In Tab A, click Logout\n3. Switch to Tab B and click any navigation link',
    testData: 'Two concurrent tabs',
    expectedResult: 'Tab B detects invalid session and redirects to login page.',
    testType: 'Security',
    priority: 'Medium',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/auth/login.spec.ts -> [TC_AUTH_015]',
    status: 'Ready to Execute',
    sheetTab: '01_Auth_and_Security'
  },

  // ==========================================
  // DOMAIN 2: DASHBOARD & EXECUTIVE ANALYTICS (13 TCs)
  // ==========================================
  {
    id: 'TC_DASH_001',
    module: 'Dashboard & Analytics',
    subModule: 'Brand Header & Navigation',
    title: 'Verify brand header layout, Nokia logo, IoT Hub title, and User Profile',
    objective: 'Confirm brand identity header renders correctly with all standard enterprise elements.',
    preconditions: 'User is authenticated and on Dashboard.',
    steps: '1. Navigate to /dashboard\n2. Verify Nokia logo visibility\n3. Verify "IoT Hub" text title\n4. Verify User Profile badge in top-right',
    testData: 'URL: /dashboard',
    expectedResult: 'Top navbar is visible with Nokia logo, title, and active username "vetrivel_m".',
    testType: 'Smoke',
    priority: 'Critical',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/dashboard/dashboard.spec.ts -> [TC_DASH_001]',
    status: 'Automated & Passed',
    sheetTab: '02_Dashboard_Analytics'
  },
  {
    id: 'TC_DASH_002',
    module: 'Dashboard & Analytics',
    subModule: 'Tenant Realm Selector',
    title: 'Verify Tenant / Realm dropdown selector and realm switching',
    objective: 'Ensure tenant selector allows switching between "All" and individual enterprise tenants.',
    preconditions: 'User has multi-tenant administrative privileges.',
    steps: '1. Locate tenant dropdown (default "All")\n2. Click dropdown\n3. Select a specific tenant realm\n4. Verify data refresh',
    testData: 'Selection: "All" or Specific Enterprise Tenant',
    expectedResult: 'Tenant dropdown expands showing available realms; selecting a realm updates active dashboard context.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/dashboard/dashboard.spec.ts -> [TC_DASH_002]',
    status: 'Automated & Passed',
    sheetTab: '02_Dashboard_Analytics'
  },
  {
    id: 'TC_DASH_003',
    module: 'Dashboard & Analytics',
    subModule: 'Localization',
    title: 'Verify Language selector dropdown and locale switching',
    objective: 'Validate language selector allows switching portal locale (e.g. English, French, Spanish).',
    preconditions: 'User is on Dashboard.',
    steps: '1. Click Language selector button (default "English")\n2. Verify available languages in menu\n3. Select a language option',
    testData: 'Options: English, French, German, Spanish',
    expectedResult: 'Language dropdown is visible, interactive, and updates UI strings according to selected locale.',
    testType: 'UI/UX',
    priority: 'Medium',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/dashboard/dashboard.spec.ts -> [TC_DASH_003]',
    status: 'Automated & Passed',
    sheetTab: '02_Dashboard_Analytics'
  },
  {
    id: 'TC_DASH_004',
    module: 'Dashboard & Analytics',
    subModule: 'Metric Cards',
    title: 'Verify Account metric cards (Total Accounts, Active Accounts)',
    objective: 'Confirm dashboard renders Total Accounts and Active Accounts summary KPI cards.',
    preconditions: 'User is on Dashboard.',
    steps: '1. Inspect "TOTAL ACCOUNTS" card\n2. Inspect "ACTIVE ACCOUNTS" card\n3. Verify card icons, labels, and numeric counters',
    testData: 'Metric cards',
    expectedResult: 'Both cards are visible with correct titles, icons, and non-negative integer counters.',
    testType: 'Smoke',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/dashboard/dashboard.spec.ts -> [TC_DASH_004]',
    status: 'Automated & Passed',
    sheetTab: '02_Dashboard_Analytics'
  },
  {
    id: 'TC_DASH_005',
    module: 'Dashboard & Analytics',
    subModule: 'Metric Cards',
    title: 'Verify SIM inventory metric cards (Allocated SIMs, SIM Inventory)',
    objective: 'Confirm physical SIM metric cards display accurate counts.',
    preconditions: 'User is on Dashboard.',
    steps: '1. Inspect "ALLOCATED SIMS" card\n2. Inspect "SIM INVENTORY" card\n3. Verify counts match underlying inventory state',
    testData: 'Metric cards',
    expectedResult: 'Both SIM cards display with microchip icon and numeric stock values.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/dashboard/dashboard.spec.ts -> [TC_DASH_005]',
    status: 'Automated & Passed',
    sheetTab: '02_Dashboard_Analytics'
  },
  {
    id: 'TC_DASH_006',
    module: 'Dashboard & Analytics',
    subModule: 'Metric Cards',
    title: 'Verify eSIM inventory metric cards (Allocated eSIMs, eSIM Inventory)',
    objective: 'Confirm digital eSIM metric cards display accurate counts.',
    preconditions: 'User is on Dashboard.',
    steps: '1. Inspect "ALLOCATED ESIMS" card\n2. Inspect "ESIM INVENTORY" card\n3. Verify labels and values',
    testData: 'Metric cards',
    expectedResult: 'Both eSIM cards display with eSIM icon and inventory numbers.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/dashboard/dashboard.spec.ts -> [TC_DASH_006]',
    status: 'Automated & Passed',
    sheetTab: '02_Dashboard_Analytics'
  },
  {
    id: 'TC_DASH_007',
    module: 'Dashboard & Analytics',
    subModule: 'View Tabs',
    title: 'Verify Dashboard view tab switching (ACCOUNTS, SUBSCRIPTIONS, USAGE)',
    objective: 'Confirm switching dashboard tabs refreshes the analytical view appropriately.',
    preconditions: 'User is on Dashboard.',
    steps: '1. Verify default active tab is "ACCOUNTS"\n2. Click "SUBSCRIPTIONS" tab and verify view update\n3. Click "USAGE" tab and verify view update\n4. Click back to "ACCOUNTS"',
    testData: 'Tabs: ACCOUNTS, SUBSCRIPTIONS, USAGE',
    expectedResult: 'Tab transitions are smooth without reload errors; active tab styling updates; widgets reflect tab context.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/dashboard/dashboard.spec.ts -> [TC_DASH_007]',
    status: 'Automated & Passed',
    sheetTab: '02_Dashboard_Analytics'
  },
  {
    id: 'TC_DASH_008',
    module: 'Dashboard & Analytics',
    subModule: 'Charts & Analytics',
    title: 'Verify Account Status breakdown chart and legends',
    objective: 'Confirm Account Status chart displays breakdown across Activated, Suspended, Retired, and Draft states.',
    preconditions: 'User is on ACCOUNTS dashboard tab.',
    steps: '1. Locate "ACCOUNT STATUS" chart widget\n2. Verify chart legends (Activated, Suspended, Retired, Draft)\n3. Hover over chart sectors to inspect tooltips',
    testData: 'Status categories',
    expectedResult: 'Chart renders with color-coded legend; tooltips display exact count and percentage for each status.',
    testType: 'UI/UX',
    priority: 'Medium',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/dashboard/dashboard.spec.ts -> [TC_DASH_008]',
    status: 'Automated & Passed',
    sheetTab: '02_Dashboard_Analytics'
  },
  {
    id: 'TC_DASH_009',
    module: 'Dashboard & Analytics',
    subModule: 'Charts & Analytics',
    title: 'Verify Account Type chart (Enterprise vs Reseller)',
    objective: 'Confirm Account Type chart visualizes distribution between Enterprise and Reseller accounts.',
    preconditions: 'User is on ACCOUNTS dashboard tab.',
    steps: '1. Locate "ACCOUNT TYPE" chart widget\n2. Verify legends: "Enterprise" and "Reseller"\n3. Inspect sector values',
    testData: 'Account types',
    expectedResult: 'Chart displays proportional split between Enterprise and Reseller account categories.',
    testType: 'UI/UX',
    priority: 'Medium',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/dashboard/dashboard.spec.ts -> [TC_DASH_009]',
    status: 'Automated & Passed',
    sheetTab: '02_Dashboard_Analytics'
  },
  {
    id: 'TC_DASH_010',
    module: 'Dashboard & Analytics',
    subModule: 'Widgets & Tables',
    title: 'Verify "Top 15 Active Accounts" table grid and column sorting',
    objective: 'Confirm Top 15 Active Accounts widget displays accounts ranked by total SIMs.',
    preconditions: 'User is on Dashboard.',
    steps: '1. Locate "TOP 15 ACTIVE ACCOUNTS" widget\n2. Verify table columns: Account Name, Active SIMS, Total SIMS\n3. Click column header to toggle sorting order',
    testData: 'Top accounts widget',
    expectedResult: 'Table renders top accounts; clicking headers toggles ascending/descending sorting.',
    testType: 'Functional',
    priority: 'Medium',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/dashboard/dashboard.spec.ts -> [TC_DASH_010]',
    status: 'Automated & Passed',
    sheetTab: '02_Dashboard_Analytics'
  },
  {
    id: 'TC_DASH_011',
    module: 'Dashboard & Analytics',
    subModule: 'Charts & Analytics',
    title: 'Verify "Account Evolution" trend chart and monthly buckets',
    objective: 'Validate Account Evolution bar chart depicts Created vs Retired accounts across time intervals.',
    preconditions: 'User is on Dashboard.',
    steps: '1. Locate "ACCOUNT EVOLUTION" widget\n2. Verify horizontal X-axis shows months (e.g. Nov25, Jan26, Mar26, May26, Jul26, Sep26)\n3. Verify Y-axis scale\n4. Verify Created (blue) and Retired (green) bars',
    testData: 'Time series data',
    expectedResult: 'Chart displays chronological creation and retirement volumes with accurate axis labeling.',
    testType: 'UI/UX',
    priority: 'Medium',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/dashboard/dashboard.spec.ts -> [TC_DASH_011]',
    status: 'Automated & Passed',
    sheetTab: '02_Dashboard_Analytics'
  },
  {
    id: 'TC_DASH_012',
    module: 'Dashboard & Analytics',
    subModule: 'Chart Interactivity',
    title: 'Verify chart fullscreen zoom and context options menu',
    objective: 'Confirm user can expand Account Evolution chart to full screen and access options menu.',
    preconditions: 'User is on Dashboard.',
    steps: '1. Click Fullscreen/Expand icon on Account Evolution card\n2. Verify enlarged dialog view\n3. Close modal\n4. Click options (three dots) icon and inspect export/view options',
    testData: 'Widget controls',
    expectedResult: 'Fullscreen dialog expands chart cleanly; options menu provides export/download features.',
    testType: 'UI/UX',
    priority: 'Low',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/dashboard/dashboard.spec.ts -> [TC_DASH_012]',
    status: 'Automated & Passed',
    sheetTab: '02_Dashboard_Analytics'
  },
  {
    id: 'TC_DASH_013',
    module: 'Dashboard & Analytics',
    subModule: 'Responsiveness',
    title: 'Verify Dashboard rendering across multiple screen viewports (Desktop 1920x1080, Laptop 1440x900)',
    objective: 'Ensure dashboard layout adapts responsively without overlapping widgets or horizontal overflow.',
    preconditions: 'User is on Dashboard.',
    steps: '1. Set viewport to 1440x900\n2. Check grid layout\n3. Set viewport to 1920x1080\n4. Check layout spacing and card alignment',
    testData: 'Viewports: 1440x900, 1920x1080',
    expectedResult: 'All metric cards and charts reflow cleanly without layout breaks or horizontal scrollbar on standard desktop displays.',
    testType: 'UI/UX',
    priority: 'Medium',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/dashboard/dashboard.spec.ts -> [TC_DASH_013]',
    status: 'Automated & Passed',
    sheetTab: '02_Dashboard_Analytics'
  },

  // ==========================================
  // DOMAIN 3: SUBSCRIPTIONS MANAGEMENT (18 TCs)
  // ==========================================
  {
    id: 'TC_SUB_001',
    module: 'Subscriptions Management',
    subModule: 'Navigation Menu',
    title: 'Verify Subscriptions menu dropdown hierarchy and sub-items',
    objective: 'Ensure Subscriptions top-level menu expands and reveals all sub-sections and items.',
    preconditions: 'User is logged in.',
    steps: '1. Click "Subscriptions" in top navigation bar\n2. Inspect Subscriptions section items: SIM, eSIM Profiles, Tags, Custom fields, Group Subscriptions\n3. Inspect Rate Plan Summary section items: Rate Plan Usage, Individual Add-ons, Pool Add-ons',
    testData: 'Menu: Subscriptions',
    expectedResult: 'All 8 submenu items are visible and formatted under their respective section headers.',
    testType: 'Smoke',
    priority: 'Critical',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/subscriptions/subscriptions.spec.ts -> [TC_SUB_001]',
    status: 'Automated & Passed',
    sheetTab: '03_Subscriptions_SIMs'
  },
  {
    id: 'TC_SUB_002',
    module: 'Subscriptions Management',
    subModule: 'SIM Grid',
    title: 'Verify SIM management data table grid, columns, and layout',
    objective: 'Confirm Subscriptions -> SIM page renders the core subscription inventory table.',
    preconditions: 'User navigates to Subscriptions -> SIM.',
    steps: '1. Navigate to /subscriptions\n2. Wait for loading spinner to dismiss\n3. Verify presence of columns: ICCID, IMSI, MSISDN, Account, State, Rate Plan',
    testData: 'URL: /subscriptions',
    expectedResult: 'Table loads with correct headers, checkable rows, and pagination controls.',
    testType: 'Smoke',
    priority: 'Critical',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/subscriptions/subscriptions.spec.ts -> [TC_SUB_002]',
    status: 'Automated & Passed',
    sheetTab: '03_Subscriptions_SIMs'
  },
  {
    id: 'TC_SUB_003',
    module: 'Subscriptions Management',
    subModule: 'Search & Filtering',
    title: 'Verify instant search filter in SIM table by ICCID',
    objective: 'Confirm user can search for a specific SIM card using its 19-20 digit ICCID.',
    preconditions: 'User is on Subscriptions SIM table.',
    steps: '1. Enter ICCID prefix (e.g. "8901") in search input\n2. Press Enter\n3. Observe table rows',
    testData: 'Query: "8901"',
    expectedResult: 'Table filters dynamically to show only SIM records matching the entered ICCID pattern.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/subscriptions/subscriptions.spec.ts -> [TC_SUB_003]',
    status: 'Automated & Passed',
    sheetTab: '03_Subscriptions_SIMs'
  },
  {
    id: 'TC_SUB_004',
    module: 'Subscriptions Management',
    subModule: 'Search & Filtering',
    title: 'Verify SIM filtering by IMSI and MSISDN fields',
    objective: 'Confirm column-level filters work for IMSI and phone number (MSISDN).',
    preconditions: 'User is on Subscriptions SIM table.',
    steps: '1. Enter IMSI filter value in column filter\n2. Verify filtered rows\n3. Clear filter and enter MSISDN filter value\n4. Verify filtered rows',
    testData: 'IMSI / MSISDN filters',
    expectedResult: 'Grid updates to display only matching SIM records corresponding to the filter inputs.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/subscriptions/subscriptions.spec.ts -> [TC_SUB_004]',
    status: 'Automated & Passed',
    sheetTab: '03_Subscriptions_SIMs'
  },
  {
    id: 'TC_SUB_005',
    module: 'Subscriptions Management',
    subModule: 'Advanced Filters',
    title: 'Verify SIM filtering by Subscription State dropdown (Inventory, Activated, Suspended, Retired)',
    objective: 'Validate filtering SIMs by lifecycle status.',
    preconditions: 'User is on Subscriptions SIM table.',
    steps: '1. Click State filter dropdown\n2. Select "Activated"\n3. Verify table updates\n4. Select "Suspended"\n5. Verify table updates',
    testData: 'State: Activated, Suspended',
    expectedResult: 'Table shows only subscriptions currently in the selected lifecycle state.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/subscriptions/subscriptions.spec.ts -> [TC_SUB_005]',
    status: 'Automated & Passed',
    sheetTab: '03_Subscriptions_SIMs'
  },
  {
    id: 'TC_SUB_006',
    module: 'Subscriptions Management',
    subModule: 'Table Pagination',
    title: 'Verify table pagination controls and rows per page selector (10, 25, 50, 100)',
    objective: 'Ensure table pagination correctly chunks large subscription inventories.',
    preconditions: 'User is on Subscriptions SIM table.',
    steps: '1. Locate pagination footer\n2. Change Rows Per Page to 25\n3. Verify table displays up to 25 rows\n4. Click Next Page button (>)\n5. Verify page 2 records load',
    testData: 'Rows per page: 10, 25, 50, 100',
    expectedResult: 'Rows per page updates immediately; page navigation updates displayed records count accurately.',
    testType: 'Functional',
    priority: 'Medium',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/subscriptions/subscriptions.spec.ts -> [TC_SUB_006]',
    status: 'Automated & Passed',
    sheetTab: '03_Subscriptions_SIMs'
  },
  {
    id: 'TC_SUB_007',
    module: 'Subscriptions Management',
    subModule: 'Column Customization',
    title: 'Verify Column Visibility customization toggle in SIM table',
    objective: 'Confirm users can hide and unhide table columns according to preference.',
    preconditions: 'User is on Subscriptions SIM table.',
    steps: '1. Click Column Visibility icon button\n2. Uncheck "MSISDN" column\n3. Verify MSISDN column is hidden\n4. Re-check "MSISDN" column\n5. Verify column reappears',
    testData: 'Column: MSISDN',
    expectedResult: 'Columns dynamically toggle visibility without full page reload.',
    testType: 'UI/UX',
    priority: 'Low',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/subscriptions/subscriptions.spec.ts -> [TC_SUB_007]',
    status: 'Automated & Passed',
    sheetTab: '03_Subscriptions_SIMs'
  },
  {
    id: 'TC_SUB_008',
    module: 'Subscriptions Management',
    subModule: 'Export Feature',
    title: 'Verify Export SIM data to Excel / CSV format',
    objective: 'Validate downloading filtered SIM records to an export file.',
    preconditions: 'User is on Subscriptions SIM table.',
    steps: '1. Apply a filter or select all rows\n2. Click Export icon button\n3. Select CSV / Excel option\n4. Verify file download event',
    testData: 'Export file: subscriptions_export.csv',
    expectedResult: 'File download triggers successfully with matching columns and record counts.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/subscriptions/subscriptions.spec.ts -> [TC_SUB_008]',
    status: 'Automated & Passed',
    sheetTab: '03_Subscriptions_SIMs'
  },
  {
    id: 'TC_SUB_009',
    module: 'Subscriptions Management',
    subModule: 'Data Refresh',
    title: 'Verify Refresh button updates SIM table state without resetting filters',
    objective: 'Ensure live refresh retrieves latest status from network backend.',
    preconditions: 'User is on Subscriptions SIM table.',
    steps: '1. Apply search keyword\n2. Click Refresh icon button\n3. Observe pacman/spinner loading mask\n4. Verify data is refreshed while preserving search keyword',
    testData: 'Search: "8901"',
    expectedResult: 'Table refreshes data cleanly while maintaining user filter context.',
    testType: 'Functional',
    priority: 'Medium',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/subscriptions/subscriptions.spec.ts -> [TC_SUB_009]',
    status: 'Automated & Passed',
    sheetTab: '03_Subscriptions_SIMs'
  },
  {
    id: 'TC_SUB_010',
    module: 'Subscriptions Management',
    subModule: 'Lifecycle Operations',
    title: 'Verify SIM state transition from Inventory to Activated',
    objective: 'Validate activating a pre-provisioned SIM from inventory.',
    preconditions: 'Target SIM is in "ENTERPRISE-INVENTORY" state.',
    steps: '1. Select target SIM row\n2. Click "Change State" action button\n3. Select target state "ACTIVATED"\n4. Confirm prompt dialog\n5. Wait for operation completion',
    testData: 'State transition: INVENTORY -> ACTIVATED',
    expectedResult: 'SIM status badge updates to "ACTIVATED"; state change event is logged in Audit Logs.',
    testType: 'Functional',
    priority: 'Critical',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/subscriptions/subscriptions.spec.ts -> [TC_SUB_010]',
    status: 'Automated & Passed',
    sheetTab: '03_Subscriptions_SIMs'
  },
  {
    id: 'TC_SUB_011',
    module: 'Subscriptions Management',
    subModule: 'Lifecycle Operations',
    title: 'Verify SIM state transition from Activated to Suspended',
    objective: 'Validate suspending an active SIM (barring cellular service).',
    preconditions: 'Target SIM is in "ACTIVATED" state.',
    steps: '1. Select active SIM\n2. Click "Change State"\n3. Select "SUSPENDED"\n4. Select reason (e.g. Customer Request / Fraud)\n5. Click Confirm',
    testData: 'State transition: ACTIVATED -> SUSPENDED',
    expectedResult: 'SIM state updates to "SUSPENDED"; network barring instruction dispatched.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/subscriptions/subscriptions.spec.ts -> [TC_SUB_011]',
    status: 'Automated & Passed',
    sheetTab: '03_Subscriptions_SIMs'
  },
  {
    id: 'TC_SUB_012',
    module: 'Subscriptions Management',
    subModule: 'Lifecycle Operations',
    title: 'Verify SIM state transition from Suspended to Resumed / Activated',
    objective: 'Validate un-barring and resuming service for a suspended SIM.',
    preconditions: 'Target SIM is in "SUSPENDED" state.',
    steps: '1. Select suspended SIM\n2. Click "Change State"\n3. Select "RESUME" / "ACTIVATED"\n4. Confirm action',
    testData: 'State transition: SUSPENDED -> ACTIVATED',
    expectedResult: 'SIM state returns to "ACTIVATED"; cellular data/voice service unblocked.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/subscriptions/subscriptions.spec.ts -> [TC_SUB_012]',
    status: 'Automated & Passed',
    sheetTab: '03_Subscriptions_SIMs'
  },
  {
    id: 'TC_SUB_013',
    module: 'Subscriptions Management',
    subModule: 'Lifecycle Operations',
    title: 'Verify SIM retirement / termination workflow and confirmation guardrail',
    objective: 'Validate permanently terminating a SIM subscription with mandatory safety prompt.',
    preconditions: 'Target SIM is in Suspended or Activated state.',
    steps: '1. Select SIM\n2. Click "Change State" -> "RETIRED"\n3. Verify critical warning dialog\n4. Type confirmation keyword or click Confirm',
    testData: 'State transition: -> RETIRED',
    expectedResult: 'SIM state transitions to "RETIRED"; subscription billing terminates.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/subscriptions/subscriptions.spec.ts -> [TC_SUB_013]',
    status: 'Ready to Execute',
    sheetTab: '03_Subscriptions_SIMs'
  },
  {
    id: 'TC_SUB_014',
    module: 'Subscriptions Management',
    subModule: 'Bulk Operations',
    title: 'Verify bulk SIM selection via master checkbox and batch state modification',
    objective: 'Ensure users can select multiple SIMs across page and apply bulk state transition.',
    preconditions: 'Multiple SIMs available in table.',
    steps: '1. Click master checkbox in table header to select all rows\n2. Verify selection counter displays selected count\n3. Click "Change State" button\n4. Select new state and confirm',
    testData: 'Batch size: 10 SIMs',
    expectedResult: 'Bulk operation modal confirms submission; batch job executes and updates all selected SIMs.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/subscriptions/subscriptions.spec.ts -> [TC_SUB_014]',
    status: 'Automated & Passed',
    sheetTab: '03_Subscriptions_SIMs'
  },
  {
    id: 'TC_SUB_015',
    module: 'Subscriptions Management',
    subModule: 'Rate Plan Modification',
    title: 'Verify Change Rate Plan modal and assignment to a SIM',
    objective: 'Confirm changing the assigned tariff rate plan for an existing subscription.',
    preconditions: 'SIM is selected in table.',
    steps: '1. Select SIM\n2. Click "Change Rate Plan" action button\n3. Select new rate plan from dropdown\n4. Select effective date (Immediate / Next Billing Cycle)\n5. Click Save',
    testData: 'Rate Plan: Enterprise_Unlimited_50GB',
    expectedResult: 'Rate plan assignment is saved; table reflects new rate plan name.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/subscriptions/subscriptions.spec.ts -> [TC_SUB_015]',
    status: 'Automated & Passed',
    sheetTab: '03_Subscriptions_SIMs'
  },
  {
    id: 'TC_SUB_016',
    module: 'Subscriptions Management',
    subModule: 'Add-on Bundles',
    title: 'Verify Add-on Bundle assignment to a SIM subscription',
    objective: 'Validate adding a one-time data booster or roaming add-on to an active SIM.',
    preconditions: 'SIM is active.',
    steps: '1. Select SIM\n2. Click "Add-on" action button\n3. Choose bundle (e.g. "5GB Global Roaming Pack")\n4. Confirm assignment',
    testData: 'Add-on: 5GB Roaming Booster',
    expectedResult: 'Bundle is provisioned to the subscription; quota increases accordingly.',
    testType: 'Functional',
    priority: 'Medium',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/subscriptions/subscriptions.spec.ts -> [TC_SUB_016]',
    status: 'Automated & Passed',
    sheetTab: '03_Subscriptions_SIMs'
  },
  {
    id: 'TC_SUB_017',
    module: 'Subscriptions Management',
    subModule: 'eSIM Profiles',
    title: 'Verify Subscriptions -> eSIM Profiles inventory view and status states',
    objective: 'Confirm eSIM profiles inventory displays EID, SM-DP+ address, and profile status.',
    preconditions: 'User navigates to Subscriptions -> eSIM Profiles.',
    steps: '1. Navigate to Subscriptions -> eSIM Profiles\n2. Verify page URL contains /esim\n3. Inspect columns: EID, Profile Type, Status (Available, Downloaded, Installed)',
    testData: 'URL: /subscriptions/esim',
    expectedResult: 'eSIM inventory grid renders accurately with status badges and profile management controls.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/subscriptions/subscriptions.spec.ts -> [TC_SUB_017]',
    status: 'Automated & Passed',
    sheetTab: '03_Subscriptions_SIMs'
  },
  {
    id: 'TC_SUB_018',
    module: 'Subscriptions Management',
    subModule: 'Tags Management',
    title: 'Verify Subscriptions -> Tags creation and tag association to SIMs',
    objective: 'Validate creating custom color-coded tags and attaching them to subscriptions.',
    preconditions: 'User navigates to Subscriptions -> Tags.',
    steps: '1. Navigate to Subscriptions -> Tags\n2. Click "+ CREATE TAG"\n3. Enter Tag Name "VIP-Fleet" and pick a color\n4. Save tag\n5. Attach tag to target SIM in SIM table',
    testData: 'Tag: "VIP-Fleet" | Color: #00A3E0',
    expectedResult: 'Tag is created in catalog and appears as a colored badge on assigned SIM records.',
    testType: 'Functional',
    priority: 'Medium',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/subscriptions/subscriptions.spec.ts -> [TC_SUB_018]',
    status: 'Automated & Passed',
    sheetTab: '03_Subscriptions_SIMs'
  },

  // -------------------------------------------------------------------------
  // DOMAIN 3A: ACTION TOOLBAR (SUBSCRIPTION GRID/VIEW) - ALL CONTEXT (16 TCs)
  // -------------------------------------------------------------------------
  {
    id: 'TC_SUB_ALL_001',
    module: 'Subscriptions & SIMs',
    subModule: 'Action Toolbar (All Context)',
    title: 'Action Toolbar (Subscription Grid/View) - Group Subscriptions - All Context',
    objective: 'Verify "Group Subscriptions" toolbar action trigger when ALL account context is active.',
    preconditions: 'User is on Subscriptions grid with "ALL" accounts selected in top account switcher.',
    steps: '1. Navigate to Subscriptions -> SIM\n2. Set Account Context selector to "ALL"\n3. Select multiple SIM records\n4. Click "Group Subscriptions" on Action Toolbar\n5. Verify Group Subscriptions dialog opens',
    testData: 'Account Context: ALL | Action: Group Subscriptions',
    expectedResult: 'Group Subscriptions modal displays with options to group selected subscriptions across accounts.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/subscriptions/subscriptions.spec.ts -> [TC_SUB_ALL_001]',
    status: 'Automated & Passed',
    sheetTab: '03_Subscriptions_SIMs'
  },
  {
    id: 'TC_SUB_ALL_002',
    module: 'Subscriptions & SIMs',
    subModule: 'Action Toolbar (All Context)',
    title: 'Action Toolbar (Subscription Grid/View) - Send SMS - All Context',
    objective: 'Verify "Send SMS" toolbar action triggers broadcast SMS drawer across multiple accounts in ALL context.',
    preconditions: 'User is on Subscriptions grid with "ALL" account context.',
    steps: '1. Navigate to Subscriptions -> SIM\n2. Ensure Account Context is ALL\n3. Select target SIM checkboxes\n4. Click "Send SMS" in Action Toolbar\n5. Verify SMS composer dialog appears with message text and encoding fields',
    testData: 'Account Context: ALL | Action: Send SMS',
    expectedResult: 'Send SMS modal opens, allowing multi-SIM broadcast message authoring.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/subscriptions/subscriptions.spec.ts -> [TC_SUB_ALL_002]',
    status: 'Automated & Passed',
    sheetTab: '03_Subscriptions_SIMs'
  },
  {
    id: 'TC_SUB_ALL_003',
    module: 'Subscriptions & SIMs',
    subModule: 'Action Toolbar (All Context)',
    title: 'Action Toolbar (Subscription Grid/View) - Bulk Change - SIM State - All Context',
    objective: 'Verify "Bulk Change - SIM State" action executes batch state lifecycle updates in ALL context.',
    preconditions: 'User is on Subscriptions grid with "ALL" account context.',
    steps: '1. Navigate to Subscriptions -> SIM with ALL context\n2. Select 2+ SIMs across accounts\n3. Click "Bulk Change - SIM State" on Action Toolbar\n4. Choose target lifecycle state (e.g., Suspended/Active)\n5. Submit and verify confirmation dialog',
    testData: 'Account Context: ALL | Action: Bulk SIM State',
    expectedResult: 'Bulk State Change modal opens and validates transition rules before execution.',
    testType: 'Functional',
    priority: 'Critical',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/subscriptions/subscriptions.spec.ts -> [TC_SUB_ALL_003]',
    status: 'Automated & Passed',
    sheetTab: '03_Subscriptions_SIMs'
  },
  {
    id: 'TC_SUB_ALL_004',
    module: 'Subscriptions & SIMs',
    subModule: 'Action Toolbar (All Context)',
    title: 'Action Toolbar (Subscription Grid/View) - Bulk Change - APN Group - All Context',
    objective: 'Verify "Bulk Change - APN Group" allows batch re-assignment of APN profiles across accounts.',
    preconditions: 'User is on Subscriptions grid with "ALL" account context.',
    steps: '1. Navigate to Subscriptions -> SIM\n2. Select SIM records\n3. Click "Bulk Change - APN Group" on Action Toolbar\n4. Inspect APN Group dropdown selector',
    testData: 'Account Context: ALL | Action: Bulk APN Group',
    expectedResult: 'Bulk APN modal lists compatible APN groups for selected multi-account subscriptions.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/subscriptions/subscriptions.spec.ts -> [TC_SUB_ALL_004]',
    status: 'Automated & Passed',
    sheetTab: '03_Subscriptions_SIMs'
  },
  {
    id: 'TC_SUB_ALL_005',
    module: 'Subscriptions & SIMs',
    subModule: 'Action Toolbar (All Context)',
    title: 'Action Toolbar (Subscription Grid/View) - Bulk Change - Roaming Profile - All Context',
    objective: 'Verify "Bulk Change - Roaming Profile" toolbar option triggers roaming profile modification in ALL context.',
    preconditions: 'User is on Subscriptions grid with "ALL" account context.',
    steps: '1. Select target SIMs\n2. Click "Bulk Change - Roaming Profile"\n3. Verify Roaming Profile selection popup',
    testData: 'Account Context: ALL | Action: Bulk Roaming Profile',
    expectedResult: 'Roaming profile selection modal opens with global roaming configuration options.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/subscriptions/subscriptions.spec.ts -> [TC_SUB_ALL_005]',
    status: 'Automated & Passed',
    sheetTab: '03_Subscriptions_SIMs'
  },
  {
    id: 'TC_SUB_ALL_006',
    module: 'Subscriptions & SIMs',
    subModule: 'Action Toolbar (All Context)',
    title: 'Action Toolbar (Subscription Grid/View) - Bulk Change - Network Profile - All Context',
    objective: 'Verify "Bulk Change - Network Profile" modifies network routing parameters across subscriptions in ALL context.',
    preconditions: 'User is on Subscriptions grid with "ALL" account context.',
    steps: '1. Select SIMs\n2. Click "Bulk Change - Network Profile"\n3. Verify Network Profile modal display',
    testData: 'Account Context: ALL | Action: Bulk Network Profile',
    expectedResult: 'Network Profile change modal opens with carrier routing profile definitions.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/subscriptions/subscriptions.spec.ts -> [TC_SUB_ALL_006]',
    status: 'Automated & Passed',
    sheetTab: '03_Subscriptions_SIMs'
  },
  {
    id: 'TC_SUB_ALL_007',
    module: 'Subscriptions & SIMs',
    subModule: 'Action Toolbar (All Context)',
    title: 'Action Toolbar (Subscription Grid/View) - Bulk Change - Custom Fields - All Context',
    objective: 'Verify "Bulk Change - Custom Fields" allows batch metadata tagging across accounts in ALL context.',
    preconditions: 'User is on Subscriptions grid with "ALL" account context.',
    steps: '1. Select SIMs\n2. Click "Bulk Change - Custom Fields"\n3. Enter key-value custom field attributes',
    testData: 'Account Context: ALL | Action: Bulk Custom Fields',
    expectedResult: 'Custom fields editor modal displays configurable user-defined metadata fields.',
    testType: 'Functional',
    priority: 'Medium',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/subscriptions/subscriptions.spec.ts -> [TC_SUB_ALL_007]',
    status: 'Automated & Passed',
    sheetTab: '03_Subscriptions_SIMs'
  },
  {
    id: 'TC_SUB_ALL_008',
    module: 'Subscriptions & SIMs',
    subModule: 'Action Toolbar (All Context)',
    title: 'Action Toolbar (Subscription Grid/View) - Bulk Change - Rate Plan - All Context',
    objective: 'Verify "Bulk Change - Rate Plan" toolbar action updates billing tariffs for selected SIMs in ALL context.',
    preconditions: 'User is on Subscriptions grid with "ALL" account context.',
    steps: '1. Select SIMs\n2. Click "Bulk Change - Rate Plan"\n3. View rate plan selection list',
    testData: 'Account Context: ALL | Action: Bulk Rate Plan',
    expectedResult: 'Rate plan assignment wizard opens displaying valid rate plans matching accounts.',
    testType: 'Functional',
    priority: 'Critical',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/subscriptions/subscriptions.spec.ts -> [TC_SUB_ALL_008]',
    status: 'Automated & Passed',
    sheetTab: '03_Subscriptions_SIMs'
  },
  {
    id: 'TC_SUB_ALL_009',
    module: 'Subscriptions & SIMs',
    subModule: 'Action Toolbar (All Context)',
    title: 'Action Toolbar (Subscription Grid/View) - Bulk Change - Pairing - All Context',
    objective: 'Verify "Bulk Change - Pairing" enables batch IMEI-to-IMSI hardware lock binding in ALL context.',
    preconditions: 'User is on Subscriptions grid with "ALL" account context.',
    steps: '1. Select SIMs\n2. Click "Bulk Change - Pairing"\n3. Confirm IMEI/Device lock binding dialog',
    testData: 'Account Context: ALL | Action: Bulk Pairing',
    expectedResult: 'Pairing modal allows setting automatic or explicit IMEI hardware binding.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/subscriptions/subscriptions.spec.ts -> [TC_SUB_ALL_009]',
    status: 'Automated & Passed',
    sheetTab: '03_Subscriptions_SIMs'
  },
  {
    id: 'TC_SUB_ALL_010',
    module: 'Subscriptions & SIMs',
    subModule: 'Action Toolbar (All Context)',
    title: 'Action Toolbar (Subscription Grid/View) - Bulk Change - Unpairing - All Context',
    objective: 'Verify "Bulk Change - Unpairing" releases hardware lock across multiple SIM records in ALL context.',
    preconditions: 'User is on Subscriptions grid with "ALL" account context.',
    steps: '1. Select paired SIMs\n2. Click "Bulk Change - Unpairing"\n3. Confirm unpair action',
    testData: 'Account Context: ALL | Action: Bulk Unpairing',
    expectedResult: 'Unpairing modal prompts for confirmation to release IMEI lock constraints.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/subscriptions/subscriptions.spec.ts -> [TC_SUB_ALL_010]',
    status: 'Automated & Passed',
    sheetTab: '03_Subscriptions_SIMs'
  },
  {
    id: 'TC_SUB_ALL_011',
    module: 'Subscriptions & SIMs',
    subModule: 'Action Toolbar (All Context)',
    title: 'Action Toolbar (Subscription Grid/View) - Move SIM - All Context',
    objective: 'Verify "Move SIM" moves subscription ownership between customer accounts from ALL context.',
    preconditions: 'User is on Subscriptions grid with "ALL" account context.',
    steps: '1. Select SIMs\n2. Click "Move SIM" on toolbar\n3. Select target destination account\n4. Confirm relocation',
    testData: 'Account Context: ALL | Action: Move SIM',
    expectedResult: 'Move SIM drawer allows selecting target Account with validation of plan compatibility.',
    testType: 'Functional',
    priority: 'Critical',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/subscriptions/subscriptions.spec.ts -> [TC_SUB_ALL_011]',
    status: 'Automated & Passed',
    sheetTab: '03_Subscriptions_SIMs'
  },
  {
    id: 'TC_SUB_ALL_012',
    module: 'Subscriptions & SIMs',
    subModule: 'Action Toolbar (All Context)',
    title: 'Action Toolbar (Subscription Grid/View) - Bulk Tag Management - All Context',
    objective: 'Verify "Bulk Tag Management" associates/removes colored tag badges across SIMs in ALL context.',
    preconditions: 'User is on Subscriptions grid with "ALL" account context.',
    steps: '1. Select SIM records\n2. Click "Bulk Tag Management"\n3. Assign/unassign tags\n4. Save changes',
    testData: 'Account Context: ALL | Action: Bulk Tag Management',
    expectedResult: 'Tag Management dialog opens with checkboxes for all configured system tags.',
    testType: 'Functional',
    priority: 'Medium',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/subscriptions/subscriptions.spec.ts -> [TC_SUB_ALL_012]',
    status: 'Automated & Passed',
    sheetTab: '03_Subscriptions_SIMs'
  },
  {
    id: 'TC_SUB_ALL_013',
    module: 'Subscriptions & SIMs',
    subModule: 'Action Toolbar (All Context)',
    title: 'Action Toolbar (Subscription Grid/View) - Choose Columns - All Context',
    objective: 'Verify "Choose Columns" toolbar button customizes visible columns in ALL context view.',
    preconditions: 'User is on Subscriptions grid with "ALL" account context.',
    steps: '1. Click "Choose Columns" icon/button\n2. Toggle column visibility checkboxes\n3. Apply changes',
    testData: 'Account Context: ALL | Action: Choose Columns',
    expectedResult: 'Column chooser popover displays full attribute list and updates grid columns instantaneously.',
    testType: 'Functional',
    priority: 'Medium',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/subscriptions/subscriptions.spec.ts -> [TC_SUB_ALL_013]',
    status: 'Automated & Passed',
    sheetTab: '03_Subscriptions_SIMs'
  },
  {
    id: 'TC_SUB_ALL_014',
    module: 'Subscriptions & SIMs',
    subModule: 'Action Toolbar (All Context)',
    title: 'Action Toolbar (Subscription Grid/View) - Refresh - All Context',
    objective: 'Verify "Refresh" button reloads subscription grid records in ALL context without reloading browser.',
    preconditions: 'User is on Subscriptions grid with "ALL" account context.',
    steps: '1. Click "Refresh" on Action Toolbar\n2. Verify spinner triggers\n3. Verify grid data is refreshed',
    testData: 'Account Context: ALL | Action: Refresh',
    expectedResult: 'Grid displays loading indicator and successfully refreshes data for all accounts.',
    testType: 'Functional',
    priority: 'Low',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/subscriptions/subscriptions.spec.ts -> [TC_SUB_ALL_014]',
    status: 'Automated & Passed',
    sheetTab: '03_Subscriptions_SIMs'
  },
  {
    id: 'TC_SUB_ALL_015',
    module: 'Subscriptions & SIMs',
    subModule: 'Action Toolbar (All Context)',
    title: 'Action Toolbar (Subscription Grid/View) - Export Subscriptions - All Context',
    objective: 'Verify "Export Subscriptions" downloads comprehensive Excel/CSV dataset across all accounts in ALL context.',
    preconditions: 'User is on Subscriptions grid with "ALL" account context.',
    steps: '1. Click "Export Subscriptions" icon/button\n2. Select export format (Excel/CSV)\n3. Verify file generation',
    testData: 'Account Context: ALL | Action: Export Subscriptions',
    expectedResult: 'Export file contains all filtered subscription records across all tenant accounts.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/subscriptions/subscriptions.spec.ts -> [TC_SUB_ALL_015]',
    status: 'Automated & Passed',
    sheetTab: '03_Subscriptions_SIMs'
  },
  {
    id: 'TC_SUB_ALL_016',
    module: 'Subscriptions & SIMs',
    subModule: 'Action Toolbar (All Context)',
    title: 'Action Toolbar (Subscription Grid/View) - Bulk Cancel Location - All Context',
    objective: 'Verify "Bulk Cancel Location" sends HLR/HSS location cancel command to reset network registration in ALL context.',
    preconditions: 'User is on Subscriptions grid with "ALL" account context.',
    steps: '1. Select active SIMs\n2. Click "Bulk Cancel Location" on toolbar\n3. Confirm cancel location action',
    testData: 'Account Context: ALL | Action: Bulk Cancel Location',
    expectedResult: 'HLR Location cancellation modal opens, warning user of temporary network detachment before execution.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/subscriptions/subscriptions.spec.ts -> [TC_SUB_ALL_016]',
    status: 'Automated & Passed',
    sheetTab: '03_Subscriptions_SIMs'
  },

  // -------------------------------------------------------------------------
  // DOMAIN 3B: ACTION TOOLBAR (SUBSCRIPTION GRID/VIEW) - ACCOUNT CONTEXT (16 TCs)
  // -------------------------------------------------------------------------
  {
    id: 'TC_SUB_ACC_001',
    module: 'Subscriptions & SIMs',
    subModule: 'Action Toolbar (Account Context)',
    title: 'Action Toolbar (Subscription Grid/View) - Group Subscriptions - Account Context',
    objective: 'Verify "Group Subscriptions" toolbar action when a specific account is selected in top dropdown.',
    preconditions: 'User has selected a specific Account (e.g., "Demo Account") in top account context selector.',
    steps: '1. Select specific Account in header\n2. Navigate to Subscriptions -> SIM\n3. Select SIMs\n4. Click "Group Subscriptions"',
    testData: 'Account Context: Specific Account | Action: Group Subscriptions',
    expectedResult: 'Group Subscriptions modal displays scoped exclusively to groups within the selected account.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/subscriptions/subscriptions.spec.ts -> [TC_SUB_ACC_001]',
    status: 'Automated & Passed',
    sheetTab: '03_Subscriptions_SIMs'
  },
  {
    id: 'TC_SUB_ACC_002',
    module: 'Subscriptions & SIMs',
    subModule: 'Action Toolbar (Account Context)',
    title: 'Action Toolbar (Subscription Grid/View) - Send SMS - Account Context',
    objective: 'Verify "Send SMS" toolbar action scoped to selected Account context.',
    preconditions: 'User has selected a specific Account context.',
    steps: '1. Select specific Account\n2. Select SIM records\n3. Click "Send SMS" on Action Toolbar',
    testData: 'Account Context: Specific Account | Action: Send SMS',
    expectedResult: 'SMS drawer opens configured with account-level SMS routing configurations.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/subscriptions/subscriptions.spec.ts -> [TC_SUB_ACC_002]',
    status: 'Automated & Passed',
    sheetTab: '03_Subscriptions_SIMs'
  },
  {
    id: 'TC_SUB_ACC_003',
    module: 'Subscriptions & SIMs',
    subModule: 'Action Toolbar (Account Context)',
    title: 'Action Toolbar (Subscription Grid/View) - Bulk Change - SIM State - Account Context',
    objective: 'Verify "Bulk Change - SIM State" lifecycle transitions within specific Account boundary.',
    preconditions: 'User has selected a specific Account context.',
    steps: '1. Select specific Account\n2. Select SIMs\n3. Click "Bulk Change - SIM State"\n4. Choose new state and confirm',
    testData: 'Account Context: Specific Account | Action: Bulk SIM State',
    expectedResult: 'SIM state change modal opens with state transitions allowed by the account policy.',
    testType: 'Functional',
    priority: 'Critical',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/subscriptions/subscriptions.spec.ts -> [TC_SUB_ACC_003]',
    status: 'Automated & Passed',
    sheetTab: '03_Subscriptions_SIMs'
  },
  {
    id: 'TC_SUB_ACC_004',
    module: 'Subscriptions & SIMs',
    subModule: 'Action Toolbar (Account Context)',
    title: 'Action Toolbar (Subscription Grid/View) - Bulk Change - APN Group - Account Context',
    objective: 'Verify "Bulk Change - APN Group" displays APN profiles provisioned for the selected Account.',
    preconditions: 'User has selected a specific Account context.',
    steps: '1. Select specific Account\n2. Select SIMs\n3. Click "Bulk Change - APN Group"',
    testData: 'Account Context: Specific Account | Action: Bulk APN Group',
    expectedResult: 'APN selection dropdown shows only APN groups contracted for that specific account.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/subscriptions/subscriptions.spec.ts -> [TC_SUB_ACC_004]',
    status: 'Automated & Passed',
    sheetTab: '03_Subscriptions_SIMs'
  },
  {
    id: 'TC_SUB_ACC_005',
    module: 'Subscriptions & SIMs',
    subModule: 'Action Toolbar (Account Context)',
    title: 'Action Toolbar (Subscription Grid/View) - Bulk Change - Roaming Profile - Account Context',
    objective: 'Verify "Bulk Change - Roaming Profile" in specific Account context.',
    preconditions: 'User has selected a specific Account context.',
    steps: '1. Select specific Account\n2. Select SIMs\n3. Click "Bulk Change - Roaming Profile"',
    testData: 'Account Context: Specific Account | Action: Bulk Roaming Profile',
    expectedResult: 'Roaming profiles compatible with the active account are presented.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/subscriptions/subscriptions.spec.ts -> [TC_SUB_ACC_005]',
    status: 'Automated & Passed',
    sheetTab: '03_Subscriptions_SIMs'
  },
  {
    id: 'TC_SUB_ACC_006',
    module: 'Subscriptions & SIMs',
    subModule: 'Action Toolbar (Account Context)',
    title: 'Action Toolbar (Subscription Grid/View) - Bulk Change - Network Profile - Account Context',
    objective: 'Verify "Bulk Change - Network Profile" in specific Account context.',
    preconditions: 'User has selected a specific Account context.',
    steps: '1. Select specific Account\n2. Select SIMs\n3. Click "Bulk Change - Network Profile"',
    testData: 'Account Context: Specific Account | Action: Bulk Network Profile',
    expectedResult: 'Network profile dialog opens with account-specific network definitions.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/subscriptions/subscriptions.spec.ts -> [TC_SUB_ACC_006]',
    status: 'Automated & Passed',
    sheetTab: '03_Subscriptions_SIMs'
  },
  {
    id: 'TC_SUB_ACC_007',
    module: 'Subscriptions & SIMs',
    subModule: 'Action Toolbar (Account Context)',
    title: 'Action Toolbar (Subscription Grid/View) - Bulk Change - Custom Fields - Account Context',
    objective: 'Verify "Bulk Change - Custom Fields" updates custom attributes defined on the selected Account.',
    preconditions: 'User has selected a specific Account context.',
    steps: '1. Select specific Account\n2. Select SIMs\n3. Click "Bulk Change - Custom Fields"',
    testData: 'Account Context: Specific Account | Action: Bulk Custom Fields',
    expectedResult: 'Custom fields schema configured for the account is rendered for batch updates.',
    testType: 'Functional',
    priority: 'Medium',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/subscriptions/subscriptions.spec.ts -> [TC_SUB_ACC_007]',
    status: 'Automated & Passed',
    sheetTab: '03_Subscriptions_SIMs'
  },
  {
    id: 'TC_SUB_ACC_008',
    module: 'Subscriptions & SIMs',
    subModule: 'Action Toolbar (Account Context)',
    title: 'Action Toolbar (Subscription Grid/View) - Bulk Change - Rate Plan - Account Context',
    objective: 'Verify "Bulk Change - Rate Plan" filters tariff plans by the active Account.',
    preconditions: 'User has selected a specific Account context.',
    steps: '1. Select specific Account\n2. Select SIMs\n3. Click "Bulk Change - Rate Plan"',
    testData: 'Account Context: Specific Account | Action: Bulk Rate Plan',
    expectedResult: 'Rate Plan selection modal only displays contracted plans available to the account.',
    testType: 'Functional',
    priority: 'Critical',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/subscriptions/subscriptions.spec.ts -> [TC_SUB_ACC_008]',
    status: 'Automated & Passed',
    sheetTab: '03_Subscriptions_SIMs'
  },
  {
    id: 'TC_SUB_ACC_009',
    module: 'Subscriptions & SIMs',
    subModule: 'Action Toolbar (Account Context)',
    title: 'Action Toolbar (Subscription Grid/View) - Bulk Change - Pairing - Account Context',
    objective: 'Verify "Bulk Change - Pairing" in specific Account context.',
    preconditions: 'User has selected a specific Account context.',
    steps: '1. Select specific Account\n2. Select SIMs\n3. Click "Bulk Change - Pairing"',
    testData: 'Account Context: Specific Account | Action: Bulk Pairing',
    expectedResult: 'IMEI pairing dialog opens and validates device constraints within account scope.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/subscriptions/subscriptions.spec.ts -> [TC_SUB_ACC_009]',
    status: 'Automated & Passed',
    sheetTab: '03_Subscriptions_SIMs'
  },
  {
    id: 'TC_SUB_ACC_010',
    module: 'Subscriptions & SIMs',
    subModule: 'Action Toolbar (Account Context)',
    title: 'Action Toolbar (Subscription Grid/View) - Bulk Change - Unpairing - Account Context',
    objective: 'Verify "Bulk Change - Unpairing" in specific Account context.',
    preconditions: 'User has selected a specific Account context.',
    steps: '1. Select specific Account\n2. Select SIMs\n3. Click "Bulk Change - Unpairing"',
    testData: 'Account Context: Specific Account | Action: Bulk Unpairing',
    expectedResult: 'Unpairing dialog prompts for confirmation within the account context.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/subscriptions/subscriptions.spec.ts -> [TC_SUB_ACC_010]',
    status: 'Automated & Passed',
    sheetTab: '03_Subscriptions_SIMs'
  },
  {
    id: 'TC_SUB_ACC_011',
    module: 'Subscriptions & SIMs',
    subModule: 'Action Toolbar (Account Context)',
    title: 'Action Toolbar (Subscription Grid/View) - Move SIM - Account Context',
    objective: 'Verify "Move SIM" allows transferring SIMs out of the active Account to another destination account.',
    preconditions: 'User has selected a specific Account context.',
    steps: '1. Select specific Account\n2. Select SIMs\n3. Click "Move SIM"\n4. Choose target account',
    testData: 'Account Context: Specific Account | Action: Move SIM',
    expectedResult: 'Move SIM wizard opens with destination account search and eligibility checks.',
    testType: 'Functional',
    priority: 'Critical',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/subscriptions/subscriptions.spec.ts -> [TC_SUB_ACC_011]',
    status: 'Automated & Passed',
    sheetTab: '03_Subscriptions_SIMs'
  },
  {
    id: 'TC_SUB_ACC_012',
    module: 'Subscriptions & SIMs',
    subModule: 'Action Toolbar (Account Context)',
    title: 'Action Toolbar (Subscription Grid/View) - Bulk Tag Management - Account Context',
    objective: 'Verify "Bulk Tag Management" displays account-scoped tag badges.',
    preconditions: 'User has selected a specific Account context.',
    steps: '1. Select specific Account\n2. Select SIMs\n3. Click "Bulk Tag Management"',
    testData: 'Account Context: Specific Account | Action: Bulk Tag Management',
    expectedResult: 'Tag Management dialog opens with tags created within the selected account hierarchy.',
    testType: 'Functional',
    priority: 'Medium',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/subscriptions/subscriptions.spec.ts -> [TC_SUB_ACC_012]',
    status: 'Automated & Passed',
    sheetTab: '03_Subscriptions_SIMs'
  },
  {
    id: 'TC_SUB_ACC_013',
    module: 'Subscriptions & SIMs',
    subModule: 'Action Toolbar (Account Context)',
    title: 'Action Toolbar (Subscription Grid/View) - Choose Columns - Account Context',
    objective: 'Verify "Choose Columns" persists column preferences for the selected Account context.',
    preconditions: 'User has selected a specific Account context.',
    steps: '1. Select specific Account\n2. Click "Choose Columns"\n3. Modify column visibility',
    testData: 'Account Context: Specific Account | Action: Choose Columns',
    expectedResult: 'Column configuration popover opens and updates grid column view.',
    testType: 'Functional',
    priority: 'Medium',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/subscriptions/subscriptions.spec.ts -> [TC_SUB_ACC_013]',
    status: 'Automated & Passed',
    sheetTab: '03_Subscriptions_SIMs'
  },
  {
    id: 'TC_SUB_ACC_014',
    module: 'Subscriptions & SIMs',
    subModule: 'Action Toolbar (Account Context)',
    title: 'Action Toolbar (Subscription Grid/View) - Refresh - Account Context',
    objective: 'Verify "Refresh" button reloads subscription grid scoped to the active Account.',
    preconditions: 'User has selected a specific Account context.',
    steps: '1. Select specific Account\n2. Click "Refresh" on Action Toolbar',
    testData: 'Account Context: Specific Account | Action: Refresh',
    expectedResult: 'Grid data refreshes without losing selected account context.',
    testType: 'Functional',
    priority: 'Low',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/subscriptions/subscriptions.spec.ts -> [TC_SUB_ACC_014]',
    status: 'Automated & Passed',
    sheetTab: '03_Subscriptions_SIMs'
  },
  {
    id: 'TC_SUB_ACC_015',
    module: 'Subscriptions & SIMs',
    subModule: 'Action Toolbar (Account Context)',
    title: 'Action Toolbar (Subscription Grid/View) - Export Subscriptions - Account Context',
    objective: 'Verify "Export Subscriptions" downloads SIM dataset filtered specifically to the selected Account.',
    preconditions: 'User has selected a specific Account context.',
    steps: '1. Select specific Account\n2. Click "Export Subscriptions"\n3. Check downloaded file',
    testData: 'Account Context: Specific Account | Action: Export Subscriptions',
    expectedResult: 'Export file contains only SIM subscriptions belonging to the selected account.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/subscriptions/subscriptions.spec.ts -> [TC_SUB_ACC_015]',
    status: 'Automated & Passed',
    sheetTab: '03_Subscriptions_SIMs'
  },
  {
    id: 'TC_SUB_ACC_016',
    module: 'Subscriptions & SIMs',
    subModule: 'Action Toolbar (Account Context)',
    title: 'Action Toolbar (Subscription Grid/View) - Bulk Cancel Location - Account Context',
    objective: 'Verify "Bulk Cancel Location" sends HLR location cancel command in specific Account context.',
    preconditions: 'User has selected a specific Account context.',
    steps: '1. Select specific Account\n2. Select SIMs\n3. Click "Bulk Cancel Location"',
    testData: 'Account Context: Specific Account | Action: Bulk Cancel Location',
    expectedResult: 'HLR Location cancellation modal displays and executes for selected account SIMs.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/subscriptions/subscriptions.spec.ts -> [TC_SUB_ACC_016]',
    status: 'Automated & Passed',
    sheetTab: '03_Subscriptions_SIMs'
  },

  // -------------------------------------------------------------------------
  // DOMAIN 3C: SINGLE SIM OPERATIONS (15 TCs)
  // -------------------------------------------------------------------------
  {
    id: 'TC_SIM_OP_001',
    module: 'Subscriptions & SIMs',
    subModule: 'Single SIM Operations',
    title: 'Single SIM Operation - Tag Management',
    objective: 'Verify Single SIM row action menu item "Tag Management" opens tag association dialog for an individual SIM.',
    preconditions: 'User is on Subscriptions -> SIM table.',
    steps: '1. Locate target SIM row\n2. Click 3-dots row action menu\n3. Select "Tag Management"\n4. Assign/remove tag badges\n5. Save changes',
    testData: 'SIM: 8901410321111851072 | Operation: Tag Management',
    expectedResult: 'Tag Management dialog opens for single SIM and applies updated tag badges to row upon saving.',
    testType: 'Functional',
    priority: 'Medium',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/subscriptions/subscriptions.spec.ts -> [TC_SIM_OP_001]',
    status: 'Automated & Passed',
    sheetTab: '03_Subscriptions_SIMs'
  },
  {
    id: 'TC_SIM_OP_002',
    module: 'Subscriptions & SIMs',
    subModule: 'Single SIM Operations',
    title: 'Single SIM Operation - Change APN Group',
    objective: 'Verify Single SIM row action "Change APN Group" updates APN profile assignment for an individual subscription.',
    preconditions: 'User is on Subscriptions -> SIM table.',
    steps: '1. Click row action menu on a SIM record\n2. Click "Change APN Group"\n3. Select new APN Group\n4. Confirm change',
    testData: 'Operation: Change APN Group | APN: internet.iot.net',
    expectedResult: 'APN Group change drawer opens and updates SIM APN config upon submission.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/subscriptions/subscriptions.spec.ts -> [TC_SIM_OP_002]',
    status: 'Automated & Passed',
    sheetTab: '03_Subscriptions_SIMs'
  },
  {
    id: 'TC_SIM_OP_003',
    module: 'Subscriptions & SIMs',
    subModule: 'Single SIM Operations',
    title: 'Single SIM Operation - Change Rate Plan',
    objective: 'Verify Single SIM row action "Change Rate Plan" updates billing rate plan tariff for an individual SIM.',
    preconditions: 'User is on Subscriptions -> SIM table.',
    steps: '1. Click row action menu on SIM\n2. Click "Change Rate Plan"\n3. Select new tariff rate plan\n4. Confirm tariff update',
    testData: 'Operation: Change Rate Plan | Rate Plan: 50MB Global IoT',
    expectedResult: 'Rate plan change modal displays valid commercial tariffs and updates SIM billing plan.',
    testType: 'Functional',
    priority: 'Critical',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/subscriptions/subscriptions.spec.ts -> [TC_SIM_OP_003]',
    status: 'Automated & Passed',
    sheetTab: '03_Subscriptions_SIMs'
  },
  {
    id: 'TC_SIM_OP_004',
    module: 'Subscriptions & SIMs',
    subModule: 'Single SIM Operations',
    title: 'Single SIM Operation - Change Network Profile',
    objective: 'Verify Single SIM row action "Change Network Profile" configures carrier network profile attributes.',
    preconditions: 'User is on Subscriptions -> SIM table.',
    steps: '1. Click row action menu on SIM\n2. Click "Change Network Profile"\n3. Select network profile\n4. Save profile',
    testData: 'Operation: Change Network Profile',
    expectedResult: 'Network profile dialog opens with carrier routing profile options for the single SIM.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/subscriptions/subscriptions.spec.ts -> [TC_SIM_OP_004]',
    status: 'Automated & Passed',
    sheetTab: '03_Subscriptions_SIMs'
  },
  {
    id: 'TC_SIM_OP_005',
    module: 'Subscriptions & SIMs',
    subModule: 'Single SIM Operations',
    title: 'Single SIM Operation - Change Roaming Profile',
    objective: 'Verify Single SIM row action "Change Roaming Profile" manages international roaming steering parameters.',
    preconditions: 'User is on Subscriptions -> SIM table.',
    steps: '1. Click row action menu on SIM\n2. Click "Change Roaming Profile"\n3. Select target roaming zone profile\n4. Submit',
    testData: 'Operation: Change Roaming Profile',
    expectedResult: 'Roaming profile selection modal opens and saves roaming policy for the individual SIM.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/subscriptions/subscriptions.spec.ts -> [TC_SIM_OP_005]',
    status: 'Automated & Passed',
    sheetTab: '03_Subscriptions_SIMs'
  },
  {
    id: 'TC_SIM_OP_006',
    module: 'Subscriptions & SIMs',
    subModule: 'Single SIM Operations',
    title: 'Single SIM Operation - CDR History',
    objective: 'Verify Single SIM row action "CDR History" navigates to granular Call Detail Records for that specific SIM.',
    preconditions: 'User is on Subscriptions -> SIM table.',
    steps: '1. Click row action menu on SIM\n2. Click "CDR History"\n3. Verify navigation to CDR drilldown view with ICCID filter applied',
    testData: 'Operation: CDR History',
    expectedResult: 'Portal opens CDR History view filtered to the selected SIM with session timestamps and data usage.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/subscriptions/subscriptions.spec.ts -> [TC_SIM_OP_006]',
    status: 'Automated & Passed',
    sheetTab: '03_Subscriptions_SIMs'
  },
  {
    id: 'TC_SIM_OP_007',
    module: 'Subscriptions & SIMs',
    subModule: 'Single SIM Operations',
    title: 'Single SIM Operation - Group Subscriptions',
    objective: 'Verify Single SIM row action "Group Subscriptions" manages group membership for an individual subscription.',
    preconditions: 'User is on Subscriptions -> SIM table.',
    steps: '1. Click row action menu on SIM\n2. Click "Group Subscriptions"\n3. Add SIM to specific Subscription Group\n4. Save',
    testData: 'Operation: Group Subscriptions',
    expectedResult: 'Group Subscriptions modal displays existing groups and updates single SIM group linkage.',
    testType: 'Functional',
    priority: 'Medium',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/subscriptions/subscriptions.spec.ts -> [TC_SIM_OP_007]',
    status: 'Automated & Passed',
    sheetTab: '03_Subscriptions_SIMs'
  },
  {
    id: 'TC_SIM_OP_008',
    module: 'Subscriptions & SIMs',
    subModule: 'Single SIM Operations',
    title: 'Single SIM Operation - SIM Lifecycle - Trial',
    objective: 'Verify Single SIM row action initiates lifecycle transition to "Trial" state.',
    preconditions: 'User is on Subscriptions -> SIM table with eligible test SIM.',
    steps: '1. Click row action menu on SIM\n2. Select "SIM Lifecycle -> Trial"\n3. Confirm trial activation parameters',
    testData: 'Operation: SIM Lifecycle -> Trial',
    expectedResult: 'Trial confirmation dialog opens and sets SIM lifecycle state to Trial with trial data quota.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/subscriptions/subscriptions.spec.ts -> [TC_SIM_OP_008]',
    status: 'Automated & Passed',
    sheetTab: '03_Subscriptions_SIMs'
  },
  {
    id: 'TC_SIM_OP_009',
    module: 'Subscriptions & SIMs',
    subModule: 'Single SIM Operations',
    title: 'Single SIM Operation - SIM Lifecycle - Active',
    objective: 'Verify Single SIM row action initiates lifecycle transition to "Active" state.',
    preconditions: 'User is on Subscriptions -> SIM table.',
    steps: '1. Click row action menu on SIM\n2. Select "SIM Lifecycle -> Active" (or "Activate")\n3. Confirm activation',
    testData: 'Operation: SIM Lifecycle -> Active',
    expectedResult: 'Activation modal opens and triggers network provisioning to transition SIM to Active.',
    testType: 'Functional',
    priority: 'Critical',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/subscriptions/subscriptions.spec.ts -> [TC_SIM_OP_009]',
    status: 'Automated & Passed',
    sheetTab: '03_Subscriptions_SIMs'
  },
  {
    id: 'TC_SIM_OP_010',
    module: 'Subscriptions & SIMs',
    subModule: 'Single SIM Operations',
    title: 'Single SIM Operation - SIM Lifecycle - Suspend',
    objective: 'Verify Single SIM row action initiates lifecycle transition to "Suspend" state.',
    preconditions: 'User is on Subscriptions -> SIM table with an Active SIM.',
    steps: '1. Click row action menu on Active SIM\n2. Select "SIM Lifecycle -> Suspend"\n3. Confirm temporary suspension',
    testData: 'Operation: SIM Lifecycle -> Suspend',
    expectedResult: 'Suspend confirmation dialog displays and halts data/SMS traffic for the SIM.',
    testType: 'Functional',
    priority: 'Critical',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/subscriptions/subscriptions.spec.ts -> [TC_SIM_OP_010]',
    status: 'Automated & Passed',
    sheetTab: '03_Subscriptions_SIMs'
  },
  {
    id: 'TC_SIM_OP_011',
    module: 'Subscriptions & SIMs',
    subModule: 'Single SIM Operations',
    title: 'Single SIM Operation - SIM Lifecycle - Reactivate',
    objective: 'Verify Single SIM row action initiates lifecycle transition from Suspended to "Reactivate".',
    preconditions: 'User is on Subscriptions -> SIM table with a Suspended SIM.',
    steps: '1. Click row action menu on Suspended SIM\n2. Select "SIM Lifecycle -> Reactivate"\n3. Confirm reactivation',
    testData: 'Operation: SIM Lifecycle -> Reactivate',
    expectedResult: 'Reactivation dialog opens and restores network service for the subscription.',
    testType: 'Functional',
    priority: 'Critical',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/subscriptions/subscriptions.spec.ts -> [TC_SIM_OP_011]',
    status: 'Automated & Passed',
    sheetTab: '03_Subscriptions_SIMs'
  },
  {
    id: 'TC_SIM_OP_012',
    module: 'Subscriptions & SIMs',
    subModule: 'Single SIM Operations',
    title: 'Single SIM Operation - SIM Lifecycle - Deactivate',
    objective: 'Verify Single SIM row action initiates lifecycle transition to "Deactivate" state.',
    preconditions: 'User is on Subscriptions -> SIM table.',
    steps: '1. Click row action menu on SIM\n2. Select "SIM Lifecycle -> Deactivate"\n3. Confirm deactivation guardrail',
    testData: 'Operation: SIM Lifecycle -> Deactivate',
    expectedResult: 'Deactivation confirmation modal opens, warning of billing stop and traffic detachment.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/subscriptions/subscriptions.spec.ts -> [TC_SIM_OP_012]',
    status: 'Automated & Passed',
    sheetTab: '03_Subscriptions_SIMs'
  },
  {
    id: 'TC_SIM_OP_013',
    module: 'Subscriptions & SIMs',
    subModule: 'Single SIM Operations',
    title: 'Single SIM Operation - SIM Lifecycle - Retire',
    objective: 'Verify Single SIM row action initiates permanent lifecycle transition to "Retire".',
    preconditions: 'User is on Subscriptions -> SIM table with Deactivated SIM.',
    steps: '1. Click row action menu on SIM\n2. Select "SIM Lifecycle -> Retire"\n3. Review irreversible retirement warning\n4. Confirm',
    testData: 'Operation: SIM Lifecycle -> Retire',
    expectedResult: 'Retirement guardrail modal requires explicit confirmation before permanently retiring the SIM.',
    testType: 'Functional',
    priority: 'Critical',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/subscriptions/subscriptions.spec.ts -> [TC_SIM_OP_013]',
    status: 'Automated & Passed',
    sheetTab: '03_Subscriptions_SIMs'
  },
  {
    id: 'TC_SIM_OP_014',
    module: 'Subscriptions & SIMs',
    subModule: 'Single SIM Operations',
    title: 'Single SIM Operation - Pairing',
    objective: 'Verify Single SIM row action "Pairing" binds the SIM card to a specific device IMEI number.',
    preconditions: 'User is on Subscriptions -> SIM table.',
    steps: '1. Click row action menu on SIM\n2. Click "Pairing"\n3. Enter target IMEI / device identifier\n4. Submit pairing request',
    testData: 'Operation: Pairing | IMEI: 867530901234567',
    expectedResult: 'IMEI pairing dialog opens and saves hardware lock association for the single SIM.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/subscriptions/subscriptions.spec.ts -> [TC_SIM_OP_014]',
    status: 'Automated & Passed',
    sheetTab: '03_Subscriptions_SIMs'
  },
  {
    id: 'TC_SIM_OP_015',
    module: 'Subscriptions & SIMs',
    subModule: 'Single SIM Operations',
    title: 'Single SIM Operation - Unpairing',
    objective: 'Verify Single SIM row action "Unpairing" unbinds the hardware IMEI lock constraint.',
    preconditions: 'User is on Subscriptions -> SIM table with a paired SIM.',
    steps: '1. Click row action menu on paired SIM\n2. Click "Unpairing"\n3. Confirm unpair request',
    testData: 'Operation: Unpairing',
    expectedResult: 'Unpairing modal prompts for confirmation and clears IMEI lock upon submission.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/subscriptions/subscriptions.spec.ts -> [TC_SIM_OP_015]',
    status: 'Automated & Passed',
    sheetTab: '03_Subscriptions_SIMs'
  },

  // ==========================================
  // DOMAIN 4: ACCOUNTS & LIFECYCLE MANAGEMENT (22 TCs)
  // ==========================================
  {
    id: 'TC_ACC_001',
    module: 'Accounts & Lifecycle',
    subModule: 'Navigation Menu',
    title: 'Verify Accounts menu dropdown sections (Accounts, Sales)',
    objective: 'Ensure Accounts menu displays all sub-items (Accounts, Custom fields, Sales Agents, Sales Agents Assignment).',
    preconditions: 'User is authenticated.',
    steps: '1. Click "Accounts" menu in top navbar\n2. Verify section "Accounts": Accounts, Custom fields\n3. Verify section "Sales": Sales Agents, Sales Agents Assignment',
    testData: 'Menu: Accounts',
    expectedResult: 'Dropdown displays all 4 sub-items categorized under Accounts and Sales headers.',
    testType: 'Smoke',
    priority: 'Critical',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/accounts/accounts.spec.ts -> [TC_ACC_001]',
    status: 'Automated & Passed',
    sheetTab: '04_Accounts_Lifecycle'
  },
  {
    id: 'TC_ACC_002',
    module: 'Accounts & Lifecycle',
    subModule: 'Accounts Directory',
    title: 'Verify Accounts table grid, column headers, and action controls',
    objective: 'Confirm Accounts listing table renders with required enterprise columns.',
    preconditions: 'User is on Accounts page.',
    steps: '1. Navigate to Accounts -> Accounts\n2. Inspect table headers: Main Account, Account ID, Ext ID, Status, Category, Contact\n3. Verify "+ ACCOUNT" button and Export button',
    testData: 'URL: /accounts',
    expectedResult: 'Table renders headers, action buttons (+ ACCOUNT, Export, Visibility), and pagination.',
    testType: 'Smoke',
    priority: 'Critical',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/accounts/accounts.spec.ts -> [TC_ACC_002]',
    status: 'Automated & Passed',
    sheetTab: '04_Accounts_Lifecycle'
  },
  {
    id: 'TC_ACC_003',
    module: 'Accounts & Lifecycle',
    subModule: 'Search & Filtering',
    title: 'Verify Accounts search input and column filter interaction',
    objective: 'Confirm accounts table supports keyword search and column-level filters (Main Account, Status, Category).',
    preconditions: 'User is on Accounts page.',
    steps: '1. Type search query in global search box\n2. Press Enter\n3. Type keyword in "Main Account" column filter\n4. Select status "ACTIVATED" from status filter dropdown',
    testData: 'Search: "Nokia_Demo" | Status: "ACTIVATED"',
    expectedResult: 'Table filters matching accounts dynamically; rows reflect active filters.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/accounts/accounts.spec.ts -> [TC_ACC_003]',
    status: 'Automated & Passed',
    sheetTab: '04_Accounts_Lifecycle'
  },
  {
    id: 'TC_ACC_004',
    module: 'Accounts & Lifecycle',
    subModule: 'Export Feature',
    title: 'Verify Accounts data export to Excel / CSV format',
    objective: 'Confirm exporting accounts list downloads complete data file.',
    preconditions: 'User is on Accounts table.',
    steps: '1. Click Export icon button\n2. Choose export format\n3. Verify download initiates',
    testData: 'Export file: accounts_list.xlsx',
    expectedResult: 'File downloads successfully with all visible account fields and metadata.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/accounts/accounts.spec.ts -> [TC_ACC_004]',
    status: 'Automated & Passed',
    sheetTab: '04_Accounts_Lifecycle'
  },
  {
    id: 'TC_ACC_005',
    module: 'Accounts & Lifecycle',
    subModule: 'Account Creation Wizard',
    title: 'Verify "+ ACCOUNT" button opens 5-step Creation Stepper Modal',
    objective: 'Confirm clicking "+ ACCOUNT" launches the multi-step account creation wizard dialog.',
    preconditions: 'User is on Accounts page.',
    steps: '1. Click "+ ACCOUNT" button\n2. Verify dialog overlay opens\n3. Verify 5 stepper stages: Basic Info, Billing Profile, Auto State Transition, Contacts, Address',
    testData: 'Modal dialog',
    expectedResult: 'Create Account dialog is visible with stepper headers and active Step 1 form.',
    testType: 'Smoke',
    priority: 'Critical',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/accounts/accounts.spec.ts -> [TC_ACC_005]',
    status: 'Automated & Passed',
    sheetTab: '04_Accounts_Lifecycle'
  },
  {
    id: 'TC_ACC_006',
    module: 'Accounts & Lifecycle',
    subModule: 'Wizard Step 1',
    title: 'Step 1: Fill Basic Information (Name, DEMO type, ENTERPRISE-INVENTORY, Description)',
    objective: 'Validate completing Step 1 form with valid account attributes.',
    preconditions: 'Wizard Step 1 is active.',
    steps: '1. Enter Account Name "Auto_Demo_Acc_101"\n2. Select Account Type "DEMO"\n3. Select Initial State "ENTERPRISE-INVENTORY"\n4. Enter Description "Automated test account"\n5. Click NEXT',
    testData: 'Name: Auto_Demo_Acc_101 | Type: DEMO | State: ENTERPRISE-INVENTORY',
    expectedResult: 'Step 1 validates successfully and advances to Step 2 (Billing Profile).',
    testType: 'Functional',
    priority: 'Critical',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/accounts/accounts.spec.ts -> [TC_ACC_006]',
    status: 'Automated & Passed',
    sheetTab: '04_Accounts_Lifecycle'
  },
  {
    id: 'TC_ACC_007',
    module: 'Accounts & Lifecycle',
    subModule: 'Wizard Validation',
    title: 'Step 1: Validate error handling on empty submit and duplicate Account Name',
    objective: 'Confirm validation errors prevent advancing with invalid or empty account names.',
    preconditions: 'Wizard Step 1 is active.',
    steps: '1. Leave Account Name blank\n2. Click NEXT\n3. Verify required error alert\n4. Enter existing duplicate name and click NEXT',
    testData: 'Empty name and Duplicate name',
    expectedResult: 'Error alert "Account name is required" / "Account name already exists" displays; wizard does not advance.',
    testType: 'Boundary',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/accounts/accounts.spec.ts -> [TC_ACC_007]',
    status: 'Automated & Passed',
    sheetTab: '04_Accounts_Lifecycle'
  },
  {
    id: 'TC_ACC_008',
    module: 'Accounts & Lifecycle',
    subModule: 'Wizard Step 2',
    title: 'Step 2: Configure Billing Profile (Currency, Billing Cycle, Invoice delivery method)',
    objective: 'Validate setting financial and billing parameters for the new account.',
    preconditions: 'Wizard Step 2 is active.',
    steps: '1. Select Currency (EUR / USD)\n2. Select Billing Cycle (Monthly - 1st of month)\n3. Select Invoicing Method (Email / Portal feed)\n4. Click NEXT or SKIP for demo account',
    testData: 'Currency: EUR | Cycle: Monthly',
    expectedResult: 'Billing preferences are saved or skipped appropriately; wizard proceeds to Step 3.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/accounts/accounts.spec.ts -> [TC_ACC_008]',
    status: 'Automated & Passed',
    sheetTab: '04_Accounts_Lifecycle'
  },
  {
    id: 'TC_ACC_009',
    module: 'Accounts & Lifecycle',
    subModule: 'Wizard Step 3',
    title: 'Step 3: Configure Auto State Transition rules for automated account lifecycle',
    objective: 'Validate configuring automatic state transition thresholds based on inactivity or credit limits.',
    preconditions: 'Wizard Step 3 is active.',
    steps: '1. Inspect Auto Transition toggle\n2. Set threshold trigger rule (e.g. Inactive > 90 days -> Suspend)\n3. Click NEXT',
    testData: 'Auto-transition rule',
    expectedResult: 'Transition rules are configured; wizard advances to Step 4 (Contacts).',
    testType: 'Functional',
    priority: 'Medium',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/accounts/accounts.spec.ts -> [TC_ACC_009]',
    status: 'Automated & Passed',
    sheetTab: '04_Accounts_Lifecycle'
  },
  {
    id: 'TC_ACC_010',
    module: 'Accounts & Lifecycle',
    subModule: 'Wizard Step 4',
    title: 'Step 4: Fill Contacts (Primary, Shipping, Billing, Technical Support)',
    objective: 'Validate capturing multi-contact information for the enterprise account.',
    preconditions: 'Wizard Step 4 is active.',
    steps: '1. Enter Primary Contact: First Name "Vetrivel", Last Name "Manager", Email "vetrivel.demo@nokia.com", Phone "+358401234567"\n2. Fill optional Shipping/Billing/Tech contacts\n3. Click NEXT',
    testData: 'Contact: Vetrivel Manager | vetrivel.demo@nokia.com | +358401234567',
    expectedResult: 'Contacts are validated and stored; wizard advances to Step 5 (Address).',
    testType: 'Functional',
    priority: 'Critical',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/accounts/accounts.spec.ts -> [TC_ACC_010]',
    status: 'Automated & Passed',
    sheetTab: '04_Accounts_Lifecycle'
  },
  {
    id: 'TC_ACC_011',
    module: 'Accounts & Lifecycle',
    subModule: 'Wizard Validation',
    title: 'Step 4: Validate email format and phone number validation in Contacts',
    objective: 'Confirm malformed email addresses (e.g. missing @ or domain) trigger inline error feedback.',
    preconditions: 'Wizard Step 4 is active.',
    steps: '1. Enter invalid email "invalid-email-no-at"\n2. Click NEXT\n3. Verify inline error banner',
    testData: 'Email: invalid-email-no-at',
    expectedResult: 'System displays "Please enter a valid email address"; submission blocked.',
    testType: 'Boundary',
    priority: 'Medium',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/accounts/accounts.spec.ts -> [TC_ACC_011]',
    status: 'Automated & Passed',
    sheetTab: '04_Accounts_Lifecycle'
  },
  {
    id: 'TC_ACC_012',
    module: 'Accounts & Lifecycle',
    subModule: 'Wizard Step 5',
    title: 'Step 5: Fill Primary Address (Street, City, State, Country, Postal Code) and Submit Account',
    objective: 'Validate capturing location details and finalizing account creation.',
    preconditions: 'Wizard Step 5 is active.',
    steps: '1. Enter Street "Karakaari 7"\n2. Enter City "Espoo"\n3. Enter State "Uusimaa"\n4. Select Country "Finland"\n5. Enter Postal Code "02610"\n6. Click CREATE / SUBMIT button',
    testData: 'Address: Karakaari 7, Espoo, Uusimaa, Finland 02610',
    expectedResult: 'Submission succeeds; modal closes; success toast notification "Account created successfully" displays.',
    testType: 'Functional',
    priority: 'Critical',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/accounts/accounts.spec.ts -> [TC_ACC_012]',
    status: 'Automated & Passed',
    sheetTab: '04_Accounts_Lifecycle'
  },
  {
    id: 'TC_ACC_013',
    module: 'Accounts & Lifecycle',
    subModule: 'Account Verification',
    title: 'Verify newly created account appears in Accounts table with ENTERPRISE-INVENTORY status',
    objective: 'Ensure created account is immediately queryable in the accounts directory.',
    preconditions: 'Account was submitted via wizard.',
    steps: '1. Search for created account name in Accounts table\n2. Verify row exists\n3. Verify Category = "DEMO"\n4. Verify Status = "ENTERPRISE-INVENTORY"',
    testData: 'Account Name: Auto_Demo_Acc_101',
    expectedResult: 'Account row is visible with correct name, DEMO category, and initial inventory state.',
    testType: 'Functional',
    priority: 'Critical',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/accounts/accounts.spec.ts -> [TC_ACC_013]',
    status: 'Automated & Passed',
    sheetTab: '04_Accounts_Lifecycle'
  },
  {
    id: 'TC_ACC_014',
    module: 'Accounts & Lifecycle',
    subModule: 'Account 360 View',
    title: 'Open Account Details 360 view and verify Header, Status Badge, and Navigation Tabs',
    objective: 'Confirm clicking account name opens the detailed Account 360 management dashboard.',
    preconditions: 'Account is visible in table.',
    steps: '1. Click account name link\n2. Verify Account Name heading and Status badge\n3. Verify sub-tabs: Roles, APN, APN Group, Network Profile, Rate Plan, Roaming Profile, CCS Offer, Numbering Plan',
    testData: 'Account 360 view',
    expectedResult: 'Account 360 view loads; header shows name and status badge; all 8 configuration tabs are present.',
    testType: 'Smoke',
    priority: 'Critical',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/accounts/accounts.spec.ts -> [TC_ACC_014]',
    status: 'Automated & Passed',
    sheetTab: '04_Accounts_Lifecycle'
  },
  {
    id: 'TC_ACC_015',
    module: 'Accounts & Lifecycle',
    subModule: 'Account Configuration',
    title: 'Account 360 - Roles Tab: Assign Account Admin Role to designated user',
    objective: 'Validate assigning administrative role to target user on the account.',
    preconditions: 'Account Details page is open.',
    steps: '1. Click "Roles" tab\n2. Click "ASSIGN ROLE" button\n3. Select role "Account Admin"\n4. Click Save / Assign',
    testData: 'Role: Account Admin',
    expectedResult: 'Account Admin role is assigned and listed in active account roles table.',
    testType: 'Functional',
    priority: 'Critical',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/accounts/account_lifecycle.spec.ts -> [TC_ACC_015]',
    status: 'Automated & Passed',
    sheetTab: '04_Accounts_Lifecycle'
  },
  {
    id: 'TC_ACC_016',
    module: 'Accounts & Lifecycle',
    subModule: 'Account Configuration',
    title: 'Account 360 - APN/DNN Tab: Assign APN to account',
    objective: 'Validate binding an Access Point Name (APN/DNN) to the account.',
    preconditions: 'Account Details page is open.',
    steps: '1. Click "APN/DNN" tab\n2. Click "ASSIGN APN" button\n3. Select APN from dropdown (e.g. "Default_APN" / "internet")\n4. Click Save',
    testData: 'APN: Default_APN',
    expectedResult: 'APN is associated with account and displayed in the APN table.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/accounts/account_lifecycle.spec.ts -> [TC_ACC_016]',
    status: 'Automated & Passed',
    sheetTab: '04_Accounts_Lifecycle'
  },
  {
    id: 'TC_ACC_017',
    module: 'Accounts & Lifecycle',
    subModule: 'Account Configuration',
    title: 'Account 360 - APN Group Tab: Create APN Group and set as Default APN Group',
    objective: 'Validate creating an APN Group and designating it as default for SIM provisioning.',
    preconditions: 'Account Details page is open.',
    steps: '1. Click "APN Group" tab\n2. Click "CREATE APN GROUP"\n3. Enter Group Name "Default_APN_Group"\n4. Check "Set as Default" checkbox\n5. Save group',
    testData: 'Group Name: Default_APN_Group | Default: true',
    expectedResult: 'APN group is created with Default badge enabled.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/accounts/account_lifecycle.spec.ts -> [TC_ACC_017]',
    status: 'Automated & Passed',
    sheetTab: '04_Accounts_Lifecycle'
  },
  {
    id: 'TC_ACC_018',
    module: 'Accounts & Lifecycle',
    subModule: 'Account Configuration',
    title: 'Account 360 - Network Profile Tab: Assign Default Network Profile',
    objective: 'Validate assigning a network profile with default flag for the account.',
    preconditions: 'Account Details page is open.',
    steps: '1. Click "Network Profile" tab\n2. Click "ASSIGN NETWORK PROFILE"\n3. Select profile "Default_Network_Profile"\n4. Check "Default"\n5. Click Save',
    testData: 'Profile: Default_Network_Profile | Default: true',
    expectedResult: 'Network Profile is assigned and marked as default.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/accounts/account_lifecycle.spec.ts -> [TC_ACC_018]',
    status: 'Automated & Passed',
    sheetTab: '04_Accounts_Lifecycle'
  },
  {
    id: 'TC_ACC_019',
    module: 'Accounts & Lifecycle',
    subModule: 'Account Configuration',
    title: 'Account 360 - Rate Plan Tab: Assign Default Rate Plan',
    objective: 'Validate assigning tariff rate plan with default flag for SIM activations.',
    preconditions: 'Account Details page is open.',
    steps: '1. Click "Rate Plan" tab\n2. Click "ASSIGN RATE PLAN"\n3. Select rate plan "Default_Rate_Plan"\n4. Check "Default"\n5. Click Save',
    testData: 'Rate Plan: Default_Rate_Plan | Default: true',
    expectedResult: 'Rate plan is mapped to account with default status badge.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/accounts/account_lifecycle.spec.ts -> [TC_ACC_019]',
    status: 'Automated & Passed',
    sheetTab: '04_Accounts_Lifecycle'
  },
  {
    id: 'TC_ACC_020',
    module: 'Accounts & Lifecycle',
    subModule: 'Account Configuration',
    title: 'Account 360 - Roaming Profile Tab: Assign Default Roaming Profile',
    objective: 'Validate assigning roaming steering profile to account.',
    preconditions: 'Account Details page is open.',
    steps: '1. Click "Roaming Profile" tab\n2. Click "ASSIGN ROAMING PROFILE"\n3. Select profile "Default_Roaming_Profile"\n4. Check "Default"\n5. Click Save',
    testData: 'Roaming Profile: Default_Roaming_Profile | Default: true',
    expectedResult: 'Roaming profile is assigned with Default flag.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/accounts/account_lifecycle.spec.ts -> [TC_ACC_020]',
    status: 'Automated & Passed',
    sheetTab: '04_Accounts_Lifecycle'
  },
  {
    id: 'TC_ACC_021',
    module: 'Accounts & Lifecycle',
    subModule: 'Account Configuration',
    title: 'Account 360 - CCS Offer ID & Numbering Plan Tabs: Assign Default CCS Offer and Numbering Plan',
    objective: 'Validate assigning CCS Offer ID and Numbering Plan required for account activation readiness.',
    preconditions: 'Account Details page is open.',
    steps: '1. Click "CCS Offer" tab and assign Default CCS Offer\n2. Click "Numbering Plan" tab and assign Default Numbering Plan\n3. Confirm both configurations are active',
    testData: 'CCS Offer: Default_CCS_Offer | Numbering Plan: Default_Numbering_Plan',
    expectedResult: 'Both items are configured and saved successfully.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/accounts/account_lifecycle.spec.ts -> [TC_ACC_021]',
    status: 'Automated & Passed',
    sheetTab: '04_Accounts_Lifecycle'
  },
  {
    id: 'TC_ACC_022',
    module: 'Accounts & Lifecycle',
    subModule: 'Account Activation Flow',
    title: 'Account 360 - Account Activation E2E: Trigger "ACTIVATE" action and verify status transition to ACTIVATED',
    objective: 'Validate full account lifecycle transition from Inventory to fully operational Activated status.',
    preconditions: 'All prerequisites (Roles, APN, Network, Rate Plan, Roaming, CCS, Numbering) configured.',
    steps: '1. Click "Actions" dropdown in Account Header\n2. Click "ACTIVATE"\n3. Confirm activation dialog by clicking CONFIRM / PROCEED\n4. Wait for status badge to update',
    testData: 'Action: ACTIVATE ACCOUNT',
    expectedResult: 'Account status updates to "ACTIVATED"; state badge turns green; account is ready for active SIM ordering and billing.',
    testType: 'E2E',
    priority: 'Critical',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/accounts/account_lifecycle.spec.ts -> [TC_ACC_022]',
    status: 'Automated & Passed',
    sheetTab: '04_Accounts_Lifecycle'
  },

  // ==========================================
  // DOMAIN 5: RESOURCES & NETWORK CONFIGURATION (18 TCs)
  // ==========================================
  {
    id: 'TC_RES_001',
    module: 'Resources & Network',
    subModule: 'Navigation Menu',
    title: 'Verify Resources menu hierarchy (APN/DNN, QoS, Network Profile, SIM/eSIM Inventory, IP Pools, Roaming, Slice)',
    objective: 'Ensure Resources top menu expands and displays all network configuration items.',
    preconditions: 'User is authenticated.',
    steps: '1. Click "Resources" in top navigation bar\n2. Inspect Resources section: APN/DNN, QoS, Network Profile, SIM Inventory, eSIM Inventory, IP Pools, Roaming Profile\n3. Inspect 5G Resource section: Slice',
    testData: 'Menu: Resources',
    expectedResult: 'All 8 submenu links are visible, correctly labeled, and clickable.',
    testType: 'Smoke',
    priority: 'Critical',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/resources/resources.spec.ts -> [TC_RES_001]',
    status: 'Automated & Passed',
    sheetTab: '05_Resources_Network'
  },
  {
    id: 'TC_RES_002',
    module: 'Resources & Network',
    subModule: 'APN / DNN',
    title: 'Verify APN/DNN configuration table layout, columns, and search control',
    objective: 'Confirm APN/DNN page renders the access point configuration grid.',
    preconditions: 'User navigates to Resources -> APN/DNN.',
    steps: '1. Navigate to /resources/apn\n2. Verify page title "APN/DNN"\n3. Inspect table columns: APN Name, IP Type, Primary DNS, Secondary DNS, Status\n4. Verify Search input and Create button',
    testData: 'URL: /resources/apn',
    expectedResult: 'Table renders with proper headers and action controls.',
    testType: 'Smoke',
    priority: 'Critical',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/resources/resources.spec.ts -> [TC_RES_002]',
    status: 'Automated & Passed',
    sheetTab: '05_Resources_Network'
  },
  {
    id: 'TC_RES_003',
    module: 'Resources & Network',
    subModule: 'APN / DNN',
    title: 'Verify Create APN/DNN modal and field validation (APN Name, IPv4/IPv6, DNS)',
    objective: 'Validate creating a new APN definition.',
    preconditions: 'User is on APN/DNN page.',
    steps: '1. Click "+ CREATE APN" button\n2. Enter APN Name "iot.enterprise.nokiawing.com"\n3. Select IP Protocol "IPv4/IPv6 Dual Stack"\n4. Enter Primary DNS "8.8.8.8"\n5. Enter Secondary DNS "8.8.4.4"\n6. Click Save',
    testData: 'APN: iot.enterprise.nokiawing.com | IPv4/IPv6 | DNS: 8.8.8.8',
    expectedResult: 'New APN is saved and appears in the APN configuration list.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/resources/resources.spec.ts -> [TC_RES_003]',
    status: 'Automated & Passed',
    sheetTab: '05_Resources_Network'
  },
  {
    id: 'TC_RES_004',
    module: 'Resources & Network',
    subModule: 'APN / DNN',
    title: 'Verify instant search filter in APN/DNN configuration table',
    objective: 'Confirm searching APNs by keyword filters the grid in real-time.',
    preconditions: 'User is on APN/DNN page.',
    steps: '1. Type "internet" in search input\n2. Observe grid results\n3. Clear search and type "iot"',
    testData: 'Query: "internet", "iot"',
    expectedResult: 'Grid filters instantly showing only APNs matching query.',
    testType: 'Functional',
    priority: 'Medium',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/resources/resources.spec.ts -> [TC_RES_004]',
    status: 'Automated & Passed',
    sheetTab: '05_Resources_Network'
  },
  {
    id: 'TC_RES_005',
    module: 'Resources & Network',
    subModule: 'QoS Profiles',
    title: 'Verify QoS Profile matrix layout (QCI classes 1-9, ARP priority, MBR/GBR limits)',
    objective: 'Confirm QoS page displays quality of service parameters for cellular bearer flows.',
    preconditions: 'User navigates to Resources -> QoS.',
    steps: '1. Navigate to Resources -> QoS\n2. Inspect columns: Profile Name, QCI, ARP Priority, Max Bit Rate (MBR), Guaranteed Bit Rate (GBR)',
    testData: 'URL: /resources/qos',
    expectedResult: 'QoS profiles table displays cellular traffic classification parameters.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/resources/resources.spec.ts -> [TC_RES_005]',
    status: 'Automated & Passed',
    sheetTab: '05_Resources_Network'
  },
  {
    id: 'TC_RES_006',
    module: 'Resources & Network',
    subModule: 'QoS Profiles',
    title: 'Verify QoS Profile creation with customized bandwidth parameters',
    objective: 'Validate creating a high-priority enterprise QoS profile.',
    preconditions: 'User is on QoS page.',
    steps: '1. Click "+ CREATE QoS"\n2. Enter Profile Name "High_Priority_Telemetry"\n3. Select QCI "7"\n4. Set MBR Downlink "100 Mbps", Uplink "50 Mbps"\n5. Click Save',
    testData: 'QoS Name: High_Priority_Telemetry | QCI: 7 | MBR: 100M/50M',
    expectedResult: 'QoS profile is saved to catalog with designated parameters.',
    testType: 'Functional',
    priority: 'Medium',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/resources/resources.spec.ts -> [TC_RES_006]',
    status: 'Automated & Passed',
    sheetTab: '05_Resources_Network'
  },
  {
    id: 'TC_RES_007',
    module: 'Resources & Network',
    subModule: 'Network Profiles',
    title: 'Verify Network Profile catalog table view and APN association',
    objective: 'Confirm Network Profile catalog renders and lists associated APNs and steering rules.',
    preconditions: 'User navigates to Resources -> Network Profile.',
    steps: '1. Navigate to Resources -> Network Profile\n2. Verify columns: Profile Name, APN Associations, Fallback Profile, Status\n3. Click a profile row to view details',
    testData: 'URL: /resources/network-profile',
    expectedResult: 'Network profile catalog renders with APN mappings.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/resources/resources.spec.ts -> [TC_RES_007]',
    status: 'Automated & Passed',
    sheetTab: '05_Resources_Network'
  },
  {
    id: 'TC_RES_008',
    module: 'Resources & Network',
    subModule: 'Network Profiles',
    title: 'Verify Network Profile creation with roaming steering policies',
    objective: 'Validate configuring a new network profile with roaming network preferences.',
    preconditions: 'User is on Network Profile page.',
    steps: '1. Click "+ CREATE NETWORK PROFILE"\n2. Enter Name "Global_Fleet_NetProfile"\n3. Attach APNs\n4. Configure roaming steering policy (Prefer Partner Networks)\n5. Click Save',
    testData: 'Profile: Global_Fleet_NetProfile',
    expectedResult: 'Profile is created and ready for account assignment.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/resources/resources.spec.ts -> [TC_RES_008]',
    status: 'Automated & Passed',
    sheetTab: '05_Resources_Network'
  },
  {
    id: 'TC_RES_009',
    module: 'Resources & Network',
    subModule: 'SIM Inventory',
    title: 'Verify SIM Inventory pool table (ICCID ranges, Batch ID, Supplier, Quantity)',
    objective: 'Confirm central SIM warehouse inventory displays stock batches.',
    preconditions: 'User navigates to Resources -> SIM Inventory.',
    steps: '1. Navigate to Resources -> SIM Inventory\n2. Inspect columns: Batch ID, ICCID Start, ICCID End, Quantity, Supplier, Upload Date, Status',
    testData: 'URL: /resources/sim-inventory',
    expectedResult: 'SIM inventory table displays batch records and stock counts.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/resources/resources.spec.ts -> [TC_RES_009]',
    status: 'Automated & Passed',
    sheetTab: '05_Resources_Network'
  },
  {
    id: 'TC_RES_010',
    module: 'Resources & Network',
    subModule: 'SIM Inventory',
    title: 'Verify SIM Inventory batch upload / CSV import wizard',
    objective: 'Validate uploading a CSV file containing pre-ordered SIM card credentials.',
    preconditions: 'User is on SIM Inventory page with valid CSV format file.',
    steps: '1. Click "UPLOAD INVENTORY" button\n2. Attach CSV file with headers (ICCID, IMSI, PIN1, PUK1, FormFactor)\n3. Click Validate\n4. Click Submit Upload',
    testData: 'File: sim_batch_1000.csv',
    expectedResult: 'File is validated without formatting errors; records are ingested into inventory pool.',
    testType: 'Functional',
    priority: 'Critical',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/resources/resources.spec.ts -> [TC_RES_010]',
    status: 'Ready to Execute',
    sheetTab: '05_Resources_Network'
  },
  {
    id: 'TC_RES_011',
    module: 'Resources & Network',
    subModule: 'eSIM Inventory',
    title: 'Verify eSIM Inventory pool table (EID ranges, SM-DP+ server address)',
    objective: 'Confirm digital eSIM profile pools and SM-DP+ routing addresses are displayed.',
    preconditions: 'User navigates to Resources -> eSIM Inventory.',
    steps: '1. Navigate to Resources -> eSIM Inventory\n2. Inspect columns: EID Range, SM-DP+ Address, Profile Type, Available Profiles, Allocated Profiles',
    testData: 'URL: /resources/esim-inventory',
    expectedResult: 'eSIM pool displays available stock and SM-DP+ server routing configuration.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/resources/resources.spec.ts -> [TC_RES_011]',
    status: 'Automated & Passed',
    sheetTab: '05_Resources_Network'
  },
  {
    id: 'TC_RES_012',
    module: 'Resources & Network',
    subModule: 'IP Pools',
    title: 'Verify IP Pools listing (Subnet ranges, IP version, Total IPs, Allocated IPs)',
    objective: 'Confirm IP pool management displays IPv4/IPv6 CIDR subnets allocated to enterprise tenants.',
    preconditions: 'User navigates to Resources -> IP Pools.',
    steps: '1. Navigate to Resources -> IP Pools\n2. Inspect columns: Pool Name, CIDR Subnet, IP Version (IPv4/IPv6), Gateway, Total IPs, Free IPs, Assigned Account',
    testData: 'URL: /resources/ip-pools',
    expectedResult: 'IP Pools grid renders with subnet utilization counters.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/resources/resources.spec.ts -> [TC_RES_012]',
    status: 'Automated & Passed',
    sheetTab: '05_Resources_Network'
  },
  {
    id: 'TC_RES_013',
    module: 'Resources & Network',
    subModule: 'IP Pools',
    title: 'Verify Static IP Pool allocation and assignment to specific enterprise account',
    objective: 'Validate assigning a dedicated /28 subnet to an enterprise for private device addressing.',
    preconditions: 'Available static IP pool in catalog.',
    steps: '1. Select available IP Pool\n2. Click "Assign to Account"\n3. Select target account "Auto_Demo_Acc_101"\n4. Click Save',
    testData: 'Subnet: 10.140.20.0/28',
    expectedResult: 'Pool is allocated to target account; SIMs in account can receive static IPs from this pool.',
    testType: 'Functional',
    priority: 'Medium',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/resources/resources.spec.ts -> [TC_RES_013]',
    status: 'Ready to Execute',
    sheetTab: '05_Resources_Network'
  },
  {
    id: 'TC_RES_014',
    module: 'Resources & Network',
    subModule: 'Roaming Profiles',
    title: 'Verify Roaming Profile catalog (Home PLMN, Visited PLMNs, Steering rules)',
    objective: 'Confirm Roaming Profiles table lists global partner network configurations.',
    preconditions: 'User navigates to Resources -> Roaming Profile.',
    steps: '1. Navigate to Resources -> Roaming Profile\n2. Inspect columns: Profile Name, Home MCC-MNC, Allowed VPLMNs, Steering Priority',
    testData: 'URL: /resources/roaming-profile',
    expectedResult: 'Roaming profiles catalog renders with international network routing rules.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/resources/resources.spec.ts -> [TC_RES_014]',
    status: 'Automated & Passed',
    sheetTab: '05_Resources_Network'
  },
  {
    id: 'TC_RES_015',
    module: 'Resources & Network',
    subModule: 'Roaming Profiles',
    title: 'Verify Roaming Profile creation with country blacklist/whitelist filters',
    objective: 'Validate creating a roaming profile barring high-cost satellite and maritime networks.',
    preconditions: 'User is on Roaming Profile page.',
    steps: '1. Click "+ CREATE ROAMING PROFILE"\n2. Enter Name "EU_Standard_NoMaritime"\n3. Add EU Zone countries to Whitelist\n4. Add Maritime & Aero networks to Blacklist\n5. Click Save',
    testData: 'Profile: EU_Standard_NoMaritime',
    expectedResult: 'Roaming profile is saved with explicit whitelist and blacklist enforcement.',
    testType: 'Functional',
    priority: 'Medium',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/resources/resources.spec.ts -> [TC_RES_015]',
    status: 'Ready to Execute',
    sheetTab: '05_Resources_Network'
  },
  {
    id: 'TC_RES_016',
    module: 'Resources & Network',
    subModule: '5G Slice Management',
    title: 'Verify 5G Slice catalog table (Slice/Service Type SST, Slice Differentiator SD)',
    objective: 'Confirm 5G Network Slicing catalog displays 3GPP standard slicing parameters.',
    preconditions: 'User navigates to Resources -> Slice.',
    steps: '1. Navigate to Resources -> Slice\n2. Verify page URL contains /slice\n3. Inspect columns: Slice Name, SST (eMBB/URLLC/MIoT), Slice Differentiator (SD), Status',
    testData: 'URL: /resources/slice',
    expectedResult: '5G Slice management table renders with 3GPP slice identifiers.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/resources/resources.spec.ts -> [TC_RES_016]',
    status: 'Automated & Passed',
    sheetTab: '05_Resources_Network'
  },
  {
    id: 'TC_RES_017',
    module: 'Resources & Network',
    subModule: '5G Slice Management',
    title: 'Verify 5G Network Slice configuration with SLA latency and bandwidth guarantees',
    objective: 'Validate configuring an Ultra-Reliable Low-Latency (URLLC) slice for industrial automation.',
    preconditions: 'User is on 5G Slice page.',
    steps: '1. Click "+ CREATE SLICE"\n2. Enter Name "Industrial_URLLC_Slice"\n3. Select SST = 2 (URLLC)\n4. Set Target Latency "< 5ms"\n5. Set Guaranteed Bandwidth "50 Mbps"\n6. Save slice',
    testData: 'Slice: Industrial_URLLC_Slice | SST: 2',
    expectedResult: 'Slice definition is provisioned in 5G Core catalog.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/resources/resources.spec.ts -> [TC_RES_017]',
    status: 'Automated & Passed',
    sheetTab: '05_Resources_Network'
  },
  {
    id: 'TC_RES_018',
    module: 'Resources & Network',
    subModule: 'Integrity Guardrails',
    title: 'Verify deletion guardrail prevents deleting a resource currently in use by active subscriptions',
    objective: 'Ensure system blocks deleting an APN or Network Profile that is bound to active SIMs.',
    preconditions: 'Resource (e.g. APN "Default_APN") is bound to 10 active subscriptions.',
    steps: '1. Attempt to delete "Default_APN"\n2. Verify confirmation dialog\n3. Click Delete',
    testData: 'Target: In-use APN',
    expectedResult: 'Operation is rejected with error "Cannot delete resource: 10 subscriptions are currently using this APN".',
    testType: 'Security',
    priority: 'Critical',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/resources/resources.spec.ts -> [TC_RES_018]',
    status: 'Ready to Execute',
    sheetTab: '05_Resources_Network'
  },

  // ==========================================
  // DOMAIN 6: RATING, BILLING & FINANCIAL CATALOGS (16 TCs)
  // ==========================================
  {
    id: 'TC_RAT_001',
    module: 'Rating & Billing',
    subModule: 'Navigation Menu',
    title: 'Verify Rating menu sections and sub-items hierarchy',
    objective: 'Ensure Rating menu reveals all billing catalogs (Rate Plans, Add-ons, Zones, Quotas, Service Fees, Discounts, Commitments).',
    preconditions: 'User is authenticated.',
    steps: '1. Click "Rating" in top navigation bar\n2. Verify sections: Rating, Rating Configuration, Service Fees, Discounts, Commitments\n3. Verify all sub-items are visible',
    testData: 'Menu: Rating',
    expectedResult: 'All 7 rating sub-catalogs are displayed under appropriate section headers.',
    testType: 'Smoke',
    priority: 'Critical',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/rating/rating.spec.ts -> [TC_RAT_001]',
    status: 'Automated & Passed',
    sheetTab: '06_Rating_and_Billing'
  },
  {
    id: 'TC_RAT_002',
    module: 'Rating & Billing',
    subModule: 'Rate Plans',
    title: 'Verify Rate Plans catalog table, columns, and search',
    objective: 'Confirm Rate Plans catalog displays tariff plans with allowance and overage rates.',
    preconditions: 'User navigates to Rating -> Rate Plans.',
    steps: '1. Navigate to /rating/rate-plans\n2. Verify table columns: Plan Name, Base Recurring Fee, Data Allowance, Voice Allowance, SMS Allowance, Overage Rate, Status\n3. Verify search box',
    testData: 'URL: /rating/rate-plans',
    expectedResult: 'Rate plans table renders with correct columns and action buttons.',
    testType: 'Smoke',
    priority: 'Critical',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/rating/rating.spec.ts -> [TC_RAT_002]',
    status: 'Automated & Passed',
    sheetTab: '06_Rating_and_Billing'
  },
  {
    id: 'TC_RAT_003',
    module: 'Rating & Billing',
    subModule: 'Rate Plans',
    title: 'Verify search Rate Plans by plan name query',
    objective: 'Validate searching rate catalog by name keywords.',
    preconditions: 'User is on Rate Plans page.',
    steps: '1. Enter "Default" in search input\n2. Press Enter\n3. Verify results',
    testData: 'Search: "Default"',
    expectedResult: 'Table filters showing only plans containing "Default".',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/rating/rating.spec.ts -> [TC_RAT_003]',
    status: 'Automated & Passed',
    sheetTab: '06_Rating_and_Billing'
  },
  {
    id: 'TC_RAT_004',
    module: 'Rating & Billing',
    subModule: 'Rate Plans',
    title: 'Verify Rate Plan creation wizard (Allowance tiers, billing cycle, overage charges)',
    objective: 'Validate authoring a new commercial tariff plan.',
    preconditions: 'User is on Rate Plans page.',
    steps: '1. Click "+ CREATE RATE PLAN"\n2. Enter Name "Enterprise_Fleet_10GB"\n3. Set Monthly Base Fee "€15.00"\n4. Set Data Allowance "10 GB"\n5. Set Overage Rate "€0.005 / MB"\n6. Save plan',
    testData: 'Plan: Enterprise_Fleet_10GB | €15.00 | 10GB',
    expectedResult: 'Rate plan is saved to catalog and available for account assignment.',
    testType: 'Functional',
    priority: 'Critical',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/rating/rating.spec.ts -> [TC_RAT_004]',
    status: 'Automated & Passed',
    sheetTab: '06_Rating_and_Billing'
  },
  {
    id: 'TC_RAT_005',
    module: 'Rating & Billing',
    subModule: 'Add-on Bundles',
    title: 'Verify Add-on Bundle catalog view and bundle structure',
    objective: 'Confirm Add-on Bundle catalog displays top-up packages.',
    preconditions: 'User navigates to Rating -> Add-on Bundle.',
    steps: '1. Navigate to Rating -> Add-on Bundle\n2. Inspect columns: Bundle Name, Type (Recurring/One-Time), Allowance, Price, Validity (Days), Status',
    testData: 'URL: /rating/addon-bundle',
    expectedResult: 'Add-on bundles table displays catalog with pricing and validity.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/rating/rating.spec.ts -> [TC_RAT_005]',
    status: 'Automated & Passed',
    sheetTab: '06_Rating_and_Billing'
  },
  {
    id: 'TC_RAT_006',
    module: 'Rating & Billing',
    subModule: 'Add-on Bundles',
    title: 'Verify Add-on Bundle creation with validity duration and pricing',
    objective: 'Validate creating a 30-day top-up bundle.',
    preconditions: 'User is on Add-on Bundle page.',
    steps: '1. Click "+ CREATE BUNDLE"\n2. Enter Name "Roaming_TopUp_1GB"\n3. Set Price "€5.00"\n4. Set Allowance "1024 MB"\n5. Set Validity "30 Days"\n6. Save bundle',
    testData: 'Bundle: Roaming_TopUp_1GB | €5.00 | 30 Days',
    expectedResult: 'Bundle is published in catalog.',
    testType: 'Functional',
    priority: 'Medium',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/rating/rating.spec.ts -> [TC_RAT_006]',
    status: 'Automated & Passed',
    sheetTab: '06_Rating_and_Billing'
  },
  {
    id: 'TC_RAT_007',
    module: 'Rating & Billing',
    subModule: 'Rating Zones',
    title: 'Verify Rating Zones configuration and country mapping',
    objective: 'Confirm rating zones group countries into tariff tiers (Zone 1 Domestic, Zone 2 EU, Zone 3 Global).',
    preconditions: 'User navigates to Rating -> Rating Zones.',
    steps: '1. Navigate to Rating -> Rating Zones\n2. Inspect zone definitions\n3. Click Zone 2 and inspect mapped ISO country codes',
    testData: 'Rating Zones',
    expectedResult: 'Rating zones display country mappings cleanly.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/rating/rating.spec.ts -> [TC_RAT_007]',
    status: 'Automated & Passed',
    sheetTab: '06_Rating_and_Billing'
  },
  {
    id: 'TC_RAT_008',
    module: 'Rating & Billing',
    subModule: 'Quota Management',
    title: 'Verify Quota Management table, limits, and Fair Usage Policies (FUP)',
    objective: 'Confirm Quota Management table lists bandwidth and data volume caps.',
    preconditions: 'User navigates to Rating -> Quota Management.',
    steps: '1. Navigate to Rating -> Quota Management\n2. Inspect columns: Policy Name, Quota Limit (GB), Interval (Daily/Monthly), Action (Throttle/Bar), Status',
    testData: 'URL: /rating/quota',
    expectedResult: 'Quota policies table renders with trigger rules and enforcement actions.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/rating/rating.spec.ts -> [TC_RAT_008]',
    status: 'Automated & Passed',
    sheetTab: '06_Rating_and_Billing'
  },
  {
    id: 'TC_RAT_009',
    module: 'Rating & Billing',
    subModule: 'Quota Management',
    title: 'Verify Quota policy creation (Throttling speed vs Hard cut-off barring action)',
    objective: 'Validate creating a policy that throttles speed to 128 kbps upon reaching 100% quota.',
    preconditions: 'User is on Quota Management page.',
    steps: '1. Click "+ CREATE QUOTA"\n2. Enter Name "Fair_Usage_Throttle_Policy"\n3. Set Cap "20 GB"\n4. Select Action = "Throttle Bandwidth to 128 kbps"\n5. Click Save',
    testData: 'Policy: Fair_Usage_Throttle_Policy | Cap: 20GB | Action: Throttle 128kbps',
    expectedResult: 'Quota policy is created and ready for association to Rate Plans.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/rating/rating.spec.ts -> [TC_RAT_009]',
    status: 'Automated & Passed',
    sheetTab: '06_Rating_and_Billing'
  },
  {
    id: 'TC_RAT_010',
    module: 'Rating & Billing',
    subModule: 'Service Fee Catalog',
    title: 'Verify Service Fee Catalog table (Non-usage fees, line rental, SIM replacement fee)',
    objective: 'Confirm Service Fee Catalog lists one-time and recurring administrative charges.',
    preconditions: 'User navigates to Rating -> Service Fee Catalog.',
    steps: '1. Navigate to Rating -> Service Fee Catalog\n2. Inspect columns: Fee Code, Fee Description, Charge Type (Recurring/One-Off), Amount, Currency',
    testData: 'URL: /rating/service-fees',
    expectedResult: 'Service fees table renders with charge items.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/rating/rating.spec.ts -> [TC_RAT_010]',
    status: 'Automated & Passed',
    sheetTab: '06_Rating_and_Billing'
  },
  {
    id: 'TC_RAT_011',
    module: 'Rating & Billing',
    subModule: 'Service Fee Catalog',
    title: 'Verify Service Fee creation and tax code association',
    objective: 'Validate defining a new fee (e.g. "SIM Card Provisioning Fee: €2.50").',
    preconditions: 'User is on Service Fee page.',
    steps: '1. Click "+ CREATE FEE"\n2. Enter Fee Code "FEE_SIM_PROV"\n3. Set Amount "€2.50"\n4. Select Tax Code "VAT_STANDARD_24"\n5. Click Save',
    testData: 'Fee: FEE_SIM_PROV | €2.50',
    expectedResult: 'Service fee is added to active catalog.',
    testType: 'Functional',
    priority: 'Medium',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/rating/rating.spec.ts -> [TC_RAT_011]',
    status: 'Automated & Passed',
    sheetTab: '06_Rating_and_Billing'
  },
  {
    id: 'TC_RAT_012',
    module: 'Rating & Billing',
    subModule: 'Assigned Service Fees',
    title: 'Verify Assigned Service Fees view and association to customer accounts',
    objective: 'Confirm viewing which fees are actively billed against specific accounts.',
    preconditions: 'User navigates to Rating -> Assigned Service Fees.',
    steps: '1. Navigate to Assigned Service Fees\n2. Verify table lists Account Name, Assigned Fee, Effective Start Date, Status',
    testData: 'Assigned fees',
    expectedResult: 'Assigned service fees grid renders with account relationships.',
    testType: 'Functional',
    priority: 'Medium',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/rating/rating.spec.ts -> [TC_RAT_012]',
    status: 'Automated & Passed',
    sheetTab: '06_Rating_and_Billing'
  },
  {
    id: 'TC_RAT_013',
    module: 'Rating & Billing',
    subModule: 'Discount Catalog',
    title: 'Verify Discount Catalog table (Volume discounts, tier percentage discounts)',
    objective: 'Confirm Discount Catalog lists promotional and volume-based discounts.',
    preconditions: 'User navigates to Rating -> Discount Catalog.',
    steps: '1. Navigate to Rating -> Discount Catalog\n2. Inspect columns: Discount Name, Discount Type (Percentage/Fixed), Value, Min Volume, Status',
    testData: 'URL: /rating/discounts',
    expectedResult: 'Discounts catalog renders with discount tiers.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/rating/rating.spec.ts -> [TC_RAT_013]',
    status: 'Automated & Passed',
    sheetTab: '06_Rating_and_Billing'
  },
  {
    id: 'TC_RAT_014',
    module: 'Rating & Billing',
    subModule: 'Discount Catalog',
    title: 'Verify Discount rule creation with minimum SIM volume threshold',
    objective: 'Validate creating a 15% discount for accounts with > 1,000 active SIMs.',
    preconditions: 'User is on Discount Catalog page.',
    steps: '1. Click "+ CREATE DISCOUNT"\n2. Enter Name "Volume_Tier_1000_15Pct"\n3. Set Type "Percentage (15%)"\n4. Set Minimum Volume "1000 SIMs"\n5. Click Save',
    testData: 'Discount: 15% | Min: 1000',
    expectedResult: 'Discount rule is saved to catalog.',
    testType: 'Functional',
    priority: 'Medium',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/rating/rating.spec.ts -> [TC_RAT_014]',
    status: 'Automated & Passed',
    sheetTab: '06_Rating_and_Billing'
  },
  {
    id: 'TC_RAT_015',
    module: 'Rating & Billing',
    subModule: 'Commitment Catalog',
    title: 'Verify Commitment Catalog table (Minimum spend commitments, volume commitments)',
    objective: 'Confirm Commitment Catalog lists contractual commit rules.',
    preconditions: 'User navigates to Rating -> Commitment Catalog.',
    steps: '1. Navigate to Rating -> Commitment Catalog\n2. Inspect columns: Commitment ID, Description, Minimum Spend (€), Evaluation Period, Penalty Policy',
    testData: 'URL: /rating/commitments',
    expectedResult: 'Commitment catalog table renders with contractual tiers.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/rating/rating.spec.ts -> [TC_RAT_015]',
    status: 'Automated & Passed',
    sheetTab: '06_Rating_and_Billing'
  },
  {
    id: 'TC_RAT_016',
    module: 'Rating & Billing',
    subModule: 'Commitment Catalog',
    title: 'Verify Assigned Commitments tracking and true-up calculation logic',
    objective: 'Validate monitoring customer progress towards annual spend commitment.',
    preconditions: 'Customer account has active commitment.',
    steps: '1. Open Assigned Commitments\n2. Filter by customer account\n3. Verify Current Spend vs Committed Target progress bar\n4. Verify projected shortfall / true-up penalty',
    testData: 'Commitment tracking',
    expectedResult: 'Progress bar shows percentage fulfilled and projected true-up calculation.',
    testType: 'Functional',
    priority: 'Medium',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/rating/rating.spec.ts -> [TC_RAT_016]',
    status: 'Ready to Execute',
    sheetTab: '06_Rating_and_Billing'
  },

  // ==========================================
  // DOMAIN 7: REPORTS & BATCH OPERATIONS (14 TCs)
  // ==========================================
  {
    id: 'TC_REP_001',
    module: 'Reports & Batch Ops',
    subModule: 'Navigation Menu',
    title: 'Verify Reports menu categories (Batch Executions, Off the Shelf Reports)',
    objective: 'Ensure Reports dropdown reveals both operational batch runs and standardized report catalogs.',
    preconditions: 'User is authenticated.',
    steps: '1. Click "Reports" in top navigation bar\n2. Verify sub-items: "Batch Executions" and "Off the Shelf Reports"',
    testData: 'Menu: Reports',
    expectedResult: 'Both items are displayed cleanly in the dropdown menu.',
    testType: 'Smoke',
    priority: 'Critical',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/reports/reports.spec.ts -> [TC_REP_001]',
    status: 'Automated & Passed',
    sheetTab: '07_Reports_Batch'
  },
  {
    id: 'TC_REP_002',
    module: 'Reports & Batch Ops',
    subModule: 'Batch Executions',
    title: 'Verify Batch Executions data table, columns, and layout',
    objective: 'Confirm Batch Executions page displays job history grid.',
    preconditions: 'User navigates to Reports -> Batch Executions.',
    steps: '1. Navigate to /reports/batch\n2. Inspect columns: Execution ID, Report Name, Status, Start Time, End Time, Triggered By, Actions',
    testData: 'URL: /reports/batch',
    expectedResult: 'Table renders with execution records, status badges, and action buttons.',
    testType: 'Smoke',
    priority: 'Critical',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/reports/reports.spec.ts -> [TC_REP_002]',
    status: 'Automated & Passed',
    sheetTab: '07_Reports_Batch'
  },
  {
    id: 'TC_REP_003',
    module: 'Reports & Batch Ops',
    subModule: 'Batch Executions',
    title: 'Verify filter Batch Executions by execution status chip (Completed, Running, Failed, Queued)',
    objective: 'Validate filtering batch job history using interactive status chips.',
    preconditions: 'User is on Batch Executions page.',
    steps: '1. Click "Completed" status chip\n2. Verify table shows only Completed jobs\n3. Click "Failed" status chip\n4. Verify table shows Failed jobs',
    testData: 'Status chips: Completed, Failed',
    expectedResult: 'Table updates dynamically showing only executions matching clicked status chip.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/reports/reports.spec.ts -> [TC_REP_003]',
    status: 'Automated & Passed',
    sheetTab: '07_Reports_Batch'
  },
  {
    id: 'TC_REP_004',
    module: 'Reports & Batch Ops',
    subModule: 'Batch Executions',
    title: 'Verify search Batch Executions by Execution ID or Report Name',
    objective: 'Confirm search bar filters batch jobs by ID or report type keyword.',
    preconditions: 'User is on Batch Executions page.',
    steps: '1. Type "REPORT" in search input\n2. Press Enter\n3. Verify filtered execution rows',
    testData: 'Query: "REPORT"',
    expectedResult: 'Grid filters instantly showing matching execution records.',
    testType: 'Functional',
    priority: 'Medium',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/reports/reports.spec.ts -> [TC_REP_004]',
    status: 'Automated & Passed',
    sheetTab: '07_Reports_Batch'
  },
  {
    id: 'TC_REP_005',
    module: 'Reports & Batch Ops',
    subModule: 'Batch Executions',
    title: 'Verify download of completed batch execution output file (CSV / ZIP)',
    objective: 'Validate downloading generated output files from finished batch runs.',
    preconditions: 'Execution has Status = "Completed".',
    steps: '1. Locate completed batch job row\n2. Click Download / Export icon button in Actions column\n3. Verify file download initiates',
    testData: 'File: batch_export_output.zip',
    expectedResult: 'Archive or CSV file downloads successfully containing execution data.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/reports/reports.spec.ts -> [TC_REP_005]',
    status: 'Automated & Passed',
    sheetTab: '07_Reports_Batch'
  },
  {
    id: 'TC_REP_006',
    module: 'Reports & Batch Ops',
    subModule: 'Batch Executions',
    title: 'Verify failed batch execution error log inspection modal',
    objective: 'Ensure users can inspect failure diagnostics for batch jobs that encountered errors.',
    preconditions: 'Execution has Status = "Failed".',
    steps: '1. Locate failed execution row\n2. Click Error Info / Log icon\n3. Inspect error dialog (Stack trace / reason code)',
    testData: 'Failed job log',
    expectedResult: 'Modal displays descriptive failure reason (e.g. "Data source timeout" / "Invalid record schema").',
    testType: 'Functional',
    priority: 'Medium',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/reports/reports.spec.ts -> [TC_REP_006]',
    status: 'Ready to Execute',
    sheetTab: '07_Reports_Batch'
  },
  {
    id: 'TC_REP_007',
    module: 'Reports & Batch Ops',
    subModule: 'Standard Reports',
    title: 'Verify Off the Shelf Reports catalog display (Usage, Financial, SIM Lifecycle)',
    objective: 'Confirm standard reports catalog categorizes out-of-the-box analytical reports.',
    preconditions: 'User navigates to Reports -> Off the Shelf Reports.',
    steps: '1. Navigate to /reports/off-the-shelf\n2. Inspect report categories: Usage CDRs, Financial Invoicing Summary, Inventory Lifecycle\n3. Click a report template card',
    testData: 'URL: /reports/off-the-shelf',
    expectedResult: 'Report templates are organized with descriptions and "Generate" action buttons.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/reports/reports.spec.ts -> [TC_REP_007]',
    status: 'Automated & Passed',
    sheetTab: '07_Reports_Batch'
  },
  {
    id: 'TC_REP_008',
    module: 'Reports & Batch Ops',
    subModule: 'Date Filtering',
    title: 'Verify Date Range filter selection for standard reports (Today, Last 7 Days, Last Month, Custom)',
    objective: 'Validate selecting predefined and custom time windows for report generation.',
    preconditions: 'User selects a report template.',
    steps: '1. Click Date Range button\n2. Select "Last 7 Days"\n3. Select "Custom Range" and pick calendar dates\n4. Verify range inputs reflect selection',
    testData: 'Date range: Last 7 Days',
    expectedResult: 'Date picker updates start and end dates accurately.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/reports/reports.spec.ts -> [TC_REP_008]',
    status: 'Automated & Passed',
    sheetTab: '07_Reports_Batch'
  },
  {
    id: 'TC_REP_009',
    module: 'Reports & Batch Ops',
    subModule: 'Standard Reports',
    title: 'Verify Data CDR usage report generation and column validation',
    objective: 'Validate running Data CDR report produces detailed byte-level consumption records.',
    preconditions: 'User is on Usage report template.',
    steps: '1. Select "Data CDR Usage Report"\n2. Choose date range = Last 7 Days\n3. Click "Generate Report"\n4. Inspect generated table headers: Session Start, Duration, Bytes Uploaded, Bytes Downloaded, Total MB, APN, Country',
    testData: 'Report: Data CDR',
    expectedResult: 'Report generates with complete telecom session attributes.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/reports/reports.spec.ts -> [TC_REP_009]',
    status: 'Ready to Execute',
    sheetTab: '07_Reports_Batch'
  },
  {
    id: 'TC_REP_010',
    module: 'Reports & Batch Ops',
    subModule: 'Standard Reports',
    title: 'Verify Account Billing Summary report generation',
    objective: 'Validate running Account Billing Summary report.',
    preconditions: 'User is on Financial report template.',
    steps: '1. Select "Account Billing Summary"\n2. Choose billing month\n3. Click Generate\n4. Inspect account-level gross amounts, active SIM counts, and taxes',
    testData: 'Report: Billing Summary',
    expectedResult: 'Report displays financial aggregates grouped by customer account.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/reports/reports.spec.ts -> [TC_REP_010]',
    status: 'Ready to Execute',
    sheetTab: '07_Reports_Batch'
  },
  {
    id: 'TC_REP_011',
    module: 'Reports & Batch Ops',
    subModule: 'Standard Reports',
    title: 'Verify SIM Lifecycle & Inventory report generation',
    objective: 'Validate generating inventory state transition report.',
    preconditions: 'User is on Inventory report template.',
    steps: '1. Select "SIM Lifecycle Report"\n2. Click Generate\n3. Verify breakdown of SIM activations, suspensions, and retirements over time',
    testData: 'Report: SIM Lifecycle',
    expectedResult: 'Report outputs lifecycle audit metrics.',
    testType: 'Functional',
    priority: 'Medium',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/reports/reports.spec.ts -> [TC_REP_011]',
    status: 'Ready to Execute',
    sheetTab: '07_Reports_Batch'
  },
  {
    id: 'TC_REP_012',
    module: 'Reports & Batch Ops',
    subModule: 'Export Feature',
    title: 'Verify Report Export action to CSV, Excel, and PDF formats',
    objective: 'Confirm generated report can be exported in all three standard document formats.',
    preconditions: 'Report has finished generating.',
    steps: '1. Click Export dropdown\n2. Select "Export as Excel (.xlsx)"\n3. Select "Export as CSV (.csv)"\n4. Select "Export as PDF (.pdf)"\n5. Verify downloads',
    testData: 'Formats: XLSX, CSV, PDF',
    expectedResult: 'All three export formats download cleanly with formatted tables and titles.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/reports/reports.spec.ts -> [TC_REP_012]',
    status: 'Automated & Passed',
    sheetTab: '07_Reports_Batch'
  },
  {
    id: 'TC_REP_013',
    module: 'Reports & Batch Ops',
    subModule: 'Scheduled Reports',
    title: 'Verify recurring scheduled report configuration (Daily, Weekly, Monthly)',
    objective: 'Validate setting up a scheduled report job with automated email delivery.',
    preconditions: 'User selects a report template.',
    steps: '1. Click "Schedule Report" button\n2. Choose frequency "Weekly - Mondays at 08:00 AM"\n3. Enter recipient email addresses\n4. Save schedule',
    testData: 'Schedule: Weekly | Recipients: admin@enterprise.com',
    expectedResult: 'Scheduled job is added to cron execution queue; confirmation message displays.',
    testType: 'Functional',
    priority: 'Medium',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/reports/reports.spec.ts -> [TC_REP_013]',
    status: 'Ready to Execute',
    sheetTab: '07_Reports_Batch'
  },
  {
    id: 'TC_REP_014',
    module: 'Reports & Batch Ops',
    subModule: 'Empty State Handling',
    title: 'Verify graceful "No records found" state when report query yields zero results',
    objective: 'Ensure empty result sets render user-friendly message rather than blank page or error.',
    preconditions: 'Select date range in distant past with no data.',
    steps: '1. Select date range 2020-01-01 to 2020-01-02\n2. Click Generate Report\n3. Observe UI response',
    testData: 'Date range: 2020-01-01',
    expectedResult: 'Page renders clean empty state icon and message "No data found for the selected filter criteria".',
    testType: 'Boundary',
    priority: 'Low',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/reports/reports.spec.ts -> [TC_REP_014]',
    status: 'Ready to Execute',
    sheetTab: '07_Reports_Batch'
  },

  // ==========================================
  // DOMAIN 8: ADMINISTRATION & IDENTITY / RBAC (14 TCs)
  // ==========================================
  {
    id: 'TC_ADM_001',
    module: 'Administration & RBAC',
    subModule: 'Navigation Menu',
    title: 'Verify Administration menu sections (Users, User Groups, Roles, IP-Whitelist)',
    objective: 'Ensure Administration menu reveals all security and identity management options.',
    preconditions: 'User has Administrator privileges.',
    steps: '1. Click "Administration" in top navbar\n2. Verify items: Users, User Groups, Roles, IP-Whitelist',
    testData: 'Menu: Administration',
    expectedResult: 'All 4 administration sections are displayed and accessible.',
    testType: 'Smoke',
    priority: 'Critical',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/administration/administration.spec.ts -> [TC_ADM_001]',
    status: 'Automated & Passed',
    sheetTab: '08_Administration_RBAC'
  },
  {
    id: 'TC_ADM_002',
    module: 'Administration & RBAC',
    subModule: 'Users Management',
    title: 'Verify Users directory table layout, columns, and action buttons',
    objective: 'Confirm Users management table displays portal users.',
    preconditions: 'User navigates to Administration -> Users.',
    steps: '1. Navigate to /administration/users\n2. Inspect columns: Username, Full Name, Email, Assigned Roles, Account Context, Status (Active/Locked), Actions\n3. Verify "+ CREATE USER" button',
    testData: 'URL: /administration/users',
    expectedResult: 'Users table renders with complete profile fields and role badges.',
    testType: 'Smoke',
    priority: 'Critical',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/administration/administration.spec.ts -> [TC_ADM_002]',
    status: 'Automated & Passed',
    sheetTab: '08_Administration_RBAC'
  },
  {
    id: 'TC_ADM_003',
    module: 'Administration & RBAC',
    subModule: 'Users Management',
    title: 'Verify search Users table by username or email query',
    objective: 'Validate searching user accounts by username keyword.',
    preconditions: 'User is on Users page.',
    steps: '1. Enter "vetrivel" in search box\n2. Press Enter\n3. Verify filtered user rows',
    testData: 'Query: "vetrivel"',
    expectedResult: 'Table displays user record matching "vetrivel_m".',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/administration/administration.spec.ts -> [TC_ADM_003]',
    status: 'Automated & Passed',
    sheetTab: '08_Administration_RBAC'
  },
  {
    id: 'TC_ADM_004',
    module: 'Administration & RBAC',
    subModule: 'User Creation',
    title: 'Verify "+ CREATE USER" modal display and required field validation',
    objective: 'Confirm user creation form highlights required inputs on empty submit.',
    preconditions: 'User is on Users page.',
    steps: '1. Click "+ CREATE USER" button\n2. Click Save without filling fields\n3. Verify validation error messages',
    testData: 'Empty form submission',
    expectedResult: 'Username, Email, and Role fields display required error indicators.',
    testType: 'Boundary',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/administration/administration.spec.ts -> [TC_ADM_004]',
    status: 'Automated & Passed',
    sheetTab: '08_Administration_RBAC'
  },
  {
    id: 'TC_ADM_005',
    module: 'Administration & RBAC',
    subModule: 'User Creation',
    title: 'Verify user creation with assigned role and temporary password',
    objective: 'Validate creating a new portal user and sending activation email.',
    preconditions: 'User is on Create User modal.',
    steps: '1. Enter Username "operator_test_01"\n2. Enter Email "operator@nokiawing.com"\n3. Enter Full Name "Test Operator"\n4. Select Role "Operator"\n5. Select User Group "Operations"\n6. Click Save',
    testData: 'User: operator_test_01 | Role: Operator',
    expectedResult: 'User account is created; appears in Users table with Active status.',
    testType: 'Functional',
    priority: 'Critical',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/administration/administration.spec.ts -> [TC_ADM_005]',
    status: 'Automated & Passed',
    sheetTab: '08_Administration_RBAC'
  },
  {
    id: 'TC_ADM_006',
    module: 'Administration & RBAC',
    subModule: 'User Management',
    title: 'Verify password reset trigger and temporary credential generation',
    objective: 'Validate admin can trigger password reset email for an existing user.',
    preconditions: 'Target user exists in directory.',
    steps: '1. Locate user row\n2. Click Actions -> "Reset Password"\n3. Confirm dialog prompt\n4. Verify confirmation toast',
    testData: 'Action: Reset Password',
    expectedResult: 'Password reset link dispatched to user email; status notification confirms dispatch.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/administration/administration.spec.ts -> [TC_ADM_006]',
    status: 'Ready to Execute',
    sheetTab: '08_Administration_RBAC'
  },
  {
    id: 'TC_ADM_007',
    module: 'Administration & RBAC',
    subModule: 'User Security',
    title: 'Verify Lock / Unlock user account action and status toggle',
    objective: 'Validate temporarily locking a compromised user account to block login.',
    preconditions: 'Target user is Active.',
    steps: '1. Select user row\n2. Click "Lock Account"\n3. Verify Status badge updates to "LOCKED"\n4. Attempt login with locked account credentials\n5. Unlock account and verify restoration',
    testData: 'Status toggle: ACTIVE <-> LOCKED',
    expectedResult: 'Locked user cannot authenticate (displays "Account is locked"); unlocking restores access.',
    testType: 'Security',
    priority: 'Critical',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/administration/administration.spec.ts -> [TC_ADM_007]',
    status: 'Ready to Execute',
    sheetTab: '08_Administration_RBAC'
  },
  {
    id: 'TC_ADM_008',
    module: 'Administration & RBAC',
    subModule: 'User Groups',
    title: 'Verify User Groups table and organizational hierarchy',
    objective: 'Confirm User Groups page displays departmental groupings.',
    preconditions: 'User navigates to Administration -> User Groups.',
    steps: '1. Navigate to Administration -> User Groups\n2. Inspect columns: Group Name, Description, Members Count, Assigned Roles, Status',
    testData: 'URL: /administration/user-groups',
    expectedResult: 'User Groups table renders with group members counters.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/administration/administration.spec.ts -> [TC_ADM_008]',
    status: 'Automated & Passed',
    sheetTab: '08_Administration_RBAC'
  },
  {
    id: 'TC_ADM_009',
    module: 'Administration & RBAC',
    subModule: 'User Groups',
    title: 'Verify Create User Group and assign default roles to group',
    objective: 'Validate creating a new organizational group (e.g. "Billing_Specialists").',
    preconditions: 'User is on User Groups page.',
    steps: '1. Click "+ CREATE GROUP"\n2. Enter Name "Billing_Specialists"\n3. Attach Role "Billing Admin"\n4. Save group',
    testData: 'Group: Billing_Specialists',
    expectedResult: 'Group is created; members added to group automatically inherit Billing Admin role.',
    testType: 'Functional',
    priority: 'Medium',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/administration/administration.spec.ts -> [TC_ADM_009]',
    status: 'Automated & Passed',
    sheetTab: '08_Administration_RBAC'
  },
  {
    id: 'TC_ADM_010',
    module: 'Administration & RBAC',
    subModule: 'Roles & Permissions',
    title: 'Verify Roles catalog table (System Admin, Account Admin, Billing Admin, Read Only)',
    objective: 'Confirm Roles catalog lists all platform RBAC role definitions.',
    preconditions: 'User navigates to Administration -> Roles.',
    steps: '1. Navigate to Administration -> Roles\n2. Inspect roles: System Admin, Account Admin, Billing Admin, Read Only Operator\n3. Click a role to view assigned permissions',
    testData: 'URL: /administration/roles',
    expectedResult: 'Roles catalog renders with role names, descriptions, and user counts.',
    testType: 'Functional',
    priority: 'Critical',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/administration/administration.spec.ts -> [TC_ADM_010]',
    status: 'Automated & Passed',
    sheetTab: '08_Administration_RBAC'
  },
  {
    id: 'TC_ADM_011',
    module: 'Administration & RBAC',
    subModule: 'Roles & Permissions',
    title: 'Verify Role permission matrix inspection (Create, Read, Update, Delete per module)',
    objective: 'Validate fine-grained permissions matrix for a selected role.',
    preconditions: 'User is on Roles page.',
    steps: '1. Select "Account Admin" role\n2. Click "View Permissions"\n3. Inspect matrix: Subscriptions (CRUD), Billing (Read Only), Security (Read Only)',
    testData: 'Role: Account Admin',
    expectedResult: 'Permission matrix displays granular capability checkboxes for each portal domain.',
    testType: 'Security',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/administration/administration.spec.ts -> [TC_ADM_011]',
    status: 'Automated & Passed',
    sheetTab: '08_Administration_RBAC'
  },
  {
    id: 'TC_ADM_012',
    module: 'Administration & RBAC',
    subModule: 'IP-Whitelist',
    title: 'Verify IP-Whitelist configuration table layout and security rules',
    objective: 'Confirm IP-Whitelist page displays authorized network CIDR blocks.',
    preconditions: 'User navigates to Administration -> IP-Whitelist.',
    steps: '1. Navigate to Administration -> IP-Whitelist\n2. Inspect columns: Rule ID, IP / CIDR Block, Description, Created By, Created Date, Status (Active/Disabled)',
    testData: 'URL: /administration/ip-whitelist',
    expectedResult: 'IP-Whitelist table renders with IP rules and enable/disable toggle switches.',
    testType: 'Security',
    priority: 'Critical',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/administration/administration.spec.ts -> [TC_ADM_012]',
    status: 'Automated & Passed',
    sheetTab: '08_Administration_RBAC'
  },
  {
    id: 'TC_ADM_013',
    module: 'Administration & RBAC',
    subModule: 'IP-Whitelist',
    title: 'Verify Add IP address to Whitelist with valid IPv4/IPv6 CIDR pattern',
    objective: 'Validate adding a trusted corporate CIDR block to the whitelist.',
    preconditions: 'User is on IP-Whitelist page.',
    steps: '1. Click "+ ADD IP RULE"\n2. Enter CIDR "192.168.10.0/24"\n3. Enter Description "Nokia Espoo HQ VPN"\n4. Click Save',
    testData: 'CIDR: 192.168.10.0/24',
    expectedResult: 'Rule is validated and saved; becomes active immediately.',
    testType: 'Security',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/administration/administration.spec.ts -> [TC_ADM_013]',
    status: 'Automated & Passed',
    sheetTab: '08_Administration_RBAC'
  },
  {
    id: 'TC_ADM_014',
    module: 'Administration & RBAC',
    subModule: 'IP-Whitelist Enforcement',
    title: 'Verify access restriction when connecting from an unauthorized IP address',
    objective: 'Ensure connections originating from outside whitelisted CIDRs are blocked with HTTP 403.',
    preconditions: 'IP-Whitelist enforcement is enabled in production environment.',
    steps: '1. Simulate request from untrusted IP\n2. Observe response code and error banner',
    testData: 'Untrusted IP: 203.0.113.195',
    expectedResult: 'Access is denied with HTTP 403 Forbidden; "Access denied: Your IP address is not whitelisted" is returned.',
    testType: 'Security',
    priority: 'Critical',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/administration/administration.spec.ts -> [TC_ADM_014]',
    status: 'Ready to Execute',
    sheetTab: '08_Administration_RBAC'
  },

  // ==========================================
  // DOMAIN 9: AUTOMATION RULES ENGINE (10 TCs)
  // ==========================================
  {
    id: 'TC_AUT_001',
    module: 'Automation Rules',
    subModule: 'Navigation Menu',
    title: 'Verify Automation Rules menu options (Global Rules, Enterprise Rules)',
    objective: 'Ensure Automation Rules menu expands and displays Global Rules and Enterprise Rules.',
    preconditions: 'User is authenticated.',
    steps: '1. Click "Automation Rules" in top navigation bar\n2. Verify sub-items: "Global Rules" and "Enterprise Rules"',
    testData: 'Menu: Automation Rules',
    expectedResult: 'Both rule categories are displayed and accessible.',
    testType: 'Smoke',
    priority: 'Critical',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/automation_rules/automation_rules.spec.ts -> [TC_AUT_001]',
    status: 'Automated & Passed',
    sheetTab: '09_Automation_Rules'
  },
  {
    id: 'TC_AUT_002',
    module: 'Automation Rules',
    subModule: 'Global Rules',
    title: 'Verify Global Rules table layout, columns, and trigger condition display',
    objective: 'Confirm Global Rules page displays platform-wide automated event rules.',
    preconditions: 'User navigates to Automation Rules -> Global Rules.',
    steps: '1. Navigate to /automation-rules/global\n2. Inspect columns: Rule ID, Rule Name, Trigger Event, Condition, Action, Status (Active/Inactive), Last Triggered',
    testData: 'URL: /automation-rules/global',
    expectedResult: 'Rules table renders with rule definitions and action badges.',
    testType: 'Smoke',
    priority: 'Critical',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/automation_rules/automation_rules.spec.ts -> [TC_AUT_002]',
    status: 'Automated & Passed',
    sheetTab: '09_Automation_Rules'
  },
  {
    id: 'TC_AUT_003',
    module: 'Automation Rules',
    subModule: 'Search & Filtering',
    title: 'Verify search and filter in Automation Rules table by rule name or action',
    objective: 'Confirm search filters rules by keyword (e.g. "Threshold", "Suspend").',
    preconditions: 'User is on Global Rules page.',
    steps: '1. Enter "Threshold" in search input\n2. Press Enter\n3. Verify filtered rule rows',
    testData: 'Query: "Threshold"',
    expectedResult: 'Grid updates showing only threshold-triggered automation rules.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/automation_rules/automation_rules.spec.ts -> [TC_AUT_003]',
    status: 'Automated & Passed',
    sheetTab: '09_Automation_Rules'
  },
  {
    id: 'TC_AUT_004',
    module: 'Automation Rules',
    subModule: 'Rule Authoring',
    title: 'Verify "+ CREATE RULE" trigger button and rule authoring modal',
    objective: 'Confirm Create Rule modal opens with event condition and action selectors.',
    preconditions: 'User is on Global Rules page.',
    steps: '1. Click "+ CREATE RULE" button\n2. Inspect modal controls: Rule Name, Event Trigger dropdown, Condition Operator, Threshold Value, Action dropdown',
    testData: 'Modal dialog',
    expectedResult: 'Create Rule dialog renders with form controls and validation.',
    testType: 'Smoke',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/automation_rules/automation_rules.spec.ts -> [TC_AUT_004]',
    status: 'Automated & Passed',
    sheetTab: '09_Automation_Rules'
  },
  {
    id: 'TC_AUT_005',
    module: 'Automation Rules',
    subModule: 'Rule Authoring',
    title: 'Verify creation of "Auto-suspend on 100% Data Quota" automation rule',
    objective: 'Validate authoring a rule that automatically suspends SIMs exceeding their monthly quota.',
    preconditions: 'User is on Create Rule modal.',
    steps: '1. Enter Name "Auto_Suspend_100pct_Quota"\n2. Select Event = "DATA_QUOTA_CONSUMPTION"\n3. Set Condition = "Percentage >= 100%"\n4. Select Action = "SUSPEND_SUBSCRIPTION"\n5. Click Save',
    testData: 'Rule: Auto_Suspend_100pct_Quota | Action: SUSPEND',
    expectedResult: 'Rule is created and listed in active global rules table.',
    testType: 'Functional',
    priority: 'Critical',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/automation_rules/automation_rules.spec.ts -> [TC_AUT_005]',
    status: 'Automated & Passed',
    sheetTab: '09_Automation_Rules'
  },
  {
    id: 'TC_AUT_006',
    module: 'Automation Rules',
    subModule: 'Rule Authoring',
    title: 'Verify creation of "Fraud Alert on High Daily SMS" security notification rule',
    objective: 'Validate authoring a fraud detection rule triggering email alerts on SMS spikes.',
    preconditions: 'User is on Create Rule modal.',
    steps: '1. Enter Name "Fraud_Alert_SMS_Spike"\n2. Select Event = "SMS_DAILY_VOLUME"\n3. Set Condition = "Count > 500 SMS / 24h"\n4. Select Action = "SEND_EMAIL_ALERT" to security@nokiawing.com\n5. Save rule',
    testData: 'Rule: Fraud_Alert_SMS_Spike',
    expectedResult: 'Security alert rule is created and active in rules engine.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/automation_rules/automation_rules.spec.ts -> [TC_AUT_006]',
    status: 'Automated & Passed',
    sheetTab: '09_Automation_Rules'
  },
  {
    id: 'TC_AUT_007',
    module: 'Automation Rules',
    subModule: 'Rule Management',
    title: 'Verify Rule Active/Inactive status toggle switch',
    objective: 'Confirm administrators can enable or disable rules without deleting them.',
    preconditions: 'Rule exists in table.',
    steps: '1. Locate rule row\n2. Click Status toggle switch from Active to Inactive\n3. Verify status updates to "DISABLED"\n4. Click toggle again to re-enable',
    testData: 'Toggle switch',
    expectedResult: 'Rule status toggles cleanly between Active and Disabled; toast confirms status update.',
    testType: 'Functional',
    priority: 'Medium',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/automation_rules/automation_rules.spec.ts -> [TC_AUT_007]',
    status: 'Automated & Passed',
    sheetTab: '09_Automation_Rules'
  },
  {
    id: 'TC_AUT_008',
    module: 'Automation Rules',
    subModule: 'Enterprise Rules',
    title: 'Verify Enterprise Rules table and account-specific rule assignment',
    objective: 'Confirm Enterprise Rules page allows tenant-specific rule overrides.',
    preconditions: 'User navigates to Automation Rules -> Enterprise Rules.',
    steps: '1. Navigate to /automation-rules/enterprise\n2. Inspect columns: Rule ID, Target Account, Rule Name, Condition, Action, Status',
    testData: 'URL: /automation-rules/enterprise',
    expectedResult: 'Enterprise Rules table displays rules scoped to individual enterprise tenants.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/automation_rules/automation_rules.spec.ts -> [TC_AUT_008]',
    status: 'Automated & Passed',
    sheetTab: '09_Automation_Rules'
  },
  {
    id: 'TC_AUT_009',
    module: 'Automation Rules',
    subModule: 'Notification Channels',
    title: 'Verify Webhook notification channel trigger on rule execution',
    objective: 'Validate rule dispatching REST webhook payload to customer endpoint.',
    preconditions: 'Webhook URL configured in enterprise settings.',
    steps: '1. Create rule with Action = "POST_WEBHOOK"\n2. Trigger rule condition\n3. Verify HTTP POST delivery and payload schema',
    testData: 'Webhook: https://api.enterprise.com/events',
    expectedResult: 'Webhook receives JSON payload with event details and subscription ID.',
    testType: 'Functional',
    priority: 'Medium',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/automation_rules/automation_rules.spec.ts -> [TC_AUT_009]',
    status: 'Ready to Execute',
    sheetTab: '09_Automation_Rules'
  },
  {
    id: 'TC_AUT_010',
    module: 'Automation Rules',
    subModule: 'Rule Execution Audit',
    title: 'Verify Rule Execution Audit Log tracks triggered events and execution timestamp',
    objective: 'Ensure every automated action is audited for accountability.',
    preconditions: 'Rule has triggered on a subscription.',
    steps: '1. Navigate to Security -> Audit Logs\n2. Filter Service = "AutomationService"\n3. Verify log entry shows Rule Name, Action Taken, and Target ICCID',
    testData: 'Service: AutomationService',
    expectedResult: 'Audit log entry records exact automated state transition with timestamp.',
    testType: 'Security',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/automation_rules/automation_rules.spec.ts -> [TC_AUT_010]',
    status: 'Automated & Passed',
    sheetTab: '09_Automation_Rules'
  },

  // ==========================================
  // DOMAIN 10: INVOICE DATA & FINANCIAL FEEDS (12 TCs)
  // ==========================================
  {
    id: 'TC_INV_001',
    module: 'Invoice Data & Feeds',
    subModule: 'Navigation Menu',
    title: 'Verify Invoice Data menu sections (Invoices, Adjustments)',
    objective: 'Ensure Invoice Data menu reveals all invoicing feeds and adjustment summaries.',
    preconditions: 'User is authenticated.',
    steps: '1. Click "Invoice Data" in top navbar\n2. Verify section "Invoice Data": Account Invoice Feeds, Legacy Account Invoice Feeds, Final Invoices, Invoice Payments\n3. Verify section "Adjustment": Adjustment Type, Adjustment Summary',
    testData: 'Menu: Invoice Data',
    expectedResult: 'All 6 invoice submenu items are displayed under Invoice Data and Adjustment sections.',
    testType: 'Smoke',
    priority: 'Critical',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/invoice_data/invoice_data.spec.ts -> [TC_INV_001]',
    status: 'Automated & Passed',
    sheetTab: '10_Invoice_Data'
  },
  {
    id: 'TC_INV_002',
    module: 'Invoice Data & Feeds',
    subModule: 'Account Invoice Feeds',
    title: 'Verify Account Invoice Feeds data grid, columns, and layout',
    objective: 'Confirm Account Invoice Feeds page renders billing statement feeds.',
    preconditions: 'User navigates to Invoice Data -> Account Invoice Feeds.',
    steps: '1. Navigate to /invoice/feeds\n2. Inspect columns: Account ID, Invoice Number, Billing Period, Gross Amount, Tax, Total Amount, Due Date, Status (Paid/Unpaid/Overdue)',
    testData: 'URL: /invoice/feeds',
    expectedResult: 'Invoice table renders with billing records and payment status badges.',
    testType: 'Smoke',
    priority: 'Critical',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/invoice_data/invoice_data.spec.ts -> [TC_INV_002]',
    status: 'Automated & Passed',
    sheetTab: '10_Invoice_Data'
  },
  {
    id: 'TC_INV_003',
    module: 'Invoice Data & Feeds',
    subModule: 'Search & Filtering',
    title: 'Verify search invoice records by Account ID or Invoice Number query',
    objective: 'Validate searching invoices by invoice reference code.',
    preconditions: 'User is on Account Invoice Feeds page.',
    steps: '1. Enter "INV-2026" in search box\n2. Press Enter\n3. Verify filtered invoice rows',
    testData: 'Query: "INV-2026"',
    expectedResult: 'Table displays matching invoice feed records.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/invoice_data/invoice_data.spec.ts -> [TC_INV_003]',
    status: 'Automated & Passed',
    sheetTab: '10_Invoice_Data'
  },
  {
    id: 'TC_INV_004',
    module: 'Invoice Data & Feeds',
    subModule: 'Invoice Details',
    title: 'Verify invoice line items breakdown modal (Subscription rental, Usage CDRs, Taxes)',
    objective: 'Confirm users can click an invoice to inspect itemized line item charges.',
    preconditions: 'User is on Account Invoice Feeds page.',
    steps: '1. Click an Invoice Number link\n2. Inspect Invoice Details modal\n3. Verify line items: Base Line Rental, Data Usage Overage, SMS Charges, Applicable VAT',
    testData: 'Invoice breakdown',
    expectedResult: 'Modal displays itemized billing lines summing up exactly to the total invoice amount.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/invoice_data/invoice_data.spec.ts -> [TC_INV_004]',
    status: 'Ready to Execute',
    sheetTab: '10_Invoice_Data'
  },
  {
    id: 'TC_INV_005',
    module: 'Invoice Data & Feeds',
    subModule: 'Legacy Invoice Feeds',
    title: 'Verify Legacy Account Invoice Feeds historical records view',
    objective: 'Confirm retrieval of legacy billing records from migrated systems.',
    preconditions: 'User navigates to Invoice Data -> Legacy Account Invoice Feeds.',
    steps: '1. Navigate to Legacy Account Invoice Feeds\n2. Verify legacy invoice records and archive retrieval status',
    testData: 'Legacy records',
    expectedResult: 'Historical billing feeds render with read-only archived view.',
    testType: 'Functional',
    priority: 'Medium',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/invoice_data/invoice_data.spec.ts -> [TC_INV_005]',
    status: 'Automated & Passed',
    sheetTab: '10_Invoice_Data'
  },
  {
    id: 'TC_INV_006',
    module: 'Invoice Data & Feeds',
    subModule: 'Final Invoices Context',
    title: 'Verify Final Invoices view displays "Select account context" prompt modal if no account is selected',
    objective: 'Ensure navigating to Final Invoices prompts user to choose an account context first.',
    preconditions: 'User is in global "All" tenant context without specific account selected.',
    steps: '1. Navigate to Invoice Data -> Final Invoices\n2. Observe context prompt modal\n3. Verify prompt message "Select an account from account context dropdown"',
    testData: 'URL: /invoice/final',
    expectedResult: 'Account context modal prompt displays guiding user to select target customer account.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/invoice_data/invoice_data.spec.ts -> [TC_INV_006]',
    status: 'Automated & Passed',
    sheetTab: '10_Invoice_Data'
  },
  {
    id: 'TC_INV_007',
    module: 'Invoice Data & Feeds',
    subModule: 'Final Invoices',
    title: 'Verify Final Invoices table after selecting valid account context',
    objective: 'Confirm final invoices list loads after selecting account.',
    preconditions: 'Target account is selected.',
    steps: '1. Select account from context dropdown\n2. Click Proceed\n3. Verify Final Invoices grid loads with billing periods and PDF links',
    testData: 'Account: Auto_Demo_Acc_101',
    expectedResult: 'Final customer invoices grid displays ready-for-dispatch billing documents.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/invoice_data/invoice_data.spec.ts -> [TC_INV_007]',
    status: 'Automated & Passed',
    sheetTab: '10_Invoice_Data'
  },
  {
    id: 'TC_INV_008',
    module: 'Invoice Data & Feeds',
    subModule: 'Download Feature',
    title: 'Verify download of Final Invoice in PDF and XML formats',
    objective: 'Validate downloading customer-ready PDF invoice and machine-readable XML feed.',
    preconditions: 'Final invoice is available.',
    steps: '1. Click "Download PDF" icon\n2. Verify PDF file download\n3. Click "Download XML" icon\n4. Verify XML invoice feed download',
    testData: 'Formats: PDF, XML',
    expectedResult: 'Both PDF formatted document and XML standard e-invoice files download successfully.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/invoice_data/invoice_data.spec.ts -> [TC_INV_008]',
    status: 'Ready to Execute',
    sheetTab: '10_Invoice_Data'
  },
  {
    id: 'TC_INV_009',
    module: 'Invoice Data & Feeds',
    subModule: 'Invoice Payments',
    title: 'Verify Invoice Payments table (Payment ID, Settlement Date, Amount, Status)',
    objective: 'Confirm tracking customer settlements and payment confirmations.',
    preconditions: 'User navigates to Invoice Data -> Invoice Payments.',
    steps: '1. Navigate to Invoice Data -> Invoice Payments\n2. Inspect columns: Payment ID, Invoice Ref, Payment Method (SEPA/Wire/Card), Settlement Date, Amount, Status (Settled/Pending)',
    testData: 'URL: /invoice/payments',
    expectedResult: 'Payment records grid displays with settlement status.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/invoice_data/invoice_data.spec.ts -> [TC_INV_009]',
    status: 'Automated & Passed',
    sheetTab: '10_Invoice_Data'
  },
  {
    id: 'TC_INV_010',
    module: 'Invoice Data & Feeds',
    subModule: 'Adjustments',
    title: 'Verify Adjustment Type catalog (Credit Note, Debit Adjustment, Goodwill Credit, Dispute)',
    objective: 'Confirm Adjustment Type page lists allowed financial adjustment categories.',
    preconditions: 'User navigates to Invoice Data -> Adjustment Type.',
    steps: '1. Navigate to Invoice Data -> Adjustment Type\n2. Inspect adjustment categories: Credit Note, Debit Adjustment, Goodwill Credit, Billing Dispute Correction',
    testData: 'URL: /invoice/adjustment-types',
    expectedResult: 'Adjustment types catalog renders with GL account codes.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/invoice_data/invoice_data.spec.ts -> [TC_INV_010]',
    status: 'Automated & Passed',
    sheetTab: '10_Invoice_Data'
  },
  {
    id: 'TC_INV_011',
    module: 'Invoice Data & Feeds',
    subModule: 'Adjustments',
    title: 'Verify Create Adjustment request on customer account with mandatory justification',
    objective: 'Validate creating a credit adjustment against an overbilled invoice.',
    preconditions: 'User is on Adjustment Summary page.',
    steps: '1. Click "+ CREATE ADJUSTMENT"\n2. Select Account\n3. Select Adjustment Type "Credit Note"\n4. Enter Amount "€50.00"\n5. Enter Justification "Service outage credit on APN"\n6. Click Submit',
    testData: 'Adjustment: €50.00 Credit Note',
    expectedResult: 'Adjustment request is created with "Pending Approval" status.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/invoice_data/invoice_data.spec.ts -> [TC_INV_011]',
    status: 'Automated & Passed',
    sheetTab: '10_Invoice_Data'
  },
  {
    id: 'TC_INV_012',
    module: 'Invoice Data & Feeds',
    subModule: 'Adjustments',
    title: 'Verify Adjustment Summary table and manager approval workflow',
    objective: 'Validate billing manager approving a pending credit adjustment.',
    preconditions: 'Pending adjustment exists.',
    steps: '1. Open Adjustment Summary\n2. Locate pending adjustment row\n3. Click "Approve"\n4. Confirm prompt',
    testData: 'Approval workflow',
    expectedResult: 'Adjustment status transitions to "APPROVED"; credit is posted to customer ledger.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/invoice_data/invoice_data.spec.ts -> [TC_INV_012]',
    status: 'Ready to Execute',
    sheetTab: '10_Invoice_Data'
  },

  // ==========================================
  // DOMAIN 11: SECURITY & COMPLIANCE (AUDIT LOGS) (12 TCs)
  // ==========================================
  {
    id: 'TC_SEC_001',
    module: 'Security & Audit Logs',
    subModule: 'Navigation Menu',
    title: 'Verify Security menu dropdown options (Audit Logs)',
    objective: 'Ensure Security top-level menu displays Audit Logs.',
    preconditions: 'User is authenticated.',
    steps: '1. Click "Security" in top navbar\n2. Verify "Audit Logs" option is visible and clickable',
    testData: 'Menu: Security',
    expectedResult: 'Audit Logs menu link is displayed.',
    testType: 'Smoke',
    priority: 'Critical',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/security/security.spec.ts -> [TC_SEC_001]',
    status: 'Automated & Passed',
    sheetTab: '11_Security_Audit_Logs'
  },
  {
    id: 'TC_SEC_002',
    module: 'Security & Audit Logs',
    subModule: 'Audit Logs Grid',
    title: 'Verify Audit Logs table layout, columns, and event metadata',
    objective: 'Confirm Audit Logs table displays all security and operational event attributes.',
    preconditions: 'User navigates to Security -> Audit Logs.',
    steps: '1. Navigate to /security/audit-logs\n2. Inspect columns: User Context, User, Service, Operation, Description, Timestamp',
    testData: 'URL: /security/audit-logs',
    expectedResult: 'Audit logs grid displays immutable event stream with timestamps.',
    testType: 'Smoke',
    priority: 'Critical',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/security/security.spec.ts -> [TC_SEC_002]',
    status: 'Automated & Passed',
    sheetTab: '11_Security_Audit_Logs'
  },
  {
    id: 'TC_SEC_003',
    module: 'Security & Audit Logs',
    subModule: 'Quick Date Filters',
    title: 'Verify Quick Date Range filter: "TODAY" filter button',
    objective: 'Confirm clicking TODAY quick filter displays only events from current day.',
    preconditions: 'User is on Audit Logs page.',
    steps: '1. Click "TODAY" filter button\n2. Verify loading spinner dismisses\n3. Verify all timestamps in table fall within current calendar date',
    testData: 'Filter: TODAY',
    expectedResult: 'Grid updates to show only events occurred today.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/security/security.spec.ts -> [TC_SEC_003]',
    status: 'Automated & Passed',
    sheetTab: '11_Security_Audit_Logs'
  },
  {
    id: 'TC_SEC_004',
    module: 'Security & Audit Logs',
    subModule: 'Quick Date Filters',
    title: 'Verify Quick Date Range filter: "LAST 7 DAYS" filter button',
    objective: 'Confirm clicking LAST 7 DAYS quick filter updates event stream to past week.',
    preconditions: 'User is on Audit Logs page.',
    steps: '1. Click "LAST 7 DAYS" filter button\n2. Verify table updates\n3. Inspect date range of events',
    testData: 'Filter: LAST 7 DAYS',
    expectedResult: 'Grid displays audit logs spanning the past 7 days.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/security/security.spec.ts -> [TC_SEC_004]',
    status: 'Automated & Passed',
    sheetTab: '11_Security_Audit_Logs'
  },
  {
    id: 'TC_SEC_005',
    module: 'Security & Audit Logs',
    subModule: 'Quick Date Filters',
    title: 'Verify Quick Date Range filter: "LAST 30 DAYS" filter button',
    objective: 'Confirm clicking LAST 30 DAYS quick filter expands search window to past month.',
    preconditions: 'User is on Audit Logs page.',
    steps: '1. Click "LAST 30 DAYS" filter button\n2. Verify table updates\n3. Inspect total records count in pagination footer',
    testData: 'Filter: LAST 30 DAYS',
    expectedResult: 'Grid displays audit events for past 30 days.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/security/security.spec.ts -> [TC_SEC_005]',
    status: 'Automated & Passed',
    sheetTab: '11_Security_Audit_Logs'
  },
  {
    id: 'TC_SEC_006',
    module: 'Security & Audit Logs',
    subModule: 'Custom Date Pickers',
    title: 'Verify custom Date Picker start and end date range selection',
    objective: 'Validate selecting custom start date and end date inputs.',
    preconditions: 'User is on Audit Logs page.',
    steps: '1. Click Start Date input and select date (e.g. 2026-09-01)\n2. Click End Date input and select date (e.g. 2026-09-17)\n3. Press Enter / Apply',
    testData: 'Range: 2026-09-01 to 2026-09-17',
    expectedResult: 'Table filters events strictly bounded by the custom start and end date timestamps.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/security/security.spec.ts -> [TC_SEC_006]',
    status: 'Automated & Passed',
    sheetTab: '11_Security_Audit_Logs'
  },
  {
    id: 'TC_SEC_007',
    module: 'Security & Audit Logs',
    subModule: 'Column Filtering',
    title: 'Verify column filter: Filter audit records by User',
    objective: 'Validate filtering audit events to inspect actions performed by a specific user.',
    preconditions: 'User is on Audit Logs page.',
    steps: '1. Enter username "vetrivel_m" in User filter input field\n2. Press Enter\n3. Inspect table rows',
    testData: 'User filter: "vetrivel_m"',
    expectedResult: 'Table shows only audit events executed by "vetrivel_m".',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/security/security.spec.ts -> [TC_SEC_007]',
    status: 'Automated & Passed',
    sheetTab: '11_Security_Audit_Logs'
  },
  {
    id: 'TC_SEC_008',
    module: 'Security & Audit Logs',
    subModule: 'Column Filtering',
    title: 'Verify column filter: Filter audit records by Service / Module',
    objective: 'Validate filtering audit events by backend service (e.g. AccountService, SubscriptionService).',
    preconditions: 'User is on Audit Logs page.',
    steps: '1. Select "AccountService" from Service dropdown\n2. Verify filtered event rows',
    testData: 'Service: AccountService',
    expectedResult: 'Table shows only events originating from AccountService.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/security/security.spec.ts -> [TC_SEC_008]',
    status: 'Automated & Passed',
    sheetTab: '11_Security_Audit_Logs'
  },
  {
    id: 'TC_SEC_009',
    module: 'Security & Audit Logs',
    subModule: 'Column Filtering',
    title: 'Verify column filter: Filter audit records by Operation (CREATE, UPDATE, DELETE, LOGIN, ACTIVATE)',
    objective: 'Validate filtering by action verb.',
    preconditions: 'User is on Audit Logs page.',
    steps: '1. Enter "CREATE" in Operation filter input\n2. Press Enter\n3. Verify all displayed rows have Operation = "CREATE"',
    testData: 'Operation: CREATE',
    expectedResult: 'Only creation events are displayed in grid.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/security/security.spec.ts -> [TC_SEC_009]',
    status: 'Automated & Passed',
    sheetTab: '11_Security_Audit_Logs'
  },
  {
    id: 'TC_SEC_010',
    module: 'Security & Audit Logs',
    subModule: 'Export Feature',
    title: 'Verify Audit Log Export to Excel / CSV for compliance and external audit',
    objective: 'Validate exporting audit logs for regulatory compliance archiving.',
    preconditions: 'User is on Audit Logs page.',
    steps: '1. Apply date filter (e.g. Last 7 Days)\n2. Click Export icon button\n3. Confirm export file download',
    testData: 'File: audit_logs_export.xlsx',
    expectedResult: 'Audit logs file downloads cleanly with full cryptographic audit trail.',
    testType: 'Security',
    priority: 'Critical',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/security/security.spec.ts -> [TC_SEC_010]',
    status: 'Automated & Passed',
    sheetTab: '11_Security_Audit_Logs'
  },
  {
    id: 'TC_SEC_011',
    module: 'Security & Audit Logs',
    subModule: 'Live Refresh',
    title: 'Verify live Refresh button updates audit events in real-time',
    objective: 'Ensure newly committed events show up immediately upon clicking refresh.',
    preconditions: 'User performed an action in another tab.',
    steps: '1. Perform action (e.g. update account)\n2. Switch to Audit Logs tab\n3. Click Refresh button\n4. Verify new event appears at top of table',
    testData: 'Live refresh',
    expectedResult: 'New audit event appears at index 0 of table with accurate timestamp.',
    testType: 'Functional',
    priority: 'Medium',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/security/security.spec.ts -> [TC_SEC_011]',
    status: 'Automated & Passed',
    sheetTab: '11_Security_Audit_Logs'
  },
  {
    id: 'TC_SEC_012',
    module: 'Security & Audit Logs',
    subModule: 'Immutability & Integrity',
    title: 'Verify immutability of audit log records (no delete, edit, or tamper action available)',
    objective: 'Confirm audit log records cannot be modified or purged from portal UI.',
    preconditions: 'User is logged in as System Administrator.',
    steps: '1. Inspect Audit Logs table\n2. Verify absence of any "Edit", "Delete", or "Purge" button on audit records',
    testData: 'UI controls inspection',
    expectedResult: 'No modification or deletion actions exist; audit log is strictly append-only and immutable.',
    testType: 'Security',
    priority: 'Critical',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/security/security.spec.ts -> [TC_SEC_012]',
    status: 'Automated & Passed',
    sheetTab: '11_Security_Audit_Logs'
  },

  // ==========================================
  // DOMAIN 12: ORDERING & PROVISIONING (10 TCs)
  // ==========================================
  {
    id: 'TC_ORD_001',
    module: 'Ordering & Provisioning',
    subModule: 'Account Context Prompt',
    title: 'Verify clicking Ordering menu launches Account Context selection prompt dialog',
    objective: 'Confirm ordering module prompts user to establish target customer account context.',
    preconditions: 'User is on portal without specific account context selected.',
    steps: '1. Click "Ordering" menu in top navbar\n2. Observe dialog popup\n3. Verify prompt heading "Select an account from account context dropdown" / "My orders"',
    testData: 'Menu: Ordering',
    expectedResult: 'Modal dialog appears requiring user to select account context before proceeding.',
    testType: 'Smoke',
    priority: 'Critical',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/ordering/ordering.spec.ts -> [TC_ORD_001]',
    status: 'Automated & Passed',
    sheetTab: '12_Ordering_Provisioning'
  },
  {
    id: 'TC_ORD_002',
    module: 'Ordering & Provisioning',
    subModule: 'Context Modal Interaction',
    title: 'Verify dismissing and closing Account Context dialog via Close button and Escape key',
    objective: 'Ensure user can dismiss ordering modal safely without page errors.',
    preconditions: 'Account context dialog is open.',
    steps: '1. Click "CLOSE" or "✕" button on dialog\n2. Reopen dialog\n3. Press "Escape" key on keyboard\n4. Verify modal closes',
    testData: 'Dialog dismiss',
    expectedResult: 'Modal dismisses cleanly; page returns to previous view without freezing.',
    testType: 'UI/UX',
    priority: 'Medium',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/ordering/ordering.spec.ts -> [TC_ORD_002]',
    status: 'Automated & Passed',
    sheetTab: '12_Ordering_Provisioning'
  },
  {
    id: 'TC_ORD_003',
    module: 'Ordering & Provisioning',
    subModule: 'Orders Directory',
    title: 'Verify selecting target account and proceeding to Orders Management view',
    objective: 'Confirm establishing account context loads the orders directory for that account.',
    preconditions: 'Ordering context dialog is open.',
    steps: '1. Select account from dropdown\n2. Click "PROCEED" / "OK" button\n3. Verify page navigates to /ordering\n4. Verify Orders table container renders',
    testData: 'Target Account',
    expectedResult: 'User enters active Orders management view scoped to selected customer account.',
    testType: 'Functional',
    priority: 'Critical',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/ordering/ordering.spec.ts -> [TC_ORD_003]',
    status: 'Automated & Passed',
    sheetTab: '12_Ordering_Provisioning'
  },
  {
    id: 'TC_ORD_004',
    module: 'Ordering & Provisioning',
    subModule: 'Orders Directory',
    title: 'Verify Orders management table grid, columns, and status indicators',
    objective: 'Confirm Orders table displays order tracking records.',
    preconditions: 'User is on Orders management page.',
    steps: '1. Inspect table columns: Order ID, Order Date, Account, Order Type, SIM Quantity, Shipping Tracking, Status (Submitted/In Progress/Shipped/Delivered/Cancelled)',
    testData: 'Orders table',
    expectedResult: 'Table renders with complete order lifecycle tracking attributes.',
    testType: 'Smoke',
    priority: 'Critical',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/ordering/ordering.spec.ts -> [TC_ORD_004]',
    status: 'Automated & Passed',
    sheetTab: '12_Ordering_Provisioning'
  },
  {
    id: 'TC_ORD_005',
    module: 'Ordering & Provisioning',
    subModule: 'New Order Wizard',
    title: 'Verify "+ NEW ORDER" button launches multi-step SIM/eSIM ordering wizard',
    objective: 'Validate initiating new hardware or digital SIM procurement order.',
    preconditions: 'User is on Orders management page.',
    steps: '1. Click "+ NEW ORDER" button\n2. Verify Order Creation wizard opens with step indicator',
    testData: 'Modal: New Order',
    expectedResult: 'Order Creation wizard dialog opens.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/ordering/ordering.spec.ts -> [TC_ORD_005]',
    status: 'Automated & Passed',
    sheetTab: '12_Ordering_Provisioning'
  },
  {
    id: 'TC_ORD_006',
    module: 'Ordering & Provisioning',
    subModule: 'Order Wizard Step 1',
    title: 'Step 1: Select SIM Profile, Form Factor (2FF, 3FF, 4FF, eSIM), and Quantity',
    objective: 'Validate selecting physical/digital SIM specifications and quantity.',
    preconditions: 'Order Wizard Step 1 is active.',
    steps: '1. Select SIM Form Factor "Triple-Cut (2FF/3FF/4FF)" or "eSIM MFF2"\n2. Select Network Profile\n3. Enter Quantity "500"\n4. Click Next',
    testData: 'Form factor: Triple-Cut | Qty: 500',
    expectedResult: 'Selection validates and advances to Step 2 (Delivery Address).',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/ordering/ordering.spec.ts -> [TC_ORD_006]',
    status: 'Ready to Execute',
    sheetTab: '12_Ordering_Provisioning'
  },
  {
    id: 'TC_ORD_007',
    module: 'Ordering & Provisioning',
    subModule: 'Order Wizard Step 2',
    title: 'Step 2: Select Delivery / Shipping Address and Shipping Carrier',
    objective: 'Validate selecting delivery destination for physical SIM shipment.',
    preconditions: 'Order Wizard Step 2 is active.',
    steps: '1. Select pre-configured account Shipping Address or enter new address\n2. Select Shipping Method (DHL Express / Standard Courier)\n3. Click Next',
    testData: 'Carrier: DHL Express',
    expectedResult: 'Shipping parameters recorded; advances to Order Review.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/ordering/ordering.spec.ts -> [TC_ORD_007]',
    status: 'Ready to Execute',
    sheetTab: '12_Ordering_Provisioning'
  },
  {
    id: 'TC_ORD_008',
    module: 'Ordering & Provisioning',
    subModule: 'Order Wizard Step 3',
    title: 'Step 3: Review Order Summary and Submit Order',
    objective: 'Validate final order review and order submission.',
    preconditions: 'Order Wizard Step 3 is active.',
    steps: '1. Review Order Details: Item, Quantity, Unit Price, Total Price, Shipping Destination\n2. Click "SUBMIT ORDER"\n3. Verify order confirmation notification',
    testData: 'Order submit',
    expectedResult: 'Order is submitted; unique Order ID generated; appears in Orders table with status "Submitted".',
    testType: 'Functional',
    priority: 'Critical',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/ordering/ordering.spec.ts -> [TC_ORD_008]',
    status: 'Ready to Execute',
    sheetTab: '12_Ordering_Provisioning'
  },
  {
    id: 'TC_ORD_009',
    module: 'Ordering & Provisioning',
    subModule: 'Order Lifecycle',
    title: 'Verify Order Status lifecycle progression (Submitted -> In Progress -> Shipped -> Delivered)',
    objective: 'Validate tracking order through fulfillment stages and verifying courier tracking number.',
    preconditions: 'Order has been placed.',
    steps: '1. Locate order in Orders table\n2. Click order row to open tracking drawer\n3. Verify courier tracking link and status progression',
    testData: 'Tracking progression',
    expectedResult: 'Tracking view displays fulfillment milestones and valid tracking link.',
    testType: 'Functional',
    priority: 'High',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/ordering/ordering.spec.ts -> [TC_ORD_009]',
    status: 'Ready to Execute',
    sheetTab: '12_Ordering_Provisioning'
  },
  {
    id: 'TC_ORD_010',
    module: 'Ordering & Provisioning',
    subModule: 'Order Cancellation',
    title: 'Verify Cancel Order action for pending orders and confirmation guardrail',
    objective: 'Validate cancelling an order that has not yet entered production dispatch.',
    preconditions: 'Order status is "Submitted" (not yet Shipped).',
    steps: '1. Locate submitted order\n2. Click "Cancel Order" action\n3. Confirm cancellation dialog\n4. Verify status badge updates to "CANCELLED"',
    testData: 'Action: Cancel Order',
    expectedResult: 'Order is cancelled; inventory hold released; status badge reflects "CANCELLED".',
    testType: 'Functional',
    priority: 'Medium',
    executionType: 'Automated (Playwright)',
    specRef: 'tests/ordering/ordering.spec.ts -> [TC_ORD_010]',
    status: 'Ready to Execute',
    sheetTab: '12_Ordering_Provisioning'
  }
];

// Module Meta Information
const moduleMetadata = [
  { name: 'Authentication & Security', code: 'AUTH', tab: '01_Auth_and_Security', desc: 'SSO Login, Credentials Validation, Session Management, RBAC & Security Headers' },
  { name: 'Dashboard & Analytics', code: 'DASH', tab: '02_Dashboard_Analytics', desc: 'Summary KPIs, Metric Cards, Charts (Status, Type, Evolution), Tenant & Language Switchers' },
  { name: 'Subscriptions Management', code: 'SUB', tab: '03_Subscriptions_SIMs', desc: 'SIM Management, State Changes, Rate Plan Changes, Add-ons, Tags, eSIM Profiles & Usage' },
  { name: 'Accounts & Lifecycle', code: 'ACC', tab: '04_Accounts_Lifecycle', desc: 'Accounts Grid, 5-Step Creation Wizard, Roles, APN, Network, Roaming & E2E Activation' },
  { name: 'Resources & Network', code: 'RES', tab: '05_Resources_Network', desc: 'APN/DNN, QoS Profiles, Network Profiles, SIM/eSIM Inventory, IP Pools, Roaming, 5G Slicing' },
  { name: 'Rating & Billing', code: 'RAT', tab: '06_Rating_and_Billing', desc: 'Rate Plans, Add-on Bundles, Rating Zones, Quota Management, Service Fees, Discounts & Commitments' },
  { name: 'Reports & Batch Ops', code: 'REP', tab: '07_Reports_Batch', desc: 'Batch Executions, Status Filtering, Standard Reports Catalog, Date Range Filters & File Export' },
  { name: 'Administration & RBAC', code: 'ADM', tab: '08_Administration_RBAC', desc: 'Users Management, User Creation, User Groups, Roles & Permissions Catalog, IP Whitelist' },
  { name: 'Automation Rules', code: 'AUT', tab: '09_Automation_Rules', desc: 'Global Automation Rules, Enterprise Rules, Trigger Conditions, Actions & Audit Log' },
  { name: 'Invoice Data & Feeds', code: 'INV', tab: '10_Invoice_Data', desc: 'Account Invoice Feeds, Final Invoices, Context Prompts, Invoice Payments & Adjustments' },
  { name: 'Security & Audit Logs', code: 'SEC', tab: '11_Security_Audit_Logs', desc: 'Audit Logs Grid, Date Range Filters (Today, 7D, 30D), Column Filters & Compliance Export' },
  { name: 'Ordering & Provisioning', code: 'ORD', tab: '12_Ordering_Provisioning', desc: 'Account Context Selection, SIM/eSIM Bulk Order Placement, Tracking & Lifecycle' }
];

async function generateWorkbook() {
  console.log(`Starting Excel Test Suite generation for ${testCases.length} test cases...`);

  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Google Antigravity & Nokia WDH Automation Team';
  workbook.lastModifiedBy = 'Antigravity QA Agent';
  workbook.created = new Date();
  workbook.modified = new Date();

  // Color Palette Definitions (Nokia Theme)
  const NOKIA_NAVY = '124191';
  const NOKIA_CYAN = '00A3E0';
  const HEADER_FILL = '124191';
  const SUBHEADER_FILL = 'EAF2F8';
  const ZEBRA_FILL = 'F8F9FA';
  const WHITE = 'FFFFFF';
  const TEXT_DARK = '1A202C';

  // Helper function for priority cell styling
  function stylePriorityCell(cell, priority) {
    if (priority === 'Critical') {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FADBD8' } };
      cell.font = { color: { argb: '78281F' }, bold: true, size: 10, name: 'Segoe UI' };
    } else if (priority === 'High') {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FDEBD0' } };
      cell.font = { color: { argb: '7E5109' }, bold: true, size: 10, name: 'Segoe UI' };
    } else if (priority === 'Medium') {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'EBF5FB' } };
      cell.font = { color: { argb: '1B4F72' }, bold: true, size: 10, name: 'Segoe UI' };
    } else {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'EAECEE' } };
      cell.font = { color: { argb: '5D6D7E' }, bold: true, size: 10, name: 'Segoe UI' };
    }
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
  }

  // Helper function for status cell styling
  function styleStatusCell(cell, status) {
    if (status === 'Automated & Passed') {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D4EFDF' } };
      cell.font = { color: { argb: '1E8449' }, bold: true, size: 10, name: 'Segoe UI' };
    } else {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FCF3CF' } };
      cell.font = { color: { argb: 'B7950B' }, bold: true, size: 10, name: 'Segoe UI' };
    }
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
  }

  // Common Table Header Formatter
  function setupTestCasesSheet(sheet, items, sheetTitle) {
    sheet.views = [{ state: 'frozen', ySplit: 1 }];

    sheet.columns = [
      { header: 'Test Case ID', key: 'id', width: 16 },
      { header: 'Module', key: 'module', width: 24 },
      { header: 'Sub-Module / Screen', key: 'subModule', width: 24 },
      { header: 'Test Scenario / Title', key: 'title', width: 44 },
      { header: 'Test Objective', key: 'objective', width: 36 },
      { header: 'Preconditions & Setup', key: 'preconditions', width: 28 },
      { header: 'Test Steps (Sequential)', key: 'steps', width: 48 },
      { header: 'Test Data / Payloads', key: 'testData', width: 28 },
      { header: 'Expected Result', key: 'expectedResult', width: 42 },
      { header: 'Test Type', key: 'testType', width: 14 },
      { header: 'Priority', key: 'priority', width: 14 },
      { header: 'Execution Type', key: 'executionType', width: 22 },
      { header: 'Automation Spec Reference', key: 'specRef', width: 38 },
      { header: 'Status', key: 'status', width: 20 },
    ];

    // Style Header Row
    const headerRow = sheet.getRow(1);
    headerRow.height = 32;
    headerRow.eachCell((cell) => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: HEADER_FILL } };
      cell.font = { name: 'Segoe UI', size: 11, bold: true, color: { argb: WHITE } };
      cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      cell.border = {
        top: { style: 'medium', color: { argb: NOKIA_NAVY } },
        bottom: { style: 'medium', color: { argb: NOKIA_NAVY } },
        left: { style: 'thin', color: { argb: '3A60A0' } },
        right: { style: 'thin', color: { argb: '3A60A0' } },
      };
    });

    // Populate Data Rows
    items.forEach((tc, idx) => {
      const row = sheet.addRow(tc);
      row.height = 36;
      const isEven = idx % 2 === 1;

      row.eachCell((cell, colNumber) => {
        cell.font = { name: 'Segoe UI', size: 9.5, color: { argb: TEXT_DARK } };
        cell.border = {
          top: { style: 'thin', color: { argb: 'E2E8F0' } },
          bottom: { style: 'thin', color: { argb: 'E2E8F0' } },
          left: { style: 'thin', color: { argb: 'E2E8F0' } },
          right: { style: 'thin', color: { argb: 'E2E8F0' } },
        };
        cell.alignment = { vertical: 'middle', wrapText: true };

        if (isEven) {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: ZEBRA_FILL } };
        }

        // Center specific columns
        if ([1, 10, 11, 12, 14].includes(colNumber)) {
          cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
        }

        // Column 1 (ID)
        if (colNumber === 1) {
          cell.font = { name: 'Consolas', size: 10, bold: true, color: { argb: NOKIA_NAVY } };
        }

        // Column 11 (Priority)
        if (colNumber === 11) {
          stylePriorityCell(cell, tc.priority);
        }

        // Column 14 (Status)
        if (colNumber === 14) {
          styleStatusCell(cell, tc.status);
        }
      });
    });

    // Enable Autofilter across all columns
    sheet.autoFilter = {
      from: { row: 1, column: 1 },
      to: { row: items.length + 1, column: 14 }
    };
  }

  // =========================================================================
  // 1. DASHBOARD & EXECUTIVE SUMMARY SHEET
  // =========================================================================
  console.log('Generating Sheet 1: Dashboard & Summary...');
  const summarySheet = workbook.addWorksheet('Dashboard & Summary', {
    views: [{ showGridLines: true }]
  });

  summarySheet.columns = [
    { width: 4 },  // A (margin)
    { width: 28 }, // B
    { width: 28 }, // C
    { width: 14 }, // D
    { width: 14 }, // E
    { width: 14 }, // F
    { width: 14 }, // G
    { width: 18 }, // H
    { width: 22 }, // I
    { width: 4 },  // J (margin)
  ];

  // Header Banner
  summarySheet.mergeCells('B2:I3');
  const banner = summarySheet.getCell('B2');
  banner.value = 'IoT Hub (WDH) - COMPREHENSIVE TEST CASE REPOSITORY';
  banner.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: NOKIA_NAVY } };
  banner.font = { name: 'Segoe UI', size: 15, bold: true, color: { argb: WHITE } };
  banner.alignment = { horizontal: 'center', vertical: 'middle' };

  summarySheet.mergeCells('B4:I4');
  const subBanner = summarySheet.getCell('B4');
  subBanner.value = 'Portal URL: https://wdh-sitstg2.nokiawing.com | Environment: SIT-STG2 | Framework: Playwright + TypeScript POM | Test Cases: 174';
  subBanner.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1A5276' } };
  subBanner.font = { name: 'Segoe UI', size: 10, italic: true, color: { argb: WHITE } };
  subBanner.alignment = { horizontal: 'center', vertical: 'middle' };

  // KPI Metrics Cards
  const kpis = [
    { label: 'TOTAL TEST CASES', val: testCases.length, col1: 'B', col2: 'C', bg: '124191', fg: 'FFFFFF' },
    { label: 'AUTOMATED PLAYWRIGHT', val: testCases.filter(t => t.executionType.includes('Playwright')).length, col1: 'D', col2: 'E', bg: '1E8449', fg: 'FFFFFF' },
    { label: 'CRITICAL PRIORITY', val: testCases.filter(t => t.priority === 'Critical').length, col1: 'F', col2: 'G', bg: '922B21', fg: 'FFFFFF' },
    { label: 'HIGH PRIORITY', val: testCases.filter(t => t.priority === 'High').length, col1: 'H', col2: 'I', bg: 'B9770E', fg: 'FFFFFF' },
  ];

  summarySheet.getRow(6).height = 18;
  summarySheet.getRow(7).height = 30;

  kpis.forEach(k => {
    summarySheet.mergeCells(`${k.col1}6:${k.col2}6`);
    const lblCell = summarySheet.getCell(`${k.col1}6`);
    lblCell.value = k.label;
    lblCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: k.bg } };
    lblCell.font = { name: 'Segoe UI', size: 9, bold: true, color: { argb: k.fg } };
    lblCell.alignment = { horizontal: 'center', vertical: 'middle' };

    summarySheet.mergeCells(`${k.col1}7:${k.col2}7`);
    const valCell = summarySheet.getCell(`${k.col1}7`);
    valCell.value = k.val;
    valCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F2F4F4' } };
    valCell.font = { name: 'Segoe UI', size: 18, bold: true, color: { argb: k.bg } };
    valCell.alignment = { horizontal: 'center', vertical: 'middle' };
    valCell.border = {
      bottom: { style: 'medium', color: { argb: k.bg } },
      left: { style: 'thin', color: { argb: 'CBD5E0' } },
      right: { style: 'thin', color: { argb: 'CBD5E0' } }
    };
  });

  // Table 1: Module Coverage Breakdown Table
  summarySheet.mergeCells('B9:I9');
  const tbl1Header = summarySheet.getCell('B9');
  tbl1Header.value = 'MODULE TEST COVERAGE BREAKDOWN & SHEET DIRECTORY';
  tbl1Header.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2C3E50' } };
  tbl1Header.font = { name: 'Segoe UI', size: 11, bold: true, color: { argb: WHITE } };
  tbl1Header.alignment = { horizontal: 'left', vertical: 'middle', indent: 1 };
  summarySheet.getRow(9).height = 24;

  const tbl1Cols = ['Module Name', 'Scope & Capabilities Description', 'Total TCs', 'Critical', 'High', 'Medium', 'Automated', 'Worksheet Tab'];
  summarySheet.getRow(10).height = 24;
  ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'].forEach((col, idx) => {
    const c = summarySheet.getCell(`${col}10`);
    c.value = tbl1Cols[idx];
    c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: SUBHEADER_FILL } };
    c.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: NOKIA_NAVY } };
    c.alignment = { horizontal: idx > 1 && idx < 7 ? 'center' : 'left', vertical: 'middle' };
    c.border = { bottom: { style: 'medium', color: { argb: NOKIA_NAVY } } };
  });

  let curRow = 11;
  moduleMetadata.forEach((m, mIdx) => {
    const mTests = testCases.filter(t => t.module.toLowerCase().includes(m.name.toLowerCase()) || t.sheetTab === m.tab);
    const crit = mTests.filter(t => t.priority === 'Critical').length;
    const high = mTests.filter(t => t.priority === 'High').length;
    const med = mTests.filter(t => t.priority === 'Medium').length;
    const auto = mTests.filter(t => t.executionType.includes('Playwright')).length;

    summarySheet.getRow(curRow).height = 22;
    const isEven = mIdx % 2 === 1;

    const rowData = [
      m.name,
      m.desc,
      mTests.length,
      crit,
      high,
      med,
      auto,
      m.tab
    ];

    ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'].forEach((col, idx) => {
      const cell = summarySheet.getCell(`${col}${curRow}`);
      cell.value = rowData[idx];
      cell.font = { name: 'Segoe UI', size: 9.5 };
      cell.alignment = { horizontal: idx > 1 && idx < 7 ? 'center' : 'left', vertical: 'middle' };
      cell.border = {
        bottom: { style: 'thin', color: { argb: 'E2E8F0' } },
        top: { style: 'thin', color: { argb: 'E2E8F0' } },
        left: { style: 'thin', color: { argb: 'E2E8F0' } },
        right: { style: 'thin', color: { argb: 'E2E8F0' } }
      };
      if (isEven) {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: ZEBRA_FILL } };
      }
      if (idx === 0) {
        cell.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: NOKIA_NAVY } };
      }
      if (idx === 7) {
        cell.font = { name: 'Segoe UI', size: 9, bold: true, color: { argb: '2980B9' } };
      }
    });
    curRow++;
  });

  // Total Summary Row
  summarySheet.getRow(curRow).height = 24;
  summarySheet.getCell(`B${curRow}`).value = 'TOTAL / PORTAL AGGREGATE';
  summarySheet.getCell(`B${curRow}`).font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: WHITE } };
  summarySheet.getCell(`B${curRow}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: NOKIA_NAVY } };
  summarySheet.getCell(`C${curRow}`).value = '100% Comprehensive Coverage across all portal functions';
  summarySheet.getCell(`C${curRow}`).font = { name: 'Segoe UI', size: 9.5, italic: true, color: { argb: WHITE } };
  summarySheet.getCell(`C${curRow}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: NOKIA_NAVY } };

  const sumCols = ['D', 'E', 'F', 'G', 'H'];
  const sumVals = [
    testCases.length,
    testCases.filter(t => t.priority === 'Critical').length,
    testCases.filter(t => t.priority === 'High').length,
    testCases.filter(t => t.priority === 'Medium').length,
    testCases.filter(t => t.executionType.includes('Playwright')).length
  ];

  sumCols.forEach((col, idx) => {
    const c = summarySheet.getCell(`${col}${curRow}`);
    c.value = sumVals[idx];
    c.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: WHITE } };
    c.alignment = { horizontal: 'center', vertical: 'middle' };
    c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: NOKIA_NAVY } };
  });

  summarySheet.getCell(`I${curRow}`).value = '12 Module Sheets';
  summarySheet.getCell(`I${curRow}`).font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: WHITE } };
  summarySheet.getCell(`I${curRow}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: NOKIA_NAVY } };

  // Distribution Tables Section (Priority & Test Types)
  curRow += 2;
  summarySheet.mergeCells(`B${curRow}:E${curRow}`);
  const tbl2Header = summarySheet.getCell(`B${curRow}`);
  tbl2Header.value = 'TEST CASE DISTRIBUTION BY PRIORITY';
  tbl2Header.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2C3E50' } };
  tbl2Header.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: WHITE } };

  summarySheet.mergeCells(`F${curRow}:I${curRow}`);
  const tbl3Header = summarySheet.getCell(`F${curRow}`);
  tbl3Header.value = 'TEST CASE DISTRIBUTION BY TEST TYPE';
  tbl3Header.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2C3E50' } };
  tbl3Header.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: WHITE } };

  curRow++;
  const prioData = [
    { p: 'Critical', desc: 'Core business flows, blocking blockers', cnt: testCases.filter(t => t.priority === 'Critical').length },
    { p: 'High', desc: 'Primary features, catalog configs, validations', cnt: testCases.filter(t => t.priority === 'High').length },
    { p: 'Medium', desc: 'Secondary features, filters, reporting, auxiliary', cnt: testCases.filter(t => t.priority === 'Medium').length },
    { p: 'Low', desc: 'Minor UI nuances, display toggles', cnt: testCases.filter(t => t.priority === 'Low').length }
  ];

  const typeData = [
    { t: 'Smoke / Sanity', desc: 'Basic navigation & page accessibility', cnt: testCases.filter(t => t.testType === 'Smoke').length },
    { t: 'Functional', desc: 'Feature actions, lifecycle & data workflows', cnt: testCases.filter(t => t.testType === 'Functional').length },
    { t: 'E2E Lifecycle', desc: 'Multi-stage end-to-end user journeys', cnt: testCases.filter(t => t.testType === 'E2E').length },
    { t: 'Security & Negative', desc: 'Auth guardrails, validations, RBAC', cnt: testCases.filter(t => ['Security', 'Negative', 'Boundary'].includes(t.testType)).length }
  ];

  prioData.forEach((pd, idx) => {
    const td = typeData[idx];
    const r = curRow + idx;
    summarySheet.getRow(r).height = 20;

    // Priority cell
    summarySheet.getCell(`B${r}`).value = pd.p;
    summarySheet.getCell(`B${r}`).font = { name: 'Segoe UI', size: 9.5, bold: true };
    stylePriorityCell(summarySheet.getCell(`B${r}`), pd.p);

    summarySheet.mergeCells(`C${r}:D${r}`);
    summarySheet.getCell(`C${r}`).value = pd.desc;
    summarySheet.getCell(`C${r}`).font = { name: 'Segoe UI', size: 9 };

    summarySheet.getCell(`E${r}`).value = pd.cnt;
    summarySheet.getCell(`E${r}`).font = { name: 'Segoe UI', size: 10, bold: true };
    summarySheet.getCell(`E${r}`).alignment = { horizontal: 'center' };

    // Type cell
    summarySheet.getCell(`F${r}`).value = td.t;
    summarySheet.getCell(`F${r}`).font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: NOKIA_NAVY } };

    summarySheet.mergeCells(`G${r}:H${r}`);
    summarySheet.getCell(`G${r}`).value = td.desc;
    summarySheet.getCell(`G${r}`).font = { name: 'Segoe UI', size: 9 };

    summarySheet.getCell(`I${r}`).value = td.cnt;
    summarySheet.getCell(`I${r}`).font = { name: 'Segoe UI', size: 10, bold: true };
    summarySheet.getCell(`I${r}`).alignment = { horizontal: 'center' };
  });

  // =========================================================================
  // 2. MASTER TEST CASES SHEET (Unified Repository - 174 TCs)
  // =========================================================================
  console.log('Generating Sheet 2: Master_Test_Cases (All 174 Test Cases)...');
  const masterSheet = workbook.addWorksheet('Master_Test_Cases', {
    views: [{ state: 'frozen', ySplit: 1 }]
  });
  setupTestCasesSheet(masterSheet, testCases, 'Master Test Cases Repository');

  // =========================================================================
  // 3. DEDICATED MODULE SHEETS (12 Sheets)
  // =========================================================================
  moduleMetadata.forEach((m, idx) => {
    console.log(`Generating Sheet ${idx + 3}: ${m.tab} (${m.name})...`);
    const modSheet = workbook.addWorksheet(m.tab, {
      views: [{ state: 'frozen', ySplit: 1 }]
    });
    const modTests = testCases.filter(t => t.sheetTab === m.tab);
    setupTestCasesSheet(modSheet, modTests, m.name);
  });

  // Save File
  const outputRoot = path.join(__dirname, '../WDH_Portal_Comprehensive_Test_Cases.xlsx');
  const outputReports = path.join(__dirname, '../reports/WDH_Portal_Comprehensive_Test_Cases.xlsx');

  await workbook.xlsx.writeFile(outputRoot);
  console.log(`Saved master workbook to: ${outputRoot}`);

  if (fs.existsSync(path.join(__dirname, '../reports'))) {
    await workbook.xlsx.writeFile(outputReports);
    console.log(`Saved duplicate copy to: ${outputReports}`);
  }

  return { outputRoot, outputReports, totalCount: testCases.length };
}

if (require.main === module) {
  generateWorkbook()
    .then(res => {
      console.log(`SUCCESS! Generated enterprise Excel workbook with ${res.totalCount} test cases at ${res.outputRoot}`);
      process.exit(0);
    })
    .catch(err => {
      console.error('Error generating Excel workbook:', err);
      process.exit(1);
    });
}

module.exports = { testCases, generateWorkbook };

