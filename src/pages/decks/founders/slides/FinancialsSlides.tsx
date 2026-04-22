import { W, V } from '../shared'
import { Tag, StatCard } from '../../../../components/deck'

/* ── Revenue Model ─────────────────────────────────────────── */

const TIERS = [
  { tier: 'Pilot', price: '$2,500/mo', annual: '$30k', target: 'PFS-stage juniors' },
  { tier: 'Growth', price: '$8,500/mo', annual: '$102k', target: 'DFS-to-construction' },
  { tier: 'Enterprise', price: 'Custom', annual: '$180-350k', target: 'Multi-asset operators' },
]

const SCENARIOS = [
  { label: 'Bear — Slow Crawl', arr: '$1.4M', clients: '15', ev: '$15-25M' },
  { label: 'Consensus — Catalyzed', arr: '$4.5M', clients: '35', ev: '$55-90M' },
  { label: 'Bull — Category Creator', arr: '$13M', clients: '65', ev: '$130-200M' },
]

export function RevenueSlide() {
  return (<>
    <div style={{ marginBottom: 16 }}><Tag>Unit Economics</Tag></div>
    <h2 style={{ fontSize: 'clamp(22px, 3vw, 36px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 24 }}>Revenue Model & Unit Economics</h2>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, maxWidth: 860, width: '100%', marginBottom: 20 }}>
      {TIERS.map(t => (
        <div key={t.tier} style={{ background: W.glass04, border: `1px solid ${W.glass06}`, borderRadius: 14, padding: '18px 14px', textAlign: 'center' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: V }}>{t.tier}</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: W.text1, fontFamily: 'var(--font-mono)', marginTop: 6 }}>{t.price}</div>
          <div style={{ fontSize: 11, color: W.text3, marginTop: 4 }}>{t.annual}/yr</div>
          <div style={{ fontSize: 10, color: W.text4, marginTop: 6 }}>{t.target}</div>
        </div>
      ))}
    </div>
    <div style={{ maxWidth: 860, width: '100%' }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: V, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>2030 Revenue Scenarios — Modeled</div>
      {SCENARIOS.map(s => (
        <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${W.glass06}` }}>
          <span style={{ fontSize: 12, color: W.text2 }}>{s.label}</span>
          <div style={{ display: 'flex', gap: 16 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: W.text1, fontFamily: 'var(--font-mono)' }}>{s.arr} ARR</span>
            <span style={{ fontSize: 11, color: W.text3 }}>{s.clients} clients</span>
            <span style={{ fontSize: 12, color: V, fontFamily: 'var(--font-mono)' }}>EV {s.ev}</span>
          </div>
        </div>
      ))}
    </div>
    <div style={{ marginTop: 16, fontSize: 11, color: W.text3 }}>
      Modeled: operating cost ~$2k/mo · target gross margin 95%+ · low price sensitivity at ~0.03% of disclosed client revenue. Pricing is target list — no signed contracts yet.
    </div>
  </>)
}

/* ── Valuation ─────────────────────────────────────────────── */

const SCORECARD = [
  { factor: 'Founder / Team', weight: '25%', score: '4.5' },
  { factor: 'Market Size', weight: '20%', score: '4.0' },
  { factor: 'Product / Technology', weight: '20%', score: '4.5' },
  { factor: 'Competitive Landscape', weight: '15%', score: '3.5' },
  { factor: 'Traction', weight: '10%', score: '3.5' },
  { factor: 'Regulatory Tailwind', weight: '10%', score: '4.5' },
]

export function ValuationSlide() {
  return (<>
    <div style={{ marginBottom: 16 }}><Tag>Valuation</Tag></div>
    <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 24 }}>Valuation</h2>
    <div style={{ maxWidth: 740, width: '100%', marginBottom: 20 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: V, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Scorecard Method — 83rd Percentile</div>
      {SCORECARD.map(f => (
        <div key={f.factor} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: `1px solid ${W.glass06}` }}>
          <span style={{ fontSize: 12, color: W.text2 }}>{f.factor}</span>
          <div style={{ display: 'flex', gap: 16 }}>
            <span style={{ fontSize: 11, color: W.text3, minWidth: 36, textAlign: 'right' }}>{f.weight}</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: V, fontFamily: 'var(--font-mono)', minWidth: 24, textAlign: 'right' }}>{f.score}</span>
          </div>
        </div>
      ))}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', fontWeight: 700 }}>
        <span style={{ fontSize: 13, color: W.text1 }}>Total Weighted</span>
        <span style={{ fontSize: 15, color: V, fontFamily: 'var(--font-mono)' }}>4.15 / 5.0</span>
      </div>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, maxWidth: 740, width: '100%' }}>
      <StatCard value="$3-4M" label="Bear" sub="No signed pilot" />
      <StatCard value="$5-7M" label="Consensus" sub="Named anchor + team" />
      <StatCard value="$8-12M" label="Bull" sub="Strategic interest" />
    </div>
  </>)
}
