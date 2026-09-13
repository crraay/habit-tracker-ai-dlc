# Component Inventory

**Repo:** habit-tracker-springboot  
**Scan kind:** partial — this file is the component catalogue. Scope `analyzed.components` must match these headings verbatim.

```yaml
components:
  - name: Domain Contract
    health: healthy
    owns: docs/domain.md
  - name: Auth
    health: healthy
    owns: login JWT issuance
  - name: User Identity
    health: degraded
    owns: User row; future user.timezone
  - name: Habit Catalog
    health: healthy
    owns: Habit CRUD
  - name: Check-in
    health: at-risk
    owns: habit_log / mark-unmark
  - name: Habit Aggregate
    health: at-risk
    owns: currentStreak / bestStreak
  - name: Statistics
    health: at-risk
    owns: range aggregates
  - name: Habit Icons
    health: healthy
    owns: icon catalog
  - name: Persistence Schema
    health: at-risk
    owns: Flyway V1–V5
  - name: Scheduling
    health: at-risk
    owns: ops streak job TZ
  - name: Security Filter Chain
    health: healthy
    owns: JWT + permit-all matchers
```

## Domain Contract

- **Responsibility:** Product/domain law. Glossary: `timezone` Missing in code; `today` not on the user.
- **Depends on:** nothing (document).
- **Dependents:** every habit/user change.
- **Health:** healthy as law; code has not caught up.
- **Issue 14:** already specifies IANA zone, today in that zone, and no rewrite of check-in local dates.

## Auth

- **Responsibility:** `POST /api/auth/login`; `AuthServiceImpl`; `LoginResponse` token + expiry.
- **Depends on:** User Identity, Security Filter Chain.
- **Health:** healthy for login-only.
- **Issue 14:** no place to return timezone/today on login; add a dedicated authenticated resource rather than overloading login unless product asks.

## User Identity

- **Responsibility:** `User` entity (`username`, `password`, `email`, `UserStatus`, `UserRole`, login audit fields). `UserRepository.save` / `findByUsername`. Seed `testuser`.
- **Depends on:** Persistence Schema, password encoder (skimmed).
- **Health:** **degraded** — no `timezone` column/field; seed has no zone.
- **Issue 14:** own the IANA column, persist path, backfill default UTC, validate `ZoneId.of`.

## Habit Catalog

- **Responsibility:** Habit CRUD; `Habit` + `HabitServiceImpl`. Owner-scoped.
- **Depends on:** User Identity, Persistence Schema.
- **Health:** healthy for current CRUD. Domain `state` / `startDate` still missing (other packages).
- **Issue 14:** no change.

## Check-in

- **Responsibility:** Mark / unmark / list by date. `HabitLog.date` `LocalDate`. Unique `(habit_id, date)`.
- **Depends on:** Habit Catalog, Habit Aggregate, User Identity (owner only).
- **Health:** **at-risk** vs domain — client date + JVM `@PastOrPresent`; no today|yesterday in `user.timezone`.
- **Issue 14:** do not rewrite `habit_log.date` on timezone change. Exposing server today is the client stopgap; window enforcement is package 2.

## Habit Aggregate

- **Responsibility:** Streak counters on `HabitAggregate`; updated on track/untrack; reset by Scheduling.
- **Depends on:** Check-in, Persistence Schema.
- **Health:** **at-risk** — live-streak rule in domain differs from job that zeros when `lastCheckInDate != today` in scheduler TZ.
- **Issue 14:** out of package. Do not change streak-job behavior.

## Statistics

- **Responsibility:** `GET /api/statistics/{startDate}/{endDate}`.
- **Depends on:** Habit Aggregate / logs (impl deep-read at service).
- **Health:** **at-risk** naming (`startDate` = range-from).
- **Issue 14:** no change.

## Habit Icons

- **Responsibility:** `GET /api/habit-icons`.
- **Depends on:** Persistence Schema (icon tables, skimmed service).
- **Health:** healthy.
- **Issue 14:** no change.

## Persistence Schema

- **Responsibility:** Flyway V1–V5; JPA `validate`. `user` created in V1, auth columns in V4; no timezone. `habit_log.date` DATE since V1.
- **Depends on:** PostgreSQL in runtime; H2 + Flyway off in tests.
- **Health:** **at-risk** for issue 14 until a backfill+NOT NULL migration exists.
- **Issue 14:** new migration; UTC default for existing rows; do not alter historical log dates.

## Scheduling

- **Responsibility:** `StreakResetScheduler` + `SchedulingConfig`; `app.scheduling.timezone` default `Asia/Bangkok`.
- **Depends on:** Habit Aggregate.
- **Health:** **at-risk** vs user clock; acceptable as **ops** clock.
- **Issue 14:** do not reuse as user timezone. Streak job TZ is ops, out of package.

## Security Filter Chain

- **Responsibility:** CORS, JWT filter, permit-all list, 401/403 handlers (handlers skimmed).
- **Depends on:** Auth token validation (`util` / JJWT, skimmed).
- **Health:** healthy.
- **Issue 14:** new user-clock routes inherit `anyRequest().authenticated()`.
