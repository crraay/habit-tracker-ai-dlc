# CD configuration — F1 springboot build-image CI tests

Intent `261013-f1-springboot-ci` · **Documentation only**; F1 changed **U1 CI** (`habit-tracker-springboot` `build-image` test gate). **No CD pipeline files** were modified in compose or app repos during this intent.

## End-to-end CD flow

```text
Developer merge → springboot main → build-image (mvn test → package → Docker push :latest)
       → operator workflow_dispatch (compose) → SSH → git pull → deploy-service.sh
       → docker compose pull + recreate (backend | frontend | all)
       → manual smoke (login, /api/me, track)
```

There is **no continuous deployment** from compose repo push to production.

## F1 change vs CD

| Layer | Before F1 | After F1 (this intent) |
|-------|-----------|-------------------------|
| U1 `build-image` on `main` | `mvn -DskipTests package` then Docker push | **`mvn test`** then package; push only if tests pass |
| Compose deploy (U3) | Unchanged | Unchanged — still manual after Hub update |
| Dockerfile (U1) | `-DskipTests` in image build stage | **`mvn test package`** in build stage |

CD still assumes a **green CI publish** before the operator pulls `:latest` on the droplet.

## CD stages (logical)

| Step | System | Action | Gate |
|------|--------|--------|------|
| 1 | GitHub (springboot) | `build-image` on `main` / dispatch | **`mvn -B test`**, then package |
| 2 | Docker Hub | Push `crraay/habit-tracker-springboot:latest` | Maven + Docker build success |
| 3 | Operator | Confirm Hub backend tag updated (angular unchanged unless separate release) | Process |
| 4 | GitHub (compose) | Run `deploy-docker-image-ssh.yml` | Manual dispatch |
| 5 | Droplet | `git pull --ff-only` in `DEPLOY_COMPOSE_DIR` | SSH auth |
| 6 | Droplet | `./scripts/deploy-service.sh <service>` | Script exit 0 |
| 7 | Runtime | Flyway in new backend container | App health / logs |
| 8 | Operator | Smoke test | Manual |

## Workflow reference

| Repo | Workflow | Role |
|------|----------|------|
| `habit-tracker-springboot` | `.github/workflows/build-image.yml` | CI publish backend `:latest` |
| `habit-tracker-compose` | `.github/workflows/deploy-docker-image-ssh.yml` | CD pull/recreate on droplet |

Deploy workflow input: `all` | `backend` | `frontend`.

## Artifact promotion

| Artifact | Source | Consumer | Tag |
|----------|--------|----------|-----|
| Backend image | springboot CI | compose `backend` service | `:latest` |
| Frontend image | angular CI (unchanged by F1) | compose `frontend` service | `:latest` |
| Compose manifests | compose git | Droplet | branch `main` |

No separate artifact repository on the production path.

## Environment matrix

| Environment | Definition | CD trigger |
|-------------|------------|------------|
| Local dev | Optional override compose building siblings | Developer |
| Production | Droplet + `.env` | Manual compose workflow after Hub update |

## Sources

- `inception/requirements-analysis/requirements.md` (FR1–FR4)
- `construction/build-and-test/build-and-test-summary.md`
- `habit-tracker-compose/DOCKER.md`
- `operation/deployment-pipeline/deployment-pipeline-questions.md` (Q1–Q6)
