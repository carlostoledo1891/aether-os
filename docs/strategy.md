# Vero — Go-to-Market Strategy

**Purpose:** Define how Vero reaches each stakeholder segment — who we target, what we lead with, how we close, and what we charge. This is the operational companion to [`branding.md`](branding.md) (brand identity) and [`Personas.md`](Personas.md) (stakeholder profiles).

**Last updated:** 2026-04-10 (post v16 — Juliano + Guilherme Final Sprint)  
**Cross-references:** [`VALUATION.md`](VALUATION.md), [`copy/PITCH_DECK_COPY.md`](copy/PITCH_DECK_COPY.md), [`copy/WEBSITE_COPY.md`](copy/WEBSITE_COPY.md), [`branding.md`](branding.md)

---

## 1. Strategic Thesis

Vero wins by being the **only platform built inside the project it serves**. The founder grew up in the Caldeira, the chief scientist studies it, and every feature was stress-tested against 9 named stakeholder personas before a single line of marketing was written.

The GTM strategy is **persona-first**: each audience hears the message framed around their deepest need, not a generic feature list. The product already scores 9.4/10 across 9 stakeholders — the gap is commercial execution, not code.

**Core insight:** In critical minerals, trust is sold peer-to-peer. Operators trust operators. Regulators trust schema compliance. Investors trust test counts and architecture. The strategy mirrors this — lead with the evidence each persona already knows how to evaluate.

---

## 2. Persona Value Map

Each external persona has one **deep need** — the thing that keeps them up at night — and one **hero feature** in Vero that speaks directly to it.

### 2.1 Meteoric Leadership (Internal Champion Personas)

| Persona | Deep Need | Hero Feature | Opening Line |
|---------|-----------|--------------|--------------|
| **Chairman (Tunks)** | One coherent field → filing → market story. No contradictory channels. | Executive Overview — 9 tabs synchronized to board/steerco rhythm. Disclosure mode for market sessions. | "Every tab maps to a board agenda item. One narrative, zero contradictions." |
| **CEO (Gale)** | Execution credibility that reduces diligence friction for capital raises. | Capital tracker + DFS bars + milestone CPs + risk register — the "$443M CAPEX" answer in one click. | "Your next raise closes faster when every due diligence question has a dashboard answer." |
| **Chief Geologist (De Carvalho)** | Defensible data with clear methodology labeling. Nothing on screen that a QP wouldn't sign. | Drill trace schematic with JORC badges + resource classification with ASX citation links + geology/hydro firewall. | "Every number links to its JORC table. The digital twin never pretends to prove the deposit." |

### 2.2 External Stakeholders

| Persona | Deep Need | Hero Feature | Opening Line |
|---------|-----------|--------------|--------------|
| **DoD Program Officer** | Deployment-ready security architecture for defense procurement. FedRAMP pathway. | Security posture: CSP headers, rate limiting, API key auth, fail-closed ingest, SHA-256 audit chain, OpenAPI spec. FEOC origin tracking. | "Infrastructure first, map second. Here's the security architecture, the OpenAPI spec, and the audit chain." |
| **EU Enforcement Officer** | Schema-compliant digital product passport with verification chains. 100% field coverage. | DPP JSON export with CEN/CENELEC field mapping (22 fields, 59% coverage) + inline schema validation. Export button. | "22 mandatory DPP fields mapped. Schema-validated JSON export from any batch. Here — run it against your validator." |
| **Project Finance Analyst** | Covenant monitoring narrative that de-risks the investment model. Technical risk discount. | Financial scenario modeling (Bear/Consensus/Bull) + DSCR projections + zero-cache policy + 310 automated tests. | "310 tests, rate limiting, zero-cache on financial data. The technical risk discount in your model just got smaller." |
| **Water Justice NGO** | Honest environmental monitoring with community grievance path. No "green" verdicts. | Hydro Twin spring monitoring + bilingual community card (PT/EN) with FEAM/IGAM/MPF contacts + visible "modeled" labels. | "Every spring shows 'modeled' until field-verified. Here's the phone number for FEAM. In Portuguese." |
| **SCADA Integrator** | Clean integration surface with documented contracts. Cost estimate in a week. | OpenAPI spec at `/api/docs` + AetherDataService seam + equipment-sensor catalog (17 equipment, 28 sensors). OPC-UA/MQTT roadmap. | "Here's the OpenAPI spec. 17 equipment items, 28 sensors, documented DTOs. How fast can you map OPC-UA tags?" |
| **Journalist / Researcher** | Verifiable claims with clear simulation/public/modeled boundaries. No headline risk. | Data honesty banner + build verification stamp + issuer snapshot with ASX links + Pilot Plant Digital Twin screenshot. | "We label what's simulated, what's public, and what's modeled. The disclaimer is always visible. Here's the ASX link." |

---

## 3. GTM Approach by Tier

### Tier 1 — Flagship Operator (Meteoric Resources)

**Status:** Active development partner. Platform built on their Caldeira Project data.

**Strategy:** Convert from development partnership to paid pilot ($102k/yr Growth tier). Demonstrate ROI through:
- Reduced diligence friction on next capital raise
- Single narrative canvas for DFS, permitting, IR, community
- Operational visibility (Control Room) that impresses institutional investors

**Key action:** Close the pilot contract. This is the single event that moves every valuation number up.

**Message:** "We built Vero inside your Caldeira. Now let's make it your competitive advantage in the next funding round."

### Tier 2 — Buyers & Compliance (OEM / DoD)

**Strategy:** Design partnership, not sales pitch. Vero is not yet FedRAMP-certified — we lead with architecture and invite co-development on the passport schema and batch attestation API.

**Approach:**
1. Identify responsible sourcing teams at EV OEMs and defense primes via rare earth conferences (TMS, Critical Minerals Summit)
2. Lead with the DPP JSON export and FEOC tracking — hands-on, not slideware
3. Offer API co-development partnership at discounted Starter tier ($30k/yr)
4. Expand to Growth tier when production integration begins

**Message:** "We're building the DPP schema your supply chain will need by Feb 2027. Help us get the fields right."

### Tier 3 — Investors

**Strategy:** Demo → Deck → Financial Model. The product sells itself when seen — 310 tests, 9.4 persona score, and a Pilot Plant Digital Twin are not things competitors can fake.

**Approach:**
1. 45-minute live demo (not slides) — walk through Field Ops → Compliance → Executive
2. Follow with pitch deck for key numbers and valuation
3. Share VALUATION.md financial model for deep-dive investors
4. Close with seed ask: hire commercial lead, onboard 5 pilots, connect LAPOC instruments

**Message:** "9.4/10 across 9 stakeholder personas. 310 automated tests. Built by a founder inside the Caldeira. $5–7M pre-money."

### Tier 4 — Regulators & Standards Bodies

**Strategy:** Compliance evidence package demonstrations. Position Vero as the reference implementation for critical mineral digital product passports.

**Approach:**
1. Present at EU Battery Regulation forums and CEN/CENELEC working groups
2. Offer free schema validation tool access as industry contribution
3. Use Vero's 59% DPP field coverage as a conversation starter about what the industry still needs
4. Position for standards body advisory role (not vendor)

**Message:** "We mapped 22 CEN/CENELEC mandatory fields. Here's what the industry is still missing."

### Tier 5 — Community & Political (Brazil)

**Strategy:** Public dashboard via Mini Engine. Local employment, fiscal contribution, and environmental monitoring in Portuguese. Vero as the bridge between mining operator and community trust.

**Approach:**
1. Deploy Prefeitura dashboard (already live at `/view/prefeitura-pocos`)
2. Present to Prefeitura de Poços de Caldas as partnership showcase
3. Use bilingual community card and grievance path as evidence of good faith
4. Position for state-level replication (FEAM partnership potential)

**Message:** "The monitoring platform your community can actually read — in Portuguese, with the FEAM phone number."

---

## 4. Demo Playbook

### Pre-Demo Checklist
- [ ] Verify latest deployment is live and stable
- [ ] Confirm data mode (mock/live) — know which banner will show
- [ ] Prepare persona-specific talking points (see Section 2)
- [ ] Test all 3 views + Prefeitura page load successfully
- [ ] Have PITCH_DECK_COPY.md open for reference numbers

### Demo Flow (45 minutes)

**Minutes 0–5: Context**
- "Vero is the trust layer for critical mineral supply chains."
- Show LP hero for 10 seconds — establish visual credibility
- State the data honesty mode: "Everything you see is demo data unless labeled otherwise."

**Minutes 5–15: Field Operations**
- Operations map: terrain, licences, drill collars, plant sites
- Click a drill collar → show provenance badge
- Open Control Room → click equipment → show sensor telemetry
- Switch to Hydro Twin → springs, APA, water quality gauges

**Minutes 15–25: Compliance & Traceability**
- Compliance tab: FEOC tracking, DPP field coverage
- Export DPP JSON → show schema validation
- Traceability: molecular-to-magnet ledger
- (For DoD rooms: lead with this section, not Field Ops)

**Minutes 25–35: Executive Overview**
- Financial scenarios (Bear/Consensus/Bull)
- Risk register → Capital tracker → DFS bars
- Agencies matrix → Audit trail
- ESG frameworks

**Minutes 35–40: Technical Credibility**
- "310 tests, zero TypeScript errors, CSP headers, rate limiting"
- Show OpenAPI docs at /api/docs
- Show build verification stamp
- "Persona-scored at 9.4/10 — here's the methodology"

**Minutes 40–45: Ask**
- Persona-specific CTA (see Section 2 opening lines)
- "What would you need to see in a pilot?"

### Per-Persona Demo Emphasis

| Persona | Lead with | Skip / minimize |
|---------|-----------|----------------|
| Operator CEO | Control Room → Executive Capital | DPP details |
| Investor | Hero stats → All 3 views → Valuation | Technical architecture |
| DoD buyer | Security/architecture → Compliance → FEOC | Map aesthetics |
| EU regulator | DPP export → Schema validation → Compliance tab | Financial scenarios |
| PF analyst | Executive Financials → Risk → Architecture quality | Hydro Twin |
| NGO / community | Hydro Twin → Community card → Prefeitura dashboard | Executive financials |
| Integrator | OpenAPI docs → Control Room → Equipment catalog | Compliance copy |
| Journalist | LP → Data honesty banner → Control Room screenshot | Executive deep-dive |

---

## 5. Pricing Strategy

Source: [`VALUATION.md`](VALUATION.md)

| Tier | Annual | Monthly Equiv. | Target Profile | Includes |
|------|--------|----------------|----------------|----------|
| **Starter** | $30,000 | $2,500 | PFS-stage junior miners | 3 views, mock data, standard map layers |
| **Growth** | $102,000 | $8,500 | DFS-through-construction operators | Full platform, live telemetry, API access, custom overlays |
| **Enterprise** | $180k–$350k | Custom | Multi-asset operators, ECA/DFI | Multi-tenant, historian integration, custom compliance modules, SLA |

**Pricing principles:**
- Value-based, not cost-based. Vero's $102k/yr is 0.03% of Caldeira's $821M NPV.
- Annual contracts with monthly billing option at 15% premium.
- Pilot tier ($30k) exists to reduce friction on first close — upgrade path to Growth is natural at DFS stage.
- Enterprise pricing is relationship-driven. ECA/DFI mandates create procurement budgets.

**Discounts:**
- Design partnership (Tier 2 buyers): Starter rate for first year in exchange for schema co-development
- Academic / research: Case-by-case (Dr. Caponi's LAPOC connection)
- Never discount Growth below $80k — it devalues the platform

---

## 6. Competitive Positioning

### Direct Competitors

No direct competitor exists in "critical mineral supply chain trust layer." Adjacent players:

| Player | What they do | Why Vero wins |
|--------|-------------|---------------|
| **Minviro** | LCA / carbon footprinting for mining | Single-dimension (carbon). No compliance, no field ops, no executive view. |
| **Circulor** | Supply chain traceability (general) | Horizontal — not mineral-specific. No DPP schema validation. No geology. |
| **ReSource** | Digital product passports | Schema tools without field integration. No plant digital twin. No geological context. |
| **IBM Sterling** | Supply chain visibility (enterprise) | Enterprise-scale, enterprise-price, enterprise-complexity. Not built for critical minerals. |

### Competitive Moat

1. **Founder inside the Caldeira** — 40 years of local context no outside team can replicate
2. **Persona-validated at 9.4/10** — proven product-market fit methodology, not just feature claims
3. **Three truths in one platform** — no competitor covers field ops + compliance + executive in one stack
4. **Architecture credibility** — 310 tests, production 3-process architecture, OpenAPI, SHA-256 audit chain
5. **Mini Engine** — JSON-driven public dashboards (Prefeitura) that no competitor even attempts

---

## 7. Outreach Sequence

### Cold Outreach (Operators)

**Email 1 — The hook (Day 0)**
Subject: "What if due diligence took 45 minutes instead of 45 days?"

Body: 2 sentences about Vero + link to LP. No attachment.

**Email 2 — The proof (Day 3)**
Subject: "310 tests, 9.4/10 persona score, built inside a Caldeira"

Body: Screenshot of Control Room + 3 bullet metrics. Link to live demo.

**Email 3 — The ask (Day 7)**
Subject: "15 minutes — I'll show you the platform your investors wish you had"

Body: Direct calendar link. No pitch, just demo offer.

### Warm Intro (via Meteoric network)

**Step 1:** Meteoric intro email with 1-line context
**Step 2:** Follow with LP link + "happy to do a 15-min walkthrough"
**Step 3:** Demo → deck → follow-up with persona-specific CTA

### Conference Playbook

**Pre-event:** Identify 5 target attendees, prepare persona-specific opening lines
**At booth/talk:** Live demo on laptop — Control Room → DPP export → Executive view
**Follow-up (within 24h):** Personalized email referencing specific conversation + demo link

---

## 8. Key Metrics to Track

| Metric | Target (6 months) | Why it matters |
|--------|-------------------|----------------|
| **Pilots signed** | 3 (incl. Meteoric) | Revenue + credibility |
| **Demo requests** | 15 / month | Pipeline health |
| **Time to first demo** | < 48h from inquiry | Speed = seriousness |
| **Persona score** | Maintain ≥ 9.0 | Product quality gate |
| **Test count** | > 350 | Engineering credibility signal |
| **DPP field coverage** | 75% (from 59%) | EU enforcement readiness |
| **Website → Demo conversion** | > 8% | LP effectiveness |
| **Cold email reply rate** | > 15% | Message-market fit |

---

## 9. 90-Day GTM Action Plan

### Month 1 — Foundation

- [ ] Close Meteoric pilot contract ($102k/yr)
- [ ] Ship `branding.md` and `strategy.md` (this document)
- [ ] Update LP and deck with persona-specific messaging
- [ ] Launch cold outreach to 5 REE operators (ASX/TSX-listed)
- [ ] Register for 2 industry conferences (TMS, Critical Minerals Summit)

### Month 2 — Pipeline

- [ ] Run 10+ demos from conference leads and cold outreach
- [ ] Identify 2 OEM responsible sourcing teams for design partnership
- [ ] Deploy DPP schema validation as standalone tool (lead magnet)
- [ ] Present Prefeitura dashboard to municipal government
- [ ] Connect LAPOC instruments (converts "simulated" → "field-verified")

### Month 3 — Conversion

- [ ] Close 2 additional pilots (Starter tier minimum)
- [ ] Begin seed fundraise process with $5–7M target
- [ ] Publish case study: "Caldeira — from development to deployment in [X] months"
- [ ] Achieve 75% DPP field coverage
- [ ] Ship OPC-UA integration proof-of-concept for SCADA integrator pipeline

---

## 10. Risk & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Meteoric pilot doesn't close | Entire GTM thesis weakened | Parallel outreach to 2–3 alternative operators; LP + deck can stand alone |
| EU DPP enforcement delayed | SAM growth slower than projected | DoD FEOC requirements are independent driver; diversify persona emphasis |
| Solo-founder bandwidth limits sales | Pipeline dies | Seed hire #1 = commercial lead; automate demo scheduling |
| Competitor enters with deep pockets | Price pressure, feature race | Moat is local context + persona methodology — not replicable by throwing engineers at it |
| Technical due diligence finds gaps | Investor confidence shaken | 310 tests + zero TS errors + CSP headers + rate limiting already address this; maintain quality gate |

---

## 11. Meteoric Pitch Plan (Apr 14 Demo)

**Who's in the room:**
- **Nick Gale (CEO)** — Needs execution credibility for capital raises. Digital twin is his demo-closer.
- **Dr. De Carvalho (Chief Geologist)** — Needs defensible QP-grade data with JORC badges. Will test the AI agent.
- **Nick Tunks (Chairman)** — Needs one coherent field-to-filing-to-market story. Executive Overview is his slide.

**The ask:** Growth tier pilot — $102k/yr annual contract.

**90-day integration plan:**
1. Week 0-2: Contract + API keys + LAPOC instrument mapping
2. Week 2-4: First live sensor data flowing (simulated labels → field-verified)
3. Week 4-6: Custom DFS presentation views via Mini Engine
4. Week 6-8: Community dashboard review with Prefeitura
5. Week 8-12: Full production, board-ready

**0.03% framing:** Vero costs $102k/yr — 0.03% of Caldeira's $315M annual revenue consensus. Less than one day of interest on the $443M CAPEX construction loan. Price sensitivity: effectively zero.

---

## 12. Dr. Caponi Formalization

**Role:** Chief Scientific Advisor (LAPOC)

**What connects:** Piezometers, water quality sensors, geological sampling from LAPOC field instruments. When LAPOC data connects to Vero, every "simulated" label in the Hydro Twin becomes "field-verified."

**Formalization terms:** Advisory agreement, equity stake (0.5-1%), vesting over 2 years. Deliverable: LAPOC instrument data access and scientific credentialing.

**Impact:** The single highest-value technical milestone — converts a demo into a product. Also the PR moment: "Built by the founder who grew up in the Caldeira, validated by the scientist who has studied it for decades."

---

## 13. Founders-as-Advisors Outreach

**Targets:** Juliano Dutra (CTO lens), Guilherme Bonifácio (Business lens)

**Positioning:** Strategic Advisory role. Not just investors — operators who shape GTM, pipeline, and commercial execution.

**What they bring:**
- Juliano: 20+ angel investments, iFood/Gringo technical leadership, code review credibility
- Guilherme: 110+ investments, search fund diligence methodology, commercial activation playbook

**Timing play:** Their investment at $5-7M pre-money creates the runway that closes the Meteoric pilot. The pilot closes the valuation gap. 30-40% paper value increase in days, not months.

---

*Strategy is a living document. Update after every pilot close, conference, or material product change.*
