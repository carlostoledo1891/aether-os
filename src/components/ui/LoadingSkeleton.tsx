import { W } from '../../app/canvas/canvasTheme'

type SkeletonVariant = 'card' | 'row' | 'metric' | 'full'

interface LoadingSkeletonProps {
  variant?: SkeletonVariant
  label?: string
  rows?: number
}

const pulse = {
  animation: 'skeleton-pulse 1.6s ease-in-out infinite',
} as const

const bar = (width: string, height = 10): React.CSSProperties => ({
  width,
  height,
  borderRadius: W.radius.xs,
  background: W.glass07,
  ...pulse,
})

export function LoadingSkeleton({ variant = 'card', label, rows = 3 }: LoadingSkeletonProps) {
  if (variant === 'metric') {
    return (
      <div style={{ display: 'flex', gap: 16, padding: '12px 0' }}>
        {[1, 2, 3].map(i => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={bar('60%', 8)} />
            <div style={bar('40%', 14)} />
          </div>
        ))}
      </div>
    )
  }

  if (variant === 'row') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '8px 0' }}>
        {Array.from({ length: rows }, (_, i) => (
          <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={bar('28px', 28)} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={bar(`${60 + (i % 3) * 12}%`, 9)} />
              <div style={bar('40%', 7)} />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (variant === 'full') {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', gap: 16, padding: 24,
        alignItems: 'center', justifyContent: 'center', minHeight: 200,
      }}>
        <div style={{ ...bar('120px', 12), margin: '0 auto' }} />
        {label && (
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 10, color: W.text4,
            letterSpacing: '0.06em', textTransform: 'uppercase',
          }}>
            {label}
          </span>
        )}
      </div>
    )
  }

  return (
    <div style={{
      padding: 16,
      borderRadius: W.radius.md,
      border: W.hairlineBorder,
      background: W.glass02,
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
    }}>
      {label && (
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 10, color: W.text4,
          letterSpacing: '0.06em', textTransform: 'uppercase',
        }}>
          {label}
        </span>
      )}
      <div style={bar('55%', 10)} />
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} style={bar(`${70 - i * 10}%`, 8)} />
      ))}
    </div>
  )
}
