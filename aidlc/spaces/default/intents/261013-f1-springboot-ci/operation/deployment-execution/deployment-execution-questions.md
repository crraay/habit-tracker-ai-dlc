# Deployment Execution Questions — intent `261013-f1-springboot-ci`

Context: **Express F1** — CI test gate on springboot `build-image`; Deployment Pipeline produced **as-built CD docs only** (no CD YAML changes). Environment Provisioning was skipped by scope.

Sources: `operation/deployment-pipeline/*`, `construction/build-and-test/test-results.md`, `habit-tracker-compose/DOCKER.md`, `habit-tracker-compose/.github/workflows/deploy-docker-image-ssh.yml`.

---

## Q1 — Stage deliverable

What should Deployment Execution produce?

- A. **Simulated execution package (recommended)** — `deployment-log.md`, `smoke-test-results.md`, `health-check-report.md` as operator checklists with **no live droplet deploy** in this intent (F1 is CI wiring + documentation).
- B. **Run compose deploy workflow now** — live production rollout (requires credentials, out of typical F1 scope).
- C. **Skip stage** — close without deploy documentation.
- X. Other (please specify)

[Answer]: A

---

## Q2 — Pre-deployment checks (as-built)

Which checks apply before an operator deploys backend after F1 merges?

- A. **Hub image + CI green + manual window (recommended)** — springboot `build-image` succeeded on intended `main` commit with **`mvn test` green** (F1); operator confirms compose git and droplet `.env`; optional maintenance window.
- B. **Automated gate in compose deploy workflow** — not as-built (manual dispatch only).
- C. **Staging soak test** — no staging environment in repo.
- X. Other (please specify)

[Answer]: A

---

## Q3 — Database migrations

How are schema changes applied on deploy?

- A. **Flyway on backend container start (recommended)** — migrations in backend image; operator watches logs after recreate; F1 has no schema changes.
- B. **Manual SQL on droplet** — not standard path.
- C. **Blue/green DB cutover** — not as-built.
- X. Other (please specify)

[Answer]: A

---

## Q4 — Smoke tests

What smoke validation is expected post-deploy?

- A. **Manual operator checklist (recommended)** — login, `GET /api/me`, track/untrack today; document in `smoke-test-results.md` with **Not executed (F1 intent)** unless you choose live deploy in Q1.
- B. **Automated curl in GHA post-deploy** — backlog.
- C. **Full e2e on droplet** — not in CI today.
- X. Other (please specify)

[Answer]: A

---

## Q5 — Health checks

Which health signals are available as-built?

- A. **Actuator + compose + nginx (recommended)** — document expected URLs/commands in `health-check-report.md`; live probes **N/A** unless Q1 chooses live deploy.
- B. **Synthetic canary in Hub** — not present.
- C. **ELB health only** — legacy path.
- X. Other (please specify)

[Answer]: A

---

## Q6 — Deployment window

What window policy applies?

- A. **Operator discretion (recommended)** — brief recreate downtime acceptable; no codified change-freeze.
- B. **Fixed weekly release train** — not documented.
- C. **24/7 zero-downtime SLA** — not as-built (recreate strategy).
- X. Other (please specify)

[Answer]: A

---

## Assumptions & Open Questions

- F1 CI changes must be **merged to `main`** before `build-image` reflects the new test gate in production Hub publishes.
- Rollback: `operation/deployment-pipeline/rollback-runbook.md`.

None.

---

## Consolidated Summary Confirmation

Does this all look correct before I generate the artifact?

- Looks correct
- Request changes

[Answer]: Looks correct
