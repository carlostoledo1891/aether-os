import { memo, useEffect, useMemo } from 'react'
import { motion } from 'motion/react'
import { X, Droplets, CloudRain, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { W } from '../../app/canvas/canvasTheme'
import { useTelemetry } from '../../services/DataServiceProvider'
import { useSiteClimate, useSiteForecast } from '../../hooks/useSiteWeather'
import { THRESHOLDS, SPRING_COUNT } from '../../data/mockData'
import css from './HydroStation.module.css'

interface HydroStationProps {
  onClose: () => void
}

const VIOLET_LIGHT = '#C4B5FD'
const VIOLET_MID = W.violetSoft
const VIOLET_DEEP = '#7E22CE'

function precipBarViolet(mm: number, max: number): string {
  const ratio = max > 0 ? mm / max : 0
  if (ratio > 0.7) return W.violet
  if (ratio > 0.3) return VIOLET_MID
  return VIOLET_LIGHT
}

function wqColor(ok: boolean): string {
  return ok ? W.violet : W.red
}

export const HydroStation = memo(function HydroStation({ onClose }: HydroStationProps) {
  const { env } = useTelemetry()
  const climate = useSiteClimate(30)
  const forecast = useSiteForecast(7)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const springCounts = useMemo(() => {
    let active = 0, reduced = 0, suppressed = 0
    for (const s of env.springs) {
      if (s.status === 'Active') active++
      else if (s.status === 'Reduced') reduced++
      else suppressed++
    }
    return { active, reduced, suppressed, total: active + reduced + suppressed }
  }, [env.springs])

  const precipMax = useMemo(() =>
    climate.series.precipitation_sum.length > 0
      ? Math.max(...climate.series.precipitation_sum)
      : 1,
  [climate.series])

  const healthPct = springCounts.total > 0 ? {
    active: (springCounts.active / springCounts.total) * 100,
    reduced: (springCounts.reduced / springCounts.total) * 100,
    suppressed: (springCounts.suppressed / springCounts.total) * 100,
  } : { active: 100, reduced: 0, suppressed: 0 }

  const sulfateOk = env.water_quality.sulfate_ppm < THRESHOLDS.sulfate_warning_ppm
  const nitrateOk = env.water_quality.nitrate_ppm < THRESHOLDS.nitrate_warning_ppm
  const phOk = env.water_quality.ph_groundwater >= THRESHOLDS.ph_low && env.water_quality.ph_groundwater <= THRESHOLDS.ph_high
  const radOk = env.legacy_infrastructure.radiation_usv_h < THRESHOLDS.radiation_critical_usv_h

  return (
    <motion.div
      className={css.overlay}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      {/* ── Header ─────────────────────────────────────── */}
      <div className={css.header}>
        <div className={css.headerLeft}>
          <Droplets size={13} style={{ color: W.violet, flexShrink: 0 }} />
          <div className={css.headerTitle}>Hydro Station</div>
        </div>
        <div className={css.headerMeta}>
          <div className={css.statusBadge}>
            <span className={css.statusDot} style={{ background: springCounts.suppressed > 0 ? W.red : W.cyan }} />
            <span style={{ color: springCounts.suppressed > 0 ? W.red : W.cyan }}>
              {springCounts.suppressed > 0 ? 'ALERT' : 'NOMINAL'}
            </span>
          </div>
          <button className={css.closeBtn} onClick={onClose} aria-label="Close hydro station">
            <X size={12} />
          </button>
        </div>
      </div>

      {/* ── Body ───────────────────────────────────────── */}
      <div className={css.body}>

        {/* Spring Health */}
        <div>
          <div className={css.sectionLabel}>Spring Health</div>
          <div className={css.grid3}>
            <div className={css.cell}>
              <div className={css.cellLabel}>Active</div>
              <div className={css.cellValue} style={{ color: W.cyan }}>
                {springCounts.active}<span className={css.cellUnit}>/ {springCounts.total}</span>
              </div>
            </div>
            <div className={css.cell}>
              <div className={css.cellLabel}>Reduced</div>
              <div className={css.cellValue} style={{ color: springCounts.reduced > 0 ? W.amber : W.cyan }}>
                {springCounts.reduced}
              </div>
            </div>
            <div className={css.cell}>
              <div className={css.cellLabel}>Suppressed</div>
              <div className={css.cellValue} style={{ color: springCounts.suppressed > 0 ? W.red : W.cyan }}>
                {springCounts.suppressed}
              </div>
            </div>
          </div>
          <div className={css.healthBar} style={{ marginTop: 6 }}>
            {healthPct.active > 0 && <div style={{ width: `${healthPct.active}%`, background: W.cyan }} />}
            {healthPct.reduced > 0 && <div style={{ width: `${healthPct.reduced}%`, background: W.amber }} />}
            {healthPct.suppressed > 0 && <div style={{ width: `${healthPct.suppressed}%`, background: W.red }} />}
          </div>
          <div className={css.healthLegend}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: W.text4 }}>
              {SPRING_COUNT} springs · {env.aquifer.sensors.length} piezos
            </span>
          </div>
        </div>

        {/* Water Quality */}
        <div>
          <div className={css.sectionLabel}>Water Quality</div>
          <div className={css.grid4}>
            <div className={css.cell}>
              <div className={css.cellLabel}>SO₄</div>
              <div className={css.cellValue} style={{ color: wqColor(sulfateOk), fontSize: 12 }}>
                {env.water_quality.sulfate_ppm.toFixed(0)}<span className={css.cellUnit}>ppm</span>
              </div>
            </div>
            <div className={css.cell}>
              <div className={css.cellLabel}>NO₃</div>
              <div className={css.cellValue} style={{ color: wqColor(nitrateOk), fontSize: 12 }}>
                {env.water_quality.nitrate_ppm.toFixed(0)}<span className={css.cellUnit}>ppm</span>
              </div>
            </div>
            <div className={css.cell}>
              <div className={css.cellLabel}>pH</div>
              <div className={css.cellValue} style={{ color: wqColor(phOk), fontSize: 12 }}>
                {env.water_quality.ph_groundwater.toFixed(1)}
              </div>
            </div>
            <div className={css.cell}>
              <div className={css.cellLabel}>Rad</div>
              <div className={css.cellValue} style={{ color: wqColor(radOk), fontSize: 11 }}>
                {env.legacy_infrastructure.radiation_usv_h.toFixed(3)}<span className={css.cellUnit}>μSv</span>
              </div>
            </div>
          </div>
        </div>

        {/* Climate KPIs */}
        <div>
          <div className={css.sectionLabel}>Climate (30d)</div>
          <div className={css.grid4}>
            {([
              { label: 'Temp', value: `${climate.tempMinAvg.toFixed(0)}–${climate.tempMaxAvg.toFixed(0)}`, unit: '°C', color: VIOLET_MID },
              { label: 'Humidity', value: climate.humidityAvg.toFixed(0), unit: '%', color: VIOLET_LIGHT },
              { label: 'Wtr Bal', value: `${climate.waterBalance >= 0 ? '+' : ''}${climate.waterBalance.toFixed(0)}`, unit: 'mm', color: climate.waterBalance >= 0 ? W.violet : W.red },
              { label: 'Soil', value: (climate.soilMoistureAvg * 100).toFixed(1), unit: '%', color: VIOLET_MID },
            ] as const).map(kpi => (
              <div key={kpi.label} className={css.cell}>
                <div className={css.cellLabel}>{kpi.label}</div>
                <div className={css.cellValue} style={{ color: kpi.color, fontSize: 12 }}>
                  {kpi.value}<span className={css.cellUnit}>{kpi.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Precipitation Chart */}
        <div>
          <div className={css.precipHeader}>
            <div className={css.sectionLabel} style={{ marginBottom: 0 }}>Precipitation</div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'baseline' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, color: W.violet }}>
                {climate.windowPrecipMm.toFixed(1)}<span style={{ fontSize: 8, color: W.text4 }}> mm</span>
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: climate.anomalyMm < 0 ? W.red : VIOLET_MID }}>
                Δ {climate.anomalyMm >= 0 ? '+' : ''}{climate.anomalyMm.toFixed(1)}
              </span>
              <span style={{ fontSize: 7, padding: '1px 4px', borderRadius: 3, background: W.glass06, color: W.text4, fontFamily: 'var(--font-mono)' }}>
                {climate.source === 'openmeteo' ? 'Open-Meteo' : 'mock'}
              </span>
            </div>
          </div>
          <div className={css.precipBars}>
            {climate.series.precipitation_sum.map((mm, i) => (
              <div
                key={i}
                className={css.precipBar}
                style={{
                  height: `${precipMax > 0 ? (mm / precipMax) * 100 : 0}%`,
                  background: precipBarViolet(mm, precipMax),
                }}
                title={`${climate.series.time[i]}: ${mm.toFixed(1)} mm`}
              />
            ))}
          </div>
          <div className={css.precipAxis}>
            <span>{climate.series.time[0] ?? ''}</span>
            <span>{climate.series.time[climate.series.time.length - 1] ?? ''}</span>
          </div>
        </div>

        {/* Water Balance */}
        <div>
          <div className={css.sectionLabel}>Water Balance</div>
          <div className={css.cell} style={{ padding: '7px 9px' }}>
            <div className={css.wbRow}>
              <span className={css.wbLabel} style={{ color: VIOLET_MID }}>Precip</span>
              <span className={css.wbValue} style={{ color: VIOLET_MID }}>{climate.windowPrecipMm.toFixed(0)} mm</span>
            </div>
            <div className={css.wbBar}>
              <div style={{ width: `${Math.min((climate.windowPrecipMm / Math.max(climate.windowPrecipMm, climate.et0Total)) * 100, 100)}%`, height: '100%', background: VIOLET_MID, borderRadius: 1.5 }} />
            </div>
            <div className={css.wbRow}>
              <span className={css.wbLabel} style={{ color: VIOLET_LIGHT }}>ET₀</span>
              <span className={css.wbValue} style={{ color: VIOLET_LIGHT }}>{climate.et0Total.toFixed(0)} mm</span>
            </div>
            <div className={css.wbBar}>
              <div style={{ width: `${Math.min((climate.et0Total / Math.max(climate.windowPrecipMm, climate.et0Total)) * 100, 100)}%`, height: '100%', background: VIOLET_LIGHT, borderRadius: 1.5 }} />
            </div>
            <div className={css.wbNet}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700, color: climate.waterBalance >= 0 ? W.violet : W.red }}>
                {climate.waterBalance >= 0 ? '+' : ''}{climate.waterBalance.toFixed(0)}
              </span>
              <span style={{ fontSize: 9, color: W.text4, marginLeft: 3 }}>mm net</span>
            </div>
          </div>
        </div>

        {/* Daily Temperature */}
        <div>
          <div className={css.sectionLabel}>Daily Temperature</div>
          <div className={css.tempBars}>
            {climate.series.temperature_2m_max.map((tMax, i) => {
              const tMin = climate.series.temperature_2m_min[i] ?? 0
              const chartMin = Math.max(0, Math.min(...climate.series.temperature_2m_min) - 2)
              const chartMax = Math.max(...climate.series.temperature_2m_max) + 2
              const range = chartMax - chartMin || 1
              const bottom = ((tMin - chartMin) / range) * 100
              const height = ((tMax - tMin) / range) * 100
              return (
                <div key={i} className={css.tempCol}>
                  <div style={{
                    position: 'absolute', bottom: `${bottom}%`, left: '10%', right: '10%',
                    height: `${Math.max(height, 2)}%`,
                    background: `linear-gradient(to top, ${VIOLET_DEEP}, ${VIOLET_MID})`,
                    borderRadius: 2, opacity: 0.75,
                  }} title={`${climate.series.time[i]}: ${tMin.toFixed(1)}–${tMax.toFixed(1)} °C`} />
                </div>
              )
            })}
          </div>
          <div className={css.precipAxis}>
            <span>{climate.tempMinAvg.toFixed(1)}°C min</span>
            <span>{climate.tempMaxAvg.toFixed(1)}°C max</span>
          </div>
        </div>

        {/* Forecast */}
        <div style={{ borderTop: `1px dashed ${W.glass12}`, paddingTop: 8, opacity: 0.85 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 5 }}>
            <CloudRain size={9} style={{ color: W.cyan }} />
            <div className={css.sectionLabel} style={{ marginBottom: 0 }}>Forecast (7d)</div>
            <span style={{
              fontSize: 7, padding: '1px 4px', borderRadius: 3,
              background: W.glass06, color: W.text4, fontFamily: 'var(--font-mono)',
              marginLeft: 'auto',
            }}>
              {forecast.source === 'openmeteo' ? 'Open-Meteo' : 'mock'}
            </span>
          </div>
          <div className={css.grid2}>
            <div className={css.cell}>
              <div className={css.cellLabel}>Precip Total</div>
              <div className={css.cellValue} style={{ color: W.cyan, fontSize: 12 }}>
                {forecast.totalPrecipMm.toFixed(1)}<span className={css.cellUnit}>mm</span>
              </div>
            </div>
            <div className={css.cell}>
              <div className={css.cellLabel}>Temp Trend</div>
              <div className={css.cellValue} style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 3 }}>
                {(() => {
                  const temps = forecast.series.temperature_2m_max.slice(0, 7)
                  if (temps.length < 2) return <><Minus size={10} style={{ color: W.text4 }} /><span style={{ color: W.text4 }}>Stable</span></>
                  const first = (temps[0]! + temps[1]!) / 2
                  const last = (temps[temps.length - 1]! + temps[temps.length - 2]!) / 2
                  const delta = last - first
                  if (delta > 1.5) return <><TrendingUp size={10} style={{ color: W.amber }} /><span style={{ color: W.amber }}>Rising</span></>
                  if (delta < -1.5) return <><TrendingDown size={10} style={{ color: W.cyan }} /><span style={{ color: W.cyan }}>Falling</span></>
                  return <><Minus size={10} style={{ color: W.text4 }} /><span style={{ color: W.text4 }}>Stable</span></>
                })()}
              </div>
            </div>
          </div>
        </div>

        {/* Piezometers */}
        <div>
          <div className={css.sectionLabel}>Piezometers</div>
          {env.aquifer.sensors.map(sensor => {
            const sColor = sensor.status === 'Normal' ? W.violet : sensor.status === 'Warning' ? W.amber : W.red
            return (
              <div key={sensor.sensor_id} className={css.piezoRow}>
                <span className={css.piezoDot} style={{ background: sColor }} />
                <span className={css.piezoLabel}>{sensor.label}</span>
                <span className={css.piezoValue} style={{ color: sColor }}>
                  {sensor.depth_meters.toFixed(1)}<span className={css.cellUnit}>m</span>
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Bottom bar ─────────────────────────────────── */}
      <div className={css.bottomBar}>
        <span>Open-Meteo · FBDS/CAR · LAPOC</span>
        <span>21.815°S, 46.585°W</span>
      </div>
    </motion.div>
  )
})
