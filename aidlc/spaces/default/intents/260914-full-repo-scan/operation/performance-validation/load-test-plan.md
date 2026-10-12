# Load test plan — full-repo-scan

Intent `260914-full-repo-scan` · **Future execution plan** — **no load tests were run** during this FR2 intent.

## Sources

- U1 `performance-requirements.md` (NFR2.4), `performance-design.md`
- `construction/build-and-test/performance-test-instructions.md`

## Objectives (when executed in a follow-up intent)

| Goal | Success criterion (draft) |
|------|---------------------------|
| Baseline API latency | Record p50/p95 for auth + board read at 1–5 VUs |
| Error rate under light load | 0% 5xx at personal-scale concurrency |
| Pool stability | No sustained Hikari timeout errors in logs |
| Regression guard | Compare to prior baseline commit |

Numeric thresholds must be **affirmed by team** before gating CI — not inherited from this scan.

## Scope

| In scope | Out of scope |
|----------|--------------|
| U1 REST hot paths via nginx proxy | Production droplet load (unless explicit ops approval) |
| Local or staging Compose stack | DDoS / abuse simulation |
| Read-heavy + track/untrack mutations | Multi-region |

## Environment

| Option | Recommendation |
|--------|----------------|
| **Local Compose** | Hub or override build; seeded test user; H2 **not** used for load — use Postgres like prod |
| **Dedicated staging** | Preferred if BL-INFRA-U3-06 added |
| **Production** | **Avoid** unless maintenance window + operator sign-off |

## Tooling options

| Tool | Fit | Notes |
|------|-----|-------|
| **k6** | HTTP scripts against `/api/*` | JWT login step; share script in follow-up repo folder |
| **Gatling / JMeter** | Alternative | Heavier setup |
| **MockMvc @SpringBootTest** | Micro-benchmark | Good for BL-PERF-03 unit-scale baseline, not throughput |

## Scenario catalog (draft)

| ID | Scenario | VUs | Duration | Endpoints |
|----|----------|-----|----------|-----------|
| LT-01 | Steady browse | 2 | 5 min | `GET /api/me`, `GET /api/habit-track/{today}` |
| LT-02 | Track burst | 5 | 2 min | login + track/untrack today |
| LT-03 | Soak | 1 | 30 min | LT-01 loop — memory/leak smoke |
| LT-04 | Scheduler overlap | 1 | cron window | observe JVM during `StreakResetScheduler` |

## Metrics to collect

| Metric | Source |
|--------|--------|
| HTTP duration percentiles | k6 summary |
| Error rate | k6 / nginx logs |
| JVM heap / GC | `docker stats` or JFR (optional) |
| Postgres connections | `pg_stat_activity` count during test |
| App logs | Hikari timeout, OOM |

No CloudWatch/X-Ray — align with `observability-setup` gaps.

## Preconditions

1. Test user credentials and JWT flow documented.  
2. Database seeded with **realistic** log history if testing NFR2.5.  
3. `app.scheduling.streak-reset.enabled` understood for LT-04.  
4. FR2 follow-up intent authorizes committing k6 scripts if desired.

## Execution status (this intent)

| Item | Status |
|------|--------|
| Plan authored | **Done** |
| Scripts committed | **Not done** (FR2) |
| Run executed | **Not done** |
