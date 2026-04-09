import { AlertTriangle } from 'lucide-react'
import { W } from '../../app/canvas/canvasTheme'

interface ErrorFallbackProps {
  error: Error
  label?: string
  onRetry?: () => void
}

export function ErrorFallback({ error, label, onRetry }: ErrorFallbackProps) {
  return (
    <div
      role="alert"
      style={{
        padding: 16,
        borderRadius: W.radius.md,
        border: `1px solid ${W.red}30`,
        background: `${W.red}08`,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <AlertTriangle size={14} style={{ color: W.red, flexShrink: 0 }} />
        {label && (
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 10, color: W.text3,
            letterSpacing: '0.06em', textTransform: 'uppercase',
          }}>
            {label}
          </span>
        )}
      </div>
      <p style={{ fontSize: 11, color: W.text4, margin: 0 }}>
        {error.message || 'An unexpected error occurred.'}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          style={{
            alignSelf: 'flex-start',
            padding: '4px 10px',
            borderRadius: W.radius.xs,
            border: `1px solid ${W.red}40`,
            background: 'transparent',
            color: W.red,
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            cursor: 'pointer',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}
        >
          Retry
        </button>
      )}
    </div>
  )
}
