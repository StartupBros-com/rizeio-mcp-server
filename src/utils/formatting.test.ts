import { describe, expect, it } from '@jest/globals';
import { formatDate, formatDateTime } from './formatting.js';

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
