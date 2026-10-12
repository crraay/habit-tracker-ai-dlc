# Dashboards — full-repo-scan (as-built)

Intent `260914-full-repo-scan` · **FR2** documentation · **No Grafana, CloudWatch, or Datadog dashboards** are deployed for Compose production today.

## Sources

- U1/U2/U3 `monitoring-design.md`
- `operation/deployment-execution/health-check-report.md`

## Dashboard inventory

| Dashboard | Platform | Status | Audience |
|-----------|----------|--------|----------|
| CloudWatch | AWS | **Absent** on DO Compose path | — |
| Grafana | Self-hosted | **Absent** | — |
| Operator checklist | Manual (SSH/browser) | **Active** | Operator |
| GitHub Actions | github.com | **CI/CD only** | Developer |

## Operator “dashboard” (manual layout)

Run on droplet in `DEPLOY_COMPOSE_DIR` unless noted.

| Panel | Command / URL | Signal |
|-------|---------------|--------|
| Stack status | `docker compose ps` | Running / restarting / unhealthy |
| Postgres health | `docker inspect --format='{{.State.Health.Status}}' habit-tracker-springboot-postgres-1` (name may vary) | healthy / unhealthy |
| Backend health | `curl -sS http://localhost/api/actuator/health` via nginx proxy, or exec into network | UP / DOWN |
| Frontend edge | Browser `http://<host>/` or `curl -I http://<host>/` | 200 vs 5xx |
| Live logs — backend | `docker compose logs -f --tail=100 backend` | Errors, Flyway, JDBC |
| Live logs — frontend | `docker compose logs -f --tail=50 frontend` | nginx errors |
| Live logs — postgres | `docker compose logs --tail=50 postgres` | startup, auth failures |
| Disk / volumes | `docker system df` | Postgres volume growth |

## Golden signals (documented vs measured)

| Signal | As-built measurement | Gap |
|--------|----------------------|-----|
| **Latency** | Not aggregated | No p95/p99 metrics (NFR6.7) |
| **Traffic** | Not aggregated | No RPS counter |
| **Errors** | Manual log grep; client sees `correlationId` on API errors | No 5xx rate dashboard |
| **Saturation** | Operator judgment (host CPU/RAM via `htop` if installed) | No JVM pool metrics export |

## Future dashboard sketches (non-binding)

| ID | Sketch |
|----|--------|
| BL-INFRA-U3-08 | Prometheus + Grafana: RED for `/api/*`, JVM, postgres exporter |
| NFR6.13 | Micrometer scrape → single-host Grafana |
