# Monitoring Design — unit `habit-tracker-angular`

Planning-only intent (FR2). **Platform-layer observability** for the C3 nginx container (Q4 **A**): what operators can see on a single-host Compose deploy without RUM, Lighthouse CI, or edge metrics stacks.

## Sources

- `nfr-design/performance-design.md`, `security-design.md`
- `habit-tracker-angular/Dockerfile`, `habit-tracker-compose/docker-compose.yml`
- U1 `monitoring-design.md` (backend/actuator — not duplicated here)

## Metrics & KPIs

| Metric | Source | Threshold | Why it matters |
|--------|--------|-----------|----------------|
| Frontend container liveness | Dockerfile `HEALTHCHECK` (`wget /`) | Fail after 3 retries | Operator knows nginx serves index (NFR2.2 delivery path) |
| Backend dependency | Compose `depends_on: backend: service_healthy` | Frontend starts after U1 actuator OK | SPA loads but API fails if backend unhealthy |
| nginx access/error logs | Container stdout/stderr | Operator judgment | No structured log ship (GAP) |
| Web Vitals / LCP / INP | *Not measured* | N/A | NFR2.1 — GAP; no Lighthouse CI |
| Bundle size regression | *Not measured in CI* | N/A | NFR2.4 — GAP; BL-INFRA-U2-04 |
| Edge cache hit rate | *N/A* | N/A | No CDN in production path |
| Synthetic browser login | *Manual* | Operator smoke test | No automated check (GAP) |

## Alerts

| Alert | Condition | Severity | Routes to |
|-------|-----------|----------|-----------|
| Frontend HEALTHCHECK failure | `wget /` non-200 | *Not automated* | Operator via `docker compose ps` / logs |
| SPA white screen after deploy | User report or manual curl `/` | *Manual* | Operator checks nginx logs + asset path |
| `/api/` proxy 502/504 | nginx error log upstream | *Not automated* | Often indicates backend down — check U1 health |
| Failed GitHub Actions C3 push | Workflow failure on `main` | *Not routed* | Developer notices in GitHub |
| XSS / CSP violation | *No CSP header* | *Not monitored* | BL-INFRA-U2-01 backlog (NFR3.14) |

## SLIs / SLOs

| SLI | SLO target | Measurement window |
|-----|------------|-------------------|
| SPA availability | **None contractual** (NFR2.1) | N/A |
| Static asset latency | **None** | N/A |
| Client error rate | **None** | N/A |

Qualitative expectation: personal app — same-day investigation if site unreachable; no error budget process.

## Logs & Tracing

| Aspect | Design |
|--------|--------|
| Log aggregation | **Container stdout/stderr** on droplet; `docker compose logs -f frontend` | No Loki/CloudWatch |
| Log format | Default nginx access/error text | Not JSON |
| Secret hygiene | JWT must not appear in nginx logs (Bearer in request — avoid debug logging) | NFR3.5 |
| Client-side errors | Browser console + optional API `correlationId` in toasts | Not centralized (NFR3.12 UX gap) |
| Distributed tracing | **N/A** — static SPA + proxied REST | No OpenTelemetry in U2 image |
| RUM | **Absent** | Future: BL-INFRA-U2-04 / synthetic checks |

## Dashboards

| Dashboard | Status | Content |
|-----------|--------|---------|
| Grafana / CloudWatch | **Absent** | Future if edge metrics added |
| Operator “dashboard” | **Manual** | curl `/`, browser login smoke, `docker compose logs frontend`, U1 health URL |
| Angular devtools | Dev only | Not production monitoring |

## Future-intent platform sketches (non-binding)

| ID | Sketch |
|----|--------|
| NFR2.1 | Lighthouse CI on `main` with stored baseline |
| NFR2.4 | Bundle analyzer artifact in GitHub Actions |
| NFR3.14 | nginx CSP + report-uri / Reporting-API |
| NFR3.18 | npm audit gate in `build-image.yml` |
