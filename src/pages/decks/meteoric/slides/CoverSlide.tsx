import { motion } from 'motion/react'
import { GlassRow } from '../../../../components/deck'
import { VeroChainLogo } from '../../../../components/brand/VeroChainLogo'
import { TopographicBackdrop } from '../../shared/TopographicBackdrop'
import { W, V, ease } from './shared'

export default function CoverSlide() {
  return (
    <>
      <TopographicBackdrop />
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.1, ease }}
          style={{ marginBottom: 24 }}>
          <VeroChainLogo iconOnly size={56} />
        </motion.div>
        <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.35em', color: W.text3, marginBottom: 16 }}>Meteoric Resources Ltd · ASX: MEI</div>
        <h1 style={{ fontSize: 'clamp(40px, 7vw, 72px)', fontWeight: 800, lineHeight: 1.05, marginBottom: 20, background: `linear-gradient(135deg, ${W.text1} 30%, ${V})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textAlign: 'center', whiteSpace: 'pre-line' }}>
          {'Your instance of a\ncategory-defining platform'}
        </h1>
        <p style={{ fontSize: 'clamp(15px, 2vw, 20px)', color: W.text3, maxWidth: 600, lineHeight: 1.5, whiteSpace: 'pre-line', textAlign: 'center' }}>
          {'The Caldeira workspace is already built on the same runtime\nthat powers a live Atlantic Maritime ISR sibling.\nNow connect it to live data.'}
        </p>
        <div style={{ marginTop: 40 }}>
          <GlassRow items={[{ label: 'Digital Twin', value: 'Modeled' }, { label: 'Forecast', value: '16-Day' }, { label: 'Audit Chain', value: 'SHA-256' }, { label: 'EU DPP', value: '22/37' }, { label: 'Telemetry', value: 'Ingestion-Ready' }, { label: 'Baseline', value: 'ERA5' }]} />
        </div>
      </div>
    </>
  )
}
