# CI Pipeline Questions — intent `260914-full-repo-scan`

Context: Brownfield **planning-only** (FR2). CI already exists in three sibling repos; this stage **documents and gates** as-built pipelines—**no workflow YAML commits** from this intent (`bolt-plan.md`: CI stages no change driven here).

Sources: per-unit `infrastructure-design/cicd-pipeline.md`, `build-and-test-summary.md`, `test-results.md`, affirmed `team.md`.

---

## Q1 — Stage outcome for FR2

What should this CI Pipeline stage deliver?

- A. **As-built documentation + quality-gate matrix (recommended)** — consolidate U1/U2/U3 GitHub Actions into record-dir artifacts; list gaps (U1 `-DskipTests` on `main`); recommend follow-up F1/F2 fixes only.
- B. **Modify workflows now** — patch `build-image.yml` in app repos this intent (violates FR2).
- C. **Skip stage** — no ci-pipeline artifacts.
- X. Other (please specify)

[Answer]: A

---

## Q2 — CI platform

Primary automation platform?

- A. **GitHub Actions (recommended)** — matches all three repos today.
- B. **AWS CodePipeline** — greenfield replacement.
- C. **Jenkins on droplet** — not as-built.
- X. Other (please specify)

[Answer]: A

---

## Q3 — Branch and merge gates

Branch strategy for documented gates?

- A. **Trunk-based `main` (recommended)** — short-lived branches; `main` triggers image publish; PR discipline manual today.
- B. **GitFlow** — not as-built.
- C. **Release branches** — not team practice.
- X. Other (please specify)

[Answer]: A

---

## Q4 — Quality gates before production images

Which gates should `quality-gates.md` treat as **normative** (team/project mandates) vs **as-built**?

- A. **Split normative vs as-built (recommended)** — normative: tests before Hub push (project ALWAYS); as-built: U2 complies on `main`, U1 `build-image` skips tests (GAP); compose deploy manual after Hub.
- B. **As-built only** — describe current YAML with no gap callouts.
- C. **Normative only** — pretend all repos already comply.
- X. Other (please specify)

[Answer]: A

---

## Assumptions & Open Questions

- Legacy EB (U1) and S3/CloudFront (U2) workflows remain in repos but are **not** the Compose production path.
- Operation phase may add deployment-pipeline design; this stage closes Construction boundary via `phase-check-construction.md`.

None.

---

## Consolidated Summary Confirmation

Does this all look correct before I generate the CI pipeline artifact package?

- **Q1 (A):** Documentation-only; no repo workflow edits this intent.
- **Q2 (A):** GitHub Actions across repos.
- **Q3 (A):** Trunk-based `main`.
- **Q4 (A):** Normative vs as-built split with U1 test-skip GAP explicit.

- Looks correct
- Request changes

[Answer]: Looks correct
