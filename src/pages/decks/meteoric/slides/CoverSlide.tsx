import { Suspense } from 'react'
import { motion } from 'motion/react'
import { GlassRow } from '../../../../components/deck'
import { MapBase } from '../../../../components/map/MapBase'
import { useMapPreset } from '../../../../components/map/mapPresets'
import { W, V, ease } from './shared'

export default function CoverSlide() {
  const { viewProps } = useMapPreset('deck-cover')
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 0.25 }}>
        <Suspense fallback={null}>
          <MapBase
            id="meteoric-cover-map"
            {...viewProps}
            containerStyle={{ width: '100%', height: '100%', borderRadius: 0 }}
          />
        </Suspense>
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${W.bg}dd 0%, ${W.bg}88 40%, ${W.bg}dd 100%)` }} />
      </div>
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.1, ease }}
          style={{ width: 56, height: 56, background: V, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 800, color: '#fff', marginBottom: 24 }}>V</motion.div>
        <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.35em', color: W.text4, marginBottom: 16 }}>Meteoric Resources Ltd · ASX: MEI</div>
        <h1 style={{ fontSize: 'clamp(40px, 7vw, 72px)', fontWeight: 800, lineHeight: 1.05, marginBottom: 20, background: `linear-gradient(135deg, ${W.text1} 30%, ${V})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textAlign: 'center', whiteSpace: 'pre-line' }}>
          {'Vero for\nCaldeira Project'}
        </h1>
        <p style={{ fontSize: 'clamp(15px, 2vw, 20px)', color: W.text3, maxWidth: 520, lineHeight: 1.5, whiteSpace: 'pre-line', textAlign: 'center' }}>
          {'Your digital twin is already built.\nNow connect it to live data.'}
        </p>
        <div style={{ marginTop: 40 }}>
          <GlassRow items={[{ label: 'Digital Twin', value: 'Full' }, { label: 'Forecast', value: '16-Day' }, { label: 'Audit Chain', value: 'SHA-256' }, { label: 'EU DPP', value: '22/37' }, { label: 'Telemetry', value: 'Live' }, { label: 'Baseline', value: 'ERA5' }]} />
        </div>
      </div>
    </>
  )
}
