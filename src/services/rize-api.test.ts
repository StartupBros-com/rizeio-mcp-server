import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { RizeApiService } from './rize-api.js';

describe('analytics date-only summary windows', () => {
  afterEach(() => { jest.useRealTimers(); });

  // These dates are intentionally constructed in the host's local calendar. Run in UTC
  // and both positive and negative TZs to cover different UTC rollover points.
  it.each([
    { label: 'a day just after local midnight', at: new Date(2026, 10, 22, 0, 15), timeframe: 'day',
      start: '2026-11-22', end: '2026-11-22' },
    { label: 'a day just before local midnight', at: new Date(2026, 10, 28, 23, 45), timeframe: 'day',
      start: '2026-11-28', end: '2026-11-28' },
    { label: 'a North American spring DST Sunday', at: new Date(2026, 2, 8, 23, 45), timeframe: 'week',
      start: '2026-03-08', end: '2026-03-08' },
    { label: 'a week starting on the European DST Sunday', at: new Date(2026, 3, 1, 0, 15), timeframe: 'week',
      start: '2026-03-29', end: '2026-04-01' },
    { label: 'a whole calendar month', at: new Date(2026, 10, 22, 10), timeframe: 'month',
      start: '2026-11-01', end: '2026-11-30' },
    { label: 'a whole leap-year February', at: new Date(2028, 1, 29, 23, 45), timeframe: 'month',
      start: '2028-02-01', end: '2028-02-29' },
  ] as const)('uses local date keys for $label', async ({ at, timeframe, start, end }) => {
    jest.useFakeTimers().setSystemTime(at);
    const service = new RizeApiService('fixture-only');
    const getSummaries = jest.spyOn(service, 'getSummaries').mockResolvedValue([]);

    await service.getAnalytics(timeframe);

    expect(getSummaries).toHaveBeenCalledTimes(1);
    expect(getSummaries).toHaveBeenCalledWith(start, end);
  });
});
