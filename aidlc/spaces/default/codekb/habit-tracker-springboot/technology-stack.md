# Technology Stack — habit-tracker-springboot

## Runtime & Language

| Technology | Version | Usage |
|------------|---------|--------|
| Java | 17 | Language (enforced in `pom.xml`) |
| Spring Boot | 3.5.5 | Parent BOM, auto-configuration |
| Maven | Wrapper (`mvnw`) | Build and package |

## Spring Modules

| Starter / module | Purpose |
|------------------|---------|
| spring-boot-starter-web | Spring MVC REST |
| spring-boot-starter-data-jpa | Hibernate/JPA |
| spring-boot-starter-security | Security filter chain |
| spring-boot-starter-validation | Bean validation on DTOs |
| spring-boot-starter-actuator | Health endpoint |
| spring-boot-starter-test | JUnit 5, MockMvc, test slices |

## Data & Migration

| Technology | Version | Purpose |
|------------|---------|---------|
| PostgreSQL JDBC | Boot-managed | Production database |
| H2 | Test scope | In-memory tests |
| Flyway | 11.10.3 | SQL migrations (`db/migration`); **disabled in test profile** |
| Hibernate / Jakarta Persistence | Boot-managed | ORM, `ddl-auto=validate` (prod), `create-drop` (test) |

## Security & API Docs

| Technology | Version | Purpose |
|------------|---------|---------|
| JJWT | 0.12.6 | JWT signing and parsing |
| springdoc-openapi-starter-webmvc-ui | 2.8.9 | OpenAPI 3 + Swagger UI (disabled in tests) |

## Developer Ergonomics

| Technology | Purpose |
|------------|---------|
| Lombok | Boilerplate reduction on entities/DTOs |

## Container & CI

| Technology | Purpose |
|------------|---------|
| Docker multi-stage `Dockerfile` | JRE image, HEALTHCHECK on actuator; Maven build stage uses `-DskipTests` |
| GitHub Actions — `build-image.yml` | Temurin 17, Maven cache, Docker Hub push on `main` |
| GitHub Actions — `build-and-test.yml` | Corretto 17, `clean compile` → `test` → `package -DskipTests`, JAR artifact |
| GitHub Actions — EB deploy | Legacy; `workflow_call` to `build-and-test.yml` |

Maven lifecycle (default Surefire): `mvn test` runs unit/integration tests; `mvn package` runs tests unless `-DskipTests`. No JaCoCo plugin in `pom.xml`.

## Configuration Surface

Environment-driven: `JWT_SECRET`, `CORS_ALLOWED_ORIGINS`, datasource URL/credentials; `app.scheduling.timezone` (default `Asia/Bangkok`) for cron.

Details of transitive versions are governed by Spring Boot BOM — see [dependencies.md](./dependencies.md).
