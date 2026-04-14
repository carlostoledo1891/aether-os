import { ENGINE_CONFIG, ingestHeaders } from '../config.js'
import { getEngineApiSource } from '../apiRegistry.js'

const { baseUrl: USGS_BASE } = getEngineApiSource('usgs-seismic')

export async function fetchAndIngestSeismic(): Promise<void> {
  const { latitude, longitude, radiusKm } = ENGINE_CONFIG.usgs
  const startDate = new Date()
  startDate.setFullYear(startDate.getFullYear() - 1)

  const url = `${USGS_BASE}?format=geojson&latitude=${latitude}&longitude=${longitude}&maxradiuskm=${radiusKm}&starttime=${startDate.toISOString().slice(0, 10)}&limit=50`

  const res = await fetch(url)
  if (!res.ok) throw new Error(`USGS HTTP ${res.status}`)

  const json = await res.json() as {
    features?: Array<{
      id: string
      properties: { mag: number; place: string; time: number }
      geometry: { coordinates: [number, number, number] }
    }>
  }

  const features = json.features ?? []
  const events = features.map(f => ({
    id: f.id,
    magnitude: f.properties.mag,
    place: f.properties.place ?? 'Unknown',
    time: new Date(f.properties.time).toISOString(),
    latitude: f.geometry.coordinates[1],
    longitude: f.geometry.coordinates[0],
    depth_km: f.geometry.coordinates[2],
  }))

  if (events.length === 0) {
    console.log('[usgs] No seismic events in radius')
    return
  }

  const payload = {
    source: 'usgs',
    provenance: 'from_public_record',
    timestamp: new Date().toISOString(),
    events,
  }

  const ingestRes = await fetch(`${ENGINE_CONFIG.apiBaseUrl}/ingest/seismic`, {
    method: 'POST',
    headers: ingestHeaders(),
    body: JSON.stringify(payload),
  })
  if (!ingestRes.ok) throw new Error(`Ingest seismic failed: ${ingestRes.status}`)

  console.log(`[usgs] Ingested ${events.length} seismic events`)
}

export function startUsgsEnricher() {
  if (!ENGINE_CONFIG.usgs.enabled) {
    console.log('[usgs] Disabled')
    return
  }

  console.log(`[usgs] Starting (interval: ${ENGINE_CONFIG.usgs.intervalMs / 3600000} h)`)

  const run = () => fetchAndIngestSeismic().catch(err => console.warn('[usgs]', err.message))
  run()
  setInterval(run, ENGINE_CONFIG.usgs.intervalMs)
}
