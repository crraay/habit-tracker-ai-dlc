# Incident Response Questions — intent `260914-full-repo-scan`

Context: **FR2 planning-only** · Document **as-built** incident response for Compose production; **no AWS Incident Manager, SSM Automation, or live drills** from this intent.

Sources: `operation/observability-setup/*`, U1 `reliability-design.md`, `security-design.md`, U3 `infrastructure-specification.md`, `operation/deployment-pipeline/rollback-runbook.md`.

---

## Q1 — Stage deliverable

What should Incident Response produce?

- A. **Markdown runbooks + plan + escalation matrix (recommended)** — `runbooks.md`, `incident-plan.md`, `escalation-matrix.md`; operator procedures; no AWS runbook library install.
- B. **Deploy AWS Systems Manager Automation documents** — not as-built on DO Compose path.
- C. **Skip stage** — not recommended given prior Operation artifacts.
- X. Other (please specify)

[Answer]: A

---

## Q2 — Likely failure modes

Which failures should runbooks prioritize?

- A. **Compose stack failures (recommended)** — Postgres unhealthy, backend down/JDBC, bad deploy, disk full, nginx 502, Flyway migration failure, scheduler/streak drift; cross-link rollback runbook.
- B. **Multi-AZ AWS outage** — not production topology.
- C. **Kubernetes pod crash loop** — not used.
- X. Other (please specify)

[Answer]: A

---

## Q3 — Escalation and on-call

What escalation model applies?

- A. **Single operator / owner (recommended)** — no 24/7 rotation or PagerDuty; matrix lists operator → optional second developer; personal-app response time same-day.
- B. **Follow-the-sun on-call** — not configured.
- C. **Vendor SOC escalation** — N/A.
- X. Other (please specify)

[Answer]: A

---

## Q4 — Automated remediation

What auto-remediation exists?

- A. **None beyond Docker restart policy (recommended)** — `restart: unless-stopped`; no SSM auto-runbooks; manual `./scripts/deploy-service.sh` and rollback doc.
- B. **Lambda auto-heal** — not present.
- C. **Self-healing k8s** — not present.
- X. Other (please specify)

[Answer]: A

---

## Q5 — Communication during incidents

How are stakeholders notified?

- A. **Informal (recommended)** — direct message to users if extended outage; no status page in repo; GitHub issue optional for dev tracking.
- B. **Public status.io page** — not configured.
- C. **Regulated breach notification playbook** — out of scope for personal app unless data breach (security-design reference only).
- X. Other (please specify)

[Answer]: A

---

## Q6 — RTO / RPO

What recovery targets are documented?

- A. **Qualitative from NFR5.8–5.10 (recommended)** — RTO: redeploy + healthy volume (hours OK); RPO: last backup if any else volume state; no numeric SLA.
- B. **RTO 15 min / RPO 5 min** — not codified.
- C. **Zero RPO with multi-region** — not as-built.
- X. Other (please specify)

[Answer]: A

---

## Assumptions & Open Questions

- Security incidents (credential leak, JWT compromise) reference rotate secrets in `.env` and redeploy; detailed IR may live in future security runbook.
- Post-incident review required by Operation phase guardrails for P1/P2 — document lightweight template in incident-plan for when severity warrants.

None.

---

## Consolidated Summary Confirmation

Does this all look correct before I finalize the incident response artifact package?

- **Q1 (A):** Markdown runbooks, incident plan, escalation matrix.
- **Q2 (A):** Compose-centric failure runbooks.
- **Q3 (A):** Single-operator escalation.
- **Q4 (A):** No automated remediation beyond restart policy.
- **Q5 (A):** Informal communication.
- **Q6 (A):** Qualitative RTO/RPO.

- Looks correct
- Request changes

[Answer]: Looks correct
