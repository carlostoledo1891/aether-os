import { W, V } from './shared'

const DATAVIZ_ITEMS = [
  '3D terrain maps with custom GeoJSON overlays',
  'Process flow digital twins with animated connections',
  'Time series charts with live data binding',
  'Gauge dashboards for sensor monitoring',
  'Bar / line / area charts for financial scenarios',
  'Heatmaps and contour overlays for geological data',
  '14 custom overlay layer types',
  'Bilingual community dashboards (PT/EN)',
]

export default function DataVizSlide() {
  return (
    <>
      <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 32 }}>Any Data. Any Visualization.</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12, maxWidth: 880, width: '100%' }}>
        {DATAVIZ_ITEMS.map(item => (
          <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, background: W.glass04, border: `1px solid ${W.glass06}`, borderRadius: 10, padding: '12px 16px', textAlign: 'left' }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: V, flexShrink: 0, boxShadow: `0 0 6px ${V}40` }} />
            <span style={{ fontSize: 13, color: W.text2 }}>{item}</span>
          </div>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: `${V}08`, border: `1px dashed ${V}60`, borderRadius: 10, padding: '12px 16px', textAlign: 'left' }}>
          <div style={{ fontSize: 16, flexShrink: 0 }}>+</div>
          <span style={{ fontSize: 13, color: V, fontWeight: 600 }}>Connect any dataset, API, or sensor feed to extend the platform for your project</span>
        </div>
      </div>
      <p style={{ fontSize: 12, color: W.text4, marginTop: 20 }}>
        Prefeitura de Poços de Caldas dashboard already live at <span style={{ color: V, fontFamily: 'var(--font-mono)' }}>/deck/prefeitura</span>
      </p>
    </>
  )
}
