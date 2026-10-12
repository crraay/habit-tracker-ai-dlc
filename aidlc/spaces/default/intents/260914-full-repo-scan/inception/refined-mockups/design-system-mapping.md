# Design System Mapping — habit-tracker-angular (inventory)

**Intent:** `260914-full-repo-scan` · **Approach:** Component inventory map (no separate Figma kit). Prefix **`ht`** on selectors; **Bootstrap 5** layout/utilities + **Font Awesome** icons; **Angular standalone** components.

---

## Global stack

| Layer | Implementation | Paths |
|-------|----------------|-------|
| Layout / grid | Bootstrap (`container`, `container-fluid`, `row`, `col-*`, `navbar`, `card`, `btn`) | Templates across `components/` |
| Icons | Font Awesome classes (`fa-solid`, `fa-regular`) | Shell, track date affordance, edit actions |
| Routing | Angular `Router`, `routerLink`, guards | `app.routes.ts`, `guards/` |
| Auth persistence | Elf store | `store/auth.store.ts` |
| User clock | In-memory store | `store/user-clock.store.ts` |
| API | Generated OpenAPI client | `web-api/` (do not hand-edit) |

---

## Screen → component map

| Screen / region | UI building blocks | Source paths |
|-----------------|-------------------|--------------|
| App shell — desktop top nav | `navbar`, `nav-link`, brand, Logout button | `app-container/app-container.component.html` |
| App shell — mobile top | Compact brand + logout icon link | same |
| App shell — mobile bottom nav | Icon-only `routerLink` row | same |
| Login card | `card`, `form-control`, reactive form validation | `login/` |
| Track — header | Date heading, `ht-datepicker`, calendar icon click | `track-habits/` |
| Track — separators | `ht-separator` (text TODO/DONE) | `components/separator/` |
| Track — habit row | `ht-track-habit-item` → card, `ht-counter`, `ht-streak`, hidden checkbox | `track-habit-item/` |
| Edit — habit row | `ht-edit-habit-item`, `ht-icon-picker`, icon action buttons | `edit-habit-item/`, `icon-picker/` |
| Edit — FAB | `btn btn-primary btn-lg position-fixed` | `edit-habits/` |
| Statistics — range | Two `ht-datepicker` controls | `statistics/` |
| Statistics — row | `ht-stat-habit-item`, counters, done/of | `stat-habit-item/` |
| Settings | `card`, timezone input + `datalist`, error/success text | `settings/` |
| Shared date | `ht-datepicker` | `components/datepicker/` |
| Confirm destructive | `ht-confirm-dialog` (via services) | `components/confirm-dialog/`, `services/` |
| Motion | `fadeHeightIn`, `fadeHeightOut`, `fadeIn` | `animations/` |

---

## Shared widgets (cross-screen)

| Widget | Used on | Role |
|--------|---------|------|
| `ht-datepicker` | Track, Statistics | Date selection; props `maxDate`, `isMobile`, `isInputHidden` on track |
| `ht-streak` | Track row | Visual check-in control tied to checkbox |
| `ht-counter` | Track, Edit, Statistics rows | Icon + label + numeric aggregate |
| `ht-separator` | Track | Section labels between todo/done |
| `ht-icon-picker` | Edit (create/update) | `<select>` bound to habit icon catalog |

---

## Angular Material / CDK

No broad Material theming in inventory; primary styling is Bootstrap + custom SCSS per component (e.g. `app-container.component.scss` breakpoint comments reference future Bootstrap breakpoint tokens).

---

## Design tokens (observed, not extracted)

Documented for planning reference only — **not** a mandated token file in repo.

| Token (informal) | Typical use |
|------------------|-------------|
| `shadow-sm` on cards | Habit rows, login, settings |
| `bg-light` content area | Shell main pane |
| `btn-primary` | Primary actions (login, save, create) |
| `text-danger` / `text-success` | Settings feedback |
| Purple accent `#6f42c1` | Best streak counter inline style |
| Row icon box 50×50px | Track/edit/stat habit icons |

Future intents may formalize SCSS variables; this intent records as-built patterns only.

---

## Story coverage

| Component map area | User stories |
|--------------------|--------------|
| Login | US1.1 |
| Shell nav | US1.2, US1.11 |
| Track + datepicker + row | US1.3, US1.4, US1.5, US1.6 |
| Edit + icon picker | US1.7, US1.8, US1.9 |
| Statistics | US1.10 |
| Settings | US1.3 |
| Backlog annotations | US2.1, US2.2, US2.4, US2.5 |
