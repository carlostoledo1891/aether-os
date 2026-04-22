import type { CSSProperties } from 'react'
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion'
import { W } from '../../../theme/publicTheme'

const wrap: CSSProperties = {
  position: 'fixed',
  top: 16,
  right: 20,
  zIndex: 6,
  display: 'inline-flex',
  alignItems: 'center',
  gap: 10,
  padding: '6px 11px',
  borderRadius: 999,
  border: `1px solid ${W.glass12}`,
  background: 'rgba(8, 11, 22, 0.55)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  fontSize: 10,
  fontWeight: 600,
  color: W.text3,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  pointerEvents: 'none',
}

function dotStyle(reducedMotion: boolean): CSSProperties {
  return {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: W.violet,
    boxShadow: `0 0 8px ${W.violet}`,
    animation: reducedMotion ? undefined : 'provenancePulse 2.4s ease-in-out infinite',
  }
}

/**
 * "DEMO · synthetic data" badge anchored to the top-right of the
 * marketing experience. Stays honest about the data while reinforcing
 * the brand pulse.
 */
export function ProvenanceChip({ note = 'synthetic data · v0.1' }: { note?: string }) {
  const reducedMotion = usePrefersReducedMotion()
  return (
    <div style={wrap}>
      <span data-testid="provenance-chip-dot" style={dotStyle(reducedMotion)} />
      <span>demo</span>
      <span style={{ color: W.text3, fontWeight: 500, textTransform: 'none', letterSpacing: '0.04em' }}>· {note}</span>
      <style>{`
        @keyframes provenancePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.45; transform: scale(0.85); }
        }
      `}</style>
    </div>
  )
}
