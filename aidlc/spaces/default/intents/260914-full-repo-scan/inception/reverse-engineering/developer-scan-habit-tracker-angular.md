## Developer Code Scan Results

**Repo:** habit-tracker-angular  
**Scan commit:** `e4cfc226d27c7f17d5c87908deb919a0385581e2`  
**Architecture:** Single Angular 18 standalone SPA; backend is system of record (Spring Boot). Client uses OpenAPI-generated HTTP layer, Elf-backed auth persistence, in-memory user-clock cache, functional HTTP interceptors, and route guards.

### Scan Coverage
- **Analyzed deeply**:
  - `./package.json`
  - `./angular.json`
  - `./tsconfig.json`
  - `./tsconfig.app.json`
  - `./tsconfig.spec.json`
  - `./proxy.conf.json`
  - `./environments/`
  - `./README.md`
  - `./AGENTS.md`
  - `./DOCKER.md`
  - `./Dockerfile`
  - `./nginx.conf`
  - `./swagger/config.json`
  - `./swagger/api-docs.json`
  - `./.github/workflows/build-and-test.yml`
  - `./src/main.ts`
  - `./src/index.html`
  - `./src/styles.scss`
  - `./src/app/app.component.ts`
  - `./src/app/app.config.ts`
  - `./src/app/app.routes.ts`
  - `./src/app/store/`
  - `./src/app/services/`
  - `./src/app/interceptors/`
  - `./src/app/guards/`
  - `./src/app/web-api/` (services, models, api module; fn/* treated as generated glue)
  - `./src/app/components/` (all feature and shell components)
  - `./src/app/animations/` (barrel imports and trigger usage; not every animation file line-by-line)
- **Skimmed only**:
  - `./.github/workflows/deploy-to-aws-s3.yml`
  - `./.github/workflows/deploy-to-aws-s3-with-cloudfront.yml`
  - `./.github/workflows/build-image.yml`
  - `./public/` (favicon manifest only)
  - `./package-lock.json` (presence and npm ci usage in Docker/CI; no dependency audit)
  - Individual `*.spec.ts` bodies beyond representative samples (settings, track-habits, guards/interceptors/store)
  - `./.cursor/` (Cursor agent rules; not application runtime)

### Packages Found
- **habit-tracker-ui** — application — TypeScript — Angular SPA for habit tracking (login, daily track, CRUD habits, statistics, timezone settings)

### Build System
- **Type**: npm + Angular CLI (`@angular-devkit/build-angular` application builder)
- **Config Files**: `package.json`, `angular.json`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.spec.json`, `proxy.conf.json`, `environments/environment*.ts`, `Dockerfile`, `nginx.conf`
- **Build Dependencies**: npm install/ci → `ng build` (configurations: `production`, `dev`, `local`; default build config `dev`, default serve config `local`). Production Docker image runs `ng build --configuration=production`. Path alias `@webapi/*` → `src/app/web-api/*`. OpenAPI client regeneration: `npm run generate-api` (`ng-openapi-gen` from `./swagger/api-docs.json`).

### APIs Discovered
- **REST (OpenAPI / consumed client)** — `swagger/api-docs.json` + `src/app/web-api/` — **8 path templates, 13 operations**:
  - `POST /api/auth/login` (auth)
  - `GET|POST /api/habit`, `GET|PUT|DELETE /api/habit/{id}` (habit-mgmt)
  - `POST /api/habit-track`, `DELETE` untrack via generated client, `GET /api/habit-track/{date}` (habit-track)
  - `GET /api/statistics/{startDate}/{endDate}` (habit-statistics)
  - `GET /api/habit-icons` (habit-icons)
  - `GET|PUT /api/me` (user-clock: timezone + server `today`)
- **Runtime routing**: Dev proxy `proxy.conf.json` forwards `/api` → `http://localhost:8080`; production nginx proxies `/api/` → `http://backend:8080`; `environment.apiUrl` is empty string (same-origin relative URLs).

### Frameworks & Libraries
- **Angular** — ^18.1.0 — standalone components, `bootstrapApplication`, `provideRouter`, `provideHttpClient`, OnPush default via schematics
- **RxJS** — ~7.8.0 — HTTP and dialog flows
- **@ngneat/elf** — ^2.5.1 — auth state store
- **@ngneat/elf-persist-state** — ^1.2.1 — localStorage persistence for auth
- **@ngneat/dialog** — ^5.1.2 — confirm dialogs (logout, delete habit)
- **Bootstrap** — ^5.3.3 — layout/utilities
- **@fortawesome/fontawesome-free** — ^6.6.0 — icons
- **air-datepicker** — ^3.5.3 — date selection on track/statistics screens
- **date-fns** — ^4.1.0 — ISO date parsing/formatting aligned with API `yyyy-MM-dd`
- **ng-openapi-gen** — ^0.51.0 (dev) — generates `src/app/web-api`
- **Karma + Jasmine** — test runner (via `@angular-devkit/build-angular:karma`)

### Test Coverage
- **Test Directories**: Co-located `*.spec.ts` under `src/app/` (22 spec files: app shell, all major components, guards, interceptors, auth store, dialog service)
- **Test Frameworks**: Jasmine 5, Karma 6, `@angular/core/testing` (`TestBed`, standalone component imports)
- **Coverage Config**: `npm run test:ci` enables `--code-coverage` with ChromeHeadless; no standalone `karma.conf.js` in repo (options embedded in `angular.json`). No ESLint/Prettier project config found.

### Code Quality Indicators
- **Linting**: None configured at repo root (generated web-api files carry `eslint-disable` comments only)
- **CI/CD**: `.github/workflows/build-and-test.yml` (reusable: install, build, `test:ci`, artifact `dist/browser`); `build-image.yml` (Docker publish); AWS S3/CloudFront deploy workflows present
- **Documentation**: README (setup, proxy, related repos), AGENTS.md and `.cursor/rules/habit-domain.mdc` point to backend `docs/domain.md` as canonical law; DOCKER.md describes image/deploy split with compose repo

### Technical Debt Signals
- `refresh-token.interceptor.ts` — explicit TODO: 401 clears auth and navigates to login; no refresh-token flow (`// TODO replace it with refresh token logic`, lines 17–19)
- `track-habits.component.ts` — `applyFilterByStatus` marked TODO to become a pipe (lines 98–101); template calls method repeatedly (change-detection cost on OnPush still triggers from events)
- `track-habits.component.html` — separator label hardcoded `"TODO"` (line 19–22)
- `edit-habit-item.component.ts` — commented `debugger`; TODO for name length validation (lines 51–56)
- Track screen datepicker sets `[maxDate]="currentDate"` but **no `minDate`** — UI allows picking dates before “yesterday” window; domain rule deferred to API (per AGENTS.md) but UX may expose failing actions
- `AuthStore` types `username`/`token` as nullable in practice but `AuthProps` declares `string` without `| null` — loose typing
- Duplicate/unused animation modules under `src/app/animations/` (triggers re-exported from `triggers/` subfolder; legacy top-level animation files may be dead code — not fully traced)
- Login flow has no visible error handling on failed credentials (subscribe success-only in `login.component.ts`)
- Habit DTO / OpenAPI models omit habit lifecycle fields (pause/archive/state) visible in backend domain doc — UI may be v1-simplified or lagging contract

## Handoff Summary
- **Intent-relevant finding**: The Angular frontend is a brownfield **Angular 18 standalone SPA** with a generated OpenAPI client covering all backend tags including **user-clock** (`GET/PUT /api/me`). User “today” and timezone drive track/statistics defaults via `UserClockStore` (`src/app/store/user-clock.store.ts`, e.g. `getClock()` and `applyTimezoneUpdate()` at lines 17–38); settings tests assert timezone save does not refetch today (`settings.component.spec.ts`, lines 65–71). This aligns the UI with server-authoritative calendar boundaries for the full-repo scan’s timezone/today theme.
- **Risks / follow-up**: Architect should map UI routes/components to backend domain concepts (check-in window, pause/archive) and note gaps: no client-side `minDate` on track datepicker, no refresh-token handling, OpenAPI `HabitDto` minimal fields. Confirm whether `swagger/api-docs.json` in this repo matches current Spring Boot contract before CodeKB API documentation. None blocking for scan completion.
