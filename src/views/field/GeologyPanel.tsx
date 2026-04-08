import { memo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Mountain, Drill, Link2 } from 'lucide-react'
import { GlassCard } from '../../components/ui/GlassCard'
import { GlowingIcon } from '../../components/ui/GlowingIcon'
import { StatusChip } from '../../components/ui/StatusChip'
import { BarComparison } from '../../components/charts/BarComparison'
import { SectionLabel } from '../../components/ui/SectionLabel'
import { MutedCaption } from '../../components/ui/MutedCaption'
import { W } from '../../app/canvas/canvasTheme'
import { useServiceQuery } from '../../hooks/useServiceQuery'
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton'
import type { DepositDetail } from '../../components/map/DepositOverlay'

const EXPLORATION_HIGHLIGHTS = [
  { id: 'CVSDD001', name: 'Cupim Vermelho Sul', result: '149.5m @ 8,912 ppm TREO', note: 'Highest-grade exploration intercept' },
  { id: 'BDPDD001', name: 'Barra do Pacu South', result: '73.3m @ 3,939 ppm', note: 'Southern extension potential' },
  { id: 'CRDD001', name: 'Caldeira Ring', result: '58m @ 2,702 ppm', note: 'New target along caldera ring' },
  { id: 'CRDD002', name: 'Caldeira Ring 2', result: '28.4m @ 2,194 ppm', note: 'Confirms ring enrichment' },
  { id: 'CDMDD003', name: 'Dona Maria ext.', result: '26.7m @ 1,561 ppm', note: 'Northern corridor scout' },
] as const

interface GeologyPanelProps {
  selectedDeposit: DepositDetail | null
  onSelectDeposit: (dep: DepositDetail | null) => void
}

export const GeologyPanel = memo(function GeologyPanel({ selectedDeposit, onSelectDeposit }: GeologyPanelProps) {
  const { data: DEPOSIT_DATA, isLoading: l1 } = useServiceQuery('deposit-data', s => s.getDepositData())
  const { data: RESOURCE_CLASSIFICATION, isLoading: l2 } = useServiceQuery('resource-class', s => s.getResourceClassification())
  const { data: snap, isLoading: l3 } = useServiceQuery('issuer-snapshot', s => s.getIssuerSnapshot())

  if (l1 || l2 || l3 || !DEPOSIT_DATA || !RESOURCE_CLASSIFICATION || !snap) {
    return <LoadingSkeleton variant="card" label="Loading geology..." />
  }

  return (
    <motion.div
      key="geology-panel"
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
    >
      <GlassCard animate={false} glow="amber" style={{ padding: '11px 13px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <GlowingIcon icon={Mountain} color="amber" size={11}/>
          <SectionLabel>Global Mineral Resource</SectionLabel>
          {snap?.resource?.citation?.url && (
            <a
              href={snap.resource.citation.url}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 3,
                fontSize: 9, fontWeight: 700, color: W.cyan,
                background: `${W.cyan}12`, border: `1px solid ${W.cyan}30`,
                borderRadius: W.radius.xs, padding: '1px 6px',
                textDecoration: 'none', whiteSpace: 'nowrap',
              }}
            >
              <Link2 size={8} />
              ASX {snap?.resource?.citation?.retrieved ?? '—'}
            </a>
          )}
        </div>
        <MutedCaption style={{ marginBottom: 10 }}>
          Geology and resource figures follow public disclosure context; they are independent of environmental compliance or Hydro Twin monitoring.
        </MutedCaption>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7, marginBottom: 8 }}>
          {[
            { k: 'Global MRE', v: `${RESOURCE_CLASSIFICATION?.global_bt ?? '—'} Bt`, c: W.text1, sub: `@ ${(RESOURCE_CLASSIFICATION?.global_treo_ppm ?? 0).toLocaleString()} ppm TREO` },
            { k: 'M&I', v: `${RESOURCE_CLASSIFICATION?.mi_mt ?? '—'} Mt`, c: W.text1, sub: `@ ${(RESOURCE_CLASSIFICATION?.mi_treo_ppm ?? 0).toLocaleString()} ppm TREO` },
            { k: 'Measured', v: `${RESOURCE_CLASSIFICATION?.measured_mt ?? '—'} Mt`, c: W.text1, sub: `@ ${(RESOURCE_CLASSIFICATION?.measured_treo_ppm ?? 0).toLocaleString()} ppm TREO` },
            { k: 'MREO avg', v: `${RESOURCE_CLASSIFICATION?.mreo_avg_pct ?? '—'}%`, c: W.text1, sub: 'Magnetic fraction' },
          ].map(({ k, v, c, sub }) => (
            <div key={k} style={{ padding: '6px 8px', borderRadius: W.radius.sm, background: `${c}0F`, border: `1px solid ${c}22` }}>
              <div style={{ fontSize: 10, color: W.text4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{k}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: c, fontFamily: 'var(--font-mono)' }}>{v}</div>
              <div style={{ fontSize: 10, color: W.text4 }}>{sub}</div>
            </div>
          ))}
        </div>
        <p style={{ margin: 0, fontSize: 11, color: W.text3, lineHeight: 1.45, marginBottom: 8 }}>
          Poços de Caldas Alkaline Complex · ionic adsorption clays · no drill-and-blast · no tailings dam.
          Total landholdings 193 km² across 77 licences.
        </p>
        <BarComparison
          height={20}
          items={[
            { label: `Global ${RESOURCE_CLASSIFICATION?.global_bt ?? '—'} Bt`, value: (RESOURCE_CLASSIFICATION?.global_bt ?? 0) * 1000, color: W.amber, sublabel: `@ ${(RESOURCE_CLASSIFICATION?.global_treo_ppm ?? 0).toLocaleString()} ppm TREO` },
            { label: `M&I ${RESOURCE_CLASSIFICATION?.mi_mt ?? '—'} Mt`, value: RESOURCE_CLASSIFICATION?.mi_mt ?? 0, color: W.violetSoft, sublabel: `@ ${(RESOURCE_CLASSIFICATION?.mi_treo_ppm ?? 0).toLocaleString()} ppm TREO` },
            { label: `Measured ${RESOURCE_CLASSIFICATION?.measured_mt ?? '—'} Mt`, value: RESOURCE_CLASSIFICATION?.measured_mt ?? 0, color: W.green, sublabel: `@ ${(RESOURCE_CLASSIFICATION?.measured_treo_ppm ?? 0).toLocaleString()} ppm TREO` },
          ]}
        />
      </GlassCard>

      {/* Exploration Highlights */}
      <GlassCard animate={false} style={{ padding: '10px 12px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <GlowingIcon icon={Drill} color="cyan" size={11} />
          <SectionLabel>Exploration Highlights — Outside Resource</SectionLabel>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {EXPLORATION_HIGHLIGHTS.map(({ id, name, result, note }) => (
            <div key={id} style={{ padding: '5px 7px', borderRadius: W.radius.sm, background: 'rgba(0,212,200,0.04)', border: '1px solid rgba(0,212,200,0.12)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 6 }}>
                <span style={{ fontSize: 10, fontWeight: 600, color: W.text2 }}>{name}</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: W.cyan, fontFamily: 'var(--font-mono)', flexShrink: 0 }}>{result}</span>
              </div>
              <div style={{ fontSize: 10, color: W.text4 }}>{note}</div>
            </div>
          ))}
        </div>
      </GlassCard>

      {(DEPOSIT_DATA ?? []).map(dep => (
        <GlassCard
          key={dep.id}
          animate={false}
          glow={selectedDeposit?.id === dep.id ? (dep.status === 'measured' ? 'green' : dep.status === 'exploration' ? 'amber' : 'violet') : 'none'}
          style={{ padding: '10px 12px', flexShrink: 0, cursor: 'pointer' }}
          onClick={() => onSelectDeposit(dep.id === selectedDeposit?.id ? null : dep)}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 5 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: W.text1 }}>{dep.name}</div>
              <div style={{ fontSize: 10, color: W.text4 }}>{dep.dimensions} · {dep.orientation}</div>
            </div>
            <StatusChip
              label={dep.status.toUpperCase()}
              variant={dep.status === 'measured' ? 'green' : dep.status === 'indicated' ? 'violet' : dep.status === 'inferred' ? 'cyan' : 'amber'}
              size="sm"
            />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div>
              <div style={{ fontSize: 10, color: W.text4 }}>TREO</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: W.text1, fontFamily: 'var(--font-mono)' }}>
                {dep.treo_ppm.toLocaleString()} ppm
              </div>
            </div>
            {dep.tonnage_mt > 0 && (
              <div>
                <div style={{ fontSize: 10, color: W.text4 }}>Resource</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: W.text1, fontFamily: 'var(--font-mono)' }}>
                  {dep.tonnage_mt} Mt
                </div>
              </div>
            )}
            <div>
              <div style={{ fontSize: 10, color: W.text4 }}>MREO</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: W.text1, fontFamily: 'var(--font-mono)' }}>
                {dep.mreo_pct}%
              </div>
            </div>
          </div>
          
          <AnimatePresence>
            {selectedDeposit?.id === dep.id && (
              <motion.div
                initial={{ height: 0, opacity: 0, marginTop: 0 }}
                animate={{ height: 'auto', opacity: 1, marginTop: 10 }}
                exit={{ height: 0, opacity: 0, marginTop: 0 }}
                style={{ overflow: 'hidden' }}
              >
                <div style={{ paddingTop: 8, borderTop: W.hairlineBorder, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 10, color: W.text4 }}>Clay Depth (Avg / Max)</span>
                    <span style={{ fontSize: 10, color: W.text1, fontFamily: 'var(--font-mono)' }}>{dep.clay_depth_avg_m}m / {dep.clay_depth_max_m}m</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 10, color: W.text4 }}>Area</span>
                    <span style={{ fontSize: 10, color: W.text1, fontFamily: 'var(--font-mono)' }}>{dep.area_km2} km²</span>
                  </div>
                  <div style={{ padding: '6px 8px', background: W.glass03, borderRadius: W.radius.sm, marginTop: 2 }}>
                    <span style={{ fontSize: 10, color: W.text3, lineHeight: 1.4, display: 'block' }}>{dep.resource_note}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>
      ))}
    </motion.div>
  )
})
