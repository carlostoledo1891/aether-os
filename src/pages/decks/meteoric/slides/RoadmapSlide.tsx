import { motion } from 'motion/react'
import { Tag } from '../../../../components/deck'
import { PRODUCT_ROADMAP } from '../../../../data/domain/roadmap'
import { W, V, ease } from './shared'

export default function RoadmapSlide() {
  return (
    <>
      <div style={{ marginBottom: 12 }}><Tag>Roadmap</Tag></div>
      <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 28 }}>Planned Releases</h2>
      <div style={{ position: 'relative', maxWidth: 860, width: '100%' }}>
        <div style={{ position: 'absolute', left: 19, top: 0, bottom: 0, width: 2, background: `linear-gradient(180deg, ${V}60, ${V}10)` }} />
        {PRODUCT_ROADMAP.map((phase, i) => {
          const accent = phase.status === 'active' ? V : phase.status === 'shipped' ? W.green : W.text4
          const meteoricItems = phase.items.filter(it =>
            it.tag === 'infra' || it.tag === 'compliance' || it.title.includes('LAPOC') || it.title.includes('OPC') || it.title.includes('Multi-Project') || it.title.includes('Covenant') || it.title.includes('Blockchain') || it.title.includes('Government')
          )
          const items = meteoricItems.length > 0 ? meteoricItems : phase.items.slice(0, 3)
          return (
            <motion.div key={phase.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1, ease }}
              style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 20, position: 'relative' }}
            >
              <div style={{
                width: 40, height: 40, borderRadius: 10, flexShrink: 0, zIndex: 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: phase.status === 'active' ? `${V}20` : W.glass04,
                border: `1px solid ${phase.status === 'active' ? V : W.glass06}`,
              }}>
                <span style={{ fontSize: 8, fontWeight: 700, color: accent, fontFamily: 'var(--font-mono)', textAlign: 'center', lineHeight: 1.2 }}>{phase.quarter}</span>
              </div>
              <div style={{
                flex: 1, background: W.glass04,
                border: `1px solid ${phase.status === 'active' ? V : W.glass06}`,
                borderRadius: 12, padding: '14px 18px', position: 'relative', overflow: 'hidden',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: accent }}>{phase.title}</span>
                  <span style={{
                    fontSize: 8, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600,
                    padding: '2px 6px', borderRadius: 3,
                    background: phase.status === 'active' ? `${V}20` : phase.status === 'shipped' ? `${W.green}20` : W.glass04,
                    color: accent,
                  }}>{phase.status}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 6 }}>
                  {items.map(item => (
                    <div key={item.title} style={{ padding: '4px 0' }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: W.text2 }}>{item.title}</div>
                      <div style={{ fontSize: 10, color: W.text4, lineHeight: 1.4, marginTop: 1 }}>{item.description.slice(0, 60)}{item.description.length > 60 ? '…' : ''}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </>
  )
}
