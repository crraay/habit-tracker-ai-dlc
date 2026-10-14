# SLO configuration — F1 springboot CI (as-built)

Intent `261013-f1-springboot-ci` · **No contractual SLOs** in repo.

## Sources

- `operation/observability-setup/observability-setup-questions.md` (Q3)

## SLI / SLO state

| SLI | SLO target | Status |
|-----|------------|--------|
| API availability | — | **Not defined** |
| Edge (SPA) availability | — | **Not defined** |
| Error rate (5xx) | — | **Not defined** |
| Latency p95 | — | **Not defined** |
| **CI: test pass before publish** | **Implicit after F1** | **Enforced by workflow**, not an SLO object |

## Qualitative expectation

- Investigate same day if production URL or login is broken.
- **CI:** treat **`build-image` failure on `main`** as release-blocking (F1).

## Aspirational sketches (not commitments)

| Sketch SLI | Example target | Notes |
|------------|----------------|-------|
| Edge availability | 99.5% / 30d | Needs synthetic probe |
| API success rate | 99% non-5xx | Needs metrics |

## Tracking tools

| Tool | Status |
|------|--------|
| SLO platform | **None** |
| GitHub Actions history | **CI pass/fail only** |

**Artifact revision:** 2026-10-14T19:17+07 — post-confirmation save.
