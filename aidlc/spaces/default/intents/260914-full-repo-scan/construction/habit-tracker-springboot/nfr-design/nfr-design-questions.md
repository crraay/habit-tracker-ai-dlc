# NFR Design Questions — unit `habit-tracker-springboot`

Context: Brownfield **planning-only** intent (FR2). Unit **U1** (`service`, repo `habit-tracker-springboot`). NFR Requirements (Q1–Q8) chose an **as-built baseline** with explicit gaps and non-binding future guidance — no new contractual SLOs this intent.

This stage produces **design documentation** (patterns, logical components, traceability) for Bolt planning and follow-up intents; no application-repo merges in this intent.

Sources: U1 `nfr-requirements/*.md`, `functional-spec.md`, `contract-summary.md` (C1/C2), `inception/domain-design/components.md`, affirmed `team.md` / `project.md`.

---

## Q1 — NFR design package purpose

What should the U1 NFR design artifacts optimize for?

- A. **As-built pattern catalogue (recommended)** — document **implemented** architectural patterns today (JWT filter chain, JDBC monolith, actuator health, ErrorResponse/correlationId); map gaps to **design backlog** rows; do not prescribe new resilience/cache/metrics stacks as committed decisions this intent.
- B. **Target architecture** — design full resilience (circuit breakers, retries), caching tiers, and observability stack as **normative** targets even where not built yet.
- C. **Dual layer** — as-built sections per category plus a separate **follow-up intent** target design appendix (e.g. Redis cache, Micrometer, refresh tokens).
- D. **Minimal closure** — `logical-components.md` + `traceability.json` only; defer category design markdown to Infrastructure Design or a future intent.
- E. **Greenfield rewrite** — treat U1 as if replatforming; patterns may contradict the repo.
- X. Other (please specify)

[Answer]: A

---

## Q2 — Performance design stance

How should `performance-design.md` treat optimization patterns given NFR2 (no SLIs/SLOs; sync JDBC; streak recompute hot spots)?

- A. **Document current + bounded guidance (recommended)** — connection pooling (Hikari), synchronous MVC/JPA paths, scheduler batch; call out streak/board hot spots; optional **future-intent** pattern notes (pagination, read-through cache, query scoping fix) as non-binding.
- B. **Prescriptive SLO-driven design** — assign latency budgets per endpoint group and design caching/async to meet them in this package.
- C. **Hot-path only** — single section on streak aggregate recompute and board read scoping; skip pool/JVM/container notes.
- D. **Benchmark-first design** — require MockMvc/k6 baseline design as a gate before any pattern recommendations.
- X. Other (please specify)

[Answer]: A

---

## Q3 — Security design depth

How should `security-design.md` express authentication, authorization, and data protection?

- A. **As-built architecture + backlog (recommended)** — JWT/HS256 request flow, `WebSecurityConfig` route matrix, user/habit scoping model, TLS-at-nginx + CORS env, secrets via env; STRIDE-oriented **design backlog** for known gaps (board log scoping, refresh rotation, CI supply chain).
- B. **Zero-trust target** — design mTLS, secret rotation, WAF, and token refresh as required patterns for this intent.
- C. **C1 contract mirror** — restate browser/API contract only; defer internal Spring Security design.
- D. **Compliance controls** — expand PCI/HIPAA-style control catalog despite NFR3.14 N/A.
- X. Other (please specify)

[Answer]: A

---

## Q4 — Scalability design for the monolith

How should `scalability-design.md` describe scaling and capacity?

- A. **Single-instance vertical model (recommended)** — one JVM, one Postgres, compose `:latest` deploy; document pool bounds and personal/small-team assumptions; explicit **non-goals** (no K8s/HPA/sharding); future triggers (NFR4.12–NFR4.13) as backlog design notes only.
- B. **Horizontal scaling design** — load balancer, stateless replicas, session/JWT stickiness, and read-replica pattern as committed design.
- C. **Data-partitioning focus** — shard key and archival design for `HabitLog` growth as primary content.
- D. **Defer** — one paragraph pointing to scalability-requirements.md only.
- X. Other (please specify)

[Answer]: A

---

## Q5 — Reliability and resilience patterns

How should `reliability-design.md` treat circuit breakers, retries, failover, and backup?

- A. **Honest as-built + ops model (recommended)** — health checks, Flyway/Postgres durability, single-host blast radius, manual rollback; document **absence** of circuit breakers/queues; scheduler missed-fire and timezone misalignment as **design risks** with qualitative RTO/RPO; backup gap as ops backlog.
- B. **Full resilience package** — specify Resilience4j (or equivalent) configs, retry policies, and bulkheads as normative for U1 even if not in code.
- C. **Scheduler-centric** — center on streak-reset job reliability, idempotency, and per-user clock alignment design.
- D. **Minimal** — health endpoint + compose restart only.
- X. Other (please specify)

[Answer]: A

---

## Q6 — Observability design

How should `observability-design.md` describe metrics, logging, tracing, and alerting?

- A. **As-built pillars + future checklist (recommended)** — Logback defaults, correlationId on errors, actuator health; document no Prometheus/tracing/alert routing; optional **future-intent** design sketches (RED metrics, log shipping, alert rules) as non-binding.
- B. **Full SRE design** — SLI/SLO tables, alert escalation, log retention tiers, and sampling strategy as binding design.
- C. **Error path only** — GlobalExceptionHandler + correlationId; skip health/metrics narrative.
- D. **Match U2** — defer backend observability design until angular NFR design completes.
- X. Other (please specify)

[Answer]: A

---

## Q7 — Logical components inventory

What should `logical-components.md` enumerate as failure domains and blast radius?

- A. **Layered monolith + deploy boundary (recommended)** — map Spring layers (controller/service/repository/scheduler/security) and runtime deps (Postgres, nginx via C1); tie to compose **backend** container and C2 image contract; cross-reference domain-design components where helpful; no new microservice split this intent.
- B. **Microservice decomposition** — propose service boundaries and async contracts beyond current monolith.
- C. **Infrastructure-only** — Postgres + backend JVM only; skip in-app layers.
- D. **Defer to Infrastructure Design** — stub with pointer only.
- X. Other (please specify)

[Answer]: A

---

## Q8 — NFR requirement traceability in design

How should `traceability.json` cover detailed NFR2.x–NFR7.x from the requirements stage?

- A. **Full category coverage (recommended)** — every enumerated NFR id in performance/security/scalability/reliability/observability/tech-stack files gets OK, GAP, or N/A with a concrete design pointer (as-built pattern name or backlog label).
- B. **Gaps and mandates only** — trace only rows marked backlog or team ALWAYS/NEVER mandates; mark remainder N/A at design stage.
- C. **Inception NFR1–NFR5 rollup** — map only intent-level NFRs; skip NFR2.x–NFR7.x detail.
- D. **Empty coverage** — defer traceability to Infrastructure Design.
- X. Other (please specify)

[Answer]: A

---

## Assumptions & Open Questions

- U1 NFR Requirements answers (Q1–Q8 all **A**) remain authoritative unless you change them here.
- Planning-only: design artifacts describe **patterns and decisions**, not implementation-ready code (≤15 line snippets only per stage constraints).
- C1 timeouts/retries and C2 image contract inform reliability/scalability narrative but do not add new requirements unless you choose prescriptive options above.
- Wave batch includes U1 first; angular/compose units follow in later NFR design passes.

None.

---

## Consolidated Summary Confirmation

Does this all look correct before I generate the NFR design artifact package?

- **Q1 (A):** As-built pattern catalogue — implemented patterns today; gaps as design backlog; no committed new stacks this intent.
- **Q2 (A):** Performance design — Hikari/sync MVC-JPA, scheduler batch, hot spots; future patterns non-binding only.
- **Q3 (A):** Security design — JWT flow, route matrix, scoping, TLS/CORS/secrets; STRIDE backlog for known gaps.
- **Q4 (A):** Scalability — single-instance vertical monolith; explicit non-goals; future triggers as backlog notes.
- **Q5 (A):** Reliability — health/Flyway/Postgres ops model; no circuit breakers; scheduler risks and backup gap documented.
- **Q6 (A):** Observability — Logback, correlationId, actuator; no metrics/tracing/alerts; future checklist non-binding.
- **Q7 (A):** Logical components — layered monolith + C1/C2 deploy boundary; no microservice split.
- **Q8 (A):** Traceability — full NFR2.x–NFR7.x coverage with OK/GAP/N/A and design pointers.

- Looks correct
- Request changes

[Answer]: Looks correct
