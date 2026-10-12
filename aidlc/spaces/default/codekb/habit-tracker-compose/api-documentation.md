# API Documentation — habit-tracker-compose

This repo **does not implement** HTTP or RPC servers. It defines **runtime wiring** and **deploy control surfaces**. Application REST is documented in `habit-tracker-springboot` CodeKB; the Angular client consumes it through the frontend container’s proxy.

## Runtime HTTP (consumed, not defined here)

Documented in `DOCKER.md` and implied by port mapping in `docker-compose.yml`.

| Exposure | Path / port | Owner | Notes |
|----------|-------------|-------|-------|
| Public UI | `http://<host>:80/` | `frontend` Hub image | Only published host port in compose |
| Public API (via proxy) | `http://<host>/api/...` | Angular image nginx/proxy → `backend:8080` | Proxy config not in this repo |
| Backend direct | `backend:8080` (internal) | Spring Boot image | Not published to host in default compose |
| Actuator health | `/actuator/health` (internal) | Spring Boot | Env `MANAGEMENT_ENDPOINTS_WEB_EXPOSURE_INCLUDE: health`; no compose healthcheck |

Backend env contract (from compose):

| Variable | Purpose |
|----------|---------|
| `SPRING_DATASOURCE_URL` | JDBC to `postgres:5432` |
| `SPRING_DATASOURCE_USERNAME` / `PASSWORD` | From `POSTGRES_*` |
| `JWT_SECRET` | HS256 signing (backend app) |
| `CORS_ALLOWED_ORIGINS` | Allowed browser origins |
| `SERVER_PORT` | `8080` inside container |

## Deploy control surface (SSH remote procedure)

**Workflow:** `.github/workflows/deploy-docker-image-ssh.yml`  
**Trigger:** `workflow_dispatch`  
**Input:** `service` ∈ `{ all, backend, frontend }` (default `all`)

Remote script sequence (on droplet):

1. `cd $DEPLOY_COMPOSE_DIR` (default `/app/habit-tracker-compose`)
2. `git pull --ff-only`
3. `chmod +x scripts/deploy-service.sh`
4. `./scripts/deploy-service.sh "$SERVICE"`

**Secrets:** `SERVER_HOST`, `SERVER_USER`, `SERVER_PASSWORD`  
**Optional vars:** `DEPLOY_COMPOSE_DIR`, `SERVER_SSH_PORT`, `DEPLOY_SSH_COMMAND_TIMEOUT` (default `15m`)

Failure modes: missing compose directory exits 1; SSH/action timeouts per workflow config.

## Shell CLI — `scripts/deploy-service.sh`

| Invocation | Behavior |
|------------|----------|
| `deploy-service.sh backend` | `pull` + stop/rm + `up -d` backend only |
| `deploy-service.sh frontend` | Same for frontend |
| `deploy-service.sh all` | Pull both; recreate backend then frontend |

**Precondition:** Docker Compose v2 (`docker compose version`).  
**Postcondition:** Prints `docker compose ps`.  
**Non-goals:** Does not migrate DB, does not run `docker compose down`, does not touch `postgres`.

## Internal Docker network (implicit contract)

| From | To | Protocol | Data |
|------|-----|----------|------|
| backend | postgres:5432 | TCP/JDBC | SQL |
| frontend | backend:8080 | HTTP | Proxied API |
| host | frontend:80 | HTTP | UI + `/api` |

Service DNS names match Compose service keys (`postgres`, `backend`, `frontend`).

## Gaps / follow-up for full-stack documentation

- Confirm in `habit-tracker-springboot` / Angular repos whether a **container HEALTHCHECK** satisfies Compose `service_healthy` for `backend`.
- If API path prefix or port changes in app images, this compose file and `DOCKER.md` must stay aligned.
