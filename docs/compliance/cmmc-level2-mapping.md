# Vero — CMMC Level 2 Practice Mapping

**Purpose:** Maps Vero's security controls to CMMC (Cybersecurity Maturity Model Certification) Level 2 practices, which align with NIST SP 800-171 Rev 2. Required for DoD contractors handling Controlled Unclassified Information (CUI).

**Status:** Living document. Updated as controls are implemented.  
**Last updated:** 2026-04-13  
**Cross-reference:** `docs/compliance/nist-800-53-mapping.md` (overlapping controls)

---

## CMMC Level 2 Overview

CMMC Level 2 requires implementation of 110 practices from NIST SP 800-171, organized into 14 domains. Vero maps application-level controls below; infrastructure controls require a FedRAMP-authorized cloud partner.

**Key message:** Vero's architecture is designed for CMMC Level 2 deployment within an authorized cloud boundary. Application-level controls are implemented; infrastructure controls require a FedRAMP-authorized hosting partner (AWS GovCloud, Azure Government, or equivalent).

---

## Domain Summary

| Domain | Practices | App-Level Implemented | Infra-Required | Planned | N/A |
|--------|-----------|----------------------|----------------|---------|-----|
| AC — Access Control | 22 | 12 | 6 | 4 | 0 |
| AT — Awareness & Training | 3 | 1 | 0 | 2 | 0 |
| AU — Audit & Accountability | 9 | 7 | 1 | 1 | 0 |
| CM — Configuration Management | 9 | 7 | 1 | 1 | 0 |
| IA — Identification & Authentication | 11 | 5 | 3 | 3 | 0 |
| IR — Incident Response | 3 | 3 | 0 | 0 | 0 |
| MA — Maintenance | 6 | 0 | 4 | 0 | 2 |
| MP — Media Protection | 9 | 1 | 6 | 0 | 2 |
| PE — Physical & Environmental | 6 | 0 | 6 | 0 | 0 |
| PS — Personnel Security | 2 | 0 | 0 | 2 | 0 |
| RA — Risk Assessment | 3 | 3 | 0 | 0 | 0 |
| CA — Security Assessment | 4 | 2 | 1 | 1 | 0 |
| SC — System & Comms Protection | 16 | 10 | 4 | 2 | 0 |
| SI — System & Info Integrity | 7 | 6 | 0 | 1 | 0 |
| **Total** | **110** | **57** | **32** | **17** | **4** |

**Application-level coverage: 52% implemented, 29% infrastructure-dependent, 15% planned, 4% N/A**

---

## AC — Access Control (22 practices)

| Practice | Description | Status | Evidence |
|----------|-------------|--------|----------|
| AC.L2-3.1.1 | Limit system access to authorized users | Partial | API key auth on ingest/chat/alert/WS endpoints |
| AC.L2-3.1.2 | Limit system access to authorized functions | Partial | Endpoint-specific API keys (INGEST, CHAT, ADMIN, WS) |
| AC.L2-3.1.3 | Control CUI flow | Implemented | Data provenance system; disclosure mode; AetherDataService boundary |
| AC.L2-3.1.4 | Separate duties | Planned | RBAC design: `regulator.read`, `issuer.internal`, `community.public` |
| AC.L2-3.1.5 | Least privilege | Partial | Docker non-root (UID 1001), cap_drop ALL, read_only containers |
| AC.L2-3.1.7 | Prevent non-privileged users from executing privileged functions | Implemented | Mutation endpoints (ingest, alerts) require API key; read-only by default |
| AC.L2-3.1.8 | Limit unsuccessful logon attempts | Implemented | Rate limiting: 120/min global, 10/min chat, 60/min ingest |
| AC.L2-3.1.12 | Monitor and control remote access | Implemented | CORS allowlist, CSP headers, WebSocket token auth |
| AC.L2-3.1.13 | Employ cryptographic mechanisms for remote access | Partial | TLS at deployment layer; HTTPS enforced via CSP |
| AC.L2-3.1.14 | Route remote access via managed access control points | Implemented | All traffic routes through Fastify API; no direct database access |
| AC.L2-3.1.17 | Protect wireless access using authentication and encryption | Infra | Deployment-level control |
| AC.L2-3.1.20 | Verify and control connections to external systems | Implemented | Enricher APIs are explicitly configured and toggled via env vars |

---

## AU — Audit & Accountability (9 practices)

| Practice | Description | Status | Evidence |
|----------|-------------|--------|----------|
| AU.L2-3.3.1 | Create and retain system audit logs | Implemented | SHA-256 audit chain in `server/src/store/auditChain.ts` |
| AU.L2-3.3.2 | Ensure actions can be traced to individual users | Partial | Actor field in audit events; individual user IDs pending RBAC |
| AU.L2-3.3.3 | Review and update audit events | Implemented | `GET /api/audit` with type filter; `GET /api/audit/export` |
| AU.L2-3.3.4 | Alert on audit process failure | Planned | Audit chain verification detects tampering; automated alerting planned |
| AU.L2-3.3.5 | Correlate audit record review and reporting | Implemented | Audit events include `relatedEntityId` and `anchor_batch_id` for correlation |
| AU.L2-3.3.6 | Provide audit record reduction and report generation | Implemented | `/api/audit` supports type filtering; `/api/audit/export` for full chain |
| AU.L2-3.3.7 | Provide system capability for processing audit records | Implemented | `verifyChain()` validates integrity; REST API exposes audit data |
| AU.L2-3.3.8 | Protect audit information | Partial | Hash chain detects tampering; API auth on audit endpoints; SQLite (not WORM) |
| AU.L2-3.3.9 | Limit management of audit logging to privileged users | Implemented | Audit append is internal only (code-level); no external write API |

---

## CM — Configuration Management (9 practices)

| Practice | Description | Status | Evidence |
|----------|-------------|--------|----------|
| CM.L2-3.4.1 | Establish and maintain baseline configurations | Implemented | `shared/sites/caldeira.ts`, validated env schemas, feature flags |
| CM.L2-3.4.2 | Establish and enforce security configuration settings | Implemented | TypeScript strict, ESLint with a11y, Fastify schema validation |
| CM.L2-3.4.3 | Track, review, approve changes | Implemented | Git + CI pipeline + CODEOWNERS review gates |
| CM.L2-3.4.4 | Analyze security impact of changes | Partial | CI runs lint/test/build; security scanning in CI; no formal impact analysis process |
| CM.L2-3.4.5 | Define and enforce access restrictions for change | Implemented | CODEOWNERS on security-sensitive paths; branch protection |
| CM.L2-3.4.6 | Least functionality | Implemented | Docker cap_drop ALL, read_only, Alpine base, feature flags |
| CM.L2-3.4.7 | Restrict, disable, prevent nonessential programs | Implemented | Minimal Docker images; no unnecessary services |
| CM.L2-3.4.8 | Apply deny-by-exception policy | Partial | Ingest fails closed in production; feature flags default-on with explicit disable |
| CM.L2-3.4.9 | Control user-installed software | Infra | Deployment-level control |

---

## SI — System & Information Integrity (7 practices)

| Practice | Description | Status | Evidence |
|----------|-------------|--------|----------|
| SI.L2-3.14.1 | Identify, report, correct system flaws | Implemented | Grype vuln scanning, npm audit, Dependabot |
| SI.L2-3.14.2 | Protect against malicious code | Implemented | ESLint, TypeScript strict, CSP, input validation |
| SI.L2-3.14.3 | Monitor security alerts | Implemented | Dependabot alerts, Grype CI reports, SECURITY.md |
| SI.L2-3.14.4 | Update malicious code protection | Implemented | Automated dependency updates via Dependabot |
| SI.L2-3.14.6 | Monitor system for unauthorized access | Implemented | Rate limiting, API key auth, audit trail, alert system |
| SI.L2-3.14.7 | Identify unauthorized use | Implemented | Auth failure logging, rate limit enforcement, connection monitoring |
| SI.L2-3.14.8 | Monitor inbound/outbound communications | Planned | Application-level logging exists; SIEM integration planned |

---

## Assessment Readiness Timeline

| Phase | Activities | Timeline | Dependencies |
|-------|-----------|----------|-------------|
| **Current** | Application controls mapped (this document) | Done | — |
| **Phase 1** | Select cloud partner (AWS GovCloud / Azure Gov) | Q3 2026 | Series A fundraise |
| **Phase 2** | Implement infrastructure controls | Q4 2026 | Cloud partner selected |
| **Phase 3** | RBAC implementation | Q4 2026 | Phase 2 |
| **Phase 4** | Engage C3PAO for readiness assessment | Q1 2027 | Phases 1-3 |
| **Phase 5** | Remediation and formal assessment | Q2 2027 | Phase 4 |
| **Target** | CMMC Level 2 certification | H2 2027 | All phases |

**Estimated cost:** $150k-$300k (C3PAO assessment + remediation + cloud infrastructure)

---

## SBIR/STTR Alignment

CMMC Level 2 mapping directly supports SBIR Phase II applications for DoD critical mineral supply chain technology. The mapped controls demonstrate Vero's readiness to operate within the DoD contractor ecosystem upon completion of infrastructure-level controls.

See `docs/compliance/sbir-readiness.md` for active solicitation alignment.
