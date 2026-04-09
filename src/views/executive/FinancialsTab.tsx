import { useState } from 'react'
import { DollarSign, Landmark, Link2 } from 'lucide-react'
import { W } from '../../app/canvas/canvasTheme'
import { useServiceQuery, useServiceQueryWithArg } from '../../hooks/useServiceQuery'
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton'
import { ErrorFallback } from '../../components/ui/ErrorFallback'
import type { ScenarioKey } from '../../services/dataService'
import { SCENARIO_LABELS } from './constants'
import { ExecutiveCard } from './ExecutiveCard'
import { ExecutivePageIntro } from './ExecutivePageIntro'
import ty from './executiveTypography.module.css'

export function FinancialsTab() {
  const [scenario, setScenario] = useState<ScenarioKey>('consensus')

  const { data: fin, isLoading: loadingFin, error: e1 } = useServiceQueryWithArg('financials', scenario, (s, k) => s.getFinancialScenario(k))
  const { data: sensitivityTable, isLoading: loadingSens, error: e2 } = useServiceQuery('sensitivity', s => s.getSensitivityTable())
  const { data: PROJECT_FINANCIALS, isLoading: loadingProj, error: e3 } = useServiceQuery('project-financials', s => s.getProjectFinancials())
  const { data: PROJECT_TIMELINE, isLoading: loadingTL, error: e4 } = useServiceQuery('project-timeline', s => s.getProjectTimeline())
  const { data: snap, isLoading: loadingSnap, error: e5 } = useServiceQuery('issuer-snapshot', s => s.getIssuerSnapshot())

  const firstError = e1 || e2 || e3 || e4 || e5
  if (firstError) return <ErrorFallback error={firstError} label="Financial data" />
  if (loadingFin || loadingSens || loadingProj || loadingTL || loadingSnap || !fin || !sensitivityTable || !PROJECT_FINANCIALS || !PROJECT_TIMELINE || !snap) {
    return <LoadingSkeleton variant="card" label="Loading financials..." />
  }

  return (
    <div className="grid min-w-0 grid-cols-1 items-start gap-5 lg:grid-cols-2">
      <div className="col-span-full flex min-w-0 flex-col gap-2">
        <ExecutivePageIntro>
          Illustrative scenarios aligned to public disclosure materials — not a live market or trading feed.
        </ExecutivePageIntro>
        <p className={`${ty.body} max-w-[52rem] border-l-2 border-[color-mix(in_srgb,var(--w-green)_45%,transparent)] pl-3`}>
          <span className="font-mono text-[10px] text-[var(--w-text4)]">As of {snap?.as_of ?? '—'}</span>
          {' · '}
          Resource headline (verify vs latest ASX): {snap?.resource?.global_bt ?? '—'} Bt @ {snap?.resource?.global_treo_ppm ?? '—'} ppm TREO (M+I{' '}
          {snap?.resource?.measured_indicated_bt ?? '—'} Bt · Inferred {snap?.resource?.inferred_bt ?? '—'} Bt). PFS: {snap?.economics?.pfs_document_label ?? '—'}.
          {snap?.resource?.citation?.url ? (
            <a
              href={snap.resource.citation.url}
              target="_blank"
              rel="noreferrer"
              className="ml-1.5 inline-flex items-center gap-0.5 text-[var(--w-green)] underline-offset-2 hover:underline"
            >
              <Link2 size={10} className="inline shrink-0" />
              {snap.resource.citation.label}
            </a>
          ) : (
            <span className="ml-1 text-[var(--w-text4)]">{snap?.resource?.citation?.label ?? '—'}</span>
          )}
        </p>
      </div>

      <div className="flex min-w-0 flex-col gap-4">
        <div className="flex w-full flex-col gap-2 sm:flex-row sm:gap-1">
          {SCENARIO_LABELS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setScenario(key)}
              className="min-h-[40px] flex-1 rounded-md border px-3 py-2 text-[11px] font-bold uppercase tracking-[0.06em] transition-all sm:min-h-0"
              style={{
                background: scenario === key ? `${W.green}20` : W.glass04,
                color: scenario === key ? W.green : W.text4,
                outline: scenario === key ? `1px solid ${W.green}40` : W.hairlineBorder,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <ExecutiveCard title={`${fin?.label ?? '—'} Scenario`} icon={DollarSign} iconColor="green">
          <div className="grid min-w-0 grid-cols-2 gap-2 sm:gap-2.5 xl:grid-cols-3">
            {([
              ['Pre-Tax NPV₈', `$${fin?.npv_pretax_m ?? 0}M`, `IRR ${fin?.irr_pretax_pct ?? 0}%`],
              ['Post-Tax NPV₈', `$${fin?.npv_posttax_m ?? 0}M`, `IRR ${fin?.irr_posttax_pct ?? 0}%`],
              ['Annual Revenue', `$${fin?.annual_revenue_m ?? 0}M`, `NdPr @ $${fin?.ndpr_price_kg ?? 0}/kg`],
              ['Payback', `${fin?.payback_yrs ?? 0} yrs`, `OPEX $${fin?.opex_per_kg ?? 0}/kg TREO`],
              ['NdPr Net OPEX', `$${fin?.breakeven_ndpr_kg ?? 0}/kg`, 'Net of by-product credits'],
              ['LOM FCF', `$${((PROJECT_FINANCIALS?.lom_fcf_m ?? 0) / 1000).toFixed(1)}B`, `${PROJECT_FINANCIALS?.mine_life_years ?? 0}-yr · ${PROJECT_FINANCIALS?.throughput_mtpa ?? 0} Mtpa`],
            ] as [string, string, string][]).map(([label, value, sub]) => (
              <div
                key={label}
                className="min-w-0 rounded-lg px-2.5 py-2 sm:px-3 sm:py-2.5"
                style={{ border: 'none', background: W.glass03 }}
              >
                <div className={`${ty.label} mb-1`}>{label}</div>
                <div className={`${ty.value} mb-0.5`}>{value}</div>
                <div className={ty.body}>{sub}</div>
              </div>
            ))}
          </div>
        </ExecutiveCard>
      </div>

      <div className="flex min-w-0 flex-col gap-4">
        <ExecutiveCard title="NPV Sensitivity — NdPr Price" icon={DollarSign} iconColor="green">
          <div className="-mx-1 min-w-0 overflow-x-auto">
            <div className="min-w-[280px]">
              <div
                className="grid gap-2 border-b border-[color-mix(in_srgb,var(--w-text4)_30%,transparent)] px-1.5 py-2"
                style={{ gridTemplateColumns: 'minmax(72px,1fr) minmax(88px,1fr) minmax(88px,1fr)' }}
              >
                <span className={ty.th}>NdPr $/kg</span>
                <span className={`${ty.th} text-right`}>Pre-Tax NPV</span>
                <span className={`${ty.th} text-right`}>Post-Tax NPV</span>
              </div>
              {sensitivityTable.map((row) => {
                const isActive = row.ndpr_price === fin?.ndpr_price_kg
                return (
                  <div
                    key={row.ndpr_price}
                    className="grid gap-2 px-1.5 py-2.5"
                    style={{
                      gridTemplateColumns: 'minmax(72px,1fr) minmax(88px,1fr) minmax(88px,1fr)',
                      background: isActive ? `${W.green}12` : 'transparent',
                      borderRadius: isActive ? 6 : 0,
                      border: isActive ? `1px solid ${W.green}25` : '1px solid transparent',
                    }}
                  >
                    <span
                      className={`${ty.mono} text-[11px] font-semibold`}
                      style={{ color: isActive ? W.green : W.text2 }}
                    >
                      ${row.ndpr_price}
                    </span>
                    <span
                      className={`${ty.mono} text-right text-[11px] font-semibold`}
                      style={{ color: isActive ? W.green : W.text2 }}
                    >
                      ${row.npv_pretax_m}M
                    </span>
                    <span
                      className={`${ty.mono} text-right text-[11px] font-semibold`}
                      style={{ color: isActive ? W.green : W.text2 }}
                    >
                      ${row.npv_posttax_m}M
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </ExecutiveCard>

        <ExecutiveCard title="Milestones" icon={Landmark} iconColor="green">
          <div className="flex flex-col gap-3">
            {PROJECT_TIMELINE.map(({ milestone, date, status, detail }) => (
              <div key={milestone} className="flex items-start gap-3">
                <span
                  className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                  style={{
                    background:
                      status === 'completed'
                        ? W.green
                        : status === 'active'
                          ? W.violet
                          : W.glass12,
                    boxShadow:
                      status === 'completed'
                        ? `0 0 5px ${W.green}80`
                        : status === 'active'
                          ? `0 0 5px ${W.violet}80`
                          : 'none',
                  }}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between gap-2">
                    <span
                      className="text-[11px] font-semibold"
                      style={{
                        color:
                          status === 'completed'
                            ? W.green
                            : status === 'active'
                              ? W.violetSoft
                              : W.text3,
                      }}
                    >
                      {milestone}
                    </span>
                    <span className={`${ty.mono} shrink-0 text-[11px] text-[var(--w-text4)]`}>{date}</span>
                  </div>
                  <div className={ty.body}>{detail}</div>
                </div>
              </div>
            ))}
          </div>
        </ExecutiveCard>
      </div>
    </div>
  )
}
