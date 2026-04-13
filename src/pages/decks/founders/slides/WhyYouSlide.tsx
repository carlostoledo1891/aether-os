import { motion } from 'motion/react'
import { Loader2 } from 'lucide-react'
import { W, V } from '../shared'
import { Tag } from '../../../../components/deck'

const PitchingBadge = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: `${V}20`, border: `1px solid ${V}40`, padding: '3px 6px', borderRadius: 5, flexShrink: 0 }}>
    <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: V }}>
      <Loader2 size={10} strokeWidth={3} />
    </motion.div>
    <span style={{ fontSize: 8, fontWeight: 800, color: V, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Pitching</span>
  </div>
)

export default function WhyYouSlide() {
  return (<>
    <div style={{ marginBottom: 16 }}><Tag>Advisory Board</Tag></div>
    <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 28 }}>Why You?</h2>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, maxWidth: 960, width: '100%', marginBottom: 24 }}>
      <div style={{ background: W.glass04, border: `1px solid ${W.glass06}`, borderRadius: 14, padding: '24px 20px', textAlign: 'left' }}>
        <div style={{ width: 8, height: 2, background: V, borderRadius: 1, marginBottom: 14 }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 2 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: W.text1 }}>Juliano Dutra</div>
          <PitchingBadge />
        </div>
        <div style={{ fontSize: 11, color: V, fontWeight: 600, marginBottom: 12 }}>CTO Lens</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <p style={{ fontSize: 12, color: W.text3, lineHeight: 1.5, margin: 0 }}>iFood co-founder. Gringo CTO. Highly respected tech speaker and engineering leader.</p>
          <p style={{ fontSize: 12, color: W.text2, lineHeight: 1.5, margin: 0 }}>The critical minerals and rare earth markets are entering a regulatory inflection — EU DPP, IRA/FEOC, Australian ESG. I need a technical co-pilot to scale an already robust codebase into an enterprise-grade platform serving this global wave.</p>
          <p style={{ fontSize: 12, color: W.text2, lineHeight: 1.5, margin: 0 }}>Meteoric Resources is our first live demo — Apr 16. The architecture is already built to serve 150+ critical mineral projects worldwide. Your validation ensures we hit audit-grade at scale.</p>
        </div>
      </div>
      <div style={{ background: W.glass04, border: `1px solid ${W.glass06}`, borderRadius: 14, padding: '24px 20px', textAlign: 'left' }}>
        <div style={{ width: 8, height: 2, background: V, borderRadius: 1, marginBottom: 14 }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 2 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: W.text1 }}>Guilherme Bonifácio</div>
          <PitchingBadge />
        </div>
        <div style={{ fontSize: 11, color: V, fontWeight: 600, marginBottom: 12 }}>Business Lens</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <p style={{ fontSize: 12, color: W.text3, lineHeight: 1.5, margin: 0 }}>iFood co-founder. Kanoa Capital. 110+ angel investments. Master at GTM & revenue engines.</p>
          <p style={{ fontSize: 12, color: W.text2, lineHeight: 1.5, margin: 0 }}>Critical minerals compliance is a $4.8 B market growing at 8.9% CAGR. I need a commercial powerhouse to structure pricing, open your investor network, and architect term sheets for this space.</p>
          <p style={{ fontSize: 12, color: W.text2, lineHeight: 1.5, margin: 0 }}>Meteoric Resources is our first live demo — Apr 16. Rare earth and lithium projects across ASX, TSX, and SEC are the pipeline behind it. Your name on the cap table signals trust to every one of them.</p>
        </div>
      </div>
    </div>
    <div style={{ background: `${V}08`, border: `1px solid ${V}20`, borderRadius: 12, padding: '16px 24px', maxWidth: 700, textAlign: 'center' }}>
      <p style={{ fontSize: 12, color: W.text2, margin: 0, lineHeight: 1.6 }}>
        I'm not asking for your time—I'm asking for your <strong style={{ color: W.text1 }}>leverage</strong>. Advisory board seat. Quarterly check-ins. The codebase is solid, the product works, and the market window is wide open. The timing is now.
      </p>
    </div>
  </>)
}
