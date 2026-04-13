# Vero — NIST 800-53 Rev 5 Control Mapping

**Purpose:** Maps Vero's security controls to NIST SP 800-53 Revision 5 control families. FedRAMP authorization is built on this framework. This document supports the "FedRAMP-ready architecture" claim by demonstrating control awareness and implementation at the application layer.

**Status:** Living document. Updated as controls are implemented.  
**Last updated:** 2026-04-13  
**Applicable system:** Vero Platform (aether-os) — API Server, Simulation Engine, Frontend

---

## Control Family Summary

| Family | ID | Status | Controls Implemented | Controls Planned | N/A |
|--------|----|--------|---------------------|------------------|-----|
| Access Control | AC | Partial | 8 | 5 | 2 |
| Audit & Accountability | AU | Implemented | 7 | 2 | 0 |
| Configuration Management | CM | Partial | 6 | 3 | 0 |
| Identification & Authentication | IA | Partial | 4 | 4 | 1 |
| Incident Response | IR | Documented | 5 | 2 | 0 |
| Risk Assessment | RA | Partial | 3 | 2 | 0 |
| System & Comms Protection | SC | Partial | 7 | 4 | 0 |
| System & Info Integrity | SI | Partial | 6 | 3 | 0 |

---

## AC — Access Control

### AC-1: Policy and Procedures
- **Status:** Implemented
- **Evidence:** `SECURITY.md` (security policy), `CONTRIBUTING.md` (development procedures), `CODEOWNERS` (access governance)

### AC-2: Account Management
- **Status:** Planned (RBAC roadmap)
- **Current:** API key-based authentication; no user accounts. See `docs/architecture/rbac-design.md` for planned scope model (`regulator.read`, `issuer.internal`, `community.public`).

### AC-3: Access Enforcement
- **Status:** Partial
- **Evidence:** `server/src/index.ts` — `onRequest` hook enforces API key on `/ingest/*` and `/api/chat` paths. Production fails closed when `INGEST_API_KEY` is unset (line 99-110). Alert mutations require `ADMIN_API_KEY` (`server/src/routes/domain.ts` line 348-368).
- **Gap:** Read-only domain endpoints are unauthenticated. RBAC will gate these per scope.

### AC-4: Information Flow Enforcement
- **Status:** Implemented
- **Evidence:** Data flows through `AetherDataService` boundary (`src/services/dataService.ts`). Mock vs. live data paths are architecturally separated via `getDataMode()` (`src/config/env.ts`). Provenance tags on every data point prevent flow confusion.

### AC-6: Least Privilege
- **Status:** Partial
- **Evidence:** API key separation — `INGEST_API_KEY`, `CHAT_API_KEY`, `ADMIN_API_KEY`, `WS_API_KEY` are distinct secrets with different endpoint scope. Docker containers run as non-root user `vero` (UID 1001).
- **Gap:** No fine-grained RBAC within authenticated sessions.

### AC-7: Unsuccessful Logon Attempts
- **Status:** Implemented
- **Evidence:** Rate limiting via `@fastify/rate-limit` — global 120 req/min, chat 10/min, ingest 60/min. Failed auth returns 401 without revealing key details.

### AC-17: Remote Access
- **Status:** Implemented
- **Evidence:** All access is remote (API/WebSocket). CORS restricts origins (`server/src/index.ts` line 36-39). CSP headers restrict resource loading (`vercel.json`). WebSocket requires token in production (`server/src/ws/telemetryChannel.ts`).

### AC-22: Publicly Accessible Content
- **Status:** Implemented
- **Evidence:** Data honesty system (`getDataContext()`) explicitly labels all content provenance. Disclosure mode hides simulated data for IR-safe presentations. Banner system surfaces data context on every session.

---

## AU — Audit & Accountability

### AU-2: Event Logging
- **Status:** Implemented
- **Evidence:** SHA-256 append-only audit chain (`server/src/store/auditChain.ts`). Events logged: telemetry ingestion, DPP exports, regulatory bundle access, audit chain verification, alert dismissals, authentication failures.

### AU-3: Content of Audit Records
- **Status:** Implemented
- **Evidence:** Each audit event contains: `event_id`, `sequence`, `timestamp`, `type`, `actor`, `action`, `detail`, `payload_hash`, `prev_hash`, `chain_hash`, `relatedEntityId`, `anchor_batch_id`. Schema in `server/src/store/auditChain.ts`.

### AU-6: Audit Record Review
- **Status:** Implemented
- **Evidence:** `GET /api/audit` — filterable by type. `GET /api/audit/:eventId` — individual event inspection. `GET /api/audit/export` — full chain download for assessor review.

### AU-9: Protection of Audit Information
- **Status:** Partial
- **Evidence:** Audit chain uses SHA-256 hash linking — tampering with any event breaks the chain, detectable via `GET /api/audit/verify-chain`. API authentication required on audit endpoints in production.
- **Gap:** SQLite storage is not WORM. Production deployment should use append-only storage (S3 Object Lock, Azure Immutable Blobs) — infrastructure-level control.

### AU-10: Non-Repudiation
- **Status:** Implemented
- **Evidence:** `chain_hash` and `payload_hash` fields provide cryptographic non-repudiation. `verifyChain()` validates the entire sequence integrity.

### AU-11: Audit Record Retention
- **Status:** Planned
- **Evidence:** Currently retained indefinitely in SQLite. Retention policy documented in `docs/compliance/data-processing-addendum.md`. Production should implement configurable retention with archival to immutable storage.

### AU-12: Audit Record Generation
- **Status:** Implemented
- **Evidence:** `appendAuditEvent()` called from ingest hooks, export routes, and alert actions. Events are automatically sequenced and hash-chained.

---

## CM — Configuration Management

### CM-1: Policy and Procedures
- **Status:** Implemented
- **Evidence:** `CONTRIBUTING.md` (development standards), quality gate checklist (TypeScript strict, ESLint, Vitest), `CODEOWNERS` for review gates.

### CM-2: Baseline Configuration
- **Status:** Implemented
- **Evidence:** `shared/sites/caldeira.ts` — single source of truth for site configuration. `src/config/env.ts` — validated environment configuration. `server/src/validateEnv.ts` — startup validation with production enforcement.

### CM-3: Configuration Change Control
- **Status:** Implemented
- **Evidence:** Git version control. CI pipeline (`.github/workflows/ci.yml`) gates: lint, TypeScript strict, full test suite, security scan, build. Pre-commit hooks enforce lint on staged files. `CODEOWNERS` requires founder review on security-sensitive paths.

### CM-6: Configuration Settings
- **Status:** Implemented
- **Evidence:** Feature flags (`src/config/features.ts`) — all features default-on unless explicitly disabled via `VITE_FEATURE_*` env vars. Data mode, presentation mode, disclosure mode controlled via env vars with explicit validation.

### CM-7: Least Functionality
- **Status:** Implemented
- **Evidence:** Docker containers run with `cap_drop: ALL` and only `NET_BIND_SERVICE` added where needed. `read_only: true` on containers. Alpine base images minimize attack surface.

### CM-8: Information System Component Inventory
- **Status:** Implemented
- **Evidence:** SBOM generated via Syft (CycloneDX format) on every CI build. Vulnerability scanning via Grype. `GET /api/security/sbom-summary` exposes summary. Full SBOM artifacts available as CI pipeline artifacts.

---

## IA — Identification & Authentication

### IA-2: Identification and Authentication (Organizational Users)
- **Status:** Partial
- **Evidence:** API key authentication on protected endpoints. Keys are per-function: `INGEST_API_KEY`, `CHAT_API_KEY`, `ADMIN_API_KEY`, `WS_API_KEY`.
- **Gap:** No individual user identity. RBAC design (`docs/architecture/rbac-design.md`) specifies JWT/OIDC integration roadmap.

### IA-5: Authenticator Management
- **Status:** Partial
- **Evidence:** API keys transmitted via `x-api-key` header (not URL params except WebSocket `?token=`). Keys are never logged. Error messages don't reveal key values.
- **Gap:** No key rotation mechanism. No key expiry. Planned as part of RBAC implementation.

### IA-8: Identification and Authentication (Non-Organizational Users)
- **Status:** Planned
- **Evidence:** Community and regulator access scopes defined in RBAC design. `community.public` scope will provide read-only access to monitoring data without exposing competitive details.

---

## IR — Incident Response

### IR-1: Policy and Procedures
- **Status:** Implemented
- **Evidence:** `docs/compliance/incident-response.md` — severity classification, response timelines, escalation paths, post-incident review process.

### IR-4: Incident Handling
- **Status:** Implemented
- **Evidence:** Alert system with threshold-based detection (`PlantTelemetry` and `EnvTelemetry` thresholds in `shared/sites/caldeira.ts`). Alert lifecycle tracking with dismiss/acknowledge actions. Error boundaries on every data consumer in the frontend.

### IR-5: Incident Monitoring
- **Status:** Implemented
- **Evidence:** Real-time telemetry monitoring via 2s tick system. Connection-aware banners (live/degraded/offline). Alert panel with severity classification. Audit trail records all security-relevant events.

### IR-6: Incident Reporting
- **Status:** Documented
- **Evidence:** `SECURITY.md` — responsible disclosure policy with SLA (48hr acknowledgement, 5-day assessment, 10-day resolution timeline).

### IR-8: Incident Response Plan
- **Status:** Implemented
- **Evidence:** `docs/compliance/incident-response.md` — full incident response plan with severity matrix, roles, procedures, and communication templates.

---

## RA — Risk Assessment

### RA-1: Policy and Procedures
- **Status:** Implemented
- **Evidence:** Executive Risk tab in the platform surfaces top-decile risks with owners and mitigations. Persona-driven development process uses 9 stakeholder personas as acceptance criteria.

### RA-3: Risk Assessment
- **Status:** Implemented
- **Evidence:** `GET /api/risks` — risk register with severity, likelihood, impact, owner, and mitigation. Persona evaluation framework (v15, 9.4/10 weighted score) provides continuous product risk assessment.

### RA-5: Vulnerability Monitoring and Scanning
- **Status:** Implemented
- **Evidence:** Grype vulnerability scanning in CI pipeline. `npm audit --audit-level=high` in CI. Dependabot for automated dependency updates.

---

## SC — System & Communications Protection

### SC-1: Policy and Procedures
- **Status:** Implemented
- **Evidence:** `SECURITY.md` documents security architecture, known boundaries, and compliance roadmap.

### SC-5: Denial-of-Service Protection
- **Status:** Implemented
- **Evidence:** Rate limiting at multiple tiers: global (120/min), ingest (60/min), chat (10/min), upload (5/min). WebSocket connection limit (100 max). Fastify's built-in request parsing limits.

### SC-7: Boundary Protection
- **Status:** Implemented
- **Evidence:** Three-process architecture provides natural segmentation: Engine → API (HTTP only, unidirectional), API → Frontend (REST + WebSocket). CORS restricts frontend origins. CSP headers restrict resource loading. Ingest endpoints are API-key gated.

### SC-8: Transmission Confidentiality and Integrity
- **Status:** Partial
- **Evidence:** TLS termination at deployment layer (Vercel, Railway, nginx). Application enforces HTTPS via CSP and deployment headers.
- **Gap:** Node.js application does not terminate TLS directly. Infrastructure-level control.

### SC-12: Cryptographic Key Establishment and Management
- **Status:** Partial
- **Evidence:** SHA-256 used for audit chain integrity. API keys managed via environment variables.
- **Gap:** No HSM, no KMS integration. Keys are static secrets. Planned for enterprise deployment.

### SC-13: Cryptographic Protection
- **Status:** Partial
- **Evidence:** SHA-256 hash chain for audit integrity. HTTPS for transport. No encryption at rest in application layer (SQLite).
- **Gap:** At-rest encryption requires SQLCipher or migration to Postgres with TDE. Infrastructure-level volume encryption recommended.

### SC-28: Protection of Information at Rest
- **Status:** Planned
- **Evidence:** Currently relies on deployment-level volume encryption. Application-level encryption at rest planned for enterprise tier (SQLCipher or Postgres with TDE).

---

## SI — System & Information Integrity

### SI-2: Flaw Remediation
- **Status:** Implemented
- **Evidence:** Dependabot for automated dependency updates. Grype vulnerability scanning in CI. `npm audit` in CI pipeline.

### SI-3: Malicious Code Protection
- **Status:** Implemented
- **Evidence:** ESLint with security-relevant rules. TypeScript strict mode prevents common injection patterns. CSP headers prevent XSS. Input validation via Fastify schema.

### SI-4: System Monitoring
- **Status:** Implemented
- **Evidence:** 2s telemetry tick with threshold monitoring. Alert system with severity classification. Audit trail records security events. Connection-aware banners detect degraded states.

### SI-5: Security Alerts, Advisories, and Directives
- **Status:** Implemented
- **Evidence:** Dependabot alerts for dependency vulnerabilities. Grype scan results in CI. `SECURITY.md` provides disclosure channel.

### SI-10: Information Input Validation
- **Status:** Implemented
- **Evidence:** Fastify schema validation on route parameters. Multipart upload size limits (10 MB). Rate limiting prevents abuse. `server/src/validateEnv.ts` validates configuration at startup.

### SI-12: Information Output Handling and Retention
- **Status:** Implemented
- **Evidence:** Data provenance system tags every output with source and confidence level. Disclosure mode filters simulated data for IR-safe presentations. TTL=0 on geological/financial endpoints prevents stale data.

---

## Infrastructure-Level Controls (Deployment Partner Responsibility)

The following control families require infrastructure-level implementation and are the responsibility of the cloud hosting partner (e.g., AWS GovCloud, Azure Government):

| Family | Control | Requirement | Vero Application Support |
|--------|---------|------------|------------------------|
| PE | Physical Protection | Data center security | N/A — cloud provider |
| CP | Contingency Planning | DR, backup | Application supports stateless deployment; SQLite data backed up via volume snapshots |
| MA | Maintenance | System maintenance windows | Application supports zero-downtime deployment via health checks |
| MP | Media Protection | Media sanitization | No removable media; data in SQLite volumes |
| PS | Personnel Security | Background checks | Organizational control |
| SA | System & Services Acquisition | Supply chain | SBOM provides software supply chain transparency |

---

## FedRAMP Authorization Path

1. **Current:** Application-level controls implemented and mapped (this document)
2. **Next:** Select FedRAMP-authorized cloud partner (AWS GovCloud or Azure Government)
3. **Next:** Engage 3PAO (Third-Party Assessment Organization) for readiness assessment
4. **Next:** Complete System Security Plan (SSP) with infrastructure partner
5. **Target:** FedRAMP Tailored (Li-SaaS) authorization — appropriate for low-impact SaaS

**Estimated timeline:** 12-18 months from engagement with cloud partner  
**Estimated cost:** $200k-$500k (3PAO assessment + remediation)  
**Prerequisite:** Series A fundraise to fund the authorization process
