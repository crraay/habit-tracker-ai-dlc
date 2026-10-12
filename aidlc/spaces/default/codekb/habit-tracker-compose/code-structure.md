# Code Structure — habit-tracker-compose

Deep path list lives once in [reverse-engineering-timestamp.md](./reverse-engineering-timestamp.md) (`analyzed.paths: ./`). This file classifies the tiny tree.

## Package and Module Organization

Single repository root — no language packages, no nested modules. All artifacts are **infrastructure-as-files**.

| Area | Location | Role |
|------|----------|------|
| Stack definition | `docker-compose.yml` | Production three-service topology, volumes, depends_on |
| Local build merge | `docker-compose.override.example.yml` | Optional sibling-repo `build` contexts |
| Secrets template | `.env.example` | Documented env contract (not loaded by git) |
| Deploy automation | `scripts/deploy-service.sh` | Pull/recreate backend and/or frontend |
| CI | `.github/workflows/deploy-docker-image-ssh.yml` | Manual SSH deploy |
| Operator docs | `README.md`, `DOCKER.md` | Entry + full operations |
| Agent guardrails | `AGENTS.md` | Scope boundary for AI edits |
| Ignore rules | `.gitignore` | Typical env/local override exclusions |

There is no `src/`, no test tree, and no dependency manifest (no `package.json`, `pom.xml`, or `requirements.txt`).

## File Classification

| Class | Files | Notes |
|-------|-------|-------|
| Declarative runtime | `docker-compose.yml`, override example | Source of truth for service graph |
| Imperative deploy | `scripts/deploy-service.sh` | Bash; executable bit expected on server after pull |
| CI glue | `.github/workflows/*.yml` | Single workflow file |
| Configuration sample | `.env.example` | Must copy to `.env` locally/on droplet |
| Documentation | `README.md`, `DOCKER.md`, `AGENTS.md` | Strong operational coverage |
| Version control | `.git/` | Metadata only in scan |

## Code Patterns

- **Compose as integration contract:** Service names (`postgres`, `backend`, `frontend`) are stable identifiers used by deploy script and docs.
- **Environment indirection:** `${POSTGRES_USER}` and friends keep secrets out of YAML; defaults only where safe (`POSTGRES_DB`).
- **Idempotent deploy:** Pull latest image tag, force-remove old container, `up -d` — no blue/green or rolling strategy.
- **Separation from app build:** Production path never references `build:` in committed compose; override pattern keeps dev build optional.
- **Cross-repo naming legacy:** Compose `name` and external volume name align with prior `habit-tracker-springboot`-only deploy for data migration.

## Repository Topology (workspace)

In the monorepo workspace, this directory sits beside `habit-tracker-springboot` and `habit-tracker-angular`. Override example assumes:

```
../habit-tracker-springboot
../habit-tracker-angular
../habit-tracker-compose   (this repo)
```

Production droplet typically clones **only** `habit-tracker-compose` per `DOCKER.md`.
