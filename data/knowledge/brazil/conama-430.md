# CONAMA Resolution 430/2011 — Effluent Discharge Standards

**Authority:** Conselho Nacional do Meio Ambiente (CONAMA)  
**Amends:** CONAMA 357/2005 (Art. 24–34 on effluent discharge)  
**Scope:** Sets conditions and limits for direct discharge of effluents into receiving water bodies.  
**Relevance:** Governs all process water and tailings discharge from Caldeira's CIP plant.

---

## General Discharge Conditions (Art. 16)

All effluents must comply before discharge regardless of receiving body class:

- **pH:** 5.0–9.0
- **Temperature:** ≤ 40 °C, and temperature increase in mixing zone ≤ 3 °C above ambient
- **Settleable solids:** ≤ 1 mL/L (1 h Imhoff cone)
- **Oils and greases (mineral):** ≤ 20 mg/L
- **Oils and greases (animal/vegetable):** ≤ 50 mg/L
- **Absence** of floating materials

---

## Organic Load Limits (Art. 21)

- **BOD₅,₂₀:** Maximum 120 mg/L, OR minimum 60% removal when raw influent exceeds 120 mg/L
- Regulatory body may set stricter limits based on receiving body capacity

---

## Inorganic Parameters for Mining Operations

| Parameter | Maximum | Unit | Notes |
|-----------|---------|------|-------|
| Arsenic | 0.5 | mg/L | |
| Cadmium | 0.2 | mg/L | |
| Lead | 0.5 | mg/L | |
| Chromium (total) | 0.1 | mg/L | |
| Copper (dissolved) | 1.0 | mg/L | |
| Iron (dissolved) | 15.0 | mg/L | |
| Manganese (dissolved) | 1.0 | mg/L | |
| Mercury | 0.01 | mg/L | |
| Nickel | 2.0 | mg/L | |
| Zinc | 5.0 | mg/L | |
| Fluoride | 10.0 | mg/L | |
| Sulfide | 1.0 | mg/L | |
| Total Nitrogen | 20.0 | mg/L | State agencies may lower |
| Total Phosphorus | Varies | mg/L | Set by state agency |

---

## Mining-Specific Provisions

- **Art. 18:** Mining effluents classified as industrial wastewater; must meet Art. 16 general conditions plus sector-specific limits.
- **Art. 22–23:** State environmental agencies (in MG: FEAM/COPAM) may impose stricter limits via licensing conditions. Caldeira's LP conditions reference CONAMA 430 as the baseline.
- **Art. 24:** Effluent self-monitoring is mandatory. Frequency set by the licensing body — typically monthly for mining operations, quarterly for background stations.
- **Art. 26:** Discharge permits require demonstration of best available technology for treatment.

---

## Recirculation & Zero-Discharge Relevance

Caldeira's CIP process targets ≥ 94% water recirculation, reducing discharge volume. CONAMA 430 still applies to any residual bleed stream or stormwater overflow from the process circuit.

---

## Platform Mapping

Vero monitors CONAMA 430 compliance through:

- **Recirculation rate:** `recirculation_warning_pct = 94` triggers alerts when recirculation drops, increasing discharge risk
- **pH discharge band:** Platform tracks effluent pH against the 5.0–9.0 discharge window
- **Temperature delta:** Sensor telemetry computes ΔT between discharge and receiving stream
- **Environment Report:** The `EnvironmentReport` component renders compliance status for active discharge parameters
- **Threshold source:** `shared/sites/caldeira.ts` → `CALDEIRA_THRESHOLDS`
- Future: automated CONAMA 430 compliance certificates via the `/api/compliance/conama430` endpoint
