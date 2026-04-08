import { Landmark } from 'lucide-react'
import { StatusChip } from '../../components/ui/StatusChip'
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton'
import { W } from '../../app/canvas/canvasTheme'
import { useServiceQuery } from '../../hooks/useServiceQuery'
import { CP_STATUS_COLOR, CP_STATUS_LABEL } from './constants'
import { ExecutiveCard } from './ExecutiveCard'
import ty from './executiveTypography.module.css'

export function CapitalTab() {
  const { data: capital, isLoading } = useServiceQuery('capital', s => s.getCapitalSnapshot())

  if (isLoading || !capital) {
    return <LoadingSkeleton variant="card" label="Loading capital..." />
  }

  return (
    <div className="grid min-w-0 grid-cols-1 items-start gap-4 lg:grid-cols-2">
      <div className="flex min-w-0 flex-col gap-4">
        <ExecutiveCard title="Capital Deployment" icon={Landmark} iconColor="violet" glow="violet">
          <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
            {(
              [
                ['Total CAPEX', `$${capital?.total_capex_m ?? 0}M`, W.text1],
                ['Drawn', `$${capital?.drawn_m ?? 0}M`, W.violet],
                ['Remaining', `$${capital?.remaining_m ?? 0}M`, W.text3],
              ] as [string, string, string][]
            ).map(([label, value, clr]) => (
              <div
                key={label}
                className="rounded-lg px-3 py-2.5"
                style={{ border: `1px solid ${W.glass07}`, background: W.glass03 }}
              >
                <div className={`${ty.label} mb-1`}>{label}</div>
                <div className={`${ty.value} text-[15px]`} style={{ color: clr }}>
                  {value}
                </div>
              </div>
            ))}
          </div>
          {capital.funding_sources.map((f) => {
            const pct = f.committed_m > 0 ? (f.drawn_m / f.committed_m) * 100 : 0
            return (
              <div key={f.name} className="mb-3 last:mb-0">
                <div className="mb-1 flex justify-between gap-2">
                  <span className="text-[11px] font-bold text-[var(--w-text2)]">{f.name}</span>
                  <span className={`${ty.mono} text-[11px] text-[var(--w-text4)]`}>
                    {f.currency} {f.drawn_m}M / {f.committed_m}M
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full" style={{ background: W.glass06 }}>
                  <div
                    className="h-full rounded-full transition-[width] duration-300"
                    style={{
                      width: `${pct}%`,
                      background: `linear-gradient(90deg, ${W.violet}, ${W.violetSoft})`,
                    }}
                  />
                </div>
              </div>
            )
          })}
        </ExecutiveCard>

        <ExecutiveCard>
          <span className={`${ty.labelStrong} mb-3 block`}>Monthly Spend vs Budget</span>
          <div>
            {capital.monthly_spend.map((m, i) => {
              const maxVal = Math.max(0, ...capital.monthly_spend.map((x) => Math.max(x.budget_m, x.actual_m)))
              const budgetPct = (m.budget_m / maxVal) * 100
              const actualPct = m.actual_m > 0 ? (m.actual_m / maxVal) * 100 : 0
              return (
                <div
                  key={m.month}
                  className={`py-3 first:pt-0${i > 0 ? ' border-t' : ''}`}
                  style={i > 0 ? { borderTopColor: W.glass06 } : undefined}
                >
                  <div className="mb-1 flex justify-between gap-2">
                    <span className="text-[11px] text-[var(--w-text3)]">{m.month.replace(' 2026', '')}</span>
                    <span className={`${ty.mono} text-[11px] text-[var(--w-text4)]`}>
                      {m.actual_m > 0 ? `$${m.actual_m}M / $${m.budget_m}M` : `$${m.budget_m}M budget`}
                    </span>
                  </div>
                  <div className="relative h-2 rounded">
                    <div
                      className="absolute h-full rounded"
                      style={{ background: W.glass06, width: `${budgetPct}%` }}
                    />
                    {actualPct > 0 && (
                      <div
                        className="absolute h-full rounded"
                        style={{
                          width: `${actualPct}%`,
                          background: `linear-gradient(90deg, ${W.violet}80, ${W.violet})`,
                        }}
                      />
                    )}
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-3 flex gap-4">
            <div className="flex items-center gap-2">
              <span className="h-1 w-2 rounded-sm" style={{ background: W.glass06 }} />
              <span className={ty.body}>Budget</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1 w-2 rounded-sm" style={{ background: W.violet }} />
              <span className={ty.body}>Actual</span>
            </div>
          </div>
        </ExecutiveCard>
      </div>

      <div className="min-w-0">
        <ExecutiveCard>
          <span className={`${ty.labelStrong} mb-3 block`}>Conditions Precedent</span>
          <div className="flex flex-col gap-2">
            {capital.conditions_precedent.map((cp) => (
              <div
                key={cp.id}
                className="flex items-center gap-3 rounded-md border px-2 py-2.5"
                style={{ borderColor: W.glass05, background: W.glass02 }}
              >
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{
                    background: CP_STATUS_COLOR[cp.status],
                    boxShadow: `0 0 4px ${CP_STATUS_COLOR[cp.status]}60`,
                  }}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between gap-2">
                    <span className="text-[11px] font-semibold text-[var(--w-text2)]">{cp.description}</span>
                    <span className={`${ty.mono} shrink-0 text-[11px] text-[var(--w-text4)]`}>
                      {cp.target_date}
                    </span>
                  </div>
                </div>
                <StatusChip
                  label={CP_STATUS_LABEL[cp.status]}
                  variant={cp.status === 'met' ? 'green' : cp.status === 'in_progress' ? 'violet' : 'amber'}
                  size="sm"
                />
              </div>
            ))}
          </div>
        </ExecutiveCard>
      </div>
    </div>
  )
}
