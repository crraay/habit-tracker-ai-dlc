# Security test instructions — full-repo-scan

## Strategy

Security NFR design (per unit) describes JWT stateless auth, user-scoped data access, and secrets via environment variables. **FR2** does not add SAST/DAST pipelines this intent.

## In-scope checks (existing unit tests)

Run backend security-relevant tests:

```powershell
cd habit-tracker-springboot
mvn -B test "-Dtest=UserClockControllerTest"
```

Expected behaviors (as-built):

- Unauthenticated API access rejected (401 on protected routes)
- Invalid IANA timezone → HTTP 400 via `GlobalExceptionHandler`
- No logging of JWT or passwords (code review / static grep — not automated here)

Angular: auth interceptors and 401 handling covered indirectly in the full `npm run test:ci` run.

## Out of scope this intent

- OWASP ZAP, dependency CVE gates, container image scanning (team.md notes absent)
- Compose SSH deploy credential rotation (documented gap in infrastructure design)
- New auth features (refresh tokens, registration API — backlog US2.x)

## How to extend (follow-up F1/F3)

Align `build-image` workflows with **mvn test** / **test:ci** before push (NFR5.17 / NFR7.26 traceability GAPs).
