# Story to unit map — intent `260914-full-repo-scan`

Maps each user story (`USx.y`) to implementing units (`U{n}`) and construction directories. **As-built** stories (US1.x) reflect shipped behavior; **backlog** stories (US2.x) are Won't Have for this intent but are assigned to the unit that would own a follow-up change (Q7-A).

| Story | Title (short) | Unit ID | Directory | Tag | Notes |
|-------|---------------|---------|-----------|-----|-------|
| US1.1 | Sign in | U1, U2 | `u1-habit-tracker-springboot`, `u2-habit-tracker-angular` | As-built | API login + SPA login/storage |
| US1.2 | Main navigation | U2 | `u2-habit-tracker-angular` | As-built | SpaAppShell |
| US1.3 | User clock / timezone | U1, U2 | `u1-habit-tracker-springboot`, `u2-habit-tracker-angular` | As-built | `/api/me` + Settings |
| US1.4 | View track board | U1, U2 | `u1-habit-tracker-springboot`, `u2-habit-tracker-angular` | As-built | Track API + UI |
| US1.5 | Mark done | U1, U2 | `u1-habit-tracker-springboot`, `u2-habit-tracker-angular` | As-built | POST track |
| US1.6 | Undo check-in | U1, U2 | `u1-habit-tracker-springboot`, `u2-habit-tracker-angular` | As-built | DELETE track |
| US1.7 | Create/update habits | U1, U2 | `u1-habit-tracker-springboot`, `u2-habit-tracker-angular` | As-built | Habit CRUD |
| US1.8 | Delete habit | U1, U2 | `u1-habit-tracker-springboot`, `u2-habit-tracker-angular` | As-built | DELETE habit |
| US1.9 | Habit icon picker | U1, U2 | `u1-habit-tracker-springboot`, `u2-habit-tracker-angular` | As-built | Icons API + picker UI |
| US1.10 | Statistics range | U1, U2 | `u1-habit-tracker-springboot`, `u2-habit-tracker-angular` | As-built | Statistics API + UI |
| US1.11 | Logout / 401 | U2 | `u2-habit-tracker-angular` | As-built | Primary UI; U1 issues 401 |
| US1.12 | Traceability (intent) | U1, U2, U3 | all three directories | Intent-only | Workflow artifact coverage |
| US2.1 | Habit lifecycle states | U1 | `u1-habit-tracker-springboot` | Backlog | Schema/domain; UI would follow in U2 |
| US2.2 | Check-in window | U1, U2 | `u1-habit-tracker-springboot`, `u2-habit-tracker-angular` | Backlog | Server rules + datepicker UX |
| US2.3 | User-relative streak cron | U1 | `u1-habit-tracker-springboot` | Backlog | StreakAndAggregate scheduler |
| US2.4 | Scheduled-day statistics | U1, U2 | `u1-habit-tracker-springboot`, `u2-habit-tracker-angular` | Backlog | Stats semantics + display |
| US2.5 | Login/track error UX | U2 | `u2-habit-tracker-angular` | Backlog | ErrorResponse surfacing |
| US2.6 | Regression tests | U1, U2 | `u1-habit-tracker-springboot`, `u2-habit-tracker-angular` | Backlog | FR6 for follow-up intents |
| US2.7 | Refresh token | U1, U2 | `u1-habit-tracker-springboot`, `u2-habit-tracker-angular` | Backlog | Auth API + client session |

## Cross-cutting stories

- **US1.1–US1.10:** Span U1 and U2 by design (client/server); neither unit alone satisfies acceptance criteria.
- **US1.12:** Meta-story for inception traceability; all three units appear in planning deliverables.
- **US2.x:** Mapped to **nearest owner** for future Bolts; status remains backlog at product level.

## Per-unit story lists

### U1 — `u1-habit-tracker-springboot`

Primary or shared: US1.1, US1.3–US1.10, US2.1, US2.2, US2.3, US2.4, US2.6, US2.7, US1.12.

Suggested **documentation** order within unit (not Bolt order): US1.1 → US1.3 → US1.7 → US1.9 → US1.4–US1.6 → US1.10 → US1.8.

### U2 — `u2-habit-tracker-angular`

Primary or shared: US1.1–US1.11, US2.2, US2.4, US2.5, US2.6, US2.7, US1.12.

Suggested documentation order: US1.1 → US1.2 → US1.3 → US1.4–US1.6 → US1.7–US1.9 → US1.10 → US1.11.

### U3 — `u3-habit-tracker-compose`

US1.12 (packaging closure in planning); runtime packaging supports all US1.x journeys in prod but does not implement product stories directly.

## Coverage verification

| Check | Result |
|-------|--------|
| Every US1.x assigned | Yes (12 rows) |
| Every US2.x assigned | Yes (7 rows) |
| Every unit has ≥1 story | U1, U2, U3 all referenced |
| Orphan stories | None |
