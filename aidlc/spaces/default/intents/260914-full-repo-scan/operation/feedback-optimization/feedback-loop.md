# Feedback loop — full-repo-scan → next work

Intent `260914-full-repo-scan` · Closes **Operation** for the planning-only full-repo scan. Inputs feed **follow-up intents**, not automatic code changes.

## What this intent delivered

| Phase | Outcome |
|-------|---------|
| Inception | CodeKB, units, contracts, **bolt-plan** (P1 + reference F1–F3) |
| Construction | Per-unit design docs; **build-and-test** evidence; **ci-pipeline** as-built |
| Operation | CD, env, deploy docs, observability, incident, perf validation, this synthesis |

**FR2.1 satisfied:** no application-repo merges from this intent.

## Consolidated improvement backlog (priority themes)

| Priority | Theme | Example IDs | Suggested Bolt |
|----------|-------|-------------|----------------|
| P0 | **Release safety** | U1 tests on `build-image`, post-deploy health curl | F1 + F3 |
| P1 | **Observability** | Uptime check, Micrometer, alerts (NFR6.13–6.15) | F3 then F1 |
| P1 | **Ops hardening** | SSH keys, DB backup runbook, digest pinning | F3 |
| P2 | **Quality depth** | Backend habit/track tests, angular error paths | F1, F2 |
| P2 | **Performance** | k6 baseline (`load-test-plan.md`, BL-PERF-03) | F1 |
| P3 | **Domain/scheduler** | Streak timezone alignment (BL-REL-02/03) | F1 |

## Reference Bolt routing (from `bolt-plan.md`)

| Bolt | When to use |
|------|-------------|
| **F1** | API, domain, Flyway, OpenAPI export |
| **F2** | SPA, `generate-api`, test:ci |
| **F3** | Compose, deploy workflow, droplet ops only |

Cross-cutting items (metrics + deploy gate) often touch **F1 → F3** in that order when API and packaging both change.

## Feedback channels

| Channel | Use |
|---------|-----|
| GitHub Issues | Track backlog items from this scan |
| User reports | Production bugs → incident runbooks |
| AI-DLC new intent | `/aidlc` with scope tied to F1/F2/F3 |
| `aidlc/spaces/default/knowledge/` | Optional team ops notes (human-maintained) |

No in-app analytics pipeline exists today.

## Operational toil → automation candidates

| Toil | Automation direction |
|------|---------------------|
| Manual smoke after deploy | GHA curl steps after SSH |
| Manual Hub tag coordination | Documented release checklist or semver tags |
| Log grep debugging | Central logs (NFR6.14) |
| `:latest` rollback guesswork | Digest log on deploy |

## Next Ideation (optional)

If the team starts a **new intent**:

1. Pick backlog slice (e.g. “F3 deploy hardening” or “F1 CI test gate”).  
2. Reuse CodeKB + contracts — **skip** full reverse-engineering unless repos diverged heavily.  
3. Run Construction on affected units only (`classic` / `feature` scope).

## Workflow completion

Approving **feedback-optimization** marks **end of AI-DLC workflow** for intent `260914-full-repo-scan`. Optional: run **`aidlc-outcomes-pack`** skill for `OUTCOMES.md` handover.
