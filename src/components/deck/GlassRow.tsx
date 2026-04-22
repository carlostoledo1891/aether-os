import { W } from '../../theme/publicTheme'

const V = W.violet

interface GlassRowProps {
  items: { label: string; value: string }[]
}

export function GlassRow({ items }: GlassRowProps) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${items.length}, 1fr)`,
      background: W.panel,
      border: `1px solid ${W.glass06}`,
      borderRadius: 14,
      padding: '18px 0',
      width: 'max-content',
      minWidth: '100%',
    }}>
      {items.map((it, i) => (
        <div key={it.label} style={{
          textAlign: 'center',
          padding: '0 16px',
          borderLeft: i > 0 ? `1px solid ${W.glass06}` : 'none',
          whiteSpace: 'nowrap',
        }}>
          <div style={{ fontSize: 'clamp(17px, 1.2vw, 22px)', fontWeight: 800, color: V, fontFamily: 'var(--font-mono)' }}>{it.value}</div>
          <div style={{ fontSize: 'clamp(9px, 0.6vw, 11px)', color: W.text4, marginTop: 3 }}>{it.label}</div>
        </div>
      ))}
    </div>
  )
}
