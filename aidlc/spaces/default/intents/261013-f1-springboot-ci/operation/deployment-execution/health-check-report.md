# Health check report — F1 springboot CI

Intent `261013-f1-springboot-ci` · Documents **as-built health signals** for the Compose production stack. **No live probes** were executed from this intent.

## Sources

- `habit-tracker-compose/docker-compose.yml`
- `operation/deployment-pipeline/cd-config.md`
- `operation/deployment-execution/deployment-log.md`

## Summary

| Verdict | Detail |
|---------|--------|
| **Configuration review** | **Pass** — healthchecks and actuator exposure per compose/backend image |
| **Live validation** | **Not performed** (F1 simulated execution) |

## Component health matrix

| Component | Mechanism | Probe | FR2/F1 live |
|-----------|-----------|-------|-------------|
| **postgres** | Docker healthcheck | `pg_isready` | N/A |
| **backend** | Image HEALTHCHECK + Actuator | `/actuator/health` on :8080 | N/A |
| **frontend** | `depends_on: backend healthy` | nginx :80 | N/A |
| **Stack** | `docker compose ps` | All services running | N/A |

## Expected healthy states (post-deploy)

| Check | Action | Healthy signal |
|-------|--------|----------------|
| Compose | `docker compose ps` | postgres, backend, frontend up |
| Postgres | inspect health | `healthy` |
| Backend logs | after recreate | Flyway OK; no fatal JDBC |
| Actuator | via nginx `/api` proxy if configured | `status` UP |
| Edge | `curl http://<host>/` | HTTP 200 SPA |

## Dependency availability (pre-deploy)

| Dependency | Required | Signal |
|------------|----------|--------|
| Docker Hub | Pull backend `:latest` | Pull succeeds in deploy script |
| springboot `build-image` | F1 test gate | **Run tests** step green before push |
| Droplet Docker | Compose v2 | `docker compose version` |
| Postgres volume | Data continuity | Not recreated on app-only deploy |
| GitHub SSH deploy | Remote script | Workflow job green |

## Gaps vs Operation guardrails

| Guardrail | As-built | Backlog |
|-----------|----------|---------|
| Post-deploy smoke | Manual checklist | Automate in compose workflow |
| Quantified SLO | Not in repo | observability-setup stage |
| Auto rollback on failed health | None | Operator manual |

## F1 note

F1 improves **confidence in backend image bytecode** before Hub publish; health checks at deploy time are unchanged.

## Traceability

| Upstream | Covered |
|----------|---------|
| `cd-config` | CD stages; F1 CI gate |
| `deployment-strategy` | Operator monitoring |
| `test-results` | Pre-deploy Maven evidence |

**Artifact revision:** 2026-10-14 — saved after consolidated summary confirmation.
