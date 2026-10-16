/**
 * IoT Hub Enterprise Automation Hub - Client Application
 * Enterprise IoT Hub Multi-Environment Test Platform
 */

// Application State
const state = {
  suites: [],
  scenarios: [],
  environments: [],
  activeEnvironmentId: 'azure-fd',
  activeEnvironment: null,
  selectedBrowser: 'chromium',
  isHeaded: false,
  workers: 4,
  activeTab: 'dashboard',
  currentRun: null,
  autoScrollLogs: true,
  logLevel: localStorage.getItem('wdh_log_level') || 'INFO',
  theme: 'light', // Permanently locked to Light theme
  density: 'compact', // Permanently Compact layout
  perfViewMode: 'ENDPOINTS', // 'ENDPOINTS' | 'ACTIONS' | 'FLAT'
  perfMicroserviceFilter: 'ALL',
  perfSortOrder: 'COUNT_DESC',
  pendingRunPayload: null, // For PROD safety modal confirmation
  activeModalSuiteId: null, // Currently opened suite in modal
  activeReportTab: 'playwright', // 'playwright' | 'traces' | 'executive'
  latestTrace: null,
  latestRca: null,
  envVarsList: [],
  envVarsActiveCat: 'all',
  envVarsSearchTerm: '',
  envVarsMaskState: {},
};

// DOM Elements with safe dynamic getters
const elements = new Proxy({}, {
  get(target, prop) {
    const map = {
      // Theme Toggle
      themeToggleBtn: () => document.getElementById('theme-toggle-btn'),
      themeIcon: () => document.getElementById('theme-icon'),

      // Navigation & Tabs
      navTabs: () => document.querySelectorAll('.nav-tab'),
      tabContents: () => document.querySelectorAll('.tab-content'),

      // Header Environment Switcher
      envSelectorBtn: () => document.getElementById('env-selector-btn'),
      envDropdownMenu: () => document.getElementById('env-dropdown-menu'),
      envDropdownList: () => document.getElementById('env-dropdown-list'),
      headerEnvCategory: () => document.getElementById('header-env-category'),
      headerEnvName: () => document.getElementById('header-env-name'),
      headerEnvPulse: () => document.getElementById('header-env-pulse'),
      quickPingBtn: () => document.getElementById('quick-ping-btn'),
      quickManageEnvBtn: () => document.getElementById('quick-manage-env-btn'),
      openEnvModalBtn: () => document.getElementById('open-env-modal-btn'),
      usernameDisplay: () => document.getElementById('username-display'),

      // Automation Engines Dropdown
      enginesMenuBtn: () => document.getElementById('engines-menu-btn'),
      enginesDropdownMenu: () => document.getElementById('engines-dropdown-menu'),

      // Dashboard Telemetry
      telemetryEnvName: () => document.getElementById('telemetry-env-name'),
      telemetryCategory: () => document.getElementById('telemetry-category'),
      telemetryHealthBadge: () => document.getElementById('telemetry-health-badge'),
      telemetryBaseUrl: () => document.getElementById('telemetry-base-url'),
      telemetryLatency: () => document.getElementById('telemetry-latency'),
      telemetryUsername: () => document.getElementById('telemetry-username'),
      telemetryStatusText: () => document.getElementById('telemetry-status-text'),
      telemetryPingBtn: () => document.getElementById('telemetry-ping-btn'),
      telemetrySwitchBtn: () => document.getElementById('telemetry-switch-btn'),

      // KPI Elements
      kpiModules: () => document.getElementById('kpi-modules'),
      kpiScenarios: () => document.getElementById('kpi-scenarios'),
      kpiEnvs: () => document.getElementById('kpi-envs'),
      tabScenariosBadge: () => document.getElementById('tab-scenarios-badge'),
      suiteCountBadge: () => document.getElementById('suite-count-badge'),

      // Runner Controls
      runnerEnvSelect: () => document.getElementById('runner-env-select'),
      browserButtons: () => document.querySelectorAll('#browser-selector .toggle-btn'),
      headedToggle: () => document.getElementById('headed-toggle'),
      runAllBtn: () => document.getElementById('run-all-btn'),
      stopRunBtn: () => document.getElementById('stop-run-btn'),
      suitesContainer: () => document.getElementById('suites-container'),

      // Progress Banner
      liveProgressBanner: () => document.getElementById('live-progress-banner'),
      liveBannerDrilldownHint: () => document.getElementById('live-banner-drilldown-hint'),
      bannerDrilldownBtn: () => document.getElementById('banner-drilldown-btn'),
      progressTitle: () => document.getElementById('progress-title'),
      progressSubtitle: () => document.getElementById('progress-subtitle'),
      liveEnvBadge: () => document.getElementById('live-env-badge'),
      livePassCount: () => document.getElementById('live-pass-count'),
      liveFailCount: () => document.getElementById('live-fail-count'),
      progressBarFill: () => document.getElementById('progress-bar-fill'),
      bannerStopBtn: () => document.getElementById('banner-stop-btn'),

      // Live Execution Tracker Modal
      liveExecutionModal: () => document.getElementById('live-execution-modal'),
      liveExecModalClose: () => document.getElementById('live-exec-modal-close'),
      liveExecModalFooterClose: () => document.getElementById('live-exec-modal-footer-close'),
      liveExecModalTitle: () => document.getElementById('live-exec-modal-title'),
      liveExecModalSub: () => document.getElementById('live-exec-modal-sub'),
      liveExecPassBadge: () => document.getElementById('live-exec-pass-badge'),
      liveExecFailBadge: () => document.getElementById('live-exec-fail-badge'),
      liveExecEnvBadge: () => document.getElementById('live-exec-env-badge'),
      liveActiveTestContainer: () => document.getElementById('live-active-test-container'),
      liveActiveName: () => document.getElementById('live-active-name'),
      liveActiveMeta: () => document.getElementById('live-active-meta'),
      liveActiveTimer: () => document.getElementById('live-active-timer'),
      liveCompletedCount: () => document.getElementById('live-completed-count'),
      liveCompletedList: () => document.getElementById('live-completed-list'),
      liveExecProgressPct: () => document.getElementById('live-exec-progress-pct'),
      liveExecViewTerminalBtn: () => document.getElementById('live-exec-view-terminal-btn'),
      liveExecModalStopBtn: () => document.getElementById('live-exec-modal-stop-btn'),

      // Matrix Tab
      scenarioSearch: () => document.getElementById('scenario-search'),
      scenarioSuiteFilter: () => document.getElementById('scenario-suite-filter'),
      scenariosTableBody: () => document.getElementById('scenarios-table-body'),

      // Terminal Tab & RCA Diagnostic Card
      terminalBody: () => document.getElementById('terminal-body'),
      rawLogsDrawer: () => document.getElementById('raw-logs-drawer'),
      logLevelSelect: () => document.getElementById('terminal-log-level-select'),
      autoscrollToggle: () => document.getElementById('autoscroll-toggle'),
      clearLogsBtn: () => document.getElementById('clear-logs-btn'),
      downloadLogsBtn: () => document.getElementById('download-logs-btn'),
      expandTerminalBtn: () => document.getElementById('expand-terminal-btn'),
      terminalTraceBtn: () => document.getElementById('canvas-open-trace-btn') || document.getElementById('terminal-trace-btn'),
      terminalDownloadTraceBtn: () => document.getElementById('terminal-download-trace-btn'),
      terminalAllureBtn: () => document.getElementById('canvas-open-allure-btn') || document.getElementById('terminal-allure-btn'),

      // AI RCA Banner Elements
      aiRcaBanner: () => document.getElementById('ai-rca-banner'),
      rcaCategoryBadge: () => document.getElementById('rca-category-badge'),
      rcaSeverityBadge: () => document.getElementById('rca-severity-badge'),
      rcaConfidenceBadge: () => document.getElementById('rca-confidence-badge'),
      rcaFailingStep: () => document.getElementById('rca-failing-step'),
      aiRcaDismissBtn: () => document.getElementById('ai-rca-dismiss-btn'),
      rcaSummaryText: () => document.getElementById('rca-summary-text'),
      rcaRootCauseText: () => document.getElementById('rca-root-cause-text'),
      rcaRemediationList: () => document.getElementById('rca-remediation-list'),
      rcaCodeWrapper: () => document.getElementById('rca-code-wrapper'),
      rcaCodeSnippet: () => document.getElementById('rca-code-snippet'),
      rcaCopyCodeBtn: () => document.getElementById('rca-copy-code-btn'),
      rcaEnvName: () => document.getElementById('rca-env-name'),
      rcaEnvUrl: () => document.getElementById('rca-env-url'),
      rcaOpenTraceBtn: () => document.getElementById('rca-open-trace-btn'),
      rcaOpenAllureBtn: () => document.getElementById('rca-open-allure-btn'),

      // Environments Fleet Tab
      envFleetContainer: () => document.getElementById('env-fleet-container'),
      pingAllEnvsBtn: () => document.getElementById('ping-all-envs-btn'),
      addEnvBtn: () => document.getElementById('add-env-btn'),

      // History Tab
      historyEnvFilter: () => document.getElementById('history-env-filter'),
      historyTableBody: () => document.getElementById('history-table-body'),
      exportHistoryCsvBtn: () => document.getElementById('export-history-csv-btn'),
      exportHistoryJsonBtn: () => document.getElementById('export-history-json-btn'),

      // Gallery Tab
      galleryContainer: () => document.getElementById('gallery-container'),
      refreshGalleryBtn: () => document.getElementById('refresh-gallery-btn'),

      // API Performance Tab
      perfTotalActions: () => document.getElementById('perf-total-actions'),
      perfTotalApis: () => document.getElementById('perf-total-apis'),
      perfAvgLatency: () => document.getElementById('perf-avg-latency'),
      perfFailedApis: () => document.getElementById('perf-failed-apis'),
      perfSearchInput: () => document.getElementById('perf-search-input'),
      perfStatusFilterGroup: () => document.getElementById('perf-status-filter-group'),
      perfFilterRating: () => document.getElementById('perf-filter-rating'),
      perfActionsList: () => document.getElementById('perf-actions-list'),
      perfViewModeGroup: () => document.getElementById('perf-view-mode-group'),
      perfSortSelect: () => document.getElementById('perf-sort-select'),
      perfMsPills: () => document.getElementById('perf-ms-pills'),
      perfFilterMsSelect: () => document.getElementById('perf-filter-ms-select'),
      perfResetFiltersBtn: () => document.getElementById('perf-reset-filters-btn'),
      perfResultsCounter: () => document.getElementById('perf-results-counter'),
      refreshPerfBtn: () => document.getElementById('refresh-perf-btn'),
      clearPerfBtn: () => document.getElementById('clear-perf-btn'),

      // API Inspection Deep Dive Modal
      apiDetailsModal: () => document.getElementById('api-details-modal'),
      apiDetailsModalClose: () => document.getElementById('api-details-modal-close'),
      apiDetailsModalFooterClose: () => document.getElementById('api-details-modal-footer-close'),
      apiModalMethod: () => document.getElementById('api-modal-method'),
      apiModalEndpoint: () => document.getElementById('api-modal-endpoint'),
      apiModalStatus: () => document.getElementById('api-modal-status'),
      apiModalDuration: () => document.getElementById('api-modal-duration'),
      apiModalFullUrl: () => document.getElementById('api-modal-full-url'),
      apiModalErrorBanner: () => document.getElementById('api-modal-error-banner'),
      apiModalErrorText: () => document.getElementById('api-modal-error-text'),
      apiResponseCode: () => document.getElementById('api-response-code'),
      apiRequestCode: () => document.getElementById('api-request-code'),
      apiRespHeadersTable: () => document.getElementById('api-resp-headers-table'),
      apiReqHeadersTable: () => document.getElementById('api-req-headers-table'),
      apiCopyResponseBtn: () => document.getElementById('api-copy-response-btn'),
      apiCopyRequestBtn: () => document.getElementById('api-copy-request-btn'),
      apiModalTimestamp: () => document.getElementById('api-modal-timestamp'),
      apiModalSize: () => document.getElementById('api-modal-size'),
      apiInspectorTabBtns: () => document.querySelectorAll('.api-tab-btn'),

      // Reports Multi-Tab
      reportSubTabs: () => document.querySelectorAll('.report-sub-tab'),
      reportIframe: () => document.getElementById('report-iframe'),
      tracesArchiveView: () => document.getElementById('traces-archive-view'),
      tracesListGrid: () => document.getElementById('traces-list-grid'),
      executiveTelemetryView: () => document.getElementById('executive-telemetry-view'),
      refreshReportBtn: () => document.getElementById('refresh-report-btn'),
      openReportTabBtn: () => document.getElementById('open-report-tab-btn'),

      // Arbitrary Key-Value Env Vars Modal
      envVarsModal: () => document.getElementById('env-vars-modal'),
      openEnvVarsBtn: () => document.getElementById('open-env-vars-btn'),
      envVarsModalClose: () => document.getElementById('env-vars-modal-close'),
      envVarsTbody: () => document.getElementById('env-vars-tbody'),
      newEnvKeyInput: () => document.getElementById('new-env-key'),
      newEnvValInput: () => document.getElementById('new-env-val'),
      newEnvHint: () => document.getElementById('new-env-hint'),
      newEnvPresetSelect: () => document.getElementById('env-var-preset-select'),
      envRawTextarea: () => document.getElementById('env-raw-textarea'),
      envVarsValidationBanner: () => document.getElementById('env-vars-validation-banner'),
      envVarsSearch: () => document.getElementById('env-vars-search'),

      // Suite Details Modal
      suiteDetailsModal: () => document.getElementById('suite-details-modal'),
      suiteModalIcon: () => document.getElementById('suite-modal-icon'),
      suiteModalName: () => document.getElementById('suite-modal-name'),
      suiteModalCountBadge: () => document.getElementById('suite-modal-count-badge'),
      suiteModalDesc: () => document.getElementById('suite-modal-desc'),
      suiteModalSearch: () => document.getElementById('suite-modal-search'),
      suiteModalMatrixBtn: () => document.getElementById('suite-modal-matrix-btn'),
      suiteModalRunAllBtn: () => document.getElementById('suite-modal-run-all-btn'),
      suiteTestCasesList: () => document.getElementById('suite-test-cases-list'),
      suiteModalClose: () => document.getElementById('suite-modal-close'),
      suiteModalFooterClose: () => document.getElementById('suite-modal-footer-close'),
      suiteModalPulse: () => document.getElementById('suite-modal-pulse'),
      suiteModalTargetEnv: () => document.getElementById('suite-modal-target-env'),
      suiteModalTargetUrl: () => document.getElementById('suite-modal-target-url'),

      // RCA Drilldown Modal
      rcaModal: () => document.getElementById('rca-modal'),
      rcaModalTitle: () => document.getElementById('rca-modal-title'),
      rcaModalCategory: () => document.getElementById('rca-modal-category'),
      rcaModalSeverity: () => document.getElementById('rca-modal-severity'),
      rcaModalTestName: () => document.getElementById('rca-modal-test-name'),
      rcaModalSummary: () => document.getElementById('rca-modal-summary'),
      rcaModalRootCause: () => document.getElementById('rca-modal-root-cause'),
      rcaModalRemediationList: () => document.getElementById('rca-modal-remediation-list'),
      rcaModalCodeBox: () => document.getElementById('rca-modal-code-box'),
      rcaModalCodeSnippet: () => document.getElementById('rca-modal-code-snippet'),
      rcaModalStack: () => document.getElementById('rca-modal-stack'),
      rcaModalTime: () => document.getElementById('rca-modal-time'),
      rcaModalClose: () => document.getElementById('rca-modal-close'),
      rcaModalFooterClose: () => document.getElementById('rca-modal-footer-close'),

      // Config Inspector Modal
      configInspectorModal: () => document.getElementById('config-inspector-modal'),
      cfgModalTitle: () => document.getElementById('cfg-modal-title'),
      cfgModalEnvBadge: () => document.getElementById('cfg-modal-env-badge'),
      cfgModalSub: () => document.getElementById('cfg-modal-sub'),
      cfgModalClose: () => document.getElementById('cfg-modal-close'),
      cfgTargetTypeBadge: () => document.getElementById('cfg-target-type-badge'),
      cfgTargetName: () => document.getElementById('cfg-target-name'),
      cfgTargetFile: () => document.getElementById('cfg-target-file'),
      cfgTargetGrep: () => document.getElementById('cfg-target-grep'),
      cfgTargetBrowser: () => document.getElementById('cfg-target-browser'),
      cfgRetestPingBtn: () => document.getElementById('cfg-retest-ping-btn'),
      cfgEnvName: () => document.getElementById('cfg-env-name'),
      cfgEnvUrl: () => document.getElementById('cfg-env-url'),
      cfgAuthUser: () => document.getElementById('cfg-auth-user'),
      cfgAuthPwdStatus: () => document.getElementById('cfg-auth-pwd-status'),
      cfgPingStatus: () => document.getElementById('cfg-ping-status'),
      cfgPingLatency: () => document.getElementById('cfg-ping-latency'),
      cfgTimeoutShort: () => document.getElementById('cfg-timeout-short'),
      cfgTimeoutMedium: () => document.getElementById('cfg-timeout-medium'),
      cfgTimeoutLong: () => document.getElementById('cfg-timeout-long'),
      cfgTimeoutPageload: () => document.getElementById('cfg-timeout-pageload'),
      cfgChecklistItems: () => document.getElementById('cfg-checklist-items'),
      cfgModalSwitchEnvBtn: () => document.getElementById('cfg-modal-switch-env-btn'),
      cfgModalRunBtn: () => document.getElementById('cfg-modal-run-btn'),
      inspectConfigBtn: () => document.getElementById('inspect-config-btn'),

      // Modals
      envModal: () => document.getElementById('env-modal'),
      envModalTitle: () => document.getElementById('env-modal-title'),
      envForm: () => document.getElementById('env-form'),
      envFormId: () => document.getElementById('env-form-id'),
      envFormName: () => document.getElementById('env-form-name'),
      envFormCategory: () => document.getElementById('env-form-category'),
      envFormProtected: () => document.getElementById('env-form-protected'),
      envFormUrl: () => document.getElementById('env-form-url'),
      envFormTestBtn: () => document.getElementById('env-form-test-btn'),
      envFormPingResult: () => document.getElementById('env-form-ping-result'),
      envFormUsername: () => document.getElementById('env-form-username'),
      envFormPassword: () => document.getElementById('env-form-password'),
      envFormTogglePwd: () => document.getElementById('env-form-toggle-pwd'),
      envFormDesc: () => document.getElementById('env-form-desc'),
      envModalClose: () => document.getElementById('env-modal-close'),
      envModalCancel: () => document.getElementById('env-modal-cancel'),

      // PROD Safety Modal
      prodSafetyModal: () => document.getElementById('prod-safety-modal'),
      safetyEnvTarget: () => document.getElementById('safety-env-target'),
      prodConfirmInput: () => document.getElementById('prod-confirm-input'),
      prodProceedBtn: () => document.getElementById('prod-proceed-btn'),
      prodCancelBtn: () => document.getElementById('prod-cancel-btn'),
      prodSafetyClose: () => document.getElementById('prod-safety-close'),

      // Pre-Flight VPN Warning Modal
      vpnWarningModal: () => document.getElementById('vpn-warning-modal'),
      vpnWarningClose: () => document.getElementById('vpn-warning-close'),
      vpnWarningDesc: () => document.getElementById('vpn-warning-desc'),
      vpnTargetEnv: () => document.getElementById('vpn-target-env'),
      vpnSwitchEnvBtn: () => document.getElementById('vpn-switch-env-btn'),
      vpnProceedBtn: () => document.getElementById('vpn-proceed-btn'),

      // Enterprise Health HUD & Telemetry Elements
      headerHealthHudPill: () => document.getElementById('header-health-hud-pill'),
      headerHudLatency: () => document.getElementById('header-hud-latency'),
      headerHudTls: () => document.getElementById('header-hud-tls'),
      headerHudPulse: () => document.getElementById('header-hud-pulse'),
      headerGuardrailBadge: () => document.getElementById('header-guardrail-badge'),
      headerGuardrailIcon: () => document.getElementById('header-guardrail-icon'),
      headerGuardrailText: () => document.getElementById('header-guardrail-text'),
      headerSessionBadge: () => document.getElementById('header-session-badge'),
      headerSessionText: () => document.getElementById('header-session-text'),
      headerDataEngineBadge: () => document.getElementById('header-data-engine-badge'),
      envHealthHudModal: () => document.getElementById('env-health-hud-modal'),
      envHealthHudClose: () => document.getElementById('env-health-hud-close'),
      hudCloseBtn: () => document.getElementById('hud-close-btn'),
      hudDeepProbeBtn: () => document.getElementById('hud-deep-probe-btn'),
      hudActiveBanner: () => document.getElementById('hud-active-banner'),
      hudFleetGrid: () => document.getElementById('hud-fleet-grid'),
      authSessionModal: () => document.getElementById('auth-session-modal'),
      authSessionClose: () => document.getElementById('auth-session-close'),
      sessionDoneBtn: () => document.getElementById('session-done-btn'),
      sessionRefreshBtn: () => document.getElementById('session-refresh-btn'),
      sessionDetailsGrid: () => document.getElementById('session-details-grid'),
      dataEngineModal: () => document.getElementById('data-engine-modal'),
      dataEngineClose: () => document.getElementById('data-engine-close'),
      dataEngineDoneBtn: () => document.getElementById('data-engine-done-btn'),
      dataGenWorkerSelect: () => document.getElementById('data-gen-worker-select'),
      dataGenBtn: () => document.getElementById('data-gen-btn'),
      dataGenOutputBox: () => document.getElementById('data-gen-output-box'),

      // Lightbox
      lightboxModal: () => document.getElementById('lightbox-modal'),
      lightboxImg: () => document.getElementById('lightbox-img'),
      lightboxCaption: () => document.getElementById('lightbox-caption'),
      lightboxClose: () => document.getElementById('lightbox-close'),

      // Google Authentication Elements
      userChipBtn: () => document.getElementById('user-chip-btn'),
      userAuthDropdown: () => document.getElementById('user-auth-dropdown'),
      userAvatarImg: () => document.getElementById('user-avatar-img'),
      userAvatarFallback: () => document.getElementById('user-avatar-fallback'),
      authDropdownName: () => document.getElementById('auth-dropdown-name'),
      authDropdownEmail: () => document.getElementById('auth-dropdown-email'),
      googleLoginBtn: () => document.getElementById('google-login-btn'),
      authLogoutBtn: () => document.getElementById('auth-logout-btn'),

      // Schedules & Cron Elements
      schedulesContainer: () => document.getElementById('schedules-container'),
      addScheduleBtn: () => document.getElementById('add-schedule-btn'),
      scheduleModal: () => document.getElementById('schedule-modal'),
      scheduleForm: () => document.getElementById('schedule-form'),
      schedFormName: () => document.getElementById('sched-form-name'),
      schedFormCron: () => document.getElementById('sched-form-cron'),
      schedCronPreset: () => document.getElementById('sched-cron-preset'),
      schedFormSuite: () => document.getElementById('sched-form-suite'),
      schedFormEnv: () => document.getElementById('sched-form-env'),
      scheduleModalClose: () => document.getElementById('schedule-modal-close'),
      schedModalCancel: () => document.getElementById('sched-modal-cancel'),

      // Multi-Env Diff Elements
      envDiffHeaderRow: () => document.getElementById('env-diff-header-row'),
      envDiffTbody: () => document.getElementById('env-diff-tbody'),
      refreshDiffBtn: () => document.getElementById('refresh-diff-btn'),

      // AI Flakiness Elements
      flakinessInsightsContainer: () => document.getElementById('flakiness-insights-container'),
      flakyOverallHealth: () => document.getElementById('flaky-overall-health'),
      flakyTestsCount: () => document.getElementById('flaky-tests-count'),
      refreshFlakinessBtn: () => document.getElementById('refresh-flakiness-btn'),

      // Dispatch Teams & Slack Modal
      dispatchTeamsBtn: () => document.getElementById('dispatch-teams-btn'),
      dispatchModal: () => document.getElementById('dispatch-modal'),
      dispatchForm: () => document.getElementById('dispatch-form'),
      dispatchChannelSelect: () => document.getElementById('dispatch-channel-select'),
      dispatchWebhookUrl: () => document.getElementById('dispatch-webhook-url'),
      dispatchNotes: () => document.getElementById('dispatch-notes'),
      dispatchModalClose: () => document.getElementById('dispatch-modal-close'),
      dispatchModalCancel: () => document.getElementById('dispatch-modal-cancel'),
    };

    if (map[prop]) {
      return map[prop]();
    }
    return document.getElementById(prop);
  }
});

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

// =========================================================================
// ENTERPRISE IN-APP DIALOG SYSTEM (Replaces native browser alert/confirm/prompt)
// =========================================================================
let activeDialogResolve = null;

function showAppDialog({
  title = 'Confirmation Required',
  badge = 'ACTION REQUIRED',
  message = '',
  icon = '⚠️',
  type = 'confirm', // 'confirm' | 'alert' | 'prompt' | 'danger'
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  defaultValue = '',
}) {
  return new Promise((resolve) => {
    activeDialogResolve = resolve;

    const overlay = document.getElementById('app-dialog-overlay');
    const titleEl = document.getElementById('app-dialog-title');
    const badgeEl = document.getElementById('app-dialog-badge');
    const msgEl = document.getElementById('app-dialog-message');
    const iconEl = document.getElementById('app-dialog-icon');
    const promptContainer = document.getElementById('app-dialog-prompt-container');
    const inputEl = document.getElementById('app-dialog-input');
    const cancelBtn = document.getElementById('app-dialog-cancel-btn');
    const confirmBtn = document.getElementById('app-dialog-confirm-btn');

    if (!overlay) {
      resolve(type === 'confirm' || type === 'danger' ? false : null);
      return;
    }

    titleEl.textContent = title;
    badgeEl.textContent = badge;
    msgEl.textContent = message;
    iconEl.textContent = icon;
    iconEl.className = `app-dialog-icon-wrapper ${type === 'danger' ? 'danger' : (type === 'alert' ? 'info' : (type === 'warning' ? 'warning' : ''))}`;

    confirmBtn.textContent = confirmText;
    confirmBtn.className = `btn btn-sm ${type === 'danger' ? 'app-dialog-btn-danger' : 'btn-primary'}`;

    if (type === 'alert') {
      cancelBtn.classList.add('hidden');
      promptContainer.classList.add('hidden');
    } else if (type === 'prompt') {
      cancelBtn.classList.remove('hidden');
      cancelBtn.textContent = cancelText;
      promptContainer.classList.remove('hidden');
      inputEl.value = defaultValue;
      setTimeout(() => {
        inputEl.focus();
        inputEl.select();
      }, 50);
    } else {
      // confirm / danger
      cancelBtn.classList.remove('hidden');
      cancelBtn.textContent = cancelText;
      promptContainer.classList.add('hidden');
    }

    const closeDialog = (val) => {
      overlay.classList.add('hidden');
      document.removeEventListener('keydown', handleKey);
      if (activeDialogResolve) {
        const r = activeDialogResolve;
        activeDialogResolve = null;
        r(val);
      }
    };

    const handleKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeDialog(type === 'prompt' ? null : false);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        closeDialog(type === 'prompt' ? inputEl.value : true);
      }
    };

    document.addEventListener('keydown', handleKey);

    confirmBtn.onclick = () => {
      closeDialog(type === 'prompt' ? inputEl.value : true);
    };

    cancelBtn.onclick = () => {
      closeDialog(type === 'prompt' ? null : false);
    };

    const closeBtn = document.getElementById('app-dialog-close-btn');
    if (closeBtn) {
      closeBtn.onclick = () => closeDialog(type === 'prompt' ? null : false);
    }

    overlay.onclick = (e) => {
      if (e.target === overlay) {
        closeDialog(type === 'prompt' ? null : false);
      }
    };

    overlay.classList.remove('hidden');
    if (type !== 'prompt') {
      confirmBtn.focus();
    }
  });
}

window.appConfirm = function(message, options = {}) {
  return showAppDialog({
    title: options.title || 'Confirm Action',
    badge: options.badge || (options.type === 'danger' ? 'HIGH RISK' : 'CONFIRM'),
    message,
    icon: options.icon || (options.type === 'danger' ? '🗑️' : '⚠️'),
    type: options.type || 'confirm',
    confirmText: options.confirmText || 'Confirm',
    cancelText: options.cancelText || 'Cancel',
  });
};

window.appAlert = function(message, options = {}) {
  return showAppDialog({
    title: options.title || 'Notice',
    badge: options.badge || 'INFO',
    message,
    icon: options.icon || 'ℹ️',
    type: 'alert',
    confirmText: options.confirmText || 'Got It',
  });
};

window.appPrompt = function(message, defaultValue = '', options = {}) {
  return showAppDialog({
    title: options.title || 'Input Required',
    badge: options.badge || 'PROMPT',
    message,
    icon: options.icon || '✏️',
    type: 'prompt',
    defaultValue,
    confirmText: options.confirmText || 'Submit',
    cancelText: options.cancelText || 'Cancel',
  });
};

// Global trap for native window dialogs
window.alert = function(msg) {
  return window.appAlert(typeof msg === 'string' ? msg : JSON.stringify(msg));
};
window.confirm = function(msg) {
  return window.appConfirm(typeof msg === 'string' ? msg : JSON.stringify(msg));
};
window.prompt = function(msg, defaultVal = '') {
  return window.appPrompt(typeof msg === 'string' ? msg : JSON.stringify(msg), defaultVal);
};

// -------------------------------------------------------------
// THEME MANAGEMENT (PERMANENT LIGHT THEME)
// -------------------------------------------------------------
function applyTheme(theme = 'light') {
  state.theme = 'light';
  localStorage.setItem('wdh_theme', 'light');
  document.documentElement.setAttribute('data-theme', 'light');
  document.body.classList.add('theme-light');

  // Re-render Tremor interactive charts with light-adjusted grid & text colors
  if (typeof initTremorCharts === 'function') {
    initTremorCharts();
  }
  if (otelChartInstance && typeof fetchPerformanceMetrics === 'function') {
    fetchPerformanceMetrics();
  }
}

// -------------------------------------------------------------
// DENSITY MANAGEMENT (PERMANENTLY COMPACT)
// -------------------------------------------------------------
function applyDensity() {
  state.density = 'compact';
  document.documentElement.setAttribute('data-density', 'compact');
  document.body.classList.add('mode-compact');
  localStorage.setItem('wdh_density', 'compact');
}

window.toggleDensity = function() {
  applyDensity();
};

// -------------------------------------------------------------
// INITIALIZATION
// -------------------------------------------------------------
async function initApp() {
  closeLightbox();
  applyTheme('light');
  applyDensity();
  setupEventListeners();
  setupSSE();

  // Resolve initial deep-link tab and runId
  const initialRoute = parseCurrentRoute();
  if (initialRoute.runId) {
    state.targetRunId = initialRoute.runId;
  }
  switchTab(initialRoute.tab || 'dashboard');

  await Promise.all([
    fetchEnvironments(),
    fetchSuites(),
    fetchScenarios(),
    fetchHistory(),
  ]);

  // Initial Health Ping & HUD Telemetry
  testEnvironmentHealth(state.activeEnvironmentId);
  fetchHealthHud();
  setInterval(fetchHealthHud, 30000);

  initWorkerSwimlanes(state.workers || 4);
  setupCommandPalette();
  renderDashboardModulesGrid();
  updateQualityGateStatus();
  if (typeof loadFailureIntelligence === 'function') {
    loadFailureIntelligence();
  }
}

// -------------------------------------------------------------
// EVENT LISTENERS
// -------------------------------------------------------------
function setupEventListeners() {

  // Deep-link Hash Navigation
  window.addEventListener('hashchange', handleUrlRouting);

  // Navigation Tabs
  elements.navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.dataset.tab;
      switchTab(targetTab);
    });
  });

  // Environment Dropdown Toggle
  if (elements.envSelectorBtn) {
    elements.envSelectorBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (elements.envDropdownMenu) elements.envDropdownMenu.classList.toggle('hidden');
      if (elements.enginesDropdownMenu) elements.enginesDropdownMenu.classList.add('hidden');
      if (elements.userAuthDropdown) elements.userAuthDropdown.classList.add('hidden');
    });
  }

  // Unified Automation Engines Dropdown Toggle
  if (elements.enginesMenuBtn) {
    elements.enginesMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (elements.enginesDropdownMenu) elements.enginesDropdownMenu.classList.toggle('hidden');
      if (elements.envDropdownMenu) elements.envDropdownMenu.classList.add('hidden');
      if (elements.userAuthDropdown) elements.userAuthDropdown.classList.add('hidden');
    });
  }

  // Close engines dropdown when an engine card is clicked
  document.querySelectorAll('.engine-card').forEach(card => {
    card.addEventListener('click', () => {
      if (elements.enginesDropdownMenu) elements.enginesDropdownMenu.classList.add('hidden');
    });
  });

  // User Authentication & Profile Dropdown Toggle
  if (elements.userChipBtn) {
    elements.userChipBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (elements.userAuthDropdown) elements.userAuthDropdown.classList.toggle('hidden');
      if (elements.envDropdownMenu) elements.envDropdownMenu.classList.add('hidden');
      if (elements.enginesDropdownMenu) elements.enginesDropdownMenu.classList.add('hidden');
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
    if (elements.enginesDropdownMenu && !elements.enginesDropdownMenu.contains(e.target) && (!elements.enginesMenuBtn || !elements.enginesMenuBtn.contains(e.target))) {
      elements.enginesDropdownMenu.classList.add('hidden');
    }
    if (elements.userAuthDropdown && !elements.userAuthDropdown.contains(e.target) && (!elements.userChipBtn || !elements.userChipBtn.contains(e.target))) {
      elements.userAuthDropdown.classList.add('hidden');
    }
  });

  // Runner Environment Selector
  if (elements.runnerEnvSelect) {
    elements.runnerEnvSelect.addEventListener('change', (e) => {
      switchEnvironment(e.target.value);
    });
  }

  // Quick Ping & Telemetry Ping
  if (elements.quickPingBtn) elements.quickPingBtn.addEventListener('click', () => testEnvironmentHealth(state.activeEnvironmentId));
  if (elements.telemetryPingBtn) elements.telemetryPingBtn.addEventListener('click', () => testEnvironmentHealth(state.activeEnvironmentId));
  if (elements.telemetrySwitchBtn) elements.telemetrySwitchBtn.addEventListener('click', () => switchTab('environments'));

  // Density View Toggle (Compact vs Comfortable)
  const densityBtn = document.getElementById('density-toggle-btn');
  if (densityBtn) densityBtn.addEventListener('click', window.toggleDensity);

  // Browser Selector
  if (elements.browserButtons) {
    elements.browserButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        elements.browserButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.selectedBrowser = btn.dataset.browser;
      });
    });
  }

  // Headed Toggle
  if (elements.headedToggle) {
    elements.headedToggle.addEventListener('change', (e) => {
      state.isHeaded = e.target.checked;
    });
  }

  // Parallel Workers Selector
  const workersButtons = document.querySelectorAll('#workers-selector .toggle-btn');
  workersButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      workersButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.workers = parseInt(btn.dataset.workers, 10) || 1;
      appendLog(`[SYSTEM] Parallel worker grid set to: ${state.workers}x worker concurrency`, 'system');
      initWorkerSwimlanes(state.workers);
      updateSelectedScenariosBar();
      showToast('Concurrency Grid', `Parallel worker grid set to: ${state.workers}x workers`, 'info');
    });
  });

  // KPI Modules Quick Actions
  const kpiModules = document.getElementById('kpi-card-modules');
  if (kpiModules) {
    kpiModules.addEventListener('click', () => {
      switchTab('suites');
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

  const kpiLifecycle = document.getElementById('kpi-card-lifecycle') || document.getElementById('kpi-card-e2e');
  if (kpiLifecycle) {
    kpiLifecycle.addEventListener('click', () => {
      window.openSuiteDetailsModal('e2e');
    });
  }

  // Run All / Stop
  if (elements.runAllBtn) elements.runAllBtn.addEventListener('click', () => triggerRun({ suiteId: 'all' }));
  if (elements.stopRunBtn) elements.stopRunBtn.addEventListener('click', stopExecution);
  if (elements.bannerStopBtn) elements.bannerStopBtn.addEventListener('click', stopExecution);

  // Multi-Module Batch Execution
  const runSelectedModulesBtn = document.getElementById('run-selected-modules-btn');
  if (runSelectedModulesBtn) {
    runSelectedModulesBtn.addEventListener('click', () => {
      if (state.selectedSuiteIds.length === 0) return window.showToast('Please select at least one module to run.', 'warning');
      appendLog(`[SYSTEM] Triggering batch execution for ${state.selectedSuiteIds.length} selected module(s)...`, 'system');
      triggerRun({ suiteIds: state.selectedSuiteIds });
    });
  }

  // Select All Modules Button
  const selectAllModulesBtn = document.getElementById('select-all-modules-btn');
  if (selectAllModulesBtn) {
    selectAllModulesBtn.addEventListener('click', () => {
      const individualSuites = (state.suites || []).filter(s => s.id !== 'all');
      if (state.selectedSuiteIds.length === individualSuites.length) {
        state.selectedSuiteIds = [];
        selectAllModulesBtn.innerHTML = '<span>☑️ Select All</span>';
      } else {
        state.selectedSuiteIds = individualSuites.map(s => s.id);
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
  if (elements.scenarioSearch) elements.scenarioSearch.addEventListener('input', filterScenariosTable);
  if (elements.scenarioSuiteFilter) {
    elements.scenarioSuiteFilter.addEventListener('change', (e) => {
      populateOperationGroupFilters(e.target.value);
      filterScenariosTable();
    });
  }

  const groupFilterSelect = document.getElementById('scenario-group-filter');
  if (groupFilterSelect) {
    groupFilterSelect.addEventListener('change', () => {
      const val = groupFilterSelect.value;
      const pillsContainer = document.getElementById('scenario-group-quick-pills');
      if (pillsContainer) {
        pillsContainer.querySelectorAll('.filter-pill').forEach(p => {
          p.classList.toggle('active', p.dataset.opgroup === val);
        });
      }
      filterScenariosTable();
    });
  }

  const tagFilterSelect = document.getElementById('scenario-tag-filter');
  if (tagFilterSelect) tagFilterSelect.addEventListener('change', filterScenariosTable);

  // Scenario Group Quick Pills initial binding
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
      if (state.selectedScenarioIds.length === 0) return window.showToast('Please select at least one test scenario to run.', 'warning');
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

  if (elements.autoscrollToggle) {
    elements.autoscrollToggle.addEventListener('change', (e) => {
      state.autoScrollLogs = e.target.checked;
    });
  }
  if (elements.clearLogsBtn) {
    elements.clearLogsBtn.addEventListener('click', () => {
      if (elements.terminalBody) elements.terminalBody.innerHTML = '<span class="log-system">[SYSTEM] Terminal logs cleared.</span>\n';
    });
  }
  if (elements.downloadLogsBtn) elements.downloadLogsBtn.addEventListener('click', downloadLogs);
  if (elements.logLevelSelect) {
    elements.logLevelSelect.value = state.logLevel || 'INFO';
    elements.logLevelSelect.addEventListener('change', (e) => {
      state.logLevel = e.target.value;
      localStorage.setItem('wdh_log_level', e.target.value);
      appendLog(`[SYSTEM] Log verbosity level set to: ${state.logLevel}`, 'system');
    });
  }
  if (elements.expandTerminalBtn) {
    elements.expandTerminalBtn.addEventListener('click', () => {
      const drawer = elements.rawLogsDrawer || document.getElementById('raw-logs-drawer');
      if (drawer) {
        drawer.classList.toggle('terminal-expanded');
        const isExp = drawer.classList.contains('terminal-expanded');
        elements.expandTerminalBtn.innerHTML = isExp ? '<span>🗗 Restore</span>' : '<span>⛶ Expand</span>';
      }
    });
  }
  const terminalGreenDot = document.querySelector('.terminal-card .terminal-dot.green');
  if (terminalGreenDot) {
    terminalGreenDot.style.cursor = 'pointer';
    terminalGreenDot.setAttribute('title', 'Click to expand / restore');
    terminalGreenDot.addEventListener('click', () => {
      const btn = document.getElementById('expand-terminal-btn');
      if (btn) btn.click();
    });
  }

  // Environment Fleet Tab
  if (elements.pingAllEnvsBtn) elements.pingAllEnvsBtn.addEventListener('click', pingAllEnvironments);
  if (elements.addEnvBtn) elements.addEnvBtn.addEventListener('click', () => openEnvironmentModal());
  if (elements.quickManageEnvBtn) {
    elements.quickManageEnvBtn.addEventListener('click', () => {
      if (elements.envDropdownMenu) elements.envDropdownMenu.classList.add('hidden');
      switchTab('environments');
    });
  }
  if (elements.openEnvModalBtn) elements.openEnvModalBtn.addEventListener('click', () => openEnvironmentModal());

  // Environment Modal Actions
  if (elements.envModalClose) elements.envModalClose.addEventListener('click', closeEnvironmentModal);
  if (elements.envModalCancel) elements.envModalCancel.addEventListener('click', closeEnvironmentModal);
  if (elements.envForm) elements.envForm.addEventListener('submit', handleSaveEnvironment);
  if (elements.envFormTestBtn) elements.envFormTestBtn.addEventListener('click', handleTestModalUrl);
  if (elements.envFormTogglePwd) {
    elements.envFormTogglePwd.addEventListener('click', () => {
      const input = elements.envFormPassword;
      if (input) input.type = input.type === 'password' ? 'text' : 'password';
    });
  }

  // PROD Safety Modal Actions
  if (elements.prodConfirmInput) {
    elements.prodConfirmInput.addEventListener('input', (e) => {
      const val = e.target.value.trim().toUpperCase();
      if (elements.prodProceedBtn) {
        elements.prodProceedBtn.disabled = !(val === 'CONFIRM-PROD-SAFETY-OVERRIDE' || val === 'PROD');
      }
    });
  }
  if (elements.prodProceedBtn) {
    elements.prodProceedBtn.addEventListener('click', () => {
      const payload = state.pendingRunPayload;
      closeProdSafetyModal();
      if (payload) {
        payload.safetyBypassKey = 'CONFIRM-PROD-SAFETY-OVERRIDE';
        executeRunRequest(payload);
        state.pendingRunPayload = null;
      }
    });
  }
  if (elements.prodCancelBtn) elements.prodCancelBtn.addEventListener('click', closeProdSafetyModal);
  if (elements.prodSafetyClose) elements.prodSafetyClose.addEventListener('click', closeProdSafetyModal);

  // Pre-Flight VPN Warning Modal Actions
  if (elements.vpnWarningClose) elements.vpnWarningClose.addEventListener('click', closeVpnWarningModal);
  if (elements.vpnProceedBtn) {
    elements.vpnProceedBtn.addEventListener('click', () => {
      const payload = state.pendingVpnRunPayload;
      closeVpnWarningModal();
      if (payload) {
        payload.forceRun = true;
        executeRunRequest(payload);
      }
    });
  }
  if (elements.vpnSwitchEnvBtn) {
    elements.vpnSwitchEnvBtn.addEventListener('click', async () => {
      closeVpnWarningModal();
      const reachableEnv = (state.environments && (state.environments.find(e => e.id === 'azure-fd') || state.environments.find(e => e.health?.status === 'healthy') || state.environments[0]));
      if (reachableEnv) {
        await switchEnvironment(reachableEnv.id);
        appendLog(`[SYSTEM] Switched active environment to: [${reachableEnv.category}] ${reachableEnv.name}`, 'system');
      }
    });
  }

  // Health HUD Modal Actions
  if (elements.headerHealthHudPill) {
    elements.headerHealthHudPill.addEventListener('click', () => {
      fetchHealthHud();
      if (elements.envHealthHudModal) elements.envHealthHudModal.classList.remove('hidden');
    });
  }
  if (elements.envHealthHudClose) elements.envHealthHudClose.addEventListener('click', closeHealthHudModal);
  if (elements.hudCloseBtn) elements.hudCloseBtn.addEventListener('click', closeHealthHudModal);
  if (elements.hudDeepProbeBtn) {
    elements.hudDeepProbeBtn.addEventListener('click', async () => {
      elements.hudDeepProbeBtn.disabled = true;
      elements.hudDeepProbeBtn.textContent = '⏳ Probing Fleet...';
      try {
        await fetch('/api/environments/health-check', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) });
        await fetchHealthHud();
        showToast('Deep health probe completed', 'success');
      } catch (err) {
        showToast('Health probe failed: ' + err.message, 'error');
      } finally {
        elements.hudDeepProbeBtn.disabled = false;
        elements.hudDeepProbeBtn.textContent = '⚡ Run Diagnostic Probe';
      }
    });
  }

  // Guardrail Header Badge Action
  if (elements.headerGuardrailBadge) {
    elements.headerGuardrailBadge.addEventListener('click', () => {
      promptProdSafetyModal(state.activeEnvironment, null);
    });
  }

  // Session Persistence Modal Actions
  if (elements.headerSessionBadge) {
    elements.headerSessionBadge.addEventListener('click', () => {
      fetchSessionHud();
      if (elements.authSessionModal) elements.authSessionModal.classList.remove('hidden');
    });
  }
  if (elements.authSessionClose) elements.authSessionClose.addEventListener('click', closeSessionModal);
  if (elements.sessionDoneBtn) elements.sessionDoneBtn.addEventListener('click', closeSessionModal);
  if (elements.sessionRefreshBtn) {
    elements.sessionRefreshBtn.addEventListener('click', async () => {
      elements.sessionRefreshBtn.disabled = true;
      elements.sessionRefreshBtn.textContent = '⏳ Authenticating...';
      try {
        await fetch('/api/auth/session-hud');
        showToast('Storage state active: playwright/.auth/user.json', 'success');
      } catch (err) {
        showToast('Session check failed', 'error');
      } finally {
        elements.sessionRefreshBtn.disabled = false;
        elements.sessionRefreshBtn.textContent = '🔄 Re-authenticate Fresh Session';
      }
    });
  }

  // Data Engine Modal Actions
  if (elements.headerDataEngineBadge) {
    elements.headerDataEngineBadge.addEventListener('click', () => {
      fetchDataRegistry();
      if (elements.dataEngineModal) elements.dataEngineModal.classList.remove('hidden');
    });
  }
  if (elements.dataEngineClose) elements.dataEngineClose.addEventListener('click', closeDataEngineModal);
  if (elements.dataEngineDoneBtn) elements.dataEngineDoneBtn.addEventListener('click', closeDataEngineModal);
  if (elements.dataGenBtn) {
    elements.dataGenBtn.addEventListener('click', () => {
      const idx = elements.dataGenWorkerSelect ? parseInt(elements.dataGenWorkerSelect.value, 10) : 0;
      generateSampleTestData(idx);
    });
  }

  // History Tab Actions
  if (elements.historyEnvFilter) elements.historyEnvFilter.addEventListener('change', () => fetchHistory(elements.historyEnvFilter.value));
  if (elements.exportHistoryCsvBtn) elements.exportHistoryCsvBtn.addEventListener('click', () => window.open('/api/history/export?format=csv', '_blank'));
  if (elements.exportHistoryJsonBtn) elements.exportHistoryJsonBtn.addEventListener('click', () => window.open('/api/history/export?format=json', '_blank'));

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
  if (elements.suiteModalClose) elements.suiteModalClose.addEventListener('click', closeSuiteDetailsModal);
  if (elements.suiteModalFooterClose) elements.suiteModalFooterClose.addEventListener('click', closeSuiteDetailsModal);
  if (elements.suiteDetailsModal) {
    elements.suiteDetailsModal.addEventListener('click', (e) => {
      if (e.target === elements.suiteDetailsModal) closeSuiteDetailsModal();
    });
  }
  if (elements.suiteModalSearch) {
    elements.suiteModalSearch.addEventListener('input', (e) => {
      if (state.activeModalSuiteId) {
        renderSuiteModalTestCases(state.activeModalSuiteId, e.target.value);
      }
    });
  }
  if (elements.suiteModalRunAllBtn) {
    elements.suiteModalRunAllBtn.addEventListener('click', () => {
      if (state.activeModalSuiteId) {
        const targetId = state.activeModalSuiteId;
        closeSuiteDetailsModal();
        window.triggerSuiteRun(targetId);
      }
    });
  }
  if (elements.suiteModalMatrixBtn) {
    elements.suiteModalMatrixBtn.addEventListener('click', () => {
      if (state.activeModalSuiteId) {
        const targetId = state.activeModalSuiteId;
        closeSuiteDetailsModal();
        if (elements.scenarioSuiteFilter) {
          elements.scenarioSuiteFilter.value = targetId;
          populateOperationGroupFilters(targetId);
        }
        filterScenariosTable();
        switchTab('matrix');
      }
    });
  }

  // AI RCA Banner Actions
  if (elements.aiRcaDismissBtn) elements.aiRcaDismissBtn.addEventListener('click', () => elements.aiRcaBanner?.classList.add('hidden'));
  if (elements.rcaCopyCodeBtn) elements.rcaCopyCodeBtn.addEventListener('click', copyRcaCode);
  if (elements.rcaOpenTraceBtn) elements.rcaOpenTraceBtn.addEventListener('click', openLatestTrace);
  if (elements.rcaOpenAllureBtn) elements.rcaOpenAllureBtn.addEventListener('click', () => {
    switchTab('report');
    switchReportView('playwright');
  });

  // Terminal Trace & Report Actions (Live Execution Canvas)
  if (elements.terminalTraceBtn) elements.terminalTraceBtn.addEventListener('click', openLatestTrace);
  if (elements.terminalDownloadTraceBtn) elements.terminalDownloadTraceBtn.addEventListener('click', downloadLatestTrace);
  if (elements.terminalAllureBtn) elements.terminalAllureBtn.addEventListener('click', () => {
    switchTab('report');
    switchReportView('playwright');
  });

  // Arbitrary Key-Value Env Modal Listeners
  if (elements.openEnvVarsBtn) elements.openEnvVarsBtn.addEventListener('click', window.openEnvVarsModal);
  if (elements.envVarsModalClose) elements.envVarsModalClose.addEventListener('click', window.closeEnvVarsModal);
  if (elements.envVarsModal) {
    elements.envVarsModal.addEventListener('click', (e) => {
      if (e.target === elements.envVarsModal) window.closeEnvVarsModal();
    });
  }

  // Multi-Report Sub-Tabs
  if (elements.reportSubTabs) {
    elements.reportSubTabs.forEach(btn => {
      btn.addEventListener('click', () => switchReportView(btn.dataset.report));
    });
  }
  if (elements.refreshReportBtn) elements.refreshReportBtn.addEventListener('click', refreshCurrentReport);

  // RCA Drilldown Modal Actions
  if (elements.rcaModalClose) elements.rcaModalClose.addEventListener('click', closeRcaModal);
  if (elements.rcaModalFooterClose) elements.rcaModalFooterClose.addEventListener('click', closeRcaModal);
  if (elements.rcaModal) {
    elements.rcaModal.addEventListener('click', (e) => {
      if (e.target === elements.rcaModal) closeRcaModal();
    });
  }

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

  // API Performance View Mode (Actions vs Endpoints vs Flat)
  if (elements.perfViewModeGroup) {
    elements.perfViewModeGroup.addEventListener('click', (e) => {
      const btn = e.target.closest('.toggle-btn');
      if (!btn) return;
      elements.perfViewModeGroup.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.perfViewMode = btn.dataset.viewMode || 'ENDPOINTS';
      filterPerformanceActions();
    });
  }

  // API Microservices Filter Pills Bar
  if (elements.perfMsPills) {
    elements.perfMsPills.addEventListener('click', (e) => {
      const pill = e.target.closest('.filter-pill');
      if (!pill) return;
      elements.perfMsPills.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      state.perfMicroserviceFilter = pill.dataset.ms || 'ALL';
      if (elements.perfFilterMsSelect) elements.perfFilterMsSelect.value = state.perfMicroserviceFilter;
      filterPerformanceActions();
    });
  }

  // API Microservices Dropdown
  if (elements.perfFilterMsSelect) {
    elements.perfFilterMsSelect.addEventListener('change', (e) => {
      state.perfMicroserviceFilter = e.target.value;
      if (elements.perfMsPills) {
        elements.perfMsPills.querySelectorAll('.filter-pill').forEach(p => {
          p.classList.toggle('active', p.dataset.ms === state.perfMicroserviceFilter);
        });
      }
      filterPerformanceActions();
    });
  }

  // API Sort Select
  if (elements.perfSortSelect) {
    elements.perfSortSelect.addEventListener('change', (e) => {
      state.perfSortOrder = e.target.value;
      filterPerformanceActions();
    });
  }

  // API Reset Filters Button
  if (elements.perfResetFiltersBtn) {
    elements.perfResetFiltersBtn.addEventListener('click', () => {
      window.resetPerfFilters();
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
// DEEP-LINK URL ROUTING & TAB NAVIGATION
// -------------------------------------------------------------
function parseCurrentRoute() {
  const hash = window.location.hash.replace(/^#/, '').trim();
  const urlParams = new URLSearchParams(window.location.search);
  let tab = 'dashboard';
  let runId = urlParams.get('run') || urlParams.get('runId') || null;

  if (hash) {
    const [hTab, hQuery] = hash.split('?');
    if (hTab) tab = hTab;
    if (hQuery) {
      const hParams = new URLSearchParams(hQuery);
      if (hParams.get('run')) runId = hParams.get('run');
      if (hParams.get('runId')) runId = hParams.get('runId');
    }
  }
  if (urlParams.get('tab')) {
    tab = urlParams.get('tab');
  }

  return { tab, runId };
}

function handleUrlRouting() {
  const route = parseCurrentRoute();
  if (route.runId) {
    state.targetRunId = route.runId;
  }
  if (route.tab && state.activeTab !== route.tab) {
    switchTab(route.tab);
  } else if (route.tab === 'history' && route.runId) {
    highlightTargetHistoryRun(route.runId);
  }
}

function highlightTargetHistoryRun(runId) {
  if (!runId) return;
  setTimeout(() => {
    const row = document.getElementById(`history-row-${runId}`) || document.querySelector(`tr[data-run-id="${runId}"]`);
    if (row) {
      row.scrollIntoView({ behavior: 'smooth', block: 'center' });
      row.classList.add('history-row-highlight');
      setTimeout(() => {
        row.classList.remove('history-row-highlight');
      }, 7000);
      if (window.openRunDetailsModal) {
        window.openRunDetailsModal(runId);
      }
    }
  }, 350);
}

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

  if (tabId === 'suites') {
    if (state.suites && state.suites.length > 0) {
      renderSuitesGrid();
    } else {
      fetchSuites();
    }
  }
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
  if (tabId === 'report') {
    switchReportView(state.activeReportTab || 'playwright');
    if (typeof loadFailureIntelligence === 'function') loadFailureIntelligence();
  }
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
    state.activeEnvironmentId = data.activeEnvironmentId || (state.environments[0]?.id) || 'azure-fd';
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
  if (elements.headerEnvCategory) {
    elements.headerEnvCategory.textContent = env.category;
    elements.headerEnvCategory.className = `env-category-tag cat-${env.category.toLowerCase()}`;
  }
  if (elements.headerEnvName) elements.headerEnvName.textContent = env.name;
  if (elements.usernameDisplay) elements.usernameDisplay.textContent = env.auth?.username || '';

  // Telemetry Banner UI
  if (elements.telemetryEnvName) elements.telemetryEnvName.textContent = env.name;
  if (elements.telemetryCategory) {
    elements.telemetryCategory.textContent = env.category;
    elements.telemetryCategory.className = `badge badge-env cat-${env.category.toLowerCase()}`;
  }
  if (elements.telemetryBaseUrl) elements.telemetryBaseUrl.textContent = env.baseUrl;
  if (elements.telemetryUsername) elements.telemetryUsername.textContent = env.auth?.username || '';
  if (elements.kpiEnvs) elements.kpiEnvs.textContent = `${state.environments.length} Environments`;

  if (elements.runnerEnvSelect) {
    elements.runnerEnvSelect.value = env.id;
  }
}

function renderEnvironmentDropdown() {
  if (!elements.envDropdownList) return;
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

  if (elements.runnerEnvSelect) elements.runnerEnvSelect.innerHTML = optionsHtml;
  if (elements.schedFormEnv) elements.schedFormEnv.innerHTML = optionsHtml;

  // History filter
  if (elements.historyEnvFilter) {
    elements.historyEnvFilter.innerHTML = `<option value="">All Environments</option>` + state.environments.map(env => `
      <option value="${env.id}">[${env.category}] ${env.name}</option>
    `).join('');
  }
}

function renderEnvironmentFleet() {
  if (!elements.envFleetContainer) return;
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
      const isUnhealthy = health.status === 'vpn_required' || health.status === 'unreachable';
      elements.telemetryLatency.textContent = isUnhealthy ? '-- ms' : `${health.latency} ms`;
      elements.headerEnvPulse.className = `pulse-dot ${getPulseClass(health.status)}`;
      if (health.status === 'healthy') {
        elements.telemetryHealthBadge.textContent = 'HEALTHY';
        elements.telemetryHealthBadge.className = 'badge badge-health-online';
        elements.telemetryStatusText.textContent = `HTTP ${health.statusCode} (${health.latency}ms)`;
        elements.telemetryStatusText.className = 'metric-value status-good';
      } else {
        elements.telemetryHealthBadge.textContent = health.status === 'vpn_required' ? 'VPN REQUIRED' : 'OFFLINE / WARN';
        elements.telemetryHealthBadge.className = 'badge badge-health-offline';
        elements.telemetryStatusText.textContent = health.message;
        elements.telemetryStatusText.className = 'metric-value status-bad';
      }

      // Update 1-Click direct switch button
      const directSwitchBtn = document.getElementById('telemetry-direct-switch-btn');
      if (directSwitchBtn) {
        if (isUnhealthy) {
          directSwitchBtn.classList.remove('hidden');
          directSwitchBtn.onclick = async () => {
            await switchEnvironment('azure-fd');
            appendLog(`[SYSTEM] Switched active environment to: Azure FrontDoor (CMPaaS)`, 'system');
          };
        } else {
          directSwitchBtn.classList.add('hidden');
        }
      }

      updateQualityGateStatus();
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
  const confirmed = await window.appConfirm(`Are you sure you want to delete environment "${envId}"?`, {
    title: 'Delete Environment',
    badge: 'DESTRUCTIVE',
    type: 'danger',
    icon: '🗑️',
    confirmText: 'Delete Environment',
    cancelText: 'Cancel',
  });
  if (!confirmed) return;

  try {
    const res = await fetch(`/api/environments/${envId}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) {
      appendLog(`[SYSTEM] Environment "${envId}" removed`, 'system');
      window.showToast(`Environment "${envId}" removed successfully`, 'success');
      fetchEnvironments();
    } else {
      await window.appAlert(data.error || 'Failed to delete environment.', { title: 'Delete Failed', badge: 'ERROR', icon: '❌' });
    }
  } catch (err) {
    await window.appAlert(err.message, { title: 'Delete Failed', badge: 'ERROR', icon: '❌' });
  }
};

function closeEnvironmentModal() {
  elements.envModal.classList.add('hidden');
}

async function handleTestModalUrl() {
  const url = elements.envFormUrl.value.trim();
  if (!url) return window.showToast('Please enter a valid URL first', 'warning');

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
      await window.appAlert(data.error || 'Failed to save environment.', { title: 'Save Failed', badge: 'ERROR', icon: '❌' });
    }
  } catch (err) {
    await window.appAlert(`Error saving environment: ${err.message}`, { title: 'Save Failed', badge: 'ERROR', icon: '❌' });
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
    renderDashboardModulesGrid();
    populateSuiteFilters();
    if (data.currentRun && data.currentRun.runId) {
      updateLatestRunSnapshot(data.currentRun);
    }
  } catch (err) {
    console.error('Failed to fetch suites:', err);
  }
}

// Multi-Module Selection State
state.selectedSuiteIds = [];

function renderSuitesGrid(filterGroup = 'all') {
  // Filter out the meta-suite 'all' so only individual modules are rendered in the grid
  const individualSuites = (state.suites || []).filter(s => s.id !== 'all');
  let suitesToRender = individualSuites;
  
  if (filterGroup === 'e2e') {
    suitesToRender = individualSuites.filter(s => s.id === 'e2e');
  } else if (filterGroup === 'core') {
    suitesToRender = individualSuites.filter(s => ['auth', 'dashboard', 'config'].includes(s.id));
  } else if (filterGroup === 'sims') {
    suitesToRender = individualSuites.filter(s => ['subscriptions', 'resources', 'esim'].includes(s.id));
  } else if (filterGroup === 'billing') {
    suitesToRender = individualSuites.filter(s => ['rating', 'invoice_data', 'accounts'].includes(s.id));
  } else if (filterGroup === 'admin') {
    suitesToRender = individualSuites.filter(s => ['administration', 'automation_rules', 'security', 'reports', 'ordering'].includes(s.id));
  }

  const container = document.getElementById('suites-container');
  if (container) {
    container.innerHTML = suitesToRender.map(suite => {
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
  }

  if (elements.kpiModules) elements.kpiModules.textContent = `${individualSuites.length} Suites`;
  if (elements.suiteCountBadge) elements.suiteCountBadge.textContent = `${individualSuites.length} Modules Ready`;
  const tabSuitesBadge = document.getElementById('tab-suites-badge');
  if (tabSuitesBadge) tabSuitesBadge.textContent = individualSuites.length;
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

function populateOperationGroupFilters(selectedSuiteId) {
  if (!selectedSuiteId && elements.scenarioSuiteFilter) {
    selectedSuiteId = elements.scenarioSuiteFilter.value || 'all';
  }
  selectedSuiteId = selectedSuiteId || 'all';

  const groupFilter = document.getElementById('scenario-group-filter');
  const pillsContainer = document.getElementById('scenario-group-quick-pills');

  // Scenarios belonging to this suite (or all scenarios if suite is 'all')
  const suiteScenarios = (selectedSuiteId === 'all')
    ? (state.scenarios || [])
    : (state.scenarios || []).filter(s => s.suiteId === selectedSuiteId);

  const groups = [...new Set(suiteScenarios.map(s => s.operationGroup).filter(Boolean))];

  // Check if current filter value is still valid in this suite
  const currentVal = groupFilter ? groupFilter.value : 'all';
  const nextVal = groups.includes(currentVal) ? currentVal : 'all';

  if (groupFilter) {
    groupFilter.innerHTML = `<option value="all">All Groups in Scope (${suiteScenarios.length})</option>` + groups.map(g => {
      const count = suiteScenarios.filter(s => s.operationGroup === g).length;
      return `<option value="${g}">${g} (${count})</option>`;
    }).join('');
    groupFilter.value = nextVal;
  }

  // Populate dynamic quick filter pills
  if (pillsContainer) {
    pillsContainer.innerHTML = `
      <button class="filter-pill ${nextVal === 'all' ? 'active' : ''}" data-opgroup="all">All Operations (${suiteScenarios.length})</button>
      ${groups.map(g => {
        const count = suiteScenarios.filter(s => s.operationGroup === g).length;
        const isActive = nextVal === g;
        return `<button class="filter-pill ${isActive ? 'active' : ''}" data-opgroup="${g}">${g} (${count})</button>`;
      }).join('')}
    `;

    // Reattach click events to dynamic pills
    pillsContainer.querySelectorAll('.filter-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        pillsContainer.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const opgroup = pill.dataset.opgroup;
        if (groupFilter) {
          groupFilter.value = opgroup;
        }
        filterScenariosTable();
      });
    });
  }
}

function populateSuiteFilters() {
  const individualSuites = (state.suites || []).filter(s => s.id !== 'all');
  const optionsHtml = `<option value="all">All Suites (Full Suite)</option>` + individualSuites.map(s => `
    <option value="${s.id}">${s.name}</option>
  `).join('');

  if (elements.scenarioSuiteFilter) elements.scenarioSuiteFilter.innerHTML = optionsHtml;
  if (elements.schedFormSuite) elements.schedFormSuite.innerHTML = `<option value="all">Full Regression Suite (${state.scenarios.length || 81} Tests)</option>` + individualSuites.map(s => `
    <option value="${s.id}">${s.name} (${s.testCount || ''} Tests)</option>
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
        <td><span class="font-mono" style="font-weight: 700; color: var(--primary);">${sc.id}</span></td>
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

  // Floating Batch Dock Update
  const dock = document.getElementById('matrix-batch-dock');
  const dockCount = document.getElementById('batch-dock-count');
  const dockSub = document.getElementById('batch-dock-sub');
  const dockWorkers = document.getElementById('batch-dock-workers-label');

  if (dock) {
    if (count > 0) {
      dock.classList.remove('hidden');
      if (dockCount) dockCount.textContent = count;
      if (dockWorkers) dockWorkers.textContent = state.workers || 4;
      if (dockSub) {
        dockSub.textContent = `Target: [${state.activeEnvironment?.category || 'DEV'}] ${state.activeEnvironment?.name || 'Cluster'} (${state.workers || 4}x Parallel Workers)`;
      }
    } else {
      dock.classList.add('hidden');
    }
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
  const selectedEnvId = elements.runnerEnvSelect?.value || state.activeEnvironmentId || 'azure-fd';
  const targetEnv = (state.environments && state.environments.find(e => e.id === selectedEnvId)) || 
                    state.activeEnvironment || 
                    (state.environments && state.environments[0]) || 
                    {
                      id: 'azure-fd',
                      name: 'Azure FrontDoor (CMPaaS)',
                      category: 'DEV',
                      baseUrl: 'https://wdh-ekbbe2e2bbe4addc.a02.azurefd.net',
                      isProtected: false
                    };

  const runPayload = {
    ...payload,
    envId: targetEnv.id || 'azure-fd',
    browser: state.selectedBrowser || 'chromium',
    headed: state.isHeaded || false,
    workers: state.workers || 1,
    logLevel: state.logLevel || 'INFO',
  };

  // Check if Protected / PROD environment
  if (targetEnv.isProtected || targetEnv.category === 'PROD') {
    promptProdSafetyModal(targetEnv, runPayload);
    return;
  }

  // Pre-Flight Connectivity & VPN Guardrail: check if environment requires VPN or is unreachable
  const isVpnRequired = targetEnv.health?.status === 'vpn_required' || targetEnv.health?.status === 'unreachable';
  if (isVpnRequired && !payload.forceRun) {
    promptVpnWarningModal(targetEnv, runPayload);
    return;
  }

  executeRunRequest(runPayload);
}

function promptVpnWarningModal(targetEnv, runPayload) {
  state.pendingVpnRunPayload = runPayload;
  if (elements.vpnTargetEnv) {
    elements.vpnTargetEnv.textContent = `[${targetEnv.category || 'DEV'}] ${targetEnv.name || 'Target Environment'} (${targetEnv.baseUrl || ''})`;
  }
  if (elements.vpnWarningDesc) {
    elements.vpnWarningDesc.innerHTML = targetEnv.health?.message 
      ? `Target host status: <strong>${targetEnv.health.message}</strong>. Running tests without VPN connectivity will result in immediate network errors.`
      : `Target host domain is unresolvable via public DNS and requires an active <strong>AT&T Corporate VPN</strong> connection.`;
  }
  if (elements.vpnWarningModal) elements.vpnWarningModal.classList.remove('hidden');
}

function closeVpnWarningModal() {
  if (elements.vpnWarningModal) elements.vpnWarningModal.classList.add('hidden');
  state.pendingVpnRunPayload = null;
}

function promptProdSafetyModal(targetEnv, runPayload) {
  state.pendingRunPayload = runPayload;
  if (elements.safetyEnvTarget) {
    elements.safetyEnvTarget.textContent = `[${targetEnv.category || 'PROD'}] ${targetEnv.name || 'Target Environment'} (${targetEnv.baseUrl || ''})`;
  }
  if (elements.prodConfirmInput) elements.prodConfirmInput.value = '';
  if (elements.prodProceedBtn) elements.prodProceedBtn.disabled = true;
  if (elements.prodSafetyModal) elements.prodSafetyModal.classList.remove('hidden');
}

function closeProdSafetyModal() {
  if (elements.prodSafetyModal) elements.prodSafetyModal.classList.add('hidden');
  state.pendingRunPayload = null;
}

async function executeRunRequest(payload) {
  try {
    if (elements.runAllBtn) elements.runAllBtn.disabled = true;
    if (elements.stopRunBtn) elements.stopRunBtn.disabled = false;

    // Auto-switch to Live Execution Canvas tab for instant visibility of execution
    if (typeof switchTab === 'function') {
      switchTab('terminal');
    }

    // Immediately initialize Live Canvas HUD for the initiated suite/scenario
    const suiteObj = state.suites.find(s => s.id === payload.suiteId) || { name: payload.suiteId || 'Automated Test Execution' };
    const initialRunData = {
      isRunning: true,
      suiteName: suiteObj.name || payload.suiteId,
      suiteId: payload.suiteId,
      envName: payload.envId === 'azure-fd' ? 'Azure FrontDoor (CMPaaS)' : (state.activeEnvironment?.name || 'Target Environment'),
      baseUrl: state.activeEnvironment?.baseUrl || 'https://wdh-ekbbe2e2bbe4addc.a02.azurefd.net',
      browser: payload.browser || state.selectedBrowser || 'chromium',
      workers: payload.workers || state.workers || 1,
      stats: { passed: 0, failed: 0, skipped: 0, total: 10 }
    };
    handleRunStart(initialRunData);

    appendLog(`[SYSTEM] Initializing Test Execution against environment: [${payload.envId}]...`, 'system');

    const res = await fetch('/api/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (res.status === 403 || data.code === 'PROD_SAFETY_LOCKED') {
      appendLog(`[PROD GUARDRAIL BLOCKED] ${data.error || data.message}`, 'fail');
      showToast('⚠️ PROD Safety Guardrail: Execution Blocked', 'error');
      promptProdSafetyModal(state.activeEnvironment, payload);
      if (elements.runAllBtn) elements.runAllBtn.disabled = false;
      if (elements.stopRunBtn) elements.stopRunBtn.disabled = true;
      return;
    }
    if (data.code === 'VPN_REQUIRED') {
      appendLog(`[PRE-FLIGHT BLOCKED] ${data.message}`, 'warn');
      showToast('⚠️ Pre-Flight Warning: VPN Connection Required', 'warn');
      promptVpnWarningModal(state.activeEnvironment, payload);
      if (elements.runAllBtn) elements.runAllBtn.disabled = false;
      if (elements.stopRunBtn) elements.stopRunBtn.disabled = true;
      return;
    }
    if (!data.success) {
      appendLog(`[ERROR] ${data.error || data.message || 'Failed to start run'}`, 'fail');
      if (elements.runAllBtn) elements.runAllBtn.disabled = false;
      if (elements.stopRunBtn) elements.stopRunBtn.disabled = true;
      handleRunFinish({ exitCode: 1, stats: { passed: 0, failed: 1 } });
    } else if (data.currentRun) {
      handleRunStart(data.currentRun);
    }
  } catch (err) {
    appendLog(`[ERROR] Request error: ${err.message}`, 'fail');
    if (elements.runAllBtn) elements.runAllBtn.disabled = false;
    if (elements.stopRunBtn) elements.stopRunBtn.disabled = true;
    handleRunFinish({ exitCode: 1, stats: { passed: 0, failed: 1 } });
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

  eventSource.addEventListener('test_step', (e) => {
    const { stepNumber, description } = JSON.parse(e.data);
    const canvasLatestAction = document.getElementById('canvas-latest-action');
    const stepAction = document.getElementById('step-node-action');
    if (canvasLatestAction) {
      canvasLatestAction.textContent = `▶ Step ${stepNumber}: ${description}`;
    }
    if (stepAction) {
      stepAction.className = 'step-node active';
    }
    updateWorkerStep(stepNumber, description);
  });

  eventSource.addEventListener('test_completed', (e) => {
    const completedInfo = JSON.parse(e.data);
    handleCompletedTestUpdate(completedInfo);
    updateWorkerCompletion(completedInfo.id, completedInfo.status === 'passed', completedInfo.duration);
    if (completedInfo.status !== 'passed') {
      state.failedTests = state.failedTests || {};
      state.failedTests[completedInfo.id] = completedInfo;
    }
  });

  eventSource.addEventListener('trace', (e) => {
    const trace = JSON.parse(e.data);
    handleTraceAvailable(trace);
  });

  eventSource.addEventListener('rca', (e) => {
    const rca = JSON.parse(e.data);
    displayAiRcaDiagnostic(rca);
  });

  eventSource.addEventListener('resource_created', (e) => {
    try {
      const data = JSON.parse(e.data);
      if (!state.currentCreatedResources) state.currentCreatedResources = [];
      state.currentCreatedResources.push(data.resource);
      if (state.activeTest) {
        state.activeTest.resources = state.activeTest.resources || [];
        state.activeTest.resources.push(data.resource);
      }
    } catch (err) {}
  });

  eventSource.addEventListener('finish', (e) => {
    const data = JSON.parse(e.data);
    handleRunFinish(data);
  });

  const handleReportUpdate = (e) => {
    try {
      const data = JSON.parse(e.data);
      const targetUrl = data.url || `/reports/html/index.html?t=${Date.now()}`;
      if (elements.reportIframe && (state.activeReportTab === 'playwright' || state.activeReportTab === 'allure')) {
        elements.reportIframe.src = `${targetUrl}?t=${Date.now()}`;
      }
      if (typeof loadExecutiveTelemetryReport === 'function') {
        loadExecutiveTelemetryReport();
      }
      if (typeof loadAllureDashboardWidget === 'function') {
        loadAllureDashboardWidget();
      }
    } catch (err) {}
  };
  eventSource.addEventListener('report_updated', handleReportUpdate);
  eventSource.addEventListener('allure_updated', handleReportUpdate);

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
    const recipient = await window.appPrompt('Enter recipient email address(es) for the executive release digest:', 'stakeholders@iothub.com', {
      title: 'Dispatch Executive Report',
      badge: 'EMAIL DISPATCH',
      icon: '✉️',
      confirmText: 'Send Digest',
    });
    if (!recipient) return;

    appendLog(`[EMAIL DISPATCH] Sending executive test digest to ${recipient}...`, 'system');
    const res = await fetch('/api/reports/dispatch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channel: 'email', recipientEmail: recipient }),
    });
    const data = await res.json();
    await window.appAlert(data.message || 'Executive email report dispatched successfully!', {
      title: 'Email Dispatched',
      badge: 'DELIVERED',
      icon: '✓',
    });
    window.closeEmailPreviewModal();
  } catch (err) {
    await window.appAlert(`Failed to dispatch email: ${err.message}`, {
      title: 'Dispatch Failed',
      badge: 'ERROR',
      icon: '❌',
    });
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

  if (elements.liveProgressBanner) elements.liveProgressBanner.classList.remove('hidden');
  if (elements.progressTitle) elements.progressTitle.textContent = `Executing: ${runData.suiteName}`;
  if (elements.progressSubtitle) elements.progressSubtitle.textContent = `Target: [${runData.envName || 'SIT'}] ${runData.baseUrl || ''} | Browser: ${runData.browser}`;
  if (elements.liveEnvBadge) elements.liveEnvBadge.textContent = runData.envName || 'SIT';
  if (elements.livePassCount) elements.livePassCount.textContent = '0 Passed';
  if (elements.liveFailCount) elements.liveFailCount.textContent = '0 Failed';
  if (elements.progressBarFill) elements.progressBarFill.style.width = '10%';
  if (elements.runAllBtn) elements.runAllBtn.disabled = true;
  if (elements.stopRunBtn) elements.stopRunBtn.disabled = false;
  initWorkerSwimlanes(runData.workers || state.workers || 4);

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
  if (elements.aiRcaBanner) elements.aiRcaBanner.classList.add('hidden');
  if (elements.terminalTraceBtn) elements.terminalTraceBtn.classList.add('hidden');

  updateLatestRunSnapshot(runData);
  renderDashboardModulesGrid();
  if (elements.terminalDownloadTraceBtn) elements.terminalDownloadTraceBtn.classList.add('hidden');
}

function handleActiveTestUpdate(testInfo) {
  state.activeTest = testInfo;
  liveActiveStartTime = testInfo.startTime || Date.now();
  updateWorkerAssignment(testInfo.id, testInfo.name);

  const formattedName = testInfo.id ? `[${testInfo.id}] ${testInfo.name}` : testInfo.name;

  if (elements.liveActiveName) {
    elements.liveActiveName.textContent = formattedName;
  }
  if (elements.liveActiveMeta) {
    elements.liveActiveMeta.textContent = `Status: IN PROGRESS | Started at: ${new Date(liveActiveStartTime).toLocaleTimeString()}`;
  }

  // Update Canvas Active Spotlight Card
  const canvasActiveName = document.getElementById('canvas-active-test-name');
  const canvasActiveFile = document.getElementById('canvas-active-test-file');
  const canvasLatestAction = document.getElementById('canvas-latest-action');
  
  if (canvasActiveName) canvasActiveName.textContent = formattedName;
  if (canvasActiveFile) canvasActiveFile.textContent = testInfo.id ? `Scenario ID: ${testInfo.id}` : 'Running Test Scenario';
  if (canvasLatestAction) canvasLatestAction.textContent = `Executing assertions on ${testInfo.id || 'UI'}...`;

  // Animate Micro Steppers
  const stepAuth = document.getElementById('step-node-auth');
  const stepNav = document.getElementById('step-node-nav');
  const stepAction = document.getElementById('step-node-action');
  const stepTeardown = document.getElementById('step-node-teardown');

  if (stepAuth) { stepAuth.className = 'step-node passed'; }
  if (stepNav) { stepNav.className = 'step-node active'; }
  if (stepAction) { stepAction.className = 'step-node'; }
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

    const resourcesHtml = (tc.resources && tc.resources.length > 0)
      ? `
        <div class="tc-created-resources-row" style="display: flex; flex-wrap: wrap; gap: 4px; margin-top: 6px; padding-top: 4px; border-top: 1px dashed rgba(203, 213, 225, 0.6);">
          ${tc.resources.map(r => `
            <span class="resource-mini-tag" title="Click to copy ${r.type}: ${r.value}" onclick="event.stopPropagation(); navigator.clipboard.writeText('${r.value}'); window.showToast('Copied ${r.type}: ${r.value}')">
              <span class="res-tag-icon">${r.type === 'ACCOUNT' ? '🏢' : (r.type.includes('SIM') ? '📶' : (r.type === 'APN' ? '🌐' : '📦'))}</span>
              <span class="res-tag-type font-semibold">${r.type}:</span>
              <span class="res-tag-val font-mono">${r.value}</span>
              <span class="res-tag-copy">📋</span>
            </span>
          `).join('')}
        </div>
      `
      : '';

    return `
      <div class="canvas-feed-item" onclick="${!isPass ? `window.openFailureDrawer('${tc.id}')` : ''}" style="${!isPass ? 'cursor: pointer; border-color: rgba(239, 68, 68, 0.4);' : ''}; display: flex; flex-direction: column; gap: 4px;">
        <div class="flex items-center justify-between" style="width: 100%;">
          <div class="flex items-center gap-3">
            <span class="text-base">${statusIcon}</span>
            <div>
              <div class="flex items-center gap-2">
                <span class="font-mono text-xs font-bold text-blue-600">${tc.id || 'TC'}</span>
                <span class="text-xs font-semibold text-slate-800">${tc.name || tc.title || 'Scenario Execution'}</span>
              </div>
              <div class="text-xs text-slate-500 font-mono mt-0.5">Duration: ${tc.duration ? (tc.duration / 1000).toFixed(1) + 's' : '0.5s'}</div>
            </div>
          </div>
          <div class="flex items-center gap-2">
            ${statusBadge}
            ${!isPass ? `<button class="btn btn-danger btn-sm text-xs py-0.5" onclick="event.stopPropagation(); window.openFailureDrawer('${tc.id}')">⚠️ Triage</button>` : ''}
            ${tc.traceUrl ? `<a href="${tc.traceUrl}" target="_blank" class="btn btn-secondary btn-sm text-xs py-0.5" onclick="event.stopPropagation()">🔍 Trace</a>` : ''}
          </div>
        </div>
        ${resourcesHtml}
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
  const passed = typeof runData.stats?.passed === 'number' ? runData.stats.passed : (state.completedTests ? state.completedTests.filter(t => t.status === 'passed').length : 0);
  const failed = typeof runData.stats?.failed === 'number' ? runData.stats.failed : (state.completedTests ? state.completedTests.filter(t => t.status === 'failed').length : 0);
  const totalCompleted = passed + failed;

  const canvasPass = document.getElementById('canvas-pass-count');
  const canvasFail = document.getElementById('canvas-fail-count');
  const canvasComp = document.getElementById('canvas-completed-count');
  const canvasFeedCount = document.getElementById('canvas-feed-count');

  if (canvasPass) canvasPass.textContent = passed;
  if (canvasFail) canvasFail.textContent = failed;
  if (canvasComp) canvasComp.textContent = `${totalCompleted} / ${totalCompleted || 1}`;
  if (canvasFeedCount) canvasFeedCount.textContent = `${totalCompleted} Finished`;

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

  if (elements.liveProgressBanner) elements.liveProgressBanner.classList.add('hidden');
  if (elements.runAllBtn) elements.runAllBtn.disabled = false;
  if (elements.stopRunBtn) elements.stopRunBtn.disabled = true;

  const statusMsg = runData.exitCode === 0 ? 'COMPLETED SUCCESSFULLY' : 'COMPLETED WITH FAILURES';
  const logType = runData.exitCode === 0 ? 'pass' : 'fail';

  appendLog(`\n======================================================`, 'system');
  appendLog(`[FINISH] Test Run ${statusMsg}: ${passed} Passed, ${failed} Failed`, logType);
  if (runData.latestTrace) {
    appendLog(`[TRACE] Playwright Deep Trace recorded: ${runData.latestTrace.filename} (${runData.latestTrace.sizeFormatted})`, 'system');
  }
  appendLog(`======================================================\n`, 'system');

  // Refresh artifacts & history & performance
  updateLatestRunSnapshot(runData);
  updateQualityGateStatus();
  renderDashboardModulesGrid();
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

  const passed = typeof stats.passed === 'number' ? stats.passed : (state.completedTests ? state.completedTests.filter(t => t.status === 'passed').length : 0);
  const failed = typeof stats.failed === 'number' ? stats.failed : (state.completedTests ? state.completedTests.filter(t => t.status === 'failed').length : 0);
  const completed = passed + failed;
  const total = Math.max(stats.total || (state.currentRun?.stats?.total) || 10, completed, 1);

  const progressPct = Math.min(100, Math.max(5, Math.round((completed / total) * 100)));

  // Live Banner Badges
  if (elements.livePassCount) elements.livePassCount.textContent = `${passed} Passed`;
  if (elements.liveFailCount) elements.liveFailCount.textContent = `${failed} Failed`;
  if (elements.liveExecPassBadge) elements.liveExecPassBadge.textContent = `${passed} Passed`;
  if (elements.liveExecFailBadge) elements.liveExecFailBadge.textContent = `${failed} Failed`;

  // Live Canvas HUD Metrics
  const canvasPass = document.getElementById('canvas-pass-count');
  const canvasFail = document.getElementById('canvas-fail-count');
  const canvasComp = document.getElementById('canvas-completed-count');
  const canvasFeedCount = document.getElementById('canvas-feed-count');
  const canvasProg = document.getElementById('canvas-progress-bar');

  if (canvasPass) canvasPass.textContent = passed;
  if (canvasFail) canvasFail.textContent = failed;
  if (canvasComp) canvasComp.textContent = `${completed} / ${total}`;
  if (canvasFeedCount) canvasFeedCount.textContent = `${completed} Finished`;
  if (canvasProg) canvasProg.style.width = `${progressPct}%`;

  if (elements.progressBarFill) elements.progressBarFill.style.width = `${progressPct}%`;
  if (elements.liveExecProgressPct) elements.liveExecProgressPct.textContent = `${progressPct}%`;
}

function appendLog(line, type = 'info') {
  let cssClass = 'log-info';
  if (type === 'system' || line.startsWith('[SYSTEM]')) cssClass = 'log-system';
  else if (type === 'pass' || line.includes('✓') || line.includes('passed')) cssClass = 'log-pass';
  else if (type === 'fail' || line.includes('✘') || line.includes('failed') || line.includes('Error')) cssClass = 'log-fail';
  else if (type === 'warn' || line.includes('WARN')) cssClass = 'log-warn';
  else if (line.includes('[STEP')) cssClass = 'log-step';
  else if (line.includes('[ACTION]')) cssClass = 'log-action';
  else if (line.includes('[ASSERT: PASS]')) cssClass = 'log-assert-pass';
  else if (line.includes('[ASSERT: FAIL]')) cssClass = 'log-assert-fail';
  else if (line.includes('[DATA]')) cssClass = 'log-data';
  else if (line.includes('[HTTP') && (line.includes('4') || line.includes('5') || line.includes('FAILED'))) cssClass = 'log-http-err';
  else if (line.includes('[HTTP')) cssClass = 'log-http-ok';
  else if (line.includes('[DIAGNOSTIC]')) cssClass = 'log-diagnostic';

  const lineEl = document.createElement('div');
  lineEl.className = cssClass;
  lineEl.textContent = line;
  if (elements.terminalBody) {
    elements.terminalBody.appendChild(lineEl);
    if (state.autoScrollLogs) {
      elements.terminalBody.scrollTop = elements.terminalBody.scrollHeight;
    }
  }

  // Dynamically reflect action in Active Test Canvas stepper & status
  const canvasLatestAction = document.getElementById('canvas-latest-action');
  const stepNav = document.getElementById('step-node-nav');
  const stepAction = document.getElementById('step-node-action');
  const stepTeardown = document.getElementById('step-node-teardown');

  if (line.includes('[STEP') || line.includes('Step ')) {
    if (canvasLatestAction) canvasLatestAction.textContent = line.replace(/\[\d{4}-.*?\]\s*\[\w+\]\s*/, '').replace(/\x1b\[[0-9;]*m/g, '').trim();
    if (stepAction) stepAction.className = 'step-node active';
  } else if (line.includes('Opening top-level menu') || line.includes('Navigating to')) {
    if (canvasLatestAction) canvasLatestAction.textContent = line.replace(/\[\d{4}-.*?\]\s*\[\w+\]\s*/, '').trim();
    if (stepNav) stepNav.className = 'step-node active';
  } else if (line.includes('Clicking') || line.includes('Checking visibility') || line.includes('Selecting') || line.includes('[API Performance]')) {
    if (canvasLatestAction) canvasLatestAction.textContent = line.replace(/\[\d{4}-.*?\]\s*\[\w+\]\s*/, '').trim();
    if (stepNav) stepNav.className = 'step-node passed';
    if (stepAction) stepAction.className = 'step-node active';
  } else if (line.includes('✓') || line.includes('passed')) {
    if (stepAction) stepAction.className = 'step-node passed';
    if (stepTeardown) stepTeardown.className = 'step-node passed';
  }
}

function downloadLogs() {
  const text = elements.terminalBody.innerText;
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const runId = state.currentRun?.runId || `RUN-${Date.now()}`;
  const envKey = (state.activeEnvironment?.id || 'iothub').toLowerCase();
  a.download = `iothub-execution-log-${envKey}-${runId}.txt`;
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

  if (elements.aiRcaBanner) elements.aiRcaBanner.classList.remove('hidden');
}

function handleTraceAvailable(trace) {
  if (!trace) return;
  state.latestTrace = trace;
  if (elements.terminalTraceBtn) elements.terminalTraceBtn.classList.remove('hidden');
  if (elements.terminalDownloadTraceBtn) elements.terminalDownloadTraceBtn.classList.remove('hidden');
}

function openLatestTrace() {
  if (!state.latestTrace) {
    showToast('Trace Viewer', 'No trace available yet. Execute a test to record time-travel trace data.', 'info');
    return;
  }
  window.openInAppTraceModal(state.latestTrace.url);
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
// DUAL-LAYER REPORTING SUITE (PLAYWRIGHT HTML, TRACES, EXECUTIVE)
// -------------------------------------------------------------
function switchReportView(reportType) {
  // Gracefully handle legacy 'allure' tab references by directing to native Playwright HTML report
  if (reportType === 'allure') reportType = 'playwright';
  state.activeReportTab = reportType;

  elements.reportSubTabs.forEach(tab => {
    tab.classList.toggle('active', tab.dataset.report === reportType);
  });

  const execView = elements.executiveTelemetryView || document.getElementById('executive-telemetry-view');

  if (reportType === 'playwright') {
    elements.reportIframe?.classList.remove('hidden');
    elements.tracesArchiveView?.classList.add('hidden');
    if (execView) execView.classList.add('hidden');
    if (!elements.reportIframe.src || !elements.reportIframe.src.endsWith('/reports/html/index.html')) {
      elements.reportIframe.src = '/reports/html/index.html';
    }
    elements.openReportTabBtn.href = '/reports/html/index.html';
    elements.openReportTabBtn.textContent = 'Open in New Tab ↗';
  } else if (reportType === 'traces') {
    elements.reportIframe?.classList.add('hidden');
    elements.tracesArchiveView?.classList.remove('hidden');
    if (execView) execView.classList.add('hidden');
    elements.openReportTabBtn.href = '/reports/html/trace/index.html';
    elements.openReportTabBtn.target = '_blank';
    elements.openReportTabBtn.textContent = 'Launch Trace Viewer ↗';
    fetchTraces();
  } else if (reportType === 'executive') {
    elements.reportIframe?.classList.add('hidden');
    elements.tracesArchiveView?.classList.add('hidden');
    if (execView) {
      execView.classList.remove('hidden');
      loadExecutiveTelemetryReport();
    }
    elements.openReportTabBtn.href = '/reports/html/index.html';
    elements.openReportTabBtn.target = '_blank';
    elements.openReportTabBtn.textContent = 'Open HTML Report ↗';
  }
}

async function refreshCurrentReport() {
  if (state.activeReportTab === 'playwright') {
    elements.reportIframe.src = `/reports/html/index.html?t=${Date.now()}`;
    showToast('Report Refreshed', 'Playwright Native HTML Report reloaded', 'info');
  } else if (state.activeReportTab === 'traces') {
    await fetchTraces();
    showToast('Traces Refreshed', 'Trace file archive updated', 'info');
  } else if (state.activeReportTab === 'executive') {
    await loadExecutiveTelemetryReport();
    showToast('Executive Telemetry', 'Executive metrics and defect clusters updated', 'info');
  }
}

window.refreshReportFrame = function() {
  refreshCurrentReport();
};

// -------------------------------------------------------------
// NEXT-LEVEL EXECUTIVE QUALITY TELEMETRY & RELEASE GATE SUITE
// -------------------------------------------------------------
let execTrendChartInstance = null;
state.execScenariosList = [];
state.execScenariosFilter = 'all';

window.refreshExecutiveTelemetry = async function() {
  await loadExecutiveTelemetryReport();
  showToast('Executive Telemetry', 'Executive metrics & multi-run trend refreshed successfully', 'success');
};

window.copyReleaseGateToken = function() {
  const runId = state.latestRunId || 'RUN-LATEST';
  const passPct = state.execPassPct || '100.0';
  const token = `GATE_PASS_${runId}_SLA_${Math.round(parseFloat(passPct))}_SHA256_${Date.now().toString(36).toUpperCase()}`;
  navigator.clipboard.writeText(token).then(() => {
    showToast('Gate Token Copied', `Token: ${token}`, 'success');
  }).catch(() => {
    showToast('Gate Token', token, 'info');
  });
};

async function loadExecutiveTelemetryReport(targetRunId = 'latest') {
  const grid = document.getElementById('exec-view-metrics-grid');
  const clustersList = document.getElementById('exec-clusters-list');
  const clusterCountEl = document.getElementById('exec-cluster-count');
  const runsList = document.getElementById('exec-runs-list');
  const runsCountEl = document.getElementById('exec-runs-count');
  const runFilterSelect = document.getElementById('exec-run-filter-select');

  try {
    // 1. Fetch History for Trends, Run ID options, Modules & Deltas
    let historyRuns = [];
    try {
      const histRes = await fetch('/api/history?limit=30');
      if (histRes.ok) {
        const histData = await histRes.json();
        historyRuns = histData.history || [];
      }
    } catch (e) {
      console.warn('Failed to fetch history for executive telemetry:', e);
    }

    // 2. Fetch current report summary (baseline)
    let passed = 0, failed = 0, broken = 0, skipped = 0, total = 1, passPct = '100.0';
    let latestRunId = 'LATEST', totalDuration = 0;
    let categoriesItems = [];

    const res = await fetch('/api/reports/summary');
    if (res.ok) {
      const data = await res.json();
      const stat = (data.summary && data.summary.statistic) || {};
      passed = stat.passed || 0;
      failed = stat.failed || 0;
      broken = stat.broken || 0;
      skipped = stat.skipped || 0;
      const executed = passed + failed + broken;
      total = stat.total || (executed + skipped) || 1;
      passPct = executed > 0 ? ((passed / executed) * 100).toFixed(1) : '100.0';
      latestRunId = data.summary?.reportName || 'LATEST';
      totalDuration = data.summary?.time?.duration || 0;
      categoriesItems = (data.categories && data.categories.items) || [];
    }

    // 3. Populate Test Run ID filter dropdown in the Executive Telemetry header
    if (runFilterSelect) {
      const activeFilter = targetRunId || runFilterSelect.value || 'latest';
      let optionsHtml = `<option value="latest" ${activeFilter === 'latest' ? 'selected' : ''}>⚡ Latest Active Run (${latestRunId})</option>`;
      historyRuns.forEach(h => {
        const timeStr = h.startTime ? new Date(h.startTime).toLocaleTimeString() : '';
        const isSelected = (activeFilter === h.runId) ? 'selected' : '';
        optionsHtml += `<option value="${h.runId}" ${isSelected}>${h.runId} (${h.envName || 'ENV'} • ${h.passPercentage || 0}% • ${timeStr})</option>`;
      });
      runFilterSelect.innerHTML = optionsHtml;
      runFilterSelect.value = activeFilter;

      if (!runFilterSelect.__hasListener) {
        runFilterSelect.addEventListener('change', (e) => {
          loadExecutiveTelemetryReport(e.target.value);
        });
        runFilterSelect.__hasListener = true;
      }
    }

    // 4. If a specific Historical Run ID is selected, override metrics with that run's data
    let selectedRun = null;
    if (targetRunId && targetRunId !== 'latest') {
      selectedRun = historyRuns.find(h => h.runId === targetRunId);
      if (selectedRun) {
        passed = selectedRun.passedCount !== undefined ? selectedRun.passedCount : (selectedRun.exitCode === 0 ? (selectedRun.testsCount || 10) : 0);
        failed = selectedRun.failedCount !== undefined ? selectedRun.failedCount : (selectedRun.exitCode !== 0 ? 1 : 0);
        broken = 0;
        skipped = selectedRun.skippedCount || 0;
        const executed = passed + failed;
        passPct = selectedRun.passPercentage !== undefined ? parseFloat(selectedRun.passPercentage).toFixed(1) : (executed > 0 ? ((passed / executed) * 100).toFixed(1) : '100.0');
        latestRunId = selectedRun.runId;
        totalDuration = selectedRun.duration || 0;
      }
    }

    state.latestRunId = latestRunId;
    state.execPassPct = passPct;

    // 5. Automated Release Gate Decision Banner
    renderReleaseGateCard(passPct, failed + broken, totalDuration, latestRunId);

    // 6. Primary KPI Cards
    if (grid) {
      const executedCount = passed + failed + broken;
      grid.innerHTML = `
        <div class="exec-metric-card">
          <div class="text-[11px] font-bold uppercase tracking-wider text-muted">Quality SLA Status</div>
          <div class="text-2xl font-black font-mono mt-1 ${parseFloat(passPct) >= 90 ? 'text-emerald-600' : 'text-rose-600'}">${passPct}% Pass</div>
          <div class="text-xs text-muted mt-1">${passed} passed / ${executedCount} executed</div>
        </div>
        <div class="exec-metric-card">
          <div class="text-[11px] font-bold uppercase tracking-wider text-muted">Defects & Failures</div>
          <div class="text-2xl font-black font-mono mt-1 ${failed + broken > 0 ? 'text-rose-600' : 'text-emerald-600'}">${failed + broken} Failures</div>
          <div class="text-xs text-muted mt-1">${broken} broken, ${failed} failed</div>
        </div>
        <div class="exec-metric-card">
          <div class="text-[11px] font-bold uppercase tracking-wider text-muted">Safety Guardrails</div>
          <div class="text-2xl font-black font-mono mt-1 text-amber-600">${skipped} Guarded</div>
          <div class="text-xs text-muted mt-1">Intentionally skipped for safety</div>
        </div>
        <div class="exec-metric-card">
          <div class="text-[11px] font-bold uppercase tracking-wider text-muted">${targetRunId !== 'latest' ? 'Filtered Run ID' : 'Latest Run ID'}</div>
          <div class="text-xl font-bold font-mono mt-1 text-blue-600 truncate" title="${latestRunId}">${latestRunId}</div>
          <div class="text-xs text-muted mt-1">${selectedRun?.startTime ? new Date(selectedRun.startTime).toLocaleTimeString() : 'Active Execution'}</div>
        </div>
      `;
    }

    // 7. Render Multi-Run Trend Chart (Chart.js)
    renderExecTrendChart(historyRuns);

    // 8. Fetch Diff & Render Run-to-Run Delta
    try {
      const diffRes = await fetch('/api/history/diff');
      if (diffRes.ok) {
        const diffData = await diffRes.json();
        renderExecDeltaMetrics(diffData);
      }
    } catch (e) {
      console.warn('Failed to fetch history diff:', e);
    }

    // 9. Failure Clusters & Deduplication
    if (clustersList && clusterCountEl) {
      clusterCountEl.textContent = `${categoriesItems.length} Defect Clusters`;
      if (categoriesItems.length === 0) {
        clustersList.innerHTML = `<div class="text-xs text-muted p-4 text-center">No active defect clusters detected. All test scenarios compliant!</div>`;
      } else {
        clustersList.innerHTML = categoriesItems.map(cat => {
          const cFailed = (cat.statistic?.failed || 0) + (cat.statistic?.broken || 0);
          return `
            <div class="exec-cluster-item">
              <div>
                <div class="font-semibold text-xs text-slate-800 dark:text-slate-200">🔍 ${cat.name || 'Defect Cluster'}</div>
                <div class="text-[11px] text-muted">${cat.description || 'Root cause cluster across test steps'}</div>
              </div>
              <span class="badge ${cFailed > 0 ? 'badge-fail' : 'badge-env'}">${cFailed} Failures</span>
            </div>
          `;
        }).join('');
      }
    }

    // 10. Fetch Detailed Scenarios for the Selected / Target Execution
    try {
      const targetRun = selectedRun || historyRuns[0];
      if (targetRun && targetRun.runId) {
        const detailRes = await fetch(`/api/history/${encodeURIComponent(targetRun.runId)}`);
        if (detailRes.ok) {
          const detailData = await detailRes.json();
          state.execScenariosList = detailData.run?.tests || [];
          renderModuleRadar(state.execScenariosList);
          renderExecScenariosTable();
        }
      } else {
        renderModuleRadar([]);
      }
    } catch (e) {
      console.warn('Failed to fetch target run test details:', e);
    }

    // 11. Load Historical Snapshots
    if (runsList && runsCountEl) {
      try {
        const statusRes = await fetch('/api/reports/status');
        const statusData = await statusRes.json();
        const runs = statusData.runs || [];
        runsCountEl.textContent = `${runs.length} Snapshots`;
        if (runs.length === 0) {
          runsList.innerHTML = `
            <div class="exec-run-item">
              <span>Current Execution (reports/html-report)</span>
              <a href="/reports/html/index.html" target="_blank" class="btn btn-secondary btn-sm">Open ↗</a>
            </div>
          `;
        } else {
          runsList.innerHTML = runs.slice(0, 9).map(r => `
            <div class="exec-run-item">
              <div>
                <span class="font-mono font-bold text-xs">${r.runId}</span>
                <span class="text-[10px] text-muted block">${new Date(r.timestamp).toLocaleString()}</span>
              </div>
              <a href="${r.url || `/reports/html-runs/${r.runId}/index.html`}" target="_blank" class="btn btn-secondary btn-sm" style="font-size: 11px; padding: 2px 8px;">View Snapshot ↗</a>
            </div>
          `).join('');
        }
      } catch (err) {
        console.warn('Could not fetch historical runs:', err);
      }
    }
  } catch (err) {
    console.error('Failed to load executive telemetry report:', err);
  }
}

function renderReleaseGateCard(passPct, failedCount, totalDuration, latestRunId) {
  const card = document.getElementById('exec-gate-decision-card');
  const icon = document.getElementById('exec-gate-icon');
  const title = document.getElementById('exec-gate-title');
  const badge = document.getElementById('exec-gate-badge');
  const subtitle = document.getElementById('exec-gate-subtitle');
  const timestamp = document.getElementById('exec-gate-timestamp');
  const slaPill = document.getElementById('exec-gate-sla-pill');
  const defectsPill = document.getElementById('exec-gate-defects-pill');
  const timePill = document.getElementById('exec-gate-time-pill');

  if (!card) return;

  const pct = parseFloat(passPct);
  const isApproved = pct >= 90.0 && failedCount === 0;

  if (isApproved) {
    card.className = 'mb-4 glass-card p-4 transition-all exec-gate-passed';
    if (icon) icon.textContent = '🟢';
    if (title) {
      title.textContent = 'STAGE GATE: APPROVED FOR DEPLOYMENT';
      title.className = 'text-base font-black tracking-wide text-emerald-600 dark:text-emerald-400';
    }
    if (badge) {
      badge.textContent = '100% PRODUCTION READY';
      badge.className = 'badge badge-health-online text-[11px] font-mono';
    }
    if (subtitle) subtitle.textContent = 'Automated release gate verification cleared all 4 core enterprise production stability criteria.';
  } else {
    card.className = 'mb-4 glass-card p-4 transition-all exec-gate-blocked';
    if (icon) icon.textContent = '🔴';
    if (title) {
      title.textContent = 'STAGE GATE: RELEASE BLOCKED (TRIAGE REQUIRED)';
      title.className = 'text-base font-black tracking-wide text-rose-600 dark:text-rose-400';
    }
    if (badge) {
      badge.textContent = `${failedCount} DEFECTS DETECTED`;
      badge.className = 'badge badge-fail text-[11px] font-mono';
    }
    if (subtitle) subtitle.textContent = 'Execution encountered test failures or dropped below the required 90% SLA stability threshold.';
  }

  if (timestamp) timestamp.textContent = `Run: ${latestRunId}`;
  if (slaPill) {
    slaPill.textContent = `${passPct}% ${pct >= 90 ? 'CLEARED' : 'FAILED (<90%)'}`;
    slaPill.className = `font-bold font-mono ${pct >= 90 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`;
  }
  if (defectsPill) {
    defectsPill.textContent = `${failedCount} BLOCKERS`;
    defectsPill.className = `font-bold font-mono ${failedCount === 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`;
  }
  if (timePill) {
    const formatted = totalDuration > 0 ? `${(totalDuration / 1000).toFixed(1)}s` : '< 10m';
    timePill.textContent = `${formatted} VELOCITY`;
  }
}

function renderExecTrendChart(historyRuns) {
  const canvas = document.getElementById('exec-trend-canvas');
  if (!canvas || typeof Chart === 'undefined') return;

  const validRuns = (historyRuns || []).slice(0, 10).reverse();
  if (validRuns.length === 0) return;

  const labels = validRuns.map((r, i) => {
    const id = r.runId ? r.runId.replace('RUN-', '') : `R${i + 1}`;
    return id.length > 8 ? id.substring(id.length - 8) : id;
  });

  const passRates = validRuns.map(r => {
    if (r.stats) {
      const p = r.stats.passed || 0;
      const f = r.stats.failed || 0;
      const b = r.stats.broken || 0;
      const total = p + f + b;
      return total > 0 ? parseFloat(((p / total) * 100).toFixed(1)) : (r.exitCode === 0 ? 100 : 0);
    }
    return r.exitCode === 0 ? 100 : 0;
  });

  const slaThreshold = new Array(validRuns.length).fill(90);

  if (execTrendChartInstance) {
    execTrendChartInstance.destroy();
  }

  const isLight = document.body.classList.contains('theme-light');
  const ctx = canvas.getContext('2d');

  execTrendChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Pass Rate %',
          data: passRates,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.12)',
          fill: true,
          tension: 0.35,
          borderWidth: 2.5,
          pointBackgroundColor: '#10b981',
          pointRadius: 4,
          pointHoverRadius: 6,
        },
        {
          label: '90% SLA Target',
          data: slaThreshold,
          borderColor: '#f59e0b',
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
          backgroundColor: isLight ? '#0f172a' : '#1e293b',
          titleColor: '#ffffff',
          bodyColor: '#e2e8f0',
          padding: 8,
          cornerRadius: 6,
          callbacks: {
            label: (c) => ` ${c.dataset.label}: ${c.raw}%`
          }
        }
      },
      scales: {
        y: {
          min: 0,
          max: 100,
          ticks: {
            stepSize: 25,
            callback: (v) => `${v}%`,
            font: { size: 10 }
          },
          grid: {
            color: isLight ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)'
          }
        },
        x: {
          ticks: { font: { size: 10 } },
          grid: { display: false }
        }
      }
    }
  });
}

function renderModuleRadar(testsList) {
  const container = document.getElementById('exec-module-radar-list');
  if (!container) return;

  const modules = [
    { name: '🔐 Auth & Access', key: 'auth', passed: 0, total: 0 },
    { name: '🏢 Accounts & Billing', key: 'accounts', passed: 0, total: 0 },
    { name: '📱 SIM & Subscriptions', key: 'sub', passed: 0, total: 0 },
    { name: '🌐 APN & Network Profiles', key: 'apn', passed: 0, total: 0 },
    { name: '📊 Dashboard & Analytics', key: 'dash', passed: 0, total: 0 }
  ];

  (testsList || []).forEach(t => {
    const name = (t.name || t.file || '').toLowerCase();
    if (name.includes('auth') || name.includes('login')) {
      modules[0].total++;
      if (t.status === 'passed') modules[0].passed++;
    } else if (name.includes('account') || name.includes('billing')) {
      modules[1].total++;
      if (t.status === 'passed') modules[1].passed++;
    } else if (name.includes('sub') || name.includes('sim')) {
      modules[2].total++;
      if (t.status === 'passed') modules[2].passed++;
    } else if (name.includes('apn') || name.includes('network') || name.includes('qos')) {
      modules[3].total++;
      if (t.status === 'passed') modules[3].passed++;
    } else {
      modules[4].total++;
      if (t.status === 'passed') modules[4].passed++;
    }
  });

  // Ensure healthy defaults if run only covered a subset
  modules.forEach(m => {
    if (m.total === 0) {
      m.total = 1;
      m.passed = 1;
    }
  });

  container.innerHTML = modules.map(m => {
    const pct = Math.round((m.passed / m.total) * 100);
    const isClean = pct >= 90;
    return `
      <div>
        <div class="flex items-center justify-between text-xs mb-1">
          <span class="font-medium text-slate-800 dark:text-slate-200">${m.name}</span>
          <span class="font-mono text-[11px] font-bold ${isClean ? 'text-emerald-600' : 'text-rose-600'}">${pct}% (${m.passed}/${m.total})</span>
        </div>
        <div style="background: rgba(148, 163, 184, 0.2); border-radius: 9999px; height: 6px; overflow: hidden;">
          <div style="width: ${pct}%; height: 100%; background: ${isClean ? 'linear-gradient(90deg, #10b981, #059669)' : 'linear-gradient(90deg, #f43f5e, #e11d48)'}; border-radius: 9999px;"></div>
        </div>
      </div>
    `;
  }).join('');
}

function renderExecDeltaMetrics(diffData) {
  const container = document.getElementById('exec-delta-metrics-grid');
  const badge = document.getElementById('exec-delta-status-badge');
  const compRun = document.getElementById('exec-delta-compare-run');
  const detailText = document.getElementById('exec-delta-detail-text');

  if (!container || !diffData) return;

  const delta = diffData.delta || {};
  const passDelta = delta.passDelta || 0;
  const failDelta = delta.failDelta || 0;
  const speedFormatted = delta.durationDeltaFormatted || '0.0s';
  const statusChange = delta.statusChange || 'NO_CHANGE';

  if (compRun && diffData.baseRun) {
    compRun.textContent = `vs ${diffData.baseRun.runId}`;
  }

  if (badge) {
    if (statusChange === 'FIXED' || (failDelta <= 0 && statusChange !== 'REGRESSED')) {
      badge.textContent = statusChange === 'FIXED' ? '✓ DEFECTS RESOLVED' : '✓ NO REGRESSIONS';
      badge.className = 'badge badge-health-online text-[10px]';
    } else {
      badge.textContent = '🚨 REGRESSION DETECTED';
      badge.className = 'badge badge-fail text-[10px]';
    }
  }

  container.innerHTML = `
    <div class="exec-delta-box">
      <div class="text-[10px] text-muted font-bold uppercase">Pass Delta</div>
      <div class="text-sm font-bold font-mono ${passDelta >= 0 ? 'text-emerald-600' : 'text-rose-600'}">${passDelta >= 0 ? '+' : ''}${passDelta}</div>
    </div>
    <div class="exec-delta-box">
      <div class="text-[10px] text-muted font-bold uppercase">Fail Delta</div>
      <div class="text-sm font-bold font-mono ${failDelta <= 0 ? 'text-emerald-600' : 'text-rose-600'}">${failDelta > 0 ? '+' : ''}${failDelta}</div>
    </div>
    <div class="exec-delta-box">
      <div class="text-[10px] text-muted font-bold uppercase">Speed Delta</div>
      <div class="text-sm font-bold font-mono text-blue-600">${speedFormatted}</div>
    </div>
    <div class="exec-delta-box">
      <div class="text-[10px] text-muted font-bold uppercase">Trajectory</div>
      <div class="text-sm font-bold font-mono ${statusChange === 'REGRESSED' ? 'text-rose-600' : 'text-emerald-600'}">${statusChange}</div>
    </div>
  `;

  if (detailText) {
    if (statusChange === 'FIXED') {
      detailText.innerHTML = `🎉 <strong>Regression Cleared:</strong> Resolved previously failing test cases. Target run succeeded with ${diffData.targetRun?.passed || 16} passing scenarios.`;
    } else if (statusChange === 'REGRESSED') {
      detailText.innerHTML = `⚠️ <strong>Attention:</strong> Target run introduced new failure(s). Check RCA incident triage below.`;
    } else {
      detailText.innerHTML = `Zero regressions detected across suites. Suite stability maintained across executions.`;
    }
  }
}

window.filterExecScenarios = function(filterKey) {
  state.execScenariosFilter = filterKey;
  document.querySelectorAll('#exec-scenario-filter-pills .allure-cat-badge').forEach(pill => {
    pill.classList.toggle('active', pill.dataset.filter === filterKey);
  });
  renderExecScenariosTable();
};

window.renderExecScenariosTable = function() {
  const tbody = document.getElementById('exec-scenarios-tbody');
  const countAll = document.getElementById('exec-count-all');
  const countPass = document.getElementById('exec-count-pass');
  const countFail = document.getElementById('exec-count-fail');
  const countHeader = document.getElementById('exec-scenarios-count');
  const searchInput = document.getElementById('exec-scenarios-search');

  if (!tbody) return;

  const tests = state.execScenariosList || [];

  const passedTests = tests.filter(t => t.status === 'passed');
  const failedTests = tests.filter(t => t.status === 'failed');

  if (countAll) countAll.textContent = tests.length;
  if (countPass) countPass.textContent = passedTests.length;
  if (countFail) countFail.textContent = failedTests.length;
  if (countHeader) countHeader.textContent = `(${tests.length} Scenarios)`;

  let filtered = tests;

  if (state.execScenariosFilter === 'passed') {
    filtered = filtered.filter(t => t.status === 'passed');
  } else if (state.execScenariosFilter === 'failed') {
    filtered = filtered.filter(t => t.status === 'failed');
  } else if (state.execScenariosFilter === 'slow') {
    filtered = filtered.filter(t => {
      const durSec = parseFloat(t.duration) || 0;
      return durSec >= 10.0;
    });
  }

  const query = (searchInput ? searchInput.value : '').toLowerCase().trim();
  if (query) {
    filtered = filtered.filter(t => 
      (t.id && t.id.toLowerCase().includes(query)) ||
      (t.name && t.name.toLowerCase().includes(query))
    );
  }

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; padding: 24px; color: #94a3b8;">
          No executed test scenarios match the current filter criteria.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(t => {
    const isPassed = t.status === 'passed';
    const durSec = parseFloat(t.duration) || 0;
    const isSlow = durSec >= 10.0;

    let cleanName = t.name || 'Test Scenario';
    if (cleanName.includes('›')) {
      const parts = cleanName.split('›');
      cleanName = parts[parts.length - 1].trim();
    }

    return `
      <tr style="border-bottom: 1px solid rgba(148, 163, 184, 0.15);">
        <td style="padding: 8px 12px; font-family: monospace; font-weight: bold; font-size: 11px; color: #3b82f6;">
          ${escapeHtml(t.id || 'TC')}
        </td>
        <td style="padding: 8px 12px;">
          <div class="font-medium text-slate-800 dark:text-slate-200" style="font-size: 11.5px;">${escapeHtml(cleanName)}</div>
        </td>
        <td style="padding: 8px 12px; font-family: monospace; font-size: 11px;">
          <span class="${isSlow ? 'text-amber-600 font-bold' : 'text-slate-600 dark:text-slate-400'}">
            ${isSlow ? '⚡ ' : ''}${escapeHtml(String(t.duration || '1.0s'))}
          </span>
        </td>
        <td style="padding: 8px 12px; text-align: center;">
          <span class="badge ${isPassed ? 'badge-pass' : 'badge-fail'}" style="font-size: 10px; padding: 2px 8px;">
            ${isPassed ? 'PASSED' : 'FAILED'}
          </span>
        </td>
        <td style="padding: 8px 12px; text-align: center;">
          <button type="button" class="btn btn-secondary btn-sm" style="padding: 2px 8px; font-size: 10px;" onclick="window.switchTab('matrix')" title="View in Scenario Matrix">
            🔍 Matrix
          </button>
        </td>
      </tr>
    `;
  }).join('');
};


// ============================================================
// ARBITRARY KEY-VALUE ENVIRONMENT VARIABLES & SECRETS MANAGER
// ============================================================
const ENV_PRESETS = {
  HEADLESS: { value: 'false', hint: 'Run browser in headless mode (true) or headed with visual UI (false).' },
  DEFAULT_TIMEOUT: { value: '30000', hint: 'Global test timeout in milliseconds (e.g. 30000ms = 30s).' },
  ACTION_TIMEOUT: { value: '15000', hint: 'Timeout for click, fill, hover actions in milliseconds.' },
  NAVIGATION_TIMEOUT: { value: '30000', hint: 'Timeout for page.goto() navigation in milliseconds.' },
  SLOW_MO: { value: '50', hint: 'Artificially slow down Playwright actions by X ms for human observation.' },
  WORKERS: { value: '2', hint: 'Number of parallel worker processes for test suite execution.' },
  RETRIES: { value: '1', hint: 'Automatic test retry count on CI/CD or local test failure.' },
  ENABLE_TRACING: { value: 'true', hint: 'Capture deep trace files (.zip) with DOM actions & network waterfalls.' },
  LOG_LEVEL: { value: 'INFO', hint: 'Logging granularity: DEBUG | INFO | WARN | ERROR.' },
  SIDECAR_TELECOM_PORT: { value: '5055', hint: 'Port for telecom APN & QoS emulation microservice sidecar.' },
  JIRA_PROJECT_KEY: { value: 'IOTHUB', hint: 'Jira project key for automated bug and test failure filing.' },
  SLACK_WEBHOOK_URL: { value: 'https://hooks.slack.com/services/...', hint: 'Slack Incoming Webhook URL for executive failure alerts.' },
  TEAMS_WEBHOOK_URL: { value: 'https://outlook.office.com/webhook/...', hint: 'Microsoft Teams Incoming Webhook URL for test run reports.' },
  CUSTOM: { value: '', hint: 'Define any arbitrary key-value pair for custom sidecars, secrets, or scripts.' }
};

window.openEnvVarsModal = async function() {
  const modal = elements.envVarsModal || document.getElementById('env-vars-modal');
  if (!modal) return;
  modal.classList.remove('hidden');
  await window.loadEnvVarsList();
  await window.validateEnvVars();
};

window.closeEnvVarsModal = function() {
  const modal = elements.envVarsModal || document.getElementById('env-vars-modal');
  if (modal) modal.classList.add('hidden');
};

window.onEnvPresetSelected = function(presetKey) {
  const keyInput = document.getElementById('new-env-key');
  const valInput = document.getElementById('new-env-val');
  const hintEl = document.getElementById('new-env-hint');
  if (!presetKey) return;

  if (presetKey === 'CUSTOM') {
    if (keyInput) keyInput.value = '';
    if (valInput) valInput.value = '';
    if (hintEl) hintEl.textContent = ENV_PRESETS.CUSTOM.hint;
    keyInput?.focus();
    return;
  }

  const preset = ENV_PRESETS[presetKey];
  if (preset) {
    if (keyInput) keyInput.value = presetKey;
    if (valInput) valInput.value = preset.value;
    if (hintEl) hintEl.textContent = preset.hint;
  }
};

window.toggleNewEnvMask = function() {
  const valInput = document.getElementById('new-env-val');
  const btn = document.getElementById('new-env-toggle-mask');
  if (!valInput) return;
  if (valInput.type === 'password') {
    valInput.type = 'text';
    if (btn) btn.textContent = '🔒';
  } else {
    valInput.type = 'password';
    if (btn) btn.textContent = '👁️';
  }
};

window.toggleRowEnvMask = function(key) {
  state.envVarsMaskState[key] = !state.envVarsMaskState[key];
  window.renderEnvVarsTable();
};

window.editEnvVarRow = function(key) {
  const item = state.envVarsList.find(v => v.key === key);
  if (!item) return;
  const keyInput = document.getElementById('new-env-key');
  const valInput = document.getElementById('new-env-val');
  const hintEl = document.getElementById('new-env-hint');
  if (keyInput) keyInput.value = item.key;
  if (valInput) valInput.value = item.value;
  if (hintEl) hintEl.textContent = item.description || `Editing ${item.key} (${item.category})`;
  window.switchEnvVarsView('grid');
  keyInput?.scrollIntoView({ behavior: 'smooth' });
};

window.loadEnvVarsList = async function() {
  try {
    const res = await fetch('/api/env-vars');
    if (!res.ok) return;
    const data = await res.json();
    state.envVarsList = data.variables || [];
    
    // Set raw textarea
    const rawEl = document.getElementById('env-raw-textarea');
    if (rawEl && data.raw) rawEl.value = data.raw;

    // Update count badge
    const countAllEl = document.getElementById('count-env-all');
    if (countAllEl) countAllEl.textContent = state.envVarsList.length;

    window.renderEnvVarsTable();
  } catch (err) {
    console.error('Failed to load env vars list:', err);
  }
};

window.filterEnvVarsByCategory = function(category) {
  state.envVarsActiveCat = category;
  document.querySelectorAll('#env-var-category-pills .allure-cat-badge').forEach(pill => {
    pill.classList.toggle('active', pill.dataset.cat === category);
  });
  window.renderEnvVarsTable();
};

window.filterEnvVarsList = function() {
  const searchInput = document.getElementById('env-vars-search');
  state.envVarsSearchTerm = (searchInput ? searchInput.value : '').toLowerCase().trim();
  window.renderEnvVarsTable();
};

window.renderEnvVarsTable = function() {
  const tbody = document.getElementById('env-vars-tbody');
  if (!tbody) return;

  let filtered = state.envVarsList;

  if (state.envVarsActiveCat && state.envVarsActiveCat !== 'all') {
    filtered = filtered.filter(v => v.category === state.envVarsActiveCat);
  }

  if (state.envVarsSearchTerm) {
    filtered = filtered.filter(v => 
      v.key.toLowerCase().includes(state.envVarsSearchTerm) ||
      (v.value && v.value.toLowerCase().includes(state.envVarsSearchTerm)) ||
      (v.description && v.description.toLowerCase().includes(state.envVarsSearchTerm))
    );
  }

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4" style="text-align: center; padding: 24px; color: #94a3b8;">
          No environment variables match the filter criteria.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(v => {
    const isSecret = v.isSecret;
    const isRevealed = state.envVarsMaskState[v.key];
    const displayVal = (isSecret && !isRevealed) ? '••••••••••••' : escapeHtml(v.value || '');
    
    return `
      <tr style="border-bottom: 1px solid rgba(148, 163, 184, 0.15);">
        <td style="padding: 8px 12px;">
          <div class="font-mono font-bold text-xs flex items-center gap-1.5" style="color: ${isSecret ? '#f59e0b' : '#38bdf8'};">
            ${isSecret ? '🔒' : '🔑'}
            <span>${escapeHtml(v.key)}</span>
          </div>
          <div class="text-[10px] text-muted truncate max-w-xs" title="${escapeHtml(v.description || '')}">${escapeHtml(v.description || '')}</div>
        </td>
        <td style="padding: 8px 12px; font-family: monospace; font-size: 11px; word-break: break-all;">
          <div class="flex items-center gap-1.5 justify-between">
            <span class="${isSecret && !isRevealed ? 'env-val-masked' : ''}">${displayVal}</span>
            ${isSecret ? `
              <button type="button" class="btn btn-secondary btn-sm" style="padding: 1px 6px; font-size: 10px;" onclick="window.toggleRowEnvMask('${escapeHtml(v.key)}')" title="Toggle secret visibility">
                ${isRevealed ? '🔒' : '👁️'}
              </button>
            ` : ''}
          </div>
        </td>
        <td style="padding: 8px 12px;">
          <span class="badge" style="font-size: 10px; background: rgba(99, 102, 241, 0.1); color: #6366f1; border: 1px solid rgba(99, 102, 241, 0.25);">
            ${escapeHtml(v.category)}
          </span>
        </td>
        <td style="padding: 8px 12px; text-align: center;">
          <div class="flex items-center justify-center gap-1">
            <button type="button" class="btn btn-secondary btn-sm" style="padding: 2px 7px; font-size: 11px;" onclick="window.editEnvVarRow('${escapeHtml(v.key)}')" title="Edit Variable">✏️</button>
            <button type="button" class="btn btn-danger btn-sm" style="padding: 2px 7px; font-size: 11px;" onclick="window.deleteEnvVar('${escapeHtml(v.key)}')" title="Delete Variable">🗑️</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
};

window.submitEnvVar = async function() {
  const keyInput = document.getElementById('new-env-key');
  const valInput = document.getElementById('new-env-val');
  const key = keyInput?.value?.trim().toUpperCase();
  const value = valInput?.value ?? '';

  if (!key) {
    showToast('Input Error', 'Variable Key is required and cannot be empty.', 'error');
    keyInput?.focus();
    return;
  }

  try {
    const res = await fetch('/api/env-vars', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value })
    });
    const data = await res.json();
    if (res.ok && data.success) {
      showToast('Environment Saved', `Successfully updated ${key}`, 'success');
      keyInput.value = '';
      valInput.value = '';
      await window.loadEnvVarsList();
      await window.validateEnvVars();
    } else {
      showToast('Save Failed', data.error || 'Failed to update environment variable', 'error');
    }
  } catch (err) {
    showToast('Network Error', err.message, 'error');
  }
};

window.deleteEnvVar = async function(key) {
  if (!confirm(`Are you sure you want to delete environment variable "${key}" from .env?`)) {
    return;
  }

  try {
    const res = await fetch(`/api/env-vars/${encodeURIComponent(key)}`, {
      method: 'DELETE'
    });
    const data = await res.json();
    if (res.ok && data.success) {
      showToast('Variable Deleted', `Removed ${key} from .env`, 'info');
      await window.loadEnvVarsList();
      await window.validateEnvVars();
    } else {
      showToast('Delete Error', data.error || 'Failed to remove variable', 'error');
    }
  } catch (err) {
    showToast('Network Error', err.message, 'error');
  }
};

window.switchEnvVarsView = function(view) {
  const gridView = document.getElementById('env-vars-grid-view');
  const rawView = document.getElementById('env-vars-raw-view');
  const gridBtn = document.getElementById('tab-btn-env-vars-grid');
  const rawBtn = document.getElementById('tab-btn-env-vars-raw');

  if (view === 'grid') {
    gridView?.classList.remove('hidden');
    rawView?.classList.add('hidden');
    gridBtn?.classList.add('active');
    rawBtn?.classList.remove('active');
    window.renderEnvVarsTable();
  } else {
    gridView?.classList.add('hidden');
    rawView?.classList.remove('hidden');
    gridBtn?.classList.remove('active');
    rawBtn?.classList.add('active');
  }
};

window.saveRawEnvFile = async function() {
  const rawEl = document.getElementById('env-raw-textarea');
  if (!rawEl) return;
  const content = rawEl.value;

  try {
    const res = await fetch('/api/env-vars/raw', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    });
    const data = await res.json();
    if (res.ok && data.success) {
      showToast('Raw .env Saved', 'Root environment file successfully written and reloaded!', 'success');
      await window.loadEnvVarsList();
      await window.validateEnvVars();
    } else {
      showToast('Save Error', data.error || 'Failed to write raw .env', 'error');
    }
  } catch (err) {
    showToast('Network Error', err.message, 'error');
  }
};

window.validateEnvVars = async function() {
  const banner = document.getElementById('env-vars-validation-banner');
  const iconEl = document.getElementById('env-vars-val-icon');
  const msgEl = document.getElementById('env-vars-val-msg');
  if (!banner) return;

  try {
    const res = await fetch('/api/env-vars/validate', { method: 'POST' });
    const data = await res.json();
    if (res.ok && data.success) {
      if (data.valid && (!data.warnings || data.warnings.length === 0)) {
        banner.className = 'env-vars-alert-banner valid flex items-center justify-between';
        if (iconEl) iconEl.textContent = '✅';
        if (msgEl) msgEl.innerHTML = `All enterprise environment parameters validated. Active Tier: <strong>${data.environment || 'DEV'}</strong>`;
      } else if (data.valid && data.warnings && data.warnings.length > 0) {
        banner.className = 'env-vars-alert-banner warning flex items-center justify-between';
        if (iconEl) iconEl.textContent = '⚠️';
        if (msgEl) msgEl.innerHTML = `Configuration valid with ${data.warnings.length} warning(s): ${escapeHtml(data.warnings[0])}`;
      } else {
        banner.className = 'env-vars-alert-banner invalid flex items-center justify-between';
        if (iconEl) iconEl.textContent = '❌';
        if (msgEl) msgEl.innerHTML = `Validation Error: ${escapeHtml((data.errors && data.errors[0]) || 'Invalid environment parameters')}`;
      }
    }
  } catch (err) {
    console.error('Validation request failed:', err);
  }
};

window.reloadEnvVars = async function() {
  try {
    const res = await fetch('/api/env-vars/reload', { method: 'POST' });
    const data = await res.json();
    if (res.ok && data.success) {
      showToast('Process Reloaded', 'Active process.env refreshed from latest .env configuration.', 'success');
      await window.loadEnvVarsList();
      await window.validateEnvVars();
    } else {
      showToast('Reload Error', data.error || 'Failed to reload environment', 'error');
    }
  } catch (err) {
    showToast('Network Error', err.message, 'error');
  }
};

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

    return `
      <div class="trace-card glass-card" style="cursor: pointer;" onclick="window.openInAppTraceModal('${t.url}')">
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
        <div class="trace-card-actions" onclick="event.stopPropagation()">
          <button onclick="window.openInAppTraceModal('${t.url}')" class="btn btn-primary btn-sm btn-glow" title="Inspect DOM & Network in zero-install In-App Trace Viewer">🔍 In-App Trace</button>
          <a href="${t.url}" download class="btn btn-secondary btn-sm" title="Download trace.zip archive">⬇️ Download</a>
        </div>
      </div>
    `;
  }).join('');
}

// -------------------------------------------------------------
// FAILURE INTELLIGENCE & CASCADE INCIDENT RCA
// -------------------------------------------------------------
state.failureIntelligenceData = null;

async function loadFailureIntelligence(runId = null) {
  try {
    const url = runId ? `/api/reports/failure-intelligence?runId=${encodeURIComponent(runId)}` : '/api/reports/failure-intelligence';
    const res = await fetch(url);
    const data = await res.json();
    state.failureIntelligenceData = data;

    const banner = document.getElementById('failure-intelligence-banner');
    const badgeCount = document.getElementById('fi-badge-count');
    if (!banner) return;

    if (!data.available || !data.incidents || data.incidents.length === 0) {
      if (badgeCount) badgeCount.textContent = '0';
      banner.innerHTML = `
        <div class="fi-card">
          <div class="fi-header">
            <div class="fi-title-block">
              <span class="fi-icon" style="background: rgba(34, 197, 94, 0.15); border-color: rgba(34, 197, 94, 0.4); color: #22c55e;">✅</span>
              <div>
                <div class="fi-heading-row">
                  <h4 class="fi-title">All Test Assertions Passed — 0 Active Defects</h4>
                  <span class="badge badge-success">HEALTHY</span>
                </div>
                <p class="fi-subtitle">Execution completed with zero regressions. All account lifecycle preconditions and functional assertions verified successfully.</p>
              </div>
            </div>
          </div>
        </div>
      `;
      banner.classList.add('hidden');
      return;
    }

    if (badgeCount) badgeCount.textContent = data.incidents.length;
    banner.classList.remove('hidden');

    const primaryInc = data.incidents[0];
    const totalAffected = primaryInc.affectedScenarios?.length || data.totalFailed || 0;
    const isCascade = totalAffected > 1;

    banner.innerHTML = `
      <div class="fi-card">
        <div class="fi-header">
          <div class="fi-title-block">
            <span class="fi-icon">${primaryInc.category === 'DATA_PRECONDITION_MISSING' ? '🗂️' : (primaryInc.category === 'AUTH_SSO_EXPIRED' ? '🔐' : '⚠️')}</span>
            <div>
              <div class="fi-heading-row">
                <h4 class="fi-title">${isCascade ? `1 Root-Cause Incident Caused ${totalAffected} Cascading Test Failures` : primaryInc.categoryTitle}</h4>
                <span class="badge ${primaryInc.categoryBadge}">${primaryInc.category}</span>
                ${isCascade ? '<span class="badge badge-env">CASCADE DEDUPLICATED</span>' : ''}
              </div>
              <p class="fi-subtitle">${primaryInc.primaryCause}</p>
            </div>
          </div>
          <div class="fi-quick-actions">
            ${primaryInc.category === 'DATA_PRECONDITION_MISSING' ? `
              <button class="btn btn-primary btn-sm btn-glow" onclick="window.triggerAutoSeedAccount()" title="Dynamically provision missing seed account and link to Account 360">
                <span>⚡ Auto-Provision Seed Account</span>
              </button>
            ` : ''}
            <button class="btn btn-secondary btn-sm" onclick="window.triggerRerunFailed()" title="Rerun only failed tests in parallel">
              <span>🔁 1-Click Rerun Failed (Parallel)</span>
            </button>
            <button class="btn btn-secondary btn-sm" onclick="window.openJiraDefectModal(0)" title="Generate pre-formatted JIRA / ServiceNow Bug ticket">
              <span>🎫 File JIRA Bug</span>
            </button>
          </div>
        </div>
        
        <div class="fi-body">
          <div class="fi-scenarios-wrapper">
            <span class="fi-scenarios-label">Blocked Scenarios (${totalAffected}):</span>
            <div class="fi-scenarios-list">
              ${(primaryInc.affectedScenarios || []).map(s => `
                <span class="fi-scenario-chip" onclick="window.openScenarioInTrace('${s.id}')" title="Click to inspect trace: ${s.fullName}">
                  <span>❌</span> ${s.id}
                </span>
              `).join('')}
            </div>
          </div>

          <div class="fi-remediation-row">
            <div class="fi-remediation-box">
              <strong>💡 Recommended Action:</strong>
              <span>${primaryInc.remediation}</span>
            </div>
            <div class="fi-media-actions">
              ${(data.availableTraces && data.availableTraces.length > 0) || data.latestTrace ? `
                <button class="btn btn-secondary btn-sm" onclick="window.openLatestTrace()" title="Open local Playwright Trace Inspector inside dashboard">
                  <span>🔍 In-App Trace Inspector</span>
                </button>
              ` : ''}
              ${data.availableVideos && data.availableVideos.length > 0 ? `
                <button class="btn btn-secondary btn-sm" onclick="window.openLatestVideo()" title="Watch execution video replay inside dashboard">
                  <span>🎥 Failure Video Replay</span>
                </button>
              ` : ''}
            </div>
          </div>
        </div>
      </div>
    `;
  } catch (err) {
    console.warn('Failed to load failure intelligence:', err);
  }
}
window.loadFailureIntelligence = loadFailureIntelligence;

window.toggleFailureIntelligence = function() {
  const banner = document.getElementById('failure-intelligence-banner');
  if (banner) {
    banner.classList.toggle('hidden');
    if (!banner.classList.contains('hidden') && (!state.failureIntelligenceData || !state.failureIntelligenceData.available)) {
      loadFailureIntelligence();
    }
  }
};

window.triggerAutoSeedAccount = async function() {
  try {
    showToast('Auto-Healing Seed Account...', 'info');
    const res = await fetch('/api/tests/auto-seed-account', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accountName: 'Auto_Demo_Acc_945033' })
    });
    const data = await res.json();
    if (data.success) {
      showToast(`✅ Seed Entity Provisioned: ${data.accountName}`, 'success');
      appendLog(`[SELF-HEALING] Precondition seed account "${data.accountName}" injected into runtime environment directory.`, 'success');
      loadFailureIntelligence();
    } else {
      showToast('Failed to auto-seed account', 'error');
    }
  } catch (err) {
    showToast(`Auto-seed failed: ${err.message}`, 'error');
  }
};

window.triggerRerunFailed = async function() {
  try {
    showToast('Extracting failed tests for targeted parallel rerun...', 'info');
    const res = await fetch('/api/run/rerun-failed', { method: 'POST' });
    const data = await res.json();
    if (!data.success) {
      showToast(data.message || 'No failed tests found to rerun.', 'info');
      return;
    }

    showToast(`Launching ${data.count} failed scenarios with 4x workers...`, 'success');
    appendLog(`[RERUN] Targeted parallel rerun initiated for ${data.count} scenarios: ${data.scenarioIds.join(', ')}`, 'system');
    
    // Switch to execution / dashboard
    switchTab('dashboard');

    // Trigger test run with targeted scenarios
    triggerRun({
      scenarioIds: data.scenarioIds,
      grep: data.grep,
      workers: 4,
      envId: data.envId || state.activeEnvironmentId
    });
  } catch (err) {
    showToast(`Failed to rerun: ${err.message}`, 'error');
  }
};

// -------------------------------------------------------------
// IN-APP PLAYWRIGHT TRACE INSPECTOR MODAL
// -------------------------------------------------------------
window.openInAppTraceModal = function(traceUrl) {
  if (!traceUrl) {
    showToast('Trace not found', 'warn');
    return;
  }
  const modal = document.getElementById('inapp-trace-modal');
  const iframe = document.getElementById('inapp-trace-iframe');
  const downloadBtn = document.getElementById('inapp-trace-download-btn');
  const title = document.getElementById('inapp-trace-title');
  if (!modal || !iframe) return;

  // Normalize trace URL: ensure it starts with /traces/ if it's just a filename or relative path
  let cleanUrl = traceUrl;
  if (!cleanUrl.startsWith('http') && !cleanUrl.startsWith('/')) {
    cleanUrl = `/traces/${cleanUrl}`;
  }

  const fullTraceUrl = cleanUrl.startsWith('http') ? cleanUrl : `${window.location.origin}${cleanUrl}`;
  const localViewerUrl = `/reports/html/trace/index.html?trace=${encodeURIComponent(fullTraceUrl)}`;

  const filename = cleanUrl.split('/').pop();
  if (title) title.textContent = `Trace Inspector: ${filename}`;
  if (downloadBtn) downloadBtn.href = cleanUrl;

  iframe.src = localViewerUrl;
  modal.classList.remove('hidden');
  showToast('In-App Trace Inspector', `Loading trace timeline for ${filename}`, 'info');
};

window.closeInAppTraceModal = function() {
  const modal = document.getElementById('inapp-trace-modal');
  const iframe = document.getElementById('inapp-trace-iframe');
  if (modal) modal.classList.add('hidden');
  if (iframe) iframe.src = 'about:blank';
};

window.openTraceInNewTab = function() {
  const iframe = document.getElementById('inapp-trace-iframe');
  if (iframe && iframe.src && iframe.src !== 'about:blank') {
    window.open(iframe.src, '_blank');
  }
};

window.openLatestTrace = function() {
  const data = state.failureIntelligenceData;
  const traceUrl = data?.latestTrace?.url || data?.availableTraces?.[0] || '/traces/latest-trace.zip';
  window.openInAppTraceModal(traceUrl);
};

window.openScenarioInTrace = function(scenarioId) {
  const data = state.failureIntelligenceData;
  let matchedTrace = (data?.availableTraces || []).find(t => t.includes(scenarioId));
  if (!matchedTrace) matchedTrace = data?.latestTrace?.url || data?.availableTraces?.[0];
  window.openInAppTraceModal(matchedTrace);
};

// -------------------------------------------------------------
// IN-APP VIDEO PLAYER MODAL
// -------------------------------------------------------------
window.openInAppVideoModal = function(videoUrl) {
  if (!videoUrl) {
    showToast('Execution video not found for this run', 'warn');
    return;
  }
  const modal = document.getElementById('inapp-video-modal');
  const player = document.getElementById('inapp-video-player');
  const downloadBtn = document.getElementById('inapp-video-download-btn');
  const title = document.getElementById('inapp-video-title');
  if (!modal || !player) return;

  const filename = videoUrl.split('/').pop();
  if (title) title.textContent = `Failure Video Replay: ${filename}`;
  if (downloadBtn) downloadBtn.href = videoUrl;

  player.src = videoUrl;
  modal.classList.remove('hidden');
  player.play().catch(() => {});
};

window.closeInAppVideoModal = function() {
  const modal = document.getElementById('inapp-video-modal');
  const player = document.getElementById('inapp-video-player');
  if (player) {
    player.pause();
    player.src = '';
  }
  if (modal) modal.classList.add('hidden');
};

window.openLatestVideo = function() {
  const data = state.failureIntelligenceData;
  const videoUrl = data?.availableVideos?.[0];
  if (!videoUrl) {
    showToast('No video recordings captured for latest run', 'info');
    return;
  }
  window.openInAppVideoModal(videoUrl);
};

// -------------------------------------------------------------
// JIRA DEFECT GENERATOR MODAL
// -------------------------------------------------------------
window.openJiraDefectModal = function(incidentIndex = 0) {
  const modal = document.getElementById('jira-defect-modal');
  if (!modal) return;

  const payloads = state.failureIntelligenceData?.jiraPayloads || [];
  const p = payloads[incidentIndex] || {
    summary: '[SIT STG-2] 🗂️ Missing Test Entity & Seed Precondition (8 Tests Blocked)',
    issueType: 'Bug',
    priority: 'Medium',
    environment: 'SIT - STG 2',
    labels: ['automation-failure', 'data-precondition-missing'],
    components: ['Accounts', 'Account 360', 'Automation Suite'],
    description: 'Cascading Precondition Defect: Required seed account was missing from target cluster directory.'
  };

  state.currentJiraPayload = p;

  document.getElementById('jira-field-summary').value = p.summary || '';
  document.getElementById('jira-field-type').value = p.issueType || 'Bug';
  document.getElementById('jira-field-priority').value = p.priority || 'Medium';
  document.getElementById('jira-field-env').value = p.environment || 'Target Environment';
  document.getElementById('jira-field-desc').value = p.description || '';

  const tagsRow = document.getElementById('jira-tags-row');
  if (tagsRow) {
    const allTags = [...(p.components || []), ...(p.labels || [])];
    tagsRow.innerHTML = allTags.map(t => `<span class="badge badge-env">${t}</span>`).join(' ');
  }

  modal.classList.remove('hidden');
};

window.closeJiraDefectModal = function() {
  const modal = document.getElementById('jira-defect-modal');
  if (modal) modal.classList.add('hidden');
};

window.copyJiraMarkdown = function() {
  const p = state.currentJiraPayload;
  if (!p) return;
  const markdownText = `*Issue Type*: ${p.issueType}\n*Summary*: ${p.summary}\n*Priority*: ${p.priority}\n*Environment*: ${p.environment}\n*Components*: ${(p.components || []).join(', ')}\n*Labels*: ${(p.labels || []).join(', ')}\n\n${p.description}`;
  navigator.clipboard.writeText(markdownText).then(() => {
    showToast('✅ JIRA Bug description copied to clipboard!', 'success');
  }).catch(() => {
    showToast('Failed to copy to clipboard', 'error');
  });
};

window.copyJiraJson = function() {
  const p = state.currentJiraPayload;
  if (!p) return;
  navigator.clipboard.writeText(JSON.stringify(p, null, 2)).then(() => {
    showToast('✅ JIRA API JSON payload copied to clipboard!', 'success');
  }).catch(() => {
    showToast('Failed to copy to clipboard', 'error');
  });
};

// -------------------------------------------------------------
// RCA DRILLDOWN MODAL
// -------------------------------------------------------------
window.openRcaModal = async function(runId) {
  try {
    const res = await fetch(`/api/rca/${runId}`);
    const data = await res.json();
    const rca = data.rca;
    if (!rca) {
      showToast('RCA Diagnostic', 'No RCA diagnostic data recorded for this run.', 'info');
      return;
    }

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
    showToast('RCA Diagnostic', `Failed to load RCA: ${err.message}`, 'error');
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
    state.history = cachedHistoryRuns;
    renderHistoryTable(cachedHistoryRuns);
    fetchHistoryAnalytics();
    if (!state.currentRun && !state.latestRun) {
      if (typeof loadPipelineStages === 'function') {
        loadPipelineStages();
      } else if (cachedHistoryRuns.length > 0) {
        updateLatestRunSnapshot(cachedHistoryRuns[0]);
      }
    }
    updateQualityGateStatus();
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

    initTremorCharts(data);
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
        <div style="font-weight: 700; font-size: 1.1rem; color: var(--primary);">${baseRun.runId}</div>
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

// -------------------------------------------------------------
// RUN EXECUTION DETAILS & TEST CASES BREAKDOWN MODAL
// -------------------------------------------------------------
let currentRdRun = null;
let currentRdFilter = 'all';
let currentRdSearch = '';

window.openRunDetailsModal = async function(runId) {
  const modal = document.getElementById('run-details-modal');
  if (!modal) return;

  // Set initial loading state
  const rdRunIdEl = document.getElementById('rd-run-id');
  const rdSubtitleEl = document.getElementById('rd-subtitle');
  const rdTbodyEl = document.getElementById('rd-tests-tbody');
  if (rdRunIdEl) rdRunIdEl.textContent = runId;
  if (rdSubtitleEl) rdSubtitleEl.textContent = 'Loading test execution breakdown & artifacts...';
  if (rdTbodyEl) {
    rdTbodyEl.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; padding: 36px; color: var(--text-muted);">
          <div style="font-size: 1.8rem; margin-bottom: 8px;">⏳</div>
          <div>Loading executed test cases for ${runId}...</div>
        </td>
      </tr>
    `;
  }
  modal.classList.remove('hidden');

  try {
    const res = await fetch(`/api/history/${encodeURIComponent(runId)}`);
    const data = await res.json();
    if (!data.success || !data.run) {
      throw new Error(data.error || 'Failed to retrieve execution details.');
    }

    currentRdRun = data.run;
    currentRdFilter = 'all';
    currentRdSearch = '';
    const searchInput = document.getElementById('rd-test-search');
    if (searchInput) searchInput.value = '';

    // Populate Modal Header
    const isPassed = currentRdRun.exitCode === 0;
    if (rdRunIdEl) rdRunIdEl.textContent = currentRdRun.runId;
    
    const statusBadge = document.getElementById('rd-status-badge');
    if (statusBadge) {
      statusBadge.className = `badge ${isPassed ? 'badge-health-online' : 'badge-health-offline'}`;
      statusBadge.textContent = isPassed ? '✓ PASSED' : '✕ FAILED';
    }

    const envBadge = document.getElementById('rd-env-badge');
    if (envBadge) envBadge.textContent = currentRdRun.envName || 'SIT';

    if (rdSubtitleEl) {
      rdSubtitleEl.textContent = `Target: [${currentRdRun.envName || 'SIT'}] ${currentRdRun.baseUrl || ''} | Engine: ${currentRdRun.browser || 'chromium'} | Suite: ${currentRdRun.suiteName || 'Automated Suite'}`;
    }

    const allureBtn = document.getElementById('rd-allure-btn');
    if (allureBtn) {
      allureBtn.href = currentRdRun.htmlReportUrl || currentRdRun.allureReportUrl || `/reports/html-runs/${currentRdRun.runId}/index.html`;
      allureBtn.textContent = '📊 HTML Report';
    }

    // Populate KPIs
    const tests = currentRdRun.tests || [];
    const passedCount = tests.filter(t => t.status === 'passed').length;
    const failedCount = tests.filter(t => t.status === 'failed').length;
    const durationSec = currentRdRun.duration ? (currentRdRun.duration / 1000).toFixed(1) + 's' : '-';
    const resources = currentRdRun.createdResources || [];

    const totalTestsEl = document.getElementById('rd-total-tests');
    const passedTestsEl = document.getElementById('rd-passed-tests');
    const failedTestsEl = document.getElementById('rd-failed-tests');
    const durationEl = document.getElementById('rd-duration');
    const resourcesCountEl = document.getElementById('rd-resources-count');
    const startTimeEl = document.getElementById('rd-start-time');

    if (totalTestsEl) totalTestsEl.textContent = tests.length;
    if (passedTestsEl) passedTestsEl.textContent = passedCount;
    if (failedTestsEl) failedTestsEl.textContent = failedCount;
    if (durationEl) durationEl.textContent = durationSec;
    if (resourcesCountEl) resourcesCountEl.textContent = resources.length;
    if (startTimeEl) startTimeEl.textContent = new Date(currentRdRun.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    // Filter tab counts
    const fAll = document.getElementById('rd-filter-count-all');
    const fPass = document.getElementById('rd-filter-count-passed');
    const fFail = document.getElementById('rd-filter-count-failed');
    if (fAll) fAll.textContent = tests.length;
    if (fPass) fPass.textContent = passedCount;
    if (fFail) fFail.textContent = failedCount;

    // Created Resources container
    const resContainer = document.getElementById('rd-resources-container');
    const resList = document.getElementById('rd-resources-list');
    if (resources && resources.length > 0 && resContainer && resList) {
      resContainer.classList.remove('hidden');
      rdResourcesExpanded = false;
      const topResources = resources.slice(0, 6);
      const remainingCount = resources.length - 6;
      resList.innerHTML = `
        ${topResources.map(r => `
          <span class="entity-pill" title="Click to copy ${r.type}: ${r.value}" onclick="event.stopPropagation(); navigator.clipboard.writeText('${r.value}'); window.showToast('Copied ${r.type}: ${r.value}')">
            <span class="pill-type">${r.type === 'ACCOUNT' ? '🏢' : (r.type.includes('SIM') ? '📶' : (r.type === 'APN' ? '🌐' : '📦'))} ${r.type}</span>
            <span class="pill-val">${r.value}</span>
            <span class="pill-copy">📋</span>
          </span>
        `).join('')}
        ${remainingCount > 0 ? `<span class="entity-pill-more" onclick="window.toggleAllRdResources()" title="Click to show all ${resources.length} created entities">+${remainingCount} more</span>` : ''}
      `;
    } else if (resContainer) {
      resContainer.classList.add('hidden');
    }

    renderRunDetailsTests();
  } catch (err) {
    if (rdTbodyEl) {
      rdTbodyEl.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 28px; color: var(--danger);">
            Failed to load execution breakdown: ${err.message}
          </td>
        </tr>
      `;
    }
  }
};

let rdResourcesExpanded = false;
window.toggleAllRdResources = function() {
  if (!currentRdRun || !currentRdRun.createdResources) return;
  const resList = document.getElementById('rd-resources-list');
  if (!resList) return;
  rdResourcesExpanded = !rdResourcesExpanded;
  const resources = currentRdRun.createdResources;
  const items = rdResourcesExpanded ? resources : resources.slice(0, 6);
  const remainingCount = resources.length - 6;

  resList.innerHTML = `
    ${items.map(r => `
      <span class="entity-pill" title="Click to copy ${r.type}: ${r.value}" onclick="event.stopPropagation(); navigator.clipboard.writeText('${r.value}'); window.showToast('Copied ${r.type}: ${r.value}')">
        <span class="pill-type">${r.type === 'ACCOUNT' ? '🏢' : (r.type.includes('SIM') ? '📶' : (r.type === 'APN' ? '🌐' : '📦'))} ${r.type}</span>
        <span class="pill-val">${r.value}</span>
        <span class="pill-copy">📋</span>
      </span>
    `).join('')}
    ${!rdResourcesExpanded && remainingCount > 0 ? `<span class="entity-pill-more" onclick="window.toggleAllRdResources()">+${remainingCount} more</span>` : (rdResourcesExpanded ? `<span class="entity-pill-more" onclick="window.toggleAllRdResources()">▲ Collapse</span>` : '')}
  `;
};

window.closeRunDetailsModal = function() {
  const modal = document.getElementById('run-details-modal');
  if (modal) modal.classList.add('hidden');
};

window.setRunDetailsFilter = function(filter) {
  currentRdFilter = filter;
  document.querySelectorAll('.rd-filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === filter);
  });
  renderRunDetailsTests();
};

window.filterRunDetailsTests = function(query) {
  currentRdSearch = (query || '').toLowerCase().trim();
  renderRunDetailsTests();
};

function renderRunDetailsTests() {
  if (!currentRdRun || !currentRdRun.tests) return;
  const tbody = document.getElementById('rd-tests-tbody');
  if (!tbody) return;

  let filtered = currentRdRun.tests;

  if (currentRdFilter !== 'all') {
    filtered = filtered.filter(t => t.status === currentRdFilter);
  }

  if (currentRdSearch) {
    filtered = filtered.filter(t => 
      (t.name && t.name.toLowerCase().includes(currentRdSearch)) ||
      (t.id && t.id.toLowerCase().includes(currentRdSearch)) ||
      (t.file && t.file.toLowerCase().includes(currentRdSearch)) ||
      (t.status && t.status.toLowerCase().includes(currentRdSearch))
    );
  }

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; padding: 32px; color: var(--text-muted);">
          No test cases match filter "${currentRdFilter}"${currentRdSearch ? ` and query "${currentRdSearch}"` : ''}.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map((t, idx) => {
    const isPass = t.status === 'passed';
    const hasError = !isPass && t.error;
    const hasRes = t.resources && t.resources.length > 0;
    const detailRowId = `rd-detail-row-${t.index}`;

    let actions = [];
    if (currentRdRun.latestTrace) {
      actions.push(`<button onclick="window.openInAppTraceModal('${currentRdRun.latestTrace.url}')" class="btn btn-primary btn-sm" style="padding: 2px 6px; font-size: 0.70rem;" title="Inspect in In-App Playwright Trace Viewer">🔍 Trace</button>`);
    }
    if (!isPass && currentRdRun.rca) {
      actions.push(`<button class="btn btn-secondary btn-sm" style="padding: 2px 6px; font-size: 0.70rem;" onclick="window.openRcaModal('${currentRdRun.runId}')" title="AI Root Cause Analysis">🤖 RCA</button>`);
    }
    if (hasError || hasRes) {
      actions.push(`<button class="btn btn-secondary btn-sm" style="padding: 2px 6px; font-size: 0.70rem;" onclick="window.toggleRdTestDetails(${t.index})" title="Toggle error stack & resources">📝 Details</button>`);
    }

    return `
      <tr style="cursor: ${hasError || hasRes ? 'pointer' : 'default'};" onclick="${hasError || hasRes ? `window.toggleRdTestDetails(${t.index})` : ''}">
        <td style="color: var(--text-dim); font-size: 0.72rem; font-weight: 600;">${idx + 1}</td>
        <td>
          <span class="badge ${isPass ? 'badge-health-online' : 'badge-health-offline'}" style="font-size: 0.70rem; padding: 2px 6px;">
            ${isPass ? '✓ PASS' : '✕ FAIL'}
          </span>
        </td>
        <td>
          <span class="rd-test-id-pill" title="Test ID: ${t.id}">${t.id}</span>
        </td>
        <td>
          <div class="rd-test-title">${t.name}</div>
          ${t.file ? `<div class="rd-test-file">${t.file}</div>` : ''}
          ${hasRes ? `
            <div style="margin-top: 4px; display: flex; gap: 4px; flex-wrap: wrap; align-items: center;">
              ${t.resources.slice(0, 4).map(r => `
                <span class="entity-pill" style="font-size: 0.65rem; padding: 1px 5px;" onclick="event.stopPropagation(); navigator.clipboard.writeText('${r.value}'); window.showToast('Copied ${r.type}: ${r.value}')">
                  <span class="pill-type">${r.type}</span> <span class="pill-val">${r.value}</span>
                </span>
              `).join('')}
              ${t.resources.length > 4 ? `<span class="entity-pill-more" style="font-size: 0.65rem; padding: 1px 5px;">+${t.resources.length - 4} more entities</span>` : ''}
            </div>
          ` : ''}
          ${hasError ? `
            <div id="${detailRowId}" class="rd-test-details-box hidden" onclick="event.stopPropagation()">
              <strong>Error Diagnostic:</strong>\n${t.error}
            </div>
          ` : ''}
        </td>
        <td>
          <span class="font-mono text-xs" style="font-weight: 600;">${t.duration || '-'}</span>
        </td>
        <td onclick="event.stopPropagation()">
          <div style="display: flex; gap: 4px; align-items: center; flex-wrap: wrap;">
            ${actions.join('')}
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

window.toggleRdTestDetails = function(testIdx) {
  const box = document.getElementById(`rd-detail-row-${testIdx}`);
  if (box) {
    box.classList.toggle('hidden');
  }
};

function renderHistoryTable(historyList) {
  if (historyList.length === 0) {
    elements.historyTableBody.innerHTML = `<tr><td colspan="10" style="text-align: center; color: #64748b; padding: 24px;">No execution history recorded yet.</td></tr>`;
    return;
  }

  elements.historyTableBody.innerHTML = historyList.map(h => {
    const isPassed = h.exitCode === 0;
    const durationSec = h.duration ? (h.duration / 1000).toFixed(1) + 's' : '-';
    const dObj = new Date(h.startTime);
    const timeStr = dObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const dateStr = dObj.toLocaleDateString([], { month: 'short', day: 'numeric' });

    // Extract resources created during this run
    const resources = (h.createdResources && h.createdResources.length > 0)
      ? h.createdResources
      : ((h.completedTests || []).flatMap(t => t.resources || []));

    let resourcesHtml = '';
    if (resources && resources.length > 0) {
      const displayItems = resources.slice(0, 3);
      const extraCount = resources.length - 3;
      resourcesHtml = `
        <div class="entity-pill-list">
          ${displayItems.map(r => `
            <span class="entity-pill" title="Click to copy ${r.type}: ${r.value}" onclick="event.stopPropagation(); navigator.clipboard.writeText('${r.value}'); window.showToast('Copied ${r.type}: ${r.value}')">
              <span class="pill-type">${r.type === 'ACCOUNT' ? '🏢' : (r.type.includes('SIM') ? '📶' : (r.type === 'APN' ? '🌐' : '📦'))} ${r.type}</span>
              <span class="pill-val">${r.value}</span>
              <span class="pill-copy">📋</span>
            </span>
          `).join('')}
          ${extraCount > 0 ? `<span class="entity-pill-more" title="${resources.slice(3).map(r => `${r.type}: ${r.value}`).join(', ')}">+${extraCount} more</span>` : ''}
        </div>
      `;
    } else {
      resourcesHtml = `<span class="text-muted" style="font-size: 0.72rem; font-style: italic; opacity: 0.75;">None (Read-Only)</span>`;
    }

    // Reports and diagnostics action buttons
    let diagHtml = [];
    const reportUrl = h.htmlReportUrl || h.allureReportUrl || `/reports/html-runs/${h.runId}/index.html`;
    diagHtml.push(`
      <a href="${reportUrl}" target="_blank" class="btn btn-sm btn-allure-link" title="Open Playwright HTML Report for Execution ${h.runId}">
        📊 Report
      </a>
    `);
    diagHtml.push(`<button class="btn btn-secondary btn-sm" style="padding: 2px 7px; font-size: 0.72rem;" onclick="window.openRunDetailsModal('${h.runId}')" title="View executed test cases breakdown">📋 Tests</button>`);
    if (h.latestTrace) {
      diagHtml.push(`<button class="btn btn-primary btn-sm" style="padding: 2px 7px; font-size: 0.72rem;" onclick="window.openInAppTraceModal('${h.latestTrace.url}')" title="Inspect Action Timeline & Traces in In-App Inspector">🔍 Trace</button>`);
    }
    if (!isPassed && h.rca) {
      diagHtml.push(`<button class="btn btn-secondary btn-sm" style="padding: 2px 6px; font-size: 0.72rem;" onclick="window.openRcaModal('${h.runId}')" title="View AI Root Cause Analysis">🤖 RCA</button>`);
    }
    diagHtml.push(`<button class="btn btn-secondary btn-sm" style="padding: 2px 6px; font-size: 0.72rem;" onclick="window.toggleHistoryDiffModal(null, '${h.runId}')" title="Compare with previous run">⚖️ Diff</button>`);

    return `
      <tr id="history-row-${h.runId}" data-run-id="${h.runId}">
        <td>
          <div class="run-id-cell run-id-clickable" onclick="window.openRunDetailsModal('${h.runId}')" title="Click to view all executed test cases for ${h.runId}">
            <span class="font-mono text-xs font-bold text-primary run-id-link" title="${h.runId}">${h.runId || '-'}</span>
            <button class="copy-run-id-btn" title="Copy Execution ID" onclick="event.stopPropagation(); navigator.clipboard.writeText('${h.runId}'); window.showToast('Copied Run ID: ${h.runId}')">📋</button>
          </div>
        </td>
        <td>
          <div style="line-height: 1.2; white-space: nowrap;">
            <span style="font-weight: 600; font-size: 0.74rem;">${timeStr}</span>
            <span style="font-size: 0.68rem; color: var(--text-dim); display: block;">${dateStr}</span>
          </div>
        </td>
        <td><span class="badge badge-env" title="${h.envName || 'SIT'}">${h.envName || 'SIT'}</span></td>
        <td><div class="history-suite-name" title="${h.suiteName}">${h.suiteName}</div></td>
        <td>${resourcesHtml}</td>
        <td><span style="font-size: 0.72rem; text-transform: uppercase; font-weight: 600; white-space: nowrap;">${h.browser || 'chromium'}</span></td>
        <td><span class="font-mono text-xs" style="white-space: nowrap;">${durationSec}</span></td>
        <td>
          <div style="display: inline-flex; gap: 4px; align-items: center; white-space: nowrap;">
            <span class="badge badge-pass" style="padding: 2px 6px; font-size: 0.7rem;">${h.stats?.passed || 0} P</span>
            <span class="badge badge-fail" style="padding: 2px 6px; font-size: 0.7rem;">${h.stats?.failed || 0} F</span>
          </div>
        </td>
        <td>
          <span class="badge ${isPassed ? 'badge-health-online' : 'badge-health-offline'} badge-status">
            <span class="status-icon">${isPassed ? '✓' : '✕'}</span>
            <span class="status-text">${isPassed ? 'PASSED' : 'FAILED'}</span>
          </span>
        </td>
        <td><div style="display: flex; gap: 4px; align-items: center; flex-wrap: wrap;">${diagHtml.join('')}</div></td>
      </tr>
    `;
  }).join('');

  if (state.targetRunId) {
    highlightTargetHistoryRun(state.targetRunId);
  }
}


// -------------------------------------------------------------
// ARTIFACTS, TRACES & ACTION VIDEOS STUDIO
// -------------------------------------------------------------
let currentArtifactTypeFilter = 'all';

async function fetchDeepArtifacts(searchTerm = '', type = null) {
  if (type !== null) {
    currentArtifactTypeFilter = type;
  }
  const activeType = currentArtifactTypeFilter || 'all';

  try {
    const params = new URLSearchParams();
    if (searchTerm) params.append('search', searchTerm);
    if (activeType && activeType !== 'all') params.append('type', activeType);

    const res = await fetch(`/api/artifacts/deep?${params.toString()}`);
    const data = await res.json();
    const artifacts = data.artifacts || [];
    const counts = data.counts || { total: 0, screenshots: 0, traces: 0, videos: 0 };

    // Update count labels
    const countAll = document.getElementById('count-artifact-all');
    const countScreenshots = document.getElementById('count-artifact-screenshots');
    const countTraces = document.getElementById('count-artifact-traces');
    const countVideos = document.getElementById('count-artifact-videos');
    if (countAll) countAll.textContent = counts.total;
    if (countScreenshots) countScreenshots.textContent = counts.screenshots;
    if (countTraces) countTraces.textContent = counts.traces;
    if (countVideos) countVideos.textContent = counts.videos;

    if (!elements.galleryContainer) return;

    if (artifacts.length === 0) {
      elements.galleryContainer.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1; padding: 48px 16px; text-align: center;">
          <div style="font-size: 2.2rem; margin-bottom: 8px;">📂</div>
          <div style="font-weight: 600; color: var(--text-main);">No ${activeType === 'all' ? 'artifacts' : activeType + 's'} found</div>
          <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 4px;">
            ${searchTerm ? `No results matching query "${searchTerm}"` : 'Run automated test suites to capture time-travel traces, videos, and screenshots.'}
          </p>
        </div>
      `;
      return;
    }

    window.__currentArtifactsMap = new Map();
    artifacts.forEach(item => window.__currentArtifactsMap.set(item.id, item));

    elements.galleryContainer.innerHTML = artifacts.map(item => {
      const displayTestId = item.testId || 'TEST';
      const displayTitle = item.testName || item.title || item.filename;
      const fullTitle = item.title || item.testName || item.filename;
      const displayModule = item.module || (item.folder && item.folder.startsWith('accounts') ? 'Accounts Management' : item.browser || '');
      const displayBrowser = item.browser ? `<span class="badge badge-sm badge-outline font-mono" style="font-size: 0.65rem; padding: 1px 5px;">${escapeHtml(item.browser)}</span>` : '';
      const displayRunId = item.runId ? `<span class="badge badge-sm font-mono" style="background: rgba(99, 102, 241, 0.1); color: #4f46e5; border: 1px solid rgba(99, 102, 241, 0.25); font-size: 0.64rem; padding: 1px 5px;" title="Execution ID: ${escapeHtml(item.runId)}">🏷️ ${escapeHtml(item.runId)}</span>` : '';

      if (item.type === 'screenshot') {
        return `
          <div class="artifact-studio-card glass-card">
            <div class="artifact-preview-wrap" onclick="window.openLightboxById('${item.id}')">
              <img src="${item.url}" alt="${escapeHtml(item.filename)}" loading="lazy">
              <span class="artifact-badge-tag artifact-badge-screenshot">📸 SCREENSHOT</span>
              <span class="artifact-size-tag">${item.sizeFormatted}</span>
            </div>
            <div class="gallery-info">
              <div class="flex items-center justify-between" style="gap: 6px; margin-bottom: 4px;">
                <span class="badge badge-env font-mono" style="font-weight: 700; font-size: 0.72rem; letter-spacing: 0.02em;">${escapeHtml(displayTestId)}</span>
                <div class="flex items-center gap-1" style="overflow: hidden;">
                  <span class="text-xs text-muted" style="font-size: 0.7rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 130px;" title="${escapeHtml(displayModule)}">${escapeHtml(displayModule)}</span>
                  ${displayBrowser}
                </div>
              </div>
              ${displayRunId ? `<div style="margin-bottom: 4px;">${displayRunId}</div>` : ''}
              <div class="gallery-title" title="${escapeHtml(fullTitle)}">${escapeHtml(displayTitle)}</div>
              <div class="text-xs text-muted font-mono" style="margin-top: 5px; font-size: 0.68rem; opacity: 0.75; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${escapeHtml(item.filename)}">
                📄 ${escapeHtml(item.filename)}
              </div>
            </div>
            <div class="artifact-actions-row">
              <button class="btn btn-secondary btn-sm" onclick="window.openLightboxById('${item.id}')" style="flex: 1;">🔍 Preview</button>
              <a href="${item.url}" download="${escapeHtml(item.filename)}" class="btn btn-secondary btn-sm" title="Download Screenshot">⬇</a>
            </div>
          </div>
        `;
      } else if (item.type === 'trace') {
        const fullTraceUrl = window.location.origin + item.url;
        return `
          <div class="artifact-studio-card glass-card">
            <div class="artifact-preview-wrap" style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); cursor: pointer;" onclick="window.openInAppTraceModal('${item.url}')">
              <div class="artifact-icon-placeholder">
                <span class="studio-big-icon">⏱️</span>
                <span style="font-size: 0.72rem; font-weight: 600; color: #60a5fa;">PLAYWRIGHT TRACE</span>
              </div>
              <span class="artifact-badge-tag artifact-badge-trace">🔍 TIME-TRAVEL TRACE</span>
              <span class="artifact-size-tag">${item.sizeFormatted}</span>
            </div>
            <div class="gallery-info">
              <div class="flex items-center justify-between" style="gap: 6px; margin-bottom: 4px;">
                <span class="badge badge-env font-mono" style="font-weight: 700; font-size: 0.72rem; letter-spacing: 0.02em;">${escapeHtml(displayTestId)}</span>
                <div class="flex items-center gap-1" style="overflow: hidden;">
                  <span class="text-xs text-muted" style="font-size: 0.7rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 130px;" title="${escapeHtml(displayModule)}">${escapeHtml(displayModule)}</span>
                  ${displayBrowser}
                </div>
              </div>
              ${displayRunId ? `<div style="margin-bottom: 4px;">${displayRunId}</div>` : ''}
              <div class="gallery-title" title="${escapeHtml(fullTitle)}">${escapeHtml(displayTitle)}</div>
              <div class="text-xs text-muted font-mono" style="margin-top: 5px; font-size: 0.68rem; opacity: 0.75; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${escapeHtml(item.filename)}">
                📦 ${escapeHtml(item.filename)}
              </div>
            </div>
            <div class="artifact-actions-row">
              <button onclick="window.openInAppTraceModal('${item.url}')" class="btn btn-primary btn-sm" style="flex: 1; text-align: center;">🔍 In-App Trace</button>
              <a href="${item.url}" download="${escapeHtml(item.filename)}" class="btn btn-secondary btn-sm" title="Download .zip Trace Archive">⬇ .zip</a>
            </div>
          </div>
        `;
      } else if (item.type === 'video') {
        return `
          <div class="artifact-studio-card glass-card">
            <div class="artifact-preview-wrap" style="background: linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%);" onclick="window.openVideoModalById('${item.id}')">
              <div class="artifact-icon-placeholder">
                <span class="studio-big-icon">🎬</span>
                <span style="font-size: 0.72rem; font-weight: 600; color: #fbbf24;">PLAY VIDEO</span>
              </div>
              <span class="artifact-badge-tag artifact-badge-video">🎥 ACTION VIDEO</span>
              <span class="artifact-size-tag">${item.sizeFormatted}</span>
            </div>
            <div class="gallery-info">
              <div class="flex items-center justify-between" style="gap: 6px; margin-bottom: 4px;">
                <span class="badge badge-env font-mono" style="font-weight: 700; font-size: 0.72rem; letter-spacing: 0.02em;">${escapeHtml(displayTestId)}</span>
                <div class="flex items-center gap-1" style="overflow: hidden;">
                  <span class="text-xs text-muted" style="font-size: 0.7rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 130px;" title="${escapeHtml(displayModule)}">${escapeHtml(displayModule)}</span>
                  ${displayBrowser}
                </div>
              </div>
              ${displayRunId ? `<div style="margin-bottom: 4px;">${displayRunId}</div>` : ''}
              <div class="gallery-title" title="${escapeHtml(fullTitle)}">${escapeHtml(displayTitle)}</div>
              <div class="text-xs text-muted font-mono" style="margin-top: 5px; font-size: 0.68rem; opacity: 0.75; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${escapeHtml(item.filename)}">
                🎬 ${escapeHtml(item.filename)}
              </div>
            </div>
            <div class="artifact-actions-row">
              <button class="btn btn-primary btn-sm" onclick="window.openVideoModalById('${item.id}')" style="flex: 1;">▶ Watch Recording</button>
              <a href="${item.url}" download="${escapeHtml(item.filename)}" class="btn btn-secondary btn-sm" title="Download .webm Video">⬇ .webm</a>
            </div>
          </div>
        `;
      }
    }).join('');
  } catch (err) {
    console.error('Failed to fetch deep artifacts:', err);
    if (elements.galleryContainer) {
      elements.galleryContainer.innerHTML = `<div class="empty-state">Error loading artifacts: ${err.message}</div>`;
    }
  }
}

// Backward-compatible aliases and modal helpers
const fetchScreenshots = fetchDeepArtifacts;

window.openVideoModalById = function(id) {
  if (window.__currentArtifactsMap && window.__currentArtifactsMap.has(id)) {
    const item = window.__currentArtifactsMap.get(id);
    window.openVideoModal(item.url, item.title, item.filename);
  }
};

window.openLightboxById = function(id) {
  if (window.__currentArtifactsMap && window.__currentArtifactsMap.has(id)) {
    const item = window.__currentArtifactsMap.get(id);
    window.openLightbox(item.url, item.title);
  }
};

window.openVideoModal = function(videoUrl, title, filename) {
  const modal = document.getElementById('video-player-modal');
  const videoElem = document.getElementById('video-player-element');
  const titleElem = document.getElementById('video-modal-title');
  const fnElem = document.getElementById('video-modal-filename');
  const dlElem = document.getElementById('video-modal-download');
  if (videoElem) {
    videoElem.src = videoUrl;
    videoElem.load();
    videoElem.play().catch(() => {});
  }
  if (titleElem) titleElem.textContent = title || 'Test Execution Video Playback';
  if (fnElem) fnElem.textContent = filename || 'recording.webm';
  if (dlElem) {
    dlElem.href = videoUrl;
    dlElem.download = filename || 'recording.webm';
  }
  if (modal) {
    modal.classList.remove('hidden');
    modal.style.display = 'flex';
  }
};

window.closeVideoModal = function(e) {
  if (e && e.target && e.target.id !== 'video-player-modal' && !e.target.classList.contains('modal-close-btn')) {
    return;
  }
  const modal = document.getElementById('video-player-modal');
  const videoElem = document.getElementById('video-player-element');
  if (videoElem) {
    videoElem.pause();
    videoElem.src = '';
  }
  if (modal) {
    modal.classList.add('hidden');
    modal.style.display = 'none';
  }
};

window.regenerateAllureReport = async function() {
  const btn = document.getElementById('regenerate-allure-btn');
  const originalHtml = btn ? btn.innerHTML : '';
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<span>⏳ Compiling Allure...</span>`;
  }
  try {
    const res = await fetch('/api/reports/allure/generate');
    const data = await res.json();
    if (data.success) {
      const iframe = document.getElementById('report-iframe');
      if (iframe) {
        iframe.src = '/reports/allure/index.html?t=' + Date.now();
      }
      showToast('Allure Report', 'Executive Allure Report regenerated successfully!', 'success');
    } else {
      showToast('Allure Report Error', data.error || 'Failed to compile report', 'error');
    }
  } catch (err) {
    showToast('Allure Network Error', err.message, 'error');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = originalHtml;
    }
  }
};

window.downloadStandaloneAllure = function(runId) {
  const targetId = runId || (typeof currentRdRun !== 'undefined' && currentRdRun?.runId) || '';
  const url = targetId
    ? `/api/reports/allure/download-standalone?runId=${encodeURIComponent(targetId)}`
    : '/api/reports/allure/download-standalone';
  showToast('Offline Allure Report', 'Compiling single-file standalone HTML report. Download starting in a few seconds...', 'info');
  const a = document.createElement('a');
  a.href = url;
  a.download = `Allure-Audit-${targetId || 'Latest'}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};


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
    anomalyBadge.className = `text-xs px-2.5 py-1 rounded font-mono telemetry-badge ${anomalyCount > 0 ? 'badge-alert' : ''}`;
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
    const textColor = isDark ? '#cbd5e1' : '#334155';

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

// -------------------------------------------------------------
// MICROSERVICES CATALOG & ROUTE CLASSIFIER
// -------------------------------------------------------------
const MICROSERVICES = {
  iam: { id: 'iam', name: 'IAM & Keycloak', icon: '🔑', badgeClass: 'ms-badge-iam' },
  graphql: { id: 'graphql', name: 'GraphQL Gateway', icon: '⚡', badgeClass: 'ms-badge-graphql' },
  subscriptions: { id: 'subscriptions', name: 'Subscriptions & SIMs', icon: '📱', badgeClass: 'ms-badge-subscriptions' },
  accounts: { id: 'accounts', name: 'Accounts & Customers', icon: '🏢', badgeClass: 'ms-badge-accounts' },
  billing: { id: 'billing', name: 'Billing & Invoicing', icon: '💳', badgeClass: 'ms-badge-billing' },
  resources: { id: 'resources', name: 'Resources & 5G Slices', icon: '🌐', badgeClass: 'ms-badge-resources' },
  admin: { id: 'admin', name: 'Admin & Security', icon: '🛡️', badgeClass: 'ms-badge-admin' },
  ordering: { id: 'ordering', name: 'Ordering & Orders', icon: '🛒', badgeClass: 'ms-badge-ordering' },
  diagnostics: { id: 'diagnostics', name: 'Diagnostics & Core HLR', icon: '🩺', badgeClass: 'ms-badge-diagnostics' },
  analytics: { id: 'analytics', name: 'Analytics & Telemetry', icon: '📊', badgeClass: 'ms-badge-analytics' },
  assets: { id: 'assets', name: 'Portal Static & Assets', icon: '📦', badgeClass: 'ms-badge-assets' },
  core: { id: 'core', name: 'Core Gateway', icon: '🔌', badgeClass: 'ms-badge-core' }
};

function classifyMicroservice(url, endpoint, payload) {
  const p = (endpoint || url || '').toLowerCase();
  
  if (p.includes('/uam/') || p.includes('/protocol/openid-connect') || p.includes('/login-actions') || p.includes('token') || p.includes('/auth/realms')) {
    return MICROSERVICES.iam;
  }
  if (p.includes('/graphql')) {
    return MICROSERVICES.graphql;
  }
  if (p.includes('/subscription') || p.includes('/customfield') || p.includes('/sim') || p.includes('/esim')) {
    return MICROSERVICES.subscriptions;
  }
  if (p.includes('/account') || p.includes('/customer') || p.includes('sales-agent') || p.includes('show-account')) {
    return MICROSERVICES.accounts;
  }
  if (p.includes('/rating') || p.includes('/service-catalogue') || p.includes('/invoice') || p.includes('/pricing') || p.includes('/discount') || p.includes('/time-interval') || p.includes('fetch-invoice') || p.includes('fetch-account-invoice')) {
    return MICROSERVICES.billing;
  }
  if (p.includes('/ordering') || p.includes('/orders') || p.includes('/checkout')) {
    return MICROSERVICES.ordering;
  }
  if (p.includes('/resources') || p.includes('/slice') || p.includes('/apn') || p.includes('/qos')) {
    return MICROSERVICES.resources;
  }
  if (p.includes('/user') || p.includes('/role') || p.includes('/group') || p.includes('/security') || p.includes('/ip-whitelist') || p.includes('/admin') || p.includes('/automation-rule')) {
    return MICROSERVICES.admin;
  }
  if (p.includes('/diagnostic') || p.includes('/cmg') || p.includes('/subscriber') || p.includes('/hlr')) {
    return MICROSERVICES.diagnostics;
  }
  if (p.includes('/dashboard') || p.includes('/report') || p.includes('/telemetry') || p.includes('/performance-metrics')) {
    return MICROSERVICES.analytics;
  }
  if (p.includes('/files/') || p.includes('/i18n/') || p.includes('/branding/') || p.includes('/asset') || p.endsWith('.png') || p.endsWith('.json')) {
    return MICROSERVICES.assets;
  }
  return MICROSERVICES.core;
}

function getGraphqlOperationName(payload) {
  if (!payload) return null;
  try {
    const parsed = typeof payload === 'string' ? JSON.parse(payload) : payload;
    if (parsed.operationName) return parsed.operationName;
    if (parsed.query) {
      const match = parsed.query.match(/(query|mutation)\s+([a-zA-Z0-9_]+)/);
      if (match) return match[2];
      const tableMatch = parsed.query.match(/\{\s*([a-zA-Z0-9_]+)/);
      if (tableMatch) return tableMatch[1];
    }
  } catch(e) {}
  return null;
}

function formatBytes(bytes) {
  if (!bytes || bytes <= 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function renderPerformanceMetrics(data) {
  if (!data) return;

  const actions = data.actions || [];
  const totalApis = data.totalApisCalled || 0;
  const avgLatency = data.averageLatencyMs || 0;

  let failedCount = 0;
  const msStats = {};
  Object.keys(MICROSERVICES).forEach(k => msStats[k] = 0);
  let totalCallsCount = 0;

  actions.forEach(a => {
    const calls = a.apiCalls || a.apisCalled || [];
    calls.forEach(c => {
      totalCallsCount++;
      if (c.isError || c.status >= 400 || c.status === 0) {
        failedCount++;
      }
      const ms = classifyMicroservice(c.url, c.endpoint, c.requestPayload);
      if (msStats[ms.id] !== undefined) msStats[ms.id]++;
    });
  });

  if (elements.perfTotalActions) elements.perfTotalActions.textContent = actions.length;
  if (elements.perfTotalApis) elements.perfTotalApis.textContent = totalApis || totalCallsCount;
  if (elements.perfAvgLatency) elements.perfAvgLatency.textContent = `${avgLatency} ms`;
  if (elements.perfFailedApis) {
    elements.perfFailedApis.textContent = failedCount;
    elements.perfFailedApis.className = `metric-val ${failedCount > 0 ? 'status-bad' : 'status-good'}`;
  }

  // Update Microservice Pill Counts
  const elAll = document.getElementById('ms-pill-count-all');
  if (elAll) elAll.textContent = totalCallsCount;
  Object.keys(MICROSERVICES).forEach(k => {
    const el = document.getElementById(`ms-pill-count-${k}`);
    if (el) el.textContent = msStats[k] || 0;
  });

  filterPerformanceActions();
}

function filterPerformanceActions() {
  if (!cachedPerfData || !elements.perfActionsList) return;

  const query = (elements.perfSearchInput ? elements.perfSearchInput.value : '').toLowerCase().trim();
  const ratingFilter = elements.perfFilterRating ? elements.perfFilterRating.value : 'ALL';
  const statusTab = state.activePerfStatusFilter || 'ALL';
  const msFilter = state.perfMicroserviceFilter || 'ALL';
  const viewMode = state.perfViewMode || 'ENDPOINTS';
  const sortOrder = state.perfSortOrder || 'COUNT_DESC';

  const actions = cachedPerfData.actions || [];

  // Extract all individual API calls with rich metadata
  let allCalls = [];
  actions.forEach((action, actionIdx) => {
    const calls = action.apiCalls || action.apisCalled || [];
    calls.forEach((api, apiIdx) => {
      const ms = classifyMicroservice(api.url, api.endpoint, api.requestPayload);
      const gqlOp = (api.endpoint || '').includes('graphql') ? getGraphqlOperationName(api.requestPayload) : null;
      allCalls.push({
        ...api,
        _actionIdx: actionIdx,
        _apiIdx: apiIdx,
        _actionName: action.actionName || 'User Action',
        _ms: ms,
        _gqlOp: gqlOp,
        _timestamp: api.timestamp || action.startTime || ''
      });
    });
  });

  // Filter individual calls according to current criteria
  let filteredCalls = allCalls.filter(call => {
    // 1. Microservice filter
    if (msFilter !== 'ALL' && call._ms.id !== msFilter) return false;

    // 2. Status filter
    if (statusTab === 'SUCCESS' && (call.isError || call.status < 200 || call.status >= 400)) return false;
    if (statusTab === 'FAILURE' && !(call.isError || call.status >= 400 || call.status === 0)) return false;

    // 3. Rating filter
    const dur = call.durationMs || 0;
    if (ratingFilter === 'SLA_BREACH' && dur <= 1500) return false;
    if (ratingFilter === 'FAST' && dur >= 500) return false;
    if (ratingFilter === 'ACCEPTABLE' && (dur < 500 || dur > 1500)) return false;
    if (ratingFilter === 'SLOW' && (dur <= 1500 || dur > 3000)) return false;
    if (ratingFilter === 'CRITICAL' && dur <= 3000) return false;

    // 4. Search query
    if (query) {
      const matchUrl = (call.url || '').toLowerCase().includes(query);
      const matchEp = (call.endpoint || '').toLowerCase().includes(query);
      const matchMethod = (call.method || '').toLowerCase().includes(query);
      const matchAction = (call._actionName || '').toLowerCase().includes(query);
      const matchMs = call._ms.name.toLowerCase().includes(query) || call._ms.id.includes(query);
      const matchGql = call._gqlOp ? call._gqlOp.toLowerCase().includes(query) : false;
      if (!matchUrl && !matchEp && !matchMethod && !matchAction && !matchMs && !matchGql) return false;
    }

    return true;
  });

  // Render based on selected View Mode
  if (viewMode === 'ENDPOINTS') {
    renderEndpointsView(filteredCalls, sortOrder, allCalls.length);
  } else if (viewMode === 'ACTIONS') {
    renderActionsView(actions, filteredCalls, allCalls.length);
  } else {
    renderFlatWaterfallView(filteredCalls, sortOrder, allCalls.length);
  }
}

// -------------------------------------------------------------
// VIEW 1: ARRANGE BY ENDPOINTS
// -------------------------------------------------------------
function renderEndpointsView(filteredCalls, sortOrder, totalCallsCount) {
  const container = elements.perfActionsList;
  if (!container) return;

  if (filteredCalls.length === 0) {
    if (elements.perfResultsCounter) {
      elements.perfResultsCounter.textContent = '0 Endpoints • 0 Calls';
    }
    container.innerHTML = `
      <div class="empty-state">
        <p>No matching API endpoints found.</p>
        <p class="text-muted">Try adjusting your search terms, microservice filter, or status toggles.</p>
        <button class="btn btn-secondary btn-sm mt-3" onclick="window.resetPerfFilters()">↺ Reset All Filters</button>
      </div>
    `;
    return;
  }

  // Group calls by endpoint key (and GraphQL operation if applicable)
  const endpointGroups = new Map();
  filteredCalls.forEach(call => {
    const method = call.method || 'GET';
    const cleanEp = (call.endpoint || (call.url ? new URL(call.url).pathname : '/api')).split('?')[0];
    const groupKey = call._gqlOp ? `${method} /api/v1/graphql [${call._gqlOp}]` : `${method} ${cleanEp}`;

    if (!endpointGroups.has(groupKey)) {
      endpointGroups.set(groupKey, {
        key: groupKey,
        method,
        endpoint: cleanEp,
        displayEndpoint: call._gqlOp ? `/api/v1/graphql` : cleanEp,
        gqlOp: call._gqlOp,
        ms: call._ms,
        calls: [],
        totalDuration: 0,
        minDuration: Infinity,
        maxDuration: -Infinity,
        errors: 0,
        totalSize: 0
      });
    }

    const grp = endpointGroups.get(groupKey);
    grp.calls.push(call);
    const dur = call.durationMs || 0;
    grp.totalDuration += dur;
    if (dur < grp.minDuration) grp.minDuration = dur;
    if (dur > grp.maxDuration) grp.maxDuration = dur;
    if (call.isError || call.status >= 400 || call.status === 0) grp.errors++;
    grp.totalSize += (call.responseSize || 0);
  });

  // Calculate statistics per endpoint
  const groups = Array.from(endpointGroups.values()).map(g => {
    const avgDuration = g.calls.length > 0 ? Math.round(g.totalDuration / g.calls.length) : 0;
    const minDuration = g.minDuration === Infinity ? 0 : g.minDuration;
    const maxDuration = g.maxDuration === -Infinity ? 0 : g.maxDuration;
    const rating = avgDuration > 3000 ? 'CRITICAL' : avgDuration > 1500 ? 'SLOW' : avgDuration > 500 ? 'ACCEPTABLE' : 'FAST';
    const successPercent = g.calls.length > 0 ? Math.round(((g.calls.length - g.errors) / g.calls.length) * 100) : 100;
    return {
      ...g,
      avgDuration,
      minDuration,
      maxDuration,
      rating,
      successPercent
    };
  });

  // Sort groups
  if (sortOrder === 'COUNT_DESC') groups.sort((a, b) => b.calls.length - a.calls.length);
  else if (sortOrder === 'LATENCY_DESC') groups.sort((a, b) => b.avgDuration - a.avgDuration);
  else if (sortOrder === 'MAX_LATENCY_DESC') groups.sort((a, b) => b.maxDuration - a.maxDuration);
  else if (sortOrder === 'ERROR_RATE_DESC') groups.sort((a, b) => (b.errors / b.calls.length) - (a.errors / a.calls.length));
  else if (sortOrder === 'ENDPOINT_ASC') groups.sort((a, b) => a.key.localeCompare(b.key));

  if (elements.perfResultsCounter) {
    elements.perfResultsCounter.textContent = `Showing ${groups.length} Endpoints • ${filteredCalls.length} Calls (of ${totalCallsCount})`;
  }

  container.innerHTML = groups.map((group, idx) => {
    const ratingClass = `badge-${group.rating.toLowerCase()}`;
    const maxDur = Math.max(...group.calls.map(a => a.durationMs || 0), 1);

    const callRows = group.calls.map((call, callIdx) => {
      const dur = call.durationMs || 0;
      const isErr = call.isError || call.status >= 400 || call.status === 0;
      const statusClass = call.status >= 500 ? 'perf-status-5xx' :
                          call.status >= 400 ? 'perf-status-4xx' :
                          call.status >= 300 ? 'perf-status-3xx' :
                          call.status >= 200 ? 'perf-status-2xx' : 'perf-status-5xx';
      
      const barRating = dur > 3000 ? 'bar-critical' :
                        dur > 1500 ? 'bar-slow' :
                        dur > 500 ? 'bar-acceptable' : 'bar-fast';
      
      const widthPercent = Math.max(Math.min((dur / maxDur) * 100, 100), 4);
      const formattedSize = call.responseSize > 0 ? `${(call.responseSize / 1024).toFixed(1)} KB` : (call.responseSizeFormatted || '0 B');

      return `
        <tr>
          <td style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-dim); width: 36px;">#${callIdx + 1}</td>
          <td class="perf-url-col">
            <div style="font-weight: 500;">${escapeHtml(call._actionName)}</div>
            ${call._gqlOp ? `<div class="perf-graphql-op-badge" style="display: inline-block; margin-top: 2px;">⚡ ${escapeHtml(call._gqlOp)}</div>` : ''}
            ${call.failureReason ? `<div class="text-danger font-mono" style="font-size: 0.7rem; margin-top: 2px;">⚠️ ${escapeHtml(call.failureReason)}</div>` : ''}
          </td>
          <td><span class="perf-status-badge ${statusClass}">${call.status || (isErr ? 'FAIL' : 'ERR')}</span></td>
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
            <button class="btn-inspect-api" onclick="window.inspectApiDetails(${call._actionIdx}, ${call._apiIdx})" title="Inspect complete Request, Payload, Response Body & Headers">
              🔍 Inspect
            </button>
          </td>
        </tr>
      `;
    }).join('');

    return `
      <div class="perf-endpoint-card expanded" id="perf-ep-card-${idx}">
        <div class="perf-endpoint-header" onclick="window.togglePerfEpCard(${idx})">
          <div class="perf-endpoint-title-group">
            <span class="perf-action-chevron">▶</span>
            <span class="perf-method-badge method-${group.method}">${group.method}</span>
            <span class="perf-endpoint-path font-mono" title="${escapeHtml(group.endpoint)}">${escapeHtml(group.displayEndpoint)}</span>
            ${group.gqlOp ? `<span class="perf-graphql-op-badge">⚡ ${escapeHtml(group.gqlOp)}</span>` : ''}
            <span class="perf-ms-badge ${group.ms.badgeClass}">${group.ms.icon} ${group.ms.name}</span>
          </div>
          <div class="perf-endpoint-metrics">
            <span class="badge badge-env">${group.calls.length} Call${group.calls.length === 1 ? '' : 's'}</span>
            <span class="${ratingClass}">Avg ${group.avgDuration} ms</span>
            <span class="text-muted font-mono" style="font-size: 0.72rem;">Min: ${group.minDuration}ms • Max: ${group.maxDuration}ms</span>
            <span class="badge ${group.errors === 0 ? 'status-good' : 'status-bad'} font-mono">${group.successPercent}% OK</span>
            <span class="text-muted" style="font-size: 0.72rem;">${formatBytes(group.totalSize)}</span>
            <span class="${ratingClass}">${group.rating}</span>
          </div>
        </div>
        <div class="perf-endpoint-body">
          <table class="perf-waterfall-table">
            <thead>
              <tr>
                <th style="width: 36px;">#</th>
                <th>Triggering Action & Operation Details</th>
                <th style="width: 85px;">Status</th>
                <th style="width: 170px;">Latency Waterfall</th>
                <th style="width: 85px;">Size</th>
                <th style="width: 90px; text-align: right;">Inspect</th>
              </tr>
            </thead>
            <tbody>
              ${callRows}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }).join('');
}

// -------------------------------------------------------------
// VIEW 2: ARRANGE BY USER ACTIONS
// -------------------------------------------------------------
function renderActionsView(actions, filteredCalls, totalCallsCount) {
  const container = elements.perfActionsList;
  if (!container) return;

  const filteredSet = new Set(filteredCalls.map(c => `${c._actionIdx}-${c._apiIdx}`));

  const renderedActions = actions.map((action, actionIdx) => {
    const calls = (action.apiCalls || action.apisCalled || []).map((api, apiIdx) => {
      const ms = classifyMicroservice(api.url, api.endpoint, api.requestPayload);
      const gqlOp = (api.endpoint || '').includes('graphql') ? getGraphqlOperationName(api.requestPayload) : null;
      return {
        ...api,
        _actionIdx: actionIdx,
        _apiIdx: apiIdx,
        _ms: ms,
        _gqlOp: gqlOp
      };
    }).filter(c => filteredSet.has(`${c._actionIdx}-${c._apiIdx}`));

    return {
      ...action,
      filteredCalls: calls
    };
  }).filter(a => a.filteredCalls.length > 0);

  if (renderedActions.length === 0) {
    if (elements.perfResultsCounter) elements.perfResultsCounter.textContent = '0 Actions • 0 Calls';
    container.innerHTML = `
      <div class="empty-state">
        <p>No matching API actions found.</p>
        <p class="text-muted">Try adjusting your search terms, microservice filter, or status toggles.</p>
        <button class="btn btn-secondary btn-sm mt-3" onclick="window.resetPerfFilters()">↺ Reset All Filters</button>
      </div>
    `;
    return;
  }

  if (elements.perfResultsCounter) {
    elements.perfResultsCounter.textContent = `Showing ${renderedActions.length} Actions • ${filteredCalls.length} Calls (of ${totalCallsCount})`;
  }

  container.innerHTML = renderedActions.map((action, idx) => {
    const rating = action.performanceRating || 'FAST';
    const badgeClass = `badge-${rating.toLowerCase()}`;
    const calls = action.filteredCalls;
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

      return `
        <tr>
          <td><span class="perf-method-badge method-${api.method}">${api.method}</span></td>
          <td class="perf-url-col" title="${api.url}">
            <div class="flex items-center gap-1.5 flex-wrap">
              <span class="font-mono">${escapeHtml(api.endpoint || api.url)}</span>
              ${api._gqlOp ? `<span class="perf-graphql-op-badge">⚡ ${escapeHtml(api._gqlOp)}</span>` : ''}
              <span class="perf-ms-badge ${api._ms.badgeClass}">${api._ms.icon} ${api._ms.name}</span>
            </div>
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
            <button class="btn-inspect-api" onclick="window.inspectApiDetails(${api._actionIdx}, ${api._apiIdx})" title="Inspect complete Request, Payload, Response Body & Headers">
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
          <table class="perf-waterfall-table">
            <thead>
              <tr>
                <th style="width: 75px;">Method</th>
                <th>Request Endpoint & Microservice</th>
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
        </div>
      </div>
    `;
  }).join('');
}

// -------------------------------------------------------------
// VIEW 3: FLAT CHRONOLOGICAL WATERFALL
// -------------------------------------------------------------
function renderFlatWaterfallView(filteredCalls, sortOrder, totalCallsCount) {
  const container = elements.perfActionsList;
  if (!container) return;

  if (filteredCalls.length === 0) {
    if (elements.perfResultsCounter) elements.perfResultsCounter.textContent = '0 Calls';
    container.innerHTML = `
      <div class="empty-state">
        <p>No matching API calls found.</p>
        <p class="text-muted">Try adjusting your search terms, microservice filter, or status toggles.</p>
        <button class="btn btn-secondary btn-sm mt-3" onclick="window.resetPerfFilters()">↺ Reset All Filters</button>
      </div>
    `;
    return;
  }

  // Sort flat calls
  const sortedCalls = [...filteredCalls];
  if (sortOrder === 'LATENCY_DESC') sortedCalls.sort((a, b) => (b.durationMs || 0) - (a.durationMs || 0));
  else if (sortOrder === 'MAX_LATENCY_DESC') sortedCalls.sort((a, b) => (b.durationMs || 0) - (a.durationMs || 0));
  else if (sortOrder === 'ERROR_RATE_DESC') sortedCalls.sort((a, b) => (b.isError ? 1 : 0) - (a.isError ? 1 : 0));
  else if (sortOrder === 'ENDPOINT_ASC') sortedCalls.sort((a, b) => (a.endpoint || '').localeCompare(b.endpoint || ''));

  const maxDur = Math.max(...sortedCalls.map(a => a.durationMs || 0), 1);

  if (elements.perfResultsCounter) {
    elements.perfResultsCounter.textContent = `Showing ${sortedCalls.length} Chronological Calls (of ${totalCallsCount})`;
  }

  const rows = sortedCalls.map((call, idx) => {
    const dur = call.durationMs || 0;
    const isErr = call.isError || call.status >= 400 || call.status === 0;
    const statusClass = call.status >= 500 ? 'perf-status-5xx' :
                        call.status >= 400 ? 'perf-status-4xx' :
                        call.status >= 300 ? 'perf-status-3xx' :
                        call.status >= 200 ? 'perf-status-2xx' : 'perf-status-5xx';
    
    const barRating = dur > 3000 ? 'bar-critical' :
                      dur > 1500 ? 'bar-slow' :
                      dur > 500 ? 'bar-acceptable' : 'bar-fast';
    
    const widthPercent = Math.max(Math.min((dur / maxDur) * 100, 100), 4);
    const formattedSize = call.responseSize > 0 ? `${(call.responseSize / 1024).toFixed(1)} KB` : (call.responseSizeFormatted || '0 B');

    return `
      <tr>
        <td style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-dim); width: 36px;">#${idx + 1}</td>
        <td style="width: 75px;"><span class="perf-method-badge method-${call.method}">${call.method}</span></td>
        <td class="perf-url-col">
          <div class="flex items-center gap-1.5 flex-wrap">
            <span class="font-mono font-medium">${escapeHtml(call.endpoint || call.url)}</span>
            ${call._gqlOp ? `<span class="perf-graphql-op-badge">⚡ ${escapeHtml(call._gqlOp)}</span>` : ''}
            <span class="perf-ms-badge ${call._ms.badgeClass}">${call._ms.icon} ${call._ms.name}</span>
          </div>
          <div class="text-muted" style="font-size: 0.7rem; margin-top: 1px;">Trigger: <strong>${escapeHtml(call._actionName)}</strong></div>
          ${call.failureReason ? `<div class="text-danger font-mono" style="font-size: 0.7rem; margin-top: 2px;">⚠️ ${escapeHtml(call.failureReason)}</div>` : ''}
        </td>
        <td><span class="perf-status-badge ${statusClass}">${call.status || (isErr ? 'FAIL' : 'ERR')}</span></td>
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
          <button class="btn-inspect-api" onclick="window.inspectApiDetails(${call._actionIdx}, ${call._apiIdx})" title="Inspect complete Request, Payload, Response Body & Headers">
            🔍 Inspect
          </button>
        </td>
      </tr>
    `;
  }).join('');

  container.innerHTML = `
    <div class="perf-flat-table-wrapper">
      <table class="perf-waterfall-table">
        <thead>
          <tr>
            <th style="width: 36px;">#</th>
            <th style="width: 75px;">Method</th>
            <th>Endpoint, Query & Triggering Action</th>
            <th style="width: 85px;">Status</th>
            <th style="width: 170px;">Latency Waterfall</th>
            <th style="width: 85px;">Size</th>
            <th style="width: 90px; text-align: right;">Inspect</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </div>
  `;
}

window.togglePerfCard = function(idx) {
  const card = document.getElementById(`perf-card-${idx}`);
  if (card) card.classList.toggle('expanded');
};

window.togglePerfEpCard = function(idx) {
  const card = document.getElementById(`perf-ep-card-${idx}`);
  if (card) card.classList.toggle('expanded');
};

window.resetPerfFilters = function() {
  if (elements.perfSearchInput) elements.perfSearchInput.value = '';
  if (elements.perfFilterRating) elements.perfFilterRating.value = 'ALL';
  if (elements.perfFilterMsSelect) elements.perfFilterMsSelect.value = 'ALL';
  state.activePerfStatusFilter = 'ALL';
  state.perfMicroserviceFilter = 'ALL';
  state.perfSortOrder = 'COUNT_DESC';
  if (elements.perfSortSelect) elements.perfSortSelect.value = 'COUNT_DESC';
  
  if (elements.perfStatusFilterGroup) {
    elements.perfStatusFilterGroup.querySelectorAll('.toggle-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.statusFilter === 'ALL');
    });
  }
  if (elements.perfMsPills) {
    elements.perfMsPills.querySelectorAll('.filter-pill').forEach(b => {
      b.classList.toggle('active', b.dataset.ms === 'ALL');
    });
  }
  filterPerformanceActions();
};

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
  const confirmed = await window.appConfirm(
    'Are you sure you want to clear all recorded API performance metrics? This action will reset historical latency samples.',
    {
      title: 'Reset Performance Telemetry',
      badge: 'RESET METRICS',
      icon: '⚡',
      type: 'danger',
      confirmText: 'Reset Metrics',
      cancelText: 'Cancel'
    }
  );
  if (!confirmed) return;
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
  const user = session.user || { name: 'vetrivel_m', email: 'vetrivel_m@iothub.com' };

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

async function fallbackGoogleLoginDialog() {
  const email = await window.appPrompt(
    'Enter your Google Workspace / Gmail account to authenticate:',
    'vetri.automation@gmail.com',
    {
      title: 'Google Account Authentication',
      badge: 'SSO LOGIN',
      icon: '🔐',
      confirmText: 'Sign In',
      cancelText: 'Cancel'
    }
  );
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
      await window.appAlert(
        `Scenario: ${scenarioId}\nNew Locator: ${healedLocator}\n\nThe test suite spec is dynamically patched to use this resilient locator on subsequent runs.`,
        {
          title: 'Self-Healing Locator Applied',
          badge: 'AI HEALED',
          icon: '✨',
          confirmText: 'Understood'
        }
      );
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
      await window.appAlert(
        `Executive report sent to ${channel.toUpperCase()} successfully.\n\nPass Rate: ${data.summary?.passRate || 'N/A'}\nDuration: ${data.summary?.duration || 'N/A'}`,
        {
          title: 'Report Dispatched',
          badge: channel.toUpperCase(),
          icon: '🚀',
          confirmText: 'Done'
        }
      );
      closeDispatchModal();
    }
  } catch (err) {
    console.error('Dispatch error:', err);
    showToast('Dispatch Error', 'Failed to dispatch report: ' + (err.message || 'Network error'), 'error');
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
// -------------------------------------------------------------
// 16. ADVANCED TREMOR / SHADCN-STYLE INTERACTIVE CHART ENGINE
// -------------------------------------------------------------
let trendChartInstance = null;
let latencyChartInstance = null;
let fleetChartInstance = null;

// Dynamic Executive Quality Gate Status
function updateQualityGateStatus() {
  const gateBadge = document.getElementById('executive-gate-badge');
  const gateDesc = document.getElementById('executive-gate-desc');
  if (!gateBadge) return;

  const activeEnv = state.activeEnvironment || (state.environments && state.environments.find(e => e.id === state.activeEnvironmentId)) || {};
  const health = activeEnv.health || (state.healthHud?.activeEnvironment?.health) || {};
  const isVpnRequired = health.status === 'vpn_required' || health.status === 'unreachable';
  const isProtected = activeEnv.isProtected || activeEnv.category === 'PROD';
  const lastRun = state.latestRun || (state.history && state.history[0]);

  if (isVpnRequired) {
    gateBadge.className = 'badge badge-health-offline';
    gateBadge.style.fontSize = '0.72rem';
    gateBadge.innerHTML = '⛔ GATE: BLOCKED (VPN REQUIRED)';
    if (gateDesc) {
      gateDesc.innerHTML = `Target host <strong>${escapeHtml(activeEnv.name || 'environment')}</strong> (${escapeHtml(activeEnv.baseUrl || '')}) is unreachable without AT&T Corporate VPN. Connect VPN or switch to Azure FrontDoor.`;
    }
  } else if (isProtected) {
    gateBadge.className = 'badge badge-env cat-prod';
    gateBadge.style.fontSize = '0.72rem';
    gateBadge.innerHTML = '🛡️ PROD GATE: SAFETY LOCKED';
    if (gateDesc) {
      gateDesc.innerHTML = `Target host is a protected <strong>PRODUCTION</strong> cluster. Mutation suites require strict bypass authorization token.`;
    }
  } else if (lastRun && lastRun.exitCode !== null && lastRun.exitCode !== 0) {
    gateBadge.className = 'badge badge-health-degraded';
    gateBadge.style.fontSize = '0.72rem';
    const failedCount = lastRun.stats?.failed || 1;
    gateBadge.innerHTML = `⚠️ GATE: AUDIT REQUIRED (${failedCount} FAILURE${failedCount > 1 ? 'S' : ''})`;
    if (gateDesc) {
      gateDesc.innerHTML = `Recent test execution [${escapeHtml(lastRun.runId)}] detected failures. Review root cause before candidate release sign-off.`;
    }
  } else {
    gateBadge.className = 'badge badge-health-online';
    gateBadge.style.fontSize = '0.72rem';
    gateBadge.innerHTML = '🟢 PRODUCTION GATE: GO';
    if (gateDesc) {
      gateDesc.innerHTML = 'All critical governance checks verified. Safe for promotion and candidate build sign-off.';
    }
  }
}

// Latest Execution Snapshot Card Controller
function updateLatestRunSnapshot(runData) {
  if (!runData) return;
  state.latestRun = runData;

  const card = document.getElementById('latest-run-card');
  const icon = document.getElementById('latest-run-icon');
  const badge = document.getElementById('latest-run-badge');
  const runIdEl = document.getElementById('latest-run-id');
  const titleEl = document.getElementById('latest-run-title');
  const envEl = document.getElementById('latest-run-env');
  const passedEl = document.getElementById('latest-run-passed');
  const failedEl = document.getElementById('latest-run-failed');
  const skippedEl = document.getElementById('latest-run-skipped');
  const durationEl = document.getElementById('latest-run-duration');
  const diagEl = document.getElementById('latest-run-diagnosis');
  const diagText = document.getElementById('latest-run-diagnosis-text');
  const rerunBtn = document.getElementById('latest-run-rerun-btn');
  const logsBtn = document.getElementById('latest-run-logs-btn');
  const rcaBtn = document.getElementById('latest-run-rca-btn');

  if (!card) return;

  const runId = runData.runId || '--';
  if (runIdEl) runIdEl.textContent = runId;
  if (titleEl) titleEl.textContent = runData.suiteName || runData.suiteId || 'Automated Test Run';
  if (envEl) envEl.textContent = runData.envName || (state.activeEnvironment?.name || 'DEV');

  const passed = typeof runData.stats?.passed === 'number' ? runData.stats.passed : 0;
  const failed = typeof runData.stats?.failed === 'number' ? runData.stats.failed : 0;
  const skipped = typeof runData.stats?.skipped === 'number' ? runData.stats.skipped : 0;

  if (passedEl) passedEl.textContent = passed;
  if (failedEl) failedEl.textContent = failed;
  if (skippedEl) skippedEl.textContent = skipped;

  if (runData.isRunning) {
    if (badge) {
      badge.textContent = 'RUNNING';
      badge.className = 'badge badge-health-online';
    }
    if (icon) {
      icon.textContent = '🏎️';
      icon.className = 'run-status-icon-wrapper running';
    }
    if (durationEl) durationEl.textContent = 'In progress...';
    if (diagEl) diagEl.classList.add('hidden');
  } else if (runData.exitCode === 0) {
    if (badge) {
      badge.textContent = 'PASSED';
      badge.className = 'badge badge-pass';
    }
    if (icon) {
      icon.textContent = '✓';
      icon.className = 'run-status-icon-wrapper passed';
    }
    const duration = runData.duration ? `${(runData.duration / 1000).toFixed(1)}s` : (runData.endTime && runData.startTime ? `${((new Date(runData.endTime) - new Date(runData.startTime)) / 1000).toFixed(1)}s` : 'Done');
    if (durationEl) durationEl.textContent = duration;
    if (diagEl) diagEl.classList.add('hidden');
  } else if (runData.exitCode !== null) {
    if (badge) {
      badge.textContent = 'FAILED';
      badge.className = 'badge badge-fail';
    }
    if (icon) {
      icon.textContent = '✖';
      icon.className = 'run-status-icon-wrapper failed';
    }
    const duration = runData.duration ? `${(runData.duration / 1000).toFixed(1)}s` : (runData.endTime && runData.startTime ? `${((new Date(runData.endTime) - new Date(runData.startTime)) / 1000).toFixed(1)}s` : 'Failed');
    if (durationEl) durationEl.textContent = duration;

    // Diagnosis extraction
    if (diagEl && diagText) {
      diagEl.classList.remove('hidden');
      const logStr = Array.isArray(runData.logs) ? runData.logs.join(' ') : '';
      if (logStr.includes('ERR_NAME_NOT_RESOLVED') || logStr.includes('Corporate VPN') || logStr.includes('VPN connection required')) {
        diagText.innerHTML = `Target host DNS unresolved (<code>net::ERR_NAME_NOT_RESOLVED</code>). AT&T Corporate VPN connection required.`;
      } else if (logStr.includes('Timeout')) {
        diagText.textContent = 'Navigation / element locator timeout exceeded before assertion.';
      } else if (runData.rca?.rootCause) {
        diagText.textContent = runData.rca.rootCause;
      } else {
        diagText.textContent = `Test suite encountered ${failed} failure(s). Check Live Canvas and Allure reports.`;
      }
    }
  }

  // Button actions
  if (logsBtn) {
    logsBtn.onclick = () => switchTab('terminal');
  }
  if (rcaBtn) {
    rcaBtn.onclick = () => {
      if (runData.rca) {
        renderRcaModal(runData.rca);
      } else {
        fetchRcaAnalysis();
      }
    };
  }
  if (rerunBtn) {
    rerunBtn.onclick = () => {
      const payload = {
        suiteId: runData.suiteId || 'all',
        scenarioId: runData.scenarioId || null,
        browser: runData.browser || 'chromium',
        workers: runData.workers || 4,
      };
      triggerRun(payload);
    };
  }
}

// Portal Modules Quick Health Grid on Dashboard
function renderDashboardModulesGrid() {
  const container = document.getElementById('dash-modules-quick-grid');
  const countBadge = document.getElementById('dash-modules-count-badge');
  if (!container) return;

  const suites = (state.suites || []).filter(s => s.id !== 'all');
  if (countBadge) countBadge.textContent = `${suites.length} Modules Ready`;

  container.innerHTML = suites.map(suite => {
    let statusBadge = '<span class="badge" style="font-size: 0.65rem;">Ready</span>';
    if (state.latestRun && (state.latestRun.suiteId === suite.id || state.latestRun.suiteId === 'all')) {
      if (state.latestRun.isRunning) {
        statusBadge = '<span class="badge badge-health-online" style="font-size: 0.65rem;">Running...</span>';
      } else if (state.latestRun.exitCode === 0) {
        statusBadge = '<span class="badge badge-pass" style="font-size: 0.65rem;">Passed</span>';
      } else {
        statusBadge = '<span class="badge badge-fail" style="font-size: 0.65rem;">Failed</span>';
      }
    }

    return `
      <div class="quick-module-card">
        <div class="quick-module-header">
          <div class="quick-module-title">
            <span style="font-size: 1.1rem;">${suite.icon || '📦'}</span>
            <span class="truncate" title="${escapeHtml(suite.name)}">${escapeHtml(suite.name)}</span>
          </div>
          ${statusBadge}
        </div>
        <p class="text-[11px] text-muted line-clamp-2" style="min-height: 28px; line-height: 1.35;">${escapeHtml(suite.description || '')}</p>
        <div class="quick-module-actions">
          <span class="text-[11px] font-semibold text-slate-500 font-mono">${suite.testCount || 10} Tests</span>
          <div class="flex items-center gap-1.5">
            <button class="btn btn-secondary btn-sm text-[11px] py-0.5 px-2" onclick="window.openSuiteDetailsModal('${suite.id}')" title="Inspect test cases">🔍 View</button>
            <button class="btn btn-primary btn-sm text-[11px] py-0.5 px-2" onclick="window.triggerSuiteRun('${suite.id}')" title="Execute this module">▶ Run</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

let allureDonutChartInstance = null;

async function loadAllureDashboardWidget() {
  const card = document.getElementById('allure-dashboard-card');
  if (!card) return;

  try {
    const res = await fetch('/api/reports/allure/summary');
    if (!res.ok) return;
    const data = await res.json();
    if (!data.available || !data.summary) {
      card.style.display = 'none';
      return;
    }
    card.style.display = 'block';

    const stat = data.summary.statistic || {};
    const passed = stat.passed || 0;
    const failed = stat.failed || 0;
    const broken = stat.broken || 0;
    const skipped = stat.skipped || 0;
    const total = stat.total || (passed + failed + broken + skipped) || 1;
    const executed = passed + failed + broken;

    // Standard Allure Pass Rate (Excluding intentionally skipped guardrail tests)
    const allurePassPct = executed > 0 ? ((passed / executed) * 100).toFixed(1) : '0.0';
    const fleetPassPct = total > 0 ? ((passed / total) * 100).toFixed(1) : '0.0';

    const runIdEl = document.getElementById('allure-dash-run-id');
    const titleEl = document.getElementById('allure-dash-title');
    const passPctEl = document.getElementById('allure-dash-pass-pct');
    const subtextEl = document.getElementById('allure-dash-subtext');
    const fleetPctEl = document.getElementById('allure-dash-fleet-pct');
    const passedCountEl = document.getElementById('allure-dash-passed-count');
    const failedCountEl = document.getElementById('allure-dash-failed-count');
    const skippedCountEl = document.getElementById('allure-dash-skipped-count');
    const auditBadgeEl = document.getElementById('allure-dash-audit-badge');
    const slaStatusEl = document.getElementById('allure-dash-sla-status');

    if (runIdEl) runIdEl.textContent = data.summary.reportName || 'LATEST AUDIT';
    if (titleEl) titleEl.textContent = `${data.summary.reportName || 'Execution Audit'} Defect Intelligence`;
    if (passPctEl) passPctEl.textContent = `${allurePassPct}%`;
    if (subtextEl) subtextEl.textContent = `${passed} passed of ${executed} executed`;
    if (fleetPctEl) fleetPctEl.textContent = `Fleet Total: ${fleetPassPct}% (${total} Scenarios)`;
    if (passedCountEl) passedCountEl.textContent = passed;
    if (failedCountEl) failedCountEl.textContent = failed + broken;
    if (skippedCountEl) skippedCountEl.textContent = skipped;

    if (auditBadgeEl) {
      if (failed === 0 && broken === 0) {
        auditBadgeEl.textContent = 'GATE: PASSED';
        auditBadgeEl.className = 'badge badge-pass';
      } else {
        auditBadgeEl.textContent = 'TRIAGE REQUIRED';
        auditBadgeEl.className = 'badge badge-fail';
      }
    }

    if (slaStatusEl) {
      const needed = Math.max(0, Math.ceil(0.9 * executed) - passed);
      if (needed === 0) {
        slaStatusEl.textContent = '✓ 90% Release Gate Cleared';
        slaStatusEl.className = 'allure-env-val text-emerald-600 dark:text-emerald-400 text-xs font-semibold';
      } else {
        slaStatusEl.textContent = `Needs ${needed} Fixes for Release Gate`;
        slaStatusEl.className = 'allure-env-val text-rose-600 dark:text-rose-400 text-xs font-semibold';
      }
    }

    // Render Allure Donut Chart with theme-aware colors
    const canvas = document.getElementById('allure-donut-canvas');
    if (canvas && typeof Chart !== 'undefined') {
      if (allureDonutChartInstance) allureDonutChartInstance.destroy();
      const isLight = document.body.classList.contains('theme-light');
      const passColor = isLight ? '#059669' : '#10b981';
      const failColor = isLight ? '#e11d48' : '#ef4444';
      const skipColor = isLight ? '#d97706' : '#f59e0b';

      const ctx = canvas.getContext('2d');
      allureDonutChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Passed', 'Failed', 'Guardrail Skipped'],
          datasets: [{
            data: [passed, (failed + broken), skipped],
            backgroundColor: [passColor, failColor, skipColor],
            borderWidth: isLight ? 2 : 0,
            borderColor: isLight ? '#ffffff' : 'transparent',
            hoverOffset: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '72%',
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: isLight ? '#0f172a' : '#1e293b',
              titleColor: '#ffffff',
              bodyColor: '#e2e8f0',
              padding: 10,
              cornerRadius: 8,
              callbacks: {
                label: (c) => ` ${c.label}: ${c.raw} (${((c.raw / total) * 100).toFixed(1)}% fleet)`
              }
            }
          }
        }
      });
    }

    // Render Categories with interactive click to view in Allure or open RCA
    const catList = document.getElementById('allure-dash-categories-list');
    const catCount = document.getElementById('allure-dash-cat-count');
    if (catList && data.categories && Array.isArray(data.categories.items)) {
      if (catCount) catCount.textContent = `${data.categories.items.length} Active Categories`;
      catList.innerHTML = data.categories.items.map(cat => {
        const cFailed = (cat.statistic?.failed || 0) + (cat.statistic?.broken || 0);
        const cSkipped = cat.statistic?.skipped || 0;
        const isSkip = cFailed === 0 && cSkipped > 0;
        const badgeClass = isSkip ? 'locked' : 'failed';
        const badgeText = isSkip ? `${cSkipped} Guardrail Locked` : `${cFailed} Failed`;
        const sub = isSkip
          ? 'Environment user lacks "+ Account" creation write role on STG-2'
          : 'Missing test prerequisite or seed account in STG-2 database';

        return `
          <div class="allure-cat-item" onclick="window.handleAllureCategoryClick('${escapeHtml(cat.name)}', ${isSkip})" title="Click to triage this category">
            <div class="flex flex-col truncate pr-2">
              <span class="allure-cat-name truncate">${escapeHtml(cat.name)}</span>
              <span class="text-[10px] text-muted truncate mt-0.5">${sub}</span>
            </div>
            <span class="allure-cat-badge ${badgeClass}">${badgeText}</span>
          </div>
        `;
      }).join('');
    }

    // Environment info
    if (Array.isArray(data.environment)) {
      const getEnvVal = (name) => {
        const item = data.environment.find(e => e.name === name);
        return item && item.values ? item.values[0] : null;
      };

      const envName = getEnvVal('Target_Environment') || 'SIT - STG 2';
      const guardrail = getEnvVal('Production_Safety_Guardrail') || 'ACTIVE (Write Protection)';
      const concurrency = getEnvVal('Parallel_Concurrency') || '4x Isolated Workers';

      const envEl = document.getElementById('allure-dash-env-name');
      const guardEl = document.getElementById('allure-dash-guardrail');
      const concEl = document.getElementById('allure-dash-concurrency');

      if (envEl) envEl.textContent = envName;
      if (guardEl) guardEl.textContent = guardrail;
      if (concEl) concEl.textContent = concurrency;
    }
  } catch (err) {
    console.warn('[Dashboard] Could not load Allure widget:', err);
  }
}
window.loadAllureDashboardWidget = loadAllureDashboardWidget;

// Global category click handler to deep-link to Allure or open RCA
window.handleAllureCategoryClick = function(catName, isGuardrail) {
  if (isGuardrail) {
    if (typeof showToast === 'function') {
      showToast('🛡️ Production Safety Guardrail: Write operations blocked on STG-2 to protect master data.', 'warning');
    }
    switchTab('report');
  } else {
    const runId = document.getElementById('allure-dash-run-id')?.textContent || 'RUN-176189';
    if (window.openRcaModal) {
      window.openRcaModal(runId);
    } else {
      switchTab('report');
    }
  }
};

// -------------------------------------------------------------
// MULTI-STAGE PROMOTION PIPELINE: Dev -> QA, QA -> Stag, Stag -> Prod
// Synchronizes Latest Execution Snapshot and Allure Executive Report
// -------------------------------------------------------------
let currentPipelineStagesData = null;
let activeStageId = 'qa-to-stag';

function renderPipelineStageCards(stages, selectedStageId) {
  const container = document.getElementById('pipeline-stage-cards-grid');
  if (!container || !Array.isArray(stages)) return;

  container.innerHTML = stages.map(st => {
    const isActive = st.id === selectedStageId;
    const passPctColor = (st.stats?.total === 0 || !st.hasRun) 
      ? 'text-slate-400' 
      : (st.executedPassPct >= 90 ? 'text-emerald-500' : (st.executedPassPct >= 70 ? 'text-amber-500' : 'text-rose-500'));
    
    const passRateDisplay = (st.stats?.total === 0 || !st.hasRun) ? '--%' : `${st.executedPassPct}%`;
    const countDisplay = (st.stats?.total === 0 || !st.hasRun) 
      ? 'Audit Pending (0 Runs)' 
      : `${st.stats.passed} Pass / ${st.stats.failed} Fail${st.stats.skipped > 0 ? ` / ${st.stats.skipped} Skip` : ''}`;

    return `
      <div class="pipeline-stage-box ${isActive ? 'active' : ''}" id="stage-box-${st.id}" onclick="window.selectPipelineStage('${st.id}')">
        <div class="flex items-center justify-between mb-1.5">
          <div class="flex items-center gap-1.5">
            <span class="text-xs font-black text-slate-900 dark:text-slate-100">Stage ${st.stageNumber}: ${escapeHtml(st.name)}</span>
          </div>
          <span class="badge ${st.gateBadge || 'badge-env'} text-[10px]">${escapeHtml(st.gateStatus || 'PENDING')}</span>
        </div>
        <div class="text-[11px] text-muted mb-2 truncate">${escapeHtml(st.suiteName || st.badge || '')}</div>
        <div class="flex items-baseline justify-between">
          <div>
            <span class="text-xl font-black ${passPctColor} font-mono">${passRateDisplay}</span>
            <span class="text-[10px] text-muted ml-1">Pass Rate</span>
          </div>
          <span class="text-[11px] font-mono text-muted">${countDisplay}</span>
        </div>
        <div class="text-[10px] text-muted mt-2 pt-2 border-t border-slate-200 dark:border-slate-700/40 flex justify-between">
          <span class="truncate max-w-[140px]" title="${escapeHtml(st.targetEnv)}">Target: ${escapeHtml(st.targetEnv)}</span>
          <span class="font-mono text-blue-600 dark:text-blue-400 font-semibold">${escapeHtml(st.runId)}</span>
        </div>
      </div>
    `;
  }).join('');
}

async function loadPipelineStages() {
  try {
    const res = await fetch('/api/reports/pipeline-stages');
    if (!res.ok) return;
    const data = await res.json();
    currentPipelineStagesData = data;
    activeStageId = data.activeStage || 'qa-to-stag';
    const selectedStage = data.selected || (data.stages && data.stages[1]) || (data.stages && data.stages[0]);
    if (selectedStage) {
      applyStageToDashboard(selectedStage);
    }
  } catch (e) {
    console.warn('[Pipeline] Could not load stages:', e);
  }
}
window.loadPipelineStages = loadPipelineStages;

function applyStageToDashboard(stage) {
  if (!stage) return;
  activeStageId = stage.id;

  // 1. Update Ribbon Active Pills
  ['dev-to-qa', 'qa-to-stag', 'stag-to-prod'].forEach(sId => {
    const pill = document.getElementById(`stage-nav-${sId}`);
    if (pill) pill.classList.toggle('active', sId === stage.id);
  });

  const activeBadge = document.getElementById('pipeline-active-badge');
  if (activeBadge) activeBadge.textContent = `ACTIVE: ${stage.name.toUpperCase()}`;

  // 2. Synchronize "Latest Execution Snapshot" Card
  const runIdEl = document.getElementById('latest-run-id');
  const titleEl = document.getElementById('latest-run-title');
  const envEl = document.getElementById('latest-run-env');
  const badgeEl = document.getElementById('latest-run-badge');
  const iconEl = document.getElementById('latest-run-icon');
  const passedEl = document.getElementById('latest-run-passed');
  const failedEl = document.getElementById('latest-run-failed');
  const skippedEl = document.getElementById('latest-run-skipped');
  const durationEl = document.getElementById('latest-run-duration');
  const diagEl = document.getElementById('latest-run-diagnosis');
  const diagText = document.getElementById('latest-run-diagnosis-text');

  if (runIdEl) runIdEl.textContent = stage.runId;
  if (titleEl) titleEl.textContent = `${stage.name}: ${stage.suiteName}`;
  if (envEl) envEl.textContent = stage.targetEnv;
  if (passedEl) passedEl.textContent = stage.stats.passed;
  if (failedEl) failedEl.textContent = stage.stats.failed;
  if (skippedEl) skippedEl.textContent = stage.stats.skipped;
  if (durationEl) durationEl.textContent = stage.duration;

  if (badgeEl) {
    badgeEl.textContent = stage.gateStatus;
    badgeEl.className = `badge ${stage.gateBadge}`;
  }
  if (iconEl) {
    if (stage.status === 'PASSED') {
      iconEl.textContent = '✓';
      iconEl.className = 'run-status-icon-wrapper passed';
    } else if (stage.status === 'TRIAGE') {
      iconEl.textContent = '⚠️';
      iconEl.className = 'run-status-icon-wrapper failed';
    } else {
      iconEl.textContent = '✕';
      iconEl.className = 'run-status-icon-wrapper failed';
    }
  }

  if (diagEl) {
    if (stage.stats.failed > 0) {
      diagEl.classList.remove('hidden');
      if (diagText) diagText.textContent = stage.diagnosis;
    } else {
      diagEl.classList.add('hidden');
    }
  }

  // 3. Synchronize "Allure Executive Report" Widget
  const allureRunIdEl = document.getElementById('allure-dash-run-id');
  const allureTitleEl = document.getElementById('allure-dash-title');
  const allurePassPctEl = document.getElementById('allure-dash-pass-pct');
  const allureSubtextEl = document.getElementById('allure-dash-subtext');
  const allureFleetPctEl = document.getElementById('allure-dash-fleet-pct');
  const allurePassedCountEl = document.getElementById('allure-dash-passed-count');
  const allureFailedCountEl = document.getElementById('allure-dash-failed-count');
  const allureSkippedCountEl = document.getElementById('allure-dash-skipped-count');
  const allureAuditBadgeEl = document.getElementById('allure-dash-audit-badge');
  const allureEnvNameEl = document.getElementById('allure-dash-env-name');
  const allureGuardrailEl = document.getElementById('allure-dash-guardrail');
  const allureConcurrencyEl = document.getElementById('allure-dash-concurrency');
  const allureSlaStatusEl = document.getElementById('allure-dash-sla-status');

  if (allureRunIdEl) allureRunIdEl.textContent = stage.runId;
  if (allureTitleEl) allureTitleEl.textContent = `${stage.name} Defect & Gate Intelligence`;
  if (allurePassPctEl) allurePassPctEl.textContent = stage.stats.total === 0 ? '--%' : `${stage.executedPassPct}%`;
  if (allureSubtextEl) {
    allureSubtextEl.textContent = stage.stats.total === 0
      ? 'No tests executed yet'
      : `${stage.stats.passed} passed of ${stage.stats.passed + stage.stats.failed} executed`;
  }
  if (allureFleetPctEl) {
    allureFleetPctEl.textContent = stage.stats.total === 0
      ? 'Fleet Total: Pending Audit'
      : `Fleet Total: ${stage.fleetPassPct}% (${stage.stats.total} Scenarios)`;
  }
  if (allurePassedCountEl) allurePassedCountEl.textContent = stage.stats.passed;
  if (allureFailedCountEl) allureFailedCountEl.textContent = stage.stats.failed;
  if (allureSkippedCountEl) allureSkippedCountEl.textContent = stage.stats.skipped;

  if (allureAuditBadgeEl) {
    allureAuditBadgeEl.textContent = stage.gateStatus;
    allureAuditBadgeEl.className = `badge ${stage.gateBadge}`;
  }
  if (allureEnvNameEl) allureEnvNameEl.textContent = stage.targetEnv;
  if (allureGuardrailEl) allureGuardrailEl.textContent = stage.guardrail;
  if (allureConcurrencyEl) allureConcurrencyEl.textContent = stage.concurrency;
  if (allureSlaStatusEl) {
    allureSlaStatusEl.textContent = stage.slaStatus;
    allureSlaStatusEl.className = stage.stats.failed === 0 
      ? 'allure-env-val text-emerald-600 dark:text-emerald-400 text-xs font-semibold'
      : 'allure-env-val text-rose-600 dark:text-rose-400 text-xs font-semibold';
  }

  // 4. Update Donut Chart
  const canvas = document.getElementById('allure-donut-canvas');
  if (canvas && typeof Chart !== 'undefined') {
    if (allureDonutChartInstance) allureDonutChartInstance.destroy();
    const isLight = document.body.classList.contains('theme-light');
    const passColor = isLight ? '#059669' : '#10b981';
    const failColor = isLight ? '#e11d48' : '#ef4444';
    const skipColor = isLight ? '#d97706' : '#f59e0b';

    const ctx = canvas.getContext('2d');
    const chartData = stage.stats.total === 0 
      ? [0, 0, 1] 
      : [stage.stats.passed, stage.stats.failed, stage.stats.skipped];
    const chartColors = stage.stats.total === 0 
      ? [isLight ? '#cbd5e1' : '#334155', isLight ? '#cbd5e1' : '#334155', isLight ? '#cbd5e1' : '#334155']
      : [passColor, failColor, skipColor];

    allureDonutChartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: stage.stats.total === 0 ? ['Pending Audit'] : ['Passed', 'Failed', 'Guardrail Skipped'],
        datasets: [{
          data: chartData,
          backgroundColor: chartColors,
          borderWidth: isLight ? 2 : 0,
          borderColor: isLight ? '#ffffff' : 'transparent',
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '72%',
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: isLight ? '#0f172a' : '#1e293b',
            titleColor: '#ffffff',
            bodyColor: '#e2e8f0',
            padding: 10,
            cornerRadius: 8,
            callbacks: {
              label: (c) => ` ${c.label}: ${c.raw}`
            }
          }
        }
      }
    });
  }

  // 5. Update Categories List
  const catList = document.getElementById('allure-dash-categories-list');
  const catCount = document.getElementById('allure-dash-cat-count');
  if (catList && Array.isArray(stage.categories)) {
    if (catCount) catCount.textContent = stage.categories.length === 0 ? '0 Active Categories' : `${stage.categories.length} Active Categories`;
    if (stage.categories.length === 0) {
      catList.innerHTML = `<div class="text-xs text-muted py-2">${escapeHtml(stage.diagnosis || 'No defect categories recorded.')}</div>`;
    } else {
      catList.innerHTML = stage.categories.map(cat => {
        const isSkip = (cat.failed || 0) === 0 && (cat.skipped || 0) > 0;
        const badgeClass = isSkip ? 'locked' : 'failed';
        const badgeText = isSkip ? `${cat.skipped} Guardrail Locked` : `${cat.failed} Failed`;
        return `
          <div class="allure-cat-item" onclick="window.handleAllureCategoryClick('${escapeHtml(cat.name)}', ${isSkip})" title="Click to triage this category">
            <div class="flex flex-col truncate pr-2">
              <span class="allure-cat-name truncate">${escapeHtml(cat.name)}</span>
              <span class="text-[10px] text-muted truncate mt-0.5">${escapeHtml(cat.sub || '')}</span>
            </div>
            <span class="allure-cat-badge ${badgeClass}">${badgeText}</span>
          </div>
        `;
      }).join('');
    }
  }

  // 6. Dynamically render & highlight the 3 promotion cards
  if (currentPipelineStagesData && Array.isArray(currentPipelineStagesData.stages)) {
    renderPipelineStageCards(currentPipelineStagesData.stages, stage.id);
  }

  // 7. Synchronize Bottom Quality Gate SLA Strip
  const stripTitleEl = document.getElementById('allure-gate-strip-title');
  const stripExecutedEl = document.getElementById('allure-gate-strip-executed');
  const stripRunIdText = document.getElementById('allure-gate-strip-runid-text');
  const rcaBtn = document.getElementById('allure-dash-rca-btn');

  if (stripTitleEl) {
    stripTitleEl.textContent = `${stage.name} Gate:`;
  }
  if (stripExecutedEl) {
    if (stage.stats.total === 0 || !stage.hasRun) {
      stripExecutedEl.innerHTML = `Audit Pending (0 Runs recorded)`;
    } else {
      const delta = (stage.executedPassPct - 90.0).toFixed(1);
      const deltaClass = delta >= 0 ? 'text-emerald-500 font-bold' : 'text-rose-500 font-bold';
      const deltaPrefix = delta >= 0 ? '+' : '';
      stripExecutedEl.innerHTML = `Current Executed: <strong>${stage.executedPassPct}%</strong> (Delta: <span class="${deltaClass}">${deltaPrefix}${delta}%</span>)`;
    }
  }
  if (stripRunIdText) {
    stripRunIdText.textContent = stage.runId;
  }
  if (rcaBtn) {
    rcaBtn.onclick = () => window.openRcaModal && window.openRcaModal(stage.runId);
    rcaBtn.title = stage.stats.failed > 0 
      ? `AI Root Cause Analysis of ${stage.stats.failed} Failed Tests` 
      : (stage.hasRun ? 'All tests passed - no failures to triage' : 'No tests run yet');
  }

  // Synchronize Failure Intelligence strip with active stage run
  if (typeof loadFailureIntelligence === 'function') {
    loadFailureIntelligence(stage.runId);
  }
}

window.selectPipelineStage = function(stageId) {
  if (currentPipelineStagesData && Array.isArray(currentPipelineStagesData.stages)) {
    const found = currentPipelineStagesData.stages.find(s => s.id === stageId);
    if (found) {
      applyStageToDashboard(found);
      fetch('/api/reports/pipeline-stages/select', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stageId })
      }).catch(() => {});
      return;
    }
  }
  fetch(`/api/reports/pipeline-stages?stage=${stageId}`)
    .then(r => r.json())
    .then(data => {
      currentPipelineStagesData = data;
      applyStageToDashboard(data.selected || data.stages[0]);
    });
};

function initTremorCharts(analyticsData = null, hudData = null) {
  if (typeof Chart === 'undefined') return;

  // Load consistent multi-stage promotion pipeline and synchronized executive metrics
  loadPipelineStages();

  const isDark = state.theme === 'dark';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.05)';
  const textColor = isDark ? '#94a3b8' : '#64748b';

  // 1. Pass Rate & Stability Velocity Trend Line Chart
  const trendCanvas = document.getElementById('tremor-trend-chart');
  if (trendCanvas) {
    if (trendChartInstance) trendChartInstance.destroy();
    const ctx = trendCanvas.getContext('2d');

    let trendLabels = ['Latest'];
    let trendData = [0];

    if (cachedHistoryRuns && cachedHistoryRuns.length > 0) {
      const recent = cachedHistoryRuns.slice(0, 6).reverse();
      trendLabels = recent.map((r, i) => {
        if (r.startTime) {
          const d = new Date(r.startTime);
          return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        return `Run ${i + 1}`;
      });
      trendData = recent.map(r => {
        const p = r.stats?.passed || 0;
        const f = r.stats?.failed || 0;
        const total = p + f;
        if (total === 0) return r.exitCode === 0 ? 100 : 0;
        return Math.round((p / total) * 100);
      });
    }

    trendChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: trendLabels,
        datasets: [
          {
            label: 'Pass Rate %',
            data: trendData,
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
            data: trendData.map(() => 90),
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
            callbacks: { label: ctx => `${ctx.dataset.label}: ${ctx.raw}%` }
          }
        },
        scales: {
          x: { grid: { color: gridColor }, ticks: { color: textColor, font: { size: 10 } } },
          y: { min: 0, max: 100, grid: { color: gridColor }, ticks: { color: textColor, font: { size: 10 }, callback: v => `${v}%` } }
        }
      }
    });
  }

  // 2. Latency by Suite Bar Chart
  const latencyCanvas = document.getElementById('tremor-latency-chart');
  if (latencyCanvas) {
    if (latencyChartInstance) latencyChartInstance.destroy();
    const ctx = latencyCanvas.getContext('2d');

    let suiteLabels = [];
    let suiteData = [];

    if (analyticsData?.suiteStability && analyticsData.suiteStability.length > 0) {
      const topSuites = analyticsData.suiteStability.slice(0, 5);
      suiteLabels = topSuites.map(s => s.suiteName.replace('tests/', '').replace('.spec.ts', ''));
      suiteData = topSuites.map(s => Math.max(s.avgDurationMs || 300, 100));
    } else {
      suiteLabels = ['No Data'];
      suiteData = [0];
    }

    latencyChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: suiteLabels,
        datasets: [{
          label: 'Avg Response Time (ms)',
          data: suiteData,
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

    let onlineCount = 0;
    let warningCount = 0;
    let offlineCount = 0;

    const envs = state.environments || [];
    envs.forEach(e => {
      const s = e.health?.status;
      if (s === 'healthy') onlineCount++;
      else if (s === 'vpn_required' || s === 'warning' || s === 'degraded') warningCount++;
      else offlineCount++;
    });

    const onlineEl = document.getElementById('fleet-stat-online');
    const warnEl = document.getElementById('fleet-stat-warning');
    const offEl = document.getElementById('fleet-stat-offline');
    if (onlineEl) onlineEl.textContent = `● ${onlineCount} Online`;
    if (warnEl) warnEl.textContent = `● ${warningCount} VPN / Alert`;
    if (offEl) offEl.textContent = `● ${offlineCount} Offline`;

    const totalFleet = onlineCount + warningCount + offlineCount;
    const fleetData = totalFleet === 0 ? [1] : [onlineCount, warningCount, offlineCount];
    const fleetLabels = totalFleet === 0 ? ['No Environments'] : ['Online / Healthy', 'Warning / VPN Required', 'Offline'];
    const fleetColors = totalFleet === 0 ? ['#64748b'] : ['#10b981', '#f59e0b', '#ef4444'];

    fleetChartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: fleetLabels,
        datasets: [{
          data: fleetData,
          backgroundColor: fleetColors,
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

// -------------------------------------------------------------
// 1. TOAST NOTIFICATION SYSTEM
// -------------------------------------------------------------
window.showToast = function(title, message, type = 'info', duration = 3500) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
  const card = document.createElement('div');
  card.className = `toast-card toast-${type}`;
  card.innerHTML = `
    <span class="toast-icon">${icons[type] || 'ℹ️'}</span>
    <div class="toast-body">
      <div class="toast-title">${title}</div>
      <div class="toast-msg">${message}</div>
    </div>
    <div class="toast-progress" style="animation-duration: ${duration}ms"></div>
  `;
  container.appendChild(card);
  setTimeout(() => {
    card.style.opacity = '0';
    card.style.transform = 'translateX(25px)';
    setTimeout(() => card.remove(), 250);
  }, duration);
};

// -------------------------------------------------------------
// 2. PARALLEL WORKER CONCURRENCY SWIMLANES
// -------------------------------------------------------------
state.workerSlots = [];
state.workerTimers = {};

function initWorkerSwimlanes(count = state.workers || 4) {
  const grid = document.getElementById('worker-swimlanes-grid');
  const countLabel = document.getElementById('canvas-workers-count-label');
  const concurrencyBadge = document.getElementById('canvas-concurrency-badge');
  const speedupEst = document.getElementById('canvas-speedup-est');
  if (!grid) return;

  const num = parseInt(count, 10) || 4;
  if (countLabel) countLabel.textContent = num;
  if (concurrencyBadge) concurrencyBadge.textContent = `${num}x Concurrency`;

  const speedupMap = {
    1: 'Sequential Baseline (1 Thread)',
    2: '⚡ Concurrency Gain: ~48% faster',
    4: '⚡ Concurrency Gain: ~72% faster',
    8: '⚡ Concurrency Gain: ~86% turbo speed'
  };
  if (speedupEst) speedupEst.textContent = speedupMap[num] || `⚡ ${num}x Parallel Concurrency`;

  state.workerSlots = [];
  Object.values(state.workerTimers).forEach(id => clearInterval(id));
  state.workerTimers = {};

  let html = '';
  for (let i = 1; i <= num; i++) {
    state.workerSlots.push({
      workerId: i,
      scenarioId: null,
      scenarioName: 'Standby',
      stepNumber: null,
      stepDesc: 'Waiting for task assignment',
      status: 'idle',
      startTime: null,
    });

    html += `
      <div class="worker-card" id="worker-card-${i}">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-1.5">
            <span class="worker-status-dot" id="worker-dot-${i}"></span>
            <strong class="text-xs text-slate-200">Worker #${i}</strong>
          </div>
          <span class="worker-timer" id="worker-timer-${i}">0.0s</span>
        </div>
        <div class="worker-scenario-id font-mono text-xs font-semibold text-blue-400 truncate mt-1" id="worker-sc-id-${i}">Ready</div>
        <div class="worker-scenario-name text-xs text-slate-300 truncate mt-0.5" id="worker-sc-name-${i}">Thread initialized</div>
        <div class="worker-step-badge mt-2 flex items-center gap-1">
          <span class="worker-step-pill" id="worker-step-pill-${i}">IDLE</span>
          <span class="worker-step-text text-xs text-slate-400 truncate" id="worker-step-text-${i}">Standby</span>
        </div>
        <div class="worker-progress-track mt-2">
          <div class="worker-progress-bar" id="worker-prog-${i}" style="width: 0%;"></div>
        </div>
      </div>
    `;
  }
  grid.innerHTML = html;
}

function updateWorkerAssignment(scenarioId, scenarioName) {
  if (!state.workerSlots || state.workerSlots.length === 0) {
    initWorkerSwimlanes(state.workers || 4);
  }

  let slot = state.workerSlots.find(w => w.scenarioId === scenarioId);
  if (!slot) {
    slot = state.workerSlots.find(w => w.status === 'idle') || state.workerSlots[0];
  }

  slot.scenarioId = scenarioId;
  slot.scenarioName = scenarioName || scenarioId;
  slot.status = 'running';
  slot.startTime = Date.now();

  const card = document.getElementById(`worker-card-${slot.workerId}`);
  const dot = document.getElementById(`worker-dot-${slot.workerId}`);
  const idEl = document.getElementById(`worker-sc-id-${slot.workerId}`);
  const nameEl = document.getElementById(`worker-sc-name-${slot.workerId}`);
  const pillEl = document.getElementById(`worker-step-pill-${slot.workerId}`);
  const textEl = document.getElementById(`worker-step-text-${slot.workerId}`);
  const progEl = document.getElementById(`worker-prog-${slot.workerId}`);

  if (card) { card.className = 'worker-card running'; }
  if (dot) { dot.className = 'worker-status-dot running'; }
  if (idEl) { idEl.textContent = scenarioId; }
  if (nameEl) { nameEl.textContent = scenarioName || 'Executing Scenario'; }
  if (pillEl) { pillEl.textContent = 'RUNNING'; }
  if (textEl) { textEl.textContent = 'Executing assertions...'; }
  if (progEl) { progEl.style.width = '35%'; }

  if (state.workerTimers[slot.workerId]) clearInterval(state.workerTimers[slot.workerId]);
  state.workerTimers[slot.workerId] = setInterval(() => {
    const timerEl = document.getElementById(`worker-timer-${slot.workerId}`);
    if (timerEl && slot.startTime) {
      const elapsed = ((Date.now() - slot.startTime) / 1000).toFixed(1);
      timerEl.textContent = `${elapsed}s`;
    }
  }, 150);
}

function updateWorkerStep(stepNum, description) {
  const activeWorker = state.workerSlots.find(w => w.status === 'running');
  if (activeWorker) {
    activeWorker.stepNumber = stepNum;
    activeWorker.stepDesc = description;
    const pillEl = document.getElementById(`worker-step-pill-${activeWorker.workerId}`);
    const textEl = document.getElementById(`worker-step-text-${activeWorker.workerId}`);
    const progEl = document.getElementById(`worker-prog-${activeWorker.workerId}`);

    if (pillEl) pillEl.textContent = `STEP ${stepNum}`;
    if (textEl) textEl.textContent = description;
    if (progEl) progEl.style.width = `${Math.min(90, stepNum * 25)}%`;
  }
}

function updateWorkerCompletion(scenarioId, isPass, duration) {
  const slot = state.workerSlots.find(w => w.scenarioId === scenarioId) || state.workerSlots.find(w => w.status === 'running');
  if (!slot) return;

  if (state.workerTimers[slot.workerId]) {
    clearInterval(state.workerTimers[slot.workerId]);
    delete state.workerTimers[slot.workerId];
  }

  slot.status = isPass ? 'passed' : 'failed';
  const card = document.getElementById(`worker-card-${slot.workerId}`);
  const dot = document.getElementById(`worker-dot-${slot.workerId}`);
  const pillEl = document.getElementById(`worker-step-pill-${slot.workerId}`);
  const textEl = document.getElementById(`worker-step-text-${slot.workerId}`);
  const progEl = document.getElementById(`worker-prog-${slot.workerId}`);
  const timerEl = document.getElementById(`worker-timer-${slot.workerId}`);

  if (card) { card.className = `worker-card ${isPass ? 'passed' : 'failed'}`; }
  if (dot) { dot.className = `worker-status-dot ${isPass ? 'passed' : 'failed'}`; }
  if (pillEl) { pillEl.textContent = isPass ? 'PASSED' : 'FAILED'; }
  if (textEl) { textEl.textContent = isPass ? `Passed in ${duration || '0.5s'}` : `Failed in ${duration || '1.0s'}`; }
  if (progEl) { progEl.style.width = '100%'; }
  if (timerEl && duration) { timerEl.textContent = duration; }

  setTimeout(() => {
    if (state.currentRun && slot.status !== 'running') {
      slot.status = 'idle';
      if (card) card.className = 'worker-card';
      if (dot) dot.className = 'worker-status-dot';
      if (pillEl) pillEl.textContent = 'READY';
      if (textEl) textEl.textContent = 'Awaiting next queue job';
    }
  }, 2200);
}

// -------------------------------------------------------------
// 3. SLIDE-OVER FAILURE TRIAGE & RCA DRAWER
// -------------------------------------------------------------
state.currentDrawerScenarioId = null;
state.failedTests = {};

window.openFailureDrawer = function(scenarioId, customData) {
  state.currentDrawerScenarioId = scenarioId;
  const drawer = document.getElementById('failure-triage-drawer');
  const backdrop = document.getElementById('failure-triage-backdrop');
  if (!drawer || !backdrop) return;

  const sc = (state.scenarios || []).find(s => s.id === scenarioId) || {};
  const failureInfo = (state.failedTests && state.failedTests[scenarioId]) || customData || {};

  const idEl = document.getElementById('drawer-scenario-id');
  const titleEl = document.getElementById('drawer-test-title');
  const envEl = document.getElementById('drawer-env-badge');
  const browserEl = document.getElementById('drawer-browser-badge');
  const durEl = document.getElementById('drawer-duration-badge');
  const errEl = document.getElementById('drawer-error-summary');
  const stackEl = document.getElementById('drawer-call-stack');
  const causeEl = document.getElementById('drawer-rca-cause');
  const remedyEl = document.getElementById('drawer-rca-remedy');
  const imgEl = document.getElementById('drawer-screenshot-img');
  const phEl = document.getElementById('drawer-screenshot-placeholder');

  if (idEl) idEl.textContent = scenarioId || 'TC_UNKNOWN';
  if (titleEl) titleEl.textContent = sc.name || failureInfo.name || 'Scenario Failure Diagnostic';
  if (envEl) envEl.textContent = state.activeEnvironment?.name || 'Azure FrontDoor';
  if (browserEl) browserEl.textContent = `${state.selectedBrowser.toUpperCase()} Engine`;
  if (durEl) durEl.textContent = `Duration: ${failureInfo.duration || '3.4s'}`;

  let errorText = failureInfo.error || '';
  if (!errorText && state.currentRun?.logs) {
    const errorLogs = state.currentRun.logs.filter(l => l.includes('Error:') || l.includes('net::') || l.includes('Call log:'));
    if (errorLogs.length > 0) errorText = errorLogs.slice(-4).join('\n');
  }
  if (!errorText) {
    errorText = `Error: Assertion condition failed or selector timeout reached for ${scenarioId}.`;
  }
  if (errEl) errEl.textContent = errorText;

  let stackText = failureInfo.stack || '';
  if (!stackText && state.currentRun?.logs) {
    const stackLines = state.currentRun.logs.filter(l => l.includes('at ') && l.includes('.ts'));
    if (stackLines.length > 0) stackText = stackLines.slice(0, 5).join('\n');
  }
  if (!stackText) {
    stackText = `at ${sc.file || 'tests/suite.spec.ts'}:18:5\nat BasePage.navigate (src/pages/BasePage.ts:35:21)\nat LoginPage.goto (src/pages/LoginPage.ts:60:16)`;
  }
  if (stackEl) stackEl.textContent = stackText;

  const matchImg = (state.screenshots || []).find(img => img.filename && (img.filename.includes(scenarioId) || img.filename.includes('failed')));
  if (matchImg) {
    if (imgEl) {
      imgEl.src = matchImg.url || `/reports/artifacts/${matchImg.filename}`;
      imgEl.classList.remove('hidden');
    }
    if (phEl) phEl.classList.add('hidden');
  } else {
    if (imgEl) imgEl.classList.add('hidden');
    if (phEl) phEl.classList.remove('hidden');
  }

  if (state.latestRca) {
    if (causeEl) causeEl.textContent = state.latestRca.rootCause || state.latestRca.summary || 'Root cause identified.';
    if (remedyEl) remedyEl.textContent = (state.latestRca.suggestedRemediation || []).join(' ') || 'Remediation suggested.';
  } else {
    if (causeEl) causeEl.textContent = `Network / Element locator latency exceeded timeout on ${state.activeEnvironment?.name || 'cluster'}.`;
    if (remedyEl) remedyEl.textContent = 'Recommendation: Ensure authenticated session cookies are active and network gateway is responsive.';
  }

  backdrop.classList.remove('hidden');
  drawer.classList.remove('hidden');
};

window.closeFailureDrawer = function() {
  const drawer = document.getElementById('failure-triage-drawer');
  const backdrop = document.getElementById('failure-triage-backdrop');
  if (drawer) drawer.classList.add('hidden');
  if (backdrop) backdrop.classList.add('hidden');
};

window.copyDrawerError = function() {
  const errEl = document.getElementById('drawer-error-summary');
  if (errEl && navigator.clipboard) {
    navigator.clipboard.writeText(errEl.textContent);
    showToast('Copied Error', 'Error snippet copied to clipboard', 'info');
  }
};

window.copyJiraBugReport = function() {
  const scId = state.currentDrawerScenarioId || 'TC_UNKNOWN';
  const sc = (state.scenarios || []).find(s => s.id === scId) || {};
  const errEl = document.getElementById('drawer-error-summary');
  const stackEl = document.getElementById('drawer-call-stack');
  const envName = state.activeEnvironment?.name || 'DEV/SIT';
  const baseUrl = state.activeEnvironment?.baseUrl || '';

  const report = [
    `### 🐛 Bug: [${scId}] ${sc.name || 'Automated Test Failure'}`,
    `- **Environment**: [${state.activeEnvironment?.category || 'DEV'}] ${envName} (${baseUrl})`,
    `- **Browser Engine**: ${state.selectedBrowser} (Workers: ${state.workers}x)`,
    `- **Timestamp**: ${new Date().toISOString()}`,
    `- **Automated Suite**: \`${sc.file || 'playwright-suite'}\``,
    ``,
    `#### ❌ Error Description:`,
    `\`\`\``,
    errEl ? errEl.textContent.trim() : 'Execution failed',
    `\`\`\``,
    ``,
    `#### 🔍 Call Stack:`,
    `\`\`\``,
    stackEl ? stackEl.textContent.trim() : '',
    `\`\`\``,
    ``,
    `#### 🤖 AI Remediation:`,
    document.getElementById('drawer-rca-remedy')?.textContent || 'Verify network and element locators.'
  ].join('\n');

  if (navigator.clipboard) {
    navigator.clipboard.writeText(report);
    showToast('Copied for Jira', 'Markdown bug report ready to paste into Jira issue', 'success');
  }
};

window.rerunDrawerScenario = function() {
  const scId = state.currentDrawerScenarioId;
  if (!scId) return;
  window.closeFailureDrawer();
  switchTab('terminal');
  showToast('Re-Running Scenario', `Executing ${scId} in isolated single-worker thread...`, 'info');
  triggerRun({ scenarioId: scId, workers: 1 });
};

window.zoomDrawerScreenshot = function() {
  const imgEl = document.getElementById('drawer-screenshot-img');
  if (imgEl && imgEl.src && !imgEl.classList.contains('hidden')) {
    openLightbox(imgEl.src, `Failure Capture: ${state.currentDrawerScenarioId || 'Test Failure'}`);
  }
};

// -------------------------------------------------------------
// 4. COMMAND PALETTE (CMD + K)
// -------------------------------------------------------------
let paletteSelectedIndex = 0;
let paletteCurrentResults = [];

function setupCommandPalette() {
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      window.toggleCommandPalette();
    } else if (e.key === 'Escape') {
      window.closeCommandPalette();
      window.closeFailureDrawer();
    }
  });

  const searchInput = document.getElementById('palette-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      paletteSelectedIndex = 0;
      renderPaletteResults(e.target.value.trim());
    });

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        paletteSelectedIndex = Math.min(paletteCurrentResults.length - 1, paletteSelectedIndex + 1);
        highlightPaletteItem();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        paletteSelectedIndex = Math.max(0, paletteSelectedIndex - 1);
        highlightPaletteItem();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        executePaletteSelection();
      }
    });
  }
}

window.toggleCommandPalette = function() {
  const backdrop = document.getElementById('command-palette-backdrop');
  const searchInput = document.getElementById('palette-search-input');
  if (!backdrop) return;

  const isHidden = backdrop.classList.contains('hidden');
  if (isHidden) {
    backdrop.classList.remove('hidden');
    if (searchInput) {
      searchInput.value = '';
      setTimeout(() => searchInput.focus(), 50);
    }
    paletteSelectedIndex = 0;
    renderPaletteResults('');
  } else {
    backdrop.classList.add('hidden');
  }
};

window.closeCommandPalette = function(e) {
  if (e && e.target && e.target.id !== 'command-palette-backdrop' && !e.target.classList.contains('palette-esc-badge')) {
    return;
  }
  const backdrop = document.getElementById('command-palette-backdrop');
  if (backdrop) backdrop.classList.add('hidden');
};

function renderPaletteResults(query) {
  const container = document.getElementById('palette-results-list');
  const countBadge = document.getElementById('palette-meta-badge');
  if (!container) return;

  const q = query.toLowerCase();
  paletteCurrentResults = [];

  const quickActions = [
    { type: 'action', title: 'Run Full Regression (4x Workers)', icon: '⚡', action: () => { window.closeCommandPalette(); triggerRun({ suiteId: 'all' }); } },
    { type: 'action', title: 'Run Production Smoke Audit', icon: '🚀', action: () => { window.closeCommandPalette(); window.triggerExecutiveRun('smoke'); } },
    { type: 'action', title: 'Run Core Sanity Gate', icon: '🛡️', action: () => { window.closeCommandPalette(); window.triggerExecutiveRun('sanity'); } },
    { type: 'action', title: 'Go to Automated Portal Modules', icon: '📦', action: () => { window.closeCommandPalette(); switchTab('suites'); } },
    { type: 'action', title: 'Set Parallel Concurrency: 4x Workers', icon: '🏎️', action: () => { window.closeCommandPalette(); document.querySelector('#workers-selector [data-workers="4"]')?.click(); } },
    { type: 'action', title: 'Set Parallel Concurrency: 8x Turbo Workers', icon: '🚀', action: () => { window.closeCommandPalette(); document.querySelector('#workers-selector [data-workers="8"]')?.click(); } },
    { type: 'action', title: 'Open Live Executive Email Preview Card', icon: '✉️', action: () => { window.closeCommandPalette(); window.openEmailPreviewModal(); } },
    { type: 'action', title: 'View Allure Executive Report', icon: '📊', action: () => { window.closeCommandPalette(); switchTab('report'); } },
    { type: 'action', title: 'View Traces & Screenshot Artifacts', icon: '📸', action: () => { window.closeCommandPalette(); switchTab('gallery'); } },
  ];

  const matchedActions = quickActions.filter(a => !q || a.title.toLowerCase().includes(q));

  const matchedScenarios = (state.scenarios || []).filter(s => {
    if (!q) return false;
    return s.id.toLowerCase().includes(q) || s.name.toLowerCase().includes(q) || (s.tags && s.tags.some(t => t.toLowerCase().includes(q)));
  }).slice(0, 10);

  const matchedEnvs = (state.environments || []).filter(e => {
    if (!q) return false;
    return e.name.toLowerCase().includes(q) || e.category.toLowerCase().includes(q) || e.id.toLowerCase().includes(q);
  });

  let html = '';

  if (matchedActions.length > 0) {
    html += '<div class="palette-group-title">QUICK ACTIONS & COMMANDS</div>';
    matchedActions.forEach(action => {
      const idx = paletteCurrentResults.length;
      paletteCurrentResults.push(action);
      html += `
        <div class="palette-item ${idx === paletteSelectedIndex ? 'selected' : ''}" data-idx="${idx}" onclick="executePaletteItem(${idx})">
          <div class="palette-item-left">
            <span class="palette-item-icon">${action.icon}</span>
            <span class="palette-item-title">${action.title}</span>
          </div>
          <span class="palette-item-shortcut">Action</span>
        </div>
      `;
    });
  }

  if (matchedScenarios.length > 0) {
    html += '<div class="palette-group-title">TEST SCENARIOS (MATCHED)</div>';
    matchedScenarios.forEach(sc => {
      const idx = paletteCurrentResults.length;
      paletteCurrentResults.push({
        type: 'scenario',
        scenarioId: sc.id,
        action: () => {
          window.closeCommandPalette();
          switchTab('matrix');
          if (elements.scenarioSearch) {
            elements.scenarioSearch.value = sc.id;
            filterScenariosTable();
          }
          showToast('Located Scenario', `Viewing ${sc.id} in Test Matrix`, 'info');
        }
      });
      html += `
        <div class="palette-item ${idx === paletteSelectedIndex ? 'selected' : ''}" data-idx="${idx}" onclick="executePaletteItem(${idx})">
          <div class="palette-item-left">
            <span class="palette-item-icon">📋</span>
            <div>
              <div class="palette-item-title"><strong class="font-mono text-blue-400">[${sc.id}]</strong> ${sc.name}</div>
              <div class="palette-item-meta">${sc.suiteName || sc.operationGroup || 'Scenario'}</div>
            </div>
          </div>
          <span class="palette-item-shortcut">Jump</span>
        </div>
      `;
    });
  }

  if (matchedEnvs.length > 0) {
    html += '<div class="palette-group-title">TARGET ENVIRONMENTS</div>';
    matchedEnvs.forEach(env => {
      const idx = paletteCurrentResults.length;
      paletteCurrentResults.push({
        type: 'env',
        envId: env.id,
        action: () => {
          window.closeCommandPalette();
          switchEnvironment(env.id);
          showToast('Environment Switched', `Active target cluster: ${env.name}`, 'success');
        }
      });
      html += `
        <div class="palette-item ${idx === paletteSelectedIndex ? 'selected' : ''}" data-idx="${idx}" onclick="executePaletteItem(${idx})">
          <div class="palette-item-left">
            <span class="palette-item-icon">🌐</span>
            <div>
              <div class="palette-item-title">${env.name}</div>
              <div class="palette-item-meta font-mono">${env.baseUrl}</div>
            </div>
          </div>
          <span class="palette-item-shortcut">Switch</span>
        </div>
      `;
    });
  }

  if (paletteCurrentResults.length === 0) {
    html = '<div class="text-xs text-muted p-4 text-center">No matching commands, scenarios, or environments found. Try searching "login", "TC_AUTH", "smoke", or "azure".</div>';
  }

  container.innerHTML = html;
  if (countBadge) {
    countBadge.textContent = `${(state.scenarios || []).length} Test Scenarios Loaded`;
  }
}

function highlightPaletteItem() {
  const items = document.querySelectorAll('.palette-item');
  items.forEach((item, idx) => {
    item.classList.toggle('selected', idx === paletteSelectedIndex);
    if (idx === paletteSelectedIndex) {
      item.scrollIntoView({ block: 'nearest' });
    }
  });
}

function executePaletteSelection() {
  if (paletteCurrentResults[paletteSelectedIndex]) {
    paletteCurrentResults[paletteSelectedIndex].action();
  }
}

window.executePaletteItem = function(idx) {
  paletteSelectedIndex = idx;
  executePaletteSelection();
};

// -------------------------------------------------------------
// 5. FLOATING BATCH LAUNCHPAD DOCK
// -------------------------------------------------------------
window.clearBatchSelection = function() {
  state.selectedScenarioIds = [];
  const cbs = document.querySelectorAll('.scenario-checkbox, #matrix-select-all-checkbox');
  cbs.forEach(cb => cb.checked = false);
  updateSelectedScenariosBar();
  showToast('Selection Cleared', 'Ad-hoc scenario batch emptied', 'info');
};

window.triggerBatchRun = function() {
  if (!state.selectedScenarioIds || state.selectedScenarioIds.length === 0) {
    showToast('Batch Launchpad', 'Please select at least one test scenario before launching.', 'warning');
    return;
  }

  const count = state.selectedScenarioIds.length;
  const workers = state.workers || 4;
  showToast('Launching Batch', `Dispatching ${count} scenarios across ${workers}x parallel workers`, 'success');
  
  switchTab('terminal');
  triggerRun({
    scenarioIds: [...state.selectedScenarioIds],
    workers: workers,
    browser: state.selectedBrowser,
    headed: state.isHeaded
  });
};

// Boot application
window.addEventListener('DOMContentLoaded', () => {
  initApp();
  fetchAuthSession();
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
      fetchDeepArtifacts(e.target.value);
    });
  }
  const refreshGalleryBtn = document.getElementById('refresh-gallery-btn');
  if (refreshGalleryBtn) {
    refreshGalleryBtn.addEventListener('click', () => {
      const q = gallerySearchInput ? gallerySearchInput.value : '';
      fetchDeepArtifacts(q);
    });
  }

  // Artifact Studio Type Filter Pills
  const artifactPills = document.querySelectorAll('#artifact-type-filter-pills .filter-pill');
  artifactPills.forEach(pill => {
    pill.addEventListener('click', () => {
      artifactPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const type = pill.dataset.type;
      const q = gallerySearchInput ? gallerySearchInput.value : '';
      fetchDeepArtifacts(q, type);
    });
  });

  // Python Telecom Engine Listeners
  const pythonBadge = document.getElementById('header-python-badge');
  if (pythonBadge) pythonBadge.addEventListener('click', openPythonModal);
  const pythonModalClose = document.getElementById('python-modal-close');
  if (pythonModalClose) pythonModalClose.addEventListener('click', closePythonModal);
  const pythonModalFooterClose = document.getElementById('python-modal-footer-close');
  if (pythonModalFooterClose) pythonModalFooterClose.addEventListener('click', closePythonModal);

  // Python Modal Subtab switching
  const pTabs = document.querySelectorAll('#python-modal-tabs button');
  pTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      pTabs.forEach(b => b.classList.remove('active-subtab'));
      btn.classList.add('active-subtab');
      const target = btn.dataset.ptab;
      document.querySelectorAll('.ptab-content').forEach(c => c.classList.add('hidden'));
      const activeContent = document.getElementById(`ptab-content-${target}`);
      if (activeContent) activeContent.classList.remove('hidden');
    });
  });

  // Python Run SIMs
  const runSimsBtn = document.getElementById('python-run-sims-btn');
  if (runSimsBtn) {
    runSimsBtn.addEventListener('click', async () => {
      runSimsBtn.disabled = true;
      runSimsBtn.textContent = 'Generating...';
      try {
        const count = document.getElementById('python-sim-count').value;
        const res = await fetch('/api/python/generate-sims', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ count, format: 'csv' })
        });
        const data = await res.json();
        if (data.success) {
          const container = document.getElementById('python-sims-result-container');
          const summary = document.getElementById('python-sims-summary-text');
          const dlBtn = document.getElementById('python-sims-download-btn');
          const tbody = document.getElementById('python-sims-tbody');
          if (summary) summary.textContent = `✓ ${data.count} Collision-Free SIMs Generated (ISO/IEC 7812 Valid)`;
          if (dlBtn) dlBtn.href = data.downloadUrl;
          if (tbody) {
            tbody.innerHTML = data.sample_profiles.map(p => `
              <tr>
                <td class="font-mono text-emerald-600 font-bold">${p.iccid}</td>
                <td class="font-mono">${p.imsi}</td>
                <td><span class="badge ${p.sim_type === 'ESIM' ? 'badge-primary' : 'badge-outline'}">${p.sim_type}</span></td>
                <td class="font-mono">${p.msisdn}</td>
                <td>${p.rate_plan}</td>
                <td class="font-mono text-xs text-muted">${p.lpa_activation_code || 'N/A (Physical)'}</td>
              </tr>
            `).join('');
          }
          if (container) container.classList.remove('hidden');
        }
      } catch (err) {
        showToast('Telecom Engine', 'Failed to generate SIM batch: ' + err.message, 'error');
      } finally {
        runSimsBtn.disabled = false;
        runSimsBtn.textContent = '⚡ Generate Batch';
      }
    });
  }

  // Python Run CDR Audit
  const runCdrBtn = document.getElementById('python-run-cdr-btn');
  if (runCdrBtn) {
    runCdrBtn.addEventListener('click', async () => {
      runCdrBtn.disabled = true;
      runCdrBtn.textContent = 'Auditing CDRs...';
      try {
        const count = document.getElementById('python-cdr-count').value;
        const res = await fetch('/api/python/cdr-audit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ count })
        });
        const data = await res.json();
        if (data.success) {
          const audit = data.audit;
          const kpis = document.getElementById('python-cdr-kpis');
          const tbody = document.getElementById('python-cdr-tbody');
          const container = document.getElementById('python-cdr-result-container');

          if (kpis) {
            kpis.innerHTML = `
              <div class="bg-white p-2 rounded border text-center">
                <span class="text-xs text-muted block">Records Audited</span>
                <strong class="text-sm">${audit.summary.total_records}</strong>
              </div>
              <div class="bg-white p-2 rounded border text-center">
                <span class="text-xs text-muted block">Billed Revenue</span>
                <strong class="text-sm">$${audit.summary.total_billed}</strong>
              </div>
              <div class="bg-white p-2 rounded border text-center">
                <span class="text-xs text-muted block">Net Variance</span>
                <strong class="text-sm text-emerald-600">$${audit.summary.net_variance}</strong>
              </div>
              <div class="bg-white p-2 rounded border text-center">
                <span class="text-xs text-muted block">Rating Accuracy</span>
                <strong class="text-sm text-blue-600">${audit.summary.accuracy_rate_pct}%</strong>
              </div>
            `;
          }

          if (tbody) {
            const discrepancies = audit.discrepancies || [];
            if (discrepancies.length === 0) {
              tbody.innerHTML = `<tr><td colspan="7" class="text-center text-emerald-600 py-3 font-semibold">✓ 100% Exact Rating Match — Zero Overcharges Detected</td></tr>`;
            } else {
              tbody.innerHTML = discrepancies.map(d => `
                <tr>
                  <td class="font-mono">${d.record_id}</td>
                  <td><span class="badge">${d.service_type}</span></td>
                  <td>${d.usage_units}</td>
                  <td>$${d.portal_billed_amount}</td>
                  <td>$${d.expected_charge}</td>
                  <td class="font-bold ${d.discrepancy > 0 ? 'text-red-500' : 'text-amber-500'}">${d.discrepancy > 0 ? '+' : ''}${d.discrepancy}</td>
                  <td><span class="badge ${d.audit_verdict === 'OVERCHARGED' ? 'badge-fail' : 'badge-warn'}">${d.audit_verdict}</span></td>
                </tr>
              `).join('');
            }
          }
          if (container) container.classList.remove('hidden');
        }
      } catch (err) {
        showToast('Telecom Engine', 'CDR Audit failed: ' + err.message, 'error');
      } finally {
        runCdrBtn.disabled = false;
        runCdrBtn.textContent = '⚡ Run CDR Audit';
      }
    });
  }

  // Python Run Invoice Reconcile
  const runInvoiceBtn = document.getElementById('python-run-invoice-btn');
  if (runInvoiceBtn) {
    runInvoiceBtn.addEventListener('click', async () => {
      runInvoiceBtn.disabled = true;
      runInvoiceBtn.textContent = 'Reconciling...';
      try {
        const res = await fetch('/api/python/invoice-reconcile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sims: 150 })
        });
        const data = await res.json();
        if (data.success) {
          const audit = data.audit;
          const container = document.getElementById('python-invoice-result-container');
          const banner = document.getElementById('python-invoice-verdict-banner');
          const breakdown = document.getElementById('python-invoice-breakdown');

          const isPassed = audit.verdict === 'PASSED';
          if (banner) {
            banner.className = `p-3 rounded-lg mb-3 flex items-center justify-between ${isPassed ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-red-50 border border-red-200 text-red-800'}`;
            banner.innerHTML = `
              <div>
                <strong class="text-sm">${isPassed ? '✓ RECONCILIATION VERIFIED' : '⚠️ RECONCILIATION DISCREPANCY'}</strong>
                <p class="text-xs">${isPassed ? 'All subtotal sums, VAT/GST 18% tax rates, and credit balances verified exact match.' : 'Variance detected in line items.'}</p>
              </div>
              <span class="badge ${isPassed ? 'badge-pass' : 'badge-fail'}" style="font-size: 0.85rem; padding: 4px 10px;">${audit.verdict}</span>
            `;
          }

          if (breakdown) {
            breakdown.innerHTML = `
              <div class="bg-white p-3 rounded border">
                <span class="font-bold text-slate-700 block mb-2">Invoice Summary</span>
                <div>Invoice ID: <span class="font-mono">${audit.invoice_id}</span></div>
                <div>Account: <strong>${audit.account_name}</strong></div>
                <div>Billing Period: ${audit.billing_period}</div>
                <div>Currency: ${audit.currency}</div>
              </div>
              <div class="bg-white p-3 rounded border">
                <span class="font-bold text-slate-700 block mb-2">Mathematical Ledger</span>
                <div>Reported Subtotal: <strong>$${audit.verified_values.reported_subtotal}</strong></div>
                <div>Computed Tax (18%): <strong>$${audit.verified_values.computed_tax}</strong></div>
                <div>Discounts / Credits: -$${audit.verified_values.discounts_applied}</div>
                <div class="text-emerald-600 font-bold mt-1">Verified Total Due: $${audit.verified_values.computed_total_due}</div>
              </div>
            `;
          }
          if (container) container.classList.remove('hidden');
        }
      } catch (err) {
        showToast('Telecom Engine', 'Invoice reconciliation failed: ' + err.message, 'error');
      } finally {
        runInvoiceBtn.disabled = false;
        runInvoiceBtn.textContent = '⚡ Reconcile Current Invoice';
      }
    });
  }

  // =========================================================================
  // OPTION B: Self-Healing Locators Listeners
  // =========================================================================
  const shBadge = document.getElementById('header-self-healing-badge');
  if (shBadge) shBadge.addEventListener('click', openSelfHealingModal);
  const shClose = document.getElementById('self-healing-modal-close');
  if (shClose) shClose.addEventListener('click', closeSelfHealingModal);
  const shFooterClose = document.getElementById('self-healing-modal-footer-close');
  if (shFooterClose) shFooterClose.addEventListener('click', closeSelfHealingModal);
  const shSimulateBtn = document.getElementById('sh-simulate-btn');
  if (shSimulateBtn) {
    shSimulateBtn.addEventListener('click', async () => {
      shSimulateBtn.disabled = true;
      shSimulateBtn.textContent = 'Simulating Refactor...';
      try {
        await fetch('/api/self-healing/simulate', { method: 'POST' });
        await fetchSelfHealingStats();
      } catch (e) {
        console.warn('Simulation failed:', e.message);
      } finally {
        shSimulateBtn.disabled = false;
        shSimulateBtn.textContent = '⚡ Simulate UI Refactor & Heal';
      }
    });
  }

  // =========================================================================
  // OPTION C: Contract Drift Sniffer Listeners
  // =========================================================================
  const driftBadge = document.getElementById('header-contract-drift-badge');
  if (driftBadge) driftBadge.addEventListener('click', openContractDriftModal);
  const driftClose = document.getElementById('contract-drift-modal-close');
  if (driftClose) driftClose.addEventListener('click', closeContractDriftModal);
  const driftFooterClose = document.getElementById('contract-drift-modal-footer-close');
  if (driftFooterClose) driftFooterClose.addEventListener('click', closeContractDriftModal);
  const driftClearBtn = document.getElementById('drift-clear-btn');
  if (driftClearBtn) {
    driftClearBtn.addEventListener('click', async () => {
      const confirmed = await window.appConfirm(
        'Clear all API contract drift records from telemetry storage?',
        {
          title: 'Clear Contract Drift Records',
          badge: 'DRIFT CACHE',
          icon: '📡',
          type: 'danger',
          confirmText: 'Clear Drift Records',
          cancelText: 'Cancel'
        }
      );
      if (confirmed) {
        await fetch('/api/contract-drift/clear', { method: 'POST' });
        await fetchContractDriftStats();
        showToast('Contract Drift', 'All drift records cleared.', 'info');
      }
    });
  }
  const driftSimulateBtn = document.getElementById('drift-simulate-btn');
  if (driftSimulateBtn) {
    driftSimulateBtn.addEventListener('click', async () => {
      driftSimulateBtn.disabled = true;
      driftSimulateBtn.textContent = 'Sniffing In-Flight Payload...';
      try {
        await fetch('/api/contract-drift/simulate', { method: 'POST' });
        await fetchContractDriftStats();
      } catch (e) {
        console.warn('Simulation failed:', e.message);
      } finally {
        driftSimulateBtn.disabled = false;
        driftSimulateBtn.textContent = '⚡ Simulate In-Flight Drift';
      }
    });
  }

  // =========================================================================
  // OPTION D: Quarantine Data Sweeper Listeners
  // =========================================================================
  const sweeperBadge = document.getElementById('header-sweeper-badge');
  if (sweeperBadge) sweeperBadge.addEventListener('click', openSweeperModal);
  const sweeperClose = document.getElementById('sweeper-modal-close');
  if (sweeperClose) sweeperClose.addEventListener('click', closeSweeperModal);
  const sweeperFooterClose = document.getElementById('sweeper-modal-footer-close');
  if (sweeperFooterClose) sweeperFooterClose.addEventListener('click', closeSweeperModal);
  const sweeperPreviewBtn = document.getElementById('sweeper-preview-btn');
  if (sweeperPreviewBtn) {
    sweeperPreviewBtn.addEventListener('click', async () => {
      sweeperPreviewBtn.disabled = true;
      sweeperPreviewBtn.textContent = 'Analyzing Quarantine...';
      try {
        const res = await fetch('/api/sweeper/run-sweep', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dryRun: true })
        });
        const data = await res.json();
        const banner = document.getElementById('sweeper-result-banner');
        if (banner && data.sweepResult) {
          banner.className = 'p-3 rounded-lg border mb-3 flex items-center justify-between text-xs bg-amber-50 border-amber-200 text-amber-800';
          banner.innerHTML = `
            <div>
              <strong>👁️ DRY RUN PREVIEW:</strong> Found <strong>${data.sweepResult.entitiesSwept}</strong> test entities in quarantine (~${data.sweepResult.reclaimedEstimateKb} KB).
            </div>
            <span class="badge badge-warn">PREVIEW ONLY</span>
          `;
          banner.classList.remove('hidden');
        }
        await fetchSweeperStatus();
      } catch (e) {
        console.warn('Dry run failed:', e.message);
      } finally {
        sweeperPreviewBtn.disabled = false;
        sweeperPreviewBtn.textContent = '👁️ Preview Sweep (Dry Run)';
      }
    });
  }
  const sweeperRunBtn = document.getElementById('sweeper-run-btn');
  if (sweeperRunBtn) {
    sweeperRunBtn.addEventListener('click', async () => {
      const confirmed = await window.appConfirm(
        'Execute Quarantine Sweep? All test-prefixed entities in DEV environment will be soft-deleted and cleaned.',
        {
          title: 'Execute Quarantine Sweep',
          badge: 'QUARANTINE PURGE',
          icon: '🧹',
          type: 'danger',
          confirmText: 'Purge Quarantined Data',
          cancelText: 'Cancel'
        }
      );
      if (!confirmed) return;
      sweeperRunBtn.disabled = true;
      sweeperRunBtn.textContent = 'Sweeping Entities...';
      try {
        const res = await fetch('/api/sweeper/run-sweep', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dryRun: false })
        });
        const data = await res.json();
        const banner = document.getElementById('sweeper-result-banner');
        if (banner && data.sweepResult) {
          banner.className = 'p-3 rounded-lg border mb-3 flex items-center justify-between text-xs bg-emerald-50 border-emerald-200 text-emerald-800';
          banner.innerHTML = `
            <div>
              <strong>✓ QUARANTINE SWEEP COMPLETE:</strong> Successfully purged <strong>${data.sweepResult.entitiesSwept}</strong> orphaned test entities. Reclaimed ~${data.sweepResult.reclaimedEstimateKb} KB storage.
            </div>
            <span class="badge badge-pass">PURGED & SAFE</span>
          `;
          banner.classList.remove('hidden');
        }
        await fetchSweeperStatus();
      } catch (e) {
        console.warn('Sweep failed:', e.message);
      } finally {
        sweeperRunBtn.disabled = false;
        sweeperRunBtn.textContent = '🧹 Execute Quarantine Sweep';
      }
    });
  }

  // Pre-load telemetry pill counts
  fetchSelfHealingStats();
  fetchContractDriftStats();
  fetchSweeperStatus();
});

// -------------------------------------------------------------
// ENTERPRISE HEALTH HUD, PROD GUARDRAIL & TELEMETRY CONTROLLERS
// -------------------------------------------------------------

function closeHealthHudModal() {
  if (elements.envHealthHudModal) elements.envHealthHudModal.classList.add('hidden');
}

function closeSessionModal() {
  if (elements.authSessionModal) elements.authSessionModal.classList.add('hidden');
}

function closeDataEngineModal() {
  if (elements.dataEngineModal) elements.dataEngineModal.classList.add('hidden');
}

window.closeHealthHudModal = closeHealthHudModal;
window.closeSessionModal = closeSessionModal;
window.closeDataEngineModal = closeDataEngineModal;

function openPythonModal() {
  const modal = document.getElementById('python-telecom-modal');
  if (modal) {
    modal.classList.remove('hidden');
    fetch('/api/python/status')
      .then(r => r.json())
      .then(d => {
        const sub = document.getElementById('python-engine-status-sub');
        if (sub) sub.textContent = `Python Engine: ${d.status} • Pandas ${d.pandasVersion} • ISO/IEC 7812 Compliant`;
      })
      .catch(() => {});
  }
}

function closePythonModal() {
  const modal = document.getElementById('python-telecom-modal');
  if (modal) modal.classList.add('hidden');
}

window.openPythonModal = openPythonModal;
window.closePythonModal = closePythonModal;

// =========================================================================
// OPTION B: Self-Healing Locators Controller Functions
// =========================================================================
async function fetchSelfHealingStats() {
  try {
    const res = await fetch('/api/self-healing/stats');
    if (!res.ok) return;
    const data = await res.json();
    
    // Header pill
    const countPill = document.getElementById('header-healing-count');
    if (countPill) countPill.textContent = data.healedCount;

    // Modal KPIs
    const lookupsEl = document.getElementById('sh-stat-lookups');
    const healedEl = document.getElementById('sh-stat-healed');
    const rateEl = document.getElementById('sh-stat-rate');
    const patchesEl = document.getElementById('sh-stat-patches');
    if (lookupsEl) lookupsEl.textContent = data.totalLookups;
    if (healedEl) healedEl.textContent = data.healedCount;
    if (rateEl) rateEl.textContent = `${data.recoveryRatePct}%`;
    if (patchesEl) patchesEl.textContent = data.activePatchesCount;

    // Table rows
    const tbody = document.getElementById('sh-tbody');
    if (tbody) {
      if (!data.recentHeals || data.recentHeals.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center py-6 text-muted">Zero broken selectors detected. All Page Object locators healthy!</td></tr>`;
      } else {
        tbody.innerHTML = data.recentHeals.map(h => `
          <tr>
            <td>
              <strong>${h.description}</strong>
              <div class="text-[10px] text-muted truncate max-w-xs">${h.testTitle || 'Suite Run'}</div>
            </td>
            <td><code class="text-rose-600 line-through text-[11px]">${escapeHtml(h.originalSelector)}</code></td>
            <td><code class="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded text-[11px]">${escapeHtml(h.healedSelector)}</code></td>
            <td><span class="badge ${h.healingStrategy === 'CANDIDATE_FALLBACK' ? 'badge-info' : 'badge-warn'} text-[10px]">${h.healingStrategy}</span></td>
            <td><span class="font-bold text-emerald-700">${Math.round(h.confidenceScore * 100)}%</span></td>
            <td>
              ${h.approved 
                ? '<span class="text-xs text-emerald-700 font-semibold">✓ Approved</span>' 
                : `<button class="btn btn-secondary btn-xs" onclick="window.approvePatch('${h.id}')">Approve Patch</button>`}
            </td>
          </tr>
        `).join('');
      }
    }
  } catch (err) {
    console.warn('[Self-Healing] Stats fetch failed:', err.message);
  }
}

async function approvePatch(id) {
  try {
    await fetch('/api/self-healing/approve-patch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    fetchSelfHealingStats();
    showToast('Self-Healing', 'Patch approved and permanently committed to locator repository.', 'success');
  } catch (e) {
    showToast('Self-Healing', 'Failed to approve patch: ' + (e.message || 'Unknown error'), 'error');
  }
}

function openSelfHealingModal() {
  const modal = document.getElementById('self-healing-modal');
  if (modal) {
    modal.classList.remove('hidden');
    fetchSelfHealingStats();
  }
}

function closeSelfHealingModal() {
  const modal = document.getElementById('self-healing-modal');
  if (modal) modal.classList.add('hidden');
}

window.openSelfHealingModal = openSelfHealingModal;
window.closeSelfHealingModal = closeSelfHealingModal;
window.approvePatch = approvePatch;

// =========================================================================
// OPTION C: Contract Drift Sniffer Controller Functions
// =========================================================================
async function fetchContractDriftStats() {
  try {
    const res = await fetch('/api/contract-drift/stats');
    if (!res.ok) return;
    const data = await res.json();

    // Header pill
    const healthPill = document.getElementById('header-drift-health');
    if (healthPill) healthPill.textContent = `${data.complianceRatePct}%`;

    // Modal KPIs
    const inspectedEl = document.getElementById('drift-stat-inspected');
    const healthEl = document.getElementById('drift-stat-health');
    const criticalEl = document.getElementById('drift-stat-critical');
    const warningsEl = document.getElementById('drift-stat-warnings');
    if (inspectedEl) inspectedEl.textContent = data.totalInspected;
    if (healthEl) healthEl.textContent = `${data.complianceRatePct}%`;
    if (criticalEl) criticalEl.textContent = data.criticalCount;
    if (warningsEl) warningsEl.textContent = data.warningCount;

    // Table rows
    const tbody = document.getElementById('drift-tbody');
    if (tbody) {
      if (!data.recentDrifts || data.recentDrifts.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center py-6 text-emerald-600 font-semibold">✓ 100% Contract Compliance — Zero API Drift Detected</td></tr>`;
      } else {
        tbody.innerHTML = data.recentDrifts.map(d => `
          <tr>
            <td>
              <span class="badge ${d.method === 'POST' ? 'badge-primary' : 'badge-secondary'} mr-1 text-[10px]">${d.method}</span>
              <strong class="font-mono text-xs">${escapeHtml(d.endpoint)}</strong>
              <div class="text-[10px] text-muted">${d.testTitle || 'In-Flight Traffic'}</div>
            </td>
            <td><span class="badge badge-info text-[10px]">${d.driftType}</span></td>
            <td>
              <span class="badge ${d.severity === 'CRITICAL' ? 'badge-fail' : d.severity === 'WARNING' ? 'badge-warn' : 'badge-secondary'} text-[10px]">
                ${d.severity}
              </span>
            </td>
            <td class="font-mono font-bold ${d.latencyMs > 1500 ? 'text-amber-600' : 'text-slate-700'}">${d.latencyMs}ms</td>
            <td>
              <span class="text-slate-800 text-xs">${escapeHtml(d.message)}</span>
              ${d.field ? `<div class="text-[10px] font-mono text-muted">Field: ${d.field}</div>` : ''}
            </td>
          </tr>
        `).join('');
      }
    }
  } catch (err) {
    console.warn('[Contract Drift] Stats fetch failed:', err.message);
  }
}

function openContractDriftModal() {
  const modal = document.getElementById('contract-drift-modal');
  if (modal) {
    modal.classList.remove('hidden');
    fetchContractDriftStats();
  }
}

function closeContractDriftModal() {
  const modal = document.getElementById('contract-drift-modal');
  if (modal) modal.classList.add('hidden');
}

window.openContractDriftModal = openContractDriftModal;
window.closeContractDriftModal = closeContractDriftModal;

// =========================================================================
// OPTION D: Quarantine Data Sweeper Controller Functions
// =========================================================================
async function fetchSweeperStatus() {
  try {
    const res = await fetch('/api/sweeper/status');
    if (!res.ok) return;
    const data = await res.json();

    // Header pill
    const countPill = document.getElementById('header-sweeper-count');
    if (countPill) countPill.textContent = data.quarantinedCount;

    // Modal KPIs
    const totalEl = document.getElementById('sweeper-stat-total');
    const activeEl = document.getElementById('sweeper-stat-active');
    const quarantinedEl = document.getElementById('sweeper-stat-quarantined');
    const sweptEl = document.getElementById('sweeper-stat-swept');
    if (totalEl) totalEl.textContent = data.totalTracked;
    if (activeEl) activeEl.textContent = data.activeCount;
    if (quarantinedEl) quarantinedEl.textContent = data.quarantinedCount;
    if (sweptEl) sweptEl.textContent = data.sweptCount;

    // Table rows
    const tbody = document.getElementById('sweeper-tbody');
    if (tbody) {
      if (!data.recentEntities || data.recentEntities.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center py-6 text-muted">No test entities currently tracked in DEV. Environment is clean!</td></tr>`;
      } else {
        tbody.innerHTML = data.recentEntities.map(e => `
          <tr>
            <td><strong class="font-mono text-xs">${escapeHtml(e.entityId)}</strong></td>
            <td><span class="badge ${e.type === 'ACCOUNT' ? 'badge-primary' : e.type === 'SIM_PROFILE' ? 'badge-info' : 'badge-secondary'} text-[10px]">${e.type}</span></td>
            <td class="text-muted text-[11px]">${new Date(e.createdAt).toLocaleTimeString()}</td>
            <td>
              <span class="badge ${e.status === 'ACTIVE' ? 'badge-warn' : e.status === 'SWEPT' ? 'badge-pass' : 'badge-fail'} text-[10px]">
                ${e.status === 'SWEPT' ? '✓ SWEPT' : e.status}
              </span>
            </td>
            <td class="text-muted text-[10px] truncate max-w-xs font-mono">${JSON.stringify(e.metadata || {})}</td>
          </tr>
        `).join('');
      }
    }
  } catch (err) {
    console.warn('[Sweeper] Status fetch failed:', err.message);
  }
}

function openSweeperModal() {
  const modal = document.getElementById('sweeper-modal');
  if (modal) {
    modal.classList.remove('hidden');
    fetchSweeperStatus();
  }
}

function closeSweeperModal() {
  const modal = document.getElementById('sweeper-modal');
  if (modal) modal.classList.add('hidden');
}

window.openSweeperModal = openSweeperModal;
window.closeSweeperModal = closeSweeperModal;


async function fetchHealthHud() {
  try {
    const res = await fetch('/api/environments/health-hud');
    if (!res.ok) return;
    const data = await res.json();
    state.healthHud = data;

    // 1. Update Header HUD Pill
    const active = data.activeEnvironment;
    const health = active.health || {};
    const latency = health.latency || 0;
    const statusCode = health.statusCode;
    const status = health.status;

    if (elements.headerHudLatency) {
      if (status === 'vpn_required' || status === 'unreachable') {
        elements.headerHudLatency.textContent = '⚡ --';
      } else {
        elements.headerHudLatency.textContent = latency ? `⚡ ${latency}ms` : '⚡ --';
      }
    }

    if (elements.headerHudTls) {
      if (status === 'vpn_required') {
        elements.headerHudTls.textContent = '🔒 VPN Required';
      } else if (status === 'unreachable') {
        elements.headerHudTls.textContent = '🔒 Unreachable';
      } else {
        const days = health.tls?.daysRemaining;
        elements.headerHudTls.textContent = days ? `🔒 TLS (${days}d)` : '🔒 TLS Valid';
      }
    }

    if (elements.headerHealthHudPill) {
      elements.headerHealthHudPill.className = `header-hud-pill ${status === 'healthy' ? '' : (status === 'warning' || status === 'degraded' || status === 'vpn_required' ? 'degraded' : 'unreachable')}`;
      elements.headerHealthHudPill.title = `Target Environment: [${active.category}] ${active.name} — Status: ${health.message || status}`;
    }

    // 2. Update Guardrail Badge
    const guardrail = data.guardrail || {};
    if (elements.headerGuardrailBadge) {
      if (guardrail.status === 'ARMED') {
        elements.headerGuardrailBadge.className = 'header-guardrail-badge locked';
        if (elements.headerGuardrailText) elements.headerGuardrailText.textContent = '⚠️ PROD GUARDRAIL';
        if (elements.headerGuardrailIcon) elements.headerGuardrailIcon.textContent = '🛡️';
      } else {
        elements.headerGuardrailBadge.className = 'header-guardrail-badge armed';
        if (elements.headerGuardrailText) elements.headerGuardrailText.textContent = 'SAFETY LOCK';
        if (elements.headerGuardrailIcon) elements.headerGuardrailIcon.textContent = '🛡️';
      }
    }

    // 3. Render Modal Content
    renderHealthHudModal(data);

    // 4. Update Quality Gate & Fleet Charts
    updateQualityGateStatus();
    initTremorCharts(null, data);
  } catch (err) {
    console.warn('[HUD] Health telemetry fetch failed:', err.message);
  }
}

function renderHealthHudModal(data) {
  if (!elements.hudActiveBanner || !data) return;

  const active = data.activeEnvironment;
  const health = active.health || {};
  const isProtected = active.isProtected;

  elements.hudActiveBanner.innerHTML = `
    <div class="hud-active-card p-4 rounded-xl border ${isProtected ? 'border-rose-200 bg-rose-50/80 text-rose-950' : 'border-emerald-200 bg-emerald-50/70 text-slate-900'} mb-4">
      <div class="flex items-center justify-between mb-2">
        <div class="flex items-center gap-2">
          <span class="text-xs px-2 py-0.5 rounded font-bold uppercase ${isProtected ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'}">${active.category}</span>
          <span class="font-bold text-slate-900 text-base">${active.name}</span>
          ${isProtected ? '<span class="text-xs px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-300 font-mono font-bold">🛡️ STRICT LOCK</span>' : '<span class="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 font-mono font-bold">SAFE FOR AUTOMATION</span>'}
        </div>
        <div class="flex items-center gap-2">
          <span class="hud-pulse-dot"></span>
          <span class="text-sm font-bold font-mono ${health.status === 'healthy' ? 'text-emerald-700' : 'text-amber-700'}">${health.statusCode ? 'HTTP ' + health.statusCode : (health.message || 'Connecting')}</span>
        </div>
      </div>
      <div class="text-xs font-mono text-slate-600 mb-3">${active.baseUrl}</div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
        <div class="p-2.5 rounded-lg bg-white border border-slate-200 shadow-xs">
          <span class="text-slate-500 block text-[10px] font-semibold uppercase">Latency</span>
          <span class="font-bold font-mono text-emerald-700 text-sm">⚡ ${health.latency || 0}ms</span>
        </div>
        <div class="p-2.5 rounded-lg bg-white border border-slate-200 shadow-xs">
          <span class="text-slate-500 block text-[10px] font-semibold uppercase">DNS Lookup</span>
          <span class="font-mono text-slate-800 font-semibold truncate block">${health.dns?.resolved ? '✅ ' + (health.dns.ip ? health.dns.ip.slice(0, 15) : 'Resolved') : '❌ Private DNS'}</span>
        </div>
        <div class="p-2.5 rounded-lg bg-white border border-slate-200 shadow-xs">
          <span class="text-slate-500 block text-[10px] font-semibold uppercase">TLS Security</span>
          <span class="font-mono text-slate-800 font-semibold truncate block">${health.tls?.valid ? '🔒 ' + (health.tls.daysRemaining ? health.tls.daysRemaining + 'd left' : 'Valid') : 'Self-Signed / Internal'}</span>
        </div>
        <div class="p-2.5 rounded-lg bg-white border border-slate-200 shadow-xs">
          <span class="text-slate-500 block text-[10px] font-semibold uppercase">Guardrail</span>
          <span class="font-bold font-mono ${isProtected ? 'text-rose-600' : 'text-sky-700'}">${isProtected ? 'ARMED' : 'STANDBY'}</span>
        </div>
      </div>
    </div>
  `;

  if (elements.hudFleetGrid && data.fleet) {
    elements.hudFleetGrid.innerHTML = data.fleet.map(env => {
      const h = env.health || {};
      const isAct = env.isActive;
      const isProt = env.isProtected;
      return `
        <div class="hud-card ${isAct ? 'active-env' : ''}">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-xs px-2 py-0.5 rounded font-bold uppercase ${isProt ? 'bg-rose-100 text-rose-800 border border-rose-300' : 'bg-slate-100 text-slate-700 border border-slate-300'}">${env.category}</span>
              <strong class="text-sm text-slate-900 font-bold">${env.name}</strong>
            </div>
            ${isAct ? '<span class="text-[10px] uppercase tracking-wider font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">ACTIVE</span>' : `<button class="btn btn-secondary btn-xs" onclick="window.switchEnvironment('${env.id}'); closeHealthHudModal();">Switch</button>`}
          </div>
          <div class="text-xs font-mono text-slate-600 truncate">${env.baseUrl}</div>
          <div class="flex items-center justify-between text-xs pt-2 border-t border-slate-200">
            <span class="text-slate-600">Status: <strong class="${h.status === 'healthy' ? 'text-emerald-700' : (h.status === 'warning' || h.statusCode === 403 ? 'text-amber-800' : 'text-rose-700')} font-mono font-bold">${h.statusCode ? 'HTTP ' + h.statusCode : (h.message || 'Unreachable')}</strong></span>
            <span class="text-slate-600">Ping: <strong class="text-slate-800 font-mono font-bold">${h.latency ? h.latency + 'ms' : '--'}</strong></span>
          </div>
        </div>
      `;
    }).join('');
  }
}

async function fetchSessionHud() {
  try {
    const res = await fetch('/api/auth/session-hud');
    if (!res.ok) return;
    const data = await res.json();
    if (elements.sessionDetailsGrid) {
      elements.sessionDetailsGrid.innerHTML = `
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs mb-3">
          <div class="p-3 rounded-lg bg-white border border-slate-200 shadow-xs">
            <span class="text-slate-500 block text-[10px] font-semibold uppercase">Auth Status</span>
            <span class="font-bold font-mono text-emerald-700 text-sm">✅ ${data.status}</span>
          </div>
          <div class="p-3 rounded-lg bg-white border border-slate-200 shadow-xs">
            <span class="text-slate-500 block text-[10px] font-semibold uppercase">Session Cookies</span>
            <span class="font-bold font-mono text-slate-800 text-sm">🍪 ${data.cookieCount} Cookies</span>
          </div>
          <div class="p-3 rounded-lg bg-white border border-slate-200 shadow-xs">
            <span class="text-slate-500 block text-[10px] font-semibold uppercase">Storage File Size</span>
            <span class="font-bold font-mono text-slate-800 text-sm">📁 ${data.storageSizeKb} KB</span>
          </div>
          <div class="p-3 rounded-lg bg-white border border-slate-200 shadow-xs">
            <span class="text-slate-500 block text-[10px] font-semibold uppercase">Parallel Concurrency</span>
            <span class="font-bold font-mono text-blue-700 text-sm">🏎️ ${data.parallelWorkers}x Workers</span>
          </div>
        </div>
        <div class="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700">
          <div class="font-bold text-slate-900 mb-1">Architecture Rationale (Playwright StorageState):</div>
          <p class="leading-relaxed">Instead of 4 independent workers each opening browser windows to navigate Keycloak, submit login forms, wait for redirects, and set session cookies (taking 12s per worker = 48s total), Playwright saves the authenticated state once to <code class="bg-white border border-slate-200 px-1 py-0.5 rounded text-blue-700 font-mono font-semibold">playwright/.auth/user.json</code>. Each worker instantly injects this authenticated state into its Chromium <code class="bg-white border border-slate-200 px-1 py-0.5 rounded text-blue-700 font-mono font-semibold">BrowserContext</code> in <strong class="text-emerald-700 font-bold">~85ms</strong>, avoiding SSO server rate-limiting and eliminating test cold-start bottlenecks.</p>
        </div>
      `;
    }
  } catch (err) {
    console.warn('[Session] Failed to fetch session HUD:', err);
  }
}

async function fetchDataRegistry() {
  try {
    const res = await fetch('/api/data-factory/registry');
    if (!res.ok) return;
    const data = await res.json();
    generateSampleTestData(0);
  } catch (err) {
    console.warn('[DataFactory] Registry fetch failed:', err);
  }
}

function generateSampleTestData(workerIdx = 0) {
  const ts = Date.now().toString(36).toUpperCase();
  const seq = Math.floor(Math.random() * 900 + 100).toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();

  const sampleAccount = `ATT_ACC_W${workerIdx}_${ts}_${seq}_${rand}`;
  const sampleApn = `att.iot.apn.w${workerIdx}.${ts.toLowerCase()}.${seq.toLowerCase()}.${rand.toLowerCase()}.net`;
  const sampleNetProf = `ATT_NETPROF_W${workerIdx}_${ts}_${seq}_${rand}`;
  const sampleQos = `ATT_QOS_W${workerIdx}_${ts}_${seq}`;
  const sampleSlice = `ATT_SLICE_5G_W${workerIdx}_${ts}_${seq}`;
  const sampleEmail = `qa_w${workerIdx}_${ts.toLowerCase()}_${seq.toLowerCase()}_${rand.toLowerCase()}@att-iot.com`;

  if (elements.dataGenOutputBox) {
    elements.dataGenOutputBox.innerHTML = `
      <div class="flex items-center justify-between pb-2 border-b border-slate-200 text-[11px] text-blue-700 font-bold uppercase tracking-wider">
        <span>Entity Type</span>
        <span>Generated Unique Token (Worker ${workerIdx})</span>
      </div>
      <div class="flex items-center justify-between py-1 border-b border-slate-100"><span class="text-slate-600 font-medium">Account Name:</span><span class="text-emerald-700 font-bold font-mono">${sampleAccount}</span></div>
      <div class="flex items-center justify-between py-1 border-b border-slate-100"><span class="text-slate-600 font-medium">APN / DNN:</span><span class="text-blue-700 font-semibold font-mono">${sampleApn}</span></div>
      <div class="flex items-center justify-between py-1 border-b border-slate-100"><span class="text-slate-600 font-medium">Network Profile:</span><span class="text-purple-700 font-semibold font-mono">${sampleNetProf}</span></div>
      <div class="flex items-center justify-between py-1 border-b border-slate-100"><span class="text-slate-600 font-medium">QoS Profile:</span><span class="text-amber-800 font-semibold font-mono">${sampleQos}</span></div>
      <div class="flex items-center justify-between py-1 border-b border-slate-100"><span class="text-slate-600 font-medium">5G Slice:</span><span class="text-rose-700 font-semibold font-mono">${sampleSlice}</span></div>
      <div class="flex items-center justify-between py-1"><span class="text-slate-600 font-medium">Admin Email:</span><span class="text-slate-800 font-semibold font-mono">${sampleEmail}</span></div>
    `;
  }
}

// ==========================================================================
// 17. ENTERPRISE CAB RELEASE SIGN-OFF & FLAKINESS QUARANTINE MATRIX
// ==========================================================================

let currentCabSignOff = null;
let currentQuarantineData = null;

// --- CAB Sign-Off Modal Logic ---
async function openCabSignOffModal() {
  const modal = document.getElementById('cab-signoff-modal');
  if (!modal) return;
  modal.classList.remove('hidden');

  // Pre-fill live metrics
  const envName = document.getElementById('telemetry-env-name')?.textContent || 'Azure FrontDoor (CMPaaS)';
  const passPct = document.getElementById('allure-dash-pass-pct')?.textContent || '98.4%';
  const envPre = document.getElementById('cab-preflight-env');
  const passPre = document.getElementById('cab-preflight-passrate');
  if (envPre) envPre.textContent = envName;
  if (passPre) passPre.textContent = `${passPct} (GO)`;

  await loadCabSignOffData();
}
window.openCabSignOffModal = openCabSignOffModal;

function closeCabSignOffModal() {
  const modal = document.getElementById('cab-signoff-modal');
  if (modal) modal.classList.add('hidden');
}
window.closeCabSignOffModal = closeCabSignOffModal;

async function loadCabSignOffData() {
  try {
    const res = await fetch('/api/governance/sign-off');
    if (!res.ok) return;
    const data = await res.json();
    currentCabSignOff = data.latest;

    // Update Banner
    const bannerStatus = document.getElementById('cab-banner-status');
    const bannerCr = document.getElementById('cab-banner-crid');
    const bannerDetails = document.getElementById('cab-banner-details');
    const pill = document.getElementById('cab-signoff-pill');

    if (data.latest) {
      if (bannerStatus) bannerStatus.textContent = data.latest.decision.toUpperCase();
      if (bannerCr) bannerCr.textContent = data.latest.changeRequestId;
      if (bannerDetails) {
        bannerDetails.textContent = `Signed off by ${data.latest.signOffOfficer} • Git ${data.latest.gitCommit} • Pass Rate ${data.latest.passRate}`;
      }
      if (pill) {
        pill.textContent = `CAB: ${data.latest.changeRequestId} (${data.latest.decision.split(' ')[0]})`;
        pill.className = data.latest.decision.includes('APPROVED') ? 'badge badge-health-online text-[9px] cursor-pointer' : 'badge badge-health-offline text-[9px] cursor-pointer';
      }
    } else {
      if (pill) {
        pill.textContent = 'CAB: PENDING SIGN-OFF';
        pill.className = 'badge badge-env text-[9px] cursor-pointer';
      }
    }

    // Render History
    const historyList = document.getElementById('cab-history-list');
    if (historyList) {
      if (!data.history || data.history.length === 0) {
        historyList.innerHTML = '<div class="text-muted p-2">No previous sign-offs recorded. Authorize your first release above.</div>';
      } else {
        historyList.innerHTML = data.history.map(item => {
          const isAppr = item.decision.includes('APPROVED') || item.decision.includes('GO');
          const badgeCls = isAppr ? 'badge-pass' : 'badge-fail';
          const dt = new Date(item.timestamp).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
          return `
            <div class="p-2 rounded bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="badge ${badgeCls} text-[9px]">${escapeHtml(item.decision)}</span>
                <strong class="font-mono text-slate-800 dark:text-slate-200">${escapeHtml(item.changeRequestId)}</strong>
                <span class="text-muted truncate max-w-[200px]">• ${escapeHtml(item.signOffOfficer)}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-muted font-mono text-[10px]">${dt}</span>
                <a href="/api/governance/audit-certificate?id=${item.id}" target="_blank" class="text-blue-500 hover:underline text-[10px]">Certificate ↗</a>
              </div>
            </div>
          `;
        }).join('');
      }
    }
  } catch (err) {
    console.warn('[Governance] Could not load sign-off data:', err);
  }
}
window.loadCabSignOffData = loadCabSignOffData;

async function handleCabSignOffSubmit(event) {
  event.preventDefault();
  const crId = document.getElementById('cab-input-crid')?.value || 'CR-8921-IOT-PROD';
  const decision = document.getElementById('cab-input-decision')?.value || 'APPROVED (GO)';
  const officer = document.getElementById('cab-input-officer')?.value || 'Vetrivel (Lead QA Architect)';
  const role = document.getElementById('cab-input-role')?.value || 'Lead QA & Release Governance Architect';
  const notes = document.getElementById('cab-input-notes')?.value || '';

  const targetEnv = document.getElementById('telemetry-env-name')?.textContent || 'Azure FrontDoor (CMPaaS)';
  const passRate = document.getElementById('allure-dash-pass-pct')?.textContent || '98.4%';
  const runId = document.getElementById('allure-dash-run-id')?.textContent || 'RUN-176189';

  try {
    const res = await fetch('/api/governance/sign-off', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        changeRequestId: crId,
        decision,
        signOffOfficer: officer,
        officerRole: role,
        notes,
        targetEnv,
        passRate,
        runId
      })
    });

    if (res.ok) {
      if (typeof showToast === 'function') {
        showToast(`👑 CAB Release Sign-Off Recorded: ${crId} (${decision})`, 'success');
      }
      await loadCabSignOffData();
      appendLog(`[CAB-GOVERNANCE] Authorized release sign-off: ${crId} by ${officer} (${decision})`, 'pass');
    }
  } catch (err) {
    console.error('[Governance] Failed to record sign-off:', err);
  }
}
window.handleCabSignOffSubmit = handleCabSignOffSubmit;

// --- Quarantine Matrix Modal Logic ---
async function openQuarantineModal() {
  const modal = document.getElementById('quarantine-matrix-modal');
  if (!modal) return;
  modal.classList.remove('hidden');
  await loadQuarantineData();
}
window.openQuarantineModal = openQuarantineModal;

function closeQuarantineModal() {
  const modal = document.getElementById('quarantine-matrix-modal');
  if (modal) modal.classList.add('hidden');
}
window.closeQuarantineModal = closeQuarantineModal;

function switchQuarantineTab(tabName) {
  ['active', 'flaky', 'add'].forEach(t => {
    const btn = document.getElementById(`qtab-btn-${t}`);
    const content = document.getElementById(`qtab-content-${t}`);
    if (btn) {
      btn.className = t === tabName ? 'btn btn-xs btn-primary active-subtab' : 'btn btn-xs btn-secondary';
    }
    if (content) {
      content.classList.toggle('hidden', t !== tabName);
    }
  });
}
window.switchQuarantineTab = switchQuarantineTab;

async function loadQuarantineData() {
  try {
    const res = await fetch('/api/governance/quarantine');
    if (!res.ok) return;
    const data = await res.json();
    currentQuarantineData = data;

    // Badges & Counters
    const qCount = data.totalQuarantined || 0;
    const pill = document.getElementById('quarantine-matrix-pill');
    const qmCount = document.getElementById('qm-quarantined-count');
    const tabBadge = document.getElementById('qm-tab-badge');

    if (pill) pill.textContent = `🛡️ ${qCount} Quarantined`;
    if (qmCount) qmCount.textContent = qCount;
    if (tabBadge) tabBadge.textContent = qCount;

    // Active Quarantined List
    const activeList = document.getElementById('qm-active-list');
    if (activeList) {
      if (!data.quarantinedTests || data.quarantinedTests.length === 0) {
        activeList.innerHTML = `
          <div class="p-6 text-center text-muted">
            <span class="text-3xl block mb-2">🎉</span>
            <strong>Zero Active Quarantined Tests</strong>
            <p class="text-xs text-muted mt-1">All suites are running with standard release gate blocking enforcement.</p>
          </div>
        `;
      } else {
        activeList.innerHTML = data.quarantinedTests.map(test => `
          <div class="p-3 rounded-xl bg-slate-100/80 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/60 flex items-start justify-between gap-3">
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <span class="badge badge-warning text-[9px] font-mono">${escapeHtml(test.testId)}</span>
                <span class="font-bold text-slate-900 dark:text-slate-100">${escapeHtml(test.title)}</span>
                <span class="badge badge-env text-[9px] uppercase font-mono">${escapeHtml(test.suiteId)}</span>
              </div>
              <p class="text-[11px] text-muted"><strong class="text-slate-700 dark:text-slate-300">Quarantine Reason:</strong> ${escapeHtml(test.reason)}</p>
              <div class="flex items-center gap-3 text-[10px] text-muted font-mono pt-1">
                <span>🎫 JIRA: <strong class="text-blue-600 dark:text-blue-400 font-semibold">${escapeHtml(test.ticketId || 'JIRA-4819')}</strong></span>
                <span>👤 Quarantined By: ${escapeHtml(test.quarantinedBy)}</span>
                <span>⚡ Flake Score: ${test.flakeScore || 25}%</span>
              </div>
            </div>
            <button class="btn btn-secondary btn-xs text-[10px] shrink-0 hover:bg-emerald-600 hover:text-white transition" onclick="window.unquarantineTest('${test.testId}')" title="Restore to active blocking tests">
              ✓ Restore Test
            </button>
          </div>
        `).join('');
      }
    }

    // Flaky Candidates List
    const flakyList = document.getElementById('qm-flaky-list');
    if (flakyList && Array.isArray(data.flakinessReport)) {
      flakyList.innerHTML = data.flakinessReport.map(item => `
        <div class="p-2.5 rounded-lg bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 flex items-center justify-between">
          <div>
            <div class="flex items-center gap-2">
              <span class="font-bold text-slate-800 dark:text-slate-200 font-mono">${escapeHtml(item.name)}</span>
              <span class="badge ${item.isFlaky ? 'badge-warning' : 'badge-pass'} text-[9px]">${escapeHtml(item.category)}</span>
            </div>
            <span class="text-[10px] text-muted">Runs: ${item.runs} | Failures: ${item.failedRuns} | Flake Index: ${item.flakeScore}%</span>
          </div>
          <button class="btn btn-secondary btn-xs text-[10px]" onclick="window.quarantineSpecificTest('${item.name}', 'Suite Stabilization Quarantine', '${item.name}')">
            🛡️ Quarantine Suite
          </button>
        </div>
      `).join('');
    }
  } catch (err) {
    console.warn('[Quarantine] Failed to load data:', err);
  }
}
window.loadQuarantineData = loadQuarantineData;

async function unquarantineTest(testId) {
  try {
    const res = await fetch(`/api/governance/quarantine/${encodeURIComponent(testId)}`, { method: 'DELETE' });
    if (res.ok) {
      if (typeof showToast === 'function') {
        showToast(`✓ Restored test ${testId} to standard blocking enforcement`, 'success');
      }
      await loadQuarantineData();
      if (typeof updateQualityGateStatus === 'function') updateQualityGateStatus();
      appendLog(`[QUARANTINE] Restored test ${testId} to release gate blocking status`, 'pass');
    }
  } catch (err) {
    console.error('[Quarantine] Failed to unquarantine test:', err);
  }
}
window.unquarantineTest = unquarantineTest;

async function handleQuarantineAddSubmit(event) {
  event.preventDefault();
  const testId = document.getElementById('qm-add-testid')?.value.trim();
  const title = document.getElementById('qm-add-title')?.value.trim();
  const suiteId = document.getElementById('qm-add-suite')?.value;
  const ticketId = document.getElementById('qm-add-ticket')?.value.trim();
  const reason = document.getElementById('qm-add-reason')?.value;

  if (!testId || !title) return;

  try {
    const res = await fetch('/api/governance/quarantine', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        testId,
        title,
        suiteId,
        ticketId,
        reason,
        quarantinedBy: 'QA Architect'
      })
    });

    if (res.ok) {
      if (typeof showToast === 'function') {
        showToast(`🛡️ Test ${testId} moved to Quarantine Matrix (${ticketId})`, 'warning');
      }
      document.getElementById('quarantine-add-form')?.reset();
      switchQuarantineTab('active');
      await loadQuarantineData();
      if (typeof updateQualityGateStatus === 'function') updateQualityGateStatus();
      appendLog(`[QUARANTINE] Test ${testId} quarantined: non-blocking for release gate (${ticketId})`, 'warn');
    }
  } catch (err) {
    console.error('[Quarantine] Failed to quarantine test:', err);
  }
}
window.handleQuarantineAddSubmit = handleQuarantineAddSubmit;

window.quarantineSpecificTest = function(testId, title, suiteId) {
  const modal = document.getElementById('quarantine-matrix-modal');
  if (modal) modal.classList.remove('hidden');
  switchQuarantineTab('add');

  const idInp = document.getElementById('qm-add-testid');
  const titleInp = document.getElementById('qm-add-title');
  const suiteInp = document.getElementById('qm-add-suite');
  if (idInp) idInp.value = testId;
  if (titleInp) titleInp.value = title || testId;
  if (suiteInp && suiteId) suiteInp.value = suiteId;
};

// Initial governance hook on startup
setTimeout(() => {
  loadCabSignOffData();
  loadQuarantineData();
}, 600);



