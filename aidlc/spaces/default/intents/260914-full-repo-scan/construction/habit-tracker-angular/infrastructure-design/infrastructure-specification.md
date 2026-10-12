# Infrastructure Specification — unit `habit-tracker-angular`

Planning-only intent (FR2). **As-built deploy mapping** (Q1–Q3 **A**): U2 publishes the **C3** frontend image; U3 (`habit-tracker-compose`) runs it with nginx serving the SPA and proxying `/api/` to U1 backend.

## Sources

- `nfr-design/logical-components.md`, `performance-design.md`, `security-design.md`
- `contract-summary.md` (C1 consumer, C3 image)
- `habit-tracker-angular/Dockerfile`, `nginx.conf`
- `habit-tracker-compose/docker-compose.yml`
- `project.md` — Compose production path; S3/CloudFront legacy not normative

## Deployment

| Facet | Choice | Rationale |
|-------|--------|-----------|
| Compute model | **Single nginx container** (static SPA) | C3 contract; one `frontend` service in compose (NFR2.2, NFR7.17) |
| Image artifact | `docker.io/crraay/habit-tracker-angular:latest` | C3; built in U2 CI, pulled by U3 |
| Build | Multi-stage Dockerfile: Node 20 `npm ci` + production `ng build` → `nginx:1.27-alpine` | NFR2.2; `NODE_MEMORY_LIMIT` build-arg for small hosts |
| Health signal | `wget -qO- http://127.0.0.1/` + Dockerfile `HEALTHCHECK` | Platform liveness; compose `depends_on` backend healthy first |
| Networking topology | **Published** `80:80` on droplet; **internal** proxy to `backend:8080` for `/api/` | C1 same-origin from browser; nginx `proxy_pass` (NFR3.6) |
| Ingress / TLS | **HTTP port 80** in base compose; TLS/HSTS via operator nginx extension or external terminator | NFR3.6 design assumes TLS at edge — not in checked-in base `docker-compose.yml` |
| Storage strategy | **Stateless** container; static files in image layer only | JWT in browser localStorage, not server-side (NFR3.1) |
| Environments | **Local dev:** `ng serve` + `proxy.conf.json`; **Prod:** Hub C3 + U3 compose | Empty production `apiUrl` — relative `/api` (NFR3.7) |
| IaC approach | **None in U2** — compose + operator-managed droplet | Align U1 NFR4.10; U3 owns orchestration YAML |
| Resource sizing | Vertical droplet RAM; build stage OOM risk on 1GB hosts (Dockerfile comment) | Personal-scale; gzip enabled in nginx.conf |
| Scaling policy | **No horizontal replicas**; redeploy `:latest` on same host | Single SPA bundle; NFR2.12 manual compose cadence |
| Legacy | `deploy-to-aws-s3.yml`, `deploy-to-aws-s3-with-cloudfront.yml` | **Do not extend** as production path (NFR7.27) |

## Infrastructure Services

| Service | Role | Configuration | Notes |
|---------|------|---------------|-------|
| `frontend` (U2 image) | load-balancer target / edge | Port 80; `try_files` SPA routing | Published by U2 CI; consumed by U3 |
| nginx (in C3) | reverse proxy + static CDN substitute | `location /api/` → `http://backend:8080`; gzip types for JS/CSS | Security headers/CSP **not** in repo config (BL-SEC-02) |
| Docker Hub | registry | `DOCKER_HUB_*` secrets in GitHub Actions | C3 pull on droplet |
| GitHub Actions | build/publish | `build-image.yml` on `main` | See `cicd-pipeline.md`; runs `test:ci` before push |
| Reusable `build-and-test.yml` | CI artifact | Node 18.x matrix; uploads `dist/browser` 1-day | Used by legacy S3 deploy workflows only |
| Browser (client) | runtime | Elf persist `localStorage` | Not infra-provisioned; blast radius in security-design |

No managed CDN, S3 bucket, or CloudFront in affirmed production path.

## Shared Infrastructure

| Shared Resource | Owner Unit | Consumer Units | Access Boundary |
|-----------------|------------|----------------|-----------------|
| Docker Compose project `habit-tracker-springboot` | `habit-tracker-compose` (U3) | U2 C3 image, U1 C2 image, Postgres | Single bridge network; `frontend` depends on healthy `backend` |
| Public HTTP entry (port 80) | U3 `frontend` | Browser (C1) | nginx serves SPA + proxies API |
| U1 `backend` service | U3 | U2 nginx `/api/` proxy | Internal DNS `backend:8080`; not published to host |
| Droplet host | Operator | U3 stack | SSH/deploy; no secrets in U2 image (Q6-A) |
| Postgres + volume | U3 | U1 only | Not accessed by U2 container |

## Design backlog (infrastructure-facing)

| Label | Item | Trigger |
|-------|------|---------|
| BL-INFRA-U2-01 | Add CSP / HSTS / security headers in nginx config | NFR3.14 / BL-SEC-02 |
| BL-INFRA-U2-02 | Document TLS termination pattern for production droplet | Gap vs security-design TLS narrative |
| BL-INFRA-U2-03 | npm audit / dependency scan in CI | NFR3.18 / BL-SEC-05 |
| BL-INFRA-U2-04 | Lighthouse or bundle-size gate in CI | NFR2.1 / NFR2.4 |
| BL-INFRA-U2-05 | Pin image digest deploy instead of `:latest` only | Rollback ergonomics (mirror U1 BL-INFRA-04) |
