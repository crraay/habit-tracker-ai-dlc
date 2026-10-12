# Deployment Pipeline Questions — intent `260914-full-repo-scan`

Context: **FR2 planning-only** · Operation may produce runbooks and CD documentation; **no production deploy or pipeline YAML changes** from this intent.

Sources: `construction/ci-pipeline/ci-config.md`, `quality-gates.md`, U3 `infrastructure-specification.md`, per-unit `cicd-pipeline.md`, `team.md`.

---

## Q1 — Stage deliverable

What should Deployment Pipeline produce?

- A. **As-built CD documentation (recommended)** — `cd-config.md`, `deployment-strategy.md`, `rollback-runbook.md`; describe Hub → Compose path; no live deploy this intent.
- B. **Implement new CD** — add CodePipeline / auto-deploy on compose push (out of FR2 scope).
- C. **Skip Operation** — close intent at Construction only.
- X. Other (please specify)

[Answer]: A

---

## Q2 — Deployment strategy (as-built)

Which strategy matches production today?

- A. **Recreate on single host (recommended)** — pull new `:latest`, `docker compose up -d` selected services; Postgres volume preserved; no blue/green/canary.
- B. **Blue/green on droplet** — not as-built.
- C. **Canary via traffic split** — not as-built.
- X. Other (please specify)

[Answer]: A

---

## Q3 — Environment promotion

How are environments promoted?

- A. **Prod-only + local dev (recommended)** — no staging in repo; operator manually runs U3 workflow after U1/U2 `main` image builds.
- B. **dev → staging → prod** — not codified today.
- C. **Git branches map to environments** — partial (local override only).
- X. Other (please specify)

[Answer]: A

---

## Q4 — Production approval

What approval exists before production?

- A. **Manual operator (recommended)** — `workflow_dispatch` on U3 deploy workflow; human smoke test; no GitHub Environment protection gates in scanned repos.
- B. **Automated prod on merge** — not as-built for compose.
- C. **Dual control in Actions** — not configured.
- X. Other (please specify)

[Answer]: A

---

## Q5 — Feature flags

Feature flag platform for deploy-time toggles?

- A. **Application config only (recommended)** — Spring properties (e.g. scheduler enable); no AppConfig/Evidently/LaunchDarkly in stack.
- B. **AWS AppConfig** — not present.
- C. **Dedicated flag service** — not present.
- X. Other (please specify)

[Answer]: A

---

## Assumptions & Open Questions

- Flyway runs inside new backend container on start; rollback may require compatible schema or restore from backup.
- TLS may terminate outside committed compose nginx (operator responsibility).

None.

---

## Consolidated Summary Confirmation

Does this all look correct before I finalize the deployment pipeline artifact package?

- **Q1 (A):** Documentation-only CD package; no deploy execution this intent.
- **Q2 (A):** Recreate strategy on single droplet.
- **Q3 (A):** Prod-only promotion path via manual orchestration.
- **Q4 (A):** Manual `workflow_dispatch` + operator smoke.
- **Q5 (A):** No external feature-flag service.

- Looks correct
- Request changes

[Answer]: Looks correct
