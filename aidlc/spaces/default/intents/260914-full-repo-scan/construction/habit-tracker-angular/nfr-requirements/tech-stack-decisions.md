# Tech Stack Decisions — unit `habit-tracker-angular`

Planning-only intent (FR2). **Affirm as-built lock-in** — record current stack; no upgrade decisions this intent. Source: `codekb/habit-tracker-angular/technology-stack.md`, affirmed team/project mandates.

## Runtime and framework

| ID | Decision | Version / choice | Rationale |
|----|----------|------------------|-----------|
| **NFR7.1** | Framework | Angular **^18.1.0** | Standalone components, functional interceptors |
| **NFR7.2** | Language | TypeScript (Angular 18 toolchain) | Existing codebase |
| **NFR7.3** | Change detection | **Zone.js** (default) | `provideZoneChangeDetection` in bootstrap |
| **NFR7.4** | Async | RxJS **~7.8.0** | HttpClient and store streams |

## UI and presentation

| ID | Decision | Notes |
|----|----------|-------|
| **NFR7.5** | Bootstrap **5.3.3** | Layout and nav |
| **NFR7.6** | Font Awesome Free **6.6.0** | Icons |
| **NFR7.7** | air-datepicker **3.5.3** | Track and Statistics calendars |
| **NFR7.8** | date-fns **4.1.0** | Parse/format API civil dates |
| **NFR7.9** | Component prefix **`ht`** | Team code style |

## State and API client

| ID | Decision | Notes |
|----|----------|-------|
| **NFR7.10** | **@ngneat/elf** + persist | Auth only in localStorage |
| **NFR7.11** | **UserClockStore** | In-memory `/api/me` cache — not Elf |
| **NFR7.12** | **ng-openapi-gen** **0.51.0** | Generates `src/app/web-api` from `swagger/api-docs.json` |
| **NFR7.13** | **NEVER** hand-edit `web-api/` | Regenerate via `npm run generate-api` (mandated) |

## Quality and build

| ID | Decision | Notes |
|----|----------|-------|
| **NFR7.14** | Jasmine + Karma | `npm run test:ci` — ChromeHeadless + coverage flag |
| **NFR7.15** | **@angular-devkit/build-angular** | Application builder; configs `local`, `dev`, `production` |
| **NFR7.16** | No root ESLint/Prettier | Follow existing file patterns |

## Deployment artifacts (consumer of U3)

| ID | Decision | Notes |
|----|----------|-------|
| **NFR7.17** | Docker multi-stage → **nginx** static | `ng build --configuration=production` |
| **NFR7.18** | **nginx.conf** | Serves `dist/browser`; proxies `/api/` → backend |
| **NFR7.19** | CI **build-and-test** + **build-image** on `main` | Tests green before image push (team ALWAYS) |

## Forbidden / legacy paths

| ID | Decision | Notes |
|----|----------|-------|
| **NFR7.20** | Legacy AWS S3/CloudFront workflows | Skimmed in scan; new ops via **habit-tracker-compose** |
| **NFR7.21** | Production deploy | Compose pull of `crraay/habit-tracker-angular:latest` — not in this intent |

## Follow-up evaluation triggers (non-decisions)

| ID | Trigger | Action in future intent |
|----|---------|-------------------------|
| **NFR7.22** | Major Angular LTS end | Plan upgrade with `test:ci` and regenerate API client |
| **NFR7.23** | OpenAPI drift vs UI | Regenerate client; fix breaking DTO usage |
| **NFR7.24** | Auth storage hardening | Evaluate httpOnly cookie or refresh flow vs localStorage JWT |

## Mandated cross-repo rules (inception NFR3)

| ID | Mandate | Reflected in |
|----|---------|--------------|
| **NFR7.25** | Canonical domain law | `docs/domain.md` via habit-domain rule |
| **NFR7.26** | Explicit API errors on mutations | Settings pattern; backlog elsewhere |
| **NFR7.27** | Tests green on `main` before image | **NFR7.19** |
