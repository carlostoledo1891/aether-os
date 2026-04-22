import { W, V } from './shared'

const VIEWS = [
  { view: 'Field Geology', who: 'Chief geologist, technical committee', what: '3D terrain, drill collars, deposit context, and JORC-aligned resource evidence' },
  { view: 'Hydro Firewall', who: 'Geology kept honest', what: 'Hydrology remains visible, but clearly separated from tonnage, grade, and reserve claims' },
  { view: 'Technical Appendix', who: 'Printable evidence', what: 'One light-mode geology dossier with drill tests, lithology, and Pilot vs ANSTO validation' },
]

export default function ThreeViewsSlide() {
  return (
    <>
      <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 44px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 36 }}>One Technical Review Flow</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, maxWidth: 940, width: '100%' }}>
        {VIEWS.map(v => (
          <div key={v.view} style={{ background: W.glass04, border: `1px solid ${W.glass06}`, borderRadius: 14, padding: '20px 16px', textAlign: 'left' }}>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: -20, left: 0, right: 0, height: 2, background: V, opacity: 0.5, borderRadius: 1 }} />
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: W.text1, marginBottom: 4 }}>{v.view}</div>
            <div style={{ fontSize: 11, color: V, fontWeight: 600, marginBottom: 8 }}>{v.who}</div>
            <p style={{ fontSize: 13, color: W.text3, lineHeight: 1.5, margin: 0 }}>{v.what}</p>
          </div>
        ))}
      </div>
    </>
  )
}
