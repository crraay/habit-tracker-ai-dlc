# Code Quality Assessment — habit-tracker-angular

Full-repo scan synthesis. Structure: [code-structure.md](./code-structure.md). Components: [component-inventory.md](./component-inventory.md).

## Test Coverage

- **Layout**: 22 co-located `*.spec.ts` under `src/app/` (app shell, features, guards, interceptors, stores, dialog service).
- **Runner**: Jasmine 5 + Karma 6 via `@angular-devkit/build-angular:karma`; options in `angular.json` (no standalone `karma.conf.js`).
- **CI**: `npm run test:ci` — ChromeHeadless, `--code-coverage`.
- **Depth**: Representative specs read (settings timezone save behaviour, track-habits, guards/interceptors/store). Many component specs still assert creation only.
- **Strength**: `settings.component.spec.ts` documents FR3.3 — timezone save does not refetch `today`.
- **Gap**: Track check-in error paths, login failure, and UserClockStore GET failure not locked by tests.

## Linting and Formatting

No ESLint or Prettier at repo root. Generated `web-api` disables lint locally. Style follows Angular schematics defaults (standalone, OnPush on key components).

## CI/CD

- **Deep-read**: `.github/workflows/build-and-test.yml` — reusable workflow: install, build, `test:ci`, upload `dist/browser`.
- **Skimmed**: `build-image.yml`, AWS S3/CloudFront deploy workflows.
- **Docker**: Production image builds with `npm ci` and production Angular configuration.

## Documentation Quality

| Asset | Quality |
|-------|---------|
| `README.md` | Setup, proxy, related repos |
| `AGENTS.md` / `.cursor/rules/habit-domain.mdc` | Points to backend domain doc |
| `DOCKER.md` | Image/deploy split with compose repo |
| OpenAPI snapshot | Live contract for client; includes `/api/me` |
| Inline comments | Sparse; UserClockStore documents FR3.3 |

## Technical Debt Register

| Signal | Location | Severity | Notes |
|--------|----------|----------|-------|
| Refresh token TODO | `refresh-token.interceptor.ts` | Medium | 401 clears auth; no silent renew |
| Login no error UI | `login.component.ts` | Medium | Success-only subscribe |
| Track HTTP errors ignored | `track-habits.component.ts` | Medium | Contrast with Settings |
| Filter method in template | `track-habits.component.ts` L98–101 | Low | TODO pipe; CD on events |
| Separator label `"TODO"` | `track-habits.component.html` | Low | Cosmetic |
| `debugger` comment | `edit-habit-item.component.ts` | Low | Commented out |
| Name length validation TODO | `edit-habit-item.component.ts` | Low | |
| No track `minDate` | track template + datepicker | Medium | UX may expose failing API calls |
| AuthProps vs null init | `auth.store.ts` | Low | Type looseness |
| Duplicate animation files | `src/app/animations/` | Low | Possible dead exports |
| OpenAPI vs domain fields | `HabitDto` / models | Medium | Confirm backend alignment |

## Overall Assessment

The codebase is a **maintainable brownfield Angular 18 SPA** with clear separation between generated HTTP adapters and feature components. **User-clock integration is implemented and tested at Settings level**; remaining quality debt clusters around **auth resilience**, **consistent API error UX**, and **client-side date bounds** on Track. CI/build pipeline is adequate for ongoing development. No root linter increases review burden for hand-written TypeScript.
