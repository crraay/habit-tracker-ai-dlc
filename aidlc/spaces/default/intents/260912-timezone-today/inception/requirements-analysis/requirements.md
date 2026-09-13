# Requirements — timezone-today (issue 14)

Provenance: `intent-statement.md` (intent-capture); requirements-analysis Q1–Q3; GitHub issue 14 body imported in intent Q7. Brownfield inputs: `business-overview.md`, `architecture.md`, `code-structure.md` for Spring Boot and Angular. No `scope-document` (that stage is skipped). `team-practices` are not affirmed; org defaults apply (`poc`, test-after, existing suite stays green, no extra new-test floor beyond FR5).

## Intent analysis

Habit Tracker users get the wrong calendar day for “today” because track, statistics, and check-in date identity use the browser or server clock instead of the user’s IANA timezone. Maintainers need one timezone/today contract on both the Spring Boot API and the Angular UI.

Success: every user has a required IANA timezone; existing and new rows start at `UTC` as a visible fill (not a product timezone); the API returns `today` in that zone; the UI uses that `today`; the user can view and change timezone on Settings; history dates do not rewrite; listed backend tests lock the contract; `docs/domain.md` stays unchanged. Backend is the system of record.

## Functional requirements

### User timezone

**FR1** Every persisted user has a required IANA timezone (named zone such as `Europe/Berlin`, not a numeric offset).

Pass: after the migration, a user row always stores a valid IANA id; a row without one cannot be saved (FR1.5).

**FR1.1** Existing user rows are backfilled to `UTC` in Flyway, then the column is NOT NULL. `UTC` is a migration default, not a product timezone.

**FR1.2** Any newly persisted user (including seed `testuser` and any later signup) stores `UTC` until the user changes it. The timezone field is visible in Settings; it is not hidden because it is the backfill default.

**FR1.3** Unknown or non-IANA timezone ids are rejected on write. The authenticated update does not persist them.

**FR1.4** Authenticated clients can update only the current user’s timezone. The update must not rewrite existing `habit_log.date` values.

**FR1.5** After migration, a user without a valid timezone cannot be persisted.

### Today

**FR2** **Today** is the calendar date in `user.timezone` at the request instant. It is not server local time, not UTC, and not the browser clock.

Pass: at a fixed instant, `today` for `America/New_York` and `Asia/Bangkok` can differ (FR5.2).

**FR2.1** An authenticated API read returns the current user’s `timezone` and that derived `today` (ISO calendar date). There is no `/api/user` or `/api/me` today; construction may add a new JWT-protected resource.

**FR2.2** After a successful timezone update, subsequent API `today` uses the new zone. Existing check-in local dates stay as stored.

### Frontend domain today

**FR3** Track, statistics, and check-in date identity consume API `today`. They must not use `new Date()` (or equivalent client clock) as domain today.

**FR3.1** On Track: API `today` is only the default selected date and the datepicker `maxDate` / today bound. Mark and unmark send the user-selected local date; API `today` must not overwrite every check-in payload.

Pass: a user can pick a date other than API `today` (still at or before that bound) and mark/unmark send that selected date.

**FR3.2** On Statistics: default range end (and any “today” bound for the picker) uses API `today`.

**FR3.3** After a successful timezone save, Track and Statistics may keep the previously loaded `today` until the next full page load or re-login. Immediate in-session refresh of `today` is not required.

**FR3.4** Weekday and similar display formatting may stay locale-based. The date identity of today must match the server.

### Settings

**FR4** The Angular app has a Settings screen (new route and nav item) where the authenticated user views the current IANA timezone and saves a new one.

**FR4.1** Settings shows the current value even when it is still `UTC` from backfill or new-account default. The user can change it.

**FR4.2** An invalid timezone save surfaces the API error to the user (no silent ignore). Generated OpenAPI client should be regenerated from the updated contract; do not hand-edit `src/app/web-api/`.

### Backend tests

**FR5** Backend tests lock timezone and today. At minimum:

**FR5.1** A user without a valid timezone cannot be persisted after migration.

**FR5.2** At a known instant, `today` differs for `America/New_York` vs `Asia/Bangkok`.

**FR5.3** Updating timezone does not change existing `habit_log.date` values.

## Non-functional requirements

**NFR1** New timezone/today HTTP operations require the same JWT authentication as other non-public APIs. Unauthenticated calls are rejected.

**NFR2** Unknown IANA ids fail at the API/service boundary with HTTP 400, reusing the existing `BadRequestException` → `GlobalExceptionHandler` path (see Spring Boot `architecture.md` / `code-structure.md`).

**NFR3** `docs/domain.md` is not edited in this package. Implementation matches the existing User and “today” / Glossary law.

**NFR4** Existing automated tests in both repos stay green. `poc` adds no extra coverage floor beyond FR5.

**NFR5** Schema change is Flyway (next version after V5) with backfill then NOT NULL. JPA remains `ddl-auto=validate` in normal runs. The test profile currently disables Flyway (`create-drop`); construction must still satisfy FR5.1 under that profile.

**NFR6** Do not use `app.scheduling.timezone` (streak-job ops clock, default `Asia/Bangkok`) as the user clock.

## Constraints

- Repos in scope: `habit-tracker-springboot` (system of record) and `habit-tracker-angular` (UI). Compose stays orchestration-only.
- Check-in identity remains `habit_log.date` as `DATE` / `LocalDate`. Timezone PATCH updates `user.timezone` only.
- Angular must not invent today/timezone rules; it may hide illegal actions but the API enforces validity.
- Depth is Minimal; exact REST path and DTO names are construction choices so long as FR2.1 and FR1.4 hold.
- Org way of working: trunk-based, squash-merge; not a requirement on the product itself.

## Assumptions

- There is no public registration API today (`AuthController` is login-only). FR1.2 applies to every new `User` persist path that exists now (seed) or is added later; this package does not add signup.
- `@PastOrPresent` on check-in dates still uses the JVM clock until a later package; this package’s stopgap is exposing server `today` so the client stops inventing the day.
- Login response may stay token-only; timezone+today are read via the authenticated resource in FR2.1, not necessarily stuffed into `LoginResponse`.

## Out of scope

Explicitly excluded (intent Q7 / issue 14):

- Check-in today/yesterday window enforcement
- Check-in idempotency changes
- Habit `startDate`
- Streak rule / live-streak vs midnight reset
- Pause / archive / delete semantics
- Statistics 7/30 scheduled-day presets
- Rename `HabitTrackResponse.status` → `done`
- Streak-job timezone (`app.scheduling.timezone`)
- The rest of epic 13 beyond this timezone/today package

## Open questions

None. REST path and DTO names are deferred to construction under FR2.1 / FR1.4, not open product questions.
