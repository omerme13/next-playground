import type { UsageSummary } from "@/lib/types";
import styles from "./Dashboard.module.css";

const CARDS: { label: string; value: (s: UsageSummary) => number }[] = [
  { label: "Total minutes", value: (s) => s.totalMinutes },
  { label: "Avg minutes per active learner", value: (s) => s.avgMinutesPerActive },
  { label: "Active learners", value: (s) => s.activeLearners },
];

export function SummaryCards({ summary }: { summary: UsageSummary | null }) {
  return (
    <section className={styles.cards} aria-busy={!summary}>
      {CARDS.map((card) => (
        <div key={card.label} className={styles.card}>
          <span className={styles.label}>{card.label}</span>
          {summary ? (
            <strong className={styles.cardValue}>{card.value(summary).toLocaleString()}</strong>
          ) : (
            <span className={`${styles.skeleton} ${styles.cardValueSkeleton}`} />
          )}
        </div>
      ))}
    </section>
  );
}
