/**
 * MapLayerPanel — unified, grouped layer control for every map surface.
 *
 * Single trigger button (Layers icon) expands into a panel with
 * collapsible sections per LayerGroupId. Weather and terrain groups
 * include opacity / exaggeration sliders.
 */

import { memo, useState, useCallback, Fragment } from 'react'
import { Layers, X, ChevronRight } from 'lucide-react'
import { W } from '../../app/canvas/canvasTheme'
import {
  LAYER_GROUPS,
  layersByGroup,
  type LayerGroupId,
  type LayerDef,
} from './layerRegistry'

// ── Public API ─────────────────────────────────────────────────────────

export interface LayerState {
  [layerId: string]: boolean
}

export interface MapLayerPanelProps {
  /** Current on/off state per layer id */
  state: LayerState
  /** Toggle a single layer */
  onToggle: (id: string) => void
  /** Optional: groups to display (default: all groups that have at least one layer in `state`) */
  groups?: LayerGroupId[]
  /** Weather tile opacity 0–1 */
  weatherOpacity?: number
  onWeatherOpacityChange?: (v: number) => void
  /** Terrain exaggeration 0–3 */
  terrainExaggeration?: number
  onTerrainExaggerationChange?: (v: number) => void
}

// ── Component ──────────────────────────────────────────────────────────

export const MapLayerPanel = memo(function MapLayerPanel({
  state,
  onToggle,
  groups,
  weatherOpacity,
  onWeatherOpacityChange,
  terrainExaggeration,
  onTerrainExaggerationChange,
}: MapLayerPanelProps) {
  const [open, setOpen] = useState(false)
  const [collapsed, setCollapsed] = useState<Set<LayerGroupId>>(() => new Set())

  const toggleSection = useCallback((gid: LayerGroupId) => {
    setCollapsed(prev => {
      const next = new Set(prev)
      if (next.has(gid)) next.delete(gid)
      else next.add(gid)
      return next
    })
  }, [])

  const visibleGroups = LAYER_GROUPS.filter(g => {
    if (groups && !groups.includes(g.id)) return false
    return layersByGroup(g.id).some(l => l.available && l.id in state)
  })

  return (
    <>
      {/* ── Trigger button ─────────────────────────── */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Toggle map layers"
        aria-expanded={open}
        style={{
          width: 29,
          height: 29,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 4,
          border: W.mapControlBorder,
          background: W.mapControlBg,
          cursor: 'pointer',
          color: open ? W.violet : W.text2,
          transition: 'color 0.15s',
        }}
        title="Map layers"
      >
        <Layers size={14} />
      </button>

      {/* ── Expanded panel ─────────────────────────── */}
      {open && (
        <div
          style={{
            background: W.mapControlBg,
            border: W.mapControlBorder,
            borderRadius: 8,
            padding: '8px 10px',
            minWidth: 190,
            maxHeight: 'min(420px, 70vh)',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: W.text3, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Layers
            </span>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: W.text4, padding: 0, display: 'flex' }}
            >
              <X size={12} />
            </button>
          </div>

          {/* Groups */}
          {visibleGroups.map(group => {
            const layers = layersByGroup(group.id).filter(l => l.id in state)
            if (layers.length === 0) return null
            const isCollapsed = collapsed.has(group.id)
            const Icon = group.icon

            return (
              <Fragment key={group.id}>
                <button
                  type="button"
                  onClick={() => toggleSection(group.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    padding: '4px 2px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: W.text3,
                    width: '100%',
                    textAlign: 'left',
                  }}
                >
                  <ChevronRight
                    size={10}
                    style={{
                      transform: isCollapsed ? 'rotate(0deg)' : 'rotate(90deg)',
                      transition: 'transform 0.15s',
                      flexShrink: 0,
                    }}
                  />
                  <Icon size={11} style={{ color: group.accent, flexShrink: 0 }} />
                  <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {group.label}
                  </span>
                </button>

                {!isCollapsed && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 1, paddingLeft: 18, paddingBottom: 4 }}>
                    {layers.filter(l => l.available).map(layer => (
                      <LayerRow key={layer.id} layer={layer} checked={!!state[layer.id]} onToggle={onToggle} />
                    ))}

                    {/* Weather opacity slider */}
                    {group.id === 'weather' && weatherOpacity !== undefined && onWeatherOpacityChange && (
                      <SliderRow
                        label="Opacity"
                        value={weatherOpacity}
                        min={0.1}
                        max={1}
                        step={0.05}
                        displayValue={`${Math.round(weatherOpacity * 100)}%`}
                        accent={W.cyan}
                        onChange={onWeatherOpacityChange}
                      />
                    )}

                    {/* Terrain exaggeration slider */}
                    {group.id === 'terrain' && terrainExaggeration !== undefined && onTerrainExaggerationChange && (
                      <SliderRow
                        label="Exagg."
                        value={terrainExaggeration}
                        min={0}
                        max={3}
                        step={0.1}
                        displayValue={`${terrainExaggeration.toFixed(1)}x`}
                        accent={W.amber}
                        onChange={onTerrainExaggerationChange}
                      />
                    )}
                  </div>
                )}
              </Fragment>
            )
          })}
        </div>
      )}
    </>
  )
})

// ── Sub-components ─────────────────────────────────────────────────────

function LayerRow({ layer, checked, onToggle }: { layer: LayerDef; checked: boolean; onToggle: (id: string) => void }) {
  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 10,
        color: checked ? W.text2 : W.text4,
        cursor: 'pointer',
        padding: '2px 0',
        transition: 'color 0.12s',
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={() => onToggle(layer.id)}
        style={{ accentColor: W.violet, width: 11, height: 11, flexShrink: 0 }}
      />
      {layer.label}
    </label>
  )
}

function SliderRow({
  label, value, min, max, step, displayValue, accent, onChange,
}: {
  label: string; value: number; min: number; max: number; step: number
  displayValue: string; accent: string; onChange: (v: number) => void
}) {
  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        fontSize: 9,
        color: W.text4,
        fontFamily: 'var(--font-ui)',
        marginTop: 4,
      }}
    >
      {label}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: 56, accentColor: accent }}
      />
      <span style={{ minWidth: 28, textAlign: 'right' }}>{displayValue}</span>
    </label>
  )
}
