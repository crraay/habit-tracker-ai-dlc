# Smoke test results — full-repo-scan

Intent `260914-full-repo-scan` · **FR2:** checklist only; **tests were not run** against production or a live stack during this intent.

## Sources

- `operation/deployment-pipeline/deployment-strategy.md`
- `team.md` — Login → JWT → Track/Statistics/Settings via nginx → backend → Postgres

## Overall result

| Result | Detail |
|--------|--------|
| **Status** | **Not executed** (planning-only intent) |
| **Recommended owner** | Operator immediately after U3 deploy workflow |
| **On failure** | Stop traffic promotion; follow `rollback-runbook.md` |

## Smoke checklist (manual)

| ID | Step | Expected | FR2 run |
|----|------|----------|---------|
| S1 | Open app root (`http://<host>/`) | SPA loads; no blank nginx 502 | Not run |
| S2 | Register or login | JWT issued; redirect to app shell | Not run |
| S3 | `GET /api/me` (via UI or curl with Bearer) | 200; user clock/timezone fields present | Not run |
| S4 | Track habit for *today* | Success; UI reflects tracked state | Not run |
| S5 | Untrack (if applicable) | Success; state consistent with domain rules | Not run |
| S6 | Settings — load/save timezone | Save shows explicit error handling on failure (angular pattern) | Not run |
| S7 | Statistics view | Loads without 5xx for authenticated user | Not run |
| S8 | Browser devtools | No persistent CORS errors on `/api/*` | Not run |

## Optional curl probes (operator)

Replace `<host>` with droplet IP or domain; use a valid JWT for authenticated routes.

```bash
# Edge — nginx serves SPA
curl -sS -o /dev/null -w "%{http_code}\n" "http://<host>/"

# Backend health (internal in compose; use /api proxy if exposed)
curl -sS "http://<host>/api/actuator/health"
```

Note: exact actuator path via nginx depends on C3 proxy rules; prefer UI login path if curl routing is unclear.

## Evidence from Construction (indirect)

| Suite | Result | Relevance to smoke |
|-------|--------|-------------------|
| U1 unit/integration | 11/11 pass | Partial API/timezone coverage; not full E2E |
| U2 unit | 29/29 pass | Component-level; not deploy E2E |

Automated CI does **not** currently replace post-deploy smoke.

## Follow-up (automation backlog)

- Add GHA post-SSH step: curl `/` and `/api/actuator/health` (cd-config F3).
- Optional Playwright against staging when BL-INFRA-U3-06 exists.
