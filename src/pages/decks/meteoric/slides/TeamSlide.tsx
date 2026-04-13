import { motion } from 'motion/react'
import { Tag, Bullet } from '../../../../components/deck'
import { W, V, ease } from './shared'
import { TEAM } from '../../../../config/marketing'

export default function TeamSlide() {
  const carlos = TEAM.find(m => m.name === 'Carlos Toledo')

  return (
    <>
      <div style={{ marginBottom: 16 }}><Tag>Team</Tag></div>
      <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 28 }}>The Team Behind VeroChain</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, maxWidth: 900, width: '100%', alignItems: 'center' }}>
        {carlos && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease }}
            style={{ background: W.glass04, border: `1px solid ${W.glass06}`, borderRadius: 14, padding: '24px', textAlign: 'left', position: 'relative', overflow: 'hidden' }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: carlos.accent, borderRadius: '14px 14px 0 0' }} />
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: W.text1, marginBottom: 4 }}>{carlos.name}</div>
              <div style={{ fontSize: 13, color: V, fontWeight: 600 }}>{carlos.role}</div>
            </div>
            <p style={{ fontSize: 13, color: W.text3, lineHeight: 1.6, margin: '8px 0 0 0' }}>{carlos.bg}</p>
          </motion.div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, textAlign: 'left' }}>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2, ease }}>
            <div style={{ fontSize: 11, color: V, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Advisory & Science</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Bullet>Supported by 2 ESG Specialists with 15+ years in socio-environmental due diligence and governance.</Bullet>
              <Bullet>1 Scientific Advisor from ANSN (LAPOC) coordinating field instrument integration.</Bullet>
              <Bullet accent={W.green}>Ensures domain truth remains separate from software simulation.</Bullet>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}
