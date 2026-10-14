# Unit Test Instructions — F1 (habit-tracker-springboot)

This intent changes **CI/workflows and Dockerfile** only. There is no new application component; verification uses the **existing** backend test suite.

## Framework

- JUnit 5, Spring Boot Test, MockMvc, H2 (`src/test/resources/application-test.properties`)
- Maven Surefire via `pom.xml` (no JaCoCo gate)

## Run this unit’s verification (existing suite)

From repository root `habit-tracker-springboot/`:

**Windows (PowerShell):**

```powershell
.\mvnw.cmd -f pom.xml test
```

**Linux / macOS / CI:**

```bash
./mvnw -f pom.xml test
```

## When to run

1. **Before** editing workflows — baseline green (Step 1 of plan).
2. **After** workflow/Dockerfile edits — confirm no accidental impact on tests (FR1.3: no new tests required; suite must stay green).

## Scope of this command

Runs all tests under `src/test/java/com/kostya/habittracker/` (~5 classes). This is the same suite `build-image.yml` will invoke via `mvn -B test`.

## Expected outcome

- Exit code `0`; all tests pass.
- No new test files are required for F1 unless Build and Test stage identifies a gap.

## Mocking / data

Use existing `@SpringBootTest`, `@WebMvcTest`, and H2 profile patterns in the repo; do not add tests solely to assert YAML content unless explicitly added in a later revision.

## Coverage

No coverage threshold for express F1; green suite only (NFR3).
