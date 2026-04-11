import { Tag } from '../../../../components/deck'
import { PRODUCT_ROADMAP } from '../../../../data/domain/roadmap'
import { W, V } from './shared'

export default function RoadmapSlide() {
  return (
    <>
      <div style={{ marginBottom: 16 }}><Tag>Roadmap</Tag></div>
      <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 28 }}>Product Roadmap</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, maxWidth: 960, width: '100%' }}>
        {PRODUCT_ROADMAP.map(phase => {
          const accent = phase.status === 'active' ? V : phase.status === 'shipped' ? W.green : W.text4
          const meteoricItems = phase.items.filter(it =>
            it.tag === 'infra' || it.tag === 'compliance' || it.title.includes('LAPOC') || it.title.includes('OPC') || it.title.includes('Multi-Project') || it.title.includes('Covenant') || it.title.includes('Blockchain')
          )
          const items = meteoricItems.length > 0 ? meteoricItems.slice(0, 4) : phase.items.slice(0, 3)
          return (
            <div key={phase.id} style={{ background: W.glass04, border: `1px solid ${phase.status === 'active' ? V : W.glass06}`, borderRadius: 14, padding: '16px 14px', textAlign: 'left', position: 'relative', overflow: 'hidden' }}>
              {phase.status === 'active' && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: V }} />}
              <div style={{ fontSize: 10, fontWeight: 700, color: accent, fontFamily: 'var(--font-mono)', marginBottom: 4 }}>{phase.quarter}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: accent, marginBottom: 10 }}>{phase.title}</div>
              {items.map(item => (
                <div key={item.title} style={{ marginBottom: 6 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: W.text2 }}>{item.title}</div>
                  <div style={{ fontSize: 10, color: W.text4, lineHeight: 1.4, marginTop: 1 }}>{item.description.slice(0, 50)}…</div>
                </div>
              ))}
              <span style={{
                fontSize: 8, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, padding: '2px 6px', borderRadius: 3, marginTop: 6, display: 'inline-block',
                background: phase.status === 'active' ? `${V}20` : W.glass04, color: accent,
              }}>{phase.status}</span>
            </div>
          )
        })}
      </div>
    </>
  )
}
