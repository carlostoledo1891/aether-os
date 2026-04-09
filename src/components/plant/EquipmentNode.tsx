import { memo, useMemo } from 'react'
import { W } from '../../app/canvas/canvasTheme'
import {
  type PilotPlantEquipment,
  getSensorsForEquipment,
  getSensorValue,
  getCategoryColor,
} from '../../data/caldeira/pilotPlantData'
import type { PlantTelemetry } from '../../types/telemetry'
import css from './controlRoom.module.css'

interface EquipmentNodeProps {
  equipment: PilotPlantEquipment
  plant: PlantTelemetry
  x: number
  y: number
  width: number
  height: number
  isSelected: boolean
  isHovered: boolean
  isDimmed: boolean
  onClick: () => void
  onMouseEnter: () => void
  onMouseLeave: () => void
}

const ACCENT: Record<string, { stroke: string; fill: string; text: string }> = {
  cyan:   { stroke: W.cyan,   fill: 'rgba(0,212,200,0.08)',   text: W.cyan },
  violet: { stroke: W.violet, fill: 'rgba(124,92,252,0.08)',  text: W.violetSoft },
  green:  { stroke: W.green,  fill: 'rgba(34,214,138,0.08)',  text: W.green },
  amber:  { stroke: W.amber,  fill: 'rgba(245,166,35,0.08)',  text: W.amber },
}

const STATUS_COLOR: Record<string, string> = {
  running: W.green,
  idle: W.text4,
  warning: W.amber,
  maintenance: W.red,
}

export const EquipmentNode = memo(function EquipmentNode({
  equipment,
  plant,
  x,
  y,
  width,
  height,
  isSelected,
  isHovered,
  isDimmed,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: EquipmentNodeProps) {
  const catColor = getCategoryColor(equipment.category)
  const palette = ACCENT[catColor]
  const statusColor = STATUS_COLOR[equipment.status] ?? W.text4

  const sensors = useMemo(() => getSensorsForEquipment(equipment.tag), [equipment.tag])
  const primarySensor = sensors[0]
  const primaryValue = primarySensor ? getSensorValue(primarySensor, plant) : null

  const borderOpacity = isSelected ? 0.8 : isHovered ? 0.6 : 0.35

  return (
    <g
      className={`${css.equipmentGroup} ${isDimmed ? css.equipmentDimmed : ''}`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{ cursor: 'pointer' }}
    >
      {/* Selection glow ring */}
      {isSelected && (
        <rect
          x={x - 3}
          y={y - 3}
          width={width + 6}
          height={height + 6}
          rx={10}
          fill="none"
          stroke={palette.stroke}
          strokeWidth={1.5}
          strokeOpacity={0.35}
          style={{ filter: `drop-shadow(0 0 8px ${palette.stroke}40)` }}
        />
      )}

      {/* Hover glow */}
      {isHovered && !isSelected && (
        <rect
          x={x - 2}
          y={y - 2}
          width={width + 4}
          height={height + 4}
          rx={9}
          fill="none"
          stroke={palette.stroke}
          strokeWidth={1}
          strokeOpacity={0.25}
        />
      )}

      {/* Background fill */}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={7}
        fill={palette.fill}
        stroke={palette.stroke}
        strokeWidth={isSelected ? 1.5 : 1}
        strokeOpacity={borderOpacity}
        className="nodeRect"
      />

      {/* Inner subtle gradient line at top */}
      <line
        x1={x + 8}
        y1={y + 1}
        x2={x + width - 8}
        y2={y + 1}
        stroke={palette.stroke}
        strokeWidth={0.5}
        strokeOpacity={0.15}
      />

      {/* Status dot (top right) */}
      <circle
        cx={x + width - 8}
        cy={y + 8}
        r={3}
        fill={statusColor}
        className={css.statusDot}
        style={{ filter: `drop-shadow(0 0 3px ${statusColor}80)` }}
      />

      {/* Equipment tag (top left, subtle) */}
      <text
        x={x + 8}
        y={y + 12}
        fontFamily="var(--font-mono)"
        fontSize={7}
        fill={W.text4}
        letterSpacing="0.04em"
      >
        {equipment.tag}
      </text>

      {/* Equipment name */}
      <text
        x={x + width / 2}
        y={y + height / 2 - (primaryValue != null ? 2 : 0)}
        textAnchor="middle"
        fontFamily="var(--font-ui)"
        fontSize={9}
        fontWeight={600}
        fill={palette.text}
      >
        {equipment.name.length > 22 ? equipment.name.slice(0, 20) + '…' : equipment.name}
      </text>

      {/* Primary sensor value */}
      {primarySensor && primaryValue != null && (
        <text
          x={x + width / 2}
          y={y + height / 2 + 12}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize={10}
          fontWeight={600}
          fill={W.text1}
        >
          {primaryValue.toFixed(primarySensor.type === 'pH' ? 2 : 1)} {primarySensor.unit}
        </text>
      )}

      {/* Sensor count badge (bottom left) */}
      {sensors.length > 0 && (
        <>
          <rect
            x={x + 4}
            y={y + height - 14}
            width={18}
            height={10}
            rx={3}
            fill={palette.stroke}
            fillOpacity={0.1}
            stroke={palette.stroke}
            strokeWidth={0.5}
            strokeOpacity={0.2}
          />
          <text
            x={x + 13}
            y={y + height - 7}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={7}
            fill={palette.text}
            fillOpacity={0.7}
          >
            {sensors.length}s
          </text>
        </>
      )}

      {/* Category label (bottom right) */}
      <text
        x={x + width - 6}
        y={y + height - 6}
        textAnchor="end"
        fontFamily="var(--font-mono)"
        fontSize={6}
        fill={W.text4}
        fillOpacity={0.5}
        letterSpacing="0.04em"
      >
        {equipment.category.toUpperCase()}
      </text>
    </g>
  )
})
