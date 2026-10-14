# Test Results — F1 build-and-test execution

**Executed:** 2026-10-14 (local, Windows, JDK 17)  
**Repository:** `habit-tracker-springboot`

## Build

| Command | Exit code | Result |
|---------|-----------|--------|
| `.\mvnw.cmd -f pom.xml test` | 0 | SUCCESS |
| `.\mvnw.cmd -f pom.xml package -DskipTests` | 0 | SUCCESS — JAR produced |

## Unit tests (Surefire)

| Metric | Value |
|--------|-------|
| Tests run | 11 |
| Failures | 0 |
| Errors | 0 |
| Skipped | 0 |

**Classes executed:** `HabittrackerApplicationTests`, `TimezoneUpdateLeavesLogDatesTest`, `UserClockControllerTest`, `UserTimezonePersistenceTest`, `UserTodayTest`.

## Integration / performance / security

Not applicable for Minimal strategy on this intent (no instruction files generated).

## Static CI checks (workflow / Dockerfile)

| Check | Result |
|-------|--------|
| `build-image.yml`: `mvn -B test` before Docker steps | Pass (review) |
| `Dockerfile`: `mvn -B test package` in build stage | Pass (review) |
| `deploy-to-elastic-beanstalk.yml`: no `push: main` | Pass (review) |

## Coverage

Not collected (no JaCoCo gate per NFR3).

## Target Verification Matrix

Final verdicts match `build-and-test-summary.md` — all applicable targets **Met**; no `Pending` or `Unverified` rows.

## Failures

None.
