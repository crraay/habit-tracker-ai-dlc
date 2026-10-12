# Architecture Decision Records — domain design (`260914-full-repo-scan`)

Descriptive ADRs for the brownfield component catalogue. Status **Accepted** reflects planning intent for this intent only (FR2: no Construction merges here).

---

## ADR-001: Planning-only catalogue boundary

### Context

Intent `260914-full-repo-scan` exists to maintain CodeKB and inception planning artifacts. FR2 forbids merging application code from this workflow. Domain design must describe the product as built without implying new implementation work.

### Decision

Treat `components.md` and this ADR log as **descriptive documentation** of as-built logical blocks. Do not add deploy-orchestration components for `habit-tracker-compose` in the catalogue (compose remains in units/delivery).

### Consequences

**Positive:** Clear separation between scan/planning intent and follow-up feature intents.  
**Negative:** Compose scripts and GHA deploy are not modeled as logical code blocks here.  
**Neutral:** Units Generation may still group repos into deployable units.

### Alternatives Rejected

- **Application + DeployOrchestration component (Q1-B):** Rejected — compose is not application business logic.
- **Backend-only minimal SPA blob (Q1-D):** Rejected — SPA feature boundaries are material to client/server contracts.

---

## ADR-002: Coarse backend decomposition

### Context

The Spring monolith contains controllers, services, security, scheduler, and persistence. Finer decompositions (per-controller or pure layers) add noise for a planning-only brownfield catalogue.

### Decision

Group the API into seven logical backend components: Authentication, UserClock, HabitIconCatalog, HabitManagement, StreakAndAggregate, CheckInTracking, Statistics. Persistence is an **external dependency**, not a component.

### Consequences

**Positive:** Aligns with service boundaries and CodeKB inventory sections.  
**Negative:** Hides some class-level types (mappers, controllers) inside components.  
**Neutral:** StreakAndAggregate remains separate from CheckInTracking to surface the scheduler (see ADR note on timezone in Rationale, not a dedicated ADR per Q8).

### Alternatives Rejected

- **Layer-based components (Q2-B):** Rejected — mirrors package layers, not product capabilities.
- **Controller-aligned (Q2-C):** Rejected — too fine for planning.
- **Merge streak into tracking (Q2-E):** Rejected — obscures nightly batch job.

---

## ADR-003: JWT and Spring Security folded into Authentication

### Context

Security filters, JWT utilities, and login share one deployment and change together. Splitting ApiSecurity would duplicate edges in a monolith catalogue.

### Decision

Single **BackendAuthentication** component owns login, JWT issuance, filter chain behaviour, and JSON 401/403 handling.

### Consequences

**Positive:** One place for auth concerns in diagrams and traceability.  
**Negative:** Filter-chain detail is summarized, not a separate block.  
**Neutral:** Future extract to gateway would supersede this ADR in a new intent.

### Alternatives Rejected

- **Separate ApiSecurity (Q3-B):** Rejected for monolith planning view.
- **Infrastructure-only (Q3-C):** Rejected — auth is core product logic.

---

## ADR-004: Server-authoritative user clock

### Context

Track and Statistics must align civil dates with the backend. Browser `Date` alone would diverge from check-in rules and user timezone changes.

### Decision

**BackendUserClock** exposes `/api/me` as the authority for `today` and `timezone`. **SpaUserClock** caches responses in memory (not localStorage) and drives date defaults and Settings timezone UX.

### Consequences

**Positive:** Consistent date boundaries when clock load succeeds (US1.3, US1.4, US1.10).  
**Negative:** Full page reload refetches clock; timezone update does not refetch `today` in-session (documented as-built).  
**Neutral:** Domain-doc check-in window enforcement remains server-side with UI gaps (backlog).

### Alternatives Rejected

- **Client calendar authority:** Rejected — conflicts with backend system-of-record posture.

---

## ADR-005: OpenAPI-generated client as integration adapter

### Context

Angular must not hand-edit `web-api/`; DTOs and paths follow checked-in OpenAPI. Domain design must show how SPA features reach the API.

### Decision

Model **Generated Web API Client** as an `external_dependency` on SPA feature components, not as a logical domain component. Cross-tier `depends_on` edges use `style: sync` from Spa* blocks to Backend* blocks (Q6-A).

### Consequences

**Positive:** Matches team practice and regeneration workflow.  
**Negative:** Catalogue YAML does not list each generated service class.  
**Neutral:** Contract Design stage can name formal API contracts explicitly.

### Alternatives Rejected

- **Generated client as its own component (Q4-B):** Rejected — adapter, not business logic.
- **No cross-tier YAML edges (Q6-C):** Rejected — loses machine-readable client/server map.

---

## ADR-006: Domain-doc vs schema gaps deferred to follow-up intents

### Context

`docs/domain.md` describes habit lifecycle, schedules, user-relative streak scheduling, and statistics semantics that are partially missing or divergent in schema and code (FR4). US2.x stories are Won't Have for this intent.

### Decision

Do **not** add Future* components to the YAML catalogue. Document gaps in `components.md` Entity/Rationale prose, mark US2.x as **Deferred** in traceability, and reference follow-up intents for alignment work.

### Consequences

**Positive:** Catalogue reflects runnable as-built code only (Q7-A).  
**Negative:** Ideal domain model is not visualized as separate blocks.  
**Neutral:** Delivery planning can schedule a dedicated domain-alignment intent.

### Alternatives Rejected

- **Future extension components (Q7-B):** Rejected — mixes aspirational with as-built.
- **DomainAlignmentBacklog pseudo-component (Q7-C):** Rejected — no runtime code to own.
