/**
 * Idempotent unit seeder — populates units and edges from existing domain data.
 *
 * Sources: GeoJSON files on disk, domain data re-imported from seed constants,
 * and shared site config. Unit types are always upserted so inspector/schema
 * changes propagate even when the unit rows already exist.
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { seedUnitType, createUnit, createEdge, getUnitCount } from './unitStore.js'
import { ALL_UNIT_TYPES } from './unitTypeSeeds.js'
import {
  MARITIME_SITE_ID,
  MARITIME_SITE_LABEL,
  MARITIME_AOI_SEEDS,
  MARITIME_VESSEL_SEEDS,
  MARITIME_SENSOR_SEEDS,
  MARITIME_INCIDENT_SEEDS,
  MARITIME_ISR_PRODUCT_SEEDS,
} from './maritimeUnitSeeds.js'
import type { Severity } from '../types/unitTypes.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const GEOJSON_DIR = path.resolve(__dirname, '..', '..', '..', 'src', 'data', 'geojson')

interface GeoJSONFeature {
  type: string
  properties: Record<string, unknown>
  geometry: { type: string; coordinates: unknown }
}

interface GeoJSONCollection {
  type: string
  features: GeoJSONFeature[]
}

function loadGeoJSON(filename: string): GeoJSONCollection {
  const raw = readFileSync(path.join(GEOJSON_DIR, filename), 'utf-8')
  return JSON.parse(raw) as GeoJSONCollection
}

function featureCenter(f: GeoJSONFeature): [number, number] | null {
  const geom = f.geometry
  if (!geom?.coordinates) return null
  if (geom.type === 'Point') return geom.coordinates as [number, number]
  if (geom.type === 'Polygon') {
    const ring = (geom.coordinates as number[][][])[0]
    if (!ring?.length) return null
    const sum = ring.reduce((acc, c) => [acc[0] + c[0], acc[1] + c[1]], [0, 0])
    return [sum[0] / ring.length, sum[1] / ring.length]
  }
  if (geom.type === 'MultiPolygon') {
    const polys = geom.coordinates as number[][][][]
    const ring = polys[0]?.[0]
    if (!ring?.length) return null
    const sum = ring.reduce((acc, c) => [acc[0] + c[0], acc[1] + c[1]], [0, 0])
    return [sum[0] / ring.length, sum[1] / ring.length]
  }
  return null
}

/* ─── Domain data (inline from existing sources) ──────────────────────────── */

interface DepositSeed {
  id: string
  name: string
  status: string
  treo_ppm: number
  mreo_pct: number
  tonnage_mt: number
  clay_depth_avg_m: number
  clay_depth_max_m: number
  area_km2: number
  center: [number, number]
  provenance?: {
    source: string
    classification: string
    verifier: string
    url?: string
  }
}

const DEPOSIT_DATA: DepositSeed[] = [
  {
    id: 'capao-do-mel', name: 'Capão do Mel', status: 'measured',
    treo_ppm: 3034, mreo_pct: 24, tonnage_mt: 85, clay_depth_avg_m: 23.4, clay_depth_max_m: 50, area_km2: 9.9, center: [-46.565, -21.848],
    provenance: {
      source: 'ASX 2024-11-08',
      classification: 'JORC Measured',
      verifier: 'SRK Consulting, 2024 MRE',
      url: 'https://www.asx.com.au/asx/statistics/displayAnnouncement.do?display=pdf&idsId=02870488',
    },
  },
  {
    id: 'soberbo', name: 'Soberbo', status: 'indicated',
    treo_ppm: 2601, mreo_pct: 26, tonnage_mt: 229, clay_depth_avg_m: 16.9, clay_depth_max_m: 77.4, area_km2: 9.9, center: [-46.615, -21.882],
    provenance: {
      source: 'ASX 2024-11-08',
      classification: 'JORC Indicated',
      verifier: 'SRK Consulting, 2024 MRE',
      url: 'https://www.asx.com.au/asx/statistics/displayAnnouncement.do?display=pdf&idsId=02870488',
    },
  },
  {
    id: 'figueira', name: 'Figueira', status: 'indicated',
    treo_ppm: 2480, mreo_pct: 23, tonnage_mt: 44, clay_depth_avg_m: 28.2, clay_depth_max_m: 62.5, area_km2: 3.1, center: [-46.590, -21.818],
    provenance: {
      source: 'ASX 2024-11-08',
      classification: 'JORC Indicated',
      verifier: 'SRK Consulting, 2024 MRE',
      url: 'https://www.asx.com.au/asx/statistics/displayAnnouncement.do?display=pdf&idsId=02870488',
    },
  },
  { id: 'barra-do-pacu', name: 'Barra do Pacu', status: 'indicated', treo_ppm: 2204, mreo_pct: 22, tonnage_mt: 389, clay_depth_avg_m: 29.2, clay_depth_max_m: 50, area_km2: 7.6, center: [-46.555, -21.878] },
  { id: 'agostinho', name: 'Agostinho', status: 'exploration', treo_ppm: 5200, mreo_pct: 30, tonnage_mt: 0, clay_depth_avg_m: 0, clay_depth_max_m: 24, area_km2: 5.0, center: [-46.520, -21.778] },
  { id: 'cupim-vermelho-norte', name: 'Cupim Vermelho Norte', status: 'inferred', treo_ppm: 2200, mreo_pct: 24, tonnage_mt: 340, clay_depth_avg_m: 20, clay_depth_max_m: 55, area_km2: 13.0, center: [-46.5855, -21.7229] },
  { id: 'dona-maria', name: 'Dona Maria 1 & 2', status: 'inferred', treo_ppm: 2100, mreo_pct: 23, tonnage_mt: 226, clay_depth_avg_m: 18, clay_depth_max_m: 45, area_km2: 2.4, center: [-46.546, -21.7485] },
]

/**
 * Demo-gating provenance seeds for drillholes the team will actually click
 * during the Meteoric pitch. Read at seed time and merged into each drillhole's
 * `data.provenance` field. All other drillholes seed with no provenance today.
 */
const DRILLHOLE_PROVENANCE: Record<string, { source: string; classification: string; verifier: string; url?: string }> = {
  CDMDD0001: {
    source: 'Diamond core CDMDD0001, Capão do Mel',
    classification: 'JORC Measured',
    verifier: 'Dr. Caponi, LAPOC',
    url: 'https://www.asx.com.au/asx/statistics/displayAnnouncement.do?display=pdf&idsId=02870488',
  },
  SBBDD0001: {
    source: 'Diamond core SBBDD0001, Soberbo',
    classification: 'JORC Indicated',
    verifier: 'Dr. Caponi, LAPOC',
    url: 'https://www.asx.com.au/asx/statistics/displayAnnouncement.do?display=pdf&idsId=02870488',
  },
  FIGDD0001: {
    source: 'Diamond core FIGDD0001, Figueira',
    classification: 'JORC Indicated',
    verifier: 'Dr. Caponi, LAPOC',
    url: 'https://www.asx.com.au/asx/statistics/displayAnnouncement.do?display=pdf&idsId=02870488',
  },
}

const BATCH_LICENSE_MAP: Record<string, string> = {
  'BATCH-MREC-8X9': 'LIC-CDM-01',
  'BATCH-MREC-7W2': 'LIC-SOB-01',
  'BATCH-MREC-4K1': 'LIC-CDM-01',
  'BATCH-MREC-2A7': 'LIC-CDM-01',
}

const LICENSE_DEPOSIT_MAP: Record<string, string> = {
  'LIC-CDM-01': 'capao-do-mel',
  'LIC-SOB-01': 'soberbo',
  'LIC-CVN-01': 'cupim-vermelho-norte',
  'LIC-FIG-01': 'figueira',
  'LIC-DM1-01': 'dona-maria',
  'LIC-DM2-01': 'dona-maria',
}

const BATCHES = [
  { batch_id: 'BATCH-MREC-8X9', tonnage_kg: 487, feoc_percentage: 0, ira_compliant: true, carbon_intensity: 2.14, destination: 'Ucore Rare Metals — Louisiana SMC, USA' },
  { batch_id: 'BATCH-MREC-7W2', tonnage_kg: 512, feoc_percentage: 0, ira_compliant: true, carbon_intensity: 2.08, destination: 'Neo Performance Materials — Narva, Estonia (EU)' },
  { batch_id: 'BATCH-MREC-4K1', tonnage_kg: 1850, feoc_percentage: 0, ira_compliant: true, carbon_intensity: 3.1, destination: 'Shin-Etsu Chemical — Takefu, Japan' },
  { batch_id: 'BATCH-MREC-2A7', tonnage_kg: 920, feoc_percentage: 0, ira_compliant: true, carbon_intensity: 3.4, destination: 'MP Materials — Mountain Pass, USA' },
]

const CONDITIONS_PRECEDENT = [
  { id: 'CP-01', description: 'DFS completion and Board approval', status: 'in_progress', target_date: '2026-06-30' },
  { id: 'CP-02', description: 'Installation License (LI) granted', status: 'pending', target_date: '2026-06-30' },
  { id: 'CP-03', description: 'Final Investment Decision (FID)', status: 'pending', target_date: '2026-09-30' },
  { id: 'CP-04', description: 'Environmental bond posted', status: 'met', target_date: '2026-03-31' },
  { id: 'CP-05', description: 'Binding offtake agreements', status: 'in_progress', target_date: '2026-08-31' },
]

const REGULATORY_LOG = [
  { id: 'REG-01', body: 'COPAM', type: 'LP Hearing', date: '2025-12-19', status: 'approved', detail: 'Unanimous approval of Preliminary License.' },
  { id: 'REG-02', body: 'SUPRAM', type: 'LI Application', date: '2026-02-14', status: 'submitted', detail: 'Installation License application lodged.' },
  { id: 'REG-03', body: 'FEAM', type: 'Technical Review', date: '2026-03-20', status: 'in_review', detail: 'Environmental conditions review.' },
  { id: 'REG-04', body: 'MPF', type: 'Cumulative EIA Request', date: '2026-01-15', status: 'in_review', detail: 'Federal prosecutor requested cumulative EIA.' },
  { id: 'REG-05', body: 'INB/ANSN', type: 'Radiation Clearance', date: '2026-03-01', status: 'approved', detail: 'UDC legacy site monitoring protocol accepted.' },
  { id: 'REG-06', body: 'IBAMA', type: 'APA Consultation', date: '2026-04-02', status: 'pending', detail: 'APA Pedra Branca buffer zone consultation scheduled.' },
]

const RISKS = [
  { id: 'R01', title: 'MPF cumulative EIA objection blocks LI', category: 'permitting', likelihood: 3, impact: 5, score: 15, mitigation: 'Hydro digital twin + spring reference points.', status: 'mitigating', owner: 'VP Environment', relatedRegulatoryIds: ['REG-04'] },
  { id: 'R02', title: 'NdPr price decline below breakeven', category: 'market', likelihood: 2, impact: 5, score: 10, mitigation: 'Green premium offtakes with floor price clauses.', status: 'mitigating', owner: 'CFO' },
  { id: 'R03', title: 'FEOC policy change expands restricted entities', category: 'geopolitical', likelihood: 2, impact: 4, score: 8, mitigation: 'Full Scope 3 reagent provenance tracking.', status: 'mitigating', owner: 'VP Compliance' },
  { id: 'R04', title: 'DFS completion delayed beyond mid-2026', category: 'technical', likelihood: 3, impact: 4, score: 12, mitigation: 'Ausenco acceleration package.', status: 'mitigating', owner: 'Project Director' },
  { id: 'R05', title: 'Water quality exceedance at discharge point', category: 'environmental', likelihood: 2, impact: 4, score: 8, mitigation: 'ISE real-time monitoring.', status: 'mitigating', owner: 'Environmental Manager' },
  { id: 'R06', title: 'UDC legacy radiation above background', category: 'environmental', likelihood: 2, impact: 3, score: 6, mitigation: 'Continuous scintillation monitoring.', status: 'accepted', owner: 'HSE Director' },
  { id: 'R07', title: 'Ammonium sulfate supply chain disruption', category: 'operational', likelihood: 2, impact: 3, score: 6, mitigation: 'Dual-supplier qualification.', status: 'mitigating', owner: 'Supply Chain Manager' },
  { id: 'R08', title: 'Key personnel retention during scale-up', category: 'operational', likelihood: 3, impact: 3, score: 9, mitigation: 'Long-term incentive plans.', status: 'open', owner: 'CHRO' },
  { id: 'R09', title: 'BRL/USD FX exposure on operating costs', category: 'market', likelihood: 3, impact: 3, score: 9, mitigation: 'Natural hedge.', status: 'mitigating', owner: 'Treasury' },
  { id: 'R10', title: 'Community opposition to mine expansion', category: 'permitting', likelihood: 2, impact: 4, score: 8, mitigation: 'Community liaison program.', status: 'mitigating', owner: 'Community Relations' },
]

const INCIDENT_LOG = [
  { id: 'INC-001', title: 'pH Level Elevated — Leach Circuit', severity: 'warning', status: 'resolved', assignee: 'J. Santos (Process Eng.)', sla_minutes: 30 },
  { id: 'INC-002', title: 'Sulfate Containment Near Threshold', severity: 'critical', status: 'resolved', assignee: 'M. Costa (Env. Manager)', sla_minutes: 15 },
  { id: 'INC-003', title: 'Water Recirculation Below Target', severity: 'warning', status: 'resolved', assignee: 'A. Lima (Operations)', sla_minutes: 30 },
  { id: 'INC-004', title: 'UDC Radiation Elevated', severity: 'critical', status: 'resolved', assignee: 'R. Ferreira (HSE)', sla_minutes: 15 },
  { id: 'INC-005', title: 'Aquifer Depth Critical — PIZ-E04', severity: 'critical', status: 'resolved', assignee: 'Dr. L. Oliveira (Hydro.)', sla_minutes: 15 },
]

const OFFTAKERS = [
  { id: 'ucore', name: 'Ucore Rare Metals', location: 'Louisiana SMC, USA', stage: 'binding', volume_commitment: '2,000 tpa TREO', product: 'MREC', delivery: 'H2 2028' },
  { id: 'neo', name: 'Neo Performance Materials', location: 'Narva, Estonia (EU)', stage: 'loi', volume_commitment: '1,500 tpa TREO', product: 'MREC → separated oxides', delivery: 'H1 2029' },
]

const DFS_WORKSTREAMS = [
  { id: 'DFS-01', name: 'Mining & Reserves', lead: 'Ausenco', progress_pct: 85, status: 'on_track', target_date: '2026-05-15' },
  { id: 'DFS-02', name: 'Process Engineering', lead: 'Ausenco / Meteoric', progress_pct: 72, status: 'on_track', target_date: '2026-05-30' },
  { id: 'DFS-03', name: 'Infrastructure & Logistics', lead: 'Ausenco', progress_pct: 60, status: 'at_risk', target_date: '2026-06-15' },
  { id: 'DFS-04', name: 'Environmental & Permitting', lead: 'Meteoric / FEAM', progress_pct: 55, status: 'at_risk', target_date: '2026-06-30' },
  { id: 'DFS-05', name: 'Financial Model', lead: 'Ausenco / CFO', progress_pct: 45, status: 'on_track', target_date: '2026-06-30' },
]

const DRAWDOWN_SCHEDULE = [
  { milestone: 'DFS Completion', target_date: '2026-06-30', status: 'in_progress', cp_ref: 'CP-01' },
  { milestone: 'FID Approved', target_date: '2026-09-30', status: 'pending', cp_ref: 'CP-03' },
  { milestone: 'Construction Start', target_date: '2027-01-01', status: 'pending', cp_ref: null },
  { milestone: 'Equipment Procurement', target_date: '2027-06-01', status: 'pending', cp_ref: null },
  { milestone: 'Commissioning', target_date: '2027-10-01', status: 'pending', cp_ref: null },
  { milestone: 'First Ore', target_date: '2028-01-01', status: 'pending', cp_ref: null },
  { milestone: 'Ramp-up Reserve', target_date: '2028-06-01', status: 'pending', cp_ref: null },
]

const CALDEIRA_POIS: Record<string, { coords: [number, number]; label: string }> = {
  pilotPlant:      { coords: [-46.575, -21.8],   label: 'CIP Pilot Plant' },
  commercialPlant: { coords: [-46.545, -21.885], label: 'Proposed Commercial Plant' },
  capaoDoMel:      { coords: [-46.565, -21.848], label: 'Capão do Mel Deposit' },
  urbanCenter:     { coords: [-46.56,  -21.79],  label: 'Poços de Caldas Urban Center' },
}

const PIEZOMETER_SENSORS = [
  { sensor_id: 'PIZ-N01', coords: [-46.570, -21.810], label: 'North Margin' },
  { sensor_id: 'PIZ-S02', coords: [-46.560, -21.870], label: 'South Margin' },
  { sensor_id: 'PIZ-W03', coords: [-46.590, -21.840], label: 'West Margin' },
  { sensor_id: 'PIZ-E04', coords: [-46.540, -21.840], label: 'East Margin' },
]

/* ─── Helpers ─────────────────────────────────────────────────────────────── */

function mapRiskStatus(status: string): { state: string; severity: Severity } {
  switch (status) {
    case 'open': return { state: 'open', severity: 'action_required' }
    case 'mitigating': return { state: 'mitigating', severity: 'attention' }
    case 'accepted': return { state: 'accepted', severity: 'nominal' }
    default: return { state: 'open', severity: 'action_required' }
  }
}

function mapRegStatus(status: string): string {
  switch (status) {
    case 'approved': return 'approved'
    case 'submitted': return 'submitted'
    case 'in_review': return 'in_review'
    case 'pending': return 'pending'
    default: return 'drafting'
  }
}

function mapMilestoneStatus(status: string): { state: string; severity: Severity } {
  switch (status) {
    case 'in_progress': return { state: 'in_progress', severity: 'attention' }
    case 'on_track': return { state: 'on_track', severity: 'nominal' }
    case 'at_risk': return { state: 'at_risk', severity: 'action_required' }
    case 'completed': return { state: 'completed', severity: 'nominal' }
    default: return { state: 'pending', severity: 'nominal' }
  }
}

/* ─── Main Seeder ─────────────────────────────────────────────────────────── */

export function seedUnitsIfNeeded(): void {
  console.log('[unit-seeder] Seeding unit types...')
  for (const def of ALL_UNIT_TYPES) {
    seedUnitType(def)
  }

  if (getUnitCount() > 0) {
    console.log('[unit-seeder] Units already exist — skipping unit and edge creation.')
    return
  }

  console.log('[unit-seeder] Seeding units and edges...')

  // 1. Site
  createUnit({ id: 'SITE-CALDEIRA', typeId: 'site', label: 'Caldeira Project', initialState: 'active', data: { projectName: 'Caldeira Project', companyName: 'Meteoric Resources', center: [-46.573, -21.895] } })

  // 2. Deposits (7)
  for (const d of DEPOSIT_DATA) {
    const depositId = `DEP-${d.id}`
    const depositData: Record<string, unknown> = {
      name: d.name,
      status: d.status,
      treo_ppm: d.treo_ppm,
      mreo_pct: d.mreo_pct,
      tonnage_mt: d.tonnage_mt,
      clay_depth_avg_m: d.clay_depth_avg_m,
      clay_depth_max_m: d.clay_depth_max_m,
      area_km2: d.area_km2,
      center: d.center,
    }
    if (d.provenance) depositData.provenance = d.provenance
    createUnit({
      id: depositId, typeId: 'deposit', label: d.name,
      initialState: d.status, placeId: d.id,
      data: depositData,
    })
    createEdge('SITE-CALDEIRA', depositId, 'contains')
  }

  // 3. Drillholes (from GeoJSON)
  const drillGJ = loadGeoJSON('caldeira-drillholes.geojson')
  const depositUnitIds = new Set(DEPOSIT_DATA.map(d => `DEP-${d.id}`))
  for (const f of drillGJ.features) {
    const props = f.properties
    const holeId = props.id as string
    const unitId = `DH-${holeId}`
    const center = featureCenter(f)
    const drillData: Record<string, unknown> = {
      hole_id: holeId,
      depth_m: props.depth_m ?? 0,
      coordinates: center,
    }
    const provenance = DRILLHOLE_PROVENANCE[holeId]
    if (provenance) drillData.provenance = provenance
    createUnit({
      id: unitId, typeId: 'drillhole', label: holeId,
      initialState: 'assayed', placeId: holeId,
      data: drillData,
    })
    const depositName = props.deposit as string | undefined
    if (depositName) {
      const depKey = depositName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      const depositId = `DEP-${depKey}`
      if (depositUnitIds.has(depositId)) {
        createEdge(unitId, depositId, 'drilled_at')
      }
    }
  }

  // 4. Tenements / Licenses (from GeoJSON — IDs already have LIC- prefix)
  const licGJ = loadGeoJSON('caldeira-licenses.geojson')
  for (const f of licGJ.features) {
    const props = f.properties
    const licId = props.id as string
    const center = featureCenter(f)
    createUnit({
      id: licId, typeId: 'tenement', label: (props.label ?? props.name ?? licId) as string,
      initialState: 'granted', placeId: licId,
      data: { license_id: licId, area_ha: ((props.area_km2 as number) ?? 0) * 100, holder: 'Meteoric Resources', coordinates: center },
    })
    createEdge('SITE-CALDEIRA', licId, 'holds')
  }
  // License → deposit edges
  for (const [licKey, depKey] of Object.entries(LICENSE_DEPOSIT_MAP)) {
    createEdge(licKey, `DEP-${depKey}`, 'covers')
  }

  // 5. Springs (from GeoJSON — 1,092)
  const springGJ = loadGeoJSON('hydro-springs.geojson')
  for (const f of springGJ.features) {
    const props = f.properties
    const springId = props.id as string
    const unitId = `SPR-${springId}`
    const center = featureCenter(f)
    createUnit({
      id: unitId, typeId: 'spring', label: (props.name ?? springId) as string,
      initialState: 'active', placeId: springId,
      data: { spring_id: springId, coordinates: center, basin: (props.municipio ?? '') as string },
    })
  }

  // 6. Piezometers (4)
  for (const p of PIEZOMETER_SENSORS) {
    const unitId = `PIZ-${p.sensor_id}`
    createUnit({
      id: unitId, typeId: 'piezometer', label: p.label,
      initialState: 'online', placeId: p.sensor_id,
      data: { sensor_id: p.sensor_id, coordinates: p.coords },
    })
  }

  // 7. Plant nodes (4 from CALDEIRA_GEO.pois)
  for (const [key, poi] of Object.entries(CALDEIRA_POIS)) {
    const unitId = `PLANT-${key}`
    createUnit({
      id: unitId, typeId: 'plant_node', label: poi.label,
      initialState: key === 'commercialPlant' ? 'planned' : 'operational', placeId: key,
      data: { name: poi.label, node_type: key, coordinates: poi.coords },
    })
    createEdge('SITE-CALDEIRA', unitId, 'contains')
  }

  // 8. Protected areas (3: APA Pedra Branca, APA Buffer, Environmental/UDC)
  const apaGJ = loadGeoJSON('caldeira-apa-pedra-branca.geojson')
  for (const f of apaGJ.features) {
    const props = f.properties
    createUnit({
      id: `PA-${props.id}`, typeId: 'protected_area', label: (props.label ?? 'APA Pedra Branca') as string,
      initialState: 'active', placeId: props.id as string,
      data: { name: props.label, designation: props.kind, area_ha: props.area_ha },
    })
  }
  const bufferGJ = loadGeoJSON('caldeira-apa-buffer.geojson')
  for (const f of bufferGJ.features) {
    const props = f.properties
    createUnit({
      id: `PA-${props.id}`, typeId: 'protected_area', label: (props.label ?? 'APA Buffer') as string,
      initialState: 'active', placeId: props.id as string,
      data: { name: props.label, designation: props.kind, area_ha: 0 },
    })
  }
  const envGJ = loadGeoJSON('caldeira-environmental.geojson')
  for (const f of envGJ.features) {
    const props = f.properties
    createUnit({
      id: `PA-${props.id}`, typeId: 'protected_area', label: (props.label ?? 'UDC Zone') as string,
      initialState: 'active', placeId: props.id as string,
      data: { name: props.label, designation: props.kind },
    })
  }

  // 9. Batches (4)
  for (const b of BATCHES) {
    const unitId = `BATCH-${b.batch_id}`
    const isDelivered = b.batch_id === 'BATCH-MREC-2A7'
    const isInTransit = b.batch_id === 'BATCH-MREC-4K1'
    const state = isDelivered ? 'delivered' : isInTransit ? 'in_transit' : 'certified'
    createUnit({
      id: unitId, typeId: 'batch', label: b.batch_id,
      initialState: state, placeId: b.batch_id,
      data: { batch_id: b.batch_id, tonnage_kg: b.tonnage_kg, feoc_percentage: b.feoc_percentage, ira_compliant: String(b.ira_compliant), carbon_intensity: b.carbon_intensity, destination: b.destination },
    })
    const licId = BATCH_LICENSE_MAP[b.batch_id]
    if (licId) createEdge(unitId, licId, 'sourced_from')
  }

  // 10. Conditions precedent (5)
  for (const cp of CONDITIONS_PRECEDENT) {
    const unitId = `CP-${cp.id}`
    createUnit({
      id: unitId, typeId: 'permit_condition', label: cp.description,
      initialState: cp.status, severity: cp.status === 'met' ? 'nominal' : 'attention',
      data: { cp_id: cp.id, description: cp.description, target_date: cp.target_date },
    })
  }

  // 11. Regulatory submissions (6)
  for (const r of REGULATORY_LOG) {
    const unitId = `REG-${r.id}`
    createUnit({
      id: unitId, typeId: 'regulatory_submission', label: `${r.body} — ${r.type}`,
      initialState: mapRegStatus(r.status), placeId: r.id,
      data: { reg_id: r.id, body: r.body, type: r.type, date: r.date, detail: r.detail },
    })
  }

  // 12. Risks (10)
  for (const r of RISKS) {
    const { state, severity } = mapRiskStatus(r.status)
    const unitId = `RISK-${r.id}`
    createUnit({
      id: unitId, typeId: 'risk', label: r.title,
      initialState: state, severity, owner: r.owner,
      data: { risk_id: r.id, title: r.title, category: r.category, likelihood: r.likelihood, impact: r.impact, score: r.score, mitigation: r.mitigation, owner: r.owner },
    })
    if (r.relatedRegulatoryIds) {
      for (const regId of r.relatedRegulatoryIds) {
        createEdge(unitId, `REG-${regId}`, 'affects')
      }
    }
  }

  // 13. Incidents (5)
  for (const inc of INCIDENT_LOG) {
    const unitId = `INC-${inc.id}`
    createUnit({
      id: unitId, typeId: 'incident', label: inc.title,
      initialState: 'resolved',
      data: { incident_id: inc.id, title: inc.title, severity: inc.severity, assignee: inc.assignee, sla_minutes: inc.sla_minutes },
    })
  }

  // 14. Offtakes (2)
  for (const o of OFFTAKERS) {
    const unitId = `OFT-${o.id}`
    createUnit({
      id: unitId, typeId: 'offtake', label: o.name,
      initialState: o.stage,
      data: { offtaker_name: o.name, location: o.location, volume_commitment: o.volume_commitment, product: o.product, delivery_schedule: o.delivery },
    })
  }

  // 15. Milestones — DFS workstreams (5) + drawdown schedule (7) = 12
  for (const ws of DFS_WORKSTREAMS) {
    const { state, severity } = mapMilestoneStatus(ws.status)
    const unitId = `MS-${ws.id}`
    createUnit({
      id: unitId, typeId: 'milestone', label: ws.name,
      initialState: state, severity,
      data: { name: ws.name, target_date: ws.target_date, lead: ws.lead, progress_pct: ws.progress_pct },
    })
  }
  for (let i = 0; i < DRAWDOWN_SCHEDULE.length; i++) {
    const dd = DRAWDOWN_SCHEDULE[i]
    const { state, severity } = mapMilestoneStatus(dd.status)
    const unitId = `MS-DD-${String(i + 1).padStart(2, '0')}`
    createUnit({
      id: unitId, typeId: 'milestone', label: dd.milestone,
      initialState: state, severity,
      data: { name: dd.milestone, target_date: dd.target_date },
    })
    if (dd.cp_ref) {
      createEdge(unitId, `CP-${dd.cp_ref}`, 'requires')
    }
  }

  // ── Cross-cutting edges ──

  // Batch → deposit (through license)
  for (const [batchId, licId] of Object.entries(BATCH_LICENSE_MAP)) {
    const depId = LICENSE_DEPOSIT_MAP[licId]
    if (depId) {
      createEdge(`BATCH-${batchId}`, `DEP-${depId}`, 'extracted_from')
    }
  }

  // Offtake → batch
  createEdge('OFT-ucore', 'BATCH-BATCH-MREC-8X9', 'receives')
  createEdge('OFT-ucore', 'BATCH-BATCH-MREC-2A7', 'receives')
  createEdge('OFT-neo', 'BATCH-BATCH-MREC-7W2', 'receives')

  // Risk R01 → condition CP-02 (LI), R04 → DFS milestones
  createEdge('RISK-R01', 'CP-CP-02', 'threatens')
  createEdge('RISK-R04', 'MS-DFS-01', 'threatens')
  createEdge('RISK-R04', 'MS-DFS-02', 'threatens')

  // Piezometers monitor protected areas
  createEdge('PIZ-PIZ-N01', 'PA-ENV-APA-01', 'monitors')
  createEdge('PIZ-PIZ-S02', 'PA-ENV-APA-01', 'monitors')

  // ── Maritime instance ──
  seedMaritimeUnits()

  const unitCount = getUnitCount()
  console.log(`[unit-seeder] Seeded ${unitCount} units.`)
}

/**
 * Atlantic Maritime instance — separate logical site, sharing the same
 * unit graph engine (states, transitions, evidence, audit chain). Any
 * cross-instance references are deliberately avoided; the maritime
 * subgraph is rooted at SITE-MARITIME.
 */
function seedMaritimeUnits(): void {
  // Site root
  createUnit({
    id: MARITIME_SITE_ID,
    typeId: 'site',
    label: MARITIME_SITE_LABEL,
    initialState: 'active',
    data: { projectName: MARITIME_SITE_LABEL, companyName: 'Atlantic Coast Maritime Authority', center: [-75.0, 37.5] },
  })

  // AOIs
  for (const aoi of MARITIME_AOI_SEEDS) {
    const initialState =
      aoi.classification === 'patrol' ? 'patrolling'
        : aoi.classification === 'restricted' ? 'restricted'
          : aoi.classification === 'commercial_lane' ? 'commercial'
            : 'environmental'
    createUnit({
      id: aoi.id,
      typeId: 'maritime_aoi',
      label: aoi.name,
      initialState,
      data: {
        aoi_id: aoi.id,
        classification: aoi.classification,
        description: aoi.description,
        assigned_assets: aoi.assignedAssets.join(', '),
        center: aoi.center,
      },
    })
    createEdge(MARITIME_SITE_ID, aoi.id, 'contains')
  }

  // Vessels
  for (const v of MARITIME_VESSEL_SEEDS) {
    createUnit({
      id: v.id,
      typeId: 'vessel',
      label: v.name,
      initialState: v.state,
      severity: v.state === 'dark' ? 'action_required' : 'nominal',
      data: {
        mmsi: v.mmsi,
        name: v.name,
        flag: v.flag,
        vessel_type: v.type,
        loa_m: v.loa_m,
        coordinates: v.coordinates,
      },
    })
    if (v.aoiId) createEdge(v.id, v.aoiId, 'within')
    // Forward edge from the maritime site so bundle traversal reaches vessels.
    createEdge(MARITIME_SITE_ID, v.id, 'tracks')
  }

  // Sensor stations
  for (const s of MARITIME_SENSOR_SEEDS) {
    createUnit({
      id: s.id,
      typeId: 'sensor_station',
      label: s.name,
      initialState: s.state,
      severity: s.state === 'nominal' ? 'nominal' : 'attention',
      data: {
        station_id: s.id,
        kind: s.kind,
        range_km: s.range_km,
        detail: s.detail,
        coordinates: s.coordinates,
      },
    })
    createEdge(MARITIME_SITE_ID, s.id, 'operates')
    for (const aoi of s.aoiIds) {
      createEdge(s.id, aoi, 'covers')
    }
  }

  // Incident alerts (dark-vessel events surface here)
  for (const inc of MARITIME_INCIDENT_SEEDS) {
    createUnit({
      id: inc.id,
      typeId: 'incident_alert',
      label: inc.title,
      initialState: inc.state,
      severity: inc.severity,
      data: {
        alert_id: inc.id,
        title: inc.title,
        severity: inc.severity,
        detected_at: inc.detected_at,
        aoi_id: inc.aoiId,
        vessel_id: inc.vesselId,
        coordinates: inc.coordinates,
      },
    })
    createEdge(inc.id, inc.vesselId, 'concerns')
    createEdge(inc.id, inc.aoiId, 'within')
    createEdge(MARITIME_SITE_ID, inc.id, 'records')
  }

  // ISR products link the alerts back to authority handoff
  for (const isr of MARITIME_ISR_PRODUCT_SEEDS) {
    createUnit({
      id: isr.id,
      typeId: 'isr_product',
      label: isr.subject,
      initialState: isr.state,
      severity: isr.state === 'ready' ? 'nominal' : 'attention',
      data: {
        product_id: isr.id,
        subject: isr.subject,
        classification_marking: isr.classification_marking,
        authored_by: isr.authored_by,
        authored_at: isr.authored_at,
      },
    })
    for (const vid of isr.vesselIds) {
      createEdge(isr.id, vid, 'documents')
    }
    if (isr.aoiId) createEdge(isr.id, isr.aoiId, 'documents')
    createEdge(MARITIME_SITE_ID, isr.id, 'publishes')
  }
}
