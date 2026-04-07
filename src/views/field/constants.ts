import {
  Activity, FlaskConical, Droplets, Zap, Gauge, ArrowRight,
} from 'lucide-react'
import { W } from '../../app/canvas/canvasTheme'

export type MapTab = 'operations' | 'geology' | 'licenses' | 'environment'

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
  geology:     W.amber,
  licenses:    W.green,
  environment: W.cyan,
}

export function phVariant(ph: number): 'green' | 'amber' | 'red' {
  if (ph >= 4.0 && ph <= 5.0) return 'green'
  if (ph < 3.8 || ph > 5.3) return 'red'
  return 'amber'
}

export const LICENSE_ZONES = [
  { id: 'southern-lp', name: 'Southern LP Zone', label: 'Capão do Mel · Soberbo · Figueira', status: 'lp_approved' as const, area: 67, count: 21, note: 'LP approved Dec 2025 without restriction. Allows progression to LI application.' },
  { id: 'southern-acquired', name: 'Acquired Licences', label: '21 new licences · consolidated south', status: 'li_pending' as const, area: 49, count: 21, note: 'Acquired Dec 2025. Consolidates 67 km² contiguous area. Barra do Pacu included.' },
  { id: 'northern-licences', name: 'Northern Licences', label: 'Dona Maria 1&2 · Cupim Vermelho Norte', status: 'exploration' as const, area: 80, count: 35, note: '566 Mt @ 2,200 ppm TREO. Near-term northern operations potential.' },
] as const
