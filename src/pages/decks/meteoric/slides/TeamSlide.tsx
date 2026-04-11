import { motion } from 'motion/react'
import { Tag } from '../../../../components/deck'
import { W, V, ease } from './shared'

const TEAM_MEMBERS = [
  { name: 'Carlos Toledo', role: 'Founder · Product & Technical Lead', bg: 'Air Force pilot, full-stack engineer, product designer. Born and raised in the Caldeira — 40 years of local context. Built the entire platform solo: 310 tests, 27 AI tools, pilot plant digital twin.', accent: V },
  { name: 'Guilherme Bonifácio', role: 'Co-founder · Commercial Strategy', bg: 'iFood co-founder. Kanoa Capital. 110+ angel investments. FEA-USP Economics. Leads GTM, investor pipeline, revenue strategy, and commercial execution.', accent: V },
  { name: 'Juliano Dutra', role: 'Co-founder · Technical Advisor', bg: 'iFood co-founder. Gringo CTO. 20+ angel investments. Unicamp CS. Architecture review, engineering mentorship, hiring bar, and scaling guidance.', accent: V },
  { name: 'Dr. Heber Caponi', role: 'Scientific Advisor · LAPOC', bg: 'Decades of active Caldeira field research through LAPOC (CNEN). The bridge from simulated to field-verified data. Piezometers, water quality, geological sampling.', accent: W.amber },
]

export default function TeamSlide() {
  return (
    <>
      <div style={{ marginBottom: 16 }}><Tag>Team</Tag></div>
      <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 28 }}>The Team Behind Vero</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, maxWidth: 960, width: '100%' }}>
        {TEAM_MEMBERS.map((m, i) => (
          <motion.div key={m.name}
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: i * 0.12, ease }}
            style={{ background: W.glass04, border: `1px solid ${W.glass06}`, borderRadius: 14, padding: '18px 16px', textAlign: 'left', position: 'relative', overflow: 'hidden' }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: m.accent, borderRadius: '14px 14px 0 0' }} />
            <div style={{ fontSize: 15, fontWeight: 700, color: W.text1, marginBottom: 4 }}>{m.name}</div>
            <div style={{ fontSize: 11, color: m.accent, fontWeight: 600, marginBottom: 10 }}>{m.role}</div>
            <p style={{ fontSize: 12, color: W.text3, lineHeight: 1.55, margin: 0 }}>{m.bg}</p>
          </motion.div>
        ))}
      </div>
    </>
  )
}
