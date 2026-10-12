# Component Inventory — habit-tracker-angular

Logical UI/client blocks from full-repo scan. Health: **healthy** / **at-risk** / **skimmed**. Paths: [reverse-engineering-timestamp.md](./reverse-engineering-timestamp.md). HTTP: [api-documentation.md](./api-documentation.md).

```yaml
components:
  - id: app-shell
    name: App Shell
    health: healthy
    paths:
      - src/app/app.routes.ts
      - src/app/app.config.ts
      - src/app/app.component.ts
      - src/app/components/app-container/
  - id: authentication
    name: Authentication
    health: at-risk
    paths:
      - src/app/components/login/
      - src/app/store/auth.store.ts
      - src/app/guards/
      - src/app/interceptors/
  - id: user-clock
    name: User Clock
    health: healthy
    paths:
      - src/app/store/user-clock.store.ts
      - src/app/components/settings/
  - id: track-habits
    name: Track Habits
    health: at-risk
    paths:
      - src/app/components/track-habits/
      - src/app/components/track-habit-item/
  - id: statistics
    name: Statistics
    health: healthy
    paths:
      - src/app/components/statistics/
      - src/app/components/stat-habit-item/
  - id: habit-management-ui
    name: Habit Management UI
    health: healthy
    paths:
      - src/app/components/edit-habits/
      - src/app/components/edit-habit-item/
      - src/app/components/icon-picker/
  - id: shared-presentation
    name: Shared Presentation Widgets
    health: at-risk
    paths:
      - src/app/components/datepicker/
      - src/app/components/separator/
      - src/app/components/streak/
      - src/app/components/counter/
      - src/app/components/confirm-dialog/
      - src/app/services/
      - src/app/animations/
  - id: generated-web-api-client
    name: Generated Web API Client
    health: healthy
    paths:
      - src/app/web-api/
      - swagger/
  - id: build-and-delivery
    name: Build and Delivery
    health: healthy
    paths:
      - package.json
      - angular.json
      - environments/
      - proxy.conf.json
      - Dockerfile
      - nginx.conf
      - .github/workflows/build-and-test.yml
```

| Component | Health | Owns |
|-----------|--------|------|
| App Shell | healthy | Routes, authenticated chrome, Settings nav |
| Authentication | at-risk | Login, Elf JWT session, guards, interceptors (401 logout TODO) |
| User Clock | healthy | In-memory `/api/me` cache, timezone settings UX |
| Track Habits | at-risk | Daily list/check-in; server today; no minDate; filter TODO-pipe |
| Statistics | healthy | Month-to-today range from server clock |
| Settings | healthy | IANA timezone edit, API error display |
| Habit Management UI | healthy | Habit CRUD, icon picker |
| Shared Presentation Widgets | at-risk | Datepicker (one-shot init), dialogs, animations (possible dead files) |
| Generated Web API Client | healthy | OpenAPI adapters (6 services, 13 operations) |
| Build and Delivery | healthy | npm/Angular CLI, env, proxy, Docker/nginx, CI test/build |

## App Shell

- **Responsibility**: `app.routes.ts` (login, track, edit, statistics, **settings**), `app.config.ts` (router, HttpClient + interceptors, `ApiModule.forRoot`), `AppContainerComponent` nav + logout.
- **Depends on**: Authentication guards; feature routes.
- **Notes**: Default landing `track`. Mobile/desktop nav includes Settings.

## Authentication

- **Responsibility**: `LoginComponent`, `AuthStore` (Elf + `localStorage` `ht_auth`), `authGuard` / `noAuthGuard`, `tokenInterceptor`, `refreshTokenInterceptor`, `AuthService`.
- **Depends on**: Generated client `POST /api/auth/login`.
- **Risks**: Login subscribe success-only; refresh interceptor TODO; `AuthProps` types vs null initial state.

## User Clock

- **Responsibility**: `UserClockStore` — lazy `GET /api/me`, `applyTimezoneUpdate`, `clear()` on logout; `SettingsComponent` — IANA select (`Intl.supportedValuesOf`), `PUT /api/me`, error message binding.
- **Depends on**: `UserClockService` (generated).
- **Notes**: Clock not persisted; timezone change does not refetch `today` in-session (tests assert this behaviour).

## Track Habits

- **Responsibility**: `TrackHabitsComponent` loads clock then list; `handleStatusChange` POST/DELETE track; `TrackHabitItemComponent` row UI; template filter via `applyFilterByStatus` (TODO pipe); hardcoded `"TODO"` separator label in HTML.
- **Depends on**: User Clock, Datepicker, `HabitTrackService`.
- **Risks**: No track `minDate`; success-only HTTP on check-in; OnPush + method-in-template filter.

## Statistics

- **Responsibility**: `StatisticsComponent` — range from server `today`, `getAggregatedData`; `StatHabitItemComponent` rows; date pickers for range.
- **Depends on**: User Clock, Datepicker, `HabitStatisticsService`.

## Habit Management UI

- **Responsibility**: `EditHabitsComponent`, `EditHabitItemComponent`, `IconPickerComponent`; habit-mgmt + habit-icons API calls.
- **Depends on**: `HabitMgmtService`, `HabitIconsService`, confirm dialog for deletes.
- **Notes**: `edit-habit-item` has commented debugger and TODO name-length validation.

## Shared Presentation Widgets

- **Responsibility**: `DatepickerComponent` (air-datepicker wrapper), `SeparatorComponent`, streak/counter widgets, `@ngneat/dialog` confirm service, animation triggers under `animations/triggers/`.
- **Depends on**: Callers for min/max/value dates.
- **Risks**: Datepicker options set once in `ngAfterViewInit`; legacy animation files may be unused.

## Generated Web API Client

- **Responsibility**: `src/app/web-api/` from `swagger/api-docs.json`; tags: auth, habit-mgmt, habit-track, habit-statistics, habit-icons, **user-clock** (`UserClockService`).
- **Depends on**: `HttpClient`, `environment.apiUrl`, path alias `@webapi/*`.

## Build and Delivery

- **Responsibility**: Angular application builder (`production`, `dev`, `local` configs); dev proxy; Docker `ng build --configuration=production`; nginx `/api/` → backend; reusable CI workflow.
- **Depends on**: npm, Node in CI; sibling backend at runtime.
