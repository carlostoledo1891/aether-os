import { useMemo } from 'react'
import { ShieldAlert } from 'lucide-react'
import { StatusChip } from '../../components/ui/StatusChip'
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton'
import { W } from '../../app/canvas/canvasTheme'
import { useServiceQuery } from '../../hooks/useServiceQuery'
import type { RiskItem } from '../../services/dataService'
import { RISK_COLOR, riskScoreColor } from './constants'
import { ExecutiveCard } from './ExecutiveCard'
import ty from './executiveTypography.module.css'

export function RiskTab() {
  const { data: risks, isLoading } = useServiceQuery('risks', s => s.getRiskRegister())
  const risksByScore = useMemo(() => risks ? [...risks].sort((a: RiskItem, b: RiskItem) => b.score - a.score) : [], [risks])

  if (isLoading || !risks) {
    return <LoadingSkeleton variant="card" label="Loading risks..." />
  }

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-3">
        {(['critical', 'high', 'medium'] as const).map((tier) => {
          const [min, max, label, clr] =
            tier === 'critical'
              ? [12, 25, 'Critical', W.red]
              : tier === 'high'
                ? [8, 11, 'High', W.amber]
                : [1, 7, 'Medium', W.green]
          const count = risks.filter((r) => r.score >= min && r.score <= max).length
          return (
            <ExecutiveCard key={tier} className="!p-4">
              <div className={`${ty.labelStrong} mb-1`} style={{ color: clr }}>
                {label}
              </div>
              <div className={`${ty.valueLg} mb-1`} style={{ color: clr, fontFamily: 'var(--font-mono)' }}>
                {count}
              </div>
              <div className={ty.body}>
                Score {min}–{max}
              </div>
            </ExecutiveCard>
          )
        })}
      </div>

      <ExecutiveCard title="Top 10 Project Risks" icon={ShieldAlert} iconColor="red">
        <div className="min-w-0 overflow-x-auto">
          <div className="min-w-[640px]">
            <div
              className="grid gap-2 border-b border-[color-mix(in_srgb,var(--w-text4)_30%,transparent)] px-1 py-2"
              style={{
                gridTemplateColumns: '36px minmax(140px,1.2fr) 88px 44px 44px 48px 88px',
              }}
            >
              {['#', 'Risk', 'Category', 'L', 'I', 'Score', 'Status'].map((h) => (
                <span key={h} className={ty.th}>
                  {h}
                </span>
              ))}
            </div>
            {risksByScore.map((r) => (
              <div
                key={r.id}
                className="grid gap-2 border-b px-1 py-3"
                style={{
                  gridTemplateColumns: '36px minmax(140px,1.2fr) 88px 44px 44px 48px 88px',
                  borderBottomColor: W.glass04,
                }}
              >
                <span className={`${ty.mono} text-[11px] font-bold text-[var(--w-text4)]`}>{r.id}</span>
                <div className="min-w-0">
                  <div className="mb-1 text-[11px] font-semibold text-[var(--w-text1)]">{r.title}</div>
                  <div className={ty.bodyTight}>{r.mitigation}</div>
                  {r.relatedRegulatoryIds?.length || r.relatedAuditIds?.length ? (
                    <div className="mt-2 font-mono text-[10px] leading-snug text-[var(--w-cyan)]">
                      Administrative record:
                      {r.relatedRegulatoryIds?.map((id) => (
                        <span key={id}> {id}</span>
                      ))}
                      {r.relatedAuditIds?.map((id) => (
                        <span key={id}> · {id}</span>
                      ))}
                      <span className="text-[var(--w-text4)]"> · Executive → Agencies</span>
                    </div>
                  ) : null}
                </div>
                <span
                  className="text-[11px] font-semibold capitalize"
                  style={{ color: RISK_COLOR[r.category] ?? W.text3 }}
                >
                  {r.category}
                </span>
                <span className={`${ty.mono} text-[11px] font-bold text-[var(--w-text2)]`}>{r.likelihood}</span>
                <span className={`${ty.mono} text-[11px] font-bold text-[var(--w-text2)]`}>{r.impact}</span>
                <span
                  className={`${ty.mono} text-[12px] font-extrabold`}
                  style={{ color: riskScoreColor(r.score) }}
                >
                  {r.score}
                </span>
                <div className="flex items-center">
                  <StatusChip
                    label={r.status.toUpperCase()}
                    variant={
                      r.status === 'mitigating'
                        ? 'green'
                        : r.status === 'open'
                          ? 'amber'
                          : r.status === 'accepted'
                            ? 'violet'
                            : 'green'
                    }
                    size="sm"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </ExecutiveCard>
    </div>
  )
}
