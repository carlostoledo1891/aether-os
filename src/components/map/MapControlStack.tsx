/**
 * MapControlStack — flex-based layout for the four corners of a map.
 *
 * Instead of every control hard-coding position: absolute with magic
 * pixel offsets, each control drops into a named slot and flows via
 * flexbox. Adding / removing a control never cascades into sibling
 * position recalculations.
 *
 * The NavigationControl is a MapLibre-native element rendered inside
 * the <Map> component, so top-right starts offset below it (~80 px).
 */

import type { ReactNode } from 'react'
import { Z } from './mapStacking'

interface MapControlStackProps {
  topRight?: ReactNode
  topLeft?: ReactNode
  bottomLeft?: ReactNode
  bottomRight?: ReactNode
  /** Hide all slots (e.g. for non-interactive deck covers) */
  hide?: boolean
  /** Reduced spacing for deck slides and embedded maps */
  compact?: boolean
}

const EDGE = 10
const EDGE_COMPACT = 6
const NAV_OFFSET = 120
const NAV_OFFSET_COMPACT = 60
const BOTTOM_PAD = 8

export function MapControlStack({
  topRight,
  topLeft,
  bottomLeft,
  bottomRight,
  hide = false,
  compact = false,
}: MapControlStackProps) {
  if (hide) return null

  const edge = compact ? EDGE_COMPACT : EDGE
  const navOff = compact ? NAV_OFFSET_COMPACT : NAV_OFFSET

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
            gap: 4,
            pointerEvents: 'auto',
          }}
        >
          {topRight}
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
            gap: 4,
            pointerEvents: 'auto',
            maxHeight: `calc(100% - ${edge * 2 + BOTTOM_PAD}px)`,
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
            bottom: edge + BOTTOM_PAD,
            left: edge,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 6,
            pointerEvents: 'auto',
          }}
        >
          {bottomLeft}
        </div>
      )}

      {bottomRight && (
        <div
          style={{
            position: 'absolute',
            bottom: edge,
            right: edge,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: 6,
            pointerEvents: 'auto',
          }}
        >
          {bottomRight}
        </div>
      )}
    </div>
  )
}
