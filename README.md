# Loora Insights

Loora sells English tutoring to companies. HR admins buy seats for their employees and want to see who is actually practicing. This is the first version of their usage dashboard. You have 60 minutes.

## Stack

- Next.js (App Router), TypeScript
- CSS Modules (no Tailwind, no component libraries)
- Route handlers as the backend (no Express, no database)

## Getting Started

`create-next-app` is already run.

```bash
npm install
npm run dev
```

The app runs on http://localhost:3000. Keep seed data in a TypeScript file. The company has 120 purchased seats and 48 learners.

## Assignment

### Data

- [ ] Seed 48 learners with: `id` (1 to 48), `name`, `team` (Sales, Support, Engineering, Ops), `level` (A2, B1, B2, C1), `minutesPracticed` per range, `lessonsCompleted` per range, `lastActiveAt`
- [ ] Ranges are `7d`, `30d`, `90d`. Seed it so Support has no activity at all in `7d`

### API

- [ ] `GET /api/usage?range=7d|30d|90d` returns summary and learners. Missing range defaults to `30d`. Any other value returns 400 with a JSON error message
- [ ] `GET /api/learners/[id]` returns one learner with a daily minutes series for the last 14 days
  - Unknown numeric id returns 404
  - Non-numeric id returns 400
  - Learner 13 always fails with 500
- [ ] Every response is delayed 1.2s

### Dashboard page

- [ ] Header shows company name and "48 of 120 seats used"
- [ ] Range selector (7d / 30d / 90d), default 30d
- [ ] Three summary cards: total minutes, average minutes per active learner, active learners (active = at least 1 minute in the range)
- [ ] Team filter: All, Sales, Support, Engineering, Ops
- [ ] Search by learner name. Filtering starts at 2 characters
- [ ] Table columns: name, team, level, minutes, lessons, last active. Sortable by minutes and by name. Default is minutes, descending
- [ ] 10 rows per page. Pagination controls show only when there are more than 10 results
  - "Previous" is disabled on page 1, "Next" on the last page
  - Changing range, team, search or sort goes back to page 1
- [ ] "Export CSV" downloads the currently filtered and sorted rows (all pages, not only the visible one). The button is shown only when there is at least 1 row and disabled while data is loading
- [ ] Clicking a row opens a detail panel with the learner's 14-day minutes as a simple bar chart (plain CSS or SVG, no chart library)
  - Clicking another row replaces the panel
  - Changing range keeps the panel open
  - A learner that is filtered out of the table closes the panel

### States

- [ ] Loading: summary cards, table and detail panel each have their own loading state
- [ ] Error: if the usage request fails, show an error with a "Retry" button. If the detail request fails (learner 13), the rest of the page keeps working
- [ ] Empty: show a message when search or filters match nobody. Show a different message when a team has no activity in the selected range

### Layout

- [ ] Responsive: at 1024px and wider, the table and detail panel sit side by side. At 640px and narrower, everything is a single column and the page does not scroll horizontally. It must work at 360px

### Bonus (verbal discussion)

- [ ] The largest customer has 5,000 learners and 3 admins looking at the dashboard at the same time. What breaks first in your implementation, and what would you change?