# Monitoring Design — unit `habit-tracker-compose`

Planning-only intent (FR2). **Stack-level observability** (Q4 **A**): what operators can see on a single-host Compose deploy without a dedicated metrics platform. In-app metrics/logging remain in U1/U2 designs.

## Sources

- `nfr-design/security-design.md`
- U1 `monitoring-design.md`, U2 `monitoring-design.md`
- `habit-tracker-compose/docker-compose.yml`
- `infrastructure-specification.md` (stack topology)

## Metrics & KPIs

| Metric | Source | Threshold | Why it matters |
|--------|--------|-----------|----------------|
| Postgres readiness | `pg_isready` healthcheck in compose | Fail after configured retries | Backend starts only after DB ready |
| Backend health | C2 image HEALTHCHECK → `/actuator/health` | Non-200 fails check | `frontend` `depends_on: service_healthy` |
| Frontend liveness | C3 image HEALTHCHECK → `wget` `/` | Non-200 fails check | Edge availability signal |
| Stack process state | `docker compose ps` | Operator judgment | `restart: unless-stopped` on all services |
| Container logs volume | `docker compose logs` | Operator judgment | Primary debug path for full stack |
| Host disk (volume) | `docker system df` / host tools | Operator judgment | Postgres growth (NFR3.12) |
| Centralized RED metrics | *Not exported* | N/A | No Prometheus scrape (GAP) |
| Uptime / synthetic checks | *Not configured* | N/A | No external probe (GAP) |

## Alerts

| Alert | Condition | Severity | Routes to |
|-------|-----------|----------|-----------|
| Service unhealthy | Compose healthcheck failing | *Not automated* | Operator manual investigation |
| Site unreachable | External HTTP failure | *Not automated* | Operator (personal app expectation) |
| Postgres data loss risk | Disk full / volume corruption | *Not automated* | Operator; BL-INFRA-U3-04 |
| Failed U3 deploy workflow | GHA job failure | *Not routed* | Developer notices in GitHub |
| Failed U1/U2 image push | Upstream workflow failure | *Not routed* | Blocks fresh images before U3 pull |

## SLIs / SLOs

| SLI | SLO target | Measurement window |
|-----|------------|-------------------|
| Stack availability | **None contractual** | N/A |
| Deploy success rate | **None** | N/A |
| RTO / RPO | **None codified** | N/A |

Qualitative operator expectation: investigate same-day if production URL fails; no error budget or on-call rotation.

## Logs & Tracing

| Aspect | Design |
|--------|--------|
| Log aggregation | **Per-container stdout/stderr** on droplet; `docker compose logs -f [service]` |
| Cross-service correlation | Manual — match timestamps across `backend`, `frontend`, `postgres` logs |
| Request tracing | **N/A** at stack layer — single host; U1 correlationId in API errors only |
| Log retention | Ephemeral unless operator configures host log rotation |
| Security | Do not log `.env` contents or JWT in deploy scripts |

## Dashboards

| Dashboard | Status | Content |
|-----------|--------|---------|
| Grafana / cloud monitoring | **Absent** | Future if metrics agent added |
| Operator checklist | **Manual** | `docker compose ps`, health URLs, tail logs, smoke login via browser |
| U1 Actuator / U2 nginx | **Per-unit** | See U1/U2 monitoring-design |

## Future-intent platform sketches (non-binding)

| ID | Sketch |
|----|--------|
| BL-INFRA-U3-07 | UptimeRobot or similar HTTP check on port 80 |
| BL-INFRA-U3-08 | node_exporter + Prometheus on droplet with disk and container alerts |
| BL-INFRA-U3-09 | Central log ship (Loki/CloudWatch) with 30-day retention |
