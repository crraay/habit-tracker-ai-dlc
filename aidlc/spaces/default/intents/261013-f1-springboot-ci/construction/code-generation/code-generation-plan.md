# Code Generation Plan — F1 springboot build-image CI tests

**Repository:** `habit-tracker-springboot` (application code at workspace sibling path)  
**Requirements:** `inception/requirements-analysis/requirements.md` (FR1–FR4, NFR1–NFR6)  
**Scope:** Express / zero-unit; CI and deploy-trigger changes only — no domain or API code.

## Traceability

| Plan step | Requirement |
|-----------|-------------|
| 1–2 | FR1, FR1.1, FR1.2, FR1.3, NFR3, NFR6 |
| 3 | FR2, NFR6 |
| 4 | FR3, FR3.1, NFR1 |
| 5–7 | FR4, NFR2, NFR4, NFR5 |
| 8 | Documentation and traceability |

## Testing Contract

```json
{
  "version": 1,
  "methodology": "test-after",
  "source": "team",
  "ordering": "Implement the feature first, then add or extend automated tests using existing repo patterns; **tests must pass on every push to `main`** before merge or before building and pushing production Docker images.",
  "scope": "express",
  "test_strategy": "minimal",
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
    "strategy": "minimal",
    "strategy_volume": [
      "One verifiable test per requirement at the narrowest effective level.",
      "At least one happy-path unit test per component.",
      "Unit tests are the default; a bugfix/security scope floor may require an integration or E2E regression when that is the narrowest level that reproduces the defect."
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
  "input_sha256": "sha256:1c9838e93a1dd0881001be413308ae2022799a85e33b0175b675baef571f18bd",
  "contract_sha256": "sha256:3bd79454e3611de904e57f99f635fbff1783a2b8568e093b053fee7daa95b8ac"
}
```

## Implementation steps

- [x] **Step 1 — Verify test runner (test-after baseline)**  
  Confirm `./mvnw.cmd -f pom.xml test` (Windows) / `./mvnw test` passes on current `main` before CI edits. Record command in `unit-test-instructions.md`.

- [x] **Step 2 — FR1: `build-image.yml` test gate**  
  In `.github/workflows/build-image.yml`, replace single `mvn -B -DskipTests package` with ordered steps: **`mvn -B test`**, then **`mvn -B package -DskipTests`** (mirror `build-and-test.yml` test-then-package). Ensure **Docker login / build / push** steps run only after Maven success (same job, sequential steps — satisfies FR1.1 fail-before-docker).

- [x] **Step 3 — FR2: `Dockerfile` alignment**  
  Remove production bypass of tests in the image build stage: e.g. change `RUN mvn -B -DskipTests package` to **`RUN mvn -B test package`** so local/image builds cannot skip Surefire when CI is not the only path. Keeps multi-stage layout unchanged.

- [x] **Step 4 — FR3: Legacy EB trigger**  
  In `.github/workflows/deploy-to-elastic-beanstalk.yml`, remove **`push: branches: [main]`** trigger; retain **`workflow_dispatch`** (and any non-`main` triggers if present) so `main` no longer starts EB deploy. Do not extend EB deploy logic (NFR1, FR3.1).

- [x] **Step 5 — Post-change verification (FR4)**  
  Run full `./mvnw test` locally after edits. Optionally dry-run workflow structure review (YAML step order). No new product tests required (FR1.3 / requirements out of scope); **verification = existing suite green + workflow ordering**.

- [x] **Step 6 — Optional minimal regression (express / FR1)**  
  Only if a narrow automated check adds value without mocking GitHub: skip new Java tests per FR1.3; rely on Build and Test stage for `mvn test`. If Build and Test requires a targeted check, add at most one workflow-focused test or documented manual check in `code-summary.md`.

- [x] **Step 7 — Stage artifacts**  
  Write `code-summary.md`, `traceability.json`, `source-manifest.json` (after code changes), per stage protocol.

- [x] **Step 8 — Documentation**  
  One-line note in `AGENTS.md` or commit message only if needed to reflect `build-image` test gate (avoid scope creep).

**Out of plan:** Java domain layers, Flyway, Angular, compose, JaCoCo, new habit tests, EB deploy implementation changes.
