# Code Quality Assessment — habit-tracker-angular

Debt that matters to `timezone-today` is listed once here. Structure and owners: [code-structure.md](./code-structure.md), [component-inventory.md](./component-inventory.md).

## Test Coverage

- **Layout**: 21 co-located `*.spec.ts` files under `src/app/`; Jasmine + Karma.
- **CI command**: `npm run test:ci` (ChromeHeadless + Karma coverage). No separate coverage-thresholds file.
- **Intent gap**: Track and Statistics specs only assert `should create`. They do not lock `new Date()`, date formatting, datepicker max, or API-error display. New today/timezone behaviour will need the first real tests on those paths.

## Linting

No ESLint or Prettier config in the repo root. Generated `web-api` disables tslint/eslint. Style is convention-by-example.

## CI/CD

Deep-read: `.github/workflows/build-and-test.yml` (`npm install`, `build`, `test:ci`). Deploy/image/S3 jobs under `.github/workflows/` were skimmed only. This repo does not own production Compose (sibling `habit-tracker-compose`).

## Documentation Quality

- `README.md` (deep): UI must not invent *today*.
- `AGENTS.md` (skim): points at sibling `docs/domain.md`.
- Component comments are sparse. Generated client is the live HTTP document; the snapshot has no today/timezone prose because those operations are absent.

## Technical Debt

| Signal | Location | Risk for this intent |
|--------|----------|----------------------|
| Client clock as domain today | Track ctor L49–50; Statistics L24, L36–37 | Core defect of issue 14 |
| Datepicker options one-shot | `ngAfterViewInit` | API today swap will look like a no-op unless re-inited |
| No settings surface | Routes + app-container nav | Greenfield IANA view/change |
| No error UI | Track/login `subscribe`; unused `ErrorResponse` | Invalid timezone save has no pattern to reuse |
| `status` on track response | `HabitTrackResponse` | Out of package — do not rename here |
| Unused statistics helpers | `endOfMonth`, `add`, `onPeriodChange` | Do not interpret as 7/30 scope |
| Track `applyFilterByStatus` TODO-pipe | Track Habits | Unrelated leftover |
| Refresh = logout on 401 | `refresh-token.interceptor.ts` L17 TODO | Not a date concern |

Documentation and CI are adequate for a brownfield POC. Test lock-in around today and errors is **absent** — treat that as the quality risk, not coverage percentage.
