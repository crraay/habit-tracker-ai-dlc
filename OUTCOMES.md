# Outcomes Pack

**Scope**: classic  
**Stages delivered**: 26 approved / 26 total  
**Duration**: 0 min  

**Intent**: `260914-full-repo-scan` — brownfield full-repo scan (FR2 planning-only).  
**Record**: `aidlc/spaces/default/intents/260914-full-repo-scan/`  
**Status**: Workflow **Completed** (2026-10-12).

---

## 1. What Was Built

### Project

**Habit Tracker** — multi-repo habit check-in product (Spring Boot API, Angular SPA, Docker Compose production on DigitalOcean). This workflow **documented the as-built system**; it did **not** ship new application features or merge product-repo changes (FR2.1).

### Scope the workflow ran at

- **Scope**: `classic` (Standard depth, Standard test strategy, relaxed change control).
- **Ideation**: Skipped (brownfield entry).
- **Construction**: Per-unit design + verification docs; **code-generation** plan-approved with **no application-repo merges**.
- **Operation**: CD, environment, deploy, observability, incident, performance, and feedback **runbooks and matrices** (planning-only; no live deploy or infra changes from this intent).

### Units of work (as documented)

| Unit | Repo | Role |
|------|------|------|
| **U1** | `habit-tracker-springboot` | REST API, JWT auth, habits/track/stats, Flyway, domain law in `docs/domain.md` |
| **U2** | `habit-tracker-angular` | SPA (`ht-*`), OpenAPI-generated client, Elf auth, UserClock store |
| **U3** | `habit-tracker-compose` | Production Compose, SSH deploy workflow, Hub image pulls |

**Bolt plan**: **P1** (this intent — planning closure) executed; **F1 → F2 → F3** are **reference templates** for follow-up intents (`inception/delivery-planning/bolt-plan.md`).

### Key architectural decisions (from artefacts)

- **Three sibling Git repos** under AI-DLC workspace; not a monorepo (`team.md`).
- **Production path**: U3 Compose on a droplet; legacy AWS EB/S3 workflows **not** extended for new work (`project.md` Forbidden).
- **C1 contract**: JWT REST; Angular client from checked-in OpenAPI snapshot — no hand-edits to `web-api/`.
- **Domain**: `habit-tracker-springboot/docs/domain.md` is canonical for habits, *today*, streaks, timezone.
- **Deploy model**: Manual `workflow_dispatch` → SSH → `git pull` → `deploy-service.sh`; Hub `:latest` tags; Postgres named volume preserved.
- **Observability**: Healthchecks + container logs; **no** contractual SLOs or metrics platform in repo today.

### Tech stack (pins from CodeKB — product unchanged by this intent)

| Layer | Stack |
|-------|--------|
| U1 | Java 17, Spring Boot 3.5.5, PostgreSQL, Flyway 11.10.3, JJWT 0.12.6, springdoc 2.8.9 |
| U2 | Angular (standalone, OnPush), Karma/Jasmine CI, Material |
| U3 | Docker Compose v2, Postgres 16 Alpine, nginx frontend image, public Hub images |

---

## 2. Repository Structure

```
habit-tracker-ai-dlc/          # AI-DLC workspace (this repo)
├── aidlc/                     # Intent records, CodeKB, memory, practices
│   └── spaces/default/
│       ├── codekb/            # Reverse-engineered docs per product repo
│       └── intents/260914-full-repo-scan/  # Full scan deliverables
├── habit-tracker-springboot/  # U1 — API + domain + Flyway
├── habit-tracker-angular/     # U2 — SPA
└── habit-tracker-compose/     # U3 — production compose + deploy
```

| Location | Purpose |
|----------|---------|
| `aidlc/.../intents/260914-full-repo-scan/inception/` | Requirements, domain, units, contracts, bolt plan |
| `aidlc/.../intents/260914-full-repo-scan/construction/` | Per-unit functional/NFR/infra design; build-and-test; CI docs |
| `aidlc/.../intents/260914-full-repo-scan/operation/` | CD, env, deploy, observability, incident, perf, feedback |
| `aidlc/.../codekb/habit-tracker-*` | Living CodeKB entries synced from reverse engineering |
| Product repos | Runnable application code (owned by team; not modified by this intent) |

---

## 3. Setup Guide

### Prerequisites

- **U1**: JDK 17, Maven (or `mvnw`).
- **U2**: Node.js + npm; Chrome for `test:ci`.
- **U3**: Docker Engine + Compose v2 (local or droplet).
- **Ops**: GitHub access for Actions; DigitalOcean droplet for production.

### Local development

**Backend (U1)**

```powershell
cd habit-tracker-springboot
mvn -B test
```

**Frontend (U2)**

```powershell
cd habit-tracker-angular
npm install
npm run test:ci
npm run build
```

**Full stack (U3)** — see `habit-tracker-compose/DOCKER.md`: copy `.env.example` → `.env`, `docker compose pull && up -d`, or use override to build sibling repos.

### Environment variables (production compose)

From `habit-tracker-compose/.env.example`: `POSTGRES_*`, `JWT_SECRET`, `CORS_ALLOWED_ORIGINS`. GitHub Secrets for U3 deploy: `SERVER_HOST`, `SERVER_USER`, `SERVER_PASSWORD` (prefer SSH keys — backlog).

### Tests (verified this intent)

| Repo | Command | Result (2026-10-08) |
|------|---------|---------------------|
| springboot | `mvn -B test` | 11/11 pass |
| angular | `npm run test:ci` | 29/29 pass |
| compose | — | No automated tests |

---

## 4. Build and Deploy

### Build (CI alignment)

- **U1/U2**: Push to `main` triggers `build-image` → Docker Hub `crraay/habit-tracker-{springboot,angular}:latest`.
- **Gap (drift)**: U1 `build-image` may skip tests — team rule requires tests green before prod image (`project.md` Mandated).

### Deploy (as-built)

1. Confirm Hub images after U1/U2 `main` builds.  
2. U3: **Actions → deploy-docker-image-ssh** (`all` | `backend` | `frontend`).  
3. Remote: `git pull --ff-only` in `DEPLOY_COMPOSE_DIR`, `./scripts/deploy-service.sh`.  
4. Manual smoke: login, `/api/me`, track — see `operation/deployment-execution/smoke-test-results.md`.

**Rollback**: `operation/deployment-pipeline/rollback-runbook.md`.

**IaC**: None for Compose prod — git-tracked compose + operator droplet (`operation/environment-provisioning/`).

---

## 5. Architecture Decisions

| Decision | Rationale | Source |
|----------|-----------|--------|
| Planning-only full scan (FR2) | Document as-built; no repo merges from scan intent | `bolt-plan.md`, Q8-A |
| Compose-only new ops work | Legacy AWS paths deprecated for prod | `team.md`, `project.md` |
| Single-host production | Personal-scale; recreate deploy | U3 infra spec |
| No staging in repo | Operator discretion; backlog BL-INFRA-U3-06 | env inventory |
| Test-after posture | Team affirmed; no 80% CI floor today | `team.md` |
| Serial reference Bolts F1→F2→F3 | U2 depends on U1 contract; U3 on images | `unit-of-work-dependency` |

**Rejected / not adopted (documented gaps)**: Prometheus/Grafana, contractual SLOs, automated post-deploy health in GHA, blue/green, AWS Incident Manager/SSM for DO stack.

---

## 6. What to Commit vs Archive

| Artifact | Action | Destination |
|----------|--------|-------------|
| Intent record tree (`aidlc/spaces/default/intents/260914-full-repo-scan/`) | **Commit** | AI-DLC workspace repo (versioned audit trail) |
| CodeKB updates | **Commit** | `aidlc/spaces/default/codekb/` |
| `OUTCOMES.md` (this file) | **Commit** | Workspace root |
| Optional product summaries | Write + commit if team wants | e.g. `docs/architecture.md` in app repos — **not created by this intent** |
| `<record>/audit/*.md` shards | **Archive** — do not copy to app repos | Compliance / local clone |
| Stage `*-questions.md` files | **Keep in intent record** (historical Q&A); optional trim in app repos | Intent record only |
| `aidlc-state.md` | **Keep in intent record** | Part of workflow history |
| Application code | **Unchanged** by this intent | Product repos as-is |

---

## 7. Workflow Footprint

- **Stages**: 26 approved, 0 failed, 0 pending  
- **By phase**: Initialization 3/3, Inception 9/9, Construction 7/7, Operation 7/7  
- **Memory entries captured**: 2 total (1 interpretations, 0 deviations, 0 trade-offs, 1 open questions)  
- **Learnings captured**: 0 from orchestrator, 0 from user additions  

*(Counts from `aidlc engine runtime summary --json`.)*

---

## 8. Known Limitations and What to Tackle Next

### Deferred by design (FR2)

- Application feature work and CI/workflow **changes** in product repos.  
- Live load tests, production deploy drills, AWS optimization APIs.  
- Reference Bolts **F1–F3** — templates only until a new intent runs them.

### Top technical backlog (from `operation/feedback-optimization/feedback-loop.md`)

| Priority | Item |
|----------|------|
| **P0** | Enforce U1 tests on `build-image`; post-deploy health curl in U3 workflow |
| **P1** | Uptime synthetic, Micrometer export, alerts; SSH keys; DB backup runbook; digest pinning |
| **P2** | Deeper API/UI tests; k6 baseline (`operation/performance-validation/load-test-plan.md`) |
| **P3** | Scheduler vs user timezone alignment (BL-REL-02/03) |

### Open questions (memory aggregate)

One open-question memory entry remains in stage diaries — review per-unit `*/memory.md` under the intent record for detail.

### Recommended next steps

1. Start a **focused intent** (e.g. “F1: require tests on springboot build-image”) using existing CodeKB and contracts.  
2. Optionally copy a one-page architecture summary into each product repo’s `docs/` for developers who do not open AI-DLC.  
3. Run **`aidlc-replay`** or audit shards if stakeholders need a narrative of gates and dates.

---

*Generated by AI-DLC Outcomes Pack for intent `260914-full-repo-scan`.*
