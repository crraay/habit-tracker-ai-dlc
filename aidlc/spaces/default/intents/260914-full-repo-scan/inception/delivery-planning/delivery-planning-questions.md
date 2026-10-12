# Delivery Planning Questions — intent `260914-full-repo-scan`

Context: Brownfield **planning-only** intent (FR2, Q8-A). Three repo-aligned units (**U1** Spring Boot `service`, **U2** Angular `ui`, **U3** Compose `packaging`) with DAG **U2 → U1**, **U3 → U1/U2** (`unit-of-work-dependency.md`). Contracts C1–C3 are documented in `contract-summary.md`. Team practice: **no walking-skeleton ceremony** on this codebase — extend the existing full stack (`team.md`).

A **Bolt** is one planned build pass over a slice of work that ends in something runnable (or, for this intent, in an approved planning closure). Delivery Planning chooses Bolt **order** (economic/value judgment); Units Generation chose **topology** only.

Sources: `requirements.md` (FR2, FR3.3), `unit-of-work.md`, `unit-of-work-dependency.md`, `contract-summary.md`, `team-practices.md`, `team.md` / `org.md` (Way of Working, Walking Skeleton, Deployment).

---

## Q1 — What should `bolt-plan.md` optimize for?

- A. **This intent only** — one (or few) Bolts that close Inception and record that Construction for `260914-full-repo-scan` is skip/no-op for application repos; optional appendix mentions future unit order.
- B. **This intent + reference template** — explicit Bolts for *this* workflow closure **and** documented reference Bolts (U1 → U2 → U3) for **follow-up** feature intents (not executed here).
- C. **Future construction template only** — treat this stage as defining how *the next* code intent should run; minimal prose about closing the scan intent.
- D. **Topological default** — reference Bolts strictly U1, then U2, then U3 with no separate “planning closure” Bolt (Construction skip captured only in DoD notes).
- X. Other (please specify)

[Answer]: B

---

## Q2 — Sequencing philosophy (for Bolts that involve application repos, now or in follow-up intents)

What should we build first when code **is** in scope?

- A. **Follow the unit DAG** — U1 before U2 before U3; packaging last (matches dependencies and compose image pulls).
- B. **Thin end-to-end slice first** — first code Bolt proves login → JWT → one track call across U1+U2 (even though team skips skeleton *ceremony*, you still want an early integrated slice).
- C. **Risk-first** — prioritize under-tested paths (auth, track, streak scheduler) before polish or packaging.
- D. **Value-first** — prioritize user-visible backlog (US2.x themes) over infra/packaging.
- E. **Mix** — describe in option X which philosophy applies to which Bolt.
- X. Other (please specify)

[Answer]: A

---

## Q3 — Formal prioritization (WSJF-style)

Should we score and rank Bolts with a formal model (value + urgency + risk reduction ÷ job size)?

- A. **No** — short rationale in prose (topology + brownfield reality is enough).
- B. **Lightweight table** — qualitative high/medium/low for value, risk, and size; no numeric WSJF.
- C. **Full WSJF-style numeric scores** — document weights you choose in Q3 follow-up (reply in chat: e.g. risk 40%, value 40%, size 20%).
- X. Other (please specify)

[Answer]: A

---

## Q4 — Bolt granularity

How big should one Bolt be?

- A. **One unit per Bolt** — U1, U2, U3 each get their own Bolt when code is built (three application Bolts + planning closure if needed).
- B. **Bundle apps** — one Bolt for U1+U2 coordinated release; separate Bolt for U3 packaging/deploy.
- C. **Single mega-Bolt** — all three units in one Construction pass (only for small follow-up changes).
- D. **Planning closure separate** — one tiny Bolt for this intent’s non-code finish; app units stay one-per-Bolt for follow-ups.
- X. Other (please specify)

[Answer]: D

---

## Q5 — Parallel Bolts

Can multiple Bolts run at the same time?

- A. **Serial only** — one Bolt at a time (solo AI session; matches classic default here).
- B. **Parallel after U1 baseline** — U2 and U3 prep may overlap only where DAG allows (document constraints).
- C. **Not applicable** — this intent executes no parallel application Construction.
- X. Other (please specify)

[Answer]: A

---

## Q6 — External dependencies (outside this team’s repos)

Which gated externals should appear on `external-dependency-map.md`?

- A. **Standard set** — PostgreSQL (runtime), Docker Hub `:latest` pulls, DigitalOcean droplet / SSH deploy, host `.env` secrets (JWT, CORS, DB).
- B. **A + GitHub Actions** — `build-image` on app `main`, compose `workflow_dispatch` deploy.
- C. **Minimal** — note “fully AI-contained planning” with empty map except PostgreSQL mention.
- D. **A + domain-doc / OpenAPI governance** — treat `docs/domain.md` alignment and OpenAPI snapshot discipline as external “governance” dependencies for future intents.
- X. Other (please specify)

[Answer]: B

---

## Q7 — What worries you most about future builds on this stack?

(Pick the theme to tackle earliest when you **do** open a code intent.)

- A. **Cross-repo contract drift** — U1 API change without U2 snapshot regenerate + image tag alignment.
- B. **Domain-doc vs as-built gaps** — streak/check-in/lifecycle semantics (US2.x backlog).
- C. **Test gaps** — auth/track/streak under-tested before refactors.
- D. **Deploy/ops** — manual `:latest` rollback, SSH deploy, no staging.
- E. **No strong worry** — document topology order only.
- X. Other (please specify)

[Answer]: A

---

## Q8 — Construction phase for intent `260914-full-repo-scan`

How should the approved plan treat classic Construction stages (functional-design through code-generation) **for this intent**?

- A. **Skip / no-op application work** — run phase-boundary verification and Operation planning docs only; no merges to `habit-tracker-springboot` or `habit-tracker-angular`.
- B. **Skip code-generation only** — still run design stages as documentation passes in the AI-DLC record (no repo writes).
- C. **Park Construction** — mark Construction Pending until a new intent is opened; close Inception after delivery planning only.
- X. Other (please specify)

[Answer]: A

---

## Per-Bolt questions

### Bolt P1 — Planning closure (this intent)

- **Units bundled:** None (AI-DLC workspace / inception artifacts only).
- **Walking skeleton?** No — brownfield; this Bolt closes planning, not a new stack.
- **Definition of Done:** What must be true for this Bolt to count as done?
- **Confidence hypothesis:** What will completing this Bolt prove?
- **Mob owner:** Default `aidlc-developer-agent` (classic, team-formation skipped).

[Answer]: **DoD:** `phase-check-inception.md` passes; delivery-planning gate approved; FR2.1/FR3.3 satisfied in `bolt-plan.md`; Construction for this intent limited to verification/Operation planning with **no** application-repo merges. **Hypothesis:** The team can open a follow-up code intent with a stable unit DAG, contracts (C1–C3), and reference Bolt order without re-scanning. **Walking skeleton:** No. **Mob:** aidlc-developer-agent.

---

### Bolt F1 — Reference: `u1-habit-tracker-springboot` (follow-up intents only)

- **Units bundled:** U1 only.
- **Walking skeleton?** 
- **Definition of Done:**
- **Confidence hypothesis:**
- **Mob owner:**

[Answer]: **DoD:** Changes merged to `habit-tracker-springboot` `main` via short-lived branch; `mvn test` (or full build-and-test) green before `build-image`; OpenAPI/export path updated if REST semantics change. **Hypothesis:** Backend contract remains the semantic source for C1; consumers can regenerate SPA client safely. **Walking skeleton:** No (team brownfield stance). **Mob:** aidlc-developer-agent.

---

### Bolt F2 — Reference: `u2-habit-tracker-angular` (follow-up intents only)

- **Units bundled:** U2 (depends on U1 contract baseline).
- **Walking skeleton?**
- **Definition of Done:**
- **Confidence hypothesis:**
- **Mob owner:**

[Answer]: **DoD:** Changes merged to `habit-tracker-angular` `main`; `npm run test:ci` green before `build-image`; if U1 API changed, `swagger/api-docs.json` synced and `npm run generate-api` run; no hand-edits under `src/app/web-api/`. **Hypothesis:** SPA stays aligned with pinned OpenAPI snapshot and JWT behaviour (C1). **Walking skeleton:** No. **Mob:** aidlc-developer-agent.

---

### Bolt F3 — Reference: `u3-habit-tracker-compose` (follow-up intents only)

- **Units bundled:** U3 (depends on U1/U2 images).
- **Walking skeleton?**
- **Definition of Done:**
- **Confidence hypothesis:**
- **Mob owner:**

[Answer]: **DoD:** Compose/docs/scripts updated in `habit-tracker-compose`; deploy runbook followed; production pull uses Hub images built from app `main`; host `.env` never committed. **Hypothesis:** Production stack recreates with aligned `crraay/*:latest` (or explicitly pinned digest/tag) and nginx `/api` proxy still reaches backend. **Walking skeleton:** No. **Mob:** aidlc-developer-agent.

---

## Consolidated Summary Confirmation

After you answer Q1–Q8 (and per-Bolt tags if you customize Bolts), I will generate `bolt-plan.md`, `team-allocation.md`, `risk-and-sequencing-rationale.md`, and `external-dependency-map.md`, then run the Inception → Construction traceability audit.

Does the **default Bolt set** (P1 planning closure + F1/F2/F3 reference sequence) match what you want?

- Looks correct
- Request changes

[Answer]: Looks correct
