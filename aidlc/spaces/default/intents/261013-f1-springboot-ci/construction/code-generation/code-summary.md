# Code summary — F1 springboot build-image CI tests

Express zero-unit intent. Application changes are in sibling repo **`habit-tracker-springboot`** only.

## Files modified

| File | Change |
|------|--------|
| `.github/workflows/build-image.yml` | Split Maven into **`mvn -B test`** then **`mvn -B package -DskipTests`** before Docker login/build/push (FR1, FR1.1) |
| `Dockerfile` | Build stage runs **`mvn -B test package`** instead of `-DskipTests package` (FR2) |
| `.github/workflows/deploy-to-elastic-beanstalk.yml` | Removed **`push: main`** trigger; **`workflow_dispatch`** only (FR3) |

No Java source, `docs/domain.md`, angular, or compose changes (NFR1, NFR2).

## Requirement satisfaction

- **FR1 / FR1.1:** Failed tests fail the job before Docker Hub steps (sequential steps in one job).
- **FR1.2:** On green tests, existing docker build/push unchanged.
- **FR1.3:** Uses existing Surefire suite via `mvn test`; no new test classes.
- **FR2:** Docker image build stage no longer skips tests when image is built from Dockerfile alone.
- **FR3:** `main` push no longer starts legacy EB workflow.

## Verification

Local: `.\mvnw.cmd -f pom.xml test` — **11 tests, 0 failures** (2026-10-14).

CI behavior on `main` should be confirmed on next `build-image` workflow run (FR4).

## Deviations

None from approved plan.
