# Observability Setup Questions — intent `260914-full-repo-scan`

Context: **FR2 planning-only** · Document **as-built** observability on DigitalOcean Compose; **no CloudWatch, Prometheus, or droplet config changes** from this intent.

Sources: U1/U2/U3 `monitoring-design.md`, NFR6.x observability requirements, `operation/deployment-execution/health-check-report.md`.

---

## Q1 — Stage deliverable

What should Observability Setup produce?

- A. **As-built observability documentation (recommended)** — `dashboards.md`, `alarms.md`, `slo-config.md`, `log-queries.md`, `tracing-config.md`, `anomaly-config.md` as **markdown runbooks** (not live AWS/Grafana installs).
- B. **Deploy Prometheus + Grafana on droplet** — out of FR2 scope.
- C. **Skip Operation observability** — not recommended; upstream monitoring-design exists.
- X. Other (please specify)

[Answer]: A

---

## Q2 — Golden signals (latency, traffic, errors, saturation)

What is tracked today?

- A. **Health + logs only (recommended)** — actuator health, compose healthchecks, manual `docker compose logs`; **no** automated RED metrics (NFR6.7 gap).
- B. **Full RED via Micrometer/Prometheus** — not as-built.
- C. **CloudWatch agent on droplet** — not present.
- X. Other (please specify)

[Answer]: A

---

## Q3 — SLOs / SLIs

What SLO targets apply?

- A. **None contractual (recommended)** — personal-scale prod; qualitative same-day investigation; document aspirational backlog (NFR6.17).
- B. **99.9% monthly availability** — not codified in repo.
- C. **Error budget with paging** — no on-call rotation.
- X. Other (please specify)

[Answer]: A

---

## Q4 — Dashboards

What dashboard layout does the team use?

- A. **Operator manual checklist (recommended)** — `docker compose ps`, health URLs, log tail, browser smoke; no Grafana/CloudWatch dashboards in repo.
- B. **AWS CloudWatch dashboards** — legacy paths only; not Compose prod.
- C. **Datadog unified dashboard** — not configured.
- X. Other (please specify)

[Answer]: A

---

## Q5 — Logs and retention

How are logs aggregated and retained?

- A. **Container stdout on droplet (recommended)** — `docker compose logs`; ephemeral unless host rotation configured; saved queries documented as **shell/grep patterns**, not CloudWatch Insights.
- B. **Central Loki/CloudWatch 30-day** — backlog NFR6.14.
- C. **Structured JSON logging fleet-wide** — plain Logback text today.
- X. Other (please specify)

[Answer]: A

---

## Q6 — Distributed tracing

What tracing instrumentation exists?

- A. **N/A single-host monolith (recommended)** — `correlationId` on API errors only; no X-Ray/OpenTelemetry; `tracing-config.md` documents gap and future options.
- B. **AWS X-Ray on all services** — not as-built.
- C. **Full OTel across U1/U2/U3** — not present.
- X. Other (please specify)

[Answer]: A

---

## Q7 — Alarms and anomaly detection

What alerting is configured?

- A. **Manual / GitHub visibility only (recommended)** — no SNS/PagerDuty; GHA failure visible in GitHub; health failures require operator check; `anomaly-config.md` lists backlog (BL-INFRA-U3-07/08, NFR6.15).
- B. **CloudWatch alarms + SNS** — not on Compose path.
- C. **ML anomaly detection** — not configured.
- X. Other (please specify)

[Answer]: A

---

## Assumptions & Open Questions

- Stage prose references CloudWatch/X-Ray; artifacts describe **actual** Compose operator observability and map AWS concepts to **future-intent** sketches only.
- nginx access logs live in frontend container; not centrally shipped.

None.

---

## Consolidated Summary Confirmation

Does this all look correct before I finalize the observability setup artifact package?

- **Q1 (A):** Markdown observability package; no infra installs.
- **Q2 (A):** Health + logs; RED metrics gap documented.
- **Q3 (A):** No contractual SLOs; qualitative ops expectation.
- **Q4 (A):** Manual operator “dashboard” checklist.
- **Q5 (A):** Docker logs; grep-style query doc.
- **Q6 (A):** No distributed tracing; correlationId on errors.
- **Q7 (A):** No automated alarms; backlog captured.

- Looks correct
- Request changes

[Answer]: Looks correct
