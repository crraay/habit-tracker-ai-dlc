# Developer scan — habit-tracker-springboot (link 1)

**Intent:** 261013-f1-springboot-ci — require tests on `build-image` using existing CodeKB and contracts  
**Scan date:** 2026-10-14  
**Commit:** `803c68843c530857a78ac8e792acefc29e46decf`  
**Breadth:** Focused (STALE store merge); snapshot-bound paths only.

## Developer Code Scan Results

### Scan Coverage

- **Analyzed deeply**:
  - `./.github/workflows/build-image.yml`
  - `./.github/workflows/build-and-test.yml`
  - `./pom.xml`
  - `./src/test/java/` (all 5 test classes under `com.kostya.habittracker`)
  - `./src/test/resources/application-test.properties`
- **Skimmed only**:
  - `./` (repo root: `Dockerfile`, `AGENTS.md`, `DOCKER.md`, `docs/`, `mvnw*`)
  - `./.github/workflows/deploy-to-elastic-beanstalk.yml` (trigger overlap with `main`; legacy deploy path)
  - `./src/main/` (directory layout only; not read for this focused CI/test scan)

### Packages Found

- `com.kostya.habittracker` — application + tests — Java — Spring Boot REST backend (main under `src/main/java/`; tests colocated under `src/test/java/`)

### Build System

- **Type**: Maven (wrapper present: `mvnw`, `mvnw.cmd`)
- **Config Files**: `pom.xml` (Spring Boot parent `3.5.5`, Java 17, packaging `jar`)
- **Build Dependencies**: Standard Spring Boot Maven lifecycle; `spring-boot-maven-plugin` for repackage; `flyway-maven-plugin` declared (runtime migrations use Flyway dependency; tests disable Flyway via profile)
- **Maven test phases (default, no custom Surefire in POM)**:
  - `mvn test` → `test-compile` + Surefire (`spring-boot-starter-test` / JUnit Jupiter)
  - `mvn package` → compile, test (unless `-DskipTests`), then package
  - `-DskipTests` skips Surefire but still compiles test sources unless combined with other skips

### APIs Discovered

- Not in snapshot scope (REST controllers live under `src/main/java/.../controller/`). Tests exercise `UserClockController` via `@WebMvcTest`.

### Frameworks & Libraries

- Spring Boot — 3.5.5 — core framework (Web, JPA, Security, Actuator, Validation)
- springdoc-openapi — 2.8.9 — OpenAPI/Swagger (disabled in test profile)
- Flyway — 11.10.3 — DB migrations (disabled in tests)
- JJWT — 0.12.6 — JWT
- PostgreSQL driver — runtime — production DB
- H2 — test scope — in-memory DB for tests
- JUnit 5 + Spring Test + Mockito + spring-security-test — via `spring-boot-starter-test` / `spring-security-test`

### Test Coverage

- **Test Directories**: `src/test/java/com/kostya/habittracker/`, `src/test/resources/`
- **Test Frameworks**: JUnit Jupiter (`@Test`), Spring Boot Test (`@SpringBootTest`, `@WebMvcTest`), Mockito (`@MockitoBean`), Spring Security Test (MockMvc security post-processors)
- **Test classes (5)**:
  - `HabittrackerApplicationTests` — context load (`@SpringBootTest`, `@ActiveProfiles("test")`)
  - `UserClockControllerTest` — 4 MVC tests (`@WebMvcTest`)
  - `UserTodayTest` — 3 domain/timezone tests
  - `UserTimezonePersistenceTest` — 2 persistence tests
  - `TimezoneUpdateLeavesLogDatesTest` — 1 integration-style test (`@SpringBootTest`)
- **Approx. test methods**: 11 `@Test` methods (plus `@BeforeEach` in `UserTodayTest`)
- **Coverage Config**: absent (no JaCoCo or similar in `pom.xml`)

### Code Quality Indicators

- **Linting**: not configured in scanned paths (no Checkstyle/SpotBugs in `pom.xml`)
- **CI/CD**:
  - `build-image.yml` — **production Docker Hub path** (`docs/architecture.md`, `DOCKER.md`); triggers on `push` to `main` and `workflow_dispatch`
  - `build-and-test.yml` — compile + **explicit `mvn test`** + `package -DskipTests`; triggers on `push` to `feat/actions_cicd` only; also `workflow_call` (reused by legacy EB deploy)
  - `deploy-to-elastic-beanstalk.yml` — **legacy**; on `main` push calls `build-and-test.yml` then deploys (AGENTS.md: do not extend)
- **Documentation**: `AGENTS.md` states CI tests via `build-and-test.yml`; production image via `build-image`

### Technical Debt Signals

- **Production image workflow skips all tests**: `build-image.yml` line 34 runs `mvn -B -DskipTests package` before Docker build/push.
- **Duplicate Maven build with skipTests**: root `Dockerfile` build stage also runs `mvn -B -DskipTests package` (line 7); CI already packages on the runner—image build rebuilds inside Docker without tests anyway.
- **Branch/trigger split**: tests on `main` are not gated by `build-image`; they may still run in parallel via legacy `deploy-to-elastic-beanstalk.yml` → `workflow_call` to `build-and-test.yml`, but that is not the documented production publish path and is marked legacy.
- **JDK distribution mismatch in CI**: `build-image` uses Temurin 17; `build-and-test` uses Corretto 17 (unlikely to matter for intent, but differs from local/AGENTS `./mvnw clean test` guidance).

### CI workflow comparison (build-image vs build-and-test)

| Aspect | `build-image.yml` | `build-and-test.yml` |
|--------|-------------------|----------------------|
| **Triggers** | `push: main`, `workflow_dispatch` | `push: feat/actions_cicd`, `workflow_call` |
| **JDK** | Temurin 17, Maven cache | Corretto 17, Maven cache |
| **Compile** | implicit in `package` | explicit `mvn clean compile` |
| **Tests** | **skipped** (`-DskipTests` on `package`) | **explicit** `mvn test` step |
| **Package** | `mvn -B -DskipTests package` | `mvn package -DskipTests` (after tests) |
| **Artifacts** | Docker image push to Docker Hub | JAR upload artifact |
| **Role** | Current production image publish | Reusable test+build; not on `main` push except via EB workflow |

### Test runtime configuration

`application-test.properties` configures H2 in-memory DB, `spring.jpa.hibernate.ddl-auto=create-drop`, `spring.flyway.enabled=false`, test JWT secret, CORS, disabled springdoc, debug logging for web/security. All scanned test classes use `@ActiveProfiles("test")` where profile matters.

## Handoff Summary

- **Intent-relevant finding**: The **`build-image` workflow is the production publish path on every `main` push** and **never runs the Maven test phase**—it uses `mvn -B -DskipTests package` (`.github/workflows/build-image.yml:33-34`). By contrast, **`build-and-test.yml` runs tests in a dedicated step** (`mvn -f pom.xml test` at lines 35-36) before packaging with `-DskipTests`. **`build-and-test` does not trigger on `main`** (only `feat/actions_cicd` and `workflow_call`); therefore **merging to `main` can publish `:latest` to Docker Hub without any test execution in that pipeline**. Tests exist and are runnable via standard Maven (`pom.xml` includes `spring-boot-starter-test`; five test classes under `src/test/java/`); enabling tests on `build-image` is primarily a workflow change (e.g. replace skip with `test` then package, or `package` without `-DskipTests`, or mirror the three-step pattern from `build-and-test`). Consider whether Docker build should rely on the runner-built JAR vs rebuilding with skip inside `Dockerfile`.
- **Risks / follow-up**: Changing only the GitHub workflow step may still leave **`Dockerfile` multi-stage build skipping tests** if CI switches to `docker build` without a prior tested artifact; legacy **`deploy-to-elastic-beanstalk.yml` also triggers on `main`** and *does* invoke `build-and-test`—architect should clarify whether F1 scope is **`build-image` only** or also Dockerfile/EB overlap. No JaCoCo/coverage gate exists today. Confirm intent does not require adding Surefire config to `pom.xml` (defaults should suffice for `mvn test`).
