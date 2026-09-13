<!-- INVARIANT: examples are single-line HTML comments so a fresh template parses to total=0 (MEMORY_EMPTY). Do NOT un-comment or split across lines. t100 guards this. -->
> This file is kept up to date automatically while the stage runs. Add observations at the review step, not by editing here directly.

## Interpretations
<!-- example: 2026-05-29T10:14:32Z — chose REST over GraphQL; the consuming team only needs CRUD, revisit if subscriptions land -->
- 2026-09-12T15:53:27Z — New-account timezone is UTC on any new User persist, not a signup wizard; CodeKB shows login-only auth, so FR1.2 binds seed and future create paths without adding registration.
- 2026-09-12T15:53:27Z — Exact REST path left to construction; requirements lock JWT-protected read of timezone+today and update of timezone only, because no /api/user exists today.
- 2026-09-13T05:28:00Z — Gate revision applied both R-01 and R-02: FR3.1 now bounds today to default/max only (payload is the selected date); FR6/FR6.2 citations corrected to FR5/FR5.2.
- 2026-09-13T05:49:00Z — Redo confirmation: Q1–Q3 unchanged; generated requirements keep FR3.1 selected-date payloads and FR5 test IDs.

## Deviations
<!-- example: 2026-05-29T10:14:32Z — skipped the optional caching layer the stage prose suggested; the dataset is small enough that it adds risk -->

## Tradeoffs
<!-- example: 2026-05-29T10:14:32Z — picked TDD over BDD this run; the team is unit-first and the domain is well-understood -->
- 2026-09-12T15:53:27Z — Accepted Q3: after timezone save, Track/Statistics may keep old today until full reload or re-login rather than immediate refetch; cheaper than re-init of the once-baked datepicker, with the cost that a same-session zone change can show a stale day until refresh.

## Open questions
<!-- example: 2026-05-29T10:14:32Z — confirm the retention window with compliance before the next stage hardens the schema -->
