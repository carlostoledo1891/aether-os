import { W } from '../shared'
import { Bullet } from '../../../../components/deck'

export default function ProblemSlide() {
  return (<>
    <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 40 }}>The Problem</h2>
    <div style={{ maxWidth: 880, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Bullet>China controls 70% of global rare earth production — zero downstream provenance visibility.</Bullet>
      <Bullet>US DoD faces 18–24 month procurement delays from incomplete FEOC documentation.</Bullet>
      <Bullet accent={W.amber}>EU Digital Product Passport enforcement begins <strong style={{ color: W.text1 }}>February 2027</strong> — no industry-standard tooling exists.</Bullet>
      <Bullet>Operators juggle contradictory spreadsheets across engineering, permitting, IR, and community. None survives diligence.</Bullet>
      <Bullet>Meteoric Resources (ASX: MEI) — <strong style={{ color: W.text1 }}>$443M CAPEX, $821M NPV</strong> — has no unified governance layer.</Bullet>
    </div>
  </>)
}
