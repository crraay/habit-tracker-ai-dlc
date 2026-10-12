# Architecture — habit-tracker-springboot

## Architecture Analysis

### System Overview

A **layered monolith**: Spring Boot 3.5 hosts REST controllers, transactional services, Spring Data JPA repositories, and PostgreSQL (Flyway migrations). Stateless **JWT** secures `/api/**`; actuator and OpenAPI endpoints are public. One scheduled job resets streaks on a cron in a **single configured timezone**.

Cross-references: [component-inventory.md](./component-inventory.md), [code-structure.md](./code-structure.md), [business-overview.md](./business-overview.md).

### Architectural Style

| Style | Evidence |
|-------|----------|
| **Monolithic deployable** | Single Maven module, one JAR/Docker image |
| **Layered (ports & adapters lite)** | `controller` → `service` → `repository` → `entity`; DTOs + manual mappers at the edge |
| **Database-centric domain** | JPA entities are the persistence model; aggregates stored in `HabitAggregate` |

Not microservices, not event-driven; synchronous HTTP request/response only.

### Component Relationships

```mermaid
flowchart TB
  subgraph edge [Edge]
    C[REST Controllers]
    F[JWT + Correlation Filters]
    SEC[Spring Security Chain]
  end
  subgraph app [Application]
    S[Services]
    SCH[StreakResetScheduler]
  end
  subgraph data [Data]
    R[JPA Repositories]
    DB[(PostgreSQL)]
  end
  Client --> SEC --> F --> C --> S --> R --> DB
  SCH --> S
  S --> R
```

### Data Flow

- **Write path**: Controller validates DTO → service enforces user scope (mostly) → repository persists entity → mappers shape responses.
- **Read path**: Repository queries by user and/or date → service merges habits with log/aggregate state → DTO response.
- **Streak maintenance**: Inline updates on track/untrack plus nightly batch comparing `lastCheckInDate` to scheduler “today”.

### Key Design Decisions

1. **Stateless JWT** — No server sessions; `JwtRequestFilter` populates security context per request ([Security and JWT](./component-inventory.md#security-and-jwt)).
2. **Manual mappers** — No MapStruct; explicit mapping classes keep dependencies minimal.
3. **Validated schema** — `ddl-auto=validate` + Flyway V1–V6; schema is source of truth in SQL migrations.
4. **User timezone as column** — V6 adds timezone; clock service computes `today` without rewriting `HabitLog.date` (intentional immutability of logged dates).
5. **Global scheduler timezone** — `app.scheduling.timezone` drives cron “today”, not each owner’s zone (misalignment with domain doc).

### Improvement Opportunities

- Align check-in validation and streak reset with **per-user today** and domain lifecycle.
- Scope all log queries by **user** (see `HabitTrackServiceImpl.getTrackingList` risk in [code-quality-assessment.md](./code-quality-assessment.md)).
- Harden production bootstrap (disable dev `DataInitializer`, externalize secrets).
- Expand automated tests around habit CRUD, tracking, streaks, and auth edge cases.

## Interaction Diagrams

### Login and authenticated request

```mermaid
sequenceDiagram
  participant Client
  participant AuthController
  participant AuthService
  participant UserDetailsService
  participant JwtUtil
  participant JwtRequestFilter
  participant API as Protected Controller

  Client->>AuthController: POST /api/auth/login
  AuthController->>AuthService: authenticate(credentials)
  AuthService->>UserDetailsService: loadUserByUsername
  UserDetailsService-->>AuthService: UserDetails + status check
  AuthService->>JwtUtil: generateToken
  AuthService-->>Client: JWT body

  Client->>JwtRequestFilter: Authorization Bearer JWT
  JwtRequestFilter->>JwtUtil: parse & validate
  JwtRequestFilter->>API: SecurityContext set
  API->>API: @PreAuthorize / ownership checks
  API-->>Client: JSON response
```

### Habit CRUD (owner-scoped)

```mermaid
sequenceDiagram
  participant Client
  participant HabitController
  participant HabitService
  participant HabitRepository
  participant DB as PostgreSQL

  Client->>HabitController: POST /api/habit (JWT)
  HabitController->>HabitService: create(dto, principal)
  HabitService->>HabitRepository: save(habit with userId)
  HabitRepository->>DB: INSERT
  DB-->>Client: HabitResponse via mapper

  Client->>HabitController: GET /api/habit/{id}
  HabitController->>HabitService: getById(id, principal)
  HabitService->>HabitRepository: findById + user match
  alt not owner
    HabitService-->>Client: 404/403 via exception handler
  end
```

### Mark check-in (track)

```mermaid
sequenceDiagram
  participant Client
  participant HabitTrackController
  participant HabitTrackService
  participant HabitLogRepository
  participant AggregateService as HabitAggregate logic
  participant DB as PostgreSQL

  Client->>HabitTrackController: POST /api/habit-track
  HabitTrackController->>HabitTrackService: track(request, user)
  HabitTrackService->>HabitTrackService: validate habit ownership
  HabitTrackService->>HabitLogRepository: save log for date
  HabitTrackService->>AggregateService: applyTrack / recompute
  AggregateService->>DB: update HabitAggregate
  HabitTrackService-->>Client: HabitTrackResponse
```

### Daily tracking list

```mermaid
sequenceDiagram
  participant Client
  participant HabitTrackController
  participant HabitTrackService
  participant HabitRepository
  participant HabitLogRepository

  Client->>HabitTrackController: GET /api/habit-track/{date}
  HabitTrackController->>HabitTrackService: getTrackingList(date, user)
  HabitTrackService->>HabitRepository: habits for user
  HabitTrackService->>HabitLogRepository: findByDate(date)
  Note over HabitTrackService,HabitLogRepository: Logs not filtered by user — correctness risk
  HabitTrackService-->>Client: merged done flags per habit
```

### Streak reset (scheduled)

```mermaid
sequenceDiagram
  participant Cron as Spring Scheduler
  participant StreakResetScheduler
  participant Repository as HabitAggregateRepository
  participant DB as PostgreSQL

  Cron->>StreakResetScheduler: cron (app.scheduling.timezone)
  StreakResetScheduler->>StreakResetScheduler: today = zone date
  StreakResetScheduler->>Repository: findAggregatesNeedingStreakReset(today)
  loop each aggregate
    StreakResetScheduler->>Repository: reset current streak if lastCheckIn != today
  end
  Repository->>DB: UPDATE
```

### User clock (timezone / today)

```mermaid
sequenceDiagram
  participant Client
  participant UserClockController
  participant UserClockService
  participant UserRepository
  participant Clock as Configured Clock

  Client->>UserClockController: GET /api/me
  UserClockController->>UserClockService: getMe(user)
  UserClockService->>UserRepository: load timezone
  UserClockService->>Clock: now in user zone
  UserClockService-->>Client: today + timezone

  Client->>UserClockController: PATCH /api/me (timezone)
  UserClockController->>UserClockService: updateTimezone
  UserClockService->>UserRepository: persist (logs unchanged)
```
