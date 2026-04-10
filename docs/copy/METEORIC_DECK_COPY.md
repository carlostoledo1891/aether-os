# Meteoric Implementation Deck — Slide Copy

**Purpose:** Slide-ready narrative blocks for the Meteoric-specific implementation pitch. This deck is designed to show Meteoric leadership exactly what Vero delivers, how it connects to their live data, and why signing now creates competitive advantage.

**Audience:** Stuart Gale (CEO), Dr. Andrew Tunks (Chairman), Dr. Marcelo De Carvalho (Chief Geologist)

**Last synced:** 2026-04-10

---

## Slide 1 — Cover

**Title:** Vero for Caldeira

**Subtitle:** Your digital twin is already built. Now connect it to live data.

**Subtext:** Prepared for Meteoric Resources Ltd · ASX: MEI

---

## Slide 2 — What's Already Built

**Title:** Your project. Already digitized.

We didn't build Vero as a demo — we built it on the Caldeira Project. Every feature was stress-tested against 9 named stakeholder personas before a single line of marketing was written.

**Stats:**
- 17 equipment items mapped (Metso, Andritz, GEA, Outotec)
- 28 sensor channels pre-configured
- 19 GeoJSON datasets integrated (drill collars, springs, licences, deposits)
- 7 process steps from ROM ore to MREC product
- 27 AI tools grounded in Caldeira data

---

## Slide 3 — Three Views, One Platform

**Title:** Every stakeholder sees their truth.

| View | Audience | What they see |
|------|----------|---------------|
| Field Operations | Geologists, operators | 3D terrain, drill collars, pilot plant twin, hydro monitoring |
| Compliance & Traceability | Buyers, auditors, regulators | FEOC tracking, DPP export, SHA-256 audit chain |
| Executive Overview | Board, investors, ECAs | Financial scenarios, risk register, capital tracker, ESG |

---

## Slide 4 — Ready for Live Data

**Title:** From simulation to production in one integration.

The platform already runs on simulated telemetry with the same architecture that will process live SCADA data. The switch is an integration — not a rebuild.

**Integration surface:**
- REST API with OpenAPI spec at `/api/docs`
- WebSocket channels for sub-second telemetry
- MQTT / OPC-UA connector surface for SCADA
- CSV / Excel batch upload for historical data
- GeoJSON ingestion for new spatial datasets

**What changes when live data connects:**
- "Simulated" labels become "Field-verified"
- Dr. Caponi's LAPOC instruments = first live data channel
- Every sensor reading carries provenance metadata
- Audit chain timestamps move from simulation clock to UTC

---

## Slide 5 — Custom Views & DataViz

**Title:** Any data. Any visualization. JSON-driven.

Vero doesn't lock you into pre-built dashboards. The Mini Engine renders custom views from a single JSON configuration:

**Visualization capabilities:**
- 3D terrain maps with custom GeoJSON overlays
- Process flow digital twins with animated connections
- Time series charts (Recharts) with live data binding
- Gauge dashboards for sensor monitoring
- Bar / line / area charts for financial scenarios
- Heatmaps and contour overlays for geological data
- Custom overlay layers (14 types available)
- Bilingual community dashboards (PT/EN)

**Already deployed:** Prefeitura de Poços de Caldas public dashboard at `/view/prefeitura-pocos`

---

## Slide 6 — AI-Powered Cross-Data Analysis

**Title:** 27 AI tools. Grounded in your data.

Every AI tool is domain-grounded — it answers questions using Caldeira project data, not generic training. No hallucination about your deposit.

**Tool categories:**
- Geology: lithology analysis, resource classification, drill log interpretation
- Financial: scenario modeling, NPV sensitivity, CAPEX tracking
- Compliance: DPP field validation, FEOC origin verification, audit chain queries
- Environmental: water quality assessment, spring status interpretation
- Operational: equipment performance, process flow optimization

**Cross-data capability:**
- "Compare pH trends across all springs against rainfall data"
- "Which equipment items have the highest maintenance risk based on sensor drift?"
- "Generate a compliance evidence package for the Ucore offtake audit"

---

## Slide 7 — Security & Enterprise Readiness

**Title:** Infrastructure that survives due diligence.

**Stats:**
- 310 automated tests (260 frontend + 50 server)
- 0 TypeScript errors (strict mode, both packages)
- CSP headers, CORS lockdown, rate limiting (120 req/min)
- API key authentication on sensitive routes — fail-closed
- SHA-256 append-only audit chain with programmatic verification
- React.memo on all 14 map overlays — zero unnecessary re-renders
- ARIA labels on every interactive control

**Persona score movement from engineering sprint alone:**
- DoD Program Officer: 7.5 → 8.0
- Project Finance Analyst: 8.5 → 9.0

---

## Slide 8 — Why Sign Now

**Title:** Five reasons to sign this quarter.

1. **DFS mid-2026 — the dashboard should be live when the DFS drops.** Institutional investors will see a project with operational visibility, not just a PDF.

2. **Vero becomes the market standard.** EU Digital Product Passport enforcement (Feb 2027) means every REE project will need this. Meteoric gets it 18 months early — and shapes the standard.

3. **Competitive signaling.** An interactive digital twin in your investor presentations is something Lynas, MP Materials, and Iluka don't have. Institutional investors notice.

4. **Due diligence speed.** Every question about your project has a dashboard answer. Capital raises close faster when diligence is self-serve.

5. **Community trust.** The Prefeitura dashboard is already built. Poços de Caldas sees transparent environmental monitoring — in Portuguese — before the first production.

---

## Slide 9 — Implementation Timeline

**Title:** 90 days to live data.

| Week | Milestone |
|------|-----------|
| 0–2 | Contract signed · API keys provisioned · LAPOC instrument mapping |
| 2–4 | First live sensor data flowing through platform |
| 4–6 | Custom views configured for DFS presentation |
| 6–8 | Community dashboard reviewed with Prefeitura |
| 8–12 | Full production deployment · Board presentation ready |

**Cost:** $102,000 / year (Growth tier). That's 0.013% of your $821M consensus NPV.

---

## Slide 10 — Vero Becomes Market Standard

**Title:** The platform the industry will need.

| Regulatory driver | Date | Vero readiness |
|-------------------|------|----------------|
| EU Battery Passport | Feb 2027 | 22 / 37 mandatory fields mapped |
| US FEOC requirements | Active | Origin tracking + audit chain |
| Australian ESG reporting | 2025+ | ESG frameworks integrated |
| CEN/CENELEC DPP schema | In progress | Schema-validated JSON export |

**First-mover advantage:**
- Meteoric shapes the DPP schema with us — not after the standard is set
- FEOC compliance evidence ready before DoD procurement cycles hit
- Every new REE project that signs Vero sees Meteoric as the reference deployment

---

## Slide 11 — The Ask

**Title:** Let's make it official.

**Pilot contract:** $102,000 / year (Growth tier)
- Full platform access: 3 views + Mini Engine + AI tools
- Live telemetry integration within 90 days
- Custom DFS presentation views
- Community dashboard deployment
- API access for investor presentations

**What you get that no vendor can offer:**
- A founder who grew up in the Caldeira — 40 years of local context
- A chief scientific advisor (Dr. Caponi) with decades of LAPOC field work on your deposit
- A platform already built on your data — not a generic template

**Next step:** 15-minute technical walkthrough → contract → live data in 2 weeks.

---

*Iteration checklist: Update after every Meteoric meeting, DFS milestone, or material product change.*
