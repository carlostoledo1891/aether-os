import { motion } from 'motion/react'
import { Tag } from '../../../../components/deck'
import { W, V, ease } from './shared'
import { TEAM } from '../../../../config/marketing'

export default function TeamSlide() {
  return (
    <>
      <div style={{ marginBottom: 16 }}><Tag>Team</Tag></div>
      <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 28 }}>The Team Behind Vero</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, maxWidth: 960, width: '100%' }}>
        {TEAM.map((m, i) => (
          <motion.div key={m.name}
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: i * 0.1, ease }}
            style={{ background: W.glass04, border: `1px solid ${W.glass06}`, borderRadius: 14, padding: '16px 16px', textAlign: 'left', position: 'relative', overflow: 'hidden' }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: m.accent, borderRadius: '14px 14px 0 0' }} />
            <div style={{ marginBottom: 4 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: W.text1, marginBottom: 3 }}>{m.name}</div>
              <div style={{ fontSize: 11, color: V, fontWeight: 600 }}>{m.role}</div>
            </div>
            <p style={{ fontSize: 11, color: W.text3, lineHeight: 1.5, margin: '8px 0 0 0' }}>{m.bg}</p>
          </motion.div>
        ))}
      </div>
    </>
  )
}
