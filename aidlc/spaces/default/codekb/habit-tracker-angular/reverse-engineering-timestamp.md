# Reverse Engineering Timestamp — habit-tracker-angular

## Reverse Engineering Run

- **When**: 2026-09-12 (architect synthesis; NO_STORE / first scan)
- **Repo**: `habit-tracker-angular` (npm name `habit-tracker-ui`)
- **Intent**: `timezone-today`
- **Kind**: `partial` — developer did not deeply cover the whole repo
- **Commit**: `b787a1679448a3b5cd891c0d30c9c8af2d81cf99` (`refs/heads/main` as read at synthesis time)
- **Fingerprint**: `unknown` (mint over analyzed paths was not computable)
- **Handoff**: `inception/reverse-engineering/developer-scan-habit-tracker-angular.md`

## Sources

Developer Scan Coverage is the only verified deep set. Co-located spec files outside that set, and deploy/image workflow jobs, were skimmed; they are not listed with globs. Sibling domain law was not scanned (correct — it is not in this repo).

## Scope of Analysis

```yaml
scope_version: 1
kind: partial
intent: timezone-today
fingerprint: unknown
analyzed:
  paths:
    - src/app/components/track-habits/
    - src/app/components/track-habit-item/
    - src/app/components/statistics/
    - src/app/components/datepicker/
    - src/app/components/app-container/
    - src/app/components/login/
    - src/app/app.routes.ts
    - src/app/app.config.ts
    - src/app/store/auth.store.ts
    - src/app/guards/auth.guard.ts
    - src/app/interceptors/token.interceptor.ts
    - src/app/interceptors/refresh-token.interceptor.ts
    - src/app/web-api/services.ts
    - src/app/web-api/services/habit-track.service.ts
    - src/app/web-api/services/habit-statistics.service.ts
    - src/app/web-api/services/auth.service.ts
    - src/app/web-api/fn/habit-track/
    - src/app/web-api/fn/habit-statistics/get-aggregated-data.ts
    - src/app/web-api/models/
    - src/app/web-api/api-configuration.ts
    - swagger/api-docs.json
    - swagger/config.json
    - package.json
    - angular.json
    - environments/
    - proxy.conf.json
    - .github/workflows/build-and-test.yml
    - README.md
  components:
    - App Shell
    - Authentication
    - Track Habits
    - Statistics
    - Datepicker
    - Generated Web API Client
    - Build and Delivery
shallow:
  paths:
    - src/app/components/edit-habits/
    - src/app/components/edit-habit-item/
    - src/app/components/icon-picker/
    - src/app/components/stat-habit-item/
    - src/app/components/streak/
    - src/app/components/counter/
    - src/app/components/separator/
    - src/app/components/confirm-dialog/
    - src/app/services/
    - src/app/animations/
    - src/app/web-api/fn/habit-mgmt/
    - src/app/web-api/fn/auth/
    - src/app/web-api/fn/habit-icons/
    - DOCKER.md
    - AGENTS.md
```
