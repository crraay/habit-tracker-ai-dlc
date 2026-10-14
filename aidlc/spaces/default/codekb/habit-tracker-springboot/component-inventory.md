# Component Inventory — habit-tracker-springboot

Components are logical building blocks in the monolith. Dependencies flow downward: adapters → services → persistence.

## REST API Adapters

| Piece | Responsibility | Depends on |
|-------|----------------|------------|
| `AuthController` | Login endpoint | Authentication Services |
| `HabitController` | Habit CRUD | Habit Management Service |
| `HabitTrackController` | Check-in list/track/untrack | Check-in Tracking Service |
| `HabitStatisticsController` | Range statistics | Statistics Service |
| `HabitIconController` | Icon catalog read | Habit Icon Service |
| `UserClockController` | `/api/me` today & timezone | User Clock Service |

**Test coverage (focused scan)**: `UserClockControllerTest` (`@WebMvcTest`) exercises `/api/me` only among adapters.

## Authentication Services

| Piece | Responsibility | Depends on |
|-------|----------------|------------|
| `AuthServiceImpl` | Credential check, JWT issuance | Security and JWT, Persistence Layer |
| `UserDetailsServiceImpl` | Load user for Spring Security | Persistence Layer |
| `RestAuthenticationEntryPoint` / `RestAccessDeniedHandler` | JSON error responses | — |

## Security and JWT

| Piece | Responsibility | Depends on |
|-------|----------------|------------|
| `WebSecurityConfig` | Filter chain, CORS, permit rules | Security and JWT |
| `JwtRequestFilter` | Parse Bearer token, set context | Security and JWT |
| `JwtUtil` | Token create/parse (JJWT) | — |
| Correlation id filter | Request tracing header | — |

## Habit Management Service

| Piece | Responsibility | Depends on |
|-------|----------------|------------|
| `HabitService` / impl | CRUD, user ownership | Persistence Layer, Domain Entities |
| `HabitMapper` | Entity ↔ DTO | Domain Entities |

## Check-in Tracking Service

| Piece | Responsibility | Depends on |
|-------|----------------|------------|
| `HabitTrackService` / impl | Track/untrack, tracking list | Persistence Layer, Streak and Aggregate Service |
| `HabitTrackMapper` | Response shaping | Domain Entities |

## Statistics Service

| Piece | Responsibility | Depends on |
|-------|----------------|------------|
| `HabitStatisticsService` / impl | Count completions in date range | Persistence Layer |

## User Clock Service

| Piece | Responsibility | Depends on |
|-------|----------------|------------|
| `UserClockService` / impl | Compute today in user TZ, update timezone | Persistence Layer, Infrastructure Configuration |

**Test coverage (focused scan)**: `UserTodayTest`, clock-related integration tests.

## Habit Icon Service

| Piece | Responsibility | Depends on |
|-------|----------------|------------|
| `HabitIconService` / impl | List active icons | Persistence Layer |

## Streak and Aggregate Service

| Piece | Responsibility | Depends on |
|-------|----------------|------------|
| Aggregate logic in track service + repository queries | `applyTrack`, recompute, streak fields | Persistence Layer, Scheduled Jobs |
| `StreakResetScheduler` | Nightly streak reset batch | Persistence Layer, Infrastructure Configuration |

## Persistence Layer

| Piece | Responsibility | Depends on |
|-------|----------------|------------|
| `UserRepository`, `HabitRepository`, `HabitLogRepository`, `HabitAggregateRepository`, `HabitIconRepository` | CRUD and custom queries | PostgreSQL (via JPA) |
| Flyway migrations V1–V6 | Schema versioning | PostgreSQL |

**Test coverage (focused scan)**: `UserTimezonePersistenceTest`, `TimezoneUpdateLeavesLogDatesTest` (H2, Flyway disabled in test profile).

## Domain Entities

| Entity | Responsibility |
|--------|----------------|
| `User` | Credentials, role, status, timezone |
| `Habit` | User-owned habit definition |
| `HabitLog` | Check-in on a date |
| `HabitAggregate` | Streak counters, last check-in date |
| `HabitIcon` | Icon metadata |
| `BasicAudit` | Created/updated metadata mixin |

## Infrastructure Configuration

| Piece | Responsibility |
|-------|----------------|
| `JpaConfig`, clock beans | JPA and time source |
| `OpenApiConfig` | springdoc metadata |
| `SchedulingConfig` | Enable cron |
| `DataInitializer` | Dev user seed (production risk) |
| `LogExecutionAspect` | Optional method logging |
| `application-test.properties` | H2, test JWT, disabled Flyway/springdoc for Surefire |

## External Systems

| System | Integration |
|--------|-------------|
| PostgreSQL | JDBC via Spring Boot datasource |
| Docker Hub | CI pushes `docker.io/crraay/habit-tracker-springboot:latest` via `build-image.yml` on `main` |
| GitHub Actions | `build-image.yml` (publish, skip tests), `build-and-test.yml` (test + JAR artifact), legacy EB workflow |

See [dependencies.md](./dependencies.md) for library-level dependencies.
