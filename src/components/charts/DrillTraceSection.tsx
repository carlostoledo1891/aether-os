import { useMemo, useState, useCallback, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { AlertTriangle, ChevronDown } from 'lucide-react'
import { W } from '../../app/canvas/canvasTheme'
import { Z } from '../map/mapStacking'
import { LITH_COLORS, LITH_LABELS, LITH_ORDER } from './lithologyPalette'
import { GEO } from '../../data/geo/registry'

const DEFAULT_VISIBLE = 20
const COL_WIDTH = 20
const COL_GAP = 4
const CHART_HEIGHT = 260
const Y_AXIS_WIDTH = 48
const BOTTOM_LABEL_HEIGHT = 44
const SEGMENT_GAP = 1

/* ── Types ──────────────────────────────────────────────────────────────── */

interface LithologyInterval {
  from_m: number
  to_m: number
  lithology: string
  weathering: string
}

interface DrillHoleEntry {
  id: string
  deposit: string
  depth_m: number
  treo_ppm: number
  mreo_pct: number
  hole_type: string
  intercept: string
  including: string
  note: string
  lithology_intervals: LithologyInterval[] | null
}

/* ── Helpers ────────────────────────────────────────────────────────────── */

function depositLabel(slug: string): string {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

function gradeColor(ppm: number): string {
  if (ppm >= 8000) return W.green
  if (ppm >= 5000) return W.cyan
  if (ppm >= 3000) return W.amber
  return W.text3
}

/* ── Tooltip component ──────────────────────────────────────────────────── */

interface TooltipData {
  x: number
  y: number
  holeId: string
  lithology: string
  from_m: number
  to_m: number
  weathering: string
}

function LithTooltip({ data }: { data: TooltipData }) {
  return createPortal(
    <div style={{
      position: 'fixed', left: data.x + 12, top: data.y - 10,
      background: W.panel, border: `1px solid ${W.glass12}`, borderRadius: W.radius.sm,
      padding: '6px 9px', fontSize: 10, lineHeight: 1.5, pointerEvents: 'none',
      zIndex: Z.modal, maxWidth: 220,
      boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
    }}>
      <div style={{ fontWeight: 700, color: W.text1, marginBottom: 2 }}>{data.holeId}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 2 }}>
        <div style={{
          width: 8, height: 8, borderRadius: 2, flexShrink: 0,
          background: LITH_COLORS[data.lithology] ?? W.text3,
        }} />
        <span style={{ color: W.text2 }}>
          {LITH_LABELS[data.lithology] ?? data.lithology}
        </span>
      </div>
      <div style={{ color: W.text3, fontFamily: 'var(--font-mono)' }}>
        {data.from_m.toFixed(1)}–{data.to_m.toFixed(1)} m
      </div>
      <div style={{ color: W.text4, fontStyle: 'italic' }}>
        Weathering: {data.weathering}
      </div>
    </div>,
    document.body,
  )
}

/* ── Mini lithology column for selected hole detail ─────────────────────── */

function MiniColumn({ intervals, maxDepth }: { intervals: LithologyInterval[]; maxDepth: number }) {
  const height = 140
  const width = 40
  return (
    <svg width={width} height={height + 4} style={{ flexShrink: 0 }}>
      {intervals.map((iv, i) => {
        const y0 = (iv.from_m / maxDepth) * height
        const y1 = (iv.to_m / maxDepth) * height
        const segH = Math.max(y1 - y0 - SEGMENT_GAP, 1)
        return (
          <g key={i}>
            <rect
              x={0} y={y0} width={width} height={segH}
              rx={2} fill={LITH_COLORS[iv.lithology] ?? W.text3}
            />
            {segH > 12 && (
              <text
                x={width / 2} y={y0 + segH / 2}
                textAnchor="middle" dominantBaseline="central"
                style={{ fontSize: 7, fill: iv.lithology === 'alluvium' ? '#333' : '#fff', fontFamily: 'var(--font-mono)' }}
              >
                {iv.from_m.toFixed(0)}–{iv.to_m.toFixed(0)}m
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}

/* ── Main component ─────────────────────────────────────────────────────── */

export function DrillTraceSection() {
  const [allHoles, setAllHoles] = useState<DrillHoleEntry[]>([])
  const [depositFilter, setDepositFilter] = useState<string>('all')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [selectedHole, setSelectedHole] = useState<string | null>(null)
  const [hoveredHole, setHoveredHole] = useState<string | null>(null)
  const [tooltip, setTooltip] = useState<TooltipData | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch(GEO.drillholes.url)
      .then(r => r.json())
      .then((geojson: { features: Array<{ properties: DrillHoleEntry }> }) => {
        setAllHoles(
          geojson.features
            .map(f => f.properties)
            .sort((a, b) => b.treo_ppm - a.treo_ppm),
        )
      })
      .catch(() => { /* graceful: empty state */ })
  }, [])

  const deposits = useMemo(() => {
    const set = new Set(allHoles.map(h => h.deposit))
    return Array.from(set).sort()
  }, [allHoles])

  const visibleHoles = useMemo(() => {
    if (depositFilter !== 'all') return allHoles.filter(h => h.deposit === depositFilter)
    return allHoles.slice(0, DEFAULT_VISIBLE)
  }, [allHoles, depositFilter])

  const maxDepth = useMemo(() => {
    if (visibleHoles.length === 0) return 200
    let md = 0
    for (const h of visibleHoles) {
      if (h.depth_m > md) md = h.depth_m
      const intervals = h.lithology_intervals ?? []
      for (const iv of intervals) {
        if (iv.to_m > md) md = iv.to_m
      }
    }
    return Math.ceil(md / 25) * 25
  }, [visibleHoles])

  const handleColumnClick = useCallback((id: string) => {
    setSelectedHole(prev => prev === id ? null : id)
  }, [])

  const handleSegmentHover = useCallback((e: React.MouseEvent, holeId: string, iv: LithologyInterval) => {
    setHoveredHole(holeId)
    setTooltip({
      x: e.clientX, y: e.clientY,
      holeId,
      lithology: iv.lithology,
      from_m: iv.from_m,
      to_m: iv.to_m,
      weathering: iv.weathering,
    })
  }, [])

  const handleSegmentMove = useCallback((e: React.MouseEvent) => {
    setTooltip(prev => prev ? { ...prev, x: e.clientX, y: e.clientY } : null)
  }, [])

  const handleSegmentLeave = useCallback(() => {
    setHoveredHole(null)
    setTooltip(null)
  }, [])

  const countLabel = depositFilter !== 'all'
    ? `${depositLabel(depositFilter)}: ${visibleHoles.length} hole${visibleHoles.length !== 1 ? 's' : ''}`
    : `Top ${Math.min(DEFAULT_VISIBLE, allHoles.length)} of ${allHoles.length} by TREO`

  /* Y-axis tick marks */
  const yTicks = useMemo(() => {
    const step = maxDepth <= 50 ? 10 : maxDepth <= 150 ? 25 : 50
    const ticks: number[] = []
    for (let v = 0; v <= maxDepth; v += step) ticks.push(v)
    return ticks
  }, [maxDepth])

  /* Used lithologies (for legend) */
  const usedLithologies = useMemo(() => {
    const set = new Set<string>()
    for (const h of visibleHoles) {
      for (const iv of h.lithology_intervals ?? []) set.add(iv.lithology)
    }
    return LITH_ORDER.filter(l => set.has(l))
  }, [visibleHoles])

  const svgWidth = visibleHoles.length * (COL_WIDTH + COL_GAP) + COL_GAP

  if (allHoles.length === 0) {
    return <div style={{ fontSize: 10, color: W.text4, padding: 8 }}>Loading drill data...</div>
  }

  const selectedData = selectedHole ? visibleHoles.find(x => x.id === selectedHole) : null

  return (
    <div>
      {/* ── Filter row ──────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setDropdownOpen(o => !o)}
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              background: W.glass04, border: `1px solid ${W.glass12}`, borderRadius: W.radius.xs,
              padding: '3px 8px', fontSize: 10, color: W.text2, cursor: 'pointer', outline: 'none',
            }}
          >
            {depositFilter === 'all' ? 'All deposits' : depositLabel(depositFilter)}
            <ChevronDown size={10} style={{ color: W.text4 }} />
          </button>
          {dropdownOpen && (
            <div style={{
              position: 'absolute', top: '100%', left: 0, marginTop: 2, zIndex: Z.tooltip,
              background: W.panel, border: `1px solid ${W.glass12}`, borderRadius: W.radius.sm,
              padding: 4, maxHeight: 200, overflowY: 'auto', minWidth: 160,
              boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
            }}>
              <button
                type="button"
                onClick={() => { setDepositFilter('all'); setDropdownOpen(false); setSelectedHole(null) }}
                style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  padding: '4px 8px', fontSize: 10, borderRadius: W.radius.xs,
                  background: depositFilter === 'all' ? `${W.violet}20` : 'transparent',
                  color: depositFilter === 'all' ? W.violet : W.text2,
                  border: 'none', cursor: 'pointer', outline: 'none',
                }}
              >
                All deposits (top {DEFAULT_VISIBLE})
              </button>
              {deposits.map(d => (
                <button
                  type="button"
                  key={d}
                  onClick={() => { setDepositFilter(d); setDropdownOpen(false); setSelectedHole(null) }}
                  style={{
                    display: 'block', width: '100%', textAlign: 'left',
                    padding: '4px 8px', fontSize: 10, borderRadius: W.radius.xs,
                    background: depositFilter === d ? `${W.violet}20` : 'transparent',
                    color: depositFilter === d ? W.violet : W.text2,
                    border: 'none', cursor: 'pointer', outline: 'none',
                  }}
                >
                  {depositLabel(d)} ({allHoles.filter(h => h.deposit === d).length})
                </button>
              ))}
            </div>
          )}
        </div>
        <span style={{ fontSize: 9, color: W.text4, fontFamily: 'var(--font-mono)' }}>
          {countLabel}
        </span>
      </div>

      {/* ── Disclaimer ──────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
        <AlertTriangle size={9} style={{ color: W.amber, flexShrink: 0 }} />
        <span style={{ fontSize: 9, color: W.text4 }}>
          Collar positions sourced from ASX appendix UTM data (EPSG:31983). Not independently field-verified.
        </span>
      </div>

      {/* ── Lithology legend ────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
        {usedLithologies.map(key => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <div style={{
              width: 8, height: 8, borderRadius: 2,
              background: LITH_COLORS[key], opacity: 0.9,
            }} />
            <span style={{ fontSize: 9, color: W.text4 }}>
              {LITH_LABELS[key]}
            </span>
          </div>
        ))}
      </div>

      {/* ── Stacked lithology column chart ──────────────────────────── */}
      <div style={{ display: 'flex' }}>
        {/* Y-axis */}
        <svg
          width={Y_AXIS_WIDTH}
          height={CHART_HEIGHT + BOTTOM_LABEL_HEIGHT}
          style={{ flexShrink: 0 }}
        >
          <text
            x={10} y={CHART_HEIGHT / 2}
            textAnchor="middle"
            dominantBaseline="central"
            transform={`rotate(-90, 10, ${CHART_HEIGHT / 2})`}
            style={{ fontSize: 9, fill: W.text4, fontFamily: 'var(--font-ui)' }}
          >
            Depth (m)
          </text>
          {yTicks.map(v => {
            const y = (v / maxDepth) * CHART_HEIGHT
            return (
              <g key={v}>
                <line
                  x1={Y_AXIS_WIDTH - 4} y1={y}
                  x2={Y_AXIS_WIDTH} y2={y}
                  stroke={W.glass12} strokeWidth={1}
                />
                <text
                  x={Y_AXIS_WIDTH - 6} y={y}
                  textAnchor="end" dominantBaseline="central"
                  style={{ fontSize: 9, fill: W.text4, fontFamily: 'var(--font-mono)' }}
                >
                  {v}
                </text>
              </g>
            )
          })}
          <line
            x1={Y_AXIS_WIDTH} y1={0}
            x2={Y_AXIS_WIDTH} y2={CHART_HEIGHT}
            stroke={W.glass12} strokeWidth={1}
          />
        </svg>

        {/* Scrollable columns area */}
        <div
          ref={scrollRef}
          style={{
            flex: 1, overflowX: 'auto', overflowY: 'hidden',
            position: 'relative',
          }}
        >
          <svg
            width={Math.max(svgWidth, 100)}
            height={CHART_HEIGHT + BOTTOM_LABEL_HEIGHT}
          >
            {/* Horizontal grid lines */}
            {yTicks.map(v => {
              const y = (v / maxDepth) * CHART_HEIGHT
              return (
                <line
                  key={v}
                  x1={0} y1={y}
                  x2={svgWidth} y2={y}
                  stroke={W.glass04} strokeWidth={1}
                />
              )
            })}

            {/* Hole columns */}
            {visibleHoles.map((hole, idx) => {
              const x = COL_GAP + idx * (COL_WIDTH + COL_GAP)
              const intervals = hole.lithology_intervals ?? []
              const isSelected = selectedHole === hole.id
              const isHovered = hoveredHole === hole.id
              const isDimmed = (hoveredHole !== null && !isHovered) || (selectedHole !== null && !isSelected)
              const opacity = isDimmed ? 0.3 : 1

              return (
                <g
                  key={hole.id}
                  style={{ cursor: 'pointer', opacity, transition: 'opacity 0.15s ease' }}
                  onClick={() => handleColumnClick(hole.id)}
                >
                  {/* Fallback solid bar when no intervals */}
                  {intervals.length === 0 && (
                    <rect
                      x={x} y={0}
                      width={COL_WIDTH}
                      height={(hole.depth_m / maxDepth) * CHART_HEIGHT}
                      rx={2} fill={W.text3} fillOpacity={0.4}
                    />
                  )}

                  {/* Lithology segments */}
                  {intervals.map((iv, si) => {
                    const y0 = (iv.from_m / maxDepth) * CHART_HEIGHT
                    const y1 = (iv.to_m / maxDepth) * CHART_HEIGHT
                    const segH = Math.max(y1 - y0 - SEGMENT_GAP, 1)
                    return (
                      <rect
                        key={si}
                        x={x} y={y0}
                        width={COL_WIDTH} height={segH}
                        rx={1.5}
                        fill={LITH_COLORS[iv.lithology] ?? W.text3}
                        onMouseEnter={e => handleSegmentHover(e, hole.id, iv)}
                        onMouseMove={handleSegmentMove}
                        onMouseLeave={handleSegmentLeave}
                      />
                    )
                  })}

                  {/* Selection highlight ring */}
                  {isSelected && (
                    <rect
                      x={x - 1.5} y={0}
                      width={COL_WIDTH + 3}
                      height={Math.min(
                        ((intervals.at(-1)?.to_m ?? hole.depth_m) / maxDepth) * CHART_HEIGHT,
                        CHART_HEIGHT,
                      )}
                      rx={3} fill="none"
                      stroke={W.text1} strokeWidth={1.5}
                    />
                  )}

                  {/* Hole ID label */}
                  <text
                    x={x + COL_WIDTH / 2}
                    y={CHART_HEIGHT + 8}
                    textAnchor="end"
                    style={{ fontSize: 8, fill: isSelected ? W.text1 : W.text4, fontFamily: 'var(--font-mono)' }}
                    transform={`rotate(-35, ${x + COL_WIDTH / 2}, ${CHART_HEIGHT + 8})`}
                  >
                    {hole.id}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>
      </div>

      {/* ── Tooltip (portal-like, rendered outside SVG) ──────────── */}
      {tooltip && <LithTooltip data={tooltip} />}

      {/* ── Selected hole detail ────────────────────────────────────── */}
      {selectedData && (
        <div style={{
          marginTop: 8, padding: '8px 10px', borderRadius: W.radius.sm,
          background: `${W.violet}0D`, border: `1px solid ${W.violet}25`,
          display: 'flex', gap: 12, alignItems: 'flex-start',
        }}>
          {/* Mini lithology column */}
          {(selectedData.lithology_intervals?.length ?? 0) > 0 && (
            <MiniColumn
              intervals={selectedData.lithology_intervals!}
              maxDepth={Math.max(
                selectedData.depth_m,
                ...selectedData.lithology_intervals!.map(iv => iv.to_m),
              )}
            />
          )}

          {/* Details */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: gradeColor(selectedData.treo_ppm), marginBottom: 2 }}>
              {selectedData.id} — {depositLabel(selectedData.deposit)}
            </div>
            <div style={{ fontSize: 10, color: W.text2, lineHeight: 1.5 }}>
              {selectedData.intercept}
            </div>
            {selectedData.including && (
              <div style={{ fontSize: 10, color: W.text4, fontStyle: 'italic' }}>
                incl. {selectedData.including}
              </div>
            )}
            <div style={{ display: 'flex', gap: 10, marginTop: 4, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 10, color: W.text3 }}>
                Type: <strong style={{ color: W.text1 }}>{selectedData.hole_type}</strong>
              </span>
              <span style={{ fontSize: 10, color: W.text3 }}>
                TREO: <strong style={{ color: gradeColor(selectedData.treo_ppm) }}>
                  {selectedData.treo_ppm.toLocaleString()} ppm
                </strong>
              </span>
              <span style={{ fontSize: 10, color: W.text3 }}>
                MREO: <strong style={{ color: W.text1 }}>{selectedData.mreo_pct}%</strong>
              </span>
            </div>

            {/* Lithology interval list */}
            {(selectedData.lithology_intervals?.length ?? 0) > 0 && (
              <div style={{ marginTop: 6, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {selectedData.lithology_intervals!.map((iv, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    padding: '2px 6px', borderRadius: W.radius.xs,
                    background: W.glass04, fontSize: 9,
                  }}>
                    <div style={{
                      width: 6, height: 6, borderRadius: 1, flexShrink: 0,
                      background: LITH_COLORS[iv.lithology] ?? W.text3,
                    }} />
                    <span style={{ color: W.text3, fontFamily: 'var(--font-mono)' }}>
                      {iv.from_m}–{iv.to_m}m
                    </span>
                    <span style={{ color: W.text2 }}>
                      {LITH_LABELS[iv.lithology] ?? iv.lithology}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
