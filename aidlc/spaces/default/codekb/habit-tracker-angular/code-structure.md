# Code Structure — habit-tracker-angular

Deep path list lives once in [reverse-engineering-timestamp.md](./reverse-engineering-timestamp.md) (`analyzed.paths`). This file classifies that tree.

## Package and Module Organization

Single application package `habit-tracker-ui`. No Nx/npm workspaces.

| Area | Location | Role |
|------|----------|------|
| Bootstrap | `src/app/app.config.ts`, `src/app/app.routes.ts` | Standalone app config, routes |
| Feature UI | `src/app/components/*/` | Standalone components, prefix `ht` |
| Session | `src/app/store/auth.store.ts` | Elf store + persist |
| Route guards | `src/app/guards/` | `authGuard` / `noAuthGuard` |
| HTTP cross-cut | `src/app/interceptors/` | Bearer token; 401 → logout (TODO refresh) |
| Generated client | `src/app/web-api/` | `ng-openapi-gen` from `swagger/api-docs.json` |
| App services | `src/app/services/` | Skimmed; not a today/timezone owner |
| Animations | `src/app/animations/` | Skimmed |
| Environments | `environments/` | `apiUrl` (`''` in dev; proxy `/api`) |
| OpenAPI input | `swagger/` | Snapshot + `config.json` |

Generated client tags: `auth`, `habit-mgmt`, `habit-track`, `habit-statistics`, `habit-icons`. Alias `@webapi` is used by feature components.

## File Classification

| Class | Examples | Notes |
|-------|----------|-------|
| Feature screens | `track-habits`, `statistics`, `login`, `app-container` | Deep-read; today/clock live here |
| Feature screens (skim) | `edit-habits`, `edit-habit-item` | Habit CRUD; not today-critical |
| Widgets | `datepicker` (deep); `track-habit-item`; skimmed `stat-habit-item`, `streak`, `counter`, `separator`, `icon-picker`, `confirm-dialog` | Datepicker options applied once |
| Generated HTTP | `web-api/services/*.ts`, `fn/**`, `models/` | Do not hand-edit; regenerate |
| Config / CI | `package.json`, `angular.json`, `proxy.conf.json`, `.github/workflows/build-and-test.yml` | Deep-read |
| Tests | Co-located `*.spec.ts` (21 files) | Skimmed except as noted in quality assessment |

## Code Patterns

- **Standalone components** + OnPush on Track and Statistics.
- **Generated service injection** (`HabitTrackService`, `HabitStatisticsService`) rather than a hand-written habit domain layer.
- **Local civil dates**: `new Date()` then `date-fns` `format` / `startOfMonth` — the implicit today source.
- **RxJS `subscribe` in the component** with success-only handlers on Track refresh/check-in and Login.
- **Datepicker**: Air Datepicker wrapped; max/today baked at `ngAfterViewInit` — a later swap of API today will not update the widget without re-init or option refresh.
- **Auth**: Elf persist `ht_auth`; interceptors wrap `HttpClient`; refresh interceptor is logout-on-401.

Unused / leftover (do not treat as APIs): Statistics `endOfMonth`, `add`, `onPeriodChange`; Track `applyFilterByStatus` marked TODO-pipe. Track still reads `status` on `HabitTrackResponse` (rename is out of this package).
