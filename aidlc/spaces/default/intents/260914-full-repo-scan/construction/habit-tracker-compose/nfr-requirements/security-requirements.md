# Security Requirements — unit `habit-tracker-compose`

Planning-only intent (FR2). **As-built + backlog** for production packaging and deploy. Sources: CodeKB architecture, C2/C3 in `contract-summary.md`, `DOCKER.md`, `.env.example`, affirmed team/project rules.

## Secrets and configuration

| ID | Requirement | As-built |
|----|-------------|----------|
| **NFR3.1** | Production secrets live in host **`.env`** (from **`.env.example`**) — DB credentials, **`JWT_SECRET`**, **`CORS_ALLOWED_ORIGINS`**. | Mandated |
| **NFR3.2** | **NEVER** commit real production secrets or use example values on the droplet (project NEVER). | Mandated |
| **NFR3.3** | Postgres credentials injected into backend via Compose env; not baked into Hub images. | `docker-compose.yml` |
| **NFR3.4** | GitHub Actions stores registry/deploy credentials as workflow secrets. | As-built |

## Network and exposure

| ID | Requirement | As-built |
|----|-------------|----------|
| **NFR3.5** | Only host port **80** published on frontend service; backend and postgres on internal Compose network. | As-built |
| **NFR3.6** | Browser TLS terminates at nginx in frontend image (U2 build); compose file does not define certificates. | Deployment pattern |
| **NFR3.7** | `/api` proxied frontend → backend on Docker network — not exposed as separate host port. | C1-ext / nginx |

## Deploy access control

| ID | Requirement | As-built |
|----|-------------|----------|
| **NFR3.8** | Production rollout via **manual** `workflow_dispatch` on **`deploy-docker-image-ssh.yml`**. | Team deployment |
| **NFR3.9** | Deploy uses **SSH** to droplet (`appleboy/ssh-action`); password-based auth may be configured in secrets today. | Backlog: key-based auth |
| **NFR3.10** | On-server **`git pull --ff-only`** in **`DEPLOY_COMPOSE_DIR`** before `deploy-service.sh`. | As-built |
| **NFR3.11** | Deploy user in **`docker`** group to run `docker compose` without sudo. | DOCKER.md |

## Data durability

| ID | Requirement | As-built |
|----|-------------|----------|
| **NFR3.12** | Postgres data in named volume **`habit-tracker-springboot_postgres_data`** preserved across app redeploys. | As-built |
| **NFR3.13** | Flyway migrations ship in backend image (U1); compose does not run migrations separately. | Team note |

## Image supply chain

| ID | Requirement | As-built |
|----|-------------|----------|
| **NFR3.14** | Production pulls **public** Hub tags `crraay/habit-tracker-{springboot,angular}:latest` (C2/C3). | No droplet registry login |
| **NFR3.15** | Rollback is **manual** (redeploy prior tag/digest if recorded). | Team deployment |
| **NFR3.16** | No automated container/CVE scanning in compose CI today. | Backlog |

## Compliance

| ID | Requirement | As-built |
|----|-------------|----------|
| **NFR3.17** | No regulatory framework in scope for this personal deployment stack. | N/A |

## Security backlog (non-enforcing)

| ID | Gap / risk | Suggested follow-up |
|----|------------|---------------------|
| **NFR3.18** | SSH password auth in workflow vs key-only | Rotate to keys, restrict source IPs |
| **NFR3.19** | `:latest` tag mutability | Pin digests or semver tags in compose for reproducible rollback |
| **NFR3.20** | Single-host blast radius | Document backup/restore for postgres volume |

## Inception NFR2 (documented ops — not a change mandate this intent)

| ID | Requirement | As-built |
|----|-------------|----------|
| **NFR2.1** | This intent **does not authorize** compose repo merges as deliverables (FR2); U3 artifacts describe **current** production path only. | Planning boundary |
| **NFR2.2** | Manual production rollout after app-repo **`build-image`** on **`main`**. | Team cadence |
| **NFR2.3** | Single DigitalOcean droplet, Compose project **`habit-tracker-springboot`**. | CodeKB |

## Traceability to inception NFR3

**ALWAYS** keep production deploy path in **habit-tracker-compose** (project mandate) — reflected in **NFR3.8** and tech-stack **NFR7.x**.
