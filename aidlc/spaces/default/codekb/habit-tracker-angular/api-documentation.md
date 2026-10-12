# API Documentation — habit-tracker-angular

This repo is a **REST consumer**. Inventory matches checked-in `swagger/api-docs.json` → generated `src/app/web-api/` (**8 path templates, 13 operations**, **6 service classes**). Runtime: `environment.apiUrl` is `''` (relative URLs); dev `proxy.conf.json` forwards `/api` → `http://localhost:8080`; production nginx proxies `/api/` → backend.

Regenerate client: `npm run generate-api` (`ng-openapi-gen` + `swagger/config.json`).

## Consumed REST Surface

| Method | Path | Generated service | Primary UI consumer |
|--------|------|-------------------|---------------------|
| POST | `/api/auth/login` | `AuthService.login` | Login |
| GET | `/api/habit` | `HabitMgmtService` | Edit habits |
| POST | `/api/habit` | `HabitMgmtService` | Edit habits |
| GET | `/api/habit/{id}` | `HabitMgmtService` | Edit habits (detail) |
| PUT | `/api/habit/{id}` | `HabitMgmtService` | Edit habits |
| DELETE | `/api/habit/{id}` | `HabitMgmtService` | Edit habits |
| GET | `/api/habit-track/{date}` | `HabitTrackService.getTrackingList` | Track — `date` required (`yyyy-MM-dd`) |
| POST | `/api/habit-track` | `HabitTrackService.trackHabit` | Track check-in body `{ date, habitId }` |
| DELETE | `/api/habit-track` | `HabitTrackService.untrackHabit` | Track unmark body `{ date, habitId }` |
| GET | `/api/statistics/{startDate}/{endDate}` | `HabitStatisticsService.getAggregatedData` | Statistics |
| GET | `/api/habit-icons` | `HabitIconsService` | Icon picker / edit |
| GET | `/api/me` | `UserClockService.getMe` | UserClockStore, Settings (read) |
| PUT | `/api/me` | `UserClockService.updateMe` | Settings (timezone update) |

### Auth

JWT bearer on authenticated routes via `tokenInterceptor` reading `AuthStore`. Session fields: `username`, `token`, `tokenExpiresIn` (Elf persist). Logout clears auth store and `UserClockStore.clear()`.

### Key schemas (generated models)

| Model | Fields (observed usage) | Notes |
|-------|-------------------------|-------|
| `UserClockResponse` | `today` (ISO date string), `timezone` (IANA) | Drives Track/Statistics defaults |
| `UserClockUpdateRequest` | `timezone` | Settings PUT body |
| `HabitTrackRequest` | `date`, `habitId` | Check-in/unmark |
| `HabitTrackResponse` | `habitId`, `status`, … | UI filters by `status`; rename to `done` is backend concern |
| `HabitDto` | Minimal habit fields | May not expose pause/archive from domain doc |
| `ErrorResponse` | `message`, `error`, `correlationId`, … | Used in Settings; unused elsewhere |

## Error Contract

- **Settings**: binds `HttpErrorResponse` → `err.error?.message` (fallback string).
- **Track / Login**: RxJS `subscribe` success paths only; generated `ErrorResponse` not bound in those flows.
- **401**: `refreshTokenInterceptor` clears session and routes to login (no refresh endpoint in OpenAPI snapshot).

## Contract Verification Notes

- Snapshot in this repo includes **user-clock** (`/api/me`) — aligned with implemented `UserClockStore` and Settings.
- Before production changes, diff `swagger/api-docs.json` against live Spring Boot OpenAPI export to catch drift.
- Date path/query parameters are **civil dates** (`yyyy-MM-dd`), not instants; formatting uses `date-fns` on `Date` objects seeded from `parseISO(clock.today)`.
