# Code Generation Plan — unit `habit-tracker-springboot`

Intent `260914-full-repo-scan` · **Planning-only / FR2** (delivery Q8-A, `bolt-plan.md`). This plan **does not authorize** edits under `habit-tracker-springboot/` for this intent. It records a **reference execution sequence** for follow-up Bolt **F1** (`u1-habit-tracker-springboot`) and closes the Construction code-generation stage with record-dir artifacts only.

## Sources

- `requirements.md` (FR2, FR2.1), `bolt-plan.md`, `functional-spec.md`, `rules.md`, `entities.md`
- `nfr-design/*.md`, `infrastructure-design/infrastructure-specification.md`
- `contract-summary.md` (C1, C2), `unit-of-work.md` (U1)
- CodeKB: `aidlc/spaces/default/codekb/habit-tracker-springboot/`

## Boundary (mandatory)

| Rule | Action this intent |
|------|-------------------|
| FR2 / FR2.1 | **Zero** application-source creates/updates/deletes in `habit-tracker-springboot` |
| Delivery Q8-A | Code generation = **plan + verify baseline** only |
| `source-manifest.json` | Empty change list (or explicit `[]`) at stage completion |

## Story / requirement traceability (planning)

| Id | Plan coverage |
|----|----------------|
| FR2.1 | Steps 1–3 document no-merge closure |
| US1.12 | Step 4 traceability to stories/requirements |
| WF-1–WF-9 (functional-spec) | Reference map in Step 2 — no re-implementation this intent |
| BL-INFRA-01 (infra) | Listed as **follow-up F1** item only |
| Backlog BR rows (functional-spec table) | Listed as **follow-up F1** candidates |

## Testing Contract

```json
{
  "version": 1,
  "methodology": "test-after",
  "source": "team",
  "ordering": "Implement the feature first, then add or extend automated tests using existing repo patterns; **tests must pass on every push to `main`** before merge or before building and pushing production Docker images.",
  "scope": "classic",
  "test_strategy": "standard",
  "project_type": "brownfield",
  "applicable_notes": [
    {
      "layer": "org",
      "text": "We treat tests as a first-class deliverable in every Bolt. The specific\nmethodology (TDD, BDD, ATDD, or classic test-after) is affirmed at\npractices-discovery and recorded in `team.md` under this heading with explicit\n`Methodology` and `Ordering` fields; Code Generation resolves those fields\nindependently from coverage, tooling, and scope notes.\n\nWhen no posture has been affirmed, our default per scope is:\n- **Methodology**: test-after\n- **Ordering**: implement each applicable testable layer, then write and run\n  that layer's tests.\n- `mvp`, `enterprise`, `feature`, `infra`, `classic` add an 80% line-coverage\n  floor and CI execution before merge.\n- `bugfix`, `security-patch` add a targeted regression for the specific\n  bug/vulnerability and require the existing suite to remain green.\n- `express` uses the Minimal strategy: requirement-driven unit tests (one per\n  requirement, with a happy-path floor per component); existing tests remain\n  green.\n- `poc`, `refactor`, `workshop` add no extra new-test floor and require the\n  existing suite to remain green.\n\nThe active `Test Strategy` still applies in every scope and determines test\nvolume/types. Scope floors are additive; they never reduce or replace the\nselected strategy.\n\nBuild and Test verifies defined coverage floors and affirmed quality targets;\nthey may not be weakened to make a step pass.\n\nAffirm a stricter posture in `team.md` if the team commits to one."
    },
    {
      "layer": "team",
      "text": "- **Methodology**: test-after\n- **Ordering**: Implement the feature first, then add or extend automated tests using existing repo patterns; **tests must pass on every push to `main`** before merge or before building and pushing production Docker images.\n- **Backend (habit-tracker-springboot):** JUnit 5, Spring Boot Test, MockMvc, H2 test profile; tests concentrate on user clock/timezone; no JaCoCo or enforced coverage thresholds in CI today. **`build-image` on `main`** must run **`mvn test`** or the full **`build-and-test`** workflow (not **`-DskipTests`**) before pushing the production image.\n- **Frontend (habit-tracker-angular):** **`npm run test:ci`** (ChromeHeadless with coverage flag) in reusable **`build-and-test`** and in **`build-image`** on **`main`**; co-located `*.spec.ts` files with varying depth — prefer behaviour-named specs (e.g. Settings timezone save) over scaffold-only “should create” tests for new work.\n- **Compose (habit-tracker-compose):** No automated tests; quality is operational (docs, manual deploy verification). Product test gates live in the app repos.\n- **Org classic note:** Framework org defaults mention an **80% line-coverage floor** for classic scope; this product **does not** enforce that floor in CI today — gates are **tests green on `main`**, not coverage thresholds.\n- **Backlog (quality):** Core habit track/untrack, streak/scheduler, statistics, auth edge cases, and user-scoped log access remain under-tested on the backend; error-path tests on login and track (angular) are sparse."
    }
  ],
  "obligations": {
    "strategy": "standard",
    "strategy_volume": [
      "Five to eight tests per component.",
      "Unit tests plus integration tests for key boundaries.",
      "Add E2E, performance, or security tests when requirements demand them."
    ],
    "scope_floor": [
      "Keep the existing test suite green.",
      "This scope adds no extra new-test floor beyond the selected test strategy."
    ],
    "combination_rule": "Apply every selected-strategy obligation and every scope-floor obligation; neither replaces the other, and a targeted scope regression may add the narrowest necessary test type beyond the strategy default."
  },
  "plan_profile": {
    "methodology": "test-after",
    "runner_step": "Verify the existing test runner/configuration and record the exact unit-scoped command.",
    "runner_ready_before_first_test": true,
    "testable_layers": [
      "Data model / database behavior",
      "Repository / data access",
      "Business logic",
      "API / endpoint",
      "Frontend behavior"
    ],
    "steps": [
      "Project structure and production configuration skeleton.",
      "Verify the existing test runner/configuration and record the exact unit-scoped command.",
      "Data model / database behavior - implement.",
      "Data model / database behavior - write and run its tests after implementation.",
      "Repository / data access - implement.",
      "Repository / data access - write and run its tests after implementation.",
      "Business logic - implement.",
      "Business logic - write and run its tests after implementation.",
      "API / endpoint - implement.",
      "API / endpoint - write and run its tests after implementation.",
      "Frontend behavior - implement.",
      "Frontend behavior - write and run its tests after implementation.",
      "Environment/build configuration.",
      "Documentation and traceability."
    ]
  },
  "input_sha256": "sha256:631f94c4899495940624910553b9818e09194013c578d2142c706d1c32d6c1df",
  "contract_sha256": "sha256:1c93f190e2b8ad67fa9e4537f7822083938bad824ab708f89da34a1442851afc"
}
```

## Implementation steps (this intent — record only)

- [x] **Step 1.** Publish this plan, `unit-test-instructions.md`, `code-summary.md`, and `traceability.json` under `<record>/construction/habit-tracker-springboot/code-generation/`. **No** workspace application edits.
- [x] **Step 2.** As-built map: confirm U1 packages (`controller`, `service`, `repository`, `entity`, `exception`, Flyway) match `functional-spec.md` workflows WF-1–WF-9 (read-only CodeKB / repo inspection).
- [x] **Step 3.** Baseline verification (optional but recommended before Build and Test stage): run unit-scoped test command from `unit-test-instructions.md`; record pass/fail in `code-summary.md` without fixing product code in this intent.
- [x] **Step 4.** Write `source-manifest.json` with an empty `changes` array documenting FR2 compliance.
- [x] **Step 5.** Plan approval gate → stage completion receipt (no Part 2 implementation in product repo).

## Reference steps (follow-up Bolt F1 only — not executed here)

- [ ] **F1-R1.** Data model / DB — implement backlog Flyway migrations per `entities.md` / domain law.
- [ ] **F1-R2.** Repository / data access — user-scoped queries for habit/log gaps (team testing backlog).
- [ ] **F1-R3.** Business logic — streak/scheduler/archive backlog (BR12.x, WF-10).
- [ ] **F1-R4.** API / endpoint — extend controllers per contract C1; regenerate Angular client in U2.
- [ ] **F1-R5.** Tests — test-after per layer; target BL-INFRA-01 (`mvn test` before `build-image` on `main`).
- [ ] **F1-R6.** CI — align `build-image.yml` with project NEVER on `-DskipTests`.
