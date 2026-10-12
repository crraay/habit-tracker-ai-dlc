# CI/CD Pipeline — unit `habit-tracker-compose`

Planning-only intent (FR2). **As-built deploy automation** plus documented gaps (Q5 **A**). U3 does **not** build application images; it pulls C2/C3 after U1/U2 publish to Docker Hub.

## Sources

- `.github/workflows/deploy-docker-image-ssh.yml`
- `scripts/deploy-service.sh`, `DOCKER.md`
- `nfr-design/security-design.md`
- U1/U2 `cicd-pipeline.md` (upstream image quality contrast)
- Workflow file: `.github/workflows/deploy-docker-image-ssh.yml` (not legacy `deploy-image-digital-ocean` naming)

## Pipeline overview

```text
[U1/U2 push main]
     |
     v
docker.io/crraay/habit-tracker-{springboot,angular}:latest  (C2 / C3)
     |
     v
[Operator: workflow_dispatch deploy-docker-image-ssh.yml]
     |
     v
SSH --> cd DEPLOY_COMPOSE_DIR --> git pull --ff-only --> deploy-service.sh (all|backend|frontend)
     |
     v
docker compose pull + recreate selected service(s)  (Postgres untouched)
```

**Cadence:** Manual production rollout only (NFR3.8). No automatic deploy on compose `main` push.

## Stage → gate mapping

| Stage | Workflow / script | Trigger | Gate / output | Notes |
|-------|-------------------|---------|---------------|-------|
| Operator intent | `deploy-docker-image-ssh.yml` | `workflow_dispatch` | Input: `all` \| `backend` \| `frontend` | Concurrency group `deploy-docker-image-ssh` |
| SSH connect | `appleboy/ssh-action@v1.2.2` | job start | Host/user/password secrets | **GAP:** password auth possible (BL-OPS-01) |
| Sync compose repo | Remote script | SSH session | `git pull --ff-only` in `DEPLOY_COMPOSE_DIR` | NFR3.10 |
| Deploy | `scripts/deploy-service.sh` | SSH session | `docker compose pull` + recreate | Postgres not redeployed |
| Verify | Operator | post-deploy | `docker compose ps`, smoke test | Not automated in workflow |

**No workflows in U3** build, test, or push application images — gates live in U1/U2 repos.

## Build details (upstream dependency)

| Unit | `main` image job | Tests before Hub push? |
|------|------------------|------------------------|
| U1 springboot | `build-image.yml` | **No** (`-DskipTests`) — BL-INFRA-01 |
| U2 angular | `build-image.yml` | **Yes** (`npm run test:ci`) |

U3 deploy assumes images already exist on Hub; operator should only roll out after successful upstream builds (NFR2.2).

## Test automation integration

| Path | Automated test in U3? | Status |
|------|----------------------|--------|
| Compose repo CI | **None** | No `build-and-test` equivalent (team.md) |
| Pre-deploy validation | **None** | Operator manual smoke after `deploy-service.sh` |
| Post-deploy health | **Implicit** | Compose healthchecks + depends_on chain |

Quality gates for application code remain in U1/U2 pipelines, not U3.

## Deployment strategy

| Aspect | Choice |
|--------|--------|
| Strategy | **Recreate** — pull `:latest`, stop/rm/up selected service |
| Scope | `backend`, `frontend`, or `all` (sequential backend then frontend for `all`) |
| Blue/green / canary | **Not used** — single instance per service |
| Environment promotion | **None** — production droplet only |
| Postgres | **Never** recreated by deploy script — data volume preserved |

## Rollback

1. Identify prior image digest or tag from Hub history / `docker inspect` if recorded.
2. Optionally temporarily edit compose image reference on droplet (follow-up hardening: pin digest in git).
3. Run `deploy-service.sh` for affected service(s) after `docker pull` of known-good tag/digest.
4. Smoke: login, track habit, check `docker compose logs`.

Manual process (NFR3.15); floating `:latest` increases rollback friction (BL-INFRA-U3-02).

## Secrets management in CI/CD

| Secret / config | Where stored | Rotation |
|-----------------|--------------|----------|
| `SERVER_HOST`, `SERVER_USER`, `SERVER_PASSWORD` | GitHub Actions secrets | Operator rotates in GitHub |
| `DEPLOY_COMPOSE_DIR`, `SERVER_SSH_PORT`, timeouts | GitHub vars | Repo settings |
| `JWT_SECRET`, DB passwords, CORS | Droplet `.env` (runtime) | Not in U3 CI; ops backlog |
| Docker Hub credentials | U1/U2 GitHub secrets only | Not used on droplet pull for public images |

No Vault or cloud secrets manager in as-built design.

## Supply chain and ops backlog

| Item | Status |
|------|--------|
| SSH key-based deploy | **GAP** — BL-INFRA-U3-01 |
| Digest-pinned image deploy | **GAP** — BL-INFRA-U3-02 |
| Container/CVE scan | **GAP** — BL-INFRA-U3-03 |
| Automated post-deploy smoke | **Absent** |

## Cross-repo coordination

1. Merge to **`main`** in U1 and/or U2 → wait for **`build-image`** success.
2. **`workflow_dispatch`** U3 deploy with appropriate `service` input.
3. Confirm `docker compose ps` healthy and browser smoke.

No monorepo atomic release across three repos (team.md).
