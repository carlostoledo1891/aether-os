import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import { W } from '../../../theme/publicTheme'
import { subscribeToChain, type ChainEvent } from './globeBus'

const wrap: CSSProperties = {
  position: 'fixed',
  top: 70,
  left: 20,
  zIndex: 6,
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  padding: '12px 14px 11px',
  borderRadius: 12,
  border: `1px solid ${W.glass08}`,
  background: 'rgba(8, 11, 22, 0.55)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  fontFamily: 'var(--font-mono)',
  pointerEvents: 'none',
  minWidth: 160,
}

const labelStyle: CSSProperties = {
  fontSize: 9,
  fontWeight: 600,
  letterSpacing: '0.12em',
  color: W.text4,
  textTransform: 'uppercase',
}

const numStyle: CSSProperties = {
  fontSize: 22,
  fontWeight: 700,
  color: W.text1,
  fontVariantNumeric: 'tabular-nums',
  lineHeight: 1,
}

/**
 * Top-left HUD chip showing the live count of synthetic chain events
 * signed since the visit started.
 *
 * Note: the chain head + per-event hashes live in the right-edge
 * `AuditTicker` column. This counter intentionally only shows the
 * total so we don't duplicate state across two HUDs.
 */
export function LiveCounter() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    return subscribeToChain((_ev: ChainEvent) => {
      setCount((c) => c + 1)
    })
  }, [])

  return (
    <div style={wrap}>
      <div style={labelStyle}>signed this visit</div>
      <div style={numStyle}>{count.toLocaleString()}</div>
    </div>
  )
}
