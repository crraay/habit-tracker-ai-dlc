# Code Quality Assessment

**Repo:** habit-tracker-springboot  
**Scan kind:** partial — quality signals recorded here. Stack/CI versions: [technology-stack.md](./technology-stack.md). Debt that is architectural is also in [architecture.md](./architecture.md).

## Tests

| Item | Finding |
|------|---------|
| Directories | `src/test/java/com/kostya/habittracker/`, `src/test/resources/` |
| Frameworks | JUnit 5 via `spring-boot-starter-test`; `@SpringBootTest` + `@ActiveProfiles("test")` |
| Coverage config | Absent (no JaCoCo / Surefire coverage plugin) |
| What exists | `HabittrackerApplicationTests.contextLoads` only |
| Timezone / today / User tests | **None** |

Test profile: H2, `ddl-auto=create-drop`, **Flyway disabled**. A NOT NULL timezone migration will not execute unless the suite changes strategy. Tests that must lock “unknown IANA → 400”, “today at instant”, and “timezone update does not rewrite `habit_log.date`” do not exist.

Org testing posture (no team affirmation): PoC scope keeps the existing suite green; issue 14 still needs targeted tests because domain law requires them as the executable copy (`docs/domain.md` Authority).

## Linting

No Checkstyle, Spotless, PMD, or EditorConfig in the repo or POM.

## CI/CD

- Deep: `.github/workflows/build-and-test.yml` — compile + test + package, Java 17 Corretto.
- Skimmed: `build-image.yml`; `deploy-to-elastic-beanstalk.yml` (legacy per `AGENTS.md`). Production path is compose, not this scan.

## Documentation

Present: `README.md`, `DOCKER.md`, `AGENTS.md`, `HELP.md` (skimmed), **`docs/domain.md` (deep, authoritative)**. Domain glossary already names `timezone` Missing and `today` not on the user. Code comments are sparse; TODOs on `application.properties` (env params), `LoginRequest` min-length, `HabitLogRepository` execution plan.

## Technical debt (intent-relevant first)

1. **User clock absent** — `User` and Flyway V1–V5 have no IANA timezone; no GET/PATCH; `UserRepository` is save + findByUsername; seed has no zone.
2. **Two clocks** — only `ZoneId` usage is ops `app.scheduling.timezone`. Easy to misuse as user today. Do not.
3. **Check-in date is client-trusted** — `@PastOrPresent` is JVM, not `user.timezone`. Package 2 owns the window; this package must still ship server `today`.
4. **Test/Flyway split** — migrations are not the test schema source.
5. **Glossary drift** — `HabitTrackResponse.status` means day done; statistics path `{startDate}` means range-from. Do not “fix” in issue 14.
6. **Streak job vs live-streak law** — out of package.

## Brownfield blast radius (issue 14)

| Touch | Impact |
|-------|--------|
| New Flyway Vn + `User.timezone` | Medium — entity, seed, all future user reads |
| New authenticated user-clock API | Medium — new types; security already authenticates any new path |
| `UserRepository` persist | Low–medium — seed + update |
| `habit_log` / track services | **Must stay write-free** for timezone change |
| Scheduling / streak | **Out of package** |
| Test profile | Medium if Flyway must run for migration tests |

Rollback: drop the new API and revert the migration only if it has not been applied to a durable DB; after apply, reversing NOT NULL/backfill is a new migration, not a silent edit.
