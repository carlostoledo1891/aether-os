import { useState } from 'react'
import { W } from '../../app/canvas/canvasTheme'
import { MAP_STYLE_DEFS, type MapStyleId } from './MapStyleController'

export function MapStylePicker({
  active, onChange,
}: {
  active: MapStyleId; onChange: (id: MapStyleId) => void
}) {
  const [open, setOpen] = useState(false)
  if (MAP_STYLE_DEFS.length <= 1) return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {open && (
        <div style={{
          display: 'flex', flexDirection: 'column', gap: 2,
          background: W.mapControlBg,
          border: W.mapControlBorder, borderRadius: W.radius.sm,
          padding: 4, minWidth: 110,
        }}>
          {MAP_STYLE_DEFS.map(s => (
            <button
              key={s.id}
              type="button"
              onClick={() => { onChange(s.id); setOpen(false) }}
              style={{
                display: 'block', width: '100%', padding: '5px 8px',
                background: s.id === active ? `${W.violet}25` : 'transparent',
                border: 'none', borderRadius: 4, cursor: 'pointer', textAlign: 'left',
                fontSize: 10, fontWeight: s.id === active ? 700 : 500,
                color: s.id === active ? W.violetSoft : W.text3,
                fontFamily: 'var(--font-ui)',
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-label="Map style"
        style={{
          display: 'flex', alignItems: 'center', gap: 5,
          padding: '5px 10px',
          background: W.mapControlBg,
          border: W.mapControlBorder, borderRadius: W.radius.sm,
          cursor: 'pointer', fontSize: 10, fontWeight: 600,
          color: W.text3, fontFamily: 'var(--font-ui)',
          letterSpacing: '0.04em',
        }}
      >
        <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z" />
          <path d="M8 2v16" /><path d="M16 6v16" />
        </svg>
        {MAP_STYLE_DEFS.find(s => s.id === active)?.label ?? 'Style'}
      </button>
    </div>
  )
}
