# Reliability Design — unit `habit-tracker-springboot`

Planning-only intent (FR2).  **Honest as-built ops model** — no circuit breakers or external SLA (Q5-A).

## Sources

- `nfr-requirements/reliability-requirements.md` (NFR5.x)
- Actuator health, Dockerfile HEALTHCHECK, Flyway
- `functional-spec.md` (WF-6 scheduler vs user clock)

## Availability design

| Mechanism | Role |
|-----------|------|
| `GET /actuator/health` | Public liveness signal for Docker/compose (NFR5.1) |
| Container HEALTHCHECK | Dockerfile probes actuator (NFR5.2) |
| Compose restart | Operator policy on host — not codified as SLO |
| Single host | Droplet failure affects Postgres + backend + frontend (NFR5.4) |

**No contractual uptime SLA** (NFR5.3).

## Data durability

| Mechanism | Design |
|-----------|--------|
| Postgres named volume | Survives app container redeploy (NFR5.5) |
| Flyway migrations in image | Schema evolution; `ddl-auto=validate` (NFR5.6) |
| Backups | **Not automated in repo** — operator responsibility (NFR5.7 → BL-REL-01) |

## Recovery objectives (qualitative)

| ID | Design stance |
|----|---------------|
| NFR5.8 RTO | Redeploy `:latest` images + healthy volume; hours acceptable for personal use |
| NFR5.9 RPO | Last backup if any; else since last volume snapshot |
| NFR5.10 Rollback | Manual prior digest/tag redeploy (team deployment) |

## Resilience patterns (absent by design today)

| Pattern | Status | Notes |
|---------|--------|-------|
| Circuit breaker | **Not implemented** | Single Postgres dependency; fail fast on DB down (NFR5.11) |
| Retry with backoff | **Not on DB** | JDBC errors propagate to GlobalExceptionHandler |
| Message queue / outbox | **None** | Scheduler and track paths are synchronous |
| Graceful degradation | Limited | Protected routes never fall back to anonymous (NFR5.12) |

## Scheduler reliability (design risks)

| ID | Risk | Mitigation today | Backlog |
|----|------|------------------|---------|
| NFR5.14 | Cron uses `app.scheduling.timezone`, not per-user zones | Document misalignment with `/api/me` | BL-REL-02 per-user or user-batch reset design |
| NFR5.15 | JVM down at cron fire | Streak reset lags until next run | BL-REL-03 compensating job or catch-up |
| NFR5.16 | Inline aggregate on track/untrack | Authoritative for same-day UI | Keep when changing scheduler |
| NFR5.13 | `app.scheduling.streak-reset.enabled=false` | Disables job | Ops must understand streak drift |

## CI reliability gate (future code)

Production image from `main` must not skip tests (NFR5.17) — reduces broken deploy probability; design tie to `build-image` workflow.

## Design backlog

| Label | Item |
|-------|------|
| BL-REL-01 | Document operator Postgres backup/restore runbook |
| BL-REL-02 | Align streak reset with user-relative `today` |
| BL-REL-03 | Idempotent scheduler with missed-fire detection |

## Failure blast radius

Monolith + single DB: any Postgres outage stops all API and scheduler work for all users on that deployment.
