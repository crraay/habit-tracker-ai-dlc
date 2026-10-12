# Drift report — full-repo-scan

Intent `260914-full-repo-scan` · Compares **documented as-built** vs **intent scan findings**. No AWS Config or live droplet audit (FR2).

## Method

Desk review of sibling repos + Operation/Construction artifacts under `260914-full-repo-scan`.

## Configuration drift (CI / quality)

| Area | Expected (team/project rules) | Observed in scan | Drift |
|------|------------------------------|------------------|-------|
| U1 prod image build | `mvn test` or full build-and-test on `main` | `build-image` may skip tests | **Yes — gap** |
| U2 prod image build | `npm run test:ci` on `main` | Aligned in workflow scan | **No** |
| U3 deploy | Compose path only | Documented SSH workflow | **No** |
| Legacy AWS deploy | Do not extend | Workflows may still exist in U1/U2 | **Latent** (unused) |

## Infrastructure drift (runtime vs git)

| Area | Source of truth | Drift detection |
|------|-----------------|-----------------|
| Compose stack | U3 `docker-compose.yml` on droplet after `git pull` | Manual `git rev-parse HEAD` vs expected |
| `.env` on host | Operator-managed | **Not in git** — drift invisible to CI |
| Hub `:latest` tags | Moving target | Image digest not recorded on deploy |

## Documentation drift

| Artifact set | Status |
|--------------|--------|
| CodeKB (3 units) | Updated during reverse-engineering |
| Operation runbooks | Authored this intent; must be **maintained** when ops change |
| `docs/domain.md` | Canonical — app code must not silently diverge |

## Security / compliance drift

| Control | Documented | Automated check |
|---------|------------|-----------------|
| Secrets in git | Forbidden | Manual review |
| JWT in logs | Forbidden | No SAST gate in CI |
| CVE scan | Backlog | **Not in CI** |

## Remediation priorities

1. Close U1 **test gate on build-image** (highest deploy-risk drift).  
2. Record image **digest** on deploy (rollback + traceability).  
3. SSH **key-based** auth for U3 workflow.  
4. Periodic manual reconcile: droplet compose commit vs GitHub `main`.

## Verdict

| Verdict | Detail |
|---------|--------|
| **Actionable drift** | CI test skip on U1 release path; moving `:latest` tags; host `.env` out of band |
| **No drift** | Three-repo Compose production model matches team affirmed practices |
