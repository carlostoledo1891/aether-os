import { W, V } from '../shared'
import { Tag } from '../../../../components/deck'

export default function WhyYouSlide() {
  return (<>
    <div style={{ marginBottom: 16 }}><Tag>Advisory Board</Tag></div>
    <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 28 }}>Why You?</h2>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, maxWidth: 900, width: '100%', marginBottom: 24 }}>
      <div style={{ background: W.glass04, border: `1px solid ${W.glass06}`, borderRadius: 14, padding: '24px 20px', textAlign: 'left' }}>
        <div style={{ width: 8, height: 2, background: V, borderRadius: 1, marginBottom: 14 }} />
        <div style={{ fontSize: 15, fontWeight: 700, color: W.text1, marginBottom: 2 }}>Juliano Dutra</div>
        <div style={{ fontSize: 11, color: V, fontWeight: 600, marginBottom: 12 }}>CTO Lens</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <p style={{ fontSize: 12, color: W.text3, lineHeight: 1.5, margin: 0 }}>iFood co-founder. Gringo CTO. 20+ angel investments. Unicamp CS.</p>
          <p style={{ fontSize: 12, color: W.text2, lineHeight: 1.5, margin: 0 }}>I need a technical mentor for scaling from solo-founder architecture to a team. The dev hire reports to someone who has shipped at scale.</p>
          <p style={{ fontSize: 12, color: W.text2, lineHeight: 1.5, margin: 0 }}>Code review authority. Architecture validation. Hiring bar.</p>
        </div>
      </div>
      <div style={{ background: W.glass04, border: `1px solid ${W.glass06}`, borderRadius: 14, padding: '24px 20px', textAlign: 'left' }}>
        <div style={{ width: 8, height: 2, background: V, borderRadius: 1, marginBottom: 14 }} />
        <div style={{ fontSize: 15, fontWeight: 700, color: W.text1, marginBottom: 2 }}>Guilherme Bonifácio</div>
        <div style={{ fontSize: 11, color: V, fontWeight: 600, marginBottom: 12 }}>Business Lens</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <p style={{ fontSize: 12, color: W.text3, lineHeight: 1.5, margin: 0 }}>iFood co-founder. 110+ angel investments. Kanoa Capital. FEA-USP Economics.</p>
          <p style={{ fontSize: 12, color: W.text2, lineHeight: 1.5, margin: 0 }}>I need a commercial execution partner. Pipeline, GTM, pricing validation. The commercial hire reports to someone who has built revenue engines.</p>
          <p style={{ fontSize: 12, color: W.text2, lineHeight: 1.5, margin: 0 }}>Fundraising strategy. Term sheet structuring. Investor network.</p>
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
