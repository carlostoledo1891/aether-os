/**
 * Fetches provider-scoped map datasets around Caldeira and normalizes them
 * into stable frontend GeoJSON snapshots.
 *
 * Run: npm run build:caldeira-external-snapshots
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  CALDEIRA_EXTERNAL_SNAPSHOT_SOURCES,
  type CaldeiraExternalSnapshotSource,
} from '../../shared/sites/caldeiraLayers.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '../..')
const SNAPSHOT_ROOT = join(ROOT, 'data/caldeira/snapshots')
const OUT_ROOT = join(ROOT, 'src/data/geojson/external')

const CALDEIRA_BBOX = {
  xmin: -46.72,
  ymin: -22.06,
  xmax: -46.39,
  ymax: -21.75,
  wkid: 4326,
} as const

interface GeoJsonFeature {
  type: 'Feature'
  geometry: Record<string, unknown> | null
  properties: Record<string, unknown>
}

interface GeoJsonFeatureCollection {
  type: 'FeatureCollection'
  features: GeoJsonFeature[]
  metadata?: Record<string, unknown>
}

function writeJson(path: string, value: unknown) {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, 'utf8')
}

function readJson(path: string): GeoJsonFeatureCollection {
  return JSON.parse(readFileSync(path, 'utf8')) as GeoJsonFeatureCollection
}

function buildArcGisEnvelopeQueryUrl(baseUrl: string) {
  const params = new URLSearchParams({
    where: '1=1',
    returnGeometry: 'true',
    outFields: '*',
    geometry: [
      CALDEIRA_BBOX.xmin,
      CALDEIRA_BBOX.ymin,
      CALDEIRA_BBOX.xmax,
      CALDEIRA_BBOX.ymax,
    ].join(','),
    geometryType: 'esriGeometryEnvelope',
    inSR: String(CALDEIRA_BBOX.wkid),
    spatialRel: 'esriSpatialRelIntersects',
    outSR: String(CALDEIRA_BBOX.wkid),
    f: 'geojson',
  })
  return `${baseUrl}?${params.toString()}`
}

async function fetchJson(url: string): Promise<GeoJsonFeatureCollection> {
  const response = await fetch(url, {
    headers: {
      Accept: 'application/geo+json, application/json',
    },
    signal: AbortSignal.timeout(60_000),
  })
  if (!response.ok) {
    throw new Error(`Fetch failed (${response.status}) for ${url}`)
  }
  const data = await response.json() as GeoJsonFeatureCollection
  if (data.type !== 'FeatureCollection' || !Array.isArray(data.features)) {
    throw new Error(`Unexpected payload shape for ${url}`)
  }
  return data
}

function withCommonMetadata(
  sourceId: string,
  sourceLabel: string,
  fetchedAt: string,
  featureCount: number,
  extra: Record<string, unknown> = {},
) {
  return {
    source_id: sourceId,
    source_label: sourceLabel,
    fetched_at: fetchedAt,
    feature_count: featureCount,
    bbox: CALDEIRA_BBOX,
    ...extra,
  }
}

function coerceString(value: unknown) {
  if (value == null) return null
  const str = String(value).trim()
  return str || null
}

function coerceNumber(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

function normalizeGeosgb(
  data: GeoJsonFeatureCollection,
  fetchedAt: string,
): GeoJsonFeatureCollection {
  const features = data.features.map((feature, index) => {
    const props = feature.properties
    const unitCode = coerceString(props.SIGLA)
    const unitName = coerceString(props.NOME)
    return {
      type: 'Feature' as const,
      geometry: feature.geometry,
      properties: {
        id: coerceString(props.ID_UNIDADE_ESTRATIGRAFICA) ?? `geosgb-${index + 1}`,
        label: [unitCode, unitName].filter(Boolean).join(' · '),
        unit_code: unitCode,
        unit_name: unitName,
        hierarchy: coerceString(props.HIERARQUIA),
        legend: coerceString(props.LEGENDA),
        parent_code: coerceString(props.SIGLA_PAI),
        parent_name: coerceString(props.NOME_PAI),
        tectonic_environment: coerceString(props.AMBIENTE_TECTONICO),
        sub_tectonic_environment: coerceString(props.SUB_AMBIENTE_TECTONICO),
        lithologies: coerceString(props.LITOTIPOS),
        era_min: coerceString(props.ERA_MIN),
        era_max: coerceString(props.ERA_MAX),
        source_ref: 'geosgb_minas_gerais_1m_2021',
      },
    }
  })

  return {
    type: 'FeatureCollection',
    metadata: withCommonMetadata(
      'snapshot:geosgb-geology',
      'GeoSGB geology',
      fetchedAt,
      features.length,
      {
        provider: 'Serviço Geológico do Brasil',
        geometry_kind: 'polygon',
      },
    ),
    features,
  }
}

function normalizeAnm(
  data: GeoJsonFeatureCollection,
  fetchedAt: string,
): GeoJsonFeatureCollection {
  const features = data.features.map((feature, index) => {
    const props = feature.properties
    const unitCode = coerceString(props.SGUnidade)
    const unitName = coerceString(props.NMUnidade)
    return {
      type: 'Feature' as const,
      geometry: feature.geometry,
      properties: {
        id: coerceString(props.OBJECTID) ?? `anm-${index + 1}`,
        label: [unitCode, unitName].filter(Boolean).join(' · '),
        unit_code: unitCode,
        unit_name: unitName,
        hierarchy: coerceString(props.NMHierarquia),
        era_max: coerceString(props.NMEraMaxima),
        lithology_primary: coerceString(props.NMLitotipo1),
        lithology_secondary: coerceString(props.NMLitotipo2),
        rock_class: coerceString(props.DSClasseRocha),
        source_ref: 'anm_sigmine_geociencias_geologia',
      },
    }
  })

  return {
    type: 'FeatureCollection',
    metadata: withCommonMetadata(
      'snapshot:anm-geology',
      'ANM geology',
      fetchedAt,
      features.length,
      {
        provider: 'Agência Nacional de Mineração',
        geometry_kind: 'polygon',
      },
    ),
    features,
  }
}

function normalizeSigmine(
  data: GeoJsonFeatureCollection,
  fetchedAt: string,
): GeoJsonFeatureCollection {
  const features = data.features.map((feature, index) => {
    const props = feature.properties
    const process = coerceString(props.PROCESSO)
    const substance = coerceString(props.SUBS)
    return {
      type: 'Feature' as const,
      geometry: feature.geometry,
      properties: {
        id: coerceString(props.ID) ?? process ?? `sigmine-${index + 1}`,
        label: [process, substance].filter(Boolean).join(' · '),
        process_number: process,
        process_display: coerceString(props.DSProcesso),
        phase: coerceString(props.FASE),
        holder_name: coerceString(props.NOME),
        substance,
        use_class: coerceString(props.USO),
        area_ha: coerceNumber(props.AREA_HA),
        uf: coerceString(props.UF),
        latest_event: coerceString(props.ULT_EVENTO),
        source_ref: 'sigmine_processos_minerarios_ativos',
      },
    }
  })

  return {
    type: 'FeatureCollection',
    metadata: withCommonMetadata(
      'snapshot:sigmine-tenements',
      'SIGMINE tenements',
      fetchedAt,
      features.length,
      {
        provider: 'Agência Nacional de Mineração',
        geometry_kind: 'polygon',
      },
    ),
    features,
  }
}

function normalizeSnirh(
  data: GeoJsonFeatureCollection,
  fetchedAt: string,
): GeoJsonFeatureCollection {
  const features = data.features.map((feature, index) => {
    const props = feature.properties
    const code = coerceString(props.Codigo)
    const name = coerceString(props.Nome)
    return {
      type: 'Feature' as const,
      geometry: feature.geometry,
      properties: {
        id: code ?? `snirh-${index + 1}`,
        label: [code, name].filter(Boolean).join(' · '),
        station_code: code,
        station_name: name,
        station_type: coerceString(props.TipoEstacao),
        operating: coerceString(props.Operando),
        municipality: coerceString(props.Municipio),
        state: coerceString(props.UF),
        river: coerceString(props.Rio),
        basin: coerceString(props.Bacia),
        sub_basin: coerceString(props.SubBacia),
        drainage_area_km2: coerceNumber(props.AreaDrenagem),
        altitude_m: coerceNumber(props.Altitude),
        latitude: coerceNumber(props.Latitude),
        longitude: coerceNumber(props.Longitude),
        source_ref: 'snirh_estacoes_hidrometeorologicas',
      },
    }
  })

  return {
    type: 'FeatureCollection',
    metadata: withCommonMetadata(
      'snapshot:snirh-hidroweb',
      'SNIRH Hidroweb stations',
      fetchedAt,
      features.length,
      {
        provider: 'ANA / SNIRH',
        geometry_kind: 'point',
      },
    ),
    features,
  }
}

const SNAPSHOT_NORMALIZERS = {
  geosgb: normalizeGeosgb,
  sigmine: normalizeSigmine,
  anm: normalizeAnm,
  snirh: normalizeSnirh,
} as const satisfies Record<CaldeiraExternalSnapshotSource['normalizer'], (data: GeoJsonFeatureCollection, fetchedAt: string) => GeoJsonFeatureCollection>

async function buildOne(source: CaldeiraExternalSnapshotSource) {
  const providerDir = join(SNAPSHOT_ROOT, source.snapshotSourceId)
  const rawPath = join(providerDir, 'latest.raw.json')
  const metaPath = join(providerDir, 'latest.meta.json')
  const outPath = join(OUT_ROOT, source.outputFile)
  const fetchedAt = new Date().toISOString()
  const normalize = SNAPSHOT_NORMALIZERS[source.normalizer]

  mkdirSync(providerDir, { recursive: true })
  mkdirSync(OUT_ROOT, { recursive: true })

  try {
    const raw = await fetchJson(source.queryUrl)
    const normalized = normalize(raw, fetchedAt)

    writeJson(rawPath, raw)
    writeJson(metaPath, {
      layer_id: source.id,
      source_id: source.snapshotSourceId,
      source_label: source.label,
      fetched_at: fetchedAt,
      query_url: source.queryUrl,
      feature_count: raw.features.length,
      bbox: CALDEIRA_BBOX,
    })
    writeJson(outPath, normalized)
    console.log(`Wrote ${normalized.features.length} normalized features -> ${source.outputFile}`)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.warn(`[external-snapshots] ${source.snapshotSourceId}: ${message}`)
    if (existsSync(outPath) && existsSync(metaPath)) {
      const existing = readJson(outPath)
      const existingMeta = JSON.parse(readFileSync(metaPath, 'utf8')) as Record<string, unknown>
      writeJson(metaPath, {
        ...existingMeta,
        last_refresh_attempt_at: fetchedAt,
        last_refresh_error: message,
        preserved_last_good_snapshot: true,
      })
      console.log(
        `Kept last good snapshot for ${source.snapshotSourceId} (${existing.features.length} features)`,
      )
      return
    }
    throw error
  }
}

async function main() {
  for (const source of CALDEIRA_EXTERNAL_SNAPSHOT_SOURCES.map(source => ({
    ...source,
    queryUrl: buildArcGisEnvelopeQueryUrl(source.queryUrl),
  }))) {
    await buildOne(source)
  }
}

void main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
