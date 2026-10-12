# Discovered Rules

Hard constraints from repository guardrails and human-affirmed practice (practices-discovery interview, intent `260914-full-repo-scan`). Only these items are candidates for promotion to `project.md` at the affirmation gate.

## Mandated

- ALWAYS treat **`habit-tracker-springboot/docs/domain.md`** as canonical product/domain law before changing habits, check-ins, streaks, pause/archive/delete, timezone, or the meaning of *today* *(`.cursor/rules/habit-domain.mdc`, `AGENTS.md` in springboot, angular, compose)*.
- ALWAYS resolve implementation vs **`docs/domain.md`** conflicts explicitly — do not silently invent a third rule *(agent rules + springboot `AGENTS.md`)*.
- ALWAYS use **Flyway** migrations for database schema changes in the backend with **`spring.jpa.hibernate.ddl-auto=validate`** *(springboot `AGENTS.md`, `application.properties`)*.
- ALWAYS regenerate the Angular HTTP client from the checked-in OpenAPI snapshot — do not hand-edit **`src/app/web-api/`** *(angular `AGENTS.md`)*.
- ALWAYS keep production deploy path in **`habit-tracker-compose`** for new operational work *(springboot `AGENTS.md`, compose `AGENTS.md`, `DOCKER.md`)*.
- ALWAYS handle API errors consistently: on Spring Boot, use **`GlobalExceptionHandler`** and typed domain exceptions so responses follow **`ErrorResponse`**; on Angular, handle HTTP errors explicitly on user-visible mutations (same pattern as Settings timezone save) *(interview Q8)*.
- ALWAYS scope habit and log data access in repositories and services to the **authenticated user** or **habit ownership** — no cross-user reads or writes *(interview Q8)*.
- ALWAYS run **`mvn test`** or the full **`build-and-test`** workflow (not **`mvn package -DskipTests`**) on the commit that builds and pushes the Spring Boot production image from **`main`** *(interview Q4, Q5)*.
- ALWAYS ensure automated tests **pass on every push to `main`** before merge or before **`build-image`** publishes production images in app repos *(interview Q4)*.

## Forbidden

- NEVER extend or use **`.github/workflows/deploy-to-elastic-beanstalk.yml`** for new deploys *(springboot `AGENTS.md`)*.
- NEVER put habit/domain rules, REST API implementation, or UI application code in **`habit-tracker-compose`** *(compose `AGENTS.md`)*.
- NEVER commit real production secrets — use environment variables and local **`.env`** copied from **`.env.example`** *(all three `AGENTS.md`)*.
- NEVER log JWT tokens or passwords in application code *(springboot `AGENTS.md`)*.
- NEVER push Spring Boot production Docker images from **`build-image`** on **`main`** when tests were skipped (**`-DskipTests`**) on that build *(interview Q5)*.
