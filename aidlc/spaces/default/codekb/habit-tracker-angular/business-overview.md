# Business Overview — habit-tracker-angular

Focused first scan (`kind: partial`) for intent `timezone-today`. This repo is the Habit Tracker **UI only**. Canonical habit law lives in sibling `habit-tracker-springboot/docs/domain.md`. This overview records what the SPA does today; it does not invent check-in windows, streaks, pause/archive, or the meaning of *today*.

## Purpose

`habit-tracker-ui` is an Angular 18 SPA that lets an authenticated user track daily habits, edit the habit list, and view a date-range statistics screen. It talks to the Spring Boot API through a generated OpenAPI client. The UI may hide illegal actions; it must not become a second source of truth.

## Key Functionality

| Area | What the UI does now | Intent relevance |
|------|----------------------|------------------|
| Login | Username/password → JWT in Elf store (`ht_auth` in `localStorage`) | Session holds `username` / `token` / `tokenExpiresIn` only — no timezone, no API today |
| Track | Lists habits for a date; check-in / unmark via `POST`/`DELETE /api/habit-track` | Default date, datepicker `maxDate`, and check-in payload all come from `new Date()` + local `yyyy-MM-dd` |
| Statistics | Aggregates for a start/end range via `GET /api/statistics/{startDate}/{endDate}` | Range default and end-picker max are the same client clock |
| Edit | Habit CRUD (skimmed) | Out of this intent’s change set |
| Settings | **Absent** — no route, nav item, or IANA field | Greenfield for view/change timezone and invalid-save errors |

Shell navigation after login is Track / Edit / Statistics / Logout only. See [component-inventory.md](./component-inventory.md) for owners and [api-documentation.md](./api-documentation.md) for the consumed contract.

## Domain Boundary

- **This package owns**: presentation, routing, client-side session, HTTP adapters, date widgets.
- **This package does not own**: what *today* is, timezone validity, check-in window, streak math, pause/archive/delete semantics.
- **Observed mismatch (intent 14)**: track, statistics, and check-in treat the **browser clock** as domain today. The checked-in OpenAPI snapshot has no `/today` or timezone operation, so the UI cannot yet consume API today.

## Out of Scope for This Intent

Do not expand this package into check-in window enforcement, streak, pause/archive, statistics 7/30 presets, or the `status` → `done` rename on `HabitTrackResponse`. Those stay backend-contract follow-ups.
