# Tech Stack Decisions — unit `habit-tracker-compose`

Planning-only intent (FR2). **Affirm as-built lock-in**. Source: `codekb/habit-tracker-compose/technology-stack.md`, C2/C3, affirmed mandates.

## Orchestration and runtime images

| ID | Decision | Version / choice | Rationale |
|----|----------|------------------|-----------|
| **NFR7.1** | Orchestration | **Docker Compose v2** (`docker compose`) | Deploy script and docs |
| **NFR7.2** | Compose project name | **`habit-tracker-springboot`** | Stable scripts/docs contract |
| **NFR7.3** | Database image | **postgres:16-alpine** | As-built stack |
| **NFR7.4** | Backend image | **`docker.io/crraay/habit-tracker-springboot:latest`** | C2 — built in U1 CI |
| **NFR7.5** | Frontend image | **`docker.io/crraay/habit-tracker-angular:latest`** | C3 — built in U2 CI |

## Deploy automation

| ID | Decision | Notes |
|----|----------|-------|
| **NFR7.6** | Shell | Bash **`scripts/deploy-service.sh`** with **`set -euo pipefail`** | Team code style |
| **NFR7.7** | CI | GitHub Actions **`ubuntu-latest`** | `deploy-docker-image-ssh.yml` |
| **NFR7.8** | SSH action | **appleboy/ssh-action v1.2.2** | As-built workflow |
| **NFR7.9** | Trigger | **`workflow_dispatch`** (manual) | No continuous deploy from compose repo |

## Documentation and local dev

| ID | Decision | Notes |
|----|----------|-------|
| **NFR7.10** | Docs | README, **DOCKER.md**, AGENTS.md | Operational truth |
| **NFR7.11** | Local override | **`docker-compose.override.example.yml`** optional sibling builds | Not production path |

## Explicit non-choices (this repo)

| ID | Decision | Notes |
|----|----------|-------|
| **NFR7.12** | No Kubernetes / Terraform / EB in committed production path | Legacy EB/S3 paths live in app repos only |
| **NFR7.13** | No application build in production compose | Pull Hub images only |
| **NFR7.14** | No automated tests in compose repo | Quality gates in U1/U2 |

## Mandates and forbidden paths

| ID | Rule | Source |
|----|------|--------|
| **NFR7.15** | **NEVER** put habit/domain rules or app implementation code in compose repo | project NEVER |
| **NFR7.16** | **ALWAYS** use compose for new operational/deploy work | project ALWAYS |
| **NFR7.17** | Service names **`postgres`**, **`backend`**, **`frontend`** stable for scripts | team code style |

## Follow-up evaluation triggers (non-decisions)

| ID | Trigger | Future intent action |
|----|---------|----------------------|
| **NFR7.18** | Need staging environment | Add second compose project or host — not decided here |
| **NFR7.19** | Image tag strategy change | Coordinate U1/U2 CI + U3 pull pins |
| **NFR7.20** | Secret rotation policy | Document runbook outside this planning intent |
