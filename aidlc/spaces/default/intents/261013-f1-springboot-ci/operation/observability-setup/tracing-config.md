# Tracing configuration — F1 springboot CI (as-built)

Intent `261013-f1-springboot-ci` · **No distributed tracing** deployed.

## Instrumentation status

| Layer | Status |
|-------|--------|
| Spring Boot backend | No OTel / X-Ray agent |
| Angular SPA | No browser trace export |
| nginx (compose) | No trace header propagation |
| Postgres | No query tracing |
| **GitHub Actions** | Workflow step boundaries only (not APM traces) |

## Request correlation (as-built)

| Mechanism | Scope |
|-----------|-------|
| `correlationId` in API error JSON | Client + server log grep |
| nginx access logs | Per-request, no unified trace ID |

## F1 scope

F1 does **not** add tracing to CI or runtime.

## Future options (non-binding)

- `micrometer-tracing` + OTLP on backend.
- `traceparent` through nginx if multi-service grows.

**Artifact revision:** 2026-10-14T19:17+07 — post-confirmation save.
