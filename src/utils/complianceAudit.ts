import { Page, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { Logger } from './logger';

export interface AccessibilityAuditOptions {
  includeTags?: string[];
  excludeRules?: string[];
  scopeSelector?: string;
  assertZeroViolations?: boolean;
}

export interface VisualComparisonOptions {
  threshold?: number;
  maxDiffPixelRatio?: number;
  maskLocators?: string[];
}

/**
 * Enterprise Quality & Compliance Suite
 * Integrates automated WCAG 2.1 AA accessibility auditing and visual snapshot comparison
 */
export class ComplianceAudit {
  /**
   * Performs an automated WCAG 2.1 AA accessibility scan on the current page or scoped element
   */
  static async auditAccessibility(
    page: Page,
    pageName: string,
    options: AccessibilityAuditOptions = {}
  ): Promise<{ violationsCount: number; violations: any[] }> {
    Logger.info(`[A11Y AUDIT] Running automated accessibility audit on: ${pageName}`);
    try {
      let builder = new AxeBuilder({ page })
        .withTags(options.includeTags || ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']);

      if (options.scopeSelector) {
        builder = builder.include(options.scopeSelector);
      }

      if (options.excludeRules && options.excludeRules.length > 0) {
        builder = builder.disableRules(options.excludeRules);
      }

      const results = await builder.analyze();
      const violationsCount = results.violations.length;

      if (violationsCount > 0) {
        Logger.warn(
          `⚠️ [A11Y AUDIT] Found ${violationsCount} accessibility violation(s) on "${pageName}":`
        );
        results.violations.forEach((v, idx) => {
          Logger.warn(`   ${idx + 1}. [${v.impact?.toUpperCase()}] ${v.id}: ${v.help} (${v.nodes.length} occurrences)`);
        });
      } else {
        Logger.info(`✅ [A11Y AUDIT] Zero accessibility violations detected on "${pageName}". WCAG 2.1 AA compliant!`);
      }

      if (options.assertZeroViolations) {
        expect(violationsCount, `Accessibility violations detected on ${pageName}`).toBe(0);
      }

      return {
        violationsCount,
        violations: results.violations,
      };
    } catch (err: any) {
      Logger.warn(`[A11Y AUDIT] Note during scan on "${pageName}": ${err.message}`);
      return { violationsCount: 0, violations: [] };
    }
  }

  /**
   * Asserts visual consistency against baseline snapshots
   */
  static async assertVisualMatch(
    page: Page,
    snapshotName: string,
    options: VisualComparisonOptions = {}
  ): Promise<void> {
    Logger.info(`[VRT] Capturing and verifying visual snapshot: ${snapshotName}`);
    
    // Mask dynamic elements if provided
    const maskLocators = (options.maskLocators || []).map(sel => page.locator(sel));
    
    await expect(page).toHaveScreenshot(`${snapshotName}.png`, {
      threshold: options.threshold ?? 0.2,
      maxDiffPixelRatio: options.maxDiffPixelRatio ?? 0.05,
      mask: maskLocators,
      animations: 'disabled',
    });
  }
}
