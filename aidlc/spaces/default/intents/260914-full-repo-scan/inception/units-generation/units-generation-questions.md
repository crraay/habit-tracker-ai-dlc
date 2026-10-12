# Units Generation Questions — intent `260914-full-repo-scan`

Context: Brownfield **planning-only** intent (FR2). Domain design catalogued **14 logical components** (7 backend + 7 SPA) in `components.md`; compose deploy was excluded from the catalogue (ADR-001) but may appear here as a **packaging** unit. This stage defines the **dependency DAG (topology only)**—not Bolt order (Delivery Planning).

Sources: `domain-design/components.md`, `decisions.md`, `requirements.md`, `user-stories/stories.md` (US1.x as-built, US2.x backlog Won't Have for this intent).

---

## Q1 — Primary unit boundary strategy

How should we group as-built work into **Units of Work** for downstream delivery planning and (future) Construction?

- A. **Repo-aligned (recommended)** — three units: backend Spring Boot monolith (`service`), Angular SPA (`ui`), compose deploy scripts (`packaging`); internal component boundaries stay inside unit descriptions.
- B. **Two-app only** — backend `service` + frontend `ui`; compose referenced in delivery notes but not a named unit.
- C. **Single documentation product unit** — one unit spanning both repos (all stories map to one U1); simplest DAG for planning-only intent.
- D. **Feature-sliced SPA + monolithic backend** — one backend unit; split SPA into 2–4 `ui` units (auth/shell, track, habits, statistics) sharing `SpaSharedPresentation`.
- E. **Component-mirror** — ~14 units aligned 1:1 with `components.md` names (fine-grained; heavy DAG).
- X. Other (please specify)

[Answer]: A

---

## Q2 — Backend internal grouping (if Q1 is A, B, or D)

For the backend side, should **one** unit own all seven backend logical components, or split?

- A. **Single backend unit** — all REST domains, security, scheduler, and aggregates in one deployable/service unit (matches monolith reality).
- B. **Two backend units** — split **Core tracking** (Auth, UserClock, Habit, Track, Streak/Aggregate, Stats) vs **Catalog** (HabitIconCatalog only).
- C. **Three backend units** — Identity (Auth + UserClock), Habit domain (Habit + Icon + Track + Streak), Reporting (Statistics).
- D. **Defer** — not applicable because Q1 chose C or E (use Q1 structure only).
- X. Other (please specify)

[Answer]: A

---

## Q3 — Compose / deployment packaging unit

How should `habit-tracker-compose` (Docker Compose, deploy scripts, GHA workflow) appear in the unit set?

- A. **Dedicated packaging unit** — depends on backend + SPA units (or their contract); owns compose file and deploy automation documentation.
- B. **Attach to backend unit** — packaging is an implementation detail of the API service deploy story.
- C. **Out of unit list** — mention only in `unit-of-work.md` notes and Delivery Planning; DAG has no compose node.
- D. **Packaging + CI closure** — one unit covering compose and cross-repo release choreography (still planning-only for this intent).
- X. Other (please specify)

[Answer]: A

---

## Q4 — Unit granularity preference (overall)

Regardless of Q1, what **target count** feels right for classic delivery planning on this product?

- A. **Coarse (3–5 units)** — few Bolts, easy to read; good for planning-only and future feature intents.
- B. **Medium (6–10 units)** — balance between traceability and mob load.
- C. **Fine (11+ units)** — maximum alignment with component catalogue and CodeKB sections.
- D. **Let Q1/Q2 decide** — no separate preference; derive count from structural answers.
- X. Other (please specify)

[Answer]: B

---

## Q5 — Cross-tier dependencies in the DAG

What dependency edges should the YAML DAG encode between backend and frontend units?

- A. **Frontend depends on backend API** — SPA/ui unit(s) list backend as `depends_on`; integration = OpenAPI/REST + generated or hand client (as-built).
- B. **Contract-first split** — optional small `spec` unit (API contract / OpenAPI) that both backend and SPA depend on (only if you want an explicit contract unit).
- C. **Minimal edges** — only packaging depends on apps; backend and SPA have **no** mutual `depends_on` (document coupling in prose only).
- D. **Bidirectional documentation** — record sync REST in integration section but DAG stays acyclic per A.
- X. Other (please specify)

[Answer]: A

---

## Q6 — Parallel development opportunities

How should we treat **parallelism** among independent units in `unit-of-work-dependency.md`?

- A. **Maximize documented parallelism** — any units with no path between them are called out as parallelizable (multiple valid topological orders).
- B. **Conservative** — note parallelism only for clearly independent repos (e.g. backend vs SPA after contract baseline).
- C. **Topology only** — list edges; leave parallelism narrative to Delivery Planning (2.9).
- X. Other (please specify)

[Answer]: C

---

## Q7 — Backlog stories (US2.x) in the story map

US2.x are **Won't Have** for this intent. How should `unit-of-work-story-map.md` assign them?

- A. **Map to nearest as-built unit** — each US2.x tagged to the unit that would own a future change (with `[Backlog]` note); no extra units.
- B. **Single future unit** — one placeholder unit (e.g. `domain-alignment-backlog`) owns all US2.x for traceability.
- C. **Exclude from story map** — only US1.x + US1.12; US2.x appear only in requirements/stories with GAP/Deferred in `traceability.json`.
- D. **Separate backlog units per theme** — e.g. UX errors, domain lifecycle, streak scheduling as distinct future units.
- X. Other (please specify)

[Answer]: A

---

## Q8 — Unit `kind` tags for Construction design matrix

Each unit gets a `kind` (`service` | `spec` | `ui` | `packaging` | `library`) driving which Construction design stages apply in **future** intents. For this planning pass:

- A. **Real kinds** — backend `service`, SPA `ui`, compose `packaging`, optional API `spec` if Q5-B; honest for follow-up work.
- B. **All `spec` for this intent** — every unit is documentation-only because FR2 skips application Construction here.
- C. **Mixed with explicit planning flag** — real kinds plus a note in each unit that this intent's Construction is planning-only.
- X. Other (please specify)

[Answer]: A

---

## Q9 — Integration points to document between units

Which integration surfaces must appear in the dependency artifact (APIs, shared data, events)?

- A. **REST + JWT only** — document HTTP resources and auth header; no event bus (matches as-built).
- B. **REST + shared PostgreSQL schema** — call out DB as external dependency; units do not share code but share persistence boundary notes.
- C. **REST + OpenAPI artifact** — include openapi/spec location as integration point for client generation.
- D. **A + C** — REST/JWT plus explicit OpenAPI/client integration (recommended for this repo pair).
- X. Other (please specify)

[Answer]: A

---

## Q10 — Deployment model per unit (descriptive)

For **as-built** deployment grouping (not a build order):

- A. **Hybrid** — backend and SPA build independently; compose packages runtime together for prod (matches three-repo layout).
- B. **Monolithic product deploy** — describe as single deployable via compose only; units are logical, not separate deploy targets.
- C. **Independent deploy targets** — document each repo as separately deployable even if compose is the common path today.
- X. Other (please specify)

[Answer]: A

---

## Consolidated Summary Confirmation

- **Q1–Q3:** Three repo-aligned units — Spring Boot monolith (`service`), Angular SPA (`ui`), compose deploy (`packaging`); single backend unit owns all seven backend logical components.
- **Q4 vs structure:** You chose medium (6–10) in Q4 but repo-aligned answers in Q1–Q3; **approved plan uses 3 units** and keeps component detail inside unit descriptions.
- **Q5–Q6:** DAG: SPA depends on backend; packaging depends on both apps; document edges only (no parallelism narrative in this stage).
- **Q7:** US2.x backlog stories map to the nearest as-built unit with `[Backlog]` tags (no extra placeholder units).
- **Q8–Q10:** Real kinds (`service` / `ui` / `packaging`); integration documented as REST + JWT; hybrid deploy model (apps build separately, compose bundles prod runtime).
- **Plan gate:** Approve Plan — generate `unit-of-work.md`, `unit-of-work-dependency.md` (YAML DAG), `unit-of-work-story-map.md`, and `traceability.json` for all US1.x and US2.x story IDs.

[Answer]: Looks correct
