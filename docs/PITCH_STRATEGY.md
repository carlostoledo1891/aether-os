# Vero — Pitch Strategy & Outreach Playbook

**Purpose:** Operational playbook for the April 2026 pitch sequence. Timeline, email copy, per-recipient strategy, success criteria, and fallbacks.

**Last updated:** 2026-04-09  
**Cross-references:** [`strategy.md`](strategy.md), [`branding.md`](branding.md), [`Personas.md`](Personas.md), [`copy/PITCH_DECK_COPY.md`](copy/PITCH_DECK_COPY.md), [`copy/METEORIC_DECK_COPY.md`](copy/METEORIC_DECK_COPY.md)

---

## 1. Timeline & Sequence

| Date | Milestone | Recipients | Assets Sent |
|------|-----------|------------|-------------|
| **Apr 9** | Founders pitch | Juliano Dutra, Guilherme Bonifácio | FoundersDeck, Tech page, Business page, Website, Platform demo |
| **Apr 13** | Science validation | Dr. Heber Caponi (LAPOC) | Warm personal email — no deck, conversation opener |
| **Apr 15** | Meteoric pitch | Dr. Marcelo De Carvalho (+ forwarded to Gale, Tunks) | MeteoricDeck, Platform demo |

### Dependency Chain

```
Founders (Apr 9) ──→ Co-founders onboarded by word
                              ↓
Dr. Caponi (Apr 13) ──→ Advisor validated, LAPOC data conversation opened
                              ↓
Meteoric (Apr 15) ──→ Full team visible on MeteoricDeck, pilot ask credible
```

**Critical path:** By Apr 15, the MeteoricDeck shows Carlos + Guilherme + Juliano + Dr. Caponi. Ideally, Juliano and Guilherme have confirmed interest (even informally) before the Meteoric email goes out.

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
| Meteoric Deck | `/meteoric-deck` | 15-slide deck tailored to Meteoric leadership — geology, executive, governance, team, timeline, pricing |
| Platform Demo | `/` | Live platform with Caldeira data — drill collars, deposit polygons, hydro monitoring, Control Room |

**Key hooks for De Carvalho (and by extension Gale and Tunks):**
- 19 GeoJSON datasets, JORC-safe classification
- Geology/hydrology firewall — never conflates
- Data honesty modes — screenshot-safe
- Executive Overview with 9 synchronized tabs
- Full team: Carlos + Guilherme (commercial) + Juliano (tech) + Caponi (science advisor)
- $102k/yr = 0.013% of NPV

---

## 3. Email Copy

### Email 1: To Juliano Dutra — Apr 9

**Subject:** Vero — I built the platform, now I need your CTO lens

**Body:**

Juliano,

Quero te mostrar algo que construí sozinho nos últimos meses — e pedir tua opinião honesta.

**Vero** is a critical mineral operations platform. I built the entire stack: React 19 frontend, Fastify API, simulation engine, 27 AI tools (Gemini 2.5), pilot plant digital twin (17 equipment, 28 sensors), and 310 automated tests. Zero TypeScript errors. Strict mode.

The platform is deployed, the data is real (Caldeira Project, Meteoric Resources — ASX: MEI), and I'm pitching Meteoric for a $102k/yr pilot contract on April 15.

I need a technical mentor. Not time — leverage. Architecture review, hiring bar, code review authority. Advisory board seat, quarterly cadence.

Here's everything:

- **Founders Deck:** https://aether-os.vercel.app/founders-deck
- **Tech Deep Dive (for you):** https://aether-os.vercel.app/tech
- **Business Case:** https://aether-os.vercel.app/business
- **Live Platform:** https://aether-os.vercel.app
- **Website:** https://aether-os.vercel.app/lp

Open the platform. Run the AI agent. Check the Control Room. The code speaks for itself.

I'd like 20 minutes of your time this week.

Carlos Toledo
carlos@vero.supply

---

### Email 2: To Guilherme Bonifácio — Apr 9

**Subject:** Vero — critical minerals SaaS, $31.9B TAM, need your commercial lens

**Body:**

Guilherme,

Quero te mostrar algo e pedir tua opinião honesta como investidor e estrategista.

**Vero** is a compliance and operations platform for critical mineral supply chains. The EU is mandating Digital Product Passports by Feb 2027. The US has FEOC restrictions on IRA credits. The market doesn't have a purpose-built SaaS product yet.

I built one. Inside the Caldeira, on real data from Meteoric Resources (ASX: MEI, $821M NPV). 310 tests. 27 AI tools. Pilot plant digital twin. Scoring 9.4/10 across 9 stakeholder personas.

On April 15, I'm pitching Meteoric for a $102k/yr pilot contract — 0.03% of their annual revenue. The timing thesis: regulations are creating the market, just like Pix created the fintech explosion.

I need a commercial execution partner. GTM, investor pipeline, revenue strategy. Not time — leverage. Advisory board seat.

Here's everything:

- **Founders Deck:** https://aether-os.vercel.app/founders-deck
- **Business Case (for you):** https://aether-os.vercel.app/business
- **Tech Deep Dive:** https://aether-os.vercel.app/tech
- **Live Platform:** https://aether-os.vercel.app
- **Website:** https://aether-os.vercel.app/lp

Open the platform. It's real.

I'd like 20 minutes of your time this week.

Carlos Toledo
carlos@vero.supply

---

### Email 3: To Dr. Heber Caponi — Apr 13

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

### Email 4: To Dr. Marcelo De Carvalho — Apr 15

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

## 4. Success Criteria

| Touchpoint | Minimum Success | Ideal Outcome |
|------------|-----------------|---------------|
| Juliano (Apr 9) | Responds positively, agrees to review | Confirms advisory interest, opens architecture discussion |
| Guilherme (Apr 9) | Responds positively, engages with business case | Confirms advisory interest, offers GTM input |
| Dr. Caponi (Apr 13) | Responds warmly, open to conversation | Shares LAPOC data possibilities, agrees to formal advisor role |
| Dr. De Carvalho (Apr 15) | Opens the deck and platform | Forwards to Gale/Tunks, schedules demo meeting |

---

## 5. Fallback Plans

| Scenario | Response |
|----------|----------|
| Juliano doesn't respond by Apr 12 | Follow up with brief WhatsApp: "Hey, sent you something — would love your honest take" |
| Guilherme doesn't respond by Apr 12 | Same WhatsApp follow-up |
| Neither co-founder confirms before Apr 15 | Send Meteoric deck anyway — it still has strong team narrative. Add co-founder profiles after confirmation |
| Dr. Caponi declines or doesn't respond | Proceed with advisor framing but mark as "pending formalization" internally |
| Dr. De Carvalho doesn't respond by Apr 20 | Follow up via email with one-line nudge: "Happy to do a 15-minute walkthrough at your convenience" |
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
- Data honesty modes protect screenshot risk
- Full team with iFood-scale co-founders validates commercial viability
- $102k/yr is immaterial relative to project value

---

## 7. Post-Pitch Protocol

### After Founders Response (Apr 9-12)
- [ ] Acknowledge response within 2 hours
- [ ] Schedule 20-min call if interested
- [ ] Prepare advisory term sheet outline (equity 0.5-1%, 2yr vesting, quarterly cadence)
- [ ] Update HANDOFF.md with response status

### After Caponi Response (Apr 13-14)
- [ ] Thank personally
- [ ] If positive: schedule video call to demo platform
- [ ] If data access possible: document requirements and timeline
- [ ] Update strategy.md section 12

### After Meteoric Contact (Apr 15-20)
- [ ] Track whether deck was opened (if analytics available)
- [ ] Follow up on Apr 20 if no response
- [ ] If demo requested: prepare 45-min walkthrough per demo playbook in strategy.md
- [ ] Update HANDOFF.md pitch status

---

*This is a living document. Update after every email sent, every response received, and every meeting completed.*
