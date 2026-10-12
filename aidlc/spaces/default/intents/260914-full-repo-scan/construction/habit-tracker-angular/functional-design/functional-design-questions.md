# Functional Design Questions — unit `habit-tracker-angular`

Context: Brownfield **planning-only** intent (FR2). Unit **U2** (`ui`, repo `habit-tracker-angular`) — seven SPA logical blocks from domain design. Produces **reference functional design** for follow-up Bolt **F2**: `functional-spec.md`, `frontend-components.md`, `traceability.json` (no server entity/rules files for `ui` kind).

Sources: `unit-of-work.md`, `unit-of-work-story-map.md`, `components.md`, `contract-summary.md` (C1 consumer), `requirements.md`, `stories.md`, `codekb/habit-tracker-angular/`.

---

## Q1 — Artifact purpose for this intent

What should the U2 functional-design package optimize for?

- A. **As-built reference (recommended)** — workflows and components describe **implemented** SPA behavior today; gaps vs `docs/domain.md` and US2.x are explicit GAP/backlog, not normative UI law.
- B. **Target-state from domain.md** — functional spec follows domain doc as normative; as-built deviations listed separately.
- C. **Dual layer** — component spec = as-built; prose sections = domain target + migration notes.
- D. **Minimal closure** — thin functional-spec + traceability only; skip deep `frontend-components.md`.
- E. **F2 template depth** — maximum detail as if immediate code generation in a follow-up intent.
- X. Other (please specify)

[Answer]: A

---

## Q2 — Client state and data scope

How should `frontend-components.md` treat client-side state (Elf auth persistence, UserClockStore, feature services)?

- A. **As-built stores and services** — document Elf auth slice, in-memory UserClockStore, HTTP via generated `web-api` client + interceptors; no invented global state.
- B. **Screen-level only** — components and routes without store internals.
- C. **A + backlog UX state** — note missing minDate on track datepicker, refresh token gap, error-handling gaps per US2.x.
- D. **Generated client as boundary** — treat `web-api` as sole API surface; minimal component internals.
- X. Other (please specify)

[Answer]: A

---

## Q3 — UI rules: as-built vs backlog

How should interaction/validation rules appear (in functional-spec and component props/validation sections)?

- A. **Implemented flows only** — numbered UI rules for as-built; US2 backlog as labeled non-enforcing notes.
- B. **Implemented + backlog categories** — separate `implemented` vs `backlog` rule groups (mirror U1 rules.md pattern in prose/YAML in functional-spec).
- C. **Domain-doc normative** — UI follows domain.md; tag as-built delta per rule.
- D. **Contract-first** — only behaviors implied by OpenAPI snapshot + C1.
- X. Other (please specify)

[Answer]: B

---

## Q4 — Workflow coverage in `functional-spec.md`

Which SPA workflow groups must appear as numbered step sequences?

- A. **Full seven-component coverage** — AppShell, Authentication, UserClock, TrackHabits, HabitManagementUI, Statistics, SharedPresentation (interceptors/routing).
- B. **User-journey slice** — login → shell → track → edit → stats → settings only.
- C. **Route-aligned** — one workflow per primary route module.
- D. **A + auth/error appendix** — 401 interceptor flow and Settings-style error handling called out.
- X. Other (please specify)

[Answer]: A

---

## Q5 — Traceability acceptance criteria (U2-owned)

Which AC ids must U2 `traceability.json` cover?

- A. **SPA-primary ACs** — AC1.2.1, AC1.11.x, AC1.1.3, shared US1.x where UI owns UX (1.4–1.10 client steps), plus US2.2, US2.4, US2.5, US2.7 where U2 shares; mark API-only steps N/A with rationale.
- B. **All US1.x + US2.x ACs** — full matrix even when backend-only (N/A with note).
- C. **US1.x as-built only** — exclude US2.x from U2 traceability.
- D. **Minimal** — shell + login + track only.
- X. Other (please specify)

[Answer]: A

---

## Q6 — Error handling UX depth

How should mutation error handling be specified?

- A. **Settings timezone pattern as reference** — explicit subscribe error paths on user-visible mutations; document gaps on login/track per US2.5.
- B. **Per-screen inventory** — each feature lists success/failure UI behavior.
- C. **Minimal** — 401 via interceptors only; defer rest to NFR/code stages.
- X. Other (please specify)

[Answer]: A

---

## Q7 — Component hierarchy depth in `frontend-components.md`

How deep should the component tree go?

- A. **Feature + shared** — top-level feature components per domain-design SPA blocks; shared modules/interceptors; key child widgets (date control, icon picker) named.
- B. **Every routed component** — full router tree from CodeKB inventory.
- C. **Coarse** — one row per logical block only, no props detail.
- D. **A + props/state table** — inputs/outputs and local state for primary screens.
- X. Other (please specify)

[Answer]: A

---

## Q8 — OpenAPI / API integration

How should generated client usage be captured?

- A. **Regeneration contract** — cite `swagger/api-docs.json` + `npm run generate-api`; map feature areas to API service classes; no hand-edits to `web-api/`.
- B. **Endpoint list only** — duplicate contract-summary paths in functional-spec.
- C. **Omit** — assume C1 contract-summary is enough.
- X. Other (please specify)

[Answer]: A

---

## Assumptions & Open Questions

- U2 depends on U1 REST + JWT (C1); functional design does not redefine API semantics.
- Planning-only: no merges to `habit-tracker-angular` in this intent.

None.

---

## Consolidated Summary Confirmation

- **Q1 (A):** As-built SPA reference; gaps explicit as backlog.
- **Q2 (A):** Document Elf auth, UserClockStore, generated client as as-built state/API boundary.
- **Q3 (B):** Implemented vs backlog rule categories in functional-spec.
- **Q4 (A):** Full seven SPA component workflows (+ optional error appendix via D not chosen; A only).
- **Q5 (A):** SPA-primary and shared AC coverage with N/A for API-only steps.
- **Q6 (A):** Settings-style error pattern; note login/track gaps (US2.5).
- **Q7 (A):** Feature + shared hierarchy with key widgets.
- **Q8 (A):** OpenAPI regeneration contract and service mapping.

[Answer]: Looks correct
