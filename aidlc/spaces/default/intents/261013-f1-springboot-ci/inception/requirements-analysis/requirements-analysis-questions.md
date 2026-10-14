# Requirements Analysis — Clarifying Questions

**Intent:** [desc] F1: require tests on springboot build-image using existing CodeKB and contracts

**Context:** CodeKB shows `build-image.yml` on `main` runs `mvn -B -DskipTests package` while `build-and-test.yml` runs `mvn test` but is not the production publish path. Team/project rules mandate tests before production image push from `main`.

---

## Q1 — Change surface

Which files may this intent modify to satisfy F1? (We need a clear boundary for code generation.)

A. **`.github/workflows/build-image.yml` only** — adjust the GitHub Actions workflow on `main`; leave `Dockerfile` and other workflows unchanged for now  
B. **`build-image.yml` plus `Dockerfile`** — workflow runs tests in CI and the Docker image build must not skip tests when rebuilding inside the image  
C. **All Spring Boot CI on `main`** — include `build-image.yml`, `Dockerfile`, and stop/disable legacy `deploy-to-elastic-beanstalk.yml` triggers on `main`  
D. **Workflow only, but mirror `build-and-test.yml` exactly** — same JDK vendor, same Maven steps (`test` then `package -DskipTests`), only in `build-image.yml`  
E. **Minimal change:** run `mvn test` before the existing `package -DskipTests` line in `build-image.yml`; no other file changes  
X. Other (please specify)

[Answer]: C

---

## Q2 — Test gate behavior

When tests fail on a push to `main`, what must happen before a Docker Hub `:latest` image is published?

A. **Fail the workflow** — no image build/push; merge is already on `main` but broken images must not publish  
B. **Fail before Docker build** — run `mvn test` in a dedicated job/step; skip docker login/push if tests fail  
C. **Same as current `build-and-test.yml`** — test then package; docker build only if Maven succeeds  
D. **Allow skip via manual dispatch only** — `workflow_dispatch` may bypass tests; `push: main` always requires green tests  
E. **Run tests but do not block push** (document only — *conflicts with project mandates; not recommended*)  
X. Other (please specify)

[Answer]: B

---

## Q3 — Scope of “contracts” for this express intent

Your request references existing **contracts**. For F1, which sources are in scope as binding requirements?

A. **Team/project memory + CodeKB only** — e.g. NEVER push with `-DskipTests` on `build-image` / `main`; align with CodeKB CI findings  
B. **Above plus `habit-tracker-springboot/AGENTS.md` and interview-derived mandates** in project memory  
C. **Also trace to prior intent `260914-full-repo-scan` contract-design** (`contract-summary.md`) where it mentions tests before `build-image`  
D. **CodeKB + project memory; explicitly exclude** full contract-design traceability for this express run  
E. **User will point to a specific contract file path** in a follow-up message  
X. Other (please specify)

[Answer]: B

---

## Q4 — Out of scope confirmation

What should **not** be part of F1? (Select all that apply by listing letters, e.g. `A, C`.)

A. **New product features** or habit/domain behavior changes  
B. **Angular or compose repos** — springboot CI only  
C. **Adding JaCoCo or coverage thresholds** — only require existing suite to run and pass  
D. **Fixing legacy Elastic Beanstalk deploy workflow** on `main`  
E. **Expanding test suite** beyond what exists today (only wire CI to run current tests)  
X. Other (please specify)

[Answer]: A, B, D

---

## Follow-up — Q1 vs Q4 (legacy EB on `main`)

Q1 (C) and Q4 (D) conflicted on changing the legacy Elastic Beanstalk workflow. Resolution:

[Answer]: Follow Q1 (C) — disable or stop `deploy-to-elastic-beanstalk.yml` triggers on `main` as part of F1; Q4 (D) waived for this intent.

---

## Consolidated Summary Confirmation

- **Change surface (Q1):** All Spring Boot CI on `main` — update `build-image.yml` and `Dockerfile`, and disable/stop legacy `deploy-to-elastic-beanstalk.yml` on `main`.
- **Test gate (Q2):** Fail before Docker build — run `mvn test` in a dedicated step/job; no docker login/push if tests fail.
- **Contracts in scope (Q3):** Team/project memory, CodeKB, `habit-tracker-springboot/AGENTS.md`, and interview-derived project mandates.
- **Out of scope (Q4):** No new product/domain features; no angular or compose repos; legacy EB fix *as separate scope* — but EB trigger on `main` is in scope per follow-up (disable/stop).
- **Not listed as out of scope:** JaCoCo/coverage thresholds and expanding the test suite beyond wiring CI (may still be constrained by express/minimal intent in requirements prose).

Does this all look correct before I generate the requirements artifact?

- Looks correct
- Request changes

[Answer]: Looks correct
