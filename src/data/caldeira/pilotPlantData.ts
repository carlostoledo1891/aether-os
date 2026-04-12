/* ─── Caldeira Pilot Plant — Digital Twin Data ──────────────────────────── */
/* Single source of truth for the pilot plant control room.
 * Consolidated from: Meteoric ASX announcements, ANSTO pilot campaigns,
 * deep-research-report.md, caldeira_digital_twin.html, and
 * caldeira_pilot_plant_digital_twin.html.
 * Equipment tags follow the E-xxx convention from the BOM.               */

import type { PlantTelemetry } from '../../types/telemetry'

// ── Domain types ────────────────────────────────────────────────────────

export type EquipmentCategory =
  | 'feed'
  | 'leach'
  | 'separation'
  | 'utilities'
  | 'analytical'
  | 'control'

export type SensorType =
  | 'pH'
  | 'temperature'
  | 'flow'
  | 'level'
  | 'pressure'
  | 'conductivity'
  | 'turbidity'
  | 'ORP'
  | 'weight'
  | 'speed'

export type EquipmentStatus = 'running' | 'idle' | 'warning' | 'maintenance'

export interface PilotPlantSensor {
  id: string
  label: string
  type: SensorType
  unit: string
  range: [number, number]
  nominalValue: number
  equipmentTag: string
  /** Maps to a field path in PlantTelemetry when available */
  telemetryPath?: string
}

export interface PilotPlantEquipment {
  tag: string
  name: string
  category: EquipmentCategory
  capacity: string
  material: string
  manufacturer: string
  purpose: string
  sensors: string[]
  /** Upstream equipment tags */
  upstream: string[]
  /** Downstream equipment tags */
  downstream: string[]
  /** Normalised schematic position (0-1 range) */
  position: { x: number; y: number }
  processStep: number
  status: EquipmentStatus
}

export interface ProcessStep {
  step: number
  name: string
  shortName: string
  description: string
  reagents: string[]
  parameters: Record<string, string>
  equipmentTags: string[]
  domainColor: 'cyan' | 'violet' | 'green' | 'amber'
}

export interface PlantKPI {
  id: string
  label: string
  value: number | string
  unit: string
  target: string
  source: string
}

export interface PlantPersonnel {
  name: string
  role: string
  organization: string
}

export interface PlantPartner {
  name: string
  role: string
  ticker?: string
}

// ── Sensors ─────────────────────────────────────────────────────────────

export const PILOT_PLANT_SENSORS: PilotPlantSensor[] = [
  // Leach reactor sensors
  { id: 'S-201-pH', label: 'Leach pH', type: 'pH', unit: 'pH', range: [0, 14], nominalValue: 4.5, equipmentTag: 'E-201', telemetryPath: 'leaching_circuit.ph_level' },
  { id: 'S-201-T', label: 'Leach Temp', type: 'temperature', unit: '°C', range: [10, 50], nominalValue: 25, equipmentTag: 'E-201' },
  { id: 'S-201-ORP', label: 'Leach ORP', type: 'ORP', unit: 'mV', range: [-500, 500], nominalValue: 180, equipmentTag: 'E-201' },
  { id: 'S-201-L', label: 'Leach Level', type: 'level', unit: '%', range: [0, 100], nominalValue: 72, equipmentTag: 'E-201' },

  // Feed system sensors
  { id: 'S-101-W', label: 'Feed Rate', type: 'weight', unit: 'kg/h', range: [0, 50], nominalValue: 25, equipmentTag: 'E-101' },
  { id: 'S-102-SPD', label: 'Belt Speed', type: 'speed', unit: 'm/min', range: [0, 10], nominalValue: 3.2, equipmentTag: 'E-102' },

  // Trommel / scrubber
  { id: 'S-103-F', label: 'Wash Flow', type: 'flow', unit: 'L/min', range: [0, 100], nominalValue: 45, equipmentTag: 'E-103' },
  { id: 'S-103-T', label: 'Scrubber Temp', type: 'temperature', unit: '°C', range: [10, 50], nominalValue: 24, equipmentTag: 'E-103' },

  // Clay filter (DrM)
  { id: 'S-202-P', label: 'Filter ΔP', type: 'pressure', unit: 'bar', range: [0, 6], nominalValue: 2.4, equipmentTag: 'E-202' },
  { id: 'S-202-F', label: 'Filtrate Flow', type: 'flow', unit: 'L/min', range: [0, 50], nominalValue: 18, equipmentTag: 'E-202' },
  { id: 'S-202-TB', label: 'Filtrate Clarity', type: 'turbidity', unit: 'NTU', range: [0, 100], nominalValue: 8, equipmentTag: 'E-202' },

  // Precipitation reactor
  { id: 'S-301-pH', label: 'Precip pH', type: 'pH', unit: 'pH', range: [0, 14], nominalValue: 8.5, equipmentTag: 'E-301' },
  { id: 'S-301-T', label: 'Precip Temp', type: 'temperature', unit: '°C', range: [10, 50], nominalValue: 26, equipmentTag: 'E-301' },
  { id: 'S-301-L', label: 'Precip Level', type: 'level', unit: '%', range: [0, 100], nominalValue: 65, equipmentTag: 'E-301' },
  { id: 'S-301-CD', label: 'Conductivity', type: 'conductivity', unit: 'mS/cm', range: [0, 50], nominalValue: 12.4, equipmentTag: 'E-301' },

  // MREC filter
  { id: 'S-302-P', label: 'Press ΔP', type: 'pressure', unit: 'bar', range: [0, 10], nominalValue: 3.8, equipmentTag: 'E-302' },

  // Reagent dosing
  { id: 'S-402-F1', label: 'AMSUL Dose', type: 'flow', unit: 'mL/min', range: [0, 200], nominalValue: 85, equipmentTag: 'E-402', telemetryPath: 'leaching_circuit.ammonium_sulfate_ml_min' },
  { id: 'S-402-F2', label: 'Na₂CO₃ Dose', type: 'flow', unit: 'mL/min', range: [0, 100], nominalValue: 32, equipmentTag: 'E-402' },
  { id: 'S-402-F3', label: 'Acid Dose', type: 'flow', unit: 'mL/min', range: [0, 50], nominalValue: 12, equipmentTag: 'E-402' },

  // Pumps
  { id: 'S-401-F', label: 'Slurry Flow', type: 'flow', unit: 'm³/h', range: [0, 20], nominalValue: 8.2, equipmentTag: 'E-401', telemetryPath: 'flow_metrics.in_liters_sec' },
  { id: 'S-401-P', label: 'Pump Pressure', type: 'pressure', unit: 'bar', range: [0, 6], nominalValue: 2.1, equipmentTag: 'E-401' },

  // CCD thickener (inferred)
  { id: 'S-203-L', label: 'Thickener Level', type: 'level', unit: '%', range: [0, 100], nominalValue: 58, equipmentTag: 'E-203' },
  { id: 'S-203-TB', label: 'Overflow Clarity', type: 'turbidity', unit: 'NTU', range: [0, 200], nominalValue: 15, equipmentTag: 'E-203' },

  // Water treatment
  { id: 'S-501-F', label: 'Recycle Flow', type: 'flow', unit: 'L/min', range: [0, 100], nominalValue: 42, equipmentTag: 'E-501' },
  { id: 'S-501-CD', label: 'Effluent Cond.', type: 'conductivity', unit: 'mS/cm', range: [0, 50], nominalValue: 5.6, equipmentTag: 'E-501' },

  // AMSUL recovery
  { id: 'S-502-CD', label: 'Brine Conc.', type: 'conductivity', unit: 'mS/cm', range: [0, 100], nominalValue: 38, equipmentTag: 'E-502' },

  // Impurity removal (inferred)
  { id: 'S-204-pH', label: 'Impurity pH', type: 'pH', unit: 'pH', range: [0, 14], nominalValue: 6.2, equipmentTag: 'E-204' },
  { id: 'S-204-T', label: 'Impurity Temp', type: 'temperature', unit: '°C', range: [10, 50], nominalValue: 25, equipmentTag: 'E-204' },

  // PLC / SCADA
  { id: 'S-601-PWR', label: 'PLC Load', type: 'level', unit: '%', range: [0, 100], nominalValue: 34, equipmentTag: 'E-601' },
]

// ── Equipment BOM ───────────────────────────────────────────────────────

export const PILOT_PLANT_EQUIPMENT: PilotPlantEquipment[] = [
  // ── Feed preparation (Step 1) ──
  {
    tag: 'E-101', name: 'Ore Hopper & Feeder', category: 'feed',
    capacity: '~1 tonne buffer', material: 'Carbon steel',
    manufacturer: 'Custom (unspecified)',
    purpose: 'Stores ROM ionic clay ore, meters it onto belt conveyor via vibratory feeder',
    sensors: ['S-101-W'],
    upstream: [], downstream: ['E-102'],
    position: { x: 0.05, y: 0.18 }, processStep: 1, status: 'running',
  },
  {
    tag: 'E-102', name: 'Belt Conveyor', category: 'feed',
    capacity: '25 kg/h feed rate', material: 'Steel frame, rubber belt',
    manufacturer: 'Standard industrial',
    purpose: 'Transfers ore from hopper to trommel scrubber',
    sensors: ['S-102-SPD'],
    upstream: ['E-101'], downstream: ['E-103'],
    position: { x: 0.18, y: 0.18 }, processStep: 1, status: 'running',
  },
  {
    tag: 'E-103', name: 'Rotary Trommel Scrubber', category: 'feed',
    capacity: '25 kg/h', material: 'Stainless steel drum',
    manufacturer: 'Custom steel drum',
    purpose: 'Wet-scrubs and disaggregates clay lumps; removes coarse rock fragments, passes clay fraction',
    sensors: ['S-103-F', 'S-103-T'],
    upstream: ['E-102'], downstream: ['E-201'],
    position: { x: 0.32, y: 0.18 }, processStep: 1, status: 'running',
  },

  // ── Leaching (Step 2) ──
  {
    tag: 'E-201', name: 'Leach Reactor', category: 'leach',
    capacity: '500–1000 L', material: 'SS 304 with stirrer',
    manufacturer: 'Lab stirred reactor',
    purpose: 'AMSUL ion-exchange leaching at pH 4.5–5.0, ambient T&P, 30-min residence time',
    sensors: ['S-201-pH', 'S-201-T', 'S-201-ORP', 'S-201-L'],
    upstream: ['E-103', 'E-402'], downstream: ['E-202'],
    position: { x: 0.32, y: 0.38 }, processStep: 2, status: 'running',
  },

  // ── Solid-liquid separation (Step 3) ──
  {
    tag: 'E-202', name: 'Clay Filter (DrM Candle)', category: 'separation',
    capacity: '~600 kg/h solids', material: 'Steel vessel, filter candles',
    manufacturer: 'DrM TSD XL (confirmed)',
    purpose: 'Filters spent clay slurry from leach — primary solid-liquid separation',
    sensors: ['S-202-P', 'S-202-F', 'S-202-TB'],
    upstream: ['E-201'], downstream: ['E-203', 'E-303'],
    position: { x: 0.32, y: 0.55 }, processStep: 3, status: 'running',
  },
  {
    tag: 'E-203', name: 'CCD Thickener Train', category: 'separation',
    capacity: 'Multi-stage', material: 'Steel thickeners',
    manufacturer: 'Inferred — standard design',
    purpose: 'Counter-current decantation; maximises REE extraction to PLS, minimises wash water',
    sensors: ['S-203-L', 'S-203-TB'],
    upstream: ['E-202'], downstream: ['E-204'],
    position: { x: 0.50, y: 0.55 }, processStep: 3, status: 'running',
  },

  // ── Impurity removal (Step 4) ──
  {
    tag: 'E-204', name: 'Impurity Removal Vessel', category: 'separation',
    capacity: '~500 L', material: 'HDPE or SS',
    manufacturer: 'Industrial mixing vessel',
    purpose: 'pH-controlled selective precipitation of Fe, Al, Mn impurities from PLS',
    sensors: ['S-204-pH', 'S-204-T'],
    upstream: ['E-203'], downstream: ['E-301'],
    position: { x: 0.68, y: 0.55 }, processStep: 4, status: 'running',
  },

  // ── MREC precipitation (Step 5) ──
  {
    tag: 'E-301', name: 'MREC Precipitation Reactor', category: 'separation',
    capacity: '~500 L', material: 'HDPE or SS tank',
    manufacturer: 'Industrial mixing tank',
    purpose: 'Carbonate addition to precipitate Mixed Rare Earth Carbonate from purified PLS',
    sensors: ['S-301-pH', 'S-301-T', 'S-301-L', 'S-301-CD'],
    upstream: ['E-204', 'E-402'], downstream: ['E-302'],
    position: { x: 0.68, y: 0.38 }, processStep: 5, status: 'running',
  },
  {
    tag: 'E-302', name: 'MREC Filter Press', category: 'separation',
    capacity: '~25 kg/h solids', material: 'Steel frame',
    manufacturer: 'Filter press or bag filter',
    purpose: 'Collects MREC solids; dewatering to produce dry cake for bagging and assay',
    sensors: ['S-302-P'],
    upstream: ['E-301'], downstream: ['E-501'],
    position: { x: 0.68, y: 0.20 }, processStep: 5, status: 'running',
  },

  // ── Spent clay dewatering (Step 6) ──
  {
    tag: 'E-303', name: 'Spent Clay Dewatering', category: 'separation',
    capacity: 'Multi-technology test', material: 'Steel / various',
    manufacturer: 'Pressure filter, centrifuge, vacuum filter (parallel evaluation)',
    purpose: 'Dewater CCD underflow; produces dry stackable filter cake for pit backfill',
    sensors: [],
    upstream: ['E-202'], downstream: [],
    position: { x: 0.15, y: 0.70 }, processStep: 6, status: 'running',
  },

  // ── Water & AMSUL recovery (Step 7) ──
  {
    tag: 'E-501', name: 'Water Treatment Circuit', category: 'utilities',
    capacity: '~85% recovery', material: 'Various',
    manufacturer: 'Standard water treatment',
    purpose: 'Recovers ~85% process water; splits into clean stream + AMSUL-rich brine for recycle',
    sensors: ['S-501-F', 'S-501-CD'],
    upstream: ['E-302'], downstream: ['E-502'],
    position: { x: 0.88, y: 0.38 }, processStep: 7, status: 'running',
  },
  {
    tag: 'E-502', name: 'AMSUL Recovery System', category: 'utilities',
    capacity: '~90% AMSUL reuse', material: 'Various',
    manufacturer: 'Reagent recovery unit',
    purpose: 'Captures ~90% ammonium sulfate from water treatment brine for leach circuit reuse',
    sensors: ['S-502-CD'],
    upstream: ['E-501'], downstream: ['E-201'],
    position: { x: 0.88, y: 0.55 }, processStep: 7, status: 'running',
  },

  // ── Pumps & reagents ──
  {
    tag: 'E-401', name: 'Slurry Transfer Pumps', category: 'utilities',
    capacity: '5–20 m³/h', material: 'Plastic / SS impeller',
    manufacturer: 'Centrifugal (Netzsch / Verder class)',
    purpose: 'Move slurries between units — leach to filter, filter to thickener, etc.',
    sensors: ['S-401-F', 'S-401-P'],
    upstream: [], downstream: [],
    position: { x: 0.50, y: 0.78 }, processStep: 2, status: 'running',
  },
  {
    tag: 'E-402', name: 'Reagent Dosing System', category: 'utilities',
    capacity: '10–50 L/h per pump', material: 'Peristaltic metering pumps',
    manufacturer: 'Standard peristaltic dosing',
    purpose: 'Meters (NH₄)₂SO₄ to leach, Na₂CO₃ to precip, acid/base for pH control',
    sensors: ['S-402-F1', 'S-402-F2', 'S-402-F3'],
    upstream: [], downstream: ['E-201', 'E-301'],
    position: { x: 0.12, y: 0.38 }, processStep: 2, status: 'running',
  },

  // ── Control ──
  {
    tag: 'E-601', name: 'PLC Cabinet', category: 'control',
    capacity: '24 Vdc control', material: 'Painted steel enclosure',
    manufacturer: 'Siemens S7-1200 (inferred)',
    purpose: 'Central process control — pumps, valves, sensors, reagent dosing logic',
    sensors: ['S-601-PWR'],
    upstream: [], downstream: [],
    position: { x: 0.88, y: 0.78 }, processStep: 0, status: 'running',
  },
  {
    tag: 'E-602', name: 'HMI / SCADA Workstation', category: 'control',
    capacity: 'PC + monitor', material: 'Electronics',
    manufacturer: 'Siemens / Allen-Bradley (inferred)',
    purpose: 'Operator interface for monitoring and controlling all process loops',
    sensors: [],
    upstream: [], downstream: [],
    position: { x: 0.88, y: 0.88 }, processStep: 0, status: 'running',
  },

  // ── Analytical (off-site context) ──
  {
    tag: 'E-701', name: 'SGS Geosol Laboratory', category: 'analytical',
    capacity: 'ISO/IEC 17025', material: 'Off-site facility',
    manufacturer: 'SGS Geosol, Belo Horizonte',
    purpose: 'All pilot plant samples assayed here — REE by ICP-MS/ICP-OES, LOI, sulfate',
    sensors: [],
    upstream: [], downstream: [],
    position: { x: 0.05, y: 0.88 }, processStep: 0, status: 'idle',
  },
]

// ── Process steps ───────────────────────────────────────────────────────

export const PROCESS_STEPS: ProcessStep[] = [
  {
    step: 1,
    name: 'Feed Preparation — Scrubbing & Screening',
    shortName: 'Feed Prep',
    description: 'ROM ionic clay ore (Capão do Mel + Soberbo blend) is introduced via ore feed conveyor, trommel screen, and attrition scrubber to disaggregate clay particles. Head grade 4,000–5,000 ppm TREE.',
    reagents: ['Water (wash)'],
    parameters: { 'Feed rate': '25 kg/h', 'Head grade': '4,000–5,000 ppm TREE', 'Mining method': 'Free-dig' },
    equipmentTags: ['E-101', 'E-102', 'E-103'],
    domainColor: 'cyan',
  },
  {
    step: 2,
    name: 'AMSUL Leaching — Ion Exchange Desorption',
    shortName: 'Leaching',
    description: 'Ion exchange desorption using (NH₄)₂SO₄ lixiviant at pH 4.5–5.0, ambient temperature and pressure. 30-min contact time. REEs displaced into pregnant leach solution.',
    reagents: ['(NH₄)₂SO₄ (ammonium sulfate)', 'H₂SO₄ (pH adjustment)'],
    parameters: { pH: '4.5–5.0', Temperature: 'Ambient', Pressure: 'Ambient', 'Contact time': '30 min', 'L/S ratio': '4–5:1' },
    equipmentTags: ['E-201', 'E-402'],
    domainColor: 'cyan',
  },
  {
    step: 3,
    name: 'Counter-Current Decantation (CCD)',
    shortName: 'CCD',
    description: 'Multi-stage thickener train performing solid-liquid separation. Separates REE-enriched PLS from spent clay solids. Counter-current arrangement maximises extraction.',
    reagents: [],
    parameters: { Stages: 'Multiple', 'Key output': 'REE-laden PLS' },
    equipmentTags: ['E-202', 'E-203'],
    domainColor: 'violet',
  },
  {
    step: 4,
    name: 'Impurity Removal Circuit',
    shortName: 'Impurity Removal',
    description: 'pH adjustment to selectively precipitate and remove non-REE metals (Fe, Al, Mn) from PLS prior to MREC precipitation. Produces clean REE-bearing solution.',
    reagents: ['Acid (pH modifier)'],
    parameters: { Target: '<2% impurities in final MREC', Method: 'Selective precipitation' },
    equipmentTags: ['E-204'],
    domainColor: 'violet',
  },
  {
    step: 5,
    name: 'MREC Precipitation & Dewatering',
    shortName: 'MREC Precip',
    description: 'pH-controlled precipitation of mixed rare earth carbonate. White MREC cake (~20 cm bed) forms in thickener. Dewatered to ~2 kg/day dry product.',
    reagents: ['Na₂CO₃ (sodium carbonate)'],
    parameters: { 'Output': '~2 kg/day', 'Product': '32.7% MREO', 'DyTb oxides': '1%', 'Impurities': '<2.3%' },
    equipmentTags: ['E-301', 'E-302'],
    domainColor: 'green',
  },
  {
    step: 6,
    name: 'Spent Clay Filtration & Dewatering',
    shortName: 'Clay Dewater',
    description: 'CCD underflow dewatered using pressure filtration, centrifugation, and vacuum filtration tested in parallel. Produces dry stackable filter cake for pit backfill. No tailings dam.',
    reagents: [],
    parameters: { Technologies: 'Pressure / centrifuge / vacuum (parallel)', Output: 'Dry stackable cake' },
    equipmentTags: ['E-303'],
    domainColor: 'amber',
  },
  {
    step: 7,
    name: 'Water Treatment & AMSUL Recovery',
    shortName: 'Water/AMSUL',
    description: 'Closed-loop reagent management. ~85% process water recovered and recycled. ~90% ammonium sulfate captured from brine for leach reuse. 100% recovery at commissioning.',
    reagents: [],
    parameters: { 'Water recovery': '~85%', 'AMSUL recovery': '~90%', 'At commissioning': '100% water recovered' },
    equipmentTags: ['E-501', 'E-502'],
    domainColor: 'amber',
  },
]

// ── Flow connections (SVG edge definitions) ─────────────────────────────

export interface FlowConnection {
  id: string
  from: string
  to: string
  variant: 'process' | 'reagent' | 'recycle' | 'product' | 'waste'
  label?: string
}

export const FLOW_CONNECTIONS: FlowConnection[] = [
  // Main process chain
  { id: 'F-001', from: 'E-101', to: 'E-102', variant: 'process', label: 'ROM clay' },
  { id: 'F-002', from: 'E-102', to: 'E-103', variant: 'process', label: 'Feed' },
  { id: 'F-003', from: 'E-103', to: 'E-201', variant: 'process', label: 'Clay slurry' },
  { id: 'F-004', from: 'E-201', to: 'E-202', variant: 'process', label: 'Leached slurry' },
  { id: 'F-005', from: 'E-202', to: 'E-203', variant: 'process', label: 'PLS' },
  { id: 'F-006', from: 'E-203', to: 'E-204', variant: 'process', label: 'PLS (clarified)' },
  { id: 'F-007', from: 'E-204', to: 'E-301', variant: 'process', label: 'Clean PLS' },
  { id: 'F-008', from: 'E-301', to: 'E-302', variant: 'process', label: 'MREC slurry' },

  // Reagent feeds
  { id: 'F-010', from: 'E-402', to: 'E-201', variant: 'reagent', label: 'AMSUL' },
  { id: 'F-011', from: 'E-402', to: 'E-301', variant: 'reagent', label: 'Na₂CO₃' },

  // Product output
  { id: 'F-020', from: 'E-302', to: 'E-501', variant: 'product', label: 'Mother liquor' },

  // Waste / spent clay
  { id: 'F-030', from: 'E-202', to: 'E-303', variant: 'waste', label: 'Spent clay' },

  // Recycle loop
  { id: 'F-040', from: 'E-501', to: 'E-502', variant: 'recycle', label: 'AMSUL brine' },
  { id: 'F-041', from: 'E-502', to: 'E-201', variant: 'recycle', label: 'Recycled AMSUL' },
]

// ── KPIs ────────────────────────────────────────────────────────────────

export const PLANT_KPIS: PlantKPI[] = [
  { id: 'kpi-throughput', label: 'Ore Throughput', value: 25, unit: 'kg/h', target: '25 kg/h nameplate', source: 'Meteoric ASX' },
  { id: 'kpi-mrec', label: 'MREC Output', value: 2.6, unit: 'kg/day', target: '~2.0 kg/day nameplate', source: 'Feb 2026 ASX' },
  { id: 'kpi-recovery', label: 'Magnet REE Recovery', value: 70, unit: '%', target: '70% avg', source: 'ANSTO validation' },
  { id: 'kpi-mreo', label: 'MREO Grade', value: 32.7, unit: '%', target: '32.7% MREO', source: 'SGS Geosol assay' },
  { id: 'kpi-water', label: 'Water Recycle', value: 85, unit: '%', target: '~85% recovered', source: 'Commissioning data' },
  { id: 'kpi-amsul', label: 'AMSUL Recovery', value: 90, unit: '%', target: '~90% reuse', source: 'Commissioning data' },
  { id: 'kpi-impurity', label: 'Impurities', value: '<2.3', unit: '%', target: '<2.3% (ANSTO aligned)', source: 'SGS Geosol' },
]

// ── Element recoveries ─────────────────────────────────────────────────

export interface ElementRecovery {
  element: string
  symbol: string
  pilotPct: number
  anstoPct: number
  role: 'magnet' | 'heavy' | 'light'
}

export const ELEMENT_RECOVERIES: ElementRecovery[] = [
  { element: 'Neodymium', symbol: 'Nd', pilotPct: 70, anstoPct: 70, role: 'magnet' },
  { element: 'Praseodymium', symbol: 'Pr', pilotPct: 71, anstoPct: 71, role: 'magnet' },
  { element: 'Dysprosium', symbol: 'Dy', pilotPct: 56, anstoPct: 49, role: 'heavy' },
  { element: 'Terbium', symbol: 'Tb', pilotPct: 61, anstoPct: 57, role: 'heavy' },
]

// ── Personnel ───────────────────────────────────────────────────────────

export const PLANT_PERSONNEL: PlantPersonnel[] = [
  { name: 'Stuart Gale', role: 'Managing Director / CEO', organization: 'Meteoric Resources NL' },
  { name: 'Dr. Marcelo do Carvalho', role: 'Executive Director (Competent Person)', organization: 'Meteoric Resources NL' },
  { name: 'Tony Hadley', role: 'Metallurgy Lead (Competent Person)', organization: 'Meteoric Resources NL' },
]

// ── Partners ────────────────────────────────────────────────────────────

export const PLANT_PARTNERS: PlantPartner[] = [
  { name: 'ANSTO', role: 'Metallurgical testwork & flowsheet development' },
  { name: 'Ausenco Pty Ltd', role: 'PFS / DFS engineering lead' },
  { name: 'SGS Geosol', role: 'Analytical laboratory (ISO/IEC 17025)' },
  { name: 'Metallium Ltd', role: 'Downstream separation partner', ticker: 'ASX: MTM' },
  { name: 'Ucore Rare Metals', role: 'SX separation + offtake MOU', ticker: 'TSXV: UCU' },
  { name: 'Neo Performance Materials', role: 'Offtake MOU — 3,000 MT TREO/yr', ticker: 'TSX: NEO' },
  { name: 'CEMIG', role: 'Power supply — 100% renewable grid' },
  { name: 'Export Finance Australia', role: 'Up to A$70 M funding support' },
  { name: 'US EXIM Bank', role: 'US$350 M funding support' },
]

// ── Facility info ───────────────────────────────────────────────────────

export const FACILITY_INFO = {
  name: 'Innovation & Research Center',
  city: 'Poços de Caldas',
  state: 'Minas Gerais, Brazil',
  operator: 'Meteoric Resources NL',
  ticker: 'ASX: MEI',
  operational_since: '2025-12-10',
  official_opening: '2025-12-15',
  licence_granted: '2025-09-01',
  capex: 'A$2 million',
  annual_target: '~500 kg MREC/year',
  energy: 'CEMIG — 100% renewable (hydro, solar, wind)',
  regulator: 'SEMAD (Minas Gerais)',
  tailings: 'None — dry stack backfill',
  coordinates: { lat: -21.7878, lng: -46.5608 },
} as const

// ── Helpers ─────────────────────────────────────────────────────────────

export function getSensorById(id: string): PilotPlantSensor | undefined {
  return PILOT_PLANT_SENSORS.find(s => s.id === id)
}

export function getEquipmentByTag(tag: string): PilotPlantEquipment | undefined {
  return PILOT_PLANT_EQUIPMENT.find(e => e.tag === tag)
}

export function getSensorsForEquipment(tag: string): PilotPlantSensor[] {
  return PILOT_PLANT_SENSORS.filter(s => s.equipmentTag === tag)
}

export function getStepForEquipment(tag: string): ProcessStep | undefined {
  return PROCESS_STEPS.find(s => s.equipmentTags.includes(tag))
}

/** Resolve a dotted telemetry path like 'leaching_circuit.ph_level' */
export function resolveTelemetryValue(plant: PlantTelemetry, path: string): number | undefined {
  const parts = path.split('.')
  let current: unknown = plant
  for (const part of parts) {
    if (current == null || typeof current !== 'object') return undefined
    current = (current as Record<string, unknown>)[part]
  }
  return typeof current === 'number' ? current : undefined
}

/** Get a simulated sensor value — prefers live telemetry, falls back to nominal + drift */
export function getSensorValue(sensor: PilotPlantSensor, plant: PlantTelemetry): number {
  if (sensor.telemetryPath) {
    const live = resolveTelemetryValue(plant, sensor.telemetryPath)
    if (live !== undefined) return live
  }
  const drift = (Math.random() - 0.5) * 0.04 * sensor.nominalValue
  return Math.max(sensor.range[0], Math.min(sensor.range[1], sensor.nominalValue + drift))
}

export function getCategoryColor(cat: EquipmentCategory): 'cyan' | 'violet' | 'green' | 'amber' {
  switch (cat) {
    case 'feed': return 'cyan'
    case 'leach': return 'cyan'
    case 'separation': return 'violet'
    case 'utilities': return 'amber'
    case 'analytical': return 'green'
    case 'control': return 'violet'
  }
}

export const CATEGORY_LABELS: Record<EquipmentCategory, string> = {
  feed: 'Feed & Prep',
  leach: 'Leaching',
  separation: 'Separation',
  utilities: 'Utilities',
  analytical: 'Analytical',
  control: 'Control',
}
