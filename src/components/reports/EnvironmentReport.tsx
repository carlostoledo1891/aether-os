import { memo } from 'react'
import {
  Droplets, Shield, TreePine, Users, CheckCircle, Clock,
  AlertTriangle, Leaf, Waves, MapPin,
} from 'lucide-react'
import type { TimeRange } from './reportTheme'
import { WL } from './reportTheme'
import { SPRING_COUNT } from '../../data/domain/thresholds'

interface Props { range: TimeRange }

/* ─── Data ─────────────────────────────────────────────────────────────── */

const PERMITTING_TIMELINE = [
  { milestone: 'EIS Submitted', date: 'May 2024', status: 'completed' as const },
  { milestone: 'LP Approved (Unanimous)', date: 'Dec 2025', status: 'completed' as const },
  { milestone: 'LI Application Lodged', date: 'Q1 2026', status: 'active' as const },
  { milestone: 'LI Approval Target', date: 'Jun 2026', status: 'pending' as const },
  { milestone: 'Operation License', date: 'Dec 2026', status: 'pending' as const },
]

const SUSTAINABILITY_METRICS = [
  { icon: Leaf, label: 'Dry Stack Tailings', detail: 'Zero conventional tailings dam — eliminates primary environmental risk vector', color: WL.green },
  { icon: Waves, label: '95% Water Recirculation', detail: 'Closed-loop process minimizes freshwater demand and effluent discharge', color: WL.cyan },
  { icon: TreePine, label: '100% Renewable Grid', detail: 'Brazilian grid (85%+ renewable). Zero Scope 2 emissions from grid electricity', color: WL.green },
  { icon: Shield, label: 'Dry Backfill Strategy', detail: 'Mined-out areas progressively rehabilitated with dry tailings and topsoil', color: WL.violet },
]

const WATER_QUALITY = [
  { param: 'Sulfate', value: 12, unit: 'ppm', threshold: 250, status: 'Normal' as const },
  { param: 'Nitrate', value: 3.2, unit: 'ppm', threshold: 50, status: 'Normal' as const },
  { param: 'pH (Groundwater)', value: 6.8, unit: '', threshold: 9.0, status: 'Normal' as const },
  { param: 'Radiation (UDC)', value: 0.14, unit: 'μSv/h', threshold: 0.5, status: 'Normal' as const },
]

const SPRING_DISTRIBUTION = [
  { tier: 'Active', count: 917, pct: 84 },
  { tier: 'Reduced', count: 131, pct: 12 },
  { tier: 'Suppressed', count: 44, pct: 4 },
]

import { SECTION_STYLE as sectionStyle, CARD_STYLE as cardStyle } from './reportPrimitivesHelpers'
import { ReportSectionTitle } from './ReportPrimitives'

const sectionTitle = (text: string) => <ReportSectionTitle>{text}</ReportSectionTitle>

const statusColor = (s: string) =>
  s === 'completed' ? WL.green : s === 'active' ? WL.violet : WL.text4

const StatusIcon = ({ status }: { status: string }) => {
  if (status === 'completed') return <CheckCircle size={14} style={{ color: WL.green }} />
  if (status === 'active') return <Clock size={14} style={{ color: WL.violet }} />
  return <AlertTriangle size={14} style={{ color: WL.text4 }} />
}

/* ─── Component ────────────────────────────────────────────────────────── */

function EnvironmentReport({ range: _range }: Props) {
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
            background: `${WL.cyan}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <TreePine size={16} style={{ color: WL.cyan }} />
          </div>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: WL.text4 }}>
            Environmental & Community Report
          </span>
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em', margin: '0 0 6px', color: WL.text1 }}>
          Caldeira Rare Earths Project
        </h1>
        <p style={{ fontSize: 13, color: WL.text3, margin: 0, maxWidth: 600, lineHeight: 1.5 }}>
          Comprehensive environmental monitoring, community engagement, and permitting status
          for the Caldeira alkaline complex in Poços de Caldas, Minas Gerais.
        </p>
      </div>

      {/* APA & Buffer Zone */}
      <div style={sectionStyle}>
        {sectionTitle('APA & Buffer Zone Compliance')}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <MapPin size={14} style={{ color: WL.violet }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: WL.text2, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                APA Pedra Branca
              </span>
            </div>
            <p style={{ fontSize: 12, color: WL.text3, margin: 0, lineHeight: 1.6 }}>
              Environmental Protection Area overlapping the Caldeira alkaline complex.
              All mining licences operate within approved buffer zone boundaries.
              IBAMA consultation for APA buffer scheduled — pre-submission completed.
            </p>
          </div>
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Shield size={14} style={{ color: WL.green }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: WL.text2, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Buffer Zone Status
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { label: 'Licence Zones in Buffer', value: '7' },
                { label: 'Total Licence Area', value: '51 km²' },
                { label: 'Buffer Compliance', value: '100%' },
                { label: 'FEAM Status', value: 'Approved' },
              ].map(m => (
                <div key={m.label}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: WL.text1, letterSpacing: '-0.02em' }}>{m.value}</div>
                  <div style={{ fontSize: 10, color: WL.text3, marginTop: 2 }}>{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Water Quality */}
      <div style={sectionStyle}>
        {sectionTitle('Water Quality Monitoring')}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          {WATER_QUALITY.map(wq => (
            <div key={wq.param} style={cardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: WL.text2 }}>{wq.param}</span>
                <span style={{
                  fontSize: 9, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
                  padding: '2px 8px', borderRadius: WL.radius.xs,
                  background: WL.greenSubtle, color: WL.green,
                }}>
                  {wq.status}
                </span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: WL.text1, letterSpacing: '-0.02em' }}>
                {wq.value}
                <span style={{ fontSize: 12, fontWeight: 500, color: WL.text3, marginLeft: 4 }}>{wq.unit}</span>
              </div>
              {/* Progress bar showing value vs threshold */}
              <div style={{ marginTop: 10 }}>
                <div style={{
                  height: 4, borderRadius: 2, background: WL.border,
                  overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%', borderRadius: 2,
                    width: `${Math.min(100, (wq.value / wq.threshold) * 100)}%`,
                    background: WL.green,
                    transition: 'width 0.3s',
                  }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                  <span style={{ fontSize: 9, color: WL.text4 }}>Current</span>
                  <span style={{ fontSize: 9, color: WL.text4 }}>Threshold: {wq.threshold}{wq.unit}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Forecast Compliance Outlook */}
      <div style={sectionStyle}>
        {sectionTitle('Forecast Compliance Outlook')}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
          {([
            { horizon: '30 Day', status: 'Within Threshold' },
            { horizon: '60 Day', status: 'Within Threshold' },
            { horizon: '90 Day', status: 'Within Threshold' },
          ] as const).map(fc => (
            <div key={fc.horizon} style={cardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: WL.text2 }}>{fc.horizon}</span>
                <span style={{
                  fontSize: 9, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
                  padding: '2px 8px', borderRadius: WL.radius.xs,
                  background: WL.greenSubtle, color: WL.green,
                }}>
                  {fc.status}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{
                  width: 8, height: 8, borderRadius: '50%', background: WL.green, flexShrink: 0,
                }} />
                <span style={{ fontSize: 12, color: WL.text3 }}>
                  Forecasted water quality parameters remain within regulatory thresholds
                </span>
              </div>
            </div>
          ))}
        </div>
        <div style={{
          padding: '10px 14px', borderRadius: WL.radius.sm,
          background: WL.glass04, border: `1px solid ${WL.border}`,
          fontSize: 10, color: WL.text4, lineHeight: 1.6, fontStyle: 'italic',
        }}>
          AI-predicted based on Open-Meteo forecast and ECMWF ERA5 historical baseline. Indicative only — does not replace regulatory monitoring.
        </div>
      </div>

      {/* Springs Monitoring */}
      <div style={sectionStyle}>
        {sectionTitle('Springs Monitoring Network')}
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 16 }}>
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Droplets size={14} style={{ color: WL.cyan }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: WL.text2, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Total Springs
              </span>
            </div>
            <div style={{ fontSize: 42, fontWeight: 800, color: WL.text1, letterSpacing: '-0.03em', lineHeight: 1 }}>
              {SPRING_COUNT.toLocaleString()}
            </div>
            <div style={{ fontSize: 11, color: WL.text3, marginTop: 6 }}>
              Reference points catalogued from FBDS/CAR geometry
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {SPRING_DISTRIBUTION.map(s => (
              <div key={s.tier} style={{
                ...cardStyle,
                display: 'flex', alignItems: 'center', gap: 16,
                padding: '14px 20px',
              }}>
                <div style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: s.tier === 'Active' ? WL.green : s.tier === 'Reduced' ? WL.amber : WL.red,
                  flexShrink: 0,
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: WL.text1 }}>{s.tier}</div>
                  <div style={{ fontSize: 11, color: WL.text3 }}>{s.count} springs</div>
                </div>
                <div style={{
                  fontSize: 14, fontWeight: 700, color: WL.text1,
                  fontFamily: 'var(--font-mono)',
                }}>
                  {s.pct}%
                </div>
                <div style={{
                  width: 80, height: 6, borderRadius: 3, background: WL.border,
                  overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%', borderRadius: 3,
                    width: `${s.pct}%`,
                    background: s.tier === 'Active' ? WL.green : s.tier === 'Reduced' ? WL.amber : WL.red,
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Permitting Timeline */}
      <div style={sectionStyle}>
        {sectionTitle('Permitting & Licensing Timeline')}
        <div style={{ position: 'relative', paddingLeft: 28 }}>
          {/* Vertical line */}
          <div style={{
            position: 'absolute', left: 7, top: 6, bottom: 6,
            width: 2, background: WL.border,
          }} />
          {PERMITTING_TIMELINE.map((item, i) => (
            <div key={i} style={{
              position: 'relative',
              marginBottom: i < PERMITTING_TIMELINE.length - 1 ? 24 : 0,
              display: 'flex', alignItems: 'flex-start', gap: 16,
            }}>
              {/* Node */}
              <div style={{
                position: 'absolute', left: -24,
                width: 16, height: 16, borderRadius: '50%',
                background: item.status === 'completed' ? WL.green
                  : item.status === 'active' ? WL.violet : WL.border,
                border: `2px solid ${WL.bg}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <StatusIcon status={item.status} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: statusColor(item.status) }}>
                    {item.milestone}
                  </span>
                  <span style={{
                    fontSize: 10, fontWeight: 600, color: WL.text4,
                    fontFamily: 'var(--font-mono)',
                  }}>
                    {item.date}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Community Engagement */}
      <div style={sectionStyle}>
        {sectionTitle('Community Engagement')}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          <div style={{
            ...cardStyle,
            background: `linear-gradient(135deg, ${WL.violet}08, ${WL.violet}04)`,
            border: `1px solid ${WL.violet}20`,
          }}>
            <Users size={18} style={{ color: WL.violet, marginBottom: 10 }} />
            <div style={{ fontSize: 36, fontWeight: 800, color: WL.text1, letterSpacing: '-0.03em', lineHeight: 1 }}>
              89%
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, color: WL.text2, marginTop: 6 }}>
              Social Acceptance Rate
            </div>
            <div style={{ fontSize: 11, color: WL.text3, marginTop: 4, lineHeight: 1.5 }}>
              Community survey conducted across project-adjacent municipalities
            </div>
          </div>
          {[
            { label: 'Public Hearings', value: '12+', detail: 'Sessions conducted with local stakeholders' },
            { label: 'Jobs (Construction)', value: '1,200', detail: 'Peak construction employment' },
            { label: 'Jobs (Operations)', value: '600+', detail: 'Permanent operational roles' },
          ].map(m => (
            <div key={m.label} style={cardStyle}>
              <div style={{ fontSize: 24, fontWeight: 800, color: WL.text1, letterSpacing: '-0.02em' }}>{m.value}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: WL.text2, marginTop: 4 }}>{m.label}</div>
              <div style={{ fontSize: 11, color: WL.text3, marginTop: 4 }}>{m.detail}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Sustainability */}
      <div style={{ ...sectionStyle, borderBottom: 'none' }}>
        {sectionTitle('Sustainability Design')}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
          {SUSTAINABILITY_METRICS.map(s => {
            const Icon = s.icon
            return (
              <div key={s.label} style={{
                ...cardStyle,
                display: 'flex', gap: 14,
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: WL.radius.sm, flexShrink: 0,
                  background: `${s.color}12`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={16} style={{ color: s.color }} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: WL.text1 }}>{s.label}</div>
                  <div style={{ fontSize: 11, color: WL.text3, marginTop: 3, lineHeight: 1.5 }}>{s.detail}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Disclaimer */}
      <div style={{
        padding: '16px 40px',
        background: WL.panel,
        borderTop: `1px solid ${WL.border}`,
        fontSize: 10, color: WL.text4, lineHeight: 1.6,
        fontFamily: 'var(--font-ui)',
      }}>
        This report contains a mix of verified field data, publicly available spatial datasets (FBDS, CAR, ANA), and illustrative
        monitoring scenarios. Some values are modelled or projected. See VeroChain data provenance layer for per-metric source classification.
      </div>
    </div>
  )
}

export default memo(EnvironmentReport)
