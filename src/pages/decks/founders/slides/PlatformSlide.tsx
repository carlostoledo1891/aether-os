import { W, V } from '../shared'

const VIEWS = [
  { view: 'Ground Truth', who: 'Geologists · Operators · Watch officers', what: 'Maps, drill collars, pilot plant digital twin, hydro monitoring, 1,092 mapped springs — and on the maritime instance: AIS-style vessel tracks, AOI polygons, sensor coverage. Same MapLibre runtime, different fixtures.', icon: '\u{1F5FA}\uFE0F', accent: V },
  { view: 'Trade Truth', who: 'Buyers · Auditors · DoD', what: 'FEOC tracking framework, DPP export (22 of 37 fields mapped), SHA-256 audit chain, source-to-magnet traceability — and ISR product handoffs from the maritime instance, both routed through the same /api/bundles/preset endpoint.', icon: '\u{1F517}', accent: V },
  { view: 'Board Truth', who: 'Board · Investors · ECAs', what: 'Financial scenarios, risk register, capital tracker, ESG framework mappings, stakeholders — bundle hashes from either instance verify against the same client-side verifier at /verify/<hash>.', icon: '\u{1F4CA}', accent: V },
]

export default function PlatformSlide() {
  return (<>
    <div style={{ fontSize: 11, color: W.text3, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Two live instances · One runtime</div>
    <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 44px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 12 }}>Three Truths, One Platform</h2>
    <p style={{ fontSize: 13, color: W.text3, marginBottom: 28, maxWidth: 720 }}>
      The same shell that runs Meteoric's Caldeira workspace at <code style={{ fontFamily: 'var(--font-mono)', color: W.text2 }}>/app/meteoric</code> also runs an Atlantic Maritime ISR instance at <code style={{ fontFamily: 'var(--font-mono)', color: W.text2 }}>/app/maritime</code> — different fixtures, identical primitives, identical audit chain.
    </p>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, maxWidth: 940, width: '100%' }}>
      {VIEWS.map(v => (
        <div key={v.view} style={{ background: W.glass04, border: `1px solid ${W.glass06}`, borderRadius: 14, padding: '20px 16px', textAlign: 'left' }}>
          <div style={{ fontSize: 20, marginBottom: 8 }}>{v.icon}</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: v.accent, marginBottom: 4 }}>{v.view}</div>
          <div style={{ fontSize: 11, color: W.text3, fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{v.who}</div>
          <p style={{ fontSize: 13, color: W.text3, lineHeight: 1.5, margin: 0 }}>{v.what}</p>
        </div>
      ))}
    </div>
  </>)
}
