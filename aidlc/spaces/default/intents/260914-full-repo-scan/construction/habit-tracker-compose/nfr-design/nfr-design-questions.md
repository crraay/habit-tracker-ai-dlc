# NFR Design Questions — unit `habit-tracker-compose`

Context: Brownfield **planning-only** intent (FR2). Unit **U3** (`packaging`, repo `habit-tracker-compose`). NFR Requirements (Q1–Q5) chose an **as-built baseline** with explicit gaps — no new contractual SLOs this intent.

**Unit kind note:** U3 emits `security-design.md` and `traceability.json` only (no performance/scalability/reliability/observability/logical-components design markdown for `packaging`).

Sources: U3 `nfr-requirements/*.md`, `contract-summary.md` (C2/C3), affirmed `team.md` / `project.md`.

---

## Q1 — NFR design package purpose

What should the U3 NFR design artifacts optimize for?

- A. **As-built ops/security catalogue (recommended)** — document **implemented** deploy topology, secrets, network exposure, and Hub pull model; map gaps to **design backlog** rows; no committed platform change (K8s, staging stack) this intent.
- B. **Target ops SLO package** — design availability, RTO/RPO, and deploy-frequency targets as normative even if not measured today.
- C. **Dual layer** — as-built plus follow-up intent hardening appendix (SSH keys, digest-pinned images, staging env).
- D. **Minimal closure** — `traceability.json` only; defer security-design prose.
- X. Other (please specify)

[Answer]: A

---

## Q2 — Security design depth (packaging / deploy)

How should `security-design.md` express production security architecture?

- A. **As-built + backlog (recommended)** — host `.env`, Compose network isolation, port 80 exposure, SSH GHA deploy path, Hub `:latest` pulls, postgres volume; backlog for password SSH, `:latest` mutability, CVE scanning, backup runbook.
- B. **Zero-trust infra** — mTLS mesh, secrets manager, WAF as required design this intent.
- C. **Contract-only** — C2/C3 image lines only; defer ops detail.
- D. **Minimal** — secrets-in-env one section.
- X. Other (please specify)

[Answer]: A

---

## Q3 — Inception NFR2 (document, do not mandate compose changes)

How should security-design treat NFR2 (this intent documents deploy ops but does not mandate compose repo merges)?

- A. **Document as-built manual deploy (recommended)** — workflow_dispatch, `git pull --ff-only`, `deploy-service.sh`, droplet topology; explicit **no change mandate** for FR2 planning intent.
- B. **Normative deploy SLOs** — assign availability/rollback SLAs as design targets.
- C. **Defer NFR2** — mark all deploy design N/A in traceability.
- X. Other (please specify)

[Answer]: A

---

## Q4 — Application security boundaries (U1/U2)

How should U3 design reference application-layer security (JWT, SPA auth, API errors)?

- A. **Pointers only (recommended)** — short cross-refs to U1/U2 `security-design.md`; U3 owns host/network/deploy/image supply chain only.
- B. **Duplicate summaries** — copy JWT and Elf auth sections into U3 security-design for single-folder read.
- C. **Ignore** — U3 security-design mentions compose only with no cross-unit pointers.
- X. Other (please specify)

[Answer]: A

---

## Q5 — NFR requirement traceability in design

How should `traceability.json` cover detailed NFR3.x (and related NFR7.x) from U3 requirements?

- A. **Full U3 id coverage (recommended)** — every enumerated NFR id in security-requirements and tech-stack-decisions gets OK, GAP, or N/A with a concrete design pointer; inception NFR1–NFR5 rollup included (NFR2 emphasis).
- B. **Gaps and mandates only** — trace backlog and ALWAYS/NEVER rows; mark remainder N/A.
- C. **Inception rollup only** — skip NFR3.x detail.
- D. **Empty coverage** — defer to Infrastructure Design.
- X. Other (please specify)

[Answer]: A

---

## Assumptions & Open Questions

- U3 NFR Requirements answers (Q1–Q5 all **A**) remain authoritative unless changed here.
- FR2: reference documentation only — no compose product merges this intent.
- Operational verification remains manual (no automated tests in compose repo).

None.

---

## Consolidated Summary Confirmation

Does this all look correct before I generate the U3 NFR design artifact package?

- **Q1 (A):** As-built ops/security catalogue; backlog rows; no platform change commitment this intent.
- **Q2 (A):** Security design — `.env`, network, SSH deploy, Hub pulls, postgres volume + ops backlog.
- **Q3 (A):** NFR2 — document manual deploy topology; no compose change mandate for FR2.
- **Q4 (A):** App security — pointers to U1/U2 only.
- **Q5 (A):** Traceability — full U3 NFR coverage with inception NFR1–NFR5 rollup.

- Looks correct
- Request changes

[Answer]: Looks correct
