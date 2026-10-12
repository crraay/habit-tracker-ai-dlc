# Domain Design Questions — intent `260914-full-repo-scan`

Context: Brownfield **planning-only** intent (FR2). This stage documents **as-built** logical building blocks for the Habit Tracker product (Spring Boot API, Angular SPA, Compose deploy satellite), grounded in CodeKB inventories—not greenfield decomposition or deployment topology (Units Generation decides deploy grouping).

---

## Q1 — Catalogue scope and intent

For `components.md`, should the component catalogue describe **only runnable application logic** in springboot + angular, or also include **compose deploy scripts** as a logical block?

- A. **Application only** — catalogue covers API monolith logical blocks + SPA logical blocks; compose stays out of `components.md` (referenced later in units/delivery as deploy-only).
- B. **Application + deploy orchestration** — add a `DeployOrchestration` logical block for habit-tracker-compose (scripts, compose file, GHA deploy workflow) alongside app components.
- C. **Single cross-repo product view** — one merged catalogue listing both backend and frontend blocks under one product namespace (still no infra-as-component).
- D. **Minimal catalogue** — only backend domain-facing blocks; frontend summarized as one `SpaPresentation` block.
- E. **Maximal mirror of CodeKB** — one component per row in both springboot and angular component inventories (fine-grained).
- X. Other (please specify)

[Answer]: A

---

## Q2 — Backend decomposition granularity

The Spring monolith CodeKB lists REST adapters, services, security, scheduler, and persistence. For domain design, how should we **group** these into logical components?

- A. **Coarse (recommended for planning)** — ~7 blocks: Authentication, UserClock, HabitManagement, CheckInTracking, StreakAndAggregate, Statistics, HabitIconCatalog (+ shared Persistence as external dependency, not a component).
- B. **Layer-based** — separate `RestAdapters`, `ApplicationServices`, `SecurityInfrastructure`, `ScheduledJobs`, `PersistenceAccess` components.
- C. **Controller-aligned** — one logical component per REST controller (Auth, Habit, HabitTrack, Statistics, HabitIcon, UserClock).
- D. **Domain-centric** — fewer blocks: IdentityAccess, HabitCatalog, DailyTracking (includes streak), Reporting.
- E. Same as A but **merge** StreakAndAggregate into CheckInTracking (streak is implementation detail of track/untrack + nightly job).
- X. Other (please specify)

[Answer]: A

---

## Q3 — Security / JWT cross-cutting block

Should Spring Security, JWT filter, and correlation-id filter be modeled as their own logical component or folded into Authentication?

- A. **Fold into Authentication** — one `Authentication` component owns login, JWT issuance, request authentication, and JSON 401/403 handling.
- B. **Separate `ApiSecurity` component** — Authentication owns login/token; ApiSecurity owns filter chain, JWT parsing, CORS, and entry points (Authentication depends on ApiSecurity).
- C. **Infrastructure only** — document under external_dependencies / rationale, not as a named component.
- D. **Match package layout** — separate only if it clarifies units generation later (your call at gate).
- X. Other (please specify)

[Answer]: A

---

## Q4 — Frontend decomposition

How should the Angular SPA map to logical components in the catalogue?

- A. **Feature-aligned (CodeKB default)** — AppShell, Authentication, UserClock, TrackHabits, Statistics, HabitManagementUI, SharedPresentation; Generated Web API Client is an **adapter dependency**, not a domain component.
- B. **Include Generated Web API Client** as its own logical component (OpenAPI boundary / anti-corruption to backend).
- C. **Coarser UI** — AppShell + Authentication + FeatureScreens (single block for track/edit/stats/settings) + SharedPresentation.
- D. **Mirror backend names** — pair frontend blocks to backend blocks (Authentication↔Authentication, etc.) explicitly in depends_on edges.
- E. A + document **Settings** as part of UserClock (settings is timezone UX for clock).
- X. Other (please specify)

[Answer]: A

---

## Q5 — Entity ownership catalogue depth

`components.md` requires entity ownership at shape level (identifier + attribute names, no types/cardinality). How much of the persistence model should we list?

- A. **Core product entities** — User, Habit, HabitLog, HabitAggregate, HabitIcon (as catalog reference), aligned with as-built JPA and user stories US1.x.
- B. **Full JPA inventory** — every entity/table from Flyway including join/aux tables if present in CodeKB.
- C. **Core + explicit gap note** — core entities plus a **Backlog** pseudo-entity or rationale rows for domain-doc fields not in schema (habit state, schedule) without inventing new components.
- D. **Backend-only entities** — no frontend-owned entities; SPA has no entity section (only component behaviours).
- X. Other (please specify)

[Answer]: B

---

## Q6 — Cross-tier interaction style in the catalogue

For `depends_on` edges between **Angular logical components and backend logical components**, what interaction style should the YAML catalogue record?

- A. **Sync HTTP via generated client** — frontend feature components depend_on backend REST surface components with `style: sync`; backend never depends_on frontend.
- B. **Published API contract** — depend_on targets a notional `HabitTrackerApi` boundary component representing OpenAPI aggregate (frontend → API; backend controllers implement API).
- C. **Document separately** — no cross-repo depends_on in YAML; only intra-tier edges; cross-tier described in prose/rationale only.
- D. A + label external_dependencies PostgreSQL/JWT/H2(test) explicitly per backend component.
- X. Other (please specify)

[Answer]: A

---

## Q7 — Backlog stories (US2.x) in domain design

How should **Won't Have** backlog stories (lifecycle, check-in window, streak scheduling, statistics semantics, error UX) appear in this stage?

- A. **Rationale and ADRs only** — note gaps vs `docs/domain.md` in Rationale/ADRs; traceability marks US2.x as Deferred/N/A; no extra components.
- B. **Future extension components** — add clearly labeled `Future*` or `[Backlog]` logical components in YAML for intended domain alignment (not as-built code).
- C. **Gap list entity** — single `DomainAlignmentBacklog` component owning no runtime code, listing gap themes for units/delivery.
- D. **Omit US2.x from traceability coverage** — cover only US1.x + intent-only US1.12 in traceability.json.
- X. Other (please specify)

[Answer]: A

---

## Q8 — Significant ADR topics

Which decision areas MUST get an ADR in `decisions.md` for this brownfield catalogue? (select all that apply)

- A. Planning-only intent boundary (no Construction merges; catalogue is descriptive).
- B. Backend coarse vs fine decomposition choice (Q2).
- C. Treating JWT/security as part of Authentication vs separate (Q3).
- D. Server-authoritative user clock (`/api/me`) vs client calendar.
- E. Streak reset scheduler using global timezone vs per-user today (as-built vs domain doc).
- F. OpenAPI-generated client as integration boundary (angular).
- G. Known domain-doc vs schema gaps deferred to follow-up intents.
- X. Other (please specify)

[Answer]: A,B,C,D,F,G

---

## Consolidated Summary Confirmation

- Looks correct
- Request changes

[Answer]: Looks correct
