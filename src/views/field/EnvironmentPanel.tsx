import { memo, useCallback, useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { AlertTriangle, ChevronDown, FileCheck, RadioTower } from 'lucide-react'
import { GlassCard } from '../../components/ui/GlassCard'
import { GlowingIcon } from '../../components/ui/GlowingIcon'
import { StatusChip } from '../../components/ui/StatusChip'
import { MetricDisplay } from '../../components/ui/MetricDisplay'
import { SparkLine } from '../../components/charts/SparkLine'
import { TimeRangeSelector } from '../../components/ui/TimeRangeSelector'
import { LicenseTimeline } from './LicenseTimeline'
import { SectionLabel } from '../../components/ui/SectionLabel'
import { ProvenanceBadge } from '../../components/ui/ProvenanceBadge'
import { W } from '../../app/canvas/canvasTheme'
import { useTelemetry } from '../../services/DataServiceProvider'
import { useServiceQuery, useServiceQueryWithArg } from '../../hooks/useServiceQuery'
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton'
import { ErrorFallback } from '../../components/ui/ErrorFallback'
import type { TimeRangeKey } from '../../services/dataService'
import type { SiteWeatherSnapshot } from '../../hooks/useSiteWeather'
import { useSiteForecast, useCptecForecast } from '../../hooks/useSiteWeather'
import { DataSourceBadge } from '../../components/ui/DataSourceBadge'
import { MonitoringNetworkCard } from './MonitoringNetworkCard'
import { PredictiveModelingCard } from './PredictiveModelingCard'
import { LIReadinessCard } from './LIReadinessCard'
import { AquiferCard } from './AquiferCard'
import { WaterQualityCard } from './WaterQualityCard'
import { SpringsCard } from './SpringsCard'
import { type CommunityLang } from '../../data/communityTranslations'
import { WeatherForecastCard } from './WeatherForecastCard'
import { CptecForecastCard } from './CptecForecastCard'
import { CommunityNoticeCard } from './CommunityNoticeCard'
import { SeismicActivityCard } from './SeismicActivityCard'
import { ClimateBaselineCard } from './ClimateBaselineCard'
import css from './EnvironmentPanel.module.css'

export const EnvironmentPanel = memo(function EnvironmentPanel({
  siteWeather,
}: {
  siteWeather: SiteWeatherSnapshot
}) {
  const { env } = useTelemetry()
  const forecast = useSiteForecast(7)
  const cptec = useCptecForecast()
  const { data: scenarios, isLoading: loadingScenarios, error: e1 } = useServiceQuery('hydrology-scenarios', s => s.getHydrologyScenarios())
  const { data: scaleUp, isLoading: loadingScaleUp, error: e2 } = useServiceQuery('scale-up', s => s.getScaleUpPathway())
  const { data: springCount, isLoading: loadingSpringCount, error: e3 } = useServiceQuery('spring-count', s => s.getSpringCount())
  const { data: prov, isLoading: loadingProv, error: e4 } = useServiceQuery('provenance', s => s.getProvenanceProfile())
  const { data: seismicData } = useServiceQuery('seismic', s => s.getSeismicRecent())
  const { data: historicalWeather } = useServiceQuery('historical-weather', s => s.getHistoricalWeather())
  const [communityLang, setCommunityLang] = useState<CommunityLang>(() =>
    (typeof localStorage !== 'undefined' && localStorage.getItem('aether-community-lang') as CommunityLang) || 'en',
  )
  const toggleLang = useCallback(() => {
    setCommunityLang(prev => {
      const next = prev === 'en' ? 'pt' : 'en'
      try { localStorage.setItem('aether-community-lang', next) } catch { /* SSR safe */ }
      return next
    })
  }, [])
  const [provExpanded, setProvExpanded] = useState(false)
  const [range, setRange] = useState<TimeRangeKey>('24h')
  const { data: history } = useServiceQueryWithArg('history', range, (s, r) => s.getHistory(r))
  const envHistory = history?.envHistory ?? []
  const precipMmSeries = history?.precipMmSeries ?? []
  const precipDays = range === '30d' ? 30 : range === '7d' ? 7 : 7
  const radOk       = env.legacy_infrastructure.radiation_usv_h < 0.18
  const sulfateData = envHistory.map(h => h.water_quality.sulfate_ppm)
  const nitrateData = envHistory.map(h => h.water_quality.nitrate_ppm)
  const radData     = envHistory.map(h => h.legacy_infrastructure.radiation_usv_h)

  const counts = {
    active:     env.springs.filter(s => s.status === 'Active').length,
    reduced:    env.springs.filter(s => s.status === 'Reduced').length,
    suppressed: env.springs.filter(s => s.status === 'Suppressed').length,
  }

  const tierMix = useMemo(() => {
    let direct = 0
    let sentinel = 0
    let inferred = 0
    env.springs.forEach((s) => {
      if (s.monitoring_tier === 'direct') direct += 1
      else if (s.monitoring_tier === 'sentinel_proxy') sentinel += 1
      else inferred += 1
    })
    return { direct, sentinel, inferred }
  }, [env.springs])

  const firstError = e1 || e2 || e3 || e4
  if (firstError) return <ErrorFallback error={firstError} label="Environment data" />
  if (loadingScenarios || loadingScaleUp || loadingSpringCount || loadingProv || !prov) {
    return <LoadingSkeleton variant="card" label="Loading environment…" />
  }

  const PREDICTIVE_HYDROLOGY_SCENARIOS = scenarios ?? []
  const SCALE_UP_PATHWAY = scaleUp ?? { current_digital_coverage_pct: 0, springs_monitored: 0 }
  const SPRING_COUNT = springCount ?? 0
  const currentScenario = PREDICTIVE_HYDROLOGY_SCENARIOS[1] ?? PREDICTIVE_HYDROLOGY_SCENARIOS[0]
  const currentScenarioStatus = (currentScenario?.status ?? 'stable') as 'stable' | 'watch' | 'action'

  return (
    <motion.div
      key="env-panel"
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className={css.root}
    >
      <div>
        <button
          type="button"
          onClick={() => setProvExpanded(p => !p)}
          aria-label="Toggle data provenance"
          aria-expanded={provExpanded}
          className="inline-flex items-center gap-1.5 font-mono text-[8px] font-semibold uppercase tracking-wide"
          style={{ color: W.text4, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: W.violet }} />
          Data provenance
          <ChevronDown size={9} style={{ transform: provExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
        </button>
        {provExpanded && (
          <div className="flex flex-wrap items-center gap-1.5 mt-1">
            <ProvenanceBadge kind={prov.sections.hydro_spring_geometry.kind} title={prov.sections.hydro_spring_geometry.hint} />
            <ProvenanceBadge kind={prov.sections.hydro_spring_status.kind} title={prov.sections.hydro_spring_status.hint} />
            <ProvenanceBadge kind={prov.sections.hydro_piezo_telemetry.kind} title={prov.sections.hydro_piezo_telemetry.hint} />
            <ProvenanceBadge kind={prov.sections.precip_field.kind} title={prov.sections.precip_field.hint} />
            {prov.sections.map_geometry ? (
              <ProvenanceBadge kind={prov.sections.map_geometry.kind} title={prov.sections.map_geometry.hint} />
            ) : null}
          </div>
        )}
        <div className="flex items-center gap-1.5 mt-1">
          <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: W.amber }} />
          <span className="font-mono text-[8px] font-semibold uppercase tracking-wide" style={{ color: W.text4 }}>
            LAPOC field instruments · integration pending
          </span>
        </div>
      </div>

      <CommunityNoticeCard lang={communityLang} onToggleLang={toggleLang} />

      {/* Time range selector */}
      <div className={css.timeRangeRow}>
        <TimeRangeSelector value={range} onChange={setRange} accentColor={W.cyan} />
      </div>

      <MonitoringNetworkCard
        tierMix={tierMix}
        springCount={SPRING_COUNT}
        precipDays={precipDays}
        siteWeather={siteWeather}
        currentScenario={currentScenario}
      />

      <WeatherForecastCard forecast={forecast} />

      {cptec.data && <CptecForecastCard data={cptec.data} />}

      <PredictiveModelingCard
        scenarios={PREDICTIVE_HYDROLOGY_SCENARIOS}
        currentScenario={currentScenario}
        springCount={SPRING_COUNT}
      />

      <LIReadinessCard
        permittingSignal={currentScenario.permitting_signal}
        recommendation={currentScenario.recommendation}
        status={currentScenarioStatus}
        digitalCoveragePct={SCALE_UP_PATHWAY.current_digital_coverage_pct}
        springsMonitored={SCALE_UP_PATHWAY.springs_monitored}
      />

      <AquiferCard sensors={env.aquifer.sensors} />

      <WaterQualityCard
        sulfatePpm={env.water_quality.sulfate_ppm}
        nitratePpm={env.water_quality.nitrate_ppm}
        sulfateData={sulfateData}
        nitrateData={nitrateData}
        precipMmSeries={precipMmSeries}
        range={range}
      />

      {/* Radiation */}
      <GlassCard animate={false} glow={radOk ? 'none' : 'red'} className={css.cardBody}>
        <div className={css.sectionHeadBetween} style={{ marginBottom: 7 }}>
          <div className={css.sectionHead}>
            <GlowingIcon icon={RadioTower} color={radOk ? 'text2' : 'red'} size={11}/>
            <SectionLabel>UDC Radiation</SectionLabel>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <DataSourceBadge kind="simulated" />
            <StatusChip label={env.legacy_infrastructure.udc_status} variant={radOk ? 'green' : 'red'} dot size="sm"/>
          </div>
        </div>
        <MetricDisplay value={env.legacy_infrastructure.radiation_usv_h} unit="μSv/h" decimals={3} size="md" color={radOk ? 'green' : 'red'}/>
        <SparkLine data={radData} color={radOk ? W.green : W.red} thresholdHigh={0.18} height={28} unit=" μSv/h" rangeLabel={range}/>
        <p className={css.mono10} style={{ color: W.text4, margin: '3px 0 0' }}>normal background ~0.14 μSv/h</p>
      </GlassCard>

      <SpringsCard springCount={SPRING_COUNT} counts={counts} />

      {seismicData && <SeismicActivityCard data={seismicData} />}
      {historicalWeather && <ClimateBaselineCard data={historicalWeather} />}

      {/* License timeline */}
      <GlassCard animate={false} className={css.cardBody}>
        <div className={css.sectionHead} style={{ marginBottom: 10 }}>
          <GlowingIcon icon={FileCheck} color="green" size={11}/>
          <SectionLabel>License Timeline</SectionLabel>
        </div>
        <LicenseTimeline />
        <div style={{ marginTop: 9, padding: '5px 8px', background: `${W.amber}0F`, border: `1px solid ${W.amber}2E`, borderRadius: W.radius.sm }}>
          <div className={css.flexStart} style={{ gap: 5 }}>
            <AlertTriangle size={9} style={{ color: W.amber, marginTop: 1, flexShrink: 0 }}/>
            <p className={css.bodyText} style={{ color: W.text3 }}>
              MPF cumulative EIA demand remains the core LI bottleneck. Telemetry on this tab is illustrative until instrumented feeds are wired — use Executive → Agencies for the administrative record map and exports.
            </p>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  )
})

