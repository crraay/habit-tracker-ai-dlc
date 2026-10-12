# Deployment Execution Questions — intent `260914-full-repo-scan`

Context: **FR2 planning-only** · Document the **as-built deploy and verification path**; **no live production deploy, SSH, or workflow runs** from this intent.

Sources: `operation/deployment-pipeline/*`, `operation/environment-provisioning/environment-inventory.md`, `construction/build-and-test/test-results.md`, `habit-tracker-compose/scripts/deploy-service.sh`, `DOCKER.md`.

---

## Q1 — Stage deliverable

What should Deployment Execution produce?

- A. **Simulated execution package (recommended)** — `deployment-log.md` (documented steps), `smoke-test-results.md` and `health-check-report.md` as **operator checklists / N/A live**; no droplet actions this intent.
- B. **Run U3 deploy workflow now** — out of FR2 scope.
- C. **Skip stage** — close without deploy documentation.
- X. Other (please specify)

[Answer]: A

---

## Q2 — Pre-deployment checks (as-built)

Which checks apply before operator deploy?

- A. **Hub images + CI green + manual window (recommended)** — U1/U2 `build-image` succeeded on intended `main` commit; U2 `test:ci` green; U1 tests gap noted in CI docs; operator confirms `.env` and compose git at target commit; choose maintenance window if needed.
- B. **Automated gate in U3 workflow** — not as-built (manual dispatch only).
- C. **Staging soak test** — no staging environment in repo.
- X. Other (please specify)

[Answer]: A

---

## Q3 — Database migrations

How are schema changes applied on deploy?

- A. **Flyway on backend container start (recommended)** — migrations ship in C2 image; no separate U3 migration job; operator watches backend logs after recreate.
- B. **Manual SQL on droplet** — not standard path.
- C. **Blue/green DB cutover** — not as-built.
- X. Other (please specify)

[Answer]: A

---

## Q4 — Smoke tests

What smoke validation is expected post-deploy?

- A. **Manual operator script (recommended)** — login, `GET /api/me`, track/untrack today, Settings timezone load; document in `smoke-test-results.md` as checklist with **Not executed (FR2)** status.
- B. **Automated curl in GHA post-deploy** — backlog (cd-config F3).
- C. **Full e2e suite on droplet** — not in CI today.
- X. Other (please specify)

[Answer]: A

---

## Q5 — Health checks

Which health signals are available as-built?

- A. **Actuator + compose health + nginx (recommended)** — Spring `management.endpoints.web.exposure.include=health`; postgres `pg_isready`; document expected URLs/commands in `health-check-report.md`; live probes **N/A** this intent.
- B. **Synthetic canary in Hub** — not present.
- C. **ELB health only** — legacy path.
- X. Other (please specify)

[Answer]: A

---

## Q6 — Deployment window

What window policy applies?

- A. **Operator discretion (recommended)** — personal-scale prod; brief recreate downtime acceptable; no codified change-freeze calendar.
- B. **Fixed weekly release train** — not documented.
- C. **24/7 zero-downtime SLA** — not as-built (recreate strategy).
- X. Other (please specify)

[Answer]: A

---

## Assumptions & Open Questions

- Build-and-test evidence is from **2026-10-08** workstation run; it does not gate a live deploy from this intent.
- Rollback steps live in `operation/deployment-pipeline/rollback-runbook.md` if deploy fails.

None.

---

## Consolidated Summary Confirmation

Does this all look correct before I finalize the deployment execution artifact package?

- **Q1 (A):** Documented deploy path and checklists only; no live execution.
- **Q2 (A):** Manual pre-checks aligned with Hub + CI + operator.
- **Q3 (A):** Flyway via backend container.
- **Q4 (A):** Manual smoke checklist; FR2 not executed.
- **Q5 (A):** Health report documents actuator/compose/nginx; no live probes.
- **Q6 (A):** Operator-chosen window.

- Looks correct
- Request changes

[Answer]: Looks correct
