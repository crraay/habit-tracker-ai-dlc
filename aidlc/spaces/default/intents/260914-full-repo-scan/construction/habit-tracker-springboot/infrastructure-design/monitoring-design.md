# Monitoring Design — unit `habit-tracker-springboot`

Planning-only intent (FR2). Implements **observability-design** at the **platform** layer (Q4 **A**): what operators can see on a single-host Compose deploy without a dedicated metrics stack.

## Sources

- `nfr-design/observability-design.md`, `reliability-design.md`
- `nfr-requirements/observability-requirements.md` (NFR6.x)
- `habit-tracker-compose/docker-compose.yml`

## Metrics & KPIs

| Metric | Source | Threshold | Why it matters |
|--------|--------|-----------|----------------|
| Backend health status | `GET /actuator/health` (200) | Fail if non-200 for HEALTHCHECK retries | Compose frontend `depends_on` backend healthy (NFR6.6) |
| Postgres readiness | `pg_isready` in postgres service healthcheck | Fail after 10 retries | Backend starts only after DB ready |
| Container restart count | `docker compose ps` / host tooling | Operator judgment | `restart: unless-stopped` — no automated alert (NFR6.11) |
| JVM / pool metrics | *Not exported* | N/A | No Micrometer scrape (NFR6.7 — GAP) |
| Request rate / latency | *Not exported* | N/A | No RED dashboards (NFR6.7 — GAP) |
| Disk use (Postgres volume) | Host/volume stats | Operator judgment | `HabitLog` growth (NFR4.6) |

## Alerts

| Alert | Condition | Severity | Routes to |
|-------|-----------|----------|-----------|
| Backend health failure | HEALTHCHECK / actuator non-200 | *Not automated* | Operator via manual check (NFR6.11 GAP) |
| Postgres unhealthy | Compose healthcheck failing | *Not automated* | Operator via `docker compose logs postgres` |
| Sustained HTTP 5xx | *No metric* | *Not configured* | Future: BL-OBS-02 / NFR6.15 |
| Failed GitHub Actions image push | Workflow failure on `main` | *Not routed* | Developer notices in GitHub (NFR6.12) |
| Scheduler / streak errors | ERROR logs in backend stdout | *Manual* | `docker compose logs backend` grep (NFR6.16 backlog) |

## SLIs / SLOs

| SLI | SLO target | Measurement window |
|-----|------------|-------------------|
| API availability | **None contractual** (NFR6.17, NFR5.3) | N/A |
| Error rate | **None** | N/A |
| Latency p95 | **None** (NFR2.1) | N/A |

Qualitative operator expectation: personal app — investigate same-day if site unreachable; no error budget process.

## Logs & Tracing

| Aspect | Design |
|--------|--------|
| Log aggregation | **Container stdout/stderr** on droplet; `docker compose logs -f backend` | NFR6.1 |
| Log format | Plain text Logback lines | NFR6.2 |
| Secret hygiene | Do not log JWT/passwords | NFR6.3 |
| Error correlation | `correlationId` in JSON error responses (client-visible); not full request log chain | NFR6.4; NFR6.5 gap on success path |
| Retention | Ephemeral unless operator configures host log rotation | NFR6.14 not implemented |
| Distributed tracing | **N/A** — single JVM monolith | NFR6.9 |

## Dashboards

| Dashboard | Status | Content |
|-----------|--------|---------|
| Grafana / CloudWatch | **Absent** | Future intent if metrics export added |
| Operator “dashboard” | **Manual** | Health URL, compose ps, tail logs, SPA error toasts with correlationId |
| springdoc Swagger UI | Dev/ops only | Not production SPA path (NFR6.8) |

## Future-intent platform sketches (non-binding)

| ID | Sketch |
|----|--------|
| NFR6.13 | Expose Micrometer on management port; scrape from sidecar or host agent |
| NFR6.14 | Ship ERROR logs to Loki/CloudWatch with 30-day retention |
| NFR6.15 | Alert on health failure + 5xx rate threshold |
| NFR6.16 | Runbook linked from alert: DB connectivity + streak scheduler |
