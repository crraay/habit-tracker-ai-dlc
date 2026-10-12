# Logical Components — unit `habit-tracker-springboot`

Planning-only intent (FR2).  **Layered monolith + deploy boundary** (Q7-A). Maps in-app layers and runtime dependencies to failure domains; aligns with `inception/domain-design/components.md` without proposing microservice splits.

## Sources

- `inception/domain-design/components.md` (Backend* components)
- `contract-summary.md` (C1, C2)
- Category design files in this directory

## Deploy boundary

| Boundary | Artifact | Failure domain |
|----------|----------|----------------|
| C2 image | `docker.io/crraay/habit-tracker-springboot:latest` | Whole JVM + embedded scheduler |
| Runtime host | Compose project on droplet | Shared with Postgres + nginx/SPA |
| Data | Postgres 16 volume | All users on that deployment |

## In-process layers

```text
+--------------------------------------------------+
|  WebSecurityConfig + JwtRequestFilter            |  AuthN edge
+--------------------------------------------------+
|  Controllers (REST adapters)                     |  C1 API surface
+--------------------------------------------------+
|  Services (domain + transactions)                |  Business rules / docs/domain.md
+--------------------------------------------------+
|  Repositories (JPA)                                |  User-scoped data access
+--------------------------------------------------+
|  StreakResetScheduler                            |  Batch / cron domain
+--------------------------------------------------+
|  GlobalExceptionHandler + ErrorResponse          |  Error/correlation domain
+--------------------------------------------------+
|  Flyway + Hibernate                              |  Schema + persistence
+--------------------------------------------------+
```

## Domain components (cross-reference)

| Catalogue name | Layer mapping | Primary NFR touchpoints |
|----------------|---------------|-------------------------|
| BackendAuthentication | Security filter + auth controller | security-design |
| BackendUserClock | `/api/me` controller/service | reliability (clock vs scheduler) |
| BackendHabitManagement | Habit CRUD stack | security scoping, performance |
| BackendCheckInTracking | Track/untrack stack | performance hot paths |
| BackendStatistics | Statistics endpoints | performance (future cache) |
| BackendHabitIconCatalog | Icon read API | security (authenticated read) |
| StreakResetScheduler (WF-6) | `@Scheduled` job | reliability-design risks |

## External dependencies

| Dependency | Kind | Blast radius if unavailable |
|------------|------|----------------------------|
| PostgreSQL | Database | Total API + scheduler failure |
| nginx (via C1) | Reverse proxy | SPA cannot reach API (U2/U3) |
| Docker Hub | Image registry | Cannot pull new backend image |
| Host `.env` | Secrets/config | Startup failure if JWT/DB missing |

## Shared resources

- **Single JDBC pool** — all controllers and scheduler compete for connections.
- **Single JVM heap** — interactive traffic and cron share GC and threads.
- **Clock sources** — user timezone in DB vs scheduler zone property (documented risk NFR5.14).

## Isolation strategy (as-built)

- **No bulkheads** between domain areas — one thread pool serves all endpoints.
- **No circuit breakers** on Postgres — failures surface as 5xx/startup errors.
- **User scoping** is the primary multi-tenant isolation mechanism (logical, not network).

## Bridge to Infrastructure Design

This inventory supplies **where** NFR patterns apply (layers + C2 container). Infrastructure Design will map the same boundaries to compose services, ports, and host resources without changing U1 scope.
