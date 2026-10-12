# Code Quality Assessment

**Repo:** habit-tracker-compose  
**Scan kind:** full — quality signals for an orchestration-only repo. Architectural risks also in [architecture.md](./architecture.md) and [component-inventory.md](./component-inventory.md).

## Tests

| Item | Finding |
|------|---------|
| Test directories | **None** |
| Test frameworks | **None** |
| Coverage config | **Absent** |
| Automated validation | No compose schema check, no shell spec tests |

Quality for this repo is **operational**: documented procedures, manual workflow dispatch, and operator verification (`docker compose ps`, HTTP smoke on port 80). Product quality gates live in app repos (`build-image` runs Maven/npm tests per `DOCKER.md`).

## Linting

No ESLint, ShellCheck, yamllint, actionlint, or similar in repository or CI.

## CI/CD

| Pipeline | Purpose | Gate |
|----------|---------|------|
| `.github/workflows/deploy-docker-image-ssh.yml` | Production deploy over SSH | Manual only; no test job |
| App repo workflows (external) | Build/push Hub images | Maven package / `npm ci` + `test:ci` |

This repo’s CI is **deploy-only**, not build-or-test. That matches its role but means compose YAML errors surface at runtime on the droplet unless caught by review.

## Documentation

| Asset | Assessment |
|-------|------------|
| `README.md` | Concise entry; links domain doc and sibling repos |
| `DOCKER.md` | Strong — stack table, CI/CD split, secrets, server bootstrap, migration, troubleshooting |
| `AGENTS.md` | Clear negative scope (no app/domain code here) |
| Inline comments | Present in compose override example and deploy script |

Documentation quality is **high relative to repo size**; it compensates for absent automated tests.

## Technical debt

1. **Backend health gap:** `frontend` `depends_on.backend.condition: service_healthy` without backend Compose `healthcheck` — startup may hang or behave inconsistently (`docker-compose.yml` 41–43 vs 14–19).
2. **`latest` tag coupling:** Both app services track Hub `latest`; no pinned digest in compose — reproducibility and rollback depend on Hub history.
3. **SSH password authentication:** Workflow uses `SERVER_PASSWORD` rather than key-based auth — higher exposure if secret leaks.
4. **Example JWT in `.env.example`:** Documented placeholder; production must rotate (comments warn).
5. **No automated compose validation in CI:** Invalid YAML or breaking compose schema changes reach production via git pull + deploy.

## Brownfield impact (full-repo scan)

| Change type | Blast radius |
|-------------|--------------|
| Env var added to backend | Update `.env.example`, `DOCKER.md`, and droplet `.env`; redeploy backend |
| Compose port publish change | Host firewall/nginx docs; client CORS origins |
| Volume name change | **High** — would orphan Postgres data; current name intentionally legacy |
| New service in stack | Deploy script and docs must list it; GHA inputs may need extension |

For intent `260914-full-repo-scan`, this assessment supports treating compose as the **runtime integration layer** linking springboot and angular CodeKB entries without duplicating domain/API detail here.
