# Accessibility Checklist — WCAG 2.1 AA target

**Intent:** `260914-full-repo-scan` · **Baseline:** WCAG 2.1 Level AA as normative target for future work; **as-built gaps** marked separately (planning-only intent, no mandatory fixes here).

**Primary surfaces:** Login, Track, Edit habits, Statistics, Settings, App shell.

---

## Perceivable

| ID | Criterion | Target (AA) | As-built / gap |
|----|-----------|-------------|----------------|
| P1 | Text alternatives for habit icons | Meaningful `alt` on `<img>` | **Met** on track/edit/stat rows |
| P2 | Color contrast — body text | 4.5:1 | Bootstrap defaults generally OK; **not audited pixel-by-pixel in this scan** |
| P3 | Color contrast — UI components | 3:1 for controls | Primary buttons use Bootstrap `btn-primary`; verify in follow-up |
| P4 | Do not use color alone | Error/success also text | Settings uses text messages (**good**); track/login errors often absent |
| P5 | Resize / reflow | Content usable at 320px width | Mobile bottom nav + fluid containers; manual verify recommended |

---

## Operable

| ID | Criterion | Target (AA) | As-built / gap |
|----|-----------|-------------|----------------|
| O1 | Keyboard — all functionality | Every action keyboard-operable | **Gap:** Edit row save/delete/cancel are `<i>` click handlers without documented keyboard paths |
| O2 | Focus visible | 2px focus indicator 3:1 | Browser default on form fields; **gap** on icon-only edit/track controls |
| O3 | Skip link | Skip to main content | **Not present** |
| O4 | Nav — consistent | Same order desktop/mobile | Desktop text links; mobile icons — **consistent routes**, different presentation |
| O5 | Touch target size | ~44×44px minimum | Bottom nav icons `fs-3`; streak tap target depends on graphic size — **verify** |

---

## Understandable

| ID | Criterion | Target (AA) | As-built / gap |
|----|-----------|-------------|----------------|
| U1 | Page language | `lang` on document | Angular app — confirm `index.html` `lang="en"` in repo |
| U2 | Labels on inputs | Visible labels | Login, Settings labeled; icon picker **gap** — select lacks explicit label element |
| U3 | Error identification | Describe error in text | Settings **met**; Login API failure **gap (US2.5)** |
| U4 | Consistent navigation | Predictable shell | **Met** across authenticated routes |

---

## Robust

| ID | Criterion | Target (AA) | As-built / gap |
|----|-----------|-------------|----------------|
| R1 | Valid HTML / ARIA roles | Proper roles on custom widgets | `ht-streak` / hidden checkbox pattern — needs role/state audit |
| R2 | Name, role, value for controls | Screen reader announces toggle state | Checkbox+label pattern **partially met** if label association correct |
| R3 | Status messages | `aria-live` for dynamic errors/success | Settings success/error are visual text only — **consider `role="alert"`** in backlog |

---

## Screen-specific priorities (follow-up intents)

| Screen | Priority fixes | Related story |
|--------|----------------|---------------|
| Login | Announce auth failure; disable double-submit | US2.5 |
| Track | Expose track API errors; keyboard-accessible check-in | US2.5, US1.5 |
| Edit | Keyboard for save/delete/cancel; label icon select | US1.7 |
| Statistics | Ensure date inputs labeled for range | US1.10 |
| Settings | Keep as reference pattern; add live region on error | US1.3 |
| Shell | Logout control accessible name on mobile icon-only button | US1.11 |

---

## Backlog-only (US2.x) — AA for new UX

When implementing US2.2, US2.5, or lifecycle UI:

- Blocked actions must be perceivable without color alone (icon + text).
- Date window messages must be readable and associated with date control (`aria-describedby`).
- Error banners should use Settings pattern plus `role="alert"` or live region.

---

## Traceability

| Artifact | Requirements |
|----------|--------------|
| This checklist | NFR1 (traceable planning), FR3 inception deliverable |
| Gaps catalogued | FR4 (awareness, not commitment) |

**Sign-off for this intent:** Documentation complete for planning; **no WCAG compliance claim** for production app until a dedicated quality intent runs audit + fixes.
