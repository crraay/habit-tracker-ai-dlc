# Refined Mockups — Planning Questions

**Context:** Intent `260914-full-repo-scan` — brownfield habit tracker (Angular SPA + Spring API). Ideation **rough mockups were skipped** (classic scope); this stage documents **as-built UI** from CodeKB and user stories for inception planning only. **Construction must not merge application code** from this intent (requirements FR2). Backlog UX gaps may appear as annotated “future” states, not mandatory redesign.

**Upstream:** `user-stories/stories.md` (US1.x as-built, US2.x backlog), `requirements-analysis/requirements.md`, `practices-discovery/team-practices.md`, CodeKB `habit-tracker-angular/component-inventory.md`.

---

## Q1. What fidelity should the mockups target for this intent?

We are producing planning artifacts, not Figma handoff for a greenfield app.

A. **As-built documentation** — screen layouts and flows that match the shipped Angular UI; call out known gaps inline
B. **As-built + annotated backlog** — same as A, plus separate wireframe notes for US2.x backlog UX (error toasts, date bounds, lifecycle) marked “not in repo today”
C. **Ideal product from domain doc** — mockups show target UX even where code differs (alignment still out of scope for construction)
D. **Navigation map only** — routes and shell chrome; defer per-screen layout detail to interaction-spec
E. **Not decided** — recommend for classic planning-only scan
X. Other (please specify)

[Answer]: B

## Q2. Which primary screens must have dedicated mockup sections?

User stories cover login, track, edit habits, statistics, settings, and app shell navigation.

A. **All six areas** — Login, Track, Edit habits, Statistics, Settings, plus App shell / nav (desktop + mobile)
B. **Core daily path only** — Login, Track, Settings (timezone); summarize Edit + Statistics in interaction-spec without full mockups
C. **Track + Settings only** — deepest detail where user-clock and error UX matter most
D. **Match CodeKB health** — full mockups for at-risk areas (login, track, shared datepicker) and lighter treatment elsewhere
E. **Not decided** — recommend standard coverage
X. Other (please specify)

[Answer]: A

## Q3. How should we represent the existing Angular design system in `design-system-mapping.md`?

The SPA uses standalone `ht-*` components, shared widgets (datepicker, streak, confirm-dialog), and generated OpenAPI client — not a separate Figma kit.

A. **Inventory map** — map each screen region to existing component paths (from CodeKB); note Material/CDK usage where present
B. **Token proposal** — invent a minimal token set (spacing, type, color) abstracted from current SCSS/HTML patterns
C. **Both inventory and tokens** — inventory first, tokens only where repeated patterns appear
D. **Skip mapping** — interaction-spec only; design-system file lists “use existing components” generically
E. **Not decided** — recommend for brownfield
X. Other (please specify)

[Answer]: A

## Q4. What accessibility baseline should the checklist enforce?

Org design guidance defaults to WCAG 2.1 AA for user-facing specs; the as-built app may not fully meet it today.

A. **WCAG 2.1 AA as target** — checklist items state required behavior; mark as-built gaps (login errors, contrast, keyboard) separately
B. **Document as-built only** — checklist describes what the repo appears to do today without normative AA rows
C. **AA for new backlog UX only** — strict checklist only for US2.x improvements; as-built sections informational
D. **WCAG 2.2 AA** — use 2.2 criteria where they differ from 2.1
E. **Not decided** — recommend default
X. Other (please specify)

[Answer]: A

## Q5. Which responsive breakpoints should mockups and interaction-spec specify?

App shell uses desktop top nav and mobile bottom icon nav per user stories.

A. **Document both layouts** — desktop (≥ breakpoint TBD from `angular.json`/CSS) and mobile nav patterns as implemented
B. **Mobile-first spec** — primary mockups for narrow viewport; desktop as secondary notes
C. **Single canonical width** — one layout diagram; responsive rules deferred to delivery planning
D. **Follow Angular CDK BreakpointObserver** — if used in repo, mirror those breakpoints in the spec
E. **Not decided** — recommend from codebase inspection during artifact generation
X. Other (please specify)

[Answer]: A

## Q6. How should loading, empty, error, and success states appear in mockups?

Track and login are called out as at-risk for silent HTTP failures; Settings shows explicit API errors.

A. **Full state matrix per screen** — loading / empty / error / success for Track, Login, Edit, Statistics, Settings
B. **Error-focused** — document error and empty states where CodeKB flags gaps; loading/success only where non-obvious
C. **Reference Settings pattern** — specify that mutation errors should follow Settings timezone UX; mockups show that pattern once
D. **Minimal** — default Angular loading implied; only 401 logout flow documented
E. **Not decided** — recommend
X. Other (please specify)

[Answer]: A

## Q7. Should mockups include the icon picker and habit row micro-interactions?

Stories US1.9 (icons), US1.5–US1.6 (toggle done), streak/counter widgets appear in component inventory.

A. **Yes — row-level detail** — habit row, icon picker modal/dialog, streak display on track/stat rows
B. **Icon picker + track row only** — skip statistics row widgets
C. **Summarize in interaction-spec** — mockups stay screen-level; micro-interactions prose-only
D. **Exclude icon picker** — treat as implementation detail
E. **Not decided** — recommend
X. Other (please specify)

[Answer]: A

## Q8. For traceability, how should mockups link to user stories?

Downstream sensors expect upstream coverage of stories and requirements.

A. **Per-section story IDs** — each mockup section lists `US1.x` covered and notes backlog `US2.x` where annotated
B. **Single trace table** — one matrix in mockups.md; interaction-spec repeats none
C. **Requirements IDs only** — link FR3.x planning artifacts, not individual stories
D. **Informal prose** — no explicit ID tables
E. **Not decided** — recommend
X. Other (please specify)

[Answer]: A

## Consolidated Summary Confirmation

Does this all look correct before I generate the artifact?

- Looks correct
- Request changes

[Answer]: Looks correct
