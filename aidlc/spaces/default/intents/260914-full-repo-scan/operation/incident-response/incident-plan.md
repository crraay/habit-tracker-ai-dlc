# Incident response plan — full-repo-scan

Intent `260914-full-repo-scan` · **Personal-scale production** on a single Compose host. **No AWS Incident Manager** integration.

## Sources

- Operation phase guardrails (post-incident review for P1/P2)
- `escalation-matrix.md`, `runbooks.md`

## Scope

| In scope | Out of scope |
|----------|--------------|
| Compose prod outage, deploy failure, data/DB incidents | AWS legacy EB/S3 paths |
| Auth misconfiguration, secret rotation | Enterprise SOC2 audit program |
| Scheduler/streak user-visible bugs treated as incidents when prod broken | Feature requests |

## Severity definitions

| Level | Definition | Example | Target response |
|-------|------------|---------|-----------------|
| **P1** | Production unusable for all users | Site down, login impossible, data loss | Same day; all hands operator + dev |
| **P2** | Major degradation | Track broken, widespread 5xx | Same day investigation |
| **P3** | Minor / single-user | One timezone edge case | Next maintenance window |
| **P4** | Cosmetic / non-prod | Local dev only | Backlog |

No contractual SLA — targets are **best effort**.

## Roles

| Role | Responsibility |
|------|----------------|
| **Operator** | First responder, SSH, compose, rollback, user comms |
| **Developer** | Code fix, image rebuild, Flyway, domain correctness |
| **Product owner** | Prioritize fix vs rollback (same person may overlap) |

No dedicated incident commander rotation.

## Incident lifecycle

```text
Detect → Triage → Mitigate → Resolve → Communicate → (Post-incident if P1/P2)
```

| Phase | Actions |
|-------|---------|
| **Detect** | User report, operator check, failed GHA deploy |
| **Triage** | Assign P1–P4; open private notes or GitHub issue |
| **Mitigate** | Run matching runbook; rollback if post-deploy |
| **Resolve** | Smoke green; monitor logs 30–60 min |
| **Communicate** | Direct message to affected users if extended outage |
| **Post-incident** | See template below for P1/P2 |

## Communication procedures

| Audience | Channel | When |
|----------|---------|------|
| Users | Email / chat direct | P1 lasting > 30 min or data impact |
| Developer | Phone/chat/GitHub | Any P1/P2 |
| Public status page | — | **Not configured** |

Do not post secrets, JWTs, or full `.env` in tickets.

## RTO / RPO (qualitative)

| Objective | Stance (NFR5.8–5.10) |
|-----------|----------------------|
| **RTO** | Redeploy known-good images + healthy Postgres volume; hours acceptable |
| **RPO** | Last manual backup if implemented; else state at last good volume snapshot |

See `rollback-runbook.md` and **RB-05** for database recovery.

## Post-incident review template (P1/P2)

Use after stabilization:

1. **Timeline** — detect, mitigate, resolve (UTC).  
2. **Impact** — users affected, data scope.  
3. **Root cause** — technical and contributing factors.  
4. **What went well / poorly**  
5. **Action items** — owner, due date (link BL-* backlog IDs).  
6. **Follow-up** — update runbook if gap found.

Store notes in team wiki or `aidlc/spaces/default/knowledge/` if the team creates ops knowledge.

## Disaster recovery (single host)

| Scenario | Procedure |
|----------|-----------|
| Droplet loss | Provision new host; restore DOCKER.md setup; restore Postgres volume from backup; redeploy compose |
| Region/provider outage | Wait or migrate provider — **not automated** |
| AWS Backup | **N/A** on Compose path |

## Training / drills

| Activity | FR2 status |
|----------|------------|
| Tabletop exercise | **Not run** this intent |
| Game day | **Optional** future — operator manual smoke after deploy |
