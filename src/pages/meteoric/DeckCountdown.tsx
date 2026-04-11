import { useEffect, useState } from 'react'
import { W } from '../../app/canvas/canvasTheme'

const V = W.violet

function pad(n: number) { return String(n).padStart(2, '0') }

interface DeckCountdownProps {
  target: Date
  label?: string
}

export default function DeckCountdown({ target, label = 'Until EU DPP Enforcement' }: DeckCountdownProps) {
  const [now, setNow] = useState(Date.now)

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now), 1000)
    return () => clearInterval(id)
  }, [])

  const diff = Math.max(0, target.getTime() - now)
  const days = Math.floor(diff / 86_400_000)
  const hours = Math.floor((diff % 86_400_000) / 3_600_000)
  const minutes = Math.floor((diff % 3_600_000) / 60_000)
  const seconds = Math.floor((diff % 60_000) / 1000)

  const segments = [
    { value: days, unit: 'days' },
    { value: hours, unit: 'hrs' },
    { value: minutes, unit: 'min' },
    { value: seconds, unit: 'sec' },
  ]

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 10 }}>
        {segments.map(s => (
          <div key={s.unit} style={{
            background: W.glass04, border: `1px solid ${W.glass06}`, borderRadius: 10, padding: '12px 0', width: 72,
          }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: V, fontFamily: 'var(--font-mono)', lineHeight: 1 }}>{pad(s.value)}</div>
            <div style={{ fontSize: 9, color: W.text4, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>{s.unit}</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 11, color: W.text3, fontWeight: 600 }}>{label}</div>
    </div>
  )
}
