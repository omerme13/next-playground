import {
  DEFAULT_RANGE,
  DEFAULT_SORT,
  MIN_SEARCH_CHARS,
  RANGES,
  SORT_DIRS,
  SORT_KEYS,
  TEAM_FILTER_ALL,
  TEAM_FILTERS,
} from "./constants";
import type {
  EmptyReason,
  Learner,
  LearnerRow,
  Range,
  SortDir,
  SortKey,
  TeamFilter,
  UsageSummary,
} from "./types";

export type UsageQuery = {
  range: Range;
  team: TeamFilter;
  q: string;
  sort: SortKey;
  dir: SortDir;
  page: number;
};

const includes = <T extends string>(list: readonly T[], value: string): value is T =>
  (list as readonly string[]).includes(value);

/** Returns the parsed query, or an error message for a 400. */
export function parseUsageQuery(params: URLSearchParams): UsageQuery | { error: string } {
  const range = params.get("range") ?? DEFAULT_RANGE;
  if (!includes(RANGES, range)) return { error: `Invalid range "${range}". Use one of: ${RANGES.join(", ")}` };

  const team = params.get("team") ?? TEAM_FILTER_ALL;
  if (!includes(TEAM_FILTERS, team)) return { error: `Invalid team "${team}"` };

  const sort = params.get("sort") ?? DEFAULT_SORT.key;
  if (!includes(SORT_KEYS, sort)) return { error: `Invalid sort "${sort}"` };

  const dir = params.get("dir") ?? DEFAULT_SORT.dir;
  if (!includes(SORT_DIRS, dir)) return { error: `Invalid dir "${dir}"` };

  const page = Number(params.get("page") ?? 1);
  if (!Number.isInteger(page) || page < 1) return { error: "Invalid page" };

  return { range, team, q: params.get("q") ?? "", sort, dir, page };
}

/** Shared by server and client: does a learner pass the team + search filters? */
export function matchesFilters(learner: Pick<Learner, "name" | "team">, team: TeamFilter, q: string): boolean {
  if (team !== TEAM_FILTER_ALL && learner.team !== team) return false;
  const term = q.trim().toLowerCase();
  if (term.length < MIN_SEARCH_CHARS) return true;
  return learner.name.toLowerCase().includes(term);
}

export function toRow(learner: Learner, range: Range): LearnerRow {
  return {
    id: learner.id,
    name: learner.name,
    team: learner.team,
    level: learner.level,
    minutes: learner.minutesPracticed[range],
    lessons: learner.lessonsCompleted[range],
    lastActiveAt: learner.lastActiveAt,
  };
}

export function summarize(learners: Learner[], range: Range): UsageSummary {
  const minutes = learners.map((l) => l.minutesPracticed[range]);
  const totalMinutes = minutes.reduce((sum, m) => sum + m, 0);
  const activeLearners = minutes.filter((m) => m > 0).length;
  return {
    totalMinutes,
    activeLearners,
    avgMinutesPerActive: activeLearners === 0 ? 0 : Math.round(totalMinutes / activeLearners),
  };
}

/** Filter + sort all learners for the query. Pagination is up to the caller. */
export function queryLearners(
  learners: Learner[],
  query: UsageQuery,
): { rows: LearnerRow[]; emptyReason: EmptyReason } {
  const teamLearners = learners.filter((l) => matchesFilters(l, query.team, ""));
  const teamHasActivity = teamLearners.some((l) => l.minutesPracticed[query.range] > 0);
  if (query.team !== TEAM_FILTER_ALL && !teamHasActivity) return { rows: [], emptyReason: "noActivity" };

  const sign = query.dir === "asc" ? 1 : -1;
  const rows = teamLearners
    .filter((l) => matchesFilters(l, query.team, query.q))
    .map((l) => toRow(l, query.range))
    .sort((a, b) =>
      query.sort === "name" ? sign * a.name.localeCompare(b.name) : sign * (a.minutes - b.minutes) || a.name.localeCompare(b.name),
    );

  return { rows, emptyReason: rows.length === 0 ? "noMatch" : null };
}
