# Unit test instructions — `habit-tracker-angular` (U2)

Intent `260914-full-repo-scan` · **FR2:** this intent does not add or modify tests in the product repo; these instructions document how to **verify the existing U2 suite** (baseline for Build and Test / follow-up F2).

## Framework

- **Angular** (standalone components), **Karma/Jasmine**, **ChromeHeadless** via `npm run test:ci`.
- Co-located `*.spec.ts`; prefer behaviour-named specs (Settings timezone save pattern) over scaffold-only “should create” tests for new work.
- **No enforced coverage floor** in CI today; gate = tests green on `main` (team.md).

## Unit-scoped run command (frontend repo root)

From `habit-tracker-angular/` (sibling clone under workspace):

```bash
npm run test:ci
```

Focused examples (adjust paths to match repo):

```bash
npm run test -- --include=**/settings/**/*.spec.ts
npm run test -- --include=**/auth/**/*.spec.ts
```

On Windows PowerShell from AI-DLC workspace:

```powershell
cd habit-tracker-angular; npm run test:ci
```

## Prerequisites

- Node.js version per repo `package.json` / CI.
- `npm ci` or `npm install` before first run.
- ChromeHeadless available (CI uses configured browser; local may use default Karma browser).

## Coverage expectations (follow-up F2)

| Area | As-built | Follow-up |
|------|----------|-----------|
| Settings timezone save | Behaviour spec exists | Extend error paths |
| Login failures | Sparse explicit UX tests | US2.5 error messaging |
| Track / untrack mutations | Partial | HTTP error handling like Settings |
| Auth interceptors (401) | Implicit via app tests | Dedicated interceptor specs |
| Generated `web-api/` | Not unit-tested directly | Test consumers, not generated files |

Standard strategy (5–8 tests per **new or touched** component) applies in **follow-up intents**, not in this FR2 pass.

## Mocking / data

- Use `HttpClientTestingModule` / `provideHttpClientTesting()` patterns from existing specs.
- Do not hand-edit `src/app/web-api/` (project ALWAYS — regenerate from OpenAPI).
- Mock `/api/me` and habit APIs consistently with C1 contract shapes.

## CI alignment note

Production **`build-image`** on `main` should run **`npm run test:ci`** before push (team.md). Fixing gaps is **follow-up F2**, not this intent.
