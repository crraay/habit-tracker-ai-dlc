# Environment validation report — full-repo-scan

Intent `260914-full-repo-scan` · **Validation type:** desk review (FR2). **No live SSH, AWS API calls, or container operations** were performed from this intent.

## Scope

- **In scope:** Consistency among U3 compose, env template, Construction infrastructure specifications, and Operation CD documentation.
- **Out of scope:** Proving droplet reachability, certificate expiry, firewall rules, or Hub image digests at a point in time.

## Method

1. Read `habit-tracker-compose/docker-compose.yml`, `.env.example`, `DOCKER.md`, deploy workflow references.
2. Cross-check against U3 (and related U1/U2) `infrastructure-specification.md` and `cd-config.md`.
3. Record **Pass**, **Pass with note**, or **Gap** per control.

## Infrastructure configuration checklist

| ID | Check | Result | Evidence |
|----|-------|--------|----------|
| V1 | Single-host Compose v2 with three services | **Pass** | `docker-compose.yml` services `postgres`, `backend`, `frontend` |
| V2 | Only frontend publishes host port (80) | **Pass** | `ports: "80:80"` on `frontend` only |
| V3 | Backend reachable from frontend via internal DNS | **Pass** | C3 nginx proxy pattern in infra spec; `depends_on` backend |
| V4 | Postgres not exposed to host | **Pass** | No `ports` on `postgres` |
| V5 | Postgres health gate before backend start | **Pass** | `depends_on.postgres.condition: service_healthy` |
| V6 | Named volume preserves DB across app redeploy | **Pass** | `habit-tracker-springboot_postgres_data` |
| V7 | Hub images pull-only in committed prod compose | **Pass** | `crraay/habit-tracker-*:latest` |
| V8 | Required env vars documented for prod | **Pass** | `.env.example` + DOCKER.md |
| V9 | JWT and DB secrets not committed | **Pass with note** | Example JWT in template is placeholder; operator must replace |
| V10 | CORS origins must match public URL | **Pass with note** | Operator must set droplet IP/domain in `.env` |
| V11 | Deploy path: git pull + script, manual GHA | **Pass** | Aligns with `cd-config.md` |
| V12 | Flyway migrations ship in backend image | **Pass** | team.md / U1 spec; no separate migration job in U3 |
| V13 | Staging environment defined in repo | **Gap** | No staging stack; documented in inventory |
| V14 | TLS in committed compose | **Gap** | HTTP :80 only; TLS at operator edge (BL-INFRA-U3-05) |
| V15 | Image immutability / digest pinning | **Gap** | `:latest` tags; rollback manual |
| V16 | Automated post-deploy health in U3 workflow | **Gap** | F3 in cd-config; smoke manual |
| V17 | SSH key-based deploy auth | **Gap** | Password secret documented; improvement backlog |
| V18 | Container/dependency CVE scanning | **Gap** | Not in CI (team.md) |

## Secrets and parameters audit (documentation)

| Store | Expected contents | Injection | Validation |
|-------|-------------------|-----------|------------|
| Droplet `.env` | DB creds, `JWT_SECRET`, `CORS_ALLOWED_ORIGINS` | Compose interpolation | **Pass** — keys match compose references |
| GitHub Secrets (U3) | SSH host, user, password | GHA deploy workflow | **Pass with note** — prefer keys (V17 gap) |
| GitHub Secrets (U1/U2) | Docker Hub credentials | `build-image` | **Pass** — per CI docs (not re-run here) |
| AWS Secrets Manager / SSM | — | Not used on Compose path | **N/A** |

No evidence in repo of secrets committed to git for production values (`.env` gitignored per AGENTS.md).

## Security posture (as-built, desk review)

| Area | Finding |
|------|---------|
| Network exposure | Minimal surface: one HTTP port; DB and API internal to bridge |
| Auth to deploy | SSH from GHA; credential in secrets — rotate and prefer keys |
| App auth | JWT HS256; secret from env — strength operator responsibility |
| Data isolation | Application-layer user scoping (U1); not validated by infra alone |
| Legacy AWS | Workflows may still exist in U1/U2; production path is Compose (forbidden for new deploys) |

DevSecOps-style live validation (CIS benchmark, port scan, IAM review) was **not** executed under FR2.

## Cross-account / cross-VPC connectivity

**Not applicable** for current production: single droplet, no AWS VPC peering, no multi-account deploy in Compose path.

## Health check results (live)

| Check | Status |
|-------|--------|
| Droplet SSH | **Not run** (FR2) |
| `docker compose ps` on production | **Not run** (FR2) |
| `GET /actuator/health` | **Not run** (FR2) |
| nginx `/` | **Not run** (FR2) |

Recommended operator smoke after deploy: login, `/api/me`, track/untrack — per `deployment-strategy.md`.

## Overall verdict

| Verdict | Detail |
|---------|--------|
| **Pass for planning closure** | As-built Compose production environment is **consistently documented** across Construction and Operation artifacts. |
| **Operational gaps** | Staging absent, TLS not in base compose, `:latest` tags, manual smoke, SSH password auth — tracked as backlog items, not blockers for FR2 documentation intent. |

## Traceability

| Upstream | Covered topics |
|----------|----------------|
| `infrastructure-specification` (U3) | Topology, services, env, deploy mechanism |
| `cd-config.md` | Promotion, manual CD, environment matrix |
