import { Suspense } from 'react'
import { motion } from 'motion/react'
import { W, V, ease } from '../shared'
import { GlassRow } from '../../../../components/deck'
import { MapBase } from '../../../../components/map/MapBase'
import { useMapPreset } from '../../../../components/map/mapPresets'
import { VeroChainLogo } from '../../../../components/brand/VeroChainLogo'

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
          style={{ marginBottom: 24 }}>
          <VeroChainLogo iconOnly size={56} />
        </motion.div>
        <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.35em', color: W.text4, marginBottom: 16 }}>Verified Origin · Trusted Supply</div>
        <h1 style={{ fontSize: 'clamp(52px, 8vw, 88px)', fontWeight: 800, lineHeight: 1.0, marginBottom: 20, background: `linear-gradient(135deg, ${W.text1} 30%, ${V})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textAlign: 'center' }}>
          VeroChain
        </h1>
        <p style={{ fontSize: 'clamp(15px, 2vw, 20px)', color: W.text3, maxWidth: 560, lineHeight: 1.5, marginBottom: 36, textAlign: 'center' }}>
          The trust layer for critical mineral supply chains.
        </p>
        <GlassRow items={[
          { label: 'Pilot Client', value: 'Meteoric (ASX)' },
          { label: 'NPV', value: '$821M' },
          { label: 'EU DPP Ready', value: '59%' },
          { label: 'Audit Chain', value: 'SHA-256' },
          { label: 'Persona Score', value: '9.4/10' },
        ]} />
        <div style={{ marginTop: 20, fontSize: 12, color: W.text4, letterSpacing: '0.04em', textAlign: 'center' }}>
          TypeScript strict · Zero errors · CI quality gates · Production architecture
        </div>
      </div>
    </>
  )
}

export function CloseSlide() {
  return (<>
    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.1, ease }}
      style={{ marginBottom: 32 }}>
      <VeroChainLogo iconOnly size={56} />
    </motion.div>
    <h2 style={{ fontSize: 'clamp(32px, 5.5vw, 56px)', fontWeight: 800, lineHeight: 1.05, marginBottom: 8, color: W.text1 }}>
      This is not a deck.
    </h2>
    <h2 style={{ fontSize: 'clamp(32px, 5.5vw, 56px)', fontWeight: 800, lineHeight: 1.05, marginBottom: 28, background: `linear-gradient(135deg, ${W.text4} 30%, ${V})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
      It's not a prototype.
    </h2>
    <p style={{ fontSize: 'clamp(15px, 2vw, 20px)', color: W.text3, maxWidth: 480, lineHeight: 1.6, marginBottom: 40, textAlign: 'center' }}>
      NIST 800-53 mapped. SHA-256 audit chain. Pilot plant digital twin. Domain-grounded AI. 9 stakeholders at 9.4/10. It's live — go in and see.
    </p>
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
      <a href="/app" onClick={e => e.stopPropagation()} style={{ background: V, color: '#fff', padding: '16px 40px', borderRadius: 8, fontSize: 16, fontWeight: 700, textDecoration: 'none', letterSpacing: '0.01em' }}>Enter the Platform</a>
      <a href="/" onClick={e => e.stopPropagation()} style={{ border: `1px solid ${W.glass12}`, color: W.text2, padding: '16px 32px', borderRadius: 8, fontSize: 15, fontWeight: 600, textDecoration: 'none', background: 'transparent' }}>Website</a>
    </div>
    <p style={{ fontSize: 12, color: W.text4, marginTop: 20 }}>carlos@verochain.co</p>
  </>)
}
