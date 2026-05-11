export const DEFAULT_SEARCH_MAX_RESULTS = 50;
export const AGGREGATE_SEARCH_MAX_RESULTS = 20;

export const PLATFORM_SEARCH_MAX_RESULTS: Record<string, number> = {
  all: AGGREGATE_SEARCH_MAX_RESULTS,
  arxiv: 25,
  webofscience: DEFAULT_SEARCH_MAX_RESULTS,
  wos: DEFAULT_SEARCH_MAX_RESULTS,
  pubmed: DEFAULT_SEARCH_MAX_RESULTS,
  biorxiv: DEFAULT_SEARCH_MAX_RESULTS,
  medrxiv: DEFAULT_SEARCH_MAX_RESULTS,
  semantic: DEFAULT_SEARCH_MAX_RESULTS,
  iacr: DEFAULT_SEARCH_MAX_RESULTS,
  googlescholar: 20,
  scholar: 20,
  scihub: 10,
  sciencedirect: DEFAULT_SEARCH_MAX_RESULTS,
  springer: DEFAULT_SEARCH_MAX_RESULTS,
  scopus: 25,
  crossref: DEFAULT_SEARCH_MAX_RESULTS
};

export interface LimitNotice {
  field: string;
  requested: number;
  applied: number;
  reason: string;
}

export function getSearchMaxResultsLimit(platform?: string): number {
  return PLATFORM_SEARCH_MAX_RESULTS[platform || ''] ?? DEFAULT_SEARCH_MAX_RESULTS;
}

export function clampSearchMaxResults(
  maxResults: number,
  platform: string | undefined,
  notices: LimitNotice[],
  field = 'maxResults'
): number {
  const limit = getSearchMaxResultsLimit(platform);
  if (maxResults <= limit) {
    return maxResults;
  }

  notices.push({
    field,
    requested: maxResults,
    applied: limit,
    reason:
      platform === 'all'
        ? 'aggregate searches are capped lower to avoid broad multi-platform bursts'
        : `paper-search safety limit for ${platform || 'this platform'}`
  });

  return limit;
}

export function formatLimitNotices(notices: LimitNotice[]): string {
  if (notices.length === 0) {
    return '';
  }

  const lines = notices.map(
    notice =>
      `- ${notice.field}: requested ${notice.requested}, applied ${notice.applied} (${notice.reason})`
  );

  return `MCP safety limits applied:\n${lines.join('\n')}\n\n`;
}
