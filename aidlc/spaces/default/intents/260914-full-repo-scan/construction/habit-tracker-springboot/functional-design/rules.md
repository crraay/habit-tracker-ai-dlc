# Business rules — unit `habit-tracker-springboot`

Categories: **implemented** (enforced in code today) and **backlog** (domain/US2 target; non-enforcing for as-built).

## Source of truth

```yaml
rules:
  - id: BR1.1
    category: implemented
    statement: Valid active USER credentials yield a signed JWT and expiry seconds.
    rule_category: authorization
    applies_to: [Authentication, User]
    trigger: POST /api/auth/login with LoginRequest
    logic: IF user exists AND password matches AND status is ACTIVE AND role is USER THEN issue JWT with configured TTL ELSE reject with UnauthorizedException (generic invalid credentials message on bad user/password).
    violation: HTTP 401 ErrorResponse
    source: [AC1.1.1, FR1.1]

  - id: BR1.2
    category: implemented
    statement: Non-active or wrong-role accounts cannot obtain a token.
    rule_category: authorization
    applies_to: [Authentication, User]
    trigger: Login attempt
    logic: IF status != ACTIVE OR role != USER THEN UnauthorizedException with specific message.
    violation: HTTP 401 ErrorResponse
    source: [AC1.1.2]

  - id: BR2.1
    category: implemented
    statement: Authenticated user receives today and timezone from stored IANA zone.
    rule_category: calculation
    applies_to: [BackendUserClock, User]
    trigger: GET /api/me
    logic: IF authenticated THEN compute LocalDate today using injected Clock in user.timezone ELSE 401 via security filter.
    violation: HTTP 401 when unauthenticated
    source: [AC1.3.1]

  - id: BR2.2
    category: implemented
    statement: Timezone updates accept only known IANA identifiers.
    rule_category: validation
    applies_to: [BackendUserClock, User]
    trigger: PUT /api/me with timezone
    logic: IF zone id blank or not in ZoneId.getAvailableZoneIds() THEN BadRequestException ELSE persist and return updated clock response.
    violation: HTTP 400 ErrorResponse
    source: [AC1.3.2]

  - id: BR3.1
    category: implemented
    statement: Habit CRUD is scoped to the authenticated user.
    rule_category: authorization
    applies_to: [BackendHabitManagement, Habit]
    trigger: POST/PUT/DELETE/GET /api/habit*
    logic: IF habit.user.id != currentUser.id THEN treat as not found or forbidden per repository lookup pattern.
    violation: HTTP 404 NotFoundException for cross-user habit id
    source: [AC1.7.1, AC1.7.2, AC1.8.1]

  - id: BR3.2
    category: implemented
    statement: New habits may reference an optional catalog icon by id.
    rule_category: constraint
    applies_to: [BackendHabitManagement, HabitIcon]
    trigger: Habit create/update with iconId
    logic: IF iconId provided THEN must resolve to existing HabitIcon (as implemented in service layer).
    violation: HTTP 404 or validation error per implementation
    source: [AC1.9.1]

  - id: BR4.1
    category: implemented
    statement: Track board data lists all habits for the user with done flag for requested date.
    rule_category: calculation
    applies_to: [BackendCheckInTracking, Habit, HabitLog]
    trigger: GET /api/habit-track/{date}
    logic: Load habits by user id; mark done when a HabitLog exists for (habit, date).
    violation: N/A (read)
    source: [AC1.4.1]

  - id: BR4.2
    category: implemented
    statement: Track creates at most one log per habit per date for owned habits.
    rule_category: validation
    applies_to: [BackendCheckInTracking, HabitLog]
    trigger: POST /api/habit-track
    logic: IF habit not owned by user THEN NotFoundException; IF log already exists THEN ConflictException; ELSE create log and update aggregate.
    violation: HTTP 404 or 409 ErrorResponse
    source: [AC1.5.1]

  - id: BR4.3
    category: implemented
    statement: Untrack removes an existing log for owned habit and date.
    rule_category: constraint
    applies_to: [BackendCheckInTracking, HabitLog]
    trigger: DELETE /api/habit-track
    logic: IF no log THEN ConflictException; ELSE delete and recompute aggregate.
    violation: HTTP 409 ErrorResponse
    source: [AC1.6.1]

  - id: BR5.1
    category: implemented
    statement: Successful track updates streak counters on contiguous calendar-day check-ins.
    rule_category: calculation
    applies_to: [BackendStreakAndAggregate, HabitAggregate]
    trigger: applyTrack after log insert
    logic: IF first check-in THEN streak=1; ELIF date is previous+1 day THEN increment current and maybe best; ELIF gap THEN reset current to 1; ELSE recompute from full log history.
    violation: N/A (internal consistency)
    source: [AC1.5.1]

  - id: BR5.2
    category: implemented
    statement: Scheduled job resets current streak for habits missing expected check-in relative to job today.
    rule_category: calculation
    applies_to: [BackendStreakAndAggregate, StreakResetScheduler]
    trigger: Cron job (default 23:55 in app.scheduling.timezone, not per-user zone)
    logic: IF enabled THEN find aggregates needing reset for job LocalDate today and set currentStreak=0, streakStartDate=null.
    violation: Logged error; no API surface
    source: [AC1.5.1]

  - id: BR6.1
    category: implemented
    statement: Statistics count check-ins per habit in inclusive date range for current user.
    rule_category: calculation
    applies_to: [BackendStatistics]
    trigger: GET /api/statistics/{startDate}/{endDate}
    logic: totalDays = inclusive day count; completions = logs in range grouped by habit; include habits with zero completions.
    violation: N/A (read)
    source: [AC1.10.1, AC1.10.2]

  - id: BR7.1
    category: implemented
    statement: Icon catalog is read-only for authenticated clients.
    rule_category: policy
    applies_to: [BackendHabitIconCatalog]
    trigger: GET /api/habit-icons
    logic: Return active icons list (as implemented in service/repository).
    violation: HTTP 401 if unauthenticated
    source: [AC1.9.1]

  - id: BR8.1
    category: implemented
    statement: All /api/* except auth, health, swagger require valid Bearer JWT.
    rule_category: authorization
    applies_to: [BackendAuthentication, WebSecurityConfig]
    trigger: Any protected HTTP request
    logic: IF no valid JWT THEN RestAuthenticationEntryPoint JSON 401; IF authenticated but denied THEN 403 handler.
    violation: HTTP 401/403 ErrorResponse
    source: [FR1.1, C1]

  - id: BR8.2
    category: implemented
    statement: Habit and log mutations resolve habit by id AND owner user id.
    rule_category: authorization
    applies_to: [BackendHabitManagement, BackendCheckInTracking]
    trigger: Track/untrack/habit mutate
    logic: Repository findByIdAndUserId; absence yields NotFoundException.
    violation: HTTP 404
    source: [AC1.7.1, AC1.5.1, AC1.6.1]

  - id: BR9.1
    category: implemented
    statement: API errors return stable ErrorResponse with correlationId when present in MDC.
    rule_category: policy
    applies_to: [GlobalExceptionHandler]
    trigger: Uncaught domain or validation exceptions
    logic: Map exception type to HTTP status; populate status, error, message, path, correlationId, timestamp.
    violation: N/A
    source: [AC2.5.1 partial backend, team mandate]

  - id: BR10.1
    category: backlog
    enforcement: non-enforcing
    statement: Habits support active/paused/archived lifecycle per docs/domain.md.
    rule_category: policy
    applies_to: [Habit]
    trigger: Pause/archive/resume (not implemented)
    logic: IF paused/archived THEN exclude from track board for new days until resumed.
    violation: N/A today
    source: [AC2.1.1, US2.1, docs/domain.md]

  - id: BR11.1
    category: backlog
    enforcement: non-enforcing
    statement: Check-ins allowed only for today or yesterday in the user's timezone.
    rule_category: validation
    applies_to: [BackendCheckInTracking]
    trigger: POST track with date
    logic: IF date not in {userToday, userToday-1} THEN reject with clear error.
    violation: Would be HTTP 400 (not enforced as-built)
    source: [AC1.5.2, AC2.2.1, docs/domain.md]

  - id: BR12.1
    category: backlog
    enforcement: non-enforcing
    statement: Streak reset runs at each user's local midnight.
    rule_category: calculation
    applies_to: [BackendStreakAndAggregate]
    trigger: User-relative scheduler
    logic: Per-user TZ boundary updates streak counters per domain rules.
    violation: N/A today
    source: [AC2.3.1, US2.3]

  - id: BR13.1
    category: backlog
    enforcement: non-enforcing
    statement: Statistics exclude non-scheduled days when habits carry schedules.
    rule_category: calculation
    applies_to: [BackendStatistics]
    trigger: Range aggregation
    logic: Denominator and completions reflect scheduled days only.
    violation: N/A today
    source: [AC2.4.1, docs/domain.md]

  - id: BR14.1
    category: backlog
    enforcement: non-enforcing
    statement: Refresh token or silent renewal before JWT expiry.
    rule_category: authorization
    applies_to: [Authentication]
    trigger: Near-expiry session
    logic: Issue renewed token without full re-login.
    violation: N/A today
    source: [AC2.7.1, US2.7]
```

## Summary

| Id | Category | One-line |
|----|----------|----------|
| BR1.1–BR1.2 | implemented | Login and JWT issuance |
| BR2.1–BR2.2 | implemented | User clock and timezone validation |
| BR3.1–BR3.2 | implemented | User-scoped habit CRUD and icons |
| BR4.1–BR4.3 | implemented | Track board, track, untrack |
| BR5.1–BR5.2 | implemented | Streak math and cron reset |
| BR6.1 | implemented | Range statistics |
| BR7.1 | implemented | Icon catalog read |
| BR8.1–BR8.2 | implemented | JWT gate and ownership |
| BR9.1 | implemented | ErrorResponse mapping |
| BR10.1–BR14.1 | backlog | Domain/US2 gaps (lifecycle, window, user cron, scheduled stats, refresh) |
