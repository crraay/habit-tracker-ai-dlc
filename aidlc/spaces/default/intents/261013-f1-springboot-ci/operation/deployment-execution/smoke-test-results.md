# Smoke test results — F1 springboot CI

Intent `261013-f1-springboot-ci` · Checklist only; **tests were not run** against production during this intent.

## Sources

- `operation/deployment-pipeline/deployment-strategy.md`
- `aidlc/spaces/default/memory/team.md` — Login → JWT → Track/Statistics/Settings
- `operation/deployment-execution/deployment-execution-questions.md` (Q4)

## Overall result

| Result | Detail |
|--------|--------|
| **Status** | **Not executed** (F1 intent — simulated execution) |
| **Recommended owner** | Operator immediately after compose deploy workflow |
| **On failure** | Follow `operation/deployment-pipeline/rollback-runbook.md` |

## Smoke checklist (manual)

| ID | Step | Expected | F1 intent run |
|----|------|----------|---------------|
| S1 | Open app root (`http://<host>/`) | SPA loads; no nginx 502 | Not run |
| S2 | Login | JWT issued; app shell loads | Not run |
| S3 | `GET /api/me` | 200; timezone / user clock present | Not run |
| S4 | Track habit for *today* | Success per domain rules | Not run |
| S5 | Untrack (if applicable) | Consistent state | Not run |
| S6 | Settings timezone | Save/error handling as in angular pattern | Not run |
| S7 | Statistics | Loads without 5xx | Not run |
| S8 | Browser | No persistent CORS errors on `/api/*` | Not run |

## Optional curl probes (operator)

```bash
curl -sS -o /dev/null -w "%{http_code}\n" "http://<host>/"
curl -sS "http://<host>/api/actuator/health"
```

## Evidence from Construction (indirect)

| Suite | Result | Relevance |
|-------|--------|-----------|
| springboot `mvn test` | 11/11 pass (2026-10-14) | CI gate F1 wires to `build-image`; not post-deploy E2E |

Automated CI does **not** replace post-deploy smoke today.

## Follow-up (backlog)

- Automate post-SSH health curl in compose deploy workflow.
- Confirm first post-merge `build-image` on `main` (FR4 informational).

**Artifact revision:** 2026-10-14 — saved after consolidated summary confirmation.
