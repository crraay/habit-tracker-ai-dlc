# Intent Statement

## Problem Statement

Habit Tracker users get the wrong calendar day for “today” because the app uses the browser or server clock instead of the user’s IANA timezone (a named zone such as `Europe/Berlin`, not a clock offset). [Q1][Q7]

The work is to implement that feature on both the backend and the frontend. [desc][Q5]


## Target Customer

Both audiences are in scope: end users feel the wrong day; maintainers need backend and frontend to share one timezone/today contract. [Q2]

## Success Metrics

Success is true when all of the following hold: [Q3][Q7]

- Every user has a required IANA timezone. [Q3][Q7]
- Existing accounts are backfilled to `UTC` as a documented migration default, not a product timezone; the user can change it, and the field is not hidden. [Q6][Q7]
- Today is the calendar date in `user.timezone`, not server local time, not UTC, not the browser clock. [Q7]
- The API returns `today` in that zone. [Q3][Q7]
- Track and statistics use that `today` from the API, not `new Date()` or the client clock. [Q3][Q7]
- The user can view and change timezone; invalid save surfaces the API error. [Q3][Q7]
- Existing check-in local dates do not rewrite when timezone changes. [Q3][Q7]
- Backend tests lock timezone and today, including: a user without a valid timezone cannot be persisted after migration; `today` at a known instant differs for `America/New_York` vs `Asia/Bangkok`; timezone update does not change existing log dates. [Q3][Q7]
- `docs/domain.md` stays unchanged. [Q3][Q7]
- Both backend and frontend ship. [Q3][desc]
- Check-in today/yesterday window, idempotency, startDate, streak rule, pause/archive, statistics 7/30, and rename status → done stay out of this package. [Q7]

## Initiative Trigger

The trigger is the wrong-calendar-day pain named in issue 14: “today” is taken from the browser or server clock instead of the user’s IANA timezone. [Q1]

## Initial Scope Signal

- Workflow-selected process: `poc` (short process). [scope]
- User-confirmed product boundary: issue 14 only (user timezone and server today, backend and frontend). The rest of epic 13 is out of this piece of work. [Q5]
- Confirmed issue-14 law for this package is the imported ticket body in [Q7], including the UTC backfill in [Q6]. [Q6][Q7]

## Assumptions & Open Questions

None.
