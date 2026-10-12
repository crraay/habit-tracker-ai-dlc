# Performance test results — full-repo-scan

Intent `260914-full-repo-scan` · **No load or soak tests were executed** for this stage.

## Execution summary

| Test type | Executed | Environment | Outcome |
|-----------|----------|-------------|---------|
| k6 / JMeter load | **No** | — | — |
| Soak test | **No** | — | — |
| Lighthouse (U2) | **No** | — | Backlog |
| Production APM sample | **No** | — | No APM |

## Related evidence (functional, not performance)

From `construction/build-and-test/test-results.md` (2026-10-08):

| Suite | Result | Performance relevance |
|-------|--------|------------------------|
| U1 `mvn -B test` | 11/11 pass | Does not measure latency or throughput |
| U2 `npm run test:ci` | 29/29 pass | Unit/component timing not aggregated |

## Bottleneck analysis (desk review only)

| Area | Finding | Evidence type |
|------|---------|---------------|
| Streak recompute | Cost scales with log history | performance-design NFR2.5 |
| Board read | Potential wide reads | NFR2.6 + security backlog |
| Scheduler | Shares JVM with API | NFR2.7 |
| JDBC pool | Defaults untuned | NFR2.8 |
| Horizontal scale | Not available | single droplet |

**No profiling data** (flame graphs, slow query log) collected this intent.

## Auto-scaling validation

| Check | Result |
|-------|--------|
| Compose replica scale | **N/A** — single instance per service |
| CPU-based scale on DO | **Not configured** |
| HPA / ECS | **Not used** |

## Capacity recommendations (qualitative)

| Recommendation | Priority |
|----------------|----------|
| Run BL-PERF-03 baseline before major perf work | Medium |
| Fix log query user scoping before optimizing indexes | High if data grows |
| Document JVM `-Xmx` for backend container | Low |
| Add metrics export before enforcing SLOs | Medium |

## Sign-off

| Role | Load test sign-off |
|------|-------------------|
| Quality / operator | **Deferred** — execute per `load-test-plan.md` in follow-up intent |
