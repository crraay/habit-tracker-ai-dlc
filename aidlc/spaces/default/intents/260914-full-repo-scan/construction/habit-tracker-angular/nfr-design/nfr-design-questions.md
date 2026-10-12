# NFR Design Questions — unit `habit-tracker-angular`

Context: Brownfield **planning-only** intent (FR2). Unit **U2** (`ui`, repo `habit-tracker-angular`). NFR Requirements (Q1–Q6) chose an **as-built baseline** with explicit gaps and non-binding future guidance — no new contractual SLOs this intent.

**Unit kind note:** U2 emits `performance-design.md`, `security-design.md`, `logical-components.md`, and `traceability.json` only (no separate scalability, reliability, or observability design markdown — those remain U1/U3).

Sources: U2 `nfr-requirements/*.md`, `functional-spec.md`, `frontend-components.md`, `contract-summary.md` (C1 consumer), affirmed `team.md` / `project.md`.

---

## Q1 — NFR design package purpose

What should the U2 NFR design artifacts optimize for?

- A. **As-built pattern catalogue (recommended)** — document **implemented** client patterns (Elf auth, interceptors/guards, OnPush hot screens, generated `web-api`); map gaps to **design backlog** rows; do not prescribe new security/perf stacks as committed decisions this intent.
- B. **Target architecture** — design CSP, refresh tokens, Web Vitals budgets, and micro-frontends as **normative** targets even where not built yet.
- C. **Dual layer** — as-built sections plus a separate **follow-up intent** target design appendix (e.g. Lighthouse CI, HttpClient retry policy).
- D. **Minimal closure** — `logical-components.md` + `traceability.json` only; defer category design markdown.
- X. Other (please specify)

[Answer]: A

---

## Q2 — Client performance design stance

How should `performance-design.md` treat bundle size, rendering, and API chatter given NFR2 (no Web Vitals SLIs; UserClockStore `shareReplay`; track/statistics fetches)?

- A. **Document current + bounded guidance (recommended)** — nginx static delivery, OnPush on Track/Statistics, `/api/me` amortization, per-day habit-track refetch; optional **future-intent** notes (Lighthouse CI, route-level lazy loading) as non-binding.
- B. **Prescriptive budgets** — assign LCP/INP/kB bundle caps and design refactors to meet them in this package.
- C. **Network-only** — defer all UI rendering notes; document HttpClient paths only.
- D. **Benchmark-first** — require bundle analyzer baseline before any design recommendations.
- X. Other (please specify)

[Answer]: A

---

## Q3 — Client security design depth

How should `security-design.md` express auth, transport, and error UX?

- A. **As-built architecture + backlog (recommended)** — JWT in Elf/localStorage, guards/interceptors, same-origin `/api`, C1 401 logout; STRIDE **backlog** (XSS/localStorage, sparse mutation error handlers, CSP); Settings error pattern as reference.
- B. **Zero-trust SPA** — design httpOnly cookies, PKCE, and WAF as required patterns this intent.
- C. **C1 mirror only** — restate consumer contract; defer SPA internals.
- D. **Compliance controls** — expand regulatory catalog despite NFR3.13 N/A.
- X. Other (please specify)

[Answer]: A

---

## Q4 — Server/ops NFR categories (no U2 design files)

How should performance and security design docs reference U1/U3 scalability, reliability, and observability?

- A. **Pointers only (recommended)** — short cross-refs in performance-design (backend latency, deploy cadence) and logical-components (C1/C3 boundaries); no duplicated server SRE design in U2 files.
- B. **Duplicate summaries** — copy abbreviated U1 reliability/observability sections into U2 performance-design for single-folder reading.
- C. **Ignore** — no cross-refs; traceability marks server NFRs N/A without pointers.
- X. Other (please specify)

[Answer]: A

---

## Q5 — Logical components inventory

What should `logical-components.md` enumerate as failure domains and blast radius for the SPA?

- A. **Shell + feature areas + deploy boundary (recommended)** — map routes (login, track, edit, statistics, settings), stores (Elf auth, UserClockStore), generated API client layer, and C3 nginx/static container; cross-reference domain-design Spa* components; no micro-frontend split this intent.
- B. **Micro-frontend decomposition** — propose lazy federated modules beyond current monolithic SPA.
- C. **Infrastructure-only** — nginx container only; skip in-app structure.
- D. **Defer to Infrastructure Design** — stub with pointer only.
- X. Other (please specify)

[Answer]: A

---

## Q6 — NFR requirement traceability in design

How should `traceability.json` cover detailed NFR2.x–NFR3.x and NFR7.x from the U2 requirements stage?

- A. **Full category coverage (recommended)** — every enumerated NFR id in performance/security/tech-stack files gets OK, GAP, or N/A with a concrete design pointer (as-built pattern or backlog label); inception NFR1–NFR5 rollup included.
- B. **Gaps and mandates only** — trace backlog and ALWAYS/NEVER rows; mark remainder N/A.
- C. **Inception rollup only** — skip NFR2.x–NFR7.x detail.
- D. **Empty coverage** — defer to Infrastructure Design.
- X. Other (please specify)

[Answer]: A

---

## Assumptions & Open Questions

- U2 NFR Requirements answers (Q1–Q6 all **A**) remain authoritative unless changed here.
- Planning-only: design artifacts describe **patterns and decisions**, not implementation-ready code (≤15 line snippets per stage constraints).
- C1 consumer obligations (Bearer, 401, ErrorResponse) inform security and performance narrative.

None.

---

## Consolidated Summary Confirmation

Does this all look correct before I generate the U2 NFR design artifact package?

- **Q1 (A):** As-built client pattern catalogue; gaps as design backlog; no committed new stacks this intent.
- **Q2 (A):** Performance design — static nginx bundle, OnPush, `/api/me` cache, track/statistics fetch patterns; future notes non-binding.
- **Q3 (A):** Security design — Elf JWT, guards/interceptors, same-origin API, STRIDE backlog; Settings error reference pattern.
- **Q4 (A):** Server/ops NFRs — pointers to U1/U3 only; no duplicated SRE markdown in U2.
- **Q5 (A):** Logical components — SPA routes/stores/API client + C3 deploy boundary; no micro-frontend split.
- **Q6 (A):** Traceability — full U2 NFR2.x–NFR7.x coverage with OK/GAP/N/A and design pointers.

- Looks correct
- Request changes

[Answer]: Looks correct
