# NFR Requirements Questions — unit `habit-tracker-angular`

Context: Brownfield **planning-only** intent (FR2). Unit **U2** (`ui`, repo `habit-tracker-angular`). This stage produces **reference NFR and tech-stack documentation** for follow-up Bolt **F2**; no application-repo merges in this intent.

**Unit kind note:** For `ui`, the stage emits `performance-requirements.md`, `security-requirements.md`, `tech-stack-decisions.md`, and `traceability.json` only (no separate scalability, reliability, or observability markdown files — backend and ops NFRs remain in U1/U3).

Sources: U2 `functional-spec.md`, `frontend-components.md`, `requirements.md` (NFR1–NFR5), `contract-summary.md` (C1 consumer), `codekb/habit-tracker-angular/` (architecture, technology-stack), affirmed `team.md` / `project.md` mandates.

---

## Q1 — NFR package purpose for this intent

What should the U2 NFR requirements artifacts optimize for?

- A. **As-built baseline (recommended)** — document **implemented** client performance, security, and stack posture today; gaps and risks explicit; no new contractual SLOs for this intent.
- B. **Target SLO package** — define quantitative Web Vitals, bundle-size budgets, and availability targets as **normative** for the SPA (even if not measured in CI today).
- C. **Dual layer** — as-built sections plus a separate **follow-up intent** target table for hardening (error UX, e2e, CSP).
- D. **Minimal closure** — `tech-stack-decisions.md` + `traceability.json` only; defer performance/security markdown to NFR Design or a future intent.
- E. **Compliance-heavy** — expand regulatory/compliance rows even though requirements list no mandatory framework for this product.
- X. Other (please specify)

[Answer]: A

---

## Q2 — Client performance requirements style

How should `performance-requirements.md` treat latency, bundle size, and rendering for this SPA?

- A. **Documented absence + engineering guidance** — state that no formal SLIs/SLOs or Lighthouse CI gates exist; cite typical personal-scale SPA expectations as **non-binding guidance** for future intents only.
- B. **Explicit numeric targets** — assign LCP/INP/bundle-kB budgets and per-route load targets as requirements rows with NFRx.y ids.
- C. **As-built constraints only** — OnPush on heavy screens, generated API client size, UserClockStore caching, nginx static delivery; no numeric SLOs.
- D. **Benchmark mandate** — require future intents to add Lighthouse CI or bundle analysis before changing shell or track flows.
- X. Other (please specify)

[Answer]: A

---

## Q3 — Client security requirements scope

How deep should `security-requirements.md` go for U2?

- A. **As-built + backlog** — JWT in Elf localStorage, interceptors/guards, same-origin `/api`, C1 error/401 behavior; STRIDE-style **backlog** for known gaps (token storage XSS surface, sparse mutation error UX, no CSP headers documented).
- B. **Threat-model primary** — full STRIDE table as normative; map each threat to required controls (some not implemented yet).
- C. **Contract-only** — restate C1 consumer obligations; defer implementation detail to code generation in a future intent.
- D. **Minimal auth** — login/guard/interceptor only; skip storage and transport notes.
- X. Other (please specify)

[Answer]: A

---

## Q4 — Cross-cutting NFR categories (no dedicated U2 files)

Scalability, reliability, and observability markdown are **service-scoped** in this stage. How should U2 reference them?

- A. **Pointers only (recommended)** — performance and security files include short cross-refs to U1/U3 for server capacity, health, and ops logging; traceability maps inception NFR2/NFR4/NFR5 where U2 touches deploy or language only.
- B. **Duplicate summaries** — copy abbreviated scalability/reliability/observability sections into performance or security files for a single-folder read.
- C. **Ignore** — U2 traceability marks NFR2/NFR4/NFR5 N/A with no cross-reference.
- X. Other (please specify)

[Answer]: A

---

## Q5 — Tech stack decisions for this intent

How should `tech-stack-decisions.md` treat the brownfield stack (Angular 18 standalone, Elf, ng-openapi-gen, Karma/ChromeHeadless CI, Docker/nginx image)?

- A. **Affirm as-built lock-in (recommended)** — record current choices and rationale from CodeKB; **no upgrade or replacement decisions** in this planning intent; note follow-up evaluation triggers only.
- B. **Active selection** — re-decide stack as if greenfield (may contradict repo).
- C. **Delta only** — document mandated team practices (no hand-edited web-api, legacy AWS workflow forbidden) and skip version table.
- D. **Upgrade roadmap** — include planned Angular/Elf/test-runner version bumps as decisions with dates.
- X. Other (please specify)

[Answer]: A

---

## Q6 — Inception NFR traceability (NFR1–NFR5)

How should `traceability.json` cover intent-level NFR1–NFR5 for U2?

- A. **Map all five** — each NFR1–NFR5 gets OK/N/A with derived NFRx.y targets in category files where applicable (e.g. NFR3 mandates → security/tech-stack rows; NFR2 compose scope → N/A with U3 note).
- B. **NFR3 + NFR5 only** — team mandates and English prose; mark others N/A at unit level.
- C. **Defer traceability** — empty coverage array with note that inception NFRs are intent-wide only.
- X. Other (please specify)

[Answer]: A

---

## Assumptions & Open Questions

- U2 is `ui` kind — four deliverables per stage `produces_kinds` (performance, security, tech-stack, traceability).
- Planning-only: numeric SLOs optional; prefer honesty about unmeasured as-built behavior.
- C1 consumer: JWT attachment, 401 logout, ErrorResponse shape assumed from backend contract.

None.

---

## Consolidated Summary Confirmation

Does this all look correct before I generate the NFR artifact package?

- **Q1 (A):** As-built baseline — implemented client NFR posture today; gaps explicit; no new contractual SLOs this intent.
- **Q2 (A):** Performance — no formal SLIs/SLOs or Lighthouse CI; non-binding SPA guidance for future intents only.
- **Q3 (A):** Security — as-built JWT/Elf/interceptors/guards plus STRIDE-style backlog for known gaps.
- **Q4 (A):** Cross-cutting categories — pointers to U1/U3 for server/ops NFRs; traceability maps inception NFRs where U2 touches them.
- **Q5 (A):** Tech stack — affirm brownfield lock-in (Angular 18, Elf, ng-openapi-gen); no upgrade decisions this intent.
- **Q6 (A):** Traceability — map all inception NFR1–NFR5 with derived NFRx.y rows where applicable.

- Looks correct
- Request changes

[Answer]: Looks correct
