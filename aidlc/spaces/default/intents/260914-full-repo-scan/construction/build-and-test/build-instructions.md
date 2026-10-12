# Build instructions — full-repo-scan

Intent `260914-full-repo-scan` · **FR2 planning-only.** Builds validate **as-built** sibling repos; this intent does not merge application changes.

## Environment

### habit-tracker-springboot (U1)

- JDK **17**, Maven (wrapper optional)
- Working directory: `habit-tracker-springboot/` (sibling under AI-DLC workspace)
- Unit tests use H2 test profile; PostgreSQL not required for `mvn test`

### habit-tracker-angular (U2)

- Node.js + npm; run `npm install` if `node_modules` is missing
- Working directory: `habit-tracker-angular/`
- Karma/ChromeHeadless required for `npm run test:ci`

### habit-tracker-compose (U3)

- No compile step in this intent; production compose **pulls** Hub images (see U3 code-summary)
- Local override builds are documented in compose `DOCKER.md` — optional, not required for this stage

## Build commands

Backend compile + test:

```powershell
cd habit-tracker-springboot
mvn -B test
```

Optional package (compile verification without pushing images):

```powershell
mvn -B package -DskipTests
```

Frontend production bundle:

```powershell
cd habit-tracker-angular
npm run build
```

Frontend CI test suite (includes coverage flag):

```powershell
npm run test:ci
```

## Verification

- Backend: Maven reports `Tests run: N, Failures: 0`
- Frontend: Karma `TOTAL: N SUCCESS`; build exits 0
- No Docker image publish or compose deploy from this intent

## Troubleshooting

- **Angular:** `Could not find ... karma builder` → run `npm install` in `habit-tracker-angular`
- **PowerShell:** use `;` instead of `&&` between `cd` and Maven/npm commands
- **Slow first Spring context:** `@SpringBootTest` startup is normal; full suite ~1–2 minutes locally
