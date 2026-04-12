# DN COPAM 217/2017 — Minas Gerais Environmental Licensing

**Authority:** Conselho Estadual de Política Ambiental (COPAM), Minas Gerais  
**Replaces:** DN COPAM 74/2004  
**Scope:** Regulates environmental licensing for activities with potential environmental impact in Minas Gerais.  
**Relevance:** Governs the LP → LI → LO licensing pathway for Caldeira.

---

## Three-Phase Licensing Process

### Phase 1: Licença Prévia (LP) — Preliminary License
- **Purpose:** Approves project location and environmental feasibility at conceptual design stage.
- **Issuing body:** COPAM (plenary or ad-hoc chamber, depending on class/size).
- **Required studies:** EIA/RIMA (Environmental Impact Assessment / Report) for Class 5–6 projects; RCA (Simplified Environmental Report) for Class 3–4.
- **Validity:** Up to 5 years (Art. 18).
- **Public hearing:** Mandatory for Class 5–6 projects requiring EIA/RIMA.

### Phase 2: Licença de Instalação (LI) — Installation License
- **Purpose:** Authorizes construction and installation of the project per approved engineering design.
- **Issuing body:** SUPRAM (Superintendência Regional de Meio Ambiente) for Class 1–4; COPAM for Class 5–6.
- **Required studies:** PCA (Environmental Control Plan), PRAD (Degraded Area Recovery Plan), mine closure plan.
- **Validity:** Up to 6 years (Art. 18).
- **Conditions:** Must demonstrate compliance with all LP condicionantes before LI is granted.

### Phase 3: Licença de Operação (LO) — Operating License
- **Purpose:** Authorizes operation after verification that all LI conditions and environmental controls are in place.
- **Issuing body:** Same as LI.
- **Validity:** 4–10 years, renewable.
- **Conditions:** Ongoing monitoring program, annual environmental reports.

---

## Project Classification (Art. 4–12)

Projects classified by **potential pollution / environmental degradation** and **size**:

| Class | Impact | Size | Licensing level |
|-------|--------|------|-----------------|
| 1 | Small | Small | Simplified (AAF) |
| 2 | Small | Medium | Simplified (AAF) |
| 3 | Medium | Small | RCA → LP/LI/LO |
| 4 | Medium | Medium | RCA → LP/LI/LO |
| 5 | High | Large | EIA/RIMA → LP/LI/LO |
| 6 | Very High | Very Large | EIA/RIMA → LP/LI/LO |

Mining operations with ionic clay extraction at Caldeira's scale are classified **Class 5–6**, requiring full EIA/RIMA.

---

## Key Timelines (Art. 15–17)

- **FEAM technical analysis:** 4–8 months typical for Class 5–6
- **COPAM deliberation:** 2–3 months after FEAM technical opinion
- **Public hearing period:** 45 days minimum after RIMA publication
- **LP to LI gap:** Applicant must submit PCA/PRAD within LP validity (5 years max)
- **Total LP → LO timeline:** 2–5 years typical for large mining projects

---

## Caldeira Licensing Status

- **LP approved:** December 2025 by COPAM plenary session
- **LI application submitted:** February 2026
- **Current phase:** FEAM technical review of PCA and detailed engineering
- **Classification:** Class 5 (REE ionic clay mining, Poços de Caldas alkaline complex)
- **Public hearing:** Held September 2025 in Poços de Caldas municipality

---

## Platform Mapping

Vero tracks the licensing pathway through:

- **Regulatory timeline widget:** Visualizes LP → LI → LO progression with milestone dates
- **Condicionante tracker:** Maps each LP condition to sensor telemetry or document status
- **FEAM review status:** Displayed in the Regulatory section of the Operations Report
- **Domain data:** `regulatory_log` records licensing events with timestamps and responsible agencies
- **Caldeira-specific context:** See `data/knowledge/caldeira/regulatory.md`
