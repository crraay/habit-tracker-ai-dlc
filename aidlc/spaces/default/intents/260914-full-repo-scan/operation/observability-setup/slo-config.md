# SLO configuration — full-repo-scan (as-built)

Intent `260914-full-repo-scan` · **No contractual SLOs or error budgets** are defined in repo for Habit Tracker production.

## Sources

- NFR6.17, NFR5.3 (no formal availability SLO)
- U1/U2/U3 `monitoring-design.md` SLI/SLO tables

## Current SLI / SLO state

| SLI | SLO target | Measurement window | Error budget | Status |
|-----|------------|-------------------|--------------|--------|
| API availability | — | — | — | **Not defined** |
| SPA availability (edge) | — | — | — | **Not defined** |
| Error rate (5xx) | — | — | — | **Not defined** |
| Latency p95 | — | — | — | **Not defined** |
| Deploy success rate | — | — | — | **Not defined** |
| RTO / RPO | — | — | — | **Not codified** (BL-OPS-04 backup backlog) |

## Qualitative operator expectation

- Personal production app: investigate **same day** if the public URL is unreachable or login is broken.
- No on-call rotation, no paging, no monthly error-budget review process.

## Aspirational SLO sketches (future — not active)

If the team adopts formal SLOs, Operation phase guardrails suggest quantified targets, e.g.:

| Sketch SLI | Example target | Example window | Notes |
|------------|----------------|----------------|-------|
| Edge availability | 99.5% | 30-day rolling | Requires external synthetic probe |
| API success rate | 99% non-5xx | 30-day | Requires access logs or metrics |
| Alert burn rate | Page when 2% budget consumed in 1h | — | Requires metrics + Alertmanager |

These are **documentation placeholders only** — not team commitments from this intent.

## Tracking configuration

| Tool | SLO tracking | Status |
|------|--------------|--------|
| CloudWatch SLO | — | Not used |
| Grafana SLO | — | Not deployed |
| Spreadsheet / manual | Operator memory | **De facto** |
