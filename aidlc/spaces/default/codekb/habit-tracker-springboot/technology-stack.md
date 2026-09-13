# Technology Stack

**Repo:** habit-tracker-springboot  
**Scan kind:** partial — versions recorded here only. [dependencies.md](./dependencies.md) lists Maven coordinates and internal edges.

| Layer | Choice | Version / evidence |
|-------|--------|-------------------|
| Language | Java | 17 (`pom.xml` `java.version`) |
| Runtime framework | Spring Boot | 3.5.5 parent |
| HTTP | spring-boot-starter-web (Spring MVC) | BOM |
| Validation | spring-boot-starter-validation | BOM |
| Persistence | spring-boot-starter-data-jpa / Hibernate | BOM; `ddl-auto=validate` |
| Security | spring-boot-starter-security | BOM |
| Tokens | JJWT | 0.12.6 |
| API docs | springdoc-openapi-starter-webmvc-ui | 2.8.9 |
| Ops endpoints | spring-boot-starter-actuator | BOM (health public) |
| Migrations | flyway-core + flyway-database-postgresql | 11.10.3 |
| Production DB | PostgreSQL JDBC | runtime, BOM-managed |
| Test DB | H2 | test scope; Flyway disabled |
| Test | spring-boot-starter-test, spring-security-test | JUnit 5 / Mockito via starter |
| Boilerplate | Lombok | provided |
| Build | Maven (wrapper present, skimmed) | single module JAR `0.0.1-SNAPSHOT` |
| CI | GitHub Actions | Java 17 Corretto (`build-and-test.yml` deep) |
| Packaging | Spring Boot JAR | `spring-boot-maven-plugin` |

Not in this scan as product choices: no Checkstyle/Spotless/PMD/EditorConfig; no JaCoCo.

Issue 14 needs no new framework. Use `java.time.ZoneId` (already used only in Scheduling) on the **user** clock, plus a Flyway revision. Do not add a second scheduler zone property for users.
