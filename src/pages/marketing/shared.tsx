import { type ReactNode } from 'react'
import { W } from '../../app/canvas/canvasTheme'
import { Terminal as TerminalBase } from '../../components/deck'
import { V } from './sharedConstants'

export function Terminal({ title, children }: { title: string; children: ReactNode }) {
  return <TerminalBase title={title} large>{children}</TerminalBase>
}

export function Stat({ value, label: lbl, sub }: { value: string; label: string; sub?: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '18px 14px' }}>
      <div style={{ fontSize: 28, fontWeight: 800, color: V, fontFamily: 'var(--font-mono)' }}>{value}</div>
      <div style={{ fontSize: 13, fontWeight: 600, color: W.text1, marginTop: 4 }}>{lbl}</div>
      {sub && <div style={{ fontSize: 11, color: W.text4, marginTop: 2 }}>{sub}</div>}
    </div>
  )
}
