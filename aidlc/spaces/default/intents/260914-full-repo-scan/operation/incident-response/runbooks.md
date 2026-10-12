# Runbooks — full-repo-scan (Compose production)

Intent `260914-full-repo-scan` · Operator procedures for **DigitalOcean + Docker Compose**. **Not executed** during this planning intent.

## Sources

- `operation/observability-setup/log-queries.md`, `dashboards.md`
- `operation/deployment-pipeline/rollback-runbook.md`
- U1 `reliability-design.md`, U3 `infrastructure-specification.md`

## General response pattern

1. Confirm symptom (browser, user report, or `docker compose ps`).  
2. Tail logs (`log-queries.md`).  
3. Stabilize (restart service or rollback).  
4. Smoke test (`deployment-execution/smoke-test-results.md`).  
5. Note timeline for post-incident review if severity ≥ P2.

All commands assume SSH on droplet and `cd $DEPLOY_COMPOSE_DIR`.

---

## RB-01 — Site unreachable (502/connection refused)

| Step | Action |
|------|--------|
| 1 | `docker compose ps` — identify stopped/unhealthy service |
| 2 | `docker compose logs frontend --tail=50` — upstream errors |
| 3 | If backend down → **RB-02**; if frontend only → `docker compose up -d frontend` |
| 4 | Verify `curl -I http://localhost/` and login smoke |

**Rollback:** `rollback-runbook.md` if after deploy.

---

## RB-02 — Backend unhealthy / 5xx on `/api`

| Step | Action |
|------|--------|
| 1 | `docker compose logs backend --since 15m` — Flyway, JDBC, stack traces |
| 2 | Check postgres: `docker compose ps postgres` |
| 3 | If DB down → **RB-03** |
| 4 | If Flyway failure → stop backend; fix migration in U1; rebuild image; redeploy — or restore DB **RB-05** |
| 5 | Else: `docker compose restart backend` or `./scripts/deploy-service.sh backend` |

**Correlation:** grep `correlationId` from user error JSON in backend logs.

---

## RB-03 — Postgres unhealthy or JDBC errors

| Step | Action |
|------|--------|
| 1 | `docker compose logs postgres --tail=100` |
| 2 | `docker compose ps postgres` — health status |
| 3 | Verify `.env` credentials match volume (no accidental `.env` wipe) |
| 4 | `docker compose up -d postgres` — wait for healthy |
| 5 | `docker compose up -d backend` |

**Data loss risk:** do not `docker volume rm` without backup.

---

## RB-04 — Failed deploy (U3 workflow red)

| Step | Action |
|------|--------|
| 1 | Read GitHub Actions log — SSH, `git pull`, or script failure |
| 2 | Fix compose path / secrets / disk space on droplet |
| 3 | Re-run workflow or manual: `git pull --ff-only && ./scripts/deploy-service.sh <service>` |
| 4 | If bad images on Hub → **rollback-runbook.md** |

---

## RB-05 — Suspected data corruption / bad migration

| Step | Action |
|------|--------|
| 1 | Stop backend: `docker compose stop backend` |
| 2 | Assess Flyway history / backup availability (BL-OPS-04) |
| 3 | Restore Postgres volume from backup **or** rollback image + compatible schema |
| 4 | Document data impact; post-incident review mandatory |

---

## RB-06 — Disk full on droplet

| Step | Action |
|------|--------|
| 1 | `df -h` and `docker system df` |
| 2 | Prune unused images **carefully** — do not remove active layers |
| 3 | Plan Postgres volume growth; schedule backup/resize |

---

## RB-07 — Streak / “today” wrong (scheduler)

| Step | Action |
|------|--------|
| 1 | Confirm user timezone via `/api/me` vs server cron (`app.scheduling.timezone`) |
| 2 | Check `app.scheduling.streak-reset.enabled` in backend config |
| 3 | Review backend logs for scheduler errors (NFR5.14–5.16) |
| 4 | May be **design limitation** — escalate to dev if bug vs config |

---

## RB-08 — Security: suspected JWT or `.env` compromise

| Step | Action |
|------|--------|
| 1 | Rotate `JWT_SECRET` in droplet `.env`; redeploy backend (invalidates sessions) |
| 2 | Rotate DB password if exposed |
| 3 | Review GitHub and droplet access; rotate SSH/deploy secrets |
| 4 | Check logs for abnormal auth patterns — no JWT in logs (project rule) |

---

## Automated remediation

| Capability | Status |
|------------|--------|
| Docker `restart: unless-stopped` | **Active** |
| SSM / Lambda auto-runbooks | **Not deployed** |
