# Code Quality Assessment — habit-tracker-springboot

## Testing

| Aspect | Assessment |
|--------|------------|
| Frameworks | JUnit 5 (`@Test`), Spring Boot Test (`@SpringBootTest`, `@WebMvcTest`), Mockito (`@MockitoBean`), Spring Security Test |
| Test count | **5** classes under `src/test/java/com/kostya/habittracker/` (~11 test methods) |
| Coverage tooling | **Absent** — no JaCoCo, Sonar, or thresholds in `pom.xml` |
| Runtime | `application-test.properties`: H2 in-memory, `ddl-auto=create-drop`, `spring.flyway.enabled=false`, test JWT secret |
| Strength | User clock/timezone: unit (`UserTodayTest`), `@WebMvcTest` (`UserClockControllerTest`), persistence and integration (`UserTimezonePersistenceTest`, `TimezoneUpdateLeavesLogDatesTest`), context load |
| Gap | No automated tests for habit CRUD, track/untrack, streak logic, scheduler, statistics, auth beyond login |

Risk: **production image workflow never runs these tests** on `main` ([CI/CD](#cicd)).

## Linting & Static Analysis

**None configured** — no Checkstyle, SpotBugs, PMD, or EditorConfig enforcement in repository.

## CI/CD

| Workflow | Triggers | JDK | Tests | Output | Role |
|----------|----------|-----|-------|--------|------|
| `build-image.yml` | `push: main`, `workflow_dispatch` | Temurin 17 | **Skipped** (`mvn -B -DskipTests package`) | Docker Hub `:latest` | **Documented production publish path** |
| `build-and-test.yml` | `push: feat/actions_cicd`, `workflow_call` | Corretto 17 | **Explicit** `mvn test` then `package -DskipTests` | JAR artifact (1 day) | Reusable test+build; **not** on `main` except via legacy EB |
| `deploy-to-elastic-beanstalk.yml` | `main` (legacy) | via call | Tests when `workflow_call` runs | EB deploy | **Do not extend** (`AGENTS.md`) |

**Intent F1 gap**: Merging to `main` can publish `:latest` without any test execution in `build-image`. `Dockerfile` build stage also runs `mvn -B -DskipTests package`, so a workflow-only fix may still leave in-container rebuilds untested unless CI passes a pre-tested JAR or removes skip in Docker build.

**JDK distribution mismatch** between production image CI (Temurin) and reusable test workflow (Corretto) — low risk for Java 17 but differs from local `./mvnw clean test` guidance.

## Documentation

| Asset | Quality |
|-------|---------|
| `README.md`, `AGENTS.md`, `DOCKER.md` | Present; deployment and agent guidance |
| `docs/domain.md` | Strong domain contract; **ahead of implementation** ([business-overview.md](./business-overview.md)) |
| OpenAPI annotations | Controller tags and operation summaries |
| Javadoc | Sparse |

## Technical Debt (prioritized)

1. **Domain contract drift** — Missing habit `state`, `startDate`; check-in window uses server `@PastOrPresent` not user today/yesterday; statistics/streaks not fully on scheduled-day model.
2. **Production CI test bypass** — `build-image.yml` and `Dockerfile` skip Surefire; no coverage gate on publish path.
3. **Cross-user log query** — `HabitTrackServiceImpl.getTrackingList` uses `HabitLogRepository.findByDate(date)` without user filter — potential incorrect “done” flags if habit id sets overlap across users.
4. **Scheduler timezone** — Single `app.scheduling.timezone` for streak reset vs per-user today in domain and `/api/me`.
5. **Production seed** — `DataInitializer` creates default test user/password if missing.
6. **Secrets & defaults** — Local DB password in properties; JWT/CORS required from env; JWT filter swallows parse errors.
7. **Auth surface** — No registration; failed login counter without lockout policy.
8. **Style** — Mixed `@Autowired` field injection and constructor injection.
9. **TODOs** — `application.properties`, `HabitLogRepository` execution plan note.
10. **Naming** — Legacy “track/log” vs domain “check-in/done” (documented in domain glossary).

## Security Posture (architectural)

- Stateless JWT model is appropriate for SPA/mobile clients.
- Gaps: silent JWT failures, dev user seed, possible log scoping bug, **image build skipping tests**.

## Overall

Codebase shows **clear layering** and **focused implementation** of user timezone/today, but **quality gates are thin** (no lint/coverage, **test-free production publish on `main`**), and **canonical domain doc exposes significant behavioral gaps**. F1 should treat enabling tests on `build-image` as primarily workflow/Maven ordering; confirm scope for `Dockerfile` and legacy EB overlap separately.

Cross-reference: [architecture.md](./architecture.md) improvement and CI diagrams.
