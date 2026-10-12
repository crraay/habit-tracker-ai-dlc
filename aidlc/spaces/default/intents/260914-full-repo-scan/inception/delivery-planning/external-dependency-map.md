# External Dependency Map — intent `260914-full-repo-scan`

**External dependency** here means anything outside the three application Git repos that can **gate** a Bolt (availability, credentials, lead time, or manual steps). Planning for intent `260914-full-repo-scan` is mostly AI-DLC workspace work (**Bolt P1**); reference Bolts **F1–F3** inherit the rows below when you run follow-up Construction.

Sources: `delivery-planning-questions.md` (Q6-B), `contract-summary.md`, `team.md`, CodeKB compose docs.

---

## Dependency catalogue

| ID | External item | Owner / operator | Typical lead time | Consumed by Bolts | If it slips |
|----|---------------|------------------|-------------------|-------------------|-------------|
| **E1** | **PostgreSQL 16** (runtime DB) | Host/Compose ops; volume `habit-tracker-springboot_postgres_data` | Minutes (container start) | F1 (runtime), F3 (stack) | Backend unhealthy until DB healthy; Flyway runs in backend image |
| **E2** | **Docker Hub** — `docker.io/crraay/habit-tracker-springboot:latest`, `...-angular:latest` | Team CI (`build-image` on app **`main`**) | Minutes–hours (build queue) | F3, Operation deploy | Compose pull fails or runs stale images; manual tag/digest rollback |
| **E3** | **DigitalOcean droplet** + SSH deploy target | Team / compose GHA secrets | Manual (`workflow_dispatch`) | F3, Operation | No production update; apps may still run on old images |
| **E4** | **Host `.env`** on droplet (`JWT_SECRET`, `CORS_ALLOWED_ORIGINS`, Postgres creds) | Operator; from `.env.example` | Human setup | F1 runtime, F3 deploy | Auth/CORS/DB failures at startup |
| **E5** | **GitHub Actions — app `build-image`** | Each app repo on push to **`main`** | CI duration | F1, F2 (before F3) | No fresh `:latest`; defer F3 or pin older digest |
| **E6** | **GitHub Actions — compose `deploy-docker-image-ssh.yml`** | `habit-tracker-compose`; manual dispatch | Human trigger + SSH | F3, Operation | Production unchanged; document dry-run for planning intents |

**Not mapped as external teams:** No partner API, no separate platform team hand-off—solo mob + Hub + droplet.

---

## Bolt → dependency matrix

| Bolt | Hard gates (must be ready) | Soft gates (document only) |
|------|----------------------------|----------------------------|
| **P1** | None | — |
| **F1** | E1 for local/integration verification; E5 if release includes image | E4 on prod (not required for dev Bolt) |
| **F2** | E5 if release includes image; U1 API reachable for integration | E4 prod |
| **F3** | E2, E5 (both images), E3, E4, E6 for production rollout | E1 on deploy host |

---

## Cross-repo coordination (contract drift — Q7-A)

Not a separate vendor, but treated as a **gated workflow** for F1+F2 releases:

| Step | Dependency | Bolt impact |
|------|------------|-------------|
| Backend REST change | U1 merge + tests | F1 |
| OpenAPI snapshot + `npm run generate-api` | U2 repo | F2 (same release train) |
| Both `build-image` workflows green | E5 × 2 | Before F3 pull |
| Compose deploy | E6 | F3 |

Slip mitigation: serial Bolts; record image digests in deploy notes when `:latest` is insufficient for rollback.

---

## Planning-only intent note

**Bolt P1** does not require E2–E6 to complete the Inception gate. This map supports **Operation** planning and **follow-up** Construction—not blockers for approving Delivery Planning on `260914-full-repo-scan`.
