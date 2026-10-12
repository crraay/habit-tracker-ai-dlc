# Performance Design — unit `habit-tracker-springboot`

Planning-only intent (FR2).  **As-built pattern catalogue** — documents how the monolith handles latency and throughput today; future optimizations are **non-binding backlog** only (Q2-A).

## Sources

- `nfr-requirements/performance-requirements.md` (NFR2.x)
- `functional-spec.md` (WF-5 board read, WF-6 streak/scheduler)
- `contract-summary.md` (C1 sync REST)
- `tech-stack-decisions.md` (NFR7.4–NFR7.12)

## Request path (as-built)

| Layer | Pattern | Notes |
|-------|---------|-------|
| Edge | Sync HTTPS REST (C1) | No API gateway cache; nginx proxies to JVM |
| Web | Spring MVC `@RestController` | One thread per request (Tomcat defaults) |
| Security | `JwtRequestFilter` before controllers | No session store |
| Domain | `@Service` transactional methods | Default propagation |
| Data | Spring Data JPA + JDBC | HikariCP pool (Boot BOM defaults) |
| Batch | `@Scheduled` streak reset | Single JVM cron (`app.scheduling.timezone`) |

No application-level cache (Redis/Caffeine), CDN, or read replicas.

## Resource pooling

- **HikariCP**: bounds concurrent DB usage; tuned only via Spring Boot defaults unless ops overrides datasource props (NFR2.8).
- **JVM heap**: single container on droplet; no documented `-Xmx` policy in repo (NFR2.9).
- **Postgres**: one instance; pool size effectively capped by `max_connections` on host (NFR4.7).

## Hot paths and cost drivers

| ID | Hot path | Design behavior | Risk |
|----|----------|-----------------|------|
| NFR2.5 | Streak recompute on untrack / non-contiguous track | Full ordered log scan per habit | Latency grows with log history |
| NFR2.6 | `GET /api/habit-track/{date}` | Loads habits + log marks for board | Query scoping gap may widen reads (see security backlog) |
| NFR2.7 | `StreakResetScheduler` | Batch aggregate touch on cron | Competes with interactive traffic on same JVM |
| NFR2.8 | JDBC pool under burst | Queue or timeout at pool boundary | No measured baseline (NFR2.1) |

## Performance budgets

**None contractual** for this intent (NFR2.1). Engineering reference only (NFR2.3): personal-scale interactive APIs often target sub-second server time at p95 under low concurrency — **not measured** in CI today.

## Design backlog (non-binding)

| Label | Trigger | Direction |
|-------|---------|-----------|
| BL-PERF-01 | Board latency or DB load complaints | Fix log query user scoping; index review |
| BL-PERF-02 | Streak recompute dominates profiles | Incremental aggregate maintenance or cap recompute window |
| BL-PERF-03 | Before major optimization | MockMvc or k6 baseline per NFR2.4 |
| BL-PERF-04 | Sustained pool exhaustion (NFR4.12) | Pool tuning; optional read-through cache for read-heavy stats |

## Future-intent patterns (not adopted)

- Cache-aside for statistics aggregates (would require invalidation on track/untrack).
- Async `@Async` for non-user-facing work (not present; would complicate error handling to SPA).
- Pagination on habit/log list endpoints if catalog grows beyond personal scale.

## Upstream references

- C1: browser uses default `HttpClient` timeouts — no server-side latency SLO in contract.
- Inception NFR3: tests green on `main` before image push — quality gate, not performance SLO.
