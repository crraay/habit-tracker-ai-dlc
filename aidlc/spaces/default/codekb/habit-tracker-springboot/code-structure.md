# Code Structure — habit-tracker-springboot

## Repository Layout

| Path | Role |
|------|------|
| `pom.xml` | Maven build, Spring Boot 3.5.5 parent, dependencies; default Surefire via `spring-boot-starter-test` (no custom Surefire plugin) |
| `src/main/java/com/kostya/habittracker/` | All production code (68 sources) |
| `src/main/resources/application.properties` | Runtime config (DB, JWT, CORS, scheduling) |
| `src/main/resources/db/migration/` | Flyway V1–V6 |
| `src/test/java/` | Five test classes (see [Test layout](#test-layout)) |
| `src/test/resources/application-test.properties` | H2 profile, Flyway off, test JWT/CORS, springdoc disabled |
| `docs/domain.md` | Canonical domain contract (ahead of code in places) |
| `Dockerfile` | Multi-stage container build (`mvn -B -DskipTests package` in build stage) |
| `.github/workflows/` | CI test, image build, legacy EB deploy |

See [technology-stack.md](./technology-stack.md) and [dependencies.md](./dependencies.md).

## Package Organization

```
com.kostya.habittracker
├── HabittrackerApplication.java
├── controller/          # 6 REST controllers
├── service/ + service.impl/   # 7 interfaces, 8 implementations
├── repository/          # 5 Spring Data JPA repos
├── entity/              # User, Habit, HabitLog, HabitAggregate, HabitIcon, BasicAudit
├── dto/                 # Request/response records or classes
├── mapper/              # 5 manual mappers
├── config/              # Security, JPA, OpenAPI, scheduling, clock, DataInitializer
├── filter/              # JwtRequestFilter, correlation id
├── security/            # Auth entry/denied handlers
├── exception/           # Domain exceptions + GlobalExceptionHandler
├── scheduled/           # StreakResetScheduler
├── aspect/              # @LogExecution AOP
├── util/                # JwtUtil
├── enums/               # UserStatus, UserRole
└── model/               # UserDetails wrapper
```

## Layering Conventions

- **Controllers** — `@RestController`, OpenAPI tags, delegate to services; some use field `@Autowired`, others constructor injection (`@RequiredArgsConstructor` inconsistency).
- **Services** — `@Transactional` boundaries; user id from `Authentication` / principal.
- **Repositories** — Spring Data interfaces; custom queries for aggregates and streak reset.
- **Mappers** — Static or component mappers entity ↔ DTO (no code generation).

## Configuration & Cross-Cutting

- **Security**: `WebSecurityConfig` — stateless session, JWT filter order, CORS from env, permit actuator/swagger/auth login.
- **Persistence**: JPA with `ddl-auto=validate`; entities use Lombok and `BasicAudit` where applicable.
- **Observability**: Actuator health; correlation-id filter for request tracing.
- **Dev seed**: `DataInitializer` ensures `testuser` exists on startup.

## Database Evolution

Flyway migrations define users, habits, logs, aggregates, icons, and user timezone (V6). Schema is the integration point for all services ([architecture.md](./architecture.md)).

## Test Layout

Tests mirror main package under `src/test/java/com/kostya/habittracker/`:

| Class | Style | Focus |
|-------|--------|--------|
| `HabittrackerApplicationTests` | `@SpringBootTest`, `@ActiveProfiles("test")` | Context load |
| `UserClockControllerTest` | `@WebMvcTest` | `/api/me` MVC (4 methods) |
| `UserTodayTest` | Unit + `@BeforeEach` | Domain “today” in user TZ |
| `UserTimezonePersistenceTest` | `@SpringBootTest` | Timezone column persistence |
| `TimezoneUpdateLeavesLogDatesTest` | `@SpringBootTest` | Log dates unchanged on TZ update |

All profile-sensitive tests use `@ActiveProfiles("test")`. **~11** `@Test` methods total. Habit CRUD, track/untrack, streaks, and auth beyond clock are largely untested ([code-quality-assessment.md](./code-quality-assessment.md)).

## Agent / Docs Conventions

- `AGENTS.md`, `README.md`, `DOCKER.md` — human and agent onboarding; `AGENTS.md` documents `build-and-test.yml` for CI tests and production image via `build-image`.
- `.cursor/rules/habit-domain.mdc` — points agents to `docs/domain.md`.
