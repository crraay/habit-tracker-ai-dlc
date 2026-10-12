# Business Overview — habit-tracker-compose

First full scan (`kind: full`) for intent `260914-full-repo-scan`. This repository is **not** the Habit Tracker product; it is the **production runtime integration layer** that wires Postgres, the Spring Boot API image, and the Angular UI image into one deployable stack on a host (typically a DigitalOcean droplet).

## Purpose

`habit-tracker-compose` lets operators run the full Habit Tracker application with Docker Compose using pre-built public Hub images, manage secrets via `.env`, and roll out new backend or frontend images without rebuilding in this repo. Domain rules, REST APIs, and UI behavior live in sibling repositories; this repo owns **how those pieces are composed at runtime** and **how production deploy is triggered**.

## Key Functionality

| Area | What this repo provides | Product boundary |
|------|-------------------------|------------------|
| Runtime stack | Three-service Compose: `postgres`, `backend`, `frontend` | Persists habit data in Postgres; serves UI on host port 80; API reached via frontend reverse proxy (`/api/...`) inside the Angular image |
| Configuration | `.env` contract: DB credentials, `JWT_SECRET`, `CORS_ALLOWED_ORIGINS` | Values are injected into the backend container; not validated here |
| Data continuity | Compose project name and **named volume** match prior backend-repo deploy path | Postgres data survives migration to this repo layout |
| Local dev option | `docker-compose.override.example.yml` builds from sibling app repos | Optional; not required for Hub-only production path |
| Production deploy | Manual GitHub Actions SSH workflow + `deploy-service.sh` | Pulls Hub `latest` tags and recreates app containers; Postgres untouched |
| Operations docs | `DOCKER.md`, `README.md`, `AGENTS.md` | Server setup, CI/CD split, troubleshooting |

## Domain Boundary

- **This package owns:** orchestration YAML, env template, deploy script, deploy workflow, operational documentation.
- **This package does not own:** habit domain law (see `habit-tracker-springboot/docs/domain.md`), REST handlers, JWT implementation, Angular routes, image Dockerfiles (built in app repos).
- **Cross-repo coupling:** Backend and frontend images must be built and pushed from `habit-tracker-springboot` and `habit-tracker-angular` before deploy here; version alignment is manual (`latest` on both).

## Full-Stack Scan Context

For the monorepo workspace scan, treat this repo as the **deployment closure** for the two application repositories: it documents the env vars and network assumptions the backend expects at runtime and the single public entry point (port 80) users hit in production.
