import styles from "./LearnersTable.module.css";

type Props = { page: number; totalPages: number; onChange: (page: number) => void };

export function Pagination({ page, totalPages, onChange }: Props) {
  return (
    <nav className={styles.pagination} aria-label="Pagination">
      <button type="button" className={styles.pageButton} disabled={page <= 1} onClick={() => onChange(page - 1)}>
        Previous
      </button>
      <span>
        Page {page} of {totalPages}
      </span>
      <button
        type="button"
        className={styles.pageButton}
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
      >
        Next
      </button>
    </nav>
  );
}
