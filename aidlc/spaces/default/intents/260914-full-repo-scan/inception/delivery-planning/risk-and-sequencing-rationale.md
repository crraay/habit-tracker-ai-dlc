# Risk and Sequencing Rationale — intent `260914-full-repo-scan`

Delivery Planning chooses **economic order**; Units Generation (2.7) fixed **topology** only (`unit-of-work-dependency.md`). This document explains why **Bolt P1** runs first and why reference order is **F1 → F2 → F3**.

**Heuristic:** **Topological / dependency-first** (aligned with Reinertsen’s “obey constraints before optimizing flow”—no WSJF numeric model per Q3-A). **Primary risk theme:** cross-repo **contract drift** (Q7-A).

Sources: `delivery-planning-questions.md`, `unit-of-work-dependency.md`, `contract-summary.md`, `team.md`.

---

## Why this order

### Bolt P1 before any reference application Bolt

- **FR2 / Q8-A** require this intent to finish without application-repo merges; P1 is the only Bolt that executes here.
- **FR2.1 / FR3.3** deferred from user-stories traceability to Delivery Planning—closure must be explicit before Construction starts.

### Reference sequence F1 → F2 → F3 (follow-up intents)

| Order | Bolt | Rationale |
|------:|------|-----------|
| 1 | **F1 (U1)** | DAG root; C1 **semantic owner**; JWT and REST must exist before SPA or packaging consumes them. |
| 2 | **F2 (U2)** | Hard edge **U2 → U1**; OpenAPI snapshot and generated client depend on stable backend (ADR-005, contract-summary). |
| 3 | **F3 (U3)** | **U3 → U1, U3 → U2**; compose pulls **images** built from app repos—packaging last avoids deploying stale Hub tags. |

This matches **Q2-A** (follow unit DAG). It **does not** deviate from 2.7 topological order; no risk-first reorder (e.g. U2 before U1) is justified while contract drift is the top worry—**backend-first** reduces C1 breakage.

### Walking skeleton not first

Team **`Walking Skeleton`** practice: brownfield product already has login → track → statistics via nginx → API → Postgres. A dedicated skeleton Bolt would duplicate existing E2E path without adding ceremony value (`team.md`). Reference Bolts are **one unit per Bolt** (Q4-D), not a cross-unit thin slice (Q2-B rejected).

---

## Risk register (sequencing-relevant)

| Risk | Likelihood | Impact | Mitigation in plan |
|------|------------|--------|---------------------|
| **C1 drift** — U1 changes API without U2 snapshot + `generate-api` | Medium | High | F1 DoD requires export/sync; F2 DoD requires snapshot regen; coordinated release called out in contract-summary |
| **Image tag skew** — U1/U2 `build-image` at different commits | Medium | High | Serial F1→F2→F3; deploy compose only after both images green on `main`; document digest rollback |
| **SkipTests release** | Low | High | Team **Forbidden**: no `-DskipTests` production image from `main` |
| **Domain-doc vs code gaps (US2.x)** | Medium | Medium | Deferred to follow-up intents; not reordering F1–F3 for this scan intent |
| **Under-tested auth/track** | Medium | Medium | Q7-A prioritizes contract discipline first; test expansion can be scoped inside F1/F2 DoD in follow-ups |

---

## Parallelism (Q5-A)

**Serial only** for this team model: one mob, one Bolt at a time. The DAG would allow theoretical overlap after U1 baseline, but parallel U2/U3 work increases Hub tag and contract mismatch risk—rejected for Q7-A.

---

## WSJF / formal scoring (Q3-A)

No numeric WSJF table. Qualitative summary:

| Bolt | Value (follow-up) | Time criticality | Risk reduction | Job size |
|------|-------------------|------------------|----------------|----------|
| P1 | High (closes scan) | Now | Unblocks Construction policy | S |
| F1 | Medium–High | When feature touches API | Reduces C1 drift | L (unit complexity) |
| F2 | Medium–High | After F1 | Validates consumer contract | L |
| F3 | Medium | When deploy changes | Production closure | S |

---

## Deviations from pure topology

**None** for reference Bolts F1–F3. **P1** is not a unit in the DAG—it is an intent-level closure Bolt inserted **before** any future F1 execution, which is allowed because P1 does not violate acyclic unit dependencies (it touches no units).
