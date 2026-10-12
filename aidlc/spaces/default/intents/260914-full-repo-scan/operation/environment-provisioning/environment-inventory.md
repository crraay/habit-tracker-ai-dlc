# Environment inventory — full-repo-scan

Intent `260914-full-repo-scan` · **FR2:** as-built documentation; **no environments were created or modified** during this stage.

## Sources

- `construction/habit-tracker-compose/infrastructure-design/infrastructure-specification.md`
- `construction/habit-tracker-springboot/infrastructure-design/infrastructure-specification.md`
- `construction/habit-tracker-angular/infrastructure-design/infrastructure-specification.md`
- `operation/deployment-pipeline/cd-config.md`
- `habit-tracker-compose/docker-compose.yml`, `.env.example`, `DOCKER.md`, `scripts/deploy-service.sh`

## Environment matrix

| Environment | Host / runtime | Definition in repo | Deploy / refresh |
|-------------|----------------|--------------------|------------------|
| **Production** | DigitalOcean droplet (operator-managed) | U3 `docker-compose.yml` + host `.env` | Manual U3 `deploy-docker-image-ssh.yml` after Hub `:latest` update |
| **Local (Hub pull)** | Developer machine / CI sandbox | Same compose + local `.env` | `docker compose pull && up -d` |
| **Local (build siblings)** | Developer machine | `docker-compose.override.example.yml` → override | Build from `../habit-tracker-springboot`, `../habit-tracker-angular` |
| **Staging** | — | **Not defined** in any scanned repo | Backlog (BL-INFRA-U3-06) |
| **AWS (legacy)** | Elastic Beanstalk / S3+CloudFront | Deprecated workflows in U1/U2 | Not production path per `team.md` |

## Production stack inventory (Compose project `habit-tracker-springboot`)

| Component | Image / artifact | Host exposure | Persistence |
|-----------|------------------|---------------|-------------|
| `postgres` | `postgres:16-alpine` | None (internal) | Named volume `habit-tracker-springboot_postgres_data` |
| `backend` (C2) | `docker.io/crraay/habit-tracker-springboot:latest` | None (internal `:8080`) | Stateless container; Flyway in image |
| `frontend` (C3) | `docker.io/crraay/habit-tracker-angular:latest` | **TCP 80→80** | Stateless container; nginx SPA + `/api/` proxy |

**Compose networking:** default bridge; service DNS names `postgres`, `backend`, `frontend`. Only `frontend` publishes a host port.

**Health checks:** Postgres `pg_isready`; backend/frontend depend on upstream healthy; backend image exposes Spring Actuator health (configured in compose env).

## Configuration and secrets (production)

| Variable / secret | Declared in | Consumed by | Notes |
|-------------------|-------------|-------------|-------|
| `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD` | `.env.example` | `postgres`, JDBC in `backend` | Must not use example password in prod |
| `JWT_SECRET` | `.env.example` | `backend` | HS256 signing; generate per DOCKER.md |
| `CORS_ALLOWED_ORIGINS` | `.env.example` | `backend` | Must include public browser origin |
| `SERVER_HOST`, `SERVER_USER`, `SERVER_PASSWORD` | GitHub Secrets (U3) | Deploy workflow SSH | Key-based auth recommended (backlog) |
| `DEPLOY_COMPOSE_DIR` | GHA variable (default `/app/habit-tracker-compose`) | Deploy script | Clone path on droplet |

No AWS Parameter Store, Secrets Manager, or Vault integration on the as-built Compose path.

## External dependencies

| Dependency | Role | Auth |
|------------|------|------|
| Docker Hub | C2/C3 image registry | Public pull on droplet |
| GitHub Actions (U1/U2) | `build-image` on `main` | Repo secrets for Hub push |
| GitHub Actions (U3) | SSH deploy | Server SSH secrets |
| DigitalOcean | Droplet hosting | Operator account (out of repo) |

## Shared resources and boundaries

| Resource | Owner | Consumers | Boundary |
|----------|-------|-----------|----------|
| Compose project + bridge network | U3 | All three services | Single host |
| Postgres volume | U3 / Docker | U1 backend only | Not mounted in frontend |
| Public HTTP :80 | U3 frontend | Browsers (C1) | Sole ingress in committed compose |
| Internal `backend:8080` | U3 | C3 nginx | Not published to host |
| Domain / TLS certs | Operator | Edge (optional) | Not in base `docker-compose.yml` |

## Local development inventory

- **Hub mode:** mirrors production image sources; useful for integration smoke without sibling clones.
- **Override mode:** builds app images locally; same service names and network semantics; not used on production droplet.

## Alignment with unit infrastructure specs

| Unit | Production role | Inventory note |
|------|-----------------|----------------|
| U1 springboot | C2 image builder + API runtime in stack | JVM app; datasource via compose env; no separate DB host |
| U2 angular | C3 image builder + nginx edge | Same-origin `/api/` proxy to backend |
| U3 compose | Stack orchestration + deploy automation | Sole committed production topology |

## Backlog (environment-facing)

| ID | Item | Source |
|----|------|--------|
| BL-INFRA-U3-01 | SSH key auth, restrict source IPs | NFR / team deployment |
| BL-INFRA-U3-02 | Pin digests or semver tags vs `:latest` | CD + rollback |
| BL-INFRA-U3-04 | Postgres backup/restore on droplet | Ops |
| BL-INFRA-U3-05 | Document TLS termination pattern | Gap vs NFR3.6 narrative |
| BL-INFRA-U3-06 | Optional staging host or compose project | Not in repo today |
