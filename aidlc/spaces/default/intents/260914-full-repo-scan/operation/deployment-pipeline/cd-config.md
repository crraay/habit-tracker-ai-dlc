# CD configuration — full-repo-scan (as-built)

Intent `260914-full-repo-scan` · **FR2:** documentation only; **no CD pipeline files were changed** in sibling repos.

## End-to-end CD flow

```text
Developer merge → U1/U2 main → build-image (Hub :latest)
       → operator workflow_dispatch (U3) → SSH → git pull → deploy-service.sh
       → docker compose pull + recreate (backend | frontend | all)
       → manual smoke (login, /api/me, track)
```

There is **no continuous deployment** from compose repo push to production.

## CD stages (logical)

| Step | System | Action | Gate |
|------|--------|--------|------|
| 1 | GitHub (U1/U2) | `build-image` on `main` | U2: `npm run test:ci`; U1: tests skipped (GAP) |
| 2 | Docker Hub | Push `crraay/habit-tracker-{springboot,angular}:latest` | Image build success |
| 3 | Operator | Confirm Hub tags updated | Process |
| 4 | GitHub (U3) | Run `deploy-docker-image-ssh.yml` | Manual dispatch |
| 5 | Droplet | `git pull --ff-only` in `DEPLOY_COMPOSE_DIR` | SSH auth |
| 6 | Droplet | `./scripts/deploy-service.sh <service>` | Script exit 0 |
| 7 | Runtime | Flyway in new backend container | App health / logs |
| 8 | Operator | Smoke test | Manual |

## Workflow reference (U3)

- **File:** `habit-tracker-compose/.github/workflows/deploy-docker-image-ssh.yml`
- **Input:** `all` | `backend` | `frontend`
- **Concurrency:** `deploy-docker-image-ssh` group
- **Secrets:** SSH host, user, password (or key — improvement backlog)

## Artifact promotion

| Artifact | Source | Consumer | Tag |
|----------|--------|----------|-----|
| Backend image C2 | U1 CI | U3 `backend` service | `:latest` |
| Frontend image C3 | U2 CI | U3 `frontend` service | `:latest` |
| Compose manifests | U3 git | Droplet | branch `main` |

No separate artifact repository (S3/CodeArtifact) on the Compose production path.

## Environment matrix

| Environment | Definition | CD trigger |
|-------------|------------|------------|
| Local dev | Optional override compose building siblings | Developer |
| Production | Droplet + `.env` | Manual U3 workflow after Hub update |

## Alignment with CI

See `construction/ci-pipeline/quality-gates.md`. CD assumes CI has published images; it does **not** re-run unit tests on the droplet.

## Follow-up (F3)

- Automate post-deploy health check in workflow (curl `/actuator/health`, nginx `/`).
- SSH key auth; record image digest on deploy for rollback.
- Optional staging droplet (not in repo today).
