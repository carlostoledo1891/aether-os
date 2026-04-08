import { memo, useMemo } from 'react'
import {
  LineChart, Line, ComposedChart, ResponsiveContainer, ReferenceLine, Tooltip, YAxis,
} from 'recharts'
import { W } from '../../app/canvas/canvasTheme'

interface SparkLineProps {
  data: number[]
  color?: string
  thresholdLow?: number
  thresholdHigh?: number
  height?: number
  showTooltip?: boolean
  unit?: string
  rangeLabel?: string
  /** Second series (e.g. precip mm); aligned index with `data` */
  secondaryData?: number[]
  secondaryColor?: string
  secondaryUnit?: string
}

export const SparkLine = memo(function SparkLine({
  data, color = W.violet, thresholdLow, thresholdHigh,
  height = 48, showTooltip = false, unit = '', rangeLabel,
  secondaryData, secondaryColor = W.cyan, secondaryUnit = '',
}: SparkLineProps) {
  const chartData = useMemo(() => {
    if (!secondaryData?.length) return data.map((v, i) => ({ i, v }))
    const n = Math.min(data.length, secondaryData.length)
    const startPrimary = data.length - n
    const startSec = secondaryData.length - n
    return Array.from({ length: n }, (_, j) => ({
      i: j,
      v: data[startPrimary + j],
      v2: secondaryData[startSec + j],
    }))
  }, [data, secondaryData])

  const dual = Boolean(secondaryData?.length)

  const chartInner = dual ? (
    <ComposedChart data={chartData} margin={{ top: 4, right: 6, left: 4, bottom: 4 }}>
      <YAxis yAxisId="left" hide domain={['auto', 'auto']} />
      <YAxis yAxisId="right" hide orientation="right" domain={['auto', 'auto']} />
      {thresholdLow !== undefined && (
        <ReferenceLine yAxisId="left" y={thresholdLow} stroke={W.amber} strokeDasharray="3 3" strokeOpacity={0.5} strokeWidth={1} />
      )}
      {thresholdHigh !== undefined && (
        <ReferenceLine yAxisId="left" y={thresholdHigh} stroke={W.amber} strokeDasharray="3 3" strokeOpacity={0.5} strokeWidth={1} />
      )}
      {showTooltip && (
        <Tooltip
          contentStyle={{ background: W.surface, border: `1px solid ${W.border}`, borderRadius: W.radius.sm, fontSize: 11, color: W.text1, fontFamily: 'var(--font-mono)' }}
          formatter={(v, name) => {
            if (name === 'v2') return [`${Number(v).toFixed(2)}${secondaryUnit}`, 'precip']
            return [`${Number(v).toFixed(2)}${unit}`, 'WQ']
          }}
          labelFormatter={() => ''}
        />
      )}
      <Line
        yAxisId="left"
        type="monotone"
        dataKey="v"
        stroke={color}
        strokeWidth={1.5}
        dot={false}
        isAnimationActive={false}
        connectNulls
      />
      <Line
        yAxisId="right"
        type="monotone"
        dataKey="v2"
        stroke={secondaryColor}
        strokeWidth={1.2}
        strokeDasharray="4 3"
        dot={false}
        isAnimationActive={false}
        connectNulls
      />
    </ComposedChart>
  ) : (
    <LineChart data={chartData} margin={{ top: 4, right: 4, left: 4, bottom: 4 }}>
      {thresholdLow !== undefined && (
        <ReferenceLine y={thresholdLow} stroke={W.amber} strokeDasharray="3 3" strokeOpacity={0.5} strokeWidth={1} />
      )}
      {thresholdHigh !== undefined && (
        <ReferenceLine y={thresholdHigh} stroke={W.amber} strokeDasharray="3 3" strokeOpacity={0.5} strokeWidth={1} />
      )}
      {showTooltip && (
        <Tooltip
          contentStyle={{ background: W.surface, border: `1px solid ${W.border}`, borderRadius: W.radius.sm, fontSize: 11, color: W.text1, fontFamily: 'var(--font-mono)' }}
          formatter={(v) => [`${Number(v).toFixed(2)}${unit}`, '']}
          labelFormatter={() => ''}
        />
      )}
      <Line
        type="monotone"
        dataKey="v"
        stroke={color}
        strokeWidth={1.5}
        dot={false}
        isAnimationActive={false}
      />
    </LineChart>
  )

  return (
    <div style={{ position: 'relative' }}>
      <ResponsiveContainer width="100%" height={height}>
        {chartInner}
      </ResponsiveContainer>
      {rangeLabel && (
        <span style={{
          position: 'absolute', bottom: 2, right: 4,
          fontSize: 8, color: `${color}60`, fontFamily: 'var(--font-mono)',
          letterSpacing: '0.04em', pointerEvents: 'none',
        }}>
          {rangeLabel}
        </span>
      )}
      {dual && (
        <span style={{
          position: 'absolute', bottom: 2, left: 4,
          fontSize: 7, color: `${secondaryColor}70`, fontFamily: 'var(--font-mono)',
          letterSpacing: '0.03em', pointerEvents: 'none',
        }}>
          dashed · precip
        </span>
      )}
    </div>
  )
})
