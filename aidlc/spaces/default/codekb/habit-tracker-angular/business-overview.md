# Business Overview — habit-tracker-angular

Full-repo reverse engineering for intent `260914-full-repo-scan`. This repo is the Habit Tracker **web UI only**. Canonical habit domain rules live in sibling `habit-tracker-springboot/docs/domain.md` (referenced by README and AGENTS.md). This document describes what the SPA delivers to users and how it defers enforcement to the API.

## Purpose

`habit-tracker-ui` is an Angular 18 single-page application that lets an authenticated user:

- Sign in and maintain a JWT session across browser refresh
- View and check in daily habits for a chosen calendar date (defaulting to the server’s **today**)
- Create, edit, and delete habits and pick icons
- View habit completion statistics for a date range (default: start of month through **today**)
- View and change their IANA **timezone** (server validates; UI shows API errors on invalid saves)

The UI may hide or discourage illegal actions; it must not become a second source of truth for calendar boundaries, check-in windows, streaks, or habit lifecycle (pause/archive).

## Key Functionality

| Area | User-facing behaviour | Backend reliance |
|------|----------------------|------------------|
| Login | Username/password → JWT stored locally | `POST /api/auth/login` |
| Track | Habit list for a date; toggle done/undone | `GET /api/habit-track/{date}`, `POST`/`DELETE /api/habit-track` |
| Edit habits | CRUD habit list, icons | `/api/habit`, `/api/habit-icons` |
| Statistics | Aggregated completion for start–end range | `GET /api/statistics/{startDate}/{endDate}` |
| Settings | Timezone dropdown (IANA list when supported) | `GET`/`PUT /api/me` |
| Session clock | Default dates and max calendar day | `GET /api/me` → `today`, `timezone` |

Navigation after login: **Track habits**, **Edit habits**, **Statistics**, **Settings**, **Logout** (desktop top nav; mobile bottom icons).

## Domain Boundary

| Owned in this package | Not owned (backend / domain doc) |
|----------------------|----------------------------------|
| Presentation, routing, forms | Definition of *today* and valid IANA zones |
| JWT session persistence | Check-in window enforcement |
| HTTP adapters (generated) | Streak calculation, pause/archive semantics |
| Date formatting as `yyyy-MM-dd` for API params | Whether a habit may be tracked on a given date |
| Timezone **display and edit** UX | Habit state machine beyond DTO fields exposed in OpenAPI |

## Observed Gaps (documented, not fixed in this scan)

- Track screen allows picking dates with no client `minDate`; out-of-window actions may fail at API.
- OpenAPI `HabitDto` may be minimal vs full domain model (pause/archive/state).
- No refresh-token flow; expired JWT forces re-login.
- Login and track mutations lack user-visible error handling (Settings is the reference pattern).

## Relationship to Sibling Repos

- **habit-tracker-springboot**: API and domain law.
- **habit-tracker-compose**: Docker/nginx wiring described in DOCKER.md; not built in this repo’s CI beyond image workflow (skimmed).
