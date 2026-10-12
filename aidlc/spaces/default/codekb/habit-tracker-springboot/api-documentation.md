# API Documentation — habit-tracker-springboot

## Overview

- **Base style**: JSON REST under `/api`
- **Auth**: Bearer JWT (except login, actuator, OpenAPI UI)
- **Discovery**: springdoc OpenAPI 3 at `/v3/api-docs`, Swagger UI at `/swagger-ui/**`
- **Health**: `GET /actuator/health` (unauthenticated; Docker HEALTHCHECK)

Related: [architecture.md](./architecture.md) interaction diagrams, [component-inventory.md](./component-inventory.md#rest-api-adapters).

## Authentication

| Method | Path | Controller | Description |
|--------|------|------------|-------------|
| POST | `/api/auth/login` | `AuthController` | Username/password → JWT; rejects non-active users (e.g. `PENDING_VERIFICATION`) |

No registration, refresh, or logout endpoints in codebase.

## Habits

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/habit` | List habits for authenticated user |
| GET | `/api/habit/{id}` | Get one habit (owner-scoped) |
| POST | `/api/habit` | Create habit |
| PUT | `/api/habit` | Update habit |
| DELETE | `/api/habit` | Delete habit |

DTOs in `dto` package; mapped via `HabitMapper`. Entity lacks domain `state` / `startDate` fields documented in `docs/domain.md`.

## Check-ins (habit track)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/habit-track/{date}` | Tracking board: habits with done/status for `date` (`LocalDate`) |
| POST | `/api/habit-track` | Mark check-in (`HabitTrackRequest`: habit id, date) |
| DELETE | `/api/habit-track` | Remove check-in |

**Validation**: `HabitTrackRequest` uses `@PastOrPresent` on date (server calendar), not user-timezone “today/yesterday” window from domain doc.

**Response**: `HabitTrackResponse` uses legacy `status` naming (see domain glossary).

## Statistics

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/statistics/{startDate}/{endDate}` | Completion counts over inclusive calendar range |

Path variables are dates; semantics are calendar-day based, not fully “scheduled day” model from `docs/domain.md`.

## Habit icons

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/habit-icons` | List active icons for UI picker |

## User clock

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/me` | Current user profile fields including **today** (user timezone) and timezone id |
| PATCH | `/api/me` | Update IANA timezone; does not rewrite historical `HabitLog.date` |

Implemented alignment with domain for timezone/today; primary tested API surface.

## Error Handling

`GlobalExceptionHandler` maps domain and validation exceptions to HTTP status and structured error bodies. Invalid JWT parsing in filter may fail silently (no authentication) rather than 401 from filter layer — clients see 403 on protected routes.

## Security Headers & CORS

`CORS_ALLOWED_ORIGINS` environment variable required for browser clients. JWT secret via `JWT_SECRET`.

## Operation Count

**13** mapped REST operations across **6** controller base paths (per developer scan), plus actuator/OpenAPI as non-business surfaces.
