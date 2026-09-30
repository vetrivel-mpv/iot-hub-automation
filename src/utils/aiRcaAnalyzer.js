/**
 * AI-Powered Root-Cause Analysis (RCA) Diagnostic Engine
 * Analyzes Playwright test execution failures, stack traces, step logs,
 * DOM state indicators, and environment telemetry to produce intelligent
 * plain-English explanations, defect classifications, and remediation code.
 */

/**
 * Classify defect category and generate structured diagnostic report
 * @param {Object} context
 * @param {string[]} context.logs - Full console logs array
 * @param {string} context.errorText - Combined error text or stderr
 * @param {string} context.testName - Test scenario name
 * @param {string} context.testId - Test ID (e.g. ACC-03)
 * @param {Object} context.targetEnv - Target environment details
 * @param {number} context.duration - Total duration in ms
 * @returns {Object} Structured RCA Report
 */
function analyzeFailure(context) {
  const {
    logs = [],
    errorText = '',
    testName = 'Unknown Test',
    testId = 'TC-FAIL',
    targetEnv = {},
    duration = 0,
  } = context;

  const fullLogString = logs.join('\n') + '\n' + (errorText || '');

  // Default fallback classification
  let category = 'UNKNOWN_FAILURE';
  let categoryTitle = 'Unclassified Test Failure';
  let severity = 'MEDIUM';
  let confidenceScore = 75;
  let summary = 'Test execution terminated with non-zero exit status.';
  let rootCause = 'The test runner encountered an unexpected failure during step execution.';
  let failingStep = 'General Execution';
  let suggestedRemediation = [
    'Review the full execution logs in the Live Terminal tab.',
    'Inspect the generated Playwright Trace file for action-by-action DOM states.',
    'Verify connectivity to the target environment endpoint.',
  ];
  let suggestedCodeSnippet = '';
  const affectedLocators = [];

  // 1. Selector Timeout / Waiting for element
  if (
    /Timeout.*exceeded while waiting for locator|waiting for getBy|waiting for locator/i.test(fullLogString) ||
    /locator\.waitFor.*Timeout/i.test(fullLogString) ||
    /locator\.click.*Timeout/i.test(fullLogString) ||
    /locator\.fill.*Timeout/i.test(fullLogString)
  ) {
    category = 'SELECTOR_TIMEOUT';
    categoryTitle = 'Element Locator Timeout / DOM Element Not Found';
    severity = 'HIGH';
    confidenceScore = 96;

    // Extract locator from log
    const locatorMatch = fullLogString.match(/waiting for (locator\([^)]+\)|getBy[a-zA-Z]+\([^)]+\)|["'][^"']+["'])/i);
    const locatorStr = locatorMatch ? locatorMatch[1] : 'Target DOM Element';
    if (locatorMatch) affectedLocators.push(locatorStr);

    // Extract failing step description if present
    const stepMatch = fullLogString.match(/\[STEP\]\s*([^:\n]+)/i);
    failingStep = stepMatch ? stepMatch[1].trim() : 'Locating & Interacting with UI Element';

    summary = `Playwright timed out while waiting for locator ${locatorStr} to become actionable on ${targetEnv.name || 'target portal'}.`;
    rootCause = `The UI element either did not render within the configured 15,000ms action timeout, was occluded by a loading spinner (e.g. '.lds-pacman'), or the DOM hierarchy changed in the target portal release.`;
    
    suggestedRemediation = [
      `Ensure explicit spinner dismissal before locating: await page.locator('.lds-pacman').waitFor({ state: 'hidden', timeout: 30000 });`,
      `Verify if the element is inside an iframe or nested Material-UI portal modal dialog.`,
      `Increase locator action timeout if testing across high-latency staging environments (${targetEnv.name || 'Current Env'}).`,
    ];

    suggestedCodeSnippet = `// Wait for loading overlays to clear before action\nawait page.locator('.lds-pacman, .MuiBackdrop-root').waitFor({ state: 'hidden', timeout: 30000 }).catch(() => {});\nawait page.locator('${locatorStr.replace(/['"]/g, '')}').waitFor({ state: 'visible', timeout: 20000 });`;
  }

  // 2. Authentication & Session Invalidation
  else if (
    /invalid credentials|Keycloak.*error|unauthorized|401 Unauthorized|session expired|login failed/i.test(fullLogString)
  ) {
    category = 'AUTH_SESSION_EXPIRED';
    categoryTitle = 'Authentication Failure / Keycloak Session Expired';
    severity = 'BLOCKER';
    confidenceScore = 98;
    failingStep = 'Keycloak Login / Authentication Handshake';

    summary = `Authentication handshake failed on ${targetEnv.name || 'target environment'} for user "${targetEnv.auth?.username || targetEnv.username || 'vetrivel_m'}".`;
    rootCause = `The portal rejected the credentials, Keycloak SSO redirected to an error callback, or the session cookie expired during multi-step navigation.`;

    suggestedRemediation = [
      `Check environment credentials in the Environments Manager tab (Current User: ${targetEnv.auth?.username || 'configured user'}).`,
      `Verify if the user account is locked or requires password reset on ${targetEnv.baseUrl || 'the portal'}.`,
      `Verify Keycloak SSO realm availability for environment category "${targetEnv.category || 'SIT'}".`,
    ];

    suggestedCodeSnippet = `// Verify credentials in .env or switch environment via header dropdown\nWDH_USERNAME="${targetEnv.auth?.username || 'user'}"\nWDH_PASSWORD="[VALID_PASSWORD]"`;
  }

  // 3. Environment Network Latency / Gateway 502 / 504 / Connection Refused
  else if (
    /ECONNREFUSED|ENOTFOUND|ETIMEDOUT|502 Bad Gateway|504 Gateway Time-out|503 Service Unavailable|Navigation timeout of \d+ms exceeded/i.test(fullLogString)
  ) {
    category = 'ENVIRONMENT_LATENCY';
    categoryTitle = 'Environment Unreachable / Gateway Network Latency';
    severity = 'CRITICAL';
    confidenceScore = 94;
    failingStep = 'Portal Navigation / Gateway Connection';

    summary = `Target environment endpoint (${targetEnv.baseUrl || 'target URL'}) is experiencing high latency or gateway timeouts.`;
    rootCause = `The remote IoT Hub Portal cluster did not respond within the navigation timeout window. This is typically caused by backend deployments, network throttling, or reverse proxy overload on ${targetEnv.name || 'the cluster'}.`;

    suggestedRemediation = [
      `Perform a health ping check using the 📡 "Test Ping" button in the header telemetry banner.`,
      `Switch target environment to an active alternate cluster (e.g. SIT - STG 1 or UAT).`,
      `Increase navigationTimeout in playwright.config.ts for this environment.`,
    ];

    suggestedCodeSnippet = `// In playwright.config.ts:\nuse: {\n  navigationTimeout: 60000, // Increase for slow staging networks\n  actionTimeout: 30000,\n}`;
  }

  // 4. Assertion Expectation Failure
  else if (
    /Error: expect\(received\)\.toBe|Error: expect\(received\)\.toContain|Error: expect\(received\)\.toBeVisible/i.test(fullLogString) ||
    /Expected string:|Received string:|Expected pattern:/i.test(fullLogString)
  ) {
    category = 'ASSERTION_MISMATCH';
    categoryTitle = 'Business Logic / Assertion Expectation Failure';
    severity = 'HIGH';
    confidenceScore = 92;

    const expectMatch = fullLogString.match(/Expected:?\s*(["'][^"']+["']|[^\n]+)\n\s*Received:?\s*(["'][^"']+["']|[^\n]+)/i);
    const expectedVal = expectMatch ? expectMatch[1] : 'Expected Value';
    const receivedVal = expectMatch ? expectMatch[2] : 'Received Value';

    summary = `Assertion failed: expected state was not met during validation.`;
    rootCause = `The portal UI returned '${receivedVal}' instead of the expected '${expectedVal}'. This indicates either a portal workflow defect or test data mismatch in the target environment.`;

    suggestedRemediation = [
      `Inspect the before/after DOM state in Playwright Trace Viewer.`,
      `Verify if the target account or SIM state on ${targetEnv.name || 'portal'} matches pre-requisite conditions.`,
      `Verify if backend data synchronization is delayed (eventual consistency).`,
    ];

    suggestedCodeSnippet = `// Add explicit retry assertion with polling:\nawait expect(async () => {\n  const status = await page.locator('.account-status').textContent();\n  expect(status?.trim()).toBe('ACTIVE');\n}).toPass({ timeout: 15000, intervals: [1000, 2000] });`;
  }

  // 5. Data Conflict / Duplicate Entry (409 Conflict / Record Exists)
  else if (
    /already exists|duplicate entry|409 Conflict|Account name is taken|Entity exists/i.test(fullLogString)
  ) {
    category = 'DATA_INTEGRITY_CONFLICT';
    categoryTitle = 'Data Conflict / Duplicate Record on Target Cluster';
    severity = 'MEDIUM';
    confidenceScore = 95;
    failingStep = 'Entity Creation & Submission';

    summary = `Entity creation rejected because the record name or identifier already exists in ${targetEnv.name || 'the database'}.`;
    rootCause = `Automated test attempted to create an entity with a fixed static name that was previously generated and not cleaned up.`;

    suggestedRemediation = [
      `Use dynamically generated unique timestamps or random hashes for Account/Profile names: \`Auto_Acc_\${Date.now()}\`.`,
      `Implement automated teardown or deactivation fixtures.`,
    ];

    suggestedCodeSnippet = `const uniqueAccountName = \`DEMO_ACC_\${Date.now().toString().slice(-6)}\`;\nawait accountsPage.fillAccountName(uniqueAccountName);`;
  }

  // 6. Backend 500 Internal Server Error
  else if (
    /500 Internal Server Error|Internal server error|Server Error/i.test(fullLogString)
  ) {
    category = 'BACKEND_5XX';
    categoryTitle = 'Portal Backend Internal Server Error (HTTP 500)';
    severity = 'CRITICAL';
    confidenceScore = 91;
    failingStep = 'Backend API Service Call';

    summary = `The IoT Hub Portal backend service returned HTTP 500 Internal Server Error during test execution.`;
    rootCause = `The backend microservice encountered an unhandled exception while processing the request payload.`;

    suggestedRemediation = [
      `Inspect backend service logs on ${targetEnv.name || 'target cluster'}.`,
      `Verify payload schema compatibility between test inputs and backend API version.`,
      `Report defect to WDH Platform Engineering with attached Playwright Trace & Network HAR.`,
    ];

    suggestedCodeSnippet = `// Check network tab in Playwright Trace Viewer for failed API response payload`;
  }

  // Extract stack trace lines
  const stackLines = fullLogString
    .split('\n')
    .filter(line => line.includes('at ') || line.includes('Error:'))
    .slice(0, 8);

  return {
    analyzed: true,
    timestamp: new Date().toISOString(),
    testId,
    testName,
    category,
    categoryTitle,
    severity,
    confidenceScore,
    failingStep,
    summary,
    rootCause,
    affectedLocators,
    suggestedRemediation,
    suggestedCodeSnippet,
    environmentContext: {
      id: targetEnv.id || 'sit-stg2',
      name: targetEnv.name || 'SIT - STG 2',
      category: targetEnv.category || 'SIT',
      baseUrl: targetEnv.baseUrl || 'https://wdh-sitstg2.nokiawing.com',
    },
    durationMs: duration,
    stackSnippet: stackLines.join('\n'),
  };
}

module.exports = {
  analyzeFailure,
};
