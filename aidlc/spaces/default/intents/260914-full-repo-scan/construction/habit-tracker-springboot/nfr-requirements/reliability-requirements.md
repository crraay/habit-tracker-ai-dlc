# Reliability Requirements — unit `habit-tracker-springboot`

Planning-only intent (FR2). **As-built ops** — no external SLA. Sources: actuator, Docker HEALTHCHECK, Flyway, streak scheduler, team deployment.

## Availability

| ID | Requirement | As-built |
|----|-------------|----------|
| **NFR5.1** | **`GET /actuator/health`** exposed publicly for compose/Docker health checks. | Implemented |
| **NFR5.2** | Backend container HEALTHCHECK uses actuator endpoint in Dockerfile. | Implemented |
| **NFR5.3** | **No contractual uptime SLA** for this product or intent. | Documented absence |
| **NFR5.4** | Single-host production — outage of droplet affects all tiers (Postgres + backend + frontend). | Topology |

## Data durability

| ID | Requirement | As-built |
|----|-------------|----------|
| **NFR5.5** | PostgreSQL data in named Docker volume survives app container redeploys. | Compose practice |
| **NFR5.6** | Schema changes via **Flyway** in backend image; `ddl-auto=validate`. | Mandated |
| **NFR5.7** | No automated backup policy documented in repo — operator responsibility on droplet. | Gap / ops backlog |

## Recovery objectives (qualitative — personal app)

| ID | Objective | Guidance |
|----|-----------|----------|
| **NFR5.8** | **RTO** | Restore service by redeploying `:latest` images and healthy Postgres volume; hours acceptable for personal use unless operator defines stricter target. |
| **NFR5.9** | **RPO** | Bounded by last Postgres backup if any; without backups, RPO equals data since last volume snapshot. |
| **NFR5.10** | **Rollback** | Manual — redeploy prior image digest/tag if recorded (team deployment). |

## Fault tolerance and graceful degradation

| ID | Requirement | As-built |
|----|-------------|----------|
| **NFR5.11** | DB unavailable → startup/requests fail; no circuit breaker layer documented. | Monolith default |
| **NFR5.12** | JWT validation failure → 401; no fallback anonymous API for protected routes. | By design |
| **NFR5.13** | Scheduler disabled when `app.scheduling.streak-reset.enabled=false` — streak reset behavior depends on config. | Configurable |

## Scheduler reliability

| ID | Requirement | As-built |
|----|-------------|----------|
| **NFR5.14** | Cron fires in **`app.scheduling.timezone`** (default Asia/Bangkok), not per-user zones — misalignment with user `today` (WF-6 gap). | Documented risk |
| **NFR5.15** | Missed cron ( JVM down at 23:55 ) — streak reset may lag until next successful run; no compensating queue. | As-built |
| **NFR5.16** | Inline aggregate updates on track/untrack remain authoritative for same-day streak display. | WF-6 |

## CI reliability gate (future code)

| ID | Requirement | Applies |
|----|-------------|---------|
| **NFR5.17** | Production image from `main` must not skip tests (`-DskipTests`) — reduces broken deploy risk. | NFR3 mandate / follow-up intents |
