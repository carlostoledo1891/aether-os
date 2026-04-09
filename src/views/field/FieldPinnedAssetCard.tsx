import { memo } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Settings, Layers, X } from 'lucide-react'
import { GlassCard } from '../../components/ui/GlassCard'
import { GlowingIcon } from '../../components/ui/GlowingIcon'
import { StatusChip } from '../../components/ui/StatusChip'
import { ProvenanceBadge } from '../../components/ui/ProvenanceBadge'
import { W } from '../../app/canvas/canvasTheme'
import { LITH_COLORS, LITH_LABELS } from '../../components/charts/lithologyPalette'
import { useServiceQuery, useServiceQueryWithArg } from '../../hooks/useServiceQuery'
import type { PlantOverlayNodeDetail } from '../../components/map/PlantOverlay'
import type { HydroOverlayNodeDetail } from '../../components/map/HydroOverlay'
import type { FieldMapGeoSelection } from './fieldMapGeoSelection'
import type { MapTab } from './constants'
import { PLANT_NODE_SPECS, HYDRO_NODE_SPECS } from './constants'

export const FieldPinnedAssetCard = memo(function FieldPinnedAssetCard({
  mapTab,
  isPinned,
  isHovering,
  activeNode,
  geoSelection,
  onClear,
  onClearGeo,
}: {
  mapTab: MapTab
  isPinned: boolean
  isHovering: boolean
  activeNode: PlantOverlayNodeDetail | HydroOverlayNodeDetail | null
  geoSelection: FieldMapGeoSelection | null
  onClear: () => void
  onClearGeo: () => void
}) {
  const { data: prov, isLoading: loadingProv } = useServiceQuery('provenance', s => s.getProvenanceProfile())

  const springNodeId = mapTab === 'environment' && activeNode && 'nodeType' in activeNode && (activeNode as HydroOverlayNodeDetail).nodeType === 'spring'
    ? activeNode.id
    : null
  const { data: springHistoryData } = useServiceQueryWithArg(
    'spring-history',
    springNodeId,
    (s, id) => id ? s.getSpringHistory(id) : [],
  )

  if (loadingProv || !prov) return null

  const hasContent = geoSelection != null || activeNode != null

  const kindChip = geoSelection
    ? (geoSelection.kind === 'licenceEnvelope'
        ? 'ENVELOPE'
        : geoSelection.kind === 'route'
          ? 'ROUTE'
          : geoSelection.kind.toUpperCase())
    : null

  return (
    <GlassCard
      animate={false}
      glow={geoSelection
        ? 'cyan'
        : isPinned
          ? (mapTab === 'operations' ? 'violet' : 'cyan')
          : isHovering ? 'cyan' : 'none'}
      className="shrink-0 px-[11px] py-[11px] transition-[max-height] duration-300 ease-out"
      style={{
        maxHeight: hasContent ? 480 : 120,
        overflowY: hasContent ? 'auto' : 'hidden',
      }}
    >
      <div className="mb-1.5 flex flex-col gap-1">
        <div className="flex items-center justify-between gap-1.5">
          {geoSelection ? (
            <>
              <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: W.text3 }}>
                Map feature
              </span>
              <div className="flex items-center gap-1.5">
                <StatusChip label={kindChip!} variant="cyan" size="sm" />
                <button
                  type="button"
                  onClick={onClearGeo}
                  className="flex h-4 w-4 items-center justify-center rounded cursor-pointer"
                  style={{ color: W.text4, background: W.glass06 }}
                >
                  <X size={10} />
                </button>
              </div>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
        <div className="flex flex-wrap gap-1">
          {geoSelection ? (
            <ProvenanceBadge kind={prov?.sections?.map_geometry?.kind} title={prov?.sections?.map_geometry?.hint} />
          ) : mapTab === 'environment' ? (
            <>
              <ProvenanceBadge kind={prov?.sections?.hydro_spring_status?.kind} title={prov?.sections?.hydro_spring_status?.hint} />
              <ProvenanceBadge kind={prov?.sections?.hydro_piezo_telemetry?.kind} title={prov?.sections?.hydro_piezo_telemetry?.hint} />
            </>
          ) : (
            <ProvenanceBadge kind={prov?.sections?.plant_telemetry?.kind} title={prov?.sections?.plant_telemetry?.hint} />
          )}
        </div>
      </div>

      {geoSelection ? (
        <>
          {geoSelection.kind === 'license' && (
            <div className="flex flex-col gap-1 text-[11px]" style={{ color: W.text2 }}>
              <div className="font-bold text-[var(--w-text1)]">{geoSelection.detail.name}</div>
              <div style={{ color: W.text4 }}>{geoSelection.detail.label}</div>
              <div>
                {geoSelection.detail.area_km2} km² · {geoSelection.detail.license_count} licence block ·{' '}
                <span className="uppercase">{geoSelection.detail.status.replace(/_/g, ' ')}</span>
              </div>
              {geoSelection.detail.resource_category && (
                <div style={{ color: W.text4 }}>
                  Resource: {geoSelection.detail.resource_category}
                  {geoSelection.detail.total_mt != null ? ` · ${geoSelection.detail.total_mt} Mt` : ''}
                </div>
              )}
              <div style={{ color: W.text4 }}>{geoSelection.detail.note}</div>
              {geoSelection.detail.source_ref && (
                <div className="font-mono text-[9px]" style={{ color: W.text4 }}>
                  source_ref: {geoSelection.detail.source_ref} · as_of {geoSelection.detail.as_of ?? '—'} ·{' '}
                  {geoSelection.detail.confidence ?? '—'}
                </div>
              )}
            </div>
          )}

          {geoSelection.kind === 'drill' && (
            <div className="flex flex-col gap-1 text-[11px]" style={{ color: W.text2 }}>
              <div className="font-bold text-[var(--w-text1)]">{geoSelection.detail.id}</div>
              <div>
                <StatusChip label={geoSelection.detail.hole_type} variant="violet" size="sm" /> ·{' '}
                {geoSelection.detail.treo_ppm} ppm TREO · {geoSelection.detail.depth_m} m
              </div>
              <div style={{ color: W.text4 }}>Deposit: {geoSelection.detail.deposit}</div>
              {geoSelection.detail.intercept && (
                <div style={{ color: W.text4 }}>
                  <span className="font-semibold text-[var(--w-text3)]">Intercept:</span> {geoSelection.detail.intercept}
                </div>
              )}
              {geoSelection.detail.including && (
                <div style={{ color: W.text4 }}>
                  <span className="font-semibold text-[var(--w-text3)]">Including:</span> {geoSelection.detail.including}
                </div>
              )}
              {geoSelection.detail.note && <div style={{ color: W.text4 }}>{geoSelection.detail.note}</div>}
              {geoSelection.detail.source_ref && (
                <div className="font-mono text-[9px]" style={{ color: W.text4 }}>
                  {geoSelection.detail.source_ref} · {geoSelection.detail.as_of ?? '—'}
                </div>
              )}

              {geoSelection.detail.lithology_intervals && geoSelection.detail.lithology_intervals.length > 0 && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ fontSize: 9, fontWeight: 600, color: W.text4, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
                    Lithology profile
                  </div>
                  <div style={{ display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden', gap: 1 }}>
                    {geoSelection.detail.lithology_intervals.map((interval, idx) => (
                      <div
                        key={idx}
                        style={{
                          flex: interval.to_m - interval.from_m,
                          background: LITH_COLORS[interval.lithology] ?? '#555',
                          minWidth: 2,
                        }}
                        title={`${LITH_LABELS[interval.lithology] ?? interval.lithology}: ${interval.from_m}\u2013${interval.to_m}m`}
                      />
                    ))}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
                    {[...new Set(geoSelection.detail.lithology_intervals.map(i => i.lithology))].map(lith => (
                      <div key={lith} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <span style={{ width: 6, height: 6, borderRadius: 2, background: LITH_COLORS[lith] ?? '#555' }} />
                        <span style={{ fontSize: 8, color: W.text4 }}>{LITH_LABELS[lith] ?? lith}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {geoSelection.detail.lithology_intervals && geoSelection.detail.lithology_intervals.length > 0 && (
                <div style={{ marginTop: 10, display: 'flex', gap: 10 }}>
                  <div style={{ width: 32, height: 180, borderRadius: 4, overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 0.5, flexShrink: 0 }}>
                    {geoSelection.detail.lithology_intervals.map((interval, idx) => {
                      const total = geoSelection.detail.depth_m || geoSelection.detail.lithology_intervals![geoSelection.detail.lithology_intervals!.length - 1].to_m
                      const pct = ((interval.to_m - interval.from_m) / total) * 100
                      return (
                        <div
                          key={idx}
                          style={{
                            flex: `${pct} 0 0`,
                            background: LITH_COLORS[interval.lithology] ?? '#555',
                            minHeight: 2,
                            position: 'relative' as const,
                          }}
                        >
                          {pct > 15 && (
                            <span style={{ position: 'absolute', left: 36, top: '50%', transform: 'translateY(-50%)', fontSize: 8, color: W.text3, whiteSpace: 'nowrap' }}>
                              {interval.from_m}\u2013{interval.to_m}m
                            </span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 8, color: W.text4, fontFamily: 'var(--font-mono)' }}>0m</span>
                    <span style={{ fontSize: 8, color: W.text4, fontFamily: 'var(--font-mono)' }}>{geoSelection.detail.depth_m}m</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {geoSelection.kind === 'deposit' && (
            <div className="flex flex-col gap-1 text-[11px]" style={{ color: W.text2 }}>
              <div className="font-bold text-[var(--w-text1)]">{geoSelection.detail.name}</div>
              <div>
                {geoSelection.detail.tonnage_mt} Mt · {geoSelection.detail.treo_ppm} ppm · MREO{' '}
                {geoSelection.detail.mreo_pct}%
              </div>
              <div style={{ color: W.text4 }}>{geoSelection.detail.resource_note}</div>
            </div>
          )}

          {geoSelection.kind === 'pfs' && (
            <div className="flex flex-col gap-1 text-[11px]" style={{ color: W.text2 }}>
              <div className="font-bold text-[var(--w-text1)]">{geoSelection.detail.label}</div>
              <div className="uppercase" style={{ color: W.text4 }}>
                {geoSelection.detail.engineering_kind.replace(/-/g, ' ')}
              </div>
              <div style={{ color: W.text4 }}>{geoSelection.detail.note}</div>
              <div className="font-mono text-[9px]" style={{ color: W.text4 }}>
                {geoSelection.detail.source_ref} · {geoSelection.detail.confidence}
              </div>
            </div>
          )}

          {geoSelection.kind === 'infra' && (
            <div className="flex flex-col gap-1 text-[11px]" style={{ color: W.text2 }}>
              <div className="font-bold text-[var(--w-text1)]">{geoSelection.label}</div>
              <div style={{ color: W.text4 }}>{geoSelection.sublabel}</div>
              <div className="uppercase" style={{ color: W.text4 }}>{geoSelection.infraKind}</div>
              {geoSelection.details && <div style={{ color: W.text4 }}>{geoSelection.details}</div>}
              <div className="font-mono text-[9px]" style={{ color: W.text4 }}>{geoSelection.id}</div>
              {(geoSelection.source_ref || geoSelection.as_of) && (
                <div className="font-mono text-[9px]" style={{ color: W.text4 }}>
                  {geoSelection.source_ref ?? '—'} · {geoSelection.as_of ?? '—'} · {geoSelection.confidence ?? '—'}
                </div>
              )}
            </div>
          )}

          {geoSelection.kind === 'route' && (
            <div className="flex flex-col gap-1 text-[11px]" style={{ color: W.text2 }}>
              <div className="font-bold text-[var(--w-text1)]">{geoSelection.detail.label}</div>
              <div style={{ color: W.text4 }}>{geoSelection.detail.note}</div>
              <div className="font-mono text-[9px]" style={{ color: W.text4 }}>
                {geoSelection.detail.source_ref} · {geoSelection.detail.as_of} · {geoSelection.detail.confidence ?? '—'}
              </div>
            </div>
          )}

          {geoSelection.kind === 'licenceEnvelope' && (
            <div className="flex flex-col gap-1 text-[11px]" style={{ color: W.text2 }}>
              <div className="font-bold text-[var(--w-text1)]">{geoSelection.detail.label}</div>
              <div>
                {geoSelection.detail.area_km2} km² envelope · context behind per-concession polygons
              </div>
              <div style={{ color: W.text4 }}>{geoSelection.detail.note}</div>
              <div className="font-mono text-[9px]" style={{ color: W.text4 }}>
                {geoSelection.detail.source_ref} · {geoSelection.detail.as_of} · {geoSelection.detail.confidence ?? '—'}
              </div>
            </div>
          )}

          {geoSelection.kind === 'env' && (
            <div className="flex flex-col gap-1 text-[11px]" style={{ color: W.text2 }}>
              <div className="font-bold text-[var(--w-text1)]">{geoSelection.detail.label}</div>
              {geoSelection.detail.sublabel && (
                <div style={{ fontSize: 10, color: W.text3, fontStyle: 'italic' }}>{geoSelection.detail.sublabel}</div>
              )}
              {geoSelection.detail.description && (
                <div style={{ color: W.text2, lineHeight: 1.4 }}>{geoSelection.detail.description}</div>
              )}
              {(geoSelection.detail.area_ha || geoSelection.detail.municipality) && (
                <div className="flex flex-wrap gap-x-3 gap-y-0.5" style={{ fontSize: 10, color: W.text3 }}>
                  {geoSelection.detail.area_ha != null && (
                    <span>{geoSelection.detail.area_ha.toLocaleString()} ha</span>
                  )}
                  {geoSelection.detail.perimeter_km != null && (
                    <span>{geoSelection.detail.perimeter_km} km perimeter</span>
                  )}
                  {geoSelection.detail.municipality && geoSelection.detail.state && (
                    <span>{geoSelection.detail.municipality}, {geoSelection.detail.state}</span>
                  )}
                </div>
              )}
              {geoSelection.detail.authority && (
                <div style={{ fontSize: 10, color: W.text3 }}>Authority: {geoSelection.detail.authority}</div>
              )}
              <div style={{ color: W.text4 }}>{geoSelection.detail.note}</div>
              <div className="font-mono text-[9px]" style={{ color: W.text4 }}>
                {geoSelection.detail.source_ref} · {geoSelection.detail.as_of} · {geoSelection.detail.confidence ?? geoSelection.detail.kind}
              </div>
            </div>
          )}
        </>
      ) : activeNode ? (() => {
        const accentColor = mapTab === 'operations' ? W.violetSoft : W.cyan
        const plantSpec = mapTab === 'operations' ? PLANT_NODE_SPECS[activeNode.id] : undefined
        const hydroNode = mapTab === 'environment' ? (activeNode as HydroOverlayNodeDetail) : null
        const hydroSpec = hydroNode && hydroNode.nodeType !== 'spring'
          ? HYDRO_NODE_SPECS[hydroNode.id]
          : undefined
        const springHistory = springHistoryData ?? []
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
                      className="rounded-md px-1.5 py-1 text-[10px]"
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
