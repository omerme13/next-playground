import { LEVELS, TEAMS } from "./constants";
import type { DailyMinutes, Learner, Team } from "./types";

export const COMPANY_NAME = "Loora";
export const SEATS_PURCHASED = 120;
const LEARNER_COUNT = 48;

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const DETAIL_SERIES_DAYS = 14;
const SILENT_TEAM: Team = "Support"; // no activity at all in 7d
const SILENT_WINDOW_DAYS = 7;
const SILENT_TEAM_LAST_ACTIVE_DAYS_AGO = 10;
const INACTIVE_EVERY_NTH = 11; // every 11th learner has no activity in 30d

const FIRST_NAMES = [
  "Noa", "Liam", "Maya", "Ethan", "Yael", "Omar", "Sara", "Daniel",
  "Lior", "Emma", "Amir", "Tamar", "Ben", "Rina", "Jonah", "Mia",
];
const LAST_NAMES = ["Cohen", "Levi", "Smith", "Garcia", "Mizrahi", "Khan"];

// Deterministic "random" in [0, max) so seed data is stable across reloads.
const pseudo = (seed: number, max: number) => ((seed * 9301 + 49297) % 233280) % max;

const daysAgoIso = (days: number) => new Date(Date.now() - days * MS_PER_DAY).toISOString();

function buildLearner(id: number): Learner {
  const team = TEAMS[id % TEAMS.length];
  const level = LEVELS[pseudo(id, LEVELS.length)];
  const name = `${FIRST_NAMES[id % FIRST_NAMES.length]} ${LAST_NAMES[pseudo(id * 7, LAST_NAMES.length)]}`;

  const silentIn7d = team === SILENT_TEAM;
  const inactiveIn30d = id % INACTIVE_EVERY_NTH === 0;

  const m7 = silentIn7d || inactiveIn30d ? 0 : 10 + pseudo(id * 3, 120);
  const m30 = inactiveIn30d ? 0 : m7 + 30 + pseudo(id * 5, 300);
  const m90 = m30 + 20 + pseudo(id * 13, 500);

  const lessonsFor = (minutes: number) => Math.floor(minutes / 15);

  const lastActiveDaysAgo = inactiveIn30d
    ? 31 + pseudo(id, 40)
    : silentIn7d
      ? SILENT_TEAM_LAST_ACTIVE_DAYS_AGO + pseudo(id, 15)
      : pseudo(id * 17, 6);

  return {
    id,
    name,
    team,
    level,
    minutesPracticed: { "7d": m7, "30d": m30, "90d": m90 },
    lessonsCompleted: { "7d": lessonsFor(m7), "30d": lessonsFor(m30), "90d": lessonsFor(m90) },
    lastActiveAt: daysAgoIso(lastActiveDaysAgo),
  };
}

export const LEARNERS: Learner[] = Array.from({ length: LEARNER_COUNT }, (_, i) => buildLearner(i + 1));

export function getLearner(id: number): Learner | undefined {
  return LEARNERS.find((l) => l.id === id);
}

/** Minutes per day for the last 14 days, oldest first. Silent days are 0. */
export function getDailySeries(learner: Learner): DailyMinutes[] {
  const MAX_DAILY_MINUTES = 40;
  return Array.from({ length: DETAIL_SERIES_DAYS }, (_, i) => {
    const daysAgo = DETAIL_SERIES_DAYS - 1 - i;
    const lastActiveDaysAgo = (Date.now() - Date.parse(learner.lastActiveAt)) / MS_PER_DAY;
    const silent = daysAgo < lastActiveDaysAgo - 1 || (learner.team === SILENT_TEAM && daysAgo < SILENT_WINDOW_DAYS);
    return {
      date: daysAgoIso(daysAgo).slice(0, 10),
      minutes: silent ? 0 : pseudo(learner.id * 31 + i, MAX_DAILY_MINUTES),
    };
  });
}
