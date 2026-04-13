import { Thermometer } from 'lucide-react'
import { GlassCard } from '../../components/ui/GlassCard'
import { GlowingIcon } from '../../components/ui/GlowingIcon'
import { SectionLabel } from '../../components/ui/SectionLabel'
import { W } from '../../app/canvas/canvasTheme'
import type { HistoricalWeatherSnapshot } from '../../services/dataService'
import css from './EnvironmentPanel.module.css'

export function ClimateBaselineCard({ data }: { data: HistoricalWeatherSnapshot }) {
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
