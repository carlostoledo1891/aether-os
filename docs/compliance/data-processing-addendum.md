# Vero — Data Processing Addendum

**Purpose:** Describes what data Vero processes, how it is stored, retained, and deleted. Provides the foundation for customer data processing agreements. Supports GDPR Article 28, LGPD compliance, and enterprise procurement requirements.

**Last updated:** 2026-04-13  
**Data controller:** Customer (e.g., Meteoric Resources)  
**Data processor:** Vero Technologies

---

## 1. Data Categories

| Category | Examples | Source | Classification |
|----------|---------|--------|---------------|
| **Telemetry** | Plant flow rates, pH levels, temperature, equipment status | Simulation engine or LAPOC field instruments | Operational — not personal data |
| **Environmental** | Water quality (sulfate, nitrate), spring status, radiation levels, weather | Sensors, Open-Meteo, ECMWF ERA5 | Environmental monitoring — public interest |
| **Geological** | Drill collar coordinates, JORC resource estimates, deposit boundaries | ASX filings, field surveys | Commercially sensitive — issuer data |
| **Financial** | NPV scenarios, CAPEX, DSCR projections, market prices | PFS documents, BCB PTAX, Alpha Vantage | Commercially sensitive — issuer data |
| **Compliance** | Batch provenance, FEOC status, DPP field mappings, regulatory log | Platform-generated, regulatory filings | Compliance — auditable |
| **Audit Trail** | SHA-256 hash-chained events (actor, action, timestamp) | Platform-generated | Integrity-critical — append-only |
| **GeoJSON** | Licence polygons, APA boundaries, infrastructure, springs | Public records, issuer surveys, OSM | Mixed — public + commercially sensitive |
| **Chat** | AI analyst queries and responses, uploaded documents | User-generated | May contain CUI — handled per RBAC scope |

---

## 2. Data Storage

### Current Architecture (Pilot)

| Component | Storage | Location | Encryption at Rest |
|-----------|---------|----------|-------------------|
| API Server | SQLite (`better-sqlite3`) | Local file system (`/app/data/aether.db`) | Volume-level only |
| Frontend | Browser memory + `localStorage` (map style preference only) | Client device | Browser-managed |
| Engine | No persistent storage (stateless; pushes to API) | N/A | N/A |
| GeoJSON | Bundled in frontend build | CDN / static hosting | HTTPS transport |
| Chat uploads | In-memory with TTL | Server RAM | Not persisted to disk |

### Production Architecture (Planned)

| Component | Storage | Location | Encryption at Rest |
|-----------|---------|----------|-------------------|
| API Server | PostgreSQL (managed) | AWS/Azure region per customer | AES-256 (provider-managed or CMK) |
| Audit Trail | Append-only storage (S3 Object Lock / Azure Immutable Blobs) | Same region | AES-256 |
| File Storage | Object storage (S3/Blob) | Same region | AES-256 |
| Backup | Automated snapshots | Same region | AES-256 |

---

## 3. Sub-Processors

| Sub-Processor | Purpose | Data Shared | Location |
|---------------|---------|------------|----------|
| **Open-Meteo** | Weather data (current + forecast + ERA5 archive) | Site coordinates only (lat/lng) | EU (Open-Meteo servers) |
| **BCB (Banco Central)** | BRL/USD exchange rate | None (public API) | Brazil |
| **USGS** | Seismic event data | Site coordinates only | US |
| **Alpha Vantage** | Stock quote (MEI.AX) | Ticker symbol only | US |
| **Google (Gemini)** | AI chat analysis | Chat messages + context | Per Google AI terms |
| **MapTiler** | Map tiles (satellite, terrain) | Viewport coordinates | EU |
| **Vercel / Railway** | Application hosting (current) | All application data | US (current) |

**Note:** Sub-processor list will be updated when production hosting is selected. Customer will be notified 30 days before any sub-processor change.

---

## 4. Data Retention

| Data Type | Retention Period | Justification |
|-----------|-----------------|---------------|
| Telemetry (real-time) | 90 days in database; archived quarterly | Operational monitoring; regulatory reporting |
| Telemetry (historical) | Duration of contract + 7 years | Regulatory compliance (CONAMA, ANM RAL) |
| Audit trail | Duration of contract + 10 years | Legal and regulatory requirement |
| Geological / financial | Duration of contract + 7 years | ASX continuous disclosure; project finance |
| Chat history | 30 days | Operational; not compliance-critical |
| GeoJSON / spatial | Duration of contract | Updated with each deployment |
| Compliance batches | Duration of contract + 10 years | EU DPP, IRA/FEOC audit requirements |

---

## 5. Data Deletion

### Upon Contract Termination

1. **Customer notification:** Written notice of data deletion schedule (30 days)
2. **Data export:** Customer may request full data export in JSON format before deletion
3. **Deletion execution:** All customer data deleted from active systems within 30 days of contract end
4. **Backup purge:** All customer data deleted from backups within 90 days
5. **Confirmation:** Written confirmation of deletion provided to customer
6. **Exceptions:** Audit trail retained per regulatory requirements (Section 4) unless customer provides written waiver

### Data Subject Requests (LGPD / GDPR)

Vero processes minimal personal data. If personal data is identified:

1. **Access requests:** Fulfilled within 15 days (LGPD) / 30 days (GDPR)
2. **Deletion requests:** Processed within 15 days, subject to legal retention requirements
3. **Portability requests:** Data exported in JSON format
4. **Contact:** dpo@vero.earth (Data Protection Officer — to be appointed)

---

## 6. Data Residency

### Current
- Application hosted on Vercel (US) and Railway (US)
- No data residency guarantees at pilot stage

### Planned Options

| Region | Infrastructure | Availability |
|--------|---------------|-------------|
| **Brazil** | AWS São Paulo (sa-east-1) or Azure Brazil South | Q4 2026 |
| **United States** | AWS GovCloud (us-gov-west-1) or Azure Government | Q1 2027 |
| **European Union** | AWS Frankfurt (eu-central-1) or Azure West Europe | Q1 2027 |

Customer selects region at contract signing. Data does not leave the selected region except as specified in sub-processor table.

---

## 7. Security Measures

See `SECURITY.md` and `docs/compliance/nist-800-53-mapping.md` for full security control documentation.

Key measures applicable to data processing:

- API key authentication on all write endpoints
- SHA-256 audit chain with integrity verification
- Rate limiting (global + per-endpoint)
- CORS and CSP headers
- Non-root Docker containers with minimal capabilities
- SBOM and vulnerability scanning in CI
- Incident response plan with defined SLAs

---

## 8. Breach Notification

In the event of a data breach affecting customer data:

| Jurisdiction | Notification Timeline | Authority |
|-------------|----------------------|-----------|
| Brazil (LGPD) | 2 business days | ANPD (Autoridade Nacional de Proteção de Dados) |
| EU (GDPR) | 72 hours | Relevant supervisory authority |
| US (varies) | Per applicable state law | State AG / relevant authority |
| Australia (Privacy Act) | 30 days | OAIC |

Customer will be notified within 24 hours of breach confirmation, regardless of jurisdiction.

---

## 9. Amendments

This addendum may be updated to reflect:
- Changes in applicable law (LGPD, GDPR, Privacy Act)
- Changes in sub-processors (30-day advance notice)
- Changes in data residency options
- Changes in retention periods (with customer agreement)

Customer will be notified of material changes via email to the designated contact.
