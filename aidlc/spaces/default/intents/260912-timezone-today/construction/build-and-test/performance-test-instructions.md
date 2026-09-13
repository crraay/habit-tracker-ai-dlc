# Performance test instructions — timezone-today

## Strategy

**Minimal** strategy and no NFR performance design artifacts (that stage was skipped). No load, soak, or p95 suite is in this package.

## Deferred

There is no later in-scope `performance-validation` stage on this `poc` workflow. Do not invent k6/JMeter scripts. Timezone/today is a per-request `LocalDate.now(clock.withZone(...))` with no new hot path beyond existing JWT APIs.

## Coverage

No performance target to execute locally. Inventory row for performance is explanatory `N/A` unless a numeric NFR appears in a later package.
