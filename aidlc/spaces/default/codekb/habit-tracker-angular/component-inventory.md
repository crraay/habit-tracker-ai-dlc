# Component Inventory — habit-tracker-angular

Logical UI/client blocks from this run. Headings below are the `analyzed.components` / inventory names. Health: **healthy** / **at-risk** / **skimmed**. Paths: [reverse-engineering-timestamp.md](./reverse-engineering-timestamp.md). HTTP verbs: [api-documentation.md](./api-documentation.md).

| Component | Health | Owns |
|-----------|--------|------|
| App Shell | at-risk | Routes, authenticated chrome; no settings |
| Authentication | at-risk | Login, Elf session, guards, interceptors |
| Track Habits | at-risk | List + check-in using client-clock today |
| Statistics | at-risk | Range default/max using client-clock today |
| Datepicker | at-risk | Shared calendar; options set once |
| Generated Web API Client | at-risk | OpenAPI adapters; no today/timezone ops |
| Build and Delivery | healthy | npm/Angular CLI, env, proxy, CI |
| Habit Management UI | skimmed | Edit habits CRUD |
| Shared Presentation Widgets | skimmed | Streak, counter, dialogs, etc. |

## App Shell

- **Responsibility**: `app.routes.ts`, `app.config.ts`, `AppContainerComponent`. Default redirect `/` → `track`. Nav: Track / Edit / Statistics / Logout.
- **Depends on**: Authentication (child `authGuard`), feature screens.
- **Intent**: No settings route or IANA field. Settings is greenfield chrome here.

## Authentication

- **Responsibility**: `LoginComponent`, `auth.store.ts` (Elf persist `ht_auth`), `auth.guard.ts`, `token.interceptor.ts`, `refresh-token.interceptor.ts`, `AuthService`.
- **Depends on**: Generated Web API Client (`POST /api/auth/login`).
- **Intent**: Session has no timezone/today. Login `subscribe()` is success-only. Refresh interceptor is logout-on-401 (TODO), not a date concern. Invalid-save UX has no precursor here.

## Track Habits

- **Responsibility**: `TrackHabitsComponent`, `TrackHabitItemComponent`. Seeds `currentDate` / `selectedDate` with `new Date()` (L49–50). Lists via `getTrackingList({ date: format(selectedDate, 'yyyy-MM-dd') })` (L57–59). Check-in/unmark `handleStatusChange` (L66–78) posts that formatted date.
- **Depends on**: Datepicker (`maxDate` = client `currentDate`), Generated Web API Client (`HabitTrackService`).
- **Intent**: Primary blast radius. Must consume API today for default, max, and payload. Success-only subscribe.

## Statistics

- **Responsibility**: `StatisticsComponent`. `currentDate = new Date()` (L24); ctor `startOfMonth(this.currentDate)` / `endDate = this.currentDate` (L36–37); `GET /api/statistics/{startDate}/{endDate}` with local `yyyy-MM-dd` (L44–49).
- **Depends on**: Datepicker (end picker max = client today), Generated Web API Client (`HabitStatisticsService`).
- **Intent**: Same shared clock source as Track. Unused helpers (`endOfMonth`, `add`, `onPeriodChange`) are leftover, not a 7/30 feature.

## Datepicker

- **Responsibility**: `DatepickerComponent` wrapping `air-datepicker`. Used by Track and Statistics.
- **Depends on**: Caller-supplied `Date` max/today.
- **Intent**: Options applied once in `ngAfterViewInit`. Swapping API today later will not update the widget without re-init or option update.

## Generated Web API Client

- **Responsibility**: `src/app/web-api/` (`services.ts`, per-tag services, `fn/`, `models/`, `api-configuration.ts`) generated from `swagger/api-docs.json` + `swagger/config.json`.
- **Depends on**: `HttpClient`, `environment.apiUrl`.
- **Intent**: No today/timezone operations in the snapshot. `ErrorResponse` generated but unused. Settings/today work implies new OpenAPI tag + regenerate — do not hand-edit generated files.

## Build and Delivery

- **Responsibility**: `package.json`, `angular.json`, `environments/`, `proxy.conf.json`, `.github/workflows/build-and-test.yml`, `README.md`.
- **Depends on**: npm, Angular CLI application builder.
- **Intent**: README already states the UI must not invent *today*. CI is `npm install` / `build` / `test:ci`. Deploy/image workflows were skimmed.

## Habit Management UI

Skimmed: `edit-habits/`, `edit-habit-item/`, habit-mgmt and habit-icons client fns. Habit CRUD only. Out of this intent’s change set.

## Shared Presentation Widgets

Skimmed: `icon-picker/`, `stat-habit-item/`, `streak/`, `counter/`, `separator/`, `confirm-dialog/`, `src/app/services/`, `src/app/animations/`. No IANA or today ownership found at directory granularity.
