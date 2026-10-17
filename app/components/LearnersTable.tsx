import { PAGE_SIZE } from "@/lib/constants";
import type { LearnerRow, SortDir, SortKey } from "@/lib/types";
import styles from "./LearnersTable.module.css";

type Props = {
  rows: LearnerRow[] | null; // null = loading
  emptyMessage: string | null;
  sort: { key: SortKey; dir: SortDir };
  onSortChange: (key: SortKey) => void;
  selectedId: number | null;
  onSelect: (row: LearnerRow) => void;
};

const COLUMN_COUNT = 6;
const SORT_ARROWS: Record<SortDir, string> = { asc: "▲", desc: "▼" };
const ARIA_SORT: Record<SortDir, "ascending" | "descending"> = { asc: "ascending", desc: "descending" };

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });

export function LearnersTable({ rows, emptyMessage, sort, onSortChange, selectedId, onSelect }: Props) {
  const sortHeader = (key: SortKey, label: string, className?: string) => (
    <th className={className} aria-sort={sort.key === key ? ARIA_SORT[sort.dir] : "none"}>
      <button type="button" className={styles.sortButton} onClick={() => onSortChange(key)}>
        {label} {sort.key === key && <span aria-hidden>{SORT_ARROWS[sort.dir]}</span>}
      </button>
    </th>
  );

  return (
    <div className={styles.wrapper}>
      <table className={styles.table} aria-busy={rows === null}>
        <thead>
          <tr>
            {sortHeader("name", "Name")}
            <th className={styles.optional}>Team</th>
            <th className={styles.optional}>Level</th>
            {sortHeader("minutes", "Minutes", styles.numeric)}
            <th className={`${styles.numeric} ${styles.optional}`}>Lessons</th>
            <th>Last active</th>
          </tr>
        </thead>
        <tbody>
          {rows === null &&
            Array.from({ length: PAGE_SIZE }, (_, i) => (
              <tr key={i}>
                <td colSpan={COLUMN_COUNT}>
                  <span className={styles.skeletonRow} />
                </td>
              </tr>
            ))}

          {rows?.length === 0 && (
            <tr>
              <td colSpan={COLUMN_COUNT} className={styles.empty}>
                {emptyMessage}
              </td>
            </tr>
          )}

          {rows?.map((row) => (
            <tr
              key={row.id}
              className={styles.row}
              aria-selected={row.id === selectedId}
              tabIndex={0}
              onClick={() => onSelect(row)}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelect(row)}
            >
              <td className={styles.name}>{row.name}</td>
              <td className={styles.optional}>{row.team}</td>
              <td className={styles.optional}>{row.level}</td>
              <td className={styles.numeric}>{row.minutes.toLocaleString()}</td>
              <td className={`${styles.numeric} ${styles.optional}`}>{row.lessons}</td>
              <td>{formatDate(row.lastActiveAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
