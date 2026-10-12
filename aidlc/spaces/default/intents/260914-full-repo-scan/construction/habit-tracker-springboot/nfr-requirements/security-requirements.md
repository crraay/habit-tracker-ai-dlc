# Security Requirements — unit `habit-tracker-springboot`

Planning-only intent (FR2). **As-built + backlog** posture. Sources: `WebSecurityConfig`, JWT/JJJWT usage, C1 contract-summary, functional-spec, `project.md` / `team.md` mandates.

## Authentication

| ID | Requirement | As-built |
|----|-------------|----------|
| **NFR3.1** | Stateless **JWT** (HS256) after `POST /api/auth/login`; no refresh token. | Implemented |
| **NFR3.2** | Failed login increments `failedLoginAttempts`; generic 401 on bad credentials (BR1.1). | Implemented |
| **NFR3.3** | Only **ACTIVE** users with role **USER** receive tokens (BR1.2). | Implemented |
| **NFR3.4** | **`JWT_SECRET`** and datasource credentials from environment — never committed (project NEVER). | Mandated |
| **NFR3.5** | Never log JWT or passwords (project NEVER). | Mandated |

## Authorization and route exposure

| ID | Requirement | As-built |
|----|-------------|----------|
| **NFR3.6** | Public: `/api/auth/**`, `/actuator/health`, springdoc paths; all other `/api/*` require Bearer JWT. | Per WebSecurityConfig |
| **NFR3.7** | Habit and log mutations must scope to authenticated user or habit ownership (team ALWAYS). | Mostly implemented; see backlog |
| **NFR3.8** | No server-side session store; `JwtRequestFilter` binds `User` per request (BR8.1). | Implemented |

## Data protection and transport

| ID | Requirement | As-built |
|----|-------------|----------|
| **NFR3.9** | Production TLS terminates at nginx (U2/U3); backend speaks HTTP on Compose network. | Deployment pattern |
| **NFR3.10** | **`CORS_ALLOWED_ORIGINS`** env configures allowed browser origins. | Configurable |
| **NFR3.11** | PostgreSQL credentials in host `.env` on droplet; Flyway migrations in image. | As-built ops |

## Error handling and auditability

| ID | Requirement | As-built |
|----|-------------|----------|
| **NFR3.12** | API errors use stable **`ErrorResponse`** JSON via `GlobalExceptionHandler` (status, error, message, path, **correlationId**, timestamp). | Implemented |
| **NFR3.13** | 401 on protected routes via `RestAuthenticationEntryPoint`; SPA clears session. | C1 |

## Compliance

| ID | Requirement | As-built |
|----|-------------|----------|
| **NFR3.14** | No regulatory framework (PCI, HIPAA, SOC2) in scope for this personal habit tracker. | N/A this product |

## Security backlog (STRIDE-oriented, non-enforcing)

| ID | Gap / risk | Suggested follow-up |
|----|------------|---------------------|
| **NFR3.15** | **Spoofing / elevation** — dev `DataInitializer` or sample users in non-prod profiles must not ship to production. | Harden bootstrap profiles |
| **NFR3.16** | **Information disclosure** — board log query may include other users' log dates in mark set (functional-spec WF-5 note). | Scope queries by user |
| **NFR3.17** | **Session fixation N/A** — stateless JWT; no refresh rotation increases stolen-token window until expiry. | Optional refresh + rotation in future intent |
| **NFR3.18** | **Supply chain** — no automated CVE/SAST gates in CI (team deployment note). | Add dependency scanning when prioritized |
| **NFR3.19** | **Deploy secrets** — compose workflow may use SSH password auth; prefer keys and rotation. | U3 operational hardening |

## Traceability to inception NFR3

Team **ALWAYS** mandates (Flyway, ErrorResponse, user-scoped data, tests before image push) are reflected in **NFR3.4–NFR3.7**, **NFR3.12**, and tech-stack-decisions.md **NFR7.x** rows.
