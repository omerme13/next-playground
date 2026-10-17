import type { NextRequest } from "next/server";
import { delay, HTTP, jsonError } from "@/lib/api";
import { getDailySeries, getLearner } from "@/lib/seed";
import type { LearnerDetail } from "@/lib/types";

const FAILING_LEARNER_ID = 13;

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await delay();

  const { id: rawId } = await params;
  if (!/^\d+$/.test(rawId)) return jsonError(HTTP.BAD_REQUEST, `Learner id must be numeric, got "${rawId}"`);

  const id = Number(rawId);
  if (id === FAILING_LEARNER_ID) return jsonError(HTTP.SERVER_ERROR, "Failed to load learner");

  const learner = getLearner(id);
  if (!learner) return jsonError(HTTP.NOT_FOUND, `Learner ${id} not found`);

  const body: LearnerDetail = { ...learner, dailyMinutes: getDailySeries(learner) };
  return Response.json(body);
}
