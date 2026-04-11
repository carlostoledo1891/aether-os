import { useMemo } from 'react'
import { Leaf } from 'lucide-react'
import { W } from '../../app/canvas/canvasTheme'
import { useServiceQuery } from '../../hooks/useServiceQuery'
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton'
import { ErrorFallback } from '../../components/ui/ErrorFallback'
import { ESG_CATEGORY_COLOR, COVERAGE_STATUS_COLOR } from './constants'
import { ExecutiveCard } from './ExecutiveCard'
import { ExecutivePageIntro } from './ExecutivePageIntro'
import ty from './executiveTypography.module.css'

function categoryToGlow(cat: string): 'cyan' | 'green' | 'violet' | 'amber' {
  const c = ESG_CATEGORY_COLOR[cat]
  if (c === W.cyan) return 'cyan'
  if (c === W.green) return 'green'
  if (c === W.violet) return 'violet'
  return 'amber'
}

export function EsgTab() {
  const { data: esgFrameworks, isLoading, error } = useServiceQuery('esg-frameworks', s => s.getESGFrameworks())

  const esgOverallCoverage = useMemo(() => {
    if (!esgFrameworks || esgFrameworks.length === 0) return 0
    return Math.round(esgFrameworks.reduce((sum, f) => sum + f.coverage_pct, 0) / esgFrameworks.length)
  }, [esgFrameworks])

  if (error) return <ErrorFallback error={error} label="ESG frameworks" />
  if (isLoading || !esgFrameworks) {
    return <LoadingSkeleton variant="card" label="Loading ESG..." />
  }

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <ExecutivePageIntro>
        ESG coverage is a dashboard narrative for board visibility — not a substitute for JORC resource assurance or statutory
        reporting.
      </ExecutivePageIntro>

      <div className="flex flex-wrap gap-3">
        <ExecutiveCard className="min-w-[200px] flex-1 !p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className={`${ty.label} mb-1`}>Overall Coverage</div>
              <div className="font-mono text-[26px] font-extrabold text-[var(--w-cyan)]">{esgOverallCoverage}%</div>
              <div className={`${ty.body} text-[var(--w-text3)]`}>Across {esgFrameworks.length} reporting frameworks</div>
            </div>
            <svg width={56} height={56} aria-hidden>
              <circle cx={28} cy={28} r={22} fill="none" stroke={W.cyanSubtle} strokeWidth={4} />
              <circle
                cx={28}
                cy={28}
                r={22}
                fill="none"
                stroke={W.cyan}
                strokeWidth={4}
                strokeLinecap="round"
                strokeDasharray={`${(esgOverallCoverage / 100) * 138} 138`}
                transform="rotate(-90 28 28)"
                style={{ filter: `drop-shadow(0 0 6px ${W.cyan}60)` }}
              />
            </svg>
          </div>
        </ExecutiveCard>

        {(['water', 'climate', 'governance', 'waste', 'social'] as const).map((cat) => {
          const frameworks = esgFrameworks.filter((f) => f.category === cat)
          if (frameworks.length === 0) return null
          const avgCoverage = Math.round(frameworks.reduce((s, f) => s + f.coverage_pct, 0) / frameworks.length)
          const clr = ESG_CATEGORY_COLOR[cat]
          return (
            <ExecutiveCard key={cat} className="min-w-[100px] flex-1 !p-3">
              <div className={`${ty.labelStrong} mb-1`} style={{ color: clr }}>
                {cat}
              </div>
              <div className="font-mono text-[17px] font-extrabold" style={{ color: clr }}>
                {avgCoverage}%
              </div>
            </ExecutiveCard>
          )
        })}
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-2">
        {esgFrameworks.map((fw) => (
          <ExecutiveCard
            key={fw.id}
            title={fw.name}
            icon={Leaf}
            iconColor={categoryToGlow(fw.category)}
          >
            <div className="mb-3 text-[11px] text-[var(--w-text4)]">{fw.standard}</div>
            <div className="mb-4 flex items-center gap-3">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full" style={{ background: W.glass06 }}>
                <div
                  className="h-full rounded-full transition-[width] duration-300"
                  style={{
                    width: `${fw.coverage_pct}%`,
                    background: fw.coverage_pct >= 80 ? W.green : fw.coverage_pct >= 60 ? W.amber : W.red,
                  }}
                />
              </div>
              <span
                className="min-w-[3rem] font-mono text-[13px] font-extrabold"
                style={{
                  color: fw.coverage_pct >= 80 ? W.green : fw.coverage_pct >= 60 ? W.amber : W.red,
                }}
              >
                {fw.coverage_pct}%
              </span>
            </div>

            <div className="flex flex-col gap-0">
              <div className="grid grid-cols-[1fr_1fr_64px] gap-2 border-b border-[color-mix(in_srgb,var(--w-text4)_25%,transparent)] py-1">
                {['Disclosure Metric', 'Dashboard Source', 'Status'].map((h) => (
                  <span key={h} className={ty.th}>
                    {h}
                  </span>
                ))}
              </div>
              {fw.metrics.map((m, mi) => (
                <div
                  key={mi}
                  className="grid grid-cols-[1fr_1fr_64px] gap-2 border-b py-2"
                  style={{ borderBottomColor: W.glass03 }}
                >
                  <span className="text-[11px] text-[var(--w-text2)]">{m.metric}</span>
                  <span className={`${ty.mono} text-[11px] text-[var(--w-text3)]`}>{m.dashboardSource}</span>
                  <span
                    className="h-fit self-start rounded px-1.5 py-0.5 text-center text-[9px] font-extrabold uppercase tracking-[0.04em]"
                    style={{
                      color: COVERAGE_STATUS_COLOR[m.status],
                      background: `${COVERAGE_STATUS_COLOR[m.status]}15`,
                      border: `1px solid ${COVERAGE_STATUS_COLOR[m.status]}30`,
                    }}
                  >
                    {m.status}
                  </span>
                </div>
              ))}
            </div>
          </ExecutiveCard>
        ))}
      </div>

      <div className="rounded-lg px-4 py-3" style={{ background: W.glass04, border: W.chromeBorder }}>
        <p className={`${ty.body} m-0 text-[var(--w-text3)]`}>
          Vero captures operational data that directly maps to 5 major ESG reporting frameworks. This
          dashboard-to-disclosure pipeline reduces manual reporting effort by 80% and supports continuous audit readiness for GRI,
          SASB, TCFD, and ISSB submissions.
        </p>
      </div>
    </div>
  )
}
