import { memo, useMemo } from 'react'
import { LineChart, Line, ResponsiveContainer, ReferenceLine, Tooltip } from 'recharts'
import { W } from '../../app/canvas/canvasTheme'

interface SparkLineProps {
  data: number[]
  color?: string
  min?: number
  max?: number
  thresholdLow?: number
  thresholdHigh?: number
  height?: number
  showTooltip?: boolean
  unit?: string
}

export const SparkLine = memo(function SparkLine({
  data, color = W.violet, min: _min, max: _max, thresholdLow, thresholdHigh,
  height = 48, showTooltip = false, unit = '',
}: SparkLineProps) {
  const chartData = useMemo(() => data.map((v, i) => ({ i, v })), [data])

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={chartData} margin={{ top: 4, right: 4, left: 4, bottom: 4 }}>
        {thresholdLow !== undefined && (
          <ReferenceLine y={thresholdLow} stroke={W.amber} strokeDasharray="3 3" strokeOpacity={0.5} strokeWidth={1} />
        )}
        {thresholdHigh !== undefined && (
          <ReferenceLine y={thresholdHigh} stroke={W.amber} strokeDasharray="3 3" strokeOpacity={0.5} strokeWidth={1} />
        )}
        {showTooltip && (
          <Tooltip
            contentStyle={{ background: W.surface, border: `1px solid ${W.border}`, borderRadius: 8, fontSize: 11, color: W.text1, fontFamily: 'var(--font-mono)' }}
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
    </ResponsiveContainer>
  )
})
