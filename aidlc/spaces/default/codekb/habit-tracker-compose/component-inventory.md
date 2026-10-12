# Component Inventory

**Repo:** habit-tracker-compose  
**Scan kind:** full — this file is the component catalogue. Scope `analyzed.components` must match these headings verbatim.

```yaml
components:
  - name: Compose Stack Definition
    health: at-risk
    owns: docker-compose.yml multi-service topology
  - name: Environment Contract
    health: healthy
    owns: .env.example secret and datasource variables
  - name: Local Dev Override
    health: healthy
    owns: docker-compose.override.example.yml sibling builds
  - name: Deploy Executor
    health: healthy
    owns: scripts/deploy-service.sh pull/recreate
  - name: GitHub Deploy Pipeline
    health: at-risk
    owns: deploy-docker-image-ssh workflow
  - name: Operational Documentation
    health: healthy
    owns: README.md DOCKER.md AGENTS.md
```

## Compose Stack Definition

- **Responsibility:** Declares `postgres`, `backend`, and `frontend` services; volume `habit-tracker-springboot_postgres_data`; restart policies; `depends_on` with health conditions.
- **Depends on:** Environment Contract (interpolated vars); external Hub images.
- **Dependents:** Deploy Executor; runtime on any host running Compose v2.
- **Health:** **at-risk** — `frontend` requires `backend` with `condition: service_healthy`, but `backend` has no Compose `healthcheck` despite Actuator health env exposure; only `postgres` defines `pg_isready`.
- **Evidence:** `docker-compose.yml` lines 14–19 (postgres healthcheck), 32–34 (backend depends on postgres), 41–43 (frontend depends on backend healthy).

## Environment Contract

- **Responsibility:** Documents required `.env` keys: `POSTGRES_*`, `JWT_SECRET`, `CORS_ALLOWED_ORIGINS`; copy-from-example workflow.
- **Depends on:** nothing in-repo.
- **Dependents:** Compose Stack Definition (variable substitution); backend container env at runtime.
- **Health:** healthy — clear comments; warns not to commit `.env` and to rotate secrets in production.

## Local Dev Override

- **Responsibility:** Optional override to `build` backend and frontend from `../habit-tracker-springboot` and `../habit-tracker-angular` while keeping Hub image names.
- **Depends on:** sibling repos on disk; Compose merge semantics.
- **Dependents:** developer local workflows only (not production droplet path in docs).
- **Health:** healthy — example file only; local `docker-compose.override.yml` gitignored by convention.

## Deploy Executor

- **Responsibility:** Bash entry `deploy-service.sh backend|frontend|all`: `docker compose pull`, stop/rm, `up -d` for selected services; leaves Postgres running.
- **Depends on:** Compose Stack Definition; Docker Compose v2 CLI.
- **Dependents:** GitHub Deploy Pipeline (remote invocation).
- **Health:** healthy — `set -euo pipefail`, explicit usage, prints `docker compose ps` after deploy.

## GitHub Deploy Pipeline

- **Responsibility:** `workflow_dispatch` job SSHs to server, `git pull --ff-only` in compose dir, runs deploy script with input `all|backend|frontend`.
- **Depends on:** Deploy Executor; secrets `SERVER_HOST`, `SERVER_USER`, `SERVER_PASSWORD`; optional vars `DEPLOY_COMPOSE_DIR`, `SERVER_SSH_PORT`, `DEPLOY_SSH_COMMAND_TIMEOUT`.
- **Dependents:** production release process (manual gate after Hub images update).
- **Health:** **at-risk** — password-based SSH; no build/test gates in this repo; concurrency group prevents parallel deploy cancel but does not serialize across repos.

## Operational Documentation

- **Responsibility:** Human and agent entry points: quick start, CI/CD split (build in app repos vs deploy here), droplet setup, migration notes, troubleshooting pointers.
- **Depends on:** all other components for accuracy.
- **Dependents:** operators and AI-DLC agents (`AGENTS.md` guardrails).
- **Health:** healthy — strong cross-links to sibling repos and domain doc URL.
