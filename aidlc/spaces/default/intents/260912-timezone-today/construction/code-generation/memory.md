<!-- INVARIANT: examples are single-line HTML comments so a fresh template parses to total=0 (MEMORY_EMPTY). Do NOT un-comment or split across lines. t100 guards this. -->
> This file is kept up to date automatically while the stage runs. Add observations at the review step, not by editing here directly.

## Interpretations
<!-- example: 2026-05-29T10:14:32Z — chose REST over GraphQL; the consuming team only needs CRUD, revisit if subscriptions land -->
- 2026-09-13T06:04:50Z — Zero-Unit poc: plan and later code live under construction/code-generation/ with no Bolt. Clock API locked as GET/PATCH /api/me so we do not invent /api/user while still adding a JWT resource.
- 2026-09-13T06:04:50Z — FR5.1 under Flyway-off tests: rely on JPA nullable=false persist failure rather than running Flyway in the test profile.

## Deviations
<!-- example: 2026-05-29T10:14:32Z — skipped the optional caching layer the stage prose suggested; the dataset is small enough that it adds risk -->
- 2026-09-13T07:50:00Z — `@WebMvcTest` for `/api/me` needed mocked `JwtUtil` and `UserDetailsService` because the existing JWT filter is on the web slice; production security is unchanged.
- 2026-09-13T07:50:00Z — `npm run generate-api` ran after the first client files were written, so generator output is the source of `src/app/web-api/` for `/api/me`.

## Tradeoffs
<!-- example: 2026-05-29T10:14:32Z — picked TDD over BDD this run; the team is unit-first and the domain is well-understood -->

## Open questions
<!-- example: 2026-05-29T10:14:32Z — confirm the retention window with compliance before the next stage hardens the schema -->
