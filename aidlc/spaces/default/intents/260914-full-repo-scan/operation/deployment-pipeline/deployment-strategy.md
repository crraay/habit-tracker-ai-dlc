# Deployment strategy — full-repo-scan

Intent `260914-full-repo-scan` · Describes **as-built** production releases for Habit Tracker (Compose on DigitalOcean).

## Strategy selection

| Criterion | Choice |
|-----------|--------|
| Pattern | **Recreate** (stop old container, pull image, start new) |
| Blue/green | Not used — single instance |
| Canary | Not used |
| Rolling (multi-node) | Not used — one droplet |
| Database | Postgres **not** recreated on app deploy; named volume retained |

## Preconditions (release checklist)

1. U1 and/or U2 changes merged to `main` and **`build-image`** succeeded (verify Actions + Hub).
2. For backend schema changes: Flyway migration included in new C2 image; review backward compatibility.
3. U3 compose repo at intended commit (usually `main` on droplet after `git pull`).
4. Production `.env` on droplet matches requirements (`JWT_SECRET`, DB creds, `CORS_ALLOWED_ORIGINS`).
5. Operator available for smoke test and rollback decision window.

## Release procedure (operator)

1. **Backend only:** dispatch U3 workflow with `backend` (or `all` if frontend also changed).
2. **Frontend only:** dispatch with `frontend` when C3 changed (API-compatible).
3. **Both:** `all` or sequential backend then frontend if API contract changed first.
4. Monitor: `docker compose ps`, backend logs, nginx access errors.
5. Smoke: login, Settings timezone load, track/untrack on today.

## Traffic and downtime

- **Expected downtime:** brief during container recreate (seconds to minutes).
- **Sessions:** JWT clients may retry; users may need re-login on hard failure.
- **Postgres:** stays up; no user data loss on app-only redeploy.

## Cross-repo coordination

- Backend and frontend **`:latest`** tags move independently; coordinate when C1 contract changes.
- No atomic multi-repo release tag; operator order matters (typically API before SPA if breaking).

## Feature flags

- Scheduler and similar toggles via Spring configuration in C2 image — requires **new backend deploy** to change.
- No dynamic flag service at edge.

## Security / compliance notes

- Do not deploy with example `.env` values.
- Legacy EB/S3 deploy paths exist in U1/U2 but are **not** the affirmed Compose strategy (project NEVER on EB for new work).

## FR2 boundary

This intent **documents** the strategy only; it does **not** execute a production deploy or modify workflows.
