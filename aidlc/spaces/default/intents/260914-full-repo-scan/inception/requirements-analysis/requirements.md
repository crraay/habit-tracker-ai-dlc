# Requirements — full-repo-scan (intent `260914-full-repo-scan`)

## Sources

- Initial description: `project-description.json` — make full scan of `habit-tracker-springboot` and `habit-tracker-angular` repos [desc]
- Workflow-selected scope: classic (Inception through Operation planned; ideation skipped) [scope]
- Brownfield CodeKB: `codekb/habit-tracker-springboot/` — `business-overview.md`, `architecture.md`, `code-structure.md` [memory]
- Brownfield CodeKB: `codekb/habit-tracker-angular/` — `business-overview.md`, `architecture.md`, `code-structure.md` [memory]
- Brownfield CodeKB: `codekb/habit-tracker-compose/` — `business-overview.md`, `architecture.md`, `code-structure.md` (deployment closure for the scan) [memory]
- Affirmed practices: `inception/practices-discovery/team-practices.md` [memory]
- Requirements Q&A: `requirements-analysis-questions.md` (Q1–Q8, confirmed)

## Intent analysis

The team asked for a **full repository scan** of the Habit Tracker backend and SPA so AI-assisted work has an accurate map of product behavior, architecture, and team practice. Reverse engineering and practices discovery for this intent are **complete**; compose was included as the production runtime closure.

The **primary outcome** of this intent is that baseline: durable CodeKB and affirmed rules—not shipping new product behavior from this workflow. Downstream inception stages may still run at classic depth to produce **planning artifacts** (user stories, domain view, units, delivery plan) that describe the brownfield system and optional future work, but **Construction must not merge changes** into `habit-tracker-springboot` or `habit-tracker-angular` unless the team starts a **follow-up intent**.

**Domain alignment** (`habit-tracker-springboot/docs/domain.md` vs as-built code) is **explicitly out of scope** for this intent: gaps are recorded for awareness, not as mandatory fix targets here.

**Success criteria** for the overall intent will be **confirmed with the stakeholder after reviewing this requirements package** (Q6); this document proposes a default definition the stakeholder may accept, narrow, or replace at the approval gate.

## Functional requirements

### Scan baseline (delivered)

**FR1** The intent maintains a current CodeKB for the scanned application repositories sufficient for downstream inception without re-running reverse engineering.

Pass: `codekb/habit-tracker-springboot/` and `codekb/habit-tracker-angular/` contain business, architecture, and structure artifacts referenced in Sources; compose closure is documented under `codekb/habit-tracker-compose/`.

**FR1.1** CodeKB describes the **as-built** API and UI journeys (auth, track, habits CRUD, statistics, timezone/`/api/me`) and notes documented gaps (e.g. partial domain-doc coverage, sparse client error handling) without requiring closure in this intent.

### Planning-only construction boundary

**FR2** This intent **does not authorize** application code changes in sibling product repositories.

Pass: no commits merged to `habit-tracker-springboot` or `habit-tracker-angular` `main` (or release branches) as a deliverable of this intent's Construction phase.

**FR2.1** Requirements and delivery planning must state that **code-generation, build-and-test, CI, and Operation deploy stages** for this intent are **skipped, no-op, or re-scoped** so the workflow can complete without application-repo merges.

**FR2.2** Spring Boot and Angular remain the **documented product surface** for *future* intents; inception may reference them for units and contracts, but bolts must not assume shippable code from **this** intent.

### Inception artifacts (in scope)

**FR3** Classic inception stages after requirements analysis produce planning deliverables grounded in CodeKB and `team-practices.md`, not greenfield invention.

**FR3.1** User stories (if executed) describe the **existing** product and optional future enhancements as backlog items, clearly separated from mandatory work for this intent.

**FR3.2** Domain design and units generation document **as-built** boundaries and known gap lists; they must not re-open domain-doc alignment as in-scope construction for this intent (per FR4).

**FR3.3** Delivery planning records the **planning-only** Construction stance and recommends skipping or parking code stages unless a follow-up intent is opened.

### Documented gaps (awareness, not commitment)

**FR4** Known brownfield gaps from CodeKB—habit lifecycle fields, user-relative check-in windows, streak scheduling, statistics semantics vs `docs/domain.md`, under-tested auth/track/streak paths, login/track error UX—are **catalogued** in downstream artifacts as **backlog / future intent** items, not as FRs that this intent must implement.

Pass: no requirement ID in this document mandates closing a domain-doc gap; references to `docs/domain.md` are contextual only.

### Stakeholder success criteria

**FR5** Before this stage closes, the stakeholder reviews this requirements package and **affirms or revises** success criteria for the intent.

**FR5.1** Default proposed success criteria (subject to stakeholder revision at gate):

- CodeKB and practices artifacts remain accurate enough for agents to work without re-scanning.
- Inception planning artifacts (through delivery planning) exist and explicitly record the planning-only Construction boundary.
- No application-repo merges are attributed to this intent.

**FR5.2** The stakeholder may replace FR5.1 with stricter or lighter criteria at the requirements approval gate; revisions are recorded in `aidlc-state.md` or a gate note, not by silently editing FR IDs.

### Quality posture (conditional / future work)

**FR6** If a **future** intent implements code in these repos, changed behavior must follow affirmed **regression safety**: add or extend automated tests for behavior touched; no new JaCoCo or coverage gates unless team policy changes.

Pass: this FR applies only to follow-up intents; it does not trigger Construction in this intent.

## Non-functional requirements

**NFR1** Requirements and downstream inception prose remain **traceable** to Sources listed above; new product FRs must not appear without a `[desc]`, `[scope]`, `[memory]`, or `[Q<n>]` lineage.

**NFR2** **Compose / production deploy** changes are **out of scope** for this intent; operational documentation in CodeKB is sufficient.

**NFR3** Affirmed **team and project mandates** apply to any future code work (Flyway, no hand-edited `web-api/`, user-scoped data access, tests green on `main`, compose deploy path, etc.) but do not force implementation in this intent.

**NFR4** **Change control** for this intent is **relaxed** per scope classic; changes to inputs after approval are recorded and announced, not automatically blocked.

**NFR5** Artifacts use the workflow **conversation language** (English) for human-readable prose; preserved protocol tokens stay as defined in org rules.

## Constraints

- **Repos:** Document `habit-tracker-springboot` and `habit-tracker-angular` as the product codebase; **habit-tracker-compose** is orchestration-only; **habit-tracker-ai-dlc** holds workflow and CodeKB.
- **Ideation skipped:** No intent-statement or scope-document from ideation; initial description and scan outputs anchor scope.
- **Trunk-based multi-repo:** Future work follows affirmed short-lived branches and `main` integration; not a requirement to change repos in this intent.
- **Depth:** Classic inception depth for planning; Construction code stages are constrained by FR2.

## Assumptions

- Reverse-engineering outputs for the three CodeKB trees are current as of the scan completion date in `reverse-engineering-timestamp.md` files.
- The stakeholder opens a **new intent** with an explicit scope when ready to ship domain alignment, quality hardening, or features.
- Classic scope grid still lists Construction stages; **delivery planning** will reconcile the grid with FR2 rather than implying mandatory code generation for this intent.

## Out of scope

- Closing gaps between `docs/domain.md` and implementation (Q2: not applicable for this workflow).
- Merging application code or publishing Docker images as deliverables of **this** intent (FR2).
- Compose workflow changes, new environments, or release-process redesign (Q5).
- Must-have feature list beyond scan findings (Q7: none).
- User registration API, refresh tokens, pause/archive habits, and other enhancements except as **optional backlog** text in later inception artifacts.

## Open questions

**OQ1 — Success criteria confirmation:** Stakeholder to accept, revise, or replace FR5.1 at the requirements-analysis approval gate.

**OQ2 — Construction grid reconciliation:** Exact mechanism to skip or no-op code-generation and downstream Construction/Operation stages for this intent (recompose at delivery planning vs explicit skip list)—to be decided in delivery planning without contradicting FR2.

## Assumptions & Open Questions

See **Assumptions** and **Open questions** above.
