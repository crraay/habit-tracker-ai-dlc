## Developer Code Scan Results

### Scan Coverage
- **Analyzed deeply**:
  - `./pom.xml`
  - `./Dockerfile`
  - `./AGENTS.md`
  - `./README.md`
  - `./DOCKER.md` (structure and deploy pointers; not line-by-line)
  - `./docs/domain.md`
  - `./src/main/resources/application.properties`
  - `./src/main/resources/db/migration/` (V1–V6)
  - `./src/main/java/com/kostya/habittracker/` (all 68 production Java sources: controllers, services, repositories, entities, DTOs, mappers, config, security, filters, scheduled, exception, aspect)
  - `./src/test/java/com/kostya/habittracker/` (all 6 test classes)
  - `./src/test/resources/application-test.properties`
  - `./.github/workflows/build-and-test.yml`
  - `./.github/workflows/build-image.yml`
  - `./.github/workflows/deploy-to-elastic-beanstalk.yml` (legacy; header and purpose only)
  - `./.cursor/rules/habit-domain.mdc`
- **Skimmed only**:
  - `./mvnw`, `./mvnw.cmd`, `./.mvn/wrapper/maven-wrapper.properties` (standard Maven Wrapper; not executed)
  - `./LICENSE` (MIT; not read in full)
  - `./.dockerignore`
  - `./.git/` and other VCS metadata

### Packages Found
- **habit-tracker-springboot** — application (single Maven module) — Java 17 — REST backend for habit tracking (auth, habits, check-ins, aggregates/streaks, statistics, user clock/timezone, habit icons)
- **com.kostya.habittracker.controller** — layer — Java — HTTP REST adapters (6 controllers)
- **com.kostya.habittracker.service** / **service.impl** — layer — Java — business logic (7 service interfaces, 8 implementations including `UserDetailsServiceImpl`)
- **com.kostya.habittracker.repository** — layer — Java — Spring Data JPA repositories (5)
- **com.kostya.habittracker.entity** — layer — Java — JPA entities (`User`, `Habit`, `HabitLog`, `HabitAggregate`, `HabitIcon`, `BasicAudit`)
- **com.kostya.habittracker.dto** — layer — Java — API request/response shapes
- **com.kostya.habittracker.mapper** — layer — Java — manual entity/DTO mapping (5 mappers)
- **com.kostya.habittracker.config** — layer — Java — Spring configuration (security, JPA, OpenAPI, scheduling, clock, data seed)
- **com.kostya.habittracker.filter** — layer — Java — JWT and correlation-id servlet filters
- **com.kostya.habittracker.security** — layer — Java — REST auth/denied handlers
- **com.kostya.habittracker.exception** — layer — Java — domain exceptions + `GlobalExceptionHandler`
- **com.kostya.habittracker.scheduled** — layer — Java — cron streak reset job
- **com.kostya.habittracker.aspect** — layer — Java — `@LogExecution` AOP logging
- **com.kostya.habittracker.util** — layer — Java — JWT helpers
- **com.kostya.habittracker.enums** / **model** — layer — Java — `UserStatus`, `UserRole`; Spring Security `UserDetails` wrapper

### Build System
- **Type**: Maven (Spring Boot parent BOM); Maven Wrapper present (`mvnw` / `mvnw.cmd`)
- **Config Files**: `pom.xml`, `.mvn/wrapper/maven-wrapper.properties`, `Dockerfile` (multi-stage image build)
- **Build Dependencies**: Single-module graph — `habit-tracker-springboot` JAR via `spring-boot-maven-plugin`; optional CLI migrations via `flyway-maven-plugin` (same Flyway version as runtime deps). No multi-module or internal library modules.

### APIs Discovered
- **REST (Spring MVC)** — `src/main/java/com/kostya/habittracker/controller/` — **13** mapped operations across **6** base paths (all under `/api` except actuator):
  - `POST /api/auth/login` — JWT login (`AuthController`)
  - `GET|POST|PUT|DELETE /api/habit`, `GET /api/habit/{id}` — habit CRUD (`HabitController`)
  - `GET /api/habit-track/{date}`, `POST|DELETE /api/habit-track` — mark/unmark check-ins (`HabitTrackController`)
  - `GET /api/statistics/{startDate}/{endDate}` — completion counts over calendar range (`HabitStatisticsController`)
  - `GET /api/habit-icons` — list active icons (`HabitIconController`)
  - `GET|PATCH /api/me` — user clock (`today`, timezone) (`UserClockController`)
- **Actuator** — Spring Boot Actuator — health exposed at `/actuator/health` (permitted unauthenticated in `WebSecurityConfig`; used by Docker `HEALTHCHECK`)
- **OpenAPI / Swagger UI** — springdoc — `/v3/api-docs`, `/swagger-ui/**` (permitted unauthenticated)

### Frameworks & Libraries
- **Java** — 17 — language/runtime (enforced in `pom.xml`)
- **Spring Boot** — 3.5.5 — parent BOM (`spring-boot-starter-web`, `data-jpa`, `security`, `validation`, `actuator`, `test`)
- **Spring Security** — (Boot-managed) — stateless JWT filter chain, CORS from env
- **Hibernate / Jakarta Persistence** — (Boot-managed) — JPA; `ddl-auto=validate`
- **PostgreSQL JDBC** — (Boot-managed) — production database
- **H2** — (Boot-managed, test scope) — in-memory tests
- **Flyway** — 11.10.3 — SQL migrations under `src/main/resources/db/migration`
- **Lombok** — (Boot-managed) — entities/DTOs/builders
- **springdoc-openapi-starter-webmvc-ui** — 2.8.9 — OpenAPI 3 + Swagger UI
- **JJWT** — 0.12.6 — JWT create/parse (`AuthServiceImpl`, `JwtUtil`, `JwtRequestFilter`)
- **JUnit 5 / Mockito / Spring Test** — (via `spring-boot-starter-test`, `spring-security-test`) — unit and slice tests

### Test Coverage
- **Test Directories**: `src/test/java/com/kostya/habittracker/`, `src/test/resources/`
- **Test Frameworks**: JUnit Jupiter, Spring Boot Test (`@SpringBootTest`, `@WebMvcTest`), Spring Security Test (`MockMvc` + authentication), Mockito (`@MockitoBean`, manual mocks)
- **Coverage Config**: **Absent** — no JaCoCo, Sonar, or coverage thresholds in `pom.xml` or CI
- **Test inventory (6 classes)**:
  - `HabittrackerApplicationTests` — context load smoke
  - `UserTodayTest` — unit tests for `UserClockServiceImpl` (timezone → today)
  - `UserTimezonePersistenceTest` — persistence of timezone on user
  - `UserClockControllerTest` — `@WebMvcTest` for `/api/me`
  - `TimezoneUpdateLeavesLogDatesTest` — integration: timezone change does not rewrite `HabitLog.date`
  - No automated tests for habit CRUD, track/untrack, streak logic, scheduler, auth beyond login path, or statistics

### Code Quality Indicators
- **Linting**: **None configured** — no Checkstyle, SpotBugs, PMD, or EditorConfig enforcement in repo
- **CI/CD**:
  - `.github/workflows/build-and-test.yml` — compile, test, package; uploads JAR artifact; triggers on branch `feat/actions_cicd` and `workflow_call`
  - `.github/workflows/build-image.yml` — on `main`: Maven package (skip tests), Docker build/push to `docker.io/crraay/habit-tracker-springboot:latest`
  - `.github/workflows/deploy-to-elastic-beanstalk.yml` — **legacy** (documented as do-not-use in `AGENTS.md` / `README.md`)
- **Documentation**: `README.md`, `AGENTS.md`, `DOCKER.md`, canonical `docs/domain.md`; OpenAPI tags on controllers; inline comments in `pom.xml` and some services; Javadoc sparse. Agent rule `.cursor/rules/habit-domain.mdc` points to domain contract.

### Technical Debt Signals
- **Domain contract vs code (major)** — `docs/domain.md` specifies habit `state` (active/paused/archived), `startDate`, check-in window (today + yesterday in **user** timezone), scheduled-day statistics, and streak rules tied to user today; **no** `state`/`startDate` on `Habit` entity or API; check-in validation is `@PastOrPresent` on server calendar (`HabitTrackRequest`); streak reset cron uses **single** `app.scheduling.timezone` (default `Asia/Bangkok`), not per-user zones (`StreakResetScheduler`, `application.properties`).
- **Cross-tenant query risk** — `HabitTrackServiceImpl.getTrackingList` loads done flags via `HabitLogRepository.findByDate(date)` with **no user filter**; could mark another user’s habits “done” if habit IDs overlap in the merged set (lines 40–44 in `HabitTrackServiceImpl.java`).
- **Streak reset semantics** — `findAggregatesNeedingStreakReset` compares `lastCheckInDate != today` where `today` is scheduler zone date, not each habit owner’s today; misaligned with domain “live streak attached to today or yesterday” in multi-timezone deployments.
- **Aggregate streak logic** — incremental `applyTrack` vs full `recomputeAggregate` on backfill/untrack; best/current streak math may diverge from domain “scheduled day” model until lifecycle exists.
- **Dev data seeding** — `DataInitializer` creates `testuser` / `testpassword` on every startup if missing (unsafe for production if not disabled).
- **Security / config** — `application.properties` ships local PostgreSQL password default `123456` (README mentions different default); `JWT_SECRET` and `CORS_ALLOWED_ORIGINS` required with no defaults; JWT filter swallows expired/invalid token parse errors silently (`JwtRequestFilter`).
- **Incomplete auth surface** — user registration/verification not exposed; `UserStatus.PENDING_VERIFICATION` enforced at login only; failed-attempt counter incremented but no lockout policy in code.
- **TODOs** — `application.properties` (“TODO env params”); `HabitLogRepository` (“TODO check execution plan”).
- **Style inconsistency** — mix of field `@Autowired` and `@RequiredArgsConstructor` across services/controllers.
- **CI branch mismatch** — primary test workflow tied to `feat/actions_cicd`; `main` image build skips tests (`build-image.yml`).
- **Naming drift** — domain prefers check-in / `done`; code uses `HabitLog`, `habit-track`, `HabitTrackResponse.status` (documented in domain glossary as legacy).

## Handoff Summary
- **Intent-relevant finding**: The backend is a **single-module Spring Boot 3.5 / Java 17** monolith with clear layering and **13 REST operations**, but **`docs/domain.md` is ahead of the implementation**: habit lifecycle (`state`), `startDate`, user-timezone check-in window, and per-user streak/scheduling rules are **not fully encoded** in entities, validators, or the streak scheduler—while **user timezone + `/api/me` today** *is* implemented (`User` + V6 migration, `UserClockServiceImpl`). Treat gap analysis (contract vs code) as the centerpiece of architecture synthesis for this full-repo scan.
- **Risks / follow-up**: Architect should (1) map each domain section to concrete code paths and mark missing/partial behavior; (2) flag `findByDate` user scoping and scheduler timezone as correctness/security follow-ups; (3) note thin test coverage outside user-clock/timezone; (4) record commit hash in CodeKB timestamp when publishing (scan read working tree only).
