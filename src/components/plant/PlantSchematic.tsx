import { memo, useMemo, useCallback } from 'react'
import { W } from '../../app/canvas/canvasTheme'
import type { PlantTelemetry } from '../../types/telemetry'
import {
  PILOT_PLANT_EQUIPMENT,
  FLOW_CONNECTIONS,
  PROCESS_STEPS,
  type EquipmentCategory,
} from '../../data/caldeira/pilotPlantData'
import { EquipmentNode } from './EquipmentNode'
import css from './controlRoom.module.css'

interface PlantSchematicProps {
  plant: PlantTelemetry
  selectedTag: string | null
  hoveredTag: string | null
  activeCategory: EquipmentCategory | 'all'
  onSelectEquipment: (tag: string | null) => void
  onHoverEquipment: (tag: string | null) => void
}

const SVG_W = 1100
const SVG_H = 620
const NODE_W = 130
const NODE_H = 58
const MARGIN = 20

const FLOW_COLORS: Record<string, string> = {
  process: W.cyan,
  reagent: W.amber,
  recycle: W.violetSoft,
  product: W.green,
  waste: W.gray,
}

const FLOW_CSS_CLASS: Record<string, string> = {
  process: css.flowProcess,
  reagent: css.flowReagent,
  recycle: css.flowRecycle,
  product: css.flowProduct,
  waste: css.flowWaste,
}

/**
 * Layout coordinates for each equipment node.
 * Hand-tuned for a clear process flow reading left-to-right, top-to-bottom.
 */
const NODE_POSITIONS: Record<string, { x: number; y: number }> = {
  'E-101': { x: 30,  y: 30 },   // Ore Hopper
  'E-102': { x: 190, y: 30 },   // Conveyor
  'E-103': { x: 350, y: 30 },   // Trommel
  'E-402': { x: 30,  y: 140 },  // Reagent Dosing
  'E-201': { x: 350, y: 140 },  // Leach Reactor
  'E-202': { x: 350, y: 260 },  // Clay Filter
  'E-203': { x: 540, y: 260 },  // CCD
  'E-303': { x: 190, y: 260 },  // Spent Clay Dewater
  'E-204': { x: 730, y: 260 },  // Impurity Removal
  'E-301': { x: 730, y: 140 },  // MREC Precip
  'E-302': { x: 730, y: 30 },   // MREC Filter
  'E-501': { x: 920, y: 140 },  // Water Treatment
  'E-502': { x: 920, y: 260 },  // AMSUL Recovery
  'E-401': { x: 190, y: 400 },  // Pumps
  'E-601': { x: 730, y: 400 },  // PLC
  'E-602': { x: 920, y: 400 },  // HMI
  'E-701': { x: 30,  y: 400 },  // Lab (off-site)
}

/** Compute SVG path between two equipment rects with routing */
function computeFlowPath(
  fromTag: string,
  toTag: string,
): string {
  const fromRaw = NODE_POSITIONS[fromTag]
  const toRaw = NODE_POSITIONS[toTag]
  if (!fromRaw || !toRaw) return ''

  // Apply MARGIN to match EquipmentNode rendering offset
  const from = { x: fromRaw.x + MARGIN, y: fromRaw.y }
  const to = { x: toRaw.x + MARGIN, y: toRaw.y }

  const fx = from.x + NODE_W / 2
  const fy = from.y + NODE_H / 2
  const tx = to.x + NODE_W / 2
  const ty = to.y + NODE_H / 2

  const dx = tx - fx
  const dy = ty - fy

  if (Math.abs(dy) < NODE_H) {
    const startX = dx > 0 ? from.x + NODE_W : from.x
    const endX = dx > 0 ? to.x : to.x + NODE_W
    const startY = from.y + NODE_H / 2
    const endY = to.y + NODE_H / 2
    const midX = (startX + endX) / 2
    return `M${startX},${startY} C${midX},${startY} ${midX},${endY} ${endX},${endY}`
  }

  if (Math.abs(dx) < NODE_W) {
    const startX = from.x + NODE_W / 2
    const startY = dy > 0 ? from.y + NODE_H : from.y
    const endX = to.x + NODE_W / 2
    const endY = dy > 0 ? to.y : to.y + NODE_H
    const midY = (startY + endY) / 2
    return `M${startX},${startY} C${startX},${midY} ${endX},${midY} ${endX},${endY}`
  }

  const startX = dx > 0 ? from.x + NODE_W : from.x
  const startY = from.y + NODE_H / 2
  const endX = to.x + NODE_W / 2
  const endY = dy > 0 ? to.y : to.y + NODE_H
  return `M${startX},${startY} C${startX + dx * 0.4},${startY} ${endX},${startY + dy * 0.3} ${endX},${endY}`
}

export const PlantSchematic = memo(function PlantSchematic({
  plant,
  selectedTag,
  hoveredTag,
  activeCategory,
  onSelectEquipment,
  onHoverEquipment,
}: PlantSchematicProps) {

  const filteredEquipment = useMemo(
    () => PILOT_PLANT_EQUIPMENT.filter(e => NODE_POSITIONS[e.tag]),
    [],
  )

  const handleClick = useCallback(
    (tag: string) => onSelectEquipment(selectedTag === tag ? null : tag),
    [selectedTag, onSelectEquipment],
  )

  return (
    <svg
      viewBox={`0 0 ${SVG_W + MARGIN * 2} ${SVG_H}`}
      className={css.schematicSvg}
      style={{ minWidth: 800 }}
    >
      <defs>
        {/* Arrow markers for flow direction */}
        {Object.entries(FLOW_COLORS).map(([variant, color]) => (
          <marker
            key={variant}
            id={`arrow-${variant}`}
            viewBox="0 0 10 10"
            refX={8}
            refY={5}
            markerWidth={5}
            markerHeight={5}
            orient="auto-start-reverse"
          >
            <path
              d="M2 1L8 5L2 9"
              fill="none"
              stroke={color}
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.7}
            />
          </marker>
        ))}

        {/* Subtle grid pattern */}
        <pattern id="schematicGrid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke={W.glass02}
            strokeWidth={0.5}
          />
        </pattern>
      </defs>

      {/* Background grid */}
      <rect width="100%" height="100%" fill={W.canvas} />
      <rect width="100%" height="100%" fill="url(#schematicGrid)" />

      {/* Process area labels */}
      {PROCESS_STEPS.map(step => {
        const eqTags = step.equipmentTags.filter(t => NODE_POSITIONS[t])
        if (eqTags.length === 0) return null
        const positions = eqTags.map(t => NODE_POSITIONS[t])
        const minX = Math.min(...positions.map(p => p.x + MARGIN)) - 12
        const minY = Math.min(...positions.map(p => p.y)) - 18
        const maxX = Math.max(...positions.map(p => p.x + MARGIN)) + NODE_W + 12
        const maxY = Math.max(...positions.map(p => p.y)) + NODE_H + 12

        const dc: Record<string, string> = {
          cyan: W.cyan,
          violet: W.violet,
          green: W.green,
          amber: W.amber,
        }
        const areaColor = dc[step.domainColor] ?? W.text4

        return (
          <g key={`area-${step.step}`}>
            <rect
              x={minX}
              y={minY}
              width={maxX - minX}
              height={maxY - minY}
              rx={10}
              fill="none"
              stroke={areaColor}
              strokeWidth={0.5}
              strokeOpacity={0.08}
              strokeDasharray="4 4"
            />
            <text
              x={minX + 6}
              y={minY + 8}
              fontFamily="var(--font-mono)"
              fontSize={7}
              fill={areaColor}
              fillOpacity={0.3}
              letterSpacing="0.06em"
            >
              {step.step}. {step.shortName.toUpperCase()}
            </text>
          </g>
        )
      })}

      {/* Flow connections (animated dashed lines) */}
      {FLOW_CONNECTIONS.map(conn => {
        const path = computeFlowPath(conn.from, conn.to)
        if (!path) return null
        const color = FLOW_COLORS[conn.variant] ?? W.text4
        const flowClass = FLOW_CSS_CLASS[conn.variant] ?? css.flowProcess

        const isRelevant =
          activeCategory === 'all' ||
          PILOT_PLANT_EQUIPMENT.some(
            e =>
              (e.tag === conn.from || e.tag === conn.to) &&
              e.category === activeCategory,
          )

        return (
          <g key={conn.id} opacity={isRelevant ? 1 : 0.15}>
            {/* Casing for depth */}
            <path
              d={path}
              fill="none"
              stroke={W.glass06}
              strokeWidth={3.5}
              strokeLinecap="round"
            />
            {/* Animated flow line */}
            <path
              d={path}
              fill="none"
              stroke={color}
              strokeWidth={1.5}
              strokeLinecap="round"
              className={flowClass}
              markerEnd={`url(#arrow-${conn.variant})`}
              opacity={0.7}
            />
            {/* Flow label */}
            {conn.label && (
              <text
                fontFamily="var(--font-mono)"
                fontSize={7}
                fill={color}
                fillOpacity={0.4}
                letterSpacing="0.02em"
              >
                <textPath
                  href={`#flow-path-${conn.id}`}
                  startOffset="50%"
                  textAnchor="middle"
                >
                  {conn.label}
                </textPath>
              </text>
            )}
            {/* Hidden path for textPath reference */}
            <path id={`flow-path-${conn.id}`} d={path} fill="none" stroke="none" />
          </g>
        )
      })}

      {/* Equipment nodes */}
      {filteredEquipment.map(eq => {
        const pos = NODE_POSITIONS[eq.tag]
        const isDimmed =
          activeCategory !== 'all' && eq.category !== activeCategory

        return (
          <EquipmentNode
            key={eq.tag}
            equipment={eq}
            plant={plant}
            x={pos.x + MARGIN}
            y={pos.y}
            width={NODE_W}
            height={NODE_H}
            isSelected={selectedTag === eq.tag}
            isHovered={hoveredTag === eq.tag}
            isDimmed={isDimmed}
            onClick={() => handleClick(eq.tag)}
            onMouseEnter={() => onHoverEquipment(eq.tag)}
            onMouseLeave={() => onHoverEquipment(null)}
          />
        )
      })}

      {/* MREC Product output callout */}
      <g>
        <rect
          x={MARGIN + 730}
          y={0}
          width={130}
          height={24}
          rx={5}
          fill={`${W.green}10`}
          stroke={W.green}
          strokeWidth={1}
          strokeOpacity={0.3}
        />
        <text
          x={MARGIN + 795}
          y={13}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize={8}
          fontWeight={600}
          fill={W.green}
        >
          MREC PRODUCT OUT
        </text>
      </g>

      {/* Recycle loop label */}
      <text
        x={MARGIN + 920 + NODE_W / 2}
        y={370}
        textAnchor="middle"
        fontFamily="var(--font-mono)"
        fontSize={7}
        fill={W.violetSoft}
        fillOpacity={0.4}
      >
        ↺ CLOSED-LOOP REAGENT RECYCLE
      </text>

      {/* Dry stack callout for spent clay */}
      <g>
        <rect
          x={MARGIN + 190}
          y={326}
          width={130}
          height={22}
          rx={5}
          fill={W.graySubtle}
          stroke={W.gray}
          strokeWidth={0.5}
          strokeOpacity={0.3}
        />
        <text
          x={MARGIN + 255}
          y={340}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize={7}
          fill={W.gray}
          fillOpacity={0.6}
        >
          → DRY STACK / PIT BACKFILL
        </text>
      </g>

      {/* ROM Ore input label */}
      <g>
        <line
          x1={MARGIN + 10}
          y1={30 + NODE_H / 2}
          x2={MARGIN + 30}
          y2={30 + NODE_H / 2}
          stroke={W.cyan}
          strokeWidth={1.5}
          strokeOpacity={0.4}
          markerEnd="url(#arrow-process)"
        />
        <text
          x={MARGIN}
          y={30 + NODE_H / 2 - 10}
          fontFamily="var(--font-mono)"
          fontSize={7}
          fill={W.cyan}
          fillOpacity={0.5}
          letterSpacing="0.06em"
        >
          ROM ORE IN
        </text>
      </g>

      {/* Footer badge */}
      <text
        x={SVG_W / 2 + MARGIN}
        y={SVG_H - 10}
        textAnchor="middle"
        fontFamily="var(--font-mono)"
        fontSize={8}
        fill={W.violet}
        fillOpacity={0.3}
        letterSpacing="0.06em"
      >
        CALDEIRA PILOT PLANT · INNOVATION & RESEARCH CENTER · POÇOS DE CALDAS
      </text>
    </svg>
  )
})
