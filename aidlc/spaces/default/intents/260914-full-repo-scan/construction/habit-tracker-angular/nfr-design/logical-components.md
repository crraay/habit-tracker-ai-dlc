# Logical Components — unit `habit-tracker-angular`

Planning-only intent (FR2).  **SPA shell + feature areas + deploy boundary** (Q5-A). Aligns with `inception/domain-design/components.md` Spa* catalogue.

## Sources

- `frontend-components.md`, `functional-spec.md`
- `contract-summary.md` (C1 consumer, C3 image)
- `tech-stack-decisions.md` (NFR7.x)

## Deploy boundary

| Boundary | Artifact | Failure domain |
|----------|----------|----------------|
| C3 image | `docker.io/crraay/habit-tracker-angular:latest` | Whole static bundle + nginx proxy config |
| Runtime | nginx container on droplet | SPA unavailable if container down; API errors if backend unreachable |
| Auth persistence | Browser `localStorage` | Per-browser; cleared on 401 interceptor |

## In-app structure

```text
+-- App shell (routing, bootstrap)
|     +-- Login (public)
|     +-- Track (authGuard, OnPush)
|     +-- Edit habit (authGuard)
|     +-- Statistics (authGuard, OnPush)
|     +-- Settings (authGuard)
+-- Cross-cutting
|     +-- Elf auth store + persist
|     +-- UserClockStore (/api/me cache)
|     +-- tokenInterceptor + 401 interceptor
|     +-- Generated web-api services (OpenAPI)
+-- External (runtime)
      +-- U1 REST API via /api
      +-- nginx static assets
```

## Domain components (cross-reference)

| Catalogue name | Route / area | NFR touchpoints |
|----------------|--------------|-----------------|
| SpaAuthenticationUI | `/login` | security-design auth flow |
| SpaUserClock | UserClockStore | performance NFR2.5 |
| SpaHabitTrackUI | `/track` | performance NFR2.6; security BL-SEC-UX-01 |
| SpaHabitManagementUI | `/edit` | security conformist model |
| SpaStatisticsUI | `/statistics` | performance NFR2.7 |
| SpaSettingsUI | `/settings` | security NFR3.11 reference errors |

## Shared client resources

- **Single Angular bundle** — all features share JS heap and Zone.js digest.
- **One HttpClient pipeline** — interceptors apply globally.
- **UserClockStore** — single shared `/api/me` stream amortizes clock reads.

## Server/ops pointers (Q4-A)

| Concern | Owner unit | U2 design pointer |
|---------|------------|-------------------|
| API latency / DB pool | U1 | performance-design cross-ref NFR2.11 |
| Health / backups / scheduler | U1 | reliability in U1 nfr-design (not duplicated here) |
| Compose deploy cadence | U3 | performance NFR2.12; C3 pull |

## Isolation strategy (as-built)

- **No micro-frontends** — feature modules compile into one SPA.
- **No client-side tenancy** — single user session per browser profile.
- **Blast radius of XSS** — full JWT read from localStorage (see security-design BL-SEC-02).

## Bridge to Infrastructure Design

Maps **which SPA areas** sit behind nginx and depend on C1/C3; Infrastructure Design will attach host ports, TLS, and proxy paths without changing U2 functional scope.
