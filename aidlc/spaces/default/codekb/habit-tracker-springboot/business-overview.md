# Business Overview — habit-tracker-springboot

## Purpose

Single-module **REST backend** for a personal habit-tracking product: authenticated users manage habits, mark daily check-ins, view completion statistics over date ranges, and configure **per-user timezone** so “today” aligns with the client. Canonical business rules live in `docs/domain.md`; this service is the persistence and API authority for habits, logs, streak aggregates, and user clock settings.

See also: [architecture.md](./architecture.md), [api-documentation.md](./api-documentation.md).

## Domain Concepts

| Concept | Role in product | Implementation note |
|--------|-----------------|---------------------|
| User | Account with roles/status, timezone, JWT auth | `User`, `UserDetailsServiceImpl`; login only (no public registration API) |
| Habit | Tracked behavior with icon, schedule metadata | CRUD via `/api/habit`; **no** `state` / `startDate` on entity yet (gap vs `docs/domain.md`) |
| Check-in (HabitLog) | One completion on a calendar date | `/api/habit-track`; legacy naming “track” / `HabitLog` |
| Aggregate / streak | Current/best streak derived from check-ins | Updated on track/untrack and nightly cron reset |
| User today | Calendar date in user’s IANA timezone | `/api/me` via `UserClockServiceImpl` (aligned with domain) |
| Habit icon | Catalog of UI icons | Read-only list for clients |

## Key User Journeys (API-backed)

1. **Sign in** — `POST /api/auth/login` → JWT for subsequent calls ([api-documentation.md](./api-documentation.md)).
2. **Manage habits** — Create/read/update/delete habits scoped to the authenticated user.
3. **Daily tracking** — Load tracking board for a date; mark or remove check-ins.
4. **Review progress** — Statistics for a `[startDate, endDate]` window.
5. **Timezone alignment** — Read/update timezone; “today” for UI without rewriting historical log dates (covered by tests).

## Business Rules — Contract vs Code

`docs/domain.md` describes habit **lifecycle** (active/paused/archived), **startDate**, check-in window (**today and yesterday** in **user** timezone), scheduled-day statistics, and streak semantics tied to user today. The codebase **partially** implements timezone/today (`User`, V6 migration, `/api/me`) but **does not** encode lifecycle, user-relative check-in windows, or per-user streak scheduling. Treat this gap as the primary brownfield concern for downstream requirements and domain-design stages ([code-quality-assessment.md](./code-quality-assessment.md)).

## Stakeholders & Deployment Context

- **Clients**: Angular and Compose frontends (sibling repos) consume this API with JWT and CORS from environment.
- **Operations**: Docker image with actuator health; CI builds JAR and publishes container on `main` ([technology-stack.md](./technology-stack.md)).

## Out of Scope (in repo)

User registration, email verification flows, and multi-tenant administration are not exposed as REST surfaces; `UserStatus.PENDING_VERIFICATION` is enforced at login only.
