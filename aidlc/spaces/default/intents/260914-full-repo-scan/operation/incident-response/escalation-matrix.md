# Escalation matrix — full-repo-scan

Intent `260914-full-repo-scan` · **No 24/7 paging** or vendor SOC. Contacts are **roles**, not named individuals in repo.

## Sources

- `incident-plan.md` severity table
- `team.md` — operator-managed production

## Escalation paths

| Severity | First responder | Escalate to | When to escalate | Max wait before escalate |
|----------|-----------------|-------------|------------------|--------------------------|
| **P1** | Operator | Developer (+ product owner if separate) | Immediately if mitigations fail in 30 min | 30 min |
| **P2** | Operator | Developer | After initial runbook without resolution | 4 hours |
| **P3** | Operator | Developer (async) | If root cause needs code change | Next business day |
| **P4** | Developer | — | Backlog only | — |

## Contact channels (fill at team level)

| Role | Channel | Notes |
|------|---------|-------|
| Operator | _[team: phone/chat]_ | SSH + GHA access |
| Developer | _[team: phone/chat/GitHub]_ | U1/U2/U3 repos |
| Product owner | _[team: chat]_ | Rollback vs fix tradeoff |

Repo intentionally omits PII — maintain live contacts in password manager or team doc outside git.

## External escalation

| Party | Trigger | Status |
|-------|---------|--------|
| DigitalOcean support | Host/network unreachable | Provider ticket |
| Docker Hub | Registry outage blocking pull | Status page |
| GitHub Support | Actions platform outage | Status page |
| Law enforcement / breach counsel | Confirmed data breach | **Not defined** — operator judgment |

## On-call rotation

| Model | Status |
|-------|--------|
| PagerDuty / Opsgenie schedule | **Not configured** |
| Follow-the-sun | **Not configured** |
| Single owner | **De facto** for personal app |

## Automated escalation

| Mechanism | Routes to | Status |
|-----------|-----------|--------|
| CloudWatch → SNS | — | Not used |
| GHA failure email | Developer (GitHub prefs) | **Passive** |
| Health alarm → page | — | **Not configured** (see `observability-setup/alarms.md`) |

## Severity upgrade rules

- **Upgrade to P1** if data loss suspected, auth bypass confirmed, or outage > 1 hour.  
- **Downgrade** only after smoke pass and 30 min stable logs.

## Related documents

| Document | Use |
|----------|-----|
| `runbooks.md` | Technical steps |
| `rollback-runbook.md` | Release rollback |
| `log-queries.md` | Investigation |
