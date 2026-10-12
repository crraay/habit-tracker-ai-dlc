# Cost analysis — full-repo-scan

Intent `260914-full-repo-scan` · **Qualitative TCO** for as-built stack. **No billing APIs** were called (FR2).

## Cost components

| Component | Model | Notes |
|-----------|--------|-------|
| **DigitalOcean droplet** | Fixed monthly VM | Single host for Postgres + backend + frontend |
| **Docker Hub** | Public pulls | No registry fee for pull-only droplet |
| **GitHub Actions** | Minutes on `main` / `workflow_dispatch` | U1/U2 `build-image`, U3 deploy |
| **Domain / TLS** | Optional operator cost | Not in compose repo |
| **AWS (legacy)** | EB/S3/CloudFront if still billed | **Not** current prod path |

## Optimization opportunities

| ID | Opportunity | Effort | Impact |
|----|-------------|--------|--------|
| CO-01 | Right-size droplet CPU/RAM vs actual usage | Low | Medium $ if over-provisioned |
| CO-02 | Prune unused Docker images on host | Low | Disk, indirect stability |
| CO-03 | Pin digests vs repeated `:latest` pulls | Medium | Predictability, not direct $ |
| CO-04 | Consolidate GHA (cache deps, skip redundant builds) | Medium | Fewer Action minutes |
| CO-05 | Single staging droplet shared for pre-prod | Medium | Avoid prod-only surprises (BL-INFRA-U3-06) |

## AWS Cost Explorer / Reserved Instances

**Not applicable** to Compose production path. Legacy AWS resources should be **inventory and decommission** in a separate ops intent if still incurring cost.

## FinOps posture

| Practice | Status |
|----------|--------|
| Budget alerts | **Not documented** in repo |
| Tagging for chargeback | **N/A** personal app |
| Spot/preemptible | **Not used** |

## Verdict

Costs are **dominated by one VPS** plus incidental CI; largest **engineering** ROI is reliability/test gates (U1 `build-image` tests) rather than cloud SKU tuning at current scale.
