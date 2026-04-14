import { W, V } from './shared'

const SOURCES = [
  {
    name: 'CPRM / SGB',
    detail: '1:1,000,000 geological formation maps — overlaid on 3D terrain and correlated with Caldeira lithostratigraphy',
  },
  {
    name: 'Macrostrat',
    detail: 'Global lithostratigraphic formations and stratigraphic correlations — peer-reviewed geological context at scale',
  },
  {
    name: 'USGS REE Deposits',
    detail: 'International rare earth occurrences database — benchmark Caldeira grades against global peer deposits',
  },
  {
    name: 'USGS Seismic Feed',
    detail: 'Real-time microseismic events with depth and structural correlation — continuous geomechanical monitoring',
  },
  {
    name: 'ERA5 Climate Baseline',
    detail: '5-year historical climatology from ECMWF — geomorphological context, spring recharge cycles, evapotranspiration modeling',
  },
  {
    name: 'LAPOC / ANSN',
    detail: 'Piezometers, water quality, pH, and conductivity from ANSN field stations — the only field-verified data channel on the Caldeira plateau',
  },
]

const TEMPORAL = [
  {
    horizon: 'Past',
    data: 'ERA5 + CPRM + ANM concessions',
    insight: 'Pre-mining environmental and geological baseline reconstruction',
  },
  {
    horizon: 'Present',
    data: 'LAPOC live + USGS seismic + Macrostrat',
    insight: 'Real-time cross-correlation with structural geology and environmental thresholds',
  },
  {
    horizon: 'Future',
    data: 'Predictive spring health + grade correlation',
    insight: 'Compliance risk forecast and resource model enrichment ahead of DFS milestones',
  },
]

export default function GeoDataSlide() {
  return (
    <>
      <h2 style={{ fontSize: 'clamp(22px, 3vw, 38px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 8 }}>
        Geological Intelligence — Source to Surface
      </h2>
      <p style={{ fontSize: 13, color: W.text3, marginBottom: 24, maxWidth: 720 }}>
        Six data channels active. Every reading has a source, a timestamp, and a provenance label.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, maxWidth: 980, width: '100%' }}>
        {/* Left — Data Sources */}
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: V, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>
            Data Sources Active Now
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {SOURCES.map(s => (
              <div key={s.name} style={{ background: W.glass04, border: `1px solid ${W.glass06}`, borderRadius: 10, padding: '12px 14px', textAlign: 'left' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: W.text1, marginBottom: 4 }}>{s.name}</div>
                <div style={{ fontSize: 11, color: W.text3, lineHeight: 1.5 }}>{s.detail}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Temporal Framing */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: V, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>
            What This Enables
          </div>
          {TEMPORAL.map((t, i) => {
            const accent = i === 0 ? W.text4 : i === 1 ? V : W.green
            return (
              <div key={t.horizon} style={{ background: W.glass04, border: `1px solid ${i === 1 ? V : W.glass06}`, borderRadius: 10, padding: '16px 18px', textAlign: 'left', position: 'relative', overflow: 'hidden' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: accent, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                  {t.horizon}
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: W.text2, marginBottom: 6 }}>{t.data}</div>
                <div style={{ fontSize: 11, color: W.text3, lineHeight: 1.5 }}>{t.insight}</div>
              </div>
            )
          })}

          <div style={{ marginTop: 6, background: `${V}08`, border: `1px solid ${V}20`, borderRadius: 10, padding: '12px 14px' }}>
            <div style={{ fontSize: 11, color: W.text3, lineHeight: 1.6 }}>
              <span style={{ color: V, fontWeight: 700 }}>Open integration architecture</span> — any new API (IBGE, ANA, INMET, international geological surveys) connects without frontend changes.
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
