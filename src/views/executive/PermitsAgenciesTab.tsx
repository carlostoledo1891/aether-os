import { useMemo, useCallback } from 'react'
import { Building2, Download, Link2 } from 'lucide-react'
import { GlassCard } from '../../components/ui/GlassCard'
import { ExecutivePageIntro } from './ExecutivePageIntro'
import { GlowingIcon } from '../../components/ui/GlowingIcon'
import { StatusChip } from '../../components/ui/StatusChip'
import { SectionLabel } from '../../components/ui/SectionLabel'
import { ProvenanceBadge } from '../../components/ui/ProvenanceBadge'
import { W } from '../../app/canvas/canvasTheme'
import { useAetherService, useTelemetry } from '../../services/DataServiceProvider'
import type { RegulatoryEntry } from '../../services/dataService'

function regulatoryToCsv(rows: RegulatoryEntry[]): string {
  const h = ['id', 'body', 'type', 'date', 'status', 'detail', 'evidenceDocId', 'nextMilestone']
  const esc = (s: string) => `"${String(s).replace(/"/g, '""')}"`
  const lines = [h.join(',')]
  for (const r of rows) {
    lines.push([r.id, r.body, r.type, r.date, r.status, r.detail, r.evidenceDocId ?? '', r.nextMilestone ?? ''].map(x => esc(x)).join(','))
  }
  return lines.join('\n')
}

export function PermitsAgenciesTab() {
  const service = useAetherService()
  const { env } = useTelemetry()
  const regulatory = useMemo(() => service.getRegulatoryLog(), [service])
  const risks = useMemo(() => service.getRiskRegister(), [service])
  const audit = useMemo(() => service.getAuditTrail(), [service])
  const thresholds = useMemo(() => service.getThresholds(), [service])
  const profile = useMemo(() => service.getProvenanceProfile(), [service])
  const spatial = useMemo(() => service.getSpatialInsights(), [service])

  const mpfEntry = useMemo(() => regulatory.find(r => r.id === 'REG-04'), [regulatory])
  const r01 = useMemo(() => risks.find(r => r.id === 'R01'), [risks])
  const linkedAudits = useMemo(
    () => audit.filter(e => r01?.relatedAuditIds?.includes(e.id)),
    [audit, r01],
  )

  const downloadJson = useCallback(() => {
    const bundle = service.getRegulatoryExportBundle()
    const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `aether-regulatory-bundle-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(a.href)
  }, [service])

  const downloadCsv = useCallback(() => {
    const csv = regulatoryToCsv(regulatory)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `aether-regulatory-log-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(a.href)
  }, [regulatory])

  const wq = env.water_quality
  const sulfate = wq.sulfate_ppm

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={downloadJson}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border px-2.5 py-1.5 font-mono text-[9px] font-bold uppercase tracking-wide focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/35"
          style={{ border: `1px solid ${W.cyan}40`, background: `${W.cyan}12`, color: W.cyan }}
        >
          <Download size={12} />
          Export bundle (JSON)
        </button>
        <button
          type="button"
          onClick={downloadCsv}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border px-2.5 py-1.5 font-mono text-[9px] font-bold uppercase tracking-wide focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/35"
          style={{ border: `1px solid ${W.glass12}`, background: W.glass04, color: W.text3 }}
        >
          <Download size={12} />
          Regulatory log (CSV)
        </button>
        <ProvenanceBadge kind={profile.sections.regulatory_log.kind} title={profile.sections.regulatory_log.hint} />
        <ProvenanceBadge kind={profile.sections.audit_ledger.kind} title={profile.sections.audit_ledger.hint} />
        {profile.sections.map_geometry ? (
          <ProvenanceBadge kind={profile.sections.map_geometry.kind} title={profile.sections.map_geometry.hint} />
        ) : null}
      </div>

      <GlassCard animate={false} className="p-4 md:p-5">
        <div className="mb-2 flex items-center gap-2">
          <GlowingIcon icon={Link2} color="cyan" size={14} />
          <SectionLabel>Spatial cross-check (heuristic)</SectionLabel>
        </div>
        <p className="text-[11px] leading-snug" style={{ color: W.text3 }}>
          {spatial.summary}
        </p>
        <p className="mt-2 font-mono text-[9px] leading-snug" style={{ color: W.text4 }}>
          Pilot → PFS plant ≈ {spatial.pilotToPfsPlantKm.toFixed(2)} km · Licence zones overlapping APA buffer (illustrative union):{' '}
          {spatial.licenceZonesInApaBuffer}
        </p>
        <p className="mt-1 font-mono text-[8px] leading-snug" style={{ color: W.text4 }}>
          {spatial.apaHeuristicNote}
        </p>
      </GlassCard>

      <GlassCard animate={false} className="p-4 md:p-5">
        <div className="mb-2 flex items-center gap-2">
          <GlowingIcon icon={Building2} color="amber" size={14} />
          <SectionLabel>Agency matrix — administrative record (rehearsal)</SectionLabel>
        </div>
        <div className="mb-4">
          <ExecutivePageIntro>
            Bodies, instruments, and placeholder document IDs. Verify against filed instruments and portals before external use.
          </ExecutivePageIntro>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left text-[11px]">
            <thead>
              <tr className="border-b border-[color-mix(in_srgb,var(--w-text4)_35%,transparent)]">
                {['Body', 'Instrument', 'Status', 'Date', 'Evidence ref.', 'Next milestone'].map((h) => (
                  <th
                    key={h}
                    className="sticky top-0 z-[1] bg-[var(--w-bg)] py-2 pr-2 text-left text-[10px] font-bold uppercase tracking-wide shadow-[0_1px_0_color-mix(in_srgb,var(--w-text4)_20%,transparent)]"
                    style={{ color: W.text4 }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {regulatory.map((r) => (
                <tr
                  key={r.id}
                  className="border-b transition-colors hover:bg-white/[0.03]"
                  style={{
                    background: r.id === 'REG-04' ? `${W.amber}0A` : undefined,
                    borderBottomColor: W.glass06,
                  }}
                >
                  <td className="py-3 pr-2 font-bold" style={{ color: W.text2 }}>
                    {r.body}
                  </td>
                  <td className="py-3 pr-2" style={{ color: W.text3 }}>
                    {r.type}
                  </td>
                  <td className="py-3 pr-2">
                    <StatusChip
                      label={r.status.replace('_', ' ').toUpperCase()}
                      variant={r.status === 'approved' ? 'green' : r.status === 'submitted' ? 'violet' : r.status === 'in_review' ? 'amber' : 'red'}
                      size="sm"
                    />
                  </td>
                  <td className="py-3 pr-2 font-mono text-[11px]" style={{ color: W.text4 }}>
                    {r.date}
                  </td>
                  <td className="max-w-[140px] py-3 pr-2 font-mono text-[10px]" style={{ color: W.cyan }}>
                    {r.evidenceDocId ?? '—'}
                  </td>
                  <td className="py-3 text-[10px] leading-snug" style={{ color: W.text3 }}>
                    {r.nextMilestone ?? '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {mpfEntry && (
        <GlassCard animate={false} className="p-4 md:p-5" style={{ border: `1px solid ${W.amber}35`, boxShadow: `0 0 20px ${W.amber}12` }}>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <SectionLabel>MPF — cumulative EIA thread</SectionLabel>
            <StatusChip label="CONTESTED" variant="amber" size="sm" />
            <ProvenanceBadge kind="issuer_attested" title="Structured for briefing — confirm against official correspondence" />
          </div>
          <p className="mb-2 text-[11px] leading-snug" style={{ color: W.text2 }}>{mpfEntry.detail}</p>
          <div className="mb-2 font-mono text-[9px]" style={{ color: W.text4 }}>
            Ref: {mpfEntry.evidenceDocId ?? mpfEntry.id} · Last dated: {mpfEntry.date}
          </div>
          <div className="mb-2 text-[10px]" style={{ color: W.text3 }}>
            <span className="font-bold" style={{ color: W.amber }}>Mitigation workstream (illustrative): </span>
            Hydro digital twin + public spring geometry + monitoring annex below — instrument feeds replace simulation pre-LI.
          </div>
          {r01 && (
            <div className="flex flex-wrap items-center gap-2 text-[9px]" style={{ color: W.text4 }}>
              <Link2 size={10} />
              <span>Risk register:</span>
              <span className="font-mono font-bold" style={{ color: W.text2 }}>{r01.id}</span>
              {r01.relatedRegulatoryIds?.map(id => (
                <span key={id} className="font-mono" style={{ color: W.cyan }}>{id}</span>
              ))}
            </div>
          )}
          {linkedAudits.length > 0 && (
            <div className="mt-2 border-t border-white/10 pt-2">
              <span className="mb-1 block text-[9px] font-bold uppercase" style={{ color: W.text4 }}>Linked audit events</span>
              {linkedAudits.map(e => (
                <div key={e.id} className="mb-1 font-mono text-[9px]" style={{ color: W.text3 }}>
                  {e.id} — {e.action} ({new Date(e.timestamp).toLocaleDateString()})
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      )}

      <GlassCard animate={false} className="p-4 md:p-5">
        <SectionLabel>Monitoring annex (demo — discharge &amp; aquifer)</SectionLabel>
        <p className="mb-3 mt-2 text-[11px] leading-snug" style={{ color: W.text4 }}>
          Appendix-style table. Limits align with domain thresholds in mock service; readings from current illustrative telemetry tick.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-[11px]">
            <thead>
              <tr className="border-b border-[color-mix(in_srgb,var(--w-text4)_35%,transparent)]">
                {['Parameter', 'Limit / guard', 'Source', 'Method', 'Last reading', 'Provenance'].map((h) => (
                  <th
                    key={h}
                    className="sticky top-0 z-[1] bg-[var(--w-bg)] py-2 pr-2 text-left text-[10px] font-bold uppercase tracking-wide shadow-[0_1px_0_color-mix(in_srgb,var(--w-text4)_20%,transparent)]"
                    style={{ color: W.text4 }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b transition-colors hover:bg-white/[0.03]" style={{ borderBottomColor: W.glass06 }}>
                <td className="py-3 pr-2 font-semibold" style={{ color: W.text2 }}>
                  Sulfate (discharge)
                </td>
                <td className="py-3 pr-2 font-mono">{thresholds.sulfate_warning_ppm} ppm warn</td>
                <td className="py-3 pr-2">FEAM discharge condition (demo)</td>
                <td className="py-3 pr-2">ISE / inline</td>
                <td className="py-3 pr-2 font-mono">{sulfate.toFixed(0)} ppm</td>
                <td className="py-3">
                  <ProvenanceBadge kind="simulated" />
                </td>
              </tr>
              <tr className="border-b transition-colors hover:bg-white/[0.03]" style={{ borderBottomColor: W.glass06 }}>
                <td className="py-3 pr-2 font-semibold" style={{ color: W.text2 }}>
                  Nitrate (discharge)
                </td>
                <td className="py-3 pr-2 font-mono">{thresholds.nitrate_warning_ppm} ppm warn</td>
                <td className="py-3 pr-2">FEAM discharge condition (demo)</td>
                <td className="py-3 pr-2">ISE</td>
                <td className="py-3 pr-2 font-mono">{wq.nitrate_ppm.toFixed(0)} ppm</td>
                <td className="py-3">
                  <ProvenanceBadge kind="simulated" />
                </td>
              </tr>
              <tr className="transition-colors hover:bg-white/[0.03]">
                <td className="py-3 pr-2 font-semibold" style={{ color: W.text2 }}>
                  Spring locations (map)
                </td>
                <td className="py-3 pr-2">—</td>
                <td className="py-3 pr-2">FBDS/CAR public geometry</td>
                <td className="py-3 pr-2">GeoJSON overlay</td>
                <td className="py-3 pr-2">—</td>
                <td className="py-3">
                  <ProvenanceBadge kind="from_public_record" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  )
}
