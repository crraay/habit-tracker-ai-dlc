# Unit test instructions — `habit-tracker-springboot` (U1)

Intent `260914-full-repo-scan` · **FR2:** this intent does not add or modify tests in the product repo; these instructions document how to **verify the existing U1 suite** (baseline for Build and Test / follow-up F1).

## Framework

- **JUnit 5**, Spring Boot Test, **MockMvc**, H2 test profile (`application-test.properties` / `@ActiveProfiles("test")` where used).
- **No JaCoCo floor** in CI today; gate = tests green on `main` (team.md).

## Unit-scoped run command (backend repo root)

From `habit-tracker-springboot/` (sibling clone under workspace):

```bash
mvn -B test
```

Focused examples (still U1-only; adjust class names if package moves):

```bash
mvn -B test -Dtest=UserClockServiceTest
mvn -B test -Dtest=*Timezone*
```

On Windows PowerShell from AI-DLC workspace:

```powershell
cd habit-tracker-springboot; mvn -B test
```

## Prerequisites

- JDK **17** (matches CI Temurin/Corretto).
- Maven wrapper or local Maven; no Docker required for unit tests.
- H2 in-memory DB for integration-style tests; Flyway may run in test profile per existing config.

## Coverage expectations (follow-up F1)

| Area | As-built | Follow-up |
|------|----------|-----------|
| User clock / timezone | Covered (primary test focus) | Extend edge zones |
| Auth login failures | Partial | Add MockMvc error-path tests |
| Habit track/untrack | Sparse | Per team testing backlog |
| Streak / scheduler | Sparse | Service + time mocking |
| Statistics | Sparse | Service layer tests |

Standard strategy (5–8 tests per **new or touched** component) applies in **follow-up intents**, not in this FR2 pass.

## Mocking / data

- Use `@MockBean` / `@Autowired MockMvc` patterns from existing specs.
- Do not log JWT or passwords (project NEVER).
- Scope data to authenticated user in repository tests (project ALWAYS).

## CI alignment note

Production image build on `main` should run **`mvn test`** before push (project ALWAYS; BL-INFRA-01 documents current `-DskipTests` gap). Fixing CI is **follow-up**, not this intent.
