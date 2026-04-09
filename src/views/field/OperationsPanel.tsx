import { memo, useState, type Dispatch, type SetStateAction } from 'react'
import { motion } from 'motion/react'
import { Cpu, Droplets, FlaskConical, Gauge, MapPinned, Zap } from 'lucide-react'
import { GlassCard } from '../../components/ui/GlassCard'
import { GlowingIcon } from '../../components/ui/GlowingIcon'
import { StatusChip } from '../../components/ui/StatusChip'
import { MetricDisplay } from '../../components/ui/MetricDisplay'
import { SparkLine } from '../../components/charts/SparkLine'
import { BarComparison } from '../../components/charts/BarComparison'
import { TimeRangeSelector } from '../../components/ui/TimeRangeSelector'
import { W } from '../../app/canvas/canvasTheme'
import { useTelemetry } from '../../services/DataServiceProvider'
import { useServiceQuery, useServiceQueryWithArg } from '../../hooks/useServiceQuery'
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton'
import { ErrorFallback } from '../../components/ui/ErrorFallback'
import type { TimeRangeKey } from '../../services/dataService'
import { CHAIN_STEPS, DOMAIN_COLOR, phVariant } from './constants'
import { SectionLabel } from '../../components/ui/SectionLabel'
import type { FieldOpsMapLayers } from './fieldMapLayers'
import type { DrillHoleType } from '../../components/map/DrillHoleOverlay'

export const OperationsPanel = memo(function OperationsPanel({
  opsMapLayers,
  setOpsMapLayers,
}: {
  opsMapLayers: FieldOpsMapLayers
  setOpsMapLayers: Dispatch<SetStateAction<FieldOpsMapLayers>>
}) {
  const { plant } = useTelemetry()
  const { data: PILOT_PLANT_PERFORMANCE, isLoading: l1, error: e1 } = useServiceQuery('plant-perf', s => s.getPlantPerformance())
  const { data: HARDWARE_SENSORS, isLoading: l2, error: e2 } = useServiceQuery('hardware-sensors', s => s.getHardwareSensors())
  const { data: spatial, isLoading: l3, error: e3 } = useServiceQuery('spatial-insights', s => s.getSpatialInsights())
  const [range, setRange] = useState<TimeRangeKey>('24h')
  const { data: history } = useServiceQueryWithArg('history', range, (s, r) => s.getHistory(r))
  const plantHistory = history?.plantHistory ?? []
  const phVal      = plant.leaching_circuit.ph_level
  const phColor    = phVariant(phVal)
  const recircOk   = plant.flow_metrics.recirculation_pct >= 95
  const phData     = plantHistory.map(h => h.leaching_circuit.ph_level)
  const recircData = plantHistory.map(h => h.flow_metrics.recirculation_pct)
  const treoData   = plantHistory.map(h => h.output.treo_grade_pct)

  const firstError = e1 || e2 || e3
  if (firstError) return <ErrorFallback error={firstError} label="Operations data" />
  if (l1 || l2 || l3 || !PILOT_PLANT_PERFORMANCE || !HARDWARE_SENSORS || !spatial) {
    return <LoadingSkeleton variant="card" label="Loading operations..." />
  }

  return (
    <motion.div
      key="operations-panel"
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col gap-2"
    >
      <GlassCard animate={false} className="shrink-0 px-3 py-2.5">
        <div className="mb-2 flex items-center gap-1.5">
          <MapPinned size={11} style={{ color: W.violetSoft }} />
          <SectionLabel wideTracking>Map layers</SectionLabel>
        </div>
        <div className="mb-1.5 text-[9px] font-semibold uppercase tracking-wide" style={{ color: W.text4 }}>
          Terrain-aligned
        </div>
        <div className="mb-2 flex flex-col gap-1.5">
          {(
            [
              ['plantSites', 'Pilot + commercial plant sites'] as const,
              ['tenements', 'Mining licences (per block)'] as const,
              ['pfsEngineering', 'PFS starter pit + spent clay'] as const,
              ['drillHoles', 'Named drill collars'] as const,
              ['accessRoutes', 'Access road (concept)'] as const,
              ['licenceEnvelope', 'Caldeira 193 km² envelope'] as const,
              ['apa', 'APA Pedra Branca (protected area)'] as const,
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="flex cursor-pointer items-center gap-2 text-[10px]" style={{ color: W.text3 }}>
              <input
                type="checkbox"
                checked={opsMapLayers[key]}
                onChange={(e) => setOpsMapLayers((L) => ({ ...L, [key]: e.target.checked }))}
                className="accent-violet-500"
              />
              {label}
            </label>
          ))}
        </div>
        <div className="mb-1.5 text-[9px] font-semibold uppercase tracking-wide" style={{ color: W.text4 }}>
          Legacy / rehearsal
        </div>
        <div className="mb-2 flex flex-col gap-1.5">
          {(
            [
              ['deposits', 'Deposit shell polygons (overlap licences)'] as const,
              ['infra', 'Logistics mesh (ports, grid, supply art)'] as const,
              ['plantSchematic', 'Pilot flow schematic (telemetry nodes)'] as const,
              ['neighbors', 'Adjacent tenement (district context)'] as const,
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="flex cursor-pointer items-center gap-2 text-[10px]" style={{ color: W.text3 }}>
              <input
                type="checkbox"
                checked={opsMapLayers[key]}
                onChange={(e) => setOpsMapLayers((L) => ({ ...L, [key]: e.target.checked }))}
                className="accent-violet-500"
              />
              {label}
            </label>
          ))}
        </div>
        <div className="mb-1 text-[9px] font-semibold uppercase tracking-wide" style={{ color: W.text4 }}>
          Hole type
        </div>
        <select
          className="w-full cursor-pointer rounded-md border border-[var(--w-glass-07)] bg-[var(--w-glass-04)] px-2 py-1.5 font-mono text-[10px] text-[var(--w-text2)]"
          value={opsMapLayers.holeTypeFilter}
          onChange={(e) =>
            setOpsMapLayers((L) => ({
              ...L,
              holeTypeFilter: e.target.value as DrillHoleType | 'all',
            }))
          }
        >
          <option value="all">All (DD + AC + Auger)</option>
          <option value="DD">Diamond (DD)</option>
          <option value="AC">Air core (AC)</option>
          <option value="AUGER">Auger</option>
        </select>
      </GlassCard>

      <GlassCard animate={false} className="shrink-0 px-3 py-2.5">
        <SectionLabel wideTracking>Spatial cross-check</SectionLabel>
        <p className="mt-1.5 text-[10px] leading-snug" style={{ color: W.text3 }}>
          {spatial.summary}
        </p>
        <p className="mt-1 font-mono text-[8px] leading-snug" style={{ color: W.text4 }}>
          {spatial.apaHeuristicNote}
        </p>
      </GlassCard>

      <div className="flex shrink-0 justify-end">
        <TimeRangeSelector value={range} onChange={setRange} accentColor={W.violet} />
      </div>

      <GlassCard animate={false} className="shrink-0 px-3.5 py-3">
        <span className="mb-2.5 block">
          <SectionLabel wideTracking>Proof That Scales</SectionLabel>
        </span>
        <div className="flex flex-col gap-3">
          <div>
            <div className="mb-1 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <GlowingIcon icon={Droplets} color="cyan" size={11}/>
                <span className="text-[10px] font-semibold" style={{ color: W.text3 }}>Water Recirculation</span>
              </div>
              <StatusChip label={recircOk ? 'OK' : 'LOW'} variant={recircOk ? 'green' : 'amber'} size="sm"/>
            </div>
            <MetricDisplay value={plant.flow_metrics.recirculation_pct} decimals={1} unit="%" size="md" color={recircOk ? 'cyan' : 'amber'}/>
            <SparkLine data={recircData} color={recircOk ? W.cyan : W.amber} thresholdLow={95} height={32} rangeLabel={`${recircData.length} pts · ${range}`}/>
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <GlowingIcon icon={FlaskConical} color="violet" size={11}/>
                <span className="text-[10px] font-semibold" style={{ color: W.text3 }}>Leach Circuit pH</span>
              </div>
              <StatusChip label={phColor === 'green' ? 'OPTIMAL' : phColor === 'amber' ? 'DRIFT' : 'BREACH'} variant={phColor} size="sm" dot/>
            </div>
            <MetricDisplay value={phVal} decimals={2} size="md" color={phColor}/>
            <SparkLine data={phData} color={phColor === 'green' ? W.violet : phColor === 'amber' ? W.amber : W.red} thresholdLow={4.0} thresholdHigh={5.0} height={32} rangeLabel={`${phData.length} pts · ${range}`}/>
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <GlowingIcon icon={Gauge} color="green" size={11}/>
                <span className="text-[10px] font-semibold" style={{ color: W.text3 }}>TREO Grade (XRF)</span>
              </div>
            </div>
            <MetricDisplay value={plant.output.treo_grade_pct} decimals={1} unit="%" size="md" color="text1"/>
            <SparkLine data={treoData} color={W.green} thresholdLow={89} height={32} rangeLabel={`${treoData.length} pts · ${range}`}/>
          </div>
          <div>
            <div className="mb-1 flex items-center gap-1.5">
              <GlowingIcon icon={Zap} color="violet" size={11}/>
              <span className="text-[10px] font-semibold" style={{ color: W.text3 }}>FJH Energy Savings</span>
            </div>
            <MetricDisplay value={plant.fjh_separation.energy_savings_pct} decimals={1} unit="%" size="md" color="text1"/>
            <p style={{ fontSize: 10, color: W.text4, margin: '2px 0 0', fontFamily: 'var(--font-mono)' }}>
              vs. traditional SX · {plant.fjh_separation.power_draw_kw.toFixed(1)} kW draw
            </p>
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

      {/* Pilot-to-Enterprise Chain */}
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
                    width: 28, height: 28, borderRadius: W.radius.sm, flexShrink: 0,
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

      {/* Hardware & Sensor Architecture */}
      <GlassCard animate={false} style={{ padding: '12px 14px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
          <GlowingIcon icon={Cpu} color="violet" size={11}/>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: W.text4 }}>
            Hardware & Sensor Architecture
          </span>
        </div>
        {HARDWARE_SENSORS.map((group) => (
          <div key={group.category} style={{ marginBottom: 8 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: W.text3, letterSpacing: '0.04em', textTransform: 'uppercase', display: 'block', marginBottom: 5 }}>
              {group.category}
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {group.items.map((item) => (
                <div key={item.name} style={{ padding: '5px 7px', borderRadius: W.radius.sm, background: W.glass02, border: W.hairlineBorder }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 6, marginBottom: 2 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: W.text1 }}>{item.name}</span>
                    <span style={{ fontSize: 10, color: W.violetSoft, fontFamily: 'var(--font-mono)', flexShrink: 0 }}>{item.frequency}</span>
                  </div>
                  <div style={{ fontSize: 10, color: W.text4, marginBottom: 1 }}>{item.location}</div>
                  <div style={{ fontSize: 10, color: W.text3 }}>Measures: {item.measures}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </GlassCard>
    </motion.div>
  )
})
