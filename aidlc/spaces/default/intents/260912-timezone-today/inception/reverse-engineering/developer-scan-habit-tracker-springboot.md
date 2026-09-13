## Developer Code Scan Results

Single Maven JAR (`com.kostya:habit-tracker-springboot`), Java 17, Spring Boot 3.5.5. Layered package `com.kostya.habittracker` (controller / service / entity / repository / dto / config / filter / security / scheduled). Brownfield PoC backend. Canonical law: `docs/domain.md` (User and “today”, Glossary `timezone` / `today`). Issue-14 package is **user IANA timezone + server today**; streak-job TZ is ops, not this package.

### Scan Coverage
- **Analyzed deeply**:
  - `docs/domain.md`
  - `.local/issue-bodies/01-timezone-today.md`
  - `pom.xml`
  - `src/main/resources/application.properties`
  - `src/test/resources/application-test.properties`
  - `src/main/resources/db/migration/V1__init_schema.sql`
  - `src/main/resources/db/migration/V2__add_audit_fields.sql`
  - `src/main/resources/db/migration/V3__create_habit_aggregate_and_remove_streak.sql`
  - `src/main/resources/db/migration/V4__extend_user_auth.sql`
  - `src/main/resources/db/migration/V5__add_habit_icon_support.sql`
  - `src/main/java/com/kostya/habittracker/entity/User.java`
  - `src/main/java/com/kostya/habittracker/entity/Habit.java`
  - `src/main/java/com/kostya/habittracker/entity/HabitLog.java`
  - `src/main/java/com/kostya/habittracker/entity/HabitAggregate.java`
  - `src/main/java/com/kostya/habittracker/entity/BasicAudit.java`
  - `src/main/java/com/kostya/habittracker/controller/AuthController.java`
  - `src/main/java/com/kostya/habittracker/controller/HabitController.java`
  - `src/main/java/com/kostya/habittracker/controller/HabitTrackController.java`
  - `src/main/java/com/kostya/habittracker/controller/HabitStatisticsController.java`
  - `src/main/java/com/kostya/habittracker/controller/HabitIconController.java`
  - `src/main/java/com/kostya/habittracker/service/impl/AuthServiceImpl.java`
  - `src/main/java/com/kostya/habittracker/service/impl/HabitTrackServiceImpl.java`
  - `src/main/java/com/kostya/habittracker/service/impl/HabitServiceImpl.java`
  - `src/main/java/com/kostya/habittracker/service/impl/HabitStatisticsServiceImpl.java`
  - `src/main/java/com/kostya/habittracker/service/impl/HabitAggregateServiceImpl.java`
  - `src/main/java/com/kostya/habittracker/service/impl/UserDetailsServiceImpl.java`
  - `src/main/java/com/kostya/habittracker/repository/UserRepository.java`
  - `src/main/java/com/kostya/habittracker/repository/HabitLogRepository.java`
  - `src/main/java/com/kostya/habittracker/repository/HabitAggregateRepository.java`
  - `src/main/java/com/kostya/habittracker/config/WebSecurityConfig.java`
  - `src/main/java/com/kostya/habittracker/config/DataInitializer.java`
  - `src/main/java/com/kostya/habittracker/config/SchedulingConfig.java`
  - `src/main/java/com/kostya/habittracker/scheduled/StreakResetScheduler.java`
  - `src/main/java/com/kostya/habittracker/filter/JwtRequestFilter.java`
  - `src/main/java/com/kostya/habittracker/model/UserDetails.java`
  - `src/main/java/com/kostya/habittracker/dto/HabitTrackRequest.java`
  - `src/main/java/com/kostya/habittracker/dto/HabitTrackResponse.java`
  - `src/main/java/com/kostya/habittracker/dto/LoginResponse.java`
  - `src/main/java/com/kostya/habittracker/dto/HabitDTO.java`
  - `src/main/java/com/kostya/habittracker/exception/GlobalExceptionHandler.java`
  - `src/test/java/com/kostya/habittracker/HabittrackerApplicationTests.java`
  - `.github/workflows/build-and-test.yml`
- **Skimmed only**:
  - `src/main/java/com/kostya/habittracker/mapper/`
  - `src/main/java/com/kostya/habittracker/aspect/`
  - `src/main/java/com/kostya/habittracker/annotation/`
  - `src/main/java/com/kostya/habittracker/security/`
  - `src/main/java/com/kostya/habittracker/util/`
  - remaining DTO / enum / exception / icon / JPA / OpenAPI / password-encoder files
  - `src/main/resources/application-dev.properties`
  - `src/main/resources/logback-spring.xml`
  - `README.md`, `DOCKER.md`, `AGENTS.md`, `HELP.md`
  - `.github/workflows/build-image.yml`, `.github/workflows/deploy-to-elastic-beanstalk.yml` (legacy)
  - `.local/issue-bodies/` packages 2–6 and epic (context only)
  - `.mvn/`, Dockerfile / compose pointers if present

### Packages Found
- `com.kostya:habit-tracker-springboot` — application (single Maven module) — Java 17 — REST API + JPA + JWT for Habit Tracker

### Build System
- **Type**: Maven (wrapper implied by `.mvn/wrapper/`; CI invokes `mvn -f pom.xml`)
- **Config Files**: `pom.xml`, `.mvn/wrapper/maven-wrapper.properties`, `src/main/resources/application.properties`, `src/main/resources/application-dev.properties`, `src/test/resources/application-test.properties`
- **Build Dependencies**: none (single module; no inter-package reactor). Parent: `spring-boot-starter-parent` 3.5.5. Runtime: PostgreSQL. Tests: H2.

### APIs Discovered
- REST (Spring MVC) — `src/main/java/com/kostya/habittracker/controller/` — 11 handler methods, 5 controllers, **no user/timezone/today resource**
  - `POST /api/auth/login` — public (`WebSecurityConfig` L70)
  - `GET|POST|PUT|DELETE /api/habit` — JWT
  - `GET /api/habit-track/{date}`, `POST|DELETE /api/habit-track` — JWT; client supplies `LocalDate`
  - `GET /api/statistics/{startDate}/{endDate}` — JWT; path names collide with domain `startDate` (range-from, not habit life)
  - `GET /api/habit-icons` — JWT
- Permit-all extras: `/actuator/health`, `/swagger-ui/**`, `/v3/api-docs/**`
- OpenAPI: springdoc UI; bearer JWT scheme in `OpenAPIConfig`

### Frameworks & Libraries
- Spring Boot — 3.5.5 — web, validation, data-jpa, security, actuator, test
- Java — 17 — language (`pom.xml` `java.version`)
- Hibernate / JPA — via starter — persistence; `ddl-auto=validate`
- Flyway — 11.10.3 (`flyway-core` + `flyway-database-postgresql`) — SQL under `src/main/resources/db/migration/` (V1–V5)
- PostgreSQL JDBC — runtime — production DB
- H2 — test — in-memory; Flyway **disabled** in test profile
- Spring Security + JJWT 0.12.6 — JWT filter chain
- springdoc-openapi-starter-webmvc-ui — 2.8.9 — Swagger
- Lombok — provided — boilerplate
- JUnit / Mockito / spring-security-test — via `spring-boot-starter-test`

### Test Coverage
- **Test Directories**: `src/test/java/com/kostya/habittracker/` (one class), `src/test/resources/`
- **Test Frameworks**: JUnit 5 via `spring-boot-starter-test`; `@SpringBootTest` + `@ActiveProfiles("test")`
- **Coverage Config**: absent (no Jacoco / Surefire coverage plugin in `pom.xml`)
- **Timezone / today / User tests**: none. Only `HabittrackerApplicationTests.contextLoads`. No controller/service/migration tests.

### Code Quality Indicators
- **Linting**: no Checkstyle / Spotless / PMD / EditorConfig in repo or POM
- **CI/CD**: `.github/workflows/build-and-test.yml` (compile + test + package, Java 17 Corretto); `build-image.yml`; `deploy-to-elastic-beanstalk.yml` marked legacy in `AGENTS.md`
- **Documentation**: `README.md`, `DOCKER.md`, `docs/domain.md` (authoritative law), `AGENTS.md`. Domain Glossary already records `timezone` Missing and `today` not on the user (`docs/domain.md` L46–47, L60–66)

### Technical Debt Signals
- `User` has no `timezone` column/field (`User.java` L23–51; V1 + V4 user DDL). Domain requires IANA zone (`docs/domain.md` L62–66).
- No authenticated read/update of timezone or derived `today`. Auth surface is login-only (`AuthController` L27–31; `LoginResponse` is token + expiry only).
- `UserRepository` is `save` + `findByUsername` only (`UserRepository.java` L8–13). Seed path `DataInitializer` L25–32 creates `testuser` with no zone.
- Check-in date is client `LocalDate` with `@PastOrPresent` (`HabitTrackRequest` L17–19) — JVM/server clock, not `user.timezone`. `HabitTrackServiceImpl` does not enforce today|yesterday (package 2).
- Only `ZoneId` usage is **ops** scheduler TZ: `app.scheduling.timezone` default `Asia/Bangkok` (`application.properties` L39; `StreakResetScheduler` L27–39; `SchedulingConfig.applicationTimeZone` L36–38). Do not treat as user clock.
- Tests disable Flyway and use `ddl-auto=create-drop` (`application-test.properties` L13, L35–36) — a NOT NULL timezone migration will not execute in the current suite unless tests change.
- TODOs: `application.properties` L22; `LoginRequest` min-length; `HabitLogRepository` L27 execution plan.
- `HabitTrackResponse.status` Boolean is “day done”, not habit lifecycle (`domain.md` L50, L58).
- Streak reset zeros `currentStreak` when `lastCheckInDate != today` in **scheduler** TZ (`HabitAggregateRepository` L19–20; `StreakResetScheduler` L39–41) — contradicts live-streak rule; **out of this package**.

## Handoff Summary
- **Intent-relevant finding**: Issue 14’s backend gap is real and total on this repo. `User` (`entity/User.java` L23–51) and Flyway V1–V5 have **no IANA timezone**. There is **no** API that returns `timezone` + `today` or updates timezone (controllers are auth-login, habit, habit-track, statistics, habit-icons). Domain law already states today = calendar date in `user.timezone` and that a timezone change must not rewrite check-in local dates (`docs/domain.md` L60–66). Persistence already stores check-in identity as `habit_log.date` `DATE` / `HabitLog.date` `LocalDate` (`V1__init_schema.sql` L18–24; `HabitLog.java` L34–35) with no timezone rewrite path — an update that only writes `user.timezone` would leave log dates untouched. Existing users (including `DataInitializer` `testuser`, L25–32) need a Flyway backfill then NOT NULL; unknown zone ids have no validator. The only `ZoneId` in code is `app.scheduling.timezone` (`StreakResetScheduler.java` L27–39) — ops, leave for package 4.
- **Risks / follow-up**:
  - New authenticated GET/PATCH (or equivalent) must sit behind JWT (`WebSecurityConfig` L69–74 `anyRequest().authenticated()`); no `/api/user` or `/api/me` exists to extend.
  - `UserRepository` needs at least a persist path for timezone; seed user must set a zone after the column exists.
  - Backfill default is a migration choice (intent: UTC). Document it; do not treat it as product TZ. Users must be able to change it.
  - Reject unknown IANA ids at the API/service boundary (`ZoneId.of` / equivalent); `GlobalExceptionHandler` already maps `BadRequestException` to 400 (`L61–77`).
  - Test profile skips Flyway — timezone NOT NULL / unknown-id / today-at-instant / “update does not rewrite `habit_log.date`” tests do not exist and will not run against Vn unless the test DB strategy is adjusted.
  - Do not reuse `SchedulingConfig.applicationTimeZone()` or `app.scheduling.timezone` as the user clock.
  - Do not change streak-job behavior, check-in window, `startDate`, or `status`→`done` in this package.
  - `@PastOrPresent` on track dates uses the JVM clock; window enforcement is package 2, but exposing server `today` is the client stopgap this package must ship.
