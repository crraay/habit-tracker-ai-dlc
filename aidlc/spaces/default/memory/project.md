# Project-Level Rules

> Project-specific specialisation and corrections. Loaded after `org.md` and
> `team.md` as strict-additive guidance; contradictions with broader policy
> are rejected. Populated by practices-discovery and the self-learning loop.
>
> Use sparingly: most teams don't need a project layer. Reach for it
> only when this specific project needs stable, durable guidance beyond the
> team practice (for example, package-specific release checks or an additional
> regression suite for a legacy component).

## Way of Working

- **Windows intent creation**: Cursor’s agent shell on Windows is PowerShell. For
  `aidlc engine intent create`, pass `--arguments` as a **separate** token with
  the full user request in double quotes (verbatim). Never use
  `--arguments='…'` or `--arguments=word rest…` — PowerShell keeps only the first
  word and truncates `project-description.json`. On Windows the workflow’s printed
  `intent create` command uses that form; run it as printed, or rewrite any legacy
  `--arguments='…'` line into `--arguments "full request here"`.

<!-- Project-specific specialisation. Example: -->
<!-- This monorepo requires package-scoped branch names and a package owner -->
<!-- review in addition to the team's normal merge policy. -->

## Walking Skeleton

<!-- Project-specific specialisation. Example: -->
<!-- The walking skeleton must exercise the legacy service adapter as well -->
<!-- as the new service boundary. -->

## Testing Posture

<!-- Project-specific specialisation. -->

## Change Control

<!-- Project-specific. Mode: strict or relaxed. Strict here holds for every intent and cannot be changed from chat. -->

## Deployment

<!-- Project-specific specialisation. -->

## Code Style

<!-- Project-specific specialisation. -->

## Tech Stack

<!-- Technology choices locked for this project. -->

## Decided

<!-- Decisions made in earlier stages that should not be re-asked. -->
<!-- Format: DECIDED: [decision] (Stage [slug], [date]) -->

## Scope Overrides

<!-- Custom scope rules for this project. -->

## Forbidden

<!-- Populated by practices-discovery affirmation gate. -->
<!-- Format: NEVER [behavior] (affirmed [date]) -->
<!-- Example: NEVER throw exceptions across service layer boundaries (affirmed 2026-05-17) -->

- NEVER extend or use **`.github/workflows/deploy-to-elastic-beanstalk.yml`** for new deploys *(springboot `AGENTS.md`)*. (affirmed 2026-09-25)

- NEVER put habit/domain rules, REST API implementation, or UI application code in **`habit-tracker-compose`** *(compose `AGENTS.md`)*. (affirmed 2026-09-25)

- NEVER commit real production secrets — use environment variables and local **`.env`** copied from **`.env.example`** *(all three `AGENTS.md`)*. (affirmed 2026-09-25)

- NEVER log JWT tokens or passwords in application code *(springboot `AGENTS.md`)*. (affirmed 2026-09-25)

- NEVER push Spring Boot production Docker images from **`build-image`** on **`main`** when tests were skipped (**`-DskipTests`**) on that build *(interview Q5)*. (affirmed 2026-09-25)

## Mandated

<!-- Populated by practices-discovery affirmation gate. -->
<!-- Format: ALWAYS [behavior] (affirmed [date]) -->
<!-- Example: ALWAYS use Result<T,E> for fallible operations in service layer (affirmed 2026-05-17) -->

- ALWAYS treat **`habit-tracker-springboot/docs/domain.md`** as canonical product/domain law before changing habits, check-ins, streaks, pause/archive/delete, timezone, or the meaning of *today* *(`.cursor/rules/habit-domain.mdc`, `AGENTS.md` in springboot, angular, compose)*. (affirmed 2026-09-25)

- ALWAYS resolve implementation vs **`docs/domain.md`** conflicts explicitly — do not silently invent a third rule *(agent rules + springboot `AGENTS.md`)*. (affirmed 2026-09-25)

- ALWAYS use **Flyway** migrations for database schema changes in the backend with **`spring.jpa.hibernate.ddl-auto=validate`** *(springboot `AGENTS.md`, `application.properties`)*. (affirmed 2026-09-25)

- ALWAYS regenerate the Angular HTTP client from the checked-in OpenAPI snapshot — do not hand-edit **`src/app/web-api/`** *(angular `AGENTS.md`)*. (affirmed 2026-09-25)

- ALWAYS keep production deploy path in **`habit-tracker-compose`** for new operational work *(springboot `AGENTS.md`, compose `AGENTS.md`, `DOCKER.md`)*. (affirmed 2026-09-25)

- ALWAYS handle API errors consistently: on Spring Boot, use **`GlobalExceptionHandler`** and typed domain exceptions so responses follow **`ErrorResponse`**; on Angular, handle HTTP errors explicitly on user-visible mutations (same pattern as Settings timezone save) *(interview Q8)*. (affirmed 2026-09-25)

- ALWAYS scope habit and log data access in repositories and services to the **authenticated user** or **habit ownership** — no cross-user reads or writes *(interview Q8)*. (affirmed 2026-09-25)

- ALWAYS run **`mvn test`** or the full **`build-and-test`** workflow (not **`mvn package -DskipTests`**) on the commit that builds and pushes the Spring Boot production image from **`main`** *(interview Q4, Q5)*. (affirmed 2026-09-25)

- ALWAYS ensure automated tests **pass on every push to `main`** before merge or before **`build-image`** publishes production images in app repos *(interview Q4)*. (affirmed 2026-09-25)

## Corrections

<!-- Project-specific corrections from human feedback. -->
<!-- Format: NEVER/ALWAYS [behavior] (learned [date]) -->
