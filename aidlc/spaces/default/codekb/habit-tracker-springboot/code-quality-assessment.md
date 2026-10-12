# Code Quality Assessment — habit-tracker-springboot

## Testing

| Aspect | Assessment |
|--------|------------|
| Frameworks | JUnit 5, Spring Boot Test, Mockito, Spring Security Test |
| Test count | 6 classes under `src/test/java` |
| Coverage tooling | **Absent** — no JaCoCo, Sonar, or thresholds |
| Strength | User clock/timezone: unit, `@WebMvcTest`, integration (`TimezoneUpdateLeavesLogDatesTest`) |
| Gap | No automated tests for habit CRUD, track/untrack, streak logic, scheduler, statistics, auth beyond login |

Risk: regressions in core product paths would not be caught in CI ([technology-stack.md](./technology-stack.md) CI notes).

## Linting & Static Analysis

**None configured** — no Checkstyle, SpotBugs, PMD, or EditorConfig enforcement in repository.

## CI/CD

| Workflow | Behavior | Concern |
|----------|----------|---------|
| `build-and-test.yml` | Compile, test, package; JAR artifact | Trigger branch `feat/actions_cicd` + `workflow_call` — may not run on all feature branches |
| `build-image.yml` | On `main`: package **skip tests**, Docker push | Production image path bypasses test gate |
| `deploy-to-elastic-beanstalk.yml` | Legacy | Documented do-not-use |

## Documentation

| Asset | Quality |
|-------|---------|
| `README.md`, `AGENTS.md`, `DOCKER.md` | Present; deployment and agent guidance |
| `docs/domain.md` | Strong domain contract; **ahead of implementation** ([business-overview.md](./business-overview.md)) |
| OpenAPI annotations | Controller tags and operation summaries |
| Javadoc | Sparse |

## Technical Debt (prioritized)

1. **Domain contract drift** — Missing habit `state`, `startDate`; check-in window uses server `@PastOrPresent` not user today/yesterday; statistics/streaks not fully on scheduled-day model.
2. **Cross-user log query** — `HabitTrackServiceImpl.getTrackingList` uses `HabitLogRepository.findByDate(date)` without user filter — potential incorrect “done” flags if habit id sets overlap across users.
3. **Scheduler timezone** — Single `app.scheduling.timezone` for streak reset vs per-user today in domain and `/api/me`.
4. **Production seed** — `DataInitializer` creates default test user/password if missing.
5. **Secrets & defaults** — Local DB password in properties; JWT/CORS required from env; JWT filter swallows parse errors.
6. **Auth surface** — No registration; failed login counter without lockout policy.
7. **Style** — Mixed `@Autowired` field injection and constructor injection.
8. **TODOs** — `application.properties`, `HabitLogRepository` execution plan note.
9. **Naming** — Legacy “track/log” vs domain “check-in/done” (documented in domain glossary).

## Security Posture (architectural)

- Stateless JWT model is appropriate for SPA/mobile clients.
- Gaps: silent JWT failures, dev user seed, possible log scoping bug, image build skipping tests.

## Overall

Codebase shows **clear layering** and **focused implementation** of user timezone/today, but **quality gates are thin** (no lint/coverage, conditional CI), and **canonical domain doc exposes significant behavioral gaps**. Address contract alignment and query scoping before treating streak/check-in behavior as production-correct.

Cross-reference: [architecture.md](./architecture.md) improvement section.
