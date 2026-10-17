import { useEffect, useRef } from "react";
import { useJson } from "@/hooks/useJson";
import type { LearnerDetail, LearnerRow } from "@/lib/types";
import styles from "./DetailPanel.module.css";

type Props = { learner: LearnerRow; onClose: () => void };

const PERCENT = 100;
// Must match the 1024px breakpoint in Dashboard.module.css where table and panel sit side by side.
const SIDE_BY_SIDE_QUERY = "(min-width: 1024px)";

const formatDay = (date: string) =>
  new Date(`${date}T00:00:00`).toLocaleDateString(undefined, { month: "short", day: "numeric" });
// Axis labels show only the day number so 14 bars fit at 360px; the full date is in the tooltip.
const formatDayOfMonth = (date: string) => String(new Date(`${date}T00:00:00`).getDate());

export function DetailPanel({ learner, onClose }: Props) {
  // URL is keyed by id, so clicking another row aborts this request and loads the new one.
  const { data, loading, error, retry } = useJson<LearnerDetail>(`/api/learners/${learner.id}`);
  const maxMinutes = Math.max(1, ...(data?.dailyMinutes.map((d) => d.minutes) ?? []));
  const panelRef = useRef<HTMLElement>(null);

  // Below the side-by-side breakpoint the panel renders under the table, so bring it into view.
  useEffect(() => {
    if (!window.matchMedia(SIDE_BY_SIDE_QUERY).matches) {
      panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [learner.id]);

  return (
    <aside ref={panelRef} className={styles.panel} aria-label={`Details for ${learner.name}`}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.name}>{learner.name}</h2>
          <p className={styles.meta}>
            {learner.team} · {learner.level}
          </p>
        </div>
        <button type="button" className={styles.close} onClick={onClose} aria-label="Close details">
          ×
        </button>
      </div>

      <h3 className={styles.chartTitle}>Minutes per day, last 14 days</h3>

      {loading && <div className={styles.chartSkeleton} aria-busy />}

      {error && (
        <div className={styles.error} role="alert">
          <p>Could not load this learner: {error}</p>
          <button type="button" className={styles.retry} onClick={retry}>
            Retry
          </button>
        </div>
      )}

      {data && (
        <ol className={styles.chart}>
          {data.dailyMinutes.map((day) => (
            <li key={day.date} className={styles.barSlot} title={`${formatDay(day.date)}: ${day.minutes} min`}>
              <span className={styles.barValue}>{day.minutes}</span>
              <span className={styles.bar} style={{ height: `${(day.minutes / maxMinutes) * PERCENT}%` }} />
              <span className={styles.barLabel}>{formatDayOfMonth(day.date)}</span>
            </li>
          ))}
        </ol>
      )}
    </aside>
  );
}
