# Technology Stack — habit-tracker-angular

Versions from `package.json` at scan commit `e4cfc226`. Coupling detail: [dependencies.md](./dependencies.md).

## Runtime

| Technology | Version | Role |
|------------|---------|------|
| Angular | `^18.1.0` | SPA framework (standalone, router, forms, HttpClient) |
| TypeScript | (Angular 18 toolchain) | Application language |
| RxJS | `~7.8.0` | HTTP and async streams |
| Zone.js | Angular peer | Default change detection (`provideZoneChangeDetection`) |

## UI Libraries

| Name | Version | Purpose |
|------|---------|---------|
| Bootstrap | `^5.3.3` | Layout, nav, utilities |
| `@fortawesome/fontawesome-free` | `^6.6.0` | Icons |
| `air-datepicker` | `^3.5.3` | Calendar widget (Track, Statistics) |
| `date-fns` | `^4.1.0` | Parse/format civil dates for API |

## State and UX

| Name | Version | Purpose |
|------|---------|---------|
| `@ngneat/elf` | `^2.5.1` | Auth store |
| `@ngneat/elf-persist-state` | `^1.2.1` | Persist JWT to `localStorage` |
| `@ngneat/dialog` | `^5.1.2` | Modal confirm flows |

User clock state is **not** Elf — custom injectable in-memory cache.

## API Client

| Name | Version | Purpose |
|------|---------|---------|
| `ng-openapi-gen` | `^0.51.0` (dev) | Generates `src/app/web-api` from `swagger/api-docs.json` |

## Tooling and Quality

| Name | Note | Purpose |
|------|------|---------|
| `@angular-devkit/build-angular` | application builder | `ng build`, `ng test` |
| Jasmine + Karma | dev deps | Unit tests; `npm run test:ci` = ChromeHeadless + coverage |
| npm | `package-lock.json` | Install/ci in Docker and GitHub Actions |

No ESLint or Prettier configuration at repo root. Generated `web-api` files disable lint rules locally.

## Build Configurations

| Configuration | Use |
|---------------|-----|
| `local` | Default `ng serve` + `proxy.conf.json` |
| `dev` | Default `ng build` in angular.json |
| `production` | Docker image build; `enableProdMode()` in `app.config.ts` |

## Deployment Artifacts

- **Dockerfile**: multi-stage npm ci + `ng build --configuration=production` → nginx image
- **nginx.conf**: static `dist/browser` + reverse proxy `/api/` → `http://backend:8080`
- **CI**: `.github/workflows/build-and-test.yml` (install, build, `test:ci`, artifact dist)

AWS S3/CloudFront and `build-image.yml` workflows present but skimmed only in developer scan.
