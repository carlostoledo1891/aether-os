import { motion } from 'motion/react'
import { Loader2 } from 'lucide-react'
import { W, V, ease } from '../shared'
import { MARKETING_COPY } from '../../../../config/marketing'

const MEMBERS = [
  { 
    name: 'Juliano Dutra', 
    role: 'Co-founder · Technical Advisor', 
    bg: 'iFood co-founder. Gringo CTO. 20+ angel investments. Unicamp CS. Architecture review, engineering mentorship, hiring bar, and scaling guidance.', 
    accent: V,
    onboarding: true
  },
  { 
    name: 'Guilherme Bonifácio', 
    role: 'Co-founder · Commercial Strategy', 
    bg: 'iFood co-founder. Kanoa Capital. 110+ angel investments. FEA-USP Economics. Leads GTM, investor pipeline, revenue strategy, and commercial execution.', 
    accent: V,
    onboarding: true
  },
  { 
    name: 'Dr. Heber Caponi', 
    role: 'Scientific Advisor · LAPOC', 
    bg: 'Decades of active Caldeira field research through LAPOC (CNEN). The bridge from simulated to field-verified data. Piezometers, water quality, geological sampling.', 
    accent: V,
    onboarding: true
  },
  { 
    name: 'Carlos Toledo', 
    role: 'Founder · Product & Technical Lead', 
    bg: `Air Force pilot, full-stack engineer, product designer. Born and raised in the Caldeira — 40 years of local context. Built the entire platform solo: ${MARKETING_COPY.testCount} tests, ${MARKETING_COPY.aiToolCount} AI tools, pilot plant digital twin.`, 
    accent: V,
    onboarding: false
  },
]

export default function TeamSlide() {
  return (
    <>
      <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 32 }}>The Team</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, maxWidth: 860, width: '100%' }}>
        {MEMBERS.map((m, i) => {
          const isOnboarding = m.onboarding
          const cardBg = isOnboarding ? 'rgba(124, 92, 252, 0.08)' : W.glass04
          const cardBorder = isOnboarding ? '1px dashed rgba(124, 92, 252, 0.3)' : `1px solid ${W.glass06}`
          
          return (
            <motion.div 
              key={m.name}
              initial={{ opacity: 0, y: 24, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: i * 0.12, ease }}
              style={{ background: cardBg, border: cardBorder, borderRadius: 14, padding: '20px 20px', textAlign: 'left', position: 'relative', overflow: 'hidden' }}
            >
              {/* Top Accent Line */}
              {!isOnboarding && (
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: m.accent, borderRadius: '14px 14px 0 0' }} />
              )}
              {isOnboarding && (
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${V}40, ${V}, ${V}40)`, borderRadius: '14px 14px 0 0', opacity: 0.6 }} />
              )}
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: W.text1, marginBottom: 4 }}>{m.name}</div>
                  <div style={{ fontSize: 12, color: m.accent, fontWeight: 600 }}>{m.role}</div>
                </div>
                {isOnboarding && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: `${V}20`, border: `1px solid ${V}40`, padding: '4px 8px', borderRadius: 6 }}>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: V }}
                    >
                      <Loader2 size={12} strokeWidth={3} />
                    </motion.div>
                    <span style={{ fontSize: 9, fontWeight: 800, color: V, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Onboarding</span>
                  </div>
                )}
                {!isOnboarding && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: `${W.green}20`, border: `1px solid ${W.green}40`, padding: '4px 8px', borderRadius: 6 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: W.green, boxShadow: `0 0 6px ${W.green}` }} />
                    <span style={{ fontSize: 9, fontWeight: 800, color: W.green, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Active</span>
                  </div>
                )}
              </div>
              
              <p style={{ fontSize: 13, color: W.text3, lineHeight: 1.55, margin: '12px 0 0 0' }}>{m.bg}</p>
            </motion.div>
          )
        })}
      </div>
    </>
  )
}
