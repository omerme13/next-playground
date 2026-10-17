import { TEAM_FILTERS } from "@/lib/constants";
import type { TeamFilter } from "@/lib/types";
import styles from "./Dashboard.module.css";

type Props = {
  team: TeamFilter;
  onTeamChange: (team: TeamFilter) => void;
  search: string;
  onSearchChange: (search: string) => void;
};

export function Filters({ team, onTeamChange, search, onSearchChange }: Props) {
  return (
    <div className={styles.filters}>
      <label className={styles.field}>
        <span className={styles.label}>Team</span>
        <select
          className={styles.input}
          value={team}
          onChange={(e) => onTeamChange(e.target.value as TeamFilter)}
        >
          {TEAM_FILTERS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </label>
      <label className={styles.field}>
        <span className={styles.label}>Search</span>
        <input
          className={styles.input}
          type="search"
          placeholder="Learner name"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </label>
    </div>
  );
}
