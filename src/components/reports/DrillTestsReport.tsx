import { memo } from 'react'
import {
  Crosshair, FlaskConical, Mountain, Grid3X3,
} from 'lucide-react'
import type { TimeRange } from './reportTheme'
import { WL } from './reportTheme'
import { DEPOSIT_DATA, RESOURCE_CLASSIFICATION } from '../../data/domain/deposits'
import { LITHOLOGY_SUMMARY, PILOT_PLANT_PERFORMANCE } from '../../data/domain/plant'
import { LITH_COLORS, LITH_LABELS, LITH_ORDER } from '../charts/lithologyPalette'

interface Props { range: TimeRange }

const RC = RESOURCE_CLASSIFICATION

/* ─── JORC Resource Table (from Scoping Study Table 3) ─────────────── */

const JORC_TABLE = [
  { classification: 'Measured', mt: 37, treo_ppm: 2983, mreo_pct: 24, deposits: 'Capão do Mel (core)' },
  { classification: 'Indicated', mt: 629, treo_ppm: 2703, mreo_pct: 25, deposits: 'Soberbo, Figueira, Barra do Pacu, CDM' },
  { classification: 'Measured + Indicated', mt: 666, treo_ppm: 2685, mreo_pct: 24, deposits: '—' },
  { classification: 'Inferred', mt: 834, treo_ppm: 2100, mreo_pct: 23, deposits: 'Cupim Vermelho, Dona Maria 1 & 2, Others' },
  { classification: 'Total', mt: 1537, treo_ppm: 2359, mreo_pct: 24, deposits: '7 deposits + exploration targets' },
]

/* ─── RE Recovery to MREC (from Scoping Study Table 5) ─────────────── */

const RECOVERY_TABLE = [
  { element: 'La', recovery_pct: 68, contribution: 'Light REE' },
  { element: 'Ce', recovery_pct: 58, contribution: 'Light REE' },
  { element: 'Pr', recovery_pct: 71, contribution: 'Magnet RE' },
  { element: 'Nd', recovery_pct: 70, contribution: 'Magnet RE' },
  { element: 'Sm', recovery_pct: 58, contribution: 'Mid REE' },
  { element: 'Eu', recovery_pct: 46, contribution: 'Mid REE' },
  { element: 'Gd', recovery_pct: 55, contribution: 'Heavy REE' },
  { element: 'Tb', recovery_pct: 61, contribution: 'Magnet RE' },
  { element: 'Dy', recovery_pct: 56, contribution: 'Magnet RE' },
  { element: 'Ho', recovery_pct: 53, contribution: 'Heavy REE' },
  { element: 'Er', recovery_pct: 45, contribution: 'Heavy REE' },
  { element: 'Y',  recovery_pct: 55, contribution: 'Heavy REE' },
]

/* ─── Grade distribution by deposit ────────────────────────────────── */

const maxTreo = Math.max(...DEPOSIT_DATA.filter(d => d.treo_ppm > 0).map(d => d.treo_ppm))

import { SECTION_STYLE as sectionStyle, CARD_STYLE as cardStyle } from './reportPrimitivesHelpers'
import { ReportSectionTitle } from './ReportPrimitives'

const sectionTitle = (text: string) => <ReportSectionTitle>{text}</ReportSectionTitle>

const thStyle = {
  textAlign: 'left' as const, padding: '8px 12px',
  color: WL.text3, fontWeight: 600, fontSize: 10,
  letterSpacing: '0.06em', textTransform: 'uppercase' as const,
}

/* ─── Component ────────────────────────────────────────────────────────── */

function DrillTestsReport({ range: _range }: Props) {
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
            background: `${WL.blue}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Crosshair size={16} style={{ color: WL.blue }} />
          </div>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: WL.text4 }}>
            Drill Tests & Resource Report
          </span>
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em', margin: '0 0 6px', color: WL.text1 }}>
          Caldeira Rare Earths Project
        </h1>
        <p style={{ fontSize: 13, color: WL.text3, margin: 0, maxWidth: 600, lineHeight: 1.5 }}>
          JORC 2012 resource classification, drill results, grade distribution, rare earth recovery factors,
          and lithology across the Caldeira alkaline complex.
        </p>
      </div>

      {/* Global Resource Summary */}
      <div style={sectionStyle}>
        {sectionTitle('Global Mineral Resource')}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
          {[
            { value: `${RC.global_bt.toFixed(2)} Bt`, label: 'Global Resource', accent: WL.violet },
            { value: `${RC.global_treo_ppm}`, label: 'Avg TREO (ppm)' },
            { value: `${RC.mreo_avg_pct}%`, label: 'Avg MREO', accent: WL.green },
            { value: `${RC.deposits_count}`, label: 'Deposits' },
            { value: `${RC.drill_holes_total}+`, label: 'Total Drill Holes', accent: WL.blue },
            { value: `${RC.measured_mt} Mt`, label: 'Measured Resource' },
          ].map(m => (
            <div key={m.label} style={cardStyle}>
              <div style={{
                fontSize: 24, fontWeight: 800, color: m.accent ?? WL.text1,
                letterSpacing: '-0.02em', lineHeight: 1, fontFamily: 'var(--font-mono)',
              }}>
                {m.value}
              </div>
              <div style={{ fontSize: 11, color: WL.text3, marginTop: 6 }}>{m.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* JORC Resource Table */}
      <div style={sectionStyle}>
        {sectionTitle('JORC 2012 Resource Classification')}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${WL.border}` }}>
                <th style={thStyle}>Classification</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Tonnage (Mt)</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>TREO (ppm)</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>MREO (%)</th>
                <th style={thStyle}>Key Deposits</th>
              </tr>
            </thead>
            <tbody>
              {JORC_TABLE.map((row, i) => {
                const isTotal = row.classification === 'Total'
                const isSub = row.classification === 'Measured + Indicated'
                return (
                  <tr key={i} style={{
                    borderBottom: `1px solid ${WL.border}`,
                    background: isTotal ? `${WL.violet}06` : isSub ? `${WL.surface}` : 'transparent',
                    fontWeight: isTotal ? 700 : 400,
                  }}>
                    <td style={{ padding: '10px 12px', color: WL.text1, fontWeight: isTotal || isSub ? 700 : 500 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{
                          width: 8, height: 8, borderRadius: '50%',
                          background: row.classification === 'Measured' ? WL.green
                            : row.classification.includes('Indicated') ? WL.blue
                            : row.classification === 'Inferred' ? WL.amber
                            : WL.violet,
                        }} />
                        {row.classification}
                      </div>
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', fontFamily: 'var(--font-mono)', color: WL.text1 }}>
                      {row.mt.toLocaleString()}
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', fontFamily: 'var(--font-mono)', color: WL.text1 }}>
                      {row.treo_ppm.toLocaleString()}
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', fontFamily: 'var(--font-mono)', color: WL.text1 }}>
                      {row.mreo_pct}%
                    </td>
                    <td style={{ padding: '10px 12px', color: WL.text3, fontSize: 11 }}>
                      {row.deposits}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grade Distribution by Deposit */}
      <div style={sectionStyle}>
        {sectionTitle('Grade Distribution by Deposit')}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {DEPOSIT_DATA.filter(d => d.treo_ppm > 0).sort((a, b) => b.treo_ppm - a.treo_ppm).map(d => (
            <div key={d.id} style={{
              display: 'flex', alignItems: 'center', gap: 16,
              padding: '10px 16px',
              background: WL.surface,
              border: `1px solid ${WL.border}`,
              borderRadius: WL.radius.md,
            }}>
              <div style={{ width: 130, flexShrink: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: WL.text1 }}>{d.name}</div>
                <div style={{ fontSize: 10, color: WL.text3, marginTop: 2 }}>
                  {d.tonnage_mt > 0 ? `${d.tonnage_mt} Mt` : 'MRE Pending'}
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  height: 14, borderRadius: 7, background: WL.border,
                  overflow: 'hidden', position: 'relative',
                }}>
                  <div style={{
                    height: '100%', borderRadius: 7,
                    width: `${(d.treo_ppm / maxTreo) * 100}%`,
                    background: `linear-gradient(90deg, ${WL.violet}, ${WL.violetSoft})`,
                    transition: 'width 0.5s ease',
                  }} />
                </div>
              </div>
              <div style={{
                width: 80, textAlign: 'right', flexShrink: 0,
                fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-mono)',
                color: WL.text1,
              }}>
                {d.treo_ppm.toLocaleString()}
                <span style={{ fontSize: 9, color: WL.text3, marginLeft: 2 }}>ppm</span>
              </div>
              <div style={{
                fontSize: 10, fontWeight: 600, color:
                  d.status === 'measured' ? WL.green
                  : d.status === 'indicated' ? WL.blue
                  : d.status === 'inferred' ? WL.amber : WL.text4,
                textTransform: 'capitalize',
                width: 70, textAlign: 'right', flexShrink: 0,
              }}>
                {d.status}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recovery Table */}
      <div style={sectionStyle}>
        {sectionTitle('Rare Earth Recovery to MREC')}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${WL.border}` }}>
                  <th style={thStyle}>Element</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>Recovery %</th>
                  <th style={thStyle}>Group</th>
                </tr>
              </thead>
              <tbody>
                {RECOVERY_TABLE.map(r => (
                  <tr key={r.element} style={{ borderBottom: `1px solid ${WL.border}` }}>
                    <td style={{ padding: '8px 12px', fontWeight: 600, color: WL.text1 }}>{r.element}</td>
                    <td style={{ padding: '8px 12px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
                        <div style={{
                          width: 50, height: 6, borderRadius: 3, background: WL.border,
                          overflow: 'hidden',
                        }}>
                          <div style={{
                            height: '100%', borderRadius: 3,
                            width: `${r.recovery_pct}%`,
                            background: r.contribution === 'Magnet RE' ? WL.violet : WL.cyan,
                          }} />
                        </div>
                        <span style={{ fontFamily: 'var(--font-mono)', color: WL.text1, minWidth: 32, textAlign: 'right' }}>
                          {r.recovery_pct}%
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '8px 12px', color: WL.text3, fontSize: 11 }}>{r.contribution}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pilot vs ANSTO comparison */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <FlaskConical size={14} style={{ color: WL.violet }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: WL.text2, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Pilot vs ANSTO Validation
              </span>
            </div>
            {PILOT_PLANT_PERFORMANCE.recoveries.map(r => (
              <div key={r.element} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: WL.text1 }}>{r.element}</span>
                  <span style={{ fontSize: 11, color: WL.text3 }}>
                    Pilot {r.pilot_pct}% / ANSTO {r.ansto_pct}%
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  <div style={{ flex: 1, height: 8, borderRadius: 4, background: WL.border, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: 4,
                      width: `${r.pilot_pct}%`,
                      background: WL.violet,
                    }} />
                  </div>
                  <div style={{ flex: 1, height: 8, borderRadius: 4, background: WL.border, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: 4,
                      width: `${r.ansto_pct}%`,
                      background: WL.cyan,
                    }} />
                  </div>
                </div>
              </div>
            ))}
            <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 10, height: 4, borderRadius: 2, background: WL.violet }} />
                <span style={{ fontSize: 10, color: WL.text3 }}>Pilot Plant</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 10, height: 4, borderRadius: 2, background: WL.cyan }} />
                <span style={{ fontSize: 10, color: WL.text3 }}>ANSTO Lab</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lithology */}
      <div style={{ ...sectionStyle, borderBottom: 'none' }}>
        {sectionTitle('Lithology & Stratigraphy')}
        <div style={{ marginBottom: 20 }}>
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Mountain size={14} style={{ color: WL.violet }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: WL.text2, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Stratigraphic Sequence
              </span>
            </div>
            <p style={{ fontSize: 12, color: WL.text3, margin: '0 0 16px', lineHeight: 1.6 }}>
              {LITHOLOGY_SUMMARY.stratigraphy_note}
            </p>
            {/* Color palette */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {LITH_ORDER.map(lith => (
                <div key={lith} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '4px 10px',
                  background: `${LITH_COLORS[lith]}20`,
                  border: `1px solid ${LITH_COLORS[lith]}40`,
                  borderRadius: WL.radius.sm,
                }}>
                  <div style={{
                    width: 10, height: 10, borderRadius: 2,
                    background: LITH_COLORS[lith],
                  }} />
                  <span style={{ fontSize: 10, fontWeight: 500, color: WL.text2 }}>
                    {LITH_LABELS[lith]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Deposit lithology table */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <Grid3X3 size={14} style={{ color: WL.violet }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: WL.text2, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            Deposit Lithology Summary
          </span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${WL.border}` }}>
                <th style={thStyle}>Deposit</th>
                <th style={thStyle}>Dominant Lithology</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Laterite (m)</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Saprolite (m)</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Holes</th>
              </tr>
            </thead>
            <tbody>
              {LITHOLOGY_SUMMARY.deposits.slice(0, 12).map(d => (
                <tr key={d.deposit} style={{ borderBottom: `1px solid ${WL.border}` }}>
                  <td style={{ padding: '8px 12px', fontWeight: 500, color: WL.text1, textTransform: 'capitalize' }}>
                    {d.deposit.replace(/-/g, ' ')}
                  </td>
                  <td style={{ padding: '8px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{
                        width: 8, height: 8, borderRadius: 2,
                        background: LITH_COLORS[d.dominant_lithology] ?? WL.gray,
                      }} />
                      <span style={{ color: WL.text2, fontSize: 11 }}>
                        {LITH_LABELS[d.dominant_lithology] ?? d.dominant_lithology}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', fontFamily: 'var(--font-mono)', color: WL.text1 }}>
                    {d.avg_laterite_depth_m.toFixed(1)}
                  </td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', fontFamily: 'var(--font-mono)', color: WL.text1 }}>
                    {d.avg_saprolite_depth_m.toFixed(1)}
                  </td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', fontFamily: 'var(--font-mono)', color: WL.text1 }}>
                    {d.total_holes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
        Resource estimates follow JORC 2012 guidelines. Data sourced from Meteoric Resources ASX announcements
        and internal pilot plant results. Recovery percentages from pilot-scale continuous operation and ANSTO laboratory validation.
        Lithology from drill core logging across 750+ holes. See VeroChain data provenance layer for per-metric classification.
      </div>
    </div>
  )
}

export default memo(DrillTestsReport)
