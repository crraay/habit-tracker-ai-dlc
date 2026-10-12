# Performance Validation Questions — intent `260914-full-repo-scan`

Context: **FR2 planning-only** · Document **as-built performance posture** and a **future load-test plan**; **no k6/JMeter runs against production or new perf scripts in product repos** this intent.

Sources: U1/U2 `performance-requirements.md`, `performance-design.md`, `scalability-design.md`, `construction/build-and-test/performance-test-instructions.md`, `operation/observability-setup/dashboards.md`.

---

## Q1 — Stage deliverable

What should Performance Validation produce?

- A. **Plan + matrix + N/A results (recommended)** — `load-test-plan.md` (future), `test-results.md` (no load run), `nfr-validation-matrix.md` (target vs actual/N/A).
- B. **Execute k6 against production droplet now** — out of FR2 scope.
- C. **Skip stage** — not recommended; NFR2.x documented in Construction.
- X. Other (please specify)

[Answer]: A

---

## Q2 — Traffic patterns

What traffic model applies?

- A. **Low steady personal use (recommended)** — single operator + small user base; no peak/burst SLO; single droplet, one JVM.
- B. **Black Friday burst** — not designed or measured.
- C. **Multi-tenant SaaS scale** — not as-built.
- X. Other (please specify)

[Answer]: A

---

## Q3 — Latency targets

What latency percentiles are enforced?

- A. **None in CI/repo (recommended)** — qualitative sub-second reference in performance-design; **not measured**; matrix shows N/A until BL-PERF-03 baseline.
- B. **p95 < 200ms API** — not codified.
- C. **p99 contractual** — not present.
- X. Other (please specify)

[Answer]: A

---

## Q4 — Throughput

What throughput must the system sustain?

- A. **Implicit low concurrency (recommended)** — Tomcat default threads + Hikari pool; no load test proof; horizontal scale **not** available.
- B. **1000 RPS** — not validated.
- C. **Auto-scale on CPU** — not configured on droplet.
- X. Other (please specify)

[Answer]: A

---

## Q5 — Likely bottlenecks (documented)

Which bottlenecks are called out in design?

- A. **Design-documented hot paths (recommended)** — streak recompute log scan, board read queries, scheduler vs interactive JVM, JDBC pool under burst; no profiling evidence this intent.
- B. **CDN edge** — not used.
- C. **Cross-region replication lag** — N/A.
- X. Other (please specify)

[Answer]: A

---

## Q6 — Evidence source

What evidence backs validation?

- A. **Desk review + unit CI only (recommended)** — Construction `test-results.md` (functional, not load); observability gaps noted; no CloudWatch/X-Ray metrics.
- B. **Production APM traces** — not deployed.
- C. **Continuous load in CI** — not present.
- X. Other (please specify)

[Answer]: A

---

## Assumptions & Open Questions

- Scalability requirements for U2/U3 are mostly N/A (static SPA, single host).
- Follow-up intent may run k6 locally against compose stack per `load-test-plan.md`.

None.

---

## Consolidated Summary Confirmation

Does this all look correct before I finalize the performance validation artifact package?

- **Q1 (A):** Plan, matrix, N/A load results — no live load test.
- **Q2 (A):** Personal low-traffic model.
- **Q3 (A):** No enforced latency percentiles.
- **Q4 (A):** Low concurrency; no autoscale validation.
- **Q5 (A):** Hot paths from performance-design.
- **Q6 (A):** Desk review + unit test evidence only.

- Looks correct
- Request changes

[Answer]: Looks correct
