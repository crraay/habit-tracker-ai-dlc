# Quality gates — full-repo-scan

Intent `260914-full-repo-scan` · Gates below map **Build and Test** commands to **CI enforcement**. FR2 does not change enforcement this intent—this file is the Construction closure reference.

## Normative gates (team / project mandates)

| Gate ID | Requirement | Command / check | Enforced in CI today |
|---------|-------------|-----------------|----------------------|
| G-TEST-U1 | Tests green before production backend image | `mvn -B test` | **Partial** — only on `feat/actions_cicd` / EB path; **`build-image` on `main` skips** (BL-INFRA-01) |
| G-TEST-U2 | Tests green before production frontend image | `npm run test:ci` | **Yes** on `build-image` `main` |
| G-NO-SKIP-IMG | No `-DskipTests` on commit that pushes prod image | Maven/npm as above | **U1 fail** / **U2 pass** |
| G-NO-SECRETS | No secrets in repo or image layers | Review + `.env.example` | Manual / code review |
| G-COMPOSE-PATH | New deploy work via U3 compose | Process | Manual (no CI on compose `main`) |
| G-LEGACY-NO | No new EB/S3 deploy paths | Policy | Manual (workflows still present) |

## As-built gates by event

| Event | Repo | Blocking steps | Non-blocking / parallel |
|-------|------|----------------|-------------------------|
| Push `main` | U1 | Docker build + push (no test) | EB deploy may run tests for JAR only |
| Push `main` | U2 | `npm ci`, `test:ci`, docker push | — |
| `workflow_dispatch` | U3 | SSH + git pull + deploy script | No automated test |

## Merge / PR discipline (process)

- **Branch model:** short-lived branches → squash merge to `main` (org/team).
- **PR checks:** not uniformly configured in scanned repos; local/branch workflows vary.
- **Coverage floor:** org classic 80% **not** enforced; team gate = suites green.

## Alignment with Build and Test (2026-10-08)

| Build and Test evidence | CI gate implication |
|-------------------------|---------------------|
| U1: 11 tests green locally | Proves suite health; **does not** prove `build-image` runs them |
| U2: 29 tests green locally | Matches `build-image` gate on `main` |
| U3: no tests | Operator smoke after deploy |

## Recommended follow-up gate changes (F1 / F2)

1. **U1 `build-image.yml`:** add job step `mvn -B test` before `docker build`, or `needs:` reusable test workflow.
2. **U1 Dockerfile:** avoid redundant `-DskipTests` build if host already tested artifact.
3. **Optional:** GitHub branch protection requiring green check on PR before merge to `main`.

## Out of scope this intent

- Adding JaCoCo/coverage thresholds.
- Dependency/CVE scanning gates.
- Automated Compose E2E in GitHub Actions.
