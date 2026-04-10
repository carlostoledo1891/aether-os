import { memo } from 'react'
import { Layers } from 'lucide-react'
import { GlassCard } from '../../components/ui/GlassCard'
import { GlowingIcon } from '../../components/ui/GlowingIcon'
import { SectionLabel } from '../../components/ui/SectionLabel'
import { W } from '../../app/canvas/canvasTheme'
import css from './EnvironmentPanel.module.css'

interface Scenario {
  horizon: string
  status: string
  spring_preservation_pct: number
  drought_index: number
  active_springs: number
  recirculation_pct: number
  sulfate_guardband_ppm: number
}

export interface PredictiveModelingCardProps {
  scenarios: Scenario[]
  currentScenario: Scenario
  springCount: number
}

export const PredictiveModelingCard = memo(function PredictiveModelingCard({
  scenarios,
  currentScenario,
  springCount,
}: PredictiveModelingCardProps) {
  return (
    <GlassCard animate={false} glow="cyan" className={css.cardBody}>
      <div className={css.sectionHead} style={{ marginBottom: 4 }}>
        <GlowingIcon icon={Layers} color="cyan" size={11}/>
        <SectionLabel>Predictive Cumulative Modeling</SectionLabel>
      </div>
      <div className={css.mono10} style={{ color: W.cyan, marginBottom: 8 }}>
        6.0 Mtpa commercial scale-up · 2030–2050 drought forecast · {springCount} local springs
      </div>
      <div className={css.grid3} style={{ gap: 7, marginBottom: 8 }}>
        {scenarios.map((scenario) => {
          const statusColor = scenario.status === 'stable' ? W.green : scenario.status === 'watch' ? W.amber : W.red
          return (
            <div key={scenario.horizon} className={css.scenarioCell} style={{ borderRadius: W.radius.sm, background: `${statusColor}0F`, border: `1px solid ${statusColor}25` }}>
              <div className={css.labelUpper} style={{ color: W.text4, letterSpacing: '0.04em' }}>Modeled · {scenario.horizon}</div>
              <div className={css.monoValueLg} style={{ color: statusColor }}>
                {scenario.spring_preservation_pct}%
              </div>
              <div style={{ fontSize: 10, color: W.text4 }}>spring preservation</div>
              <div style={{ fontSize: 10, color: W.text4, marginTop: 2 }}>
                DI: {scenario.drought_index.toFixed(2)} · {scenario.active_springs}/{springCount}
              </div>
            </div>
          )
        })}
      </div>
      <div className={css.grid2} style={{ marginBottom: 6, gap: 6 }}>
        <div className={css.infoCell} style={{ borderRadius: W.radius.sm, background: W.glass04, border: W.chromeBorder }}>
          <div className={css.labelUpper} style={{ color: W.text4 }}>Data Ingestion</div>
          <div style={{ fontSize: 10, color: W.text2, marginTop: 2 }}>Target: piezometers + Open-Meteo/INMET class precip (demo: optional API + mock)</div>
        </div>
        <div className={css.infoCell} style={{ borderRadius: W.radius.sm, background: W.glass04, border: W.chromeBorder }}>
          <div className={css.labelUpper} style={{ color: W.text4 }}>Output</div>
          <div style={{ fontSize: 10, color: W.text2, marginTop: 2 }}>Simulated hydrological digital twin (commercial-case model)</div>
        </div>
      </div>
      <p className={css.bodyText} style={{ color: W.text3, marginBottom: 6 }}>
        Modeled case: <span style={{ color: W.text1, fontWeight: 700 }}>{currentScenario.horizon}</span> with
        {' '}<span style={{ color: W.text2 }}>{currentScenario.active_springs} active springs</span>,
        {' '}<span style={{ color: W.text2 }}>{currentScenario.recirculation_pct.toFixed(1)}% recirculation</span>, and
        {' '}<span style={{ color: W.text2 }}>{currentScenario.sulfate_guardband_ppm} ppm guardband</span>.
        Dry-stacking + 95% recirculation mathematically proves zero suppression of {springCount} local springs.
      </p>
      <div className={css.barTrack} style={{ height: 5, background: W.glass05, borderRadius: W.radius.xs }}>
        <div style={{
          width: `${currentScenario.spring_preservation_pct}%`,
          height: '100%',
          background: `linear-gradient(90deg, ${W.cyan}80, ${W.green})`,
          borderRadius: W.radius.xs,
          boxShadow: `0 0 6px ${W.cyan}60`,
        }}/>
      </div>
    </GlassCard>
  )
})
