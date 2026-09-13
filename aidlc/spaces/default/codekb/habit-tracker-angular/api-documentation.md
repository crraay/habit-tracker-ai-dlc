# API Documentation — habit-tracker-angular

This repo is a **REST consumer**. Inventory of operations the generated client exposes. Versions and packages: [technology-stack.md](./technology-stack.md).

## Consumed REST Surface

Source of truth for shapes: checked-in `swagger/api-docs.json` → `src/app/web-api/` (5 services / 10 operations). Dev: `environment.apiUrl` is `''`; `proxy.conf.json` forwards `/api` to `localhost:8080`.

| Method | Path | Client | Used by (deep scan) |
|--------|------|--------|---------------------|
| POST | `/api/auth/login` | `AuthService.login` | Login |
| GET | `/api/habit` | `HabitMgmtService` | Edit (skimmed) |
| POST | `/api/habit` | `HabitMgmtService` | Edit (skimmed) |
| PUT | `/api/habit/{id}` | `HabitMgmtService` | Edit (skimmed) |
| DELETE | `/api/habit/{id}` | `HabitMgmtService` | Edit (skimmed) |
| GET | `/api/habit-track/{date}` | `HabitTrackService.getTrackingList` | Track — `date` is a **required** path param; no omit-for-today |
| POST | `/api/habit-track` | `HabitTrackService.trackHabit` | Check-in body `{ date, habitId }` |
| DELETE | `/api/habit-track` | `HabitTrackService.untrackHabit` | Unmark body `{ date, habitId }` |
| GET | `/api/statistics/{startDate}/{endDate}` | `HabitStatisticsService.getAggregatedData` | Statistics |
| GET | `/api/habit-icons` | `HabitIconsService` | Edit / icon picker (skimmed) |

Auth: JWT on subsequent calls via interceptors. Session fields: `username`, `token`, `tokenExpiresIn` only.

## Error Contract

`ErrorResponse` is generated (`correlationId`, `error`, `message`, …) and **unused** by any UI binding. Track check-in and login subscriptions have no error path. There is no existing pattern to surface an invalid timezone save.

## Gaps for Intent timezone-today

The checked-in OpenAPI snapshot has **no** `/today`, user-settings, or timezone path. Until the snapshot is updated and `web-api` regenerated, the SPA cannot consume API today or persist IANA timezone. Do not invent those operations in this document.
