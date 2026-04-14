/**
 * MapLayerPanel — unified, grouped layer control for every map surface.
 *
 * Single trigger button (Layers icon) expands into a panel with
 * collapsible sections per LayerGroupId. Terrain retains the
 * exaggeration slider; weather is no longer a visible layer group.
 */

import { memo, useState, useCallback, Fragment } from 'react'
import { Layers, X, ChevronRight } from 'lucide-react'
import { W } from '../../app/canvas/canvasTheme'
import {
  LAYER_GROUPS,
  layersByGroup,
  type LayerGroupId,
  type LayerDef,
  type LayerId,
  type LayerVisibilityState,
} from './layerRegistry'
import { useLayerHealth } from './layerHealth'

// ── Public API ─────────────────────────────────────────────────────────

export interface MapLayerPanelProps {
  /** Current on/off state per layer id */
  state: LayerVisibilityState
  /** Toggle a single layer */
  onToggle: (id: LayerId) => void
  /** Optional: groups to display (default: all groups that have at least one layer in `state`) */
  groups?: LayerGroupId[]
  /** Terrain exaggeration 0–3 */
  terrainExaggeration?: number
  onTerrainExaggerationChange?: (v: number) => void
}

// ── Component ──────────────────────────────────────────────────────────

export const MapLayerPanel = memo(function MapLayerPanel({
  state,
  onToggle,
  groups,
  terrainExaggeration,
  onTerrainExaggerationChange,
}: MapLayerPanelProps) {
  const [open, setOpen] = useState(false)
  const [collapsed, setCollapsed] = useState<Set<LayerGroupId>>(() => new Set())
  const layerHealth = useLayerHealth()

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
                      <LayerRow
                        key={layer.id}
                        layer={layer}
                        checked={!!state[layer.id]}
                        onToggle={onToggle}
                        health={layerHealth.get(layer.id)}
                      />
                    ))}

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

function healthTone(status?: { state: string }) {
  switch (status?.state) {
    case 'ready':
      return W.green
    case 'loading':
      return W.amber
    case 'error':
      return W.red
    default:
      return W.text4
  }
}

function healthLabel(status?: { state: string; featureCount?: number; loadedAt?: string }) {
  if (!status) return null
  if (status.state === 'ready') {
    const age = status.loadedAt ? new Date(status.loadedAt).toISOString().slice(0, 10) : 'loaded'
    return status.featureCount != null ? `${status.featureCount} feat · ${age}` : age
  }
  if (status.state === 'loading') return 'loading'
  if (status.state === 'error') return 'load error'
  return null
}

function LayerRow({
  layer,
  checked,
  onToggle,
  health,
}: {
  layer: LayerDef
  checked: boolean
  onToggle: (id: LayerId) => void
  health?: { state: string; featureCount?: number; loadedAt?: string }
}) {
  const meta = [
    layer.provider,
    layer.renderMode === 'snapshot-geojson'
      ? 'snapshot'
      : layer.renderMode === 'live-raster'
        ? 'live raster'
        : null,
    layer.identifyMode === 'arcgis-query'
      ? 'live identify'
      : layer.identifyMode === 'snapshot-properties'
        ? 'snapshot identify'
        : null,
  ].filter(Boolean)

  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 6,
        fontSize: 10,
        color: checked ? W.text2 : W.text4,
        cursor: 'pointer',
        padding: '4px 0',
        transition: 'color 0.12s',
        flexDirection: 'column',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, width: '100%' }}>
        <input
          type="checkbox"
          checked={checked}
          onChange={() => onToggle(layer.id)}
          style={{ accentColor: W.violet, width: 11, height: 11, flexShrink: 0, marginTop: 1 }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'space-between' }}>
            <span>{layer.label}</span>
            {health && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  color: healthTone(health),
                  fontSize: 8,
                  fontFamily: 'var(--font-mono)',
                  textTransform: 'uppercase',
                }}
              >
                <span
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: '50%',
                    background: healthTone(health),
                    flexShrink: 0,
                  }}
                />
                {health.state}
              </span>
            )}
          </div>
          {meta.length > 0 && (
            <span style={{ fontSize: 8, color: W.text4, fontFamily: 'var(--font-mono)', lineHeight: 1.35 }}>
              {meta.join(' · ')}
            </span>
          )}
          {healthLabel(health) && (
            <span style={{ fontSize: 8, color: W.text4, fontFamily: 'var(--font-mono)', lineHeight: 1.35 }}>
              {healthLabel(health)}
            </span>
          )}
        </div>
      </div>
      {checked && layer.legendItems && layer.legendItems.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3, paddingLeft: 17 }}>
          {layer.legendItems.map(item => (
            <div key={`${layer.id}-${item.label}`} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 8, color: W.text4 }}>
              <span
                style={{
                  width: item.symbol === 'line' ? 12 : 9,
                  height: item.symbol === 'line' ? 2 : 9,
                  borderRadius: item.symbol === 'circle' ? '50%' : 2,
                  background: item.symbol === 'line' ? item.strokeColor ?? item.color ?? W.text4 : item.color ?? 'transparent',
                  border: item.symbol === 'line' ? undefined : `1px solid ${item.strokeColor ?? item.color ?? W.text4}`,
                  flexShrink: 0,
                }}
              />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      )}
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
