import { memo } from 'react'
import { GlassCard } from '../../components/ui/GlassCard'
import { StatusChip } from '../../components/ui/StatusChip'
import { ProvenanceBadge } from '../../components/ui/ProvenanceBadge'
import { W } from '../../app/canvas/canvasTheme'
import { LITH_COLORS, LITH_LABELS } from '../../components/charts/lithologyPalette'
import { useServiceQuery } from '../../hooks/useServiceQuery'
import type { FieldMapGeoSelection } from './fieldMapGeoSelection'

export const FieldMapGeoInspector = memo(function FieldMapGeoInspector({
  selection,
  onClear,
}: {
  selection: FieldMapGeoSelection | null
  onClear: () => void
}) {
  const { data: prov } = useServiceQuery('provenance', s => s.getProvenanceProfile())

  if (!selection || !prov) return null

  const kindChip =
    selection.kind === 'licenceEnvelope'
      ? 'ENVELOPE'
      : selection.kind === 'route'
        ? 'ROUTE'
        : selection.kind.toUpperCase()

  return (
    <GlassCard animate={false} className="mt-2 shrink-0 px-[11px] py-2.5" glow="cyan">
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: W.text3 }}>
          Map feature
        </span>
        <StatusChip label={kindChip} variant="cyan" size="sm" />
      </div>
      <div className="mb-2 flex flex-wrap gap-1">
        <ProvenanceBadge kind={prov.sections.map_geometry.kind} title={prov.sections.map_geometry.hint} />
      </div>

      {selection.kind === 'license' && (
        <div className="flex flex-col gap-1 text-[11px]" style={{ color: W.text2 }}>
          <div className="font-bold text-[var(--w-text1)]">{selection.detail.name}</div>
          <div style={{ color: W.text4 }}>{selection.detail.label}</div>
          <div>
            {selection.detail.area_km2} km² · {selection.detail.license_count} licence block ·{' '}
            <span className="uppercase">{selection.detail.status.replace(/_/g, ' ')}</span>
          </div>
          {selection.detail.resource_category && (
            <div style={{ color: W.text4 }}>
              Resource: {selection.detail.resource_category}
              {selection.detail.total_mt != null ? ` · ${selection.detail.total_mt} Mt` : ''}
            </div>
          )}
          <div style={{ color: W.text4 }}>{selection.detail.note}</div>
          {selection.detail.source_ref && (
            <div className="font-mono text-[9px]" style={{ color: W.text4 }}>
              source_ref: {selection.detail.source_ref} · as_of {selection.detail.as_of ?? '—'} ·{' '}
              {selection.detail.confidence ?? '—'}
            </div>
          )}
        </div>
      )}

      {selection.kind === 'drill' && (
        <div className="flex flex-col gap-1 text-[11px]" style={{ color: W.text2 }}>
          <div className="font-bold text-[var(--w-text1)]">{selection.detail.id}</div>
          <div>
            <StatusChip label={selection.detail.hole_type} variant="violet" size="sm" /> ·{' '}
            {selection.detail.treo_ppm} ppm TREO · {selection.detail.depth_m} m
          </div>
          <div style={{ color: W.text4 }}>Deposit: {selection.detail.deposit}</div>
          {selection.detail.intercept && (
            <div style={{ color: W.text4 }}>
              <span className="font-semibold text-[var(--w-text3)]">Intercept:</span> {selection.detail.intercept}
            </div>
          )}
          {selection.detail.including && (
            <div style={{ color: W.text4 }}>
              <span className="font-semibold text-[var(--w-text3)]">Including:</span> {selection.detail.including}
            </div>
          )}
          {selection.detail.note && <div style={{ color: W.text4 }}>{selection.detail.note}</div>}
          {selection.detail.source_ref && (
            <div className="font-mono text-[9px]" style={{ color: W.text4 }}>
              {selection.detail.source_ref} · {selection.detail.as_of ?? '—'}
            </div>
          )}

          {selection.detail.lithology_intervals && selection.detail.lithology_intervals.length > 0 && (
            <div style={{ marginTop: 8 }}>
              <div style={{ fontSize: 9, fontWeight: 600, color: W.text4, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
                Lithology profile
              </div>
              <div style={{ display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden', gap: 1 }}>
                {selection.detail.lithology_intervals.map((interval: { from_m: number; to_m: number; lithology: string }, idx: number) => (
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
                {[...new Set(selection.detail.lithology_intervals.map((i: { lithology: string }) => i.lithology))].map((lith: string) => (
                  <div key={lith} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <span style={{ width: 6, height: 6, borderRadius: 2, background: LITH_COLORS[lith] ?? '#555' }} />
                    <span style={{ fontSize: 8, color: W.text4 }}>{LITH_LABELS[lith] ?? lith}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selection.detail.lithology_intervals && selection.detail.lithology_intervals.length > 0 && (
            <div style={{ marginTop: 10, display: 'flex', gap: 10 }}>
              <div style={{ width: 32, height: 180, borderRadius: 4, overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 0.5, flexShrink: 0 }}>
                {selection.detail.lithology_intervals.map((interval: { from_m: number; to_m: number; lithology: string }, idx: number) => {
                  const total = selection.detail.depth_m || selection.detail.lithology_intervals?.[selection.detail.lithology_intervals.length - 1]?.to_m || 0
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
                <span style={{ fontSize: 8, color: W.text4, fontFamily: 'var(--font-mono)' }}>{selection.detail.depth_m}m</span>
              </div>
            </div>
          )}
        </div>
      )}

      {selection.kind === 'pfs' && (
        <div className="flex flex-col gap-1 text-[11px]" style={{ color: W.text2 }}>
          <div className="font-bold text-[var(--w-text1)]">{selection.detail.label}</div>
          <div className="uppercase" style={{ color: W.text4 }}>
            {selection.detail.engineering_kind.replace(/-/g, ' ')}
          </div>
          <div style={{ color: W.text4 }}>{selection.detail.note}</div>
          <div className="font-mono text-[9px]" style={{ color: W.text4 }}>
            {selection.detail.source_ref} · {selection.detail.confidence}
          </div>
        </div>
      )}

      {selection.kind === 'infra' && (
        <div className="flex flex-col gap-1 text-[11px]" style={{ color: W.text2 }}>
          <div className="font-bold text-[var(--w-text1)]">{selection.label}</div>
          <div style={{ color: W.text4 }}>{selection.sublabel}</div>
          <div className="uppercase" style={{ color: W.text4 }}>{selection.infraKind}</div>
          {selection.details && <div style={{ color: W.text4 }}>{selection.details}</div>}
          <div className="font-mono text-[9px]" style={{ color: W.text4 }}>{selection.id}</div>
          {(selection.source_ref || selection.as_of) && (
            <div className="font-mono text-[9px]" style={{ color: W.text4 }}>
              {selection.source_ref ?? '—'} · {selection.as_of ?? '—'} · {selection.confidence ?? '—'}
            </div>
          )}
        </div>
      )}

      {selection.kind === 'route' && (
        <div className="flex flex-col gap-1 text-[11px]" style={{ color: W.text2 }}>
          <div className="font-bold text-[var(--w-text1)]">{selection.detail.label}</div>
          <div style={{ color: W.text4 }}>{selection.detail.note}</div>
          <div className="font-mono text-[9px]" style={{ color: W.text4 }}>
            {selection.detail.source_ref} · {selection.detail.as_of} · {selection.detail.confidence ?? '—'}
          </div>
        </div>
      )}

      {selection.kind === 'licenceEnvelope' && (
        <div className="flex flex-col gap-1 text-[11px]" style={{ color: W.text2 }}>
          <div className="font-bold text-[var(--w-text1)]">{selection.detail.label}</div>
          <div>
            {selection.detail.area_km2} km² envelope · context behind per-concession polygons
          </div>
          <div style={{ color: W.text4 }}>{selection.detail.note}</div>
          <div className="font-mono text-[9px]" style={{ color: W.text4 }}>
            {selection.detail.source_ref} · {selection.detail.as_of} · {selection.detail.confidence ?? '—'}
          </div>
        </div>
      )}

      {selection.kind === 'env' && (
        <div className="flex flex-col gap-1 text-[11px]" style={{ color: W.text2 }}>
          <div className="font-bold text-[var(--w-text1)]">{selection.detail.label}</div>
          {selection.detail.sublabel && (
            <div style={{ fontSize: 10, color: W.text3, fontStyle: 'italic' }}>{selection.detail.sublabel}</div>
          )}
          {selection.detail.description && (
            <div style={{ color: W.text2, lineHeight: 1.4 }}>{selection.detail.description}</div>
          )}
          {(selection.detail.area_ha || selection.detail.municipality) && (
            <div className="flex flex-wrap gap-x-3 gap-y-0.5" style={{ fontSize: 10, color: W.text3 }}>
              {selection.detail.area_ha != null && (
                <span>{selection.detail.area_ha.toLocaleString()} ha</span>
              )}
              {selection.detail.perimeter_km != null && (
                <span>{selection.detail.perimeter_km} km perimeter</span>
              )}
              {selection.detail.municipality && selection.detail.state && (
                <span>{selection.detail.municipality}, {selection.detail.state}</span>
              )}
            </div>
          )}
          {selection.detail.authority && (
            <div style={{ fontSize: 10, color: W.text3 }}>Authority: {selection.detail.authority}</div>
          )}
          <div style={{ color: W.text4 }}>{selection.detail.note}</div>
          <div className="font-mono text-[9px]" style={{ color: W.text4 }}>
            {selection.detail.source_ref} · {selection.detail.as_of} · {selection.detail.confidence ?? selection.detail.kind}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={onClear}
        className="mt-2 w-full cursor-pointer rounded-md border px-2 py-1.5 text-[10px] font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/35"
        style={{
          border: W.chromeBorder,
          background: W.glass03,
          color: W.text3,
        }}
      >
        Clear map selection
      </button>
    </GlassCard>
  )
})
