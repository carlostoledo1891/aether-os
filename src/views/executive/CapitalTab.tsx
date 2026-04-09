import { Landmark, TrendingUp, Calendar } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, ReferenceLine, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { StatusChip } from '../../components/ui/StatusChip'
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton'
import { ErrorFallback } from '../../components/ui/ErrorFallback'
import { W } from '../../app/canvas/canvasTheme'
import { useServiceQuery } from '../../hooks/useServiceQuery'
import { CP_STATUS_COLOR, CP_STATUS_LABEL } from './constants'
import { ExecutiveCard } from './ExecutiveCard'
import ty from './executiveTypography.module.css'

const DRAWDOWN_STATUS_STYLE: Record<string, { bg: string; text: string }> = {
  completed: { bg: `${W.green}20`, text: W.green },
  in_progress: { bg: `${W.violet}20`, text: W.violet },
  pending: { bg: `${W.text4}15`, text: W.text4 },
}

export function CapitalTab() {
  const { data: capital, isLoading, error } = useServiceQuery('capital', s => s.getCapitalSnapshot())
  const { data: dscr } = useServiceQuery('dscr', s => s.getDSCRProjections())
  const { data: drawdown } = useServiceQuery('drawdown', s => s.getDrawdownSchedule())

  if (error) return <ErrorFallback error={error} label="Capital snapshot" />
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

      <div className="flex min-w-0 flex-col gap-4">
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

        {dscr && dscr.length > 0 && (
          <ExecutiveCard title="DSCR Projections (10yr LOM)" icon={TrendingUp} iconColor="cyan" glow="cyan">
            <div style={{ width: '100%', height: 220 }}>
              <ResponsiveContainer>
                <LineChart data={dscr} margin={{ top: 8, right: 12, bottom: 4, left: 0 }}>
                  <XAxis
                    dataKey="year"
                    tick={{ fill: W.text4, fontSize: 10 }}
                    tickLine={false}
                    axisLine={{ stroke: W.glass06 }}
                    tickFormatter={(y: number) => `Y${y}`}
                  />
                  <YAxis
                    tick={{ fill: W.text4, fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v: number) => `${v}x`}
                    domain={[0, 4]}
                  />
                  <ReferenceLine y={1.3} stroke={W.amber} strokeDasharray="6 3" label={{ value: '1.3x covenant', fill: W.text4, fontSize: 9, position: 'right' }} />
                  <Tooltip
                    contentStyle={{ background: W.panel, border: W.chromeBorder, borderRadius: 8, fontSize: 10, color: W.text2 }}
                    formatter={(v, name) => [`${v}x`, String(name).charAt(0).toUpperCase() + String(name).slice(1)]}
                    labelFormatter={(y) => `Year ${y}`}
                  />
                  <Legend wrapperStyle={{ fontSize: 10, color: W.text3 }} />
                  <Line type="monotone" dataKey="bear" stroke={W.red} strokeWidth={1.5} dot={false} name="Bear" />
                  <Line type="monotone" dataKey="consensus" stroke={W.violet} strokeWidth={2} dot={false} name="Consensus" />
                  <Line type="monotone" dataKey="bull" stroke={W.green} strokeWidth={1.5} dot={false} name="Bull" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ExecutiveCard>
        )}

        {drawdown && drawdown.length > 0 && (
          <ExecutiveCard title="Drawdown Schedule" icon={Calendar} iconColor="violet" glow="violet">
            <div className="flex flex-col gap-0">
              {drawdown.map((d, i) => {
                const pct = (d.cumulative_m / 443) * 100
                const sty = DRAWDOWN_STATUS_STYLE[d.status] ?? DRAWDOWN_STATUS_STYLE.pending
                return (
                  <div
                    key={d.milestone}
                    className={`flex items-center gap-3 py-2.5 ${i > 0 ? 'border-t' : ''}`}
                    style={i > 0 ? { borderTopColor: W.glass06 } : undefined}
                  >
                    <div className="relative flex h-6 w-6 shrink-0 items-center justify-center">
                      <span
                        className="absolute h-full w-full rounded-full"
                        style={{ background: sty.bg }}
                      />
                      <span
                        className="relative h-2 w-2 rounded-full"
                        style={{ background: sty.text }}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-[11px] font-semibold text-[var(--w-text2)]">{d.milestone}</span>
                        <span className={`${ty.mono} shrink-0 text-[10px] text-[var(--w-text4)]`}>
                          ${d.amount_m}M
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <div className="h-1 flex-1 overflow-hidden rounded-full" style={{ background: W.glass06 }}>
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${pct}%`,
                              background: `linear-gradient(90deg, ${W.violet}80, ${W.violet})`,
                            }}
                          />
                        </div>
                        <span className="shrink-0 text-[9px] text-[var(--w-text4)]">
                          ${d.cumulative_m}M / $443M
                        </span>
                      </div>
                    </div>
                    <span className={`${ty.mono} shrink-0 text-[10px] text-[var(--w-text4)]`}>
                      {d.target_date.replace(/-/g, '.')}
                    </span>
                  </div>
                )
              })}
            </div>
          </ExecutiveCard>
        )}
      </div>
    </div>
  )
}
