# Vero — Incident Response Plan

**Purpose:** Defines procedures for identifying, containing, eradicating, and recovering from security incidents affecting the Vero platform. Satisfies NIST 800-53 IR family and SOC 2 CC7.3/CC7.4 criteria.

**Last updated:** 2026-04-13  
**Plan owner:** Carlos Toledo (Founder & Technical Lead)  
**Review cadence:** Quarterly or after any P1/P2 incident

---

## 1. Severity Classification

| Level | Name | Description | Examples | SLA |
|-------|------|-------------|----------|-----|
| **P1** | Critical | Active breach, data exfiltration, or complete service unavailability | Unauthorized data access, audit chain tampering, API key compromise | Acknowledge: 1 hr, Mitigate: 4 hr |
| **P2** | High | Significant security vulnerability or partial service degradation | Unauthenticated endpoint exposed, dependency with critical CVE, persistent rate limit bypass | Acknowledge: 4 hr, Mitigate: 24 hr |
| **P3** | Medium | Security misconfiguration or moderate vulnerability | CSP bypass, information disclosure in error messages, non-critical dependency vulnerability | Acknowledge: 24 hr, Mitigate: 5 business days |
| **P4** | Low | Minor security improvement or informational finding | Informational header missing, cosmetic security enhancement | Acknowledge: 5 business days, Fix: next sprint |

---

## 2. Incident Response Team

| Role | Person | Contact | Backup |
|------|--------|---------|--------|
| **Incident Commander** | Carlos Toledo | security@vero.earth | Juliano Dutra |
| **Technical Lead** | Carlos Toledo | — | Leo (Full-Stack Dev) |
| **Communications** | Guilherme Bonifácio | — | Carlos Toledo |
| **Scientific Advisor** | Dr. Heber Caponi | — | (for field data incidents) |

---

## 3. Detection & Identification

### Automated Detection
- **Audit chain integrity:** `GET /api/audit/verify-chain` — detects any tampering with the append-only hash chain
- **Rate limit violations:** Fastify rate limiting logs excessive requests
- **CI vulnerability scanning:** Grype detects known CVEs on every build
- **Dependency alerts:** Dependabot flags vulnerable dependencies
- **Connection monitoring:** WebSocket connection limits and auth failures

### Manual Detection Channels
- **Security email:** security@vero.earth (see `SECURITY.md`)
- **GitHub Security Advisories:** Private vulnerability reporting enabled
- **Team reports:** Any team member can escalate via direct communication

### Triage Process
1. Assess severity using the classification table above
2. Assign Incident Commander (default: Carlos)
3. Create incident record in audit trail
4. Begin containment procedures based on severity

---

## 4. Containment Procedures

### Immediate (P1/P2)
1. **Isolate affected component** — if API server: rotate `INGEST_API_KEY` and restart; if engine: stop engine process
2. **Revoke compromised credentials** — rotate all API keys if key compromise suspected
3. **Enable maintenance mode** — if needed, return 503 on all endpoints with honest banner
4. **Preserve evidence** — export audit chain (`GET /api/audit/export`), capture logs, snapshot database

### Short-term (all severities)
1. **Identify root cause** — review audit trail, server logs, CI scan results
2. **Assess blast radius** — which data, which users, which time window
3. **Implement temporary fix** — patch, configuration change, or feature flag disable
4. **Verify containment** — confirm the vulnerability is no longer exploitable

---

## 5. Eradication & Recovery

### Eradication
1. Deploy permanent fix (code change, dependency update, configuration hardening)
2. Verify fix via automated tests (add regression test for the vulnerability)
3. Run full CI pipeline: lint, TypeScript strict, full test suite, security scan
4. Verify audit chain integrity post-fix

### Recovery
1. Restore normal operations
2. Monitor for recurrence (24-48 hours elevated monitoring)
3. Verify data integrity — run `GET /api/audit/verify-chain`
4. Communicate resolution to affected parties

---

## 6. Post-Incident Review

Within 5 business days of resolution:

1. **Timeline reconstruction** — what happened, when, how detected, how resolved
2. **Root cause analysis** — why did the vulnerability exist, why wasn't it caught earlier
3. **Impact assessment** — what data was affected, what users were impacted
4. **Lessons learned** — what went well, what could improve
5. **Action items** — specific improvements with owners and deadlines

Document in `docs/compliance/incident-log.md` (create if first incident).

---

## 7. Communication Templates

### Internal (P1/P2)
```
Subject: [INCIDENT-{severity}] {brief description}
Time detected: {timestamp}
Severity: P{level}
Status: {Investigating | Contained | Resolved}
Impact: {description of affected systems/data}
Next update: {time}
Incident Commander: {name}
```

### External (if customer data affected)
```
Subject: Security Notice — Vero Platform

We are writing to inform you of a security incident that affected the Vero platform.

What happened: {description}
When: {timeframe}
What data was involved: {scope}
What we have done: {actions taken}
What you should do: {customer actions, if any}

We take the security of your data seriously. For questions, contact security@vero.earth.
```

### Regulatory (if required)
Follow applicable notification requirements:
- LGPD (Brazil): 2 business days to ANPD
- GDPR (EU): 72 hours to supervisory authority
- State breach notification laws (US): varies by state

---

## 8. Plan Testing

| Activity | Frequency | Last Completed | Next Scheduled |
|----------|-----------|---------------|----------------|
| Tabletop exercise | Quarterly | — | Q3 2026 |
| Audit chain verification | Weekly (automated) | Continuous | Continuous |
| Dependency scan review | Per CI build | Every push | Every push |
| Plan review and update | Quarterly | 2026-04-13 | 2026-07-13 |

---

## 9. Related Documents

- [SECURITY.md](../../SECURITY.md) — Responsible disclosure policy
- [NIST 800-53 Mapping](nist-800-53-mapping.md) — IR family control mapping
- [Data Processing Addendum](data-processing-addendum.md) — Data handling and retention
