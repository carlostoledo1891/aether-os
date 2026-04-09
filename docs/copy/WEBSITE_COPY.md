# Vero — website & product surface copy

**Purpose:** Single place to iterate marketing and in-product narrative. Sync changes here first, then reflect in `README.md`, `index.html`, and UI strings as needed.

**Last synced from codebase:** 2026-04-09  
**Source:** [`README.md`](../../README.md), [`HANDOFF.md`](../../HANDOFF.md), [`index.html`](../../index.html), primary view components, and stakeholder stress-test personas (issuer, capital, buyers, society, ecosystem, media).  
**Releases since last sync:** Data Layer Refactor (MaybeAsync types, useServiceQuery, LoadingSkeleton), CTO Code Review & Quality Sprint (186 tests, ErrorFallback, two-layer cache contract, deployment gate, backend hardening, a11y, styling discipline), Feature Sprint v5 (OpenAPI spec, build stamp, DPP field mapping + JSON export, Portuguese community card + grievance path, drill trace schematic + JORC badges), **Feature Sprint v6** (lithological intervals, CEN/CENELEC schema validation, Stakeholders tab, map hover popups, 25 AI agent tools, 218 tests).

---

## Messaging principles (persona-derived)

- **Narrative alignment, not system of record** — Position as **one canvas for internal story sync** (DFS, permits, field). Explicitly **not** IMS, permit-condition tracking, or agency submission software unless product scope changes.
- **Geology ≠ hydro** — Assets / resource copy stays in **Executive → Assets**; Hydro Twin copy is **monitoring + illustrative scenario**, never ore proof.
- **Evidence vs marketing** — Traceability and compliance badges are **design for evidence repository**; simulated batches and hashes are **demo** until doc types and attestation chains exist.
- **Liability surface area (IR)** — Market-facing sessions should reference a **disclosure mode** pattern: versioned, dated, **public-filed** figures only; UI defaults stay honest about simulation.
- **Community / NGO** — Prefer **listening, plans, limits, grievance** over predictive promises; spring **status colors = modeled UX**, not community water verdicts.
- **Integrators** — Emphasize **read-only historians, unidirectional gateways**, explicit latency — not replacing SCADA HMI.

---

## Browser & SEO

| Element | Current copy |
|--------|----------------|
| `<title>` | **Vero — Critical Mineral OS** |

---

## Brand (header)

| Element | Current copy |
|--------|----------------|
| Mark | **V** (monogram in violet square) |
| Product name | **Vero** |

---

## Positioning (hero / landing)

**Headline (short)**  
**Vero** / *Verified Origin. Trusted Supply.*

**Subhead (one line)**  
*The trust layer for critical mineral supply chains.*

**Supporting paragraph**  
One platform to align field operations, compliance evidence, and board-level metrics for critical mineral supply chains. Flagship deployment: **Caldeira Project** (Meteoric Resources, ASX: MEI). Built for operators, buyers, and investors who need defensible provenance — not another spreadsheet.

*Currently a production-architecture prototype with a real Fastify API, simulation engine, WebSocket telemetry, and external enrichers (weather, FX, seismic). OpenAPI spec auto-generated from Fastify routes. DPP-compliant JSON export (EU 2023/1542) with CEN/CENELEC schema validation. Bilingual community card (EN/PT-BR) with grievance path. Interactive drill trace schematic with JORC reference badges. Lithological interval viewer. Stakeholders tab. Map hover popups with feature detail. 25 AI agent tools backed by domain data. 218 automated tests, deployment gate, and live link verified. Production integration roadmap available on request.*

**Optional one-line (media / retail honesty)**  
*Demo mixes public-reference map data, disclosure-aligned scenarios where cited, and simulated time series — not a substitute for filed instruments, competent-person sign-off, or operational systems of record.*

---

## Primary navigation (three views)

| Internal ID | Tab label | Role |
|-------------|-----------|------|
| `operator` | **Field Operations** | Ground truth — plant + hydro digital twin on the ground |
| `buyer` | **Compliance & Traceability** | Trade truth — FEOC / IRA / passport-style buyer assurance |
| `executive` | **Executive Overview** | Board truth — financials, risk, capital, agencies, ESG |

**Steerco alignment (internal marketing)**  
Executive tabs map to **steerco rhythms**: Assets / Financials / Risk / Pipeline / Capital / DFS / Agencies / Audit / ESG — one place to rehearse what each workstream owns before the room diverges.

---

## Field Operations — map straplines

| Mode | Map title row |
|------|----------------|
| Operations | Pilot telemetry → board-grade trust layer |
| Hydro Twin | Hydro Digital Twin → cumulative aquifer + spring model → LI defense |

**Field sub-tabs**

- **Operations**
- **Hydro Twin**

**Operations panel — layer groups (terrain vs rehearsal)**  
*Terrain-aligned:* Pilot + commercial plant sites · Mining licences (per block) · PFS starter pit + spent clay · Named drill collars · Access road (concept) · Caldeira 193 km² envelope

*Legacy / rehearsal:* Deposit shell polygons · Logistics mesh · Pilot flow schematic (telemetry nodes)

**Map footer (disclaimer line)**  
Geometries: terrain-aligned ops master — see `docs/data/caldeira/DATA_SOURCES.md` (non-survey)

**Hydro Twin — legend / tooltip copy patterns (permitting + community + NGO)**
- Spring **locations**: public-reference geometry where metadata specifies source — **not** field-verified site survey unless stated.
- Spring **status / tier colors**: **modeled for UX rehearsal** — not regulatory findings, not substitute for permit condition IDs or sampling methodology.
- **Instrument tie-in:** where real piezometer or lab channels exist in product, label **instrument-backed** vs **illustrative** side-by-side; surface **honest gaps**.
- **Community-facing angle:** emphasize **monitoring plan + response protocols** — avoid language that sounds like prediction or **judgment on community water** from colors alone.

---

## Compliance & Traceability — map straplines

| Tab | Map title row |
|-----|----------------|
| Compliance | FEOC-clean chain · IRA-ready · EU Digital Battery Passport |
| Traceability | Molecular-to-magnet ledger · provenance · partner APIs |

**Buyer sub-tabs**

- **Compliance**
- **Traceability**

---

## Compliance surface — key labels

- **FEOC Compliance** (section)
  - Avoid chip copy that reads like **certification** without naming **attestation**, **auditor**, or **document chain**. Prefer **"alignment narrative"** or **"evidence design"** until backed.
- **Responsible sourcing (OEM / Annex II option)**
  - Frame in **risk categories** and **evidence types** (e.g. environment, human rights) + **chain-of-custody document types** (CoA, lab, customs) — not hash theater alone.
- **EU / passport language**
  - Prefer **schema-aligned** or **declaration-field roadmap** over **"passport ready"** if only UI-level.
- **DoD-adjacent rooms (product marketing, not legal)**
  - Lead with **tenancy, audit logging, deployment model, integration**; map is context, not authority.
- **Molecular-to-Magnet Ledger** (traceability card title)
  Status chip: **Immutable** *(demo narrative only)*
- Blockchain timeline footnote:
  *Demonstration ledger — illustrative hashes and API handoffs; production ERP/CBP integration is post–pilot scope. Not non-repudiation without production key custody and policy.*

---

## Executive Overview — shell

**Context strip**  
Executive overview · *[active tab name]*

**Executive tabs (labels)**  
Assets · Financials · Risk · Pipeline · Capital · DFS · Agencies · Audit · ESG

**Financials — intro (disclaimer)**  
Illustrative scenarios aligned to public disclosure materials — not a live market or trading feed.

**Financials — provenance strip (pattern)**  
Uses dynamic **As of [date]** line with issuer snapshot resource headline, PFS pointer, and citation link (verify vs latest ASX).

**IR / disclosure mode (pattern for market-facing builds)**  
*Disclosure mode — board-approved facts only · version [x] · as of [date]* — UI surfaces **only** public-filed figures and citations; simulated or illustrative layers hidden or banner-blocked. *(Product pattern — implement per counsel / IR.)*

**Assets — geology / resource (QP room)**  
Resource and deposit narrative lives here — **separate** from Hydro Twin. Copy should never imply hydrology **validates** tonnage or grade.

**Risk / Capital / Audit (PF, ECA, insurer)**  
Position as **covenant and control narrative**: risk register, capital milestones, immutable-style audit log — with roadmap for **alarm acknowledgement**, **maintenance logs**, **sensor redundancy**, and **third-party / IE** alignment — not "AI replaces legal opinion or IE report."

**ESG — intro**  
ESG coverage is a dashboard narrative for board visibility — not a substitute for JORC resource assurance or statutory reporting.

**Agencies — spatial card title**  
Spatial cross-check (heuristic)

**Agencies — matrix title**  
Agency matrix — administrative record (rehearsal)

**Agencies — matrix intro**  
Bodies, instruments, and placeholder document IDs. Verify against filed instruments and portals before external use.

**Agencies / exports — permitting consultant angle**  
Regulatory export bundle is a **rehearsal artifact** for internal QA and annex drafting — **not** a substitute for EIA/LI method statements unless counsel attaches filed text. Pair with roadmap: **method-statement appendix** export for map layers that could be dissected in process.

---

## Data honesty banner (variants)

*Labels and bodies come from `getDataContext()` in the app; keep legal tone aligned with product counsel.*

| Mode | Banner label (example) | Detail theme |
|------|------------------------|--------------|
| Mock, normal | Demo data | Simulated plant/env time series; bundled GeoJSON |
| Mock, presentation | Stakeholder session — illustrative run | Agency briefing structure; replace with instrumented feeds for production |
| Mock, disclosure | Disclosure mode — board-approved facts only | IR-safe: simulated/illustrative layers hidden |
| Live, connected | Live pipeline — Vero Simulation Engine | Telemetry via API + WebSocket. Weather from Open-Meteo, FX from BCB. Plant/env streams synthetic until LAPOC instruments connect |
| Live, degraded | Backend unreachable — showing cached data | Amber banner; stale data served from API-level cache |
| Live, offline | Backend offline — reconnecting... | Red banner; no data available; exponential backoff retry |

---

## Feature list (marketing bullets)

Use for landing page or deck appendix:

- **Three-process production architecture** — Fastify API + simulation engine + Vite frontend; Docker Compose orchestration with health checks
- **Live-style telemetry pulse** across **10+ sensor channels** with **WebSocket broadcast** *(demo: simulated drift until historian feeds land)*
- **Hydro Digital Twin** — **1,092** public-reference spring points, piezometer network, UDC monitoring *(status overlay: modeled)*
- **Alert system** — threshold breaches with incident lifecycle, **API-key-gated dismiss**, incident log *(roadmap: ack latency, false-alarm stats for insurer rooms)*
- **Financial scenario modeling** — Bear / Consensus / Bull NPV sensitivity vs NdPr; **zero-cache policy** on geological/financial endpoints (never shows stale numbers)
- **Data service architecture** — `MaybeAsync<T>` interface bridges mock (sync) and live (async) modes; `useServiceQuery` hook with **two-layer cache contract** (documented staleness semantics); **ErrorFallback** for graceful degradation; **clean API/DTO boundary** for integrators
- **Molecular traceability** — blockchain-style timeline pit → magnet with hash chain narrative *(demo: illustrative hashes until ERP/CBP + lab + customs doc types)*
- **Green Premium** — spot vs certified NdPr / DyTb with carbon tiers *(tie to same disclosure snapshot as financials)*
- **Interactive map** — deposits, licences, drills, infrastructure, environmental layers with detail panels
- **Time range** — 24h / 7d / 30d historical views with server-side ring buffer and retention policies
- **Error resilience** — `ErrorFallback` component across all 14 data consumers; connection status banner (connected / degraded / offline); graceful server shutdown
- **Accessibility** — focus trap on alert drawer, `aria-label` on icon buttons, explicit `type="button"` on all buttons, WCAG-aligned design tokens
- **218 automated tests** across 3 packages (frontend, server, engine) — including live-mode integration tests that verify no infinite re-renders with async data
- **Deployment gate** — mandatory checklist (tsc, tests, build, localhost click-through, Vercel preview) before every production deploy
- **Integrator-ready story** — read-only historians, unidirectional OT/IT gateways, explicit latency, documented `isThenable` contract *(roadmap bullets for RFPs)*
- **OpenAPI spec** — auto-generated from Fastify route schemas; Swagger UI at `/api/docs`, machine-readable spec at `/api/docs/json`. Every endpoint documented with tags, summaries, and schemas.
- **Digital Product Passport** (EU 2023/1542) — 22 CEN/CENELEC mandatory fields mapped, 59% coverage, schema-compliant JSON export per batch. Field-mapping table in Buyer → Compliance tab.
- **Build verification stamp** — git SHA + build date visible in data mode banner. Tooltip shows full SHA and ISO timestamp.
- **Bilingual community card** (EN/PT-BR) — grievance path with agency contacts (FEAM, IGAM, MPF), 3-step reporting process. Language toggle with localStorage persistence. Designed for communities in Poços de Caldas.
- **Drill trace schematic** — interactive cross-section of 8 drill holes by depth and TREO grade. Click-to-detail with intercept data. JORC reference badges as clickable links to ASX filing on resource numbers.
- **Lithological interval viewer** — drill hole lithology column with depth-scaled bars, color-coded by rock type, linked to collar metadata and assay intercepts
- **CEN/CENELEC schema validation** — live validation of DPP JSON exports against EU Battery Regulation Annex VI mandatory fields. Inline error/warning reporting with field-level coverage breakdown
- **Stakeholders tab** — executive-level view of project stakeholders, relationships, and engagement status across regulatory, community, and commercial dimensions
- **Map hover popups** — contextual feature detail on hover for drill collars, springs, plant sites, and infrastructure layers; no click required for quick inspection
- **25 AI agent tools** — domain-grounded chat with tools spanning financials, geology, compliance, lithology, DPP validation, security architecture, stakeholders, market sizing, and web search — all backed by seeded project data

---

## Call to Action

| Audience | CTA |
|----------|-----|
| Operators | **Request a pilot deployment** — hydro + discharge KPIs tied to your LI conditions |
| Buyers / OEMs | **Design partnership** — passport schema and batch attestation API co-development |
| Investors | **Schedule a demo** — see the full stack from pit to magnet |

---

## Built by

**Carlos Toledo** — Founder, Product & Technical Lead. Born and raised in Poços de Caldas, inside the Caldeira. Air Force pilot, full-stack developer, Product Design degree. Built the entire stack solo — 218 tests across 3 packages, 25 AI agent tools, production deployment gate, accessibility-hardened. 40 years of local context that no outside team can replicate.

**Dr. Heber Caponi** — Chief Scientific Advisor. Decades of active Caldeira field research through LAPOC. The scientific bridge from simulated data to field-verified instrument channels.

**Thiago A.** — CEO. Brazilian and international law, enterprise operations, commercial execution.

Vero is built from inside the Caldeira, not about it — and validated by the scientist who has studied it for decades.

---

## Flagship deployment

- **Meteoric Resources — Caldeira Project** (Poços de Caldas, MG, Brazil · ASX: MEI)
- **1.5 Bt** ionic clay REE resource across **7 deposits**
- LP approved Dec 2025 · DFS mid-2026 · First production 2028

---

## Local / Brazil stakeholder notes (optional web or PDF)

For mayor / state / municipal audiences: lead with **local employment, fiscal contribution, and independent or participatory monitoring** in **plain Portuguese** when publishing externally; avoid tone that reads as **remote HQ** lecturing **Poços** context. Maps spread on WhatsApp — pair any public map with **limits** and **who to call** (grievance / red-phone path is organizational, not UI-only).

---

## Environment / hydro panel (closing note pattern)

*MPF cumulative EIA demand remains the core LI bottleneck. Telemetry on this tab is illustrative until instrumented feeds are wired — use Executive → Agencies for the administrative record map and exports.*

---

## Persona feedback on website copy (2026-04-09, v9 — Feature Sprint v6)

| Persona | Score | Verdict | Key quote |
|---------|-------|---------|-----------|
| Chairman | 9.0 | Stakeholders tab + AI tools give board-prep credibility | "Now I can rehearse the steerco story in one place" |
| CEO | 8.5 | 25 tools + schema validation show product maturity | "This is starting to look like a product, not a prototype" |
| Chief Geologist | 9.0 | Lithological intervals + drill trace depth; geology firewall intact | "The lithology column is what I'd expect in a technical report" |
| DoD Buyer | 8.0 | Security architecture card + SBOM + FedRAMP path | "Show me the ATO timeline — that's what procurement needs" |
| NGO | 7.5 | Community card + PT-BR + grievance path; hover popups help transparency | "If the map shows it, the community should be able to inspect it" |
| Integrator | 9.5 | 25 AI tools + OpenAPI + schema validation = integration-ready | "Give me the tool list and I can scope the integration in a week" |
| Journalist | 8.5 | Data honesty + provenance + 218 tests; story is credible | "A solo founder with 218 tests and a schema validator — that's the story" |

**Weighted average: 8.6/10** (v3 7.3 → v9 8.6 — feature sprints v5–v6 moved every persona; lithology, stakeholders, 25 AI tools, 218 tests, and schema validation close the major gaps).

---

## Iteration checklist

1. Update this file.
2. Mirror critical strings in `README.md` / `HANDOFF.md` if they are "source of truth" for collaborators.
3. Update React components for UI-visible strings.
4. If claims touch resources or permits, align [`docs/data/caldeira/DATA_SOURCES.md`](../data/caldeira/DATA_SOURCES.md) and [`issuerSnapshot`](../../src/data/caldeira/issuerSnapshot.ts).
5. Rehearse against **Appendix C** (coverage map) in [`PITCH_DECK_COPY.md`](./PITCH_DECK_COPY.md) before high-stakes demos.
6. After each release, check persona verdicts in table above and [`docs/Personas.md`](../Personas.md) for gaps.
