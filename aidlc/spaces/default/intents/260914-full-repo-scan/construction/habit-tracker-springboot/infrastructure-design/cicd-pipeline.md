# CI/CD Pipeline — unit `habit-tracker-springboot`

Planning-only intent (FR2). **As-built GitHub Actions** plus documented gaps (Q5 **A**). Production runtime is **U3 Compose pull**, not pipeline deploy from this repo.

## Sources

- `.github/workflows/build-and-test.yml`, `build-image.yml`, `deploy-to-elastic-beanstalk.yml` (legacy)
- `nfr-design/reliability-design.md`, `security-design.md`
- `nfr-requirements/tech-stack-decisions.md` (NFR7.18–NFR7.27)
- `contract-summary.md` (C2)

## Pipeline overview

```text
[Developer push]
     |
     +-- branch feat/actions_cicd --> build-and-test.yml (compile + test + package artifact)
     |
     +-- branch main ----------------+--> build-image.yml (mvn package -DskipTests --> docker push :latest)
     |                              |         |
     |                              |         v
     |                              |    docker.io/crraay/habit-tracker-springboot:latest (C2)
     |                              |
     |                              +--> deploy-to-elastic-beanstalk.yml (legacy)
     |                                    workflow_call build-and-test (tests) --> EB JAR deploy
     |
     v
U3 operator: pull C2 image + compose up (manual / U3 deploy workflow on droplet)
```

**Dual pipelines on `main`:** Hub publish and Elastic Beanstalk deploy both trigger on the same push. Compose is the **intended** production path (NFR7.27); EB remains in-repo and can still run if AWS secrets are configured — treat as legacy automation debt, not the C2 consumer path.

## Stage → gate mapping

| Stage | Workflow | Trigger | Gate / output | Notes |
|-------|----------|---------|---------------|-------|
| Checkout | Both | push | — | `actions/checkout@v4` |
| Compile | build-and-test | `feat/actions_cicd` | `mvn clean compile` | JDK 17 Corretto |
| Unit/integration test | build-and-test | `feat/actions_cicd` | `mvn test` | H2 test profile |
| Package JAR | build-and-test | `feat/actions_cicd` | `mvn package -DskipTests` + artifact upload | 1-day retention |
| Package JAR (image job) | build-image | `main`, `workflow_dispatch` | `mvn -B -DskipTests package` | **GAP:** tests not run (NFR5.17, NFR7.26) |
| Docker build | build-image | `main` | `docker build` (Dockerfile also `-DskipTests` in build stage) | Multi-stage image |
| Registry push | build-image | `main` | `docker push` `:latest` | Concurrency group `docker-hub-backend-build` |
| Production deploy (intended) | *U3 repo* | manual | Compose recreate | e.g. U3 `deploy-image-digital-ocean` / operator pull |
| Legacy EB deploy | deploy-to-elastic-beanstalk | `main` | JAR to AWS EB after reusable tests | Parallel to C2; not Compose |

## Build details

- **JDK:** 17 (Temurin in `build-image`, Corretto in `build-and-test`).
- **Cache:** Maven cache via `setup-java`.
- **Secrets:** `DOCKER_HUB_USERNAME`, `DOCKER_HUB_TOKEN` in GitHub Actions secrets — not in image layers.
- **Image tag:** Floating `:latest` only in workflow env; digest pinning left to operator (NFR5.10).

## Test automation integration

| Path | Tests before prod image? | Status |
|------|--------------------------|--------|
| `build-and-test.yml` on feature branch | Yes (`mvn test`) | Active on `feat/actions_cicd` only |
| `build-image.yml` on `main` | **No** (`-DskipTests`) | **Documented GAP** — BL-INFRA-01 (C2 path) |
| `deploy-to-elastic-beanstalk.yml` on `main` | **Yes** (via `workflow_call` to `build-and-test`) | Tests gate **EB JAR only**, not Docker Hub push |
| Dockerfile build stage | **No** (`-DskipTests`) | `build-image` also runs Maven inside `docker build` — double compile, both skip tests |

**Design direction (follow-up intent, non-binding):** require green `mvn test` (or `workflow_call` to reusable test job) before push to Docker Hub on `main`.

## Deployment strategy

| Aspect | Choice |
|--------|--------|
| Strategy | **Recreate** — pull new `:latest`, `docker compose up -d` on droplet |
| Blue/green / canary | **Not used** — single instance |
| Environment promotion | **None codified** — dev local vs prod droplet |
| Feature flags | Application properties only (e.g. scheduler enable); no deploy-time flag service |

## Rollback

1. Record previous image digest from `docker inspect` or Hub history if available.
2. On droplet: `docker pull` specific digest/tag (if tagged) or revert git on U1 and re-run `build-image` from known commit.
3. `docker compose up -d backend` (U3).
4. Verify `/actuator/health` and smoke login.

Manual process (NFR5.10); no automated rollback job in U1.

## Secrets management in CI/CD

| Secret | Where stored | Rotation |
|--------|--------------|----------|
| Docker Hub credentials | GitHub Actions secrets | Operator rotates in GitHub + Hub |
| `JWT_SECRET`, DB passwords | Droplet `.env` (runtime) | Not in CI; ops backlog NFR3.19 |
| Maven settings | Default Central | No private repo |

No Vault/AWS SM in as-built design.

## Supply chain and legacy

| Item | Status |
|------|--------|
| Dependency/CVE scan in CI | **Absent** — BL-SEC-04 / NFR3.18 GAP |
| `deploy-to-elastic-beanstalk.yml` | **Legacy** — do not extend (NFR7.27) |
| Signed images / SBOM | Not configured |

## Advisory review focus

Architecture reviewer artifact: align this pipeline with C2 consumer expectations (U3) and call out **test gate gap** on `main` as highest-risk infra debt for U1.
