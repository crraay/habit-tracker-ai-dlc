# User Stories — Planning Questions

**Context:** Intent `260914-full-repo-scan` — full scan of habit-tracker-springboot and habit-tracker-angular (compose as deploy closure). Requirements lock **planning-only Construction** (no application-repo merges from this intent), **baseline-only** outcome, and **domain-doc alignment out of scope**. Stories should describe the as-built product plus optional future backlog, not mandate construction here.

**Plan (draft):**

- **Personas:** At minimum an end user (habit tracker); optionally operator/deploy reader if stories should cover compose/runtime.
- **Format:** INVEST user stories with stable `US{group}.{seq}` IDs and `AC{group}.{seq}.{n}` acceptance criteria (Given/When/Then).
- **Prioritization:** MoSCoW on each story; MVP boundary deferred to delivery planning.
- **Breakdown:** By user journey (auth → track → manage habits → statistics → settings), plus a separate **Future / backlog** group for scan-documented gaps.
- **Traceability:** `traceability.json` covering every FR/NFR from `requirements.md`.

---

## Q1. Which personas should we define for this intent?

Stories need actors. The live product is a single authenticated end user; compose docs target operators.

A. **End user only** — one primary persona (e.g. “Alex, daily habit tracker”)
B. **End user + operator** — add a lightweight ops persona for deploy/runtime (compose), still planning-only
C. **End user + product owner / maintainer** — separate persona for backlog prioritization narratives (no extra UI)
D. **Minimal placeholders** — one generic “User” persona; focus on journeys not persona depth
E. **Not decided** — recommend in the story set
X. Other (please specify)

[Answer]: C. **End user + product owner / maintainer** — separate persona for backlog prioritization narratives (no extra UI)

## Q2. How should we label stories that describe **today’s shipped behavior** vs **optional future work**?

Requirements require clear separation (FR3.1, FR4).

A. **Two story groups** — e.g. `US1.x` As-built product, `US2.x` Future backlog (gaps from CodeKB)
B. **Single list with tags** — each story has `As-built` | `Backlog` | `Intent-only` in the title or metadata line
C. **As-built only** — no backlog stories; gaps stay in requirements/domain design only
D. **Backlog only** — stories focus on future intents; as-built summarized in one epic
E. **Not decided** — use your recommended split
X. Other (please specify)

[Answer]: B. **Single list with tags** — each story has `As-built` | `Backlog` | `Intent-only` in the title or metadata line

## Q3. What granularity do you want for as-built journey stories?

A. **One story per major screen/journey** (login, track, edit habits, statistics, settings) — ~5–7 stories
B. **Finer slices** — separate stories for track vs untrack, CRUD habits, icon picker, date navigation, etc. — ~10–15 stories
C. **Coarse epic** — one “Use the habit tracker daily” epic with nested acceptance criteria only
D. **Match API surface** — one story per controller area from CodeKB
E. **Not decided** — recommend standard depth for classic scope
X. Other (please specify)

[Answer]: B. **Finer slices** — separate stories for track vs untrack, CRUD habits, icon picker, date navigation, etc. — ~10–15 stories

## Q4. Which **future backlog** themes (from the scan) should appear as user stories at all?

Domain alignment is out of scope; these would be **Could/Won’t** backlog items, not commitments.

A. **All catalogued gaps** — lifecycle/pause/archive, user-relative check-in window, streak scheduling, statistics semantics, login/track error UX, test hardening themes
B. **UX and quality only** — error handling, datepicker bounds, test coverage narratives; **exclude** domain lifecycle features
C. **None** — skip backlog stories entirely (Q2 option C aligned)
D. **Only what you name in chat** — I'll list specific themes under X
E. **Top 3 by impact** — you choose the three highest-value backlog stories from CodeKB
X. Other (please specify)

[Answer]: A. **All catalogued gaps** — lifecycle/pause/archive, user-relative check-in window, streak scheduling, statistics semantics, login/track error UX, test hardening themes

## Q5. For acceptance criteria on **as-built** stories, how strict should we be about known API/UI gaps?

Example: track screen allows dates with no client minDate; OpenAPI may omit domain fields.

A. **Describe actual behavior** — criteria match as-built; note gaps in story notes, not as failing criteria
B. **Describe ideal + gap flag** — criteria state desired behavior with “(gap)” where code differs from domain doc
C. **Criteria only for tested paths** — omit flaky/untested edges
D. **Strict domain doc** — write criteria from `docs/domain.md` even though alignment is out of scope (marked backlog)
E. **Not decided** — recommend per org BDD practice
X. Other (please specify)

[Answer]: B. **Describe ideal + gap flag** — criteria state desired behavior with “(gap)” where code differs from domain doc

## Q6. Should any story explicitly capture the **planning-only Construction** success path for this intent?

A. **Yes — one meta story** for the stakeholder/team (“As a maintainer, I want inception artifacts and no app-repo merges from this intent, so that the scan remains the deliverable”)
B. **Yes — weave into multiple stories** as acceptance notes on documentation/traceability stories
C. **No — keep stories product-user only**; boundary stays in requirements/delivery plan only
D. **Only in traceability** — no user story prose for workflow mechanics
E. **Not decided**
X. Other (please specify)

[Answer]: B. **Yes — weave into multiple stories** as acceptance notes on documentation/traceability stories

## Q7. MoSCoW defaults for **future backlog** stories (if we include them)?

A. **Could Have** by default — none are Must for this intent
B. **Won’t Have (this intent)** explicitly — all backlog labeled Won’t until a follow-up intent
C. **Mixed** — you assign per theme after Q4
D. **No MoSCoW on backlog** — priority field omitted for backlog group
E. **Not applicable** — no backlog stories
X. Other (please specify)

[Answer]: B. **Won’t Have (this intent)** explicitly — all backlog labeled Won’t until a follow-up intent

## Consolidated Summary Confirmation

- **Personas:** End user plus product owner/maintainer (backlog prioritization; no extra UI persona)
- **As-built vs backlog:** Single story list with tags (`As-built` | `Backlog` | `Intent-only`) on each story
- **As-built granularity:** Finer slices (~10–15 stories) — track/untrack, CRUD, icon picker, date navigation, etc.
- **Backlog coverage:** All catalogued scan gaps as backlog-tagged stories (lifecycle, check-in window, streaks, statistics, error UX, test hardening)
- **Acceptance criteria:** Desired behavior with “(gap)” where as-built differs from domain doc; as-built paths documented accordingly
- **Planning-only boundary:** Woven into multiple stories as notes on documentation/traceability-related acceptance criteria (not one meta story)
- **Backlog MoSCoW:** **Won’t Have** for this intent until a follow-up intent opens

Does this all look correct before I generate the artifact?

- Looks correct
- Request changes

[Answer]: Looks correct
