# Technology Stack — habit-tracker-angular

Versions from `package.json` as scanned. Runtime wiring: [dependencies.md](./dependencies.md).

## Runtime

| Technology | Version | Role |
|------------|---------|------|
| TypeScript / Angular | `^18.1.0` | SPA (router, forms, HttpClient, interceptors) |
| RxJS | `~7.8.0` | HTTP subscriptions |
| Zone.js | (Angular peer) | Change detection (standard Angular 18) |

## Libraries

| Name | Version | Purpose |
|------|---------|---------|
| `@ngneat/elf` | `^2.5.1` | Auth session store |
| `@ngneat/elf-persist-state` | `^1.2.1` | Persist `ht_auth` to `localStorage` |
| `@ngneat/dialog` | `^5.1.2` | Confirm dialogs |
| `air-datepicker` | `^3.5.3` | Calendar widget |
| `date-fns` | `^4.1.0` | `format` / `startOfMonth` on a browser `Date` (local civil calendar) |
| Bootstrap | `^5.3.3` | Layout |
| Font Awesome | `^6.6.0` | Icons |

`date-fns` is the formatting layer on top of client-clock today — not a timezone or API-today source.

## Tooling

| Name | Version / note | Purpose |
|------|----------------|---------|
| Angular CLI / `@angular-devkit/build-angular` | application builder | `ng build` / `ng test` |
| `ng-openapi-gen` | `^0.51.0` | Client codegen from `swagger/api-docs.json` |
| Jasmine + Karma | dev | Unit tests; `npm run test:ci` = ChromeHeadless + coverage |
| npm | lockfile present | Package manager |

No ESLint/Prettier config at repo root. Generated `web-api` disables tslint/eslint.
