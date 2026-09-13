# Integration test instructions — timezone-today

## Strategy

Active test strategy is **Minimal**. This file is not an extra integration suite. Cross-layer checks that already exist are the Spring `@SpringBootTest` / `@WebMvcTest` tests listed in Code Generation unit-test instructions (`TimezoneUpdateLeavesLogDatesTest`, `UserClockControllerTest`, `HabittrackerApplicationTests`).

## How to run

Covered by the backend Maven command in `build-instructions.md` and `unit-test-instructions.md`. No separate integration runner.

## Coverage

No extra integration coverage floor (`poc` + Minimal). Existing suite must stay green (NFR4).
