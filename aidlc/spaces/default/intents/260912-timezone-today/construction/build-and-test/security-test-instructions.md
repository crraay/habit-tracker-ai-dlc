# Security test instructions — timezone-today

DevSecOps view on a Minimal `poc`: no new SAST/DAST pipeline. Reuse the existing JWT filter and the new `/api/me` tests.

## In-scope checks (already in unit tests)

- Unauthenticated `GET /api/me` → 401 (NFR1)
- Unknown IANA on `PATCH /api/me` → 400 via `BadRequestException` (NFR2)
- Timezone update is the authenticated current user only (FR1.4)
- No new secrets; `JWT_SECRET` / CORS stay environment-driven
- Do not log tokens or passwords

## How to run

```text
mvnw.cmd -f pom.xml "-Dtest=com.kostya.habittracker.UserClockControllerTest" test
```

Also included in the full `mvnw.cmd -f pom.xml test` / `package` run.

## Out of this package

OWASP ZAP, dependency CVE gate, and rate-limit load are not added. CORS and JWT configuration are unchanged.
