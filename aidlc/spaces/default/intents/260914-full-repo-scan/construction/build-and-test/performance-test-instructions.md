# Performance test instructions — full-repo-scan

## Strategy

Per-unit NFR design documents **as-built** latency expectations (single-user SPA, monolith API) but does not define numeric SLOs enforced in CI. **FR2** does not authorize new load scripts in product repos this intent.

## Deferred execution

| Check | Owner | When |
|-------|-------|------|
| Load / soak (k6, JMeter) | Follow-up feature intent | After explicit NFR targets are affirmed |
| p95 API latency gate | Not in CI today | `performance-validation` Operation stage if scheduled |
| Frontend Lighthouse budgets | Backlog | Optional F2 hardening |

## Local smoke (optional, manual)

No automated performance suite is required to close this intent. Operators may observe:

- `GET /api/me` and habit list under normal dev hardware
- Angular initial bundle size via `npm run build` output

## Coverage

No performance target is **Met** or **Not Met** in this stage's matrix except the explanatory **N/A** row when no measurable NFR threshold exists in requirements.
