# Intent Capture Questions

## Sources

- [desc] Initial description: "i want you to implement feature, described in this ticket https://github.com/crraay/habit-tracker-springboot/issues/14 . implementation should contain both backend and frontend parts."
- [scope] Workflow-selected scope: `poc`.

## Q1. What business problem are we solving, and why now?

Issue 14 is titled “user timezone and server today.” Success later depends on naming the actual pain, not only the ticket number.

A. Habit Tracker users get the wrong calendar day for “today” because the app uses the browser or server clock instead of the user’s IANA timezone (the domain-v1 package in issue 14)
B. Users cannot view or change their timezone, and that missing control is the primary pain
C. This is internal alignment with the domain contract, not a distinct user-facing problem
D. Not yet defined
E. Not applicable
X. Other (please specify)

[Answer]: A. Habit Tracker users get the wrong calendar day for “today” because the app uses the browser or server clock instead of the user’s IANA timezone (the domain-v1 package in issue 14)

## Q2. Who is the customer, and what pain are they experiencing?

We need a named beneficiary so later stages do not invent a second audience.

A. Existing Habit Tracker end users — they see the wrong “today” on track and statistics, and cannot set timezone
B. Internal maintainers of the Spring Boot and Angular apps — they need both sides to follow the same “today” rule
C. Both: end users feel the wrong day; maintainers need backend and frontend to share one timezone/today contract
D. Not identified
E. Not applicable
X. Other (please specify)

[Answer]: C. Both: end users feel the wrong day; maintainers need backend and frontend to share one timezone/today contract

## Q3. What does success look like for this piece of work?

These options are the done-when bar we will treat as success if you confirm one. Pick the outcome that must be true when we stop.

A. Every user has a required IANA timezone; the API returns `today` in that zone; track and statistics use that `today`; the user can change timezone; existing check-in dates do not rewrite; backend tests lock timezone and today; `docs/domain.md` stays unchanged; both backend and frontend ship
B. Same as A, except frontend-only is enough for this pass (backend can wait)
C. Same as A, except backend-only is enough for this pass (frontend can wait)
D. Not yet defined
E. Not applicable
X. Other (please specify)

[Answer]: A. Every user has a required IANA timezone; the API returns `today` in that zone; track and statistics use that `today`; the user can change timezone; existing check-in dates do not rewrite; backend tests lock timezone and today; `docs/domain.md` stays unchanged; both backend and frontend ship

## Q4. Who are the stakeholders, who decides scope, and is there a reporting cadence?

Intent capture needs decision-makers versus influencers, and any communication requirement. “None” is valid.

A. You decide scope and priority; no other stakeholders; no reporting cadence beyond this workflow
B. You decide; GitHub issue 14 (parent epic 13) is the only communication surface; no other named stakeholders
C. A separate product owner decides; engineering influences; no extra reporting cadence
D. Not identified
E. None
X. Other (please specify)

[Answer]: B. You decide; GitHub issue 14 (parent epic 13) is the only communication surface; no other named stakeholders

## Q5. The workflow is using a short process (`poc`). Does that match the product boundary you want built?

This distinguishes the process size we already approved from what “the feature” includes. Confirming here keeps later stages from expanding into the rest of epic 13.

A. Product boundary is issue 14 only (user timezone and server today, backend and frontend). The short process is fine
B. Product boundary is issue 14 only, but I want a fuller process than the short one we picked
C. Product boundary is the whole domain-v1 epic (issue 13), not just this timezone/today package
D. Not yet defined
E. Not applicable
X. Other (please specify)

[Answer]: A. Product boundary is issue 14 only (user timezone and server today, backend and frontend). The short process is fine

## Q6. What IANA timezone are existing users backfilled to?

Gate revision for R-01: existing accounts need a documented default.

A. UTC (migration backfill only, not the product timezone; the user can change it)
B. Asia/Bangkok
C. America/New_York
D. Not yet defined
E. Not applicable
X. Other (please specify)

[Answer]: A. UTC (migration backfill only, not the product timezone; the user can change it)

## Q7. Which additional issue-14 outcomes are in the product boundary?

Gate revision for R-02: import the ticket body so later stages may cite it.

A. Import the issue 14 body below as confirmed in-scope / out-of-scope law for this package
B. Do not import the ticket body; keep only the Q3 checklist
C. Not yet defined
D. Not applicable
E. None
X. Other (please specify)

[Answer]: A. Import the issue 14 body below as confirmed in-scope / out-of-scope law for this package. Parent epic: #13. Depends on nothing (first package). Contract (`docs/domain.md` — User and “today”, Glossary timezone/today): every user must have an IANA timezone; today is the calendar date in user.timezone, not server local time, not UTC, not the browser clock; changing timezone does not rewrite existing check-in local dates. Current: User has no timezone; Track UI uses new Date() as today; datepicker maxDate is the browser clock; statistics range uses date-fns on the client clock; streak job uses app.scheduling.timezone (default Asia/Bangkok) — do not treat that as the user clock; do not fix streak in this package. Backend: add required IANA timezone on the user (Flyway); reject unknown zone ids; existing rows backfill to an explicit documented default (UTC per Q6), then keep NOT NULL; default is a migration choice, not a product timezone; authenticated API to read timezone + today and to update timezone; after a timezone change, subsequent today uses the new zone; old habit_log.date values stay; check-in today/yesterday interpretation waits for package 2; this package at least exposes today so the client can stop inventing it; job/scheduler timezone is ops, not user domain; leave streak job for package 4. Tests (non-exhaustive): user without valid timezone cannot be persisted after migration; today at a known instant differs for America/New_York vs Asia/Bangkok; timezone update does not change existing log dates. Frontend: do not use new Date() as domain today for track/statistics/check-in; use today from the API; settings (or equivalent): view + change IANA timezone; invalid save must surface the API error; if timezone is the backfill default, the user must be able to change it; do not hide the field; display formatting (weekday names) may stay locale-based; the date identity of today must match the server. Done when: user has required IANA timezone and API returns today in that zone; UI track/statistics treat that today as the domain day; user can change timezone and history dates do not rewrite; backend tests lock timezone + today; docs/domain.md unchanged. Out of scope: check-in window, idempotency, startDate, streak rule, pause/archive, statistics 7/30, rename status → done.

## Consolidated Summary Confirmation

Does this all look correct before I generate the artifact?

- Looks correct
- Request changes

[Answer]: Looks correct

