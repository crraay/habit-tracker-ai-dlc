# Environment Provisioning Questions — intent `260914-full-repo-scan`

Context: **FR2 planning-only** · Document and validate **as-built** runtime environments; **no droplet SSH, no AWS provisioning, no `.env` or compose changes** from this intent.

Sources: U3 `infrastructure-specification.md`, `operation/deployment-pipeline/cd-config.md`, `habit-tracker-compose/docker-compose.yml`, `.env.example`, `DOCKER.md`, `team.md`.

---

## Q1 — Stage deliverable

What should Environment Provisioning produce?

- A. **As-built inventory + validation report (recommended)** — `environment-inventory.md`, `validation-report.md`; desk review against repo and Construction infra specs; no live infra mutation.
- B. **Provision AWS VPC/ECS** — not as-built (production is DigitalOcean Compose).
- C. **Run live droplet health checks from CI** — out of FR2 scope this intent.
- X. Other (please specify)

[Answer]: A

---

## Q2 — Target environments

Which environments are in scope for inventory?

- A. **Production droplet + local dev patterns (recommended)** — single-host Compose per U3 spec; optional local override build; no staging stack in repo.
- B. **AWS accounts (dev/staging/prod)** — legacy EB/S3 paths only; not current production path.
- C. **Multi-region fleet** — not as-built.
- X. Other (please specify)

[Answer]: A

---

## Q3 — Networking model

How is production networking described?

- A. **Docker bridge + published port 80 (recommended)** — nginx frontend only on host; `/api/` to `backend:8080`; Postgres internal; no VPC/NACL in stack.
- B. **AWS VPC with private subnets** — not used for current Compose production.
- C. **Service mesh** — not present.
- X. Other (please specify)

[Answer]: A

---

## Q4 — Secrets and configuration

Where do runtime secrets live?

- A. **Droplet `.env` from `.env.example` (recommended)** — `POSTGRES_*`, `JWT_SECRET`, `CORS_ALLOWED_ORIGINS`; GitHub Actions holds deploy SSH secrets; no AWS Secrets Manager / SSM in path.
- B. **AWS Secrets Manager injection** — not as-built for Compose prod.
- C. **Kubernetes secrets** — not used.
- X. Other (please specify)

[Answer]: A

---

## Q5 — Validation method (this intent)

How is environment configuration validated?

- A. **Documentation cross-check (recommended)** — compare compose, env template, infra specs, and CD docs; record pass/gap; no SSH or `docker compose` on production from this workflow.
- B. **Automated post-deploy probe in GHA** — backlog (see deployment-pipeline F3).
- C. **Full penetration test** — out of scope for planning-only intent.
- X. Other (please specify)

[Answer]: A

---

## Q6 — IaC and drift

What is the source of truth for production stack shape?

- A. **Git-tracked U3 compose + operator droplet (recommended)** — no Terraform/CDK; drift controlled by `git pull --ff-only` on deploy.
- B. **AWS CloudFormation** — legacy app paths only.
- C. **Immutable AMI + user-data** — not as-built.
- X. Other (please specify)

[Answer]: A

---

## Assumptions & Open Questions

- TLS may terminate outside committed nginx (operator edge); inventory documents HTTP :80 in compose.
- Actual droplet size, OS patch level, and firewall rules are operator-managed and not fully encoded in repo.

None.

---

## Consolidated Summary Confirmation

Does this all look correct before I finalize the environment provisioning artifact package?

- **Q1 (A):** Inventory + validation documentation only; no live provisioning.
- **Q2 (A):** Production droplet + local dev; no staging in repo.
- **Q3 (A):** Compose bridge networking as-built.
- **Q4 (A):** Host `.env` + GHA deploy secrets.
- **Q5 (A):** Desk validation against artifacts.
- **Q6 (A):** U3 git compose as stack source of truth.

- Looks correct
- Request changes

[Answer]: Looks correct
