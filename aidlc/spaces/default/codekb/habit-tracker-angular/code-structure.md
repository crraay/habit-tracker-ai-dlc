# Code Structure — habit-tracker-angular

Full-repo path coverage is summarized in [reverse-engineering-timestamp.md](./reverse-engineering-timestamp.md) (`analyzed.paths: ./`). This file classifies the tree.

## Package and Module Organization

Single application package **`habit-tracker-ui`**. No Nx/npm workspaces.

| Area | Location | Role |
|------|----------|------|
| Bootstrap | `src/main.ts`, `src/app/app.config.ts`, `src/app/app.routes.ts` | Standalone bootstrap, providers, routes |
| Feature UI | `src/app/components/*/` | Standalone components, selector prefix `ht` |
| Session | `src/app/store/auth.store.ts` | Elf + localStorage JWT |
| User clock | `src/app/store/user-clock.store.ts` | In-memory `/api/me` cache |
| Route guards | `src/app/guards/` | `authGuard`, `noAuthGuard` |
| HTTP cross-cut | `src/app/interceptors/` | Bearer token; 401 → logout |
| App services | `src/app/services/` | Dialog helpers (not domain services) |
| Generated client | `src/app/web-api/` | OpenAPI codegen; `ApiModule.forRoot` |
| Animations | `src/app/animations/` | Triggers re-exported from `triggers/` |
| Environments | `environments/` | `apiUrl`, production flags |
| OpenAPI input | `swagger/` | `api-docs.json`, `config.json` |
| Static assets | `public/` | Favicon/manifest (skimmed) |
| Container deploy | `Dockerfile`, `nginx.conf` | Production static + API proxy |

Path alias: `@webapi/*` → `src/app/web-api/*` (`tsconfig`).

## Feature Map

| Route | Component directory | Store / services |
|-------|---------------------|------------------|
| `/login` | `components/login/` | `AuthStore`, `AuthService` |
| `/track` | `components/track-habits/`, `track-habit-item/` | `UserClockStore`, `HabitTrackService` |
| `/edit` | `components/edit-habits/`, `edit-habit-item/`, `icon-picker/` | `HabitMgmtService`, `HabitIconsService` |
| `/statistics` | `components/statistics/`, `stat-habit-item/` | `UserClockStore`, `HabitStatisticsService` |
| `/settings` | `components/settings/` | `UserClockStore`, `UserClockService` |
| `` (shell) | `components/app-container/` | Logout clears auth + clock |

## File Classification

| Class | Examples | Notes |
|-------|----------|-------|
| Feature screens | All under `components/*/` | Deep-read in developer scan |
| Widgets | `datepicker`, `separator`, `streak`, `counter`, `confirm-dialog` | Shared imports |
| Generated HTTP | `web-api/services/*.ts`, `fn/**`, `models/` | Regenerate only |
| Config / CI | `package.json`, `angular.json`, `proxy.conf.json`, `build-and-test.yml` | Deep-read |
| Tests | 22× `*.spec.ts` co-located | Representative bodies read; not every assertion traced |
| Agent harness | `.cursor/` | Skimmed; not runtime |

## Code Patterns

- **Standalone components** with explicit `imports` arrays; OnPush on heavy screens (Track, Statistics, Settings).
- **No NgRx** — Elf for auth only; user clock is a plain `@Injectable` with fields + RxJS cache.
- **Generated service injection** per OpenAPI tag instead of a hand-written API facade.
- **date-fns**: `parseISO` for server `today`; `format(..., 'yyyy-MM-dd')` for API path/body dates.
- **RxJS**: component-level `subscribe` (Settings uses `{ next, error }`; Track/Login often success-only).
- **Datepicker**: Air Datepicker instantiated once in `ngAfterViewInit` with caller `minDate`/`maxDate` inputs.
- **Dialogs**: `@ngneat/dialog` for logout confirm and habit delete.

## Generated Client Layout

```
src/app/web-api/
  api.module.ts
  api-configuration.ts
  services.ts          # barrel: 6 services
  services/*.service.ts
  fn/<tag>/*.ts          # low-level request functions
  models/*.ts
```

Do not hand-edit generated files; change `swagger/api-docs.json` and run `npm run generate-api`.
