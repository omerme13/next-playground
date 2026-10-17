import type { Range, SortDir, SortKey } from "./types";

export const RANGES = ["7d", "30d", "90d"] as const;
export const DEFAULT_RANGE: Range = "30d";

export const RANGE_LABELS: Record<Range, string> = {
  "7d": "last 7 days",
  "30d": "last 30 days",
  "90d": "last 90 days",
};

export const TEAMS = ["Sales", "Support", "Engineering", "Ops"] as const;
export const TEAM_FILTER_ALL = "All";
export const TEAM_FILTERS = [TEAM_FILTER_ALL, ...TEAMS] as const;

export const LEVELS = ["A2", "B1", "B2", "C1"] as const;

export const SORT_KEYS = ["minutes", "name"] as const;
export const SORT_DIRS = ["asc", "desc"] as const;
export const DEFAULT_SORT: { key: SortKey; dir: SortDir } = {
  key: "minutes",
  dir: "desc",
};

export const PAGE_SIZE = 10;
export const MIN_SEARCH_CHARS = 2;
