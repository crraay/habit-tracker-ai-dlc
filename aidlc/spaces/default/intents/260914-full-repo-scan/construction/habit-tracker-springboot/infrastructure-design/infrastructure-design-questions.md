# Infrastructure Design Questions — unit `habit-tracker-springboot`

Context: Brownfield **planning-only** intent (FR2). Unit **U1** (`service`, repo `habit-tracker-springboot`). NFR Design (Q1–Q8 all **A**) documented as-built patterns on a **Compose + droplet** deploy path (C2); no new cloud topology this intent.

Sources: U1 `nfr-design/*.md`, `logical-components.md`, `contract-summary.md` (C1/C2), `habit-tracker-compose/docker-compose.yml`, affirmed `team.md` / `project.md` (Compose prod path; Elastic Beanstalk legacy NEVER).

---

## Q1 — Infrastructure package purpose

What should the U1 infrastructure design artifacts optimize for?

- A. **As-built deploy mapping (recommended)** — document how the backend **JVM container**, CI image publish, env secrets, and Postgres dependency map to production Compose (U3); gaps explicit; no AWS/K8s commitment this intent.
- B. **Target cloud landing zone** — design ECS/EKS/Beanstalk as normative production even if compose is current.
- C. **Dual layer** — as-built compose tables plus a separate AWS migration appendix as committed design.
- D. **CI/CD only** — `cicd-pipeline.md` + traceability; defer deployment tables to U3 Infrastructure Design.
- E. **Minimal closure** — traceability.json only.
- X. Other (please specify)

[Answer]: A

---

## Q2 — Deployment and compute model

How should `infrastructure-specification.md` describe runtime compute for U1?

- A. **Single Docker container on Compose (recommended)** — multi-stage Dockerfile JAR on Temurin 17; one `backend` service; vertical scale on droplet; C2 `:latest` from GitHub Actions; legacy EB workflow out of scope.
- B. **Kubernetes deployment** — Deployments, Services, HPA, and ingress as primary design.
- C. **Serverless** — Lambda/API Gateway design replacing the monolith.
- D. **VM + systemd** — bare JAR without container boundary.
- X. Other (please specify)

[Answer]: A

---

## Q3 — Data and shared resources

How should infrastructure services treat PostgreSQL and networking?

- A. **U3-owned Postgres + internal bridge (recommended)** — Postgres 16 Alpine volume `habit-tracker-springboot_postgres_data`; JDBC via `postgres:5432`; TLS at nginx (U3 frontend); backend HTTP on compose network; document shared table in spec.
- B. **Managed RDS** — design AWS RDS as required production database.
- C. **Backend-owned Postgres** — U1 provisions DB independently of U3 compose file.
- D. **Skip shared section** — backend-only JDBC URL narrative without U3 cross-reference.
- X. Other (please specify)

[Answer]: A

---

## Q4 — Monitoring and observability platform

How should `monitoring-design.md` implement observability-design?

- A. **As-built operator model + future checklist (recommended)** — stdout Logback, actuator health for probes, manual log tail on droplet; document absent metrics/alerts/SLOs; non-binding future rows (Micrometer, log ship, alert rules).
- B. **Full SRE stack** — Prometheus/Grafana/Loki/Alertmanager as binding design for this intent.
- C. **Health only** — single row for `/actuator/health`; defer logging narrative.
- D. **Defer to U3** — all monitoring owned by compose unit only.
- X. Other (please specify)

[Answer]: A

---

## Q5 — CI/CD and promotion

How should `cicd-pipeline.md` describe build, test, and release for U1?

- A. **As-built GitHub Actions + honest gaps (recommended)** — `build-and-test.yml` (branch `feat/actions_cicd`) vs `build-image.yml` on `main` with `-DskipTests`; Docker Hub push; production pull via U3 manual/`workflow_dispatch`; call out NFR5.17 / NFR7.26 mismatch and BL-SEC-04 supply-chain backlog.
- B. **Normative quality gate** — document that `main` image build **must** run full `mvn test` before push as committed design (future state).
- C. **Elastic Beanstalk path** — extend `deploy-to-elastic-beanstalk.yml` as primary deploy story.
- D. **No CI narrative** — image build only in prose.
- X. Other (please specify)

[Answer]: A

---

## Q6 — Secrets and environments

How should secrets and environment layout be specified?

- A. **Host `.env` + Compose interpolation (recommended)** — `JWT_SECRET`, datasource, `CORS_ALLOWED_ORIGINS`, Postgres creds on droplet; no vault in repo; dev local properties vs prod env; rotation as ops backlog (NFR3.19).
- B. **AWS Secrets Manager** — normative secret store and rotation design.
- C. **GitHub Environments only** — all runtime secrets in Actions, not on host.
- D. **Skip secrets section** — defer to security-design only.
- X. Other (please specify)

[Answer]: A

---

## Q7 — NFR traceability scope for infrastructure

How should `traceability.json` cover NFR ids at this stage?

- A. **Infrastructure-relevant subset (recommended)** — every NFR row from NFR Design that requires a **host, container, CI, network, or observability platform** decision gets OK, GAP, or N/A with a concrete resource/config target; omit pure in-app logic unless it implies infra (e.g. health endpoint).
- B. **Full NFR2.x–NFR7.x repeat** — duplicate entire nfr-design traceability table.
- C. **Gaps only** — trace backlog NFRs exclusively.
- D. **Empty coverage** — defer traceability to code generation.
- X. Other (please specify)

[Answer]: A

---

## Assumptions & Open Questions

- U3 (`habit-tracker-compose`) owns stack wiring; U1 spec describes the **backend slice** and C2 contract without changing compose files this intent.
- `build-image.yml` uses `-DskipTests` today — documented as **GAP** against NFR5.17/NFR7.26, not hidden.
- No multi-region, no autoscaling groups, no IaC repo for droplet (operator-managed host).

None.

---

## Consolidated Summary Confirmation

Does this all look correct before I generate the infrastructure design artifact package?

- **Q1 (A):** As-built deploy mapping to Compose + C2; no new cloud topology.
- **Q2 (A):** Single backend container; Dockerfile health; vertical scale.
- **Q3 (A):** U3 Postgres volume + internal network; shared infra table.
- **Q4 (A):** stdout + actuator; future metrics/alerts non-binding.
- **Q5 (A):** GitHub Actions as-built; test gap on `main` image build documented.
- **Q6 (A):** droplet `.env` secrets; no vault.
- **Q7 (A):** infrastructure-relevant NFR traceability only.

- Looks correct
- Request changes

[Answer]: Looks correct
