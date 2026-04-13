import { memo } from 'react'
import { Droplets } from 'lucide-react'
import { GlassCard } from '../../components/ui/GlassCard'
import { GlowingIcon } from '../../components/ui/GlowingIcon'
import { StatusChip } from '../../components/ui/StatusChip'
import { MetricDisplay } from '../../components/ui/MetricDisplay'
import { SparkLine } from '../../components/charts/SparkLine'
import { SectionLabel } from '../../components/ui/SectionLabel'
import { DataSourceBadge } from '../../components/ui/DataSourceBadge'
import { W } from '../../app/canvas/canvasTheme'
import type { TimeRangeKey } from '../../services/dataService'
import css from './EnvironmentPanel.module.css'

export interface WaterQualityCardProps {
  sulfatePpm: number
  nitratePpm: number
  sulfateData: number[]
  nitrateData: number[]
  precipMmSeries: number[]
  range: TimeRangeKey
}

export const WaterQualityCard = memo(function WaterQualityCard({
  sulfatePpm,
  nitratePpm,
  sulfateData,
  nitrateData,
  precipMmSeries,
  range,
}: WaterQualityCardProps) {
  const sulfateOk = sulfatePpm < 250
  const nitrateOk = nitratePpm < 50

  return (
    <GlassCard animate={false} glow={(!sulfateOk || !nitrateOk) ? 'amber' : 'none'} className={css.cardBody}>
      <div className={css.sectionHeadBetween} style={{ marginBottom: 8 }}>
        <div className={css.sectionHead}>
          <GlowingIcon icon={Droplets} color={(!sulfateOk || !nitrateOk) ? 'amber' : 'green'} size={11}/>
          <SectionLabel>Water Quality</SectionLabel>
        </div>
        <DataSourceBadge kind="simulated" />
      </div>
      <div className={css.grid2} style={{ gap: 8 }}>
        <div>
          <div className={css.sectionHeadBetween} style={{ marginBottom: 3 }}>
            <span style={{ fontSize: 10, color: W.text3 }}>Sulfate</span>
            {!sulfateOk && <StatusChip label="⚠" variant="red" size="sm"/>}
          </div>
          <MetricDisplay value={sulfatePpm} unit="ppm" decimals={0} size="sm" color={sulfateOk ? 'green' : 'amber'}/>
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
          <MetricDisplay value={nitratePpm} unit="ppm" decimals={0} size="sm" color={nitrateOk ? 'green' : 'amber'}/>
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
  )
})
