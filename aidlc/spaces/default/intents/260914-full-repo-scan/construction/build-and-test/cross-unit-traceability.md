# Cross-unit traceability — full-repo-scan

Three units: `habit-tracker-springboot`, `habit-tracker-angular`, `habit-tracker-compose`. Coverage sources: per-unit `construction/*/code-generation/traceability.json` plus requirements and user stories.

## Verdict

**Pass with findings.** Every **FR** and **NFR** ID from `requirements.md` is referenced in at least one unit traceability file with status **OK** or documented **GAP** (follow-up backlog). User stories **US1.1–US1.12** and **US2.1–US2.7** are mapped in `stories.md` and reflected in code-generation plans/summaries; intent-only **US1.12** is **OK** in U1 traceability.

Findings **F-01–F-03** below surface GAP rows and JSON-vs-product path semantics at the approval gate — they do not require code changes in this intent.

## Requirements coverage

| ID | CG coverage (any unit) | Status | Target / note |
|----|------------------------|--------|----------------|
| FR1 | CodeKB paths in inception | OK | reverse-engineering complete |
| FR1.1 | CodeKB content | OK | codekb trees |
| FR2 | all units | OK | zero repo edits |
| FR2.1 | all units | OK | planning-only stages |
| FR2.2 | units-generation / bolt-plan | OK | follow-up Bolts F1–F3 |
| FR3 | inception artifacts | OK | requirements through delivery-planning |
| FR3.1 | user-stories | OK | as-built vs backlog separation |
| FR3.2 | domain-design | OK | gap catalogue |
| FR3.3 | bolt-plan, code-summary | OK | Construction mapping table |
| FR4 | stories backlog | OK | US2.x Won't Have this intent |
| FR5 | requirements gate | OK | FR5.1 default criteria |
| FR5.1 | delivery-planning | OK | stakeholder criteria |
| FR5.2 | requirements | OK | revision mechanism |
| FR6 | requirements | OK | follow-up only |
| NFR1 | traceability prose | OK | Sources sections |
| NFR2 | compose scope | OK | U3 planning boundary |
| NFR3 | project mandates | OK | team.md / project.md |
| NFR4 | relaxed change control | OK | aidlc-state |
| NFR5 | English artifacts | OK | this record |

Extended IDs in unit JSON (not top-level requirements headings):

| ID | Unit | Status | Note |
|----|------|--------|------|
| NFR5.17 | U1, U2 | GAP | CI test before image — follow-up |
| NFR7.26 | U1, U2 | GAP | CI alignment — follow-up |
| NFR2.1 | U3 | OK | planning boundary |
| NFR3.1 | U3 | GAP | deploy hardening F3 |
| BL-INFRA-01 | U1 | GAP | `-DskipTests` on build-image |

## User story coverage

| Story | Intent class | Traceability |
|-------|--------------|--------------|
| US1.1–US1.11 | As-built | Documented in functional-design / stories; no merge this intent |
| US1.12 | Intent-only | OK in U1 traceability (workflow traceability) |
| US2.1–US2.7 | Backlog | GAP or Won't Have; follow-up intents |

No separate three-segment AC IDs in `stories.md`; coverage uses story IDs above.

## Findings (approval gate)

### F-01 — GAP rows are follow-up work, not scan failures

`NFR5.17`, `NFR7.26`, `US2.5`, `NFR3.1`, `BL-INFRA-01` are **GAP** in code-generation JSON by design (FR2). Build and Test recorded baseline suites green; CI policy gaps remain for Bolts F1–F3.

### F-02 — Traceability targets are record markdown, not sibling repo paths

Code-generation traceability points at plan/summary files under this intent, not `habit-tracker-springboot/src/...`. Cross-unit closure uses requirements + stories enumeration plus executed baseline tests (`test-results.md`).

### F-03 — Org classic 80% coverage vs team posture

Org classic mentions 80% line coverage; team affirms tests green without JaCoCo. Documented as **Unverified** org floor in build-and-test summary, not a blocking defect for FR2.

## Uncovered elements

None among enumerated FR/NFR IDs from `requirements.md`. GAP statuses denote deferred follow-up, not missing documentation for this intent.
