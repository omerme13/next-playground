import { useEffect, useState } from "react";
import type { ApiError } from "@/lib/types";

type Result<T> = { key: string; data: T | null; error: string | null };

/**
 * Fetches JSON for `url` and aborts the previous request when `url` changes,
 * so a slow stale response can never overwrite a newer one.
 * `loading` is derived: true until the result for the current url/attempt arrives.
 */
export function useJson<T>(url: string | null) {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<Result<T> | null>(null);
  // Last successful payload for any url: lets callers keep stable UI (header, cards) during refetch.
  const [lastData, setLastData] = useState<T | null>(null);
  const key = `${url}#${attempt}`;

  useEffect(() => {
    if (!url) return;
    const controller = new AbortController();

    fetch(url, { signal: controller.signal })
      .then(async (res) => {
        const body = await res.json();
        if (!res.ok) throw new Error((body as ApiError).error ?? `Request failed (${res.status})`);
        setResult({ key, data: body as T, error: null });
        setLastData(body as T);
      })
      .catch((err: Error) => {
        if (controller.signal.aborted) return;
        setResult({ key, data: null, error: err.message });
      });

    return () => controller.abort();
  }, [url, key]);

  const isCurrent = result?.key === key;
  return {
    data: isCurrent ? result.data : null,
    lastData,
    error: isCurrent ? result.error : null,
    loading: url !== null && !isCurrent,
    retry: () => setAttempt((n) => n + 1),
  };
}
