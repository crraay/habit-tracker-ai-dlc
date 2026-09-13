## Developer Code Scan Results

Repo: `habit-tracker-angular` (npm package `habit-tracker-ui`). Brownfield Angular 18 SPA. Domain *today* is not implemented here; the checked-in OpenAPI snapshot and generated client also have no `today` or timezone surface.

### Scan Coverage
- **Analyzed deeply**:
  - `src/app/components/track-habits/`
  - `src/app/components/track-habit-item/`
  - `src/app/components/statistics/`
  - `src/app/components/datepicker/`
  - `src/app/components/app-container/`
  - `src/app/components/login/`
  - `src/app/app.routes.ts`
  - `src/app/app.config.ts`
  - `src/app/store/auth.store.ts`
  - `src/app/guards/auth.guard.ts`
  - `src/app/interceptors/token.interceptor.ts`
  - `src/app/interceptors/refresh-token.interceptor.ts`
  - `src/app/web-api/services.ts`
  - `src/app/web-api/services/habit-track.service.ts`
  - `src/app/web-api/services/habit-statistics.service.ts`
  - `src/app/web-api/services/auth.service.ts`
  - `src/app/web-api/fn/habit-track/`
  - `src/app/web-api/fn/habit-statistics/get-aggregated-data.ts`
  - `src/app/web-api/models/`
  - `src/app/web-api/api-configuration.ts`
  - `swagger/api-docs.json`
  - `swagger/config.json`
  - `package.json`
  - `angular.json`
  - `environments/`
  - `proxy.conf.json`
  - `.github/workflows/build-and-test.yml`
  - `README.md`
- **Skimmed only**:
  - `src/app/components/edit-habits/`
  - `src/app/components/edit-habit-item/`
  - `src/app/components/icon-picker/`
  - `src/app/components/stat-habit-item/`
  - `src/app/components/streak/`
  - `src/app/components/counter/`
  - `src/app/components/separator/`
  - `src/app/components/confirm-dialog/`
  - `src/app/services/`
  - `src/app/animations/`
  - `src/app/web-api/fn/habit-mgmt/`
  - `src/app/web-api/fn/auth/`
  - `src/app/web-api/fn/habit-icons/`
  - remaining `*.spec.ts`
  - `.github/workflows/` deploy/image jobs
  - `DOCKER.md`, `AGENTS.md`

### Packages Found
- `habit-tracker-ui` — application — TypeScript/Angular 18 — Habit Tracker frontend (standalone components, prefix `ht`)
- `src/app/web-api/` — generated HTTP client — TypeScript — `ng-openapi-gen` output from `swagger/api-docs.json` (tags: auth, habit-mgmt, habit-track, habit-statistics, habit-icons)

### Build System
- **Type**: npm + Angular CLI (`@angular-devkit/build-angular:application`)
- **Config Files**: `package.json`, `package-lock.json`, `angular.json`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.spec.json`, `proxy.conf.json`, `environments/environment*.ts`, `swagger/config.json`
- **Build Dependencies**: app → generated `web-api` → `HttpClient` + `environment.apiUrl` (dev: `''` + proxy `/api` → `localhost:8080`); no workspace-internal packages

### APIs Discovered
- REST consumer (generated) — `src/app/web-api/` — 5 services / 10 operations:
  - `POST /api/auth/login` — `AuthService.login`
  - `GET|POST|PUT|DELETE /api/habit` (+ `/{id}`) — `HabitMgmtService`
  - `GET /api/habit-track/{date}` — `HabitTrackService.getTrackingList` (date is a required path param; no “omit for today”)
  - `POST|DELETE /api/habit-track` — `trackHabit` / `untrackHabit` (body: `{ date, habitId }`)
  - `GET /api/statistics/{startDate}/{endDate}` — `HabitStatisticsService.getAggregatedData`
  - `GET /api/habit-icons` — `HabitIconsService`
- Checked-in OpenAPI (`swagger/api-docs.json`) has **no** `/today`, user-settings, or timezone path. `ErrorResponse` is generated (`correlationId`, `error`, `message`, …) and unused by UI.
- Auth: JWT in Elf store persisted to `localStorage` (`ht_auth`). Session holds `username` / `token` / `tokenExpiresIn` only — no timezone, no today.

### Frameworks & Libraries
- Angular — `^18.1.0` — SPA (router, forms, HttpClient interceptors)
- RxJS — `~7.8.0` — HTTP subscriptions
- `@ngneat/elf` + `elf-persist-state` — `^2.5.1` / `^1.2.1` — auth session
- `@ngneat/dialog` — `^5.1.2` — confirm dialogs
- `air-datepicker` — `^3.5.3` — calendar widget
- `date-fns` — `^4.1.0` — `format` / `startOfMonth` (local calendar of a `Date`)
- Bootstrap — `^5.3.3` — layout
- Font Awesome — `^6.6.0` — icons
- `ng-openapi-gen` — `^0.51.0` — client codegen
- Jasmine + Karma — test runner (dev)

### Test Coverage
- **Test Directories**: co-located `*.spec.ts` under `src/app/` (21 spec files)
- **Test Frameworks**: Jasmine + Karma (`ng test` / `npm run test:ci` — ChromeHeadless + coverage)
- **Coverage Config**: Karma coverage enabled in `test:ci`; no separate coverage thresholds file
- Track / statistics specs only assert `should create`. They do not lock `new Date()`, date formatting, or API-error display.

### Code Quality Indicators
- **Linting**: no ESLint/Prettier config in repo root; generated `web-api` disables tslint/eslint
- **CI/CD**: `.github/workflows/build-and-test.yml` (`npm install`, `build`, `test:ci`); image/S3 deploy workflows present
- **Documentation**: `README.md` states the UI must not invent *today*; `AGENTS.md` points at sibling `docs/domain.md`. Component comments are sparse.

### Technical Debt Signals
- Domain *today* is the browser clock: `new Date()` in `TrackHabitsComponent` constructor (L49–50) and `StatisticsComponent` field/ctor (L24, L36–37). Both format that `Date` with `date-fns` `format(..., 'yyyy-MM-dd')` (local TZ) for list/check-in/range APIs.
- Track datepicker `maxDate` is that client `currentDate` (`track-habits.component.html` L10); statistics end picker same (`statistics.component.html` L18). Air Datepicker options are applied once in `ngAfterViewInit` — a later swap of max/today will not update the widget without re-init.
- No settings route or component. Shell nav is Track / Edit / Statistics / Logout only (`app.routes.ts`, `app-container.component.html`). No IANA timezone field anywhere in `src/` or the checked-in swagger.
- Check-in (`handleStatusChange`) and login `subscribe()` have no error path. `ErrorResponse` is never bound to UI. Invalid timezone save (when added) has no existing error-surface pattern.
- Refresh interceptor is logout-on-401 (`refresh-token.interceptor.ts` L17 TODO); not a date concern.
- Track still uses `status` on `HabitTrackResponse` (out of this package: rename status→done).
- Unused statistics helpers (`endOfMonth`, `add`, `onPeriodChange`); track `applyFilterByStatus` marked TODO-pipe.

## Handoff Summary
- **Intent-relevant finding**: Track, statistics, and check-in all treat the client clock as domain today. Track sets `currentDate` / `selectedDate` with `new Date()` (`src/app/components/track-habits/track-habits.component.ts` L49–50), lists via `getTrackingList({ date: format(selectedDate, 'yyyy-MM-dd') })` (L57–59), and check-in/unmark posts that same formatted date (`handleStatusChange` L66–78). Statistics seeds the range with `new Date()` and `startOfMonth(this.currentDate)` (`statistics.component.ts` L24, L36–37) and calls `GET /api/statistics/{startDate}/{endDate}` with `date-fns` local `yyyy-MM-dd` (L44–49). Generated client + `swagger/api-docs.json` have no today or timezone operation; settings UI is absent (no route, no field). API errors are not surfaced (`ErrorResponse` unused; track/login subscribe success-only).
- **Risks / follow-up**: (1) Introducing API today requires a shared clock source consumed by track default/max, statistics default/max, and check-in payload — plus datepicker re-init or option update. (2) Settings (IANA view/change, UTC-backfill still editable, do not hide field) is greenfield UI + likely new OpenAPI tag/regenerate of `web-api`. (3) Invalid save must add the first real API-error surface. (4) Do not expand this package into check-in window, streak, pause/archive, statistics 7/30, or status→done. (5) Domain law stays in sibling `habit-tracker-springboot/docs/domain.md`.
