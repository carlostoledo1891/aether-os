import { useMemo } from 'react'
import { FileBarChart, Rocket } from 'lucide-react'
import { StatusChip } from '../../components/ui/StatusChip'
import { W } from '../../app/canvas/canvasTheme'
import { useAetherService } from '../../services/DataServiceProvider'
import { ExecutiveCard } from './ExecutiveCard'
import ty from './executiveTypography.module.css'

const PLATFORM_ROADMAP = [
  {
    phase: 1,
    title: 'Pilot Data Ingestion',
    target: 'H2 2026',
    cost: '$10K setup + $5K/mo',
    status: 'active' as const,
    milestones: [
      'Wire pilot plant historian to Aether ingest API',
      'Piezometer & ISE sensor feeds → live hydro twin',
      'Automated FEAM/COPAM reporting proof-of-concept',
    ],
  },
  {
    phase: 2,
    title: 'LIMS & Certified Batch Data',
    target: 'H1 2027',
    cost: '$50K integration',
    status: 'pending' as const,
    milestones: [
      'Assay lab LIMS integration (QA → Digital Battery Passport)',
      'Immutable ledger anchoring for compliance batches',
      'Offtaker ERP API handoff (Ucore SAP, Neo Catena-X)',
    ],
  },
  {
    phase: 3,
    title: 'Multi-Tenant Deployment',
    target: 'H2 2027',
    cost: 'SaaS licensing',
    status: 'pending' as const,
    milestones: [
      'White-label configuration for additional REE/critical-mineral sites',
      'FedRAMP-ready deployment architecture (AWS GovCloud)',
      'Board disclosure mode for ASX/SEC continuous reporting',
    ],
  },
] as const

export function DfsTab() {
  const service = useAetherService()
  const dfsWorkstreams = useMemo(() => service.getDFSWorkstreams(), [service])
  const regulatory = useMemo(() => service.getRegulatoryLog(), [service])

  if (!Array.isArray(dfsWorkstreams) || !Array.isArray(regulatory)) {
    return <div style={{ padding: 24, color: 'var(--w-text4)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>Loading DFS...</div>
  }

  return (
    <div className="grid min-w-0 grid-cols-1 items-start gap-4 lg:grid-cols-2">
      <ExecutiveCard title="Ausenco DFS Workstreams" icon={FileBarChart} iconColor="green" glow="green">
        <div className="flex flex-col gap-4">
          {(Array.isArray(dfsWorkstreams) ? dfsWorkstreams : []).map((ws) => {
            const barColor =
              ws.status === 'on_track'
                ? W.green
                : ws.status === 'at_risk'
                  ? W.amber
                  : ws.status === 'delayed'
                    ? W.red
                    : W.green
            return (
              <div key={ws.id}>
                <div className="mb-1.5 flex flex-wrap items-start justify-between gap-2">
                  <span className="text-[11px] font-bold text-[var(--w-text2)]">{ws.name}</span>
                  <div className="flex items-center gap-2">
                    <span className={`${ty.mono} text-[11px] text-[var(--w-text4)]`}>{ws.target_date}</span>
                    <StatusChip
                      label={ws.status.replace('_', ' ').toUpperCase()}
                      variant={ws.status === 'on_track' ? 'green' : ws.status === 'at_risk' ? 'amber' : 'red'}
                      size="sm"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 flex-1 overflow-hidden rounded-full" style={{ background: W.glass06 }}>
                    <div
                      className="h-full rounded-full transition-[width] duration-300"
                      style={{
                        width: `${ws.progress_pct}%`,
                        background: `linear-gradient(90deg, ${barColor}80, ${barColor})`,
                      }}
                    />
                  </div>
                  <span
                    className={`${ty.mono} min-w-[2.5rem] text-right text-[12px] font-extrabold`}
                    style={{ color: barColor }}
                  >
                    {ws.progress_pct}%
                  </span>
                </div>
                <div className={`${ty.body} mt-1`}>Lead: {ws.lead}</div>
              </div>
            )
          })}
        </div>
      </ExecutiveCard>

      <ExecutiveCard>
        <span className={`${ty.labelStrong} mb-3 block`}>Regulatory Engagement Log</span>
        <p className={`${ty.body} mb-3 text-[var(--w-text4)]`}>
          DFS-relevant regulatory touchpoints — for full agency matrix, exports, and MPF thread see the Agencies tab.
        </p>
        <div className="flex flex-col gap-3">
          {(Array.isArray(regulatory) ? regulatory : []).map((r) => (
            <div
              key={r.id}
              className="rounded-lg border px-4 py-4"
              style={{ borderColor: W.glass05, background: W.glass02 }}
            >
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-bold text-[var(--w-text2)]">{r.body}</span>
                  <span className="text-[11px] text-[var(--w-text4)]">{r.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`${ty.mono} text-[11px] text-[var(--w-text4)]`}>{r.date}</span>
                  <StatusChip
                    label={r.status.replace('_', ' ').toUpperCase()}
                    variant={
                      r.status === 'approved'
                        ? 'green'
                        : r.status === 'submitted'
                          ? 'violet'
                          : r.status === 'in_review'
                            ? 'amber'
                            : 'red'
                    }
                    size="sm"
                  />
                </div>
              </div>
              <div className={`${ty.body} text-[var(--w-text3)]`}>{r.detail}</div>
              {(r.evidenceDocId || r.nextMilestone) && (
                <div className={`${ty.mono} mt-3 flex flex-wrap gap-3 text-[10px] text-[var(--w-text4)]`}>
                  {r.evidenceDocId && (
                    <span>
                      Doc: <span style={{ color: W.cyan }}>{r.evidenceDocId}</span>
                    </span>
                  )}
                  {r.nextMilestone && (
                    <span>
                      Next: <span className="text-[var(--w-text3)]">{r.nextMilestone}</span>
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </ExecutiveCard>

      <ExecutiveCard title="Aether Platform Roadmap" icon={Rocket} iconColor="violet" glow="violet" className="col-span-full">
        <div className="flex flex-col gap-5">
          {PLATFORM_ROADMAP.map((p, i) => {
            const color = p.status === 'active' ? W.violet : W.text4
            return (
              <div key={p.phase} className="flex gap-4">
                <div className="flex flex-col items-center" style={{ flexShrink: 0, width: 24 }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: '50%',
                    background: p.status === 'active' ? `${W.violet}25` : W.glass06,
                    border: `1.5px solid ${color}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 800, color,
                    boxShadow: p.status === 'active' ? `0 0 10px ${W.violet}40` : undefined,
                  }}>
                    {p.phase}
                  </div>
                  {i < PLATFORM_ROADMAP.length - 1 && (
                    <div style={{ width: 1, flex: 1, minHeight: 12, background: W.glass08, margin: '2px 0' }} />
                  )}
                </div>
                <div className="min-w-0 flex-1 pb-1">
                  <div className="mb-1.5 flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-bold" style={{ color: p.status === 'active' ? W.text1 : W.text3 }}>
                      {p.title}
                    </span>
                    <StatusChip
                      label={p.status === 'active' ? 'IN PROGRESS' : 'PLANNED'}
                      variant={p.status === 'active' ? 'violet' : 'cyan'}
                      size="sm"
                    />
                  </div>
                  <div className="mb-2 flex flex-wrap gap-3">
                    <span className={`${ty.mono} text-[10px] text-[var(--w-text4)]`}>Target: {p.target}</span>
                    <span className={`${ty.mono} text-[10px]`} style={{ color: W.green }}>{p.cost}</span>
                  </div>
                  <ul className="m-0 flex list-none flex-col gap-1 p-0">
                    {p.milestones.map(m => (
                      <li key={m} className="flex items-start gap-1.5">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full" style={{ background: color }} />
                        <span className={`${ty.body} text-[var(--w-text3)]`}>{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          })}
        </div>
      </ExecutiveCard>
    </div>
  )
}
