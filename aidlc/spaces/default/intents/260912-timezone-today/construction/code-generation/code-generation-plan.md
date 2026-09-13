# Code Generation Plan — timezone-today

Zero-Unit `poc` (no Units DAG). Application code in sibling repos `habit-tracker-springboot` and `habit-tracker-angular`. Record artefacts stay under this directory. Do not edit `docs/domain.md`. Do not change Compose. Do not reuse `app.scheduling.timezone` as the user clock.

## Testing Contract

```json
{
  "version": 1,
  "methodology": "test-after",
  "source": "org",
  "ordering": "implement each applicable testable layer, then write and run",
  "scope": "poc",
  "test_strategy": "minimal",
  "project_type": "brownfield",
  "applicable_notes": [
    {
      "layer": "org",
      "text": "We treat tests as a first-class deliverable in every Bolt. The specific\nmethodology (TDD, BDD, ATDD, or classic test-after) is affirmed at\npractices-discovery and recorded in `team.md` under this heading with explicit\n`Methodology` and `Ordering` fields; Code Generation resolves those fields\nindependently from coverage, tooling, and scope notes.\n\nWhen no posture has been affirmed, our default per scope is:\n- **Methodology**: test-after\n- **Ordering**: implement each applicable testable layer, then write and run\n  that layer's tests.\n- `mvp`, `enterprise`, `feature`, `infra`, `classic` add an 80% line-coverage\n  floor and CI execution before merge.\n- `bugfix`, `security-patch` add a targeted regression for the specific\n  bug/vulnerability and require the existing suite to remain green.\n- `express` uses the Minimal strategy: requirement-driven unit tests (one per\n  requirement, with a happy-path floor per component); existing tests remain\n  green.\n- `poc`, `refactor`, `workshop` add no extra new-test floor and require the\n  existing suite to remain green.\n\nThe active `Test Strategy` still applies in every scope and determines test\nvolume/types. Scope floors are additive; they never reduce or replace the\nselected strategy.\n\nBuild and Test verifies defined coverage floors and affirmed quality targets;\nthey may not be weakened to make a step pass.\n\nAffirm a stricter posture in `team.md` if the team commits to one."
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
  "input_sha256": "sha256:ddd208517f68585f816e80821872bd21e26dc15e7bf545c6a78ec96b6afc20da",
  "contract_sha256": "sha256:66bcb80b129d095dbd1d20b61b8110e4b07f6ef48b0a08e0e2563def52537a40"
}
```

## Construction choices

- Clock resource: JWT `GET /api/me` returns `{ timezone, today }`; JWT `PATCH /api/me` body `{ timezone }` returns the same shape. Unknown IANA → 400 via `BadRequestException`.
- Inject a `Clock` bean (UTC instant) so FR5.2 can fix the instant; derive `today` as `LocalDate.now(clock.withZone(ZoneId.of(user.timezone)))`.
- Do not add a public signup flow. Seed `testuser` with `UTC`.
- Do not hand-edit `habit-tracker-angular/src/app/web-api/`. Update `swagger/api-docs.json` then `npm run generate-api`.
- Out of scope stays out: check-in window, streak, pause/archive, statistics 7/30, `status` → `done`, streak-job TZ.

## Implementation steps

- [x] **Step 1** — Project structure. Confirm work lands in `habit-tracker-springboot` and `habit-tracker-angular` only. No Compose, no `docs/domain.md` edits. [FR1–FR5, NFR3, NFR6]

- [x] **Step 2** — Verify runners. Confirm `mvnw.cmd test` (Spring Boot, `application-test.properties`) and `ng test --no-watch --browsers=ChromeHeadless` (Angular) run. Record the exact scoped commands in `unit-test-instructions.md`. Do not start Red/Green until those commands exist.

- [x] **Step 3** — Data model implement. Flyway `V6__add_user_timezone.sql`: add `user.timezone` VARCHAR, backfill existing rows to `UTC`, then `NOT NULL`. JPA `User.timezone` required IANA string. `DataInitializer` sets `UTC` on seed. [FR1, FR1.1, FR1.2, NFR5]

- [x] **Step 4** — Data model tests. `UserTimezonePersistenceTest`: persist without timezone fails after the column is required (FR1.5 / FR5.1); new user defaults to `UTC` (FR1.2). Run the scoped Maven command. Test profile stays Flyway-off / `create-drop`; the entity `nullable = false` plus explicit persist cases satisfy FR5.1 under that profile.

- [x] **Step 5** — Repository. Reuse `UserRepository` (`save`, `findByUsername`). No new repository. Persist timezone only on `User`; never update `habit_log.date` in this layer. [FR1.4]

- [x] **Step 6** — Repository tests. Covered by persist tests in Step 4 (same `UserRepository.save`). No extra repository class.

- [x] **Step 7** — Business logic implement. `UserClockService` (name may vary): read timezone + today; update timezone via `ZoneId.of` (reject unknown); timezone update does not load or rewrite `HabitLog` rows. [FR2, FR2.2, FR1.3, FR1.4, NFR2, NFR6]

- [x] **Step 8** — Business logic tests. `UserTodayTest`: at a fixed `Clock` instant, `America/New_York` vs `Asia/Bangkok` can differ (FR2, FR5.2). After timezone PATCH, subsequent today uses the new zone (FR2.2). `TimezoneUpdateLeavesLogDatesTest`: existing `habit_log.date` unchanged (FR1.4, FR5.3). Unknown zone rejected (FR1.3).

- [x] **Step 9** — API implement. New controller under JWT (`anyRequest().authenticated()` except existing public paths). `GET /api/me`, `PATCH /api/me`. Unauthenticated → 401 (NFR1). Map unknown zone to 400 (NFR2). Do not put timezone on `LoginResponse`. [FR2.1, FR1.4, NFR1, NFR2]

- [x] **Step 10** — API tests. `UserClockControllerTest` (`@WebMvcTest` or equivalent): GET/PATCH authenticated happy path; unauthenticated 401; unknown IANA 400. [FR2.1, NFR1, NFR2]

- [x] **Step 11** — Frontend implement. Refresh OpenAPI snapshot + `npm run generate-api`. Shared read of API today (do not use `new Date()` as domain today). Track: default date and datepicker max/today bound from API today; mark/unmark send the **selected** local date (FR3.1). Statistics: range end / today bound from API today (FR3.2). Settings route + nav (desktop and mobile) to view/change timezone including `UTC`; invalid save surfaces API error (FR4, FR4.1, FR4.2). After timezone save, do not refetch today in-session (FR3.3). Weekday labels may stay locale-based (FR3.4). Add `data-testid` on Settings save control, timezone field, Track datepicker, and check-in actions.

- [x] **Step 12** — Frontend tests. Extend or add specs: Track default/max vs selected payload (FR3, FR3.1); Statistics today bound (FR3.2); Settings view/change and error path (FR4, FR4.2). Happy-path unit floor per new/changed component. Run scoped `ng test` includes listed in `unit-test-instructions.md`.

- [x] **Step 13** — Environment/build. Keep JPA `validate` in production profile. Do not enable Flyway on the test profile unless required to keep FR5.1. No new secrets. CORS unchanged.

- [x] **Step 14** — Documentation and traceability. `code-summary.md`, `source-manifest.json` (every created/modified/deleted app path in both repos), `traceability.json` mapping FR1–FR5 and NFR1–NFR6 to implementation or test files. Existing suites remain green (NFR4): run scoped commands plus the existing `HabittrackerApplicationTests` and the existing Track spec.

## Out of this plan

Check-in today/yesterday window, idempotency, `startDate`, streak, pause/archive, statistics 7/30, `HabitTrackResponse.status` → `done`, streak-job timezone, Elastic Beanstalk, Compose.
