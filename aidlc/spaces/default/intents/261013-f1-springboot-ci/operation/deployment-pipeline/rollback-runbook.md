# Rollback runbook — Habit Tracker (Compose production)

Intent `261013-f1-springboot-ci` · Operator-facing procedure; **not executed** during this intent.

## When to rollback

- Smoke test fails after deploy (5xx on `/api`, login broken, data issues suspected).
- Critical regression immediately post-release.
- Bad backend image on Hub (`:latest` points to faulty build).
- **Note:** F1 reduces risk of publishing **untested** bytecode; rollback still needed for **wrong but green** builds.

## Decision authority

- Operator / tech lead — no automated rollback in compose deploy workflow today.

## Rollback options (fastest first)

### Option 1 — Redeploy previous Hub digest (preferred if recorded)

1. Identify last known-good backend digest from Hub UI or deploy notes.
2. On droplet, pull by digest and tag locally, or temporarily pin in compose override.
3. `docker compose up -d backend` (or run `./scripts/deploy-service.sh backend`).
4. Re-run smoke tests.

### Option 2 — Re-run `build-image` from known-good git commit

1. In `habit-tracker-springboot`, identify good commit on `main`.
2. Re-run **`build-image`** from that commit — **`mvn test`** must pass (F1 gate).
3. Wait for Hub `:latest` to update.
4. Run compose deploy for **`backend`**.

### Option 3 — Compose git revert on droplet

1. SSH; in `DEPLOY_COMPOSE_DIR`, find good compose commit.
2. Revert/checkout with team coordination.
3. `./scripts/deploy-service.sh all`.
4. Smoke test.

### Option 4 — Database restore (last resort)

- If Flyway migration caused irreversible damage:
  1. Stop backend.
  2. Restore Postgres volume from backup (verify backup exists before relying on this).
  3. Deploy last compatible backend image.
  4. Extended outage — escalate.

## Post-rollback verification

- [ ] `docker compose ps` — services healthy
- [ ] `GET /actuator/health` — UP
- [ ] Login + `/api/me` returns timezone
- [ ] Track/untrack on today works
- [ ] Watch backend/nginx logs ~15 minutes

## Communication template

```text
Incident: Production deploy rollback — Habit Tracker Compose
Time (UTC): ...
Scope: backend | frontend | both
Action taken: Option N — ...
Current image/tag/digest: ...
Smoke status: pass | fail
Follow-up ticket: ...
```

## Prevention

- Record Hub digest on each successful deploy.
- F1 (merged): **`build-image`** runs full Maven test suite before push.
- Backlog: automated smoke in compose deploy workflow; SSH key auth; optional staging droplet.

## F1 boundary

This runbook is **documentation** for Operation; no workflow changes in this intent.

## Sources

- `habit-tracker-compose/DOCKER.md`
- `operation/deployment-pipeline/deployment-pipeline-questions.md` (Q5)
