import { W, V } from '../shared'

const VIEWS = [
  { view: 'Ground Truth', who: 'Geologists · Operators', what: '3D terrain, drill collars, pilot plant digital twin, hydro monitoring, 1,092 springs + predictive environmental intelligence. Real weather data from ECMWF ERA5 feeds spring health forecasting.', icon: '\u{1F5FA}\uFE0F', accent: V },
  { view: 'Trade Truth', who: 'Buyers · Auditors · DoD', what: 'FEOC tracking, DPP export, SHA-256 audit chain, molecular-to-magnet traceability', icon: '\u{1F517}', accent: V },
  { view: 'Board Truth', who: 'Board · Investors · ECAs', what: 'Financial scenarios, risk register, capital tracker, ESG frameworks, stakeholders', icon: '\u{1F4CA}', accent: V },
]

export default function PlatformSlide() {
  return (<>
    <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 44px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 36 }}>Three Truths, One Platform</h2>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, maxWidth: 940, width: '100%' }}>
      {VIEWS.map(v => (
        <div key={v.view} style={{ background: W.glass04, border: `1px solid ${W.glass06}`, borderRadius: 14, padding: '20px 16px', textAlign: 'left' }}>
          <div style={{ fontSize: 20, marginBottom: 8 }}>{v.icon}</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: v.accent, marginBottom: 4 }}>{v.view}</div>
          <div style={{ fontSize: 11, color: W.text4, fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{v.who}</div>
          <p style={{ fontSize: 13, color: W.text3, lineHeight: 1.5, margin: 0 }}>{v.what}</p>
        </div>
      ))}
    </div>
  </>)
}
