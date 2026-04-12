import { W, V } from '../shared'
import { Tag } from '../../../../components/deck'

export default function WhyYouSlide() {
  return (<>
    <div style={{ marginBottom: 16 }}><Tag>Advisory Board</Tag></div>
    <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 28 }}>Why You?</h2>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, maxWidth: 960, width: '100%', marginBottom: 24 }}>
      <div style={{ background: W.glass04, border: `1px solid ${W.glass06}`, borderRadius: 14, padding: '24px 20px', textAlign: 'left' }}>
        <div style={{ width: 8, height: 2, background: V, borderRadius: 1, marginBottom: 14 }} />
        <div style={{ fontSize: 15, fontWeight: 700, color: W.text1, marginBottom: 2 }}>Juliano Dutra</div>
        <div style={{ fontSize: 11, color: V, fontWeight: 600, marginBottom: 12 }}>CTO Lens</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <p style={{ fontSize: 12, color: W.text3, lineHeight: 1.5, margin: 0 }}>iFood co-founder. Gringo CTO. Highly respected tech speaker and engineering leader.</p>
          <p style={{ fontSize: 12, color: W.text2, lineHeight: 1.5, margin: 0 }}>I need a technical mentor to scale the architecture from a solo-founder codebase to a team environment.</p>
          <p style={{ fontSize: 12, color: W.text2, lineHeight: 1.5, margin: 0 }}>Stakeholder alignment: Dr. de Carvalho demands defensible, QA-grade data. We need your architectural validation and hiring bar to deliver it flawlessly.</p>
        </div>
      </div>
      <div style={{ background: W.glass04, border: `1px solid ${W.glass06}`, borderRadius: 14, padding: '24px 20px', textAlign: 'left' }}>
        <div style={{ width: 8, height: 2, background: V, borderRadius: 1, marginBottom: 14 }} />
        <div style={{ fontSize: 15, fontWeight: 700, color: W.text1, marginBottom: 2 }}>Guilherme Bonifácio</div>
        <div style={{ fontSize: 11, color: V, fontWeight: 600, marginBottom: 12 }}>Business Lens</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <p style={{ fontSize: 12, color: W.text3, lineHeight: 1.5, margin: 0 }}>iFood co-founder. Kanoa Capital. 110+ angel investments. Master at GTM & revenue engines.</p>
          <p style={{ fontSize: 12, color: W.text2, lineHeight: 1.5, margin: 0 }}>I need a commercial execution partner. Pricing validation, investor network, and term sheet structuring.</p>
          <p style={{ fontSize: 12, color: W.text2, lineHeight: 1.5, margin: 0 }}>Stakeholder alignment: Nick Gale needs execution credibility for subsequent capital raises. Your track record brings instant credibility to our cap table.</p>
        </div>
      </div>
    </div>
    <div style={{ background: `${V}08`, border: `1px solid ${V}20`, borderRadius: 12, padding: '16px 24px', maxWidth: 700, textAlign: 'center' }}>
      <p style={{ fontSize: 12, color: W.text2, margin: 0, lineHeight: 1.6 }}>
        Not asking for time — asking for <strong style={{ color: W.text1 }}>leverage</strong>. Advisory board seat. Quarterly check-ins. The codebase is ready. The product is ready. The timing is now.
      </p>
    </div>
  </>)
}
