# Infrastructure Specification — unit `habit-tracker-compose`

Planning-only intent (FR2). **As-built stack mapping** (Q1–Q3 **A**): U3 orchestrates Postgres, C2 backend, and C3 frontend on a single DigitalOcean droplet; app images are built in U1/U2 CI and pulled from Docker Hub.

## Sources

- `nfr-design/security-design.md`, `traceability.json`
- `contract-summary.md` (C2, C3)
- U1/U2 `infrastructure-design/infrastructure-specification.md`
- `habit-tracker-compose/docker-compose.yml`, `scripts/deploy-service.sh`, `.env.example`, `DOCKER.md`
- `project.md` — Compose production path; no app code in U3 repo
- Summary confirmation: Q1–Q7 **A** (`infrastructure-design-questions.md`)

## Deployment

| Facet | Choice | Rationale |
|-------|--------|-----------|
| Compute model | **Single-host Docker Compose v2** | Project `habit-tracker-springboot`; three services on one droplet (NFR2.3) |
| Orchestration artifact | `docker-compose.yml` in U3 repo | Hub images only — no in-repo app build for production (NFR7.17) |
| Image contracts | C2 `crraay/habit-tracker-springboot:latest`, C3 `crraay/habit-tracker-angular:latest` | Built in U1/U2; U3 pull-only (NFR3.14) |
| Networking topology | **Bridge network** (default); **published** `80:80` on `frontend` only | Backend and Postgres not exposed to host (NFR3.5, NFR3.7) |
| API path | Browser → nginx (C3) → `http://backend:8080` for `/api/` | C1 same-origin; internal DNS (NFR3.6, NFR3.7) |
| Ingress / TLS | **HTTP port 80** in committed compose; TLS/HSTS via operator nginx extension or external terminator | NFR3.6 design assumes TLS at edge — not mounted in base YAML |
| Storage strategy | **Postgres 16 Alpine** + named volume `habit-tracker-springboot_postgres_data` | Survives app redeploys (NFR3.12); Flyway in C2 (NFR3.13) |
| Environments | **Production:** droplet + `.env`; **Local dev:** optional `docker-compose.override.example.yml` (build siblings) | No staging stack in repo (team.md) |
| IaC approach | **None** — operator-managed droplet + git-tracked compose | NFR4.10 non-goals for app units; U3 is source of truth for stack YAML |
| Resource sizing | Vertical droplet CPU/RAM; no compose-level limits set | Personal-scale; JVM/nginx sizing in U1/U2 images |
| Scaling policy | **No horizontal replicas**; recreate containers on pull | Manual rollout after U1/U2 `build-image` on `main` (NFR2.2) |
| Deploy mechanism | SSH + `git pull --ff-only` + `./scripts/deploy-service.sh` | Manual `workflow_dispatch` (NFR3.8–NFR3.11) |
| Planning boundary | FR2 documents as-built; **does not mandate** compose merges this intent | NFR2.1 |

## Infrastructure Services

| Service | Role | Configuration | Notes |
|---------|------|---------------|-------|
| `postgres` | database | `postgres:16-alpine`; env from `.env`; `pg_isready` healthcheck | JDBC from `backend` only |
| `backend` | application (C2) | Hub image; env: datasource, `JWT_SECRET`, `CORS_ALLOWED_ORIGINS`, actuator health | `depends_on` postgres healthy; health from image HEALTHCHECK |
| `frontend` | edge + reverse proxy (C3) | Hub image; `ports: "80:80"`; nginx SPA + `/api/` proxy | `depends_on` backend healthy |
| Docker Hub | registry | Public pulls on droplet — no registry login in compose | NFR3.14 |
| Host `.env` | secrets + config | From `.env.example`; never commit production values | NFR3.1–NFR3.3 |
| GitHub Actions (U3) | deploy automation | `deploy-docker-image-ssh.yml` | SSH secrets; no image build in U3 |
| Droplet filesystem | persistent data | Named volume on host Docker | Backup runbook backlog (BL-OPS-04) |

No cache, queue, CDN, load balancer fleet, or separate DB host in as-built production.

## Shared Infrastructure

| Shared Resource | Owner Unit | Consumer Units | Access Boundary |
|-----------------|------------|----------------|-----------------|
| Compose project `habit-tracker-springboot` | U3 | U1 C2, U2 C3, Postgres | Single default bridge network |
| Volume `habit-tracker-springboot_postgres_data` | U3 | U1 backend (JDBC) | Not mounted in frontend container |
| Public HTTP entry (port 80) | U3 `frontend` | Browser (C1) | Only published port |
| Internal `backend:8080` | U3 stack | U2 nginx proxy | Not published to host |
| Droplet `.env` | Operator | All three services via compose interpolation | Shared JWT/DB/CORS for backend |
| Deploy user + `docker` group | Operator | U3 deploy script | SSH from GHA (NFR3.11) |

## Design backlog (infrastructure-facing)

| Label | Item | Trigger |
|-------|------|---------|
| BL-INFRA-U3-01 | SSH key-based auth + restrict source IPs | NFR3.9, NFR3.18 / BL-OPS-01 |
| BL-INFRA-U3-02 | Pin image digests or semver tags in compose pulls | NFR3.15, NFR3.19 / BL-OPS-02 |
| BL-INFRA-U3-03 | Container/dependency CVE scan in U3 or cross-repo CI | NFR3.16 / BL-OPS-03 |
| BL-INFRA-U3-04 | Postgres volume backup/restore runbook on droplet | NFR3.20 / BL-OPS-04 |
| BL-INFRA-U3-05 | Document TLS termination pattern (certs, HSTS) for production | Gap vs NFR3.6 narrative |
| BL-INFRA-U3-06 | Optional staging compose project on second host or branch | Not in repo today |
