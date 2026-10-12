# Technology Stack

**Repo:** habit-tracker-compose  
**Scan kind:** full — versions recorded here. [dependencies.md](./dependencies.md) lists external images and tooling edges.

| Layer | Choice | Version / evidence |
|-------|--------|-------------------|
| Orchestration | Docker Compose | Compose v2 required (`docker compose` in deploy script) |
| Compose project | Multi-service YAML | `docker-compose.yml`; project `name: habit-tracker-springboot` |
| Database image | PostgreSQL | `postgres:16-alpine` |
| Backend runtime image | Spring Boot (pre-built) | `docker.io/crraay/habit-tracker-springboot:latest` |
| Frontend runtime image | Angular + nginx (pre-built) | `docker.io/crraay/habit-tracker-angular:latest` |
| Shell | Bash | `scripts/deploy-service.sh` (`set -euo pipefail`) |
| CI platform | GitHub Actions | `ubuntu-latest` runner |
| SSH action | appleboy/ssh-action | `v1.2.2` |
| Host OS (documented) | Ubuntu + Docker CE | `DOCKER.md` initial server setup |
| Documentation | Markdown | README, DOCKER, AGENTS |

Not present in this repo: application language runtimes, package managers, test frameworks, or image build pipelines (those live in app repos).

## Environment and tooling assumptions

- **Docker Hub:** Public pulls; no `docker login` on droplet for app images.
- **Git on server:** FF-only pull before deploy; compose dir is a git clone.
- **Port 80:** Host nginx must be disabled if it conflicts with frontend binding.
- **Docker group:** Deploy user must run `docker compose` without sudo after `usermod -aG docker`.

## Cross-repo build stack (reference only)

When using `docker-compose.override.example.yml`, local builds delegate to sibling repos’ Dockerfiles (Maven/Spring and npm/Angular). That stack is **not** part of this repository’s committed production path.
