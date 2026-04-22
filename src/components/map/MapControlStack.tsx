/**
 * MapControlStack — flex-based layout for the four corners of a map.
 *
 * Instead of every control hard-coding position: absolute with magic
 * pixel offsets, each control drops into a named slot and flows via
 * flexbox. Adding / removing a control never cascades into sibling
 * position recalculations.
 *
 * Shared controls now live in stack slots, so placement can move
 * without changing individual control components. Workspace maps keep the
 * AI chat viewport-fixed outside this stack, while non-chat surfaces can
 * still opt into `bottomCenter`.
 */

import type { ReactNode } from 'react'
import { Z } from './mapStacking'

interface MapControlStackProps {
  topRight?: ReactNode
  rightCenter?: ReactNode
  topLeft?: ReactNode
  bottomCenter?: ReactNode
  bottomLeft?: ReactNode
  bottomRight?: ReactNode
  /** Hide all slots (e.g. for non-interactive deck covers) */
  hide?: boolean
  /** Reduced spacing for deck slides and embedded maps */
  compact?: boolean
}

const EDGE = 'var(--workspace-control-edge, 10px)'
const EDGE_COMPACT = 'var(--workspace-control-edge-compact, 6px)'
const NAV_OFFSET = 120
const NAV_OFFSET_COMPACT = 60
const BOTTOM_PAD = 8
const STACK_GAP = 'var(--workspace-control-gap, 6px)'

export function MapControlStack({
  topRight,
  rightCenter,
  topLeft,
  bottomCenter,
  bottomLeft,
  bottomRight,
  hide = false,
  compact = false,
}: MapControlStackProps) {
  if (hide) return null

  const edge = compact ? EDGE_COMPACT : EDGE
  const navOff = compact ? NAV_OFFSET_COMPACT : NAV_OFFSET
  const bottomClearance = 'var(--workspace-floating-bottom-clearance, 0px)'
  const bottomOffset = `calc(${edge} + ${BOTTOM_PAD}px + ${bottomClearance})`
  const topLeftMaxHeight = `calc(100% - (${edge} * 2) - ${BOTTOM_PAD}px - ${bottomClearance})`
  const rightCenterMaxHeight = `calc(100% - (${edge} * 2) - ${bottomClearance})`

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: Z.mapLayerPicker,
      }}
    >
      {topRight && (
        <div
          style={{
            position: 'absolute',
            top: navOff,
            right: edge,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: STACK_GAP,
            pointerEvents: 'auto',
          }}
        >
          {topRight}
        </div>
      )}

      {rightCenter && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            right: edge,
            transform: 'translateY(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: STACK_GAP,
            pointerEvents: 'auto',
            maxHeight: rightCenterMaxHeight,
          }}
        >
          {rightCenter}
        </div>
      )}

      {topLeft && (
        <div
          style={{
            position: 'absolute',
            top: edge,
            left: edge,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: STACK_GAP,
            pointerEvents: 'auto',
            maxHeight: topLeftMaxHeight,
            overflowY: 'auto',
          }}
        >
          {topLeft}
        </div>
      )}

      {bottomLeft && (
        <div
          style={{
            position: 'absolute',
            bottom: bottomOffset,
            left: edge,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: STACK_GAP,
            pointerEvents: 'auto',
          }}
        >
          {bottomLeft}
        </div>
      )}

      {bottomCenter && (
        <div
          style={{
            position: 'absolute',
            bottom: bottomOffset,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: STACK_GAP,
            pointerEvents: 'auto',
          }}
        >
          {bottomCenter}
        </div>
      )}

      {bottomRight && (
        <div
          style={{
            position: 'absolute',
            bottom: bottomOffset,
            right: edge,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: STACK_GAP,
            pointerEvents: 'auto',
          }}
        >
          {bottomRight}
        </div>
      )}
    </div>
  )
}
