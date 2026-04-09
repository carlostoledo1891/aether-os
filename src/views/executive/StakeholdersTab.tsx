import { Users, Building2, Handshake, Leaf } from 'lucide-react'
import { W } from '../../app/canvas/canvasTheme'
import { useServiceQuery } from '../../hooks/useServiceQuery'
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton'
import { ErrorFallback } from '../../components/ui/ErrorFallback'
import { ExecutiveCard } from './ExecutiveCard'
import ty from './executiveTypography.module.css'

const STATUS_DOT_COLOR: Record<string, string> = {
  green: W.green,
  amber: W.amber,
  violet: W.violet,
  muted: W.text4,
  red: W.red,
}

const GROUP_META: Record<string, { icon: typeof Users; color: 'violet' | 'cyan' | 'green' | 'amber'; glow: 'violet' | 'cyan' | 'green' | 'amber' | 'none' }> = {
  Community: { icon: Users, color: 'amber', glow: 'none' },
  Regulatory: { icon: Building2, color: 'violet', glow: 'none' },
  Commercial: { icon: Handshake, color: 'cyan', glow: 'none' },
  'ESG & Media': { icon: Leaf, color: 'green', glow: 'none' },
}

const REGULATORY_LABEL: Record<string, string> = {
  FEAM: 'Collaborative',
  MPF: 'Contested',
  IGAM: 'Neutral',
  COPAM: 'Pending',
}

const COMMERCIAL_LABEL: Record<string, string> = {
  Ucore: 'Binding',
  'Neo Performance': 'LOI',
  'Toyota Tsusho': 'Early',
}

function Dot({ color, size = 6 }: { color: string; size?: number }) {
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: color,
        display: 'inline-block',
        flexShrink: 0,
        boxShadow: color !== W.text4 ? `0 0 4px ${color}50` : undefined,
      }}
    />
  )
}

export function StakeholdersTab() {
  const { data: register, isLoading, error } = useServiceQuery('stakeholder-register', s => s.getStakeholderRegister())

  if (error) return <ErrorFallback error={error} label="Stakeholder register" />
  if (isLoading || !register) {
    return <LoadingSkeleton variant="card" label="Loading stakeholders..." />
  }

  const community = register.groups.find(g => g.group === 'Community')
  const regulatory = register.groups.find(g => g.group === 'Regulatory')
  const commercial = register.groups.find(g => g.group === 'Commercial')
  const esgMedia = register.groups.find(g => g.group === 'ESG & Media')

  return (
    <div className="grid min-w-0 grid-cols-1 items-start gap-4 lg:grid-cols-2">
      {/* Community Pulse */}
      {community && (
        <ExecutiveCard
          title="Community Pulse"
          icon={GROUP_META.Community.icon}
          iconColor={GROUP_META.Community.color}
          glow={GROUP_META.Community.glow}
        >
          <div className="mb-3 flex items-center gap-2">
            <Dot color={W.amber} />
            <span className="text-[11px] font-semibold text-[var(--w-text2)]">
              {community.summary}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {community.items.map(item => (
              <div key={item.label} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Dot color={STATUS_DOT_COLOR[item.status] ?? W.text4} />
                  <span className={`${ty.label} normal-case tracking-normal`}>{item.label}</span>
                </div>
                <span className="text-right text-[11px] font-semibold text-[var(--w-text2)]">{item.detail}</span>
              </div>
            ))}
          </div>
        </ExecutiveCard>
      )}

      {/* Regulatory Temperature */}
      {regulatory && (
        <ExecutiveCard
          title="Regulatory Temperature"
          icon={GROUP_META.Regulatory.icon}
          iconColor={GROUP_META.Regulatory.color}
          glow={GROUP_META.Regulatory.glow}
        >
          <div className="flex flex-col gap-0">
            <div
              className="grid gap-2 border-b py-1"
              style={{ gridTemplateColumns: '80px 80px 1fr 80px', borderBottomColor: `${W.text4}30` }}
            >
              {['Agency', 'Posture', 'Status', 'Date'].map(h => (
                <span key={h} className={ty.th}>{h}</span>
              ))}
            </div>
            {regulatory.items.map(item => (
              <div
                key={item.label}
                className="grid items-center gap-2 border-b py-2"
                style={{ gridTemplateColumns: '80px 80px 1fr 80px', borderBottomColor: W.glass03 }}
              >
                <div className="flex items-center gap-2">
                  <Dot color={STATUS_DOT_COLOR[item.status] ?? W.text4} />
                  <span className="text-[11px] font-bold" style={{ color: STATUS_DOT_COLOR[item.status] ?? W.text4 }}>
                    {item.label}
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-[var(--w-text3)]">
                  {REGULATORY_LABEL[item.label] ?? '—'}
                </span>
                <span className="text-[10px] text-[var(--w-text2)]">{item.detail}</span>
                <span className={`${ty.mono} text-[10px] text-[var(--w-text4)]`}>{item.date ?? '—'}</span>
              </div>
            ))}
          </div>
        </ExecutiveCard>
      )}

      {/* Commercial Pipeline */}
      {commercial && (
        <ExecutiveCard
          title="Commercial Pipeline"
          icon={GROUP_META.Commercial.icon}
          iconColor={GROUP_META.Commercial.color}
          glow={GROUP_META.Commercial.glow}
        >
          <div className="flex flex-col gap-0">
            <div
              className="grid gap-2 border-b py-1"
              style={{ gridTemplateColumns: '1fr 70px 80px', borderBottomColor: `${W.text4}30` }}
            >
              {['Partner', 'Stage', 'Volume'].map(h => (
                <span key={h} className={ty.th}>{h}</span>
              ))}
            </div>
            {commercial.items.map(item => (
              <div
                key={item.label}
                className="grid items-center gap-2 border-b py-2"
                style={{ gridTemplateColumns: '1fr 70px 80px', borderBottomColor: W.glass03 }}
              >
                <div className="flex items-center gap-2">
                  <Dot color={STATUS_DOT_COLOR[item.status] ?? W.text4} />
                  <span className="text-[11px] font-bold text-[var(--w-text1)]">{item.label}</span>
                </div>
                <span className="text-[10px] font-semibold" style={{ color: STATUS_DOT_COLOR[item.status] ?? W.text4 }}>
                  {COMMERCIAL_LABEL[item.label] ?? '—'}
                </span>
                <span className={`${ty.mono} text-[10px] text-[var(--w-text2)]`}>{item.detail}</span>
              </div>
            ))}
          </div>
        </ExecutiveCard>
      )}

      {/* ESG & Media Readiness */}
      {esgMedia && (
        <ExecutiveCard
          title="ESG & Media Readiness"
          icon={GROUP_META['ESG & Media'].icon}
          iconColor={GROUP_META['ESG & Media'].color}
          glow={GROUP_META['ESG & Media'].glow}
        >
          <div className="flex flex-col gap-3">
            {/* ESG coverage with progress bar */}
            {esgMedia.items.map(item => {
              const pct = parseInt(item.detail, 10)
              const hasPct = !isNaN(pct) && item.label === 'ESG coverage'
              return (
                <div key={item.label}>
                  <div className="mb-1 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Dot color={STATUS_DOT_COLOR[item.status] ?? W.text4} />
                      <span className={`${ty.label} normal-case tracking-normal`}>{item.label}</span>
                    </div>
                    <span className="text-right text-[11px] font-semibold text-[var(--w-text2)]">{item.detail}</span>
                  </div>
                  {hasPct && (
                    <div className="h-1.5 overflow-hidden rounded-full" style={{ background: W.glass06 }}>
                      <div
                        className="h-full rounded-full transition-[width] duration-300"
                        style={{ width: `${pct}%`, background: W.green }}
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div
            className="mt-4 rounded-lg px-3 py-2.5"
            style={{ background: `${W.green}08`, border: `1px solid ${W.green}18` }}
          >
            <p className={`${ty.body} m-0 text-[var(--w-text3)]`}>
              All data areas carry provenance badges. Demo disclaimers active across all views. Hallucination test suite passing.
            </p>
          </div>
        </ExecutiveCard>
      )}
    </div>
  )
}
