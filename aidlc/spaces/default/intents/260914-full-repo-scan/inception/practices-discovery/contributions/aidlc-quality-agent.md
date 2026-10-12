**Collaborator:** aidlc-quality-agent

## Contribution

Independent review of **testing posture**, **CI quality gates**, **coverage signals**, and **risk gaps** across `habit-tracker-springboot`, `habit-tracker-angular`, and `habit-tracker-compose`. Sources: lead drafts (`team-practices.md`, `discovered-rules.md`, `evidence.md`), CodeKB `code-quality-assessment.md` for all three repos, and org default **Testing Posture** in `aidlc/spaces/default/memory/org.md` (classic scope: test-after default plus **80% line-coverage floor** and **CI execution before merge** when posture is not yet affirmed in `team.md`).

### Endorsements (lead draft is largely accurate)

- **Methodology inference (test-after)** matches repository evidence: no BDD/feature files, no red-green TDD cadence in history; backend tests cluster around recently added user-clock/timezone work; many Angular specs are scaffold-level.
- **CI asymmetry** is correctly stated: Angular **`build-image` on `main`** runs **`npm run test:ci`** (ChromeHeadless + coverage flag); Spring Boot **`build-image` on `main`** runs **`mvn package -DskipTests`**; compose deploy workflow is **deploy-only** with no validation job.
- **Spring Boot `build-and-test.yml`** trigger nuance (`feat/actions_cicd` + **`workflow_call`**, not every push to `main`) matches evidence and explains why trunk may ship images without a recent automated test run on that commit line.
- **Compose has no automated tests** — appropriate to classify quality as **operational** (docs, manual dispatch, operator smoke); product gates are delegated to app repos per `DOCKER.md`.
- **Gap list in lead draft** (require tests on springboot image build; run `build-and-test` on `main`) is the right minimum interview agenda for CI.

### Testing posture (quality lens)

| Dimension | Spring Boot | Angular | Compose | Notes for interview |
|-----------|-------------|---------|---------|---------------------|
| Frameworks | JUnit 5, Spring Boot Test, MockMvc, H2 profile | Jasmine 5 + Karma 6 | None | Stack is standard; depth is the issue. |
| Automated count / layout | **6** test classes; timezone/clock concentration | **22** co-located `*.spec.ts` | None | Core habit/track/streak/auth paths largely untested on backend. |
| Coverage tooling | **None** (no JaCoCo/Sonar/thresholds) | `--code-coverage` in `test:ci`; **no enforced floor** in CI | N/A | Org **classic** default implies **80% line floor** — **not implemented** in any repo. |
| Strength | Unit + `@WebMvcTest` + integration for timezone update leaving log dates | Settings timezone save behaviour (FR3.3 — no spurious `today` refetch) | High ops documentation | These are good anchors for “how we want tests to read.” |
| High-risk untested areas | Habit CRUD, track/untrack, streak/scheduler, statistics, auth beyond login; **cross-user log query** (code-quality) | Login failure UX, track HTTP errors, UserClockStore GET failure | Compose YAML/healthcheck coupling, `latest` tag rollback | Regressions in **product core** and **data scoping** would not be caught on typical `main` image path for backend. |

**Ordering (lead placeholder):** Evidence supports **implement then add tests where patterns exist**, but there is **no written merge policy** (tests required before merge vs optional). Affirm **Ordering** explicitly for `team.md` — org default is per-layer test-after once posture is affirmed.

**Walking skeleton / brownfield:** Existing login → JWT → Track/Statistics/Settings path is a **manual walking skeleton**; no automated e2e or contract suite proves it in CI. For future AI-DLC construction, clarify whether **one smoke workflow** (API + UI headless or curl through nginx) is desired without full greenfield ceremony.

### CI gates and release readiness

| Gate | What runs today | Release risk |
|------|-----------------|--------------|
| Angular `main` → Hub image | `npm ci`, **`test:ci`**, production build, Docker push | **Moderate** — tests run but many are shallow; **no coverage fail** on threshold. |
| Spring Boot `main` → Hub image | **`mvn -DskipTests package`**, Docker push | **High** — production image path **explicitly bypasses** automated tests. |
| Spring Boot `build-and-test` | Compile, test, package; JAR artifact | **Conditional** — not tied to every `main` push; branch **`feat/actions_cicd`** suggests **in-flight** CI work. |
| Compose deploy | SSH + `git pull` + `deploy-service.sh` | **Operational** — no schema/compose lint, no post-deploy HTTP check in workflow. |
| Cross-repo integration | Manual **`latest`** alignment on Hub | **No contract tests** between OpenAPI snapshot, backend, and deployed stack. |

**Quality gate recommendation for interview (not prescriptive until affirmed):** Treat **“tests green on the commit that built the image”** as a single invariant for both app repos; decide whether compose adds **non-blocking** smoke (curl `/` and `/api/health` or equivalent) after deploy.

### Coverage and static analysis

- **No blocking lint/static analysis** on springboot (Checkstyle/SpotBugs/PMD) or angular (ESLint/Prettier at root). Generated `web-api` disables lint locally — hand-written TS still unenforced.
- **Coverage is informational at best** (Angular flag only); **no published minimum**, no PR comment, no fail-under. Aligning with org **classic** default would require **tooling + threshold + CI fail** — currently **zero** infrastructure for that on backend; partial on frontend.
- **Security-relevant gaps** (quality + devsecops boundary): silent JWT parse handling, dev user seed, possible log scoping bug — **none** have regression tests yet; fixing without tests violates “every defect gets a test” principle.

### Test pyramid / types (observed vs desired)

```
Observed (rough):
  E2E:           ~0%   (no Playwright/Cypress; no compose CI smoke)
  Integration:   small (springboot timezone integration; few angular service/guard tests)
  Unit:          small backend; mixed-depth frontend

Desired for brownfield classic (discussion):
  Unit:          habit rules, mappers, services, UserClockStore, guards/interceptors
  Integration:   MockMvc for track/settings/auth; H2 for repository scoping
  Contract:      OpenAPI snapshot vs running backend (optional job)
  E2E/minimal:   optional single path through compose stack before prod dispatch
```

### Suggested `team-practices.md` additions (Testing Posture section)

- State **explicit conflict** with org default until affirmed: **classic scope expects 80% line coverage + CI before merge**; repos **do not** enforce this — team must **affirm**, **waive for brownfield**, or **adopt a phased target**.
- Document **forward CI invariant**: **`build-image` must not skip tests** on springboot (or must call reusable `build-and-test` first).
- Add **minimum test expectations for domain changes**: any change to habits, check-ins, streaks, timezone, or `/api/me` requires **backend + angular** tests mirroring Settings timezone pattern (behaviour-named specs, not “should create” only).
- Note **compose** quality: consider **actionlint/yamllint** or `docker compose config` in a lightweight check (optional, low cost).

### Suggested `discovered-rules.md` (human affirmation only)

- **Do not promote** coverage thresholds to Mandated until tooling exists — interview first.
- **Consider Mandated (inferred):** NEVER publish production Hub images from **`main`** without **the same commit** having passed **`mvn test`** / full **`build-and-test`** (springboot) and **`test:ci`** (angular). *Maps to fixing `build-image`, not new product code.*
- **Consider Forbidden (inferred):** NEVER merge habit/log behaviour changes without **at least one automated test** that would fail if **`docs/domain.md`** rules regress — *only if team accepts test-after with a hard merge bar.*

### Interview hooks (quality lens — prioritize)

1. **Affirm Methodology and Ordering** for `team.md` (test-after vs TDD/BDD; per-PR vs per-layer).
2. **Org classic 80% floor:** Adopt, phase in, or **explicitly waive** for this brownfield product?
3. **Spring Boot `build-image`:** Remove `-DskipTests` or chain **`workflow_call`** to `build-and-test` on every `main` push?
4. **`build-and-test` triggers:** Should **`main`** (and feature branches) always run tests on push?
5. **Backend test backlog:** Priority order — **user-scoped log queries**, habit track/untrack, streak scheduler, statistics, auth edge cases?
6. **Angular depth:** Minimum bar for new specs (forbid create-only for components with HTTP mutations)?
7. **Integration/contract:** Job to verify **`swagger/api-docs.json`** against running backend on PR?
8. **Compose/deploy:** Post-deploy smoke in GHA, staging environment, or stay manual production-only?
9. **E2E:** Any appetite for one containerized stack test vs reliance on unit/integration only?
10. **Domain doc ahead of code:** Are tests **specifications of domain.md** or **descriptions of current (possibly wrong) behaviour** — who wins when they differ?

## Positions

- AGREE: Lead **Testing Posture** summary (test-after inference, six backend classes, 22 frontend specs, compose untested, CI asymmetry, springboot skip-tests on `main` image) — consistent with CodeKB and evidence table.
- AGREE: Lead **interview gaps** on springboot **`build-image`** and **`build-and-test` on `main`** — these are P0 quality-gate questions.
- OBJECT: Lead draft does **not** surface **org.md classic default** (**80% line coverage + CI before merge**) against **zero backend coverage tooling** and **non-failing angular coverage** — add explicit **affirm-or-waive** language so Code Generation does not assume floors exist.
- OBJECT: **Ordering** remains placeholder-only; recommend stating org default (**implement layer, then that layer’s tests**) as **provisional** until interview, not blank unknown.
- AGREE: **discovered-rules.md** correctly avoids test mandates without human affirmation — quality agent supports keeping coverage/merge bars out of Mandated until interview.
- OBJECT: **Walking skeleton** subsection should mention **absence of automated e2e/contract proof** for the existing thin slice — brownfield skip is plausible but **quality risk** should be named alongside product agent’s ceremony question.
- AGREE: Developer-agent note on **error-path test gaps** (login, track, JWT) — quality agent treats these as **P1 test backlog**, not style-only debt.
