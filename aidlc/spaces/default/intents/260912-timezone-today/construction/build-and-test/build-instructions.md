# Build instructions — timezone-today

Zero-Unit `poc`. Application builds live in the sibling repos. No Compose change in this package.

## Environment

### habit-tracker-springboot

- JDK 17, Maven Wrapper (`mvnw.cmd` / `./mvnw`)
- Test profile does not need PostgreSQL (H2, Flyway off)
- A production-shaped `package` still compiles against `application.properties`; JWT and CORS are required at **runtime**, not to compile

Working directory: `c:\Projects\habit-tracker\habit-tracker-springboot`

### habit-tracker-angular

- Node.js + npm, existing `node_modules`
- Working directory: `c:\Projects\habit-tracker\habit-tracker-angular`

## Build commands

Backend (compile, test, jar):

```text
mvnw.cmd -f pom.xml package
```

Frontend:

```text
npx ng build
```

`npm run generate-api` is not a build step here; Code Generation already regenerated `src/app/web-api/` from `swagger/api-docs.json`.

## Verification

- Backend: `BUILD SUCCESS`, tests green, jar under `target/`
- Frontend: `ng build` exit 0, output under `dist/`

## Troubleshooting

- PowerShell: quote Maven `-Dtest=...` as `"-Dtest=..."`.
- Angular Karma needs Chrome/ChromeHeadless for tests; the production build does not.
- Do not enable Flyway on the test profile to make FR5.1 pass; JPA `nullable = false` is the test-profile lock.
