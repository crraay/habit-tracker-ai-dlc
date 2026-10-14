# Deployment strategy — F1 springboot CI

Intent `261013-f1-springboot-ci` · Describes **as-built** production releases for Habit Tracker (Compose on DigitalOcean). F1 strengthens the **CI gate** before backend images reach Hub; **deploy strategy on the droplet is unchanged**.

## Strategy selection

| Criterion | Choice |
|-----------|--------|
| Pattern | **Recreate** (pull image, recreate container) |
| Blue/green | Not used — single instance |
| Canary | Not used |
| Rolling (multi-node) | Not used — one droplet |
| Database | Postgres **not** recreated on app deploy; named volume `habit-tracker-springboot_postgres_data` retained |

## Preconditions (release checklist)

1. Backend changes merged to **`main`** and **`build-image`** succeeded — verify GitHub Actions and Docker Hub.
2. Confirm **`Run tests`** step passed in `build-image` (F1); a red test must **not** have published `:latest`.
3. For schema changes: Flyway migration in new backend image; review backward compatibility.
4. Compose repo on droplet at intended commit after `git pull`.
5. Production `.env` on droplet valid (`JWT_SECRET`, DB creds, `CORS_ALLOWED_ORIGINS`) — not example values.
6. Operator available for smoke test and rollback window.

## Release procedure (operator)

1. **Backend only (typical after F1-only work):** dispatch compose deploy workflow with **`backend`** (or **`all`** if frontend also changed).
2. **Frontend only:** dispatch with **`frontend`** when angular image changed and API-compatible.
3. **Both:** **`all`** or backend then frontend when API contract changed first.
4. Monitor: `docker compose ps`, backend logs, nginx errors.
5. Smoke: login, Settings timezone, track/untrack on today.

## Traffic and downtime

- **Expected downtime:** brief during backend container recreate.
- **Sessions:** JWT clients may retry; re-login possible on hard failure.
- **Postgres:** stays up on app-only redeploy.

## Cross-repo coordination

- Backend and frontend **`:latest`** tags move independently; align manually when contract changes.
- F1 does not add atomic multi-repo release tags.

## Feature flags

- Scheduler and similar toggles via Spring configuration — requires **new backend deploy** to change.
- No AppConfig, Evidently, or LaunchDarkly at edge.

## F1 boundary

This stage **documents** CD; it does **not** execute production deploy or edit compose workflows. CI changes live in `habit-tracker-springboot` from Construction.

## Sources

- `operation/deployment-pipeline/deployment-pipeline-questions.md`
- `aidlc/spaces/default/memory/team.md` § Deployment
