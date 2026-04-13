import { motion } from 'motion/react'
import { Loader2 } from 'lucide-react'
import { W, V, ease } from '../shared'
import { TEAM } from '../../../../config/marketing'

export default function TeamSlide() {
  return (
    <>
      <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 32 }}>The Team</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, maxWidth: 960, width: '100%' }}>
        {TEAM.map((m, i) => {
          const isOnboarding = m.onboarding
          const cardBg = isOnboarding ? 'rgba(124, 92, 252, 0.08)' : W.glass04
          const cardBorder = isOnboarding ? '1px dashed rgba(124, 92, 252, 0.3)' : `1px solid ${W.glass06}`
          
          return (
            <motion.div 
              key={m.name}
              initial={{ opacity: 0, y: 24, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: i * 0.1, ease }}
              style={{ background: cardBg, border: cardBorder, borderRadius: 14, padding: '16px 16px', textAlign: 'left', position: 'relative', overflow: 'hidden' }}
            >
              {!isOnboarding && (
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: m.accent, borderRadius: '14px 14px 0 0' }} />
              )}
              {isOnboarding && (
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${V}40, ${V}, ${V}40)`, borderRadius: '14px 14px 0 0', opacity: 0.6 }} />
              )}
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: W.text1, marginBottom: 3 }}>{m.name}</div>
                  <div style={{ fontSize: 11, color: m.accent, fontWeight: 600 }}>{m.role}</div>
                </div>
                {isOnboarding && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: `${V}20`, border: `1px solid ${V}40`, padding: '3px 6px', borderRadius: 5 }}>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: V }}
                    >
                      <Loader2 size={10} strokeWidth={3} />
                    </motion.div>
                    <span style={{ fontSize: 8, fontWeight: 800, color: V, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Pitching</span>
                  </div>
                )}
                {!isOnboarding && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: `${W.green}20`, border: `1px solid ${W.green}40`, padding: '3px 6px', borderRadius: 5 }}>
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: W.green, boxShadow: `0 0 6px ${W.green}` }} />
                    <span style={{ fontSize: 8, fontWeight: 800, color: W.green, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Active</span>
                  </div>
                )}
              </div>
              
              <p style={{ fontSize: 11, color: W.text3, lineHeight: 1.5, margin: '8px 0 0 0' }}>{m.bg}</p>
            </motion.div>
          )
        })}
      </div>
    </>
  )
}
