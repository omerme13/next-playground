"use client";

import { useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { useJson } from "@/hooks/useJson";
import { matchesFilters } from "@/lib/query";
import {
  DEFAULT_RANGE,
  DEFAULT_SORT,
  MIN_SEARCH_CHARS,
  PAGE_SIZE,
  RANGE_LABELS,
  TEAM_FILTER_ALL,
} from "@/lib/constants";
import type { LearnerRow, Range, SortDir, SortKey, TeamFilter, UsageResponse } from "@/lib/types";
import { DetailPanel } from "./DetailPanel";
import { Filters } from "./Filters";
import { LearnersTable } from "./LearnersTable";
import { Pagination } from "./Pagination";
import { RangeSelector } from "./RangeSelector";
import { SummaryCards } from "./SummaryCards";
import styles from "./Dashboard.module.css";

const FIRST_SORT_DIR: Record<SortKey, SortDir> = { minutes: "desc", name: "asc" };

const toSearchTerm = (raw: string) => (raw.trim().length >= MIN_SEARCH_CHARS ? raw.trim() : "");

export function Dashboard() {
  const [range, setRange] = useState<Range>(DEFAULT_RANGE);
  const [team, setTeam] = useState<TeamFilter>(TEAM_FILTER_ALL);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState(DEFAULT_SORT);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<LearnerRow | null>(null);

  const q = toSearchTerm(useDebounce(search));
  const filterParams = new URLSearchParams({ range, team, q, sort: sort.key, dir: sort.dir });
  const usage = useJson<UsageResponse>(`/api/usage?${filterParams}&page=${page}`);
  const { data, lastData, loading, error } = usage;

  // Closes the panel for good when the selected learner no longer matches the filters.
  const closePanelIfFilteredOut = (nextTeam: TeamFilter, nextSearch: string) => {
    if (selected && !matchesFilters(selected, nextTeam, toSearchTerm(nextSearch))) setSelected(null);
  };

  const handleRangeChange = (next: Range) => {
    setRange(next);
    setPage(1);
  };
  const handleTeamChange = (next: TeamFilter) => {
    setTeam(next);
    setPage(1);
    closePanelIfFilteredOut(next, search);
  };
  const handleSearchChange = (next: string) => {
    setSearch(next);
    setPage(1);
    closePanelIfFilteredOut(team, next);
  };
  const handleSortChange = (key: SortKey) => {
    setSort((prev) =>
      prev.key === key ? { key, dir: prev.dir === "asc" ? "desc" : "asc" } : { key, dir: FIRST_SORT_DIR[key] },
    );
    setPage(1);
  };

  // Summary depends only on range, so keep showing it while team/search/sort refetch.
  const summary = data?.summary ?? (lastData?.range === range ? lastData.summary : null);
  const totalRows = data?.totalRows ?? lastData?.totalRows ?? 0;

  const emptyMessage =
    data?.emptyReason === "noActivity"
      ? `${team} has no activity in the ${RANGE_LABELS[range]}.`
      : data?.emptyReason === "noMatch"
        ? "No learners match your search or filters."
        : null;

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>{lastData?.company ?? "Loading…"}</h1>
        {lastData && (
          <p className={styles.seats}>
            {lastData.seatsUsed} of {lastData.seatsPurchased} seats used
          </p>
        )}
      </header>

      <div className={styles.controls}>
        <RangeSelector value={range} onChange={handleRangeChange} />
        <Filters team={team} onTeamChange={handleTeamChange} search={search} onSearchChange={handleSearchChange} />
      </div>

      {error ? (
        <div className={styles.error} role="alert">
          <p>Could not load usage: {error}</p>
          <button type="button" className={styles.button} onClick={usage.retry}>
            Retry
          </button>
        </div>
      ) : (
        <>
          <SummaryCards summary={summary} />

          <div className={styles.content}>
            <section className={styles.tableSection}>
              <div className={styles.tableToolbar}>
                <h2 className={styles.sectionTitle}>Learners</h2>
                {totalRows > 0 && (
                  <a
                    className={styles.button}
                    href={`/api/usage/export?${filterParams}`}
                    download
                    aria-disabled={loading}
                    data-disabled={loading}
                    onClick={(e) => loading && e.preventDefault()}
                  >
                    Export CSV
                  </a>
                )}
              </div>

              <LearnersTable
                rows={data?.rows ?? null}
                emptyMessage={emptyMessage}
                sort={sort}
                onSortChange={handleSortChange}
                selectedId={selected?.id ?? null}
                onSelect={setSelected}
              />

              {totalRows > PAGE_SIZE && (
                <Pagination page={page} totalPages={data?.totalPages ?? lastData?.totalPages ?? 1} onChange={setPage} />
              )}
            </section>

            {selected && <DetailPanel learner={selected} onClose={() => setSelected(null)} />}
          </div>
        </>
      )}
    </main>
  );
}
