<!-- INVARIANT: examples are single-line HTML comments so a fresh template parses to total=0 (MEMORY_EMPTY). Do NOT un-comment or split across lines. t100 guards this. -->
> This file is kept up to date automatically while the stage runs. Add observations at the review step, not by editing here directly.

## Interpretations
<!-- example: 2026-05-29T10:14:32Z — chose REST over GraphQL; the consuming team only needs CRUD, revisit if subscriptions land -->
- 2026-10-14T02:15:00Z — User skipped rescan for angular/compose (keep existing STALE stores); springboot focused scan on CI/test paths only for F1 build-image intent.

## Deviations
<!-- example: 2026-05-29T10:14:32Z — skipped the optional caching layer the stage prose suggested; the dataset is small enough that it adds risk -->

## Tradeoffs
<!-- example: 2026-05-29T10:14:32Z — picked TDD over BDD this run; the team is unit-first and the domain is well-understood -->
- 2026-10-14T02:15:00Z — Focused merge demotes prior full-scan deep coverage to shallow; prose preserved but verified scope is narrower (expected for F1).

## Open questions
<!-- example: 2026-05-29T10:14:32Z — confirm the retention window with compliance before the next stage hardens the schema -->
- 2026-10-14T02:15:00Z — F1 scope: change `build-image.yml` only vs also align `Dockerfile` `-DskipTests` with test gate.
