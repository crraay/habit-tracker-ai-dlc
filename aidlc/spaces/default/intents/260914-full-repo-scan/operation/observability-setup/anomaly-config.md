# Anomaly detection — full-repo-scan (as-built)

Intent `260914-full-repo-scan` · **No ML or statistical anomaly detection** is configured for production.

## Sources

- U3 `monitoring-design.md` — no centralized metrics
- `alarms.md` — manual detection only

## Anomaly detection inventory

| System | Type | Status |
|--------|------|--------|
| CloudWatch Anomaly Detection | AWS metrics | **Not used** |
| Prometheus `predict_linear` / recording rules | Metrics | **No Prometheus** |
| Grafana ML | Dashboards | **Not deployed** |
| Datadog anomalies | SaaS | **Not configured** |
| Operator intuition | Manual | **De facto** |

## Signals that would benefit from anomaly detection (backlog)

| Signal | Baseline need | Backlog ID |
|--------|---------------|------------|
| HTTP 5xx rate spike | Request metrics | NFR6.15 |
| Postgres connection errors | JDBC error counter | NFR6.16 runbook |
| Disk usage on volume | Host/volume metrics | BL-INFRA-U3-04 |
| Container restart loop | `restart` count time series | BL-INFRA-U3-08 |
| Login failure burst | Auth audit metric | Not instrumented |

## Recommended future configuration (non-binding)

If Prometheus is added on the droplet:

1. **Recording rules** — 5m rate of HTTP server errors.  
2. **Alert** — fire when current rate > 3× seven-day same-hour median (simple anomaly proxy).  
3. **Tune** — low traffic site may need minimum request floor to avoid false positives.

## FR2 execution

| Action | Result |
|--------|--------|
| Enable CloudWatch anomaly bands | **Not performed** |
| Train ML detector | **Not performed** |

Operator should rely on **manual dashboards** (`dashboards.md`) and **log queries** until metrics export exists.
