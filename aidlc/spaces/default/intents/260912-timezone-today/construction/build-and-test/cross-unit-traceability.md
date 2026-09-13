# Cross-unit traceability — timezone-today

Zero-Unit `poc`. User Stories stage was skipped (no AC IDs). Coverage source: stage-level `construction/code-generation/traceability.json`. Application files live in sibling repos; Code Generation mapped IDs to record markdown because sibling paths sit outside this workflow root.

## Verdict

**Pass with findings.** Every FR and NFR from `requirements.md` appears in `traceability.json`. All FR IDs and NFR1, NFR2, NFR4, NFR5 are `OK` with an existing target file. NFR3 and NFR6 are `N/A` in that JSON (not `OK`); this stage verified both by inspection and treats them as **findings**, not as missing product work.

## Per-ID coverage

| ID | CG status | Owning stage / unit | Target file exists | Notes |
|----|-----------|---------------------|--------------------|-------|
| FR1 | OK | code-generation / timezone-today | yes — `construction/code-generation/code-summary.md` | |
| FR1.1 | OK | code-generation / timezone-today | yes — `code-summary.md` | |
| FR1.2 | OK | code-generation / timezone-today | yes — `code-summary.md` | |
| FR1.3 | OK | code-generation / timezone-today | yes — `unit-test-instructions.md` | |
| FR1.4 | OK | code-generation / timezone-today | yes — `unit-test-instructions.md` | |
| FR1.5 | OK | code-generation / timezone-today | yes — `unit-test-instructions.md` | |
| FR2 | OK | code-generation / timezone-today | yes — `unit-test-instructions.md` | |
| FR2.1 | OK | code-generation / timezone-today | yes — `code-generation-plan.md` | |
| FR2.2 | OK | code-generation / timezone-today | yes — `unit-test-instructions.md` | |
| FR3 | OK | code-generation / timezone-today | yes — `code-generation-plan.md` | |
| FR3.1 | OK | code-generation / timezone-today | yes — `unit-test-instructions.md` | |
| FR3.2 | OK | code-generation / timezone-today | yes — `unit-test-instructions.md` | |
| FR3.3 | OK | code-generation / timezone-today | yes — `code-generation-plan.md` | |
| FR3.4 | OK | code-generation / timezone-today | yes — `code-generation-plan.md` | |
| FR4 | OK | code-generation / timezone-today | yes — `code-generation-plan.md` | |
| FR4.1 | OK | code-generation / timezone-today | yes — `unit-test-instructions.md` | |
| FR4.2 | OK | code-generation / timezone-today | yes — `unit-test-instructions.md` | |
| FR5 | OK | code-generation / timezone-today | yes — `unit-test-instructions.md` | |
| FR5.1 | OK | code-generation / timezone-today | yes — `unit-test-instructions.md` | Executed: `UserTimezonePersistenceTest` |
| FR5.2 | OK | code-generation / timezone-today | yes — `unit-test-instructions.md` | Executed: `UserTodayTest` |
| FR5.3 | OK | code-generation / timezone-today | yes — `unit-test-instructions.md` | Executed: `TimezoneUpdateLeavesLogDatesTest` |
| NFR1 | OK | code-generation / timezone-today | yes — `unit-test-instructions.md` | Executed: `UserClockControllerTest` |
| NFR2 | OK | code-generation / timezone-today | yes — `unit-test-instructions.md` | Executed: `UserClockControllerTest` |
| NFR3 | N/A | code-generation / timezone-today | file exists (`code-summary.md`) but status is not OK | Finding F-01; locally Met via git |
| NFR4 | OK | code-generation / timezone-today | yes — `code-summary.md` | Full suites run in this stage (R-03) |
| NFR5 | OK | code-generation / timezone-today | yes — `unit-test-instructions.md` | create-drop persist still enforces NOT NULL |
| NFR6 | N/A | code-generation / timezone-today | file exists (`code-summary.md`) but status is not OK | Finding F-02; locally Met via grep |

No User Story AC IDs (stage skipped).

## Findings (surface at approval)

### F-01 — NFR3 not `OK` in Code Generation `traceability.json`

Code Generation marked NFR3 (`docs/domain.md` unchanged) as `N/A`. This gate requires `OK` for coverage. Independent check: `git diff -- docs/domain.md` is empty. Product law was not edited.

### F-02 — NFR6 not `OK` in Code Generation `traceability.json`

Code Generation marked NFR6 (do not use `app.scheduling.timezone` as the user clock) as `N/A`. Independent check: `UserClockServiceImpl` derives today from injected `Clock` and `user.timezone`. `app.scheduling.timezone` remains only on the streak-job scheduler.

### F-03 — Sibling application paths not in `traceability.json` targets (CG R-02)

Targets are record markdown under this intent, not Spring Boot / Angular source files. Do not invent a Unit directory to satisfy a per-unit path shape. Coverage of product IDs is still complete via the record files plus the executed tests above.

## Uncovered elements

None among FR/NFR IDs except the two `N/A` statuses already listed as F-01 and F-02. Those IDs are implemented and verified; the gap is JSON status, not missing code.
