# Alarms — F1 springboot CI (as-built)

Intent `261013-f1-springboot-ci` · **No SNS, PagerDuty, or droplet alertmanager** configured.

## Sources

- `team.md` — personal-scale production
- `operation/deployment-pipeline/cd-config.md`

## Active notification paths

| Event | Detection | Route | Severity |
|-------|-----------|-------|----------|
| **`build-image` test failure (F1)** | GitHub Actions — **Run tests** step red | Developer (email/UI per GitHub prefs) | **High** — blocks `:latest` publish |
| `build-image` Docker failure | GitHub Actions | Developer | Medium |
| Compose deploy failure | GitHub Actions | Operator | High |
| Production down | **Manual** | Operator | High |
| Postgres / actuator unhealthy | **Manual** — compose ps / health URL | Operator | Critical |

## F1 impact

Before F1, a red test suite could still publish if only package-with-skip ran first. After F1, **failed tests fail the workflow before Docker login** — operators rely on **GitHub visibility**, not a new paging channel.

## Reference alarms (not deployed)

| Alarm ID | Future condition | Severity |
|----------|------------------|----------|
| AL-CI-01 | `build-image` failed on `main` | P2 — notify dev |
| AL-HTTP-01 | Synthetic GET `/` fails | P2 |
| AL-API-02 | Actuator non-200 | P2 |
| AL-PG-03 | Postgres unhealthy | P1 |

## Routing

| Channel | Status |
|---------|--------|
| AWS SNS | N/A |
| Slack | Not configured |
| GitHub notifications | **Default for CI failures** |

**Artifact revision:** 2026-10-14T19:17+07 — post-confirmation save.
