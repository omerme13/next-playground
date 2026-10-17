import { RANGES } from "@/lib/constants";
import type { Range } from "@/lib/types";
import styles from "./Dashboard.module.css";

type Props = { value: Range; onChange: (range: Range) => void };

export function RangeSelector({ value, onChange }: Props) {
  return (
    <div className={styles.segmented} role="group" aria-label="Date range">
      {RANGES.map((range) => (
        <button
          key={range}
          type="button"
          className={styles.segment}
          aria-pressed={range === value}
          onClick={() => onChange(range)}
        >
          {range}
        </button>
      ))}
    </div>
  );
}
