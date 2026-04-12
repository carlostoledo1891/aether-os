# EU Regulation 2023/1542 — Battery Passport Requirements

**Authority:** European Parliament and Council  
**Published:** Official Journal of the EU, 28 July 2023  
**Scope:** Lifecycle requirements for all batteries placed on the EU market; introduces the Digital Product Passport (DPP).  
**Relevance:** Caldeira's NdPr supply chain feeds EV/industrial batteries — DPP readiness is a competitive moat.

---

## Timeline

| Milestone | Date | Scope |
|-----------|------|-------|
| Regulation entry into force | 17 August 2023 | All provisions begin phased rollout |
| Carbon footprint declaration | 18 February 2025 | EV and industrial batteries > 2 kWh |
| Carbon footprint performance class | 18 August 2026 | EV and industrial batteries |
| **DPP mandatory** | **18 February 2027** | **EV batteries and industrial batteries > 2 kWh** |
| Carbon footprint maximum threshold | 18 February 2028 | EV and industrial batteries |
| Recycled content targets (declaration) | 18 August 2028 | All battery types |
| Recycled content mandatory minimums | 18 August 2031 | All battery types |

---

## Digital Product Passport (DPP) — Annex VI

### Mandatory Data Fields (Annex VI categories)

1. **Battery identification** — Unique identifier, manufacturer, manufacturing date/place
2. **Carbon footprint** — Lifecycle GHG per kWh, calculation methodology, performance class
3. **Material composition** — Chemistry, hazardous substances, critical raw materials and their origin
4. **Supply chain due diligence** — Due diligence policies, third-party audit results, risk areas
5. **Recycled content** — Percentage of cobalt, lithium, nickel, lead from recycling
6. **Performance & durability** — Rated capacity, cycle life, energy efficiency, expected lifetime
7. **Collection & recycling** — End-of-life handling, recycler information
8. **State of health (SoH)** — For second-life assessment (EV batteries)

### Technical Standards
- **CEN/CENELEC** developing harmonized standards under Standardization Request M/594
- Data carrier: QR code linking to accessible online DPP system
- Interoperability: Must comply with European Single Data Space for the Green Deal

---

## Due Diligence (Art. 48–52)

- Mandatory supply chain due diligence aligned with **OECD Due Diligence Guidance**
- Applies to cobalt, natural graphite, lithium, nickel, and associated raw materials
- REE (rare earth elements) included when used in battery components (permanent magnets in EV motors)
- Third-party verification required; results included in DPP

---

## Recycled Content Targets

| Material | 2031 Target | 2036 Target |
|----------|-------------|-------------|
| Cobalt | 16% | 26% |
| Lithium | 6% | 12% |
| Nickel | 6% | 15% |
| Lead | 85% | 85% |

---

## Vero Coverage Assessment

Vero currently tracks **22 of ~37 mandatory DPP fields** across Annex VI categories:

| Category | Fields Tracked | Total Required | Coverage |
|----------|---------------|----------------|----------|
| Battery ID | 4 | 5 | 80% |
| Carbon footprint | 3 | 6 | 50% |
| Material composition | 5 | 7 | 71% |
| Supply chain DD | 4 | 7 | 57% |
| Recycled content | 2 | 4 | 50% |
| Performance/durability | 3 | 5 | 60% |
| Collection/recycling | 1 | 3 | 33% |
| **Total** | **22** | **37** | **59%** |

---

## Platform Mapping

Vero bridges Caldeira's mine-gate data to downstream DPP requirements:

- **Molecular timeline traceability:** Chain-of-custody from orebody to separated oxide, providing origin and material composition data for DPP fields
- **Carbon footprint:** Process energy telemetry (CIP plant electricity, reagent consumption) feeds lifecycle GHG calculations
- **Due diligence integration:** OECD 5-step framework data mapped to DPP Art. 48–52 requirements
- **DPP readiness score:** Displayed in the Traceability view — 22/37 fields (59%) currently populated
- **Gap analysis:** Platform identifies missing DPP fields and suggests data collection actions
- **Export format:** Structured JSON conforming to draft CEN/CENELEC DPP schema for battery passport registries
