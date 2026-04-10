import type { RiskItem, IncidentRecord } from '../../services/dataService'
import { SPRING_COUNT } from './thresholds'

export const RISKS: RiskItem[] = [
  {
    id: 'R01',
    title: 'MPF cumulative EIA objection blocks LI',
    category: 'permitting',
    likelihood: 3,
    impact: 5,
    score: 15,
    mitigation: `Hydro digital twin + ${SPRING_COUNT} spring reference points (public FBDS/CAR geometry) + illustrative monitoring narrative for permitting dialogue.`,
    status: 'mitigating',
    owner: 'VP Environment',
    relatedRegulatoryIds: ['REG-04'],
    relatedAuditIds: ['AUD-010'],
  },
  { id: 'R02', title: 'NdPr price decline below breakeven', category: 'market', likelihood: 2, impact: 5, score: 10, mitigation: 'Green premium offtakes with floor price clauses; diversified DyTb revenue stream', status: 'mitigating', owner: 'CFO' },
  { id: 'R03', title: 'FEOC policy change expands restricted entities', category: 'geopolitical', likelihood: 2, impact: 4, score: 8, mitigation: 'Full Scope 3 reagent provenance tracking; allied-only supply chain architecture', status: 'mitigating', owner: 'VP Compliance' },
  { id: 'R04', title: 'DFS completion delayed beyond mid-2026', category: 'technical', likelihood: 3, impact: 4, score: 12, mitigation: 'Ausenco acceleration package; parallel workstreams; weekly progress tracking', status: 'mitigating', owner: 'Project Director' },
  { id: 'R05', title: 'Water quality exceedance at discharge point', category: 'environmental', likelihood: 2, impact: 4, score: 8, mitigation: 'ISE real-time monitoring; automated throttle at 200 ppm sulfate; contingency treatment', status: 'mitigating', owner: 'Environmental Manager' },
  { id: 'R06', title: 'UDC legacy radiation above background', category: 'environmental', likelihood: 2, impact: 3, score: 6, mitigation: 'Continuous scintillation monitoring; 3 km exclusion buffer; INB/CNEN compliance', status: 'accepted', owner: 'HSE Director' },
  { id: 'R07', title: 'Ammonium sulfate supply chain disruption', category: 'operational', likelihood: 2, impact: 3, score: 6, mitigation: 'Dual-supplier qualification (AdvanSix + backup); 90-day strategic inventory', status: 'mitigating', owner: 'Supply Chain Manager' },
  { id: 'R08', title: 'Key personnel retention during scale-up', category: 'operational', likelihood: 3, impact: 3, score: 9, mitigation: 'Long-term incentive plans; knowledge transfer protocols; deputy role assignments', status: 'open', owner: 'CHRO' },
  { id: 'R09', title: 'BRL/USD FX exposure on operating costs', category: 'market', likelihood: 3, impact: 3, score: 9, mitigation: 'Natural hedge (USD revenue / BRL costs); rolling 12-month hedging policy', status: 'mitigating', owner: 'Treasury' },
  { id: 'R10', title: 'Community opposition to mine expansion', category: 'permitting', likelihood: 2, impact: 4, score: 8, mitigation: 'Community liaison program; local employment commitment; environmental offset fund', status: 'mitigating', owner: 'Community Relations' },
]

export const INCIDENT_LOG: IncidentRecord[] = [
  { id: 'INC-001', alertId: 'alert-ph-high', title: 'pH Level Elevated — Leach Circuit', severity: 'warning', triggeredAt: '2026-04-04T14:22:00Z', acknowledgedAt: '2026-04-04T14:25:00Z', resolvedAt: '2026-04-04T14:58:00Z', status: 'resolved', assignee: 'J. Santos (Process Eng.)', responseNote: 'Ammonium sulfate feed rate increased 12%. pH returned to 4.4 within 36 minutes.', slaMinutes: 30 },
  { id: 'INC-002', alertId: 'alert-sulfate', title: 'Sulfate Containment Near Threshold', severity: 'critical', triggeredAt: '2026-04-03T09:10:00Z', acknowledgedAt: '2026-04-03T09:12:00Z', resolvedAt: '2026-04-03T10:45:00Z', status: 'resolved', assignee: 'M. Costa (Env. Manager)', responseNote: 'Discharge flow reduced 30%. Activated contingency filtration. Sulfate dropped to 218 ppm.', slaMinutes: 15 },
  { id: 'INC-003', alertId: 'alert-recirc', title: 'Water Recirculation Below Target', severity: 'warning', triggeredAt: '2026-04-02T16:44:00Z', acknowledgedAt: '2026-04-02T16:50:00Z', resolvedAt: '2026-04-02T17:30:00Z', status: 'resolved', assignee: 'A. Lima (Operations)', responseNote: 'Filter blockage cleared. Recirculation recovered to 95.6% within 46 minutes.', slaMinutes: 30 },
  { id: 'INC-004', alertId: 'alert-radiation', title: 'UDC Radiation Elevated', severity: 'critical', triggeredAt: '2026-03-28T11:05:00Z', acknowledgedAt: '2026-03-28T11:08:00Z', resolvedAt: '2026-03-28T12:20:00Z', status: 'resolved', assignee: 'R. Ferreira (HSE)', responseNote: 'Wind-carried particulate event. Personnel evacuated from 500m zone. Levels normalized after 75 min.', slaMinutes: 15 },
  { id: 'INC-005', alertId: 'alert-aquifer', title: 'Aquifer Depth Critical — PIZ-E04', severity: 'critical', triggeredAt: '2026-03-25T08:30:00Z', acknowledgedAt: '2026-03-25T08:33:00Z', resolvedAt: '2026-03-25T11:00:00Z', status: 'resolved', assignee: 'Dr. L. Oliveira (Hydro.)', responseNote: 'Seasonal drawdown event. Pumping throttled 20%. East margin piezometer stabilized at +1.8m delta.', slaMinutes: 15 },
]
