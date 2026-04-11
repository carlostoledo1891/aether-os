import { motion } from 'motion/react'
import { W, V, ease } from '../shared'
import { GlassRow } from '../../../../components/deck'

export function CoverSlide() {
  return (<>
    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.1, ease }}
      style={{ width: 56, height: 56, background: V, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 800, color: '#fff', marginBottom: 24 }}>V</motion.div>
    <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.35em', color: W.text4, marginBottom: 16 }}>Verified Origin · Trusted Supply</div>
    <h1 style={{ fontSize: 'clamp(52px, 8vw, 88px)', fontWeight: 800, lineHeight: 1.0, marginBottom: 20, background: `linear-gradient(135deg, ${W.text1} 30%, ${V})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
      Vero
    </h1>
    <p style={{ fontSize: 'clamp(15px, 2vw, 20px)', color: W.text3, maxWidth: 560, lineHeight: 1.5, marginBottom: 36 }}>
      The trust layer for critical mineral supply chains.
    </p>
    <GlassRow items={[
      { label: 'Persona Score', value: '9.4/10' },
      { label: 'Tests', value: '310' },
      { label: 'AI Tools', value: '27' },
      { label: 'Overlays', value: '14' },
      { label: 'Equipment', value: '17' },
    ]} />
    <div style={{ marginTop: 20, fontSize: 12, color: W.text4, letterSpacing: '0.04em' }}>
      Solo founder · TypeScript strict · Zero compilation errors · Production architecture
    </div>
  </>)
}

export function CloseSlide() {
  return (<>
    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.1, ease }}
      style={{ width: 56, height: 56, background: V, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 800, color: '#fff', marginBottom: 32 }}>V</motion.div>
    <h2 style={{ fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: 800, lineHeight: 1.1, marginBottom: 20, background: `linear-gradient(135deg, ${W.text1} 40%, ${V})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
      The product is better than the pitch.
    </h2>
    <p style={{ fontSize: 'clamp(14px, 1.8vw, 18px)', color: W.text3, maxWidth: 500, lineHeight: 1.6, marginBottom: 40 }}>
      Come see it. 310 tests. 27 AI tools. 14 map layers. 17 equipment. 9 stakeholders at 9.4/10. Built by one person from inside the Caldeira.
    </p>
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
      <a href="/" onClick={e => e.stopPropagation()} style={{ background: V, color: '#fff', padding: '14px 32px', borderRadius: 8, fontSize: 15, fontWeight: 600, textDecoration: 'none' }}>Open Platform</a>
      <a href="/lp" onClick={e => e.stopPropagation()} style={{ border: `1px solid ${W.glass12}`, color: W.text2, padding: '14px 32px', borderRadius: 8, fontSize: 15, fontWeight: 600, textDecoration: 'none', background: 'transparent' }}>Website</a>
    </div>
    <p style={{ fontSize: 12, color: W.text4, marginTop: 16 }}>carlos@vero.supply</p>
  </>)
}
