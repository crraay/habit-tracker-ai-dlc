# Team Allocation — intent `260914-full-repo-scan`

A **mob** is the group that executes a Bolt end-to-end. Team Formation (stage 1.5) was **skipped** for classic scope on this intent, so ownership defaults to the AI developer persona unless you later adopt multi-team staffing.

Sources: `bolt-plan.md`, `delivery-planning-questions.md`, `aidlc-state.md` (team-formation SKIP).

---

## Staffing model

| Setting | Value |
|---------|--------|
| Team Formation stage | **Skipped** (classic) |
| Construction staffing | **Solo session** — one AI mob with you at approval gates |
| Unit ownership | **Solo** (default; no `set-unit-ownership team`) |
| Gate rhythm | Per-stage approvals on workflow gates (default) |

All Bolts below assign **`aidlc-developer-agent`** as the executing mob. You approve at Inception and Operation gates; reference Bolts F1–F3 assume the same model in follow-up intents unless you open team ownership explicitly.

---

## Bolt-to-mob assignment

| Bolt ID | Name | Executes now? | Primary mob | Support (as needed) |
|---------|------|---------------|-------------|---------------------|
| **P1** | Planning closure | Yes | aidlc-developer-agent | aidlc-delivery-agent (plan), aidlc-architect-agent (DAG/contract sanity) |
| **F1** | Backend reference | No | aidlc-developer-agent | aidlc-quality-agent (tests), aidlc-architect-agent (API/C1) |
| **F2** | SPA reference | No | aidlc-developer-agent | aidlc-design-agent (UX when US2.x), aidlc-quality-agent |
| **F3** | Compose reference | No | aidlc-developer-agent | aidlc-pipeline-deploy-agent (GHA/deploy), aidlc-operations-agent |

There is **no Program Board** multi-team split—single mob across all reference Bolts.

---

## Repo touch rules (all Bolts)

| Repository | P1 (this intent) | F1 | F2 | F3 |
|------------|------------------|----|----|-----|
| `habit-tracker-ai-dlc` | **Yes** — artifacts, verification | Planning only | Planning only | Planning only |
| `habit-tracker-springboot` | **No merges** | Yes (follow-up) | No | No |
| `habit-tracker-angular` | **No merges** | No | Yes (follow-up) | No |
| `habit-tracker-compose` | Docs only if Operation stage requires | No | No | Yes (follow-up) |

---

## Construction staffing note (Step 6 handoff)

For intent **`260914-full-repo-scan`**, Construction is **skip/no-op for application code**—staffing choice is moot until a **follow-up intent**. When you open one:

> Build every unit here in one session with gate approvals (**solo**, default), **or** assign teams per unit (requires unit-major iteration and workspace-root git—**not** this multi-repo layout without explicit coordination).

Recommended for this product: remain **solo** with **serial F1 → F2 → F3** to reduce cross-repo contract drift (Q7-A).
