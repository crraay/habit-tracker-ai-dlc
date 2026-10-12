# Build and Test Questions — intent `260914-full-repo-scan`

Context: Brownfield **planning-only** intent (FR2, Q8-A). Three units (U1 Spring Boot, U2 Angular, U3 Compose). Code Generation produced **no application-repo merges**; this stage verifies **existing** build/test commands documented in per-unit `unit-test-instructions.md` and records baseline results for the scan closure.

Sources: `bolt-plan.md` (build-and-test skip/no-op for intent deliverables), `requirements.md` (FR2.1), per-unit code-generation outputs, affirmed `team.md` (test-after, tests green on `main`).

---

## Q1 — Execution scope for this intent

How should Build and Test treat FR2.1 for this workflow?

- A. **Baseline verification only (recommended)** — run documented `mvn test` and `npm run test:ci` in sibling clones when the environment allows; no new tests or repo commits; compose has no automated suite (document manual ops checks).
- B. **Documentation-only** — produce instruction files without executing commands.
- C. **Full Standard campaigns** — add new integration/load/security suites in product repos (contradicts FR2).
- X. Other (please specify)

[Answer]: A

---

## Q2 — Integration test posture (Standard strategy)

What integration coverage applies at this stage?

- A. **Existing cross-layer tests only (recommended)** — Spring `@SpringBootTest` / MockMvc and Angular co-located specs; no new E2E or Compose stack in this intent.
- B. **Compose smoke** — require docker-compose up and manual login path this stage.
- C. **Contract tests** — add Pact/OpenAPI diff gates in app repos now.
- X. Other (please specify)

[Answer]: A

---

## Q3 — Performance and security instruction files

NFR design exists per unit. Generate performance/security instruction files?

- A. **Yes — document deferred/manual checks (recommended)** — files describe what follow-up Bolts F1–F3 would run; execute only what local unit tests already cover (JWT 401, IANA 400, etc.).
- B. **Skip optional files** — integration + build only.
- C. **Run full SAST/load in CI** — change pipelines this intent (out of FR2 scope).
- X. Other (please specify)

[Answer]: A

---

## Q4 — Coverage floor

Classic org default mentions 80% line coverage; team affirms **tests green, no JaCoCo floor**. How should the Target Verification Matrix treat coverage?

- A. **Team posture (recommended)** — record actual coverage from `test:ci` if run; do not fail the stage on percentage; note gap vs org classic as awareness.
- B. **Enforce 80%** — fail stage until coverage met (not as-built).
- C. **Do not collect coverage** — omit coverage rows entirely.
- X. Other (please specify)

[Answer]: A

---

## Assumptions & Open Questions

- Local workspace may lack `node_modules` until `npm install` (environment setup, not an FR2 merge).
- `build-image` on `main` may still use `-DskipTests` (BL-INFRA-01 / NFR5.17 GAP in traceability) — documented, not fixed here.

None.

---

## Consolidated Summary Confirmation

Does this all look correct before I generate the build-and-test artifact package?

- **Q1 (A):** Baseline verification of existing suites; no product-repo commits from this intent.
- **Q2 (A):** Integration = existing Spring/Angular tests; no Compose E2E this pass.
- **Q3 (A):** Performance/security instruction files with deferred follow-up execution.
- **Q4 (A):** Report coverage informally; gate on suites green, not 80% floor.

- Looks correct
- Request changes

[Answer]: Looks correct
