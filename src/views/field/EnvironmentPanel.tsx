import { memo, useCallback, useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { AlertTriangle, ChevronDown, Droplets, FileCheck, Globe, Layers, Phone, RadioTower } from 'lucide-react'
import { GlassCard } from '../../components/ui/GlassCard'
import { GlowingIcon } from '../../components/ui/GlowingIcon'
import { StatusChip } from '../../components/ui/StatusChip'
import { MetricDisplay } from '../../components/ui/MetricDisplay'
import { SparkLine } from '../../components/charts/SparkLine'
import { TimeRangeSelector } from '../../components/ui/TimeRangeSelector'
import { LicenseTimeline } from '../../components/ui/LicenseTimeline'
import { SectionLabel } from '../../components/ui/SectionLabel'
import { ProvenanceBadge } from '../../components/ui/ProvenanceBadge'
import { W } from '../../app/canvas/canvasTheme'
import { useTelemetry } from '../../services/DataServiceProvider'
import { useServiceQuery, useServiceQueryWithArg } from '../../hooks/useServiceQuery'
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton'
import { ErrorFallback } from '../../components/ui/ErrorFallback'
import type { TimeRangeKey } from '../../services/dataService'
import type { SiteWeatherSnapshot } from '../../hooks/useSiteWeather'
import { MonitoringNetworkCard } from './MonitoringNetworkCard'
import { COMMUNITY_STRINGS, type CommunityLang } from '../../data/communityTranslations'
import css from './EnvironmentPanel.module.css'

export const EnvironmentPanel = memo(function EnvironmentPanel({
  siteWeather,
}: {
  siteWeather: SiteWeatherSnapshot
}) {
  const { env } = useTelemetry()
  const { data: scenarios, isLoading: loadingScenarios, error: e1 } = useServiceQuery('hydrology-scenarios', s => s.getHydrologyScenarios())
  const { data: scaleUp, isLoading: loadingScaleUp, error: e2 } = useServiceQuery('scale-up', s => s.getScaleUpPathway())
  const { data: springCount, isLoading: loadingSpringCount, error: e3 } = useServiceQuery('spring-count', s => s.getSpringCount())
  const { data: prov, isLoading: loadingProv, error: e4 } = useServiceQuery('provenance', s => s.getProvenanceProfile())
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

      {/* Predictive Cumulative Modeling (6.0 Mtpa → 2030-2050) */}
      <GlassCard animate={false} glow="cyan" className={css.cardBody}>
        <div className={css.sectionHead} style={{ marginBottom: 4 }}>
          <GlowingIcon icon={Layers} color="cyan" size={11}/>
          <SectionLabel>Predictive Cumulative Modeling</SectionLabel>
        </div>
        <div className={css.mono10} style={{ color: W.cyan, marginBottom: 8 }}>
          6.0 Mtpa commercial scale-up · 2030–2050 drought forecast · {SPRING_COUNT} local springs
        </div>
        <div className={css.grid3} style={{ gap: 7, marginBottom: 8 }}>
          {PREDICTIVE_HYDROLOGY_SCENARIOS.map((scenario) => {
            const statusColor = scenario.status === 'stable' ? W.green : scenario.status === 'watch' ? W.amber : W.red
            return (
              <div key={scenario.horizon} className={css.scenarioCell} style={{ borderRadius: W.radius.sm, background: `${statusColor}0F`, border: `1px solid ${statusColor}25` }}>
                <div className={css.labelUpper} style={{ color: W.text4, letterSpacing: '0.04em' }}>Modeled · {scenario.horizon}</div>
                <div className={css.monoValueLg} style={{ color: statusColor }}>
                  {scenario.spring_preservation_pct}%
                </div>
                <div style={{ fontSize: 10, color: W.text4 }}>spring preservation</div>
                <div style={{ fontSize: 10, color: W.text4, marginTop: 2 }}>
                  DI: {scenario.drought_index.toFixed(2)} · {scenario.active_springs}/{SPRING_COUNT}
                </div>
              </div>
            )
          })}
        </div>
        <div className={css.grid2} style={{ marginBottom: 6, gap: 6 }}>
          <div className={css.infoCell} style={{ borderRadius: W.radius.sm, background: 'rgba(0,212,200,0.06)', border: '1px solid rgba(0,212,200,0.18)' }}>
            <div className={css.labelUpper} style={{ color: W.text4 }}>Data Ingestion</div>
            <div style={{ fontSize: 10, color: W.text2, marginTop: 2 }}>Target: piezometers + Open-Meteo/INMET class precip (demo: optional API + mock)</div>
          </div>
          <div className={css.infoCell} style={{ borderRadius: W.radius.sm, background: 'rgba(0,212,200,0.06)', border: '1px solid rgba(0,212,200,0.18)' }}>
            <div className={css.labelUpper} style={{ color: W.text4 }}>Output</div>
            <div style={{ fontSize: 10, color: W.text2, marginTop: 2 }}>Simulated hydrological digital twin (commercial-case model)</div>
          </div>
        </div>
        <p className={css.bodyText} style={{ color: W.text3, marginBottom: 6 }}>
          Modeled case: <span style={{ color: W.text1, fontWeight: 700 }}>{currentScenario.horizon}</span> with
          {' '}<span style={{ color: W.text2 }}>{currentScenario.active_springs} active springs</span>,
          {' '}<span style={{ color: W.text2 }}>{currentScenario.recirculation_pct.toFixed(1)}% recirculation</span>, and
          {' '}<span style={{ color: W.text2 }}>{currentScenario.sulfate_guardband_ppm} ppm guardband</span>.
          Dry-stacking + 95% recirculation mathematically proves zero suppression of {SPRING_COUNT} local springs.
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

      {/* LI hearing readiness */}
      <GlassCard animate={false} glow={currentScenarioStatus === 'action' ? 'red' : 'amber'} className={css.cardBody}>
        <div className={css.sectionHeadBetween} style={{ marginBottom: 7 }}>
          <div className={css.sectionHead}>
            <GlowingIcon icon={AlertTriangle} color="amber" size={11}/>
            <SectionLabel>LI Hearing Readiness</SectionLabel>
          </div>
          <StatusChip
            label={currentScenario.permitting_signal}
            variant={currentScenarioStatus === 'stable' ? 'green' : currentScenarioStatus === 'watch' ? 'amber' : 'red'}
            size="sm"
          />
        </div>
        <p className={css.bodyText} style={{ color: W.text3, marginBottom: 6 }}>
          {currentScenario.recommendation}
        </p>
        <div className={css.grid2} style={{ gap: 7 }}>
          <div className={css.statCell} style={{ borderRadius: W.radius.sm, background: W.glass03, border: W.hairlineBorder }}>
            <div className={css.labelUpper} style={{ color: W.text4 }}>Digital coverage</div>
            <div className={css.monoValue} style={{ color: W.text1 }}>
              {SCALE_UP_PATHWAY.current_digital_coverage_pct}%
            </div>
          </div>
          <div className={css.statCell} style={{ borderRadius: W.radius.sm, background: W.glass03, border: W.hairlineBorder }}>
            <div className={css.labelUpper} style={{ color: W.text4 }}>Springs monitored</div>
            <div className={css.monoValue} style={{ color: W.text1 }}>
              {SCALE_UP_PATHWAY.springs_monitored}
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Aquifer depths */}
      <GlassCard animate={false} className={css.cardBody}>
        <div className={css.sectionHead} style={{ marginBottom: 8 }}>
          <GlowingIcon icon={Droplets} color="cyan" size={11}/>
          <SectionLabel>Aquifer Depths</SectionLabel>
        </div>
        <div className={css.flexCol} style={{ gap: 5 }}>
          {env.aquifer.sensors.map(s => {
            const c = s.status === 'Normal' ? W.cyan : s.status === 'Warning' ? W.amber : W.red
            const delta = s.depth_meters - s.baseline_meters
            const pct = Math.min(100, (s.depth_meters / 35) * 100)
            return (
              <div key={s.sensor_id} className={css.sensorRow} style={{
                background: W.glass02, borderRadius: W.radius.sm, border: `1px solid ${c}18`,
              }}>
                <span className={css.sensorId} style={{ color: c }}>
                  {s.sensor_id}
                </span>
                <div className={css.sensorBar} style={{ background: W.glass05, borderRadius: W.radius.xs }}>
                  <motion.div animate={{ width: `${pct}%` }} transition={{ duration: 0.5 }}
                    style={{ height: '100%', background: c, borderRadius: W.radius.xs, boxShadow: `0 0 4px ${c}60` }}/>
                </div>
                <span className={css.sensorDepth} style={{ color: c }}>
                  {s.depth_meters.toFixed(1)} m
                </span>
                <span className={css.sensorDelta} style={{ color: delta > 0.5 ? W.amber : W.text4 }}>
                  {delta >= 0 ? '+' : ''}{delta.toFixed(1)}
                </span>
              </div>
            )
          })}
        </div>
      </GlassCard>

      {/* Water quality */}
      <GlassCard animate={false} glow={(!sulfateOk || !nitrateOk) ? 'amber' : 'none'} className={css.cardBody}>
        <div className={css.sectionHead} style={{ marginBottom: 8 }}>
          <GlowingIcon icon={Droplets} color={(!sulfateOk || !nitrateOk) ? 'amber' : 'green'} size={11}/>
            <SectionLabel>Water Quality</SectionLabel>
        </div>
        <div className={css.grid2} style={{ gap: 8 }}>
          <div>
            <div className={css.sectionHeadBetween} style={{ marginBottom: 3 }}>
              <span style={{ fontSize: 10, color: W.text3 }}>Sulfate</span>
              {!sulfateOk && <StatusChip label="⚠" variant="red" size="sm"/>}
            </div>
            <MetricDisplay value={env.water_quality.sulfate_ppm} unit="ppm" decimals={0} size="sm" color={sulfateOk ? 'green' : 'amber'}/>
            <SparkLine
              data={sulfateData}
              color={sulfateOk ? W.green : W.amber}
              thresholdHigh={250}
              height={28}
              unit=" ppm"
              rangeLabel={range}
              secondaryData={precipMmSeries}
              secondaryColor={W.cyan}
              secondaryUnit=" mm"
            />
            <p className={css.mono10} style={{ color: W.text4, margin: '2px 0 0' }}>limit: 250 ppm · dashed: demo precip (mm)</p>
          </div>
          <div>
            <div className={css.sectionHeadBetween} style={{ marginBottom: 3 }}>
              <span style={{ fontSize: 10, color: W.text3 }}>Nitrate</span>
              {!nitrateOk && <StatusChip label="⚠" variant="red" size="sm"/>}
            </div>
            <MetricDisplay value={env.water_quality.nitrate_ppm} unit="ppm" decimals={0} size="sm" color={nitrateOk ? 'green' : 'amber'}/>
            <SparkLine
              data={nitrateData}
              color={nitrateOk ? W.green : W.amber}
              thresholdHigh={50}
              height={28}
              unit=" ppm"
              rangeLabel={range}
              secondaryData={precipMmSeries}
              secondaryColor={W.cyan}
              secondaryUnit=" mm"
            />
            <p className={css.mono10} style={{ color: W.text4, margin: '2px 0 0' }}>limit: 50 ppm · dashed: demo precip (mm)</p>
          </div>
        </div>
      </GlassCard>

      {/* Radiation */}
      <GlassCard animate={false} glow={radOk ? 'none' : 'red'} className={css.cardBody}>
        <div className={css.sectionHeadBetween} style={{ marginBottom: 7 }}>
          <div className={css.sectionHead}>
            <GlowingIcon icon={RadioTower} color={radOk ? 'text2' : 'red'} size={11}/>
            <SectionLabel>UDC Radiation</SectionLabel>
          </div>
          <StatusChip label={env.legacy_infrastructure.udc_status} variant={radOk ? 'green' : 'red'} dot size="sm"/>
        </div>
        <MetricDisplay value={env.legacy_infrastructure.radiation_usv_h} unit="μSv/h" decimals={3} size="md" color={radOk ? 'green' : 'red'}/>
        <SparkLine data={radData} color={radOk ? W.green : W.red} thresholdHigh={0.18} height={28} unit=" μSv/h" rangeLabel={range}/>
        <p className={css.mono10} style={{ color: W.text4, margin: '3px 0 0' }}>normal background ~0.14 μSv/h</p>
      </GlassCard>

      {/* Springs */}
      <GlassCard animate={false} className={css.cardBody}>
        <div className={css.sectionHead} style={{ marginBottom: 8 }}>
          <GlowingIcon icon={Droplets} color="cyan" size={11}/>
          <SectionLabel>Water Springs</SectionLabel>
          <span style={{ fontSize: 10, color: W.text4 }}>{SPRING_COUNT} monitored</span>
        </div>
        <div className={css.springCounters} style={{ marginBottom: 8 }}>
          {[
            { count: counts.active,     label: 'Active',     color: W.green },
            { count: counts.reduced,    label: 'Reduced',    color: W.amber },
            { count: counts.suppressed, label: 'Suppressed', color: W.red   },
          ].map(({ count, label, color }) => (
            <div key={label} className={css.springCounter}>
              <span className={css.monoCounterLg} style={{ color }}>{count}</span>
              <span className={css.labelUpper} style={{ color: W.text4, letterSpacing: '0.04em' }}>{label}</span>
            </div>
          ))}
        </div>
        <div className={css.barTrack} style={{ height: 6, background: W.glass05, borderRadius: W.radius.xs, display: 'flex' }}>
          {SPRING_COUNT > 0 && <>
            <div style={{ width: `${(counts.active / SPRING_COUNT) * 100}%`, background: W.green, opacity: 0.75 }} />
            <div style={{ width: `${(counts.reduced / SPRING_COUNT) * 100}%`, background: W.amber, opacity: 0.85 }} />
            <div style={{ width: `${(counts.suppressed / SPRING_COUNT) * 100}%`, background: W.red, opacity: 0.9 }} />
          </>}
        </div>
        <div className={css.preservationRate} style={{ color: W.text4 }}>
          {((counts.active / SPRING_COUNT) * 100).toFixed(1)}% preservation rate · FBDS/IDE-SISEMA verified
        </div>
      </GlassCard>

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
