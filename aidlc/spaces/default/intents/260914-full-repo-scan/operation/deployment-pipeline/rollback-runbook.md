# Rollback runbook — Habit Tracker (Compose production)

Intent `260914-full-repo-scan` · Operator-facing procedure; **not executed** during this planning intent.

## When to rollback

- Smoke test fails after deploy (5xx on `/api`, login broken, data corruption suspected).
- Critical regression reported immediately post-release.
- Bad image pushed to Hub (`:latest` points to faulty build).

## Decision authority

- Operator / tech lead on call — no automated rollback hook in U3 workflow today.

## Rollback options (fastest first)

### Option 1 — Redeploy previous Hub digest (preferred if recorded)

1. Identify last known-good image digest from Hub UI or prior deploy notes.
2. On droplet, pin image in compose override or `docker pull` by digest and tag locally.
3. `docker compose up -d backend` and/or `frontend`.
4. Re-run smoke tests.

### Option 2 — Re-run `build-image` from known-good git commit

1. In U1/U2 repo, identify good commit on `main`.
2. Re-run `build-image` workflow from that commit (or temporary branch merge) — **ensure tests pass** if fixing CI gap.
3. Wait for Hub `:latest` to update.
4. Run U3 deploy workflow for affected service(s).

### Option 3 — Compose git revert on droplet

1. SSH to droplet; in `DEPLOY_COMPOSE_DIR`, `git log` and identify good compose commit.
2. `git checkout` or revert to that commit (coordinate with team — infra change).
3. `./scripts/deploy-service.sh all`.
4. Smoke test.

### Option 4 — Database restore (last resort)

- If Flyway migration caused irreversible damage:
  1. Stop backend to prevent further writes.
  2. Restore Postgres volume from backup (backlog BL-OPS-04 — verify backup exists before relying on this).
  3. Deploy last compatible backend image.
  4. Extended outage likely — escalate.

## Post-rollback verification

- [ ] `docker compose ps` — all services healthy
- [ ] `GET /actuator/health` (backend) — UP
- [ ] Login + `/api/me` returns timezone
- [ ] Track/untrack on today works
- [ ] No unexpected errors in backend/nginx logs (15 min watch)

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

## Prevention (follow-up F3)

- Record Hub digest on each successful deploy in run log or issue.
- Add automated smoke step to U3 workflow (non-blocking advisory first).
- Fix U1 `build-image` to require tests before push.

## Out of scope

- Elastic Beanstalk or S3 static rollback paths (legacy; not Compose production).
