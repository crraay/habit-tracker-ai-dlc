# Feedback & Optimization Questions — intent `260914-full-repo-scan`

Context: **FR2 planning-only** · Close Operation with **synthesis and improvement backlog**; **no AWS Cost Explorer, Config, or production metric pulls** this intent.

Sources: Operation artifacts (`observability-setup`, `deployment-execution`, `performance-validation`, `incident-response`), `inception/delivery-planning/bolt-plan.md` (F1–F3 reference Bolts).

---

## Q1 — Stage deliverable

What should Feedback & Optimization produce?

- A. **Closing synthesis package (recommended)** — `slo-report.md`, `cost-analysis.md`, `drift-report.md`, `feedback-loop.md`; tie gaps to F1–F3; complete workflow on approve.
- B. **Run live AWS optimization APIs** — not as-built (DO Compose prod).
- C. **Skip final stage** — not recommended for full-repo scan closure.
- X. Other (please specify)

[Answer]: A

---

## Q2 — SLO compliance

How are SLOs reported?

- A. **No contractual SLOs (recommended)** — document N/A error budget; qualitative ops expectation from `slo-config.md`; no burn-rate math without metrics.
- B. **99.9% monthly with burn alerts** — not configured.
- C. **Synthetic uptime data import** — not available FR2.
- X. Other (please specify)

[Answer]: A

---

## Q3 — Cost optimization

What cost analysis applies?

- A. **Single-droplet TCO sketch (recommended)** — DO host + GitHub Actions minutes + public Hub pulls; qualitative savings (right-size droplet, image retention); no live billing API.
- B. **AWS Cost Explorer report** — legacy paths only.
- C. **FinOps chargeback** — N/A personal app.
- X. Other (please specify)

[Answer]: A

---

## Q4 — Drift detection

How is drift assessed?

- A. **Documentation vs git as-built (recommended)** — compare scanned repos to intent artifacts; note CI gaps (U1 tests on build-image); no AWS Config.
- B. **Continuous Config rules** — not deployed.
- C. **Kubernetes drift** — N/A.
- X. Other (please specify)

[Answer]: A

---

## Q5 — User feedback signals

What user-behavior inputs exist?

- A. **No in-app analytics (recommended)** — feedback via direct reports/issues; `feedback-loop.md` lists technical backlog from scan, not product analytics.
- B. **Product analytics pipeline** — not in repo.
- C. **NPS survey automation** — not present.
- X. Other (please specify)

[Answer]: A

---

## Q6 — Operational toil / automation

What optimization themes to prioritize?

- A. **Top backlog from Operation scan (recommended)** — post-deploy health check, SSH keys, metrics, backups, U1 test gate on build-image, k6 baseline (F2/F3 alignment).
- B. **Full CD auto-deploy on compose push** — out of FR2.
- C. **Migrate prod back to AWS EB** — forbidden for new work.
- X. Other (please specify)

[Answer]: A

---

## Assumptions & Open Questions

- Final gate may offer workflow complete vs new ideation per stage file; user chooses at approval.
- `load-test-results` consumed as N/A performance posture from `performance-validation/test-results.md`.

None.

---

## Consolidated Summary Confirmation

Does this all look correct before I finalize the feedback & optimization artifact package?

- **Q1 (A):** Four closing docs + workflow completion on approve.
- **Q2 (A):** SLO report = honest N/A + qualitative notes.
- **Q3 (A):** DO/GitHub/Hub cost sketch, no AWS CE.
- **Q4 (A):** Repo/doc drift review.
- **Q5 (A):** No analytics; technical feedback loop.
- **Q6 (A):** Prioritized backlog from scan.

- Looks correct
- Request changes

[Answer]: Looks correct
