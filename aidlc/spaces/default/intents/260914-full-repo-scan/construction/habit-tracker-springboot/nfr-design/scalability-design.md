# Scalability Design — unit `habit-tracker-springboot`

Planning-only intent (FR2).  **Single-instance vertical monolith** with explicit non-goals (Q4-A).

## Sources

- `nfr-requirements/scalability-requirements.md` (NFR4.x)
- `contract-summary.md` (C2 image contract)
- `tech-stack-decisions.md` (NFR7.17–NFR7.19)

## Scaling topology (as-built)

```text
[Browser] --> [nginx + SPA container] --> [1x backend JVM] --> [1x Postgres]
                     C1 REST/JWT              C2 :latest image
```

| Dimension | Design choice |
|-----------|---------------|
| Horizontal replicas | **None** in compose — one backend container (NFR4.1) |
| Architecture style | Layered monolith, single Maven module (NFR4.2) |
| Database | Single Postgres 16 on host volume (NFR4.3) |
| State | Stateless API w.r.t. HTTP sessions; JWT carries identity |
| Deploy scale lever | Vertical host CPU/RAM; larger pool if configured (NFR4.8) |

## Capacity assumptions

- Concurrent users: low tens (personal/small-team) — **not load-tested** (NFR4.4).
- Traffic: bursty CRUD + daily cron batch (NFR4.5).
- Storage growth: `HabitLog` dominates; Flyway indexes V1–V6 (NFR4.6).

## Connection and compute bounds

- **Hikari** pool: primary back-pressure between JVM and Postgres (NFR4.7).
- **Scheduler**: single-threaded cron in one JVM — **not multi-leader safe** (NFR4.9).

## Explicit non-goals (this intent)

| ID | Statement |
|----|-----------|
| NFR4.10 | No multi-AZ, Kubernetes, or HPA design commitment |
| NFR4.11 | Compose/production topology changes out of scope for U1 planning |

## Future-intent triggers (backlog design notes)

| ID | Trigger | Direction |
|----|---------|-----------|
| NFR4.12 | Measured p95 regression or pool exhaustion | Profile queries; optional cache or read replica **design** in new intent |
| NFR4.13 | SaaS or large household goal | Re-architecture intent — likely split read models or tenancy |

## C2 integration

- Production pull: `docker.io/crraay/habit-tracker-springboot:latest` after `build-image` on `main`.
- Scaling the **service** today means redeploying a new image on the same host, not adding instances.

## Stateless API implications

JWT allows hypothetical horizontal scale **if** compose were extended — would require shared Postgres, sticky-less load balancer, and scheduler leadership strategy (not designed or built).
