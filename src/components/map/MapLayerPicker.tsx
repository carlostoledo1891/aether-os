import { memo, useState } from 'react'
import { Layers, X } from 'lucide-react'
import { W } from '../../app/canvas/canvasTheme'

interface LayerToggle {
  id: string
  label: string
  checked: boolean
}

interface MapLayerPickerProps {
  layers: LayerToggle[]
  onToggle: (id: string) => void
}

export const MapLayerPicker = memo(function MapLayerPicker({ layers, onToggle }: MapLayerPickerProps) {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ position: 'absolute', top: 120, right: 10, zIndex: 10 }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: 30,
          height: 30,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 4,
          border: `1px solid ${W.glass12}`,
          background: W.glass06,
          backdropFilter: 'blur(12px)',
          cursor: 'pointer',
          color: open ? W.violet : W.text2,
          transition: 'color 0.15s',
        }}
        title="Map layers"
      >
        <Layers size={15} />
      </button>

      {open && (
        <div
          style={{
            marginTop: 4,
            background: W.glass08,
            backdropFilter: 'blur(16px)',
            border: `1px solid ${W.glass12}`,
            borderRadius: 8,
            padding: '8px 10px',
            minWidth: 170,
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
            <span style={{ fontSize: 10, fontWeight: 600, color: W.text3, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Layers
            </span>
            <button
              onClick={() => setOpen(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: W.text4, padding: 0, display: 'flex' }}
            >
              <X size={12} />
            </button>
          </div>
          {layers.map(layer => (
            <label
              key={layer.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 11,
                color: W.text2,
                cursor: 'pointer',
                padding: '2px 0',
              }}
            >
              <input
                type="checkbox"
                checked={layer.checked}
                onChange={() => onToggle(layer.id)}
                style={{ accentColor: W.violet, width: 12, height: 12 }}
              />
              {layer.label}
            </label>
          ))}
        </div>
      )}
    </div>
  )
})
