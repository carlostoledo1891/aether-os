import { useMemo, useState, useCallback, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { AlertTriangle } from 'lucide-react'
import { W } from '../../app/canvas/canvasTheme'
import drillholesUrl from '../../data/geojson/caldeira-drillholes.geojson?url'

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
}

function gradeColor(ppm: number): string {
  if (ppm >= 8000) return W.green
  if (ppm >= 5000) return W.cyan
  if (ppm >= 3000) return W.amber
  return W.text3
}

function gradeLabel(ppm: number): string {
  if (ppm >= 8000) return 'High grade'
  if (ppm >= 5000) return 'Good grade'
  if (ppm >= 3000) return 'Moderate'
  return 'Low'
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: DrillHoleEntry }> }) {
  if (!active || !payload?.[0]) return null
  const d = payload[0].payload
  return (
    <div style={{
      background: W.panel, border: `1px solid ${W.glass12}`, borderRadius: W.radius.sm,
      padding: '8px 10px', maxWidth: 240, fontSize: 10, lineHeight: 1.5,
    }}>
      <div style={{ fontWeight: 700, color: gradeColor(d.treo_ppm), marginBottom: 3 }}>
        {d.id} — {d.deposit.replace(/-/g, ' ')}
      </div>
      <div style={{ color: W.text2 }}>
        <strong>{d.treo_ppm.toLocaleString()}</strong> ppm TREO · {d.mreo_pct}% MREO · {d.hole_type}
      </div>
      <div style={{ color: W.text3, marginTop: 3 }}>{d.intercept}</div>
      {d.including && <div style={{ color: W.text4, fontStyle: 'italic' }}>incl. {d.including}</div>}
    </div>
  )
}

export function DrillTraceSection() {
  const [selectedHole, setSelectedHole] = useState<string | null>(null)
  const [holes, setHoles] = useState<DrillHoleEntry[]>([])

  useEffect(() => {
    fetch(drillholesUrl)
      .then(r => r.json())
      .then((geojson: { features: Array<{ properties: DrillHoleEntry }> }) => {
        setHoles(
          geojson.features
            .map(f => f.properties)
            .sort((a, b) => b.treo_ppm - a.treo_ppm),
        )
      })
      .catch(() => { /* graceful: chart will be empty */ })
  }, [])

  const handleBarClick = useCallback((_: unknown, idx: number) => {
    const h = holes[idx]
    setSelectedHole(prev => prev === h.id ? null : h.id)
  }, [holes])

  const maxDepth = useMemo(() => holes.length > 0 ? Math.max(...holes.map(h => h.depth_m)) : 200, [holes])

  if (holes.length === 0) {
    return <div style={{ fontSize: 10, color: W.text4, padding: 8 }}>Loading drill data...</div>
  }

  return (
    <div>
      {/* Disclaimer */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
        <AlertTriangle size={9} style={{ color: W.amber, flexShrink: 0 }} />
        <span style={{ fontSize: 9, color: W.text4 }}>
          Schematic only — not to scale. Collar positions are non-survey reference geometry.
        </span>
      </div>

      {/* Grade legend */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
        {[
          { label: '≥ 8,000 ppm', color: W.green },
          { label: '5,000–8,000', color: W.cyan },
          { label: '3,000–5,000', color: W.amber },
          { label: '< 3,000', color: W.text3 },
        ].map(({ label, color }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: color, opacity: 0.8 }} />
            <span style={{ fontSize: 9, color: W.text4 }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          data={holes}
          margin={{ top: 4, right: 4, bottom: 4, left: 4 }}
        >
          <XAxis
            dataKey="id"
            tick={{ fontSize: 8, fill: W.text4, fontFamily: 'var(--font-mono)' }}
            tickLine={false}
            axisLine={{ stroke: W.glass12 }}
            interval={0}
            angle={-35}
            textAnchor="end"
            height={40}
          />
          <YAxis
            domain={[0, Math.ceil(maxDepth / 50) * 50]}
            reversed
            tick={{ fontSize: 9, fill: W.text4, fontFamily: 'var(--font-mono)' }}
            tickLine={false}
            axisLine={{ stroke: W.glass12 }}
            label={{ value: 'Depth (m)', angle: -90, position: 'insideLeft', offset: 10, style: { fontSize: 9, fill: W.text4 } }}
            width={45}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: `${W.text4}10` }} />
          <Bar
            dataKey="depth_m"
            radius={[2, 2, 0, 0]}
            onClick={handleBarClick}
            style={{ cursor: 'pointer' }}
          >
            {holes.map((h) => (
              <Cell
                key={h.id}
                fill={gradeColor(h.treo_ppm)}
                fillOpacity={selectedHole && selectedHole !== h.id ? 0.25 : 0.75}
                stroke={selectedHole === h.id ? W.text1 : 'transparent'}
                strokeWidth={selectedHole === h.id ? 1.5 : 0}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Selected hole detail */}
      {selectedHole && (() => {
        const h = holes.find(x => x.id === selectedHole)
        if (!h) return null
        return (
          <div style={{
            marginTop: 6, padding: '7px 9px', borderRadius: W.radius.sm,
            background: `${gradeColor(h.treo_ppm)}0D`, border: `1px solid ${gradeColor(h.treo_ppm)}25`,
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: gradeColor(h.treo_ppm), marginBottom: 2 }}>
              {h.id} — {h.deposit.replace(/-/g, ' ')}
            </div>
            <div style={{ fontSize: 10, color: W.text2, lineHeight: 1.5 }}>
              {h.note}
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
              <span style={{ fontSize: 10, color: W.text3 }}>Type: <strong style={{ color: W.text1 }}>{h.hole_type}</strong></span>
              <span style={{ fontSize: 10, color: W.text3 }}>Grade: <strong style={{ color: gradeColor(h.treo_ppm) }}>{gradeLabel(h.treo_ppm)}</strong></span>
              <span style={{ fontSize: 10, color: W.text3 }}>MREO: <strong style={{ color: W.text1 }}>{h.mreo_pct}%</strong></span>
            </div>
          </div>
        )
      })()}
    </div>
  )
}
