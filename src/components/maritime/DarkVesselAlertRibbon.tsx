/**
 * DarkVesselAlertRibbon — horizontal strip of alert chips along the
 * top of the maritime workspace, summarising recent dark-vessel
 * detections. Composition only: reuses `StatusChip` + the existing
 * glass-card chrome tokens.
 *
 * Lives inside the workspace, *under* the brand strip and lens bar,
 * so the dark events stay visible without crowding the map.
 */

import { useMemo } from 'react'
import { MARITIME_DARK_EVENTS } from '../../data/maritime/fixtures/darkEvents'
import { MARITIME_AOIS } from '../../data/maritime/fixtures/aois'
import { MARITIME_VESSELS } from '../../data/maritime/fixtures/vessels'
import { StatusChip } from '../ui/StatusChip'
import type { DarkVesselEvent } from '../../data/maritime/types'

function severityVariant(s: DarkVesselEvent['severity']): 'red' | 'amber' | 'muted' {
  if (s === 'action_required' || s === 'blocked') return 'red'
  if (s === 'attention') return 'amber'
  return 'muted'
}

interface RibbonRow {
  event: DarkVesselEvent
  vesselName: string
  aoiName: string
  variant: 'red' | 'amber' | 'muted'
  detectedLabel: string
}

function formatDetected(iso: string): string {
  try {
    const d = new Date(iso)
    return d.toLocaleString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      month: 'short',
      day: '2-digit',
    })
  } catch {
    return iso
  }
}

interface DarkVesselAlertRibbonProps {
  /** Optional click handler, called with the vessel id for the event. */
  onSelect?: (vesselId: string) => void
}

export function DarkVesselAlertRibbon({ onSelect }: DarkVesselAlertRibbonProps) {
  const rows: RibbonRow[] = useMemo(() => {
    const aoiMap = new Map(MARITIME_AOIS.map(a => [a.id, a.name]))
    const vesselMap = new Map(MARITIME_VESSELS.map(v => [v.id, v.name]))
    return MARITIME_DARK_EVENTS.map(event => ({
      event,
      vesselName: vesselMap.get(event.vesselId) ?? event.vesselId,
      aoiName: aoiMap.get(event.aoiId) ?? event.aoiId,
      variant: severityVariant(event.severity),
      detectedLabel: formatDetected(event.detectedAt),
    }))
  }, [])

  if (rows.length === 0) return null

  return (
    <div
      role="list"
      aria-label="Dark-vessel detections"
      style={{
        display: 'flex',
        gap: 10,
        padding: '8px 12px',
        background: 'var(--w-glass-12)',
        border: '1px solid var(--w-border2)',
        borderRadius: 12,
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        overflowX: 'auto',
        maxWidth: 'min(960px, calc(100vw - 32px))',
      }}
    >
      <span
        style={{
          flexShrink: 0,
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--w-text3)',
          fontFamily: 'var(--font-mono)',
          alignSelf: 'center',
        }}
      >
        Dark · {rows.length}
      </span>
      {rows.map(row => (
        <button
          key={row.event.id}
          type="button"
          onClick={() => onSelect?.(row.event.vesselId)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            border: '1px solid var(--w-border2)',
            background: 'var(--w-glass-08)',
            padding: '6px 10px',
            borderRadius: 999,
            cursor: onSelect ? 'pointer' : 'default',
            color: 'var(--w-text2)',
            fontSize: 11,
            fontFamily: 'var(--font-ui)',
            flexShrink: 0,
          }}
          title={row.event.summary}
        >
          <StatusChip label={row.event.id} variant={row.variant} dot />
          <span style={{ color: 'var(--w-text1)', fontWeight: 600 }}>{row.vesselName}</span>
          <span style={{ color: 'var(--w-text4)' }}>·</span>
          <span style={{ color: 'var(--w-text3)' }}>{row.aoiName}</span>
          <span style={{ color: 'var(--w-text4)' }}>·</span>
          <span style={{ color: 'var(--w-text4)', fontFamily: 'var(--font-mono)', fontSize: 10 }}>
            {row.detectedLabel}
          </span>
        </button>
      ))}
    </div>
  )
}
