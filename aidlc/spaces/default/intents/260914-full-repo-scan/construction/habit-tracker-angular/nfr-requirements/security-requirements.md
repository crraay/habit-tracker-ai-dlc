# Security Requirements — unit `habit-tracker-angular`

Planning-only intent (FR2). **As-built + backlog** posture. Sources: U2 `functional-spec.md`, C1 contract-summary (consumer), CodeKB architecture, affirmed `team.md` / `project.md` mandates.

## Authentication and session (client)

| ID | Requirement | As-built |
|----|-------------|----------|
| **NFR3.1** | JWT and username persisted via **Elf** + `@ngneat/elf-persist-state` in **`localStorage`** (`ht_auth`). | Implemented |
| **NFR3.2** | **authGuard** blocks `/track`, `/edit`, `/statistics`, `/settings` without authenticated store state. | Implemented |
| **NFR3.3** | **tokenInterceptor** attaches `Authorization: Bearer` on API calls. | Implemented |
| **NFR3.4** | **refresh-token interceptor** on **401** clears auth and navigates to `/login` (no refresh token rotation). | Implemented |
| **NFR3.5** | Never log JWT or passwords in application code (project NEVER — applies to any future client logging). | Mandated |

## Transport and origin

| ID | Requirement | As-built |
|----|-------------|----------|
| **NFR3.6** | Production: static SPA on nginx; **`/api`** proxied to backend on Compose network (TLS at nginx). | U2/U3 deployment |
| **NFR3.7** | Dev: `environment.apiUrl` empty string + `proxy.conf.json` for same-origin API calls. | As-built |
| **NFR3.8** | Browser **CORS** enforced server-side via `CORS_ALLOWED_ORIGINS` (U1); SPA assumes allowed origin. | Configurable |

## Authorization model (client)

| ID | Requirement | As-built |
|----|-------------|----------|
| **NFR3.9** | Client does not enforce habit ownership logic — relies on API scoping (team ALWAYS on backend). | Conformist to API |
| **NFR3.10** | Domain rules (check-in window, streak) are **not** re-implemented in UI; illegal actions may reach API. | By design |

## Error handling and auditability

| ID | Requirement | As-built |
|----|-------------|----------|
| **NFR3.11** | **Settings** timezone save surfaces `HttpErrorResponse` / **ErrorResponse** shape in template (reference pattern). | Partial UX |
| **NFR3.12** | Login and Track mutations often **subscribe without error handlers** — gaps vs team ALWAYS on visible mutations. | Backlog |

## Compliance

| ID | Requirement | As-built |
|----|-------------|----------|
| **NFR3.13** | No regulatory framework in scope for this personal habit tracker SPA. | N/A |

## Security backlog (STRIDE-oriented, non-enforcing)

| ID | Gap / risk | Suggested follow-up |
|----|------------|---------------------|
| **NFR3.14** | **Spoofing / XSS** — JWT in `localStorage` is readable to any script injection on origin. | CSP, sanitize templates, avoid inline script |
| **NFR3.15** | **Information disclosure** — persisted auth survives until expiry; stolen token valid until backend rejects. | Optional refresh + rotation (interceptor TODO) |
| **NFR3.16** | **Tampering** — client sends civil dates from datepicker; backend must reject out-of-window dates. | Track `minDate` / UX alignment with domain |
| **NFR3.17** | **Repudiation** — no client-side audit log of habit actions. | Server logs only |
| **NFR3.18** | **Denial of service** — no client rate limiting; relies on nginx/backend. | N/A at SPA layer |
| **NFR3.19** | **Supply chain** — npm dependencies; no automated CVE gate in CI (team note). | Add audit when prioritized |

## Traceability to inception NFR3

Team **ALWAYS** mandates (no hand-edited `web-api/`, explicit HTTP errors on visible mutations, domain law from `docs/domain.md`) map to **NFR3.5**, **NFR3.11–NFR3.12**, and `tech-stack-decisions.md` **NFR7.x** rows.
