# Requirements — F1 springboot build-image CI tests

## Sources

- Initial description: `project-description.json` — F1: require tests on springboot build-image using existing CodeKB and contracts [desc]
- Workflow-selected scope: express (Minimal depth, Minimal test strategy) [scope]
- Brownfield CodeKB: `codekb/habit-tracker-springboot/` — CI/test focus (`code-quality-assessment.md`, `architecture.md`, related artifacts) [memory]
- Team/project memory: `aidlc/spaces/default/memory/team.md`, `project.md` (NEVER push production images from `build-image` on `main` with `-DskipTests`; ALWAYS run tests before publish) [memory]
- Repository agent law: `habit-tracker-springboot/AGENTS.md` (legacy EB workflow; production path via compose) [memory]
- Requirements Q&A: `requirements-analysis-questions.md` (Q1–Q4, EB follow-up, summary confirmed) [Q1]–[Q4]

## Intent analysis

**Goal:** Every push to **`main`** in `habit-tracker-springboot` that publishes the production Docker Hub image (`docker.io/crraay/habit-tracker-springboot:latest`) must run the **existing Maven test suite** and **fail the workflow before any Docker build/push** if tests fail.

**Why:** CodeKB and affirmed project rules document a gap: `build-image.yml` uses `mvn -B -DskipTests package` on `main`, while tests run only in `build-and-test.yml` (not on the production publish path). F1 closes that gap without changing product/domain behavior.

**Success:** A red test on `main` blocks `:latest` publish; a green test allows the current publish flow to continue; `Dockerfile` and legacy EB overlap on `main` are aligned with the chosen CI surface; no changes in angular or compose repos.

## Functional requirements

### Production CI — build-image

**FR1** On `push` to **`main`** and on **`workflow_dispatch`**, the `build-image` GitHub Actions workflow runs **`mvn test`** (or equivalent full unit/integration test invocation used by `build-and-test.yml`) **before** any step that builds or pushes the production Docker image.

Pass: workflow YAML orders test execution prior to `docker login` / `docker build` / `docker push`; a failing test fails the job without publishing.

**FR1.1** If tests fail, the workflow **must not** log in to Docker Hub, **must not** build/push `:latest`, and **must not** treat the commit as a successful production image publish.

**FR1.2** If tests pass, the workflow may proceed with the existing image build and push to `docker.io/crraay/habit-tracker-springboot:latest` (behavior otherwise unchanged unless required by FR2–FR3).

**FR1.3** Use the **existing test profile** (`application-test.properties`, H2, current JUnit/Spring tests) — no new test cases are required for F1 (see out of scope).

### Docker image build

**FR2** The **`Dockerfile`** used by `build-image` must not publish an image built from a Maven step that **skips tests** when CI is the authority for production publish, **or** CI must build/package only after tests pass and the Docker build must consume that verified artifact (implementation choice in code generation — outcome is no `:latest` from untested bytecode).

Pass: either `Dockerfile` runs tests (or uses a pre-tested JAR from CI) or documents/implements a path where skipTests in Docker cannot bypass FR1 on `main`.

### Legacy Elastic Beanstalk workflow on main

**FR3** The legacy workflow **`.github/workflows/deploy-to-elastic-beanstalk.yml`** must **not** trigger on **`push` to `main`** (disable, remove, or restrict triggers) so `main` no longer runs parallel legacy deploy/test paths that conflict with the compose production model.

Pass: pushing to `main` does not start EB deploy; `AGENTS.md` “do not extend EB” policy is respected; manual or branch-only triggers may remain if already present and non-conflicting.

**FR3.1** Disabling EB on `main` is **in scope** for F1 (Q1 C with follow-up); deep EB migration or infra cleanup beyond trigger removal is not required.

### Verification

**FR4** After implementation, a maintainer can confirm on a PR or `main` run: test step executes, failure blocks push, success allows push (document exact workflow run URL or log markers in PR description — not a new doc deliverable unless code generation adds a one-line README/AGENTS note).

## Non-functional requirements

**NFR1** **Repository scope:** Changes limited to **`habit-tracker-springboot`** only (workflows, `Dockerfile`, minimal supporting notes if needed).

**NFR2** **No domain/product changes:** Habit rules, REST API behavior, entities, and `docs/domain.md` are unchanged (express F1 is CI-only).

**NFR3** **Test suite:** Existing tests must remain green; F1 wires CI to run them, not expand coverage (no JaCoCo floor, no new mandatory coverage tooling).

**NFR4** **JDK:** Prefer alignment with current `build-image` (Temurin 17) unless mirroring `build-and-test` (Corretto) is necessary for parity; document any intentional difference in PR/commit message, not a new ADR.

**NFR5** **Secrets & permissions:** Do not broaden workflow permissions or log secrets; reuse existing Docker Hub secret pattern.

**NFR6** **Traceability:** Implementation must satisfy affirmed **NEVER push … `-DskipTests`** on production `build-image` from `project.md` and team testing posture.

## Constraints

- Trunk-based: merge to `main` triggers production image workflow; gate must hold on `main`.
- Compose repo remains orchestration-only; no compose workflow edits.
- Angular repo untouched.
- Express / Minimal: smallest diff that satisfies FR1–FR3.
- Legacy EB workflow file may remain in repo but must not fire on `main` push (FR3).

## Assumptions

- Current ~5 test classes / ~11 methods are sufficient to satisfy “tests run” for F1; flakiness is pre-existing and not in scope to fix unless exposed by enabling CI.
- `workflow_dispatch` on `build-image` follows the same test gate as `push: main` unless explicitly documented otherwise in Q2 (user chose fail-before-docker for all paths).
- Production consumers continue pulling `:latest` from Docker Hub; no tag strategy change.

## Out of scope

- New product features or habit/domain rule changes (Q4 A).
- `habit-tracker-angular` and `habit-tracker-compose` repos (Q4 B).
- JaCoCo, coverage thresholds, or quality gates beyond running existing tests (Q4 C not selected as out — explicitly excluded here as non-goals for express F1).
- Expanding the test suite with new behavioral tests (only wire existing suite).
- Replacing Docker Hub, compose deploy, or manual rollout process.
- Full removal of EB workflow file content beyond trigger/disable on `main` (FR3).

## Open questions

**OQ1 — Dockerfile strategy:** Whether FR2 is satisfied by removing `-DskipTests` in `Dockerfile`, multi-stage copy of CI-built JAR, or test-in-Docker — left to code generation with FR2 pass criteria.

**OQ2 — workflow_dispatch:** If maintainers need a documented emergency bypass, none was requested in Q2; default is same test gate for manual dispatch.

## Assumptions & Open Questions

See **Assumptions** and **Open questions** above.
