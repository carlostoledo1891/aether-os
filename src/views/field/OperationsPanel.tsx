import { memo } from 'react'
import { motion } from 'motion/react'
import { Droplets, Zap, FlaskConical, Gauge } from 'lucide-react'
import type { PlantTelemetry } from '../../types/telemetry'
import { GlassCard } from '../../components/ui/GlassCard'
import { GlowingIcon } from '../../components/ui/GlowingIcon'
import { StatusChip } from '../../components/ui/StatusChip'
import { MetricDisplay } from '../../components/ui/MetricDisplay'
import { SparkLine } from '../../components/charts/SparkLine'
import { BarComparison } from '../../components/charts/BarComparison'
import { W } from '../../app/canvas/canvasTheme'
import { BOARD_NARRATIVE, PILOT_PLANT_PERFORMANCE, SCALE_UP_PATHWAY } from '../../data/mockData'
import { CHAIN_STEPS, DOMAIN_COLOR, phVariant } from './constants'

interface OperationsPanelProps {
  plant: PlantTelemetry
  plantHistory: PlantTelemetry[]
}

export const OperationsPanel = memo(function OperationsPanel({ plant, plantHistory }: OperationsPanelProps) {
  const phVal      = plant.leaching_circuit.ph_level
  const phColor    = phVariant(phVal)
  const recircOk   = plant.flow_metrics.recirculation_pct >= 95
  const phData     = plantHistory.map(h => h.leaching_circuit.ph_level)
  const recircData = plantHistory.map(h => h.flow_metrics.recirculation_pct)
  const treoData   = plantHistory.map(h => h.output.treo_grade_pct)

  return (
    <motion.div
      key="operations-panel"
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
    >
      <GlassCard animate={false} glow="violet" style={{ padding: '11px 13px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <GlowingIcon icon={Gauge} color="violet" size={11}/>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: W.text4 }}>
            Board Narrative
          </span>
        </div>
        <p style={{ margin: '0 0 7px', fontSize: 11, color: W.text2, lineHeight: 1.5 }}>
          {BOARD_NARRATIVE.board_prompt}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7 }}>
          <div style={{ padding: '7px 8px', borderRadius: 7, background: `${W.violet}14`, border: `1px solid ${W.violet}29` }}>
            <div style={{ fontSize: 10, color: W.text4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pilot</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: W.text1, fontFamily: 'var(--font-mono)' }}>
              {SCALE_UP_PATHWAY.pilot_throughput_kg_hr} kg/h
            </div>
          </div>
          <div style={{ padding: '7px 8px', borderRadius: 7, background: `${W.cyan}14`, border: `1px solid ${W.cyan}29` }}>
            <div style={{ fontSize: 10, color: W.text4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Scale path</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: W.text1, fontFamily: 'var(--font-mono)' }}>
              {SCALE_UP_PATHWAY.commercial_target_mtpa.toFixed(1)} Mtpa
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Pilot Recovery Comparison */}
      <GlassCard animate={false} style={{ padding: '12px 14px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <GlowingIcon icon={FlaskConical} color="green" size={11}/>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: W.text4 }}>
            Pilot vs ANSTO Recovery
          </span>
          <StatusChip label={`${PILOT_PLANT_PERFORMANCE.avg_magnet_recovery_pct}% avg`} variant="green" size="sm" />
        </div>
        <BarComparison
          height={18}
          max={100}
          showPercent
          items={PILOT_PLANT_PERFORMANCE.recoveries.map(r => ({
            label: `${r.element} — Pilot ${r.pilot_pct}% / ANSTO ${r.ansto_pct}%`,
            value: r.pilot_pct,
            color: r.pilot_pct >= r.ansto_pct ? W.green : W.amber,
          }))}
        />
        <div style={{ marginTop: 8, display: 'flex', gap: 12, fontSize: 10, color: W.text4 }}>
          <span>MREC: {PILOT_PLANT_PERFORMANCE.mrec_mreo_pct}% MREO</span>
          <span>Peak: {PILOT_PLANT_PERFORMANCE.peak_kg_day} kg/day</span>
          <span>DyTb: {PILOT_PLANT_PERFORMANCE.mrec_dytb_pct}%</span>
        </div>
      </GlassCard>

      <GlassCard animate={false} style={{ padding: '12px 14px', flexShrink: 0 }}>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: W.text4, display: 'block', marginBottom: 10 }}>
          Pilot-to-Enterprise Chain
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {CHAIN_STEPS.map((step, i) => {
            const stepColor = DOMAIN_COLOR[step.domain]
            const isLast = i === CHAIN_STEPS.length - 1
            return (
              <div key={step.id}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '5px 0' }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 7, flexShrink: 0,
                    background: `${stepColor}14`,
                    border: `1px solid ${stepColor}40`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <step.icon size={12} style={{ color: stepColor, filter: `drop-shadow(0 0 3px ${stepColor}80)` }}/>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 10, fontWeight: 600, color: W.text1 }}>{step.label}</div>
                    <div style={{ fontSize: 10, color: W.text4 }}>{step.sub}</div>
                  </div>
                  <motion.div
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.3 }}
                    style={{ width: 6, height: 6, borderRadius: '50%', background: stepColor, boxShadow: `0 0 5px ${stepColor}`, flexShrink: 0 }}
                  />
                </div>
                {!isLast && (
                  <div style={{ display: 'flex', alignItems: 'center', paddingLeft: 13 }}>
                    <div style={{ width: 1, height: 6, background: `linear-gradient(to bottom, ${stepColor}40, ${DOMAIN_COLOR[CHAIN_STEPS[i + 1].domain]}40)` }}/>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </GlassCard>

      <GlassCard animate={false} style={{ padding: '12px 14px', flexShrink: 0 }}>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: W.text4, display: 'block', marginBottom: 10 }}>
          Proof That Scales
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <GlowingIcon icon={Droplets} color="cyan" size={11}/>
                <span style={{ fontSize: 10, color: W.text3, fontWeight: 600 }}>Water Recirculation</span>
              </div>
              <StatusChip label={recircOk ? 'OK' : 'LOW'} variant={recircOk ? 'green' : 'amber'} size="sm"/>
            </div>
            <MetricDisplay value={plant.flow_metrics.recirculation_pct} decimals={1} unit="%" size="md" color={recircOk ? 'cyan' : 'amber'}/>
            <SparkLine data={recircData} color={recircOk ? W.cyan : W.amber} thresholdLow={95} height={32}/>
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <GlowingIcon icon={FlaskConical} color="violet" size={11}/>
                <span style={{ fontSize: 10, color: W.text3, fontWeight: 600 }}>Leach Circuit pH</span>
              </div>
              <StatusChip label={phColor === 'green' ? 'OPTIMAL' : phColor === 'amber' ? 'DRIFT' : 'BREACH'} variant={phColor} size="sm" dot/>
            </div>
            <MetricDisplay value={phVal} decimals={2} size="md" color={phColor}/>
            <SparkLine data={phData} color={phColor === 'green' ? W.violet : phColor === 'amber' ? W.amber : W.red} thresholdLow={4.0} thresholdHigh={5.0} height={32}/>
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <GlowingIcon icon={Gauge} color="green" size={11}/>
                <span style={{ fontSize: 10, color: W.text3, fontWeight: 600 }}>TREO Grade (XRF)</span>
              </div>
            </div>
            <MetricDisplay value={plant.output.treo_grade_pct} decimals={1} unit="%" size="md" color="text1"/>
            <SparkLine data={treoData} color={W.green} thresholdLow={89} height={32}/>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
              <GlowingIcon icon={Zap} color="violet" size={11}/>
              <span style={{ fontSize: 10, color: W.text3, fontWeight: 600 }}>FJH Energy Savings</span>
            </div>
            <MetricDisplay value={plant.fjh_separation.energy_savings_pct} decimals={1} unit="%" size="md" color="text1"/>
            <p style={{ fontSize: 10, color: W.text4, margin: '2px 0 0', fontFamily: 'var(--font-mono)' }}>
              vs. traditional SX · {plant.fjh_separation.power_draw_kw.toFixed(1)} kW draw
            </p>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  )
})
