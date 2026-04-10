import {
  Activity, FlaskConical, Droplets, Zap, Gauge, ArrowRight,
} from 'lucide-react'
import { W } from '../../app/canvas/canvasTheme'

export type MapTab = 'operations' | 'environment'

export const LICENSE_COLORS = {
  verified: W.green,
  active:   W.violet,
  pending:  W.border3,
} as const

export const LICENSE_ITEMS = [
  { label: 'LP', full: 'Preliminary License',  sub: 'Approved Dec 2025',            status: 'verified' as const },
  { label: 'LI', full: 'Installation License', sub: 'Application 2026 · in prep',   status: 'active'   as const },
  { label: 'LO', full: 'Operating License',    sub: 'Target 2028 (pre-production)',  status: 'pending'  as const },
] as const

export const CHAIN_STEPS = [
  { id: 'MINE-A', label: 'Excavation',    sub: 'Free-dig · IAC Clay',                icon: Activity,    domain: 'extraction' as const },
  { id: 'LEACH',  label: 'Leach Circuit', sub: '(NH₄)₂SO₄ provenance tracked',      icon: FlaskConical, domain: 'processing' as const },
  { id: 'PREC',   label: 'Precipitation', sub: 'MREC · >90% TREO',                  icon: Droplets,    domain: 'processing' as const },
  { id: 'FJH',    label: 'FJH Separation', sub: '87% energy savings',               icon: Zap,         domain: 'processing' as const },
  { id: 'QA',     label: 'Risk / QA',      sub: 'Permit + passport evidence',        icon: Gauge,       domain: 'compliance' as const },
  { id: 'EXPORT', label: 'Export Handoff', sub: 'API-ready -> Santos -> offtaker',   icon: ArrowRight,  domain: 'transport'  as const },
] as const

export const DOMAIN_COLOR: Record<string, string> = {
  extraction: W.cyan,
  processing: W.violet,
  compliance: W.green,
  transport:  W.violetSoft,
}

export const TAB_COLOR: Record<MapTab, string> = {
  operations:  W.violet,
  environment: W.cyan,
}

export function phVariant(ph: number): 'green' | 'amber' | 'red' {
  if (ph >= 4.0 && ph <= 5.0) return 'green'
  if (ph < 3.8 || ph > 5.3) return 'red'
  return 'amber'
}

// TODO: LICENSE_ZONES and LICENSE_ITEMS should eventually be derived from the
// regulatory GeoJSON / data service rather than maintained as static constants.
export const LICENSE_ZONES = [
  { id: 'southern-lp', name: 'Southern LP Zone', label: 'Capão do Mel · Soberbo · Figueira', status: 'lp_approved' as const, area: 67, count: 21, note: 'LP approved Dec 2025 without restriction. Allows progression to LI application.' },
  { id: 'southern-acquired', name: 'Acquired Licences', label: '21 new licences · consolidated south', status: 'li_pending' as const, area: 49, count: 21, note: 'Acquired Dec 2025. Consolidates 67 km² contiguous area. Barra do Pacu included.' },
  { id: 'northern-licences', name: 'Northern Licences', label: 'Dona Maria 1&2 · Cupim Vermelho Norte', status: 'exploration' as const, area: 80, count: 35, note: '566 Mt @ 2,200 ppm TREO. Near-term northern operations potential.' },
] as const

export const PLANT_NODE_SPECS: Record<string, { hardware: string; spec: string; threshold?: string; frequency: string }> = {
  'MINE-A': { hardware: 'GPS-tracked excavator fleet', spec: 'Free-dig IAC clay · no drill-and-blast', frequency: 'Continuous GPS telemetry' },
  'MINE-B': { hardware: 'Secondary excavation front', spec: 'Redundant block feed capacity', frequency: 'Continuous GPS telemetry' },
  'LEACH':  { hardware: 'Industrial pH & ORP probes', spec: 'Dropped into leaching vats', threshold: 'pH 4.0–5.0 · alert <3.9 or >5.1', frequency: '2s polling interval' },
  'PREC':   { hardware: 'Inline turbidity + temperature', spec: 'MREC precipitation stage', threshold: '>90% TREO grade required', frequency: '2s polling interval' },
  'CIP':    { hardware: 'Ultrasonic flow meters', spec: 'Clamp-on exterior of intake/outflow pipes', threshold: '95% recirculation target · alert <94%', frequency: '2s polling interval' },
  'FJH':    { hardware: 'Power meter + thermal camera', spec: 'Flash Joule Heating separation', threshold: '87% energy savings vs traditional SX', frequency: '2s polling interval' },
  'QA':     { hardware: 'Inline XRF analyzer', spec: 'X-ray fluorescence at MREC output', threshold: '>90% TREO grade for certification', frequency: 'Per-batch analysis' },
  'EXPORT': { hardware: 'RFID container tracking', spec: 'Port of Santos rail connection', frequency: 'Event-driven GPS updates' },
  'UDC':    { hardware: 'Scintillation detector array', spec: 'Legacy UDC site radiation monitoring', threshold: '<0.18 μSv/h background limit', frequency: '10s polling interval' },
  'RAPTOR': { hardware: 'N/A — competitor reference', spec: 'Raptor Technologies facility marker', frequency: 'Static' },
  'VIRIDIS':{ hardware: 'N/A — competitor reference', spec: 'Viridis Mining facility marker', frequency: 'Static' },
}

export const HYDRO_NODE_SPECS: Record<string, { hardware: string; spec: string; compliance: string }> = {
  'PIZ-N01': { hardware: 'Telemetry piezometer', spec: 'Vibrating-wire pressure transducer · 0–35m range', compliance: 'FEAM groundwater monitoring requirement' },
  'PIZ-C02': { hardware: 'Telemetry piezometer', spec: 'Vibrating-wire pressure transducer · 0–35m range', compliance: 'FEAM groundwater monitoring requirement' },
  'PIZ-S03': { hardware: 'Telemetry piezometer', spec: 'Vibrating-wire pressure transducer · 0–35m range', compliance: 'FEAM groundwater monitoring requirement' },
  'PIZ-E04': { hardware: 'Telemetry piezometer', spec: 'Vibrating-wire pressure transducer · 0–35m range', compliance: 'FEAM groundwater monitoring requirement' },
  'UDC':     { hardware: 'Scintillation detector', spec: 'Continuous gamma radiation survey · INB/CNEN mandated', compliance: 'INB/CNEN radiation monitoring' },
  'MINE-A':  { hardware: 'Ion-selective electrode array', spec: 'Wastewater discharge monitoring · nitrate + sulfate', compliance: 'FEAM discharge permit conditions' },
  'PLANT':   { hardware: 'Process water quality station', spec: 'pH + conductivity + turbidity · inline continuous', compliance: 'Pilot plant operating permit' },
}
