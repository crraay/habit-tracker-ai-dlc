# Practices Discovery — Interview

Brownfield intent `260914-full-repo-scan`. Lead draft and blind reviews are under this folder. Answer each question below; options are suggestions from repo evidence and org defaults — pick the closest fit or use **Other**.

---

## Interaction mode

How would you like to answer these practice questions?

A. Guide me — one question at a time in chat  
B. I'll edit the file — fill `[Answer]:` tags here yourself  
C. Chat — free-form discussion; I'll capture answers into this file  

[Answer]: Guide me — one question at a time in chat

---

## Q1 — Day-to-day branching

We inferred trunk-style work on **`main`** in three separate app repos, with production images built on push to **`main`**. Does that match how you actually work?

A. Yes — short branches, merge to `main`, images from `main`  
B. Mostly, but we use long-lived branches or a different default branch  
C. We use release branches or tags for production  
D. Other workflow (describe in chat)  
X. Other (please specify)

[Answer]: Yes — short branches, merge to main, images from main

---

## Q2 — Build a thin end-to-end slice first?

A **walking skeleton** is a minimal version that runs all the way through (browser → API → database), built first to prove the pieces connect before bigger features. This product already has a full stack. For upcoming work on this codebase, should we treat that as “skeleton already exists” and skip a dedicated skeleton step?

A. Yes — extend the existing stack; no separate skeleton step  
B. No — for new AI-DLC construction we still want one thin end-to-end slice approved first  
C. Only when the scope explicitly asks for it  
X. Other (please specify)

[Answer]: Yes — extend the existing stack; no separate skeleton step

---

## Q3 — Testing style (methodology)

How do you prefer to write automated tests for new behaviour?

A. **Test-after** — implement the feature, then add tests  
B. **TDD** — write failing tests first, then implement  
C. **BDD** — scenarios/specs drive implementation  
D. **Mixed / custom** — describe the mix in chat  
X. Other (please specify)

[Answer]: Test-after — implement the feature, then add tests

---

## Q4 — When tests must exist

In one sentence: when are automated tests required relative to merging and shipping?

A. Tests must pass on every push to `main` before merge (or before image build)  
B. Tests are required before merge on PRs, but production image build may skip them today (status quo on Spring Boot)  
C. Tests are encouraged but not blocking; we rely on manual checks  
D. Match org **classic** default: tests in CI before merge **and** work toward **80% line coverage**  
X. Other (please specify)

[Answer]: Tests must pass on every push to main before merge (or before image build)

---

## Q5 — Fix Spring Boot CI on `main`

Today, **`build-image`** on Spring Boot **`main`** runs **`mvn package -DskipTests`**, while Angular runs **`test:ci`** on image build. What should we affirm as the target?

A. Require **`mvn test`** (or full **`build-and-test`**) before pushing the production image on `main`  
B. Keep skip-tests on image build; run tests only on a separate workflow/branch  
C. In progress — follow whatever lands on `feat/actions_cicd`  
X. Other (please specify)

[Answer]: Require mvn test (or full build-and-test) before pushing the production image on main

---

## Q6 — Environments

What environments do you maintain for this product?

A. Production only (Compose on the droplet)  
B. Production plus a separate staging stack  
C. Local/docker only besides production  
X. Other (please specify)

[Answer]: Production only (Compose on the droplet)

---

## Q7 — Production deploy and image tags

Production deploy is manual (**workflow_dispatch** on compose) and images use Docker Hub **`:latest`**. What should we record as team practice?

A. Keep manual prod deploy and **`latest`** tags  
B. Manual prod deploy but pin images by digest or version tag  
C. Move toward deploy-on-merge to staging; manual approval for prod (org-style)  
X. Other (please specify)

[Answer]: Keep manual prod deploy and latest tags

---

## Q8 — Code conventions to mandate

Beyond **`docs/domain.md`** and “don’t edit generated **`web-api`**”, which hard rules should agents follow?

A. Affirm only what’s already in **AGENTS.md** / discovered-rules (domain law, no secrets in git, compose owns deploy)  
B. Also mandate consistent API error handling (Spring **`GlobalExceptionHandler`**; Angular HTTP errors like Settings)  
C. Also mandate user-scoped data access in repositories/services (no cross-user log reads)  
D. B and C  
X. Other (please specify)

[Answer]: B and C — both consistent API error handling and user-scoped data access

---

## Consolidated Summary Confirmation

Your affirmed team practices (to be written into `team-practices.md` and promoted on approval):

| Area | Your choice |
|------|-------------|
| **Way of working** | Trunk on **`main`** in three app repos; short branches; production images built from **`main`**. |
| **Walking skeleton** | Brownfield — extend the existing full stack; **no** separate skeleton ceremony. |
| **Testing — methodology** | **Test-after** (implement, then add tests). |
| **Testing — ordering / gates** | **Tests must pass** on every push to **`main`** before merge or image build. Spring Boot **`build-image`** should run **`mvn test`** / full **`build-and-test`**, not **`-DskipTests`**. |
| **Deployment** | **Production only** (Compose on droplet). **Manual** prod deploy via compose **`workflow_dispatch`**. Docker Hub **`:latest`** tags kept. |
| **Code style / mandates** | Keep **AGENTS.md** / domain law / generated **`web-api`** rules; **add** mandated consistent API error handling (Spring **`GlobalExceptionHandler`**, Angular like Settings) and **user-scoped** data access in repositories/services. |

Hard constraints for **`discovered-rules.md`** will reflect the above plus existing repo rules (no secrets in git, compose owns deploy, etc.).

[Answer]: Looks correct
