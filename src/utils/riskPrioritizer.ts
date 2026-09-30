import * as fs from 'fs';
import * as path from 'path';

export interface TestCaseMetadata {
  id: string;
  name: string;
  suiteId: string;
  file: string;
  businessCriticality: 'P0_BLOCKER' | 'P1_CRITICAL' | 'P2_HIGH' | 'P3_MEDIUM';
  slaThresholdMs?: number;
}

export interface PrioritizedTestItem extends TestCaseMetadata {
  riskScore: number;
  failureRatePct: number;
  avgDurationMs: number;
  priorityRank: number;
}

/**
 * Enterprise Risk-Based Test Prioritization Engine
 * Dynamically ranks test execution order based on:
 * Risk = (Failure Rate * 0.5) + (Business Criticality * 0.3) + (Execution Velocity * 0.2)
 */
export class RiskPrioritizer {
  private historyPath: string;

  constructor(historyPath?: string) {
    this.historyPath = historyPath || path.resolve(__dirname, '../../reports/execution-history.json');
  }

  private loadHistory(): any[] {
    try {
      if (fs.existsSync(this.historyPath)) {
        return JSON.parse(fs.readFileSync(this.historyPath, 'utf8'));
      }
    } catch {
      // Fallback
    }
    return [];
  }

  /**
   * Evaluates and prioritizes a list of test cases
   */
  prioritize(testCases: TestCaseMetadata[]): PrioritizedTestItem[] {
    const history = this.loadHistory();
    const statsMap: Record<string, { runs: number; fails: number; durations: number[] }> = {};

    history.forEach(h => {
      const suiteName = h.suiteName || '';
      if (!statsMap[suiteName]) {
        statsMap[suiteName] = { runs: 0, fails: 0, durations: [] };
      }
      statsMap[suiteName].runs += 1;
      if (h.exitCode !== 0) statsMap[suiteName].fails += 1;
      if (h.duration) statsMap[suiteName].durations.push(h.duration);
    });

    const scored = testCases.map(tc => {
      const suiteStat = statsMap[tc.name] || statsMap[tc.suiteId] || { runs: 0, fails: 0, durations: [] };
      const failRate = suiteStat.runs > 0 ? (suiteStat.fails / suiteStat.runs) : 0.05;
      const avgDuration = suiteStat.durations.length > 0 
        ? suiteStat.durations.reduce((a, b) => a + b, 0) / suiteStat.durations.length 
        : 5000;

      // Criticality Weight
      let critWeight = 0.5;
      if (tc.businessCriticality === 'P0_BLOCKER') critWeight = 1.0;
      else if (tc.businessCriticality === 'P1_CRITICAL') critWeight = 0.8;
      else if (tc.businessCriticality === 'P2_HIGH') critWeight = 0.6;
      else if (tc.businessCriticality === 'P3_MEDIUM') critWeight = 0.3;

      // Risk score: 0 to 100
      const riskScore = Math.round((failRate * 50) + (critWeight * 35) + (Math.min(avgDuration / 10000, 1) * 15));

      return {
        ...tc,
        riskScore,
        failureRatePct: Math.round(failRate * 100),
        avgDurationMs: Math.round(avgDuration),
        priorityRank: 0,
      };
    });

    // Sort descending by risk score (highest risk first)
    scored.sort((a, b) => b.riskScore - a.riskScore);
    scored.forEach((item, index) => {
      item.priorityRank = index + 1;
    });

    return scored;
  }
}
