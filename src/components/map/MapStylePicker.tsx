import { useCallback, useState } from 'react'
import { Check, Map as MapIcon } from 'lucide-react'
import { W } from '../../app/canvas/canvasTheme'
import { usePopoverDismiss } from '../../hooks/usePopoverDismiss'
import { MAP_STYLE_DEFS, type MapStyleId } from './MapStyleController'
import {
  mapControlAnchorStyle,
  getMapControlMenuRowStyle,
  getMapControlTriggerStyle,
  mapControlHeaderLabelStyle,
  mapControlPanelStyle,
  mapControlSidePopoverStyle,
} from './mapControlStyles'

export function MapStylePicker({
  active, onChange,
}: {
  active: MapStyleId; onChange: (id: MapStyleId) => void
}) {
  const [open, setOpen] = useState(false)
  const handleClose = useCallback(() => setOpen(false), [])
  const anchorRef = usePopoverDismiss<HTMLDivElement>({ open, onClose: handleClose })
  if (MAP_STYLE_DEFS.length <= 1) return null

  const activeStyle = MAP_STYLE_DEFS.find(s => s.id === active)

  return (
    <div ref={anchorRef} style={mapControlAnchorStyle}>
      {open && (
        <div style={{ ...mapControlPanelStyle, ...mapControlSidePopoverStyle, minWidth: 168 }}>
          <span style={mapControlHeaderLabelStyle}>Basemap</span>
          {MAP_STYLE_DEFS.map(s => (
            <button
              key={s.id}
              type="button"
              onClick={() => { onChange(s.id); setOpen(false) }}
              aria-pressed={s.id === active}
              style={getMapControlMenuRowStyle(s.id === active)}
            >
              <MapIcon size={12} style={{ color: s.id === active ? W.text1 : W.icon, flexShrink: 0 }} />
              <span style={{ flex: 1 }}>{s.label}</span>
              {s.id === active && <Check size={12} style={{ color: W.text2, flexShrink: 0 }} />}
            </button>
          ))}
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-label={`Basemap selector. Current style ${activeStyle?.label ?? 'Style'}`}
        title={activeStyle?.label ?? 'Basemap'}
        aria-expanded={open}
        style={getMapControlTriggerStyle(open)}
      >
        <MapIcon size={15} />
      </button>
    </div>
  )
}
