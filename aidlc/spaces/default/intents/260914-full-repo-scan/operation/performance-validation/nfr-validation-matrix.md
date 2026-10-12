# NFR validation matrix — performance (full-repo-scan)

Intent `260914-full-repo-scan` · Maps **NFR2.x** (U1 primary) to validation status. **FR2:** desk review + functional CI; no load measurements.

## Sources

- `construction/habit-tracker-springboot/nfr-requirements/performance-requirements.md`
- `construction/habit-tracker-springboot/nfr-design/performance-design.md`
- `construction/habit-tracker-springboot/nfr-design/scalability-design.md`
- `operation/performance-validation/test-results.md`

## Legend

| Status | Meaning |
|--------|---------|
| **Met (as-built)** | Requirement describes current state and is accurate |
| **N/A** | No numeric target to measure |
| **Not measured** | Design expectation exists; no perf test evidence |
| **Gap** | Known risk without mitigation test |
| **Backlog** | Explicit follow-up (BL-PERF-*) |

## Matrix — U1 performance (NFR2)

| ID | Requirement summary | Target / expectation | Actual / evidence | Status |
|----|---------------------|----------------------|-------------------|--------|
| NFR2.1 | No SLI/SLO/load baselines in repo | As-built statement | Confirmed in requirements + CI | **Met (as-built)** |
| NFR2.2 | Sync REST + JDBC; no cache/replicas | As-built | architecture confirmed | **Met (as-built)** |
| NFR2.3 | Sub-second p95 reference (low concurrency) | Reference only | No measurement | **Not measured** |
| NFR2.4 | Baseline before optimization | k6/MockMvc in follow-up | Not run | **Backlog** |
| NFR2.5 | Streak recompute hot path | Design documented | No profile | **Gap** |
| NFR2.6 | Board read hot path | Design documented | No profile | **Gap** |
| NFR2.7 | Scheduler batch job | Design documented | No LT-04 run | **Not measured** |
| NFR2.8 | Hikari pool defaults | Default BOM | No pool stress test | **Not measured** |
| NFR2.9 | Single JVM vertical scale | As-built | Single container | **Met (as-built)** |
| NFR2.10 | HEALTHCHECK / host limits | Actuator in compose | No resource limit test | **Not measured** |

## Matrix — scalability (cross-unit summary)

| ID | Topic | Validation | Status |
|----|-------|------------|--------|
| NFR4.x (host) | Single droplet | infrastructure-spec | **Met (as-built)** |
| U2 SPA | Static/nginx edge | No CDN load test | **N/A** |
| U3 Compose | No horizontal replicas | Documented | **Met (as-built)** |
| Auto-scale | Not configured | test-results | **N/A** |

## Observability linkage

| Need | Available for perf validation | Status |
|------|------------------------------|--------|
| Latency metrics | No Micrometer scrape | **Gap** (NFR6.7) |
| Error rate | Manual logs | **Not measured** |
| Dashboards | Operator manual | `observability-setup/dashboards.md` |

## Overall verdict

| Verdict | Detail |
|---------|--------|
| **Pass for FR2 planning closure** | As-built **honest** posture documented: no false “Met” on latency SLOs; hot paths and backlog identified. |
| **Not ready for enforced perf gates** | Execute `load-test-plan.md` and metrics export before CI perf thresholds. |

## Traceability

| Upstream artifact | Covered |
|-------------------|---------|
| `performance-requirements` | NFR2.1–2.10 |
| `performance-design` | Hot paths, BL-PERF-* |
| `scalability-design` | Single-host stance |
| `dashboards` | Manual ops only |
