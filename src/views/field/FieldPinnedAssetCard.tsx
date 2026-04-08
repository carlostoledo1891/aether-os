import { memo, useMemo } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Settings, Layers } from 'lucide-react'
import { GlassCard } from '../../components/ui/GlassCard'
import { GlowingIcon } from '../../components/ui/GlowingIcon'
import { StatusChip } from '../../components/ui/StatusChip'
import { ProvenanceBadge } from '../../components/ui/ProvenanceBadge'
import { W } from '../../app/canvas/canvasTheme'
import { useAetherService } from '../../services/DataServiceProvider'
import type { PlantOverlayNodeDetail } from '../../components/map/PlantOverlay'
import type { HydroOverlayNodeDetail } from '../../components/map/HydroOverlay'
import type { MapTab } from './constants'
import { PLANT_NODE_SPECS, HYDRO_NODE_SPECS } from './constants'

export const FieldPinnedAssetCard = memo(function FieldPinnedAssetCard({
  mapTab,
  isPinned,
  isHovering,
  activeNode,
  onClear,
}: {
  mapTab: MapTab
  isPinned: boolean
  isHovering: boolean
  activeNode: PlantOverlayNodeDetail | HydroOverlayNodeDetail | null
  onClear: () => void
}) {
  const service = useAetherService()
  const prov = useMemo(() => service.getProvenanceProfile(), [service])

  if (!prov || !('sections' in prov)) {
    return null
  }

  return (
    <GlassCard
      animate={false}
      glow={isPinned
        ? (mapTab === 'operations' ? 'violet' : 'cyan')
        : isHovering ? 'cyan' : 'none'}
      className="shrink-0 px-[11px] py-[11px] transition-[max-height] duration-300 ease-out"
      style={{
        maxHeight: isPinned ? 340 : 120,
        overflowY: isPinned ? 'auto' : 'hidden',
      }}
    >
      <div className="mb-1.5 flex flex-col gap-1">
        <div className="flex items-center justify-between gap-1.5">
          <div className="flex items-center gap-1.5">
            <GlowingIcon
              icon={mapTab === 'operations' ? Settings : Layers}
              color={mapTab === 'operations' ? 'violet' : 'cyan'}
              size={11}
            />
            <span
              className="text-[10px] font-bold uppercase tracking-wide"
              style={{ color: W.text3 }}
            >
              Active Asset
            </span>
          </div>
          {isPinned ? (
            <StatusChip label="PINNED" variant="violet" size="sm" />
          ) : isHovering ? (
            <StatusChip label="HOVER" variant="cyan" size="sm" />
          ) : (
            <StatusChip label="READY" variant="green" size="sm" />
          )}
        </div>
        <div className="flex flex-wrap gap-1">
          {mapTab === 'environment' ? (
            <>
              <ProvenanceBadge kind={prov.sections.hydro_spring_status.kind} title={prov.sections.hydro_spring_status.hint} />
              <ProvenanceBadge kind={prov.sections.hydro_piezo_telemetry.kind} title={prov.sections.hydro_piezo_telemetry.hint} />
            </>
          ) : (
            <ProvenanceBadge kind={prov.sections.plant_telemetry.kind} title={prov.sections.plant_telemetry.hint} />
          )}
        </div>
      </div>
      {activeNode ? (() => {
        const accentColor = mapTab === 'operations' ? W.violetSoft : W.cyan
        const plantSpec = mapTab === 'operations' ? PLANT_NODE_SPECS[activeNode.id] : undefined
        const hydroNode = mapTab === 'environment' ? (activeNode as HydroOverlayNodeDetail) : null
        const hydroSpec = hydroNode && hydroNode.nodeType !== 'spring'
          ? HYDRO_NODE_SPECS[hydroNode.id]
          : undefined
        const springHistory = hydroNode?.nodeType === 'spring'
          ? service.getSpringHistory(hydroNode.id)
          : []
        return (
          <>
            <div className="mb-0.5 text-xs font-bold" style={{ color: W.text1 }}>{activeNode.label}</div>
            <div className="mb-2 text-[10px]" style={{ color: W.text4 }}>{activeNode.sublabel}</div>
            <div
              className="mb-2 rounded-md px-2 py-1.5"
              style={{
                background: W.glass03,
                border: W.hairlineBorder,
              }}
            >
              <div
                className="font-mono text-xs font-bold"
                style={{ color: accentColor }}
              >
                {activeNode.metric || '—'}
              </div>
            </div>

            {plantSpec && (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mb-2 flex flex-col gap-1"
                >
                  {([['Hardware', plantSpec.hardware], ['Spec', plantSpec.spec], ...(plantSpec.threshold ? [['Threshold', plantSpec.threshold]] : []), ['Frequency', plantSpec.frequency]] as [string, string][]).map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-1.5">
                      <span className="shrink-0 text-[10px]" style={{ color: W.text4 }}>{k}</span>
                      <span className="text-right text-[10px] font-semibold" style={{ color: W.text2 }}>{v}</span>
                    </div>
                  ))}
                  {'status' in activeNode && (
                    <div className="flex justify-between gap-1.5">
                      <span className="text-[10px]" style={{ color: W.text4 }}>Status</span>
                      <StatusChip label={String((activeNode as PlantOverlayNodeDetail).status).toUpperCase()} variant={
                        (activeNode as PlantOverlayNodeDetail).status === 'running' ? 'violet' :
                        (activeNode as PlantOverlayNodeDetail).status === 'success' ? 'green' :
                        (activeNode as PlantOverlayNodeDetail).status === 'warning' ? 'amber' : 'red'
                      } size="sm" />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            )}

            {hydroSpec && (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mb-2 flex flex-col gap-1"
                >
                  {([['Hardware', hydroSpec.hardware], ['Spec', hydroSpec.spec], ['Compliance', hydroSpec.compliance]] as [string, string][]).map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-1.5">
                      <span className="shrink-0 text-[10px]" style={{ color: W.text4 }}>{k}</span>
                      <span className="text-right text-[10px] font-semibold" style={{ color: W.text2 }}>{v}</span>
                    </div>
                  ))}
                  {'statusLabel' in activeNode && (
                    <div className="flex justify-between gap-1.5">
                      <span className="text-[10px]" style={{ color: W.text4 }}>Status</span>
                      <StatusChip label={(activeNode as HydroOverlayNodeDetail).statusLabel} variant={
                        (activeNode as HydroOverlayNodeDetail).statusLabel === 'Normal' ? 'green' :
                        (activeNode as HydroOverlayNodeDetail).statusLabel === 'Warning' ? 'amber' : 'red'
                      } size="sm" />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            )}

            {hydroNode?.nodeType === 'spring' && (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mb-2 flex flex-col gap-1"
                >
                  {([
                    ['Tier', hydroNode.monitoringTier?.replace(/_/g, ' ') ?? '—'],
                    ['Method', hydroNode.method ?? '—'],
                    ['Last field visit', hydroNode.lastFieldVisit
                      ? new Date(hydroNode.lastFieldVisit).toISOString().slice(0, 10)
                      : '—'],
                    ['Linked piezo', hydroNode.linkedSensorId ?? '—'],
                    ['Data sources', hydroNode.dataSources?.join(', ') ?? '—'],
                  ] as [string, string][]).map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-1.5">
                      <span className="shrink-0 text-[10px]" style={{ color: W.text4 }}>{k}</span>
                      <span className="text-right text-[10px] font-semibold" style={{ color: W.text2 }}>{v}</span>
                    </div>
                  ))}
                  {springHistory[0] && (
                    <div
                      className="rounded-md px-1.5 py-1 text-[9px]"
                      style={{ color: W.text4, background: W.glass03 }}
                    >
                      Latest log ({springHistory[springHistory.length - 1]!.type}): {springHistory[springHistory.length - 1]!.note}
                    </div>
                  )}
                  <div className="flex justify-between gap-1.5">
                    <span className="text-[10px]" style={{ color: W.text4 }}>Spring status</span>
                    <StatusChip label={hydroNode.statusLabel} variant={
                      hydroNode.statusLabel === 'Active' ? 'green' :
                      hydroNode.statusLabel === 'Reduced' ? 'amber' : 'red'
                    } size="sm" />
                  </div>
                </motion.div>
              </AnimatePresence>
            )}

            <div className="mb-2 font-mono text-[10px]" style={{ color: W.text4 }}>
              {Math.abs(activeNode.coordinates[1]).toFixed(4)}°S · {Math.abs(activeNode.coordinates[0]).toFixed(4)}°W
            </div>
            <button
              type="button"
              onClick={onClear}
              className="w-full cursor-pointer rounded-md border px-2 py-1.5 text-[10px] font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/35"
              style={{
                border: W.chromeBorder,
                background: W.glass03,
                color: W.text3,
              }}
            >
              Clear pinned asset
            </button>
          </>
        )
      })() : (
        <p className="m-0 text-[11px] leading-snug" style={{ color: W.text3 }}>
          {mapTab === 'environment'
            ? 'Hydro Digital Twin — click any aquifer or spring to pin simulated telemetry. Hydrology does not imply tonnage, grade, or reserve status (independent of geology).'
            : 'Hover any node for an overlay card, or click to pin. Telemetry is simulated until pilot integration.'}
        </p>
      )}
    </GlassCard>
  )
})
