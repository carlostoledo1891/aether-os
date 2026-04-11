import { W } from '../../../app/canvas/canvasTheme'
import { Tag, SlidePanel } from '../index'

const V = W.violet

export default function WhiteBoxSlide() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'center', width: '100%', maxWidth: 1080, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <Tag>The White Box Mine</Tag>
      </div>
      
      <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, lineHeight: 1.1, marginBottom: 20, color: W.text1 }}>
        From Probabilistic to Provable
      </h2>
      
      <p style={{ fontSize: 16, color: W.text3, lineHeight: 1.6, maxWidth: 800, marginBottom: 40 }}>
        Legacy ESG reporting is the equivalent of an AI hallucination — an output without an audit trail of the inputs. We apply <span style={{ color: W.text1, fontWeight: 600 }}>Field Observability</span> to trace the physical reality of extraction.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, width: '100%' }}>
        <SlidePanel style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: `${V}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: V, fontWeight: 800, fontFamily: 'var(--font-mono)' }}>01</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: W.text1 }}>Observe</h3>
          </div>
          <div style={{ fontSize: 12, color: V, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>The Ground Truth</div>
          <p style={{ fontSize: 13, color: W.text3, lineHeight: 1.6, margin: 0 }}>
            Geology is probabilistic; operations are absolute. We separate the predictive model (JORC resources) from the verified reality (LAPOC instrument data). Telemetry acts as the foundational training data.
          </p>
        </SlidePanel>

        <SlidePanel style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: `${W.cyan}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: W.cyan, fontWeight: 800, fontFamily: 'var(--font-mono)' }}>02</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: W.text1 }}>Trace</h3>
          </div>
          <div style={{ fontSize: 12, color: W.cyan, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Zero-Trust Extraction</div>
          <p style={{ fontSize: 13, color: W.text3, lineHeight: 1.6, margin: 0 }}>
            Implementing a Zero-Trust architecture for the physical supply chain. Every movement of ore — from extraction coordinate to the processing plant to the final batch of MREC — is logged in a cryptographic audit chain.
          </p>
        </SlidePanel>

        <SlidePanel style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: `${W.green}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: W.green, fontWeight: 800, fontFamily: 'var(--font-mono)' }}>03</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: W.text1 }}>Verify</h3>
          </div>
          <div style={{ fontSize: 12, color: W.green, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Commercial Arbitrage</div>
          <p style={{ fontSize: 13, color: W.text3, lineHeight: 1.6, margin: 0 }}>
            "White Box" observability de-risks the asset, enabling access to strategic capital. It generates an instantaneous, mathematically provable Digital Product Passport (DPP), turning compliance into a competitive moat.
          </p>
        </SlidePanel>
      </div>

      <div style={{ marginTop: 40, padding: '16px 24px', background: `${V}10`, border: `1px solid ${V}30`, borderRadius: 12 }}>
        <p style={{ fontSize: 13, color: W.text2, margin: 0, textAlign: 'center', fontWeight: 500 }}>
          <span style={{ color: V, fontWeight: 700 }}>Governance as a Shield:</span> Continuous, verified disclosure protects the board and ensures that market narrative matches field reality 1:1.
        </p>
      </div>
    </div>
  )
}