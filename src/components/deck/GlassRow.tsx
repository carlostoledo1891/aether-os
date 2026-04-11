import { W } from '../../app/canvas/canvasTheme'

const V = W.violet

interface GlassRowProps {
  items: { label: string; value: string }[]
}

export function GlassRow({ items }: GlassRowProps) {
  return (
    <div style={{
      display: 'flex', gap: 0, flexWrap: 'wrap', justifyContent: 'center',
      background: W.glass04, border: `1px solid ${W.glass06}`, borderRadius: 14, padding: '18px 0',
    }}>
      {items.map((it, i) => (
        <div key={it.label} style={{
          textAlign: 'center', flex: 1, padding: '0 14px', minWidth: 100,
          borderLeft: i > 0 ? `1px solid ${W.glass06}` : 'none',
        }}>
          <div style={{ fontSize: 'clamp(17px, 1.2vw, 22px)', fontWeight: 800, color: V, fontFamily: 'var(--font-mono)' }}>{it.value}</div>
          <div style={{ fontSize: 'clamp(9px, 0.6vw, 11px)', color: W.text4, marginTop: 3 }}>{it.label}</div>
        </div>
      ))}
    </div>
  )
}
