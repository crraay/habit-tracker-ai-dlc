# Interaction Specification — Habit Tracker SPA

**Intent:** `260914-full-repo-scan` · **Scope:** As-built behavior from Angular repo; backlog behaviors noted where US2.x applies.

---

## Global flows

### Authentication (US1.1, US1.11)

1. Unauthenticated user hits protected route → `authGuard` → `/login`.
2. Submit username/password → `POST /api/auth/login` → JWT stored (Elf) → navigate to `/track`.
3. Any API **401** → interceptors clear session → redirect login.
4. Logout (desktop button / mobile icon) → clear JWT → login.

**States:** See mockups.md Login matrix. Backlog: surface login HTTP errors (US2.5).

### User clock (US1.3)

1. Authenticated feature routes call `UserClockStore` lazy `GET /api/me`.
2. Track uses `today` as default selected date and `maxDate` on datepicker.
3. Statistics uses `today` as default end of range.
4. Settings `PUT /api/me` on save; success/error inline; clock may not refetch `today` in same session after TZ change (as-built).

---

## ht-track-habit-item

| Field | Value |
|-------|-------|
| Component | Track habit row |
| Description | Display habit for a date; toggle done via streak/checkbox |
| Category | input / display |

### States

| State | Description | Trigger |
|-------|-------------|---------|
| default | Shows name, optional counters, streak unchecked | loaded, not done |
| done | Streak/checked visual | `data.status === true` |
| loading | *(implicit)* parent awaiting API | parent refresh |
| error | **No row-level error UI** | failed POST/DELETE |
| empty | N/A at row level | — |

### Props / Inputs

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `data` | track DTO | yes | habitId, habitName, iconUrl, status, aggregate |

### Events

| Event | Payload | Parent action |
|-------|---------|---------------|
| `statusChange` | habit + new status | `handleStatusChange` → POST or DELETE track |

### Responsive

| Breakpoint | Behaviour |
|------------|-----------|
| mobile (<992px) | Same card; `fs-5` title; bottom nav consumes vertical space |
| desktop (≥992px) | `fs-md-4` title; more horizontal padding |

### Accessibility

| Requirement | As-built | Target (AA) |
|-------------|----------|-------------|
| Toggle control | Hidden checkbox + label wrapping `ht-streak` | Ensure focus ring on label; announce checked state |
| Icon alt | `habitName + ' icon'` | OK |
| Keyboard | Label activates checkbox | Verify streak graphic does not block focus |

**Stories:** US1.5, US1.6

---

## ht-streak (check-in control)

| Field | Value |
|-------|-------|
| Component | Streak visual / checkbox surrogate |
| Category | input |

### Interaction

- Click label → toggles hidden checkbox → `ngModelChange` on row.
- Displays `currentStreak` with visual state tied to `status`.

**Backlog US2.2:** When date outside allowed window, disable toggle and show message (not implemented).

---

## ht-datepicker

| Field | Value |
|-------|-------|
| Component | Date selection |
| Category | input |

### Usage contexts

| Screen | Bindings | Notes |
|--------|----------|-------|
| Track | `[(value)]="selectedDate"`, `(valueChange)="refresh()"`, `[maxDate]="currentDate"`, `[isInputHidden]="true"`, calendar icon opens picker | No minDate |
| Statistics | Start/end range, each `maxDate` constrained | Mobile width ~120px |

### States

| State | Track | Statistics |
|-------|-------|------------|
| loading | Waits on parent `currentDate` from clock | Same |
| error | Silent | Silent |
| success | Reload habit list for date | Reload aggregates |

**Stories:** US1.4, US1.10 · **Backlog:** US2.2 minDate + explanation

---

## ht-icon-picker

| Field | Value |
|-------|-------|
| Component | Habit icon selector |
| Category | input |

### Interaction

- Native `<select>`: options from `GET /api/habit-icons` via parent-loaded `icons` array.
- `selectIcon` on change; disabled when `disabled` input true.

### Accessibility

| Requirement | As-built | Target |
|-------------|----------|--------|
| Label | Relies on adjacent layout in edit form | Associate `<label for>` with select |
| Options | Text = icon name | Readable |

**Stories:** US1.9

---

## ht-edit-habit-item

| Field | Value |
|-------|-------|
| Component | Habit CRUD row |
| Category | input / navigation |

### Modes

| Mode | Entry | Actions |
|------|-------|---------|
| View | Default | Pen icon → edit |
| Edit | Pen or create flow | Save (check icon), Delete (trash, existing only), Cancel (times) |

### Events

| Event | When |
|-------|------|
| `onSave` | Create or update payload |
| `onDelete` | User confirms delete |
| `onEditCancel` | Cancel create/edit |

**Stories:** US1.7, US1.8

---

## Settings timezone form

| Field | Value |
|-------|-------|
| Component | Settings card form |
| Category | input / feedback |

### Interaction pattern (reference for backlog)

1. User edits timezone (text + datalist from `Intl.supportedValuesOf('timeZone')`).
2. Submit → `PUT /api/me`.
3. On failure: set `errorMessage` → render `text-danger` block (`settings-error`).
4. On success: `saveSuccess` → green confirmation.

**Apply this pattern to Login and Track mutations in US2.5.**

**Stories:** US1.3

---

## Screen state matrix (summary)

| Screen | Loading | Empty | Error | Success |
|--------|---------|-------|-------|---------|
| Login | No dedicated | N/A | Validation only; **no API message** | Redirect |
| Track | No skeleton | No habits / all done | **Silent HTTP** | List + toggles |
| Edit | No skeleton | No habits CTA | Partial on save/delete | List updated |
| Statistics | No skeleton | No data in range | Silent | Rows with done/of |
| Settings | Form after clock | N/A | **Inline API message** | Inline success |
| Shell | — | — | 401 → logout | Nav active states |

---

## Traceability

| Spec section | Stories |
|--------------|---------|
| Global auth | US1.1, US1.11 |
| User clock | US1.3 |
| Track row / datepicker | US1.4–US1.6 |
| Edit / icon picker | US1.7–US1.9 |
| Statistics | US1.10 |
| Settings | US1.3 |
| Backlog notes | US2.1, US2.2, US2.4, US2.5 |
