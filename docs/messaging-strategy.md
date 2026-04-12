# Vero — Messaging Strategy & Talk Tracks

**Purpose:** This document consolidates the messaging strategy, persona value propositions, and presentation talk tracks for Vero. It serves as the single reference for how to talk about the product to different stakeholders. 

*Note: Hardcoded UI copy, statistics, and recurring marketing strings have been moved to `src/config/marketing.ts` to ensure code serves as the single source of truth.*

---

## 1. Core Messaging Principles (Persona-Derived)

- **Narrative alignment, not system of record** — Position as **one canvas for internal story sync** (DFS, permits, field). Explicitly **not** IMS, permit-condition tracking, or agency submission software unless product scope changes.
- **Geology ≠ hydro** — Assets / resource copy stays in **Executive → Assets**; Hydro Twin copy is **monitoring + illustrative scenario**, never ore proof.
- **Evidence vs marketing** — Traceability and compliance badges are **design for evidence repository**; simulated batches and hashes are **demo** until doc types and attestation chains exist.
- **Liability surface area (IR)** — Market-facing sessions should reference a **disclosure mode** pattern: versioned, dated, **public-filed** figures only; UI defaults stay honest about simulation.
- **Community / NGO** — Prefer **listening, plans, limits, grievance** over predictive promises; spring **status colors = modeled UX**, not community water verdicts.
- **Integrators** — Emphasize **read-only historians, unidirectional gateways**, explicit latency — not replacing SCADA HMI.
- **Predictive environmental intelligence** — Vero doesn't just monitor; it forecasts. 16-day weather forecasts from Open-Meteo feed into spring health predictions backed by 5 years of ECMWF ERA5 reanalysis data. Position as 'Other platforms tell you what happened. Vero tells you what's coming.' Always label predictions as 'AI-predicted — indicative, not regulatory-grade.'

---

## 2. Who Vero Serves (Value Propositions)

| Audience | What keeps them up at night | What Vero offers |
|----------|----------------------------|------------------|
| **Operators** | Siloed data across engineering, permitting, IR, and community. No unified story for board or investor. | One narrative canvas — from drill collar to product output. Control Room digital twin. Hydro Twin for LI defense. |
| **Defense Buyers** | 18–24 month procurement delays when FEOC documentation is incomplete. No way to verify supply chain provenance. | Infrastructure-first security posture + FEOC origin tracking + SHA-256 audit chain. OpenAPI spec for integration. |
| **EU Compliance** | Battery Passport enforcement (Feb 2027) with no standard tooling. Schema gaps across the supply chain. | 22 CEN/CENELEC DPP fields mapped. Schema-validated JSON export. Inline validation with error reporting. |
| **Investors / PF** | Technical risk in the investment model. No visibility into operational readiness. | 310 tests, rate limiting, zero-cache on financials. Bear/Consensus/Bull scenarios. DSCR projections. Capital tracker. |
| **Community / NGO** | Mining companies making promises about water without transparent monitoring. No grievance path. | Hydro Twin with "modeled" labels visible before spring colors. Bilingual community card (PT/EN). FEAM/IGAM contacts. 7-day water forecast outlook in Portuguese. AI-predicted spring health based on real weather data. |
| **Integrators** | Undocumented APIs, no equipment catalog, unknown protocols. | OpenAPI at `/api/docs`. 17 equipment items, 28 sensors documented. OPC-UA/MQTT roadmap. Cost estimate in a week. |

---

## 3. Product Positioning & Data Honesty

### Three Truths, One Platform
- **Ground truth** (Field + Forecast) — operations and hydrology on a map with explicit provenance, plus 16-day environmental forecast from Open-Meteo and seasonal compliance outlook from ECMWF ERA5 baseline.
- **Trade truth** (Compliance) — FEOC / IRA / passport-style evidence metaphors and batch ledger — scoped as repository design until attestation chains are wired.
- **Board truth** (Executive) — scenarios, risk, capital, DFS rhythm, agency matrix, audit trail, ESG coverage — aligned to steerco and disclosure rhythm.

### Data Honesty Banner Variants
- **Mock, normal**: "Demo data" (Simulated plant/env time series; bundled GeoJSON)
- **Mock, presentation**: "Stakeholder session — illustrative run" (Agency briefing structure; replace with instrumented feeds for production)
- **Mock, disclosure**: "Disclosure mode — board-approved facts only" (IR-safe: simulated/illustrative layers hidden)
- **Live, connected**: "Live pipeline — Vero Simulation Engine" (Telemetry via API + WebSocket. Plant streams synthetic until LAPOC instruments connect)
- **Live, degraded**: "Backend unreachable — showing cached data" (Amber banner; stale data served from API-level cache)
- **Live, offline**: "Backend offline — reconnecting..." (Red banner; no data available; exponential backoff retry)

---

## 4. Deck Talk Tracks & Speaker Notes

### Honesty Paragraph (Slide 0 / Media / Skeptical Rooms)
"This demo mixes three kinds of information: (1) public-reference geometry and citations where noted, (2) illustrative scenarios and dashboards aligned to disclosed materials where labeled, and (3) simulated plant and environmental time series for UX rehearsal. Nothing on screen is an attestation unless your counsel and IR attach a versioned, board-approved facts layer."

### The "Why Us" Argument
"Vero is not built by consultants studying from afar. It is built inside the Caldeira — by a founder who grew up on the geology, validated by a scientist who has studied it for decades, with a CEO who knows Brazilian law, and an engineer ready to scale. We mapped 22 CEN/CENELEC mandatory fields. Here's what the industry is still missing."

### Killer Questions to Own
- *When DFS slips, does the UI lie until someone edits JSON?* → **Owner matrix + versioned facts layer + stale-date surfacing** (roadmap).
- *What QP signs off on a screenshot?* → **Nothing** until counsel/IR defines disclosure mode; default demo is **non-reliance**.
- *Can opponents FOIA spring layers?* → Public geometry labeled; **status colors = modeled UX**, not agency findings.
- *Community "red phone"?* → **Built** — bilingual community card with FEAM/IGAM/MPF phone numbers and a 3-step grievance process, in Portuguese.
- *What if the live link crashes during a demo?* → **310 tests, deployment checklist, ErrorFallback on every data consumer, connection-aware banner, rate limiting.**
- *What's your security posture?* → **CSP headers, rate limiting, API key auth, fail-closed ingest, CORS allowlist, error handler without stack traces.**
- *Can you predict environmental compliance issues before they happen?* → **Yes.** 16-day weather forecast feeds spring health prediction model. ERA5 5-year baseline provides seasonal context. All predictions labeled 'AI-predicted — indicative only.'
- *How do you prevent stale geological data on screen?* → **TTL=0 on all geological/financial endpoints.** No caching. De Carvalho principle enforced at architecture level.

### The Environmental Intelligence Argument
'We don't just tell you the springs are healthy today. We tell you whether they'll be healthy next week — because our AI correlates ECMWF ERA5 climate data with real-time Open-Meteo forecasts to predict spring health changes before they happen. And every prediction is labeled as AI-predicted, not certified — because honesty is the brand.'

### Words to Avoid in Regulated Rooms
- **Avoid implying:** cadastral survey accuracy, final permit outcomes, or live exchange prices unless sourced and labeled.
- **Prefer:** illustrative, rehearsal, verify against ASX, non-survey geometry.
- **Avoid implying:** compliance green without permit condition IDs; FEOC/IRA certification without attestation chain; digital twin proves resource; replacing SCADA/IMS.

---

## 5. Audience-Specific Playbooks

### Founders Deck (Juliano & Guilherme)
- **Narrative Arc:** Honesty → Problem → Opportunity → Product → Engineering → Science → Business → Timing → Close.
- **Technical Deep Dive (Juliano):** Yield-to-real-data ingestion architecture, lean MapBase spatial engine, 310 tests, API integration surface.
- **Commercial Validation (Guilherme):** Sourced TAM ($31.9B), SAM ($5.2B), regulation-driven growth (EU DPP, IRA), $102k ACV vs $821M NPV, mitigation of risks.

### Meteoric Implementation Deck
- **Audience:** Dr. Marcelo De Carvalho (Geology), Dr. Andrew Tunks (Chairman), Stuart Gale (CEO).
- **Core message:** Your digital twin is already built. Now connect it to live data.
- **Tailored focus:** 
  - For Geology: 19 GeoJSON datasets, 100% source labels, strict separation of geology and hydrology models. Platform now actively parses and stores real LAPOC CSV data with automated UI provenance upgrades.
  - For CEO: Board agenda-aligned tabs, financial scenario tracking.
  - For Chairman: Disclosure mode safety, screenshot data honesty.

---

## 6. Stakeholder Stress-Test Coverage Map

Use internally to ensure a deck rehearsal hits every bucket at least once.

| Bucket | Personas |
|--------|----------|
| **Issuer technical** | Chief geologist / QP mindset; permitting consultant |
| **Issuer commercial** | VP Projects; IR; community liaison |
| **Capital / risk** | Project finance / ECA; insurer; retail / family office |
| **Buyers / compliance** | OEM responsible sourcing; DoD program; EU enforcement mindset |
| **Society / politics** | NGO / water justice; local political (jobs, water, PT) |
| **Ecosystem** | SCADA integrator |
| **Adversarial** | Competitor intel; journalist / researcher |
| **Platform truth** | Product / engineering evaluator |

---

## 7. Competitor Intel Calibration (Rhetorical)
Competitors (Minviro, Circulor, Everledger) will cross-check: green premium, recovery vs nameplate, ESG coverage %, FEOC language, basket consistency.
**Response:** Tie numbers to one issuer snapshot + citations; label simulation; never outrun filed disclosure. Honesty-first is the Everledger defense.
- **Key differentiator: Predictive vs. Retrospective** — All listed competitors report historical environmental data. Vero forecasts environmental compliance risk using real weather intelligence. This is category separation, not feature parity.