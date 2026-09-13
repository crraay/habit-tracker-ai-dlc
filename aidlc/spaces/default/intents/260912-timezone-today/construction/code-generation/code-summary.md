# Code summary — timezone-today

Zero-Unit `poc`. Application code is in the sibling repos `habit-tracker-springboot` and `habit-tracker-angular`. `docs/domain.md` and Compose were not changed.

## Files created or modified

### habit-tracker-springboot

Created: `ClockConfig`, `UserClockController`, `UserClockService` / `UserClockServiceImpl`, `UserClockResponse`, `UpdateTimezoneRequest`, Flyway `V6__add_user_timezone.sql`, and tests `UserTimezonePersistenceTest`, `UserTodayTest`, `TimezoneUpdateLeavesLogDatesTest`, `UserClockControllerTest`.

Modified: `User` (required `timezone`, default `UTC`), `DataInitializer` (seed `testuser` with `UTC`).

### habit-tracker-angular

Created: `UserClockStore`, Settings component (route `/settings`), generated OpenAPI client for `user-clock` (`GET`/`PATCH /api/me`).

Modified: Track and Statistics consume API `today` as default/max; mark/unmark send the selected date; desktop and mobile nav add Settings; `swagger/api-docs.json` and `swagger/config.json`; `npm run generate-api` refreshed `src/app/web-api/`.

## Key implementation decisions

- JWT `GET /api/me` and `PATCH /api/me` return `{ timezone, today }`. Today is `LocalDate.now(clock.withZone(ZoneId.of(user.timezone)))` from an injected UTC `Clock`.
- Unknown IANA ids throw `BadRequestException` (HTTP 400). Unauthenticated calls stay 401 via the existing security chain.
- Timezone PATCH saves only `User.timezone`; it does not load or rewrite `habit_log.date`.
- After a Settings save, the in-session store keeps the previously loaded `today` (FR3.3). Logout clears the store.
- OpenAPI client is generator output, not hand-maintained after `npm run generate-api`.

## Tests

Methodology: test-after. Scoped commands from `unit-test-instructions.md`.

- Backend: 11 tests, 0 failures (`UserTimezonePersistenceTest`, `UserTodayTest`, `TimezoneUpdateLeavesLogDatesTest`, `UserClockControllerTest`, existing `HabittrackerApplicationTests`).
- Frontend: 10 tests, 0 failures (Track, Statistics, Settings specs).

FR5.2 uses a fixed instant `2026-01-15T03:00:00Z` (`America/New_York` → `2026-01-14`, `Asia/Bangkok` → `2026-01-15`).

## Deviations

- `UserClockControllerTest` mocks `JwtUtil` and `UserDetailsService` so `@WebMvcTest` can start with the existing JWT filter on the slice.
- A local `application.properties` datasource-password edit was reverted; it was not part of this package.
- `npm run generate-api` ran after the client files were first written, so the generator is the source of `src/app/web-api/` for `/api/me`.
