# Functional Design Questions — unit `habit-tracker-springboot`

Context: Brownfield **planning-only** intent (FR2). Unit **U1** (`service`, repo `habit-tracker-springboot`) — seven logical backend blocks from domain design. This stage produces **reference functional design** for follow-up Bolt **F1** and documents **as-built** behavior from CodeKB; no application-repo merges in this intent.

Sources: `unit-of-work.md`, `unit-of-work-story-map.md`, `components.md`, `contract-summary.md` (C1), `requirements.md`, `stories.md`, `codekb/habit-tracker-springboot/`.

---

## Q1 — Artifact purpose for this intent

What should the U1 functional-design package optimize for?

- A. **As-built reference (recommended)** — entities, rules, and workflows describe **implemented** API/domain behavior today; gaps vs `docs/domain.md` are explicit GAP/backlog rules, not aspirational product law.
- B. **Target-state from domain.md** — functional spec follows `docs/domain.md` as normative; as-built deviations listed separately in each artifact.
- C. **Dual layer** — YAML blocks = as-built; prose sections = domain-doc target + migration notes for follow-up intents.
- D. **Minimal closure** — thin functional-spec only (workflows + traceability); skip deep entity/rule YAML for this planning intent.
- E. **F1 template depth** — full entities/rules/spec as if preparing immediate code generation in a **future** intent (maximum detail).
- X. Other (please specify)

[Answer]: A

---

## Q2 — Entity model scope

Which persistence concepts belong in `entities.md` for U1?

- A. **Core product entities** — User, Habit, HabitLog, HabitAggregate, HabitIcon (catalog); relationships and attributes aligned with as-built JPA/Flyway.
- B. **Full JPA inventory** — every entity/table from CodeKB structure scan (including auxiliary/join tables).
- C. **A + explicit gap attributes** — core entities plus documented **missing** domain fields (habit state, startDate, schedule) as nullable/backlog attributes with `source: gap-vs-domain-doc`.
- D. **Conceptual only** — technology-agnostic entities without mirroring table/column names from code.
- X. Other (please specify)

[Answer]: A

---

## Q3 — Business rules: as-built vs backlog

How should `rules.md` treat US2.x / domain-doc behaviors **not** fully implemented?

- A. **Implemented rules only** — numbered BR ids cover enforceable behavior in code today; US2 backlog referenced in traceability as GAP/N/A without inventing BR text for unimplemented logic.
- B. **Implemented + future rules** — separate categories (`implemented` vs `backlog`) in YAML; backlog rules cite US2.x and domain.md but marked non-enforcing for as-built.
- C. **Domain-doc normative** — all domain.md rules listed; each tagged `enforcement: as-built | gap | partial`.
- D. **Contract-first** — rules derived from C1 REST/JWT contract summary only; domain lifecycle rules omitted until a follow-up intent.
- X. Other (please specify)

[Answer]: B

---

## Q4 — Workflow coverage in `functional-spec.md`

Which workflow groups must appear as numbered step sequences?

- A. **Full seven-component coverage** — Authentication, UserClock, HabitManagement, CheckInTracking, StreakAndAggregate (incl. scheduler), Statistics, HabitIconCatalog.
- B. **User-journey slice** — login → `/api/me` → habit CRUD → track/untrack → statistics (merge icon catalog into habit CRUD).
- C. **API-surface slice** — one workflow per controller group from contract-summary path table only.
- D. **A + operational** — include health/actuator and error/correlation-id cross-cutting workflow appendix.
- X. Other (please specify)

[Answer]: A

---

## Q5 — Traceability acceptance criteria (U1-owned)

Which AC ids must U1 `traceability.json` cover with `OK`/`GAP`/`N/A`?

- A. **Backend-primary ACs only** — AC1.1.1–1.1.2, AC1.3.1–1.3.2, AC1.4.1, AC1.5.1–1.5.2, AC1.6.1, AC1.7.1–1.7.2, AC1.8.1, AC1.9.1, AC1.10.1–1.10.2, plus US2.x rows where U1 is sole owner in story map.
- B. **All ACs for stories U1 shares** — every AC under US1.1–US1.10 and US2.1–US2.4, US2.6–US2.7 even when SPA owns UX (mark SPA-only steps N/A with rationale).
- C. **US1.x as-built only** — exclude US2.x ACs from U1 traceability (handled at intent level or U2).
- D. **Minimal** — one row per FR1.1 API journey plus AC1.12 meta rows.
- X. Other (please specify)

[Answer]: A

---

## Q6 — Streak and scheduler behavior

How deep should StreakAndAggregate / nightly job behavior be specified?

- A. **As-built cron semantics** — document actual scheduler trigger, aggregate fields updated on track/untrack, and known gaps vs user-relative midnight (US2.3).
- B. **Domain-target streak machine** — state transitions per domain.md; tag as-built delta in functional-spec.
- C. **High-level only** — one paragraph + pointer to CodeKB; no separate streak state machine.
- D. **Omit scheduler** — streak rules folded into CheckInTracking workflows only.
- X. Other (please specify)

[Answer]: A

---

## Q7 — Authorization and data scope rules

How should user-scoping and JWT rules be expressed?

- A. **Explicit BR rules** — every habit/log read/write scoped to authenticated user or habit ownership; 401/403 behaviors tied to WebSecurityConfig patterns.
- B. **Single policy rule** — one authorization BR with references to components; details in functional-spec security workflow.
- C. **Defer to contract-summary** — no duplicate JWT rules in rules.md; functional-spec references C1 only.
- X. Other (please specify)

[Answer]: A

---

## Q8 — Error handling and validation depth

How should API error and validation behavior appear in artifacts?

- A. **GlobalExceptionHandler catalog** — map exception types to HTTP status + ErrorResponse shape; include correlationId behavior per team mandate.
- B. **Per-workflow** — each use case lists success + primary failure paths (401, 404 habit, validation 400) without full exception inventory.
- C. **Minimal** — stable ErrorResponse contract only; defer exception mapping to NFR/code stages.
- X. Other (please specify)

[Answer]: A

---

## Assumptions & Open Questions

- U1 is `service` kind — no `frontend-components.md` for this unit.
- Planning-only: artifacts are documentation for agents and Bolt F1, not a mandate to change springboot in this intent.
- CodeKB and OpenAPI snapshot remain evidence; conflicts resolved per Q1/Q3 stance.

None.

---

## Consolidated Summary Confirmation

- **Q1 (A):** As-built reference — implemented API/domain behavior; domain.md gaps as explicit GAP/backlog, not normative product law.
- **Q2 (A):** Core entities — User, Habit, HabitLog, HabitAggregate, HabitIcon aligned with as-built JPA/Flyway.
- **Q3 (B):** Rules YAML with `implemented` vs `backlog` categories; backlog cites US2.x/domain.md, non-enforcing for as-built.
- **Q4 (A):** Full seven-component workflows including StreakAndAggregate/scheduler.
- **Q5 (A):** Traceability for backend-primary ACs plus US2.x where U1 is sole owner.
- **Q6 (A):** As-built cron/aggregate semantics with gaps vs user-relative midnight noted.
- **Q7 (A):** Explicit BR rules for user/habit scoping and 401/403 per WebSecurityConfig.
- **Q8 (A):** GlobalExceptionHandler catalog with ErrorResponse and correlationId.

[Answer]: Looks correct
