# Anomaly detection — F1 springboot CI (as-built)

Intent `261013-f1-springboot-ci` · **No ML or metric-based anomaly detection** on production.

## Inventory

| System | Status |
|--------|--------|
| CloudWatch Anomaly Detection | Not used |
| Prometheus / Alertmanager | Not deployed |
| Operator manual review | **De facto** |
| **GitHub Actions failure** | **Binary** (pass/fail) — not statistical anomaly |

## F1 note

Test regression on `main` surfaces as a **hard CI failure**, not an anomaly score — appropriate for release gating.

## Backlog candidates

| Signal | Need |
|--------|------|
| 5xx rate spike | HTTP metrics + baseline |
| Container restart loop | Docker event metrics |
| Disk on Postgres volume | Host monitoring |
| Login failure burst | Auth metrics (not instrumented) |

## Future sketch (if Prometheus added)

Alert when 5m error rate > 3× seven-day same-hour median, with minimum traffic floor.

**Artifact revision:** 2026-10-14T19:17+07 — post-confirmation save.
