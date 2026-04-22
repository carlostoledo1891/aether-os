import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'motion/react'
import { W } from '../../../theme/publicTheme'

const V = W.violet

interface Message {
  role: 'user' | 'assistant'
  text: string
}

const SCRIPT: Message[] = [
  { role: 'user', text: 'Compare TREO grades across the Soberbo license area drill holes.' },
  { role: 'assistant', text: 'Based on 12 drill holes in Soberbo, TREO grades range from 1,890 to 6,405 ppm (avg 3,247 ppm). Holes DH-SOB-003 and DH-SOB-007 show the highest values, correlating with laterite depth > 15m. Source: Caldeira GeoJSON · JORC Table 1 · Classification: Indicated.' },
]

export default function FakeChat() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })
  const [visible, setVisible] = useState(0)
  const [typing, setTyping] = useState(false)

  useEffect(() => {
    if (!inView) return
    const timers: ReturnType<typeof setTimeout>[] = []
    timers.push(setTimeout(() => setVisible(1), 400))
    timers.push(setTimeout(() => setTyping(true), 1200))
    timers.push(setTimeout(() => { setTyping(false); setVisible(2) }, 2800))
    return () => timers.forEach(clearTimeout)
  }, [inView])

  return (
    <div ref={ref} style={{
      background: W.glass04, border: `1px solid ${W.glass06}`, borderRadius: 14, padding: '16px 18px',
      maxWidth: 520, width: '100%', textAlign: 'left',
    }}>
      <div style={{ fontSize: 10, color: W.text4, fontFamily: 'var(--font-mono)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: W.green }} />
        VeroChain AI Agent
      </div>

      {visible >= 1 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: 12, display: 'flex', justifyContent: 'flex-end' }}
        >
          <div style={{
            background: `${V}15`, border: `1px solid ${V}30`, borderRadius: '12px 12px 4px 12px',
            padding: '10px 14px', fontSize: 13, color: W.text1, lineHeight: 1.5, maxWidth: '85%',
          }}>
            {SCRIPT[0].text}
          </div>
        </motion.div>
      )}

      {typing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ marginBottom: 12 }}
        >
          <div style={{
            background: W.glass04, border: `1px solid ${W.glass06}`, borderRadius: '12px 12px 12px 4px',
            padding: '10px 14px', fontSize: 13, color: W.text3, display: 'inline-block',
          }}>
            <span style={{ animation: 'pulse 1s ease-in-out infinite' }}>Analyzing drill data…</span>
          </div>
        </motion.div>
      )}

      {visible >= 2 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div style={{
            background: W.glass04, border: `1px solid ${W.glass06}`, borderRadius: '12px 12px 12px 4px',
            padding: '10px 14px', fontSize: 12, color: W.text2, lineHeight: 1.6, maxWidth: '90%',
          }}>
            {SCRIPT[1].text}
            <div style={{
              marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px',
              background: `${W.green}15`, border: `1px solid ${W.green}30`, borderRadius: 4,
              fontSize: 9, color: W.green, fontWeight: 600,
            }}>
              ✓ Sources verified · JORC Table 1
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
