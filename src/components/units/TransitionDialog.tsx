import { useState } from 'react'
import { useAetherService } from '../../services/DataServiceProvider'
import type { UnitDetail, TransitionRule } from 'shared/units/types'

interface TransitionDialogProps {
  unit: UnitDetail
  onClose: () => void
}

export function TransitionDialog({ unit, onClose }: TransitionDialogProps) {
  const service = useAetherService()
  const [selectedRule, setSelectedRule] = useState<TransitionRule | null>(null)
  const [actor, setActor] = useState('')
  const [reason, setReason] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const allowedTransitions = unit.typeDef.transitions.filter(
    t => t.from === unit.currentState,
  )

  const handleSubmit = async () => {
    if (!selectedRule || !actor.trim()) return
    setSubmitting(true)
    setError(null)
    try {
      await service.transitionUnit(unit.id, selectedRule.to, actor.trim(), reason.trim() || undefined)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transition failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Transition ${unit.label}`}
      style={{
        position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.6)', zIndex: 1000,
      }}
    >
      {/* Click-outside backdrop: an actual button so a11y is happy */}
      <button
        type="button"
        aria-label="Close dialog"
        onClick={onClose}
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          background: 'transparent', border: 'none', cursor: 'default', padding: 0,
        }}
      />
      <div
        style={{
          position: 'relative',
          background: 'var(--surface-1, #1a1a2e)', borderRadius: 12, padding: 24, width: 380,
          border: '1px solid var(--border, rgba(255,255,255,0.1))',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}
      >
        <h3 style={{ margin: '0 0 16px', fontSize: 16, color: '#fff' }}>
          Transition: {unit.label}
        </h3>
        <p style={{ fontSize: 12, opacity: 0.5, margin: '0 0 12px' }}>
          Current state: <strong>{unit.currentState.replace(/_/g, ' ')}</strong>
        </p>

        {allowedTransitions.length === 0 ? (
          <p style={{ fontSize: 13, opacity: 0.5 }}>No transitions available from this state.</p>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
              {allowedTransitions.map(rule => (
                <button
                  key={`${rule.from}-${rule.to}`}
                  onClick={() => setSelectedRule(rule)}
                  style={{
                    padding: '8px 12px', borderRadius: 8, border: 'none',
                    cursor: 'pointer', textAlign: 'left',
                    background: selectedRule === rule ? 'var(--accent, #7c5cfc)' : 'var(--surface-2, rgba(255,255,255,0.06))',
                    color: selectedRule === rule ? '#fff' : 'var(--text-secondary, rgba(255,255,255,0.65))',
                    transition: 'all 150ms ease',
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{rule.label}</div>
                  <div style={{ fontSize: 11, opacity: 0.65 }}>
                    → {rule.to.replace(/_/g, ' ')}
                    {rule.requiredEvidence && rule.requiredEvidence.length > 0 && (
                      <span style={{ color: '#f59e0b' }}> (requires: {rule.requiredEvidence.join(', ')})</span>
                    )}
                  </div>
                </button>
              ))}
            </div>

            <input
              placeholder="Actor (who is performing this)"
              value={actor}
              onChange={e => setActor(e.target.value)}
              style={{
                width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid var(--border)',
                background: 'transparent', color: '#fff', fontSize: 13, marginBottom: 8,
                boxSizing: 'border-box',
              }}
            />

            <input
              placeholder="Reason (optional)"
              value={reason}
              onChange={e => setReason(e.target.value)}
              style={{
                width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid var(--border)',
                background: 'transparent', color: '#fff', fontSize: 13, marginBottom: 12,
                boxSizing: 'border-box',
              }}
            />

            {error && (
              <div style={{ padding: '6px 10px', borderRadius: 6, background: '#ef444422', color: '#ef4444', fontSize: 12, marginBottom: 12 }}>
                {error}
              </div>
            )}

            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button
                onClick={onClose}
                style={{
                  padding: '6px 16px', borderRadius: 6, border: '1px solid var(--border)',
                  background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 13,
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!selectedRule || !actor.trim() || submitting}
                style={{
                  padding: '6px 16px', borderRadius: 6, border: 'none',
                  background: 'var(--accent, #7c5cfc)', color: '#fff', cursor: 'pointer',
                  fontSize: 13, opacity: (!selectedRule || !actor.trim() || submitting) ? 0.5 : 1,
                }}
              >
                {submitting ? 'Transitioning...' : 'Confirm'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
