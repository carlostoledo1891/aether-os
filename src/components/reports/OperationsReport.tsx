import { memo } from 'react'
import {
  Factory, TrendingUp, DollarSign, Pickaxe,
  Layers, Timer, BarChart3, Gauge,
} from 'lucide-react'
import type { TimeRange } from './reportTheme'
import { WL } from './reportTheme'
import { PROJECT_FINANCIALS, SCENARIOS } from '../../data/domain/financials'
import { PILOT_PLANT_PERFORMANCE } from '../../data/domain/plant'

interface Props { range: TimeRange }

/* ─── Constants ────────────────────────────────────────────────────────── */

const PF = PROJECT_FINANCIALS
const PP = PILOT_PLANT_PERFORMANCE

const CAPEX_BREAKDOWN = [
  { category: 'Process Plant Equipment', value: 185, pct: 42 },
  { category: 'Structural & Civil', value: 75, pct: 17 },
  { category: 'Construction', value: 62, pct: 14 },
  { category: 'Indirect Costs', value: 53, pct: 12 },
  { category: 'Mining Pre-strip', value: 35, pct: 8 },
  { category: 'Contingency', value: 33, pct: 7 },
]

const PROCESS_STEPS = [
  { step: 1, name: 'ROM Feed', detail: 'Vibratory feeder → belt conveyor → log washer', color: WL.amber },
  { step: 2, name: 'Scrubbing', detail: 'Trommel screen separation at 2mm cut', color: WL.amber },
  { step: 3, name: 'Leaching', detail: 'AMSUL ammonium sulfate leach at pH 4.0–5.0', color: WL.cyan },
  { step: 4, name: 'Precipitation', detail: 'NaOH precipitation of mixed REE carbonate', color: WL.cyan },
  { step: 5, name: 'Filtration', detail: 'Belt press filtration, moisture control', color: WL.violet },
  { step: 6, name: 'Drying', detail: 'Rotary dryer to specification moisture', color: WL.violet },
  { step: 7, name: 'MREC Product', detail: '>90% TREO grade — ready for separation', color: WL.green },
]

import { SECTION_STYLE as sectionStyle, CARD_STYLE as cardStyle } from './reportPrimitivesHelpers'
import { ReportSectionTitle } from './ReportPrimitives'

const sectionTitle = (text: string) => <ReportSectionTitle>{text}</ReportSectionTitle>

const metricBox = (value: string, label: string, accent?: string) => (
  <div style={cardStyle}>
    <div style={{
      fontSize: 26, fontWeight: 800, color: accent ?? WL.text1,
      letterSpacing: '-0.02em', lineHeight: 1, fontFamily: 'var(--font-mono)',
    }}>
      {value}
    </div>
    <div style={{ fontSize: 11, color: WL.text3, marginTop: 6, lineHeight: 1.4 }}>{label}</div>
  </div>
)

/* ─── Component ────────────────────────────────────────────────────────── */

function OperationsReport({ range: _range }: Props) {
  return (
    <div style={{ fontFamily: 'var(--font-ui)', color: WL.text1 }}>
      {/* Hero */}
      <div style={{
        padding: '48px 40px 32px',
        background: WL.surfaceHigh,
        borderBottom: `1px solid ${WL.border}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div style={{
            width: 32, height: 32, borderRadius: WL.radius.sm,
            background: `${WL.violet}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Factory size={16} style={{ color: WL.violet }} />
          </div>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: WL.text4 }}>
            Operations Report
          </span>
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em', margin: '0 0 6px', color: WL.text1 }}>
          Caldeira Rare Earths Project
        </h1>
        <p style={{ fontSize: 13, color: WL.text3, margin: 0, maxWidth: 600, lineHeight: 1.5 }}>
          Production forecasts, cost structure, mining physicals, and process flow
          for the 6.0 Mtpa MREC operation.
        </p>
      </div>

      {/* Production Summary */}
      <div style={sectionStyle}>
        {sectionTitle('Production Summary')}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
          {metricBox(`${PF.annual_treo_t.toLocaleString()} t`, 'Annual TREO Production', WL.violet)}
          {metricBox(`${PF.annual_ndpr_t.toLocaleString()} t`, 'Annual NdPr Oxide', WL.cyan)}
          {metricBox(`${PF.annual_dytb_t} t`, 'Annual DyTb Oxide')}
          {metricBox(`${PF.lom_treo_t.toLocaleString()} t`, 'LOM TREO (20 yr)')}
          {metricBox(`${PF.throughput_mtpa} Mtpa`, 'Throughput')}
          {metricBox(`${PF.mine_life_years} yrs`, 'Mine Life')}
        </div>
      </div>

      {/* Cost Curve */}
      <div style={sectionStyle}>
        {sectionTitle('Cost Structure')}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <DollarSign size={14} style={{ color: WL.green }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: WL.text2, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Operating Cost
              </span>
            </div>
            {/* C1 vs AISC comparison bar */}
            {[
              { label: 'C1 Cost', value: 7.0, max: 12 },
              { label: 'AISC', value: 9.0, max: 12 },
              { label: 'OpEx / kg TREO', value: PF.opex_per_kg, max: 12 },
            ].map(c => (
              <div key={c.label} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 500, color: WL.text2 }}>{c.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: WL.text1, fontFamily: 'var(--font-mono)' }}>
                    US${c.value.toFixed(2)}/kg
                  </span>
                </div>
                <div style={{ height: 8, borderRadius: 4, background: WL.border, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 4,
                    width: `${(c.value / c.max) * 100}%`,
                    background: `linear-gradient(90deg, ${WL.green}, ${WL.cyan})`,
                  }} />
                </div>
              </div>
            ))}
            <div style={{ fontSize: 10, color: WL.text4, marginTop: 8 }}>
              NdPr breakeven: US${SCENARIOS.consensus.breakeven_ndpr_kg}/kg (vs spot US$67/kg)
            </div>
          </div>

          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <TrendingUp size={14} style={{ color: WL.violet }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: WL.text2, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Revenue by Scenario
              </span>
            </div>
            {Object.values(SCENARIOS).map(s => (
              <div key={s.key} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 500, color: WL.text2 }}>{s.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: WL.text1, fontFamily: 'var(--font-mono)' }}>
                    US${s.annual_revenue_m}M/yr
                  </span>
                </div>
                <div style={{ height: 8, borderRadius: 4, background: WL.border, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 4,
                    width: `${(s.annual_revenue_m / 500) * 100}%`,
                    background: s.key === 'bull' ? WL.green
                      : s.key === 'consensus' ? WL.violet : WL.amber,
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mining Physicals */}
      <div style={sectionStyle}>
        {sectionTitle('Mining Physicals')}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
          {[
            { icon: Pickaxe, label: 'Strip Ratio', value: '0.12:1', detail: 'Waste:Ore — very low strip' },
            { icon: Layers, label: 'Clay Depth', value: '~23m avg', detail: 'Shallow ionic clay mineralization' },
            { icon: Gauge, label: 'Throughput', value: '6.0 Mtpa', detail: 'Process plant nameplate capacity' },
            { icon: Timer, label: 'Mine Life', value: '20 years', detail: 'Based on 1.54 Bt global resource' },
          ].map(m => {
            const Icon = m.icon
            return (
              <div key={m.label} style={{ ...cardStyle, display: 'flex', gap: 14 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: WL.radius.sm, flexShrink: 0,
                  background: `${WL.violet}10`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={16} style={{ color: WL.violet }} />
                </div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: WL.text1, letterSpacing: '-0.02em' }}>{m.value}</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: WL.text2, marginTop: 2 }}>{m.label}</div>
                  <div style={{ fontSize: 10, color: WL.text3, marginTop: 2 }}>{m.detail}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Process Flow */}
      <div style={sectionStyle}>
        {sectionTitle('Process Flow — AMSUL Leaching → MREC')}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {PROCESS_STEPS.map((ps, i) => (
            <div key={ps.step} style={{
              display: 'flex', alignItems: 'stretch', gap: 16,
            }}>
              {/* Step connector */}
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                width: 32, flexShrink: 0,
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: ps.color, color: WL.textInverse,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700, flexShrink: 0,
                }}>
                  {ps.step}
                </div>
                {i < PROCESS_STEPS.length - 1 && (
                  <div style={{ flex: 1, width: 2, background: WL.border, minHeight: 16 }} />
                )}
              </div>
              {/* Content */}
              <div style={{ paddingBottom: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: WL.text1 }}>{ps.name}</div>
                <div style={{ fontSize: 11, color: WL.text3, marginTop: 2 }}>{ps.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pilot Plant Performance */}
      <div style={sectionStyle}>
        {sectionTitle('Pilot Plant Performance')}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          {metricBox(`${PP.nameplate_kg_day} kg/d`, 'Nameplate Capacity')}
          {metricBox(`${PP.peak_kg_day} kg/d`, 'Peak Output', WL.green)}
          {metricBox(`${PP.mrec_mreo_pct}%`, 'MREC MREO Grade')}
          {metricBox(`${PP.avg_magnet_recovery_pct}%`, 'Avg Magnet RE Recovery', WL.violet)}
        </div>
        <div style={{ marginTop: 16 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${WL.border}` }}>
                <th style={{ textAlign: 'left', padding: '8px 12px', color: WL.text3, fontWeight: 600, fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Element</th>
                <th style={{ textAlign: 'right', padding: '8px 12px', color: WL.text3, fontWeight: 600, fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Pilot Recovery %</th>
                <th style={{ textAlign: 'right', padding: '8px 12px', color: WL.text3, fontWeight: 600, fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase' }}>ANSTO Recovery %</th>
              </tr>
            </thead>
            <tbody>
              {PP.recoveries.map(r => (
                <tr key={r.element} style={{ borderBottom: `1px solid ${WL.border}` }}>
                  <td style={{ padding: '8px 12px', fontWeight: 600, color: WL.text1 }}>{r.element}</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', fontFamily: 'var(--font-mono)', color: WL.text1 }}>{r.pilot_pct}%</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', fontFamily: 'var(--font-mono)', color: WL.text2 }}>{r.ansto_pct}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Financial Snapshot */}
      <div style={sectionStyle}>
        {sectionTitle('Financial Snapshot')}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
          {metricBox(`US$${PF.npv_pretax_consensus_m}M`, 'NPV₈ Pre-Tax (Consensus)', WL.violet)}
          {metricBox(`${PF.irr_pretax_consensus_pct}%`, 'IRR Pre-Tax (Consensus)', WL.green)}
          {metricBox(`${PF.payback_yrs} yrs`, 'Payback Period')}
          {metricBox(`US$${PF.capex_m}M`, 'Total CAPEX')}
        </div>
      </div>

      {/* CAPEX Breakdown */}
      <div style={{ ...sectionStyle, borderBottom: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
          <BarChart3 size={14} style={{ color: WL.violet }} />
          <h2 style={{ fontSize: 14, fontWeight: 700, color: WL.text1, margin: 0 }}>CAPEX Breakdown</h2>
        </div>
        {CAPEX_BREAKDOWN.map(c => (
          <div key={c.category} style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 12, fontWeight: 500, color: WL.text2 }}>{c.category}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: WL.text1, fontFamily: 'var(--font-mono)' }}>
                US${c.value}M ({c.pct}%)
              </span>
            </div>
            <div style={{ height: 10, borderRadius: 5, background: WL.border, overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 5,
                width: `${c.pct}%`,
                background: `linear-gradient(90deg, ${WL.violet}, ${WL.violetSoft})`,
              }} />
            </div>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <div style={{
        padding: '16px 40px',
        background: WL.panel,
        borderTop: `1px solid ${WL.border}`,
        fontSize: 10, color: WL.text4, lineHeight: 1.6,
        fontFamily: 'var(--font-ui)',
      }}>
        Financial figures sourced from Meteoric Resources Scoping Study (ASX announcement, 2024).
        All production and cost estimates are forward-looking and subject to Definitive Feasibility Study outcomes.
        VeroChain renders these as interactive reference data — not investment advice.
      </div>
    </div>
  )
}

export default memo(OperationsReport)
