# CI configuration — full-repo-scan (as-built)

Intent `260914-full-repo-scan` · **FR2:** record-only consolidation. **No workflow files were modified** in sibling repos during this intent.

## Multi-repo topology

| Repo | Role | CI platform | Primary workflows |
|------|------|-------------|-------------------|
| `habit-tracker-springboot` (U1) | API image C2 | GitHub Actions | `build-and-test.yml`, `build-image.yml`, `deploy-to-elastic-beanstalk.yml` (legacy) |
| `habit-tracker-angular` (U2) | SPA image C3 | GitHub Actions | `build-image.yml`, `build-and-test.yml`, `deploy-to-aws-s3*.yml` (legacy) |
| `habit-tracker-compose` (U3) | Production orchestration | GitHub Actions | `deploy-docker-image-ssh.yml` |

Production path: **U1/U2 push `main` → Docker Hub `:latest` → operator U3 `workflow_dispatch` → SSH pull + compose recreate**.

## habit-tracker-springboot

**Triggers**

- `build-and-test.yml`: branch `feat/actions_cicd` (feature pipeline; compile + `mvn test` + package artifact).
- `build-image.yml`: `main`, `workflow_dispatch` → Docker Hub `crraay/habit-tracker-springboot:latest`.
- `deploy-to-elastic-beanstalk.yml`: `main` (legacy; calls reusable tests for EB JAR only).

**Build/test commands (as-built)**

```yaml
# build-image.yml (main) — GAP: skips tests
- run: mvn -B -DskipTests package
- run: docker build ... && docker push
```

**Normative (team/project)** — not yet fully reflected on C2 path:

```text
mvn -B test   # before production image push
```

Detail: see U1 `infrastructure-design/cicd-pipeline.md`.

## habit-tracker-angular

**Triggers**

- `build-image.yml`: `main`, `workflow_dispatch`.
- Reusable `build-and-test.yml`: `workflow_call` (Node 18.x matrix; used by legacy S3 deploy).

**Build/test commands (as-built on `main`)**

```yaml
- run: npm ci
- run: npm run test:ci
- run: docker build ... && docker push   # C3 :latest
```

Aligns with Build and Test local run (`test-results.md`: 29 SUCCESS).

## habit-tracker-compose

**Triggers**

- `deploy-docker-image-ssh.yml`: **`workflow_dispatch` only** (inputs: `all` | `backend` | `frontend`).

**Remote steps (summary)**

```bash
cd "$DEPLOY_COMPOSE_DIR"
git pull --ff-only
./scripts/deploy-service.sh <service>
# docker compose pull + recreate; postgres volume preserved
```

No compile/test jobs in U3; quality gates depend on upstream C2/C3 builds.

## Artifact registries

| Artifact | Registry | Tag policy |
|----------|----------|------------|
| Backend image C2 | Docker Hub `docker.io/crraay/habit-tracker-springboot` | `:latest` (floating) |
| Frontend image C3 | Docker Hub `docker.io/crraay/habit-tracker-angular` | `:latest` (floating) |
| EB JAR (legacy) | AWS Elastic Beanstalk | From `build-and-test` artifact |
| Static S3 (legacy) | AWS S3 (+ optional CloudFront) | From reusable `build-and-test` |

Secrets: `DOCKER_HUB_*` in U1/U2 Actions; AWS and SSH secrets for legacy/U3 paths — never committed.

## Cross-repo sequencing (operator)

1. Merge U1 and/or U2 to `main` and wait for `build-image` success (Hub tags move).
2. Run U3 deploy workflow for `backend` / `frontend` / `all`.
3. Smoke: login, `/api/me`, track habit (manual — no automated E2E in CI).

## Follow-up (non-binding, Bolts F1–F3)

- U1: require `mvn test` (or `workflow_call` to test job) before Docker push on `main`.
- Align Node 18 vs 20 between angular reusable and `build-image`.
- U3: SSH key-based auth, optional post-deploy health check step.
