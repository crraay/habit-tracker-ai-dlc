# Unit test instructions — `habit-tracker-compose` (U3)

Intent `260914-full-repo-scan` · **FR2:** this intent does not change the compose repo. U3 has **no automated test suite** (team.md); verification is **operational**.

## Baseline verification (manual)

From `habit-tracker-compose/` after a successful app-repo image build on `main`:

1. Confirm Hub tags `crraay/habit-tracker-springboot:latest` and `crraay/habit-tracker-angular:latest` exist (or pins recorded in deploy notes).
2. On the droplet, in `DEPLOY_COMPOSE_DIR`: `git pull --ff-only`, then `./scripts/deploy-service.sh all` (or per-service) per `DOCKER.md`.
3. Smoke: HTTP 200 on `/`, login via SPA, `GET /api/me` through nginx proxy.

Record pass/fail in `code-summary.md` during Build and Test if the team runs it; **not required** in this FR2 code-generation pass.

## Follow-up F3

Add optional scripted smoke or compose config validation in a future intent; product test gates remain in app repos.
