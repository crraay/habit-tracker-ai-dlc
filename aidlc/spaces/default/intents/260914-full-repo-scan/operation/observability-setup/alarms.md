# Alarms — full-repo-scan (as-built)

Intent `260914-full-repo-scan` · **No automated alarm rules** (SNS, PagerDuty, Opsgenie) are configured on the Compose production path.

## Sources

- U3 `monitoring-design.md` — alerts table (mostly *Not automated*)
- `team.md` — personal-scale production

## Active notification paths

| Event | Detection | Route | Severity |
|-------|-----------|-------|----------|
| U1/U2 `build-image` failure | GitHub Actions UI / email (user prefs) | Developer | Medium |
| U3 deploy workflow failure | GitHub Actions | Developer / operator | High |
| Production site down | **Manual** — user report or operator check | Operator | High |
| Postgres unhealthy | **Manual** — `docker compose ps` / logs | Operator | Critical |
| Backend actuator down | **Manual** — health URL or HEALTHCHECK | Operator | High |
| Disk full on droplet | **Manual** — host monitoring | Operator | Critical |

## Alarm definitions (not deployed — reference for future)

These rows map **would-be** CloudWatch-style alarms to Compose equivalents if automation is added later.

| Alarm ID | Condition (future) | Severity | Escalation sketch |
|----------|-------------------|----------|-------------------|
| AL-HTTP-01 | External synthetic GET `/` fails 3×/5min | P2 | Email operator |
| AL-API-02 | Actuator non-200 for 2 min | P2 | Email + runbook link |
| AL-PG-03 | Postgres healthcheck failing | P1 | Immediate operator |
| AL-DISK-04 | Root FS > 85% | P2 | Operator before DB impact |
| AL-5XX-05 | 5xx rate > 5% over 5 min | P2 | Requires metrics export first |

## SNS / routing

| Channel | Status |
|---------|--------|
| AWS SNS | **N/A** (no AWS prod stack) |
| Slack webhook | **Not configured** |
| Email on-call | **Not configured** |

## Backlog linkage

- NFR6.15 — alert on health failure + 5xx threshold  
- BL-INFRA-U3-07 — external uptime HTTP check  
- BL-INFRA-U3-08 — Prometheus alertmanager on droplet  
