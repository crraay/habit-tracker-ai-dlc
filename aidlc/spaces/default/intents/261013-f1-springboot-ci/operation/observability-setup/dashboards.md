# Dashboards — F1 springboot CI (as-built)

Intent `261013-f1-springboot-ci` · Documentation only · **No Grafana, CloudWatch, or Datadog** on the Compose production path.

## Sources

- `operation/observability-setup/observability-setup-questions.md`
- `operation/deployment-execution/health-check-report.md`
- `habit-tracker-compose/DOCKER.md`

## Dashboard inventory

| Dashboard | Platform | Status | Audience |
|-----------|----------|--------|----------|
| CloudWatch | AWS | **Absent** on DO Compose path | — |
| Grafana | Self-hosted | **Absent** | — |
| Operator checklist | SSH / browser | **Active** | Operator |
| GitHub Actions | github.com | **CI/CD** — **F1: `Run tests` in `build-image`** | Developer |

## Operator layout (droplet)

| Panel | Command / URL | Signal |
|-------|---------------|--------|
| Stack status | `docker compose ps` | Running / unhealthy |
| Backend health | `curl -sS http://<host>/api/actuator/health` | UP / DOWN |
| Frontend edge | Browser or `curl -I http://<host>/` | 200 vs 5xx |
| Backend logs | `docker compose logs -f --tail=100 backend` | Errors, Flyway |
| Postgres | healthcheck via `docker inspect` | healthy / unhealthy |

## CI “dashboard” (GitHub — F1)

| Panel | Location | Signal |
|-------|----------|--------|
| springboot `build-image` | Repo → Actions → workflow run | Job status |
| **Run tests** step | Same run log | **`mvn -B test` pass/fail (F1)** |
| Docker push | Later steps | Only reached if tests green (FR1.1) |

## Golden signals

| Signal | As-built | F1 note |
|--------|----------|---------|
| **Errors (CI)** | GHA log for failed Surefire | Visible **before** Hub push |
| **Errors (prod)** | Manual log grep; `correlationId` on API errors | Unchanged |
| **Latency / traffic / saturation** | Not aggregated on droplet | Backlog |

## Backlog

- Prometheus + Grafana on droplet (RED metrics).
- Micrometer export from Spring Boot.

**Artifact revision:** 2026-10-14T19:17+07 — post-confirmation save.
