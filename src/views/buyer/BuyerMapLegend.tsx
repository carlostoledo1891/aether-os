import { W } from '../../app/canvas/canvasTheme'

export function BuyerMapLegend() {
  return (
    <div style={{
      background: W.mapControlBg, border: W.mapControlBorder,
      borderRadius: 8, padding: '8px 10px',
      display: 'flex', flexDirection: 'column', gap: 4,
      fontSize: 10, color: W.text3,
    }}>
      <span style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: 9 }}>Legend</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: W.green }} />
        <span>Verified step</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: W.violet }} />
        <span>Active step</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: W.text4 }} />
        <span>Pending step</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', border: `2px solid ${W.violet}`, background: 'transparent' }} />
        <span>Origin license</span>
      </div>
    </div>
  )
}