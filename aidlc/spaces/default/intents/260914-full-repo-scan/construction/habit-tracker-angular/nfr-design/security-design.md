# Security Design — unit `habit-tracker-angular`

Planning-only intent (FR2).  **As-built client architecture + STRIDE backlog** (Q3-A). Primary review artifact for this unit.

## Sources

- `nfr-requirements/security-requirements.md` (NFR3.x)
- U2 `functional-spec.md`, C1 `contract-summary.md`
- `tech-stack-decisions.md` (Elf, interceptors)

## Authentication flow (as-built)

```text
Login --> POST /api/auth/login --> JWT + username --> Elf persist (localStorage ht_auth)
Navigate protected route --> authGuard checks store
HttpClient call --> tokenInterceptor adds Bearer
401 response --> refresh-token interceptor clears auth --> /login
```

| Element | Design |
|---------|--------|
| Storage | JWT in **localStorage** via Elf persist (NFR3.1) |
| Guards | `authGuard` on track, edit, statistics, settings (NFR3.2) |
| Attach | `tokenInterceptor` (NFR3.3) |
| Logout on 401 | No refresh rotation (NFR3.4, NFR3.15 backlog) |
| Secret hygiene | Never log JWT/passwords (NFR3.5) |

## Transport and origin

| ID | Design |
|----|--------|
| NFR3.6 | Production nginx: static SPA + `/api` reverse proxy |
| NFR3.7 | Dev: empty `apiUrl` + `proxy.conf.json` same-origin pattern |
| NFR3.8 | CORS enforced on U1; SPA assumes allowed browser origin |

## Authorization and domain law (client)

| ID | Design |
|----|--------|
| NFR3.9 | UI **conformist** — habit ownership enforced only on API |
| NFR3.10 | Domain rules (check-in window, streak) **not** reimplemented client-side |

## Error handling UX

| ID | Design |
|----|--------|
| NFR3.11 | Settings timezone save — reference pattern for `ErrorResponse` / `HttpErrorResponse` in template |
| NFR3.12 | **Gap** — login/track mutations often subscribe without error handlers (BL-SEC-UX-01) |

## Browser hardening (as-built vs backlog)

- **CSRF**: Not applicable to Bearer-in-header API from SPA on same origin; no cookie session.
- **CSP / XSS**: No documented CSP in repo; JWT in localStorage increases XSS blast radius (NFR3.14 → BL-SEC-02).

## Design backlog (STRIDE-oriented)

| ID | Label | Direction |
|----|-------|-----------|
| NFR3.14 | BL-SEC-02 | CSP, sanitize templates, avoid inline script |
| NFR3.15 | BL-SEC-03 | Optional refresh + rotation (align with U1 backlog) |
| NFR3.16 | BL-SEC-04 | Datepicker `minDate` / UX vs domain check-in window |
| NFR3.19 | BL-SEC-05 | npm audit / supply chain in CI |
| NFR3.12 | BL-SEC-UX-01 | Explicit error handling on all user-visible mutations |

## Compliance

No regulatory control design for this SPA (NFR3.13 N/A).

## Cross-references

- Server security patterns: U1 `security-design.md` (JWT issuance, route matrix, BL-SEC-02 board scoping).
- Security headers (HSTS, etc.): owned at **nginx** (U2/U3), not Angular app code.
