# Observability Design — unit `habit-tracker-springboot`

Planning-only intent (FR2).  **As-built pillars + future checklist** (Q6-A). No distributed tracing or metrics stack committed.

## Sources

- `nfr-requirements/observability-requirements.md` (NFR6.x)
- `GlobalExceptionHandler`, actuator, Logback defaults
- `security-design.md` (no secret logging — NFR6.3)

## Logging architecture (as-built)

| Aspect | Design |
|--------|--------|
| Framework | Logback via Spring Boot defaults (NFR6.1) |
| Structure | Plain text lines; no enforced JSON schema in app code (NFR6.2) |
| Levels | ERROR/WARN/INFO per Spring conventions |
| Secret hygiene | Never log JWT or passwords (NFR6.3) |
| Aggregation | **None** in repo — container stdout on droplet |

## Correlation and errors

| ID | Design |
|----|--------|
| NFR6.4 | `correlationId` on `ErrorResponse` for failed API calls |
| NFR6.5 | No mandatory request-id on successful 2xx responses — gap BL-OBS-01 |

Optional filter may attach metadata on requests (see domain-design BackendAuthentication note); success-path propagation not standardized.

## Metrics and health

| ID | Design |
|----|--------|
| NFR6.6 | `/actuator/health` for Docker/compose probes |
| NFR6.7 | No Prometheus/Micrometer scrape or RED dashboards in repo |
| NFR6.8 | springdoc OpenAPI for dev/ops — not SPA production path |

## Distributed tracing

| ID | Design |
|----|--------|
| NFR6.9 | No OpenTelemetry/Sleuth — synchronous monolith (N/A) |
| NFR6.10 | Future multi-service split would need trace propagation — backlog note only |

## Alerting

| ID | Design |
|----|--------|
| NFR6.11 | No automated alert routing for backend |
| NFR6.12 | Failed deploy noticed via manual workflow_dispatch outcome |

## SLI/SLO

**None** for backend (NFR6.17) — consistent with performance NFR2.1.

## Future-intent design sketches (non-binding)

| ID | Sketch |
|----|--------|
| NFR6.13 | Micrometer RED metrics per controller group → scrape endpoint |
| NFR6.14 | Ship ERROR logs to aggregated store, 30-day retention |
| NFR6.15 | Alert on health failure and sustained 5xx rate |
| NFR6.16 | Runbook: DB connectivity + streak scheduler failures |

## Design backlog

| Label | Item |
|-------|------|
| BL-OBS-01 | Standard request/correlation header on all responses |
| BL-OBS-02 | Baseline metrics export before SLO discussions |

## Dashboard needs (planning)

For personal single-host deploy, operator visibility today is: compose logs, manual health URL, and client-visible API errors with correlationId.
