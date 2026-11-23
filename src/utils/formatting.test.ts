import { describe, expect, it } from '@jest/globals';
import { formatAnalytics, formatDate, formatDateTime } from './formatting.js';

describe('Rize date formatting', () => {
  it('formats the documented Rize timestamp like its canonical ISO equivalent', () => {
    const rizeTimestamp = '2025-09-05 04:00:00 +0200';
    const canonicalIsoTimestamp = '2025-09-05T04:00:00+02:00';

    expect(formatDateTime(rizeTimestamp)).toBe(
      formatDateTime(canonicalIsoTimestamp)
    );
    expect(formatDateTime(rizeTimestamp)).not.toBe('Invalid DateTime');
  });

  it('accepts whitespace before an already-colonized offset', () => {
    expect(formatDateTime('2025-09-05 04:00:00 +02:00')).toBe(
      formatDateTime('2025-09-05T04:00:00+02:00')
    );
  });

  it('preserves the public invalid-input fallbacks', () => {
    expect(formatDate('not-a-date')).toBe('Invalid Date');
    expect(formatDateTime('not-a-date')).toBe('Invalid DateTime');
  });
});

describe('Rize analytics trend formatting', () => {
  it.each([
    [0.1264, -0.06, 0.7, '+12.6%', '-6.0%', '70.0%'],
    [-0.0001, 0.0001, 0.62, '-0.0%', '+0.0%', '62.0%'],
    [-0, 0, -0, '0.0%', '0.0%', '0.0%'],
  ])('formats relative trends %s and %s with the original signs',
    (focusTime, productivityScore, consistency, focus, score, stable) => {
      expect(formatAnalytics({
        timeframe: 'week',
        trends: { focusTime, productivityScore, consistency },
        insights: [],
        metrics: [],
      })).toBe([
        '📈 Analytics Report (week)', '', '🔄 Trends:',
        `• Focus Time: ${focus}`,
        `• Productivity Score: ${score}`,
        `• Consistency: ${stable}`, '', '',
      ].join('\n'));
    }
  );
});
