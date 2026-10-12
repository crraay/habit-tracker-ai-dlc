# Dependencies

**Repo:** habit-tracker-compose  
**Scan kind:** full — external runtime and operational dependencies. Stack summary: [technology-stack.md](./technology-stack.md). Components: [component-inventory.md](./component-inventory.md).

## External runtime (container images)

| Image | Role | Source of updates |
|-------|------|-------------------|
| `postgres:16-alpine` | Persistent relational store | Upstream Docker Hub; pin is in compose |
| `docker.io/crraay/habit-tracker-springboot:latest` | API + migrations in image | `build-image` workflow in habit-tracker-springboot |
| `docker.io/crraay/habit-tracker-angular:latest` | UI + `/api` proxy | `build-image` workflow in habit-tracker-angular |

Volume dependency: named volume `habit-tracker-springboot_postgres_data` → mount `/var/lib/postgresql/data` for `postgres` service.

## External tooling (deploy path)

| Dependency | Version | Used by |
|------------|---------|---------|
| Docker Engine + Compose plugin | CE (documented install) | Host runtime |
| Git | on droplet | Workflow `git pull --ff-only` |
| GitHub Actions | hosted | `deploy-docker-image-ssh.yml` |
| appleboy/ssh-action | v1.2.2 | SSH deploy step |
| SSH reachability | port 22 default | Secrets + optional `SERVER_SSH_PORT` |

## Configuration dependencies (.env)

Required for backend and postgres (from `.env.example`):

- `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`
- `JWT_SECRET` (Base64 HS256 key — must be strong in production)
- `CORS_ALLOWED_ORIGINS` (must include public browser origin, e.g. droplet IP URL)

Compose interpolates these into service `environment` blocks; missing values fail at container start in practice.

## Internal edges (this repo)

```
Operational Documentation → describes → all components
Environment Contract → feeds → Compose Stack Definition
Compose Stack Definition → executed by → Deploy Executor
GitHub Deploy Pipeline → invokes → Deploy Executor
Local Dev Override → merges with → Compose Stack Definition (optional)
```

No compile-time or Maven/npm internal graph exists.

## Sibling systems (hard dependencies)

| System | Relationship |
|--------|----------------|
| habit-tracker-springboot | Builds backend image; owns domain, API, Flyway, JWT implementation |
| habit-tracker-angular | Builds frontend image; owns UI and reverse proxy to API |
| habit-tracker-springboot/docs/domain.md | Canonical product law (linked, not vendored) |

Deploy order for a full release: push both app images to Hub (after their CI gates) → run compose deploy workflow → verify on port 80.

## Downstream consumers

- **Operators / SRE:** run compose and GHA workflow.
- **Full-repo architecture narrative:** this repo closes the deployment story for workspace scans linking three repos.
