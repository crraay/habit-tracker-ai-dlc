# Test results — timezone-today

Executed 2026-09-13 in sibling repos. Minimal strategy: no extra integration/perf/security campaigns beyond existing unit/API tests.

## Build

### habit-tracker-springboot

Command: `mvnw.cmd -f pom.xml test`

- Result: **success**
- Tests run: **11**, Failures: **0**, Errors: **0**, Skipped: **0**
- Classes: `HabittrackerApplicationTests` (1), `TimezoneUpdateLeavesLogDatesTest` (1), `UserClockControllerTest` (4), `UserTimezonePersistenceTest` (2), `UserTodayTest` (3)
- Finished: 2026-09-13T15:18:18+07:00, total time ~56 s

Command: `mvnw.cmd -f pom.xml package -DskipTests`

- Result: **success**
- Artifact: `target/habit-tracker-springboot-0.0.1-SNAPSHOT.jar`

### habit-tracker-angular

Command: `npx ng build`

- Result: **success**
- Output: `C:\Projects\habit-tracker\habit-tracker-angular\dist`
- Warnings: CommonJS `air-datepicker/locale/en`; two `.form-floating>~label` selector skips

## Unit tests

Code Generation scoped commands are subsets of the full-suite commands. Full-suite runs were executed once in this stage (R-03 / NFR4). Distinct scoped commands were also re-run:

- Backend scoped `-Dtest=` list (same five classes as the full 11-test suite): **11/11 pass**
- Frontend scoped `--include` Track + Statistics + Settings: **10 SUCCESS**

### Full backend suite

`mvnw.cmd -f pom.xml test` — 11/11 pass (same run as Build above).

### Full frontend suite

`npx ng test --no-watch --no-progress --browsers=ChromeHeadless`

- TOTAL: **29 SUCCESS**
- Browser: Chrome Headless 152.0.0.0 (Windows 10)
- Time: ~0.774 s after connect
- Log noise: `Unable to convert value "undefined" to Date object` (did not fail tests)

## Other checks

- Security instruction command is covered by `UserClockControllerTest` inside the 11-test Maven run (unauthenticated 401; unknown IANA 400).
- Integration: no extra runner (Minimal). Cross-layer coverage is the existing `@SpringBootTest` / `@WebMvcTest` classes.
- Performance: no campaign (no NFR; no later owning stage).
- NFR3: `git diff -- docs/domain.md` empty in `habit-tracker-springboot`.
- NFR6: `UserClockServiceImpl` does not reference `app.scheduling.timezone`; that property remains on `StreakResetScheduler` / `SchedulingConfig` only.

## Coverage

No percentage floor for `poc`. No coverage report collected (`test:ci` not required).

## Failures

None.

## Target Verification Matrix

See `build-and-test-summary.md` `## Target Verification Matrix`. All applicable rows **Met**. One explanatory **N/A** row for performance.

## Loop-Back Log

None. No command failure and no `Not Met` / `Unverified` applicable target.
