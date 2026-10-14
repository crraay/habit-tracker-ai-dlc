# Deployment Pipeline Questions — intent `261013-f1-springboot-ci`

Context: **Express F1** — CI test gate on `habit-tracker-springboot` `build-image` only. **No compose or CD workflow changes** in code generation. CI Pipeline and Infrastructure Design stages were skipped by scope.

Sources: `inception/requirements-analysis/requirements.md`, `construction/build-and-test/build-and-test-summary.md`, `aidlc/spaces/default/memory/team.md`, `habit-tracker-compose/DOCKER.md`, existing GitHub workflows in app repos.

---

## Q1 — Stage deliverable for F1

What should this Deployment Pipeline stage produce?

- A. **As-built CD documentation only (recommended)** — `cd-config.md`, `deployment-strategy.md`, `rollback-runbook.md` describing the current Hub → Compose path; note F1’s CI gate; **no** new CD YAML or live deploy in this intent.
- B. **Change production CD** — add auto-deploy, staging env, or new compose workflows (beyond F1 scope).
- C. **Skip substantive CD docs** — minimal stub and close Operation quickly.
- X. Other (please specify)

[Answer]: A

---

## Q2 — Deployment strategy (as-built)

Which strategy matches production today?

- A. **Recreate on single host (recommended)** — pull new `:latest`, recreate containers via compose deploy script; Postgres named volume preserved; no blue/green/canary.
- B. **Blue/green on droplet** — not as-built.
- C. **Canary / traffic split** — not as-built.
- X. Other (please specify)

[Answer]: A

---

## Q3 — Environment promotion

How do backend images reach production after F1?

- A. **CI publish then manual deploy (recommended)** — `main` push runs `build-image` (now **`mvn test`** then package/Docker push); operator later runs compose **`deploy-docker-image-ssh`** (or equivalent) workflow_dispatch to pull `:latest` on the droplet.
- B. **Automatic deploy on image push** — not as-built.
- C. **Staging then production** — no staging stack in repo today.
- X. Other (please specify)

[Answer]: A

---

## Q4 — Production approval

What approval exists before production rollout?

- A. **Manual operator (recommended)** — `workflow_dispatch` on compose deploy workflow; human smoke test; no GitHub Environment protection gates in scanned repos.
- B. **Deploy on every successful `build-image`** — not as-built (compose deploy is separate).
- C. **Dual control in GitHub Actions** — not configured.
- X. Other (please specify)

[Answer]: A

---

## Q5 — Rollback runbook depth

How much rollback detail should the runbook include?

- A. **Operator manual rollback (recommended)** — redeploy prior Docker Hub tag or digest if recorded; Postgres volume preserved; Flyway in backend image (schema rollback = restore/compat note only).
- B. **Automated rollback workflow** — not present; documenting only if you want a future backlog item.
- C. **Minimal one-liner** — pointer to `DOCKER.md` only.
- X. Other (please specify)

[Answer]: A

---

## Q6 — Feature flags

Deploy-time feature flag platform?

- A. **Application config only (recommended)** — Spring properties / env in compose `.env`; no AppConfig/Evidently/LaunchDarkly in stack.
- B. **AWS AppConfig** — not present.
- C. **Dedicated flag service** — not present.
- X. Other (please specify)

[Answer]: A

---

## Assumptions & Open Questions

- F1 does not change compose deploy mechanics; only the **quality gate** before `:latest` backend image publish.
- Backend/frontend version alignment remains manual via Hub **`latest`** tags.
- First post-merge `build-image` on `main` is the live confirmation of FR4 (informational).

None.

---

## Consolidated Summary Confirmation

Does this all look correct before I generate the artifact?

- Looks correct
- Request changes

[Answer]: Looks correct
