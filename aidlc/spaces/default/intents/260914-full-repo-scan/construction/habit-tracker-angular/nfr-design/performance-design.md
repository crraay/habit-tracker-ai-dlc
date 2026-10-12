# Performance Design — unit `habit-tracker-angular`

Planning-only intent (FR2).  **As-built client pattern catalogue** — documents how the SPA handles perceived performance today; future optimizations are **non-binding backlog** only (Q2-A).

## Sources

- `nfr-requirements/performance-requirements.md` (NFR2.x)
- `functional-spec.md`, `frontend-components.md`
- `contract-summary.md` (C1 consumer)
- U1 `habit-tracker-springboot/nfr-design/performance-design.md` (server latency dominance)

## Delivery architecture (as-built)

| Layer | Pattern | Notes |
|-------|---------|-------|
| Build | `ng build --configuration=production` | Single static bundle in nginx image (NFR2.2) |
| Edge | nginx serves `dist/browser` | TLS at nginx; `/api` proxied to backend (NFR3.6) |
| Runtime | Zone.js default CD | OnPush on Track and Statistics (NFR2.8) |
| Data | Generated `web-api` + HttpClient | Full OpenAPI surface in bundle (NFR2.9) |

No Lighthouse CI, Web Vitals SLIs, or route-level lazy-loading policy beyond Angular defaults (NFR2.1).

## Client data-fetch patterns

| ID | Pattern | Design behavior |
|----|---------|-----------------|
| NFR2.5 | User clock bootstrap | `UserClockStore.getClock()` → shared `GET /api/me` with `shareReplay(1)` |
| NFR2.6 | Track board | `GET /api/habit-track/{date}` refetch on date change |
| NFR2.7 | Statistics | `GET /api/statistics/{startDate}/{endDate}` for default month range |
| NFR2.10 | Latency coupling | Perceived speed dominated by U1 JDBC/hot paths (NFR2.11) |

## Performance budgets

**None contractual** (NFR2.1). Reference only (NFR2.3): personal-scale SPAs often feel sub-second on warm cache — **not measured** in CI.

## Cross-references (server / ops)

| ID | Pointer |
|----|---------|
| NFR2.11 | U1 performance-design — pool, scheduler, streak recompute |
| NFR2.12 | U3 / team Deployment — static delivery cadence, manual compose deploy |

## Design backlog (non-binding)

| Label | Trigger | Direction |
|-------|---------|-----------|
| BL-PERF-01 | Large shell or track refactor | Lighthouse or bundle analyzer baseline (NFR2.4) |
| BL-PERF-02 | Bundle growth from `web-api` | Contract diff review before regenerate |
| BL-PERF-03 | Datepicker churn | Debounce or cache policy for same-day revisits |

## Future-intent patterns (not adopted)

- Route-level lazy loading for edit/settings if bundle exceeds personal-scale tolerance.
- HttpClient retry/backoff policy (C1 does not require; would need idempotent GET semantics only).

## Upstream references

- Inception NFR3: `npm run test:ci` on `main` before image push — quality gate, not Web Vitals SLO.
