# Caldeira Project — Regulatory Context

**Project:** Caldeira REE Ionic Clay Project  
**Operator:** Meteoric Resources Limited (ASX: MEI)  
**Location:** Poços de Caldas Alkaline Complex, Minas Gerais, Brazil  
**Mineral:** NdPr (neodymium-praseodymium) and associated rare earth elements from ionic clay

---

## Licensing Timeline

| Date | Event | Agency | Status |
|------|-------|--------|--------|
| Sep 2025 | Public hearing held (Poços de Caldas) | COPAM | Completed |
| **Dec 2025** | **LP (Licença Prévia) approved** | **COPAM** | **Granted** |
| Feb 2026 | LI (Licença de Instalação) application submitted | SUPRAM/FEAM | Under review |
| Q2–Q3 2026 (est.) | FEAM technical review of PCA/PRAD | FEAM | Pending |
| H2 2026 (est.) | LI decision by COPAM | COPAM | Pending |
| 2027 (est.) | Construction completion, LO application | COPAM | Future |

### LP Conditions (Condicionantes)
Key conditions attached to the December 2025 LP approval:
- Continuous water quality monitoring at 12 designated stations
- Quarterly reporting to FEAM on sulfate, nitrate, pH, and heavy metals
- Community consultation program with biannual public meetings
- Noise and dust monitoring during any preparatory earthworks
- Archaeological/cultural heritage survey completion before LI

---

## FEAM Technical Review (Current Phase)

The Fundação Estadual do Meio Ambiente (FEAM) is reviewing:
- **PCA (Plano de Controle Ambiental):** Environmental control plan for construction and operation
- **PRAD (Plano de Recuperação de Áreas Degradadas):** Degraded area recovery plan
- **Detailed engineering:** CIP plant layout, water management circuit, waste disposal design
- **Mine closure plan:** Long-term rehabilitation strategy per DN COPAM 217/2017

Expected review timeline: 4–6 months from submission (Feb 2026).

---

## MPF — Cumulative EIA Request

The Ministério Público Federal (MPF) has requested a **cumulative environmental impact assessment** for the Poços de Caldas alkaline complex region:

- **Scope:** Combined effects of all mining, industrial, and urban activities in the alkaline complex
- **Basis:** Constitutional precautionary principle (Art. 225 §1-IV)
- **Status:** Non-binding recommendation; COPAM acknowledged but has not required a cumulative EIA as LP condition
- **Implication:** Meteoric has proactively begun cumulative impact data collection to preempt future requirements
- **Vero role:** Platform's spatial analysis layers provide the data infrastructure for cumulative assessment

---

## INB/CNEN Radiation Clearance

The Caldeira ionic clay deposit contains naturally occurring radioactive material (NORM) — primarily thorium associated with monazite:

- **INB (Indústrias Nucleares do Brasil):** Holds monopoly on nuclear material processing; must clear any thorium-bearing material
- **CNEN (Comissão Nacional de Energia Nuclear):** Regulates radiation safety standards
- **Caldeira status:** Thorium concentrations in ionic clay are **below CNEN's minimum threshold** for radioactive material classification
  - Background radiation at site: < 0.18 μSv/h (platform threshold: `radiation_critical_usv_h = 0.18`)
  - INB has provided preliminary clearance confirming material does not require nuclear material handling protocols
- **Monitoring:** Continuous radiation monitoring via field sensors, data fed to Vero platform

---

## IBAMA — APA Consultation

The project area borders the **APA (Área de Proteção Ambiental)** of the Poços de Caldas alkaline complex:

- **IBAMA role:** Federal environmental agency; consulted when activities may affect federal conservation units
- **APA status:** Sustainable-use conservation unit — mining is permitted with appropriate licensing
- **Buffer zone:** Vero maps 7 mining licence polygons with centroids inside the schematic APA buffer
- **Consultation status:** IBAMA formal opinion (parecer) requested as part of LI process
- **Flora/fauna surveys:** Required within APA buffer zone; completed Q4 2025

---

## ANM Concession Status

- **Concession type:** Exploitation concessions (Concessão de Lavra) for REE
- **Total area:** Multiple concession polygons within the alkaline complex
- **CFEM rate:** 2.0% on net sales revenue for rare earth elements
- **Reporting:** Annual RAL submission; monthly CFEM declarations
- **Status:** Active and in good standing with ANM

---

## Cross-Reference: Applicable Regulations

| Regulation | Reference File |
|------------|---------------|
| CONAMA 357/2005 (Water Quality) | `data/knowledge/brazil/conama-357.md` |
| CONAMA 430/2011 (Effluent Discharge) | `data/knowledge/brazil/conama-430.md` |
| DN COPAM 217/2017 (MG Licensing) | `data/knowledge/brazil/dn-copam-217.md` |
| Constitution Art. 225 | `data/knowledge/brazil/constitution-225.md` |
| ANM Mining Code | `data/knowledge/brazil/anm-mining.md` |
| IRA §45X / FEOC | `data/knowledge/international/ira-45x.md` |
| EU Battery Regulation DPP | `data/knowledge/international/eu-battery-reg.md` |
| OECD Due Diligence | `data/knowledge/international/oecd-due-diligence.md` |

---

## Platform Mapping

Vero centralizes Caldeira's regulatory posture through:

- **Regulatory timeline:** LP → LI → LO progression visualized with milestone markers and estimated dates
- **Condicionante tracker:** Each LP condition mapped to a sensor feed, document, or scheduled action
- **Radiation monitoring:** Real-time μSv/h readings against `radiation_critical_usv_h = 0.18` threshold
- **APA spatial overlay:** 7 concession polygons in APA buffer shown on Map view
- **MPF data layer:** Cumulative impact metrics aggregated across the alkaline complex
- **Domain data source:** `regulatory_log` in the mock data service records all licensing events
- **Spring monitoring:** 1,092 natural springs tracked for CONAMA 357 compliance (`CALDEIRA_SPRING_COUNT`)
- **Threshold constants:** All environmental thresholds sourced from `shared/sites/caldeira.ts`
