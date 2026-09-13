# Build and Test summary — timezone-today

Zero-Unit `poc`. Minimal test strategy. Application builds live in the sibling repos. nfr-requirements and nfr-design were skipped; inventory is FR/NFR from requirements plus the Code Generation Testing Contract.

## Build status

- **habit-tracker-springboot**: `mvnw.cmd -f pom.xml test` → BUILD SUCCESS, 11 tests, 0 failures (2026-09-13T15:18:18+07:00). `mvnw.cmd -f pom.xml package -DskipTests` → BUILD SUCCESS; jar `target/habit-tracker-springboot-0.0.1-SNAPSHOT.jar`.
- **habit-tracker-angular**: `npx ng build` → exit 0, output `dist/` (2026-09-13). `npx ng test --no-watch --no-progress --browsers=ChromeHeadless` → 29 SUCCESS.

Prerequisites: JDK 17 + Maven Wrapper; Node + ChromeHeadless. No Compose or PostgreSQL for these checks (H2 test profile).

## Test type inventory

Generated in this stage:

- Build instructions (executed)
- Unit tests: commands from Code Generation `unit-test-instructions.md` (executed; covered by the full-suite runs)
- Integration / performance / security instruction files: written because this stage must produce them; Minimal strategy added **no extra campaigns**. Security checks already in `UserClockControllerTest` (JWT 401, IANA 400)

Not generated as extra suites: load tests, SAST/DAST, E2E, accessibility.

Coverage floor: none (`poc`). NFR4 is “existing suites stay green.”

## Target Verification Matrix

| Target ID | Source | Expected | Actual | Evidence | Owning Stage | Verdict |
|-----------|--------|----------|--------|----------|--------------|---------|
| T-BUILD-BACKEND | `construction/build-and-test/build-instructions.md` | Maven package succeeds | BUILD SUCCESS, jar present | `mvnw.cmd -f pom.xml test` then `package -DskipTests`; `target/habit-tracker-springboot-0.0.1-SNAPSHOT.jar` | build-and-test | Met |
| T-BUILD-ANGULAR | `construction/build-and-test/build-instructions.md` | `ng build` exit 0 | Application bundle generation complete | `npx ng build` → `dist/` | build-and-test | Met |
| T-SUITE-BACKEND | requirements NFR4; Testing Contract scope floor; CG R-03 | Existing Spring Boot suite green | Tests run: 11, Failures: 0, Errors: 0, Skipped: 0 | `mvnw.cmd -f pom.xml test` Results block | build-and-test | Met |
| T-SUITE-ANGULAR | requirements NFR4; Testing Contract scope floor; CG R-03 | Existing Angular suite green | TOTAL: 29 SUCCESS | `npx ng test --no-watch --no-progress --browsers=ChromeHeadless` | build-and-test | Met |
| T-FR5 | requirements FR5.1–FR5.3; `unit-test-instructions.md` | Persist-without-timezone fails; NY vs Bangkok today differs; log dates unchanged | Those classes passed inside the 11-test run | `UserTimezonePersistenceTest` (2), `UserTodayTest` (3), `TimezoneUpdateLeavesLogDatesTest` (1) | build-and-test | Met |
| T-NFR1 | requirements NFR1 | Unauthenticated `/api/me` rejected | 401 covered | `UserClockControllerTest` (4 tests, 0 fail) | build-and-test | Met |
| T-NFR2 | requirements NFR2 | Unknown IANA → HTTP 400 via `BadRequestException` | Covered | `UserClockControllerTest` | build-and-test | Met |
| T-NFR3 | requirements NFR3 | `docs/domain.md` unchanged | `git diff -- docs/domain.md` empty; short status clean | git in `habit-tracker-springboot` | build-and-test | Met |
| T-NFR5 | requirements NFR5 | FR5.1 holds with Flyway off / `create-drop` | NOT NULL timezone insert fails (SQL 23502) and test still green | `UserTimezonePersistenceTest` log + pass | build-and-test | Met |
| T-NFR6 | requirements NFR6 | Do not use `app.scheduling.timezone` as the user clock | `UserClockServiceImpl` uses injected `Clock` + `ZoneId.of(user.timezone)`; property remains only on streak scheduler | source grep | build-and-test | Met |
| T-PERF | no NFR performance design (stage skipped) | No measurable performance target in this package | No extra campaign | `performance-test-instructions.md` | n/a | N/A |

No `Pending` rows. No later `performance-validation` stage on this workflow.

## Readiness

- **Build-ready**: yes (both repos)
- **Test-ready**: yes (full suites green)
- **Deployment-ready**: not claimed. CI/pipeline and Operation stages are skipped. No Compose change.

## Known limitations

- Code Generation advisory **R-01**: Statistics `ht-datepicker` reads `maxDate` only in `ngAfterViewInit`. If Statistics mounts before `UserClockStore` has today, picker max can stay unbound. Track is gated by `*ngIf` after clock load. Accepted at Code Generation; not retested as a new suite here.
- Code Generation **R-02**: `traceability.json` targets record markdown, not sibling app files. Cross-unit coverage still maps FR/NFR to those record files (see `cross-unit-traceability.md`). NFR3/NFR6 were `N/A` in Code Generation JSON; this stage verified them directly.
- Angular `ng build` warns on CommonJS `air-datepicker/locale/en` and two `.form-floating` selector skips. Pre-existing; build still succeeded.
- Karma logged `Unable to convert value "undefined" to Date object` during the full Angular run; all 29 tests still passed.
