# Unit test instructions — timezone-today

Zero-Unit `poc`. Minimal strategy + poc floor: requirement-driven tests, happy-path unit floor per new component, existing suite stays green, no extra coverage floor beyond FR5 (FR5 is in-scope product law, not an extra floor). Methodology: test-after.

## Runners (verify before the first new test)

### Backend — habit-tracker-springboot

Working directory: `c:\Projects\habit-tracker\habit-tracker-springboot`

Existing runner: Maven Surefire, JUnit 5, profile `test` (`src/test/resources/application-test.properties`). H2, `ddl-auto=create-drop`, Flyway **disabled**. JWT and CORS test values are already in that file.

Smoke (existing):

```text
mvnw.cmd -f pom.xml -Dtest=com.kostya.habittracker.HabittrackerApplicationTests test
```

This package (scoped; do not use a bare `test` goal without `-Dtest=` for this stage’s loop):

```text
mvnw.cmd -f pom.xml -Dtest=com.kostya.habittracker.UserTimezonePersistenceTest,com.kostya.habittracker.UserTodayTest,com.kostya.habittracker.TimezoneUpdateLeavesLogDatesTest,com.kostya.habittracker.UserClockControllerTest test
```

On Unix CI the same `-Dtest=` list with `./mvnw`.

### Frontend — habit-tracker-angular

Working directory: `c:\Projects\habit-tracker\habit-tracker-angular`

Existing runner: Karma + Jasmine (`ng test`). CI script `test:ci` is project-wide — **do not** use it as this stage’s loop command.

This package (scoped `--include`):

```text
npx ng test --no-watch --no-progress --browsers=ChromeHeadless --include=src/app/components/track-habits/track-habits.component.spec.ts --include=src/app/components/statistics/statistics.component.spec.ts --include=src/app/components/settings/settings.component.spec.ts
```

If Settings lives under a slightly different path, keep `--include` pointed at the actual spec files; never drop `--include` for a repo-wide `ng test`.

## Coverage targets

- No percentage floor (`poc`).
- Product-mandated: FR5.1, FR5.2, FR5.3 must have failing-if-wrong tests.
- Strategy: one verifiable assertion per FR/NFR at the narrowest level (see map below).
- NFR4: existing `HabittrackerApplicationTests` and existing Track spec still pass.

## Requirement → test map

| ID | Narrowest test |
|----|----------------|
| FR1 / FR1.1 / FR1.2 / FR1.5 / FR5.1 | `UserTimezonePersistenceTest` |
| FR1.3 / NFR2 | `UserClockControllerTest` unknown IANA → 400; service-level reject |
| FR1.4 / FR5.3 | `TimezoneUpdateLeavesLogDatesTest` |
| FR2 / FR2.2 / FR5.2 | `UserTodayTest` fixed `Clock` |
| FR2.1 / NFR1 | `UserClockControllerTest` GET/PATCH + 401 |
| NFR5 | Persist tests under `create-drop` (Flyway off) still enforce NOT NULL timezone |
| NFR3 / NFR6 | No test file; verify by absence of `docs/domain.md` and scheduler edits |
| FR3 / FR3.1 | `track-habits.component.spec.ts` — default/max from API today; mark/unmark uses selected date |
| FR3.2 | `statistics.component.spec.ts` |
| FR3.3 / FR3.4 | Asserted in Settings/Track comments or a focused spec; no in-session refetch required |
| FR4 / FR4.1 / FR4.2 | `settings.component.spec.ts` — shows UTC, save, error surface |
| NFR4 | Existing tests listed above remain green |

## Mocking

- Backend: inject a fixed `Clock`; do not call the real system clock in FR5.2.
- Frontend: spy the generated clock/me client (after OpenAPI regen). Do not hit a live API in unit tests.
- Do not mock away timezone validation on the backend service under test.

## Test data

- Users: `UTC` default; explicit `America/New_York` and `Asia/Bangkok` for FR5.2.
- Habit log rows: a known `LocalDate` that must survive timezone PATCH.
- Instant for FR5.2: pick a documented UTC instant that falls on different calendar dates in those two zones (record the instant in the test).

## Configuration

- Do not weaken `application-test.properties` JWT/CORS to make tests pass.
- Do not enable coverage thresholds that the scope does not require.
- Do not switch the test profile to Flyway unless FR5.1 cannot be expressed on `create-drop`; prefer entity constraints first.
