import { W } from '../../app/canvas/canvasTheme'
import { LICENSE_COLORS, LICENSE_ITEMS } from './constants'

export function LicenseTimeline() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {LICENSE_ITEMS.map(({ label, full, sub, status }, i) => {
        const color = LICENSE_COLORS[status]
        return (
          <div key={label} style={{ display: 'flex', gap: 9, alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 2 }}>
              <div style={{
                width: 18, height: 18, borderRadius: W.radius.sm, flexShrink: 0,
                background: status === 'pending' ? 'transparent' : `${color}20`,
                border: `1.5px solid ${color}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: status !== 'pending' ? `0 0 5px ${color}40` : undefined,
              }}>
                <span style={{ fontSize: 7, fontWeight: 800, color, fontFamily: 'var(--font-mono)' }}>{label}</span>
              </div>
              {i < LICENSE_ITEMS.length - 1 && <div style={{ width: 1, height: 22, background: W.glass07, margin: '3px 0' }}/>}
            </div>
            <div style={{ paddingBottom: i < LICENSE_ITEMS.length - 1 ? 10 : 0 }}>
              <span style={{ fontSize: 10, fontWeight: 600, color: W.text1, display: 'block', marginBottom: 1 }}>{full}</span>
              <span style={{ fontSize: 10, color: W.text4 }}>{sub}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
