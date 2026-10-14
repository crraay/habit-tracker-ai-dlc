# Build Instructions — F1 (habit-tracker-springboot)

Express / CI-only intent. All commands run from **`habit-tracker-springboot/`** (sibling of the AI-DLC workspace root).

## Prerequisites

- **JDK 17** (matches `pom.xml`, `build-image.yml` Temurin 17, Dockerfile `eclipse-temurin-17`)
- Network access for Maven dependency download on first run
- No PostgreSQL required for unit tests (H2 test profile)

## Environment

Tests use `src/test/resources/application-test.properties` (profile `test`). No extra env vars are required for `mvn test` / `mvn package`.

## Install dependencies

Maven Wrapper resolves dependencies on first build; no separate install step.

## Build and verify (local — mirrors CI)

**1. Run full test suite (FR1, FR1.3, NFR3, Testing Contract):**

Windows (PowerShell):

```powershell
.\mvnw.cmd -f pom.xml test
```

Linux / macOS / CI:

```bash
./mvnw -f pom.xml test
```

**2. Package after tests (same order as `build-image.yml` after the test step):**

```powershell
.\mvnw.cmd -f pom.xml package -DskipTests
```

Expected: exit code `0`; JAR at `target/habit-tracker-springboot-0.0.1-SNAPSHOT.jar`.

**3. Optional — Dockerfile build stage parity (FR2):**

Docker image build runs `mvn -B test package` inside the build stage. Local parity is satisfied when step 1 passes; full `docker build` is not required for F1 verification in this stage.

## CI build path (`build-image.yml`)

On `push` to `main` and `workflow_dispatch`:

1. `mvn -B test`
2. `mvn -B package -DskipTests`
3. Docker login, build, push (only if Maven steps succeed)

## Troubleshooting

| Symptom | Likely cause | Action |
|--------|----------------|--------|
| Tests fail on H2 / Flyway | Schema migration mismatch | Run `mvn test` with `-X` once; compare with `src/main/resources/db/migration` |
| `JAVA_HOME` errors on Windows | Wrong JDK | Point to JDK 17; use repo `mvnw.cmd` |
| Slow first run | Dependency download | Normal; subsequent runs use local `.m2` cache |

## Out of scope

- Angular, compose, Docker Hub publish, and Elastic Beanstalk deploy execution in this stage.
