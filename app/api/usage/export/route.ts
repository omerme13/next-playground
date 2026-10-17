import type { NextRequest } from "next/server";
import { delay, HTTP, jsonError } from "@/lib/api";
import { parseUsageQuery, queryLearners } from "@/lib/query";
import { LEARNERS } from "@/lib/seed";
import type { LearnerRow } from "@/lib/types";

const CSV_HEADERS: { label: string; value: (row: LearnerRow) => string | number }[] = [
  { label: "Name", value: (r) => r.name },
  { label: "Team", value: (r) => r.team },
  { label: "Level", value: (r) => r.level },
  { label: "Minutes", value: (r) => r.minutes },
  { label: "Lessons", value: (r) => r.lessons },
  { label: "Last active", value: (r) => r.lastActiveAt },
];

const escapeCsv = (value: string | number) => {
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

export async function GET(request: NextRequest) {
  await delay();

  const query = parseUsageQuery(request.nextUrl.searchParams);
  if ("error" in query) return jsonError(HTTP.BAD_REQUEST, query.error);

  const { rows } = queryLearners(LEARNERS, query);
  const lines = [
    CSV_HEADERS.map((h) => h.label).join(","),
    ...rows.map((row) => CSV_HEADERS.map((h) => escapeCsv(h.value(row))).join(",")),
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="learners-${query.range}.csv"`,
    },
  });
}
