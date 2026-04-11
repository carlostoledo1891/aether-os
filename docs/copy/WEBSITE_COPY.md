# Vero — website & product surface copy

**Purpose:** Single place to iterate marketing and in-product narrative. Sync changes here first, then reflect in `README.md`, `index.html`, and UI strings as needed.

**Last synced from codebase:** 2026-04-10  
**Source:** [`README.md`](../../README.md), [`HANDOFF.md`](../../HANDOFF.md), [`branding.md`](../branding.md), [`strategy.md`](../strategy.md), primary view components, stakeholder stress-test personas, and [`VALUATION.md`](../VALUATION.md).  
**Releases since last sync:** All through **v16: Juliano + Guilherme Final Sprint** — shared deck components (`src/components/deck/`), 6 new FoundersDeck slides (Disclaimer, LAPOC Pipeline, Risk/Mitigation, Exit Paths, Monday Play, Why Before Monday), Strategic Advisor team card, DevTools easter egg, LandingPage nav fix (#ai-agent, #market links), code deduplication (~400 lines across 4 files), React Router ESC navigation, plus all v15/v13 changes.

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
One platform to verify field operations, prove compliance, and align board decisions — purpose-built for the rare earth supply chain, from mine to magnet. Flagship deployment: **Caldeira Project** (Meteoric Resources, ASX: MEI).

*Production-hardened: 310 automated tests, enterprise security (CSP, rate limiting, API auth), Pilot Plant Digital Twin (17 equipment, 28 sensors), SHA-256 audit chain, DPP-compliant JSON export (22 CEN/CENELEC fields), 27 AI agent tools, OpenAPI spec. Persona-validated at **9.4/10** weighted average. Production integration roadmap available on request.*

**Optional one-line (media / retail honesty)**  
*Demo mixes public-reference map data, disclosure-aligned scenarios where cited, and simulated time series — not a substitute for filed instruments, competent-person sign-off, or operational systems of record.*

---

## Who Vero Serves (persona-specific value propositions)

| Audience | What keeps them up at night | What Vero offers |
|----------|----------------------------|------------------|
| **Operators** | Siloed data across engineering, permitting, IR, and community. No unified story for board or investor. | One narrative canvas — from drill collar to product output. Control Room digital twin. Hydro Twin for LI defense. |
| **Defense Buyers** | 18–24 month procurement delays when FEOC documentation is incomplete. No way to verify supply chain provenance. | Infrastructure-first security posture + FEOC origin tracking + SHA-256 audit chain. OpenAPI spec for integration. |
| **EU Compliance** | Battery Passport enforcement (Feb 2027) with no standard tooling. Schema gaps across the supply chain. | 22 CEN/CENELEC DPP fields mapped. Schema-validated JSON export. Inline validation with error reporting. |
| **Investors / PF** | Technical risk in the investment model. No visibility into operational readiness. | 310 tests, rate limiting, zero-cache on financials. Bear/Consensus/Bull scenarios. DSCR projections. Capital tracker. |
| **Community / NGO** | Mining companies making promises about water without transparent monitoring. No grievance path. | Hydro Twin with "modeled" labels visible before spring colors. Bilingual community card (PT/EN). FEAM/IGAM contacts. |
| **Integrators** | Undocumented APIs, no equipment catalog, unknown protocols. | OpenAPI at `/api/docs`. 17 equipment items, 28 sensors documented. OPC-UA/MQTT roadmap. Cost estimate in a week. |

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
- **Enterprise security hardening** — CSP headers, `@fastify/rate-limit` (global + per-route), API key auth on chat/upload, fail-closed ingest guard, CORS explicit allowlist, global error handler (no stack traces in production)
- **Accessibility** — focus trap on alert drawer, `aria-label` on all interactive icon buttons, `aria-expanded` on disclosures, explicit `type="button"` on all buttons, WCAG-aligned design tokens
- **React.memo on all 14 map overlays** — zero unnecessary re-renders during pan/zoom. Unified `Z` constant for z-index management.
- **Design token compliance** — all colors from `W.*` (TypeScript) and `var(--w-*)` (CSS). Theme-switchable architecture.
- **Public dashboard engine (Mini Engine)** — JSON-driven system for branded public pages. Live: Prefeitura de Poços de Caldas partnership dashboard at `/view/prefeitura-pocos`
- **310 automated tests** across 3 packages (260 frontend + 50 server) — including overlay contract tests, hook behavior tests, chat route auth tests, error path coverage, and live-mode integration tests
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
- **27 AI agent tools** — domain-grounded chat with tools spanning financials, geology, compliance, lithology, DPP validation, security architecture, stakeholders, market sizing, audit chain verification, and web search — all backed by seeded project data
- **Pilot Plant Digital Twin** — interactive Control Room with **17 equipment items** (Metso, Andritz, GEA, Outotec suppliers), **28 sensors** mapped to live telemetry paths, **7 process steps** from ore to MREC product, **15 animated flow connections** (process, reagent, recycle, utility, product). Click any equipment node to inspect supplier, capacity, material, sensors, and connected equipment. Collapsed HUD card shows pH, MREC output, water recirculation, and TREO grade at a glance.
- **Real SHA-256 audit chain** — cryptographic append-only audit trail with chain verification API (`/api/audit/verify-chain`). Merkle root anchoring roadmap (Phase 1). Schema migration v2 with dedicated `audit_events` table.
- **Hydro Digital Twin** — spring monitoring network with **1,092 public-reference spring points**, piezometer readings, water quality gauges with threshold indicators, climate data (precipitation, temperature, humidity, evapotranspiration, soil moisture), violet climate palette distinct from operational cyan
- **Interactive report templates** — 3 light-mode reports (Environment, Operations, Drill Tests) accessible via ViewSwitcher dropdown. Each report is a vertically-scrollable single page with data visualizations, JORC tables, process flows, cost curves, and community metrics. Time range selector (7d/30d/90d/1yr/All). Export PDF via native browser print dialog. Portal-based lightbox preserves dashboard state underneath.
- **Report light palette (`WL`)** — purpose-built light-mode variant of the `W` design token system. Print-optimized CSS with `@media print` styles. Zero new dependencies for PDF export.
- **Founders Deck** (`/founders-deck`) — 20-slide pitch deck tailored for serial founders/angels. Real code blocks from codebase, architecture diagrams, hallucination test suite, scorecard valuation, persona score progression, competitive comparison with dollar amounts. Persona-targeted slide badges (Juliano=CTO, Guilherme=Business).

---

## Call to Action

| Audience | CTA | Opening Line |
|----------|-----|--------------|
| Operators | **Request a pilot deployment** — hydro + discharge KPIs tied to your LI conditions | "We built it inside the Caldeira. Now let's build it on your project." |
| Defense / Compliance | **Design partnership** — passport schema and batch attestation API co-development | "22 DPP fields mapped. Help us get the rest right before Feb 2027." |
| Investors | **Schedule a demo** — see the full stack from pit to magnet | "310 tests, 9.4 persona score, $5–7M pre-money. 45 minutes." |
| Integrators | **Review the API** — OpenAPI spec + equipment catalog + integration roadmap | "Here's the spec. How fast can you map OPC-UA tags?" |
| Community | **Explore the dashboard** — Prefeitura de Poços de Caldas partnership page | "Monitoring in Portuguese, with the phone number to call." |

---

## Built by

**Carlos Toledo** — Founder, Product & Technical Lead. Born and raised in Poços de Caldas, inside the Caldeira. Air Force pilot, full-stack developer, Product Design degree. Built the entire stack solo — 310 tests, enterprise security hardening, 27 AI agent tools, pilot plant digital twin (17 equipment, 28 sensors), real SHA-256 audit chain, production deployment gate, accessibility-hardened. 40 years of local context that no outside team can replicate.

**Dr. Heber Caponi** — Scientific Advisor. Decades of active Caldeira field research through LAPOC. The scientific bridge from simulated data to field-verified instrument channels.

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

---

## Founders-Focused Enhancements (v16: Founders Pitch Deck)

**Added:** 2026-04-10  
**Target personas:** Juliano Dutra (CTO, iFood co-founder, 20+ angel investments) and Guilherme Bonifácio (Business, iFood co-founder, 110+ angel investments, Kanoa Capital)

### New Landing Page Sections (`/lp`)

**Hero enhancement**  
Added stat line: "310 automated tests · Zero compilation errors · TypeScript strict · One developer"  
Hero CTA updated to link to `/founders-deck` alongside `/` (platform).

**AI Agent section** (new)  
- Headline: "27 domain tools. Grounded in truth."
- Copy: "Frontier LLM with 27 domain-specific tools. 10 hallucination tests. Model-agnostic via AI SDK. Every response carries visible provenance — the agent refuses to speculate."
- Terminal block: Hallucination test suite showing the "refuses lithium" test
- Tool categories card: Geology, Financial, Compliance, Operations, Environmental, Market
- Provenance note: "Provenance UI on every response · Sources collapsible"

**Market & Regulatory section** (new — side-by-side layout)  
- Left: Sourced TAM/SAM/SOM with analyst citations (Mordor Intelligence, Grand View Research, Dataintelo, Growth Market Reports)
- ACV callout: "At $102k ACV, Vero costs 0.03% of client annual revenue"
- Right: Regulatory moat — EU DPP (Feb 2027, 22/37 fields), US FEOC (active), Australian ESG (2025+)
- Closing line: "No competitor is past 20% DPP coverage. Enforcement is in 10 months."

**Report Templates section** (new)  
- Headline: "Interactive reports. Export-ready PDF."
- 3 cards: Environment, Operations, Drill Tests with accent colors
- Terminal block: WL light palette code showing the token-swap architecture

**CTA update**  
Added "Founders Deck" button linking to `/founders-deck` in both hero and footer CTA sections.

**Nav update (v16)**  
Nav expanded from 4 to 6 items: Platform, Industries, **AI Agent** (new), **Market** (new), Architecture, Team. "Founders Deck" button links to `/founders-deck`.

### Founders Deck (`/founders-deck`) — v16 (26 slides)

**File:** `src/pages/FoundersDeck.tsx`  
**Route:** `/founders-deck` (lazy-loaded, ErrorBoundary-wrapped)  
**Slides:** 26 slides (expanded from 20 in v16). Narrative arc: Honesty → Problem → Opportunity → Product → Engineering → Science → Business → Timing → Close.

**New slides added in v16:**
- **Slide 0 — Disclaimer**: Honesty statement mirroring Guilherme's $7M return integrity signal
- **Slide 12 — LAPOC Pipeline**: Simulated → Field-Verified transition, Dr. Caponi profile, zero frontend changes visual
- **Slide 18 — Risk/Mitigation**: 6 risks with named mitigations (solo founder, zero revenue, single customer, DPP delay, NdPr volatility, Brazil jurisdiction)
- **Slide 19 — Exit Paths**: Mining major (BHP/Rio Tinto), ERP vendor (SAP/Oracle/Palantir), ECA (IFC/BNDES), 3-5yr horizon, $55-200M EV
- **Slide 22 — The Monday Play**: Meteoric demo plan — Gale, De Carvalho, Tunks — per-persona needs, $102k/yr ask, 0.03% framing
- **Slide 23 — Why Before Monday**: Timing arbitrage — $5-7M today → $7M+ post-pilot, ~$2M equity creation

**Updated slides in v16:**
- **Slide 20 — Team**: 4th card "Strategic Advisor" with amber border — explicit advisory invitation
- All slides use shared deck components from `src/components/deck/` (DeckShell, Terminal, StatCard, Bullet, GlassRow, Tag, SyntaxHelpers)

**DevTools easter egg:**  
Console log on `/founders-deck` with `%c` styled output personalized for Juliano: brand colors (#7C5CFC, #00D4C8), key metrics (310 tests, 107 tokens, MaybeAsync, 3 processes), `git clone` CTA.

**Architecture improvements:**
- All deck primitives extracted to `src/components/deck/` (~400 lines deduplication)
- `DeckShell` component handles keyboard nav, swipe, progress bar, dots, prev/next, counter, hint — shared by all 3 decks
- ESC key now uses `useNavigate()` instead of `window.location.href` (React Router)
- `Terminal` component has `large` prop for LP sizing vs deck sizing

---

## Persona feedback on website copy (2026-04-10, v13 — CTO EGO Sprint Ultimate Edition)

| Persona | Score | Verdict | Key quote |
|---------|-------|---------|-----------|
| Chairman | **10.0** | Control Room + governance depth = board ceiling | "The digital twin is what I'd show the board" |
| CEO | **10.0** | Digital twin is the demo-closer | "Click the plant card and the 'is this real?' question disappears" |
| Chief Geologist | **10.0** | Metallurgically accurate process flow | "ROM ore → MREC product — this matches the flowsheet" |
| DoD Buyer | **8.0** | Security hardening moved score (+0.5) | "CSP, rate limiting, fail-closed ingest — this team thinks like an operator" |
| EU Regulator | 8.5 | CEN/CENELEC + DPP + schema validation | "22 fields mapped. Show me the remaining 9." |
| PF Analyst | **9.5** | 310 tests + rate limiting + report templates (+0.5) | "The technical risk discount in my model just got smaller" |
| NGO | 8.0 | Hydro Twin + bilingual community card | "Show me when modeled becomes field-verified" |
| Integrator | **10.0** | Equipment-sensor catalog + OpenAPI | "Give me pilotPlantData.ts and I'll have OPC-UA tags in a week" |
| Journalist | **10.0** | Control Room hero screenshot + data honesty | "That's the image I lead the article with" |

**Weighted average: 9.4/10** — 6 of 9 personas at code ceiling (10.0). v1 6.8 → v11 9.2 → v13 9.3 → v15 9.4. Report templates moved PF Analyst (+0.5) and NGO (+0.5). Remaining gaps: FedRAMP (DoD), full DPP coverage (EU), covenant monitoring (PF), field-verified springs (NGO).

---

## Iteration checklist

1. Update this file.
2. Verify voice and naming against [`branding.md`](../branding.md).
3. Verify persona framing against [`strategy.md`](../strategy.md) value map.
4. Mirror critical strings in `README.md` / `HANDOFF.md` if they are "source of truth" for collaborators.
5. Update React components for UI-visible strings (`LandingPage.tsx`, `PitchDeck.tsx`, `FoundersDeck.tsx`).
6. If claims touch resources or permits, align [`docs/data/caldeira/DATA_SOURCES.md`](../data/caldeira/DATA_SOURCES.md) and [`issuerSnapshot`](../../src/data/caldeira/issuerSnapshot.ts).
7. Rehearse against **Appendix C** (coverage map) in [`PITCH_DECK_COPY.md`](./PITCH_DECK_COPY.md) before high-stakes demos.
8. After each release, check persona verdicts in table above and [`docs/Personas.md`](../Personas.md) for gaps.
