# Evidence — practices-discovery (integrated)

## State and intent

| Source | Finding |
|--------|---------|
| `aidlc/spaces/default/intents/260914-full-repo-scan/aidlc-state.md` | Project type **Brownfield**; scope **classic**; stage **practices-discovery** |
| `aidlc/spaces/default/memory/team.md` | Five practice sections empty until affirmation gate promotes integrated drafts |
| `aidlc/spaces/default/memory/org.md` | Org defaults: trunk-based, classic test-after + **80% line coverage** aspiration, deploy-on-merge to staging + manual prod — **partially overridden** by interview (production-only, manual prod, no 80% floor affirmed) |

## Interview decisions (authoritative)

Source: `practices-discovery-questions.md` (guided chat; consolidated summary confirmed **Looks correct**).

| Topic | Affirmed choice |
|-------|-----------------|
| Branching | Trunk on **`main`** in three app repos; short branches; production images from **`main`** |
| Walking skeleton | Brownfield — extend existing stack; **no** separate skeleton ceremony |
| Testing methodology | **Test-after** |
| Testing gates / ordering | Tests **must pass** on every push to **`main`** before merge or image build; Spring Boot **`build-image`** must run **`mvn test`** / **`build-and-test`**, not **`-DskipTests`** |
| Environments | **Production only** (Compose on droplet) |
| Deploy / tags | **Manual** prod via compose **`workflow_dispatch`**; keep Docker Hub **`:latest`** |
| Code mandates (Q8) | Keep existing **AGENTS.md** / domain / generated **`web-api`** rules; **add** consistent API error handling (Spring **`GlobalExceptionHandler`**, Angular like Settings) and **user-scoped** data access in repositories/services |

## CodeKB reverse-engineering (intent 260914-full-repo-scan)

| Repo | Commits (scan) | Artifacts used |
|------|----------------|----------------|
| habit-tracker-springboot | `0785ab0b3b7fb5c408f387b62239d22c7b68729a` | code-structure, technology-stack, dependencies, code-quality-assessment, architecture, business-overview |
| habit-tracker-angular | `e4cfc226d27c7f17d5c87908deb919a0385581e2` | same set |
| habit-tracker-compose | `697b2d8a9d531a8aab52f6edada7a88814e3bdf7` | same set |

Cross-repo themes: three-repo split; Hub **`latest`** coupling; single-host production; domain doc ahead of code in places; angular **`test:ci`** on **`main`** image build; springboot **skip-tests** on **`main`** image build (gap closed in **affirmed target**, CI YAML may still need change); compose deploy-only CI.

## CI / deployment files inspected (lead Step 2 + contributions)

| Path | Key finding |
|------|-------------|
| `habit-tracker-springboot/.github/workflows/build-and-test.yml` | Maven compile, test, package; push trigger **`feat/actions_cicd`** + **`workflow_call`** |
| `habit-tracker-springboot/.github/workflows/build-image.yml` | On **`main`**: **`mvn -DskipTests package`** today — **conflicts with affirmed practice** until workflow updated |
| `habit-tracker-angular/.github/workflows/build-and-test.yml` | Reusable: npm install, build, **`test:ci`**, dist artifact |
| `habit-tracker-angular/.github/workflows/build-image.yml` | On **`main`**: **`npm ci`**, **`test:ci`**, Docker push |
| `habit-tracker-compose/.github/workflows/deploy-docker-image-ssh.yml` | **`workflow_dispatch`** only; SSH deploy; **`git pull --ff-only`**; **`deploy-service.sh`** |
| `habit-tracker-springboot/AGENTS.md`, angular/compose `AGENTS.md`, `habit-domain.mdc` | Domain law, deploy path, secrets, generated client rules |

## Specialist contributions integrated

| Agent | Inspected / inferred | Integrated into artifacts |
|-------|----------------------|---------------------------|
| **aidlc-quality-agent** | CI asymmetry, six backend / 22 frontend tests, no coverage floors, org 80% vs as-built, test backlog, no compose CI tests | Testing Posture bullets, org classic waiver, backlog note; gates aligned with interview |
| **aidlc-developer-agent** | Layer boundaries, **`GlobalExceptionHandler`** / **`ErrorResponse`**, Angular error inconsistency, user-scoped query gap, constructor injection preference | Code Style error-handling and data-access bullets; Q8 mandates in **discovered-rules** |
| **aidlc-devsecops-agent** | No SAST/CVE gates, `:latest` supply chain, SSH password deploy, `.env.example` placeholder JWT, DataInitializer prod risk | Deployment security-as-built bullets; **not** promoted to Mandated/Forbidden unless interview affirmed |

## Git / workspace

| Scope | Finding |
|-------|---------|
| Workspace root `habit-tracker-ai-dlc` | Integration commit **`541a47d8235239a2244bed9ffaaccfc9dc783ae1`** on **`main`** (`git rev-parse HEAD` at integration) |
| App repos | Scan commit hashes from CodeKB timestamps; not re-verified with `git` during Step 5 |

## Unresolved uncertainty (post-interview)

- **CI implementation gap:** Affirmed policy requires tests on **`main`** image build for springboot; **`build-image.yml`** may still use **`-DskipTests`** until a construction change lands (in-flight **`feat/actions_cicd`** branch noted in evidence).
- **80% line coverage:** Not adopted; team affirmed **passing tests on `main`**, not coverage thresholds or JaCoCo/npm fail-under.
- **Dependency scanning:** No Dependabot, OWASP, or **`npm audit`** gates — devsecops flagged; **not** mandated at interview.
- **Staging / e2e:** No staging stack; no automated e2e or post-deploy smoke in compose workflow — production-only manual deploy remains affirmed.
- **Operational security:** SSH password vs keys, production **`DataInitializer`** / seed users, digest-pinned images, action SHA pinning — documented as risks in contributions, **not** hard rules unless added later.
- **Angular error UX standard:** Mandated explicit error handling on mutations; **no** team-wide toast/snackbar standard affirmed.
- **PR merge strategy on GitHub** (squash vs merge commit) not interviewed.
