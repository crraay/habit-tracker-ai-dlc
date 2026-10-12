# Frontend components — unit `habit-tracker-angular`

Component hierarchy and integration points for Bolt **F2** reference (as-built, planning-only).

## Logical block mapping

| Domain-design block | Primary Angular artifacts |
|---------------------|---------------------------|
| SpaAppShell | `AppContainerComponent`, `app.routes.ts` |
| SpaAuthentication | `LoginComponent`, `AuthStore`, guards |
| SpaUserClock | `UserClockStore`, `SettingsComponent` |
| SpaTrackHabits | `TrackHabitsComponent`, `TrackHabitItemComponent` |
| SpaHabitManagementUI | `EditHabitsComponent`, `EditHabitItemComponent`, `IconPickerComponent` |
| SpaStatistics | `StatisticsComponent`, `StatHabitItemComponent` |
| SpaSharedPresentation | interceptors, `DatepickerComponent`, `ConfirmDialogComponent`, `DialogService`, animations |

## Component tree

```
AppComponent
└── Router outlet
    ├── LoginComponent (/login)
    └── AppContainerComponent (shell, authGuard children)
        ├── TrackHabitsComponent (/track)
        │   ├── DatepickerComponent
        │   └── TrackHabitItemComponent (× N)
        │       └── StreakComponent (display)
        ├── EditHabitsComponent (/edit)
        │   └── EditHabitItemComponent (× N)
        │       └── IconPickerComponent
        ├── StatisticsComponent (/statistics)
        │   ├── DatepickerComponent (range)
        │   └── StatHabitItemComponent (× N)
        └── SettingsComponent (/settings)
```

## State and services

| Concern | Mechanism | Persistence |
|---------|-----------|-------------|
| Auth session | `AuthStore` (Elf) | `localStorage` key `ht_auth` |
| User clock | `UserClockStore` | In-memory; `/api/me` via generated client |
| HTTP auth | `token.interceptor`, `refresh-token.interceptor` | N/A |
| Dialogs | `DialogService` + `ConfirmDialogComponent` | N/A |

## Key component contracts

### LoginComponent

- **Inputs/outputs:** Form username/password; navigates on success.
- **API:** `AuthService.login` (generated).
- **Validation:** Required fields; **error UX gap** (no template error from ErrorResponse — backlog BR9.1).

### TrackHabitsComponent

- **State:** `currentDate` from `UserClockStore`; habit rows with done flag.
- **API:** `HabitTrackService.getTrackingList`, `trackHabit`, `untrackHabit`.
- **Datepicker:** `maxDate` = server today; no `minDate` (backlog BR9.2).

### SettingsComponent

- **State:** Reactive form timezone; `errorMessage`, `saveSuccess`.
- **API:** `UserClockService.updateMe`.
- **Pattern reference:** explicit `HttpErrorResponse` handling (BR3.2) — team template for other mutations.

### EditHabitsComponent / EditHabitItemComponent

- **API:** `HabitMgmtService` CRUD; `HabitIconsService.getAll` for picker.
- **Interactions:** Confirm delete via dialog service.

### StatisticsComponent

- **State:** `startDate`, `endDate` derived from clock today defaults.
- **API:** `HabitStatisticsService.getAggregatedData`.

### Generated client (`src/app/web-api/`)

- **Ownership:** Tool-generated from OpenAPI; regenerate only.
- **Configuration:** `ApiConfiguration` / `environment.apiUrl` (empty → same-origin `/api`).

## Routing summary

| Path | Component | Guards |
|------|-----------|--------|
| `/login` | LoginComponent | noAuthGuard |
| `/track` | TrackHabitsComponent | authGuard (child) |
| `/edit` | EditHabitsComponent | authGuard |
| `/statistics` | StatisticsComponent | authGuard |
| `/settings` | SettingsComponent | authGuard |
| `/` | redirect → `/track` | authGuard |

## Styling and framework conventions

- Standalone components; selector prefix `ht`.
- OnPush on heavy screens (Settings, Track, Statistics pattern).
- Angular Material usage per existing feature modules/templates.
