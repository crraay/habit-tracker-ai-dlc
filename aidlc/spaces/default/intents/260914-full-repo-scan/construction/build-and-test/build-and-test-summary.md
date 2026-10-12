# Build and Test summary — full-repo-scan

Intent `260914-full-repo-scan` · **Standard** test strategy · **FR2 planning-only** (no application-repo merges from this workflow).

## Build status

- **habit-tracker-springboot (U1):** `mvn -B test` → 11 tests, 0 failures (2026-10-08).
- **habit-tracker-angular (U2):** `npm run test:ci` → 29 SUCCESS after `npm install` (2026-10-08).
- **habit-tracker-compose (U3):** no automated suite; operational verification deferred to follow-up Bolt F3.

Prerequisites: JDK 17, Maven, Node.js, ChromeHeadless for Karma.

## Test type inventory

| Artifact | Generated | Executed |
|----------|-----------|----------|
| `build-instructions.md` | yes | yes (Maven + npm test) |
| `integration-test-instructions.md` | yes | via full unit suites |
| `performance-test-instructions.md` | yes | deferred (no numeric SLO) |
| `security-test-instructions.md` | yes | partial via `UserClockControllerTest` in full backend run |
| Per-unit `unit-test-instructions.md` (×3) | upstream | U1/U2 commands run once each |

## Coverage expectations per unit

| Unit | Expectation | This stage |
|------|-------------|------------|
| U1 springboot | Tests green on `main`; no JaCoCo floor | 11/11 green locally |
| U2 angular | `test:ci` on `main` before image push (GAP in CI today) | 29/29 green locally |
| U3 compose | Manual deploy smoke | documented only |

## Target Verification Matrix

| Target ID | Source | Expected | Actual | Evidence | Owning Stage | Verdict |
|-----------|--------|----------|--------|----------|--------------|---------|
| T-FR2-NO-MERGE | FR2, FR2.1; bolt-plan | No app-repo deliverables from intent | No Construction merges; empty code-gen manifests | per-unit `source-manifest.json` | code-generation | Met |
| T-SUITE-BACKEND | team.md; U1 unit-test-instructions | Existing Spring suite green | 11 tests, 0 failures | `test-results.md`; `mvn -B test` | build-and-test | Met |
| T-SUITE-ANGULAR | team.md; U2 unit-test-instructions | Existing Angular suite green | 29 SUCCESS | `test-results.md`; `npm run test:ci` | build-and-test | Met |
| T-COV-TEAM | Q4-A; org classic note | Report coverage; no 80% gate | ~32% lines (Angular) | Karma coverage summary | build-and-test | Met |
| T-COV-ORG-80 | org.md classic floor | 80% line coverage if enforced | Team affirms no JaCoCo floor | team.md vs org classic note | n/a | N/A |
| T-CI-SKIP-TESTS | BL-INFRA-01; NFR5.17 (CG GAP) | Document CI test gap; local suites green | Local U1/U2 suites passed; CI skip documented | traceability GAP + `test-results.md` | follow-up F1/F2 | Met |
| T-COMPOSE-TESTS | U3 code-summary | No automated compose tests | N/A | compose repo | n/a | N/A |
| T-PERF-SLO | nfr-design (no CI SLO) | No measurable perf target in requirements | No load test run | `performance-test-instructions.md` | n/a | N/A |
| T-E2E-COMPOSE | bolt-plan FR2 row | Compose E2E out of scope this intent | Not scheduled (FR2.1) | `bolt-plan.md` Construction table | follow-up F3 | N/A |

No `Pending` rows at stage exit.

## Readiness

- **Build-ready:** yes (U1/U2 compile and test locally)
- **Test-ready:** yes (baseline suites green in this environment)
- **Deployment-ready:** not claimed — CI pipeline stage next; no image publish from this intent

## Known limitations

- Traceability JSON marks some backlog IDs as **GAP** (US2.5, NFR5.17, NFR7.26, NFR3.1) — intentional follow-up Bolts, not failures of this scan intent.
- Angular dependency install required on fresh clones before `test:ci`.
- Org **classic** 80% coverage floor is **not** team-enforced; do not treat Unverified T-COV-ORG-80 as blocking FR2 closure.
