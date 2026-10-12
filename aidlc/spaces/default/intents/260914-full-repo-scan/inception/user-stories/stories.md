# User Stories — intent `260914-full-repo-scan`

## Sources

- Requirements: `inception/requirements-analysis/requirements.md`
- Personas: `personas.md`
- CodeKB business overviews (springboot, angular, compose)
- Q&A: `user-stories-questions.md`

**Tag legend:** `[As-built]` shipped behavior today · `[Backlog]` future follow-up intent · `[Intent-only]` success for this workflow, not product UI

**MoSCoW:** As-built stories are **Must Have** (describe current product). Backlog stories are **Won't Have** for this intent (Q7).

---

## US1.1 — Sign in with username and password `[As-built]` **Must Have**

As **Alex**, I want to sign in with username and password, so that I receive a JWT and can use the app.

**Acceptance criteria**

- **AC1.1.1** — Given valid credentials and an active user account, When Alex submits login, Then the API returns a JWT and the SPA stores it for subsequent requests.
- **AC1.1.2** — Given invalid credentials, When Alex submits login, Then the API returns an error response and Alex remains on the login screen. *(gap: ideal user-visible error message like Settings timezone save; as-built may not surface HTTP errors.)*
- **AC1.1.3** — Given a JWT in storage, When Alex refreshes the browser, Then the session is restored without re-login until the token expires.

**Traceability notes (Morgan):** Inception artifacts for this intent must not require login UX changes in Construction (FR2). `[Intent-only]` trace rows in `traceability.json` reference FR3.1.

---

## US1.2 — Navigate main app areas after login `[As-built]` **Must Have**

As **Alex**, I want to reach Track, Edit habits, Statistics, and Settings from navigation, so that I can complete daily workflows.

**Acceptance criteria**

- **AC1.2.1** — Given Alex is authenticated, When the shell loads, Then Track habits, Edit habits, Statistics, Settings, and Logout are reachable (desktop top nav or mobile bottom icons).

---

## US1.3 — Load user clock (today and timezone) `[As-built]` **Must Have**

As **Alex**, I want the app to load my timezone and **today** from the server, so that default dates match my calendar.

**Acceptance criteria**

- **AC1.3.1** — Given Alex is authenticated, When the app calls `GET /api/me`, Then it receives `today` and `timezone` computed in the user's IANA zone.
- **AC1.3.2** — Given Alex changes timezone in Settings with a valid IANA id, When save succeeds, Then subsequent `today` and date defaults reflect the new zone. *(gap: invalid zone shows explicit API error in Settings pattern.)*

---

## US1.4 — View habits for a selected date on Track `[As-built]` **Must Have**

As **Alex**, I want to see my habits and done state for a chosen date, so that I know what to complete.

**Acceptance criteria**

- **AC1.4.1** — Given Alex opens Track, When the board loads for date D (`yyyy-MM-dd`), Then habits and check-in state match `GET /api/habit-track/{date}` for Alex's user scope.
- **AC1.4.2** — Given Alex picks another date via the date control, When the selection changes, Then the board reloads for that date.

---

## US1.5 — Mark a habit done for a date `[As-built]` **Must Have**

As **Alex**, I want to mark a habit done for a date, so that my progress is recorded.

**Acceptance criteria**

- **AC1.5.1** — Given a habit not done on date D, When Alex toggles done, Then `POST /api/habit-track` creates a log and the UI shows done state.
- **AC1.5.2** — Given the API rejects the date (outside allowed window), When Alex toggles done, Then ideal behavior shows a clear error *(gap: domain allows today and yesterday in user TZ; as-built may reject without consistent UI feedback).*

---

## US1.6 — Remove a check-in for a date `[As-built]` **Must Have**

As **Alex**, I want to undo a check-in, so that I can correct mistakes.

**Acceptance criteria**

- **AC1.6.1** — Given a habit marked done on date D, When Alex toggles undone, Then `DELETE /api/habit-track` removes the log and UI updates.

---

## US1.7 — Create and update habits `[As-built]` **Must Have**

As **Alex**, I want to create and edit habits, so that my list reflects what I track.

**Acceptance criteria**

- **AC1.7.1** — Given Alex is on Edit habits, When Alex creates a habit with name and icon, Then `POST /api/habit` persists it scoped to Alex.
- **AC1.7.2** — Given an existing habit, When Alex edits fields exposed by the API, Then `PUT /api/habit` updates it.

---

## US1.8 — Delete a habit `[As-built]` **Must Have**

As **Alex**, I want to delete a habit I no longer track, so that my lists stay manageable.

**Acceptance criteria**

- **AC1.8.1** — Given Alex owns a habit, When Alex confirms delete, Then `DELETE /api/habit` removes it and it disappears from Track and Statistics views.

---

## US1.9 — Choose a habit icon `[As-built]` **Must Have**

As **Alex**, I want to pick an icon from the catalog, so that habits are visually distinct.

**Acceptance criteria**

- **AC1.9.1** — Given the icon picker opens, When Alex selects an icon, Then the choice uses ids from `GET /api/habit-icons`.

---

## US1.10 — View statistics for a date range `[As-built]` **Must Have**

As **Alex**, I want completion statistics between start and end dates, so that I can review progress.

**Acceptance criteria**

- **AC1.10.1** — Given Alex opens Statistics, When the default range applies (month start through **today** from `/api/me`), Then aggregates match `GET /api/statistics/{startDate}/{endDate}`.
- **AC1.10.2** — Given Alex adjusts the range, When both dates are valid, Then the view refreshes with API results. *(gap: statistics semantics vs scheduled days in domain doc.)*

---

## US1.11 — Log out `[As-built]` **Must Have**

As **Alex**, I want to log out, so that my JWT is cleared on shared devices.

**Acceptance criteria**

- **AC1.11.1** — Given Alex chooses Logout, When logout completes, Then stored JWT is cleared and login is required for protected routes.
- **AC1.11.2** — Given an expired JWT on any API call, When the client receives 401, Then interceptors clear session and redirect to login.

---

## US1.12 — Maintain traceable story coverage for requirements `[Intent-only]` **Must Have**

As **Morgan**, I want user stories and `traceability.json` to map every FR/NFR from requirements analysis, so that downstream domain design and delivery planning do not invent orphan scope.

**Acceptance criteria**

- **AC1.12.1** — Given requirements analysis is approved, When user stories close, Then every FR and NFR id appears in `traceability.json` with status OK, Deferred, N/A, or GAP justified.
- **AC1.12.2** — Given this intent's FR2 planning-only boundary, When Morgan reads as-built stories, Then no story implies mandatory application-repo merges for intent `260914-full-repo-scan`.

---

## US2.1 — Habit lifecycle (active / paused / archived) `[Backlog]` **Won't Have**

As **Alex**, I want to pause or archive habits per domain rules, so that inactive habits do not clutter daily tracking.

**Acceptance criteria (ideal, domain-aligned)**

- **AC2.1.1** — Given a habit in active state, When Alex pauses it, Then it does not appear on Track for new days until resumed. *(gap: entity lacks state/startDate vs `docs/domain.md`.)*

---

## US2.2 — Check-in window (today and yesterday in user TZ) `[Backlog]` **Won't Have**

As **Alex**, I want check-ins only for today or yesterday in my timezone, so that backdating matches product law.

**Acceptance criteria (ideal)**

- **AC2.2.1** — Given Alex's timezone from `/api/me`, When Alex selects a date outside today/yesterday, Then Track prevents check-in and explains the window. *(gap: client datepicker may lack minDate; server enforcement may differ from doc.)*

---

## US2.3 — Streak scheduling aligned to user today `[Backlog]` **Won't Have**

As **Alex**, I want streaks to reset and increment per domain scheduling tied to my calendar day, so that streak counts feel fair.

**Acceptance criteria (ideal)**

- **AC2.3.1** — Given Alex completes scheduled days, When user midnight passes in Alex's TZ, Then current/best streak updates per domain rules. *(gap: nightly cron vs user-relative scheduling.)*

---

## US2.4 — Statistics match scheduled-day semantics `[Backlog]` **Won't Have**

As **Alex**, I want statistics to count only scheduled days, so that reports match habit schedules.

**Acceptance criteria (ideal)**

- **AC2.4.1** — Given habits with schedules, When Alex views Statistics, Then counts exclude non-scheduled days per domain doc. *(gap: as-built range counts may differ.)*

---

## US2.5 — Consistent API error UX on login and track `[Backlog]` **Won't Have**

As **Alex**, I want visible errors when login or track mutations fail, so that I know what to fix.

**Acceptance criteria (ideal)**

- **AC2.5.1** — Given a failed login or track request, When the API returns `ErrorResponse`, Then the UI shows message text using the Settings timezone pattern.

---

## US2.6 — Regression tests for core paths `[Backlog]` **Won't Have**

As **Morgan**, I want automated tests for auth, track/untrack, timezone, and user-scoped data access, so that follow-up intents merge safely.

**Acceptance criteria (ideal)**

- **AC2.6.1** — Given a follow-up intent changes behavior, When tests run on `main`, Then touched paths include new or extended tests (team regression-safety posture).

---

## US2.7 — Refresh token or session renewal `[Backlog]` **Won't Have**

As **Alex**, I want to stay signed in without abrupt logout, so that daily tracking is frictionless.

**Acceptance criteria (ideal)**

- **AC2.7.1** — Given Alex is active before JWT expiry, When the token nears expiry, Then the client renews session without losing context. *(gap: no refresh flow today.)*

---

## INVEST notes

| Story | Independent | Negotiable | Valuable | Estimable | Small | Testable |
|-------|-------------|------------|----------|-----------|-------|----------|
| US1.x as-built | Mostly | Yes | Yes (documentation) | Yes | Yes | Yes (AC reference API/UI) |
| US2.x backlog | Yes | Yes | Yes (future) | Rough | Epic-sized | Yes (ideal AC flagged gap) |
| US1.12 intent-only | Yes | Yes | Yes (workflow) | Yes | Yes | Yes (traceability.json) |

## Dependencies

- US1.3 blocks US1.4–US1.6, US1.10 (today defaults)
- US1.1 blocks all other US1.x
- US2.x depend on follow-up intent approval, not on each other for this workflow
