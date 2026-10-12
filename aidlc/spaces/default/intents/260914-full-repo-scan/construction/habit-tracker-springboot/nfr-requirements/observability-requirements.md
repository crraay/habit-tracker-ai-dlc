# Observability Requirements — unit `habit-tracker-springboot`

Planning-only intent (FR2). **As-built pillars** plus future checklist. Sources: GlobalExceptionHandler, actuator, logging defaults, team deployment.

## Logging

| ID | Requirement | As-built |
|----|-------------|----------|
| **NFR6.1** | Spring Boot default logging (Logback); no centralized log aggregation configured in repo. | As-built |
| **NFR6.2** | **ERROR/WARN/INFO** used per Spring conventions; no enforced structured JSON schema in application code. | As-built |
| **NFR6.3** | **Never** log JWT or passwords (security NFR3.5). | Mandated |

## Correlation and errors

| ID | Requirement | As-built |
|----|-------------|----------|
| **NFR6.4** | **`correlationId`** on `ErrorResponse` for API failures — supports client/support triage. | Implemented |
| **NFR6.5** | No mandatory request-id propagation header documented for successful 2xx responses. | Gap |

## Metrics and health

| ID | Requirement | As-built |
|----|-------------|----------|
| **NFR6.6** | **`/actuator/health`** for liveness/readiness style checks in Docker/compose. | Implemented |
| **NFR6.7** | No Prometheus/Micrometer scrape config or RED metric dashboards in repo. | Absent |
| **NFR6.8** | springdoc OpenAPI exposed for dev/ops; not used by SPA in production. | C1 |

## Distributed tracing

| ID | Requirement | As-built |
|----|-------------|----------|
| **NFR6.9** | No OpenTelemetry or Sleuth wiring — single monolith, synchronous calls only. | N/A monolith |
| **NFR6.10** | Future multi-service split would require trace context propagation — not applicable today. | Backlog note |

## Alerting

| ID | Requirement | As-built |
|----|-------------|----------|
| **NFR6.11** | No automated alert routing (PagerDuty, etc.) defined for backend. | Operator manual |
| **NFR6.12** | Compose deploy is manual workflow_dispatch — human notices failed deploy. | Team practice |

## Future-intent checklist (non-enforcing)

| ID | Item |
|----|------|
| **NFR6.13** | Export RED metrics (rate, errors, duration) per controller group. |
| **NFR6.14** | Ship logs to aggregated store with 30-day retention for ERROR. |
| **NFR6.15** | Alert on health check failure and sustained 5xx rate. |
| **NFR6.16** | Document runbook for streak scheduler failures and DB connectivity. |

## SLI/SLO definitions

| ID | Requirement |
|----|-------------|
| **NFR6.17** | No SLI/SLO tables for backend — consistent with performance NFR2.1. |
