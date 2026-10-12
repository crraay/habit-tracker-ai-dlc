# CI/CD Pipeline — unit `habit-tracker-angular`

Planning-only intent (FR2). **As-built GitHub Actions** plus documented gaps (Q5 **A**). Production runtime is **U3 Compose pull** of C3, not in-repo deploy to droplet.

## Sources

- `.github/workflows/build-image.yml`, `build-and-test.yml`, `deploy-to-aws-s3.yml`, `deploy-to-aws-s3-with-cloudfront.yml`
- `nfr-design/performance-design.md`, `security-design.md`
- `contract-summary.md` (C3)
- U1 `cicd-pipeline.md` (contrast: U1 `main` image build skips tests)

## Pipeline overview

```text
[Developer push]
     |
     +-- branch main --> build-image.yml
     |                      npm ci --> npm run test:ci --> docker build --> push C3 :latest
     |
     +-- workflow_dispatch (legacy) --> deploy-to-aws-s3*.yml
     |                      workflow_call build-and-test.yml (Node 18.x)
     |                      --> upload dist artifact --> S3 (+ optional CloudFront invalidation)
     |
     v
U3 operator: pull C3 image + docker compose up (manual / U3 deploy workflow on droplet)
```

**Affirmed production path:** Docker Hub C3 on `main` with tests before push (NFR7.26, NFR7.27). S3 workflows are **manual dispatch only** — legacy/alternate hosting, not Compose consumer path.

## Stage → gate mapping

| Stage | Workflow | Trigger | Gate / output | Notes |
|-------|----------|---------|---------------|-------|
| Checkout | All | push / dispatch | — | `actions/checkout@v4` |
| Node setup | build-image | `main`, `workflow_dispatch` | Node 20 + npm cache | |
| Install | build-image | `main` | `npm ci` | Lockfile enforced |
| Unit test (CI) | build-image | `main` | `npm run test:ci` | **OK vs U1** — tests run before image (NFR7.26) |
| Docker login | build-image | `main` | Docker Hub secrets | |
| Docker build | build-image | `main` | Multi-stage Dockerfile (includes in-docker `ng build`) | Duplicate compile: CI tests host build, image rebuilds inside Docker |
| Registry push | build-image | `main` | `docker push` `:latest` | Concurrency `docker-hub-frontend-build` |
| Reusable build+test | build-and-test | `workflow_call` | Node **18.x** matrix; `npm run test:ci` + artifact | Used by S3 deploy jobs only |
| Legacy S3 deploy | deploy-to-aws-s3* | `workflow_dispatch` | S3 sync after reusable tests | Requires AWS secrets; not C3 path |
| Production deploy (intended) | *U3 repo* | manual | Compose recreate `frontend` | Operator pull C3 |

## Build details

- **Node:** 20 in `build-image`; 18.x in reusable `build-and-test` (matrix drift — operator should align over time).
- **Production bundle:** `ng build --configuration=production` inside Docker build stage.
- **Secrets:** `DOCKER_HUB_USERNAME`, `DOCKER_HUB_TOKEN` in GitHub Actions — not baked into static assets (Q6-A).
- **Image tag:** Floating `:latest` in workflow env; digest pinning left to operator (BL-INFRA-U2-05).

## Test automation integration

| Path | Tests before prod image? | Status |
|------|--------------------------|--------|
| `build-image.yml` on `main` | **Yes** (`npm run test:ci` before `docker build`) | Active — contrasts U1 BL-INFRA-01 |
| In-docker build stage | **No separate test step** | Build runs `ng build` only; tests already ran on runner |
| `build-and-test.yml` (S3 path) | Yes | Only on manual legacy deploy |
| Lighthouse / bundle budget | **No** | GAP — BL-INFRA-U2-04 (NFR2.1) |

## Deployment strategy

| Aspect | Choice |
|--------|--------|
| Strategy | **Recreate** — pull new C3 `:latest`, `docker compose up -d frontend` on droplet |
| Blue/green / canary | **Not used** — single frontend instance |
| Environment promotion | **None codified** — dev local vs prod droplet |
| Feature flags | Application code only; no deploy-time flag service |

## Rollback

1. Record previous C3 digest from Hub or `docker inspect` on droplet.
2. Pull specific digest/tag (if tagged) or revert U2 git and re-run `build-image` from known commit.
3. `docker compose up -d frontend` (U3).
4. Smoke: curl `/`, login via browser, verify `/api/` proxy.

Manual process; no automated rollback job in U2.

## Secrets management in CI/CD

| Secret | Where stored | Rotation |
|--------|--------------|----------|
| Docker Hub credentials | GitHub Actions secrets | Operator rotates in GitHub + Hub |
| AWS keys (legacy S3) | GitHub Actions secrets | Only if S3 workflows used |
| JWT / API secrets | U1 droplet `.env` | **Not in U2 CI** (Q6-A) |
| Runtime API URL | Relative `/api` in prod build | No per-env bake in affirmed path |

## Supply chain and legacy

| Item | Status |
|------|--------|
| `npm audit` / CVE gate in CI | **Absent** — BL-INFRA-U2-03 / NFR3.18 GAP |
| `deploy-to-aws-s3*.yml` | **Legacy** — manual only; do not extend as normative prod |
| Signed images / SBOM | Not configured |
| Node 18 vs 20 drift | Reusable workflow on 18; image build on 20 — document harmonization backlog |

## Advisory review focus

Architecture reviewer artifact: align C3 consumer expectations (U3) with **test-before-push on `main`** (strength vs U1) and call out **missing npm audit / CSP-at-edge** as highest-risk U2 infra debt.
