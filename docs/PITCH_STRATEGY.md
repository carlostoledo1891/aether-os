# Vero — Pitch Strategy & Outreach Playbook

**Purpose:** Operational playbook for the April 2026 pitch sequence. Timeline, email copy, per-recipient strategy, success criteria, and fallbacks.

**Last updated:** 2026-04-11  
**Cross-references:** [`strategy.md`](strategy.md), [`branding.md`](branding.md), [`Personas.md`](Personas.md), [`copy/PITCH_DECK_COPY.md`](copy/PITCH_DECK_COPY.md), [`copy/METEORIC_DECK_COPY.md`](copy/METEORIC_DECK_COPY.md)

---

## 1. Timeline & Sequence

| Date | Milestone | Recipients | Assets Sent |
|------|-----------|------------|-------------|
| **Apr 13** | Founders pitch (joint email) | Juliano Dutra + Guilherme Bonifácio (both on the same thread) | FoundersDeck, Tech page, Business page, Website, Platform demo |
| **Apr 13** | Science validation | Dr. Heber Caponi (LAPOC) | Warm personal email — no deck, conversation opener |
| **Apr 15** | Meteoric pitch (separate emails) | Dr. Marcelo De Carvalho · Dr. Andrew Tunks | MeteoricDeck, Platform demo |

### Dependency Chain

```
Founders (Apr 13) ──→ Co-founders onboarded by word (48h response window)
Dr. Caponi (Apr 13) ──→ Advisor validated, LAPOC data conversation opened
                              ↓
Meteoric (Apr 15) ──→ Full team visible on MeteoricDeck, pilot ask credible
  ├─ Dr. De Carvalho — geology-focused email (separate)
  └─ Dr. Tunks — governance-focused email (separate)
```

**Critical path:** By Apr 15, the MeteoricDeck shows Carlos + Guilherme + Juliano + Dr. Caponi. Co-founders have 48h to respond before Meteoric emails go out. Ideally, at least informal interest confirmed.

---

## 2. What Each Recipient Sees

### Juliano Dutra (CTO Lens)

| Asset | URL | Purpose |
|-------|-----|---------|
| Founders Deck | `/founders-deck` | Full 28-slide pitch — problem, product, engineering, science, business, timing, advisory ask |
| **Tech Deep Dive** | `/tech` | CTO-grade architecture breakdown — 310 tests, service layer, AI tools, SCADA integration, DPP/blockchain pipeline, modularity |
| Platform Demo | `/` | Live platform — Field, Compliance, Executive views, AI agent, Control Room |
| Website | `/lp` | Marketing landing page with team, architecture, market data |

**Key hooks for Juliano:**
- 310 tests, 0 TS errors, strict mode
- `AetherDataService` interface pattern (mock/live swap)
- 27 AI tools with hallucination fence
- Solo-founder codebase ready for team scaling
- HANDOFF.md — 2,600+ lines of documentation

### Guilherme Bonifácio (Business Lens)

| Asset | URL | Purpose |
|-------|-----|---------|
| Founders Deck | `/founders-deck` | Full 28-slide pitch — includes market, revenue model, valuation, exit paths |
| **Business Deep Dive** | `/business` | Market case — TAM/SAM/SOM, regulatory catalyst, competitive landscape, revenue model, expansion playbook |
| Platform Demo | `/` | Live platform showing the product is real, not a slide deck |
| Website | `/lp` | Marketing presence showing brand maturity |

**Key hooks for Guilherme:**
- $31.9B TAM, 14.2% SAM CAGR
- EU DPP (Feb 2027) creating compliance market
- SaaS pricing anchored to project value (0.03%)
- 9.4/10 persona score — product-market fit evidence
- Five-tier GTM expansion playbook
- Meteoric at $102k/yr — flagship customer ready

### Dr. Heber Caponi (Science)

| Asset | Medium | Purpose |
|-------|--------|---------|
| Personal email | Direct | Show ideas, ask for honest scientific opinion, explore LAPOC data access |

**No deck sent.** This is a warm, respectful conversation opener. The goal is to validate the advisor relationship and explore what data from LAPOC/CNEN might be available.

### Dr. Marcelo De Carvalho (Meteoric Chief Geologist)

| Asset | URL | Purpose |
|-------|-----|---------|
| Meteoric Deck | `/meteoric-deck` | 18-slide immersive deck — live satellite map, geology flyTo, hydro story, traceability flow, AI demo, countdown, roadmap |
| Platform Demo | `/` | Live platform with Caldeira data — drill collars, deposit polygons, hydro monitoring, Control Room |

**Key hooks for De Carvalho:**
- 19 GeoJSON datasets, JORC-safe classification
- Geology/hydrology firewall — never conflates
- Drill trace visualization with lithological intervals
- LAPOC pipeline — simulated → field-verified
- Full team: Carlos + Guilherme (commercial) + Juliano (tech) + Caponi (science advisor)
- $102k/yr = 0.013% of NPV

### Dr. Andrew Tunks (Meteoric Executive Chairman)

| Asset | URL | Purpose |
|-------|-----|---------|
| Meteoric Deck | `/meteoric-deck` | Same 18-slide immersive deck — governance, data honesty, and disclosure narrative resonate with chairman lens |
| Platform Demo | `/` | Executive Overview with 9 synchronized tabs, disclosure mode, audit trail, build verification stamp |

**Key hooks for Tunks:**
- Data honesty banner on every screen — provenance labeling (modeled / public / simulated)
- Disclosure mode for IR-sensitive sessions
- Build verification stamp (git SHA + date)
- AI agent with hallucination fence (11 tests, "refuses lithium")
- Screenshot-safe architecture — nothing on screen contradicts ASX releases
- Full team with iFood-scale co-founders validates commercial maturity

---

## 3. Email Copy

### Email 1: To Juliano Dutra + Guilherme Bonifácio (together) — Apr 13

**To:** Juliano, Guilherme  
**Subject:** Vero — quero mostrar pra vocês e pedir opinião honesta

**Body:**

Juliano, Guilherme,

Quero mostrar pra vocês algo que construí sozinho nos últimos meses — e pedir a opinião honesta de vocês dois.

**Vero** is a critical mineral operations and compliance platform. I built the entire stack: React 19 frontend, Fastify API, simulation engine, 27 AI tools (frontier LLM, model-agnostic), pilot plant digital twin (17 equipment, 28 sensors), and 310 automated tests. Zero TypeScript errors. Strict mode.

The platform runs on real data from the Caldeira Project (Meteoric Resources — ASX: MEI, $821M NPV). On April 15, I'm pitching Meteoric for a $102k/yr pilot contract — 0.03% of their annual revenue.

The timing thesis: the EU is mandating Digital Product Passports by Feb 2027. The US has FEOC restrictions on IRA credits. Regulations are creating a compliance SaaS market that doesn't exist yet — just like Pix created the fintech explosion. I see the perfect storm forming for rare earth minerals tech.

I need both of you. Not time — leverage. Juliano, I need a technical mentor: architecture review, hiring bar, scaling guidance. Guilherme, I need a commercial front: GTM, investor pipeline, revenue strategy. Advisory board seats, quarterly cadence.

The deck explains everything — including why I need you specifically and what each of you brings.

Here's everything:

- **Founders Deck (start here):** https://aether-os.vercel.app/founders-deck
- **Tech Deep Dive (Juliano):** https://aether-os.vercel.app/tech
- **Business Case (Guilherme):** https://aether-os.vercel.app/business
- **Live Platform:** https://aether-os.vercel.app
- **Website:** https://aether-os.vercel.app/lp

Open the platform. Run the AI agent. Check the Control Room. The code and the numbers speak for themselves.

I'd like 20 minutes with you both this week.

Carlos Toledo
carlos@vero.supply

---

### Email 2: To Dr. Heber Caponi — Apr 13

**Subject:** Vero — ideias sobre a Caldeira e uma pergunta honesta

**Body:**

Dr. Caponi,

Me chamo Carlos Toledo, sou de Poços de Caldas e nos últimos meses desenvolvi uma plataforma chamada **Vero** focada em operações e compliance para minerais críticos.

A plataforma foi construída inteiramente sobre dados da Caldeira — geologia, hidrologia, planta piloto, dados regulatórios. Incluí o monitoramento de 1.092 nascentes, classificação JORC, e um digital twin da planta piloto AMSUL com 17 equipamentos e 28 sensores.

Gostaria muito de sua opinião honesta sobre duas coisas:

1. **A abordagem científica** — se a separação que mantenho entre dados geológicos e hidrológicos no sistema faz sentido do ponto de vista de campo
2. **Possibilidade de dados** — se existe algum caminho para acessar datasets ou dados em tempo real do LAPOC/CNEN que poderiam validar o modelo hidrológico da plataforma

Não tenho pretensão de substituir trabalho de campo ou instrumentação. O objetivo é que dados rotulados como "simulados" possam, com o tempo, se tornar "verificados em campo."

Posso te mostrar a plataforma funcionando quando for conveniente.

Respeitosamente,

Carlos Toledo
carlos@vero.supply

---

### Email 3: To Dr. Marcelo De Carvalho — Apr 15

**Subject:** Vero for Caldeira — your digital twin is already built

**Body:**

Dr. De Carvalho,

My name is Carlos Toledo. I grew up in Poços de Caldas, inside the Caldeira, and over the past several months I've built a platform called **Vero** — a critical mineral operations and compliance system.

The platform was built entirely on Caldeira Project data: 19 GeoJSON datasets, JORC-safe resource classification, drill collar metadata, a pilot plant digital twin with 17 equipment items and 28 sensors, and 27 AI tools grounded in your deposit's geology.

Every number links to its methodology. Geology and hydrology are visually separated — the digital twin never pretends to prove the deposit. Simulated data is always labeled.

The team: myself (product and technical lead), Guilherme Bonifácio (iFood co-founder, commercial strategy), Juliano Dutra (iFood co-founder, technical advisor), and Dr. Heber Caponi (LAPOC, scientific advisor).

I'd like to show you the platform and discuss a Growth-tier pilot ($102k/yr — 0.013% of NPV). 90 days to live data.

- **Meteoric Deck:** https://aether-os.vercel.app/meteoric-deck
- **Live Platform:** https://aether-os.vercel.app

I'm available for a demo at your convenience.

Carlos Toledo
carlos@vero.supply

---

### Email 4: To Dr. Andrew Tunks — Apr 15

**Subject:** Vero — digital governance for the Caldeira Project

**Body:**

Dr. Tunks,

My name is Carlos Toledo. I'm from Poços de Caldas — I grew up inside the Caldeira — and over the past several months I've built a platform called **Vero**, a critical mineral operations and compliance system.

Vero was built entirely on Caldeira Project data. What I'd like to show you is the governance architecture: every screen carries a data honesty banner (modeled / public / simulated), the AI agent has an 11-test hallucination fence that refuses off-domain queries, and the platform includes a disclosure mode for IR-sensitive sessions — screenshot-safe by design.

The executive overview synchronizes geology, hydrology, compliance, and market data in one view. Nothing on screen contradicts ASX filings.

The team: myself (product and technical lead), Guilherme Bonifácio (iFood co-founder, commercial strategy), Juliano Dutra (iFood co-founder, technical advisor), and Dr. Heber Caponi (LAPOC, scientific advisor).

I'd welcome the opportunity to walk you through the platform and discuss how it fits the Caldeira's compliance and reporting needs.

- **Meteoric Deck:** https://aether-os.vercel.app/meteoric-deck
- **Live Platform:** https://aether-os.vercel.app

Carlos Toledo
carlos@vero.supply

---

## 4. Success Criteria

| Touchpoint | Minimum Success | Ideal Outcome |
|------------|-----------------|---------------|
| Juliano (Apr 13) | Responds positively, agrees to review | Confirms advisory interest, opens architecture discussion |
| Guilherme (Apr 13) | Responds positively, engages with business case | Confirms advisory interest, offers GTM input |
| Dr. Caponi (Apr 13) | Responds warmly, open to conversation | Shares LAPOC data possibilities, agrees to formal advisor role |
| Dr. De Carvalho (Apr 15) | Opens the deck and platform | Schedules demo meeting |
| Dr. Tunks (Apr 15) | Opens the deck and platform | Engages on governance, forwards internally |

---

## 5. Fallback Plans

| Scenario | Response |
|----------|----------|
| Juliano doesn't respond by Apr 14 evening | Follow up with brief WhatsApp: "Hey, sent you something — would love your honest take" |
| Guilherme doesn't respond by Apr 14 evening | Same WhatsApp follow-up |
| Neither co-founder confirms before Apr 15 | Send Meteoric emails anyway — team slide still has strong narrative. Add co-founder profiles after confirmation |
| Dr. Caponi declines or doesn't respond | Proceed with advisor framing but mark as "pending formalization" internally |
| Dr. De Carvalho doesn't respond by Apr 20 | Follow up via email with one-line nudge: "Happy to do a 15-minute walkthrough at your convenience" |
| Dr. Tunks doesn't respond by Apr 20 | Follow up with governance-focused nudge: "The disclosure mode was built with ASX compliance in mind — happy to show you" |
| Meteoric requests changes before meeting | Treat as engagement signal — iterate deck and platform per feedback |

---

## 6. Key Talking Points by Recipient

### Juliano
- The codebase is production-grade, not a hackathon project
- Mock/live service swap with zero frontend changes
- AI tools are grounded — hallucination fence with 10 guardrails and 100% test pass rate
- I need someone who has built at scale to review my architecture decisions
- Advisory, not operational — quarterly cadence

### Guilherme
- Regulations are creating this market — EU DPP, US FEOC, Australia ESG
- First mover advantage: no competitor covers field + compliance + executive
- $102k/yr anchor with Meteoric = 0.03% of project revenue
- Seed money ($500k-1M) at $5-7M pre-money unlocks full-time focus
- I need someone who has built revenue engines to run the commercial front

### Dr. Caponi
- Deep respect for LAPOC and decades of field work
- No overclaiming — the platform labels everything honestly
- Simulated → field-verified is the single highest-value technical milestone
- Asking for scientific opinion first, not commitment
- Portuguese — the entire email should feel like a colleague reaching out

### Dr. De Carvalho
- Every number links to JORC table and methodology
- Geology and hydrology are separate — no visual conflation
- Drill trace visualization with lithological intervals
- LAPOC pipeline takes data from "simulated" to "field-verified"
- Full team with iFood-scale co-founders validates commercial viability
- $102k/yr is immaterial relative to project value

### Dr. Tunks
- Data honesty banner on every screen — no hidden disclaimers
- Disclosure mode exists specifically for IR/compliance sessions
- AI agent refuses off-domain (lithium) queries — tested and verified
- Build verification stamp (git SHA + date) for audit trail
- Screenshot-safe — nothing contradicts ASX/JORC releases
- Executive Overview is one view across all 9 data domains
- $102k/yr at 0.013% of NPV is immaterial for the governance it delivers

---

## 7. Post-Pitch Protocol

### After Founders Response (Apr 13-14)
- [ ] Acknowledge response within 2 hours
- [ ] Schedule 20-min call if interested
- [ ] Prepare advisory term sheet outline (equity 0.5-1%, 2yr vesting, quarterly cadence)
- [ ] Update HANDOFF.md with response status

### After Caponi Response (Apr 13-14)
- [ ] Thank personally
- [ ] If positive: schedule video call to demo platform
- [ ] If data access possible: document requirements and timeline
- [ ] Update strategy.md section 12

### After De Carvalho Contact (Apr 15-20)
- [ ] Track whether deck was opened (if analytics available)
- [ ] Follow up on Apr 20 if no response
- [ ] If demo requested: prepare 45-min walkthrough per demo playbook in strategy.md
- [ ] Update HANDOFF.md pitch status

### After Tunks Contact (Apr 15-20)
- [ ] Same tracking as De Carvalho
- [ ] If he engages on governance: prepare deep-dive on disclosure mode + audit trail
- [ ] If he forwards to Gale: treat as positive signal — follow up with CEO-framed summary
- [ ] Update HANDOFF.md pitch status

---

*This is a living document. Update after every email sent, every response received, and every meeting completed.*
