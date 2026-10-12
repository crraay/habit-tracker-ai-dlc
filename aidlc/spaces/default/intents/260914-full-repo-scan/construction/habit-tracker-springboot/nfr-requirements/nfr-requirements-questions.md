# NFR Requirements Questions — unit `habit-tracker-springboot`

Context: Brownfield **planning-only** intent (FR2). Unit **U1** (`service`, repo `habit-tracker-springboot`). This stage produces **reference NFR and tech-stack documentation** for follow-up work and Bolt planning; no application-repo merges in this intent.

Sources: U1 `functional-spec.md`, `rules.md`, `requirements.md` (NFR1–NFR5), `contract-summary.md` (C1/C2), `codekb/habit-tracker-springboot/` (architecture, technology-stack), affirmed `team.md` / `project.md` mandates.

---

## Q1 — NFR package purpose for this intent

What should the U1 NFR requirements artifacts optimize for?

- A. **As-built baseline (recommended)** — document **implemented** performance, security, scalability, reliability, and observability posture today; gaps and risks explicit; no new contractual SLOs for this intent.
- B. **Target SLO package** — define quantitative p95/p99 latency, availability, and capacity targets as **normative** for the product (even if not measured in code today).
- C. **Dual layer** — as-built sections per category plus a separate **follow-up intent** target table for hardening (user-scoped queries, per-user streak reset, etc.).
- D. **Minimal closure** — `tech-stack-decisions.md` + `traceability.json` only; defer category markdown to NFR Design or a future intent.
- E. **Compliance-heavy** — expand regulatory/compliance rows even though requirements list no mandatory framework for this product.
- X. Other (please specify)

[Answer]: A

---

## Q2 — Performance requirements style

How should `performance-requirements.md` treat latency and throughput for this personal-scale monolith?

- A. **Documented absence + engineering guidance** — state that no formal SLIs/SLOs exist in repo/ops; cite typical interactive API expectations as **non-binding guidance** for future intents only.
- B. **Explicit numeric targets** — assign p95/p99 response-time and RPS targets per endpoint group (auth, habits, track, statistics) as requirements rows with NFRx.y ids.
- C. **As-built constraints only** — JDBC pool, scheduler cron, aggregate recompute paths, and known hot spots (e.g. full streak recompute) without numeric SLOs.
- D. **Benchmark mandate** — require future intents to add load tests and publish baseline numbers before changing behavior.
- X. Other (please specify)

[Answer]: A

---

## Q3 — Security requirements scope

How deep should `security-requirements.md` go for U1?

- A. **As-built + backlog** — JWT/HS256, route matrix, user scoping, ErrorResponse/correlationId, env secrets (`JWT_SECRET`, CORS); STRIDE-style **backlog** items for known gaps (board log scoping, dev DataInitializer, refresh token absence).
- B. **Threat-model primary** — full STRIDE table as normative; map each threat to required controls (some not implemented yet).
- C. **Contract-only** — restate C1 auth/error contract; defer implementation detail to code generation in a future intent.
- D. **Minimal auth** — login/JWT expiry only; skip authorization scoping and scheduler security notes.
- X. Other (please specify)

[Answer]: A

---

## Q4 — Scalability and capacity stance

How should `scalability-requirements.md` describe growth for U1?

- A. **Single-instance monolith (recommended)** — document vertical scaling and connection-pool bounds; no horizontal sharding; honest **personal/small-team** capacity assumptions; C2 image deploy via compose unchanged this intent.
- B. **Growth roadmap** — include staged targets (replicas, read replicas, caching) as numbered requirements even if not planned soon.
- C. **N/A minimal** — one section stating scalability is out of scope for this intent with pointer to architecture.md.
- D. **Data-growth focus** — emphasize HabitLog volume, index/migration strategy, and archival policy as requirements.
- X. Other (please specify)

[Answer]: A

---

## Q5 — Reliability and availability targets

How should `reliability-requirements.md` express availability and recovery?

- A. **As-built ops** — `/actuator/health`, Docker HEALTHCHECK, compose restart policy, Flyway/PostgreSQL durability; **no external SLA**; RTO/RPO as qualitative personal-app notes unless you specify numbers in chat.
- B. **Numeric SLO** — e.g. 99.9% monthly availability with explicit error budget and MTTR targets as NFR rows.
- C. **Scheduler reliability** — center the doc on streak-reset job correctness, missed-fire behavior, and timezone misalignment risk vs user clocks.
- D. **Defer** — reliability covered only in observability + tech-stack files.
- X. Other (please specify)

[Answer]: A

---

## Q6 — Observability requirements

What belongs in `observability-requirements.md` for U1?

- A. **As-built pillars** — structured logging levels, correlationId on errors, actuator health exposure, absence of distributed tracing/metrics stack; **future-intent** checklist (RED metrics, log aggregation) as non-enforcing backlog.
- B. **Full SRE package** — SLI/SLO tables, alert routing, retention tiers, and tracing sampling as binding requirements.
- C. **Security-audit logging only** — auth failures and admin actions; skip correlationId and health endpoints.
- D. **Match SPA** — defer backend observability to U2 NFR stage; U1 file is stub with cross-reference only.
- X. Other (please specify)

[Answer]: A

---

## Q7 — Tech stack decisions for this intent

How should `tech-stack-decisions.md` treat the brownfield stack (Java 17, Spring Boot 3.5.5, PostgreSQL, Flyway, JJWT, springdoc, Docker CI)?

- A. **Affirm as-built lock-in (recommended)** — record current choices and rationale from CodeKB; **no upgrade or replacement decisions** in this planning intent; note follow-up evaluation triggers only.
- B. **Active selection** — re-decide stack as if greenfield (may contradict repo).
- C. **Delta only** — document mandated team practices (Flyway, no hand-edited web-api) and forbidden paths (EB workflow); skip version table.
- D. **Upgrade roadmap** — include planned Boot/JWT/springdoc version bumps as decisions with dates.
- X. Other (please specify)

[Answer]: A

---

## Q8 — Inception NFR traceability (NFR1–NFR5)

How should `traceability.json` cover intent-level NFR1–NFR5 for U1?

- A. **Map all five** — each NFR1–NFR5 gets OK/N/A with derived NFRx.y targets in category files where applicable (e.g. NFR3 mandates → security/tech-stack rows).
- B. **NFR3 + NFR1 only** — team mandates and traceability lineage; mark NFR2/NFR4/NFR5 N/A at unit level with intent-level rationale.
- C. **Defer traceability** — empty coverage array with note that inception NFRs are intent-wide only.
- X. Other (please specify)

[Answer]: A

---

## Assumptions & Open Questions

- U1 is `service` kind — all six category markdown files plus `tech-stack-decisions.md` apply per stage definition.
- Planning-only: numeric SLOs are optional; prefer honesty about unmeasured as-built behavior.
- Contract SLAs from C1 (timeouts/retries) constrain narrative but are not new requirements unless Q2/Q5 chooses numeric targets.

None.

---

## Consolidated Summary Confirmation

Does this all look correct before I generate the NFR artifact package?

- **Q1 (A):** As-built baseline — implemented NFR posture today; gaps explicit; no new contractual SLOs this intent.
- **Q2 (A):** Performance — no formal SLIs/SLOs in repo; non-binding engineering guidance for future intents only.
- **Q3 (A):** Security — as-built JWT/routes/scoping/ErrorResponse plus STRIDE-style backlog for known gaps.
- **Q4 (A):** Scalability — single-instance monolith; personal/small-team capacity; vertical scaling only.
- **Q5 (A):** Reliability — actuator health, Docker/compose ops, Flyway/PostgreSQL; no external SLA; qualitative RTO/RPO.
- **Q6 (A):** Observability — logging, correlationId, health; no tracing/metrics stack; future checklist as backlog.
- **Q7 (A):** Tech stack — affirm brownfield lock-in; no upgrade decisions this intent.
- **Q8 (A):** Traceability — map all inception NFR1–NFR5 with derived NFRx.y rows where applicable.

- Looks correct
- Request changes

[Answer]: Looks correct
