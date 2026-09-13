# API Documentation

**Repo:** habit-tracker-springboot  
**Scan kind:** partial — inventory recorded here only; [architecture.md](./architecture.md) and [component-inventory.md](./component-inventory.md) cross-reference this file.

OpenAPI UI is on (`springdoc` 2.8.9; `OpenAPIConfig` skimmed). Bearer JWT. Default produce JSON.

## Security

Public (`WebSecurityConfig`):

- `POST /api/auth/**`
- `GET /actuator/health`
- `/swagger-ui/**`, `/v3/api-docs/**`

Everything else: authenticated. CORS from `cors.allowed-origins` (required env). CSRF off; session `STATELESS`.

There is **no** `/api/user`, `/api/me`, or timezone/today resource. A new GET/PATCH (or equivalent) must sit behind JWT.

## REST handlers (11 methods, 5 controllers)

### Auth — `AuthController` `/api/auth`

| Method | Path | Auth | Body / result |
|--------|------|------|----------------|
| POST | `/api/auth/login` | public | `LoginRequest` → `LoginResponse` `{ token, tokenExpiresIn }` |

No register, refresh, or profile.

### Habit catalog — `HabitController` `/api/habit`

| Method | Path | Auth | Result |
|--------|------|------|--------|
| GET | `/api/habit` | JWT | `List<HabitDTO>` |
| GET | `/api/habit/{id}` | JWT | `HabitDTO` |
| POST | `/api/habit` | JWT | 201 `HabitDTO` |
| PUT | `/api/habit/{id}` | JWT | `HabitDTO` |
| DELETE | `/api/habit/{id}` | JWT | 204 |

### Check-in — `HabitTrackController` `/api/habit-track`

| Method | Path | Auth | Notes |
|--------|------|------|--------|
| GET | `/api/habit-track/{date}` | JWT | Path `LocalDate` (ISO). Lists habits with `HabitTrackResponse.status` = day done (boolean; not habit lifecycle). |
| POST | `/api/habit-track` | JWT | `HabitTrackRequest` `{ habitId, date }`. `date` `@NotNull @PastOrPresent` (JVM clock). 201 empty. 409 if log exists. |
| DELETE | `/api/habit-track` | JWT | Same body. 204. 409 if no log. |

Server does not derive or validate today|yesterday in `user.timezone` (window is another package).

### Statistics — `HabitStatisticsController` `/api/statistics`

| Method | Path | Auth | Notes |
|--------|------|------|--------|
| GET | `/api/statistics/{startDate}/{endDate}` | JWT | Range-from / range-to. Path names collide with domain `startDate` (habit life). Out of this package. |

### Habit icons — `HabitIconController` `/api/habit-icons`

| Method | Path | Auth | Result |
|--------|------|------|--------|
| GET | `/api/habit-icons` | JWT | `List<HabitIconDTO>` |

## Errors (handler deep-read)

`GlobalExceptionHandler` maps `BadRequestException` → 400, plus validation (`MethodArgumentNotValidException`) → 400. Unknown IANA ids should fail at the API/service boundary and reuse this 400 path. Other statuses (401/403/404/409) exist; full matrix not re-listed here.

## Internal / ops

- `StreakResetScheduler.resetStreaksAtMidnight` — cron `app.scheduling.streak-reset.cron`, zone `app.scheduling.timezone`. Not an HTTP API. Out of issue 14.
- `DataInitializer` seeds `testuser` / `testpassword` on empty username lookup. No timezone.

## Missing contract (issue 14)

Needed, not present:

- Authenticated read: `timezone` (IANA) + `today` (calendar date in that zone at the request instant).
- Authenticated update: timezone only; must not rewrite `habit_log.date`.
- Reject unknown zone ids.
