**Collaborator:** aidlc-developer-agent

## Contribution

Independent review focused on **naming**, **layer boundaries**, **error handling**, **file organization**, and **code-style conventions** across the three app repos. Sources: lead drafts (`team-practices.md`, `discovered-rules.md`, `evidence.md`), CodeKB `code-structure.md` / `architecture.md` / `code-quality-assessment.md` for springboot and angular, and spot-check of `GlobalExceptionHandler.java` (springboot).

### Endorsements (lead draft is largely accurate)

- **Multi-repo boundaries** match the code: springboot owns REST + domain enforcement, angular owns SPA + generated client, compose owns stack/deploy only. `AGENTS.md` scope lines align with directory contents (no app `src/` in compose).
- **Java layering** is consistent in layout: `controller/` → `service/` + `service.impl/` → `repository/` → `entity/`, with `dto/` and `mapper/` at the edge. CodeKB and springboot `AGENTS.md` table match production tree.
- **Angular organization** is feature-folder under `src/app/components/*/` with standalone components, `ht` selector prefix, guards/interceptors/stores at predictable top-level folders; generated client isolated under `src/app/web-api/` with `@webapi/*` alias — lead draft captures this correctly.
- **Domain naming law** (`docs/domain.md`, glossary terms, backend as system of record) is the strongest cross-cutting convention; promoting it in `## Code Style` and `## Mandated` is appropriate.
- **discovered-rules.md** mandated/forbidden items trace to written agent guardrails (domain doc, Flyway + `validate`, no hand-edited `web-api`, compose deploy path, no EB, no secrets in git, no JWT/password logging).

### Naming conventions (additions for integration)

| Area | Observed pattern | Note for `team-practices.md` / interview |
|------|------------------|------------------------------------------|
| Java packages | `com.kostya.habittracker.<layer>` | Stable; new types belong in existing layer packages. |
| REST / DTO names | OpenAPI-driven on angular side; springboot controllers tagged in OpenAPI | Client renames flow from swagger snapshot + `generate-api`. |
| Domain vs code | Glossary in `domain.md` (`done`, habit `state`, check-in) vs legacy **track/log** in Java names | Code-quality assessment flags naming drift; new work should prefer glossary terms in **user-facing** messages and docs; renames of persisted/API symbols need explicit migration — not a silent style fix. |
| Angular selectors | `ht-*` kebab-case | Match schematics prefix in new components. |
| Compose services | `postgres`, `backend`, `frontend` | Treat as stable contract for scripts and docs (already in draft). |

### Layer boundaries (additions)

- **Backend:** Controllers should remain thin (validation + delegation); business rules and `@Transactional` boundaries belong in services. Cross-cutting HTTP concerns live in `filter/` (JWT, correlation id) and `security/`, not in controllers. Scheduled batch logic is isolated under `scheduled/` — keep new cron work there rather than in services called directly from controllers.
- **Backend persistence:** Schema changes only via Flyway under `src/main/resources/db/migration/`; entities are JPA persistence model, not a second domain language — align behavior with `docs/domain.md` before extending entities.
- **Angular:** Feature components call generated `web-api` services; `src/app/services/` is for UI helpers (dialogs), not domain/API facades. **UserClockStore** is the intentional session cache for `/api/me` — do not duplicate “today” computation in components.
- **Compose:** Bash deploy and YAML only; no habit rules or API code (forbidden rule is correct).

**Gap to flag for human intent:** Code-quality notes a **cross-user log query** risk in habit track reads. That is a **layer/security boundary** issue, not yet a documented mandated rule. Recommend an interview question on whether to mandate **user-scoped repository queries** for all habit/log access (implementation standard), separate from devsecops linting.

### Error handling (under-documented in lead Code Style)

**Spring Boot (centralized, strong pattern):**

- `GlobalExceptionHandler` (`@RestControllerAdvice`, extends `ResponseEntityExceptionHandler`) maps validation failures and domain exceptions (`BadRequestException`, etc.) to a structured **`ErrorResponse`** (status, error, message, path, **correlationId**, timestamp). Correlation id ties to `CorrelationIdFilter` / MDC.
- Controllers rely on this handler rather than ad-hoc error bodies — new endpoints should throw existing domain exception types or validation annotations, not bespoke error maps.

**Known weaknesses (debt, not style to copy):**

- JWT parse failures reportedly swallowed in filter (code-quality assessment) — security/error visibility issue for devsecops; developers should not extend “silent fail” patterns.
- Mixed injection styles do not affect errors directly but correlate with older controller code paths.

**Angular (decentralized, inconsistent):**

- Functional interceptors handle **401 → logout** (auth/session boundary).
- Component-level RxJS: **Settings** uses explicit `{ next, error }` on timezone save; **Track** and **Login** often subscribe success-only (code-quality: login error UI gap, track HTTP errors ignored).
- No shared user-facing error service or toast pattern documented.

**Integratable Code Style bullets (proposed):**

- Backend: **Prefer throwing typed exceptions in `exception/` handled by `GlobalExceptionHandler`**; keep **`ErrorResponse`** shape stable for SPA consumers.
- Angular: **For mutations that affect visible state, handle HTTP errors explicitly** (follow Settings component pattern); do not add silent `subscribe()` without error paths on new features.
- Cross-repo: **Do not log JWTs or passwords** (already forbidden); include **correlation id** in server logs when debugging API failures (operational, not UI).

### File organization (minor clarifications)

- **Springboot:** Besides layers in draft, noteworthy packages: `exception/` (handler + domain exceptions), `filter/`, `scheduled/`, `aspect/` (`@LogExecution`), `config/`. Tests mirror main package under `src/test/java/...` with H2 profile — six classes, timezone-focused.
- **Angular:** Co-located `*.spec.ts`; `swagger/` holds OpenAPI input; `environments/` for `apiUrl`. Generated tree under `web-api/fn/` and `web-api/models/` — treat as single generated unit.
- **Compose:** `scripts/deploy-service.sh` with `set -euo pipefail` (draft mentions); production compose pulls Hub images — override example for local sibling builds only.

### Code-style conventions (beyond formatters)

- **No enforced formatters/linters** in springboot or angular (draft correct). Conventions are **copy-existing-file** and framework defaults.
- **Java:** Lombok on entities; manual mappers (no MapStruct); prefer **constructor injection** for new classes (`@RequiredArgsConstructor`) — field `@Autowired` exists in older controllers (debt called out in draft).
- **Java API docs:** Sparse Javadoc; OpenAPI annotations on controllers are the primary contract documentation for angular.
- **Angular:** Standalone + explicit `imports`; **OnPush** on Track/Statistics/Settings; **date-fns** with `parseISO` for server dates and `yyyy-MM-dd` for API paths/bodies (CodeKB code-structure).
- **Generated client:** Lint disabled locally in generated files — hand-written code should still follow Angular style; never edit generated output.

### Suggested updates to `discovered-rules.md` (human affirmation only)

- **Consider Mandated (inferred from implementation, not yet in AGENTS.md):** ALWAYS scope new habit/log repository queries by **authenticated user** (or habit ownership) — addresses documented cross-user read risk. *Defer to interview if team prefers fixing case-by-case.*
- **Do not add** a mandated “always constructor injection” rule unless the team wants to enforce cleanup — currently documented as debt, not hard constraint.

### Interview hooks (developer lens)

1. **API error UX:** Should angular standardize error display (toast/snackbar) vs per-screen handling?
2. **Naming migration:** Any plan to align Java/API names with domain glossary, or keep legacy symbols indefinitely?
3. **New Spring code:** Team preference on **constructor-only injection** as default for new/changed classes?
4. **User-scoped data access:** Mandate user filter on all log/habit reads at repository or service layer?

## Positions

- AGREE: Lead **Code Style** coverage of domain vocabulary, Java layering, Angular standalone/`ht`/OnPush/Elf/UserClockStore, Flyway/`validate`, and no root ESLint/Checkstyle — matches CodeKB and repo layout.
- AGREE: **discovered-rules.md** mandated/forbidden set as written — each item maps to explicit `AGENTS.md` or `.cursor/rules` text, appropriate for promotion pending human gate.
- OBJECT: **team-practices.md `## Code Style`** omits the **centralized backend error envelope** (`GlobalExceptionHandler` / `ErrorResponse` / correlation id) and **Angular HTTP error-handling inconsistency** — add bullets so construction agents do not treat silent subscribes as normal.
- OBJECT: **team-practices.md** lists mixed `@Autowired` as debt but does not state a **forward default** (constructor injection for new code) — clarify in interview or as non-mandatory team preference.
- AGREE: **Testing methodology** placement in lead draft is acceptable for pipeline-deploy scope; developer note is that error-path tests are sparse on both tiers (quality agent territory), but test-after inference does not conflict with observed patterns.
