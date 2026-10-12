# Performance Requirements — unit `habit-tracker-springboot`

Planning-only intent (FR2). **As-built baseline** — no contractual SLOs for this intent. Sources: CodeKB architecture, functional-spec WF-5/WF-6, `application.properties`, team deployment notes.

## Formal targets (as-built)

| ID | Requirement | Status |
|----|-------------|--------|
| **NFR2.1** | No published SLIs, SLOs, or load-test baselines exist in repo or CI for the Spring Boot service. | As-built |
| **NFR2.2** | Interactive REST APIs are synchronous request/response over JDBC; no caching layer or read replicas. | As-built |

## Engineering guidance (non-binding — future intents)

| ID | Guidance | Notes |
|----|----------|-------|
| **NFR2.3** | Personal-scale interactive APIs typically aim for sub-second server time at p95 under low concurrency; not measured today. | Reference only |
| **NFR2.4** | Before optimizing hot paths, establish a baseline (e.g. MockMvc or k6 against `/api/habit-track`) in a follow-up intent. | Backlog |

## As-built constraints and hot spots

| ID | Area | Behavior |
|----|------|----------|
| **NFR2.5** | **Streak aggregate recompute** | `applyUntrack` and non-contiguous track paths recompute from ordered logs — cost grows with log history per habit. |
| **NFR2.6** | **Board read (`GET /api/habit-track/{date}`)** | Loads habits for user plus log marks; known query scoping gap may widen work (see security backlog). |
| **NFR2.7** | **Scheduled job** | `StreakResetScheduler` batch touches aggregates once per cron fire (`app.scheduling.streak-reset.enabled`, timezone `app.scheduling.timezone`). |
| **NFR2.8** | **Connection pool** | Hikari defaults from Spring Boot BOM; single Postgres instance on production host. |

## Resource utilization

| ID | Requirement |
|----|-------------|
| **NFR2.9** | Single JVM per backend container; vertical scaling only (see scalability-requirements.md). |
| **NFR2.10** | No CPU/memory limits documented in compose beyond host capacity; Docker HEALTHCHECK hits `/actuator/health`. |

## Upstream references

- C1: browser `HttpClient` defaults for client-side latency (contract-summary).
- Inception **NFR3**: future code changes must keep tests green on `main` before image push — quality gate, not latency SLO.
