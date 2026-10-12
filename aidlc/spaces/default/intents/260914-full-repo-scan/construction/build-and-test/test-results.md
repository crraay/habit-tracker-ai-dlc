# Test results — full-repo-scan

Intent `260914-full-repo-scan` · FR2 planning-only · executed **2026-10-08** on developer workstation (Windows).

## Build status

| Repo | Command | Exit | Summary |
|------|---------|------|---------|
| habit-tracker-springboot | `mvn -B test` | 0 | Tests run: **11**, Failures: 0, Errors: 0, Skipped: 0 |
| habit-tracker-angular | `npm install` then `npm run test:ci` | 0 | **TOTAL: 29 SUCCESS** (Chrome Headless) |
| habit-tracker-compose | _(none)_ | — | No automated tests in repo |

## Coverage (informational)

Angular `test:ci` coverage summary:

- Statements 32.2% (181/562)
- Lines 32.48% (179/551)

Team posture: **no enforced floor**; org classic 80% noted as awareness only (Q4-A).

## Failure details

None on executed commands.

## Notes

- First Angular run failed with missing `@angular-devkit/build-angular:karma` until `npm install` completed (~1196 packages).
- Karma logged `Unable to convert value "undefined" to Date object` during run; all 29 tests still passed (pre-existing noise).
- No application source files were modified by this intent's Construction stages.

## Target Verification Matrix (executed rows)

See `build-and-test-summary.md` for full matrix; executed evidence:

- **T-SUITE-BACKEND:** Maven summary line above
- **T-SUITE-ANGULAR:** `TOTAL: 29 SUCCESS`
- **T-SEC-JWT:** included in `UserClockControllerTest` within backend suite
