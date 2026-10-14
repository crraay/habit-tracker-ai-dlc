# Deployment log — F1 springboot CI

Intent `261013-f1-springboot-ci` · **No production deploy was executed** from this workflow. This log documents the **as-built execution path** an operator follows after F1 merges to `main`.

## Sources

- `operation/deployment-pipeline/cd-config.md`, `deployment-strategy.md`, `rollback-runbook.md`
- `construction/build-and-test/test-results.md`
- `habit-tracker-compose/.github/workflows/deploy-docker-image-ssh.yml`, `scripts/deploy-service.sh`
- `operation/deployment-execution/deployment-execution-questions.md`

## Execution status

| Field | Value |
|-------|--------|
| **Live deploy** | **Not performed** (F1 intent — simulated package) |
| **Target environment** | Production — DigitalOcean droplet, Compose project `habit-tracker-springboot` |
| **Documented path** | Compose `deploy-docker-image-ssh` → SSH → `git pull` → `deploy-service.sh` |
| **Build evidence referenced** | Local `mvn test` 11/11 (2026-10-14); F1 adds **`mvn test`** gate in `build-image` on `main` |

## Pre-deployment checklist (operator)

| # | Check | As-built expectation |
|---|--------|----------------------|
| 1 | F1 merged to springboot **`main`** | `build-image.yml`, `Dockerfile`, EB trigger change live |
| 2 | **`build-image`** succeeded on intended commit | GitHub Actions green; **Run tests** step passed (F1) |
| 3 | Docker Hub | `crraay/habit-tracker-springboot:latest` updated |
| 4 | Schema | F1 has **no** Flyway changes — skip migration review unless unrelated release |
| 5 | Compose on droplet | `git pull --ff-only` in `DEPLOY_COMPOSE_DIR` |
| 6 | Droplet `.env` | DB creds, `JWT_SECRET`, `CORS_ALLOWED_ORIGINS` — production values |
| 7 | Rollback plan | `rollback-runbook.md` if smoke fails |
| 8 | Window | Operator discretion (brief recreate downtime) |

## Documented deployment sequence

```text
1. Operator: confirm springboot build-image succeeded with mvn test (F1)
2. GitHub (compose): workflow_dispatch deploy-docker-image-ssh
   - input: backend | frontend | all (typically backend after F1-only)
3. Remote SSH script:
   - cd DEPLOY_COMPOSE_DIR
   - git pull --ff-only
   - ./scripts/deploy-service.sh <service>
4. deploy-service.sh:
   - docker compose pull
   - recreate selected service(s); postgres volume retained
5. Backend start: Flyway (no new migrations expected for F1)
6. Operator: smoke tests (see smoke-test-results.md)
7. On failure: rollback-runbook.md
```

## Service-specific notes (F1)

| Input | When to use |
|-------|-------------|
| `backend` | **Default after F1** — only backend image/CI changed |
| `frontend` | Unchanged by F1 unless separate angular release |
| `all` | Both Hub tags updated |

## Migration log

| Migration action | F1 intent |
|------------------|-----------|
| Flyway on backend container start | **No schema change** — documented path only |

## Timestamps and actors

| Event | When | Who |
|-------|------|-----|
| Artifact authoring | 2026-10-14 | AI-DLC Operation stage (simulated execution) |
| Live deploy | — | Operator (out of scope this intent) |

## F1 boundary

This intent changed **CI test gate** in springboot; compose deploy mechanics are unchanged. Live rollout is operator-driven after merge.

**Artifact revision:** 2026-10-14 — saved after consolidated summary confirmation.
