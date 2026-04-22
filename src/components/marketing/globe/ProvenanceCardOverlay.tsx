import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import { W } from '../../../theme/publicTheme'
import { closeProvenance, subscribeToProvenance, type ChainEvent } from './globeBus'

const KIND_COLOR: Record<ChainEvent['kind'], string> = {
  asset: '#7C5CFC',
  sensor: '#22d3ee',
  alert: '#f59e0b',
  license: '#a78bfa',
  assay: '#34d399',
}

const overlayStyle: CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 90,
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'center',
  padding: '0 20px 88px',
  pointerEvents: 'none',
}

const cardWrap: CSSProperties = {
  width: 'min(640px, 100%)',
  borderRadius: 16,
  border: `1px solid ${W.glass12}`,
  background: 'rgba(10, 14, 28, 0.86)',
  backdropFilter: 'blur(18px)',
  WebkitBackdropFilter: 'blur(18px)',
  boxShadow: '0 20px 60px rgba(0,0,0,0.55), 0 0 0 1px rgba(124,92,252,0.16)',
  padding: 20,
  pointerEvents: 'auto',
  fontFamily: 'var(--font-sans)',
  color: W.text2,
  animation: 'provCardIn 320ms cubic-bezier(0.16, 1, 0.3, 1)',
}

const labelStyle: CSSProperties = {
  fontSize: 9,
  fontWeight: 700,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: W.text4,
}

const monoStyle: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 11,
  color: W.text2,
  wordBreak: 'break-all',
  lineHeight: 1.5,
}

function formatTs(ts: number): string {
  const d = new Date(ts)
  return d.toISOString().replace('T', ' · ').replace('Z', ' UTC')
}

/**
 * Provenance card revealed when a chain hash chip is clicked. Shows:
 *   - kind badge + label
 *   - block index + ISO timestamp
 *   - full 64-char hash (synthetic)
 *   - witness identifier
 *   - evidence list
 *   - hint that this is the seed of a real signed receipt
 */
export function ProvenanceCardOverlay() {
  const [event, setEvent] = useState<ChainEvent | null>(null)

  useEffect(() => {
    return subscribeToProvenance((trigger) => {
      // Click-only flow: cards stay open until the user dismisses them
      // (esc, click outside, or close button). No auto-dismiss timer.
      setEvent(trigger?.event ?? null)
    })
  }, [])

  useEffect(() => {
    if (!event) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeProvenance()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [event])

  if (!event) return null
  const color = KIND_COLOR[event.kind]

  return (
    <div
      role="presentation"
      style={overlayStyle}
      onClick={(e) => { if (e.target === e.currentTarget) closeProvenance() }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Provenance · ${event.label}`}
        tabIndex={-1}
        style={cardWrap}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 14 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, boxShadow: `0 0 10px ${color}` }} />
              <span style={{ ...labelStyle, color }}>{event.kind} · signed event</span>
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: W.text1, letterSpacing: '-0.01em' }}>
              {event.label}
            </div>
            <div style={{ fontSize: 11, color: W.text4, marginTop: 4, fontFamily: 'var(--font-mono)' }}>
              block #{event.block.toLocaleString()} · {formatTs(event.ts)}
            </div>
          </div>
          <button
            type="button"
            onClick={closeProvenance}
            aria-label="Close provenance card"
            style={{
              border: `1px solid ${W.glass12}`,
              background: 'rgba(255,255,255,0.04)',
              color: W.text3,
              borderRadius: 8,
              padding: '6px 10px',
              fontSize: 11,
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
            }}
          >
            esc
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 10 }}>
          <Field label="hash (sha-256)">
            <span style={monoStyle}>0x{event.hash}</span>
          </Field>
          <Field label="origin">
            <span style={monoStyle}>
              {event.lng.toFixed(5)}, {event.lat.toFixed(5)}
              <br />source · {event.source}
            </span>
          </Field>
          <Field label="witness">
            <span style={monoStyle}>{event.witness ?? '—'}</span>
          </Field>
          <Field label="evidence">
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {(event.evidence ?? []).map((e) => (
                <li key={e} style={monoStyle}>· {e}</li>
              ))}
            </ul>
          </Field>
        </div>

        <div
          style={{
            marginTop: 18,
            paddingTop: 14,
            borderTop: `1px dashed ${W.glass08}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 10,
            fontSize: 11,
            color: W.text4,
            fontFamily: 'var(--font-mono)',
          }}
        >
          <span>signed · synthetic · seeded fixtures</span>
          <span style={{ color }}>vero · field operations chain</span>
        </div>

        <style>{`
          @keyframes provCardIn {
            from { opacity: 0; transform: translateY(20px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ ...labelStyle, marginBottom: 6 }}>{label}</div>
      {children}
    </div>
  )
}
