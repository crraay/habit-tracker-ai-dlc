# Security Design — unit `habit-tracker-springboot`

Planning-only intent (FR2).  **As-built architecture + STRIDE-oriented backlog** (Q3-A). No zero-trust or compliance control catalog beyond product scope (NFR3.14 N/A).

## Sources

- `nfr-requirements/security-requirements.md` (NFR3.x)
- `WebSecurityConfig`, `JwtRequestFilter`, `GlobalExceptionHandler`
- `contract-summary.md` (C1 public vs authenticated routes)
- `project.md` mandates (secrets, Flyway, user scoping)

## Authentication architecture

```text
Client --HTTPS--> nginx --HTTP--> Spring Boot
                      |
                      v
              JwtRequestFilter (Bearer)
                      |
                      v
              SecurityContext (User principal)
                      |
                      v
              Controller -> Service
```

| Element | As-built design |
|---------|-----------------|
| Token format | JWT HS256 (JJWT), no refresh token (NFR3.1, NFR3.17) |
| Login | `POST /api/auth/login`; failed attempts counter; generic 401 (NFR3.2) |
| Eligibility | ACTIVE + role USER only (NFR3.3) |
| Session | Stateless — no server session store (NFR3.8) |
| Signing key | `JWT_SECRET` from environment (NFR3.4) |

## Authorization model

- **Route matrix**: public `/api/auth/**`, `/actuator/health`, springdoc paths; all other `/api/*` require authenticated JWT (NFR3.6).
- **Data scope**: habit and log operations must bind to authenticated user or habit ownership in service/repository layer (NFR3.7 — team ALWAYS).
- **Failure mode**: invalid/expired JWT → 401 via `RestAuthenticationEntryPoint`; SPA clears session (C1 / NFR3.13).

## Transport and data protection

| Control | Design |
|---------|--------|
| TLS | Terminates at nginx (U2/U3); backend HTTP on Compose network (NFR3.9) |
| CORS | `CORS_ALLOWED_ORIGINS` env (NFR3.10) |
| DB credentials | Host `.env` on droplet; Flyway in image (NFR3.11) |
| Logging | Never log JWT or passwords (NFR3.5) |

## Error and audit surface

- **`ErrorResponse`** JSON: status, error, message, path, **correlationId**, timestamp (NFR3.12).
- Correlation supports triage; not a full security audit log (see observability-design).

## Design backlog (STRIDE-oriented)

| ID | Label | Threat / gap | Design direction (follow-up intent) |
|----|-------|--------------|-------------------------------------|
| NFR3.15 | BL-SEC-01 | Spoofing / elevation via dev bootstrap | Harden profiles; no sample users in prod images |
| NFR3.16 | BL-SEC-02 | Information disclosure on board marks | Scope log queries by user in repository layer |
| NFR3.17 | BL-SEC-03 | Stolen token window until expiry | Optional refresh + rotation design |
| NFR3.18 | BL-SEC-04 | Supply chain | Dependency/CVE scanning in CI |
| NFR3.19 | BL-SEC-05 | Deploy channel | SSH keys vs password; secret rotation on droplet |

## Input validation

- Jakarta Bean Validation on DTOs (`spring-boot-starter-validation`).
- Domain rules enforced in services per `docs/domain.md` — not duplicated in security layer.

## Compliance

No PCI/HIPAA/SOC2 control design for this personal habit tracker (NFR3.14).

## Review

Primary review artifact for this stage (advisory). Cross-check BL-SEC-02 against functional-spec WF-5 when implementing fixes.
