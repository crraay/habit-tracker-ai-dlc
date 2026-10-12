# Deployment log — full-repo-scan

Intent `260914-full-repo-scan` · **FR2 planning-only** · **No production deploy was executed** from this workflow. This log documents the **as-built execution path** an operator follows.

## Sources

- `operation/deployment-pipeline/cd-config.md`, `deployment-strategy.md`, `rollback-runbook.md`
- `operation/environment-provisioning/environment-inventory.md`
- `construction/build-and-test/test-results.md`
- `habit-tracker-compose/.github/workflows/deploy-docker-image-ssh.yml`, `scripts/deploy-service.sh`

## Execution status

| Field | Value |
|-------|--------|
| **Live deploy** | **Not performed** (FR2) |
| **Target environment** | Production — DigitalOcean droplet, Compose project `habit-tracker-springboot` |
| **Documented path** | U3 `deploy-docker-image-ssh` → SSH → `git pull` → `deploy-service.sh` |
| **Build evidence referenced** | U1 `mvn -B test` 11/11; U2 `test:ci` 29/29 (2026-10-08 workstation) |

## Pre-deployment checklist (operator)

| # | Check | As-built expectation |
|---|--------|----------------------|
| 1 | App changes merged to `main` in U1 and/or U2 | Yes, for image updates |
| 2 | `build-image` succeeded on intended commit(s) | Verify GitHub Actions + Docker Hub `:latest` |
| 3 | U2 tests | `npm run test:ci` in `build-image` |
| 4 | U1 tests | **Gap:** `build-image` may skip tests — prefer full `build-and-test` before prod push |
| 5 | Flyway | Review migrations in backend release if schema changed |
| 6 | U3 compose on droplet | `git pull --ff-only` in `DEPLOY_COMPOSE_DIR` |
| 7 | Droplet `.env` | DB creds, `JWT_SECRET`, `CORS_ALLOWED_ORIGINS` production values |
| 8 | Rollback plan | `rollback-runbook.md` if smoke fails |
| 9 | Window | Operator discretion (brief recreate downtime) |

## Documented deployment sequence

```text
1. Operator: confirm Hub tags for crraay/habit-tracker-{springboot,angular}:latest
2. GitHub (U3): workflow_dispatch deploy-docker-image-ssh
   - input: all | backend | frontend
3. Remote SSH script:
   - cd DEPLOY_COMPOSE_DIR (default /app/habit-tracker-compose)
   - git pull --ff-only
   - ./scripts/deploy-service.sh <service>
4. deploy-service.sh (per service):
   - docker compose pull
   - stop/rm/up -d (postgres untouched)
   - docker compose ps
5. Backend start: Flyway migrations run inside new C2 container
6. Operator: smoke tests (see smoke-test-results.md)
7. On failure: rollback-runbook.md
```

## Service-specific notes

| Input | Script behavior | Postgres |
|-------|-----------------|----------|
| `backend` | Pull/recreate backend only | Running; volume retained |
| `frontend` | Pull/recreate frontend only | Unchanged |
| `all` | Pull both; backend then frontend | Unchanged |

## Migration log

| Migration action | FR2 intent |
|------------------|------------|
| Flyway on backend container start | **Documented only** — no migration run recorded here |

## Timestamps and actors

| Event | When | Who |
|-------|------|-----|
| Artifact authoring | 2026-10-09 | AI-DLC Operation stage (planning) |
| Live deploy | — | Operator (out of scope this intent) |

## Traceability

| Upstream | Use |
|----------|-----|
| `cd-config` | CD stages and workflow reference |
| `deployment-strategy` | Recreate strategy, preconditions |
| `environment-inventory` | Stack and secrets map |
| `test-results` | Baseline CI evidence for pre-check narrative |
