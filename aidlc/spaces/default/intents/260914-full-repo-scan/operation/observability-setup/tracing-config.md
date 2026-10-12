# Tracing configuration — full-repo-scan (as-built)

Intent `260914-full-repo-scan` · **No distributed tracing** (X-Ray, OpenTelemetry, Jaeger) is deployed.

## Sources

- NFR6.9 — single JVM monolith; tracing N/A at current scale
- U1 observability-design — correlationId on errors only

## Instrumentation status

| Layer | Technology | Status |
|-------|------------|--------|
| U1 backend | Spring Boot monolith | **No** OTel/X-Ray agent |
| U2 frontend | Angular SPA | **No** browser trace export |
| U3 nginx | Reverse proxy | **No** trace headers propagated |
| Postgres | JDBC | **No** query tracing |

## Request correlation (as-built)

| Mechanism | Scope | Notes |
|-----------|-------|-------|
| `correlationId` in `ErrorResponse` JSON | API error responses | Client-visible; use with `log-queries.md` grep |
| HTTP access logs | nginx (frontend container) | No unified trace ID across services |
| JWT subject | Application logs | User-scoped debugging manual |

## AWS X-Ray mapping (not deployed)

Stage prose references X-Ray; **Compose on DigitalOcean does not use X-Ray**. If tracing is adopted later:

| Component | Future option |
|-----------|---------------|
| Backend | `micrometer-tracing` + OTLP exporter or sidecar |
| Edge | nginx `opentelemetry` module or proxy headers (`traceparent`) |
| Collector | OTel Collector on droplet or managed SaaS |

## Sampling (future sketch)

| Environment | Suggested sampling | Status |
|-------------|-------------------|--------|
| Production | 1–10% head-based | **Not configured** |
| Local dev | 100% optional | **Not configured** |

## Verification

| Check | FR2 result |
|-------|------------|
| Trace UI reachable | **N/A** |
| `traceparent` in responses | **Not present** |
