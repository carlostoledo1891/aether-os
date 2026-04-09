# Vero — pitch deck copy (outline + talk track)

**Purpose:** Slide-ready narrative blocks for investor, buyer, and regulator-facing decks. Iterate here; export to Keynote/PDF separately.

**Last synced from codebase:** 2026-04-09  
**Source:** [`HANDOFF.md`](../../HANDOFF.md), [`README.md`](../../README.md), product positioning in views, governance disclaimers in `mockDataService` / executive tabs, stakeholder stress-test personas (issuer → capital → buyers → society → ecosystem → media), and [`VALUATION.md`](../VALUATION.md).  
**Releases since last sync:** Synthetic Data Bridge, Data Layer Refactor, CTO Code Review Sprint, Feature Sprints v5–v6, Vero Rebrand + AI Agent, Map Polish, Demo Readiness, Premium UI Polish, SCADA Win + Pages Scaffold, Unified Map Controls + Perspective, Real Audit Chain, **v11: Pilot Plant Digital Twin / Control Room** (17 equipment, 28 sensors, 7 process steps, interactive SVG schematic, animated flow lines, equipment inspector).

---

## Slide 0 — Honesty paragraph (media, retail, any skeptical room)

*Place early in appendix or verbally after title. Journalists and equity researchers reward this; competitor intel cannot use ambiguity against you.*

**Suggested copy**  
This demo mixes three kinds of information: **(1)** public-reference geometry and citations where noted, **(2)** illustrative scenarios and dashboards aligned to disclosed materials where labeled, and **(3)** **simulated** plant and environmental time series for UX rehearsal — **not** a substitute for IMS, permit registers, competent-person sign-off, or filed instruments. Nothing on screen is an attestation unless your counsel and IR attach a **versioned, board-approved facts** layer to a production build.

---

## Slide 1 — Title

**Vero**  
*The trust layer for critical mineral supply chains*

**Subtitle**  
Telemetry · compliance · traceability · capital — one stack, production-hardened

---

## Slide 2 — The problem

- Critical minerals are **national security and industrial policy** (FEOC, IRA, EU battery passport).  
- Operators face **permitting and water** as the real bottleneck — not only grade and tonnes.  
- Buyers need **defensible provenance**; boards need **one coherent story** across technical, ESG, and financial workstreams.  
- Spreadsheets and slide decks **don't survive diligence** when geometry, citations, and telemetry don't line up.  
- **US DoD faces 18–24 month procurement delays** when FEOC documentation is incomplete; **EU Battery Passport enforcement begins Feb 2027** with no industry-standard tooling.

---

## Slide 3 — What Vero is

**Three truths, one platform:**

- **Ground truth** (Field) — operations and hydrology on a map with **explicit provenance** (public geometry vs modeled vs simulated telemetry).  
- **Trade truth** (Compliance) — FEOC / IRA / passport-style **evidence metaphors** and batch ledger — scoped as **repository design**, not certification, until attestation chains and document types are wired.  
- **Board truth** (Executive) — scenarios, risk, capital, DFS rhythm, agency matrix, audit trail, ESG coverage — **aligned to steerco and disclosure rhythm**, not a replacement for formal reporting.

**Single source of narrative (internal alignment)**  
One canvas helps **synchronize** DFS, regulatory log, and field story — so engineering, permitting, IR, and community don't each tell a **slightly different** tale in the same week.

**Production-grade data integrity (new — say this)**  
Geological and financial data **never shows stale numbers** — zero-cache policy enforced at the architecture level. Every data consumer has **error fallback UI** — no more blank screens or infinite spinners when the backend is down. **Connection-aware banner** tells the user exactly what state the system is in. **218 automated tests** across 3 packages, including integration tests that simulate live async data flow and verify the app stays stable. **25 AI agent tools** grounded in domain data — lithology, DPP validation, security architecture, stakeholders, market sizing, and more.

**Non–system-of-record boundary (say this out loud)**  
Vero is **not** IMS, not the permit-conditions register, and not agency submission software. It is a **governance and rehearsal layer** until you wire versioned, owner-assigned updates and filed anchors.

**Geology / hydro firewall**  
**Resource, reserve, and exploration** live in **Executive → Assets** (classification, disclosure discipline). **Hydro Twin** is **monitoring + scenario communication** — not ore proof. Never imply the digital twin **proves** the deposit.

**Why Caldeira:** **Meteoric Resources — Caldeira Project** (Poços de Caldas, MG, Brazil · ASX: MEI) is the flagship deployment — not the only one we can serve, but the one that proves the platform where it matters most.

---

## Slide 4 — Why Caldeira (showcase framing)

| Audience | What they need |
|----------|----------------|
| **Buyers** (DoD, OEMs, magnet makers) | Defensible chain-of-custody **design**, security and integration path — not "dashboard as authority" |
| **Regulators / agencies (narrative)** | Cumulative impact and monitoring **story** with honest limits on what is modeled |
| **Operators** (Meteoric, partners) | Plant + hydro visibility; **who updates what** when schedules slip |
| **Executives / board** | Financial + ESG + risk in one rhythm; **disclosure-aligned** figures for market-facing sessions |
| **Project sponsor / VP Projects** | One narrative canvas for silos; explicit **SOR boundary** |
| **IR / listed issuer** | **Disclosure mode** concept — versioned, dated, board-approved facts feeding market demos |
| **Permitting & env consultants** | Transparency layer **or** opponent dissect layer — label **modeled** vs **instrument**; path to method-statement exports |
| **Community / social performance** | Listening + monitoring plan + response — not prediction-as-promise; avoid spring colors as **verdict** on livelihoods |
| **PF / ECAs / insurers** | Capital · risk · regulatory log thread; path to **audit → IE** — not "AI replaces legal opinion" |
| **Integrators (SCADA / PI)** | Clean **data-service seam**; read-only historians, OT boundaries — we don't replace control-room HMI |
| **Media / researchers** | Clear **fake vs public vs modeled** paragraph; primary docs still win headlines |

---

## Slide 5 — Product: three experiences (demo)

**1. Field Operations**  
- **Operations** map: terrain-aligned licences, pilot and commercial plant sites, PFS pit and spent clay, named drill collars, optional logistics rehearsal layers (off by default).  
- **Hydro Twin:** springs, nodes, APA/buffer context, cumulative aquifer narrative — **LI defense** positioning.

**Strapline (Ops):** Pilot telemetry → board-grade trust layer  
**Strapline (Hydro):** Hydro Digital Twin → cumulative aquifer + spring model → LI defense

**2. Compliance & Traceability**  
- Map: **Caldeira → export corridor** narrative.  
- **FEOC / IRA / passport** at **headline** level — pair with **attestation and mass-balance** roadmap for OEM rooms; avoid "0.00% reads like certification" without **who audits** and **which documents** back the claim.  
- **OECD DD / Annex II** framing option: speak in **risk and evidence types** (human rights, environment), not only hashes.  
- **EU enforcement mindset:** roadmap = fields that map to **declaration / passport schemas** (stub acceptable if labeled).  
- **DoD-adjacent rooms:** hero = **tenancy, logging, classification, integration** — not the basemap. Blockchain = precise scope (no non-repudiation fairy tale without **key custody / HSM** story).  
- **Molecular-to-magnet** ledger *(demo hashes; production = ERP/CBP + lab + customs doc types post-pilot).*

**3. Executive Overview**  
Tabs: **Assets · Financials · Risk · Pipeline · Capital · DFS · Agencies · Audit · ESG**  
- Financials: **PFS-aligned scenarios** — not a live market feed; **As of** issuer snapshot with ASX citation path; **IR disclosure mode** = only public-filed figures for external sessions. **Zero-cache policy** on financial endpoints — never serves stale scenario data.
- Agencies: **administrative record (rehearsal)** — verify against filed instruments; **export bundle** as rehearsal for annex / method-statement workflows — not a filed EIA by itself. **API-key-gated dismiss** on alerts — no unauthenticated state changes.
- ESG: dashboard narrative — **not** JORC assurance or statutory reporting.  
- **Capital / insurance angle:** risk register + audit trail as **covenant / control narrative** — pair with roadmap for **alarm acknowledgement, maintenance logs, sensor redundancy** (MRV for credit, not gamified green).
- **All tabs:** `ErrorFallback` component on every data consumer — graceful degradation instead of blank screens. **Loading skeletons** with accessible labels while async data resolves.

**Data flow (three experiences)**

```mermaid
flowchart LR
    Field["Field Operations\n(plant + hydro)"] --> Compliance["Compliance &\nTraceability\n(buyer assurance)"]
    Compliance --> Executive["Executive Overview\n(board + investors)"]
    Field --> Executive
```

---

## Slide 6 — Why Caldeira

- **Ionic clay REE** in a well-known Brazilian alkaline complex — resource scale and metallurgy story legible to global investors.  
- **Permitting and stakeholder** context (LP/LI, APA, MPF narrative) maps cleanly to **hydro + agencies** tabs — shows we understand **water and governance**, not only NPV.  
- **Geometry and collars** in-app are **versioned and cited** (`DATA_SOURCES.md`, `issuerSnapshot`) — practice for how we'd run **any** project.

---

## Slide 7 — Technical credibility (without overclaiming)

- **Three-process production architecture** — Fastify API + simulation engine + Vite frontend; Docker Compose with health checks; Nginx reverse proxy; graceful shutdown on SIGTERM.
- **MapLibre** stack with **GeoJSON** layers, click inspectors, and **provenance badges** (simulated vs public record vs illustrative).  
- **`MaybeAsync<T>` service interface** — one contract bridges mock (sync) and live (async) modes; `useServiceQuery` hook with **documented two-layer cache** (Layer 1 = API TTL, authoritative; Layer 2 = 200ms mount-coalescing). **Geological and financial endpoints bypass all caching** — "Never show a stale number for geology."
- **Error resilience** — `ErrorFallback` component across all 14 data consumers; connection status banner (connected / degraded / offline); no more infinite loading skeletons on backend failure.
- **218 automated tests** across 3 packages — including live-mode integration tests that render real components with async services and assert bounded render counts, correct data flow, and zero console errors.
- **Deployment gate** — mandatory pre-deploy checklist (TypeScript clean, tests pass, build clean, localhost click-through all 3 views, Vercel preview verified). Documented in HANDOFF.md.
- **Data honesty banner:** mock / presentation / disclosure / live modes with **explicit** copy about what is still simulated, plus **connection-aware** degradation states. **Build verification stamp** shows git SHA and build date — "Show me when this build was last verified."
- **Accessibility hardened** — focus trap on dialogs, ARIA labels on icon buttons, explicit button types, WCAG-aligned design tokens.
- **OpenAPI spec** auto-generated from Fastify route schemas — Swagger UI at `/api/docs`, raw spec at `/api/docs/json`. Every endpoint documented with tags, summaries, and response schemas. An integrator can have a cost estimate for historian integration within a week.
- **Digital Product Passport** (EU 2023/1542 Annex VI) — 22 CEN/CENELEC mandatory fields mapped to Vero data sources. **59% coverage (13/22 mapped)**. Schema-compliant JSON export from any batch. **CEN/CENELEC schema validation** with inline error/warning reporting. Field-mapping table visible in the Buyer → Compliance tab.
- **Bilingual community card** (EN/PT-BR) — grievance path with agency contacts (FEAM, IGAM, MPF), 3-step reporting process. Language toggle persists via localStorage. A community member in Poços de Caldas can see something relevant — in Portuguese, about their water, with a phone number to call.
- **Drill trace schematic** — Recharts bar chart showing 8 drill holes by depth and TREO grade (color-coded: green ≥8000 ppm, cyan ≥5000, amber ≥3000). Click-to-detail with intercept information. **JORC reference badges** on resource classification numbers — clickable links to the ASX filing.
- **Lithological interval viewer** — drill hole lithology columns with depth-scaled bars, color-coded by rock type, linked to collar metadata and assay intercepts.
- **Stakeholders tab** — executive-level view of project stakeholders, relationships, and engagement status across regulatory, community, and commercial dimensions.
- **Map hover popups** — contextual feature detail on hover for drill collars, springs, plant sites, and infrastructure layers; quick inspection without click.
- **25 AI agent tools** — domain-grounded chat spanning financials, geology, compliance, lithology, DPP validation, security architecture, stakeholders, market sizing, and web search — all backed by seeded project data.

**Governance line for verbal pitch:**  
"We show the same numbers and maps we'd put in front of counsel — with the disclaimer layer always visible. And our deployment checklist ensures we never ship a broken link to a stakeholder again."

**Killer questions to own (speaker notes)**  
- *When DFS slips, does the UI lie until someone edits JSON?* → **Owner matrix + versioned facts layer + stale-date surfacing** (roadmap).  
- *What QP signs off on a screenshot?* → **Nothing** until counsel/IR defines disclosure mode; default demo is **non-reliance**.  
- *Can opponents FOIA spring layers?* → Public geometry labeled; **status colors = modeled UX**, not agency findings.  
- *Community "red phone"?* → **Built** — bilingual community card with FEAM/IGAM/MPF phone numbers and a 3-step grievance process, in Portuguese.  
- *What if the live link crashes during a demo?* → **218 tests, deployment checklist, ErrorFallback on every data consumer, connection-aware banner.** Process problem solved — "test what the stakeholder sees."
- *How do you prevent stale geological data on screen?* → **TTL=0 on all geological/financial endpoints.** No caching. De Carvalho principle enforced at the architecture level.
- *Export me a DPP-compliant JSON.* → **Done.** Buyer tab → Compliance → Export DPP JSON. 22 fields mapped to CEN/CENELEC Annex VI, 59% coverage, stubs explicitly marked.
- *Give me the OpenAPI spec.* → `/api/docs` — Swagger UI with all endpoints. `/api/docs/json` for machine-readable spec.

---

## Slide 8 — Traction / engineering signals

- **Pilot Plant Digital Twin** — interactive Control Room with **17 pieces of equipment**, **28 mapped sensors**, **7 process steps**, animated flow lines, and equipment-level inspector with live telemetry. Click any equipment to see supplier, specs, and real-time readings.
- **19 GeoJSON datasets** integrated (deposits, licences, drill collars, springs, infrastructure, environmental zones).  
- **218+ automated tests** across **3 packages** (173 frontend + 45 server + 13 engine) — including live-mode integration tests, component smoke tests, AI hallucination quality gate, engine generator tests, and **22 cryptographic audit chain tests**.
- **3 audience-specific views** with **14 interactive map overlay layers** + **3D perspective** with terrain DEM.  
- **Real SHA-256 append-only audit chain** — 27 AI agent tools, chain verification API, Merkle root anchoring roadmap.
- **Three-process production architecture** — Fastify API (40+ REST endpoints + WebSocket), simulation engine (2s tick + 4 external enrichers), Vite frontend — Docker Compose orchestrated.
- **2-second simulated telemetry pulse** across **10+ sensor channels** with **WebSocket broadcast** and **connection-aware UI** (connected / degraded / offline).
- **Persona-validated at ~9.2/10** weighted average — 5 of 9 stakeholder personas at code ceiling (10.0). See Appendix E.
- **Mandatory deployment gate** — TypeScript clean, all tests pass, production build clean, localhost click-through, Vercel preview before production.
- **4 external API enrichers** live — Open-Meteo (weather), BCB PTAX (FX), USGS (seismic), Alpha Vantage (stock).

**Roadmap (verbal / appendix)**  
Wire **historian / SCADA** (read-only / unidirectional gateway) or lab LIMS for verified channels — **OPC-UA / MQTT** and latency SLOs; **ANM / IEF** vector imports; **ERP + CBP** hooks for ledger and passport export; ~~**IR disclosure mode**~~ ✅; **alarm ack + maintenance**, **multi-tenant + audit logging**; **Playwright CI** for frontend smoke; **coverage floor ratcheting** (currently no floor; target 60%+). **Society / local (Brazil):** plain-language **jobs, fiscal, monitoring independence**; **PT** collateral for Poços stakeholders.

---

## Slide 8.5 — Market opportunity

- **TAM: $18.8B (2026) → $31.9B (2031)** — Global digital mining & smart mining technology.  
  *Sources: Mordor Intelligence "Smart Mining Market" (2026 $18.77B → 2031 $31.86B, CAGR 11.16%); Grand View Research "Digital Mining Market" (2024 $9.39B → 2030 $18.11B, CAGR 9.8%). Covers automation, real-time analytics, digital twins, cybersecurity, and AI across all mining verticals.*

- **SAM: $1.6B (2025) → $5.2B (2033)** — Critical minerals compliance & traceability SaaS.  
  *Sources: Dataintelo "Critical Mineral Traceability Market" ($3.8B total in 2025, software component = 42.5% ≈ $1.6B, CAGR 14.2%); Growth Market Reports "Conflict Minerals Compliance Software Market" ($1.21B in 2024 → $2.51B by 2033, CAGR 8.7%). EU Battery Regulation + IRA FEOC requirements drive adoption.*

- **SOM: $15M (2026) → $45M (2030)** — REE projects in allied jurisdictions with active compliance requirements.  
  *Methodology: Bottom-up from public project databases (ASX, TSX, SEC filings). 15 identified REE projects in development (Brazil, Australia, USA, Canada, Greenland) with active DFS/permitting × Vero Growth tier pricing ($102k/yr). Conservative 5-operator near-term target.*

---

## Slide 8.75 — Team

**Carlos Toledo** — Founder, Product & Technical Lead
- **Born and raised in Pocos de Caldas** — inside the Caldeira. 40 years of local context no outside team can replicate.
- **Brazilian Air Force Academy** (pilot) — systems discipline, operational rigor.
- **Full-stack developer + Product Design degree** — built the entire stack solo: three-process production architecture, 218+ tests across 3 packages, 27 AI agent tools, pilot plant digital twin with 17 equipment and 28 sensors, 19 GeoJSON datasets, 14 overlay layers, real SHA-256 audit chain, deployment gate, accessibility-hardened, 4 external API enrichers live.

**Dr. Heber Caponi** — Chief Scientific Advisor (LAPOC)
- **Decades of active field research** on the Caldeira alkaline complex. Still conducting fieldwork today.
- The scientific authority who converts Vero's "simulated" labels into **"field-verified"** labels.
- LAPOC instrument data is the **first live data channel** — the bridge from demo to product.

**Thiago A.** — CEO (designated)
- Deep experience in **Brazilian and international law**, enterprise operations, and development team management.
- Owns corporate structure, legal architecture, and commercial execution at pilot activation.

**Full-Stack Developer** — Engineering (designated)
- Ready to ship at pilot approval. Codebase is architected for immediate second-developer productivity.

**Why this team wins:**  
Vero is not built by consultants studying Caldeira from Perth or New York. It is built **inside the Caldeira** — by a founder who grew up on the geology, validated by a scientist who has studied it for decades, with a CEO who knows Brazilian law, and an engineer ready to scale. No competitor can assemble this combination.

---

## Slide 9 — Ask

We're looking for our first deployment partner.

**For investors:** Capital to harden ingestion, security, and first production integration (one operator + one off-taker).  
**For buyers:** Design partnership on **passport schema** and **batch attestation** API.  
**For operators:** Pilot deployment on **hydro + discharge** KPIs tied to LI conditions.

---

## Appendix A — One-liners (speaker notes)

- "We're not selling magic AI — Vero is **aligned truth** across the plant, the map, and the filing."  
- "The Hydro Twin tab exists because **water is the permit**, not the pit shell."  
- "Everything flashy is labeled **demo**; everything cited links to **your** disclosure rule."

---

## Appendix B — Words to avoid in regulated rooms

Avoid implying: cadastral survey accuracy, final permit outcomes, or live exchange prices unless sourced and labeled. Prefer: **illustrative**, **rehearsal**, **verify against ASX**, **non-survey geometry**.

Avoid implying: **compliance green** without permit condition IDs and sampling methodology; **FEOC / IRA / passport** as **certification** without attestation chain; **digital twin proves resource**; **AI compliance** replacing legal opinions or IE reports; **blockchain = non-repudiation** without key custody; replacing **SCADA / IMS**.

---

## Appendix C — Stakeholder coverage map (stress-test grid)

Use internally to ensure a deck rehearsal hits every bucket at least once.

| Bucket | Personas (abbrev.) |
|--------|---------------------|
| Issuer technical | Chief geologist / QP mindset; permitting consultant |
| Issuer commercial / governance | VP Projects; IR; community liaison |
| Capital / risk | Project finance / ECA; insurer; retail / family office |
| Buyers / compliance | OEM responsible sourcing; DoD program; EU enforcement mindset |
| Society / politics | NGO / water justice; local political (jobs, water, PT) |
| Ecosystem | SCADA integrator |
| Adversarial | Competitor intel; journalist / researcher |
| Platform truth | Product / engineering evaluator |

---

## Appendix D — Competitor intel calibration (rhetorical)

They will cross-check: **green premium**, recovery vs nameplate, ESG coverage %, FEOC language, basket consistency. **Response:** tie numbers to **one issuer snapshot + citations**; label simulation; never outrun **filed** disclosure.

---

## Appendix E — Persona-scored feedback (current release)

**Evaluation date:** 2026-04-09 (v11 — Pilot Plant Digital Twin / Control Room)

| Persona | v1 | v9 | v10 | v11 | Trajectory | Top strength | Top gap |
|---------|----|----|-----|-----|----------:|-------------|---------|
| Executive Chairman | 7.5 | 9.5 | 10.0 | **10.0** | ↑ ceiling | Control Room + governance depth | Code ceiling reached |
| CEO & MD | 7.0 | 9.0 | 9.5 | **10.0** | ↑ ceiling | Digital twin = demo-closer | Customer LOI (commercial) |
| Chief Geologist | 7.5 | 9.0 | 9.5 | **10.0** | ↑ ceiling | Metallurgically accurate process flow | Field instruments |
| DoD Buyer | 6.5 | 7.5 | 7.5 | **7.5** | → | Security architecture + SBOM | FedRAMP certification |
| EU Regulator | 6.0 | 8.0 | 8.5 | **8.5** | → | CEN/CENELEC validation + DPP JSON | 100% DPP field coverage |
| Project Finance | 7.0 | 8.0 | 8.0 | **8.5** | ↑ | Plant makes capital deployment visible | Covenant monitoring |
| Water Justice NGO | 5.5 | 7.5 | 8.0 | **8.0** | → | Water recirculation loop visible | Field-verified springs |
| SCADA Integrator | 7.5 | 9.0 | 9.5 | **10.0** | ↑ ceiling | Equipment-sensor catalog for integration | OPC-UA bridge (process) |
| Journalist | 6.5 | 9.0 | 9.5 | **10.0** | ↑ ceiling | Control Room is the hero screenshot | Customer LOI |

**Weighted average: v1 6.8 → v9 8.6 → v10 8.9 → v11 9.2** — 5 of 9 personas at code ceiling (10.0).

**v11 key insight:** The Pilot Plant Digital Twin is the single most impactful feature delivered. It converts the platform from "monitoring + compliance dashboard" into "operational digital twin" — the category commanding the highest enterprise SaaS multiples. Every persona that interacts with industrial equipment scored higher. **Remaining gaps are entirely commercial or procedural — not code-deliverable.**

**Valuation (Business Expert analysis — see `docs/VALUATION.md`):**  
Pre-revenue consensus: **$5–7M** pre-money. At $4.5M ARR (2030 consensus): **$55–90M**. Flagship customer (Caldeira) has $821M NPV at consensus — Vero's $102k/yr = 0.03% of project revenue.

---

## Iteration checklist

1. Update deck copy here after each narrative change.
2. Reconcile with [`WEBSITE_COPY.md`](./WEBSITE_COPY.md).
3. Update [`HANDOFF.md`](../../HANDOFF.md) "pitch to" table if audiences shift.
4. Keep financial and resource numbers chained to [`issuerSnapshot.ts`](../../src/data/caldeira/issuerSnapshot.ts) + latest ASX rule.
5. After each release, update persona scores in Appendix E and [`docs/Personas.md`](../Personas.md).
