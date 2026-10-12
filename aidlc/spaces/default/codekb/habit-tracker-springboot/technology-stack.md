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
| Flyway | 11.10.3 | SQL migrations (`db/migration`) |
| Hibernate / Jakarta Persistence | Boot-managed | ORM, `ddl-auto=validate` |

## Security & API Docs

| Technology | Version | Purpose |
|------------|---------|---------|
| JJWT | 0.12.6 | JWT signing and parsing |
| springdoc-openapi-starter-webmvc-ui | 2.8.9 | OpenAPI 3 + Swagger UI |

## Developer Ergonomics

| Technology | Purpose |
|------------|---------|
| Lombok | Boilerplate reduction on entities/DTOs |

## Container & CI

| Technology | Purpose |
|------------|---------|
| Docker multi-stage `Dockerfile` | JRE image, HEALTHCHECK on actuator |
| GitHub Actions | `build-and-test.yml`, `build-image.yml`, legacy EB workflow |

## Configuration Surface

Environment-driven: `JWT_SECRET`, `CORS_ALLOWED_ORIGINS`, datasource URL/credentials; `app.scheduling.timezone` (default `Asia/Bangkok`) for cron.

Details of transitive versions are governed by Spring Boot BOM — see [dependencies.md](./dependencies.md).
