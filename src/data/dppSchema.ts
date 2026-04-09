/**
 * EU Battery Regulation / CEN-CENELEC Digital Product Passport field mapping.
 * Maps mandatory DPP fields to Aether data sources with current coverage status.
 *
 * Reference: Regulation (EU) 2023/1542, Annex VI — Minimum mandatory data elements
 * for the battery passport (applicable by Feb 2027 for EV/industrial batteries).
 */

export type DppFieldStatus = 'mapped' | 'stub' | 'pending'

export interface DppFieldMapping {
  id: string
  category: string
  field: string
  cenRef: string
  aetherSource: string
  status: DppFieldStatus
}

export const DPP_FIELD_MAPPINGS: DppFieldMapping[] = [
  // General battery / product info
  { id: 'DPP-01', category: 'Identification', field: 'Unique battery identifier', cenRef: 'Annex VI §1(a)', aetherSource: 'batch.batch_id', status: 'mapped' },
  { id: 'DPP-02', category: 'Identification', field: 'Manufacturer identification', cenRef: 'Annex VI §1(b)', aetherSource: 'Meteoric Resources / Caldeira Project', status: 'mapped' },
  { id: 'DPP-03', category: 'Identification', field: 'Manufacturing date', cenRef: 'Annex VI §1(c)', aetherSource: 'batch.batch_date', status: 'mapped' },
  { id: 'DPP-04', category: 'Identification', field: 'Manufacturing location', cenRef: 'Annex VI §1(d)', aetherSource: 'Poços de Caldas, MG, Brazil', status: 'mapped' },
  { id: 'DPP-05', category: 'Identification', field: 'Battery weight', cenRef: 'Annex VI §1(e)', aetherSource: 'batch.tonnage_kg', status: 'mapped' },

  // Material composition
  { id: 'DPP-06', category: 'Material Composition', field: 'Battery chemistry', cenRef: 'Annex VI §2(a)', aetherSource: 'NdFeB permanent magnet (MREC output)', status: 'mapped' },
  { id: 'DPP-07', category: 'Material Composition', field: 'Critical raw materials content', cenRef: 'Annex VI §2(b)', aetherSource: 'batch TREO/MREO ppm from resource data', status: 'mapped' },
  { id: 'DPP-08', category: 'Material Composition', field: 'Recycled content share', cenRef: 'Annex VI §2(c)', aetherSource: 'N/A — primary extraction (0% recycled)', status: 'mapped' },
  { id: 'DPP-09', category: 'Material Composition', field: 'Renewable content share', cenRef: 'Annex VI §2(d)', aetherSource: 'Pending — energy mix data not yet integrated', status: 'pending' },

  // Carbon footprint
  { id: 'DPP-10', category: 'Carbon Footprint', field: 'Carbon footprint total (lifecycle)', cenRef: 'Annex VI §3(a)', aetherSource: 'batch.carbon_intensity (kg CO₂e/kg TREO)', status: 'mapped' },
  { id: 'DPP-11', category: 'Carbon Footprint', field: 'Carbon footprint per lifecycle stage', cenRef: 'Annex VI §3(b)', aetherSource: 'Scope 3 tracking (reagent chain)', status: 'stub' },
  { id: 'DPP-12', category: 'Carbon Footprint', field: 'Carbon footprint performance class', cenRef: 'Annex VI §3(c)', aetherSource: 'batch.carbon_intensity.tier (Premium/Standard/High)', status: 'mapped' },

  // Supply chain due diligence
  { id: 'DPP-13', category: 'Supply Chain', field: 'Supply chain due diligence report', cenRef: 'Annex VI §4(a)', aetherSource: 'FEOC 0.00% + molecular timeline traceability', status: 'mapped' },
  { id: 'DPP-14', category: 'Supply Chain', field: 'Third-party verification', cenRef: 'Annex VI §4(b)', aetherSource: 'Pending — no external auditor yet', status: 'pending' },
  { id: 'DPP-15', category: 'Supply Chain', field: 'Country of origin of raw materials', cenRef: 'Annex VI §4(c)', aetherSource: 'Brazil (Caldeira alkaline complex)', status: 'mapped' },
  { id: 'DPP-16', category: 'Supply Chain', field: 'FEOC compliance declaration', cenRef: 'IRA §45X cross-ref', aetherSource: 'batch.feoc_percentage + batch.ira_compliant', status: 'mapped' },

  // Hazardous substances
  { id: 'DPP-17', category: 'Hazardous Substances', field: 'Hazardous substances present', cenRef: 'Annex VI §5(a)', aetherSource: 'U/Th safety profile (ionic clay — low rad)', status: 'mapped' },
  { id: 'DPP-18', category: 'Hazardous Substances', field: 'Mercury, cadmium, lead content', cenRef: 'Annex VI §5(b)', aetherSource: 'Below detection — ionic clay process', status: 'stub' },

  // Performance & durability
  { id: 'DPP-19', category: 'Performance', field: 'Rated capacity', cenRef: 'Annex VI §6(a)', aetherSource: 'N/A — REE feedstock, not battery cell', status: 'pending' },
  { id: 'DPP-20', category: 'Performance', field: 'Expected battery lifetime', cenRef: 'Annex VI §6(b)', aetherSource: 'N/A — REE feedstock, not battery cell', status: 'pending' },

  // End of life
  { id: 'DPP-21', category: 'End of Life', field: 'Collection & recycling information', cenRef: 'Annex VI §7(a)', aetherSource: 'Pending — downstream recycling partners not established', status: 'pending' },
  { id: 'DPP-22', category: 'End of Life', field: 'Dismantling information', cenRef: 'Annex VI §7(b)', aetherSource: 'Pending — applies to battery cell, not REE feedstock', status: 'pending' },
]

export const DPP_CATEGORIES = [...new Set(DPP_FIELD_MAPPINGS.map(f => f.category))]

export function getDppCoverage(): { mapped: number; stub: number; pending: number; total: number; pct: number } {
  const mapped = DPP_FIELD_MAPPINGS.filter(f => f.status === 'mapped').length
  const stub = DPP_FIELD_MAPPINGS.filter(f => f.status === 'stub').length
  const pending = DPP_FIELD_MAPPINGS.filter(f => f.status === 'pending').length
  return { mapped, stub, pending, total: DPP_FIELD_MAPPINGS.length, pct: Math.round((mapped / DPP_FIELD_MAPPINGS.length) * 100) }
}

export interface DppExportJson {
  schema_version: string
  regulation_ref: string
  export_timestamp: string
  batch_id: string
  coverage: ReturnType<typeof getDppCoverage>
  fields: Record<string, { value: unknown; status: DppFieldStatus; cen_ref: string }>
}

export function buildDppExport(
  batch: { batch_id: string; batch_date: string; tonnage_kg: number; feoc_percentage: number; ira_compliant: boolean; carbon_intensity: { value: number; tier: string; vs_chinese_baseline: number } },
  uThSafety: { primary_mineral: string; u_th_profile: string } | null,
): DppExportJson {
  return {
    schema_version: '0.1.0-draft',
    regulation_ref: 'EU 2023/1542 Annex VI',
    export_timestamp: new Date().toISOString(),
    batch_id: batch.batch_id,
    coverage: getDppCoverage(),
    fields: {
      unique_battery_identifier: { value: batch.batch_id, status: 'mapped', cen_ref: 'Annex VI §1(a)' },
      manufacturer_identification: { value: 'Meteoric Resources — Caldeira Project', status: 'mapped', cen_ref: 'Annex VI §1(b)' },
      manufacturing_date: { value: batch.batch_date, status: 'mapped', cen_ref: 'Annex VI §1(c)' },
      manufacturing_location: { value: 'Poços de Caldas, MG, Brazil (-21.79, -46.56)', status: 'mapped', cen_ref: 'Annex VI §1(d)' },
      batch_weight_kg: { value: batch.tonnage_kg, status: 'mapped', cen_ref: 'Annex VI §1(e)' },
      battery_chemistry: { value: 'NdFeB permanent magnet precursor (MREC)', status: 'mapped', cen_ref: 'Annex VI §2(a)' },
      critical_raw_materials: { value: 'Nd, Pr, Dy, Tb (ionic clay adsorption REE)', status: 'mapped', cen_ref: 'Annex VI §2(b)' },
      recycled_content_pct: { value: 0, status: 'mapped', cen_ref: 'Annex VI §2(c)' },
      renewable_content_pct: { value: null, status: 'pending', cen_ref: 'Annex VI §2(d)' },
      carbon_footprint_total: { value: batch.carbon_intensity.value, status: 'mapped', cen_ref: 'Annex VI §3(a)' },
      carbon_footprint_lifecycle_stages: { value: null, status: 'stub', cen_ref: 'Annex VI §3(b)' },
      carbon_footprint_class: { value: batch.carbon_intensity.tier, status: 'mapped', cen_ref: 'Annex VI §3(c)' },
      supply_chain_due_diligence: { value: `FEOC ${batch.feoc_percentage}% — IRA ${batch.ira_compliant ? 'compliant' : 'non-compliant'}`, status: 'mapped', cen_ref: 'Annex VI §4(a)' },
      third_party_verification: { value: null, status: 'pending', cen_ref: 'Annex VI §4(b)' },
      country_of_origin: { value: 'Brazil', status: 'mapped', cen_ref: 'Annex VI §4(c)' },
      feoc_compliance: { value: { feoc_pct: batch.feoc_percentage, ira_compliant: batch.ira_compliant }, status: 'mapped', cen_ref: 'IRA §45X' },
      hazardous_substances: { value: uThSafety ? `${uThSafety.primary_mineral} — ${uThSafety.u_th_profile}` : null, status: uThSafety ? 'mapped' : 'stub', cen_ref: 'Annex VI §5(a)' },
      heavy_metals: { value: 'Below detection limits (ionic clay process)', status: 'stub', cen_ref: 'Annex VI §5(b)' },
      rated_capacity: { value: null, status: 'pending', cen_ref: 'Annex VI §6(a)' },
      expected_lifetime: { value: null, status: 'pending', cen_ref: 'Annex VI §6(b)' },
      collection_recycling_info: { value: null, status: 'pending', cen_ref: 'Annex VI §7(a)' },
      dismantling_info: { value: null, status: 'pending', cen_ref: 'Annex VI §7(b)' },
    },
  }
}
