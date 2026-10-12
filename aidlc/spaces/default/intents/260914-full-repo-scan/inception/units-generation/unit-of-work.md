# Units of Work — intent `260914-full-repo-scan`

Brownfield **planning-only** intent (FR2). Three repo-aligned units describe the as-built Habit Tracker product (Spring Boot API, Angular SPA, Compose packaging). Logical components from `domain-design/components.md` are **nested inside** unit boundaries; this stage does not prescribe Bolt order (Delivery Planning).

Sources: `units-generation-questions.md` (confirmed), `components.md`, `decisions.md`, `requirements.md`, `stories.md`.

## Unit catalogue

| Unit ID | Directory | Kind | Repo | Complexity | Deployment model |
|---------|-----------|------|------|------------|-------------------|
| **U1** | `u1-habit-tracker-springboot` | `service` | `habit-tracker-springboot` | L | Standalone JVM service; container image built from backend repo |
| **U2** | `u2-habit-tracker-angular` | `ui` | `habit-tracker-angular` | L | Static SPA build; served via nginx or dev proxy |
| **U3** | `u3-habit-tracker-compose` | `packaging` | `habit-tracker-compose` | S | Hybrid prod bundle — compose stacks backend + SPA images |

**Construction note (this intent):** FR2 skips application-repo merges here. Kinds are set for **follow-up** intents; this workflow produces planning artifacts only.

---

## U1 — `u1-habit-tracker-springboot` (`service`)

**Description:** Single deployable Spring Boot monolith exposing REST APIs for auth, user clock, habits, check-ins, streak aggregates, statistics, and habit icons.

**Boundaries:** All server-side product logic in the backend repository; PostgreSQL is an **external dependency** (not a unit). No Angular or compose source in this unit.

**Logical components owned (from domain design):**

| Component | Responsibility summary |
|-----------|-------------------------|
| BackendAuthentication | Login, JWT, security filters, JSON 401/403 |
| BackendUserClock | `GET/PUT /api/me`, user timezone and civil today |
| BackendHabitIconCatalog | `GET /api/habit-icons` |
| BackendHabitManagement | Habit CRUD, owner scope |
| BackendStreakAndAggregate | HabitAggregate maintenance, streak scheduler |
| BackendCheckInTracking | Track/untrack by date |
| BackendStatistics | Range statistics API |

**Delivers:** Runnable API matching CodeKB as-built behavior; OpenAPI/Swagger surface consumed by SPA (hand-maintained or generated client in angular repo).

**Constraints:** Planning-only for intent `260914-full-repo-scan`; domain-doc alignment gaps catalogued as backlog (US2.x), not in-scope fixes here.

**Implementation notes:** Monolith cohesion — security, scheduler, and domain services deploy together; splitting would require a new intent and ADR supersession.

---

## U2 — `u2-habit-tracker-angular` (`ui`)

**Description:** Angular SPA for login, navigation shell, track board, habit editor, statistics, settings (timezone), and shared presentation (Material, interceptors, routing).

**Boundaries:** Browser client only; no server-side rendering in as-built product. Depends on U1 REST + JWT contract.

**Logical components owned:**

| Component | Responsibility summary |
|-----------|-------------------------|
| SpaAppShell | Layout, nav (desktop/mobile), routing shell |
| SpaAuthentication | Login flow, JWT storage, 401 handling |
| SpaUserClock | `/api/me` consumption, Settings timezone |
| SpaTrackHabits | Date-scoped track board |
| SpaHabitManagementUI | Edit habits, icon picker |
| SpaStatistics | Statistics range UI |
| SpaSharedPresentation | Shared modules, HTTP interceptors, styling |

**Delivers:** Buildable SPA artifacts (`ng build`) and dev-server workflow documented in CodeKB.

**Constraints:** Client error UX gaps (US2.5 backlog) documented; no mandatory UX Construction in this intent.

**Implementation notes:** Feature areas share `SpaSharedPresentation`; unit remains one repo for mob ownership and CI.

---

## U3 — `u3-habit-tracker-compose` (`packaging`)

**Description:** Docker Compose definition, deploy scripts, and GitHub Actions workflow that package **U1** and **U2** images for production-style runtime.

**Boundaries:** No business logic; orchestrates images, env files, and deploy automation. CodeKB documents compose as production closure.

**Logical scope (not in `components.md` per ADR-001):**

- `docker-compose.yml` (or equivalent) service wiring
- Deploy helper scripts and documented env contract
- GHA deploy workflow referencing built images

**Delivers:** Reproducible multi-container runtime for scanned product; planning documentation for Operation phase in follow-up intents.

**Deployment model:** Embeds **hybrid** product deploy — apps build in sibling repos; compose unit publishes the combined stack.

**Constraints:** Not a fourth application tier; changes here do not alter API semantics without coordinated U1/U2 releases.

---

## Cross-unit concerns

| Concern | Owning unit | Notes |
|---------|-------------|-------|
| REST + Bearer JWT | U1 implements; U2 consumes | Documented in dependency artifact |
| User-relative `today` | U1 authoritative; U2 displays | US1.3 |
| CORS / API base URL | U1 config; U2 environment | Dev proxy vs prod nginx |
| Image tags / release | U3 | Depends on U1 and U2 build outputs |

---

## Complexity rationale

| Unit | Size | Rationale |
|------|------|-----------|
| U1 | L | Seven domain-facing backend blocks + scheduler + security |
| U2 | L | Seven SPA blocks + routing and shared UI infrastructure |
| U3 | S | Scripts and compose wiring; no domain code |

---

## Traceability anchor

Story-to-unit mapping: `unit-of-work-story-map.md`. Element coverage: `traceability.json`. Upstream component mapping: `domain-design/traceability.json`.
