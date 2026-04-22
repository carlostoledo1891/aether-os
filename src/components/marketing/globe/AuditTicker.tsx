import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import { W } from '../../../theme/publicTheme'
import {
  getRecentChain,
  openProvenance,
  subscribeToChain,
  type ChainEvent,
} from './globeBus'

/**
 * Vertical chain of events, anchored to the right edge.
 *
 * One row per chain event — newest at top, sliding the older rows
 * down. The bottom of the column fades out via a mask gradient so
 * old events ghost away rather than abruptly disappearing.
 *
 * This is the only audit HUD on screen: the LiveCounter shows the
 * total, this column shows the flow. No duplicated chain-head chip.
 *
 * Each row is clickable — reveals the provenance card. The camera
 * is purely scroll-driven, so clicking a row never moves the map.
 */

const RIGHT_GUTTER = 20
const COLUMN_WIDTH = 280
// Generous cap — the stream is mask-faded at the bottom and clips
// overflow, so we let it grow tall enough to fill any viewport.
const VISIBLE_ROWS = 32

const wrap: CSSProperties = {
  position: 'fixed',
  top: 76, // sits just below the ProvenanceChip in the top-right corner
  bottom: 0, // extends to the page bottom
  right: RIGHT_GUTTER,
  width: COLUMN_WIDTH,
  zIndex: 6,
  display: 'flex',
  flexDirection: 'column',
  pointerEvents: 'none', // children opt back in
}

const headerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'space-between',
  padding: '0 4px 8px',
  fontFamily: 'var(--font-mono)',
  fontSize: 9,
  fontWeight: 600,
  letterSpacing: '0.14em',
  color: W.text4,
  textTransform: 'uppercase',
  borderBottom: `1px solid ${W.glass08}`,
}

const streamStyle: CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  paddingTop: 8,
  overflow: 'hidden',
  // fade older rows toward bottom so the column never looks "cut off"
  maskImage: 'linear-gradient(to bottom, black 0, black 70%, transparent 100%)',
  WebkitMaskImage: 'linear-gradient(to bottom, black 0, black 70%, transparent 100%)',
  pointerEvents: 'auto',
}

const KIND_COLOR: Record<ChainEvent['kind'], string> = {
  asset: '#7C5CFC',
  sensor: '#22d3ee',
  alert: '#f59e0b',
  license: '#a78bfa',
  assay: '#34d399',
}

const KIND_LABEL: Record<ChainEvent['kind'], string> = {
  asset: 'AST',
  sensor: 'SEN',
  alert: 'ALT',
  license: 'LIC',
  assay: 'ASY',
}

function ChainRow({ ev, fresh }: { ev: ChainEvent; fresh: boolean }) {
  const color = KIND_COLOR[ev.kind]
  const preview = ev.hash.slice(0, 6) + '…' + ev.hash.slice(-4)
  return (
    <button
      type="button"
      onClick={() => {
        // Open the provenance card. The camera is purely scroll-driven,
        // so we deliberately don't move it on click — the card is a
        // payoff, not a navigation.
        openProvenance(ev)
      }}
      style={{
        display: 'grid',
        gridTemplateColumns: 'auto auto 1fr auto',
        alignItems: 'center',
        gap: 10,
        padding: '7px 12px',
        borderRadius: 8,
        border: `1px solid ${W.glass08}`,
        background: 'rgba(10, 13, 24, 0.55)',
        color: W.text2,
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        textAlign: 'left',
        cursor: 'pointer',
        transition: 'background 200ms ease',
        animation: fresh ? 'rowIn 380ms ease-out' : undefined,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(22, 28, 50, 0.85)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(10, 13, 24, 0.55)'
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: color,
          boxShadow: `0 0 8px ${color}`,
          flexShrink: 0,
        }}
      />
      <span style={{ color: W.text3, fontWeight: 700, fontSize: 9, letterSpacing: '0.1em' }}>
        {KIND_LABEL[ev.kind]}
      </span>
      <span
        style={{
          fontVariantNumeric: 'tabular-nums',
          letterSpacing: '0.02em',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        0x{preview}
      </span>
      <span style={{ color: W.text4, fontSize: 10, fontVariantNumeric: 'tabular-nums' }}>
        #{ev.block.toLocaleString()}
      </span>
    </button>
  )
}

export function AuditTicker() {
  const [events, setEvents] = useState<ChainEvent[]>(() => getRecentChain())
  const [latestId, setLatestId] = useState<string | null>(null)

  useEffect(() => {
    return subscribeToChain((ev) => {
      setEvents((prev) => [ev, ...prev].slice(0, VISIBLE_ROWS))
      setLatestId(ev.hash)
    })
  }, [])

  const head = events[0]
  const headBlock = head ? `#${head.block.toLocaleString()}` : '—'

  return (
    <div style={wrap}>
      <div style={{ ...headerStyle, pointerEvents: 'auto' }}>
        <span>chain · live</span>
        <span style={{ color: W.text2, fontFamily: 'var(--font-mono)', letterSpacing: '0.06em' }}>
          {headBlock}
        </span>
      </div>
      <div style={streamStyle}>
        {events.map((ev) => (
          <ChainRow key={ev.hash} ev={ev} fresh={ev.hash === latestId} />
        ))}
      </div>
      <style>{`
        @keyframes rowIn {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
