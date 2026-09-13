# Code Structure

**Repo:** habit-tracker-springboot  
**Scan kind:** partial — see [reverse-engineering-timestamp.md](./reverse-engineering-timestamp.md)  
**Components:** [component-inventory.md](./component-inventory.md)

## Package / module organization

Single Maven module. Root package `com.kostya.habittracker`. Package-by-layer (not package-by-feature).

| Package | Role | This scan |
|---------|------|-----------|
| `controller` | REST adapters | Deep |
| `service` / `service.impl` | Application services | Impl deep; interfaces not separately listed |
| `entity` | JPA entities | Deep |
| `repository` | Spring Data | Deep (User, HabitLog, HabitAggregate; other repos present) |
| `dto` | Request/response shapes | Key files deep; remainder skimmed |
| `mapper` | Entity ↔ DTO | Skimmed |
| `config` | Security, seed, scheduling | Deep |
| `filter` | JWT (and correlation id, skimmed extras) | JwtRequestFilter deep |
| `security` | Auth entry/denied handlers | Skimmed |
| `scheduled` | Streak reset job | Deep |
| `model` | `UserDetails` principal | Deep |
| `exception` | `GlobalExceptionHandler` + types | Handler deep |
| `aspect` / `annotation` / `util` | Logging, helpers | Skimmed |
| `enums` | `UserStatus`, `UserRole` | Skimmed |

Resources: `src/main/resources/application.properties` (deep), `application-dev.properties` and `logback-spring.xml` (skimmed), Flyway `src/main/resources/db/migration/` V1–V5 (deep). Tests: `src/test/java/.../HabittrackerApplicationTests.java` and `src/test/resources/application-test.properties`.

## File classification (intent-relevant)

| Class | Path | Note |
|-------|------|------|
| Domain law | `docs/domain.md` | User clock + today; timezone change does not rewrite check-in dates |
| User persistence | `entity/User.java`, `repository/UserRepository.java` | No timezone field; repo is `save` + `findByUsername` |
| Check-in persistence | `entity/HabitLog.java`, `V1__init_schema.sql` | `date DATE` unique with `habit_id` |
| Check-in API | `controller/HabitTrackController.java`, `dto/HabitTrackRequest.java` | Client `LocalDate` + `@PastOrPresent` |
| Auth API | `controller/AuthController.java`, `dto/LoginResponse.java` | Token + expiry only |
| Seed | `config/DataInitializer.java` | `testuser` with no zone |
| Ops clock | `scheduled/StreakResetScheduler.java`, `config/SchedulingConfig.java` | `app.scheduling.timezone` |
| Errors | `exception/GlobalExceptionHandler.java` | `BadRequestException` → 400 |

## Code patterns

- Controller → service interface → `*ServiceImpl` → repository + mapper.
- Lombok on entities/DTOs; constructor injection on newer services (`HabitTrackServiceImpl`), field `@Autowired` on several controllers and the scheduler.
- Owner scoping via `findByIdAndUserId` / `findAllByUserId` on habits.
- Check-in uniqueness: DB unique `(habit_id, date)` plus service-level conflict if a log already exists.
- Audit superclass `BasicAudit` on entities.
- Stateless JWT: filter before `UsernamePasswordAuthenticationFilter`.

## Patterns vs intent

No user-clock type, validator, or controller. Adding timezone should stay on **User Identity** (column + repository persist) and a new authenticated resource, not on **Scheduling**. Check-in code should keep storing `HabitLog.date` as the local date the client (later, the window) supplies — not convert through the new zone.
