import { W } from '../shared'
import { Tag, Bullet } from '../../../../components/deck'

const COMPETITORS = [
  { comp: 'Minviro', val: '~$15M (Series A 2023)', gap: 'LCA tooling — post-hoc analysis, not live monitoring' },
  { comp: 'Circulor', val: '~$60M (Series B 2022)', gap: 'Supply chain tracing — starts mid-chain, not at the source' },
  { comp: 'Everledger', val: '$100M+ peak → collapsed', gap: 'Blockchain-first — overclaimed, under-delivered. Cautionary tale.' },
  { comp: 'Generic ESG', val: 'Varies', gap: 'Reporting aggregators. None covers field + compliance + executive.' },
]

export default function MoatSlide() {
  return (<>
    <div style={{ marginBottom: 16 }}><Tag>Defensibility</Tag></div>
    <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 32 }}>Competitive Moat</h2>
    <div style={{ maxWidth: 860, width: '100%' }}>
      {COMPETITORS.map(c => (
        <div key={c.comp} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '14px 0', borderBottom: `1px solid ${W.glass06}`, textAlign: 'left' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: W.text1 }}>{c.comp}</div>
            <div style={{ fontSize: 11, color: W.text4, marginTop: 2 }}>{c.val}</div>
          </div>
          <div style={{ flex: 2, fontSize: 12, color: W.text3, paddingLeft: 16 }}>{c.gap}</div>
        </div>
      ))}
    </div>
    <div style={{ marginTop: 24, maxWidth: 720 }}>
      <Bullet>Founder grew up inside the deposit — 40 years of local context. Irreplicable.</Bullet>
      <div style={{ height: 6 }} />
      <Bullet accent={W.green}>Honesty-first positioning — data honesty banner, Slide 0 disclaimer, "words to avoid" appendix. The Everledger defense.</Bullet>
    </div>
  </>)
}
