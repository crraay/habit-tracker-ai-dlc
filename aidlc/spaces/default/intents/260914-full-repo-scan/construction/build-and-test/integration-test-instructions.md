# Integration test instructions — full-repo-scan

## Strategy

**Standard** strategy for this workflow; **FR2** forbids new integration suites in product repos this intent. Cross-layer checks are the **existing** Spring Boot integration/MockMvc tests and Angular component specs already in the sibling repositories.

## Backend (U1)

Covered by full Maven test run:

```powershell
cd habit-tracker-springboot
mvn -B test
```

Representative integration-style classes (non-exhaustive):

- `HabittrackerApplicationTests` — context load
- `UserClockControllerTest` — MockMvc + security filter chain
- `UserTimezonePersistenceTest`, `UserTodayTest`, `TimezoneUpdateLeavesLogDatesTest` — persistence + clock boundaries

No separate Testcontainers or Postgres requirement for the default test profile.

## Frontend (U2)

Co-located `*.spec.ts` files run via:

```powershell
cd habit-tracker-angular
npm run test:ci
```

Cross-component flows (login, track, settings) are **partially** covered; backlog US2.x items note sparse error-path coverage — follow-up Bolt **F2**.

## Compose / E2E (U3)

**Not executed** this intent (FR2.1; NFR2 compose changes out of scope). Follow-up Bolt **F3** documents manual smoke: nginx `/api` proxy, `docker compose up`, login path.

## Coverage expectation

Existing suites must stay **green** when run locally or on `main` CI. No new integration test files are added by this intent.
