# Health check report — full-repo-scan

Intent `260914-full-repo-scan` · Documents **as-built health signals** for the Compose production stack. **No live probes** were executed from this intent.

## Sources

- `habit-tracker-compose/docker-compose.yml`
- `operation/environment-provisioning/validation-report.md`
- `operation/deployment-execution/deployment-log.md`

## Summary

| Verdict | Detail |
|---------|--------|
| **Configuration review** | **Pass** — healthchecks and actuator exposure defined in compose/backend env |
| **Live validation** | **Not performed** (FR2) |

## Component health matrix

| Component | Mechanism | Endpoint / probe | Host exposure | FR2 live |
|-----------|-----------|------------------|---------------|----------|
| **postgres** | Docker healthcheck | `pg_isready -U $POSTGRES_USER -d $POSTGRES_DB` | Internal only | N/A |
| **backend** | Image HEALTHCHECK + Actuator | `management.endpoints.web.exposure.include=health` → `/actuator/health` | Internal `:8080` | N/A |
| **frontend** | `depends_on: backend healthy` | nginx process / HTTP :80 | **Published 80** | N/A |
| **Stack** | `docker compose ps` | SERVICE state after deploy | SSH on droplet | N/A |

## Expected healthy states (post-deploy)

| Check | Command / action | Healthy signal |
|-------|------------------|----------------|
| Compose services | `docker compose ps` | `postgres`, `backend`, `frontend` running |
| Postgres | healthcheck in `docker inspect` | `healthy` |
| Backend | logs on start | Flyway success; no fatal JDBC errors |
| Backend actuator | from frontend network or proxied | `{"status":"UP"}` (Spring Boot 3.x shape) |
| Edge | browser or `curl http://<host>/` | HTTP 200 for SPA shell |

## Dependency availability (pre-deploy)

| Dependency | Required for deploy | Health signal |
|------------|---------------------|---------------|
| Docker Hub | Pull C2/C3 images | Pull succeeds in `deploy-service.sh` |
| Droplet Docker Engine | Compose v2 | `docker compose version` |
| Postgres volume | Data continuity | Volume mount present; not recreated on app deploy |
| GitHub Actions SSH | Remote script | Workflow job green |

## Gaps vs Operation phase guardrails

| Guardrail | As-built | Backlog |
|-----------|----------|---------|
| Defined smoke after prod deploy | Manual checklist | Automate in U3 workflow |
| Quantified SLO | Not defined in repo | observability-setup stage |
| Automated rollback on failed health | None | Operator manual rollback |

## Traceability

| Upstream | Covered |
|----------|---------|
| `environment-inventory` | Service list, ports, volume |
| `cd-config` | No automated health gate on deploy |
| `deployment-strategy` | Operator monitors `docker compose ps` and logs |
