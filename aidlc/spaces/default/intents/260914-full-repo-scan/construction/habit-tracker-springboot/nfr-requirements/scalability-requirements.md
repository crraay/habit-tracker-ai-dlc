# Scalability Requirements — unit `habit-tracker-springboot`

Planning-only intent (FR2). **Single-instance monolith** for personal/small-team use. Sources: CodeKB architecture, C2 image contract, team deployment topology.

## Deployment model

| ID | Requirement | As-built |
|----|-------------|----------|
| **NFR4.1** | One backend **Docker image** per production deploy (`docker.io/crraay/habit-tracker-springboot:latest`); no horizontal replica set in compose. | C2 |
| **NFR4.2** | **Layered monolith** — single Maven module, one JAR; scale by vertical host resources only. | Architecture |
| **NFR4.3** | **PostgreSQL 16** single instance on same host volume; no sharding or read replicas. | Compose |

## Capacity assumptions

| ID | Assumption | Notes |
|----|------------|-------|
| **NFR4.4** | Concurrent users: low tens at most (personal/small-team). | Not load-tested |
| **NFR4.5** | Request rate: bursty interactive CRUD + daily cron batch. | |
| **NFR4.6** | Data growth: `HabitLog` rows dominate storage; indexes from Flyway V1–V6. | Monitor disk on droplet |

## Scaling mechanisms (as-built)

| ID | Mechanism | Limit |
|----|-----------|-------|
| **NFR4.7** | Hikari connection pool (Boot defaults). | Bounded by Postgres `max_connections` |
| **NFR4.8** | JVM heap within container/host limits. | No autoscaling policy |
| **NFR4.9** | Streak reset job — single-threaded scheduler in one JVM. | Not multi-leader safe |

## Explicit non-goals (this intent)

| ID | Statement |
|----|-----------|
| **NFR4.10** | No requirement for multi-AZ, Kubernetes, or horizontal pod autoscaling in this planning package. |
| **NFR4.11** | Compose/production deploy changes are **out of scope** for U1 (inception NFR2 at intent level). |

## Future-intent triggers (backlog)

| ID | Trigger | Direction |
|----|---------|-----------|
| **NFR4.12** | Sustained p95 latency regression or pool exhaustion under measured load. | Profile queries; consider caching or read replica |
| **NFR4.13** | Multi-user household or public SaaS goal. | Revisit architecture; likely separate intent |
