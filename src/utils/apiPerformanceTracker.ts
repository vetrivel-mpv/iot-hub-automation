import { Page, Request, Response } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { Logger } from './logger';

export interface ApiCallMetric {
  url: string;
  endpoint: string;
  method: string;
  status: number;
  statusText: string;
  startTime: number;
  endTime: number;
  durationMs: number;
  resourceType: string;
  requestSize?: number;
  responseSize?: number;
  isError: boolean;
  timestamp: string;
  requestHeaders?: Record<string, string>;
  requestPayload?: string | null;
  responseHeaders?: Record<string, string>;
  responseBody?: string | null;
  failureReason?: string | null;
}

export interface ActionPerformanceReport {
  actionName: string;
  startTime: string;
  endTime: string;
  totalActionDurationMs: number;
  totalApisCalled: number;
  successfulApis: number;
  failedApis: number;
  slowestApi?: ApiCallMetric;
  averageApiDurationMs: number;
  performanceRating: 'FAST' | 'ACCEPTABLE' | 'SLOW' | 'CRITICAL';
  apiCalls: ApiCallMetric[];
}

export interface TestSessionPerformanceSummary {
  testId?: string;
  testTitle?: string;
  environment?: string;
  totalActionsMeasured: number;
  totalNetworkCalls: number;
  totalDurationMs: number;
  actions: ActionPerformanceReport[];
}

export class ApiPerformanceTracker {
  private page: Page;
  private isListening: boolean = false;
  private currentActionCalls: ApiCallMetric[] = [];
  private inFlightRequests: Map<Request, { startTime: number; postData: string | null; headers: Record<string, string> }> = new Map();
  private sessionReports: ActionPerformanceReport[] = [];
  private static globalReportsPath = path.resolve(process.cwd(), 'reports/api-performance-metrics.json');

  constructor(page: Page) {
    this.page = page;
    this.initListeners();
  }

  /**
   * Initializes network listeners on the Playwright page instance
   */
  private initListeners(): void {
    if (this.isListening) return;

    this.page.on('request', (request: Request) => {
      const resourceType = request.resourceType();
      const url = request.url();

      // Only monitor relevant XHR, Fetch, Document, and API endpoints
      if (this.shouldTrackRequest(resourceType, url)) {
        let postData: string | null = null;
        try {
          postData = request.postData();
        } catch {
          // ignore
        }

        let headers: Record<string, string> = {};
        try {
          headers = request.headers();
        } catch {
          // ignore
        }

        this.inFlightRequests.set(request, {
          startTime: Date.now(),
          postData,
          headers,
        });
      }
    });

    this.page.on('response', async (response: Response) => {
      const request = response.request();
      const requestInfo = this.inFlightRequests.get(request);

      if (requestInfo !== undefined) {
        const endTime = Date.now();
        const durationMs = Math.max(1, endTime - requestInfo.startTime);
        const url = request.url();
        const status = response.status();
        
        let responseSize = 0;
        let responseHeaders: Record<string, string> = {};
        try {
          responseHeaders = response.headers();
          if (responseHeaders['content-length']) {
            responseSize = parseInt(responseHeaders['content-length'], 10);
          }
        } catch {
          // Response size optional
        }

        let responseBody: string | null = null;
        const contentType = responseHeaders['content-type'] || '';
        if (contentType.includes('json') || contentType.includes('text') || contentType.includes('xml')) {
          try {
            const text = await response.text();
            // Cap at 200KB to avoid excessive memory
            responseBody = text.length > 200000 ? text.slice(0, 200000) + '... [Truncated]' : text;
          } catch {
            // response body might already be disposed
          }
        }

        const metric: ApiCallMetric = {
          url,
          endpoint: this.cleanEndpoint(url),
          method: request.method(),
          status,
          statusText: response.statusText(),
          startTime: requestInfo.startTime,
          endTime,
          durationMs,
          resourceType: request.resourceType(),
          responseSize,
          isError: status >= 400 || status === 0,
          timestamp: new Date(requestInfo.startTime).toISOString(),
          requestHeaders: requestInfo.headers,
          requestPayload: requestInfo.postData,
          responseHeaders,
          responseBody,
          failureReason: status >= 400 ? `HTTP Error ${status}: ${response.statusText()}` : null,
        };

        this.currentActionCalls.push(metric);
        this.inFlightRequests.delete(request);
      }
    });

    this.page.on('requestfailed', (request: Request) => {
      const requestInfo = this.inFlightRequests.get(request);

      if (requestInfo !== undefined) {
        const endTime = Date.now();
        const url = request.url();
        const failure = request.failure();

        const metric: ApiCallMetric = {
          url,
          endpoint: this.cleanEndpoint(url),
          method: request.method(),
          status: 0,
          statusText: failure ? failure.errorText : 'FAILED',
          startTime: requestInfo.startTime,
          endTime,
          durationMs: endTime - requestInfo.startTime,
          resourceType: request.resourceType(),
          isError: true,
          timestamp: new Date(requestInfo.startTime).toISOString(),
          requestHeaders: requestInfo.headers,
          requestPayload: requestInfo.postData,
          failureReason: failure ? failure.errorText : 'Network request failed/aborted',
        };

        this.currentActionCalls.push(metric);
        this.inFlightRequests.delete(request);
      }
    });

    this.isListening = true;
  }

  /**
   * Filter out static assets (images, fonts, stylesheets) unless explicitly needed
   */
  private shouldTrackRequest(resourceType: string, url: string): boolean {
    const isStatic = /\.(png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|css)$/i.test(url.split('?')[0]);
    if (isStatic && resourceType !== 'xhr' && resourceType !== 'fetch') {
      return false;
    }
    // Track fetch, xhr, document, or anything with api/uam/rest/oauth
    return (
      ['xhr', 'fetch', 'document'].includes(resourceType) ||
      /\/api\/|\/uam\/|\/rest\/|\/openid-connect\/|\/auth\//i.test(url)
    );
  }

  private cleanEndpoint(fullUrl: string): string {
    try {
      const parsed = new URL(fullUrl);
      return parsed.pathname + (parsed.search ? parsed.search.slice(0, 50) + '...' : '');
    } catch {
      return fullUrl;
    }
  }

  /**
   * Tracks and measures all network API calls triggered during an asynchronous action (e.g. click, navigation, selection)
   */
  async measureAction<T>(actionName: string, actionFn: () => Promise<T>, settleWaitMs: number = 800): Promise<{ result: T; report: ActionPerformanceReport }> {
    const actionStartTime = Date.now();
    this.currentActionCalls = [];

    Logger.info(`[API Performance] ⏱️ Monitoring Network APIs for action: "${actionName}"...`);

    // Execute the target UI action (click, fill, select, etc.)
    const result = await actionFn();

    // Allow in-flight asynchronous network requests triggered by the action to complete
    if (settleWaitMs > 0) {
      await this.page.waitForTimeout(settleWaitMs);
      await this.page.waitForLoadState('networkidle', { timeout: 3000 }).catch(() => {});
    }

    const actionEndTime = Date.now();
    const totalActionDurationMs = actionEndTime - actionStartTime;

    const calls = [...this.currentActionCalls];
    const totalApisCalled = calls.length;
    const successfulApis = calls.filter(c => !c.isError).length;
    const failedApis = calls.filter(c => c.isError).length;

    let slowestApi: ApiCallMetric | undefined;
    let totalApiTime = 0;

    if (totalApisCalled > 0) {
      slowestApi = calls.reduce((prev, current) => (prev.durationMs > current.durationMs ? prev : current), calls[0]);
      totalApiTime = calls.reduce((sum, c) => sum + c.durationMs, 0);
    }

    const averageApiDurationMs = totalApisCalled > 0 ? Math.round(totalApiTime / totalApisCalled) : 0;

    let performanceRating: 'FAST' | 'ACCEPTABLE' | 'SLOW' | 'CRITICAL' = 'FAST';
    if (totalActionDurationMs > 5000 || (slowestApi && slowestApi.durationMs > 4000)) {
      performanceRating = 'CRITICAL';
    } else if (totalActionDurationMs > 3000 || (slowestApi && slowestApi.durationMs > 2500)) {
      performanceRating = 'SLOW';
    } else if (totalActionDurationMs > 1500 || (slowestApi && slowestApi.durationMs > 1200)) {
      performanceRating = 'ACCEPTABLE';
    }

    const report: ActionPerformanceReport = {
      actionName,
      startTime: new Date(actionStartTime).toISOString(),
      endTime: new Date(actionEndTime).toISOString(),
      totalActionDurationMs,
      totalApisCalled,
      successfulApis,
      failedApis,
      slowestApi,
      averageApiDurationMs,
      performanceRating,
      apiCalls: calls,
    };

    this.sessionReports.push(report);
    this.logReport(report);
    this.persistReports();

    return { result, report };
  }

  /**
   * Logs structured telemetry to console
   */
  private logReport(report: ActionPerformanceReport): void {
    const ratingEmoji = {
      FAST: '⚡ [FAST]',
      ACCEPTABLE: '👌 [ACCEPTABLE]',
      SLOW: '⚠️ [SLOW]',
      CRITICAL: '🚨 [CRITICAL LATENCY]',
    }[report.performanceRating];

    Logger.info(`[API Performance Summary] ${ratingEmoji} Action: "${report.actionName}" | Total Duration: ${report.totalActionDurationMs}ms | APIs Triggered: ${report.totalApisCalled}`);
    
    if (report.totalApisCalled > 0) {
      report.apiCalls.forEach((api, idx) => {
        const statusEmoji = api.isError ? '❌' : '✅';
        Logger.info(`   (${idx + 1}/${report.totalApisCalled}) ${statusEmoji} [${api.method}] ${api.endpoint} -> Status: ${api.status} | Latency: ${api.durationMs}ms`);
      });

      if (report.slowestApi) {
        Logger.info(`   🐢 Bottleneck API: [${report.slowestApi.method}] ${report.slowestApi.endpoint} (${report.slowestApi.durationMs}ms)`);
      }
    } else {
      Logger.info(`   ℹ️ No backend network calls triggered by this action.`);
    }
  }

  /**
   * Persists all recorded performance metrics to JSON artifact for dashboard viewing
   */
  private persistReports(): void {
    try {
      const reportsDir = path.dirname(ApiPerformanceTracker.globalReportsPath);
      if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir, { recursive: true });
      }

      let existingData: ActionPerformanceReport[] = [];
      if (fs.existsSync(ApiPerformanceTracker.globalReportsPath)) {
        try {
          const raw = fs.readFileSync(ApiPerformanceTracker.globalReportsPath, 'utf8');
          existingData = JSON.parse(raw);
        } catch {
          existingData = [];
        }
      }

      // Merge and keep the latest 500 action measurements
      const merged = [...existingData, ...this.sessionReports.slice(-1)];
      const trimmed = merged.slice(-500);

      fs.writeFileSync(ApiPerformanceTracker.globalReportsPath, JSON.stringify(trimmed, null, 2), 'utf8');
    } catch (err) {
      Logger.warn(`Failed to persist API performance metrics: ${err}`);
    }
  }

  /**
   * Gets all reports recorded in the current session
   */
  getSessionReports(): ActionPerformanceReport[] {
    return this.sessionReports;
  }
}
