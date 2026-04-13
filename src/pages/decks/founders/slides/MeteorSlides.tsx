import { W, V } from '../shared'
import { Tag, Bullet } from '../../../../components/deck'

/* ── The Meteoric Play ─────────────────────────────────────── */

const LEADERS = [
  { who: 'Nick Gale', role: 'CEO', needs: 'Execution credibility for capital raises. Digital twin is his demo-closer.', accent: V },
  { who: 'Dr. De Carvalho', role: 'Chief Geologist', needs: 'Defensible QP-grade data with JORC badges. Will test the AI agent.', accent: V },
  { who: 'Nick Tunks', role: 'Chairman', needs: 'One coherent field-to-filing story. Executive Overview is his slide.', accent: V },
]

export function MeteorPlaySlide() {
  return (<>
    <div style={{ marginBottom: 16 }}><Tag>Insider Timing</Tag></div>
    <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 28 }}>The Meteoric Play</h2>
    <p style={{ fontSize: 13, color: W.text3, marginBottom: 24, maxWidth: 640 }}>Wednesday April 16 — I'm demoing VeroChain live to Dr. de Carvalho, the chief geologist at Poços de Caldas. This is the gate to a pilot contract. I hope you are in this with me!</p>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, maxWidth: 860, width: '100%', marginBottom: 20 }}>
      {LEADERS.map(p => (
        <div key={p.who} style={{ background: W.glass04, border: `1px solid ${W.glass06}`, borderRadius: 14, padding: '16px 14px', textAlign: 'left' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: p.accent }}>{p.who}</div>
          <div style={{ fontSize: 10, color: W.text4, marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{p.role}</div>
          <p style={{ fontSize: 11, color: W.text3, lineHeight: 1.5, margin: '8px 0 0' }}>{p.needs}</p>
        </div>
      ))}
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, width: '100%', maxWidth: 860 }}>
      {[
        { label: 'The Ask', value: '$102k/yr' },
        { label: 'Tier', value: 'Growth' },
        { label: '% of Revenue', value: '0.03%' },
        { label: 'Integration', value: '90 days' }
      ].map(s => (
        <div key={s.label} style={{ background: W.glass04, border: `1px solid ${W.glass06}`, borderRadius: 14, padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: W.text4, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>{s.label}</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: W.text1, fontFamily: 'var(--font-mono)' }}>{s.value}</div>
        </div>
      ))}
    </div>
  </>)
}

/* ── Why Before Meteoric ───────────────────────────────────── */

export function WhyBeforeMeteorSlide() {
  return (<>
    <div style={{ marginBottom: 16 }}><Tag>Timing Arbitrage</Tag></div>
    <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 28 }}>Why Before Meteoric</h2>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, maxWidth: 900, width: '100%', marginBottom: 32 }}>
      <div style={{ background: W.glass04, border: `1px solid ${W.glass06}`, borderRadius: 14, padding: '24px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: 10, color: W.text4, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Pre-Money Today</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: W.text1, fontFamily: 'var(--font-mono)' }}>$3-5M</div>
        <div style={{ fontSize: 11, color: W.text3, marginTop: 6 }}>Pre-revenue, pre-pilot</div>
      </div>
      <div style={{ background: `${W.green}08`, border: `1px solid ${W.green}30`, borderRadius: 14, padding: '24px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: 10, color: W.green, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Post-Pilot</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: W.green, fontFamily: 'var(--font-mono)' }}>$5-7M</div>
        <div style={{ fontSize: 11, color: W.text3, marginTop: 6 }}>Traction factor jumps 3.5 → 4.5</div>
      </div>
      <div style={{ background: `${V}10`, border: `1px solid ${V}30`, borderRadius: 14, padding: '24px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: 10, color: V, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Value Created</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: V, fontFamily: 'var(--font-mono)' }}>~$2M</div>
        <div style={{ fontSize: 11, color: W.text3, marginTop: 6 }}>Equity value from one meeting</div>
      </div>
    </div>
    <div style={{ maxWidth: 600, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <Bullet>Your investment creates the runway that closes the pilot.</Bullet>
      <Bullet>The pilot closes the valuation gap (30-40% paper value increase in days).</Bullet>
      <div style={{ padding: '12px 16px', background: `${W.green}15`, border: `1px solid ${W.green}40`, borderRadius: 8, marginTop: 4 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: W.green, textAlign: 'center' }}>Join before the catalyst, not after.</div>
      </div>
    </div>
  </>)
}
