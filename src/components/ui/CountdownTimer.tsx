import { useEffect, useState } from 'react'
import { W } from '../../app/canvas/canvasTheme'

interface CountdownTimerProps {
  targetDate: string
  label: string
  color?: 'violet' | 'amber' | 'green'
}

const colorMap = {
  violet: W.violet,
  amber:  W.amber,
  green:  W.green,
} as const

function getTimeLeft(target: string) {
  const diff = new Date(target).getTime() - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0 }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  return { days, hours, minutes }
}

export function CountdownTimer({ targetDate, label, color = 'amber' }: CountdownTimerProps) {
  const [time, setTime] = useState(getTimeLeft(targetDate))
  const c = colorMap[color]

  useEffect(() => {
    const interval = setInterval(() => setTime(getTimeLeft(targetDate)), 60000)
    return () => clearInterval(interval)
  }, [targetDate])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
        {[
          { v: time.days, u: 'd' },
          { v: time.hours, u: 'h' },
          { v: time.minutes, u: 'm' },
        ].map(({ v, u }) => (
          <span key={u} style={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
            <span style={{
              fontSize: 22, fontWeight: 600, color: c,
              fontFamily: 'var(--font-mono)', letterSpacing: '-0.02em',
            }}>
              {String(v).padStart(2, '0')}
            </span>
            <span style={{ fontSize: 10, color: W.text3, fontFamily: 'var(--font-mono)' }}>
              {u}
            </span>
          </span>
        ))}
      </div>
      <span style={{
        fontSize: 10, fontWeight: 600, letterSpacing: '0.08em',
        textTransform: 'uppercase', color: W.text4,
        fontFamily: 'var(--font-ui)',
      }}>
        {label}
      </span>
    </div>
  )
}
