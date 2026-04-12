import { Suspense } from 'react'
import { motion } from 'motion/react'
import { W, V, ease } from '../shared'
import { GlassRow } from '../../../../components/deck'
import { MARKETING_COPY } from '../../../../config/marketing'
import { MapBase } from '../../../../components/map/MapBase'
import { useMapPreset } from '../../../../components/map/mapPresets'

export function CoverSlide() {
  const { viewProps } = useMapPreset('deck-cover')
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 0.25 }}>
        <Suspense fallback={null}>
          <MapBase
            id="founders-cover-map"
            {...viewProps}
            containerStyle={{ width: '100%', height: '100%', borderRadius: 0 }}
          />
        </Suspense>
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${W.bg}dd 0%, ${W.bg}88 40%, ${W.bg}dd 100%)` }} />
      </div>
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.1, ease }}
          style={{ width: 56, height: 56, background: V, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 800, color: '#fff', marginBottom: 24 }}>V</motion.div>
        <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.35em', color: W.text4, marginBottom: 16 }}>Verified Origin · Trusted Supply</div>
        <h1 style={{ fontSize: 'clamp(52px, 8vw, 88px)', fontWeight: 800, lineHeight: 1.0, marginBottom: 20, background: `linear-gradient(135deg, ${W.text1} 30%, ${V})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textAlign: 'center' }}>
          Vero
        </h1>
        <p style={{ fontSize: 'clamp(15px, 2vw, 20px)', color: W.text3, maxWidth: 560, lineHeight: 1.5, marginBottom: 36, textAlign: 'center' }}>
          The trust layer for critical mineral supply chains.
        </p>
        <GlassRow items={[
          { label: 'Persona Score', value: '9.4/10' },
          { label: 'Tests', value: MARKETING_COPY.testCount },
          { label: 'AI Tools', value: MARKETING_COPY.aiToolCount },
          { label: 'Overlays', value: MARKETING_COPY.overlayCount },
          { label: 'Equipment', value: MARKETING_COPY.equipmentCount },
        ]} />
        <div style={{ marginTop: 20, fontSize: 12, color: W.text4, letterSpacing: '0.04em', textAlign: 'center' }}>
          Founded solo · TypeScript strict · Zero compilation errors · Production architecture
        </div>
      </div>
    </>
  )
}

export function CloseSlide() {
  return (<>
    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.1, ease }}
      style={{ width: 56, height: 56, background: V, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 800, color: '#fff', marginBottom: 32 }}>V</motion.div>
    <h2 style={{ fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: 800, lineHeight: 1.1, marginBottom: 20, background: `linear-gradient(135deg, ${W.text1} 40%, ${V})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
      The product is better than the pitch.
    </h2>
    <p style={{ fontSize: 'clamp(14px, 1.8vw, 18px)', color: W.text3, maxWidth: 500, lineHeight: 1.6, marginBottom: 40 }}>
      Come see it. {MARKETING_COPY.testCount} tests. {MARKETING_COPY.aiToolCount} AI tools. {MARKETING_COPY.overlayCount} map layers. {MARKETING_COPY.equipmentCount} equipment. 9 stakeholders at 9.4/10. Founded solo from inside the Caldeira.
    </p>
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
      <a href="/" onClick={e => e.stopPropagation()} style={{ background: V, color: '#fff', padding: '14px 32px', borderRadius: 8, fontSize: 15, fontWeight: 600, textDecoration: 'none' }}>Open Platform</a>
      <a href="/lp" onClick={e => e.stopPropagation()} style={{ border: `1px solid ${W.glass12}`, color: W.text2, padding: '14px 32px', borderRadius: 8, fontSize: 15, fontWeight: 600, textDecoration: 'none', background: 'transparent' }}>Website</a>
    </div>
    <p style={{ fontSize: 12, color: W.text4, marginTop: 16 }}>carlos@vero.supply</p>
  </>)
}
