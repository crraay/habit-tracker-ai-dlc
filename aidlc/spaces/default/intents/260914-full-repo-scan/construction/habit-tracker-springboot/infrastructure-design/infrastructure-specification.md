# Infrastructure Specification — unit `habit-tracker-springboot`

Planning-only intent (FR2). **As-built deploy mapping** (Q1–Q3 **A**): U1 publishes the **C2** backend image; U3 (`habit-tracker-compose`) runs it with Postgres and nginx-fronted SPA on a single droplet.

## Sources

- `nfr-design/logical-components.md`, `scalability-design.md`, `reliability-design.md`, `security-design.md`
- `contract-summary.md` (C1, C2)
- `habit-tracker-springboot/Dockerfile`, `habit-tracker-compose/docker-compose.yml`
- `project.md` — Compose production path; Elastic Beanstalk legacy NEVER

## Deployment

| Facet | Choice | Rationale |
|-------|--------|-----------|
| Compute model | **Single Docker container** (JVM 17, fat JAR) | Layered monolith (NFR4.2); one `backend` service in compose (NFR4.1) |
| Image artifact | `docker.io/crraay/habit-tracker-springboot:latest` | C2 contract; built in U1 CI, pulled by U3 |
| Build | Multi-stage Dockerfile: Maven build → `eclipse-temurin:17-jdk` runtime | NFR7.17; non-root `appuser` |
| Health signal | `GET /actuator/health` + Dockerfile `HEALTHCHECK` (curl) | NFR5.1, NFR5.2; compose `depends_on: service_healthy` for frontend |
| Networking topology | **Internal** Docker bridge: `backend:8080`, `postgres:5432`; **no** published backend port | C1: browser hits nginx on U3 `frontend:80`, proxies `/api/` to backend |
| Ingress / TLS | TLS terminates at **nginx** (U3 frontend container) | NFR3.9; backend HTTP inside compose network |
| Storage strategy | Stateless container filesystem; **no** local app data | All durable state in Postgres volume (U3) |
| Environments | **Local dev:** `mvn spring-boot:run` + local Postgres; **Prod:** Hub images + droplet `.env` | No staging stack defined in repos |
| IaC approach | **None in U1** — compose + operator-managed droplet | NFR4.10 non-goals; U3 owns orchestration YAML |
| Resource sizing | Vertical droplet CPU/RAM; JVM heap unset in repo; Hikari Boot defaults | NFR4.8, NFR2.9; personal-scale assumption (NFR4.4) |
| Scaling policy | **No horizontal replicas**; redeploy `:latest` on same host | NFR4.1, NFR4.9 scheduler single-leader |
| Legacy | `.github/workflows/deploy-to-elastic-beanstalk.yml` | **Do not extend** (NFR7.27 / AGENTS.md) |

## Infrastructure Services

| Service | Role | Configuration | Notes |
|---------|------|---------------|-------|
| `backend` (U1 image) | load-balancer target (internal) | `SERVER_PORT=8080`; env from compose | Published by U1 CI; consumed by U3 |
| PostgreSQL 16 Alpine | database | `POSTGRES_DB`, user/password from `.env`; volume `postgres_data` | **Provisioned by U3**; U1 JDBC URL `jdbc:postgresql://postgres:5432/...` |
| HikariCP (in JVM) | connection pool | Spring Boot defaults | Bounds concurrent DB use (NFR4.7) |
| Docker Hub | registry | `DOCKER_HUB_*` secrets in GitHub Actions | Image pull on droplet for deploy |
| nginx (U3 `frontend`) | reverse proxy / TLS | Proxies `/api/*` to backend | C1 same-origin API from browser |
| Host `.env` (droplet) | secrets store | `JWT_SECRET`, DB creds, `CORS_ALLOWED_ORIGINS` | NFR3.4, NFR3.11; rotation backlog (NFR3.19) |
| GitHub Actions | build/publish | `build-image.yml` on `main`; `build-and-test.yml` on feature branch | See `cicd-pipeline.md`; test skip gap on image job |
| Actuator | health endpoint | `MANAGEMENT_ENDPOINTS_WEB_EXPOSURE_INCLUDE=health` in compose | Public route per security matrix |

No cache, queue, CDN, or search services for U1 in as-built production.

## Shared Infrastructure

| Shared Resource | Owner Unit | Consumer Units | Access Boundary |
|-----------------|------------|----------------|-----------------|
| Postgres 16 + `habit-tracker-springboot_postgres_data` volume | `habit-tracker-compose` (U3) | U1 backend (JDBC), indirectly U2 via API | Compose network DNS `postgres`; credentials in shared `.env` |
| Docker Compose project `habit-tracker-springboot` | U3 | U1 image, U2 image, Postgres | Single bridge network; restart policies on all services |
| Droplet host + `.env` | Operator | U3 stack | SSH/deploy channel; not modeled in U1 repo |
| Public HTTPS entry (port 80/443) | U3 `frontend` | Browser, C1 | nginx terminates TLS; CORS from backend env |

## Design backlog (infrastructure-facing)

| Label | Item | Trigger |
|-------|------|---------|
| BL-INFRA-01 | Run `mvn test` (or gate) before `build-image` push on `main` | NFR5.17 / NFR7.26 vs current `-DskipTests` |
| BL-INFRA-02 | Document Postgres backup/restore on droplet | NFR5.7 |
| BL-INFRA-03 | CI dependency/CVE scanning | NFR3.18 |
| BL-INFRA-04 | Optional pinned image digest deploy instead of `:latest` only | NFR5.10 rollback ergonomics |
