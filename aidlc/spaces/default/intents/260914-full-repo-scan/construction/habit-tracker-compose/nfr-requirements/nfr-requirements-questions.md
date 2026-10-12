# NFR Requirements Questions — unit `habit-tracker-compose`

Context: Brownfield **planning-only** intent (FR2). Unit **U3** (`packaging`, repo `habit-tracker-compose`). No functional-design stage artifacts for `packaging` kind — derive from `requirements.md`, `contract-summary.md` (C2/C3), and CodeKB.

**Unit kind note:** For `packaging`, the stage emits `security-requirements.md`, `tech-stack-decisions.md`, and `traceability.json` only.

Sources: `unit-of-work.md` (U3), `contract-summary.md`, `requirements.md` (NFR1–NFR5, FR2), `codekb/habit-tracker-compose/`, affirmed `team.md` / `project.md`.

---

## Q1 — NFR package purpose for this intent

What should the U3 NFR requirements artifacts optimize for?

- A. **As-built baseline (recommended)** — document **implemented** deploy/security/ops posture today; gaps explicit; no new contractual SLOs for this intent.
- B. **Target SLO package** — define availability, RTO/RPO, and deploy-frequency targets as normative for production.
- C. **Dual layer** — as-built plus follow-up intent hardening table (SSH keys, secret rotation, staging env).
- D. **Minimal closure** — `tech-stack-decisions.md` + `traceability.json` only.
- X. Other (please specify)

[Answer]: A

---

## Q2 — Security requirements scope (packaging / ops)

How deep should `security-requirements.md` go for U3?

- A. **As-built + backlog** — host `.env` secrets, Compose network isolation, SSH deploy workflow, Hub `:latest` pulls, postgres volume durability; backlog for password SSH, CVE scanning, TLS ownership at nginx.
- B. **Threat-model primary** — full STRIDE as normative controls.
- C. **Contract-only** — restate C2/C3 image contracts only.
- D. **Minimal** — “secrets in .env” one-liner.
- X. Other (please specify)

[Answer]: A

---

## Q3 — Inception NFR2 (compose / deploy out of scope for code changes)

Requirements **NFR2** says compose/deploy **changes are out of scope** for this intent’s merges, but U3 **documents** production packaging. How should U3 treat NFR2?

- A. **Document as-built ops (recommended)** — NFR2.x rows describe current manual deploy, image pull model, and droplet topology; no mandate to change compose in this intent.
- B. **Normative deploy SLOs** — assign availability and rollback SLAs as requirements.
- C. **Mark NFR2 N/A** — defer all deploy NFR prose to a future intent.
- X. Other (please specify)

[Answer]: A

---

## Q4 — Tech stack decisions

How should `tech-stack-decisions.md` treat the brownfield stack (Compose v2, Postgres 16-alpine, Hub images, bash deploy, GHA SSH)?

- A. **Affirm as-built lock-in (recommended)** — record choices from CodeKB; no replacement decisions this intent.
- B. **Active selection** — re-decide orchestration platform.
- C. **Delta only** — forbidden paths (no app code in compose repo) without version table.
- D. **Upgrade roadmap** — Kubernetes migration plan as decisions.
- X. Other (please specify)

[Answer]: A

---

## Q5 — Inception NFR traceability (NFR1–NFR5)

How should `traceability.json` cover inception NFR1–NFR5 for U3?

- A. **Map all five** — NFR2 primary in security/tech-stack rows; NFR3 mandates for compose deploy path; others OK/N/A with notes.
- B. **NFR2 + NFR3 only** — deploy and team mandates.
- C. **Defer traceability** — empty coverage with intent-wide note.
- X. Other (please specify)

[Answer]: A

---

## Assumptions & Open Questions

- U3 has no application tests; operational verification is manual per team posture.
- FR2: this intent does not merge compose product changes; artifacts are reference for Bolt F3 / follow-up intents.

None.

---

## Consolidated Summary Confirmation

Does this all look correct before I generate the NFR artifact package?

- **Q1 (A):** As-built baseline — ops/deploy posture today; no new contractual SLOs.
- **Q2 (A):** Security — `.env`, SSH deploy, network/volume model + ops backlog.
- **Q3 (A):** NFR2 — document as-built manual deploy and Hub pull model; no compose change mandate this intent.
- **Q4 (A):** Tech stack — affirm Compose/Postgres/Hub/bash/GHA lock-in.
- **Q5 (A):** Traceability — map all NFR1–NFR5 with NFR2 emphasis.

- Looks correct
- Request changes

[Answer]: Looks correct
