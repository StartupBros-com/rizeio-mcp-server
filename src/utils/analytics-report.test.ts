import { RizeApiService } from '../services/rize-api.js';
import type { RizeProductivityMetrics } from '../types/rize.js';
import { formatAnalytics } from './formatting.js';

describe('analytics report period metrics', () => {
  function metric(date: string, totalFocusTime: number, productivityScore: number): RizeProductivityMetrics {
    return {
      date, totalFocusTime, productivityScore, focusSessionsCount: 1,
      topCategory: { name: 'Work', timeSpent: totalFocusTime },
      breakTime: 0, distractionTime: 0, contextSwitches: 0
    };
  }

  async function report(metrics: RizeProductivityMetrics[]): Promise<string> {
    const service = new RizeApiService('test-only');
    service.getSummaries = async () => metrics;
    return formatAnalytics(await service.getAnalytics('week'));
  }

  it('reports focus duration and average score, not percentage change', async () => {
    const output = await report([
      metric('2026-01-05', 20, 60),
      metric('2026-01-06', 40, 100)
    ]);
    expect(output).toContain('Total Focus Time: 1h 0m');
    expect(output).toContain('Average Productivity Score: 80.0/100');
    expect(output).toContain('Daily Breakdown:');
    expect(output).not.toMatch(/Trends:|%|Consistency:/);
  });

  it('reports unavailable metrics rather than fabricated zero trends', async () => {
    const output = await report([]);
    expect(output).toContain('No productivity data available for the specified date range.');
    expect(output).not.toMatch(/Trends:|%|Consistency:/);
  });

  it('still reports a real zero when a daily summary exists', async () => {
    const output = await report([metric('2026-01-05', 0, 0)]);
    expect(output).toContain('Total Focus Time: 0m');
    expect(output).toContain('Average Productivity Score: 0.0/100');
    expect(output).not.toContain('No productivity data');
  });
});
