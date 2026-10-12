# Team Practices

Brownfield habit tracker: three application repos plus compose orchestration. Practices below reflect affirmed team choices (practices-discovery interview, intent `260914-full-repo-scan`) integrated with repository evidence and specialist review.

## Way of Working

- **Multi-repo layout:** Product code lives in three sibling Git repositories — `habit-tracker-springboot` (API), `habit-tracker-angular` (SPA), and `habit-tracker-compose` (production Compose and deploy). The AI-DLC workspace root (`habit-tracker-ai-dlc`) holds workflow artifacts and local clones; it is not the application monorepo.
- **Integration branch:** Each app repo uses **`main`** as the release line. We work in **short-lived branches** and merge to **`main`**. Pushes to **`main`** trigger **`build-image`** workflows that publish `docker.io/crraay/habit-tracker-{springboot,angular}:latest`.
- **Cross-repo coordination:** Production version alignment between backend and frontend is **manual** via Docker Hub **`latest`** tags. Compose deploy pulls those tags after app-repo image builds on **`main`**. There is no monorepo atomic commit across all three repos.
- **Legacy paths:** Elastic Beanstalk deploy workflow in springboot and AWS S3/CloudFront workflows in angular are **legacy**; new operational work goes through **habit-tracker-compose** per `AGENTS.md`.
- **Documentation for agents:** Each repo ships **`AGENTS.md`** and **`.cursor/rules/habit-domain.mdc`** pointing to **`habit-tracker-springboot/docs/domain.md`** as canonical domain law.

## Walking Skeleton

- **Brownfield stance:** The product already has a runnable full stack (API, UI, Compose on a droplet). For upcoming work on this codebase we **extend the existing stack** — there is **no separate walking-skeleton ceremony** for AI-DLC construction here.
- **Existing end-to-end path:** Login → JWT → Track/Statistics/Settings with **`GET /api/me`** (user clock) and habit track APIs run through nginx → backend → Postgres in compose. Automated e2e or contract tests in CI do **not** yet prove this path; manual and unit/integration tests cover parts of it.

## Testing Posture

- **Methodology**: test-after
- **Ordering**: Implement the feature first, then add or extend automated tests using existing repo patterns; **tests must pass on every push to `main`** before merge or before building and pushing production Docker images.
- **Backend (habit-tracker-springboot):** JUnit 5, Spring Boot Test, MockMvc, H2 test profile; tests concentrate on user clock/timezone; no JaCoCo or enforced coverage thresholds in CI today. **`build-image` on `main`** must run **`mvn test`** or the full **`build-and-test`** workflow (not **`-DskipTests`**) before pushing the production image.
- **Frontend (habit-tracker-angular):** **`npm run test:ci`** (ChromeHeadless with coverage flag) in reusable **`build-and-test`** and in **`build-image`** on **`main`**; co-located `*.spec.ts` files with varying depth — prefer behaviour-named specs (e.g. Settings timezone save) over scaffold-only “should create” tests for new work.
- **Compose (habit-tracker-compose):** No automated tests; quality is operational (docs, manual deploy verification). Product test gates live in the app repos.
- **Org classic note:** Framework org defaults mention an **80% line-coverage floor** for classic scope; this product **does not** enforce that floor in CI today — gates are **tests green on `main`**, not coverage thresholds.
- **Backlog (quality):** Core habit track/untrack, streak/scheduler, statistics, auth edge cases, and user-scoped log access remain under-tested on the backend; error-path tests on login and track (angular) are sparse.

## Deployment

- **Environments:** **Production only** — Docker Compose on a DigitalOcean droplet (see compose `DOCKER.md`). Local dev may use **`docker-compose.override.example.yml`** building from sibling repos; there is **no** separate staging stack in repo.
- **Production topology:** Single-host Compose project (`name: habit-tracker-springboot`): Postgres 16, backend container, frontend on host port 80; **`/api`** proxied to the backend on the Compose network.
- **Build vs deploy:** App repos **build and push** images to Docker Hub (`crraay/*:latest`). **habit-tracker-compose** **pulls** Hub images and recreates containers via **`scripts/deploy-service.sh`** — it does not build app images in committed production compose.
- **Cadence:** **Manual production rollout** — GitHub Actions **`workflow_dispatch`** on **`deploy-docker-image-ssh.yml`** (service: `all` | `backend` | `frontend`), then SSH **`git pull --ff-only`** in **`DEPLOY_COMPOSE_DIR`** and the deploy script. App image updates require a prior successful **`build-image`** on **`main`** in the relevant app repo.
- **Image tags:** We **keep Docker Hub `:latest`** tags for production pulls; rollback is **manual** (redeploy a prior tag or digest if recorded).
- **Secrets and config:** Runtime **`.env`** on the host (from **`.env.example`**: DB credentials, **`JWT_SECRET`**, **`CORS_ALLOWED_ORIGINS`**) — **never** use example values on the droplet. GitHub Actions holds registry and deploy credentials. Postgres data lives in a named volume preserved across app redeploys.
- **Database migrations:** Flyway ships inside the backend image; the compose repo does not run migrations separately.
- **Security posture (as-built):** No automated dependency/CVE scanning (Maven, npm, containers) or SAST/lint gates in CI; compose deploy uses SSH password auth in workflow secrets today — key-based auth and secret rotation are improvements to plan, not yet team practice.

## Code Style

- **Domain vocabulary:** Use glossary terms in **`docs/domain.md`** (`done`, habit `state`, check-in); backend is system of record; UI must not invent conflicting rules.
- **Java / Spring:** Package root **`com.kostya.habittracker`**; layered **controller → service → repository → entity**; DTOs and **manual mappers** (no MapStruct); **Lombok** on entities; **Flyway** for schema with **`ddl-auto=validate`**. Prefer **constructor injection** (`@RequiredArgsConstructor`) on new classes; field **`@Autowired`** in older code is debt, not the forward default.
- **API errors (backend):** Throw typed exceptions in **`exception/`** handled by **`GlobalExceptionHandler`**; keep **`ErrorResponse`** shape stable (status, error, message, path, **correlationId**, timestamp) for SPA consumers.
- **API errors (angular):** For mutations that affect visible state, handle HTTP errors explicitly (follow **Settings** timezone save pattern); avoid silent **`subscribe()`** without error paths on new features. **401** is handled via auth interceptors (logout).
- **Data access:** Scope habit and log reads/writes to the **authenticated user** (or habit ownership) in repositories and services — no cross-user log or habit access.
- **Angular:** **Standalone** components, selector prefix **`ht`**; **OnPush** on heavy screens; **Elf** for auth persistence only; **UserClockStore** in-memory for **`/api/me`**; **do not hand-edit** **`src/app/web-api/`** — regenerate from **`swagger/api-docs.json`** via **`npm run generate-api`**.
- **Formatting / lint:** No root ESLint/Prettier (angular) or Checkstyle/SpotBugs (springboot); follow existing file patterns and framework defaults.
- **Compose / ops:** Bash deploy script uses **`set -euo pipefail`**; compose service names **`postgres`**, **`backend`**, **`frontend`** are stable contracts for scripts and docs.
