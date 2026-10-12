# Refined Mockups — Habit Tracker Angular SPA (as-built)

**Intent:** `260914-full-repo-scan` · **Sources:** CodeKB `habit-tracker-angular`, live templates under `habit-tracker-angular/src/app/components/` · **Planning only** — FR2 forbids application merges from this intent.

**Fidelity:** As-built layouts matching shipped UI, plus **annotated backlog** panels for US2.x UX not in repo today (marked `[Backlog — not shipped]`).

**Responsive split:** Bootstrap-style **992px** — `d-lg-none` / `d-none d-lg-flex` in `app-container.component.html` and SCSS `@media (min-width: 992px)` / `(max-width: 991px)`.

---

## App shell & navigation

**Stories:** US1.2, US1.11 · **Routes:** `app.routes.ts` — `/login`; authenticated children `/track` (default), `/edit`, `/statistics`, `/settings`.

### Desktop (≥992px)

```
┌──────────────────────────────────────────────────────────────────────────┐
│ [logo] Habit Tracker    Track | Edit | Statistics | Settings    [Logout] │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                     <router-outlet> (feature screen)                     │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

### Mobile (<992px)

```
┌─────────────────────────────┐
│ [logo] Habit Tracker   [⎋]  │  ← logout icon (no text)
├─────────────────────────────┤
│                             │
│      feature content        │
│                             │
├─────────────────────────────┤
│  [✓]  [✎]  [📊]  [⚙]       │  fixed bottom nav (Font Awesome icons)
└─────────────────────────────┘
```

| State | As-built behavior | Notes |
|-------|-------------------|--------|
| Loading | Route change; no global shell spinner | Feature components load data |
| Success | Nav links `routerLinkActive="active"` | — |
| Error | 401 → interceptors clear JWT, redirect login (US1.11.2) | refresh interceptor TODO |
| Empty | N/A at shell level | — |

---

## Login

**Stories:** US1.1 · **Component:** `login/login.component.html`

```
        ┌─────────────────────────┐
        │         Login           │
        │  Username [___________] │
        │  Password [___________] │
        │  [      Login (full)   ]│
        └─────────────────────────┘
```

| State | As-built | Gap / backlog |
|-------|----------|----------------|
| Loading | No button disabled / spinner on submit | — |
| Validation error | Inline “Username/Password is required” when touched | — |
| Auth failure | **No inline API error** | `[Backlog US2.5]` show `ErrorResponse.message` like Settings |
| Success | Navigate to app; JWT in Elf `localStorage` | — |

---

## Track habits

**Stories:** US1.4, US1.5, US1.6, US1.3 · **Component:** `track-habits/`, rows `track-habit-item/`

```
  Thursday, March 12                    [📅]
  ───────── TODO ─────────
  ┌ habit card ──────────────────────────────┐
  │ [icon] Name          counters    [streak]│  ← checkbox hidden; label wraps ht-streak
  └──────────────────────────────────────────┘
  ───────── DONE ─────────
  (done rows, same card pattern)
```

| State | As-built | Gap / backlog |
|-------|----------|----------------|
| Loading | `*ngIf="data && data.length"` — blank until loaded | No explicit skeleton |
| Empty habits | “No habits to track” + CTA → Edit | US1.7 |
| Empty todo list | “Nothing left to do / Good job!” | — |
| Success toggle | POST/DELETE track; checkbox + streak update | HTTP errors often silent |
| Error (API) | **No user-visible message** | `[Backlog US2.5]` Settings-style banner |
| Date bounds | `maxDate="currentDate"` on datepicker | `[Backlog US2.2]` no minDate for today/yesterday window messaging |

**Row micro-interaction (US1.5, US1.9):** Tap streak/checkbox label → `onValueChange` → parent `handleStatusChange` → POST or DELETE `/api/habit-track`. Counters show total check-ins and best streak when aggregate present.

---

## Edit habits

**Stories:** US1.7, US1.8, US1.9 · **Components:** `edit-habits/`, `edit-habit-item/`, `icon-picker/`

**List mode:** Card with icon, name, three counters, pen icon → edit mode.

**Edit mode:**

```
  [icon ▼ select]  [ habit name input________ ]     [💾] [🗑] [✕]
```

**FAB:** Fixed bottom-right “+” when habits exist and not creating.

| State | As-built | Gap / backlog |
|-------|----------|----------------|
| Loading | List empty until HTTP returns | — |
| Empty | “No habits created yet” + Create Habit | — |
| Create | Inline `edit-habit-item` `isEditMode=true` | — |
| Save/delete | Icon clicks; confirm dialog for delete (service) | Error paths vary |
| Icon picker | Native `<select>` of catalog names (US1.9) | Not a modal grid |

---

## Statistics

**Stories:** US1.10 · **Components:** `statistics/`, `stat-habit-item/`

```
        [ start date ]  to  [ end date ]
  ┌ habit card ──────────────────── done/of [✓] │
  │ [icon] Name    counters (3)                │
  └────────────────────────────────────────────┘
```

Default range: month start through **today** from `UserClockStore` / `/api/me`.

| State | As-built | Gap / backlog |
|-------|----------|----------------|
| Loading | Hidden until `data` set | — |
| Empty | “No data available” for range | — |
| Success | Rows with `done / of` fraction | `[Backlog US2.4]` scheduled-day semantics vs domain doc |

---

## Settings (timezone)

**Stories:** US1.3 · **Component:** `settings/settings.component.html`

```
  ┌ Settings ─────────────────────┐
  │ Timezone [___________▼ datalist]│
  │ (error message in red)          │  ← as-built pattern for API errors
  │ Timezone saved (green)          │
  │ [ Save ]                        │
  └─────────────────────────────────┘
```

| State | As-built | Reference for backlog |
|-------|----------|------------------------|
| Loading | Form builds after clock load | — |
| Validation | “Timezone is required” | — |
| Error | `errorMessage` from API (`data-testid="settings-error"`) | **Pattern for US2.5** on Login/Track |
| Success | “Timezone saved” | — |

---

## Annotated backlog wireframes (not in repo)

### US2.2 — Check-in date window

```
  Track — date outside today/yesterday
  ┌─────────────────────────────────────┐
  │ ⚠ Check-ins only for today or       │
  │   yesterday in your timezone.       │
  │   [Pick allowed date]               │
  └─────────────────────────────────────┘
  (Toggle disabled or blocked with explanation)
```

### US2.5 — Login / track API errors

```
  ┌─────────────────────────────────────┐
  │ Login                               │
  │  ...fields...                       │
  │  Invalid username or password.      │  ← ErrorResponse.message
  └─────────────────────────────────────┘
```

### US2.1 — Habit lifecycle (pause/archive)

```
  Edit habit row — overflow menu
  [ Pause ] [ Archive ] [ Delete ]
  (Domain fields not on entity today — UI not shipped)
```

---

## Requirements trace (planning)

| Section | FR / NFR | Notes |
|---------|----------|--------|
| All screens | FR3, FR3.1 | As-built documentation; backlog separated |
| No construction | FR2 | Mockups describe product; no merge mandate |
| Accessibility | NFR1 | Linked in `accessibility-checklist.md` |
