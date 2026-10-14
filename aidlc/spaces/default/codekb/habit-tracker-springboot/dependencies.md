# Dependencies — habit-tracker-springboot

## External Runtime Dependencies

Managed primarily via Spring Boot 3.5.5 BOM unless pinned in `pom.xml`.

| Dependency | Version (declared) | Role |
|------------|-------------------|------|
| spring-boot-starter-web | BOM | REST API |
| spring-boot-starter-data-jpa | BOM | ORM + repositories |
| spring-boot-starter-security | BOM | Authentication/authorization |
| spring-boot-starter-validation | BOM | DTO validation |
| spring-boot-starter-actuator | BOM | Health checks |
| postgresql (runtime) | BOM | Production DB driver |
| flyway-core | 11.10.3 | Schema migrations |
| lombok | BOM | Compile-time codegen |
| springdoc-openapi-starter-webmvc-ui | 2.8.9 | API docs UI |
| jjwt-api / jjwt-impl / jjwt-jackson | 0.12.6 | JWT |

## Test Dependencies

| Dependency | Scope | Role |
|------------|-------|------|
| spring-boot-starter-test | test | JUnit 5, AssertJ, MockMvc, Mockito |
| spring-security-test | test | Security MockMvc helpers |
| h2 | test | In-memory database |

Surefire is pulled transitively; no explicit `maven-surefire-plugin` configuration — defaults apply for `src/test/java`.

## Build Plugins

| Plugin | Role |
|--------|------|
| spring-boot-maven-plugin | Executable JAR repackage |
| flyway-maven-plugin | 11.10.3 — optional CLI migrations |
| maven-compiler-plugin | Java 17 |

**Maven phases relevant to CI**: `test-compile` + Surefire on `test`; `package` binds compile, test (unless skipped), and jar. `-DskipTests` skips execution but still compiles test sources unless further skip flags are used.

No internal Maven modules; dependency graph is flat single artifact.

## Internal Package Dependencies (logical)

```
REST API Adapters
  → Authentication Services | Habit Management Service | Check-in Tracking Service
    | Statistics Service | User Clock Service | Habit Icon Service
  → all use Persistence Layer + Domain Entities
Streak and Aggregate Service ← Check-in Tracking Service, Scheduled Jobs
Security and JWT ← all protected adapters
Infrastructure Configuration ← cross-cutting (security, JPA, clock, seed)
```

See [component-inventory.md](./component-inventory.md) for component names and [code-structure.md](./code-structure.md) for package map.

## External Services

| Service | Coupling |
|---------|----------|
| PostgreSQL | Required at runtime; connection pool via Hikari (Boot default) |
| Docker Hub | CI publishes image `crraay/habit-tracker-springboot:latest` via `build-image.yml` |
| GitHub Actions | Hosts Maven and Docker build pipelines |

No message brokers, third-party auth, or object storage in this repo.

## Configuration Dependencies

Application requires valid datasource, `JWT_SECRET`, and `CORS_ALLOWED_ORIGINS` for typical client deployments. Test profile (`application-test.properties`) supplies H2 and test JWT secret for Surefire. Defaults in `application.properties` include local DB password placeholder — not suitable for production without override ([code-quality-assessment.md](./code-quality-assessment.md)).
