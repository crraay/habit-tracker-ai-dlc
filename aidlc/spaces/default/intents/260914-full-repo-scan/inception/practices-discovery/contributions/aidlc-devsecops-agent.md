**Collaborator:** aidlc-devsecops-agent

## Contribution

Independent review focused on **lint/format enforcement**, **secrets hygiene**, **dependency vulnerability scanning**, and **supply-chain / CI security** across the three app repos and compose orchestration. Sources: lead drafts (`team-practices.md`, `discovered-rules.md`, `evidence.md`), CodeKB `dependencies.md` and `code-quality-assessment.md` (springboot), and spot-check of compose `.env.example`, springboot/angular `build-image.yml`, and compose `deploy-docker-image-ssh.yml`. Shell/git re-verification was **not** run in this subagent session; CI findings align with lead `evidence.md`.

### Lint and static analysis (security-relevant gap)

| Repo | As-built | Security read |
|------|----------|-----------------|
| **habit-tracker-springboot** | No Checkstyle, SpotBugs, PMD, Sonar, or EditorConfig (CodeKB) | No automated catch for injection-prone APIs, crypto misuse, or dangerous defaults before merge |
| **habit-tracker-angular** | No project-level ESLint/Prettier config; `/* eslint-disable */` only in **generated** `src/app/web-api/**` | Hand-written feature code relies on convention; no CI lint gate |
| **habit-tracker-compose** | Bash `set -euo pipefail` in deploy script (good) | No shellcheck or YAML schema lint in CI |

**Lead draft alignment:** Endorse **Code Style** bullet that formatters/linters are absent. For practices integration, treat **“no SAST/lint in CI”** as an explicit **as-built security posture**, not neutral “style only.”

**Suggested interview topics:** Minimum bar before Construction — e.g. **SpotBugs + OWASP dependency-check** on springboot PRs, **ESLint** on angular (excluding generated client), optional **shellcheck** on compose scripts.

### Secrets management

**Documented practices (strong):**

- All three `AGENTS.md` files: **do not commit production secrets**; runtime via **`.env`** from **`.env.example`** (compose) or env vars (springboot `JWT_SECRET`, DB, CORS).
- **discovered-rules.md** `NEVER commit real production secrets` and `NEVER log JWT tokens or passwords` map to written guardrails.

**Observed risks (not yet in discovered-rules):**

| Risk | Evidence | Severity |
|------|----------|----------|
| **Example JWT in repo** | compose `.env.example` ships a concrete Base64 `JWT_SECRET` placeholder | Medium if operators copy without `openssl rand -base64 48` (doc line exists but value looks “ready”) |
| **Local DB default password** | springboot `application.properties` default datasource password (CodeKB debt #5) | Low for prod if env overrides; high if someone runs “as committed” on a network |
| **Production seed credentials** | CodeKB: `DataInitializer` creates default user/password if missing | **High** if enabled in production images without disable flag |
| **SSH deploy auth** | compose GHA uses **`secrets.SERVER_PASSWORD`** (password SSH) | Medium — prefer key-based auth + `SSH_PRIVATE_KEY`; rotate if password ever leaked in logs |
| **Legacy AWS secrets** | springboot EB workflow still references AWS secrets (forbidden for new deploys) | Low operational if unused; **medium** if secrets remain enabled in GitHub unused |
| **Client-side token storage** | angular: Elf + **localStorage** (`ht_auth`) per CodeKB dependencies | Expected for SPA JWT; XSS becomes session theft — no refresh-token rotation documented |

**GitHub Actions secrets (expected pattern):** Docker Hub login via `DOCKER_HUB_*` in app repos; compose `SERVER_*` for deploy. No evidence of secrets committed in tracked files; test fixtures use obvious fake passwords/`jwt.secret` in **test** profile only.

**Suggested additions for lead `## Deployment` / interview (affirmation gate):**

- Production must **override** all example passwords and JWT material; **never** use `.env.example` values on the droplet.
- Affirm whether **`DataInitializer`** is disabled or harmless in production backend images.
- Plan to **migrate SSH deploy to key-based** auth and document secret rotation.

### Dependency scanning (CVE gates)

| Layer | Tooling observed | CI enforcement |
|-------|------------------|----------------|
| **Maven (springboot)** | Spring Boot **3.5.5** BOM; pinned **Flyway 11.10.3**, **JJWT 0.12.6**, **springdoc 2.8.9** | **None** — no OWASP Dependency-Check, Snyk, or GitHub Dependabot config in repo |
| **npm (angular)** | `package-lock.json` present (lockfile is good for reproducibility) | **None** — no `npm audit` / `audit-ci` in `build-and-test` or `build-image` workflows |
| **Containers (compose)** | `postgres:16-alpine` pinned major; app images **`crraay/*:latest`** | **None** — no Trivy/Grype scan on pull or in app-repo `docker build` push |

**Dependency graph hotspots (from CodeKB dependencies.md):**

- **JWT stack** (jjwt + Spring Security) and **Postgres driver** — keep on BOM-managed updates with explicit CVE monitoring.
- **Third-party UI** (Bootstrap, Font Awesome, air-datepicker) — browser supply chain; npm audit would surface transitive JS CVEs.
- **Compose runtime** pulls **mutable `:latest`** Hub tags — dependency version is “whatever was last pushed,” not a digest.

**Gap vs org construction phase:** `memory/phases/construction.md` forbids hardcoded credentials; it does **not** replace **automated dependency gates**. Interview: adopt **Dependabot** (Maven + npm + GitHub Actions) at minimum, plus **fail-on-high** policy for `npm audit` / OWASP in CI.

### Supply chain and pipeline security

```
  Developer ──► GitHub Actions ──► Docker Hub (:latest) ──► Droplet compose pull ──► prod
                    │                      │
                    │                      └── no digest pin; no image scan observed
                    └── actions @v4 tags; appleboy/ssh-action@v1.2.2 (not SHA-pinned)
```

| Control | Status | Note |
|---------|--------|------|
| **Immutable release artifacts** | Weak | Hub **`latest`** only in compose; rollback manual (lead draft correct) |
| **Action pinning** | Partial | `actions/checkout@v4`, `setup-java@v4`, `setup-node@v4` — version tags, not commit SHAs |
| **Workflow permissions** | Good | App `build-image` jobs use `permissions: contents: read` |
| **Production backend test skip** | **Security-relevant** | springboot `build-image`: `mvn -DskipTests package` — vulnerable/defective code can ship (quality + security) |
| **Container base images** | Unreviewed in CI | Dockerfiles not re-read here; assume upstream base drift without scan gate |
| **Deploy path integrity** | Manual | `workflow_dispatch` + SSH `git pull --ff-only` — no signed attestations |

**Cross-user data access (application security):** CodeKB flags **`HabitTrackServiceImpl.getTrackingList`** without user filter — authorization/data-leak class bug; developer-agent noted for interview. Recommend **mandated user-scoped queries** if affirmed (security control, not lint).

**Auth architecture (brief):** Stateless JWT + SPA is appropriate; gaps include **silent JWT parse failures** (filter), **no lockout** on failed login counter, **401 → logout** without refresh (angular). Document as **known architectural debt**, not blockers for practices-discovery promotion.

### Suggested lead integrations

**`team-practices.md` — new subsection or bullets under Deployment / Code Style (draft/inferred until interview):**

- **Security tooling:** No repo-enforced SAST, secret scanning, or dependency CVE gates in CI today.
- **Release integrity:** Production compose consumes **mutable Docker Hub `latest`**; prefer **digest or version tags** for reproducible rollback.
- **Secrets on host:** `.env` on droplet; GitHub Actions holds deploy and registry credentials; SSH password auth on deploy workflow.

**`discovered-rules.md` — defer hard NEVER/ALWAYS unless human affirms:**

- Do **not** promote “run npm audit / OWASP on every PR” until team chooses tooling and failure thresholds.
- **Consider Mandated (interview):** NEVER ship backend production images from **`build-image`** without **`mvn test`** (aligns security + quality).
- **Consider Mandated (interview):** NEVER use **`.env.example` JWT/DB values** on production hosts.
- **Consider Forbidden (interview):** NEVER enable **default seed users** in production backend configuration.

### Interview topics (DevSecOps-specific)

1. **Dependency scanning** — Dependabot only vs OWASP + npm audit with **fail on critical/high**?
2. **Container security** — Trivy/Grype on push; pin images by **digest** in compose?
3. **Secrets** — SSH keys vs password; rotation cadence for `JWT_SECRET` and DB password?
4. **Production seed** — Is `DataInitializer` disabled in prod builds?
5. **SAST minimum** — SpotBugs/Checkstyle (Java) and ESLint (angular hand-written paths) before merge?
6. **GitHub Actions supply chain** — Pin third-party actions to full SHAs?
7. **Authorization** — Mandate user-scoped habit/log queries at repository layer?
8. **Staging** — Any pre-prod environment for security verification before manual prod deploy?

## Positions

- AGREE: Lead **Code Style** claim of **no root ESLint/Prettier (angular)** and **no Checkstyle/SpotBugs (springboot)** — matches CodeKB; security implication is **un gated static analysis**.
- AGREE: **discovered-rules** secrets and logging prohibitions — accurately reflect `AGENTS.md`; appropriate for promotion pending human gate.
- AGREE: **Deployment** narrative on **`.env` on host**, **JWT/CORS/DB via env**, and **Hub `latest` coupling** — aligns with CodeKB dependencies and evidence table.
- AGREE: **CI asymmetry** (angular tests on `main` image build; springboot skips tests on `main` image) — is a **supply-chain quality/security gate gap**; same fix as quality-agent (run tests in `build-image`).
- OBJECT: Lead draft does **not** state **absence of dependency/CVE scanning** (Maven, npm, containers) — practices should record **as-built “no automated dependency gates”** explicitly.
- OBJECT: **Compose deploy SSH password** and **`.env.example` literal JWT placeholder** are operational security findings missing from **Deployment / Secrets** — add for interview, not silent assumption of safe defaults.
- OBJECT: **Supply-chain reproducibility** (`:latest`, no image scan, unpinned action SHAs) under-documented relative to **rollback** bullet — tie rollback gap to **digest/tag policy**.
- AGREE: Do **not** overload `discovered-rules.md` with unaffirmed CI tool mandates — interview first, then promote NEVER/ALWAYS for tests-on-image and prod secrets.
