import type { ApiError } from "./types";

export const RESPONSE_DELAY_MS = 1200;

export const delay = (ms = RESPONSE_DELAY_MS) => new Promise((resolve) => setTimeout(resolve, ms));

export const jsonError = (status: number, error: string) => Response.json({ error } satisfies ApiError, { status });

export const HTTP = {
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
} as const;
