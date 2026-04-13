# Vero — SBIR/STTR Readiness

**Purpose:** Identifies active and upcoming SBIR/STTR solicitations aligned with Vero's capabilities in critical mineral supply chain transparency, environmental monitoring, and compliance automation.

**Last updated:** 2026-04-13  
**Status:** Pre-application — topic alignment and technical abstract drafted

---

## 1. Why SBIR/STTR

The Small Business Innovation Research (SBIR) and Small Business Technology Transfer (STTR) programs are the smart entry path to DoD and federal technology markets for pre-revenue startups. Key advantages:

- **Non-dilutive funding:** Phase I ($50k-$275k), Phase II ($500k-$1.75M)
- **No equity exchange:** Government retains limited data rights, not ownership
- **Credibility signal:** SBIR/STTR awards validate technology for defense primes
- **Pipeline to procurement:** Phase III leads to sole-source contracting

---

## 2. Aligned Solicitations & Topics

### DoD — Critical Minerals & Supply Chain

| Topic | Agency | Alignment | Vero Relevance |
|-------|--------|-----------|----------------|
| **Critical Mineral Supply Chain Visibility** | DLA / OUSD(A&S) | High | Vero provides end-to-end traceability from mine to product with SHA-256 audit chain, DPP export, and FEOC verification |
| **Defense Supply Chain Resilience** | DoD-wide | High | Real-time monitoring of critical mineral production with predictive environmental intelligence and ESG compliance |
| **Responsible Sourcing Technology** | DLA | High | Provenance tracking, data honesty system, regulatory compliance automation (IRA FEOC, EU DPP) |
| **Environmental Monitoring for Defense Installations** | DoD / ESTCP | Medium | Hydro digital twin, spring monitoring, water quality sensors, predictive climate modeling (Open-Meteo + ERA5) |

### DOE — Energy & Critical Materials

| Topic | Agency | Alignment | Vero Relevance |
|-------|--------|-----------|----------------|
| **Critical Minerals Processing Technology** | DOE AMO | High | LAPOC instrument integration, process monitoring, pilot plant digital twin |
| **Rare Earth Element Recovery** | DOE EERE | High | REE ionic clay processing monitoring, traceability, environmental compliance |
| **Clean Energy Supply Chain** | DOE LPO | Medium | Carbon intensity tracking, Scope 3 monitoring, green premium pricing |

### NSF — Technology Translation

| Topic | Agency | Alignment | Vero Relevance |
|-------|--------|-----------|----------------|
| **Partnerships for Innovation (PFI)** | NSF | Medium | University partnership (LAPOC) + industry partner (Meteoric) + technology innovation |

---

## 3. Technical Abstract Draft

**Title:** Vero: An AI-Powered Trust Layer for Critical Mineral Supply Chain Compliance and Environmental Monitoring

**Technical Abstract** (~500 words)

The United States faces a strategic vulnerability in critical mineral supply chains, particularly for rare earth elements (REE) essential to defense systems, clean energy infrastructure, and advanced electronics. Current supply chain monitoring relies on manual reporting, disconnected data systems, and retrospective compliance verification. This creates blind spots that adversely affect national security assessments, trade compliance (IRA FEOC), and environmental stewardship.

Vero addresses this gap as a B2B SaaS platform providing real-time supply chain transparency for critical mineral operations. The platform integrates three core capabilities: (1) environmental digital twin monitoring with predictive intelligence, (2) molecular-level batch traceability with cryptographic audit chains, and (3) automated regulatory compliance mapping across US, EU, and Brazilian frameworks.

**Technical Innovation.** Vero's architecture introduces a novel "data honesty" paradigm where every data point carries machine-readable provenance tags indicating its source and confidence level (verified_real, modeled, ai_predicted, simulated, from_public_record, issuer_attested). This transparency is critical in regulated environments where data lineage determines compliance validity. The platform's SHA-256 append-only audit chain provides non-repudiation and tamper evidence for every data event, from sensor ingestion through to Digital Product Passport (DPP) export.

**Environmental Intelligence.** The hydro digital twin integrates real-time sensor data with 16-day weather forecasts (Open-Meteo) and 5-year climate baselines (ECMWF ERA5) to predict environmental conditions affecting production and compliance. This predictive capability enables proactive environmental management rather than reactive incident response.

**Compliance Automation.** Vero maps operational data to multiple regulatory frameworks simultaneously: US IRA Section 45X (FEOC verification), EU Battery Regulation 2023/1542 (Digital Product Passport with 22/37 mandatory fields currently mapped), Brazilian environmental regulations (CONAMA 430, ANM Mining Code), and OECD Due Diligence Guidance. The platform generates audit-ready compliance exports and maintains an integrity-verified evidence chain.

**Validation.** Vero is deployed as a pilot with Meteoric Resources (ASX: MEI) at the Caldeira Project in Poços de Caldas, Brazil — a JORC-compliant ionic clay REE deposit. The pilot demonstrates integration with field instruments (LAPOC), public environmental data sources, and regulatory mapping for a real-world critical mineral operation. The platform has CI-enforced quality gates (lint, type-check, test suite, vulnerability scan), zero TypeScript errors, and application-level security controls mapped to NIST 800-53 Rev 5 and CMMC Level 2.

**Phase I Objectives.** (1) Validate the data honesty and provenance system with DoD supply chain analysts, (2) extend DPP coverage from 59% to 80%+ of mandatory fields, (3) integrate with DoD-relevant data sources (e.g., USGS critical mineral data, NOAA climate data), and (4) conduct user testing with defense prime integrators to validate the API surface and integration patterns.

**Phase II Potential.** (1) FedRAMP authorization in AWS GovCloud, (2) CMMC Level 2 certification, (3) multi-site deployment across critical mineral operations, (4) OPC-UA/MQTT integration for industrial SCADA systems, and (5) blockchain anchoring for immutable supply chain attestation.

---

## 4. Team Qualifications

| Team Member | Role | Relevance |
|-------------|------|-----------|
| **Carlos Toledo** | Founder, Technical Lead | Full-stack development, platform architecture, AI integration |
| **Dr. Heber Caponi** | Scientific Advisor | Geochemistry, environmental monitoring, field instrument knowledge |
| **Juliano Dutra** | Co-founder, Technical Advisor | Engineering, system integration |
| **Guilherme Bonifácio** | Co-founder, Commercial Strategy | Market development, business relationships |
| **Milca Neves Tavares** | ESG & HR Advisor | Sustainability, regulatory compliance |
| **Alexandre Quevedo** | Sustainability Strategy Advisor | Supply chain sustainability, strategic partnerships |

---

## 5. Budget Estimate (Phase I)

| Category | Amount | Description |
|----------|--------|-------------|
| Personnel | $120,000 | 6 months, 2 FTEs (founder + developer) |
| Cloud Infrastructure | $15,000 | AWS GovCloud staging environment |
| Travel | $10,000 | DoD stakeholder meetings, validation workshops |
| Materials & Equipment | $5,000 | Development tools, API subscriptions |
| Indirect Costs | $25,000 | Facilities, administrative |
| **Total** | **$175,000** | Phase I, 6 months |

---

## 6. Next Steps

1. Monitor DoD SBIR portal (sbir.gov) for FY2027 Pre-Release topics
2. Register in DSIP (Defense SBIR/STTR Innovation Portal)
3. Prepare SAM.gov registration (required for all federal contracting)
4. Identify program managers at DLA and OUSD(A&S) for pre-solicitation discussions
5. Refine technical abstract based on specific topic requirements when published
