import type { LEVELS, RANGES, SORT_DIRS, SORT_KEYS, TEAM_FILTERS, TEAMS } from "./constants";

export type Range = (typeof RANGES)[number];
export type Team = (typeof TEAMS)[number];
export type TeamFilter = (typeof TEAM_FILTERS)[number];
export type Level = (typeof LEVELS)[number];
export type SortKey = (typeof SORT_KEYS)[number];
export type SortDir = (typeof SORT_DIRS)[number];

export type Learner = {
  id: number;
  name: string;
  team: Team;
  level: Level;
  minutesPracticed: Record<Range, number>;
  lessonsCompleted: Record<Range, number>;
  lastActiveAt: string;
};

/** A learner flattened to a single range. */
export type LearnerRow = {
  id: number;
  name: string;
  team: Team;
  level: Level;
  minutes: number;
  lessons: number;
  lastActiveAt: string;
};

export type UsageSummary = {
  totalMinutes: number;
  avgMinutesPerActive: number;
  activeLearners: number;
};

export type EmptyReason = "noMatch" | "noActivity" | null;

export type UsageResponse = {
  company: string;
  seatsPurchased: number;
  seatsUsed: number;
  range: Range;
  summary: UsageSummary;
  rows: LearnerRow[];
  totalRows: number;
  totalPages: number;
  page: number;
  emptyReason: EmptyReason;
};

export type DailyMinutes = { date: string; minutes: number };

export type LearnerDetail = Learner & { dailyMinutes: DailyMinutes[] };

export type ApiError = { error: string };
