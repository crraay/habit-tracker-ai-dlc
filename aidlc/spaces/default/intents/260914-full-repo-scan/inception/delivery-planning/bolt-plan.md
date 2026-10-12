# Bolt Plan — intent `260914-full-repo-scan`

Brownfield **planning-only** intent (FR2). A **Bolt** is one planned build pass that ends in something runnable—or, for **Bolt P1**, in an approved Inception closure with no application-repo merges.

**Way of working:** Short-lived branches squash-merged to each app repo’s **`main`**; Construction worktrees base on **`main`** (`org.md`, `team.md`).

**Walking skeleton:** Team affirms **no separate skeleton ceremony**—the product already runs end-to-end; reference Bolts **F1–F3** follow the unit DAG instead of a cross-unit thin slice (`team.md`).

**Execution stance this intent:** **Serial Bolts only** (Q5-A). **Bolt P1** runs now; **F1 → F2 → F3** are **reference templates** for follow-up intents—not scheduled Construction for `260914-full-repo-scan` (Q8-A).

Sources: `delivery-planning-questions.md`, `unit-of-work.md`, `unit-of-work-dependency.md`, `contract-summary.md`, `requirements.md`.

---

## Ordered Bolt sequence

| Order | Bolt ID | Executes in this intent? | Units | Walking skeleton |
|------:|---------|--------------------------|-------|------------------|
| 1 | **P1** | **Yes** | — (AI-DLC record only) | No |
| 2 | **F1** | No (reference) | U1 `u1-habit-tracker-springboot` | No |
| 3 | **F2** | No (reference) | U2 `u2-habit-tracker-angular` | No |
| 4 | **F3** | No (reference) | U3 `u3-habit-tracker-compose` | No |

---

## Bolt P1 — Planning closure

**Purpose:** Close Inception for the full-repo scan; satisfy FR2.1 and FR3.3; enter Construction/Operation without shipping product code from this intent.

**Units of Work bundled:** None (workspace artifacts under `aidlc/spaces/default/intents/260914-full-repo-scan/`).

**Definition of Done**

- Delivery Planning gate artifacts approved (`bolt-plan.md`, `team-allocation.md`, `risk-and-sequencing-rationale.md`, `external-dependency-map.md`).
- `verification/phase-check-inception.md` **PASS**.
- Plan explicitly states: **no merges** to `habit-tracker-springboot` or `habit-tracker-angular` as deliverables of intent `260914-full-repo-scan`.
- Construction stages for application repos are **skip/no-op**; Operation may produce planning/runbook documentation only.

**Confidence hypothesis:** A follow-up feature intent can start from CodeKB, units, contracts, and F1→F2→F3 order without repeating reverse engineering.

**Expected demo / review:** Walkthrough of bolt plan, contract summary pointers, and phase-check verdict—not a product feature demo.

**Construction iteration (this intent):** Default **stage-major**; no `unit-major` opt-in required because no per-unit code Bolts execute here.

---

## Bolt F1 — Backend service (reference)

**Purpose:** Template for the first application Bolt when a **new** intent changes `habit-tracker-springboot`.

**Units of Work bundled:** **U1** only (`service`).

**Definition of Done**

- Feature/fix merged to **`main`** via short-lived branch (squash per org policy).
- **`mvn test`** or full **`build-and-test`** green on **`main`** before production **`build-image`** (no `-DskipTests` on release builds).
- If REST semantics change: export/sync OpenAPI source; coordinate U2 snapshot in the same release train (C1 ownership).

**Confidence hypothesis:** C1 provider semantics stay authoritative; no silent drift for SPA or compose consumers.

**Expected demo:** Runnable API (local or container) exercising changed endpoints; Swagger/Springdoc available in dev.

**Blocks / depends on:** None among units (U1 root of DAG).

---

## Bolt F2 — Angular SPA (reference)

**Purpose:** Template for SPA work after U1 contract baseline exists.

**Units of Work bundled:** **U2** only (`ui`).

**Definition of Done**

- Merged to **`main`** with **`npm run test:ci`** green before **`build-image`** on **`main`**.
- C1 consumer rules: update `habit-tracker-angular/swagger/api-docs.json` when API changes; run **`npm run generate-api`**; never hand-edit `src/app/web-api/`.
- JWT/401 behaviour unchanged unless explicitly in scope (interceptors + login flow).

**Confidence hypothesis:** Browser client matches pinned OpenAPI snapshot and Bearer JWT contract (C1).

**Expected demo:** `ng serve` or built SPA against backend (dev proxy or compose).

**Blocks / depends on:** **U1** (DAG edge U2 → U1; contract-summary C1).

---

## Bolt F3 — Compose packaging (reference)

**Purpose:** Template for production closure when images or deploy wiring change.

**Units of Work bundled:** **U3** only (`packaging`).

**Definition of Done**

- Compose repo changes merged; **no domain/API/UI code** in compose (team **Forbidden** rules).
- Deploy procedure documented; **`workflow_dispatch`** deploy succeeds or dry-run documented for planning intents.
- Pulled images match intended **`docker.io/crraay/habit-tracker-{springboot,angular}:latest`** (or recorded digest/tag for rollback).

**Confidence hypothesis:** Single-host Compose stack (Postgres + backend + nginx frontend) starts with **`/api`** proxy intact (C2/C3).

**Expected demo:** Local override stack and/or documented production smoke (health, login path).

**Blocks / depends on:** **U1** and **U2** image artifacts (DAG edges U3 → U1, U3 → U2).

---

## Construction phase mapping (intent `260914-full-repo-scan`)

Per Q8-A:

| Construction stage | Application repos | This intent |
|--------------------|-------------------|-------------|
| functional-design | springboot, angular | Skip / no-op |
| nfr-requirements | springboot, angular | Skip / no-op |
| nfr-design | springboot, angular | Skip / no-op |
| infrastructure-design | springboot, angular, compose | Documentation-only if Operation requires |
| code-generation | springboot, angular | **Skipped — no merges** |
| build-and-test | app repos | Skip / no-op |
| CI pipeline stages | as configured | No change driven by this intent |

Follow-up intents inherit **F1 → F2 → F3** when work touches all tiers; single-repo intents may run only the matching reference Bolt.


---

## FR traceability (planning closure)

| Requirement | How this plan satisfies it |
|-------------|----------------------------|
| **FR2.1** | Construction code stages no-op; no application-repo merges from this intent. |
| **FR3.3** | This document records planning-only Construction stance and reference Bolt sequence. |
