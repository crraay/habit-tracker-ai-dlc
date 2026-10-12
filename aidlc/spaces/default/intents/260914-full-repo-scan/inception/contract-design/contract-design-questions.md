# Contract Design Questions — intent `260914-full-repo-scan`

Context: Brownfield **planning-only** intent (FR2). Three units (U1 Spring Boot `service`, U2 Angular `ui`, U3 Compose `packaging`) with edges **U2 → U1** (REST + JWT), **U3 → U1/U2** (container images). Units Generation documented REST/JWT integration (Q9-A); domain design ADR-005 names the OpenAPI-generated client as the SPA integration adapter. This stage pins **formal contracts** for those boundaries and any **external** API surface.

Sources: `unit-of-work.md`, `unit-of-work-dependency.md`, `components.md`, `decisions.md` (ADR-005), `requirements.md`, team/project mandates on OpenAPI regeneration and `ErrorResponse`.

---

## Q1 — Contract scope for this intent

What should `contract-summary.md` treat as in-scope contract documentation?

- A. **As-built only** — document contracts that exist today in the three repos; US2.x backlog gaps appear only in Open Questions, not as target specs.
- B. **As-built + annotated gaps** — same as A, plus explicit “known mismatch vs `docs/domain.md`” callouts on affected operations (still no new API design).
- C. **Include target contract deltas** — draft intended future REST changes for US2.x themes inside this artifact (beyond planning-only FR2).
- X. Other (please specify)

[Answer]: A

---

## Q2 — OpenAPI ownership and canonical artifact (U2 ↔ U1)

The SPA regenerates `src/app/web-api/` from a checked-in OpenAPI snapshot (`habit-tracker-angular/swagger/api-docs.json`, OpenAPI 3.1, server URL localhost:8080). Which contract-ownership story should the summary record?

- A. **U1 owns semantics; U2 owns checked-in snapshot** — backend implements controllers; angular repo holds the pinned snapshot used for `npm run generate-api`; updates require exporting/syncing snapshot when API changes (team mandate).
- B. **U1 owns live Springdoc export as sole canonical spec** — snapshot in angular is a downstream copy only; contract summary points to springboot as spec source of truth path.
- C. **Shared spec unit (logical)** — document a notional `spec` boundary both units depend on, even though Construction still lives in two repos (no third repo in this intent).
- D. **Minimal REST table only** — no OpenAPI fence blocks in summary; path list + JWT only (matches Units Generation Q9-A emphasis).
- X. Other (please specify)

[Answer]: A

---

## Q3 — External / public API boundary

Besides the Angular SPA, who consumes U1’s HTTP API in the as-built product?

- A. **Browser client only (via SPA or same-origin proxy)** — treat consumer as `External: browser (U2)`; no partner/public third-party API.
- B. **Document `/api` as externally reachable** — nginx on the droplet exposes `/api` to the internet for the SPA; classify consumer as `External: public web (SPA)` with CORS/`JWT_SECRET` env notes.
- C. **Future partner API anticipated** — add a placeholder public API section with versioning policy even though no partner exists today.
- X. Other (please specify)

[Answer]: A

---

## Q4 — API versioning and breaking-change policy

How should the REST contract summary describe evolution of `/api/*` paths?

- A. **Implicit unversioned `/api`** — breaking changes require coordinated U1+U2 releases; no URL version prefix today; additive JSON fields allowed if clients ignore unknowns.
- B. **Introduce `/api/v1` in documentation** — record a forward-looking version prefix even if code remains unversioned until a follow-up intent.
- C. **Strict OpenAPI semver on `info.version`** — bump snapshot version on every breaking change; consumers regenerate client before merge.
- D. **Deploy-order only** — backend image must lead frontend when contract changes; compose (U3) pulls tags manually; no formal semver.
- X. Other (please specify)

[Answer]: A

---

## Q5 — JWT authentication contract (U2 → U1)

Which elements must appear in the formal auth contract section?

- A. **As-built Bearer JWT** — `POST /api/auth/login` returns token; `Authorization: Bearer <JWT>` on protected routes; 401 clears SPA session (interceptors); no refresh token.
- B. **A + explicit public routes** — document which paths skip JWT (e.g. login, and any anonymous catalog endpoints if applicable).
- C. **A + token claims/TTL** — document JWT expiry and principal claims if exposed in code/OpenAPI security scheme.
- D. **Defer auth fence** — mention JWT in prose only; no OpenAPI securitySchemes block in summary.
- X. Other (please specify)

[Answer]: B

---

## Q6 — Error, timeout, and retry contract (U2 → U1)

How should cross-tier failure behavior be pinned?

- A. **ErrorResponse JSON** — document Spring `GlobalExceptionHandler` shape (status, error, message, path, correlationId, timestamp) with representative OpenAPI `ErrorResponse` schema reference; SPA handles user-visible errors on mutations (Settings pattern); **no automatic HTTP retries**.
- B. **A + default Angular HttpClient timeouts** — note browser defaults only; no client retry policy unless code adds one.
- C. **Minimal** — HTTP status codes only in summary table; skip schema fence blocks.
- X. Other (please specify)

[Answer]: B

---

## Q7 — U3 packaging contracts (images + runtime env)

U3 depends on U1/U2 **artifacts**, not HTTP. What formal contract should the summary include for U3?

- A. **Image + compose wiring** — service names (`postgres`, `backend`, `frontend`), Hub image names (`crraay/habit-tracker-*:latest`), `/api` reverse proxy to backend; env vars as a `shared-schema` YAML block from compose `.env.example` (DB, `JWT_SECRET`, `CORS_ALLOWED_ORIGINS`).
- B. **Images only** — document image tags and deploy script entrypoints; env contract stays in compose repo docs only.
- C. **Full operational SLA** — add health-check URLs, restart policy, and rollout timing (beyond as-built code).
- X. Other (please specify)

[Answer]: A

---

## Q8 — OpenAPI excerpt depth in `contract-summary.md`

The checked-in snapshot is large (~1.3k lines). How much OpenAPI should be inlined per contract?

- A. **Trimmed contract OpenAPI** — one fenced YAML with `info`, `servers`, `security`, `paths` for all `/api/*` routes but **components/schemas abbreviated** (reference key DTOs + `ErrorResponse` only).
- B. **Path groups** — separate fenced blocks per domain (auth, me, habits, track, statistics, icons) with schemas local to each block.
- C. **Pointer only** — cite `habit-tracker-angular/swagger/api-docs.json` path; summary holds integration table + auth/error prose without duplicating paths.
- X. Other (please specify)

[Answer]: B

---

## Assumptions & Open Questions

- PostgreSQL is **external** to all units; no shared DB schema contract between units (only U1 ↔ Postgres).
- No event bus or async messaging contracts (Units Generation Q9-A).
- Planning-only intent: contracts are **descriptive** of as-built behavior unless Q1/Q4 explicitly choose otherwise.

None.

---

## Consolidated Summary Confirmation

- **Q1:** As-built contracts only; US2.x gaps stay in Open Questions, not target specs.
- **Q2:** U1 owns API semantics; U2 owns the checked-in OpenAPI snapshot (`swagger/api-docs.json`) for client generation; sync on API changes per team mandate.
- **Q3:** Consumer is the browser via U2 only — no separate partner/public third-party API.
- **Q4:** Unversioned `/api/*`; coordinated U1+U2 releases for breaking changes; additive JSON fields OK if clients ignore unknowns.
- **Q5:** Bearer JWT contract plus **explicit public routes** (login and other permit-all paths from Spring Security — not anonymous habit APIs).
- **Q6:** Document `ErrorResponse` + correlationId; mutation error UX (Settings pattern); browser HttpClient defaults; **no automatic retries**.
- **Q7:** U3 contract covers Hub images, compose service wiring, `/api` proxy, and env vars as a `shared-schema` block from `.env.example`.
- **Q8:** **Path-group OpenAPI** fences (auth, me, habits, track, statistics, icons) with local schemas per block.

- Looks correct
- Request changes

[Answer]: Looks correct
