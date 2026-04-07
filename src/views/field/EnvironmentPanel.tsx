import { memo } from 'react'
import { motion } from 'motion/react'
import { Droplets, Layers, RadioTower, FileCheck, AlertTriangle } from 'lucide-react'
import type { EnvTelemetry } from '../../types/telemetry'
import { GlassCard } from '../../components/ui/GlassCard'
import { GlowingIcon } from '../../components/ui/GlowingIcon'
import { StatusChip } from '../../components/ui/StatusChip'
import { MetricDisplay } from '../../components/ui/MetricDisplay'
import { SparkLine } from '../../components/charts/SparkLine'
import { W } from '../../app/canvas/canvasTheme'
import {
  PREDICTIVE_HYDROLOGY_SCENARIOS,
  SCALE_UP_PATHWAY,
} from '../../data/mockData'
import { LICENSE_COLORS, LICENSE_ITEMS } from './constants'

interface EnvironmentPanelProps {
  env: EnvTelemetry
  envHistory: EnvTelemetry[]
}

export const EnvironmentPanel = memo(function EnvironmentPanel({ env, envHistory }: EnvironmentPanelProps) {
  const sulfateOk   = env.water_quality.sulfate_ppm < 250
  const nitrateOk   = env.water_quality.nitrate_ppm < 50
  const radOk       = env.legacy_infrastructure.radiation_usv_h < 0.18
  const sulfateData = envHistory.map(h => h.water_quality.sulfate_ppm)
  const nitrateData = envHistory.map(h => h.water_quality.nitrate_ppm)
  const radData     = envHistory.map(h => h.legacy_infrastructure.radiation_usv_h)

  const counts = {
    active:     env.springs.filter(s => s.status === 'Active').length,
    reduced:    env.springs.filter(s => s.status === 'Reduced').length,
    suppressed: env.springs.filter(s => s.status === 'Suppressed').length,
  }

  const currentScenario = PREDICTIVE_HYDROLOGY_SCENARIOS[1]
  const currentScenarioStatus = currentScenario.status as 'stable' | 'watch' | 'action'

  return (
    <motion.div
      key="env-panel"
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
    >
      {/* Cumulative impact forecast */}
      <GlassCard animate={false} glow="cyan" style={{ padding: '11px 13px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <GlowingIcon icon={Layers} color="cyan" size={11}/>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: W.text4 }}>
            Cumulative Impact Forecast
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 7, marginBottom: 8 }}>
          {PREDICTIVE_HYDROLOGY_SCENARIOS.map((scenario) => {
            const statusColor = scenario.status === 'stable' ? W.green : scenario.status === 'watch' ? W.amber : W.red
            return (
              <div key={scenario.horizon} style={{ padding: '7px 8px', borderRadius: 7, background: `${statusColor}0F`, border: `1px solid ${statusColor}25` }}>
                <div style={{ fontSize: 10, color: W.text4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{scenario.horizon}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: statusColor, fontFamily: 'var(--font-mono)' }}>
                  {scenario.spring_preservation_pct}%
                </div>
                <div style={{ fontSize: 10, color: W.text4 }}>spring preservation</div>
              </div>
            )
          })}
        </div>
        <p style={{ margin: '0 0 6px', fontSize: 11, color: W.text3, lineHeight: 1.45 }}>
          Current modeled board case: <span style={{ color: W.text1, fontWeight: 700 }}>{currentScenario.horizon}</span> with
          {' '}<span style={{ color: W.text2 }}>{currentScenario.active_springs} active springs</span>,
          {' '}<span style={{ color: W.text2 }}>{currentScenario.recirculation_pct.toFixed(1)}% recirculation</span>, and
          {' '}<span style={{ color: W.text2 }}>{currentScenario.sulfate_guardband_ppm} ppm sulfate guardband</span>.
        </p>
        <div style={{ height: 5, background: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{
            width: `${currentScenario.spring_preservation_pct}%`,
            height: '100%',
            background: `linear-gradient(90deg, ${W.cyan}80, ${W.green})`,
            borderRadius: 4,
            boxShadow: `0 0 6px ${W.cyan}60`,
          }}/>
        </div>
      </GlassCard>

      {/* LI hearing readiness */}
      <GlassCard animate={false} glow={currentScenarioStatus === 'action' ? 'red' : 'amber'} style={{ padding: '11px 13px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <GlowingIcon icon={AlertTriangle} color="amber" size={11}/>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: W.text4 }}>
              LI Hearing Readiness
            </span>
          </div>
          <StatusChip
            label={currentScenario.permitting_signal}
            variant={currentScenarioStatus === 'stable' ? 'green' : currentScenarioStatus === 'watch' ? 'amber' : 'red'}
            size="sm"
          />
        </div>
        <p style={{ fontSize: 11, color: W.text3, margin: '0 0 6px', lineHeight: 1.45 }}>
          {currentScenario.recommendation}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7 }}>
          <div style={{ padding: '6px 7px', borderRadius: 7, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: 10, color: W.text4, textTransform: 'uppercase' }}>Digital coverage</div>
            <div style={{ fontSize: 12, color: W.text1, fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
              {SCALE_UP_PATHWAY.current_digital_coverage_pct}%
            </div>
          </div>
          <div style={{ padding: '6px 7px', borderRadius: 7, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: 10, color: W.text4, textTransform: 'uppercase' }}>Springs monitored</div>
            <div style={{ fontSize: 12, color: W.text1, fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
              {SCALE_UP_PATHWAY.springs_monitored}
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Aquifer depths */}
      <GlassCard animate={false} style={{ padding: '11px 13px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <GlowingIcon icon={Droplets} color="cyan" size={11}/>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: W.text4 }}>Aquifer Depths</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {env.aquifer.sensors.map(s => {
            const c = s.status === 'Normal' ? W.cyan : s.status === 'Warning' ? W.amber : W.red
            const delta = s.depth_meters - s.baseline_meters
            const pct = Math.min(100, (s.depth_meters / 35) * 100)
            return (
              <div key={s.sensor_id} style={{
                display: 'flex', alignItems: 'center', gap: 7, padding: '5px 7px',
                background: 'rgba(255,255,255,0.02)', borderRadius: 6, border: `1px solid ${c}18`,
              }}>
                <span style={{ fontSize: 10, color: c, fontFamily: 'var(--font-mono)', fontWeight: 700, minWidth: 52, flexShrink: 0 }}>
                  {s.sensor_id}
                </span>
                <div style={{ flex: 1, height: 3.5, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' }}>
                  <motion.div animate={{ width: `${pct}%` }} transition={{ duration: 0.5 }}
                    style={{ height: '100%', background: c, borderRadius: 2, boxShadow: `0 0 4px ${c}60` }}/>
                </div>
                <span style={{ fontSize: 11, color: c, fontFamily: 'var(--font-mono)', minWidth: 40, textAlign: 'right', flexShrink: 0 }}>
                  {s.depth_meters.toFixed(1)} m
                </span>
                <span style={{ fontSize: 10, color: delta > 0.5 ? W.amber : W.text4, fontFamily: 'var(--font-mono)', minWidth: 30, textAlign: 'right', flexShrink: 0 }}>
                  {delta >= 0 ? '+' : ''}{delta.toFixed(1)}
                </span>
              </div>
            )
          })}
        </div>
      </GlassCard>

      {/* Water quality */}
      <GlassCard animate={false} glow={(!sulfateOk || !nitrateOk) ? 'amber' : 'none'} style={{ padding: '11px 13px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <GlowingIcon icon={Droplets} color={(!sulfateOk || !nitrateOk) ? 'amber' : 'green'} size={11}/>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: W.text4 }}>Water Quality</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
              <span style={{ fontSize: 10, color: W.text3 }}>Sulfate</span>
              {!sulfateOk && <StatusChip label="⚠" variant="red" size="sm"/>}
            </div>
            <MetricDisplay value={env.water_quality.sulfate_ppm} unit="ppm" decimals={0} size="sm" color={sulfateOk ? 'green' : 'amber'}/>
            <SparkLine data={sulfateData} color={sulfateOk ? W.green : W.amber} thresholdHigh={250} height={28} unit=" ppm"/>
            <p style={{ fontSize: 10, color: W.text4, margin: '2px 0 0', fontFamily: 'var(--font-mono)' }}>limit: 250 ppm</p>
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
              <span style={{ fontSize: 10, color: W.text3 }}>Nitrate</span>
              {!nitrateOk && <StatusChip label="⚠" variant="red" size="sm"/>}
            </div>
            <MetricDisplay value={env.water_quality.nitrate_ppm} unit="ppm" decimals={0} size="sm" color={nitrateOk ? 'green' : 'amber'}/>
            <SparkLine data={nitrateData} color={nitrateOk ? W.green : W.amber} thresholdHigh={50} height={28} unit=" ppm"/>
            <p style={{ fontSize: 10, color: W.text4, margin: '2px 0 0', fontFamily: 'var(--font-mono)' }}>limit: 50 ppm</p>
          </div>
        </div>
      </GlassCard>

      {/* Radiation */}
      <GlassCard animate={false} glow={radOk ? 'none' : 'red'} style={{ padding: '11px 13px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <GlowingIcon icon={RadioTower} color={radOk ? 'text2' : 'red'} size={11}/>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: W.text4 }}>UDC Radiation</span>
          </div>
          <StatusChip label={env.legacy_infrastructure.udc_status} variant={radOk ? 'green' : 'red'} dot size="sm"/>
        </div>
        <MetricDisplay value={env.legacy_infrastructure.radiation_usv_h} unit="μSv/h" decimals={3} size="md" color={radOk ? 'green' : 'red'}/>
        <SparkLine data={radData} color={radOk ? W.green : W.red} thresholdHigh={0.18} height={28} unit=" μSv/h"/>
        <p style={{ fontSize: 10, color: W.text4, margin: '3px 0 0', fontFamily: 'var(--font-mono)' }}>normal background ~0.14 μSv/h</p>
      </GlassCard>

      {/* Springs */}
      <GlassCard animate={false} style={{ padding: '11px 13px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <GlowingIcon icon={Droplets} color="cyan" size={11}/>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: W.text4 }}>Water Springs</span>
          <span style={{ fontSize: 10, color: W.text4 }}>98 monitored</span>
        </div>
        <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
          {[
            { count: counts.active,     label: 'Active',     color: W.green },
            { count: counts.reduced,    label: 'Reduced',    color: W.amber },
            { count: counts.suppressed, label: 'Suppressed', color: W.red   },
          ].map(({ count, label, color }) => (
            <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
              <span style={{ fontSize: 18, fontWeight: 700, color, fontFamily: 'var(--font-mono)' }}>{count}</span>
              <span style={{ fontSize: 10, color: W.text4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {env.springs.slice(0, 98).map(s => (
            <span key={s.id} title={`${s.id}: ${s.status}`} style={{
              width: 7, height: 7, borderRadius: '50%',
              background: s.status === 'Active' ? W.green : s.status === 'Reduced' ? W.amber : W.red,
              opacity: s.status === 'Active' ? 0.65 : 0.9, display: 'inline-block',
            }}/>
          ))}
        </div>
      </GlassCard>

      {/* License timeline */}
      <GlassCard animate={false} style={{ padding: '11px 13px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
          <GlowingIcon icon={FileCheck} color="green" size={11}/>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: W.text4 }}>License Timeline</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {LICENSE_ITEMS.map(({ label, full, sub, status }, i) => {
            const color = LICENSE_COLORS[status]
            return (
              <div key={label} style={{ display: 'flex', gap: 9, alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 2 }}>
                  <div style={{
                    width: 18, height: 18, borderRadius: 5, flexShrink: 0,
                    background: status === 'pending' ? 'transparent' : `${color}20`,
                    border: `1.5px solid ${color}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: status !== 'pending' ? `0 0 5px ${color}40` : undefined,
                  }}>
                    <span style={{ fontSize: 7, fontWeight: 800, color, fontFamily: 'var(--font-mono)' }}>{label}</span>
                  </div>
                  {i < 2 && <div style={{ width: 1, height: 22, background: 'rgba(255,255,255,0.07)', margin: '3px 0' }}/>}
                </div>
                <div style={{ paddingBottom: i < 2 ? 10 : 0 }}>
                  <span style={{ fontSize: 10, fontWeight: 600, color: W.text1, display: 'block', marginBottom: 1 }}>{full}</span>
                  <span style={{ fontSize: 10, color: W.text4 }}>{sub}</span>
                </div>
              </div>
            )
          })}
        </div>
        <div style={{ marginTop: 9, padding: '5px 8px', background: `${W.amber}0F`, border: `1px solid ${W.amber}2E`, borderRadius: 7 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 5 }}>
            <AlertTriangle size={9} style={{ color: W.amber, marginTop: 1, flexShrink: 0 }}/>
            <p style={{ fontSize: 11, color: W.text3, margin: 0, lineHeight: 1.45 }}>
              MPF cumulative EIA demand remains the core LI bottleneck. This prototype frames live telemetry as evidence for a scale-up-safe permitting case.
            </p>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  )
})
