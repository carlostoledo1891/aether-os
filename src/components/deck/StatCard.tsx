import { W } from '../../app/canvas/canvasTheme'

const V = W.violet

interface StatCardProps {
  value: string
  label: string
  sub: string
  accent?: string
}

export function StatCard({ value, label, sub, accent = V }: StatCardProps) {
  return (
    <div style={{
      padding: '22px 14px', background: W.glass04, border: `1px solid ${W.glass06}`,
      borderRadius: 14, textAlign: 'center',
    }}>
      <div style={{ fontSize: 'clamp(22px, 2.8vw, 32px)', fontWeight: 800, color: accent, fontFamily: 'var(--font-mono)', lineHeight: 1.1 }}>{value}</div>
      <div style={{ fontSize: 'clamp(11px, 0.7vw, 13px)', fontWeight: 600, color: W.text1, marginTop: 5 }}>{label}</div>
      <div style={{ fontSize: 'clamp(9px, 0.55vw, 11px)', color: W.text4, marginTop: 2 }}>{sub}</div>
    </div>
  )
}
