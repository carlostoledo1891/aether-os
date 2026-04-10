import { memo, useMemo } from 'react'
import { RadioTower } from 'lucide-react'
import { GlassCard } from '../../components/ui/GlassCard'
import { GlowingIcon } from '../../components/ui/GlowingIcon'
import { SectionLabel } from '../../components/ui/SectionLabel'
import { W } from '../../app/canvas/canvasTheme'
import { siteWeatherMetricsForPastDays, type SiteWeatherSnapshot } from '../../hooks/useSiteWeather'
import type { HydrologyScenario } from '../../services/dataService'

export interface MonitoringNetworkCardProps {
  tierMix: { direct: number; sentinel: number; inferred: number }
  springCount: number
  precipDays: number
  siteWeather: SiteWeatherSnapshot
  currentScenario: HydrologyScenario
}

const cellStyle = {
  background: W.glass04,
  border: W.chromeBorder,
  borderRadius: W.radius.sm,
  padding: '5px 7px',
} as const

export const MonitoringNetworkCard = memo(function MonitoringNetworkCard({
  tierMix,
  springCount,
  precipDays,
  siteWeather,
  currentScenario,
}: MonitoringNetworkCardProps) {
  const precipWindow = useMemo(
    () => siteWeatherMetricsForPastDays(siteWeather, precipDays),
    [siteWeather, precipDays],
  )

  return (
    <GlassCard animate={false} glow="cyan" className="shrink-0 px-2 py-2">
      <div className="mb-1.5 flex items-center gap-1.5">
        <GlowingIcon icon={RadioTower} color="cyan" size={10} />
        <SectionLabel>Monitoring</SectionLabel>
      </div>

      <div className="grid grid-cols-4 gap-1">
        <div style={cellStyle}>
          <div className="font-mono text-[11px] font-bold" style={{ color: W.green }}>{tierMix.direct}</div>
          <div className="text-[8px] uppercase" style={{ color: W.text4 }}>Direct</div>
        </div>
        <div style={cellStyle}>
          <div className="font-mono text-[11px] font-bold" style={{ color: W.cyan }}>{tierMix.sentinel}</div>
          <div className="text-[8px] uppercase" style={{ color: W.text4 }}>Sentinel</div>
        </div>
        <div style={cellStyle}>
          <div className="font-mono text-[11px] font-bold" style={{ color: W.text3 }}>{tierMix.inferred}</div>
          <div className="text-[8px] uppercase" style={{ color: W.text4 }}>Inferred</div>
        </div>
        <div style={cellStyle}>
          <div className="font-mono text-[11px] font-bold" style={{ color: W.text2 }}>{springCount}</div>
          <div className="text-[8px] uppercase" style={{ color: W.text4 }}>Springs</div>
        </div>
      </div>

      <div className="mt-1 grid grid-cols-2 gap-1">
        <div style={{ ...cellStyle, background: W.glass03 }}>
          <div className="text-[8px] uppercase" style={{ color: W.text4 }}>Precip ({precipDays}d)</div>
          <div className="font-mono text-[11px] font-bold" style={{ color: W.cyan }}>
            {siteWeather.loading ? '…' : `${precipWindow.windowPrecipMm.toFixed(1)} mm`}
          </div>
        </div>
        <div style={{ ...cellStyle, background: W.glass03 }}>
          <div className="text-[8px] uppercase" style={{ color: W.text4 }}>{currentScenario.horizon}</div>
          <div className="font-mono text-[11px] font-bold" style={{ color: precipWindow.anomalyMm >= 0 ? W.green : W.amber }}>
            DI {currentScenario.drought_index.toFixed(2)}
          </div>
        </div>
      </div>
    </GlassCard>
  )
})
