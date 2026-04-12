# CONAMA Resolution 357/2005 — Water Quality Classification

**Authority:** Conselho Nacional do Meio Ambiente (CONAMA), Ministry of Environment  
**Scope:** Classifies freshwater, brackish, and saline bodies by intended use; sets maximum allowable concentrations for each class.  
**Relevance:** Defines the water quality baselines Vero monitors around the Caldeira concession.

---

## Freshwater Classification (Classes 1–4)

### Class 1 — Human Supply (after simplified treatment), ecosystem protection
- **pH:** 6.0–9.0
- **Dissolved Oxygen (DO):** ≥ 6 mg/L
- **Total Dissolved Solids (TDS):** ≤ 500 mg/L
- **Sulfate (SO₄²⁻):** ≤ 250 mg/L
- **Nitrate (NO₃⁻-N):** ≤ 10 mg/L
- **Turbidity:** ≤ 40 NTU
- **Total Phosphorus:** ≤ 0.1 mg/L (lentic) / ≤ 0.15 mg/L (lotic)

### Class 2 — Human supply (after conventional treatment), aquaculture, recreation
- **pH:** 6.0–9.0
- **DO:** ≥ 5 mg/L
- **TDS:** ≤ 500 mg/L
- **Sulfate:** ≤ 250 mg/L
- **Nitrate:** ≤ 10 mg/L
- **Turbidity:** ≤ 100 NTU
- **Total Phosphorus:** ≤ 0.05 mg/L (lentic) / ≤ 0.1 mg/L (lotic)

### Class 3 — Human supply (after advanced treatment), irrigation, livestock
- **pH:** 6.0–9.0
- **DO:** ≥ 4 mg/L
- **TDS:** ≤ 500 mg/L
- **Sulfate:** ≤ 250 mg/L
- **Nitrate:** ≤ 10 mg/L
- **Turbidity:** ≤ 100 NTU

### Class 4 — Navigation, landscape harmony only
- **DO:** > 2 mg/L
- No numeric limits for most parameters; water body must not present objectionable conditions (odor, floating material).

---

## Parameters Relevant to REE/Ionic Clay Mining

| Parameter | Class 1 | Class 2 | Class 3 | Unit |
|-----------|---------|---------|---------|------|
| Sulfate | 250 | 250 | 250 | mg/L |
| Nitrate (as N) | 10 | 10 | 10 | mg/L |
| pH | 6.0–9.0 | 6.0–9.0 | 6.0–9.0 | — |
| Aluminum (dissolved) | 0.1 | 0.1 | 0.2 | mg/L |
| Iron (dissolved) | 0.3 | 0.3 | 5.0 | mg/L |
| Manganese | 0.1 | 0.1 | 0.5 | mg/L |
| Fluoride | 1.4 | 1.4 | 1.4 | mg/L |

---

## Key Provisions

- **Art. 8:** Water bodies are classified by state environmental agencies (in MG: COPAM/IGAM).
- **Art. 10:** Where no classification exists, Class 2 applies by default.
- **Art. 14–17:** Mixing zones at effluent discharge points must not cause the receiving body to exceed its class limits.
- **Art. 24–25:** Monitoring frequency depends on water body class and pollutant risk.

---

## Platform Mapping

Vero maps CONAMA 357 thresholds directly into the environmental monitoring layer:

- **Sulfate warning:** `sulfate_warning_ppm = 250` — matches CONAMA 357 Class 1–3 limit
- **Nitrate warning:** `nitrate_warning_ppm = 50` — conservative platform threshold (CONAMA limit is 10 mg/L as N ≈ 44 mg/L as NO₃⁻; platform uses 50 ppm as the operational alert for total nitrate species)
- **pH range:** `ph_low = 3.9`, `ph_high = 5.1` — reflects naturally acidic Caldeira laterite porewater; CONAMA 357 Class 1–3 mandates 6.0–9.0 for receiving water bodies
- Threshold constants sourced from `shared/sites/caldeira.ts` → `CALDEIRA_THRESHOLDS`
- Sensor telemetry triggers amber/red alerts on the Map and Environment Report views when values approach or exceed these limits
