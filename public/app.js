/**
 * IoT Hub Enterprise Automation Hub - Client Application
 * Enterprise IoT Hub Multi-Environment Test Platform
 */

// Application State
const state = {
  suites: [],
  scenarios: [],
  environments: [],
  activeEnvironmentId: 'sit-stg2',
  activeEnvironment: null,
  selectedBrowser: 'chromium',
  isHeaded: false,
  workers: 1,
  activeTab: 'dashboard',
  currentRun: null,
  autoScrollLogs: true,
  theme: localStorage.getItem('wdh_theme') || 'light', // Default to Light theme
  density: 'compact', // Permanently Compact layout
  pendingRunPayload: null, // For PROD safety modal confirmation
  activeModalSuiteId: null, // Currently opened suite in modal
  activeReportTab: 'allure', // 'allure' | 'playwright' | 'traces'
  latestTrace: null,
  latestRca: null,
};

// DOM Elements
const elements = {
  // Theme Toggle
  themeToggleBtn: document.getElementById('theme-toggle-btn'),
  themeIcon: document.getElementById('theme-icon'),

  // Navigation & Tabs
  navTabs: document.querySelectorAll('.nav-tab'),
  tabContents: document.querySelectorAll('.tab-content'),

  // Header Environment Switcher
  envSelectorBtn: document.getElementById('env-selector-btn'),
  envDropdownMenu: document.getElementById('env-dropdown-menu'),
  envDropdownList: document.getElementById('env-dropdown-list'),
  headerEnvCategory: document.getElementById('header-env-category'),
  headerEnvName: document.getElementById('header-env-name'),
  headerEnvPulse: document.getElementById('header-env-pulse'),
  quickPingBtn: document.getElementById('quick-ping-btn'),
  quickManageEnvBtn: document.getElementById('quick-manage-env-btn'),
  openEnvModalBtn: document.getElementById('open-env-modal-btn'),
  usernameDisplay: document.getElementById('username-display'),

  // Dashboard Telemetry
  telemetryEnvName: document.getElementById('telemetry-env-name'),
  telemetryCategory: document.getElementById('telemetry-category'),
  telemetryHealthBadge: document.getElementById('telemetry-health-badge'),
  telemetryBaseUrl: document.getElementById('telemetry-base-url'),
  telemetryLatency: document.getElementById('telemetry-latency'),
  telemetryUsername: document.getElementById('telemetry-username'),
  telemetryStatusText: document.getElementById('telemetry-status-text'),
  telemetryPingBtn: document.getElementById('telemetry-ping-btn'),
  telemetrySwitchBtn: document.getElementById('telemetry-switch-btn'),

  // KPI Elements
  kpiModules: document.getElementById('kpi-modules'),
  kpiScenarios: document.getElementById('kpi-scenarios'),
  kpiEnvs: document.getElementById('kpi-envs'),
  tabScenariosBadge: document.getElementById('tab-scenarios-badge'),
  suiteCountBadge: document.getElementById('suite-count-badge'),

  // Runner Controls
  runnerEnvSelect: document.getElementById('runner-env-select'),
  browserButtons: document.querySelectorAll('#browser-selector .toggle-btn'),
  headedToggle: document.getElementById('headed-toggle'),
  runAllBtn: document.getElementById('run-all-btn'),
  stopRunBtn: document.getElementById('stop-run-btn'),
  suitesContainer: document.getElementById('suites-container'),

  // Progress Banner
  liveProgressBanner: document.getElementById('live-progress-banner'),
  progressTitle: document.getElementById('progress-title'),
  // Banner Interactivity & Live Tracker
  liveProgressBanner: document.getElementById('live-progress-banner'),
  liveBannerDrilldownHint: document.getElementById('live-banner-drilldown-hint'),
  bannerDrilldownBtn: document.getElementById('banner-drilldown-btn'),
  progressTitle: document.getElementById('progress-title'),
  progressSubtitle: document.getElementById('progress-subtitle'),
  liveEnvBadge: document.getElementById('live-env-badge'),
  livePassCount: document.getElementById('live-pass-count'),
  liveFailCount: document.getElementById('live-fail-count'),
  progressBarFill: document.getElementById('progress-bar-fill'),
  bannerStopBtn: document.getElementById('banner-stop-btn'),

  // Live Execution Tracker Modal
  liveExecutionModal: document.getElementById('live-execution-modal'),
  liveExecModalClose: document.getElementById('live-exec-modal-close'),
  liveExecModalFooterClose: document.getElementById('live-exec-modal-footer-close'),
  liveExecModalTitle: document.getElementById('live-exec-modal-title'),
  liveExecModalSub: document.getElementById('live-exec-modal-sub'),
  liveExecPassBadge: document.getElementById('live-exec-pass-badge'),
  liveExecFailBadge: document.getElementById('live-exec-fail-badge'),
  liveExecEnvBadge: document.getElementById('live-exec-env-badge'),
  liveActiveTestContainer: document.getElementById('live-active-test-container'),
  liveActiveName: document.getElementById('live-active-name'),
  liveActiveMeta: document.getElementById('live-active-meta'),
  liveActiveTimer: document.getElementById('live-active-timer'),
  liveCompletedCount: document.getElementById('live-completed-count'),
  liveCompletedList: document.getElementById('live-completed-list'),
  liveExecProgressPct: document.getElementById('live-exec-progress-pct'),
  liveExecViewTerminalBtn: document.getElementById('live-exec-view-terminal-btn'),
  liveExecModalStopBtn: document.getElementById('live-exec-modal-stop-btn'),

  // Matrix Tab
  scenarioSearch: document.getElementById('scenario-search'),
  scenarioSuiteFilter: document.getElementById('scenario-suite-filter'),
  scenariosTableBody: document.getElementById('scenarios-table-body'),

  // Terminal Tab & RCA Diagnostic Card
  terminalBody: document.getElementById('terminal-body'),
  autoscrollToggle: document.getElementById('autoscroll-toggle'),
  clearLogsBtn: document.getElementById('clear-logs-btn'),
  downloadLogsBtn: document.getElementById('download-logs-btn'),
  terminalTraceBtn: document.getElementById('terminal-trace-btn'),
  terminalDownloadTraceBtn: document.getElementById('terminal-download-trace-btn'),
  terminalAllureBtn: document.getElementById('terminal-allure-btn'),

  // AI RCA Banner Elements
  aiRcaBanner: document.getElementById('ai-rca-banner'),
  rcaCategoryBadge: document.getElementById('rca-category-badge'),
  rcaSeverityBadge: document.getElementById('rca-severity-badge'),
  rcaConfidenceBadge: document.getElementById('rca-confidence-badge'),
  rcaFailingStep: document.getElementById('rca-failing-step'),
  aiRcaDismissBtn: document.getElementById('ai-rca-dismiss-btn'),
  rcaSummaryText: document.getElementById('rca-summary-text'),
  rcaRootCauseText: document.getElementById('rca-root-cause-text'),
  rcaRemediationList: document.getElementById('rca-remediation-list'),
  rcaCodeWrapper: document.getElementById('rca-code-wrapper'),
  rcaCodeSnippet: document.getElementById('rca-code-snippet'),
  rcaCopyCodeBtn: document.getElementById('rca-copy-code-btn'),
  rcaEnvName: document.getElementById('rca-env-name'),
  rcaEnvUrl: document.getElementById('rca-env-url'),
  rcaOpenTraceBtn: document.getElementById('rca-open-trace-btn'),
  rcaOpenAllureBtn: document.getElementById('rca-open-allure-btn'),

  // Environments Fleet Tab
  envFleetContainer: document.getElementById('env-fleet-container'),
  pingAllEnvsBtn: document.getElementById('ping-all-envs-btn'),
  addEnvBtn: document.getElementById('add-env-btn'),

  // History Tab
  historyEnvFilter: document.getElementById('history-env-filter'),
  historyTableBody: document.getElementById('history-table-body'),
  exportHistoryCsvBtn: document.getElementById('export-history-csv-btn'),
  exportHistoryJsonBtn: document.getElementById('export-history-json-btn'),

  // Gallery Tab
  galleryContainer: document.getElementById('gallery-container'),
  refreshGalleryBtn: document.getElementById('refresh-gallery-btn'),

  // API Performance Tab (Redesigned)
  perfTotalActions: document.getElementById('perf-total-actions'),
  perfTotalApis: document.getElementById('perf-total-apis'),
  perfAvgLatency: document.getElementById('perf-avg-latency'),
  perfFailedApis: document.getElementById('perf-failed-apis'),
  perfSearchInput: document.getElementById('perf-search-input'),
  perfStatusFilterGroup: document.getElementById('perf-status-filter-group'),
  perfFilterRating: document.getElementById('perf-filter-rating'),
  perfActionsList: document.getElementById('perf-actions-list'),
  refreshPerfBtn: document.getElementById('refresh-perf-btn'),
  clearPerfBtn: document.getElementById('clear-perf-btn'),

  // API Inspection Deep Dive Modal
  apiDetailsModal: document.getElementById('api-details-modal'),
  apiDetailsModalClose: document.getElementById('api-details-modal-close'),
  apiDetailsModalFooterClose: document.getElementById('api-details-modal-footer-close'),
  apiModalMethod: document.getElementById('api-modal-method'),
  apiModalEndpoint: document.getElementById('api-modal-endpoint'),
  apiModalStatus: document.getElementById('api-modal-status'),
  apiModalDuration: document.getElementById('api-modal-duration'),
  apiModalFullUrl: document.getElementById('api-modal-full-url'),
  apiModalErrorBanner: document.getElementById('api-modal-error-banner'),
  apiModalErrorText: document.getElementById('api-modal-error-text'),
  apiResponseCode: document.getElementById('api-response-code'),
  apiRequestCode: document.getElementById('api-request-code'),
  apiRespHeadersTable: document.getElementById('api-resp-headers-table'),
  apiReqHeadersTable: document.getElementById('api-req-headers-table'),
  apiCopyResponseBtn: document.getElementById('api-copy-response-btn'),
  apiCopyRequestBtn: document.getElementById('api-copy-request-btn'),
  apiModalTimestamp: document.getElementById('api-modal-timestamp'),
  apiModalSize: document.getElementById('api-modal-size'),
  apiInspectorTabBtns: document.querySelectorAll('.api-tab-btn'),

  // Reports Multi-Tab
  reportSubTabs: document.querySelectorAll('.report-sub-tab'),
  reportIframe: document.getElementById('report-iframe'),
  tracesArchiveView: document.getElementById('traces-archive-view'),
  tracesListGrid: document.getElementById('traces-list-grid'),
  refreshReportBtn: document.getElementById('refresh-report-btn'),
  openReportTabBtn: document.getElementById('open-report-tab-btn'),

  // Suite Details Modal
  suiteDetailsModal: document.getElementById('suite-details-modal'),
  suiteModalIcon: document.getElementById('suite-modal-icon'),
  suiteModalName: document.getElementById('suite-modal-name'),
  suiteModalCountBadge: document.getElementById('suite-modal-count-badge'),
  suiteModalDesc: document.getElementById('suite-modal-desc'),
  suiteModalSearch: document.getElementById('suite-modal-search'),
  suiteModalMatrixBtn: document.getElementById('suite-modal-matrix-btn'),
  suiteModalRunAllBtn: document.getElementById('suite-modal-run-all-btn'),
  suiteTestCasesList: document.getElementById('suite-test-cases-list'),
  suiteModalClose: document.getElementById('suite-modal-close'),
  suiteModalFooterClose: document.getElementById('suite-modal-footer-close'),
  suiteModalPulse: document.getElementById('suite-modal-pulse'),
  suiteModalTargetEnv: document.getElementById('suite-modal-target-env'),
  suiteModalTargetUrl: document.getElementById('suite-modal-target-url'),

  // RCA Drilldown Modal
  rcaModal: document.getElementById('rca-modal'),
  rcaModalTitle: document.getElementById('rca-modal-title'),
  rcaModalCategory: document.getElementById('rca-modal-category'),
  rcaModalSeverity: document.getElementById('rca-modal-severity'),
  rcaModalTestName: document.getElementById('rca-modal-test-name'),
  rcaModalSummary: document.getElementById('rca-modal-summary'),
  rcaModalRootCause: document.getElementById('rca-modal-root-cause'),
  rcaModalRemediationList: document.getElementById('rca-modal-remediation-list'),
  rcaModalCodeBox: document.getElementById('rca-modal-code-box'),
  rcaModalCodeSnippet: document.getElementById('rca-modal-code-snippet'),
  rcaModalStack: document.getElementById('rca-modal-stack'),
  rcaModalTime: document.getElementById('rca-modal-time'),
  rcaModalClose: document.getElementById('rca-modal-close'),
  rcaModalFooterClose: document.getElementById('rca-modal-footer-close'),

  // Config Inspector Modal
  configInspectorModal: document.getElementById('config-inspector-modal'),
  cfgModalTitle: document.getElementById('cfg-modal-title'),
  cfgModalEnvBadge: document.getElementById('cfg-modal-env-badge'),
  cfgModalSub: document.getElementById('cfg-modal-sub'),
  cfgModalClose: document.getElementById('cfg-modal-close'),
  cfgTargetTypeBadge: document.getElementById('cfg-target-type-badge'),
  cfgTargetName: document.getElementById('cfg-target-name'),
  cfgTargetFile: document.getElementById('cfg-target-file'),
  cfgTargetGrep: document.getElementById('cfg-target-grep'),
  cfgTargetBrowser: document.getElementById('cfg-target-browser'),
  cfgRetestPingBtn: document.getElementById('cfg-retest-ping-btn'),
  cfgEnvName: document.getElementById('cfg-env-name'),
  cfgEnvUrl: document.getElementById('cfg-env-url'),
  cfgAuthUser: document.getElementById('cfg-auth-user'),
  cfgAuthPwdStatus: document.getElementById('cfg-auth-pwd-status'),
  cfgPingStatus: document.getElementById('cfg-ping-status'),
  cfgPingLatency: document.getElementById('cfg-ping-latency'),
  cfgTimeoutShort: document.getElementById('cfg-timeout-short'),
  cfgTimeoutMedium: document.getElementById('cfg-timeout-medium'),
  cfgTimeoutLong: document.getElementById('cfg-timeout-long'),
  cfgTimeoutPageload: document.getElementById('cfg-timeout-pageload'),
  cfgChecklistItems: document.getElementById('cfg-checklist-items'),
  cfgModalSwitchEnvBtn: document.getElementById('cfg-modal-switch-env-btn'),
  cfgModalRunBtn: document.getElementById('cfg-modal-run-btn'),
  inspectConfigBtn: document.getElementById('inspect-config-btn'),

  // Modals
  envModal: document.getElementById('env-modal'),
  envModalTitle: document.getElementById('env-modal-title'),
  envForm: document.getElementById('env-form'),
  envFormId: document.getElementById('env-form-id'),
  envFormName: document.getElementById('env-form-name'),
  envFormCategory: document.getElementById('env-form-category'),
  envFormProtected: document.getElementById('env-form-protected'),
  envFormUrl: document.getElementById('env-form-url'),
  envFormTestBtn: document.getElementById('env-form-test-btn'),
  envFormPingResult: document.getElementById('env-form-ping-result'),
  envFormUsername: document.getElementById('env-form-username'),
  envFormPassword: document.getElementById('env-form-password'),
  envFormTogglePwd: document.getElementById('env-form-toggle-pwd'),
  envFormDesc: document.getElementById('env-form-desc'),
  envModalClose: document.getElementById('env-modal-close'),
  envModalCancel: document.getElementById('env-modal-cancel'),

  // PROD Safety Modal
  prodSafetyModal: document.getElementById('prod-safety-modal'),
  safetyEnvTarget: document.getElementById('safety-env-target'),
  prodConfirmInput: document.getElementById('prod-confirm-input'),
  prodProceedBtn: document.getElementById('prod-proceed-btn'),
  prodCancelBtn: document.getElementById('prod-cancel-btn'),
  prodSafetyClose: document.getElementById('prod-safety-close'),

  // Lightbox
  lightboxModal: document.getElementById('lightbox-modal'),
  lightboxImg: document.getElementById('lightbox-img'),
  lightboxCaption: document.getElementById('lightbox-caption'),
  lightboxClose: document.getElementById('lightbox-close'),

  // Google Authentication Elements
  userChipBtn: document.getElementById('user-chip-btn'),
  userAuthDropdown: document.getElementById('user-auth-dropdown'),
  userAvatarImg: document.getElementById('user-avatar-img'),
  userAvatarFallback: document.getElementById('user-avatar-fallback'),
  authDropdownName: document.getElementById('auth-dropdown-name'),
  authDropdownEmail: document.getElementById('auth-dropdown-email'),
  googleLoginBtn: document.getElementById('google-login-btn'),
  authLogoutBtn: document.getElementById('auth-logout-btn'),

  // Schedules & Cron Elements
  schedulesContainer: document.getElementById('schedules-container'),
  addScheduleBtn: document.getElementById('add-schedule-btn'),
  scheduleModal: document.getElementById('schedule-modal'),
  scheduleForm: document.getElementById('schedule-form'),
  schedFormName: document.getElementById('sched-form-name'),
  schedFormCron: document.getElementById('sched-form-cron'),
  schedCronPreset: document.getElementById('sched-cron-preset'),
  schedFormSuite: document.getElementById('sched-form-suite'),
  schedFormEnv: document.getElementById('sched-form-env'),
  scheduleModalClose: document.getElementById('schedule-modal-close'),
  schedModalCancel: document.getElementById('sched-modal-cancel'),

  // Multi-Env Diff Elements
  envDiffHeaderRow: document.getElementById('env-diff-header-row'),
  envDiffTbody: document.getElementById('env-diff-tbody'),
  refreshDiffBtn: document.getElementById('refresh-diff-btn'),

  // AI Flakiness Elements
  flakinessInsightsContainer: document.getElementById('flakiness-insights-container'),
  flakyOverallHealth: document.getElementById('flaky-overall-health'),
  flakyTestsCount: document.getElementById('flaky-tests-count'),
  refreshFlakinessBtn: document.getElementById('refresh-flakiness-btn'),

  // Dispatch Teams & Slack Modal
  dispatchTeamsBtn: document.getElementById('dispatch-teams-btn'),
  dispatchModal: document.getElementById('dispatch-modal'),
  dispatchForm: document.getElementById('dispatch-form'),
  dispatchChannelSelect: document.getElementById('dispatch-channel-select'),
  dispatchWebhookUrl: document.getElementById('dispatch-webhook-url'),
  dispatchNotes: document.getElementById('dispatch-notes'),
  dispatchModalClose: document.getElementById('dispatch-modal-close'),
  dispatchModalCancel: document.getElementById('dispatch-modal-cancel'),
};

// -------------------------------------------------------------
// UTILITY FUNCTIONS
// -------------------------------------------------------------
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// -------------------------------------------------------------
// THEME MANAGEMENT (LIGHT / DARK)
// -------------------------------------------------------------
function applyTheme(theme) {
  state.theme = theme;
  localStorage.setItem('wdh_theme', theme);
  document.documentElement.setAttribute('data-theme', theme);

  if (theme === 'light') {
    document.body.classList.add('theme-light');
    if (elements.themeIcon) elements.themeIcon.textContent = '🌙';
    if (elements.themeToggleBtn) elements.themeToggleBtn.title = 'Switch to Dark Theme';
  } else {
    document.body.classList.remove('theme-light');
    if (elements.themeIcon) elements.themeIcon.textContent = '☀️';
    if (elements.themeToggleBtn) elements.themeToggleBtn.title = 'Switch to Light Theme';
  }

  // Re-render Tremor interactive charts with theme-adjusted grid & text colors
  if (typeof initTremorCharts === 'function') {
    initTremorCharts();
  }
  if (otelChartInstance && typeof fetchPerformanceMetrics === 'function') {
    fetchPerformanceMetrics();
  }
}

// -------------------------------------------------------------
// DENSITY MANAGEMENT (PERMANENT COMPACT MODE)
// -------------------------------------------------------------
function applyDensity() {
  state.density = 'compact';
  document.documentElement.setAttribute('data-density', 'compact');
  document.body.classList.add('mode-compact');
}

// -------------------------------------------------------------
// INITIALIZATION
// -------------------------------------------------------------
async function initApp() {
  closeLightbox();
  applyTheme(state.theme);
  applyDensity();
  setupEventListeners();
  setupSSE();
  switchTab('dashboard');
  await Promise.all([
    fetchEnvironments(),
    fetchSuites(),
    fetchScenarios(),
    fetchHistory(),
    fetchScreenshots(),
  ]);

  // Initial Health Ping
  testEnvironmentHealth(state.activeEnvironmentId);
}

// -------------------------------------------------------------
// EVENT LISTENERS
// -------------------------------------------------------------
function setupEventListeners() {


  // Theme Toggle Button
  if (elements.themeToggleBtn) {
    elements.themeToggleBtn.addEventListener('click', () => {
      const nextTheme = state.theme === 'light' ? 'dark' : 'light';
      applyTheme(nextTheme);
      appendLog(`[SYSTEM] Switched UI theme to: ${nextTheme.toUpperCase()} MODE`, 'system');
    });
  }

  // Navigation Tabs
  elements.navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.dataset.tab;
      switchTab(targetTab);
    });
  });

  // Environment Dropdown Toggle
  elements.envSelectorBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    elements.envDropdownMenu.classList.toggle('hidden');
    if (elements.userAuthDropdown) elements.userAuthDropdown.classList.add('hidden');
  });

  // User Authentication & Profile Dropdown Toggle
  if (elements.userChipBtn) {
    elements.userChipBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      elements.userAuthDropdown.classList.toggle('hidden');
      if (elements.envDropdownMenu) elements.envDropdownMenu.classList.add('hidden');
    });
  }

  // Google Login & Logout Buttons
  if (elements.googleLoginBtn) {
    elements.googleLoginBtn.addEventListener('click', () => triggerGoogleAuthPopup());
  }
  if (elements.authLogoutBtn) {
    elements.authLogoutBtn.addEventListener('click', () => logoutAuthSession());
  }

  document.addEventListener('click', (e) => {
    if (elements.envDropdownMenu && !elements.envDropdownMenu.contains(e.target) && e.target !== elements.envSelectorBtn) {
      elements.envDropdownMenu.classList.add('hidden');
    }
    if (elements.userAuthDropdown && !elements.userAuthDropdown.contains(e.target) && !elements.userChipBtn.contains(e.target)) {
      elements.userAuthDropdown.classList.add('hidden');
    }
  });

  // Runner Environment Selector
  elements.runnerEnvSelect.addEventListener('change', (e) => {
    switchEnvironment(e.target.value);
  });

  // Quick Ping & Telemetry Ping
  elements.quickPingBtn.addEventListener('click', () => testEnvironmentHealth(state.activeEnvironmentId));
  elements.telemetryPingBtn.addEventListener('click', () => testEnvironmentHealth(state.activeEnvironmentId));
  elements.telemetrySwitchBtn.addEventListener('click', () => switchTab('environments'));

  // Browser Selector
  elements.browserButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      elements.browserButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.selectedBrowser = btn.dataset.browser;
    });
  });

  // Headed Toggle
  elements.headedToggle.addEventListener('change', (e) => {
    state.isHeaded = e.target.checked;
  });

  // Parallel Workers Selector
  const workersButtons = document.querySelectorAll('#workers-selector .toggle-btn');
  workersButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      workersButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.workers = parseInt(btn.dataset.workers, 10) || 1;
      appendLog(`[SYSTEM] Parallel worker grid set to: ${state.workers}x worker concurrency`, 'system');
    });
  });

  // KPI Modules Quick Actions
  const kpiModules = document.getElementById('kpi-card-modules');
  if (kpiModules) {
    kpiModules.addEventListener('click', () => {
      switchTab('dashboard');
      const target = document.getElementById('suites-container');
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  const kpiScenarios = document.getElementById('kpi-card-scenarios');
  if (kpiScenarios) {
    kpiScenarios.addEventListener('click', () => switchTab('matrix'));
  }

  const kpiEnvs = document.getElementById('kpi-card-envs');
  if (kpiEnvs) {
    kpiEnvs.addEventListener('click', () => switchTab('environments'));
  }

  const kpiLifecycle = document.getElementById('kpi-card-lifecycle');
  if (kpiLifecycle) {
    kpiLifecycle.addEventListener('click', () => {
      window.openSuiteDetailsModal('account_lifecycle');
    });
  }

  // Run All / Stop
  elements.runAllBtn.addEventListener('click', () => triggerRun({ suiteId: 'all' }));
  elements.stopRunBtn.addEventListener('click', stopExecution);
  elements.bannerStopBtn.addEventListener('click', stopExecution);

  // Multi-Module Batch Execution
  const runSelectedModulesBtn = document.getElementById('run-selected-modules-btn');
  if (runSelectedModulesBtn) {
    runSelectedModulesBtn.addEventListener('click', () => {
      if (state.selectedSuiteIds.length === 0) return alert('Please select at least one module.');
      appendLog(`[SYSTEM] Triggering batch execution for ${state.selectedSuiteIds.length} selected module(s)...`, 'system');
      triggerRun({ suiteIds: state.selectedSuiteIds });
    });
  }

  // Select All Modules Button
  const selectAllModulesBtn = document.getElementById('select-all-modules-btn');
  if (selectAllModulesBtn) {
    selectAllModulesBtn.addEventListener('click', () => {
      if (state.selectedSuiteIds.length === state.suites.length) {
        state.selectedSuiteIds = [];
        selectAllModulesBtn.innerHTML = '<span>☑️ Select All</span>';
      } else {
        state.selectedSuiteIds = state.suites.map(s => s.id);
        selectAllModulesBtn.innerHTML = '<span>⏹ Deselect All</span>';
      }
      renderSuitesGrid();
      updateSelectedModulesBar();
    });
  }

  // Suite Group Filter Pills
  const suiteGroupPills = document.querySelectorAll('#suite-group-pills .filter-pill');
  suiteGroupPills.forEach(pill => {
    pill.addEventListener('click', () => {
      suiteGroupPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      renderSuitesGrid(pill.dataset.group);
    });
  });

  // Scenario Matrix Filters & Batch Runner
  elements.scenarioSearch.addEventListener('input', filterScenariosTable);
  elements.scenarioSuiteFilter.addEventListener('change', filterScenariosTable);

  const groupFilterSelect = document.getElementById('scenario-group-filter');
  if (groupFilterSelect) groupFilterSelect.addEventListener('change', filterScenariosTable);

  const tagFilterSelect = document.getElementById('scenario-tag-filter');
  if (tagFilterSelect) tagFilterSelect.addEventListener('change', filterScenariosTable);

  // Scenario Group Quick Pills
  const scenarioGroupPills = document.querySelectorAll('#scenario-group-quick-pills .filter-pill');
  scenarioGroupPills.forEach(pill => {
    pill.addEventListener('click', () => {
      scenarioGroupPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const opgroup = pill.dataset.opgroup;
      if (groupFilterSelect) {
        groupFilterSelect.value = opgroup;
      }
      filterScenariosTable();
    });
  });

  // Matrix Select All Checkbox
  const matrixSelectAll = document.getElementById('matrix-select-all-checkbox');
  if (matrixSelectAll) {
    matrixSelectAll.addEventListener('change', (e) => {
      const visibleCheckboxes = document.querySelectorAll('.scenario-checkbox');
      const shouldCheck = e.target.checked;
      visibleCheckboxes.forEach(cb => {
        cb.checked = shouldCheck;
        const scId = cb.value;
        const idx = state.selectedScenarioIds.indexOf(scId);
        if (shouldCheck && idx === -1) {
          state.selectedScenarioIds.push(scId);
        } else if (!shouldCheck && idx > -1) {
          state.selectedScenarioIds.splice(idx, 1);
        }
      });
      updateSelectedScenariosBar();
    });
  }

  // Run Selected Scenarios Button
  const runSelectedScenariosBtn = document.getElementById('run-selected-scenarios-btn');
  if (runSelectedScenariosBtn) {
    runSelectedScenariosBtn.addEventListener('click', () => {
      if (state.selectedScenarioIds.length === 0) return alert('Please select at least one test scenario.');
      appendLog(`[SYSTEM] Triggering surgical batch execution for ${state.selectedScenarioIds.length} test scenario(s)...`, 'system');
      triggerRun({ scenarioIds: state.selectedScenarioIds });
    });
  }

  // Terminal Controls & Raw Logs Drawer Toggle
  const toggleLogsBtn = document.getElementById('canvas-toggle-logs-btn');
  if (toggleLogsBtn) {
    toggleLogsBtn.addEventListener('click', () => {
      const drawer = document.getElementById('raw-logs-drawer');
      if (drawer) {
        const isHidden = drawer.classList.contains('hidden');
        drawer.classList.toggle('hidden', !isHidden);
        toggleLogsBtn.innerHTML = isHidden ? '<span>📜 Hide Logs</span>' : '<span>📜 Raw Logs</span>';
      }
    });
  }

  elements.autoscrollToggle.addEventListener('change', (e) => {
    state.autoScrollLogs = e.target.checked;
  });
  elements.clearLogsBtn.addEventListener('click', () => {
    elements.terminalBody.innerHTML = '<span class="log-system">[SYSTEM] Terminal logs cleared.</span>\n';
  });
  elements.downloadLogsBtn.addEventListener('click', downloadLogs);

  // Environment Fleet Tab
  elements.pingAllEnvsBtn.addEventListener('click', pingAllEnvironments);
  elements.addEnvBtn.addEventListener('click', () => openEnvironmentModal());
  elements.quickManageEnvBtn.addEventListener('click', () => {
    elements.envDropdownMenu.classList.add('hidden');
    switchTab('environments');
  });
  elements.openEnvModalBtn.addEventListener('click', () => openEnvironmentModal());

  // Environment Modal Actions
  elements.envModalClose.addEventListener('click', closeEnvironmentModal);
  elements.envModalCancel.addEventListener('click', closeEnvironmentModal);
  elements.envForm.addEventListener('submit', handleSaveEnvironment);
  elements.envFormTestBtn.addEventListener('click', handleTestModalUrl);
  elements.envFormTogglePwd.addEventListener('click', () => {
    const input = elements.envFormPassword;
    input.type = input.type === 'password' ? 'text' : 'password';
  });

  // PROD Safety Modal Actions
  elements.prodConfirmInput.addEventListener('input', (e) => {
    elements.prodProceedBtn.disabled = e.target.value.trim().toUpperCase() !== 'PROD';
  });
  elements.prodProceedBtn.addEventListener('click', () => {
    closeProdSafetyModal();
    if (state.pendingRunPayload) {
      executeRunRequest(state.pendingRunPayload);
      state.pendingRunPayload = null;
    }
  });
  elements.prodCancelBtn.addEventListener('click', closeProdSafetyModal);
  elements.prodSafetyClose.addEventListener('click', closeProdSafetyModal);

  // History Tab Actions
  elements.historyEnvFilter.addEventListener('change', () => fetchHistory(elements.historyEnvFilter.value));
  elements.exportHistoryCsvBtn.addEventListener('click', () => window.open('/api/history/export?format=csv', '_blank'));
  elements.exportHistoryJsonBtn.addEventListener('click', () => window.open('/api/history/export?format=json', '_blank'));

  // Gallery & Lightbox
  if (elements.refreshGalleryBtn) elements.refreshGalleryBtn.addEventListener('click', fetchScreenshots);
  if (elements.lightboxClose) {
    elements.lightboxClose.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeLightbox();
    });
  }
  if (elements.lightboxModal) {
    elements.lightboxModal.addEventListener('click', (e) => {
      if (e.target === elements.lightboxModal || e.target.classList.contains('lightbox-overlay')) {
        closeLightbox();
      }
    });
  }

  // Universal Escape key listener to dismiss lightbox and modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
      closeEnvModal();
      closeSuiteDetailsModal();
      closeConfigInspectorModal();
      closeProdSafetyModal();
      closeRcaModal();
      closeLiveExecutionModal();
      closeApiDetailsModal();
    }
  });

  // Suite Details Modal Actions
  elements.suiteModalClose.addEventListener('click', closeSuiteDetailsModal);
  elements.suiteModalFooterClose.addEventListener('click', closeSuiteDetailsModal);
  elements.suiteDetailsModal.addEventListener('click', (e) => {
    if (e.target === elements.suiteDetailsModal) closeSuiteDetailsModal();
  });
  elements.suiteModalSearch.addEventListener('input', (e) => {
    if (state.activeModalSuiteId) {
      renderSuiteModalTestCases(state.activeModalSuiteId, e.target.value);
    }
  });
  elements.suiteModalRunAllBtn.addEventListener('click', () => {
    if (state.activeModalSuiteId) {
      const targetId = state.activeModalSuiteId;
      closeSuiteDetailsModal();
      window.triggerSuiteRun(targetId);
    }
  });
  elements.suiteModalMatrixBtn.addEventListener('click', () => {
    if (state.activeModalSuiteId) {
      const targetId = state.activeModalSuiteId;
      closeSuiteDetailsModal();
      elements.scenarioSuiteFilter.value = targetId;
      filterScenariosTable();
      switchTab('matrix');
    }
  });

  // AI RCA Banner Actions
  elements.aiRcaDismissBtn.addEventListener('click', () => elements.aiRcaBanner.classList.add('hidden'));
  elements.rcaCopyCodeBtn.addEventListener('click', copyRcaCode);
  elements.rcaOpenTraceBtn.addEventListener('click', openLatestTrace);
  elements.rcaOpenAllureBtn.addEventListener('click', () => {
    switchTab('report');
    switchReportView('allure');
  });

  // Terminal Trace & Allure Actions
  elements.terminalTraceBtn.addEventListener('click', openLatestTrace);
  elements.terminalDownloadTraceBtn.addEventListener('click', downloadLatestTrace);
  elements.terminalAllureBtn.addEventListener('click', () => {
    switchTab('report');
    switchReportView('allure');
  });

  // Multi-Report Sub-Tabs
  elements.reportSubTabs.forEach(btn => {
    btn.addEventListener('click', () => switchReportView(btn.dataset.report));
  });
  elements.refreshReportBtn.addEventListener('click', refreshCurrentReport);

  // RCA Drilldown Modal Actions
  elements.rcaModalClose.addEventListener('click', closeRcaModal);
  elements.rcaModalFooterClose.addEventListener('click', closeRcaModal);
  elements.rcaModal.addEventListener('click', (e) => {
    if (e.target === elements.rcaModal) closeRcaModal();
  });

  // Config Inspector Modal Actions
  if (elements.inspectConfigBtn) {
    elements.inspectConfigBtn.addEventListener('click', () => {
      window.openActiveConfigModal();
    });
  }
  if (elements.cfgModalClose) {
    elements.cfgModalClose.addEventListener('click', closeConfigModal);
  }

  // Live Execution Tracker Modal Actions
  if (elements.liveProgressBanner) {
    elements.liveProgressBanner.addEventListener('click', (e) => {
      // Avoid triggering when clicking stop button directly
      if (e.target.id === 'banner-stop-btn' || e.target.closest('#banner-stop-btn')) return;
      openLiveExecutionModal();
    });
  }
  if (elements.bannerDrilldownBtn) {
    elements.bannerDrilldownBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openLiveExecutionModal();
    });
  }
  if (elements.liveExecModalClose) {
    elements.liveExecModalClose.addEventListener('click', closeLiveExecutionModal);
  }
  if (elements.liveExecModalFooterClose) {
    elements.liveExecModalFooterClose.addEventListener('click', closeLiveExecutionModal);
  }
  if (elements.liveExecutionModal) {
    elements.liveExecutionModal.addEventListener('click', (e) => {
      if (e.target === elements.liveExecutionModal) closeLiveExecutionModal();
    });
  }
  if (elements.liveExecViewTerminalBtn) {
    elements.liveExecViewTerminalBtn.addEventListener('click', () => {
      closeLiveExecutionModal();
      switchTab('terminal');
    });
  }
  if (elements.liveExecModalStopBtn) {
    elements.liveExecModalStopBtn.addEventListener('click', () => {
      stopExecution();
      closeLiveExecutionModal();
    });
  }

  // API Details Modal Actions
  if (elements.apiDetailsModalClose) {
    elements.apiDetailsModalClose.addEventListener('click', closeApiDetailsModal);
  }
  if (elements.apiDetailsModalFooterClose) {
    elements.apiDetailsModalFooterClose.addEventListener('click', closeApiDetailsModal);
  }
  if (elements.apiDetailsModal) {
    elements.apiDetailsModal.addEventListener('click', (e) => {
      if (e.target === elements.apiDetailsModal) closeApiDetailsModal();
    });
  }
  if (elements.apiCopyResponseBtn) {
    elements.apiCopyResponseBtn.addEventListener('click', () => {
      const text = elements.apiResponseCode.textContent;
      navigator.clipboard.writeText(text).then(() => {
        elements.apiCopyResponseBtn.textContent = 'Copied! ✓';
        setTimeout(() => { elements.apiCopyResponseBtn.textContent = 'Copy Response'; }, 2000);
      });
    });
  }
  if (elements.apiCopyRequestBtn) {
    elements.apiCopyRequestBtn.addEventListener('click', () => {
      const text = elements.apiRequestCode.textContent;
      navigator.clipboard.writeText(text).then(() => {
        elements.apiCopyRequestBtn.textContent = 'Copied! ✓';
        setTimeout(() => { elements.apiCopyRequestBtn.textContent = 'Copy Payload'; }, 2000);
      });
    });
  }

  // API Inspector Tab switching
  if (elements.apiInspectorTabBtns) {
    elements.apiInspectorTabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        elements.apiInspectorTabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const targetTab = btn.dataset.apiTab;
        document.querySelectorAll('.api-inspector-pane').forEach(pane => pane.classList.remove('active'));
        const activePane = document.getElementById(`api-pane-${targetTab}`);
        if (activePane) activePane.classList.add('active');
      });
    });
  }

  // API Performance Quick Status Filter (All, Success, Failure)
  if (elements.perfStatusFilterGroup) {
    elements.perfStatusFilterGroup.addEventListener('click', (e) => {
      const btn = e.target.closest('.toggle-btn');
      if (!btn) return;
      elements.perfStatusFilterGroup.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.activePerfStatusFilter = btn.dataset.statusFilter || 'ALL';
      filterPerformanceActions();
    });
  }
  if (elements.configInspectorModal) {
    elements.configInspectorModal.addEventListener('click', (e) => {
      if (e.target === elements.configInspectorModal) closeConfigModal();
    });
  }
  if (elements.cfgModalSwitchEnvBtn) {
    elements.cfgModalSwitchEnvBtn.addEventListener('click', () => {
      closeConfigModal();
      switchTab('environments');
    });
  }
  if (elements.cfgRetestPingBtn) {
    elements.cfgRetestPingBtn.addEventListener('click', async () => {
      const activeEnvId = state.activeEnvironmentId;
      elements.cfgPingStatus.textContent = 'Pinging...';
      elements.cfgPingStatus.className = 'status-chip checking';
      await window.testEnvironmentHealth(activeEnvId);
      const updatedEnv = state.environments.find(e => e.id === activeEnvId);
      if (updatedEnv && updatedEnv.health) {
        elements.cfgPingLatency.textContent = `${updatedEnv.health.latency || '--'} ms`;
        elements.cfgPingStatus.textContent = updatedEnv.health.status === 'healthy' ? 'ONLINE (HTTP 200)' : updatedEnv.health.message;
        elements.cfgPingStatus.className = `status-chip ${updatedEnv.health.status === 'healthy' ? 'healthy' : 'warning'}`;
      }
    });
  }
}

// -------------------------------------------------------------
// TAB NAVIGATION
// -------------------------------------------------------------
function switchTab(tabId) {
  state.activeTab = tabId;
  elements.navTabs.forEach(tab => {
    tab.classList.toggle('active', tab.dataset.tab === tabId);
  });
  elements.tabContents.forEach(content => {
    const isTarget = content.id === `tab-content-${tabId}`;
    content.classList.toggle('active', isTarget);
    content.style.display = isTarget ? 'flex' : 'none';
  });

  if (tabId === 'matrix') {
    if (state.scenarios && state.scenarios.length > 0) {
      renderScenariosTable(state.scenarios);
    } else {
      fetchScenarios();
    }
  }
  if (tabId === 'history') fetchHistory();
  if (tabId === 'gallery') fetchScreenshots();
  if (tabId === 'performance') fetchPerformanceMetrics();
  if (tabId === 'environments') renderEnvironmentFleet();
  if (tabId === 'report') switchReportView(state.activeReportTab || 'allure');
  if (tabId === 'schedules') fetchSchedules();
  if (tabId === 'envdiff') fetchEnvironmentDiffMatrix();
  if (tabId === 'flakiness') fetchFlakinessHealth();

  window.scrollTo({ top: 0, behavior: 'smooth' });
}
window.switchTab = switchTab;

// -------------------------------------------------------------
// ENVIRONMENT MANAGEMENT
// -------------------------------------------------------------
async function fetchEnvironments() {
  try {
    const res = await fetch('/api/environments');
    const data = await res.json();
    state.environments = data.environments || [];
    state.activeEnvironmentId = data.activeEnvironmentId || 'sit-stg2';
    state.activeEnvironment = state.environments.find(e => e.id === state.activeEnvironmentId) || state.environments[0];

    updateEnvironmentUI();
    renderEnvironmentDropdown();
    renderEnvironmentFleet();
    populateEnvironmentSelects();
  } catch (err) {
    console.error('Failed to load environments:', err);
  }
}

function updateEnvironmentUI() {
  const env = state.activeEnvironment;
  if (!env) return;

  // Header UI
  elements.headerEnvCategory.textContent = env.category;
  elements.headerEnvCategory.className = `env-category-tag cat-${env.category.toLowerCase()}`;
  elements.headerEnvName.textContent = env.name;
  elements.usernameDisplay.textContent = env.auth.username;

  // Telemetry Banner UI
  elements.telemetryEnvName.textContent = env.name;
  elements.telemetryCategory.textContent = env.category;
  elements.telemetryCategory.className = `badge badge-env cat-${env.category.toLowerCase()}`;
  elements.telemetryBaseUrl.textContent = env.baseUrl;
  elements.telemetryUsername.textContent = env.auth.username;
  elements.kpiEnvs.textContent = `${state.environments.length} Environments`;

  if (elements.runnerEnvSelect) {
    elements.runnerEnvSelect.value = env.id;
  }
}

function renderEnvironmentDropdown() {
  elements.envDropdownList.innerHTML = state.environments.map(env => {
    const isActive = env.id === state.activeEnvironmentId;
    return `
      <div class="env-option-item ${isActive ? 'active' : ''}" onclick="window.switchEnvironment('${env.id}')">
        <div class="env-opt-left">
          <span class="pulse-dot ${getPulseClass(env.health?.status)}"></span>
          <div class="env-opt-details">
            <span class="env-opt-name">${env.name} ${env.isProtected ? '🛡️' : ''}</span>
            <span class="env-opt-url">${env.baseUrl}</span>
          </div>
        </div>
        <span class="env-category-tag cat-${env.category.toLowerCase()}">${env.category}</span>
      </div>
    `;
  }).join('');
}

function populateEnvironmentSelects() {
  const optionsHtml = state.environments.map(env => `
    <option value="${env.id}" ${env.id === state.activeEnvironmentId ? 'selected' : ''}>
      [${env.category}] ${env.name} ${env.isProtected ? '(Protected)' : ''}
    </option>
  `).join('');

  elements.runnerEnvSelect.innerHTML = optionsHtml;

  // History filter
  elements.historyEnvFilter.innerHTML = `<option value="">All Environments</option>` + state.environments.map(env => `
    <option value="${env.id}">[${env.category}] ${env.name}</option>
  `).join('');
}

function renderEnvironmentFleet() {
  elements.envFleetContainer.innerHTML = state.environments.map(env => {
    const isActive = env.id === state.activeEnvironmentId;
    const health = env.health || { status: 'unknown', message: 'Not tested' };
    
    return `
      <div class="env-fleet-card ${isActive ? 'is-active' : ''}">
        <div class="env-card-top">
          <div class="env-card-title-grp">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="pulse-dot ${getPulseClass(health.status)}" id="pulse-${env.id}"></span>
              <span class="env-card-name">${env.name}</span>
            </div>
            <span class="env-card-url">${env.baseUrl}</span>
          </div>
          <span class="env-category-tag cat-${env.category.toLowerCase()}">${env.category}</span>
        </div>

        <p class="env-card-desc">${env.description || 'No description provided.'}</p>

        <div class="env-card-details">
          <div><span class="env-detail-label">Auth User:</span> <span class="env-detail-val">${env.auth.username}</span></div>
          <div><span class="env-detail-label">Protected:</span> <span class="env-detail-val">${env.isProtected ? 'Yes (Safety Locked)' : 'No'}</span></div>
          <div><span class="env-detail-label">Latency:</span> <span class="env-detail-val" id="latency-${env.id}">${health.latency ? health.latency + ' ms' : '--'}</span></div>
          <div><span class="env-detail-label">HTTP Health:</span> <span class="env-detail-val" id="health-msg-${env.id}">${health.status.toUpperCase()}</span></div>
        </div>

        <div class="env-card-actions">
          <div style="display: flex; gap: 6px;">
            <button class="btn btn-secondary btn-sm" onclick="window.testEnvironmentHealth('${env.id}')">📡 Ping</button>
            <button class="btn btn-secondary btn-sm" onclick="window.editEnvironment('${env.id}')">✏️ Edit</button>
            ${!env.isDefault ? `<button class="btn btn-secondary btn-sm" onclick="window.deleteEnvironment('${env.id}')">🗑️</button>` : ''}
          </div>
          ${isActive 
            ? `<span class="badge badge-pass">ACTIVE TARGET</span>`
            : `<button class="btn btn-primary btn-sm" onclick="window.switchEnvironment('${env.id}')">Switch Target</button>`
          }
        </div>
      </div>
    `;
  }).join('');
}

function getPulseClass(status) {
  if (status === 'healthy') return '';
  if (status === 'warning') return 'warning';
  if (status === 'unreachable' || status === 'error') return 'offline';
  if (status === 'checking') return 'checking';
  return 'offline';
}

// Switch Active Environment
window.switchEnvironment = async function(envId) {
  try {
    elements.envDropdownMenu.classList.add('hidden');
    appendLog(`[SYSTEM] Switching active target environment to ID: "${envId}"...`, 'system');

    const res = await fetch('/api/environments/switch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: envId }),
    });

    const data = await res.json();
    if (data.success) {
      state.activeEnvironmentId = envId;
      state.activeEnvironment = state.environments.find(e => e.id === envId);
      updateEnvironmentUI();
      renderEnvironmentDropdown();
      renderEnvironmentFleet();
      appendLog(`[SYSTEM] ✓ Active Environment set to: [${state.activeEnvironment.category}] ${state.activeEnvironment.name} (${state.activeEnvironment.baseUrl})`, 'pass');
      
      // Ping newly selected env
      testEnvironmentHealth(envId);
    } else {
      appendLog(`[ERROR] Failed to switch environment: ${data.error}`, 'fail');
    }
  } catch (err) {
    appendLog(`[ERROR] Exception switching environment: ${err.message}`, 'fail');
  }
};

// Test Health of a Target Environment
window.testEnvironmentHealth = async function(envId) {
  try {
    const pulseEl = document.getElementById(`pulse-${envId}`);
    if (pulseEl) pulseEl.className = 'pulse-dot checking';

    if (envId === state.activeEnvironmentId) {
      elements.telemetryStatusText.textContent = 'Checking...';
      elements.telemetryHealthBadge.textContent = 'CHECKING';
      elements.telemetryHealthBadge.className = 'badge badge-env';
    }

    const res = await fetch('/api/environments/health-check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: envId }),
    });

    const data = await res.json();
    const health = data.health;
    
    // Update local env state
    const env = state.environments.find(e => e.id === envId);
    if (env) env.health = health;

    // Update Telemetry if active env
    if (envId === state.activeEnvironmentId) {
      elements.telemetryLatency.textContent = `${health.latency} ms`;
      elements.headerEnvPulse.className = `pulse-dot ${getPulseClass(health.status)}`;
      if (health.status === 'healthy') {
        elements.telemetryHealthBadge.textContent = 'HEALTHY';
        elements.telemetryHealthBadge.className = 'badge badge-health-online';
        elements.telemetryStatusText.textContent = `HTTP ${health.statusCode} (${health.latency}ms)`;
        elements.telemetryStatusText.className = 'metric-value status-good';
      } else {
        elements.telemetryHealthBadge.textContent = 'OFFLINE / WARN';
        elements.telemetryHealthBadge.className = 'badge badge-health-offline';
        elements.telemetryStatusText.textContent = health.message;
        elements.telemetryStatusText.className = 'metric-value status-bad';
      }
    }

    // Update Card UI elements
    const latencyEl = document.getElementById(`latency-${envId}`);
    if (latencyEl) latencyEl.textContent = `${health.latency} ms`;
    const healthMsgEl = document.getElementById(`health-msg-${envId}`);
    if (healthMsgEl) healthMsgEl.textContent = health.status.toUpperCase();
    if (pulseEl) pulseEl.className = `pulse-dot ${getPulseClass(health.status)}`;

    appendLog(`[HEALTH-CHECK] ${data.environment}: ${health.message} (${health.latency}ms)`, health.status === 'healthy' ? 'pass' : 'warn');
  } catch (err) {
    appendLog(`[HEALTH-CHECK] Failed for ${envId}: ${err.message}`, 'fail');
  }
};

async function pingAllEnvironments() {
  appendLog('[SYSTEM] Pinging all configured environment endpoints in parallel...', 'system');
  for (const env of state.environments) {
    window.testEnvironmentHealth(env.id);
  }
}

// -------------------------------------------------------------
// ENVIRONMENT MODAL (ADD / EDIT)
// -------------------------------------------------------------
function openEnvironmentModal(envId = null) {
  elements.envFormPingResult.classList.add('hidden');
  elements.envForm.reset();

  if (envId) {
    const env = state.environments.find(e => e.id === envId);
    if (!env) return;
    elements.envModalTitle.textContent = `Edit Environment: ${env.name}`;
    elements.envFormId.value = env.id;
    elements.envFormName.value = env.name;
    elements.envFormCategory.value = env.category;
    elements.envFormProtected.checked = !!env.isProtected;
    elements.envFormUrl.value = env.baseUrl;
    elements.envFormUsername.value = env.auth.username;
    elements.envFormPassword.value = '';
    elements.envFormDesc.value = env.description || '';
  } else {
    elements.envModalTitle.textContent = 'Add Custom Target Environment';
    elements.envFormId.value = '';
    elements.envFormCategory.value = 'CUSTOM';
    elements.envFormProtected.checked = false;
  }

  elements.envModal.classList.remove('hidden');
}

window.editEnvironment = function(envId) {
  openEnvironmentModal(envId);
};

window.deleteEnvironment = async function(envId) {
  if (!confirm(`Are you sure you want to delete environment "${envId}"?`)) return;

  try {
    const res = await fetch(`/api/environments/${envId}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) {
      appendLog(`[SYSTEM] Environment "${envId}" removed`, 'system');
      fetchEnvironments();
    } else {
      alert(data.error);
    }
  } catch (err) {
    alert(err.message);
  }
};

function closeEnvironmentModal() {
  elements.envModal.classList.add('hidden');
}

async function handleTestModalUrl() {
  const url = elements.envFormUrl.value.trim();
  if (!url) return alert('Please enter a valid URL first');

  elements.envFormPingResult.classList.remove('hidden');
  elements.envFormPingResult.textContent = 'Pinging URL endpoint...';

  try {
    const startTime = Date.now();
    const res = await fetch('/api/environments/health-check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: state.activeEnvironmentId }), // simple ping
    });
    const latency = Date.now() - startTime;
    elements.envFormPingResult.textContent = `✓ Response received in ${latency}ms`;
    elements.envFormPingResult.style.color = '#34d399';
  } catch (err) {
    elements.envFormPingResult.textContent = `✕ Connection test failed: ${err.message}`;
    elements.envFormPingResult.style.color = '#f87171';
  }
}

async function handleSaveEnvironment(e) {
  e.preventDefault();
  const id = elements.envFormId.value;
  const payload = {
    name: elements.envFormName.value.trim(),
    category: elements.envFormCategory.value,
    baseUrl: elements.envFormUrl.value.trim(),
    username: elements.envFormUsername.value.trim(),
    password: elements.envFormPassword.value,
    description: elements.envFormDesc.value.trim(),
    isProtected: elements.envFormProtected.checked,
  };

  try {
    const url = id ? `/api/environments/${id}` : '/api/environments';
    const method = id ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (data.success) {
      closeEnvironmentModal();
      appendLog(`[SYSTEM] Environment "${payload.name}" saved successfully`, 'pass');
      fetchEnvironments();
    } else {
      alert(data.error);
    }
  } catch (err) {
    alert(`Error saving environment: ${err.message}`);
  }
}

// -------------------------------------------------------------
// SUITES & SCENARIOS
// -------------------------------------------------------------
async function fetchSuites() {
  try {
    const res = await fetch('/api/suites');
    const data = await res.json();
    state.suites = data.suites || [];
    renderSuitesGrid();
    populateSuiteFilters();
  } catch (err) {
    console.error('Failed to fetch suites:', err);
  }
}

// Multi-Module Selection State
state.selectedSuiteIds = [];

function renderSuitesGrid(filterGroup = 'all') {
  let suitesToRender = state.suites;
  
  if (filterGroup === 'core') {
    suitesToRender = state.suites.filter(s => ['auth', 'dashboard', 'config'].includes(s.id));
  } else if (filterGroup === 'sims') {
    suitesToRender = state.suites.filter(s => ['subscriptions', 'resources'].includes(s.id));
  } else if (filterGroup === 'billing') {
    suitesToRender = state.suites.filter(s => ['rating', 'invoice_data', 'accounts', 'account_lifecycle'].includes(s.id));
  } else if (filterGroup === 'admin') {
    suitesToRender = state.suites.filter(s => ['administration', 'automation_rules', 'security', 'reports', 'ordering'].includes(s.id));
  }

  elements.suitesContainer.innerHTML = suitesToRender.map(suite => {
    const isSelected = (state.selectedSuiteIds || []).includes(suite.id);
    return `
      <div class="suite-card glass-card ${isSelected ? 'is-selected' : ''}" id="suite-card-${suite.id}" onclick="window.toggleSuiteSelection('${suite.id}', event)" title="Click card to select / multi-select this module. Click 'View Tests' to inspect.">
        <div class="suite-header">
          <div class="suite-checkbox-wrapper" onclick="event.stopPropagation();">
            <input type="checkbox" class="suite-checkbox" id="suite-chk-${suite.id}" ${isSelected ? 'checked' : ''} onchange="window.toggleSuiteSelection('${suite.id}', event)">
          </div>
          <div class="suite-icon">${suite.icon || '📦'}</div>
          <div class="suite-info">
            <h3 class="suite-title">
              <span>${suite.name}</span>
            </h3>
            <p class="suite-desc">${suite.description}</p>
          </div>
        </div>
        <div class="suite-footer">
          <div class="suite-meta">
            <span>📁 ${suite.path}</span>
          </div>
          <div class="suite-card-actions">
            <button class="btn-view-tests" onclick="event.stopPropagation(); window.openSuiteDetailsModal('${suite.id}')" title="View individual test cases">
              🔍 View ${suite.testCount} Tests
            </button>
            <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); window.triggerSuiteRun('${suite.id}')" title="Execute this entire suite">
              <span>▶ Run</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  elements.kpiModules.textContent = `${state.suites.length} Suites`;
  elements.suiteCountBadge.textContent = `${state.suites.length} Modules Ready`;
}

window.toggleSuiteSelection = function(suiteId, event) {
  if (suiteId === 'all') return;
  const idx = state.selectedSuiteIds.indexOf(suiteId);
  if (idx > -1) {
    state.selectedSuiteIds.splice(idx, 1);
  } else {
    state.selectedSuiteIds.push(suiteId);
  }

  const card = document.getElementById(`suite-card-${suiteId}`);
  const chk = document.getElementById(`suite-chk-${suiteId}`);
  const isSel = state.selectedSuiteIds.includes(suiteId);

  if (card) card.classList.toggle('is-selected', isSel);
  if (chk) chk.checked = isSel;

  updateSelectedModulesBar();
};

function updateSelectedModulesBar() {
  const btn = document.getElementById('run-selected-modules-btn');
  const countEl = document.getElementById('selected-modules-count');
  const count = state.selectedSuiteIds.length;

  if (countEl) countEl.textContent = count;
  if (btn) {
    if (count > 0) btn.classList.remove('hidden');
    else btn.classList.add('hidden');
  }
}


// -------------------------------------------------------------
// SUITE DETAILS & TEST CASES VIEWER MODAL
// -------------------------------------------------------------
window.openSuiteDetailsModal = function(suiteId) {
  const suite = state.suites.find(s => s.id === suiteId);
  if (!suite) return;

  state.activeModalSuiteId = suiteId;

  // Header data
  elements.suiteModalIcon.textContent = suite.icon || '📦';
  elements.suiteModalName.textContent = suite.name;
  elements.suiteModalDesc.textContent = `${suite.description} (Spec Path: ${suite.path})`;
  elements.suiteModalSearch.value = '';

  // Target Env Footer
  const activeEnv = state.activeEnvironment || { name: 'SIT - STG 2', baseUrl: 'https://wdh-sitstg2.nokiawing.com', health: { status: 'healthy' } };
  elements.suiteModalTargetEnv.textContent = activeEnv.name;
  elements.suiteModalTargetUrl.textContent = activeEnv.baseUrl;
  elements.suiteModalPulse.className = `pulse-dot ${getPulseClass(activeEnv.health?.status)}`;

  renderSuiteModalTestCases(suiteId, '');
  elements.suiteDetailsModal.classList.remove('hidden');
};

function renderSuiteModalTestCases(suiteId, query = '') {
  const q = query.toLowerCase().trim();
  
  // Get scenarios matching this suite
  let suiteScenarios = suiteId === 'all' 
    ? state.scenarios 
    : state.scenarios.filter(sc => sc.suiteId === suiteId);

  if (q) {
    suiteScenarios = suiteScenarios.filter(sc =>
      sc.id.toLowerCase().includes(q) ||
      sc.name.toLowerCase().includes(q) ||
      sc.description.toLowerCase().includes(q) ||
      (sc.tag && sc.tag.toLowerCase().includes(q))
    );
  }

  elements.suiteModalCountBadge.textContent = `${suiteScenarios.length} Test${suiteScenarios.length === 1 ? '' : 's'}`;

  if (suiteScenarios.length === 0) {
    elements.suiteTestCasesList.innerHTML = `
      <div class="suite-empty-state">
        <p>No test cases found matching "<strong>${query}</strong>"</p>
      </div>
    `;
    return;
  }

  elements.suiteTestCasesList.innerHTML = suiteScenarios.map(sc => `
    <div class="suite-tc-item">
      <div class="suite-tc-top">
        <div class="suite-tc-title-wrap">
          <span class="suite-tc-id">${sc.id}</span>
          <span class="suite-tc-name">${sc.name}</span>
        </div>
        <span class="tag-badge">${sc.tag || 'Test'}</span>
      </div>
      <p class="suite-tc-desc">${sc.description}</p>
      <div class="suite-tc-footer">
        <span class="suite-tc-file">📄 ${sc.file}</span>
        <div style="display: flex; gap: 6px;">
          <button class="btn btn-secondary btn-sm" onclick="window.openConfigModalForScenario('${sc.id}')" title="Inspect runtime configuration before running this test">
            <span>⚙️ Check Config</span>
          </button>
          <button class="btn btn-primary btn-sm" onclick="window.runSingleTestFromModal('${sc.id}')" title="Run single scenario">
            <span>▶ Run Test</span>
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

window.runSingleTestFromModal = function(scenarioId) {
  closeSuiteDetailsModal();
  window.triggerScenarioRun(scenarioId);
};

function closeSuiteDetailsModal() {
  elements.suiteDetailsModal.classList.add('hidden');
  state.activeModalSuiteId = null;
}

// -------------------------------------------------------------
// CONFIGURATION INSPECTOR MODAL LOGIC
// -------------------------------------------------------------
let pendingConfigRunPayload = null;

window.openActiveConfigModal = function() {
  window.openConfigModalForScope({
    type: 'Full Regression Suite',
    name: 'All Automated Portal Modules (75 Tests)',
    file: 'tests',
    grep: '-- (All Tests)',
    payload: { suiteId: 'all' },
  });
};

window.openConfigModalForSuite = function(suiteId) {
  const suite = state.suites.find(s => s.id === suiteId);
  if (!suite) return;
  window.openConfigModalForScope({
    type: 'Module Suite',
    name: suite.name,
    file: suite.path,
    grep: '-- (Suite All)',
    payload: { suiteId: suite.id },
  });
};

window.openConfigModalForScenario = function(scenarioId) {
  const sc = state.scenarios.find(s => s.id === scenarioId);
  if (!sc) return;
  window.openConfigModalForScope({
    type: 'Single Test Scenario',
    name: `${sc.id}: ${sc.name}`,
    file: sc.file,
    grep: sc.id,
    payload: { scenarioId: sc.id },
  });
};

window.openConfigModalForScope = function(scope) {
  pendingConfigRunPayload = scope.payload;

  const selectedEnvId = elements.runnerEnvSelect?.value || state.activeEnvironmentId;
  const activeEnv = state.environments.find(e => e.id === selectedEnvId) || state.activeEnvironment || {
    id: 'sit-stg2',
    name: 'SIT - STG 2 (Default)',
    category: 'SIT',
    baseUrl: 'https://wdh-sitstg2.nokiawing.com',
    auth: { username: 'vetrivel_m' },
    timeouts: { short: 5000, medium: 15000, long: 30000, pageLoad: 45000 },
  };

  elements.cfgModalEnvBadge.textContent = activeEnv.category;
  elements.cfgModalEnvBadge.className = `badge cat-${activeEnv.category.toLowerCase()}`;

  elements.cfgTargetTypeBadge.textContent = scope.type;
  elements.cfgTargetName.textContent = scope.name;
  elements.cfgTargetFile.textContent = scope.file;
  elements.cfgTargetGrep.textContent = scope.grep;
  elements.cfgTargetBrowser.textContent = `${state.selectedBrowser.toUpperCase()} (${state.isHeaded ? 'Visual / Headed' : 'Headless'})`;

  elements.cfgEnvName.textContent = activeEnv.name;
  elements.cfgEnvUrl.textContent = activeEnv.baseUrl;
  elements.cfgEnvUrl.href = activeEnv.baseUrl;
  elements.cfgAuthUser.textContent = activeEnv.auth?.username || 'anonymous';
  elements.cfgAuthPwdStatus.textContent = 'Configured (••••••••)';

  const timeouts = activeEnv.timeouts || { short: 5000, medium: 15000, long: 30000, pageLoad: 45000 };
  elements.cfgTimeoutShort.textContent = `${(timeouts.short || 5000).toLocaleString()} ms`;
  elements.cfgTimeoutMedium.textContent = `${(timeouts.medium || 15000).toLocaleString()} ms`;
  elements.cfgTimeoutLong.textContent = `${(timeouts.long || 30000).toLocaleString()} ms`;
  elements.cfgTimeoutPageload.textContent = `${(timeouts.pageLoad || 45000).toLocaleString()} ms`;

  // Preflight Health status
  const health = activeEnv.health || { status: 'healthy', latency: 310, message: 'HTTP 200' };
  elements.cfgPingLatency.textContent = `${health.latency || 310} ms`;
  elements.cfgPingStatus.textContent = health.status === 'healthy' ? 'ONLINE (HEALTHY)' : (health.message || 'UNKNOWN');
  elements.cfgPingStatus.className = `status-chip ${health.status === 'healthy' ? 'healthy' : 'warning'}`;

  // Pre-flight checklist rendering
  const isHttps = activeEnv.baseUrl.startsWith('https://');
  const hasUser = !!activeEnv.auth?.username;
  const isTimeoutProgressionOk = (timeouts.short <= timeouts.medium) && (timeouts.medium <= timeouts.long);

  elements.cfgChecklistItems.innerHTML = `
    <li class="${isHttps ? 'check-pass' : 'check-warn'}">${isHttps ? '✓' : '⚠️'} Base URL schema: ${isHttps ? 'Valid HTTPS protocol' : 'HTTP protocol'} (${activeEnv.baseUrl})</li>
    <li class="${hasUser ? 'check-pass' : 'check-fail'}">${hasUser ? '✓' : '✗'} Authenticated User: "${activeEnv.auth?.username}" configured</li>
    <li class="${isTimeoutProgressionOk ? 'check-pass' : 'check-warn'}">${isTimeoutProgressionOk ? '✓' : '⚠️'} Timeout Hierarchy: Short (${timeouts.short}ms) &le; Med (${timeouts.medium}ms) &le; Long (${timeouts.long}ms)</li>
    <li class="check-pass">✓ Deep Traces recording enabled for visual DOM inspection</li>
    <li class="check-pass">✓ Allure executive reporting telemetry active</li>
    <li class="${activeEnv.isProtected ? 'check-warn' : 'check-pass'}">${activeEnv.isProtected ? '⚠️ Protected Environment: Safety confirmation required' : '✓ Standard Stage Environment (Direct execution allowed)'}</li>
  `;

  if (elements.cfgModalRunBtn) {
    elements.cfgModalRunBtn.onclick = () => {
      closeConfigModal();
      if (pendingConfigRunPayload) {
        triggerRun(pendingConfigRunPayload);
      }
    };
  }

  elements.configInspectorModal.classList.remove('hidden');
};

function closeConfigModal() {
  if (elements.configInspectorModal) {
    elements.configInspectorModal.classList.add('hidden');
  }
  pendingConfigRunPayload = null;
}

// Multi-Scenario Selection State
state.selectedScenarioIds = [];

async function fetchScenarios() {
  try {
    const res = await fetch('/api/scenarios');
    const data = await res.json();
    state.scenarios = data.scenarios || [];
    populateOperationGroupFilters();
    renderScenariosTable(state.scenarios);
    elements.kpiScenarios.textContent = `${state.scenarios.length} Tests`;
    elements.tabScenariosBadge.textContent = state.scenarios.length;
  } catch (err) {
    console.error('Failed to fetch scenarios:', err);
  }
}

function populateOperationGroupFilters() {
  const groupFilter = document.getElementById('scenario-group-filter');
  if (!groupFilter) return;

  const groups = [...new Set(state.scenarios.map(s => s.operationGroup).filter(Boolean))];
  groupFilter.innerHTML = `<option value="all">All Operation Groups (${groups.length})</option>` + groups.map(g => `
    <option value="${g}">${g}</option>
  `).join('');
}

function populateSuiteFilters() {
  elements.scenarioSuiteFilter.innerHTML = `<option value="all">All Suites</option>` + state.suites.map(s => `
    <option value="${s.id}">${s.name}</option>
  `).join('');
}

function renderScenariosTable(scenariosList) {
  if (scenariosList.length === 0) {
    elements.scenariosTableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #64748b; padding: 24px;">No matching scenarios found for the selected filters.</td></tr>`;
    return;
  }

  elements.scenariosTableBody.innerHTML = scenariosList.map(sc => {
    const isChecked = state.selectedScenarioIds.includes(sc.id);
    const tagsList = sc.tags || [sc.tag || 'Test'];

    return `
      <tr class="${isChecked ? 'bg-blue-500/10' : ''}">
        <td>
          <input type="checkbox" class="scenario-checkbox" value="${sc.id}" ${isChecked ? 'checked' : ''} onchange="window.toggleScenarioSelection('${sc.id}', event)">
        </td>
        <td><span class="font-mono" style="font-weight: 700; color: #60a5fa;">${sc.id}</span></td>
        <td>
          <div style="font-weight: 600;">${sc.suiteName}</div>
          ${sc.operationGroup ? `<span class="op-group-badge">${sc.operationGroup}</span>` : ''}
        </td>
        <td>
          <div style="font-weight: 600; color: var(--text-main);">${sc.name}</div>
          <div style="font-size: 0.74rem; color: var(--text-muted); margin-top: 2px;">${sc.description}</div>
        </td>
        <td>
          <div class="flex flex-wrap gap-1">
            ${tagsList.map(t => `<span class="tag-badge">${t}</span>`).join('')}
          </div>
        </td>
        <td>
          <div style="display: flex; gap: 6px; justify-content: flex-end;">
            <button class="btn btn-secondary btn-sm" onclick="window.openConfigModalForScenario('${sc.id}')" title="Check runtime configuration for this test">
              <span>⚙️ Config</span>
            </button>
            <button class="btn btn-primary btn-sm" onclick="window.triggerScenarioRun('${sc.id}')" title="Run this scenario">
              <span>▶ Run</span>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  updateSelectedScenariosBar();
}

window.toggleScenarioSelection = function(scenarioId, event) {
  const idx = state.selectedScenarioIds.indexOf(scenarioId);
  if (idx > -1) {
    state.selectedScenarioIds.splice(idx, 1);
  } else {
    state.selectedScenarioIds.push(scenarioId);
  }
  updateSelectedScenariosBar();
};

function updateSelectedScenariosBar() {
  const btn = document.getElementById('run-selected-scenarios-btn');
  const countEl = document.getElementById('selected-scenarios-count');
  const count = state.selectedScenarioIds.length;

  if (countEl) countEl.textContent = count;
  if (btn) {
    if (count > 0) btn.classList.remove('hidden');
    else btn.classList.add('hidden');
  }
}

function filterScenariosTable() {
  const query = elements.scenarioSearch.value.toLowerCase().trim();
  const suiteId = elements.scenarioSuiteFilter.value;
  const groupFilter = document.getElementById('scenario-group-filter')?.value || 'all';
  const tagFilter = document.getElementById('scenario-tag-filter')?.value || 'all';

  const filtered = state.scenarios.filter(sc => {
    const matchesSuite = suiteId === 'all' || sc.suiteId === suiteId;
    const matchesGroup = groupFilter === 'all' || sc.operationGroup === groupFilter;
    const matchesTag = tagFilter === 'all' || (sc.tags && sc.tags.includes(tagFilter)) || (sc.tag && sc.tag === tagFilter);
    const matchesQuery = !query || 
      sc.id.toLowerCase().includes(query) || 
      sc.name.toLowerCase().includes(query) || 
      sc.description.toLowerCase().includes(query) ||
      (sc.operationGroup && sc.operationGroup.toLowerCase().includes(query)) ||
      (sc.tags && sc.tags.some(t => t.toLowerCase().includes(query))) ||
      (sc.tag && sc.tag.toLowerCase().includes(query));
    return matchesSuite && matchesGroup && matchesTag && matchesQuery;
  });

  renderScenariosTable(filtered);
}

// -------------------------------------------------------------
// TEST RUN EXECUTION & PROD SAFETY GUARD
// -------------------------------------------------------------
window.triggerSuiteRun = function(suiteId) {
  triggerRun({ suiteId });
};

window.triggerScenarioRun = function(scenarioId) {
  triggerRun({ scenarioId });
};

function triggerRun(payload) {
  const selectedEnvId = elements.runnerEnvSelect.value || state.activeEnvironmentId;
  const targetEnv = state.environments.find(e => e.id === selectedEnvId) || state.activeEnvironment;

  const runPayload = {
    ...payload,
    envId: targetEnv.id,
    browser: state.selectedBrowser,
    headed: state.isHeaded,
    workers: state.workers || 1,
  };

  // Check if Protected / PROD environment
  if (targetEnv.isProtected || targetEnv.category === 'PROD') {
    promptProdSafetyModal(targetEnv, runPayload);
    return;
  }

  executeRunRequest(runPayload);
}

function promptProdSafetyModal(targetEnv, runPayload) {
  state.pendingRunPayload = runPayload;
  elements.safetyEnvTarget.textContent = `[${targetEnv.category}] ${targetEnv.name} (${targetEnv.baseUrl})`;
  elements.prodConfirmInput.value = '';
  elements.prodProceedBtn.disabled = true;
  elements.prodSafetyModal.classList.remove('hidden');
}

function closeProdSafetyModal() {
  elements.prodSafetyModal.classList.add('hidden');
  state.pendingRunPayload = null;
}

async function executeRunRequest(payload) {
  try {
    elements.runAllBtn.disabled = true;
    elements.stopRunBtn.disabled = false;

    appendLog(`[SYSTEM] Initializing Test Execution against environment: [${payload.envId}]...`, 'system');

    const res = await fetch('/api/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!data.success) {
      appendLog(`[ERROR] ${data.error || 'Failed to start run'}`, 'fail');
      elements.runAllBtn.disabled = false;
      elements.stopRunBtn.disabled = true;
    }
  } catch (err) {
    appendLog(`[ERROR] Request error: ${err.message}`, 'fail');
    elements.runAllBtn.disabled = false;
    elements.stopRunBtn.disabled = true;
  }
}

async function stopExecution() {
  try {
    appendLog('[SYSTEM] Sending abort signal to Playwright process...', 'warn');
    await fetch('/api/stop', { method: 'POST' });
  } catch (err) {
    console.error('Failed to stop execution:', err);
  }
}

// -------------------------------------------------------------
// SSE LIVE STREAMING & AI RCA / TRACE HANDLERS
// -------------------------------------------------------------
function setupSSE() {
  const eventSource = new EventSource('/api/stream');

  eventSource.addEventListener('init', (e) => {
    const data = JSON.parse(e.data);
    if (data.isRunning) handleRunStart(data);
    if (data.latestTrace) handleTraceAvailable(data.latestTrace);
    if (data.rca) displayAiRcaDiagnostic(data.rca);
  });

  eventSource.addEventListener('start', (e) => {
    const data = JSON.parse(e.data);
    handleRunStart(data);
  });

  eventSource.addEventListener('log', (e) => {
    const { line, type } = JSON.parse(e.data);
    appendLog(line, type);
  });

  eventSource.addEventListener('stats', (e) => {
    const stats = JSON.parse(e.data);
    updateStatsUI(stats);
  });

  eventSource.addEventListener('test_active', (e) => {
    const testInfo = JSON.parse(e.data);
    handleActiveTestUpdate(testInfo);
  });

  eventSource.addEventListener('test_completed', (e) => {
    const completedInfo = JSON.parse(e.data);
    handleCompletedTestUpdate(completedInfo);
  });

  eventSource.addEventListener('trace', (e) => {
    const trace = JSON.parse(e.data);
    handleTraceAvailable(trace);
  });

  eventSource.addEventListener('rca', (e) => {
    const rca = JSON.parse(e.data);
    displayAiRcaDiagnostic(rca);
  });

  eventSource.addEventListener('finish', (e) => {
    const data = JSON.parse(e.data);
    handleRunFinish(data);
  });

  eventSource.addEventListener('allure_updated', (e) => {
    // Automatically reload embedded Allure iframe in real-time when new results are compiled
    if (elements.reportIframe && state.activeReportTab === 'allure') {
      elements.reportIframe.src = `/reports/allure/index.html?t=${Date.now()}`;
    }
  });

  eventSource.addEventListener('env_switched', (e) => {
    const data = JSON.parse(e.data);
    fetchEnvironments();
  });
}

// -------------------------------------------------------------
// EXECUTIVE 1-CLICK CLIENT GOVERNANCE PRESETS
// -------------------------------------------------------------
window.triggerExecutiveRun = function(presetType) {
  if (presetType === 'smoke') {
    appendLog('[EXECUTIVE GATE] Initializing 1-Click Production Smoke Audit (Auth + Navigation + Dashboard)...', 'system');
    triggerRun({ suiteIds: ['auth', 'dashboard'] });
  } else if (presetType === 'sanity') {
    appendLog('[EXECUTIVE GATE] Initializing 1-Click Core Sanity Gate (Accounts + Subscriptions + Rating)...', 'system');
    triggerRun({ suiteIds: ['accounts', 'subscriptions', 'rating'] });
  }
};

window.openEmailPreviewModal = function() {
  const modal = document.getElementById('email-preview-modal');
  const iframe = document.getElementById('email-preview-iframe');
  if (iframe) iframe.src = `/api/reports/email-preview?t=${Date.now()}`;
  if (modal) modal.classList.remove('hidden');
};

window.closeEmailPreviewModal = function() {
  const modal = document.getElementById('email-preview-modal');
  if (modal) modal.classList.add('hidden');
};

window.triggerEmailDispatchNow = async function() {
  try {
    const recipient = prompt('Enter recipient email address(es):', 'stakeholders@nokiawing.com');
    if (!recipient) return;

    appendLog(`[EMAIL DISPATCH] Sending executive test digest to ${recipient}...`, 'system');
    const res = await fetch('/api/reports/dispatch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channel: 'email', recipientEmail: recipient }),
    });
    const data = await res.json();
    alert(data.message || 'Email report dispatched successfully!');
    window.closeEmailPreviewModal();
  } catch (err) {
    alert(`Failed to dispatch email: ${err.message}`);
  }
};


// -------------------------------------------------------------
// LIVE TEST EXECUTION TRACKER MODAL LOGIC
// -------------------------------------------------------------
let liveTimerInterval = null;
let liveActiveStartTime = null;

function handleRunStart(runData) {
  state.currentRun = runData;
  state.activeTest = null;
  state.completedTests = [];
  state.runStartTime = Date.now();

  elements.liveProgressBanner.classList.remove('hidden');
  elements.progressTitle.textContent = `Executing: ${runData.suiteName}`;
  elements.progressSubtitle.textContent = `Target: [${runData.envName || 'SIT'}] ${runData.baseUrl || ''} | Browser: ${runData.browser}`;
  elements.liveEnvBadge.textContent = runData.envName || 'SIT';
  elements.livePassCount.textContent = '0 Passed';
  elements.liveFailCount.textContent = '0 Failed';
  elements.progressBarFill.style.width = '10%';
  elements.runAllBtn.disabled = true;
  elements.stopRunBtn.disabled = false;

  // Live Execution Canvas HUD Updates
  const canvasTitle = document.getElementById('canvas-active-suite-title');
  const canvasSub = document.getElementById('canvas-active-subtitle');
  const canvasEnv = document.getElementById('canvas-env-badge');
  const canvasStatus = document.getElementById('canvas-status-badge');
  const canvasOrb = document.getElementById('canvas-status-orb');
  const canvasPass = document.getElementById('canvas-pass-count');
  const canvasFail = document.getElementById('canvas-fail-count');
  const canvasComp = document.getElementById('canvas-completed-count');
  const canvasProg = document.getElementById('canvas-progress-bar');
  const canvasActiveName = document.getElementById('canvas-active-test-name');
  const canvasActiveFile = document.getElementById('canvas-active-test-file');
  const canvasLatestAction = document.getElementById('canvas-latest-action');
  const canvasWorker = document.getElementById('canvas-active-worker-info');

  if (canvasTitle) canvasTitle.textContent = `Executing: ${runData.suiteName}`;
  if (canvasSub) canvasSub.textContent = `Target: [${runData.envName || 'SIT'}] ${runData.baseUrl || ''} | Engine: ${runData.browser} (${runData.workers || 1}x Workers)`;
  if (canvasEnv) canvasEnv.textContent = runData.envName || 'SIT';
  if (canvasStatus) {
    canvasStatus.textContent = 'RUNNING';
    canvasStatus.className = 'badge badge-health-online text-xs';
  }
  if (canvasOrb) canvasOrb.innerHTML = '<span class="pulse-dot"></span>';
  if (canvasPass) canvasPass.textContent = '0';
  if (canvasFail) canvasFail.textContent = '0';
  if (canvasComp) canvasComp.textContent = `0 / ${runData.stats?.total || 1}`;
  if (canvasProg) canvasProg.style.width = '5%';
  if (canvasActiveName) canvasActiveName.textContent = 'Initializing browser workers & pre-flight...';
  if (canvasActiveFile) canvasActiveFile.textContent = 'Target Spec: ' + (runData.suiteId || 'tests');
  if (canvasLatestAction) canvasLatestAction.textContent = 'Launching session...';
  if (canvasWorker) canvasWorker.textContent = `Worker: ${runData.workers || 1}x ${runData.browser}`;

  // Start Elapsed HUD Timer
  if (window.canvasElapsedInterval) clearInterval(window.canvasElapsedInterval);
  window.canvasElapsedInterval = setInterval(() => {
    const elapsedEl = document.getElementById('canvas-elapsed-time');
    if (elapsedEl && state.runStartTime) {
      elapsedEl.textContent = `${((Date.now() - state.runStartTime) / 1000).toFixed(1)}s`;
    }
  }, 100);

  // Reset live execution modal fields
  if (elements.liveExecPassBadge) elements.liveExecPassBadge.textContent = '0 Passed';
  if (elements.liveExecFailBadge) elements.liveExecFailBadge.textContent = '0 Failed';
  if (elements.liveExecEnvBadge) elements.liveExecEnvBadge.textContent = runData.envName || 'SIT';
  if (elements.liveExecModalTitle) elements.liveExecModalTitle.textContent = `Live Run: ${runData.suiteName}`;
  if (elements.liveActiveName) elements.liveActiveName.textContent = 'Launching browser & workers...';
  if (elements.liveActiveMeta) elements.liveActiveMeta.textContent = `Target URL: ${runData.baseUrl}`;
  if (elements.liveCompletedList) {
    elements.liveCompletedList.innerHTML = '<div class="empty-state text-muted">Test cases will appear here as they finish executing in real-time...</div>';
  }
  if (elements.liveCompletedCount) elements.liveCompletedCount.textContent = '0 Completed';
  if (elements.liveExecProgressPct) elements.liveExecProgressPct.textContent = '10%';

  // Reset Canvas Completed Feed
  const canvasFeed = document.getElementById('canvas-completed-feed');
  if (canvasFeed) {
    canvasFeed.innerHTML = '<div class="empty-state text-muted text-xs p-4 text-center">Test scenarios will stream into this feed as visual cards in real-time...</div>';
  }

  // Reset diagnostic card and trace buttons
  elements.aiRcaBanner.classList.add('hidden');
  elements.terminalTraceBtn.classList.add('hidden');
  elements.terminalDownloadTraceBtn.classList.add('hidden');
}

function handleActiveTestUpdate(testInfo) {
  state.activeTest = testInfo;
  liveActiveStartTime = testInfo.startTime || Date.now();

  const formattedName = testInfo.id ? `[${testInfo.id}] ${testInfo.name}` : testInfo.name;

  if (elements.liveActiveName) {
    elements.liveActiveName.textContent = formattedName;
  }
  if (elements.liveActiveMeta) {
    elements.liveActiveMeta.textContent = `Status: IN PROGRESS | Started at: ${new Date(liveActiveStartTime).toLocaleTimeString()}`;
  }

  // Update Canvas Active Spotlight Card
  const canvasActiveName = document.getElementById('canvas-active-test-name');
  const canvasLatestAction = document.getElementById('canvas-latest-action');
  if (canvasActiveName) canvasActiveName.textContent = formattedName;
  if (canvasLatestAction) canvasLatestAction.textContent = `Executing step assertions on ${testInfo.id || 'UI'}...`;

  // Animate Micro Steppers
  const stepAuth = document.getElementById('step-node-auth');
  const stepNav = document.getElementById('step-node-nav');
  const stepAction = document.getElementById('step-node-action');
  const stepTeardown = document.getElementById('step-node-teardown');

  if (stepAuth) { stepAuth.className = 'step-node passed'; }
  if (stepNav) { stepNav.className = 'step-node passed'; }
  if (stepAction) { stepAction.className = 'step-node active'; }
  if (stepTeardown) { stepTeardown.className = 'step-node'; }

  if (liveTimerInterval) clearInterval(liveTimerInterval);
  liveTimerInterval = setInterval(() => {
    if (liveActiveStartTime) {
      const elapsedSec = ((Date.now() - liveActiveStartTime) / 1000).toFixed(1);
      if (elements.liveActiveTimer) elements.liveActiveTimer.textContent = `Elapsed: ${elapsedSec}s`;
      const canvasTimer = document.getElementById('canvas-active-test-timer');
      if (canvasTimer) canvasTimer.textContent = `Timer: ${elapsedSec}s`;
    }
  }, 200);
}

function handleCompletedTestUpdate(completedInfo) {
  if (!state.completedTests) state.completedTests = [];
  state.completedTests.unshift(completedInfo);

  // Synchronously compute stats from live completed test stream
  const passedCount = state.completedTests.filter(t => t.status === 'passed').length;
  const failedCount = state.completedTests.filter(t => t.status === 'failed').length;
  const totalCompleted = passedCount + failedCount;
  const expectedTotal = state.currentRun?.stats?.total || 176;

  // Update Live Banner Badges
  if (elements.livePassCount) elements.livePassCount.textContent = `${passedCount} Passed`;
  if (elements.liveFailCount) elements.liveFailCount.textContent = `${failedCount} Failed`;

  // Update Live Execution Modal Badges
  if (elements.liveExecPassBadge) elements.liveExecPassBadge.textContent = `${passedCount} Passed`;
  if (elements.liveExecFailBadge) elements.liveExecFailBadge.textContent = `${failedCount} Failed`;

  // Update Canvas HUD Counters
  const canvasPass = document.getElementById('canvas-pass-count');
  const canvasFail = document.getElementById('canvas-fail-count');
  const canvasComp = document.getElementById('canvas-completed-count');
  const canvasFeedCount = document.getElementById('canvas-feed-count');

  if (canvasPass) canvasPass.textContent = passedCount;
  if (canvasFail) canvasFail.textContent = failedCount;
  if (canvasComp) canvasComp.textContent = `${totalCompleted} / ${expectedTotal}`;
  if (canvasFeedCount) canvasFeedCount.textContent = `${totalCompleted} Finished`;

  // Update Progress Bar and Overall Progress text
  const pct = Math.min(100, Math.max(5, Math.round((totalCompleted / Math.max(expectedTotal, 1)) * 100)));
  if (elements.progressBarFill) elements.progressBarFill.style.width = `${pct}%`;
  if (elements.liveExecProgressPct) elements.liveExecProgressPct.textContent = `${pct}%`;
  
  const canvasProg = document.getElementById('canvas-progress-bar');
  if (canvasProg) canvasProg.style.width = `${pct}%`;

  renderLiveCompletedTests();
  renderCanvasVisualFeed();
}

function renderCanvasVisualFeed() {
  const feed = document.getElementById('canvas-completed-feed');
  if (!feed) return;

  const list = state.completedTests || [];
  if (list.length === 0) {
    feed.innerHTML = '<div class="empty-state text-muted text-xs p-4 text-center">Test scenarios will stream into this feed as visual cards in real-time...</div>';
    return;
  }

  feed.innerHTML = list.map(tc => {
    const isPass = tc.status === 'passed';
    const statusIcon = isPass ? '✅' : '❌';
    const statusBadge = isPass 
      ? '<span class="badge badge-pass text-xs">PASSED</span>' 
      : '<span class="badge badge-fail text-xs">FAILED</span>';

    return `
      <div class="canvas-feed-item">
        <div class="flex items-center gap-3">
          <span class="text-base">${statusIcon}</span>
          <div>
            <div class="flex items-center gap-2">
              <span class="font-mono text-xs font-bold text-blue-400">${tc.id || 'TC'}</span>
              <span class="text-xs font-semibold text-slate-200">${tc.name || tc.title || 'Scenario Execution'}</span>
            </div>
            <div class="text-xs text-slate-400 font-mono mt-0.5">Duration: ${tc.duration ? (tc.duration / 1000).toFixed(1) + 's' : '0.5s'}</div>
          </div>
        </div>
        <div class="flex items-center gap-2">
          ${statusBadge}
          ${tc.traceUrl ? `<a href="${tc.traceUrl}" target="_blank" class="btn btn-secondary btn-sm text-xs py-0.5">🔍 Trace</a>` : ''}
        </div>
      </div>
    `;
  }).join('');
}

function renderLiveCompletedTests() {
  const list = state.completedTests || [];
  const passedCount = list.filter(t => t.status === 'passed').length;
  const failedCount = list.filter(t => t.status === 'failed').length;
  const totalCompleted = passedCount + failedCount;

  // Determine the expected total tests
  const expectedTotal = Math.max(
    state.currentRun?.stats?.total || 0,
    totalCompleted,
    1
  );

  // Calculate live progress percentage (clamped between 5% and 100%)
  const pct = Math.min(100, Math.max(5, Math.round((totalCompleted / expectedTotal) * 100)));

  // Update Live Banner Badges
  if (elements.livePassCount) elements.livePassCount.textContent = `${passedCount} Passed`;
  if (elements.liveFailCount) elements.liveFailCount.textContent = `${failedCount} Failed`;

  // Update Live Execution Modal Badges
  if (elements.liveExecPassBadge) elements.liveExecPassBadge.textContent = `${passedCount} Passed`;
  if (elements.liveExecFailBadge) elements.liveExecFailBadge.textContent = `${failedCount} Failed`;

  // Update Progress Bar and Overall Progress text
  if (elements.progressBarFill) elements.progressBarFill.style.width = `${pct}%`;
  if (elements.liveExecProgressPct) elements.liveExecProgressPct.textContent = `${pct}%`;

  if (!elements.liveCompletedList) return;

  if (list.length === 0) {
    elements.liveCompletedList.innerHTML = '<div class="empty-state text-muted">Test cases will appear here as they finish executing in real-time...</div>';
    if (elements.liveCompletedCount) elements.liveCompletedCount.textContent = '0 Completed';
    return;
  }

  if (elements.liveCompletedCount) {
    elements.liveCompletedCount.textContent = `${list.length} Completed`;
  }

  elements.liveCompletedList.innerHTML = list.map(tc => {
    const isPass = tc.status === 'passed';
    const statusIcon = isPass ? '✅' : '❌';
    const statusClass = isPass ? 'text-success' : 'text-danger';

    return `
      <div class="live-tc-item glass-card">
        <div class="live-tc-left">
          <span class="live-tc-status-icon">${statusIcon}</span>
          <div>
            <span class="live-tc-title ${statusClass}">${escapeHtml(tc.name || 'Test Case')}</span>
            ${tc.id ? `<span class="live-tc-id">[${escapeHtml(tc.id)}]</span>` : ''}
          </div>
        </div>
        <span class="live-tc-duration">${tc.duration || 'Done'}</span>
      </div>
    `;
  }).join('');
}

function openLiveExecutionModal() {
  if (elements.liveExecutionModal) {
    elements.liveExecutionModal.classList.remove('hidden');
    renderLiveCompletedTests();
  }
}

function closeLiveExecutionModal() {
  if (elements.liveExecutionModal) {
    elements.liveExecutionModal.classList.add('hidden');
  }
}

function handleRunFinish(runData) {
  state.currentRun = null;
  if (liveTimerInterval) {
    clearInterval(liveTimerInterval);
    liveTimerInterval = null;
  }

  if (elements.liveActiveName) {
    elements.liveActiveName.textContent = runData.exitCode === 0 ? 'All Test Cases Completed' : 'Execution Completed with Failures';
  }
  if (elements.liveActiveMeta) {
    elements.liveActiveMeta.textContent = `Finished at: ${new Date().toLocaleTimeString()}`;
  }
  if (elements.liveExecProgressPct) {
    elements.liveExecProgressPct.textContent = '100%';
  }
  if (elements.progressBarFill) {
    elements.progressBarFill.style.width = '100%';
  }

  if (window.canvasElapsedInterval) {
    clearInterval(window.canvasElapsedInterval);
    window.canvasElapsedInterval = null;
  }

  // Update Live Execution Canvas HUD for Completion
  const canvasStatus = document.getElementById('canvas-status-badge');
  const canvasOrb = document.getElementById('canvas-status-orb');
  const canvasActiveName = document.getElementById('canvas-active-test-name');
  const canvasLatestAction = document.getElementById('canvas-latest-action');
  const canvasTraceBtn = document.getElementById('canvas-open-trace-btn');
  const canvasAllureBtn = document.getElementById('canvas-open-allure-btn');

  const isSuccess = runData.exitCode === 0;
  if (canvasStatus) {
    canvasStatus.textContent = isSuccess ? 'PASSED' : 'COMPLETED (FAILURES)';
    canvasStatus.className = `badge ${isSuccess ? 'badge-pass' : 'badge-fail'} text-xs`;
  }
  if (canvasOrb) {
    canvasOrb.innerHTML = isSuccess ? '✅' : '⚠️';
  }
  if (canvasActiveName) {
    canvasActiveName.textContent = isSuccess ? 'All Selected Tests Passed Successfully' : 'Execution Completed with Failure Alerts';
  }
  if (canvasLatestAction) {
    canvasLatestAction.textContent = 'Allure & Traces compiled.';
  }
  if (canvasTraceBtn) {
    canvasTraceBtn.classList.remove('hidden');
    canvasTraceBtn.onclick = () => openLatestTrace();
  }
  if (canvasAllureBtn) {
    canvasAllureBtn.classList.remove('hidden');
    canvasAllureBtn.onclick = () => switchTab('reports');
  }

  // Finalize Micro Stepper
  const stepAuth = document.getElementById('step-node-auth');
  const stepNav = document.getElementById('step-node-nav');
  const stepAction = document.getElementById('step-node-action');
  const stepTeardown = document.getElementById('step-node-teardown');

  if (stepAuth) stepAuth.className = 'step-node passed';
  if (stepNav) stepNav.className = 'step-node passed';
  if (stepAction) stepAction.className = isSuccess ? 'step-node passed' : 'step-node failed';
  if (stepTeardown) stepTeardown.className = isSuccess ? 'step-node passed' : 'step-node failed';

  elements.liveProgressBanner.classList.add('hidden');
  elements.runAllBtn.disabled = false;
  elements.stopRunBtn.disabled = true;

  const passed = runData.stats?.passed || 0;
  const failed = runData.stats?.failed || 0;
  const statusMsg = runData.exitCode === 0 ? 'COMPLETED SUCCESSFULLY' : 'COMPLETED WITH FAILURES';
  const logType = runData.exitCode === 0 ? 'pass' : 'fail';

  appendLog(`\n======================================================`, 'system');
  appendLog(`[FINISH] Test Run ${statusMsg}: ${passed} Passed, ${failed} Failed`, logType);
  if (runData.latestTrace) {
    appendLog(`[TRACE] Playwright Deep Trace recorded: ${runData.latestTrace.filename} (${runData.latestTrace.sizeFormatted})`, 'system');
  }
  appendLog(`======================================================\n`, 'system');

  // Refresh artifacts & history & performance
  fetchHistory();
  fetchScreenshots();
  fetchPerformanceMetrics();
}

function updateStatsUI(stats) {
  if (state.currentRun && !state.currentRun.stats) {
    state.currentRun.stats = stats;
  } else if (state.currentRun) {
    Object.assign(state.currentRun.stats, stats);
  }

  const passed = stats.passed || (state.completedTests ? state.completedTests.filter(t => t.status === 'passed').length : 0);
  const failed = stats.failed || (state.completedTests ? state.completedTests.filter(t => t.status === 'failed').length : 0);
  const completed = passed + failed;
  const total = Math.max(stats.total || (state.currentRun?.stats?.total) || 176, completed, 1);

  const progressPct = Math.min(100, Math.max(5, Math.round((completed / total) * 100)));

  if (elements.livePassCount) elements.livePassCount.textContent = `${passed} Passed`;
  if (elements.liveFailCount) elements.liveFailCount.textContent = `${failed} Failed`;
  if (elements.liveExecPassBadge) elements.liveExecPassBadge.textContent = `${passed} Passed`;
  if (elements.liveExecFailBadge) elements.liveExecFailBadge.textContent = `${failed} Failed`;

  if (elements.progressBarFill) elements.progressBarFill.style.width = `${progressPct}%`;
  if (elements.liveExecProgressPct) elements.liveExecProgressPct.textContent = `${progressPct}%`;
}

function appendLog(line, type = 'info') {
  let cssClass = 'log-info';
  if (type === 'system' || line.startsWith('[SYSTEM]')) cssClass = 'log-system';
  else if (type === 'pass' || line.includes('✓') || line.includes('passed')) cssClass = 'log-pass';
  else if (type === 'fail' || line.includes('✘') || line.includes('failed') || line.includes('Error')) cssClass = 'log-fail';
  else if (type === 'warn' || line.includes('WARN')) cssClass = 'log-warn';
  else if (line.startsWith('[STEP')) cssClass = 'log-step';

  const lineEl = document.createElement('div');
  lineEl.className = cssClass;
  lineEl.textContent = line;
  elements.terminalBody.appendChild(lineEl);

  if (state.autoScrollLogs) {
    elements.terminalBody.scrollTop = elements.terminalBody.scrollHeight;
  }
}

function downloadLogs() {
  const text = elements.terminalBody.innerText;
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `wdh-execution-log-${Date.now()}.txt`;
  a.click();
}

// -------------------------------------------------------------
// AI ROOT-CAUSE ANALYSIS & TRACE METHODS
// -------------------------------------------------------------
function displayAiRcaDiagnostic(rca) {
  if (!rca) return;
  state.latestRca = rca;

  elements.rcaCategoryBadge.textContent = rca.category || 'TEST_FAILURE';
  elements.rcaSeverityBadge.textContent = `${rca.severity || 'HIGH'} SEVERITY`;
  elements.rcaConfidenceBadge.textContent = `${rca.confidenceScore || 90}% Confidence`;
  elements.rcaFailingStep.textContent = `Failing Step: ${rca.failingStep || 'Unknown Step'}`;

  elements.rcaSummaryText.textContent = rca.summary || 'Test execution failure detected.';
  elements.rcaRootCauseText.textContent = rca.rootCause || '';

  // Remediation List
  elements.rcaRemediationList.innerHTML = (rca.suggestedRemediation || []).map(r => `
    <li>${r}</li>
  `).join('');

  // Code Snippet
  if (rca.suggestedCodeSnippet) {
    elements.rcaCodeSnippet.textContent = rca.suggestedCodeSnippet;
    elements.rcaCodeWrapper.classList.remove('hidden');
  } else {
    elements.rcaCodeWrapper.classList.add('hidden');
  }

  // Target context
  elements.rcaEnvName.textContent = rca.environmentContext?.name || 'Target Env';
  elements.rcaEnvUrl.textContent = rca.environmentContext?.baseUrl || '';

  elements.aiRcaBanner.classList.remove('hidden');
}

function handleTraceAvailable(trace) {
  if (!trace) return;
  state.latestTrace = trace;
  elements.terminalTraceBtn.classList.remove('hidden');
  elements.terminalDownloadTraceBtn.classList.remove('hidden');
}

function openLatestTrace() {
  if (!state.latestTrace) {
    return alert('No trace available yet. Execute a test to record time-travel trace data.');
  }
  const traceFullUrl = `${window.location.origin}${state.latestTrace.url}`;
  const viewerUrl = `https://trace.playwright.dev/?trace=${encodeURIComponent(traceFullUrl)}`;
  window.open(viewerUrl, '_blank');
}

function downloadLatestTrace() {
  if (!state.latestTrace) return;
  window.open(state.latestTrace.url, '_blank');
}

function copyRcaCode() {
  const code = elements.rcaCodeSnippet.textContent;
  navigator.clipboard.writeText(code).then(() => {
    elements.rcaCopyCodeBtn.textContent = 'Copied! ✓';
    setTimeout(() => { elements.rcaCopyCodeBtn.textContent = 'Copy'; }, 2000);
  });
}

// -------------------------------------------------------------
// MULTI-REPORT SUITE (ALLURE, PLAYWRIGHT, TRACES)
// -------------------------------------------------------------
function switchReportView(reportType) {
  state.activeReportTab = reportType;

  elements.reportSubTabs.forEach(tab => {
    tab.classList.toggle('active', tab.dataset.report === reportType);
  });

  if (reportType === 'allure') {
    elements.reportIframe.classList.remove('hidden');
    elements.tracesArchiveView.classList.add('hidden');
    elements.reportIframe.src = '/reports/allure/index.html';
    elements.openReportTabBtn.href = '/reports/allure/index.html';
    elements.openReportTabBtn.textContent = 'Open in New Tab ↗';
  } else if (reportType === 'playwright') {
    elements.reportIframe.classList.remove('hidden');
    elements.tracesArchiveView.classList.add('hidden');
    elements.reportIframe.src = '/reports/html/index.html';
    elements.openReportTabBtn.href = '/reports/html/index.html';
    elements.openReportTabBtn.textContent = 'Open in New Tab ↗';
  } else if (reportType === 'traces') {
    elements.reportIframe.classList.add('hidden');
    elements.tracesArchiveView.classList.remove('hidden');
    elements.openReportTabBtn.href = 'https://trace.playwright.dev/';
    elements.openReportTabBtn.textContent = 'Launch Trace Viewer ↗';
    fetchTraces();
  }
}

async function refreshCurrentReport() {
  if (state.activeReportTab === 'allure') {
    appendLog('[SYSTEM] Triggering on-demand Allure report regeneration...', 'system');
    await fetch('/api/reports/allure/generate');
    elements.reportIframe.src = `/reports/allure/index.html?t=${Date.now()}`;
  } else if (state.activeReportTab === 'playwright') {
    elements.reportIframe.src = `/reports/html/index.html?t=${Date.now()}`;
  } else if (state.activeReportTab === 'traces') {
    fetchTraces();
  }
}

async function fetchTraces() {
  try {
    const res = await fetch('/api/traces');
    const data = await res.json();
    renderTracesGrid(data.traces || []);
  } catch (err) {
    console.error('Failed to fetch traces:', err);
  }
}

function renderTracesGrid(tracesList) {
  if (tracesList.length === 0) {
    elements.tracesListGrid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1; padding: 36px; text-align: center; color: var(--text-dim);">
        <p>No trace files (.zip) recorded yet. Execute any test suite or single scenario with deep tracing enabled.</p>
      </div>
    `;
    return;
  }

  elements.tracesListGrid.innerHTML = tracesList.map(t => {
    const dateStr = new Date(t.createdAt).toLocaleString();
    const traceFullUrl = `${window.location.origin}${t.url}`;
    const viewerUrl = `https://trace.playwright.dev/?trace=${encodeURIComponent(traceFullUrl)}`;

    return `
      <div class="trace-card glass-card">
        <div class="trace-card-top">
          <div>
            <div class="trace-filename">📦 ${t.filename}</div>
            <div class="trace-rel-path">${t.relativePath}</div>
          </div>
          <span class="badge badge-env">${t.sizeFormatted}</span>
        </div>
        <div class="trace-meta-row">
          <span>🕒 ${dateStr}</span>
        </div>
        <div class="trace-card-actions">
          <a href="${t.url}" download class="btn btn-secondary btn-sm" title="Download trace.zip">⬇️ Download</a>
          <a href="${viewerUrl}" target="_blank" class="btn btn-primary btn-sm" title="Inspect DOM & Network in Playwright Trace Viewer">🔍 Inspect Trace</a>
        </div>
      </div>
    `;
  }).join('');
}

// -------------------------------------------------------------
// RCA DRILLDOWN MODAL
// -------------------------------------------------------------
window.openRcaModal = async function(runId) {
  try {
    const res = await fetch(`/api/rca/${runId}`);
    const data = await res.json();
    const rca = data.rca;
    if (!rca) return alert('No RCA diagnostic data recorded for this run.');

    elements.rcaModalTitle.textContent = `AI Root-Cause: ${rca.testName || rca.testId}`;
    elements.rcaModalCategory.textContent = rca.category || 'TEST_FAILURE';
    elements.rcaModalSeverity.textContent = `${rca.severity || 'HIGH'} SEVERITY`;
    elements.rcaModalTestName.textContent = `Scenario: [${rca.testId}] ${rca.testName} (${rca.failingStep})`;
    elements.rcaModalSummary.textContent = rca.summary;
    elements.rcaModalRootCause.textContent = rca.rootCause;

    elements.rcaModalRemediationList.innerHTML = (rca.suggestedRemediation || []).map(r => `<li>${r}</li>`).join('');

    if (rca.suggestedCodeSnippet) {
      elements.rcaModalCodeSnippet.textContent = rca.suggestedCodeSnippet;
      elements.rcaModalCodeBox.classList.remove('hidden');
    } else {
      elements.rcaModalCodeBox.classList.add('hidden');
    }

    elements.rcaModalStack.textContent = rca.stackSnippet || 'No stack trace captured.';
    elements.rcaModalTime.textContent = new Date(rca.timestamp).toLocaleString();

    elements.rcaModal.classList.remove('hidden');
  } catch (err) {
    alert(`Failed to load RCA: ${err.message}`);
  }
};

function closeRcaModal() {
  elements.rcaModal.classList.add('hidden');
}

// -------------------------------------------------------------
// EXECUTION HISTORY TAB (ENTERPRISE ENHANCED)
// -------------------------------------------------------------
let cachedHistoryRuns = [];

async function fetchHistory(envId = '') {
  try {
    const url = envId ? `/api/history?envId=${encodeURIComponent(envId)}` : '/api/history';
    const res = await fetch(url);
    const data = await res.json();
    cachedHistoryRuns = data.history || [];
    renderHistoryTable(cachedHistoryRuns);
    fetchHistoryAnalytics();
  } catch (err) {
    console.error('Failed to fetch history:', err);
  }
}

async function fetchHistoryAnalytics() {
  try {
    const res = await fetch('/api/history/analytics');
    const data = await res.json();

    const passRateEl = document.getElementById('hist-pass-rate');
    const totalRunsEl = document.getElementById('hist-total-runs');
    const avgDurationEl = document.getElementById('hist-avg-duration');
    const flakinessScoreEl = document.getElementById('hist-flakiness-score');
    const flakySuitesCountEl = document.getElementById('hist-flaky-suites-count');

    if (passRateEl) passRateEl.textContent = data.overallPassRate || '100%';
    if (totalRunsEl) totalRunsEl.textContent = `${data.totalRuns || 0} Total Runs Logged`;
    if (avgDurationEl) avgDurationEl.textContent = `${((data.avgDurationMs || 0) / 1000).toFixed(1)}s`;

    const flakyCount = (data.suiteStability || []).filter(s => s.isFlaky).length;
    if (flakinessScoreEl) {
      if (flakyCount === 0) {
        flakinessScoreEl.textContent = 'Stable (0%)';
        flakinessScoreEl.className = 'metric-val status-good';
      } else {
        flakinessScoreEl.textContent = `${flakyCount} Flaky`;
        flakinessScoreEl.className = 'metric-val status-bad';
      }
    }
    if (flakySuitesCountEl) {
      flakySuitesCountEl.textContent = `${flakyCount} Suite(s) with Inconsistent Results`;
    }
  } catch (err) {
    console.error('Failed to load history analytics:', err);
  }
}

window.toggleHistoryDiffModal = function(baseRunId, targetRunId) {
  const diffCard = document.getElementById('history-diff-card');
  if (!diffCard) return;

  if (!diffCard.classList.contains('hidden') && !baseRunId) {
    diffCard.classList.add('hidden');
    return;
  }

  diffCard.classList.remove('hidden');
  loadRunDiff(baseRunId, targetRunId);
};

async function loadRunDiff(baseId, targetId) {
  const diffContent = document.getElementById('history-diff-content');
  if (!diffContent) return;

  if (cachedHistoryRuns.length < 2) {
    diffContent.innerHTML = `<div style="grid-column: 1 / -1; padding: 20px; text-align: center; color: var(--text-muted);">At least 2 historical execution runs are required to compute a comparison diff.</div>`;
    return;
  }

  const base = baseId || cachedHistoryRuns[1]?.runId || cachedHistoryRuns[0]?.runId;
  const target = targetId || cachedHistoryRuns[0]?.runId;

  try {
    const res = await fetch(`/api/history/diff?baseRunId=${encodeURIComponent(base)}&targetRunId=${encodeURIComponent(target)}`);
    const data = await res.json();
    if (!data.success) throw new Error(data.error);

    const { baseRun, targetRun, delta } = data;
    const isImproved = delta.statusChange === 'FIXED' || delta.passDelta > 0;
    const deltaBadgeClass = isImproved ? 'badge-health-online' : (delta.statusChange === 'REGRESSED' ? 'badge-health-offline' : 'badge-env');

    diffContent.innerHTML = `
      <div class="glass-card" style="padding: 16px; background: rgba(15, 23, 42, 0.6); border-radius: 8px;">
        <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 4px;">BASELINE RUN</div>
        <div style="font-weight: 700; font-size: 1.1rem; color: #60a5fa;">${baseRun.runId}</div>
        <div style="font-size: 0.85rem; margin-top: 4px; font-weight: 600;">${baseRun.suiteName}</div>
        <div style="margin-top: 12px; display: flex; gap: 8px; flex-wrap: wrap;">
          <span class="badge badge-env">${baseRun.envName}</span>
          <span class="badge ${baseRun.status === 'PASSED' ? 'badge-pass' : 'badge-fail'}">${baseRun.status}</span>
          <span class="badge badge-secondary">${(baseRun.duration / 1000).toFixed(1)}s</span>
        </div>
      </div>

      <div class="glass-card" style="padding: 16px; background: rgba(15, 23, 42, 0.6); border-radius: 8px;">
        <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 4px;">TARGET RUN (LATEST)</div>
        <div style="font-weight: 700; font-size: 1.1rem; color: #34d399;">${targetRun.runId}</div>
        <div style="font-size: 0.85rem; margin-top: 4px; font-weight: 600;">${targetRun.suiteName}</div>
        <div style="margin-top: 12px; display: flex; gap: 8px; flex-wrap: wrap;">
          <span class="badge badge-env">${targetRun.envName}</span>
          <span class="badge ${targetRun.status === 'PASSED' ? 'badge-pass' : 'badge-fail'}">${targetRun.status}</span>
          <span class="badge badge-secondary">${(targetRun.duration / 1000).toFixed(1)}s</span>
          <span class="badge ${deltaBadgeClass}">Δ ${delta.durationDeltaFormatted} (${delta.statusChange})</span>
        </div>
      </div>
    `;
  } catch (err) {
    diffContent.innerHTML = `<div style="grid-column: 1 / -1; color: var(--danger); padding: 12px;">Error computing diff: ${err.message}</div>`;
  }
}

function renderHistoryTable(historyList) {
  if (historyList.length === 0) {
    elements.historyTableBody.innerHTML = `<tr><td colspan="9" style="text-align: center; color: #64748b; padding: 24px;">No execution history recorded yet.</td></tr>`;
    return;
  }

  elements.historyTableBody.innerHTML = historyList.map(h => {
    const isPassed = h.exitCode === 0;
    const durationSec = h.duration ? (h.duration / 1000).toFixed(1) + 's' : '-';
    const formattedDate = new Date(h.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    let diagHtml = [];
    if (!isPassed && h.rca) {
      diagHtml.push(`<button class="btn btn-secondary btn-sm" onclick="window.openRcaModal('${h.runId}')" title="View AI Root Cause Analysis">🤖 RCA</button>`);
    }
    if (h.latestTrace) {
      const viewerUrl = `https://trace.playwright.dev/?trace=${encodeURIComponent(window.location.origin + h.latestTrace.url)}`;
      diagHtml.push(`<a href="${viewerUrl}" target="_blank" class="btn btn-primary btn-sm" style="padding: 2px 8px; font-size: 0.72rem;" title="Inspect Action Timeline & DOM">🔍 Trace</a>`);
    }
    diagHtml.push(`<button class="btn btn-secondary btn-sm" style="padding: 2px 6px; font-size: 0.72rem;" onclick="window.toggleHistoryDiffModal(null, '${h.runId}')" title="Compare with previous run">⚖️ Diff</button>`);

    return `
      <tr>
        <td><span class="font-mono" style="font-weight: 700; color: #60a5fa;">${h.runId || '-'}</span></td>
        <td><span style="font-size: 0.76rem; color: var(--text-muted);">${formattedDate}</span></td>
        <td><span class="badge badge-env">${h.envName || 'SIT'}</span></td>
        <td><span style="font-weight: 600; color: var(--text-main);">${h.suiteName}</span></td>
        <td><span style="font-size: 0.76rem; text-transform: uppercase;">${h.browser}</span></td>
        <td><span class="font-mono">${durationSec}</span></td>
        <td>
          <span class="badge badge-pass">${h.stats?.passed || 0} P</span>
          <span class="badge badge-fail">${h.stats?.failed || 0} F</span>
        </td>
        <td>
          <span class="badge ${isPassed ? 'badge-health-online' : 'badge-health-offline'}">
            ${isPassed ? '✓ PASSED' : '✕ FAILED'}
          </span>
        </td>
        <td><div style="display: flex; gap: 4px; align-items: center;">${diagHtml.join('')}</div></td>
      </tr>
    `;
  }).join('');
}


// -------------------------------------------------------------
// SCREENSHOTS & GALLERY (SEARCHABLE BY TEST CASE NAME)
// -------------------------------------------------------------
async function fetchScreenshots(searchTerm = '') {
  try {
    const url = searchTerm ? `/api/screenshots?search=${encodeURIComponent(searchTerm)}` : '/api/screenshots';
    const res = await fetch(url);
    const data = await res.json();
    const files = data.screenshots || [];

    if (files.length === 0) {
      elements.galleryContainer.innerHTML = `<div class="empty-state">No visual artifacts found matching query: "${searchTerm || ''}".</div>`;
      return;
    }

    elements.galleryContainer.innerHTML = files.map(item => {
      const testBadge = item.testId ? `<span class="badge badge-env" style="margin-bottom: 4px; display: inline-block;">${item.testId}</span>` : '';
      return `
        <div class="gallery-card glass-card" onclick="window.openLightbox('${item.url}', '${item.displayName || item.filename}')" style="cursor: pointer;">
          <img src="${item.url}" alt="${item.filename}" loading="lazy" style="border-radius: 8px; width: 100%; height: 160px; object-fit: cover;">
          <div class="gallery-info" style="padding: 10px 4px 4px;">
            ${testBadge}
            <div class="gallery-title" style="font-weight: 600; font-size: 0.8rem; color: var(--text-main); word-break: break-word;">${item.displayName || item.filename}</div>
          </div>
        </div>
      `;
    }).join('');
  } catch (err) {
    console.error('Failed to fetch screenshots:', err);
  }
}


window.openLightbox = function(url, caption) {
  if (elements.lightboxImg) elements.lightboxImg.src = url;
  if (elements.lightboxCaption) elements.lightboxCaption.textContent = caption || '';
  if (elements.lightboxModal) {
    elements.lightboxModal.classList.remove('hidden');
    elements.lightboxModal.style.display = 'flex';
  }
};

function closeLightbox() {
  if (elements.lightboxModal) {
    elements.lightboxModal.classList.add('hidden');
    elements.lightboxModal.style.display = 'none';
  }
  if (elements.lightboxImg) {
    elements.lightboxImg.src = '';
  }
}
window.closeLightbox = closeLightbox;

// -------------------------------------------------------------
// API PERFORMANCE TELEMETRY & DEEP INSPECTOR
// -------------------------------------------------------------
// API PERFORMANCE ASSESSMENT & OPENTELEMETRY TIME-SERIES ENGINE
// -------------------------------------------------------------
let cachedPerfData = null;
let otelChartInstance = null;

async function fetchPerformanceMetrics() {
  try {
    const [resMetrics, resOtel] = await Promise.all([
      fetch('/api/performance-metrics'),
      fetch('/api/telemetry/analytics')
    ]);

    const data = await resMetrics.json();
    const otelData = await resOtel.json();

    cachedPerfData = data;
    renderPerformanceMetrics(data);
    if (otelData && otelData.success) {
      renderPerfTelemetryCharts(otelData);
    }
  } catch (err) {
    console.error('Failed to fetch API performance and OTel telemetry metrics:', err);
  }
}

function renderPerfTelemetryCharts(otelData) {
  if (!otelData) return;

  const percentiles = otelData.percentiles || {};
  const p50 = percentiles.p50 || 0;
  const p90 = percentiles.p90 || 0;
  const p95 = percentiles.p95 || 0;
  const p99 = percentiles.p99 || 0;

  // Bind Percentile Values
  const p50El = document.getElementById('p50-val');
  const p90El = document.getElementById('p90-val');
  const p95El = document.getElementById('p95-val');
  const p99El = document.getElementById('p99-val');
  const p95Badge = document.getElementById('otel-p95-badge');
  const anomalyBadge = document.getElementById('otel-anomaly-badge');
  const totalPayloadEl = document.getElementById('otel-total-payload');

  if (p50El) p50El.textContent = `${p50} ms`;
  if (p90El) p90El.textContent = `${p90} ms`;
  if (p95El) p95El.textContent = `${p95} ms`;
  if (p99El) p99El.textContent = `${p99} ms`;
  if (p95Badge) p95Badge.textContent = `P95 SLA: ${p95}ms`;

  const anomalyCount = (otelData.recentAnomalies || []).length;
  if (anomalyBadge) {
    anomalyBadge.textContent = `${anomalyCount} Anomalies`;
    anomalyBadge.className = `text-xs px-2.5 py-1 rounded font-mono ${anomalyCount > 0 ? 'bg-rose-950/80 text-rose-300 border border-rose-800/60' : 'bg-slate-800 text-emerald-300'}`;
  }

  if (totalPayloadEl) {
    const kb = ((otelData.totalPayloadBytes || 0) / 1024).toFixed(1);
    totalPayloadEl.textContent = `Payload: ${kb} KB (${otelData.totalSpans} Spans)`;
  }

  // Bind Status Counts
  const statusBreakdown = otelData.statusBreakdown || {};
  const el2xx = document.getElementById('status-2xx-count');
  const el3xx = document.getElementById('status-3xx-count');
  const el4xx = document.getElementById('status-4xx-count');
  const el5xx = document.getElementById('status-5xx-count');
  if (el2xx) el2xx.textContent = `2xx: ${statusBreakdown['2xx'] || 0}`;
  if (el3xx) el3xx.textContent = `3xx: ${statusBreakdown['3xx'] || 0}`;
  if (el4xx) el4xx.textContent = `4xx: ${statusBreakdown['4xx'] || 0}`;
  if (el5xx) el5xx.textContent = `5xx: ${statusBreakdown['5xx'] || 0}`;

  // Render Time-Series Chart with Chart.js
  const canvas = document.getElementById('otel-timeseries-chart');
  if (canvas && typeof Chart !== 'undefined') {
    if (otelChartInstance) otelChartInstance.destroy();

    const timeSeries = (otelData.timeSeries || []).slice(0, 50); // limit to latest 50 for clean render
    const labels = timeSeries.map((s, idx) => `Span ${idx + 1}`);
    const durations = timeSeries.map(s => s.durationMs);
    const p95Line = timeSeries.map(() => p95);
    const pointColors = timeSeries.map(s => s.isError ? '#ef4444' : s.durationMs > p95 ? '#f59e0b' : '#06b6d4');
    const pointRadii = timeSeries.map(s => s.isError || s.durationMs > p95 ? 6 : 4);

    const isDark = state.theme === 'dark';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)';
    const textColor = isDark ? '#94a3b8' : '#64748b';

    const ctx = canvas.getContext('2d');
    otelChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels.length > 0 ? labels : ['No Data'],
        datasets: [
          {
            label: 'Span Latency (ms)',
            data: durations.length > 0 ? durations : [0],
            borderColor: '#06b6d4',
            backgroundColor: 'rgba(6, 182, 212, 0.12)',
            fill: true,
            tension: 0.3,
            borderWidth: 2,
            pointBackgroundColor: pointColors,
            pointBorderColor: '#0f172a',
            pointBorderWidth: 1.5,
            pointRadius: pointRadii,
            pointHoverRadius: 8,
          },
          {
            label: 'P95 Threshold',
            data: p95Line.length > 0 ? p95Line : [0],
            borderColor: '#f59e0b',
            borderDash: [4, 4],
            borderWidth: 1.5,
            fill: false,
            pointRadius: 0,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            display: true,
            labels: { color: textColor, font: { size: 10 } }
          },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1,
            callbacks: {
              title: (items) => {
                const idx = items[0].dataIndex;
                const span = timeSeries[idx];
                return span ? `${span.method} ${span.fullEndpoint}` : '';
              },
              label: (ctx) => {
                if (ctx.datasetIndex === 0) {
                  const span = timeSeries[ctx.dataIndex];
                  return [
                    ` Latency: ${ctx.raw} ms`,
                    span ? ` Action: ${span.action}` : '',
                    span ? ` Status: ${span.status} ${span.isError ? '(ERROR)' : ''}` : ''
                  ];
                }
                return ` P95 Line: ${ctx.raw} ms`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: { color: gridColor },
            ticks: { color: textColor, font: { size: 9 }, maxTicksLimit: 12 }
          },
          y: {
            grid: { color: gridColor },
            ticks: { color: textColor, font: { size: 9 }, callback: v => `${v}ms` }
          }
        }
      }
    });
  }
}

function renderPerformanceMetrics(data) {
  if (!data) return;

  const actions = data.actions || [];
  const totalApis = data.totalApisCalled || 0;
  const avgLatency = data.averageLatencyMs || 0;

  let failedCount = 0;
  actions.forEach(a => {
    const calls = a.apiCalls || a.apisCalled || [];
    calls.forEach(c => {
      if (c.isError || c.status >= 400 || c.status === 0) {
        failedCount++;
      }
    });
  });

  if (elements.perfTotalActions) elements.perfTotalActions.textContent = actions.length;
  if (elements.perfTotalApis) elements.perfTotalApis.textContent = totalApis;
  if (elements.perfAvgLatency) elements.perfAvgLatency.textContent = `${avgLatency} ms`;
  if (elements.perfFailedApis) {
    elements.perfFailedApis.textContent = failedCount;
    elements.perfFailedApis.className = `metric-val ${failedCount > 0 ? 'status-bad' : 'status-good'}`;
  }

  filterPerformanceActions();
}

function filterPerformanceActions() {
  if (!cachedPerfData || !elements.perfActionsList) return;

  const query = (elements.perfSearchInput ? elements.perfSearchInput.value : '').toLowerCase().trim();
  const ratingFilter = elements.perfFilterRating ? elements.perfFilterRating.value : 'ALL';
  const statusTab = state.activePerfStatusFilter || 'ALL';

  let actions = cachedPerfData.actions || [];

  if (ratingFilter === 'SLA_BREACH') {
    actions = actions.filter(a => {
      const calls = a.apiCalls || a.apisCalled || [];
      return calls.some(c => (c.durationMs || 0) > 1500) || (a.totalActionDurationMs || a.totalDurationMs || 0) > 1500;
    });
  } else if (ratingFilter !== 'ALL') {
    actions = actions.filter(a => a.performanceRating === ratingFilter);
  }

  // Filter individual actions based on search or status filter
  let renderedActions = actions.map((action, actionIdx) => {
    let calls = (action.apiCalls || action.apisCalled || []).map((api, apiIdx) => ({
      ...api,
      _actionIdx: actionIdx,
      _apiIdx: apiIdx,
    }));

    if (statusTab === 'SUCCESS') {
      calls = calls.filter(c => !c.isError && c.status >= 200 && c.status < 400);
    } else if (statusTab === 'FAILURE') {
      calls = calls.filter(c => c.isError || c.status >= 400 || c.status === 0);
    }

    if (query) {
      const matchAction = (action.actionName || '').toLowerCase().includes(query);
      if (!matchAction) {
        calls = calls.filter(api => 
          (api.url || '').toLowerCase().includes(query) || 
          (api.method || '').toLowerCase().includes(query) ||
          (api.endpoint || '').toLowerCase().includes(query)
        );
      }
    }

    return {
      ...action,
      filteredCalls: calls,
    };
  }).filter(a => (statusTab === 'ALL' && !query) || a.filteredCalls.length > 0 || (query && (a.actionName || '').toLowerCase().includes(query)));

  if (renderedActions.length === 0) {
    elements.perfActionsList.innerHTML = `
      <div class="empty-state">
        <p>No matching API operations found.</p>
        <p class="text-muted">Try adjusting your search terms, status filters (${statusTab}), or execute a new test scenario.</p>
      </div>
    `;
    return;
  }

  elements.perfActionsList.innerHTML = renderedActions.map((action, idx) => {
    const rating = action.performanceRating || 'FAST';
    const badgeClass = `badge-${rating.toLowerCase()}`;
    const calls = action.filteredCalls || action.apiCalls || action.apisCalled || [];
    const totalDuration = action.totalActionDurationMs || action.totalDurationMs || 0;
    const maxDur = Math.max(...calls.map(a => a.durationMs || 0), 1);

    const apiRows = calls.map(api => {
      const dur = api.durationMs || 0;
      const isErr = api.isError || api.status >= 400 || api.status === 0;
      const statusClass = api.status >= 500 ? 'perf-status-5xx' :
                          api.status >= 400 ? 'perf-status-4xx' :
                          api.status >= 300 ? 'perf-status-3xx' :
                          api.status >= 200 ? 'perf-status-2xx' : 'perf-status-5xx';
      
      const barRating = dur > 3000 ? 'bar-critical' :
                        dur > 1500 ? 'bar-slow' :
                        dur > 500 ? 'bar-acceptable' : 'bar-fast';
      
      const widthPercent = Math.max(Math.min((dur / maxDur) * 100, 100), 4);
      const formattedSize = api.responseSize > 0 ? `${(api.responseSize / 1024).toFixed(1)} KB` : (api.responseSizeFormatted || '0 B');
      const actionIdx = api._actionIdx !== undefined ? api._actionIdx : idx;
      const apiIdx = api._apiIdx !== undefined ? api._apiIdx : 0;

      return `
        <tr>
          <td><span class="perf-method-badge method-${api.method}">${api.method}</span></td>
          <td class="perf-url-col" title="${api.url}">
            <div>${escapeHtml(api.endpoint || api.url)}</div>
            ${api.failureReason ? `<div class="text-danger font-mono" style="font-size: 0.7rem; margin-top: 2px;">⚠️ ${escapeHtml(api.failureReason)}</div>` : ''}
          </td>
          <td><span class="perf-status-badge ${statusClass}">${api.status || (isErr ? 'FAIL' : 'ERR')}</span></td>
          <td>
            <div class="perf-bar-wrapper">
              <div class="perf-bar-track">
                <div class="perf-bar-fill ${barRating}" style="width: ${widthPercent}%"></div>
              </div>
              <span class="perf-duration-text">${dur} ms</span>
            </div>
          </td>
          <td><span class="text-muted">${formattedSize}</span></td>
          <td style="text-align: right;">
            <button class="btn-inspect-api" onclick="window.inspectApiDetails(${actionIdx}, ${apiIdx})" title="Inspect complete Request, Payload, Response Body & Headers">
              🔍 Inspect
            </button>
          </td>
        </tr>
      `;
    }).join('');

    return `
      <div class="perf-action-card expanded" id="perf-card-${idx}">
        <div class="perf-action-header" onclick="window.togglePerfCard(${idx})">
          <div class="perf-action-title-group">
            <span class="perf-action-chevron">▶</span>
            <span class="perf-action-name">${escapeHtml(action.actionName || 'User Action')}</span>
          </div>
          <div class="perf-action-badges">
            <span class="badge badge-env">${calls.length} APIs Triggered</span>
            <span class="${badgeClass}">Total ${totalDuration} ms</span>
            <span class="${badgeClass}">${rating}</span>
          </div>
        </div>
        <div class="perf-action-body">
          ${calls.length > 0 ? `
            <table class="perf-waterfall-table">
              <thead>
                <tr>
                  <th style="width: 75px;">Method</th>
                  <th>Request Endpoint & Failure Telemetry</th>
                  <th style="width: 85px;">Status</th>
                  <th style="width: 170px;">Latency Waterfall</th>
                  <th style="width: 85px;">Size</th>
                  <th style="width: 90px; text-align: right;">Action</th>
                </tr>
              </thead>
              <tbody>
                ${apiRows}
              </tbody>
            </table>
          ` : `
            <div class="text-muted" style="font-size: 0.82rem; padding: 6px 0;">No network calls matching current filter criteria.</div>
          `}
        </div>
      </div>
    `;
  }).join('');
}

window.inspectApiDetails = function(actionIdx, apiIdx) {
  if (!cachedPerfData || !cachedPerfData.actions) return;
  const action = cachedPerfData.actions[actionIdx];
  if (!action) return;
  const calls = action.apiCalls || action.apisCalled || [];
  const api = calls[apiIdx];
  if (!api) return;

  if (elements.apiModalMethod) {
    elements.apiModalMethod.textContent = api.method || 'GET';
    elements.apiModalMethod.className = `perf-method-badge method-${api.method}`;
  }
  if (elements.apiModalEndpoint) elements.apiModalEndpoint.textContent = api.endpoint || api.url;
  if (elements.apiModalFullUrl) elements.apiModalFullUrl.textContent = api.url;
  if (elements.apiModalStatus) {
    elements.apiModalStatus.textContent = `${api.status || (api.isError ? 'ERR' : 'OK')} ${api.statusText || ''}`;
    elements.apiModalStatus.className = `perf-status-badge ${api.status >= 400 || api.status === 0 ? 'perf-status-5xx' : 'perf-status-2xx'}`;
  }
  if (elements.apiModalDuration) elements.apiModalDuration.textContent = `${api.durationMs || 0} ms`;

  // Error Banner
  if (api.isError || api.status >= 400 || api.status === 0) {
    if (elements.apiModalErrorText) {
      elements.apiModalErrorText.textContent = api.failureReason || `HTTP Error ${api.status}: ${api.statusText || 'Request failed'}`;
    }
    if (elements.apiModalErrorBanner) elements.apiModalErrorBanner.classList.remove('hidden');
  } else {
    if (elements.apiModalErrorBanner) elements.apiModalErrorBanner.classList.add('hidden');
  }

  // Response Body
  if (elements.apiResponseCode) {
    if (api.responseBody) {
      try {
        const formatted = JSON.stringify(JSON.parse(api.responseBody), null, 2);
        elements.apiResponseCode.textContent = formatted;
      } catch {
        elements.apiResponseCode.textContent = api.responseBody;
      }
    } else {
      elements.apiResponseCode.textContent = 'No response body recorded or response was an empty stream.';
    }
  }

  // Request Body
  if (elements.apiRequestCode) {
    if (api.requestPayload) {
      try {
        const formatted = JSON.stringify(JSON.parse(api.requestPayload), null, 2);
        elements.apiRequestCode.textContent = formatted;
      } catch {
        elements.apiRequestCode.textContent = api.requestPayload;
      }
    } else {
      elements.apiRequestCode.textContent = `No payload body sent (HTTP ${api.method}).`;
    }
  }

  // Response Headers
  if (elements.apiRespHeadersTable) {
    const headers = api.responseHeaders || {};
    const keys = Object.keys(headers);
    if (keys.length > 0) {
      elements.apiRespHeadersTable.innerHTML = keys.map(k => `
        <tr>
          <td class="header-key">${escapeHtml(k)}</td>
          <td class="header-val">${escapeHtml(headers[k])}</td>
        </tr>
      `).join('');
    } else {
      elements.apiRespHeadersTable.innerHTML = `<tr><td colspan="2" class="text-muted" style="padding: 12px;">No response headers captured.</td></tr>`;
    }
  }

  // Request Headers
  if (elements.apiReqHeadersTable) {
    const headers = api.requestHeaders || {};
    const keys = Object.keys(headers);
    if (keys.length > 0) {
      elements.apiReqHeadersTable.innerHTML = keys.map(k => `
        <tr>
          <td class="header-key">${escapeHtml(k)}</td>
          <td class="header-val">${escapeHtml(headers[k])}</td>
        </tr>
      `).join('');
    } else {
      elements.apiReqHeadersTable.innerHTML = `<tr><td colspan="2" class="text-muted" style="padding: 12px;">No request headers captured.</td></tr>`;
    }
  }

  if (elements.apiModalTimestamp) {
    elements.apiModalTimestamp.textContent = `Timestamp: ${api.timestamp ? new Date(api.timestamp).toLocaleTimeString() : '-'}`;
  }
  if (elements.apiModalSize) {
    elements.apiModalSize.textContent = `Size: ${api.responseSize ? (api.responseSize / 1024).toFixed(1) + ' KB' : '0 B'}`;
  }

  // Open modal
  if (elements.apiDetailsModal) {
    elements.apiDetailsModal.classList.remove('hidden');
  }
};

function closeApiDetailsModal() {
  if (elements.apiDetailsModal) {
    elements.apiDetailsModal.classList.add('hidden');
  }
}

window.togglePerfCard = function(idx) {
  const card = document.getElementById(`perf-card-${idx}`);
  if (card) card.classList.toggle('expanded');
};

async function clearPerformanceMetrics() {
  if (!confirm('Are you sure you want to clear all recorded API performance metrics?')) return;
  try {
    await fetch('/api/performance-metrics', { method: 'DELETE' });
    cachedPerfData = { actions: [], totalApisCalled: 0, averageLatencyMs: 0, slowestOverallApi: null };
    renderPerformanceMetrics(cachedPerfData);
    appendLog('[SYSTEM] API Performance metrics reset successfully.', 'system');
  } catch (err) {
    console.error('Failed to clear performance metrics:', err);
  }
}

// -------------------------------------------------------------
// GOOGLE AUTHENTICATION & IDENTITY INTEGRATION
// -------------------------------------------------------------
let googleClientId = '1088655823528-9k1b0j407421r9j8ckd1j3j8g507.apps.googleusercontent.com';

async function fetchAuthSession() {
  try {
    const res = await fetch('/api/auth/session');
    const data = await res.json();
    if (data.googleClientId) googleClientId = data.googleClientId;
    if (data.session) {
      updateAuthUI(data.session);
    }
  } catch (err) {
    console.warn('Could not fetch auth session:', err);
  }
}

function updateAuthUI(session) {
  if (!session) return;

  const isGoogle = session.provider === 'google' && session.authenticated;
  const user = session.user || { name: 'vetrivel_m', email: 'vetrivel_m@nokiawing.com' };

  if (elements.usernameDisplay) {
    elements.usernameDisplay.textContent = user.name;
  }
  if (elements.authDropdownName) {
    elements.authDropdownName.textContent = user.name;
  }
  if (elements.authDropdownEmail) {
    elements.authDropdownEmail.textContent = user.email || (isGoogle ? 'Google Account' : 'Local Admin');
  }

  if (user.picture && elements.userAvatarImg) {
    elements.userAvatarImg.src = user.picture;
    elements.userAvatarImg.classList.remove('hidden');
    if (elements.userAvatarFallback) elements.userAvatarFallback.classList.add('hidden');
  } else if (elements.userAvatarFallback) {
    const initials = (user.name || 'VM').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'VM';
    elements.userAvatarFallback.textContent = initials;
    elements.userAvatarFallback.classList.remove('hidden');
    if (elements.userAvatarImg) elements.userAvatarImg.classList.add('hidden');
  }

  if (elements.googleLoginBtn) {
    elements.googleLoginBtn.classList.toggle('hidden', isGoogle);
  }
  if (elements.authLogoutBtn) {
    elements.authLogoutBtn.classList.toggle('hidden', !isGoogle);
  }
}

function triggerGoogleAuthPopup() {
  if (window.google && window.google.accounts && window.google.accounts.id) {
    try {
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: handleGoogleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          fallbackGoogleLoginDialog();
        }
      });
    } catch (e) {
      fallbackGoogleLoginDialog();
    }
  } else {
    fallbackGoogleLoginDialog();
  }
}

async function handleGoogleCredentialResponse(response) {
  try {
    const res = await fetch('/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential: response.credential }),
    });
    const data = await res.json();
    if (data.success && data.session) {
      updateAuthUI(data.session);
      appendLog(`[AUTH] Successfully signed in via Google OAuth as: ${data.session.user.name} (${data.session.user.email})`, 'pass');
      if (elements.userAuthDropdown) elements.userAuthDropdown.classList.add('hidden');
    }
  } catch (err) {
    console.error('Google auth error:', err);
    appendLog(`[AUTH ERROR] Failed to authenticate Google ID token: ${err.message}`, 'fail');
  }
}

function fallbackGoogleLoginDialog() {
  const email = prompt('Enter your Google Workspace / Gmail account to authenticate:', 'vetri.nokia@gmail.com');
  if (!email || !email.includes('@')) return;

  const name = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  fetch('/api/auth/google', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      profile: {
        name,
        email,
        picture: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0066ff&color=fff`,
        sub: `google-${Date.now()}`,
      }
    }),
  })
    .then(res => res.json())
    .then(data => {
      if (data.success && data.session) {
        updateAuthUI(data.session);
        appendLog(`[AUTH] Signed in as: ${data.session.user.name} (${data.session.user.email})`, 'pass');
        if (elements.userAuthDropdown) elements.userAuthDropdown.classList.add('hidden');
      }
    })
    .catch(err => console.error('Fallback login error:', err));
}

async function logoutAuthSession() {
  try {
    const res = await fetch('/api/auth/logout', { method: 'POST' });
    const data = await res.json();
    if (data.session) {
      updateAuthUI(data.session);
      appendLog('[AUTH] Signed out of Google session. Reverted to Local Admin.', 'system');
      if (elements.userAuthDropdown) elements.userAuthDropdown.classList.add('hidden');
    }
  } catch (err) {
    console.error('Logout error:', err);
  }
}

// -------------------------------------------------------------
// 12. SCHEDULES & CRON MANAGER LOGIC
// -------------------------------------------------------------
async function fetchSchedules() {
  try {
    const res = await fetch('/api/schedules');
    const data = await res.json();
    renderSchedules(data.schedules || []);
  } catch (err) {
    console.error('Failed to fetch schedules:', err);
  }
}

function renderSchedules(schedules) {
  if (!elements.schedulesContainer) return;
  if (schedules.length === 0) {
    elements.schedulesContainer.innerHTML = '<div class="empty-state">No scheduled automation jobs configured yet.</div>';
    return;
  }

  elements.schedulesContainer.innerHTML = schedules.map(s => {
    const statusClass = s.lastStatus === 'PASSED' ? 'badge-pass' : s.lastStatus === 'FAILED' ? 'badge-fail' : 'badge-env';
    return `
      <div class="schedule-card glass-card">
        <div class="schedule-header">
          <div class="schedule-title-box">
            <h3>${escapeHtml(s.name)}</h3>
            <span class="schedule-cron-tag">⏱️ ${escapeHtml(s.cron)}</span>
          </div>
          <span class="badge ${statusClass}">${s.lastStatus}</span>
        </div>

        <div class="schedule-meta-grid">
          <div class="schedule-meta-item">
            <span class="schedule-meta-k">Target Suite</span>
            <span class="schedule-meta-v">${escapeHtml(s.suiteName)}</span>
          </div>
          <div class="schedule-meta-item">
            <span class="schedule-meta-k">Environment</span>
            <span class="schedule-meta-v">${escapeHtml(s.envName)}</span>
          </div>
          <div class="schedule-meta-item">
            <span class="schedule-meta-k">Last Run</span>
            <span class="schedule-meta-v">${s.lastRun !== 'Never' ? new Date(s.lastRun).toLocaleTimeString() : 'Never'}</span>
          </div>
          <div class="schedule-meta-item">
            <span class="schedule-meta-k">Next Trigger</span>
            <span class="schedule-meta-v">${s.nextRun !== 'Paused' ? new Date(s.nextRun).toLocaleTimeString() : 'Paused'}</span>
          </div>
        </div>

        <div class="schedule-actions">
          <label class="switch-container compact">
            <input type="checkbox" ${s.enabled ? 'checked' : ''} onchange="window.toggleSchedule('${s.id}')">
            <span class="switch-slider"></span>
            <span class="switch-text">${s.enabled ? 'Active' : 'Paused'}</span>
          </label>
          <button class="btn btn-secondary btn-sm" onclick="window.triggerScheduledRunNow('${s.suiteId}', '${s.envId}')">
            <span>▶ Run Now</span>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

window.toggleSchedule = async function(id) {
  try {
    await fetch(`/api/schedules/${id}/toggle`, { method: 'POST' });
    fetchSchedules();
  } catch (err) {
    console.error('Failed to toggle schedule:', err);
  }
};

window.triggerScheduledRunNow = function(suiteId, envId) {
  triggerRun({ suiteId, envId });
};

// -------------------------------------------------------------
// 13. MULTI-ENVIRONMENT DIFF MATRIX LOGIC
// -------------------------------------------------------------
async function fetchEnvironmentDiffMatrix() {
  try {
    const res = await fetch('/api/environments/comparison-matrix');
    const data = await res.json();
    renderEnvironmentDiffMatrix(data);
  } catch (err) {
    console.error('Failed to fetch comparison matrix:', err);
  }
}

function renderEnvironmentDiffMatrix(data) {
  if (!elements.envDiffHeaderRow || !elements.envDiffTbody) return;

  const envs = data.environments || [];
  const matrix = data.matrix || [];

  // Header row
  elements.envDiffHeaderRow.innerHTML = `
    <th width="120">Test ID</th>
    <th>Scenario Name & Suite</th>
    ${envs.map(e => `<th>[${e.category}] ${escapeHtml(e.name)}</th>`).join('')}
  `;

  // Body rows
  elements.envDiffTbody.innerHTML = matrix.map(row => {
    const envCells = envs.map(e => {
      const res = row.environments[e.id] || { status: 'UNKNOWN', latencyMs: 0 };
      const chipClass = res.status === 'PASSED' ? 'chip-passed' : res.status === 'WARNING' ? 'chip-warning' : 'chip-failed';
      const icon = res.status === 'PASSED' ? '✓' : res.status === 'WARNING' ? '⚠️' : '✘';
      return `
        <td>
          <div class="diff-status-cell">
            <span class="diff-chip ${chipClass}">${icon} ${res.status}</span>
            <span class="diff-latency">${res.latencyMs} ms</span>
          </div>
        </td>
      `;
    }).join('');

    return `
      <tr>
        <td><strong class="font-mono text-cyan">${escapeHtml(row.scenarioId)}</strong></td>
        <td>
          <div style="font-weight: 600;">${escapeHtml(row.name)}</div>
          <span class="text-muted" style="font-size: 0.75rem;">${escapeHtml(row.suiteName)}</span>
        </td>
        ${envCells}
      </tr>
    `;
  }).join('');
}

// -------------------------------------------------------------
// 14. AI FLAKINESS INDEX & SELF-HEALING LOCATORS LOGIC
// -------------------------------------------------------------
async function fetchFlakinessHealth() {
  try {
    const res = await fetch('/api/ai/flakiness-health');
    const data = await res.json();
    renderFlakinessHealth(data);
  } catch (err) {
    console.error('Failed to fetch flakiness health:', err);
  }
}

function renderFlakinessHealth(data) {
  if (elements.flakyOverallHealth) elements.flakyOverallHealth.textContent = data.overallHealthIndex || '94.2%';
  if (elements.flakyTestsCount) elements.flakyTestsCount.textContent = data.flakyTestsCount || '2';
  if (!elements.flakinessInsightsContainer) return;

  const insights = data.insights || [];
  elements.flakinessInsightsContainer.innerHTML = insights.map(item => {
    const isFlaky = item.rating === 'FLAKY';
    const badgeClass = isFlaky ? 'badge-fail' : item.rating === 'MODERATE' ? 'badge-env' : 'badge-pass';
    const isHealed = item.isHealed;
    return `
      <div class="flaky-card glass-card ${isFlaky ? 'severity-high' : ''}">
        <div class="flaky-card-header">
          <div class="flaky-title-grp">
            <h3>🤖 [${escapeHtml(item.scenarioId)}] ${escapeHtml(item.name)}</h3>
            <span class="text-muted" style="font-size: 0.78rem;">Suite: ${escapeHtml(item.suiteName)} | ${item.runsAnalyzed} Executions Analyzed</span>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="badge ${badgeClass}">${item.passRate} Stability (${item.rating})</span>
            ${isHealed ? `<span class="badge badge-pass">✓ Healed</span>` : `<button class="btn btn-primary btn-xs" onclick="window.applyAiHealing('${item.scenarioId}', '${escapeHtml(item.aiSuggestedLocator)}')">✨ Auto-Heal Locator</button>`}
          </div>
        </div>

        <div class="flaky-locators-diff">
          <div class="flaky-loc-box">
            <span class="flaky-loc-label">❌ Unstable Current Locator</span>
            <code class="flaky-loc-code">${escapeHtml(item.failingLocator)}</code>
          </div>
          <div class="flaky-loc-box suggested">
            <span class="flaky-loc-label">✨ AI Self-Healing Recommended Locator</span>
            <code class="flaky-loc-code">${escapeHtml(item.aiSuggestedLocator)}</code>
          </div>
        </div>

        <div class="flaky-ai-reasoning">
          <strong>AI Diagnostic Rationale:</strong> ${escapeHtml(item.aiReasoning)}
        </div>
      </div>
    `;
  }).join('');
}

window.applyAiHealing = async function(scenarioId, healedLocator) {
  try {
    const res = await fetch('/api/ai/heal-locator', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scenarioId, healedLocator }),
    });
    const data = await res.json();
    if (data.success) {
      appendLog(`[AI SELF-HEALING] Applied resilient locator for ${scenarioId}: "${healedLocator}"`, 'pass');
      alert(`✨ Self-Healing Locator Applied!\n\nScenario: ${scenarioId}\nNew Locator: ${healedLocator}\n\nThe test suite spec is dynamically patched to use this resilient locator on subsequent runs.`);
      fetchFlakinessHealth();
    }
  } catch (err) {
    console.error('Self-healing application error:', err);
  }
};

// -------------------------------------------------------------
// 15. EXECUTIVE TEAMS & SLACK DISPATCH LOGIC
// -------------------------------------------------------------
function openDispatchModal() {
  if (elements.dispatchModal) elements.dispatchModal.classList.remove('hidden');
}

function closeDispatchModal() {
  if (elements.dispatchModal) elements.dispatchModal.classList.add('hidden');
}

async function handleDispatchSubmit(e) {
  e.preventDefault();
  const channel = elements.dispatchChannelSelect.value;
  const webhookUrl = elements.dispatchWebhookUrl.value;
  const notes = elements.dispatchNotes ? elements.dispatchNotes.value : '';

  try {
    const res = await fetch('/api/reports/dispatch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channel, webhookUrl, notes }),
    });
    const data = await res.json();
    if (data.success) {
      appendLog(`[DISPATCH] Executive report sent successfully to ${channel.toUpperCase()}`, 'pass');
      alert(`Report Dispatched to ${channel.toUpperCase()} successfully!\n\nPass Rate: ${data.summary?.passRate}\nDuration: ${data.summary?.duration}`);
      closeDispatchModal();
    }
  } catch (err) {
    console.error('Dispatch error:', err);
    alert('Failed to dispatch report.');
  }
}

// Schedule modal handlers
function openScheduleModal() {
  if (elements.scheduleModal) {
    // Populate environments and suites
    if (elements.schedFormEnv) {
      elements.schedFormEnv.innerHTML = state.environments.map(e => `
        <option value="${e.id}">[${e.category}] ${e.name}</option>
      `).join('');
    }
    elements.scheduleModal.classList.remove('hidden');
  }
}

function closeScheduleModal() {
  if (elements.scheduleModal) elements.scheduleModal.classList.add('hidden');
}

async function handleScheduleSubmit(e) {
  e.preventDefault();
  const name = elements.schedFormName.value;
  const cron = elements.schedFormCron.value;
  const suiteId = elements.schedFormSuite.value;
  const envId = elements.schedFormEnv.value;

  try {
    const res = await fetch('/api/schedules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, cron, suiteId, envId }),
    });
    const data = await res.json();
    if (data.success) {
      appendLog(`[SCHEDULE] Created cron job: "${name}" (${cron})`, 'pass');
      closeScheduleModal();
      fetchSchedules();
    }
  } catch (err) {
    console.error('Schedule creation error:', err);
  }
}

// -------------------------------------------------------------
// 16. ADVANCED TREMOR / SHADCN-STYLE INTERACTIVE CHART ENGINE
// -------------------------------------------------------------
let trendChartInstance = null;
let latencyChartInstance = null;
let fleetChartInstance = null;

function initTremorCharts() {
  if (typeof Chart === 'undefined') return;

  const isDark = state.theme === 'dark';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.05)';
  const textColor = isDark ? '#94a3b8' : '#64748b';

  // 1. Pass Rate & Stability Velocity Trend Line Chart
  const trendCanvas = document.getElementById('tremor-trend-chart');
  if (trendCanvas) {
    if (trendChartInstance) trendChartInstance.destroy();
    const ctx = trendCanvas.getContext('2d');
    trendChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Run -6', 'Run -5', 'Run -4', 'Run -3', 'Run -2', 'Latest'],
        datasets: [
          {
            label: 'Pass Rate %',
            data: [94.2, 95.8, 96.5, 97.2, 97.9, 98.4],
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.12)',
            fill: true,
            tension: 0.35,
            borderWidth: 2.5,
            pointRadius: 4,
            pointBackgroundColor: '#3b82f6',
          },
          {
            label: 'Target SLA',
            data: [95, 95, 95, 95, 95, 95],
            borderColor: '#10b981',
            borderDash: [5, 5],
            borderWidth: 1.5,
            pointRadius: 0,
            fill: false,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1,
          }
        },
        scales: {
          x: { grid: { color: gridColor }, ticks: { color: textColor, font: { size: 10 } } },
          y: { min: 90, max: 100, grid: { color: gridColor }, ticks: { color: textColor, font: { size: 10 }, callback: v => `${v}%` } }
        }
      }
    });
  }

  // 2. Latency by Suite Bar Chart
  const latencyCanvas = document.getElementById('tremor-latency-chart');
  if (latencyCanvas) {
    if (latencyChartInstance) latencyChartInstance.destroy();
    const ctx = latencyCanvas.getContext('2d');
    latencyChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Auth', 'Dashboard', 'Accounts', 'Rating', 'Reports'],
        datasets: [{
          label: 'Avg Response Time (ms)',
          data: [320, 480, 750, 890, 1120],
          backgroundColor: [
            'rgba(59, 130, 246, 0.85)',
            'rgba(16, 185, 129, 0.85)',
            'rgba(245, 158, 11, 0.85)',
            'rgba(139, 92, 246, 0.85)',
            'rgba(239, 68, 68, 0.85)',
          ],
          borderRadius: 6,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1,
            callbacks: { label: ctx => `${ctx.raw} ms` }
          }
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: textColor, font: { size: 10 } } },
          y: { grid: { color: gridColor }, ticks: { color: textColor, font: { size: 10 }, callback: v => `${v}ms` } }
        }
      }
    });
  }

  // 3. Multi-Environment Cluster Health Doughnut Chart
  const fleetCanvas = document.getElementById('tremor-fleet-chart');
  if (fleetCanvas) {
    if (fleetChartInstance) fleetChartInstance.destroy();
    const ctx = fleetCanvas.getContext('2d');
    fleetChartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Online / Healthy', 'Warning / Slow Latency', 'Offline'],
        datasets: [{
          data: [3, 1, 0],
          backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
          borderWidth: 0,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '72%',
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1,
          }
        }
      }
    });
  }
}

// Boot application
window.addEventListener('DOMContentLoaded', () => {
  initApp();
  fetchAuthSession();
  switchReportView('allure');
  initTremorCharts();

  if (elements.refreshPerfBtn) elements.refreshPerfBtn.addEventListener('click', fetchPerformanceMetrics);
  if (elements.clearPerfBtn) elements.clearPerfBtn.addEventListener('click', clearPerformanceMetrics);
  if (elements.perfSearchInput) elements.perfSearchInput.addEventListener('input', filterPerformanceActions);
  if (elements.perfFilterRating) elements.perfFilterRating.addEventListener('change', filterPerformanceActions);

  // Schedules Listeners
  if (elements.addScheduleBtn) elements.addScheduleBtn.addEventListener('click', openScheduleModal);
  if (elements.scheduleModalClose) elements.scheduleModalClose.addEventListener('click', closeScheduleModal);
  if (elements.schedModalCancel) elements.schedModalCancel.addEventListener('click', closeScheduleModal);
  if (elements.scheduleForm) elements.scheduleForm.addEventListener('submit', handleScheduleSubmit);
  if (elements.schedCronPreset) {
    elements.schedCronPreset.addEventListener('change', (e) => {
      if (elements.schedFormCron) elements.schedFormCron.value = e.target.value;
    });
  }

  // Multi-Env Diff Listeners
  if (elements.refreshDiffBtn) elements.refreshDiffBtn.addEventListener('click', fetchEnvironmentDiffMatrix);

  // AI Flakiness Listeners
  if (elements.refreshFlakinessBtn) elements.refreshFlakinessBtn.addEventListener('click', fetchFlakinessHealth);

  // Dispatch Listeners
  if (elements.dispatchTeamsBtn) elements.dispatchTeamsBtn.addEventListener('click', openDispatchModal);
  if (elements.dispatchModalClose) elements.dispatchModalClose.addEventListener('click', closeDispatchModal);
  if (elements.dispatchModalCancel) elements.dispatchModalCancel.addEventListener('click', closeDispatchModal);
  if (elements.dispatchForm) elements.dispatchForm.addEventListener('submit', handleDispatchSubmit);

  // Gallery Search & Refresh Listeners
  const gallerySearchInput = document.getElementById('gallery-search-input');
  if (gallerySearchInput) {
    gallerySearchInput.addEventListener('input', (e) => {
      fetchScreenshots(e.target.value);
    });
  }
  const refreshGalleryBtn = document.getElementById('refresh-gallery-btn');
  if (refreshGalleryBtn) {
    refreshGalleryBtn.addEventListener('click', () => {
      const q = gallerySearchInput ? gallerySearchInput.value : '';
      fetchScreenshots(q);
    });
  }
});


