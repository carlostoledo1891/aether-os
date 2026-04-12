# Vero — Valuation Analysis

**Purpose:** Living valuation document for investor conversations, board presentations, and internal strategic planning. Updated after each major product milestone or market development.

**Last updated:** 2026-04-09 (post v11 — Pilot Plant Digital Twin / Control Room)  
**Prepared by:** Business Expert persona  
**Cross-references:** [`messaging-strategy.md`](messaging-strategy.md), [`personas/core-personas.md`](personas/core-personas.md), [`AGENT.md`](../AGENT.md)

---

## I. What We're Valuing

Two distinct but interlinked assets:

1. **Vero (the SaaS platform)** — the recurring-revenue software business. This is the entity we price for investors.
2. **Caldeira deployment value** — the showcase project that proves the platform. Not a standalone asset, but a value multiplier for (1).

The valuation below focuses on **Vero as a venture-stage SaaS company**. Caldeira project-level economics (NPV, IRR, CAPEX) are Meteoric Resources' numbers — referenced as context for the flagship customer, not as Vero's own financials.

---

## II. Revenue Model Inputs

Source: `mockDataService.ts`, `seed.ts` — pricing model.

| Tier | Monthly | Annual | Target |
|------|---------|--------|--------|
| **Pilot** | $2,500 | $30,000 | PFS-stage junior miners |
| **Growth** | $8,500 | $102,000 | DFS-through-construction operators |
| **Enterprise** | Custom | $180k–$350k | Multi-asset operators, ECA/DFI mandates |

**Average contract value (ACV):** Blended ~$102k/yr at Growth tier (core near-term target).

**SOM basis:** 15 identified REE projects in allied jurisdictions (Brazil, Australia, USA, Canada, Greenland) with active DFS/permitting.

---

## III. Market Sizing

Source: `mockDataService.ts` — `MARKET_SIZING` with analyst citations.

| Layer | Current | Forecast | CAGR | Source |
|-------|---------|----------|------|--------|
| **TAM** | $18.8B (2026) | $31.9B (2031) | 11.2% | Mordor Intelligence "Smart Mining Market"; Grand View Research "Digital Mining Market" |
| **SAM** | $1.6B (2025) | $5.2B (2033) | 14.2% | Dataintelo "Critical Mineral Traceability Market" ($3.8B total, software 42.5%); Growth Market Reports "Conflict Minerals Compliance Software" |
| **SOM** | $15M (2026) | $45M (2030) | — | Bottom-up: 15 REE projects × Growth tier $102k/yr |

---

## IV. Three Scenarios — Revenue Build

### Scenario A: Bear Case — "Slow Crawl"

*Assumption: Tough fundraise, single anchor client, slow market adoption of compliance SaaS.*

| Year | Customers | Avg ACV | ARR | Churn | Net ARR |
|------|-----------|---------|-----|-------|---------|
| 2026 | 1 (Meteoric) | $102k | $102k | 0% | $102k |
| 2027 | 3 | $90k | $270k | 10% | $243k |
| 2028 | 6 | $95k | $570k | 10% | $513k |
| 2029 | 10 | $100k | $1.0M | 10% | $900k |
| 2030 | 15 | $102k | $1.53M | 8% | $1.41M |

**2030 ARR: ~$1.4M**

Risk drivers: No DoD/ECA adoption catalyst, EU Battery Passport enforcement delayed, founder bandwidth limits sales capacity pre-funding.

### Scenario B: Consensus — "Catalyzed Growth"

*Assumption: Seed funded, Meteoric + 2 pilots in 2027, EU DPP enforcement Feb 2027 drives SAM expansion, DoD procurement cycle opens 1–2 US projects.*

| Year | Customers | Avg ACV | ARR | Net New | Expansion | Net ARR |
|------|-----------|---------|-----|---------|-----------|---------|
| 2026 | 1 | $102k | $102k | — | — | $102k |
| 2027 | 5 | $95k | $475k | 4 | — | $475k |
| 2028 | 12 | $110k | $1.32M | 7 | 2 upgrades | $1.32M |
| 2029 | 22 | $120k | $2.64M | 10 | 3 upgrades | $2.64M |
| 2030 | 35 | $130k | $4.55M | 13 | 5 upgrades | $4.55M |

**2030 ARR: ~$4.5M**

Key assumptions: EU Battery Passport (Feb 2027) creates regulatory mandate. FEOC requirements expand. Commercial hire post-seed. Average ACV rises as Enterprise tier activates.

### Scenario C: Bull Case — "Category Creator"

*Assumption: DoD design partner win, EU mandate becomes hard enforcement, strategic investment from an ECA or mining major, platform becomes de facto "critical mineral OS."*

| Year | Customers | Avg ACV | ARR | Net ARR |
|------|-----------|---------|-----|---------|
| 2026 | 2 | $140k | $280k | $280k |
| 2027 | 8 | $150k | $1.2M | $1.2M |
| 2028 | 20 | $165k | $3.3M | $3.3M |
| 2029 | 40 | $180k | $7.2M | $7.2M |
| 2030 | 65 | $200k | $13.0M | $13.0M |

**2030 ARR: ~$13M**

Key assumptions: Strategic partnership (EXIM, DoD, or Tier-1 OEM like Toyota Tsusho) validates platform. SOM expands beyond REE to lithium, cobalt, nickel. Enterprise tier dominates. SAM grows from $1.6B to $5.2B as projected.

---

## V. Valuation Multiples

For pre-revenue / seed-stage vertical SaaS with regulatory tailwinds in critical minerals:

| Stage | Revenue Multiple | Rationale |
|-------|-----------------|-----------|
| Pre-revenue (today) | N/A — scorecard / comparable seed | No revenue to multiply |
| $1M ARR milestone | 15–25x ARR | Vertical SaaS with regulatory moat, sticky |
| $5M ARR | 12–20x ARR | Proven PMF, expanding customer base |
| $10M+ ARR | 10–15x ARR | Growth-stage, approaching Series A/B |

---

## VI. Pre-Revenue Valuation (Today — April 2026)

**Scorecard method:**

| Factor | Weight | Score (1–5) | Weighted |
|--------|--------|-------------|----------|
| Founder / Team | 25% | 4.5 | 1.125 |
| Market Size (TAM $18.8B, SAM $1.6B) | 20% | 4.0 | 0.80 |
| Product / Technology | 20% | 4.5 | 0.90 |
| Competitive Landscape | 15% | 3.5 | 0.525 |
| Traction (Meteoric anchor, 310 tests, digital twin) | 10% | 3.5 | 0.35 |
| Regulatory Tailwind Timing | 10% | 4.5 | 0.45 |
| **Total** | **100%** | | **4.15 / 5.0** |

**Interpretation:** 83rd percentile for seed-stage companies in this category.

### Pre-Revenue Range

| Scenario | Pre-Money | Rationale |
|----------|-----------|-----------|
| **Bear** | $3–4M | Real product, no revenue, no signed pilot, key-person risk mitigated by advisory bench |
| **Consensus** | $5–7M | Named anchor, regulatory tailwind, production-grade demo, team ready |
| **Bull** | $8–12M | Strategic interest from DoD/ECA, multiple pilot conversations |

---

## VII. Valuation at Key Milestones

| Milestone | Bear | Consensus | Bull |
|-----------|------|-----------|------|
| **Today (pre-revenue)** | **$3–4M** | **$5–7M** | **$8–12M** |
| **First paying customer** (H2 2026) | $4M | $7M | $12M |
| **$500k ARR** (2027–2028) | $6M | $10M | $18M |
| **$1M ARR** | $10M | $20M | $35M |
| **$5M ARR** | $40M | $80M | $120M |
| **$10M ARR** | $70M | $130M | $200M |

---

## VIII. Caldeira as Value Multiplier

Meteoric's Caldeira project financials (source: `PROJECT_FINANCIALS`, `SCENARIOS`):

| Metric | Bear (Spot) | Consensus | Bull (Forecast) |
|--------|-------------|-----------|-----------------|
| NdPr price ($/kg) | $67 | $86 | $135 |
| DyTb price ($/kg) | $350 | $480 | $680 |
| NPV pre-tax | $251M | $821M | $1,985M |
| NPV post-tax | $109M | $488M | $1,256M |
| IRR pre-tax | 15% | 28% | 39% |
| Annual revenue | $245M | $315M | $485M |
| Payback | 5 yrs | 3 yrs | 2 yrs |
| LOM FCF | — | $2,000M | — |
| CAPEX | $443M | $443M | $443M |
| Breakeven NdPr | $22/kg | $22/kg | $22/kg |

**Implications for Vero:**

- Vero's $102k/yr price = **0.03%** of Caldeira's annual revenue ($315M consensus)
- Enterprise tier at $350k/yr = **0.08%** of CAPEX — trivially justified
- Price sensitivity near zero for target customer profile
- Expansion revenue structurally available as projects progress PFS → DFS → construction → operations

---

## IX. NPV Sensitivity Table

Source: `SENSITIVITY_TABLE` in codebase.

| NdPr Price ($/kg) | NPV Pre-Tax ($M) | NPV Post-Tax ($M) |
|---------------------|-------------------|--------------------|
| $50 | $48 | -$15 |
| $67 (spot) | $251 | $109 |
| $86 (consensus) | $821 | $488 |
| $100 | $1,130 | $695 |
| $110 | $1,347 | $835 |
| $120 | $1,620 | $1,020 |
| $135 (forecast) | $1,985 | $1,256 |

Post-tax NPV turns negative at NdPr ~$50/kg. Breakeven NdPr OPEX is $22/kg — substantial margin of safety at all scenarios above $50.

---

## X. What Moves the Needle

| Variable | Impact on Vero Valuation | Current Status |
|----------|-------------------------|----------------|
| **First signed pilot (paid)** | +$2–4M on pre-money | In negotiation (Meteoric) |
| **EU DPP enforcement (Feb 2027)** | Expands SAM 3x, adds urgency | Hard regulatory deadline |
| **DoD design partnership** | +$5–10M — validates defense vertical | Not yet pursued directly |
| **Second customer (non-Meteoric)** | +$3–5M — proves platform, not custom build | Requires sales capacity |
| **Seed funding closed** | Enables hiring, accelerates pipeline | Pre-fundraise |
| **NdPr price movement** | Indirect — sub-$50 makes project finance tighten | $67/kg spot, $86/kg consensus |
| **DFS delay beyond mid-2026** | Slows showcase, delays offtaker conversion | Risk R04 — mitigating |
| **Team activation (CEO hire)** | Unlocks commercial; investor confidence | Committed, awaiting activation |

---

## XI. Comparable Transactions (Directional)

| Company | Stage | Vertical | Valuation | Multiple | Notes |
|---------|-------|----------|-----------|----------|-------|
| **Minviro** | Series A (2023) | Mining LCA SaaS | ~$15M | ~10x ARR | LCA tool, EU regulation-driven |
| **Circulor** | Series B (2022) | Supply chain traceability | ~$60M | ~20–25x | Battery passport, Volvo/Tata anchor |
| **Everledger** | Series C (pre-admin) | Provenance/blockchain | $100M+ peak | Collapsed | Cautionary: overclaimed, under-delivered |
| **Sight Machine** | Series C | Manufacturing analytics | ~$150M | ~15x | Industrial digital twin |

**Positioning:** Vero sits between Minviro's regulatory niche and Circulor's supply chain play. Specificity (critical minerals, not generic "supply chain") is the advantage. Everledger is the cautionary tale — Vero's honesty-first positioning (Slide 0 disclaimer, data honesty banner) is a structural defense.

---

## XII. Key Risk Discounts

| Risk | Discount Applied | Mitigation Path |
|------|-----------------|-----------------|
| **Solo founder concentration** | 20–30% on pre-money | Advisory bench formalized (Dr. Caponi — science, Mil Caminhos — ESG/HRDD), co-founder recruitment in progress |
| **Zero revenue** | Standard pre-revenue | Close Meteoric pilot |
| **Single-customer dependency** | 15–20% until customer #2 | Target EU DPP-driven projects |
| **Brazil jurisdiction risk** | 5–10% (mining-specific) | LP approved, DFS on track |
| **NdPr price volatility** | Indirect via customer health | $22/kg breakeven provides margin |

---

## XIII. Summary Table

| | Bear | Consensus | Bull |
|---|------|-----------|------|
| **Today (pre-revenue)** | **$3–4M** | **$5–7M** | **$8–12M** |
| **First paid pilot** | $4M | $7M | $12M |
| **$1M ARR** | $10M | $20M | $35M |
| **$5M ARR** | $40M | $80M | $120M |
| **$10M+ ARR** | $70M | $130M | $200M |
| **2030 projected ARR** | $1.4M | $4.5M | $13M |
| **Implied 2030 EV** | $15–25M | $55–90M | $130–200M |

---

## XIV. Investor Talking Points

### To a Seed Investor

"Vero is vertical SaaS for critical mineral operators and their stakeholders. TAM $18.8B growing 11%. SAM $1.6B in compliance/traceability SaaS growing 14%, driven by EU Battery Passport (hard enforcement Feb 2027) and US FEOC requirements. We're not pre-product — production-grade platform with 310 tests, named anchor relationship, and a pilot plant digital twin running live telemetry. The founder grew up inside the flagship deposit. Pre-money $5–7M consensus for a seed that buys 18 months of runway, a commercial hire, and 5 paid pilots."

### To a Strategic Partner (ECA, DoD, Mining Major)

"You're spending $350M in EXIM capital on Caldeira alone. The governance and compliance layer for that capital costs less than a single day's interest on the loan. The question isn't whether you need this software. The question is whether you build it yourself or use the platform already running on the project you're financing."

### To the Board (Meteoric)

"Vero gives you one coherent narrative across engineering, permitting, IR, and community. The pilot plant digital twin — 17 pieces of equipment, 28 sensors, 7 process steps, all animated and interactive — is the tool your board uses to understand operational readiness, your offtakers use to evaluate qualification, and your permitting team uses to demonstrate monitoring capacity. $102k/yr against a $2B LOM free cash flow asset."

---

## XV. Next Actions That Move Valuation

1. **Close Meteoric paid pilot** — single event that moves every number up one row
2. **Formalize advisory bench** — Dr. Caponi (science), Mil Caminhos (ESG/HRDD) onboarded; co-founder recruitment reduces key-person discount
3. **Close co-founder recruitment** — Juliano (tech) + Guilherme (commercial) remove remaining key-person discount
4. **Seed fundraise at $5–7M** — buys commercial capacity
5. **Land customer #2 by EU DPP enforcement (Feb 2027)** — proves platform, not custom build

---

*This document contains forward-looking projections and illustrative scenarios. Not a substitute for formal financial modeling, legal counsel, or board-approved investor materials.*
