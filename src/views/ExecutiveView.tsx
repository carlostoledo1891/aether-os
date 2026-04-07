import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  AlertTriangle, BarChart3, DollarSign, LockKeyhole,
  ShieldCheck, TrendingUp, Briefcase,
} from 'lucide-react'
import type { EsgScore } from '../types/telemetry'
import { GlassCard } from '../components/ui/GlassCard'
import { GlowingIcon } from '../components/ui/GlowingIcon'
import { StatusChip } from '../components/ui/StatusChip'
import { GreenPremiumCard } from '../components/GreenPremiumCard'
import { EsgScoreRing } from '../components/EsgScoreRing'
import { CountdownTimer } from '../components/ui/CountdownTimer'
import { GaugeChart } from '../components/charts/GaugeChart'
import { MapBase, EXEC_VIEW_STATE } from '../components/map/MapBase'
import { CaldeiraBoundary } from '../components/map/CaldeiraBoundary'
import { DepositOverlay } from '../components/map/DepositOverlay'
import { LicenseOverlay } from '../components/map/LicenseOverlay'
import { InfraOverlay } from '../components/map/InfraOverlay'
import { EnvironmentalOverlay } from '../components/map/EnvironmentalOverlay'
import { W } from '../app/canvas/canvasTheme'
import {
  BOARD_NARRATIVE,
  BOARD_VALUE_AT_RISK,
  CYBER_TRUST_PILLARS,
  DEAL_SCENARIOS,
  PROJECT_FINANCIALS,
  PROJECT_TIMELINE,
  RESOURCE_CLASSIFICATION,
} from '../data/mockData'

interface ExecutiveViewProps {
  esg: EsgScore
}

type ExecTab = 'financials' | 'readiness' | 'strategy'

const TAB_ITEMS: { id: ExecTab; label: string; icon: typeof DollarSign; color: string }[] = [
  { id: 'financials', label: 'Financials',  icon: DollarSign,   color: W.green },
  { id: 'readiness',  label: 'Readiness',   icon: ShieldCheck,  color: W.violet },
  { id: 'strategy',   label: 'Strategy',    icon: Briefcase,    color: W.amber },
]

const TAB_COLOR: Record<ExecTab, string> = {
  financials: W.green,
  readiness:  W.violet,
  strategy:   W.amber,
}

const MAP_HEADER_TEXT: Record<ExecTab, string> = {
  financials: '1.5 Bt MRE · 193 km² · 77 licences · PFS economics',
  readiness:  'ESG composite · operating proof · permit defense · market access',
  strategy:   'Partnership options · deal structure · board decision framework',
}

const FINANCIAL_METRICS = [
  { label: 'Pre-Tax NPV', value: `$${PROJECT_FINANCIALS.npv_pretax_consensus_m}M–$${(PROJECT_FINANCIALS.npv_pretax_forecast_m / 1000).toFixed(1)}B`, sub: 'Consensus → forecast (8% disc.)', color: W.text1 },
  { label: 'Post-Tax NPV', value: `$${PROJECT_FINANCIALS.npv_posttax_consensus_m}M–$${(PROJECT_FINANCIALS.npv_posttax_forecast_m / 1000).toFixed(1)}B`, sub: 'After-tax economics', color: W.text1 },
  { label: 'IRR', value: `${PROJECT_FINANCIALS.irr_pretax_consensus_pct}–${PROJECT_FINANCIALS.irr_pretax_forecast_pct}%`, sub: 'Pre-tax range · post-tax 21–31%', color: W.text1 },
  { label: 'CAPEX', value: `$${PROJECT_FINANCIALS.capex_m}M`, sub: `Funded: EXIM $${PROJECT_FINANCIALS.exim_usd_m}M + EFA A$${PROJECT_FINANCIALS.efa_aud_m}M`, color: W.text1 },
  { label: 'LOM FCF', value: '$2.0B', sub: `${PROJECT_FINANCIALS.mine_life_years}-year LOM · ${PROJECT_FINANCIALS.throughput_mtpa} Mtpa`, color: W.text1 },
  { label: 'Annual NdPr', value: `${PROJECT_FINANCIALS.annual_ndpr_t.toLocaleString()} t/yr`, sub: `+ ${PROJECT_FINANCIALS.annual_dytb_t} tpa DyTb`, color: W.text1 },
]

const BOARD_PILLARS = [
  { id: 'operator', label: 'Operating proof', sub: 'Pilot telemetry, recovery, recirculation' },
  { id: 'regulator', label: 'Permit defense', sub: 'Hydrology, springs, cumulative model' },
  { id: 'buyer', label: 'Market access', sub: 'Passport, APIs, FEOC-clean chain' },
] as const

export function ExecutiveView({ esg }: ExecutiveViewProps) {
  const [activeTab, setActiveTab] = useState<ExecTab>('financials')

  const bottomMetrics = [
    { label: 'Pre-Tax NPV', value: `$${PROJECT_FINANCIALS.npv_pretax_consensus_m}M–$${(PROJECT_FINANCIALS.npv_pretax_forecast_m / 1000).toFixed(1)}B`, sub: 'PFS Jul 2025' },
    { label: 'IRR', value: `${PROJECT_FINANCIALS.irr_pretax_consensus_pct}–${PROJECT_FINANCIALS.irr_pretax_forecast_pct}%`, sub: 'Pre-tax range' },
    { label: 'CAPEX', value: `$${PROJECT_FINANCIALS.capex_m}M`, sub: '~94% funded' },
    { label: 'ESG Score', value: `${esg.overall}`, sub: 'Composite readiness' },
    { label: 'Payback', value: `<${PROJECT_FINANCIALS.payback_yrs} yrs`, sub: 'Permit-dependent' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{
        display: 'flex', flexDirection: 'column',
        height: '100%', overflow: 'hidden', padding: '12px 14px', gap: 10,
      }}
    >
      {/* Top bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: W.text1, letterSpacing: '-0.01em' }}>
            Caldeira Value Release · Board Decision Framework
          </h2>
          <p style={{ margin: 0, fontSize: 11, color: W.text4, marginTop: 1 }}>
            Meteoric Resources (ASX:MEI) · financial visibility, ESG readiness, and partnership options
          </p>
        </div>
        <div style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
          <EsgScoreRing esg={esg} compact />
          <StatusChip label="Pilot Ready" variant="green" dot />
          <StatusChip label="LP Approved" variant="green" dot />
          <StatusChip label="Board Use Only" variant="amber" />
        </div>
      </div>

      {/* Main body: Map + Right panel */}
      <div style={{ flex: 1, display: 'flex', gap: 10, minHeight: 0 }}>
        {/* Left: Map + bottom strip */}
        <div style={{ flex: '1 1 0', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 8, minHeight: 0 }}>
          {/* Map hero */}
          <div style={{
            flex: 1, minHeight: 0, position: 'relative', overflow: 'hidden',
            borderRadius: 14,
            border: `1px solid ${TAB_COLOR[activeTab]}30`,
            boxShadow: `0 0 22px ${TAB_COLOR[activeTab]}14, inset 0 1px 0 rgba(255,255,255,0.04)`,
            transition: 'border-color 0.4s, box-shadow 0.4s',
          }}>
            {/* Map header overlay */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '8px 12px',
              background: 'linear-gradient(to bottom, rgba(6,6,16,0.88), transparent)',
              zIndex: 10, pointerEvents: 'none',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <GlowingIcon
                  icon={activeTab === 'financials' ? DollarSign : activeTab === 'readiness' ? ShieldCheck : Briefcase}
                  color={activeTab === 'financials' ? 'green' : activeTab === 'readiness' ? 'violet' : 'amber'}
                  size={11}
                />
                <span style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: W.text3,
                  transition: 'color 0.3s',
                }}>
                  {MAP_HEADER_TEXT[activeTab]}
                </span>
              </div>
            </div>

            <MapBase id="execField" initialViewState={EXEC_VIEW_STATE}>
              <CaldeiraBoundary />
              <EnvironmentalOverlay />
              <DepositOverlay />
              <LicenseOverlay />
              <InfraOverlay />
            </MapBase>

            {/* Map overlay badge */}
            <div style={{
              position: 'absolute', bottom: 10, left: 12, zIndex: 10,
              display: 'flex', gap: 8, pointerEvents: 'none', alignItems: 'center',
            }}>
              <div style={{ padding: '4px 9px', borderRadius: 6, background: 'rgba(6,6,16,0.85)', backdropFilter: 'blur(8px)', border: `1px solid ${W.violet}40` }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: W.violet, letterSpacing: '0.10em', textTransform: 'uppercase' }}>
                  1.5 Bt MRE · 193 km² · 77 Licences
                </span>
              </div>
            </div>
          </div>

          {/* Bottom KPI strip */}
          <div style={{ flexShrink: 0 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
              {bottomMetrics.map(({ label, value, sub }) => (
                <GlassCard key={label} animate={false} style={{ padding: '8px 12px' }}>
                  <div style={{ fontSize: 10, color: W.text3, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 3 }}>
                    {label}
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: W.text1, fontFamily: 'var(--font-mono)', letterSpacing: '-0.01em' }}>
                    {value}
                  </div>
                  <div style={{ fontSize: 10, color: W.text4, marginTop: 2 }}>{sub}</div>
                </GlassCard>
              ))}
            </div>
          </div>
        </div>

        {/* Right panel (400px) */}
        <div style={{ width: 400, display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0, minHeight: 0 }}>
          {/* Tab switcher */}
          <div style={{
            display: 'flex', background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10,
            padding: 3, gap: 2, flexShrink: 0,
          }}>
            {TAB_ITEMS.map(({ id, label, icon: Icon, color }) => {
              const isActive = activeTab === id
              return (
                <button key={id} onClick={() => setActiveTab(id)} style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: 5, padding: '6px 8px', borderRadius: 7, border: 'none',
                  cursor: 'pointer', position: 'relative', outline: 'none',
                  background: 'transparent', transition: 'background 0.2s',
                  minWidth: 0,
                }}>
                  {isActive && (
                    <motion.div
                      layoutId="exec-tab-pill"
                      style={{
                        position: 'absolute', inset: 0, borderRadius: 7,
                        background: `linear-gradient(135deg, ${color}22, ${color}0F)`,
                        border: `1px solid ${color}35`,
                        boxShadow: `0 0 8px ${color}18`,
                      }}
                      transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                    />
                  )}
                  <Icon size={11} style={{
                    color: isActive ? color : W.text4,
                    filter: isActive ? `drop-shadow(0 0 3px ${color}80)` : undefined,
                    zIndex: 1, flexShrink: 0,
                  }}/>
                  <span style={{
                    fontSize: 10, fontWeight: 600, zIndex: 1,
                    color: isActive ? W.text1 : W.text4,
                    whiteSpace: 'nowrap',
                  }}>
                    {label}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Headline card */}
          <GlassCard glow="violet" animate={false} style={{ padding: '12px 14px', flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
            <motion.div
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'absolute', top: -30, right: -30,
                width: 120, height: 120, borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(124,92,252,0.12) 0%, transparent 70%)',
                pointerEvents: 'none',
              }}
            />
            <div style={{ position: 'relative' }}>
              <p style={{ margin: '0 0 4px', fontSize: 10, fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: W.violet }}>
                Meteoric Resources ASX:MEI
              </p>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: W.text1, lineHeight: 1.2, letterSpacing: '-0.02em' }}>
                Caldeira Value Release
                <br />
                <span style={{ background: `linear-gradient(135deg, ${W.violetSoft}, ${W.cyan})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  Board Decision Framework
                </span>
              </h3>
              <p style={{ margin: '6px 0 0', fontSize: 11, color: W.text3, lineHeight: 1.5 }}>
                {BOARD_NARRATIVE.board_prompt}
              </p>
            </div>
          </GlassCard>

          {/* Tab content */}
          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <AnimatePresence mode="wait">
              {activeTab === 'financials' && (
                <motion.div key="financials" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>

                  {/* Value at Risk */}
                  <GlassCard animate={false} style={{ padding: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                      <GlowingIcon icon={AlertTriangle} color="red" size={13} />
                      <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: W.text3 }}>
                        Value at Risk
                      </span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7 }}>
                      {BOARD_VALUE_AT_RISK.map(({ label, value, sub, color }) => (
                        <div key={label} style={{
                          padding: '8px 10px', borderRadius: 8,
                          background: color === W.red ? 'rgba(255,77,77,0.06)' : color === W.amber ? 'rgba(245,166,35,0.06)' : 'rgba(255,255,255,0.025)',
                          border: `1px solid ${color === W.red ? 'rgba(255,77,77,0.18)' : color === W.amber ? 'rgba(245,166,35,0.18)' : 'rgba(255,255,255,0.06)'}`,
                        }}>
                          <div style={{ fontSize: 10, color: W.text4, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
                            {label}
                          </div>
                          <div style={{ fontSize: 15, fontWeight: 800, color, fontFamily: 'var(--font-mono)', marginBottom: 3 }}>
                            {value}
                          </div>
                          <div style={{ fontSize: 10, color: W.text4, lineHeight: 1.4 }}>{sub}</div>
                        </div>
                      ))}
                    </div>
                  </GlassCard>

                  {/* Financial metrics */}
                  <GlassCard glow="green" animate={false} style={{ padding: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                      <GlowingIcon icon={DollarSign} color="green" size={13} />
                      <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: W.text3 }}>
                        The Trap: Premium Asset, Frictional Exit
                      </span>
                      <StatusChip label="Board Priority" variant="red" />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7, marginBottom: 10 }}>
                      {FINANCIAL_METRICS.map(({ label, value, sub, color }) => (
                        <div key={label} style={{ padding: '8px 10px', background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8 }}>
                          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: W.text4, marginBottom: 3 }}>
                            {label}
                          </div>
                          <div style={{ fontSize: 14, fontWeight: 800, color, fontFamily: 'var(--font-mono)', marginBottom: 2 }}>
                            {value}
                          </div>
                          <div style={{ fontSize: 10, color: W.text4, lineHeight: 1.4 }}>{sub}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ padding: '8px 10px', background: 'rgba(255,77,77,0.06)', border: '1px solid rgba(255,77,77,0.18)', borderRadius: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                        <AlertTriangle size={11} style={{ color: W.red, marginTop: 1, flexShrink: 0 }} />
                        <p style={{ margin: 0, fontSize: 11, color: W.text3, lineHeight: 1.5 }}>
                          If installation licensing drifts, if reagent provenance is opaque, or if compliance proof remains manual, then Caldeira's free cash flow is delayed even with world-class geology and metallurgy.
                        </p>
                      </div>
                    </div>
                  </GlassCard>

                  {/* Funding & Timeline */}
                  <GlassCard animate={false} style={{ padding: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                      <GlowingIcon icon={BarChart3} color="green" size={13} />
                      <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: W.text3 }}>
                        Funding & Milestones
                      </span>
                    </div>
                    <div style={{ padding: '8px 10px', background: 'rgba(34,214,138,0.06)', border: '1px solid rgba(34,214,138,0.18)', borderRadius: 8, marginBottom: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                        <span style={{ fontSize: 11, color: W.green, fontWeight: 700 }}>Funding Secured</span>
                        <span style={{ fontSize: 14, fontWeight: 800, color: W.green, fontFamily: 'var(--font-mono)' }}>~94%</span>
                      </div>
                      <div style={{ display: 'flex', gap: 10, fontSize: 10, color: W.text3 }}>
                        <span>EXIM US${PROJECT_FINANCIALS.exim_usd_m}M</span>
                        <span>EFA A${PROJECT_FINANCIALS.efa_aud_m}M</span>
                        <span>vs CAPEX ${PROJECT_FINANCIALS.capex_m}M</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                      {PROJECT_TIMELINE.map(({ milestone, date, status, detail }) => (
                        <div key={milestone} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{
                            width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
                            background: status === 'completed' ? W.green : status === 'active' ? W.violet : 'rgba(255,255,255,0.15)',
                            boxShadow: status === 'completed' ? `0 0 5px ${W.green}80` : status === 'active' ? `0 0 5px ${W.violet}80` : 'none',
                          }} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 4 }}>
                              <span style={{ fontSize: 10, fontWeight: 600, color: status === 'completed' ? W.green : status === 'active' ? W.violetSoft : W.text3 }}>{milestone}</span>
                              <span style={{ fontSize: 10, color: W.text4, fontFamily: 'var(--font-mono)', flexShrink: 0 }}>{date}</span>
                            </div>
                            <div style={{ fontSize: 10, color: W.text4, lineHeight: 1.3 }}>{detail}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </GlassCard>

                  {/* Resource Classification */}
                  <GlassCard animate={false} style={{ padding: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                      <GlowingIcon icon={BarChart3} color="amber" size={13} />
                      <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: W.text3 }}>
                        Resource Waterfall
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {[
                        { label: 'Global Resource', value: `${RESOURCE_CLASSIFICATION.global_bt} Bt`, grade: `${RESOURCE_CLASSIFICATION.global_treo_ppm.toLocaleString()} ppm`, pct: 100, color: W.amber },
                        { label: 'Measured & Indicated', value: `${RESOURCE_CLASSIFICATION.mi_mt} Mt`, grade: `${RESOURCE_CLASSIFICATION.mi_treo_ppm.toLocaleString()} ppm`, pct: (RESOURCE_CLASSIFICATION.mi_mt / (RESOURCE_CLASSIFICATION.global_bt * 1000)) * 100, color: W.violetSoft },
                        { label: 'Measured', value: `${RESOURCE_CLASSIFICATION.measured_mt} Mt`, grade: `${RESOURCE_CLASSIFICATION.measured_treo_ppm.toLocaleString()} ppm`, pct: (RESOURCE_CLASSIFICATION.measured_mt / (RESOURCE_CLASSIFICATION.global_bt * 1000)) * 100, color: W.green },
                      ].map(({ label, value, grade, pct, color }) => (
                        <div key={label}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                            <span style={{ fontSize: 10, color: W.text3 }}>{label}</span>
                            <span style={{ fontSize: 11, fontWeight: 700, color, fontFamily: 'var(--font-mono)' }}>{value} @ {grade}</span>
                          </div>
                          <div style={{ height: 5, background: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' }}>
                            <motion.div
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                              style={{ height: '100%', background: `linear-gradient(90deg, ${color}60, ${color})`, borderRadius: 3 }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop: 8, display: 'flex', gap: 12, fontSize: 10, color: W.text4 }}>
                      <span>{RESOURCE_CLASSIFICATION.deposits_count} deposits</span>
                      <span>{RESOURCE_CLASSIFICATION.mreo_avg_pct}% MREO avg</span>
                      <span>{RESOURCE_CLASSIFICATION.drill_holes_total}+ drill holes</span>
                    </div>
                  </GlassCard>

                  {/* Revenue Protection */}
                  <GlassCard animate={false} style={{ padding: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                      <GlowingIcon icon={TrendingUp} color="green" size={13} />
                      <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: W.text3 }}>
                        Revenue Protection
                      </span>
                    </div>
                    <div style={{ marginBottom: 12 }}>
                      <GreenPremiumCard compact />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                      {[
                        { label: 'FJH energy savings', value: '87%', color: W.violet },
                        { label: 'Carbon delta vs China', value: '-84%', color: W.green },
                        { label: 'NdPr opex', value: '$8.91/kg', color: W.cyan },
                        { label: 'Passport conversion risk', value: 'Now visible', color: W.amber },
                      ].map(({ label, value, color }) => (
                        <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: 11, color: W.text3 }}>{label}</span>
                          <span style={{ fontSize: 12, fontWeight: 700, color, fontFamily: 'var(--font-mono)' }}>{value}</span>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                </motion.div>
              )}

              {activeTab === 'readiness' && (
                <motion.div key="readiness" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>

                  {/* Readiness Gauges */}
                  <GlassCard animate={false} style={{ padding: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                      <GaugeChart value={94} label="Funding" sublabel={`$${PROJECT_FINANCIALS.exim_usd_m + 50}M / $${PROJECT_FINANCIALS.capex_m}M`} color={W.green} size={72} strokeWidth={5} />
                      <GaugeChart value={75} label="DFS Progress" sublabel="Ausenco mid-2026" color={W.violet} size={72} strokeWidth={5} />
                      <GaugeChart value={100} label="LP Status" sublabel="Approved" color={W.green} size={72} strokeWidth={5} />
                    </div>
                  </GlassCard>

                  {/* Solution Fit / ESG */}
                  <GlassCard glow="violet" animate={false} style={{ padding: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                      <GlowingIcon icon={ShieldCheck} color="green" size={13} />
                      <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: W.text3 }}>
                        Solution Fit
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {BOARD_PILLARS.map(({ id, label, sub }) => {
                        const score = esg[id as keyof EsgScore] as number
                        const color = score >= 90 ? W.green : score >= 75 ? W.amber : W.red
                        return (
                          <div key={id}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                              <div>
                                <div style={{ fontSize: 11, fontWeight: 600, color: W.text1 }}>{label}</div>
                                <div style={{ fontSize: 10, color: W.text4 }}>{sub}</div>
                              </div>
                              <span style={{ fontSize: 18, fontWeight: 700, color, fontFamily: 'var(--font-mono)' }}>{score}</span>
                            </div>
                            <div style={{ height: 5, background: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' }}>
                              <motion.div
                                animate={{ width: `${score}%` }}
                                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                style={{ height: '100%', background: `linear-gradient(90deg, ${color}80, ${color})`, borderRadius: 3 }}
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    <div style={{ marginTop: 14, padding: '8px 10px', background: 'rgba(34,214,138,0.07)', border: '1px solid rgba(34,214,138,0.2)', borderRadius: 8 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 11, color: W.green, fontWeight: 700 }}>Overall readiness</span>
                        <span style={{ fontSize: 22, fontWeight: 800, color: W.green, fontFamily: 'var(--font-mono)' }}>{esg.overall}</span>
                      </div>
                    </div>
                  </GlassCard>

                  {/* Security & Sovereignty */}
                  <GlassCard animate={false} style={{ padding: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                      <GlowingIcon icon={LockKeyhole} color="cyan" size={13} />
                      <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: W.text3 }}>
                        Security & Sovereignty Brief
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                      {CYBER_TRUST_PILLARS.map((pillar) => (
                        <div key={pillar.title} style={{ padding: '7px 9px', borderRadius: 7, background: 'rgba(0,212,200,0.05)', border: '1px solid rgba(0,212,200,0.16)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 3 }}>
                            <span style={{ fontSize: 11, color: W.text1, fontWeight: 700 }}>{pillar.title}</span>
                            <StatusChip label={pillar.status} variant="green" size="sm" />
                          </div>
                          <div style={{ fontSize: 11, color: W.text3, lineHeight: 1.45 }}>{pillar.detail}</div>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                </motion.div>
              )}

              {activeTab === 'strategy' && (
                <motion.div key="strategy" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>

                  {/* Countdown / Timing */}
                  <GlassCard glow="amber" animate={false} style={{ padding: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                      <GlowingIcon icon={BarChart3} color="amber" size={13} />
                      <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: W.text3 }}>
                        Clock Is Ticking
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                      <div style={{ textAlign: 'center' }}>
                        <p style={{ margin: '0 0 6px', fontSize: 10, color: W.amber, fontWeight: 600 }}>US DoD — Jan 1, 2027</p>
                        <CountdownTimer targetDate="2027-01-01T00:00:00Z" label="Defense sourcing cutoff" color="amber" />
                      </div>
                      <div style={{ width: 1, height: 50, background: 'rgba(255,255,255,0.06)' }} />
                      <div style={{ textAlign: 'center' }}>
                        <p style={{ margin: '0 0 6px', fontSize: 10, color: W.violetSoft, fontWeight: 600 }}>EU DBP — Feb 18, 2027</p>
                        <CountdownTimer targetDate="2027-02-18T00:00:00Z" label="Battery passport mandate" color="violet" />
                      </div>
                    </div>
                    <div style={{ marginTop: 12, padding: '7px 9px', background: 'rgba(124,92,252,0.07)', border: '1px solid rgba(124,92,252,0.18)', borderRadius: 8 }}>
                      <p style={{ margin: 0, fontSize: 11, color: W.text3, lineHeight: 1.45 }}>
                        Prototype asks the board to choose a structure now, before compliance becomes a bottleneck to offtake monetization.
                      </p>
                    </div>
                  </GlassCard>

                  {/* Deal Scenarios */}
                  <GlassCard animate={false} style={{ padding: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                      <GlowingIcon icon={TrendingUp} color="violet" size={13} />
                      <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: W.text3 }}>
                        Partnership Options
                      </span>
                      <StatusChip label="Choose one" variant="violet" />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {DEAL_SCENARIOS.map((scenario) => (
                        <div key={scenario.title} style={{
                          padding: '10px 12px', borderRadius: 9,
                          background: scenario.status === 'low-friction'
                            ? 'rgba(34,214,138,0.06)'
                            : scenario.status === 'strategic'
                              ? 'rgba(124,92,252,0.06)'
                              : 'rgba(245,166,35,0.06)',
                          border: `1px solid ${scenario.status === 'low-friction'
                            ? 'rgba(34,214,138,0.18)'
                            : scenario.status === 'strategic'
                              ? 'rgba(124,92,252,0.18)'
                              : 'rgba(245,166,35,0.18)'}`,
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'flex-start', marginBottom: 6 }}>
                            <div style={{ fontSize: 11, fontWeight: 700, color: W.text1 }}>{scenario.title}</div>
                            <StatusChip
                              label={scenario.tag}
                              variant={scenario.status === 'low-friction' ? 'green' : scenario.status === 'strategic' ? 'violet' : 'amber'}
                              size="sm"
                            />
                          </div>
                          <div style={{ fontSize: 11, color: W.text2, fontWeight: 600, marginBottom: 4 }}>
                            {scenario.economics}
                          </div>
                          <div style={{ fontSize: 11, color: W.text3, lineHeight: 1.45, marginBottom: 6 }}>
                            {scenario.rationale}
                          </div>
                          <div style={{ fontSize: 10, color: W.text4, lineHeight: 1.4 }}>
                            Board outcome: {scenario.board_outcome}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop: 10, padding: '7px 9px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8 }}>
                      <p style={{ margin: 0, fontSize: 11, color: W.text3, lineHeight: 1.45 }}>
                        {BOARD_NARRATIVE.partnership_prompt}
                      </p>
                    </div>
                  </GlassCard>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
