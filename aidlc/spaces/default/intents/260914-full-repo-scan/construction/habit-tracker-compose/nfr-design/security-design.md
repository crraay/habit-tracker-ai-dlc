# Security Design — unit `habit-tracker-compose`

Planning-only intent (FR2).  **As-built deploy/security architecture + ops backlog** (Q2-A). Primary review artifact for U3.

## Sources

- `nfr-requirements/security-requirements.md` (NFR2.x, NFR3.x)
- `contract-summary.md` (C2/C3)
- `tech-stack-decisions.md` (NFR7.x)
- U1/U2 `security-design.md` (application layer — pointers only, Q4-A)

## Planning boundary (FR2 / NFR2.1)

This intent **documents** the current production packaging path; it **does not authorize** compose repo merges as deliverables. Follow-up intents implement hardening.

## Topology (as-built)

```text
[Internet] --TLS--> nginx (frontend container :80)
                        |-- /api --> backend (internal network)
                        +-- static SPA
backend --> postgres (internal network, named volume)
```

| Element | Design |
|---------|--------|
| Host exposure | Port **80** on frontend only (NFR3.5) |
| API path | `/api` proxied on Docker network — no separate backend host port (NFR3.7) |
| TLS | Terminates in **frontend/nginx** image (NFR3.6); compose file does not mount certs |
| Project | Compose **`habit-tracker-springboot`** on single DigitalOcean droplet (NFR2.3) |

## Secrets and configuration

| ID | Design pattern |
|----|----------------|
| NFR3.1 | Host **`.env`** from **`.env.example`**: DB, `JWT_SECRET`, `CORS_ALLOWED_ORIGINS` |
| NFR3.2 | Never commit production secrets (project NEVER) |
| NFR3.3 | Postgres creds via Compose env into backend — not baked into Hub images |
| NFR3.4 | GHA workflow secrets for registry/deploy credentials |

## Deploy access control

| ID | Design pattern |
|----|----------------|
| NFR3.8 | Manual **`workflow_dispatch`** on `deploy-docker-image-ssh.yml` |
| NFR3.9 | SSH via `appleboy/ssh-action` — password auth possible today (**BL-OPS-01** key-based) |
| NFR3.10 | On-server **`git pull --ff-only`** in `DEPLOY_COMPOSE_DIR` before deploy script |
| NFR3.11 | Deploy user in **`docker`** group for `docker compose` |

## Image supply chain (C2/C3)

| ID | Design pattern |
|----|----------------|
| NFR3.14 | Pull public Hub **`crraay/habit-tracker-{springboot,angular}:latest`** — no droplet registry login |
| NFR3.15 | Rollback **manual** — prior tag/digest if recorded (**BL-OPS-02** digest pinning) |
| NFR3.16 | No container/CVE scan in compose CI (**BL-OPS-03**) |

## Data durability

| ID | Design pattern |
|----|----------------|
| NFR3.12 | Named volume **`habit-tracker-springboot_postgres_data`** survives app redeploys |
| NFR3.13 | Flyway in backend image (U1) — compose does not run migrations |

## Deploy cadence (NFR2 — document only)

| ID | Design |
|----|--------|
| NFR2.2 | Production rollout after app-repo **`build-image`** on **`main`** |
| NFR2.3 | Single-host Compose stack as above |

## Application security (cross-unit pointers)

| Concern | Owner | U3 reference |
|---------|-------|--------------|
| JWT issuance, API auth | U1 | `habit-tracker-springboot/nfr-design/security-design.md` |
| SPA token storage, interceptors | U2 | `habit-tracker-angular/nfr-design/security-design.md` |

U3 does not duplicate application threat models.

## Design backlog (ops)

| Label | Maps to | Direction |
|-------|---------|-----------|
| BL-OPS-01 | NFR3.9, NFR3.18 | SSH keys, restrict source IPs |
| BL-OPS-02 | NFR3.15, NFR3.19 | Pin digests or semver in compose pulls |
| BL-OPS-03 | NFR3.16 | Container/dependency scanning when prioritized |
| BL-OPS-04 | NFR3.20 | Postgres volume backup/restore runbook |

## Compliance

No regulatory control catalog for this personal deployment stack (NFR3.17 N/A).

## Blast radius

Single droplet failure affects Postgres, backend, and frontend together; JWT and SPA session impact described in U1/U2 designs.
