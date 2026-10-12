# Architecture

**Repo:** habit-tracker-compose  
**Scan kind:** full — see [reverse-engineering-timestamp.md](./reverse-engineering-timestamp.md)  
**Inventories:** runtime surfaces in [api-documentation.md](./api-documentation.md); components in [component-inventory.md](./component-inventory.md); stack in [technology-stack.md](./technology-stack.md)

## Architecture Analysis

### System Overview

A **configuration-driven orchestration satellite**: no application bytecode is compiled here. The system’s “runtime” is a Docker Compose project (`name: habit-tracker-springboot`) on a single host. Postgres holds state; backend and frontend run as immutable Hub images. The only published host port is **80** on the frontend container, which (in the Angular image, not defined in this repo) reverse-proxies `/api` to the backend on the Compose network.

Production changes flow: **app repos build/push images → operator runs deploy workflow → droplet pulls tags and recreates containers**. Compose file changes deploy via `git pull` on the droplet without rebuilding app images.

### Architectural Style

**Single-host multi-container composition** (not microservices orchestration platform):

- One Compose file defines colocated services on a default bridge network.
- No service mesh, no Kubernetes, no in-repo IaC.
- **Integration style:** synchronous HTTP at the edge (browser → frontend → backend); JDBC inside backend to `postgres:5432`.
- **Deploy style:** imperative shell over SSH (GitHub Actions → `deploy-service.sh`).

Evidence: only `docker-compose.yml`, no app source trees; `DOCKER.md` documents Hub-only production and manual deploy gate.

### Component Relationships

```mermaid
flowchart TB
  subgraph host [Production host]
    GHA[GitHub Actions workflow_dispatch]
    SSH[SSH session]
    Script[deploy-service.sh]
    DC[Docker Compose engine]
    subgraph stack [Compose project habit-tracker-springboot]
      PG[(postgres:16-alpine)]
      BE[backend Hub image]
      FE[frontend Hub image :80]
    end
  end
  Hub[(Docker Hub public images)]
  Browser[Browser / client]

  GHA --> SSH --> Script --> DC
  Hub -->|pull| DC
  DC --> PG
  DC --> BE
  DC --> FE
  BE -->|JDBC| PG
  FE -->|proxy /api| BE
  Browser -->|HTTP :80| FE
```

Text fallback: Operators trigger GHA → SSH to droplet → `git pull` + `deploy-service.sh` → Compose pulls Hub images and recreates `backend`/`frontend`. User traffic hits frontend:80; API calls go to backend via internal network; backend uses Postgres volume `habit-tracker-springboot_postgres_data`.

### Data Flow

1. **User request:** HTTP to host port 80 → `frontend` container (static UI + reverse proxy in sibling-built image).
2. **API request:** `/api/*` proxied to `backend:8080` (default Spring port from env).
3. **Persistence:** Backend uses `SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/...` with credentials from `.env`.
4. **Secrets:** `JWT_SECRET` and `CORS_ALLOWED_ORIGINS` injected at container start; not stored in this repo.
5. **Deploy data path:** No database migration in this repo; schema migrations ship inside the backend image (Flyway in app repo).

### Key Design Decisions

| Decision | Rationale | Implication |
|----------|-----------|-------------|
| Hub images only in committed `docker-compose.yml` | Droplet needs only this clone + `.env` | App changes require app-repo CI before deploy here |
| Compose project + volume names preserved from legacy backend-repo deploy | Avoid Postgres data loss on repo move | Names look like “backend repo” though stack is full-stack |
| `:latest` tags for both app images | Simplicity for small team | Manual coordination; no immutable deploy trace in compose |
| Postgres never recreated by deploy script | Safe rolling app updates | Schema drift handled only when backend image changes |
| Manual `workflow_dispatch` deploy | Explicit production gate | No automatic deploy on compose push |
| Optional override file for local `build` | Dev ergonomics without polluting production compose | Sibling repo layout required |

### Improvement Opportunities

- Add a **backend Compose healthcheck** (e.g. HTTP GET `/actuator/health`) so `frontend` `depends_on.backend.condition: service_healthy` is reliable across Compose versions.
- Pin **immutable image digests or version tags** instead of `latest` for reproducible production.
- Prefer **SSH key auth** over password secret for deploy workflow.
- Add **yamllint** or **compose config validate** in CI (even without app tests) to catch schema errors early.
- Document expected **backend health endpoint path** in this repo once healthcheck is added (cross-link to springboot Dockerfile if defined there).

## Interaction Diagrams

### Runtime: first boot on a host (Hub images)

```mermaid
sequenceDiagram
  actor Op as Operator
  participant DC as docker compose
  participant PG as postgres
  participant BE as backend
  participant FE as frontend
  actor User as Browser

  Op->>DC: cp .env.example .env / compose pull / up -d
  DC->>PG: start + volume mount
  loop healthcheck
    PG-->>DC: pg_isready
  end
  DC->>BE: start after postgres healthy
  Note over BE: No compose healthcheck declared
  DC->>FE: start after backend service_healthy
  User->>FE: GET http://host/
  User->>FE: GET/POST http://host/api/...
  FE->>BE: proxy to backend:8080
  BE->>PG: JDBC read/write
```

### Deploy: GitHub Actions → droplet (backend only example)

```mermaid
sequenceDiagram
  actor Op as Operator
  participant GHA as GitHub Actions
  participant Droplet as SSH host
  participant Git as git pull
  participant Script as deploy-service.sh
  participant DC as docker compose
  participant Hub as Docker Hub

  Op->>GHA: workflow_dispatch service=backend
  GHA->>Droplet: appleboy/ssh-action
  Droplet->>Git: pull --ff-only in DEPLOY_COMPOSE_DIR
  Droplet->>Script: ./deploy-service.sh backend
  Script->>DC: pull backend
  Script->>Hub: fetch crraay/habit-tracker-springboot:latest
  Script->>DC: stop/rm/up -d backend
  Note over PG: postgres unchanged
  Script->>DC: ps
```

### Local dev: override build path (optional)

```mermaid
sequenceDiagram
  actor Dev as Developer
  participant DC as docker compose
  participant SB as ../habit-tracker-springboot
  participant NG as ../habit-tracker-angular

  Dev->>Dev: cp override example + docker compose up --build -d
  DC->>SB: build backend context
  DC->>NG: build frontend context
  DC->>DC: merge with base compose + .env
```

<!-- Text fallback for diagrams: Runtime boot order is postgres (healthchecked) → backend → frontend with healthy dependency. Deploy pulls selected services from Hub and recreates containers. Local override builds from sibling directories. -->
