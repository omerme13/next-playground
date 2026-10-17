import type { NextRequest } from "next/server";
import { delay, HTTP, jsonError } from "@/lib/api";
import { parseUsageQuery, queryLearners, summarize } from "@/lib/query";
import { COMPANY_NAME, LEARNERS, SEATS_PURCHASED } from "@/lib/seed";
import { PAGE_SIZE } from "@/lib/constants";
import type { UsageResponse } from "@/lib/types";

export async function GET(request: NextRequest) {
  await delay();

  const query = parseUsageQuery(request.nextUrl.searchParams);
  if ("error" in query) return jsonError(HTTP.BAD_REQUEST, query.error);

  const { rows, emptyReason } = queryLearners(LEARNERS, query);
  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const page = Math.min(query.page, totalPages);
  const start = (page - 1) * PAGE_SIZE;

  const body: UsageResponse = {
    company: COMPANY_NAME,
    seatsPurchased: SEATS_PURCHASED,
    seatsUsed: LEARNERS.length,
    range: query.range,
    summary: summarize(LEARNERS, query.range),
    rows: rows.slice(start, start + PAGE_SIZE),
    totalRows: rows.length,
    totalPages,
    page,
    emptyReason,
  };
  return Response.json(body);
}
