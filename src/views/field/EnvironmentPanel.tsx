import { memo, useCallback, useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { Activity, AlertTriangle, ChevronDown, CloudRain, CloudSun, FileCheck, Globe, Phone, RadioTower, Thermometer, Wind } from 'lucide-react'
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
import type { CptecForecast } from '../../services/weather/cptecClient'
import type { SeismicSnapshot, HistoricalWeatherSnapshot } from '../../services/dataService'
import { DataSourceBadge } from '../../components/ui/DataSourceBadge'
import { MonitoringNetworkCard } from './MonitoringNetworkCard'
import { PredictiveModelingCard } from './PredictiveModelingCard'
import { LIReadinessCard } from './LIReadinessCard'
import { AquiferCard } from './AquiferCard'
import { WaterQualityCard } from './WaterQualityCard'
import { SpringsCard } from './SpringsCard'
import { COMMUNITY_STRINGS, type CommunityLang } from '../../data/communityTranslations'
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

/* ─── 7-Day Weather Forecast ───────────────────────────────────────────── */

function WeatherForecastCard({ forecast }: { forecast: ReturnType<typeof useSiteForecast> }) {
  const days = forecast.series.time.slice(0, 7)

  function formatDate(iso: string): string {
    const d = new Date(iso + 'T12:00:00')
    return d.toLocaleDateString('en', { weekday: 'short', day: 'numeric' })
  }

  return (
    <GlassCard animate={false} glow="cyan" className={css.cardBody}>
      <div className={css.sectionHeadBetween} style={{ marginBottom: 6 }}>
        <div className={css.sectionHead}>
          <GlowingIcon icon={CloudRain} color="cyan" size={11} />
          <SectionLabel>7-Day Forecast</SectionLabel>
        </div>
        <span
          style={{
            fontSize: 8, fontFamily: 'var(--font-mono)', fontWeight: 600,
            padding: '1px 5px', borderRadius: W.radius.xs,
            background: forecast.source === 'openmeteo' ? `${W.cyan}15` : `${W.amber}15`,
            color: forecast.source === 'openmeteo' ? W.cyan : W.amber,
            letterSpacing: '0.04em', textTransform: 'uppercase',
          }}
        >
          {forecast.source === 'openmeteo' ? 'Open-Meteo Forecast' : 'Mock'}
        </span>
      </div>

      <div className={css.mono10} style={{ color: W.cyan, marginBottom: 6 }}>
        Total precip: {forecast.totalPrecipMm.toFixed(1)} mm over {days.length} days
      </div>

      <div className={css.flexCol} style={{ gap: 3 }}>
        {days.map((date, i) => {
          const tMax = forecast.series.temperature_2m_max[i] ?? 0
          const tMin = forecast.series.temperature_2m_min[i] ?? 0
          const precip = forecast.series.precipitation_sum[i] ?? 0
          const wind = forecast.series.wind_speed_10m_max[i] ?? 0
          return (
            <div
              key={date}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '3px 6px', borderRadius: W.radius.sm,
                background: W.glass03, border: W.hairlineBorder,
              }}
            >
              <span className={css.mono10} style={{ color: W.text3, minWidth: 60, flexShrink: 0 }}>
                {formatDate(date)}
              </span>
              <span className={css.mono10} style={{ color: W.text2, minWidth: 52, flexShrink: 0 }}>
                {tMin.toFixed(0)}–{tMax.toFixed(0)}°C
              </span>
              <span className={css.mono10} style={{ color: precip > 5 ? W.cyan : W.text4, minWidth: 40, flexShrink: 0 }}>
                {precip.toFixed(1)} mm
              </span>
              <Wind size={8} style={{ color: W.text4, flexShrink: 0 }} />
              <span className={css.mono10} style={{ color: W.text4 }}>
                {wind.toFixed(0)} km/h
              </span>
            </div>
          )
        })}
      </div>
    </GlassCard>
  )
}

/* ─── Bilingual Community Notice + Grievance Path ──────────────────────── */

function CommunityNoticeCard({ lang, onToggleLang }: { lang: CommunityLang; onToggleLang: () => void }) {
  const t = COMMUNITY_STRINGS[lang]

  return (
    <GlassCard animate={false} glow="amber" className={css.cardBodySm}>
      <div className={css.flexStart} style={{ gap: 6 }}>
        <AlertTriangle size={12} style={{ color: W.amber, marginTop: 1, flexShrink: 0 }} />
        <div className={css.flex1}>
          <div className={css.sectionHeadBetween} style={{ marginBottom: 4 }}>
            <div className={css.labelUpperBold} style={{ color: W.amber, letterSpacing: '0.06em' }}>
              {t.title}
            </div>
            <button
              type="button"
              onClick={onToggleLang}
              aria-label={`Switch language to ${t.toggle_label}`}
              className={css.langToggle}
              style={{
                color: W.violet, background: `${W.violet}14`,
                border: `1px solid ${W.violet}30`, borderRadius: W.radius.xs,
              }}
            >
              <Globe size={9} />
              {t.toggle_label}
            </button>
          </div>
          <p style={{ margin: '0 0 8px', fontSize: 10, color: W.text3, lineHeight: 1.5 }}>
            {t.disclaimer}{' '}
            <strong style={{ color: W.text2 }}>{t.disclaimer_bold}</strong>{' '}
            {t.disclaimer_rest}
          </p>

          {/* Grievance path */}
          <div className={css.grievanceBox} style={{ background: `${W.amber}08`, border: `1px solid ${W.amber}1A`, borderRadius: W.radius.sm, marginBottom: 8 }}>
            <div className={css.sectionHead} style={{ gap: 5, marginBottom: 5 }}>
              <Phone size={10} style={{ color: W.amber, flexShrink: 0 }} />
              <span className={css.labelUpperBold} style={{ color: W.amber }}>
                {t.grievance_title}
              </span>
            </div>
            <p style={{ margin: '0 0 5px', fontSize: 10, color: W.text3, lineHeight: 1.45 }}>
              {t.grievance_intro}
            </p>
            <ol className={css.grievanceList} style={{ color: W.text3 }}>
              {t.grievance_steps.map((step, i) => (
                <li key={i} className={css.grievanceStep}>{step}</li>
              ))}
            </ol>
          </div>

          {/* Contact directory */}
          <div className={css.labelUpperBold} style={{ color: W.text3, marginBottom: 5 }}>
            {t.contacts_title}
          </div>
          <div className={css.flexCol} style={{ gap: 4 }}>
            {t.contacts.map(c => (
              <div key={c.label} className={css.infoCell} style={{ background: W.glass03, borderRadius: W.radius.sm, border: W.hairlineBorder }}>
                <div style={{ fontSize: 10, color: W.text2, fontWeight: 600 }}>{c.label}</div>
                <div style={{ fontSize: 11, color: W.cyan, fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{c.value}</div>
                {c.note && <div style={{ fontSize: 9, color: W.text4, marginTop: 1 }}>{c.note}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </GlassCard>
  )
}

/* ─── CPTEC / INPE Municipal Forecast ──────────────────────────────────── */

function CptecForecastCard({ data }: { data: CptecForecast }) {
  return (
    <GlassCard animate={false} glow="cyan" className={css.cardBody}>
      <div className={css.sectionHeadBetween} style={{ marginBottom: 6 }}>
        <div className={css.sectionHead}>
          <GlowingIcon icon={CloudSun} color="cyan" size={11} />
          <SectionLabel>CPTEC Municipal Forecast</SectionLabel>
        </div>
        <span
          style={{
            fontSize: 8, fontFamily: 'var(--font-mono)', fontWeight: 600,
            padding: '1px 5px', borderRadius: W.radius.xs,
            background: `${W.green}15`, color: W.green,
            letterSpacing: '0.04em', textTransform: 'uppercase',
          }}
        >
          INPE/CPTEC
        </span>
      </div>

      <div className={css.mono10} style={{ color: W.text4, marginBottom: 6 }}>
        {data.city}, {data.state}
      </div>

      <div className={css.flexCol} style={{ gap: 3 }}>
        {data.days.map(d => (
          <div
            key={d.date}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '3px 6px', borderRadius: W.radius.sm,
              background: W.glass03, border: W.hairlineBorder,
            }}
          >
            <span className={css.mono10} style={{ color: W.text3, minWidth: 60, flexShrink: 0 }}>
              {formatCptecDate(d.date)}
            </span>
            <span className={css.mono10} style={{ color: W.text2, minWidth: 52, flexShrink: 0 }}>
              {d.tempMin}–{d.tempMax}°C
            </span>
            <span className={css.mono10} style={{ color: W.text4, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {d.conditionDesc}
            </span>
            {d.uvIndex > 0 && (
              <span className={css.mono10} style={{ color: d.uvIndex >= 8 ? W.amber : W.text4, flexShrink: 0 }}>
                UV {d.uvIndex}
              </span>
            )}
          </div>
        ))}
      </div>

      <p className={css.mono10} style={{ color: W.text4, margin: '5px 0 0' }}>
        Fonte: INPE/CPTEC via BrasilAPI · {data.city}
      </p>
    </GlassCard>
  )
}

function formatCptecDate(iso: string): string {
  const d = new Date(iso + 'T12:00:00')
  return d.toLocaleDateString('en', { weekday: 'short', day: 'numeric' })
}

/* ─── Seismic Activity Card ────────────────────────────────────────────── */

function SeismicActivityCard({ data }: { data: SeismicSnapshot }) {
  const events = data.events.slice(0, 5)
  const maxMag = events.length > 0 ? Math.max(...events.map(e => e.magnitude)) : 0

  return (
    <GlassCard animate={false} glow={maxMag >= 4 ? 'amber' : 'none'} className={css.cardBody}>
      <div className={css.sectionHeadBetween} style={{ marginBottom: 6 }}>
        <div className={css.sectionHead}>
          <GlowingIcon icon={Activity} color={maxMag >= 4 ? 'amber' : 'green'} size={11} />
          <SectionLabel>Seismic Activity</SectionLabel>
        </div>
        <span
          style={{
            fontSize: 8, fontFamily: 'var(--font-mono)', fontWeight: 600,
            padding: '1px 5px', borderRadius: W.radius.xs,
            background: data.source === 'mock' ? `${W.amber}15` : `${W.cyan}15`,
            color: data.source === 'mock' ? W.amber : W.cyan,
            letterSpacing: '0.04em', textTransform: 'uppercase',
          }}
        >
          {data.source === 'mock' ? 'Mock' : 'USGS'}
        </span>
      </div>

      {events.length === 0 ? (
        <p className={css.mono10} style={{ color: W.text3 }}>
          No seismic events near site in the last year.
        </p>
      ) : (
        <div className={css.flexCol} style={{ gap: 3 }}>
          {events.map(e => (
            <div key={e.id} className={css.flexStart} style={{ gap: 6, alignItems: 'center' }}>
              <span
                className={css.mono10}
                style={{
                  color: e.magnitude >= 4 ? W.amber : e.magnitude >= 3 ? W.text2 : W.text4,
                  fontWeight: e.magnitude >= 4 ? 700 : 500,
                  minWidth: 30,
                }}
              >
                M{e.magnitude.toFixed(1)}
              </span>
              <span className={css.mono10} style={{ color: W.text3, minWidth: 52 }}>
                {e.depth_km.toFixed(0)} km
              </span>
              <span className={css.mono10} style={{ color: W.text4, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {e.place}
              </span>
            </div>
          ))}
        </div>
      )}

      <p className={css.mono10} style={{ color: W.text4, margin: '5px 0 0' }}>
        300 km radius · {events.length} event{events.length !== 1 ? 's' : ''} in window
      </p>
    </GlassCard>
  )
}

/* ─── Climate Baseline Card ────────────────────────────────────────────── */

function ClimateBaselineCard({ data }: { data: HistoricalWeatherSnapshot }) {
  const { series, dayCount } = data
  const totalPrecip = series.precipitation_sum.reduce((a, b) => a + b, 0)
  const avgPrecip = dayCount > 0 ? totalPrecip / dayCount : 0
  const tMaxArr = series.temperature_2m_max ?? []
  const tMinArr = series.temperature_2m_min ?? []
  const avgTMax = tMaxArr.length > 0 ? tMaxArr.reduce((a, b) => a + b, 0) / tMaxArr.length : 0
  const avgTMin = tMinArr.length > 0 ? tMinArr.reduce((a, b) => a + b, 0) / tMinArr.length : 0

  return (
    <GlassCard animate={false} glow="cyan" className={css.cardBody}>
      <div className={css.sectionHeadBetween} style={{ marginBottom: 6 }}>
        <div className={css.sectionHead}>
          <GlowingIcon icon={Thermometer} color="cyan" size={11} />
          <SectionLabel>Climate Baseline</SectionLabel>
        </div>
        <span
          style={{
            fontSize: 8, fontFamily: 'var(--font-mono)', fontWeight: 600,
            padding: '1px 5px', borderRadius: W.radius.xs,
            background: `${W.cyan}15`, color: W.cyan,
            letterSpacing: '0.04em', textTransform: 'uppercase',
          }}
        >
          ERA5 Archive
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
        <div>
          <p className={css.mono10} style={{ color: W.text4, margin: 0 }}>Avg daily precip</p>
          <p className={css.mono10} style={{ color: W.cyan, margin: '2px 0 0', fontSize: 12, fontWeight: 700 }}>
            {avgPrecip.toFixed(1)} mm
          </p>
        </div>
        <div>
          <p className={css.mono10} style={{ color: W.text4, margin: 0 }}>Avg high</p>
          <p className={css.mono10} style={{ color: W.amber, margin: '2px 0 0', fontSize: 12, fontWeight: 700 }}>
            {avgTMax.toFixed(1)}°C
          </p>
        </div>
        <div>
          <p className={css.mono10} style={{ color: W.text4, margin: 0 }}>Avg low</p>
          <p className={css.mono10} style={{ color: W.text3, margin: '2px 0 0', fontSize: 12, fontWeight: 700 }}>
            {avgTMin.toFixed(1)}°C
          </p>
        </div>
      </div>

      <p className={css.mono10} style={{ color: W.text4, margin: '5px 0 0' }}>
        {dayCount}-day window · total precip {totalPrecip.toFixed(0)} mm
      </p>
    </GlassCard>
  )
}
