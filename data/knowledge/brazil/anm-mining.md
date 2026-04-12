# ANM Mining Code Essentials

**Authority:** Agência Nacional de Mineração (ANM), formerly DNPM  
**Legal basis:** Código de Mineração (Decree-Law 227/1967, amended by Law 13.575/2017)  
**Scope:** Governs mineral exploration, exploitation, and rights across Brazil.  
**Relevance:** Defines the mining rights regime under which Caldeira concessions are held.

---

## Mining Rights Regime

### Authorization for Exploration (Alvará de Pesquisa)
- Issued by ANM for a defined area (max 2,000 ha for most minerals; 50 ha increments).
- Validity: 1–3 years, renewable once for equal period.
- Holder must submit a Final Exploration Report (Relatório Final de Pesquisa) to ANM.
- If ANM approves the report as demonstrating a viable deposit, the holder can apply for exploitation.

### Exploitation Concession (Concessão de Lavra)
- Granted by federal decree (portaria) based on ANM recommendation.
- Perpetual in duration but subject to ongoing compliance obligations.
- Cannot be transferred without ANM approval.
- Requires an approved Economic Exploitation Plan (PAE — Plano de Aproveitamento Econômico).

### Other Regimes
- **Permissão de Lavra Garimpeira (PLG):** Artisanal/small-scale mining — not applicable to Caldeira.
- **Registro de Extração:** State/municipal extraction for public works — not applicable.
- **Monopoly regime:** Nuclear minerals (uranium, thorium) — relevant for Caldeira's monazite/thorium content, see INB/CNEN clearance.

---

## Environmental Obligations (Art. 47 & related)

- Mining title holders must comply with all federal, state, and municipal environmental laws.
- **Mine closure plan** required as part of licensing — Art. 225 §2 of the Constitution.
- **Environmental compensation:** Mining in protected areas (APA, etc.) requires additional compensation funds.
- **Dam safety:** Tailings dams subject to PNSB (Política Nacional de Segurança de Barragens) — Lei 12.334/2010, amended post-Brumadinho.
- Caldeira's ionic clay extraction avoids conventional tailings dams (low-pressure leach process).

---

## CFEM — Royalties (Compensação Financeira)

Financial compensation for mineral exploitation, distributed to federal, state, and municipal levels:

| Mineral Group | CFEM Rate | Notes |
|---------------|-----------|-------|
| Iron ore | 3.5% | Gross revenue |
| Bauxite, manganese, niobium | 3.0% | |
| Gold | 1.5% | |
| Precious stones | 1.0% | |
| Rare earth elements | 2.0% | Applied to Caldeira's NdPr/REE output |
| Other minerals | 1.0–2.0% | |

- Base: **gross revenue minus taxes, transport, and insurance costs** (net sales revenue).
- Distribution: 60% municipality, 15% state, 15% federal (ANM), 10% FNDCT (science/technology fund).

---

## Reporting Requirements

- **Annual Mining Report (RAL):** Due by March 15 each year; reports production volumes, revenue, workforce, environmental status.
- **Monthly CFEM declaration:** Self-assessed royalty payment via ANM's SISCFEM system.
- **Final Exploration Report:** At conclusion of exploration phase.
- **Mine Closure Report:** At end of mine life, demonstrating area rehabilitation.

---

## Enforcement & Penalties

- **Illegal mining (lavra ilegal):** Criminal offense under Art. 55, Lei 9.605/1998.
- **Administrative sanctions:** Fines, concession suspension, or cancellation for non-compliance.
- **ANM inspections:** Unannounced site visits; increasing use of remote sensing for compliance verification.

---

## Platform Mapping

Vero supports ANM compliance through:

- **Concession boundary visualization:** Mining polygons rendered on the Map layer, sourced from ANM SIGMINE shapefiles
- **Production tracking:** Output volumes by mineral species feed into CFEM royalty calculations
- **RAL data pipeline:** Annual report data structured for automated submission
- **Compliance dashboard:** Tracks concession status, renewal dates, and active obligations
- **Domain data:** `regulatory_log` records ANM permit events; concession metadata stored in site config
- **APA overlay:** Map layer shows intersection of mining concessions with APA boundaries for environmental compensation tracking
