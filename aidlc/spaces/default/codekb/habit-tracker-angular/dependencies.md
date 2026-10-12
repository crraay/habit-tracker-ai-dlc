# Dependencies — habit-tracker-angular

Package versions: [technology-stack.md](./technology-stack.md). This file is the coupling and failure-behaviour map.

## External Dependencies

| From | To | Mechanism | Failure behaviour (observed) |
|------|----|-----------|------------------------------|
| SPA | Spring Boot API | Generated HttpClient; `/api` same-origin or proxied | Varies by screen — see below |
| Track / Statistics / Settings | `/api/me` | `UserClockService` via `UserClockStore` | Track/Statistics wait on clock stream; no global error shell if GET fails |
| Settings | `/api/me` PUT | `updateMe` | `errorMessage` from `HttpErrorResponse` |
| Track / Login | habit-track / auth | Service subscribe | Success-only handlers — errors silent in UI |
| Authentication | Elf + localStorage | `persistState` key `ht_auth` | Survives refresh; cleared on logout / 401 |
| All authenticated HTTP | Interceptors | Functional interceptors | 401 → logout + login redirect (no refresh) |
| UI widgets | Bootstrap, Font Awesome, air-datepicker | npm imports | Presentation only |

No workspace-internal npm packages. Dependency direction: **features → stores → generated web-api → HttpClient**.

## Internal Dependency Graph

```
App Shell
  → Authentication (guards)
  → Track Habits → User Clock → UserClockService
  → Track Habits → Datepicker
  → Track Habits → HabitTrackService
  → Statistics → User Clock
  → Statistics → Datepicker
  → Statistics → HabitStatisticsService
  → Settings → User Clock
  → Settings → UserClockService
  → Edit Habits → HabitMgmtService, HabitIconsService, ConfirmDialog
  → Login → AuthService → AuthStore

Authentication → tokenInterceptor → AuthStore
Authentication → refreshTokenInterceptor → AuthStore (401)

Generated Web API Client → ApiModule / api-configuration → environment.apiUrl
```

**Acyclic** at module level. Shared **User Clock** is the main cross-feature hub for calendar defaults (Track, Statistics, Settings).

## Coupling Hotspots

| Hotspot | Consumers | Risk |
|---------|-----------|------|
| `UserClockStore` | Track, Statistics, Settings | Logout must call `clear()`; stale clock if GET never retried after error |
| `DatepickerComponent` | Track, Statistics | `maxDate` from server today but widget init is one-shot |
| Generated models | All features | Contract drift vs backend domain doc |
| `AuthStore` typing | Guards, interceptors, login | Nullable runtime vs strict interface |

## Runtime Topology (logical)

```
Browser (Angular SPA)
    │ HTTPS (static)
    ▼
nginx or dev-server
    │ /api → proxy
    ▼
Spring Boot (sibling repo)
```

Compose-specific service names documented in DOCKER.md (sibling `habit-tracker-compose`).
