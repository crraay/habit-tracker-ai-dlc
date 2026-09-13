# Dependencies — habit-tracker-angular

Package versions are listed once in [technology-stack.md](./technology-stack.md). This file is the coupling map.

## External Dependencies

| From | To | How | Failure behaviour (observed) |
|------|----|-----|------------------------------|
| App | Spring Boot API | Generated HttpClient; proxy `/api` in dev | Track/login ignore HTTP errors; 401 interceptor logs the user out |
| Track / Statistics | `date-fns` | `format`, `startOfMonth` | Local timezone of `new Date()` becomes the civil date string |
| Track / Statistics | `air-datepicker` (via Datepicker) | Widget max/today | Stale max if today is replaced after `ngAfterViewInit` |
| Authentication | Elf + `localStorage` | Persist `ht_auth` | No timezone/today fields |
| UI | Bootstrap / Font Awesome | Layout and icons | Presentation only |

No workspace-internal npm packages. Build graph: **app → generated `web-api` → HttpClient + `environment.apiUrl`**.

## Internal Dependencies

Acyclic feature graph (deep-read):

```
App Shell → Authentication
App Shell → Track Habits → Datepicker
App Shell → Track Habits → Generated Web API Client (habit-track)
App Shell → Statistics → Datepicker
App Shell → Statistics → Generated Web API Client (habit-statistics)
Authentication → Generated Web API Client (auth)
Generated Web API Client → environments / api-configuration
```

Skimmed edges (not verified deeply): App Shell → Habit Management UI → Generated Web API Client (habit-mgmt, habit-icons); widgets imported by Track/Statistics (`SeparatorComponent`, `StatHabitItemComponent`).

**Coupling hotspot for this intent:** Track Habits, Statistics, and Datepicker all assume a caller-owned `Date` that is currently the browser clock. There is no shared “API today” injectable. Adding one is a new internal dependency those three must share; Habit Management UI should not need it.
