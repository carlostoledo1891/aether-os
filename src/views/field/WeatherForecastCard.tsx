import { CloudRain, Wind } from 'lucide-react'
import { GlassCard } from '../../components/ui/GlassCard'
import { GlowingIcon } from '../../components/ui/GlowingIcon'
import { SectionLabel } from '../../components/ui/SectionLabel'
import { W } from '../../app/canvas/canvasTheme'
import type { useSiteForecast } from '../../hooks/useSiteWeather'
import css from './EnvironmentPanel.module.css'

function formatDate(iso: string): string {
  const d = new Date(iso + 'T12:00:00')
  return d.toLocaleDateString('en', { weekday: 'short', day: 'numeric' })
}

export function WeatherForecastCard({ forecast }: { forecast: ReturnType<typeof useSiteForecast> }) {
  const days = forecast.series.time.slice(0, 7)

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
