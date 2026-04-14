import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, Link2, RefreshCw } from 'lucide-react'
import { CALDEIRA_EXTERNAL_LAYERS } from 'shared/sites/caldeira'
import { W } from '../../app/canvas/canvasTheme'
import { StatusChip } from '../../components/ui/StatusChip'
import { DataSourceBadge } from '../../components/ui/DataSourceBadge'
import { ProvenanceBadge } from '../../components/ui/ProvenanceBadge'

interface SnapshotStatusEntry {
  snapshotSourceId: string
  status: 'ready' | 'error' | 'missing'
  fetched_at?: string
  feature_count?: number
  last_refresh_attempt_at?: string
  last_refresh_error?: string
}

function adminHeaders(): HeadersInit {
  const key = (import.meta.env.VITE_ADMIN_API_KEY as string | undefined) ?? ''
  return key ? { 'x-api-key': key } : {}
}

function inputStyle(): React.CSSProperties {
  return {
    width: '100%',
    padding: '8px 10px',
    fontSize: 12,
    background: W.glass04,
    border: W.chromeBorder,
    borderRadius: W.radius.sm,
    color: W.text1,
    outline: 'none',
  }
}

function parseAgencyLayerUrl(raw: string) {
  if (!raw) return null
  try {
    const url = new URL(raw)
    const isWms = /service=wms/i.test(url.search) || /geoserver\/ows/i.test(url.pathname)
    if (isWms) {
      const layerName = url.searchParams.get('LAYERS') ?? url.searchParams.get('layers')
      return {
        sourceType: 'wms',
        serviceBaseUrl: `${url.origin}${url.pathname}`,
        layerId: layerName ?? 'unknown',
        queryUrl: 'Prefer a snapshot query or provider-specific API before enabling live identify.',
      }
    }

    const match = raw.match(/(.*?\/(?:MapServer|FeatureServer))(?:\/(\d+))?(?:\/(query|export|legend))?$/i)
    if (!match) return null
    const [, serviceBaseUrl, layerId = '0'] = match
    const numericLayerId = Number(layerId)
    return {
      sourceType: 'arcgis-rest',
      serviceBaseUrl,
      layerId: Number.isFinite(numericLayerId) ? numericLayerId : layerId,
      queryUrl: `${serviceBaseUrl}/${layerId}/query`,
      legendUrl: `${serviceBaseUrl}/legend?f=pjson`,
    }
  } catch {
    return null
  }
}

export default function MapLayersPage() {
  const [entries, setEntries] = useState<SnapshotStatusEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [serviceUrl, setServiceUrl] = useState('')

  useEffect(() => {
    let alive = true
    async function load() {
      setLoading(true)
      try {
        const response = await fetch('/api/admin/map-layers/status', {
          headers: adminHeaders(),
        })
        if (!response.ok) throw new Error(`Failed to load layer status (${response.status})`)
        const payload = await response.json() as { entries: SnapshotStatusEntry[] }
        if (alive) setEntries(payload.entries)
      } catch (error) {
        console.error('[MapLayersPage] status', error)
        if (alive) setEntries([])
      }
      if (alive) setLoading(false)
    }
    void load()
    return () => {
      alive = false
    }
  }, [])

  const statusBySnapshotId = useMemo(
    () => new Map(entries.map(entry => [entry.snapshotSourceId, entry])),
    [entries],
  )
  const parsedImport = useMemo(() => parseAgencyLayerUrl(serviceUrl), [serviceUrl])

  return (
    <div style={{ minHeight: '100vh', background: W.bg, color: W.text1, padding: '24px 32px', fontFamily: 'var(--font-sans)' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <a href="/" style={{ color: W.text3, textDecoration: 'none' }}><ArrowLeft size={18} /></a>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Agency Map Layers</h1>
            <div style={{ fontSize: 11, color: W.text4, marginTop: 4 }}>
              Internal catalog for approved ArcGIS/WMS sources, snapshot freshness, and import preview.
            </div>
          </div>
          <div style={{ flex: 1 }} />
          <a
            href="/admin/knowledge"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 10px',
              borderRadius: W.radius.sm,
              background: W.glass04,
              border: W.chromeBorder,
              color: W.text2,
              textDecoration: 'none',
              fontSize: 11,
              fontWeight: 600,
            }}
          >
            Knowledge Admin
          </a>
        </div>

        <section
          style={{
            background: W.glass03,
            border: W.chromeBorder,
            borderRadius: W.radius.md,
            padding: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Link2 size={15} color={W.cyan} />
            <div style={{ fontSize: 12, fontWeight: 700 }}>Agency URL Import Preview</div>
          </div>
          <input
            value={serviceUrl}
            onChange={event => setServiceUrl(event.target.value)}
            placeholder="Paste an ArcGIS MapServer / FeatureServer / WMS URL"
            style={inputStyle()}
          />
          <div style={{ fontSize: 11, color: W.text4 }}>
            This preview does not persist changes. It normalizes a candidate source into the fields needed for the typed layer catalog.
          </div>
          <pre
            style={{
              margin: 0,
              padding: 12,
              borderRadius: W.radius.sm,
              background: W.glass02,
              border: W.chromeBorder,
              color: W.text2,
              fontSize: 11,
              overflowX: 'auto',
            }}
          >
            {parsedImport
              ? JSON.stringify(parsedImport, null, 2)
              : '{\n  "sourceType": "arcgis-rest | wms",\n  "serviceBaseUrl": "",\n  "layerId": 0,\n  "queryUrl": "",\n  "legendUrl": ""\n}'}
          </pre>
        </section>

        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 14 }}>
          {CALDEIRA_EXTERNAL_LAYERS.map(layer => {
            const status = layer.snapshotSourceId ? statusBySnapshotId.get(layer.snapshotSourceId) : undefined
            return (
              <article
                key={layer.id}
                style={{
                  background: W.glass03,
                  border: W.chromeBorder,
                  borderRadius: W.radius.md,
                  padding: 14,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{layer.label}</div>
                    <div style={{ fontSize: 10, color: W.text4, marginTop: 2 }}>
                      {layer.provider ?? 'Unknown provider'} · {layer.renderMode ?? 'snapshot-geojson'}
                    </div>
                  </div>
                  <StatusChip
                    label={status?.status ?? (loading ? 'LOADING' : 'UNTRACKED')}
                    variant={
                      status?.status === 'ready'
                        ? 'green'
                        : status?.status === 'error'
                          ? 'red'
                          : 'amber'
                    }
                    size="sm"
                  />
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  <DataSourceBadge kind="api" label={layer.identifyMode === 'arcgis-query' ? 'ArcGIS query' : 'Snapshot'} />
                  <ProvenanceBadge kind="from_public_record" title={layer.provider ?? layer.label} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 8, fontSize: 10 }}>
                  <InfoCell label="Layer id" value={layer.id} />
                  <InfoCell label="API source" value={layer.apiSourceId ?? '—'} />
                  <InfoCell label="Query URL" value={layer.queryUrl ?? '—'} />
                  <InfoCell label="Raster URL" value={layer.url ?? '—'} />
                  <InfoCell label="Snapshot path" value={layer.snapshotPath ?? '—'} />
                  <InfoCell
                    label="Last refresh"
                    value={status?.fetched_at ?? status?.last_refresh_attempt_at ?? '—'}
                  />
                </div>

                {layer.legendItems && layer.legendItems.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    <div style={{ fontSize: 10, fontWeight: 600, color: W.text3, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Legend
                    </div>
                    {layer.legendItems.map(item => (
                      <div key={`${layer.id}-${item.label}`} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: W.text3 }}>
                        <span
                          style={{
                            width: item.symbol === 'line' ? 14 : 10,
                            height: item.symbol === 'line' ? 2 : 10,
                            borderRadius: item.symbol === 'circle' ? '50%' : 2,
                            background: item.symbol === 'line' ? item.strokeColor ?? item.color ?? W.text4 : item.color ?? 'transparent',
                            border: item.symbol === 'line' ? undefined : `1px solid ${item.strokeColor ?? item.color ?? W.text4}`,
                            flexShrink: 0,
                          }}
                        />
                        <span>{item.label}</span>
                      </div>
                    ))}
                  </div>
                )}

                {status?.last_refresh_error && (
                  <div
                    style={{
                      padding: '8px 10px',
                      borderRadius: W.radius.sm,
                      background: `${W.red}10`,
                      border: `1px solid ${W.red}25`,
                      color: W.text3,
                      fontSize: 10,
                      lineHeight: 1.45,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <RefreshCw size={10} color={W.red} />
                      Snapshot refresh warning
                    </div>
                    {status.last_refresh_error}
                  </div>
                )}
              </article>
            )
          })}
        </section>
      </div>
    </div>
  )
}

function InfoCell({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
      <span style={{ fontSize: 9, color: W.text4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
      <span style={{ color: W.text2, lineHeight: 1.45, wordBreak: 'break-word' }}>{value}</span>
    </div>
  )
}
