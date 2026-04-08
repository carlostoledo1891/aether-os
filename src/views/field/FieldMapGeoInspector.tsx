import { memo } from 'react'
import { GlassCard } from '../../components/ui/GlassCard'
import { StatusChip } from '../../components/ui/StatusChip'
import { ProvenanceBadge } from '../../components/ui/ProvenanceBadge'
import { W } from '../../app/canvas/canvasTheme'
import { useAetherService } from '../../services/DataServiceProvider'
import type { FieldMapGeoSelection } from './fieldMapGeoSelection'

export const FieldMapGeoInspector = memo(function FieldMapGeoInspector({
  selection,
  onClear,
}: {
  selection: FieldMapGeoSelection | null
  onClear: () => void
}) {
  const service = useAetherService()
  const prov = service.getProvenanceProfile()

  if (!selection) return null

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
        </div>
      )}

      {selection.kind === 'deposit' && (
        <div className="flex flex-col gap-1 text-[11px]" style={{ color: W.text2 }}>
          <div className="font-bold text-[var(--w-text1)]">{selection.detail.name}</div>
          <div>
            {selection.detail.tonnage_mt} Mt · {selection.detail.treo_ppm} ppm · MREO{' '}
            {selection.detail.mreo_pct}%
          </div>
          <div style={{ color: W.text4 }}>{selection.detail.resource_note}</div>
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
          <div style={{ color: W.text4 }}>{selection.detail.note}</div>
          <div className="font-mono text-[9px]" style={{ color: W.text4 }}>
            {selection.detail.source_ref} · {selection.detail.confidence ?? selection.detail.kind}
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
