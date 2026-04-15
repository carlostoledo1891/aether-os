import type { FastifyInstance } from 'fastify'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { requireAdminKey } from '../auth/adminApiKey.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SNAPSHOT_ROOT = resolve(__dirname, '..', '..', '..', 'data', 'caldeira', 'snapshots')

const EXTERNAL_IDENTIFY_QUERY_URL: Record<string, string> = {
  sigmine: 'https://geo.anm.gov.br/arcgis/rest/services/SIGMINE/dados_anm/FeatureServer/0/query',
}

function buildArcGisPointQueryUrl(baseUrl: string, lng: number, lat: number) {
  const params = new URLSearchParams({
    where: '1=1',
    returnGeometry: 'false',
    outFields: '*',
    geometry: `${lng},${lat}`,
    geometryType: 'esriGeometryPoint',
    inSR: '4326',
    spatialRel: 'esriSpatialRelIntersects',
    f: 'json',
    resultRecordCount: '1',
  })
  return `${baseUrl}?${params.toString()}`
}

async function fetchIdentifyProperties(layerId: string, lng: number, lat: number) {
  const baseUrl = EXTERNAL_IDENTIFY_QUERY_URL[layerId]
  if (!baseUrl) return null
  const response = await fetch(buildArcGisPointQueryUrl(baseUrl, lng, lat), {
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(20_000),
  })
  if (!response.ok) {
    throw new Error(`Identify failed (${response.status})`)
  }
  const payload = await response.json() as {
    features?: Array<{ attributes?: Record<string, unknown> }>
  }
  return payload.features?.[0]?.attributes ?? null
}

function readSnapshotStatus() {
  if (!existsSync(SNAPSHOT_ROOT)) return []
  return readdirSync(SNAPSHOT_ROOT, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => {
      const metaPath = resolve(SNAPSHOT_ROOT, entry.name, 'latest.meta.json')
      if (!existsSync(metaPath)) {
        return {
          snapshotSourceId: entry.name,
          status: 'missing',
        }
      }
      const meta = JSON.parse(readFileSync(metaPath, 'utf8')) as Record<string, unknown>
      return {
        snapshotSourceId: entry.name,
        status: meta.last_refresh_error ? 'error' : 'ready',
        ...meta,
      }
    })
}

export async function mapLayerRoutes(app: FastifyInstance) {
  app.get<{ Params: { layerId: string }; Querystring: { lng: string; lat: string } }>('/api/geo/external-layers/:layerId/identify', {
    schema: {
      tags: ['project'],
      summary: 'Proxy identify/query for approved external layers',
      params: {
        type: 'object',
        properties: {
          layerId: { type: 'string' },
        },
        required: ['layerId'],
      },
      querystring: {
        type: 'object',
        properties: {
          lng: { type: 'string' },
          lat: { type: 'string' },
        },
        required: ['lng', 'lat'],
      },
    },
  }, async (req, reply) => {
    const lng = Number(req.query.lng)
    const lat = Number(req.query.lat)
    if (!Number.isFinite(lng) || !Number.isFinite(lat)) {
      return reply.code(400).send({ error: 'Invalid coordinates' })
    }

    try {
      const properties = await fetchIdentifyProperties(req.params.layerId, lng, lat)
      return { ok: true, layerId: req.params.layerId, properties }
    } catch (error) {
      return reply.code(502).send({
        error: error instanceof Error ? error.message : 'Identify failed',
      })
    }
  })

  app.get('/api/admin/map-layers/status', {
    schema: {
      tags: ['project'],
      summary: 'Read cached snapshot status for external map layers',
      security: [{ apiKey: [] }],
    },
  }, async (req, reply) => {
    if (!requireAdminKey(req as never, reply as never)) return
    return {
      entries: readSnapshotStatus(),
    }
  })
}
