# Observability Setup Questions — intent `261013-f1-springboot-ci`

Context: **Express F1** — CI test gate on springboot `build-image`; NFR Design and Infrastructure Design skipped. Document **as-built** observability; **no droplet or AWS installs** from this intent.

Sources: `construction/build-and-test/test-results.md`, `operation/deployment-execution/*`, `habit-tracker-springboot` actuator/logging, `habit-tracker-compose/DOCKER.md`, team memory.

---

## Q1 — Stage deliverable

What should Observability Setup produce?

- A. **As-built observability documentation (recommended)** — markdown runbooks (`dashboards.md`, `alarms.md`, `slo-config.md`, `log-queries.md`, `tracing-config.md`, `anomaly-config.md`); include **F1 CI visibility** (failed `build-image` / `mvn test`); no live Prometheus/Grafana/CloudWatch deploy.
- B. **Install monitoring stack on droplet now** — out of F1 scope.
- C. **Skip observability stage** — close intent without docs.
- X. Other (please specify)

[Answer]: A

---

## Q2 — Golden signals (latency, traffic, errors, saturation)

What is tracked today for production + CI?

- A. **Health + logs + GHA status (recommended)** — actuator health, compose healthchecks, `docker compose logs`; **GitHub Actions** shows `build-image` / test failures (F1 makes test failures visible before Hub push); no automated RED metrics on droplet.
- B. **Full RED via Micrometer/Prometheus** — not as-built.
- C. **CloudWatch on droplet** — not present.
- X. Other (please specify)

[Answer]: A

---

## Q3 — SLOs / SLIs

What SLO targets apply?

- A. **None contractual (recommended)** — personal-scale prod; qualitative response; document aspirational SLO backlog only.
- B. **99.9% monthly availability** — not codified in repo.
- C. **Error budget with paging** — no on-call rotation.
- X. Other (please specify)

[Answer]: A

---

## Q4 — Dashboards

What dashboard layout does the team use?

- A. **Operator manual + GitHub Actions UI (recommended)** — `docker compose ps`, health URLs, log tail, smoke checklist; **Actions tab** for springboot `build-image` (Run tests step); no Grafana/CloudWatch dashboards in repo.
- B. **AWS CloudWatch dashboards** — legacy EB path only.
- C. **Unified SaaS APM** — not configured.
- X. Other (please specify)

[Answer]: A

---

## Q5 — Logs and retention

How are logs aggregated and retained?

- A. **Container stdout on droplet + GHA logs (recommended)** — `docker compose logs`; GitHub retains workflow logs per GitHub policy; document grep patterns in `log-queries.md`, not CloudWatch Insights.
- B. **Central Loki/CloudWatch 30-day** — backlog.
- C. **Structured JSON fleet-wide** — verify per repo; plain Logback common on backend.
- X. Other (please specify)

[Answer]: A

---

## Q6 — Distributed tracing

What tracing instrumentation exists?

- A. **N/A single-host stack (recommended)** — API `correlationId` on errors where implemented; no X-Ray/OTel; document gap in `tracing-config.md`.
- B. **AWS X-Ray** — not as-built on Compose path.
- C. **Full OTel** — not present.
- X. Other (please specify)

[Answer]: A

---

## Q7 — Alarms and anomaly detection

What alerting is configured?

- A. **Manual + GitHub notifications (recommended)** — no SNS/PagerDuty on droplet; **failed `build-image` on `main`** alerts via GitHub (email/UI per user settings); operator checks health manually; backlog in `anomaly-config.md`.
- B. **CloudWatch alarms + SNS** — not on Compose path.
- C. **ML anomaly detection** — not configured.
- X. Other (please specify)

[Answer]: A

---

## Assumptions & Open Questions

- F1 does not add metrics exporters or log shipping; it improves **signal quality** of CI failure before publish.
- Production runtime observability unchanged by F1.

None.

---

## Consolidated Summary Confirmation

Does this all look correct before I generate the artifact?

- Looks correct
- Request changes

[Answer]: Looks correct
