# Performance Requirements — unit `habit-tracker-angular`

Planning-only intent (FR2). **As-built baseline** — no contractual SLOs for this intent. Sources: CodeKB architecture, U2 `functional-spec.md`, `technology-stack.md`, C1 consumer notes.

## Formal targets (as-built)

| ID | Requirement | Status |
|----|-------------|--------|
| **NFR2.1** | No published Web Vitals SLIs, bundle-size budgets, or Lighthouse CI gates in repo or GitHub Actions. | As-built |
| **NFR2.2** | SPA is a single static nginx bundle (`ng build --configuration=production`); no code-splitting policy beyond Angular defaults. | As-built |

## Engineering guidance (non-binding — future intents)

| ID | Guidance | Notes |
|----|----------|-------|
| **NFR2.3** | Personal-scale SPAs often target sub-second interactive updates at p95 on a warm cache; not measured today. | Reference only |
| **NFR2.4** | Before large shell or track refactors, capture a baseline (Lighthouse or bundle analyzer on production config) in a follow-up intent. | Backlog |

## As-built constraints and hot spots

| ID | Area | Behavior |
|----|------|----------|
| **NFR2.5** | **User clock bootstrap** | First `UserClockStore.getClock()` triggers shared `GET /api/me` with `shareReplay(1)` — one network round-trip amortized across Track/Statistics/Settings. |
| **NFR2.6** | **Track board load** | `GET /api/habit-track/{date}` per selected day; datepicker changes refetch list. |
| **NFR2.7** | **Statistics range** | `GET /api/statistics/{startDate}/{endDate}` for month-to-today default range. |
| **NFR2.8** | **Change detection** | Default Zone.js; **OnPush** on heavy screens (Track, Statistics) per team code style. |
| **NFR2.9** | **Generated client** | Full `web-api` surface from OpenAPI increases bundle size vs hand-written subset; regenerate only when contract changes. |
| **NFR2.10** | **API latency** | Perceived performance dominated by backend JDBC paths (see U1 `performance-requirements.md`); browser uses same-origin `/api` (dev proxy or nginx). |

## Cross-references (server / ops — U1, U3)

| ID | Reference |
|----|-----------|
| **NFR2.11** | Backend connection pool, scheduler, and streak recompute hot spots: U1 performance doc. |
| **NFR2.12** | Production static delivery and manual deploy cadence: U3 packaging NFRs and `team.md` Deployment. |

## Upstream references

- C1: HttpClient defaults; no client-side timeout/retry policy beyond interceptors.
- Inception **NFR3**: `npm run test:ci` must pass on `main` before `build-image` — quality gate, not Web Vitals SLO.
