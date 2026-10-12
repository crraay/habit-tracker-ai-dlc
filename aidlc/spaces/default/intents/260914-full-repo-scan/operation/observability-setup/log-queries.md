# Log queries — full-repo-scan (as-built)

Intent `260914-full-repo-scan` · Saved queries are **operator shell patterns** for `docker compose logs`, not CloudWatch Logs Insights or Loki queries.

## Sources

- U1 `monitoring-design.md` — Logback stdout, secret hygiene
- `GlobalExceptionHandler` / `ErrorResponse.correlationId`

## Log locations

| Service | Stream | Format |
|---------|--------|--------|
| backend | container stdout/stderr | Plain text Logback |
| frontend | container stdout/stderr | nginx access/error |
| postgres | container stdout/stderr | postgres logs |

**Retention:** ephemeral unless host configures Docker log rotation or external ship (NFR6.14 not implemented).

## Saved queries (operator)

Replace time window as needed; run from `DEPLOY_COMPOSE_DIR`.

### Backend — errors and exceptions

```bash
docker compose logs backend --since 30m 2>&1 | grep -iE 'ERROR|Exception|WARN'
```

### Backend — Flyway / startup

```bash
docker compose logs backend --since 10m 2>&1 | grep -iE 'Flyway|Migration|Started HabitTracker'
```

### Backend — scheduler / streak (backlog focus NFR6.16)

```bash
docker compose logs backend --since 24h 2>&1 | grep -iE 'scheduler|streak|Scheduler'
```

### Backend — find line by correlationId

```bash
# Use ID from browser/API error JSON
CORR='xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
docker compose logs backend --since 2h 2>&1 | grep "$CORR"
```

### Postgres — connection / auth issues

```bash
docker compose logs postgres --since 30m 2>&1 | grep -iE 'FATAL|ERROR|authentication'
```

### Frontend — nginx 5xx / upstream errors

```bash
docker compose logs frontend --since 30m 2>&1 | grep -iE 'error|upstream|502|503'
```

### All services — deploy window

```bash
docker compose logs --since 15m --timestamps
```

## Security hygiene

- Do **not** grep for or paste `JWT_SECRET`, passwords, or full `Authorization` headers into tickets.
- Redact tokens if sharing log excerpts.

## Future aggregation (non-binding)

| ID | Query platform |
|----|----------------|
| NFR6.14 | Loki LogQL or CloudWatch Insights with 30-day retention |
| Example Insights | `fields @timestamp, @message | filter @message like /ERROR/` |
