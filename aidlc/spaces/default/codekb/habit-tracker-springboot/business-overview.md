# Business Overview

**Repo:** habit-tracker-springboot  
**Scan kind:** partial (NO_STORE / first scan; see [reverse-engineering-timestamp.md](./reverse-engineering-timestamp.md))  
**Intent:** `timezone-today` (issue 14 — user IANA timezone + server-derived today)

## Purpose

Habit Tracker is a daily yes/no habit product. The Spring Boot backend is the **system of record**. The Angular UI must not invent a different meaning of *today*, check-in window, streak, pause, archive, or delete. Canonical law is `docs/domain.md` in this repo.

v1 promise: each day it is clear what to do, and it is honest whether you did it.

## Domain (law, not code)

Recorded once here; other artifacts cross-reference this section.

| Entity | Role |
|--------|------|
| **User** | Owner of data and of the clock. Every user must have an IANA timezone. **Today** is the calendar date in `user.timezone`, not server local time and not UTC. |
| **Habit** | Daily binary intention with lifecycle `active` / `paused` / `archived`. |
| **Check-in** | Fact: this habit was done on this **local calendar date**. Identity is `(habitId, localDate)`. Persistence today is `habit_log` / `HabitLog`. |

Issue-14 law that the current code does **not** implement:

- Store `user.timezone` as an IANA id.
- Derive **today** from that zone at request time.
- Changing timezone must **not** rewrite existing `habit_log.date` values.
- Existing users need a migration backfill (intent default: `UTC`) then NOT NULL. UTC is a fill, not a product timezone.

Out of this package (do not change): streak-job timezone (`app.scheduling.timezone`), check-in window enforcement (today|yesterday), habit `startDate`, and renaming `HabitTrackResponse.status` → `done`.

## Key functionality in the running system

- JWT login (`POST /api/auth/login`). No registration/profile/timezone surface.
- Habit CRUD under `/api/habit`.
- Mark / unmark / list check-ins under `/api/habit-track` using a **client-supplied** `LocalDate`.
- Range statistics under `/api/statistics/{startDate}/{endDate}` (path names collide with domain `startDate`).
- Habit icon catalog `/api/habit-icons`.
- Nightly streak-reset job in **ops** zone `app.scheduling.timezone` (default `Asia/Bangkok`). Not the user clock.

## Intent-relevant gap

The product already states timezone and today in the glossary (`docs/domain.md`). The database and API do not. `User` has no timezone column; there is no authenticated read of `timezone` + `today` and no update of timezone. Check-in dates are accepted as client `LocalDate` with `@PastOrPresent` against the JVM clock.

## Actors

| Actor | Need |
|-------|------|
| Authenticated habit user | Own clock (IANA zone) and an honest server `today` so the client does not guess the calendar day. |
| Existing seeded/legacy users (`testuser` and any production rows) | Backfill then the ability to change away from UTC. |
| Operators | Keep `app.scheduling.timezone` as the streak-job clock; not this package. |

## Out of v1 (domain)

Non-daily schedules, quantitative habits, reminders, future check-ins, social habits, gamification, and rewriting history when rules change.

## Cross-references

- Architecture and flows: [architecture.md](./architecture.md)
- HTTP surface: [api-documentation.md](./api-documentation.md)
- Component list: [component-inventory.md](./component-inventory.md)
