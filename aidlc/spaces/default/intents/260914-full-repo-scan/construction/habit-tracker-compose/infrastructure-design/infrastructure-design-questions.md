# Infrastructure Design Questions — unit `habit-tracker-compose`

Context: Brownfield **planning-only** intent (FR2). Unit **U3** (`packaging`, repo `habit-tracker-compose`). NFR Design (Q1–Q5 all **A**) documented as-built deploy/security topology; U1/U2 infrastructure specs describe C2/C3 slices — U3 owns stack orchestration, Postgres, and production rollout.

Sources: U3 `nfr-design/security-design.md`, `traceability.json`, `contract-summary.md` (C2/C3), U1/U2 `infrastructure-design/*.md`, `habit-tracker-compose/docker-compose.yml`, `scripts/deploy-service.sh`, `.github/workflows/deploy-docker-image-ssh.yml`, affirmed `team.md` / `project.md`.

---

## Q1 — Infrastructure package purpose

What should the U3 infrastructure design artifacts optimize for?

- A. **As-built stack mapping (recommended)** — document Compose project topology, Hub image pulls, droplet `.env`, SSH deploy workflow, and shared resources; gaps explicit; no K8s/staging/IaC commitment this intent.
- B. **Target platform** — design Terraform/Ansible or managed PaaS as normative production even if manual Compose is current.
- C. **Dual layer** — as-built tables plus migration appendix (multi-host, staging env, digest-pinned deploy).
- D. **Deploy script only** — `cicd-pipeline.md` + traceability; defer deployment/monitoring tables.
- E. **Minimal closure** — `traceability.json` only.
- X. Other (please specify)

[Answer]: A

---

## Q2 — Deployment and compute model

How should `infrastructure-specification.md` describe runtime compute for U3?

- A. **Single-host Docker Compose (recommended)** — project `habit-tracker-springboot`: `postgres`, `backend` (C2), `frontend` (C3); bridge network; port **80** on `frontend` only; vertical scale on one DigitalOcean droplet.
- B. **Multi-host swarm** — Docker Swarm or Nomad as primary design.
- C. **Kubernetes** — Helm chart and ingress as normative stack.
- D. **Split DB host** — Postgres on separate VM from app containers as committed design.
- X. Other (please specify)

[Answer]: A

---

## Q3 — Data, networking, and shared ownership

How should infrastructure services treat Postgres, volumes, and cross-unit contracts?

- A. **U3-owned Postgres + internal bridge (recommended)** — Postgres 16 Alpine, named volume `habit-tracker-springboot_postgres_data`; C2/C3 `:latest` pulls; shared infra table listing U1 JDBC and U2 nginx proxy; TLS at frontend/nginx documented as operator extension if not in base compose.
- B. **Managed database** — design RDS/Cloud SQL as required production DB.
- C. **App-built images on droplet** — compose builds from sibling repos in production (not Hub pulls).
- D. **Skip shared section** — stack-only YAML summary without U1/U2 cross-reference.
- X. Other (please specify)

[Answer]: A

---

## Q4 — Monitoring and observability platform

How should `monitoring-design.md` implement stack-level observability (not in-app metrics)?

- A. **As-built operator model + future checklist (recommended)** — `docker compose logs`, container healthchecks (backend actuator, frontend wget), manual droplet checks; document absent centralized metrics/alerts/SLOs; non-binding future rows (log ship, uptime probe, disk/volume alerts).
- B. **Full SRE stack** — Prometheus/node-exporter/Grafana on droplet as binding design this intent.
- C. **Health only** — compose `depends_on: service_healthy` rows; defer logging narrative.
- D. **Defer to U1/U2** — no U3 monitoring artifact content.
- X. Other (please specify)

[Answer]: A

---

## Q5 — CI/CD and promotion

How should `cicd-pipeline.md` describe build, test, and release for U3?

- A. **As-built GitHub Actions + honest gaps (recommended)** — `deploy-docker-image-ssh.yml` manual `workflow_dispatch` (`all` | `backend` | `frontend`); SSH + `git pull --ff-only` + `deploy-service.sh`; **no** app build in compose repo; production images from U1/U2 `build-image` on `main`; call out SSH password auth, `:latest` mutability, no compose CI tests (BL-OPS-01–03).
- B. **Normative hardening** — document digest-pinned pulls and key-based SSH as committed design (future state).
- C. **Automated deploy on push** — continuous droplet deploy from compose `main` as primary story.
- D. **No CI narrative** — deploy script prose only.
- X. Other (please specify)

[Answer]: A

---

## Q6 — Secrets and environments

How should secrets and environment layout be specified for U3?

- A. **Host `.env` + Compose interpolation (recommended)** — droplet `.env` from `.env.example` (DB, `JWT_SECRET`, `CORS_ALLOWED_ORIGINS`); GHA secrets for registry/SSH deploy; **production only** (no staging stack in repo); local override example for dev builds; rotation/backup as ops backlog.
- B. **Secrets manager** — Vault or cloud SM as normative store.
- C. **All secrets in GitHub only** — no runtime `.env` on host.
- D. **Skip secrets section** — defer to security-design only.
- X. Other (please specify)

[Answer]: A

---

## Q7 — NFR traceability scope for infrastructure

How should `traceability.json` cover NFR ids at this stage?

- A. **Infrastructure-relevant subset (recommended)** — every U3 NFR id from NFR Design that requires **compose file, volume, network port, deploy workflow, Hub pull, or stack observability** gets OK, GAP, or N/A with a concrete resource/config target; application JWT/SPA rows stay pointer to U1/U2.
- B. **Full repeat** — duplicate entire nfr-design traceability table verbatim.
- C. **Gaps only** — trace BL-OPS and GAP rows exclusively.
- D. **Empty coverage** — defer traceability to code generation.
- X. Other (please specify)

[Answer]: A

---

## Assumptions & Open Questions

- FR2 planning intent **does not mandate** compose repo merges; artifacts describe as-built ops for follow-up hardening intents.
- U1 `build-image` may skip tests on `main`; U2 runs `test:ci` — document cross-unit honestly in cicd narrative.
- Flyway runs inside C2 container; U3 does not run migration jobs separately.

None.

---

## Consolidated Summary Confirmation

Does this all look correct before I generate the infrastructure design artifact package?

- **Q1 (A):** As-built stack mapping (Compose + Hub pulls + droplet `.env` + SSH deploy); no new platform commitment.
- **Q2 (A):** Single-host Compose project `habit-tracker-springboot` on one droplet.
- **Q3 (A):** U3-owned Postgres volume + bridge network; C2/C3 pulls; shared table with U1/U2.
- **Q4 (A):** Operator logs/healthchecks; future metrics/alerts non-binding.
- **Q5 (A):** `deploy-docker-image-ssh.yml` + `deploy-service.sh`; honest ops gaps (SSH, `:latest`, no compose CI tests).
- **Q6 (A):** Host `.env` + GHA deploy secrets; production-only environments.
- **Q7 (A):** Infrastructure-relevant NFR traceability only.

- Looks correct
- Request changes

[Answer]: Looks correct
