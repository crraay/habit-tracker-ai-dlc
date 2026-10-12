# Requirements Analysis Questions

**Sources:** Initial description: `make full scan of habit-tracker-springboot and habit-tracker-angular repos` [desc]. Reverse-engineering and practices-discovery are complete; compose was scanned as deployment closure [scope]. Known brownfield gap: `docs/domain.md` describes habit lifecycle, user-relative check-in windows, and streak semantics that the API/UI only partially implement [assumption].

These questions lock what this classic workflow should optimize for after the scan — so downstream user stories, domain design, and construction have testable targets.

## Q1. What is the primary outcome you want from the rest of this workflow (after the repo scan)?

The scan produced CodeKB and team practices. Construction stages still run unless we narrow scope in requirements.

A. **Baseline only:** Treat the scan as the deliverable; later stages should produce minimal planning artifacts and avoid shipping product code changes unless you add a follow-up intent
B. **Close domain gaps:** Align backend (and UI where needed) with `habit-tracker-springboot/docs/domain.md` — lifecycle, check-in windows, streaks, statistics semantics — as the main build goal
C. **Quality and reliability:** Prioritize automated tests, error handling, and CI hardening across springboot and angular over new domain features
D. **Balanced roadmap:** One coherent package mixing the highest-impact domain fixes, test coverage for core paths, and small UX fixes (e.g. track/login errors) without a full domain rewrite in one pass
E. **Not decided yet** — use requirements to propose a recommended package for your approval
X. Other (please specify)

[Answer]: A. **Baseline only:** Treat the scan as the deliverable; later stages should produce minimal planning artifacts and avoid shipping product code changes unless you add a follow-up intent

## Q2. How should we treat `docs/domain.md` when code and the doc disagree?

CodeKB notes missing habit `state` / `startDate`, user-relative check-in windows, and streak scheduling vs what the domain doc describes.

A. **Doc is law:** Requirements assume implementation changes until behavior matches the doc; update code, not the doc, unless you explicitly approve a doc change
B. **Doc is aspirational:** Requirements record gaps as backlog; only implement doc rules you select in later questions
C. **Reconcile explicitly:** Requirements must list each conflict and require a recorded decision (change code, change doc, or defer) before construction
D. **Code is law for now:** Requirements describe as-built behavior; domain doc updates are out of scope for this intent
E. **Not applicable** — domain alignment is not in scope for this workflow
X. Other (please specify)

[Answer]: E. **Not applicable** — domain alignment is not in scope for this workflow

## Q3. Which repositories may this intent change during Construction? (select all that apply)

A. `habit-tracker-springboot` only
B. `habit-tracker-angular` only
C. Both springboot and angular (typical for API + UI features)
D. `habit-tracker-compose` (deploy scripts, workflows, ops docs — no application code)
E. AI-DLC workspace / CodeKB only — no application repo commits
X. Other (please specify)

[Answer]: C. Both springboot and angular (typical for API + UI features)

## Q4. What is the highest-priority quality bar for new or touched code in this intent?

Team practice: tests green on `main`; no enforced coverage floor today. CodeKB lists under-tested track/streak/auth paths and sparse Angular error handling on login/track.

A. **Regression safety:** Every construction bolt must add or extend tests for behavior it changes; no new JaCoCo/coverage gates
B. **Critical-path coverage:** Focus tests on auth, user-scoped data access, track/untrack, timezone/`/api/me`, and statistics — accept leaving peripheral areas thin
C. **UX consistency:** Match Settings-style API error handling on login, track, and habit mutations even if test additions are minimal
D. **CI/security uplift:** Include dependency scanning, lint gates, or deploy hardening (e.g. SSH keys) if they fit selected scope
E. **As-is gates:** Only existing CI (mvn test / npm run test:ci on `main`) — no extra quality requirements beyond team mandates
X. Other (please specify)

[Answer]: A. **Regression safety:** Every construction bolt must add or extend tests for behavior it changes; no new JaCoCo/coverage gates

## Q5. Is production deploy / compose operations in scope for implementation work?

Compose scan documented manual Hub `:latest` deploy, single production host, no staging.

A. **Out of scope:** Requirements cover application behavior only; compose changes are documentation or a separate intent
B. **In scope only for app-driven deploy needs:** e.g. new env vars or health checks required by backend/UI changes — minimal compose edits
C. **In scope for ops improvements:** Willing to change compose workflows/scripts (still no habit/domain code in compose repo)
D. **Full stack including release process:** Requirements may include cross-repo release coordination, tagging, or rollback practices
E. **Not decided** — defer to delivery planning
X. Other (please specify)

[Answer]: A. **Out of scope:** Requirements cover application behavior only; compose changes are documentation or a separate intent

## Q6. How will you judge this intent successful when Construction finishes?

A. **Documented plan:** Approved requirements, stories, units, and delivery plan — no requirement that production behavior change
B. **Shipped increments:** At least one merged change on `main` per agreed repo with green CI and manual smoke on Track/Settings
C. **Domain compliance:** Measurable checklist against `docs/domain.md` sections you prioritize (defined in requirements)
D. **Test milestone:** Named suites or scenarios (listed in requirements) run green in CI and cover previously identified gaps
E. **You will define success criteria during this stage** after seeing a draft requirements package
X. Other (please specify)

[Answer]: E. **You will define success criteria during this stage** after seeing a draft requirements package

## Q7. Are there explicit features or fixes you already know must appear in requirements (beyond what the scan found)?

Examples: registration API, pause/archive habits, refresh tokens, datepicker min date, e2e tests, migration off `:latest` tags.

A. **None** — rely on scan gaps and answers above
B. **Yes — I'll list them** in chat or in option X below
C. **Exclude all new features** — only fixes for bugs you will name separately
D. **Exclude habit/domain feature work** — focus on engineering hygiene only
E. **Not applicable**
X. Other (please specify)

[Answer]: A. **None** — rely on scan gaps and answers above

## Q8. (Follow-up) Q1 said avoid shipping product code; Q3 named both app repos — how should requirements treat Construction for this intent?

A. **Planning-only:** Document springboot and angular as the product surface for *future* work, but require Construction to produce no application-repo merges (inception artifacts only; code generation skipped or no-op by plan)
B. **Repos in scope if you later approve:** Requirements default to no code changes, but allow delivery planning to propose optional bolts you must explicitly approve before any merge
C. **Q3 was wrong — correct to CodeKB / AI-DLC workspace only** (no springboot or angular commits for this intent)
D. **Q1 was wrong — you do want shippable code** in both repos under the regression-safety bar (revisit primary outcome)
E. **Not decided** — leave ambiguous in requirements and decide at delivery planning
X. Other (please specify)

[Answer]: A. **Planning-only:** Document springboot and angular as the product surface for *future* work, but require Construction to produce no application-repo merges (inception artifacts only; code generation skipped or no-op by plan)

## Consolidated Summary Confirmation

- **Primary outcome:** The repo scan is the main deliverable; later stages produce minimal planning artifacts and avoid shipping product code unless you start a follow-up intent
- **Domain alignment:** Not in scope for this workflow (no requirement to close `docs/domain.md` vs code gaps here)
- **Repos:** Springboot and angular are the documented product surface for future work; compose deploy/ops changes are out of scope
- **Construction stance (Q8):** Planning-only — no application-repo merges from this intent; Construction should be skipped or no-op for code unless you open a follow-up intent
- **Quality bar (if code were touched later):** Regression safety — tests for changed behavior; no new coverage gates
- **Must-haves:** None beyond scan findings and these answers
- **Success criteria:** You will define them after reviewing the draft requirements package in this stage

Does this all look correct before I generate the requirements artifact?

- Looks correct
- Request changes

[Answer]: Looks correct
