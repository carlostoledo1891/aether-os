import type { ReactNode } from 'react'
import { W } from '../../app/canvas/canvasTheme'

const V = W.violet

interface TerminalProps {
  title: string
  children: ReactNode
  /** Larger variant for landing page sections */
  large?: boolean
}

export function Terminal({ title, children, large }: TerminalProps) {
  const dotSize = large ? 10 : 8
  const dotGap = large ? 6 : 5
  const barPad = large ? '10px 16px' : '8px 14px'
  const bodyPad = large ? '16px 20px' : '12px 16px'
  const bodyFont = large ? 13 : 12
  const titleFont = large ? 12 : 11
  const indicatorSize = large ? 6 : 5

  return (
    <div style={{
      background: 'rgba(4,4,12,0.92)', border: `1px solid ${W.glass08}`, borderRadius: 12,
      overflow: 'hidden', textAlign: 'left',
    }}>
      <div style={{
        padding: barPad, borderBottom: `1px solid ${W.glass06}`,
        display: 'flex', alignItems: 'center', gap: large ? 8 : 6,
      }}>
        <div style={{ display: 'flex', gap: dotGap }}>
          <div style={{ width: dotSize, height: dotSize, borderRadius: '50%', background: '#FF5F57' }} />
          <div style={{ width: dotSize, height: dotSize, borderRadius: '50%', background: '#FEBC2E' }} />
          <div style={{ width: dotSize, height: dotSize, borderRadius: '50%', background: '#28C840' }} />
        </div>
        <span style={{ fontSize: titleFont, color: W.text4, fontFamily: 'var(--font-mono)', marginLeft: large ? 8 : 6 }}>{title}</span>
        <div style={{ width: indicatorSize, height: indicatorSize, borderRadius: '50%', background: V, marginLeft: 'auto', boxShadow: `0 0 ${large ? 8 : 6}px ${V}60` }} />
      </div>
      <div style={{ padding: bodyPad, fontFamily: 'var(--font-mono)', fontSize: bodyFont, lineHeight: large ? 1.7 : 1.65 }}>
        {children}
      </div>
    </div>
  )
}
