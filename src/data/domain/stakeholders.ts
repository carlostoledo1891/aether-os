import type { StakeholderRegister } from '../../services/dataService'

export const STAKEHOLDER_REGISTER: StakeholderRegister = {
  groups: [
    {
      group: 'Community',
      status: 'neutral',
      summary: 'Engagement active, LAPOC pending',
      items: [
        { label: 'Grievances', status: 'green', detail: '0 open / 3 total' },
        { label: 'Spring monitoring', status: 'amber', detail: 'Modeled' },
        { label: 'LAPOC status', status: 'amber', detail: 'Integration pending' },
        { label: 'Last community brief', status: 'green', detail: '2026-03-15', date: '2026-03-15' },
      ],
    },
    {
      group: 'Regulatory',
      status: 'neutral',
      summary: 'Mixed agency posture',
      items: [
        { label: 'FEAM', status: 'green', detail: 'Approved', date: '2025-12-01' },
        { label: 'MPF', status: 'amber', detail: 'EIA challenged', date: '2025-06-15' },
        { label: 'IGAM', status: 'violet', detail: 'Submitted', date: '2025-10-20' },
        { label: 'COPAM', status: 'muted', detail: 'Awaiting review', date: '2025-11-01' },
      ],
    },
    {
      group: 'Commercial',
      status: 'positive',
      summary: 'Pipeline active',
      items: [
        { label: 'Ucore', status: 'green', detail: '12,000 t/yr' },
        { label: 'Neo Performance', status: 'amber', detail: '8,000 t/yr' },
        { label: 'Toyota Tsusho', status: 'muted', detail: 'TBD' },
      ],
    },
    {
      group: 'ESG & Media',
      status: 'positive',
      summary: 'Readiness high',
      items: [
        { label: 'ESG coverage', status: 'green', detail: '77%' },
        { label: 'Provenance', status: 'green', detail: 'All data areas labeled' },
        { label: 'Demo readiness', status: 'green', detail: 'Disclaimers active · Hallucination tests passing' },
      ],
    },
  ],
  last_updated: '2026-04-09',
}
