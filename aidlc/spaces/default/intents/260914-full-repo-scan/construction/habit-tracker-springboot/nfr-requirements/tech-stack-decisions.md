# Tech Stack Decisions — unit `habit-tracker-springboot`

Planning-only intent (FR2). **Affirm as-built lock-in** — record current stack; no upgrade decisions this intent. Source: `codekb/habit-tracker-springboot/technology-stack.md`, affirmed team/project mandates.

## Runtime and build

| ID | Decision | Version / choice | Rationale |
|----|----------|------------------|-----------|
| **NFR7.1** | Language | Java **17** | Enforced in `pom.xml` |
| **NFR7.2** | Framework | Spring Boot **3.5.5** | Parent BOM, existing codebase |
| **NFR7.3** | Build | Maven (**mvnw**) | CI and local parity |

## Spring modules (retained)

| ID | Starter | Purpose |
|----|---------|---------|
| **NFR7.4** | spring-boot-starter-web | REST MVC |
| **NFR7.5** | spring-boot-starter-data-jpa | Hibernate/JPA |
| **NFR7.6** | spring-boot-starter-security | Filter chain + JWT |
| **NFR7.7** | spring-boot-starter-validation | DTO validation |
| **NFR7.8** | spring-boot-starter-actuator | Health |
| **NFR7.9** | spring-boot-starter-test | JUnit 5, MockMvc |

## Data and migration

| ID | Decision | Notes |
|----|----------|-------|
| **NFR7.10** | PostgreSQL (prod) | JDBC via Boot BOM |
| **NFR7.11** | H2 (test) | In-memory tests |
| **NFR7.12** | Flyway **11.10.3** | **ALWAYS** for schema; `ddl-auto=validate` (mandated) |

## Security and API documentation

| ID | Decision | Notes |
|----|----------|-------|
| **NFR7.13** | JJWT **0.12.6** | HS256 tokens |
| **NFR7.14** | springdoc-openapi **2.8.9** | OpenAPI 3 + Swagger UI |

## Developer ergonomics

| ID | Decision | Notes |
|----|----------|-------|
| **NFR7.15** | Lombok | Entities/DTOs |
| **NFR7.16** | Manual mappers | No MapStruct — team code style |

## Container and CI

| ID | Decision | Notes |
|----|----------|-------|
| **NFR7.17** | Multi-stage Dockerfile | JRE image + HEALTHCHECK |
| **NFR7.18** | GitHub Actions | `build-and-test.yml`, `build-image.yml` |
| **NFR7.19** | Image publish | `docker.io/crraay/habit-tracker-springboot:latest` on `main` (C2) |

## Configuration surface

| ID | Env / property | Purpose |
|----|----------------|---------|
| **NFR7.20** | `JWT_SECRET` | Signing key |
| **NFR7.21** | `CORS_ALLOWED_ORIGINS` | Browser CORS |
| **NFR7.22** | Datasource URL/user/password | Postgres |
| **NFR7.23** | `app.scheduling.timezone` | Cron timezone (default Asia/Bangkok) |

## Mandates reflected (inception NFR3)

| ID | Mandate | Stack implication |
|----|---------|-------------------|
| **NFR7.24** | Flyway + validate | NFR7.12 |
| **NFR7.25** | GlobalExceptionHandler / ErrorResponse | Spring MVC + custom exceptions |
| **NFR7.26** | Tests before production image | CI workflows must run `mvn test` |
| **NFR7.27** | Compose deploy path | Image consumed by U3; no Elastic Beanstalk (project NEVER) |

## Evaluation triggers (no decision now)

| ID | Trigger | Consider |
|----|---------|----------|
| **NFR7.28** | Boot CVE or EOL | Planned upgrade intent |
| **NFR7.29** | JWT library advisory | Bump JJWT in patch intent |
| **NFR7.30** | Need MapStruct at scale | Revisit only if mapping debt grows |
