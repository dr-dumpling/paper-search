import { describe, expect, it } from '@jest/globals';
import {
  clampSearchMaxResults,
  getSearchMaxResultsLimit,
  type LimitNotice
} from '../../src/config/searchLimits.js';

describe('search limits', () => {
  it('uses conservative platform-specific result caps', () => {
    expect(getSearchMaxResultsLimit('all')).toBe(20);
    expect(getSearchMaxResultsLimit('arxiv')).toBe(25);
    expect(getSearchMaxResultsLimit('scopus')).toBe(25);
    expect(getSearchMaxResultsLimit('crossref')).toBe(50);
  });

  it('clamps aggregate searches and records a notice', () => {
    const notices: LimitNotice[] = [];

    const safeMaxResults = clampSearchMaxResults(50, 'all', notices);

    expect(safeMaxResults).toBe(20);
    expect(notices).toHaveLength(1);
    expect(notices[0]).toMatchObject({
      field: 'maxResults',
      requested: 50,
      applied: 20
    });
  });
});
