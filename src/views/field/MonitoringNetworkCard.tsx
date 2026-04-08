import { memo, useMemo } from 'react'
import { RadioTower } from 'lucide-react'
import { GlassCard } from '../../components/ui/GlassCard'
import { GlowingIcon } from '../../components/ui/GlowingIcon'
import { SectionLabel } from '../../components/ui/SectionLabel'
import { ProvenanceBadge } from '../../components/ui/ProvenanceBadge'
import { W } from '../../app/canvas/canvasTheme'
import { useServiceQuery } from '../../hooks/useServiceQuery'
import { siteWeatherMetricsForPastDays, type SiteWeatherSnapshot } from '../../hooks/useSiteWeather'
import type { HydrologyScenario } from '../../services/dataService'

export interface MonitoringNetworkCardProps {
  tierMix: { direct: number; sentinel: number; inferred: number }
  springCount: number
  precipDays: number
  siteWeather: SiteWeatherSnapshot
  currentScenario: HydrologyScenario
}

export const MonitoringNetworkCard = memo(function MonitoringNetworkCard({
  tierMix,
  springCount,
  precipDays,
  siteWeather,
  currentScenario,
}: MonitoringNetworkCardProps) {
  const { data: prov } = useServiceQuery('provenance', s => s.getProvenanceProfile())
  const precipWindow = useMemo(
    () => siteWeatherMetricsForPastDays(siteWeather, precipDays),
    [siteWeather, precipDays],
  )

  if (!prov) return null

  return (
    <GlassCard animate={false} glow="cyan" className="shrink-0 px-[11px] py-[11px]">
      <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
        <GlowingIcon icon={RadioTower} color="cyan" size={11} />
        <SectionLabel>Monitoring network</SectionLabel>
        <ProvenanceBadge kind={prov.sections.hydro_piezo_telemetry.kind} title={prov.sections.hydro_piezo_telemetry.hint} />
        <ProvenanceBadge kind={prov.sections.precip_field.kind} title={prov.sections.precip_field.hint} />
      </div>
      <div
        className="mb-2 flex flex-wrap gap-2 font-mono text-[10px]"
        style={{ color: W.text2 }}
      >
        <span>
          <span style={{ color: W.green }}>{tierMix.direct}</span> direct
        </span>
        <span>
          <span style={{ color: W.cyan }}>{tierMix.sentinel}</span> sentinel
        </span>
        <span>
          <span style={{ color: W.text4 }}>{tierMix.inferred}</span> inferred
        </span>
        <span style={{ color: W.text4 }}>· {springCount} GeoJSON ids</span>
      </div>
      <p className="mb-2 text-[10px] leading-snug" style={{ color: W.text3 }}>
        Fusion narrative: vibrating-wire piezos + field visits on a sentinel subset + regional model fill for bulk springs.
        Map tiles stay MapTiler/Carto; weather is optional Open-Meteo at the site point (see .env.example).
      </p>
      <div className="grid grid-cols-2 gap-1.5">
        <div
          className="rounded-md px-2 py-1.5"
          style={{
            background: 'rgba(0,212,200,0.06)',
            border: '1px solid rgba(0,212,200,0.15)',
          }}
        >
          <div className="text-[9px] uppercase" style={{ color: W.text4 }}>
            Precip window ({precipDays}d)
          </div>
          <div className="font-mono text-xs font-bold" style={{ color: W.cyan }}>
            {siteWeather.loading ? '…' : `${precipWindow.windowPrecipMm.toFixed(1)} mm`}
          </div>
          <div className="text-[9px]" style={{ color: W.text4 }}>
            {siteWeather.source === 'openmeteo' ? 'Open-Meteo' : 'mock'}
            {siteWeather.error ? ` · ${siteWeather.error}` : ''}
          </div>
        </div>
        <div
          className="rounded-md px-2 py-1.5"
          style={{
            background: W.glass03,
            border: W.hairlineBorder,
          }}
        >
          <div className="text-[9px] uppercase" style={{ color: W.text4 }}>vs scenario</div>
          <div className="mt-0.5 text-[10px] leading-snug" style={{ color: W.text2 }}>
            {currentScenario.horizon}: DI {currentScenario.drought_index.toFixed(2)} — recent rain{' '}
            {precipWindow.anomalyMm >= 0 ? 'at/above' : 'below'} heuristic norm for dialog only.
          </div>
        </div>
      </div>
    </GlassCard>
  )
})
