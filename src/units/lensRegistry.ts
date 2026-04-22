import type { Lens } from 'shared/units/types'

export const LENS_FIELD: Lens = {
  id: 'field',
  label: 'Field',
  unitTypes: ['site', 'deposit', 'drillhole', 'spring', 'piezometer', 'plant_node', 'protected_area'],
  // 1,092 spring markers swamp the default view; require explicit opt-in.
  defaultOffTypes: ['spring'],
  kpiMetrics: ['deposit.count', 'drillhole.count', 'spring.count', 'piezometer.online'],
}

export const LENS_COMPLIANCE: Lens = {
  id: 'compliance',
  label: 'Compliance',
  unitTypes: ['batch', 'tenement', 'permit_condition', 'regulatory_submission'],
  kpiMetrics: ['batch.count', 'permit_condition.met', 'regulatory_submission.approved'],
}

export const LENS_ENVIRONMENTAL: Lens = {
  id: 'environmental',
  label: 'Environmental',
  unitTypes: ['spring', 'piezometer', 'protected_area', 'incident'],
  severityFilter: ['attention', 'action_required', 'blocked'],
  kpiMetrics: ['spring.reduced', 'piezometer.warning', 'incident.triggered'],
}

export const LENS_EXECUTIVE: Lens = {
  id: 'executive',
  label: 'Executive',
  unitTypes: ['risk', 'milestone', 'offtake', 'permit_condition'],
  kpiMetrics: ['risk.open', 'milestone.at_risk', 'offtake.binding'],
}

export const LENS_BUYER: Lens = {
  id: 'buyer',
  label: 'Buyer Room',
  unitTypes: ['batch', 'deposit', 'tenement', 'offtake', 'plant_node'],
  kpiMetrics: ['batch.certified', 'batch.in_transit', 'offtake.binding'],
}

export const LENS_EVERYTHING: Lens = {
  id: 'everything',
  label: 'Everything',
  unitTypes: [
    'site', 'deposit', 'drillhole', 'tenement', 'spring', 'piezometer',
    'plant_node', 'protected_area', 'batch', 'permit_condition',
    'regulatory_submission', 'risk', 'incident', 'offtake', 'milestone',
  ],
  kpiMetrics: ['total.count', 'total.attention', 'total.action_required'],
}

export const ALL_LENSES: Lens[] = [
  LENS_FIELD,
  LENS_COMPLIANCE,
  LENS_ENVIRONMENTAL,
  LENS_EXECUTIVE,
  LENS_BUYER,
  LENS_EVERYTHING,
]

export function getLensById(id: string): Lens | undefined {
  return ALL_LENSES.find(l => l.id === id)
}
