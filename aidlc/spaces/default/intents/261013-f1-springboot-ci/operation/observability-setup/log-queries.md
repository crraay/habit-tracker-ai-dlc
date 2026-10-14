# Log queries — F1 springboot CI (as-built)

Operator **shell patterns** and **GitHub log navigation** — not CloudWatch Insights / Loki.

## Sources

- `habit-tracker-springboot` Logback → stdout
- `GlobalExceptionHandler` / `ErrorResponse.correlationId`

## Log locations

| Source | Stream | Retention |
|--------|--------|-----------|
| backend (prod) | `docker compose logs backend` | Host/docker rotation |
| frontend | nginx logs in container | Same |
| postgres | container stdout | Same |
| **CI** | GitHub Actions job log for `build-image` | Per GitHub policy |

## Production queries (droplet)

```bash
# Errors (30m)
docker compose logs backend --since 30m 2>&1 | grep -iE 'ERROR|Exception'

# Flyway / startup
docker compose logs backend --since 10m 2>&1 | grep -iE 'Flyway|Started '

# correlationId from API error JSON
docker compose logs backend --since 1h 2>&1 | grep 'cid=<id-from-response>'
```

## CI queries (F1 — GitHub UI)

1. Open **habit-tracker-springboot** → **Actions** → **build-image** run.
2. Expand **Run tests** — search log for `BUILD FAILURE`, `Tests run:`, `There are test failures`.
3. Confirm later steps **Log in to Docker Hub** did **not** run if tests failed (FR1.1).

## Secret hygiene

Do not paste JWT, passwords, or Docker tokens into tickets; GHA masks secrets in logs.

**Artifact revision:** 2026-10-14T19:17+07 — post-confirmation save.
