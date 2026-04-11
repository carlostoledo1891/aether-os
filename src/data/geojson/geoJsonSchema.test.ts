import { readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { describe, expect, it } from 'vitest'

const __dirname = dirname(fileURLToPath(import.meta.url))

function loadJson(name: string): unknown {
  const p = join(__dirname, name)
  return JSON.parse(readFileSync(p, 'utf8')) as unknown
}

const HOLE_TYPES = new Set(['DD', 'AC', 'AUGER'])
const LICENCE_CONFIDENCE = new Set(['verified_vector', 'georeferenced_figure', 'approximate', 'illustrative'])

describe('Caldeira GeoJSON schema', () => {
  it('caldeira-licenses features have source_ref, as_of, confidence', () => {
    const fc = loadJson('caldeira-licenses.geojson') as {
      type: string
      features: { properties: Record<string, unknown> }[]
    }
    expect(fc.type).toBe('FeatureCollection')
    expect(fc.features.length).toBeGreaterThan(0)
    for (const f of fc.features) {
      const p = f.properties
      expect(typeof p.source_ref).toBe('string')
      expect((p.source_ref as string).length).toBeGreaterThan(0)
      expect(typeof p.as_of).toBe('string')
      expect(LICENCE_CONFIDENCE.has(p.confidence as string)).toBe(true)
    }
  })

  it('caldeira-drillholes features have hole_type DD|AC|AUGER and source_ref', () => {
    const fc = loadJson('caldeira-drillholes.geojson') as {
      type: string
      metadata?: { feature_count?: number; crs_pipeline?: string }
      features: {
        properties: Record<string, unknown>
        geometry: { type: string; coordinates: number[] }
      }[]
    }
    expect(fc.type).toBe('FeatureCollection')
    expect(fc.features.length).toBeGreaterThan(0)
    expect(fc.metadata?.crs_pipeline).toMatch(/EPSG:31983/)
    expect(fc.metadata?.feature_count).toBe(fc.features.length)

    const ids = new Set<string>()
    for (const f of fc.features) {
      const p = f.properties
      expect(HOLE_TYPES.has(p.hole_type as string)).toBe(true)
      expect(typeof p.source_ref).toBe('string')
      const id = p.id as string
      expect(ids.has(id)).toBe(false)
      ids.add(id)
      const [lon, lat] = f.geometry.coordinates
      expect(lon).toBeGreaterThanOrEqual(-46.9)
      expect(lon).toBeLessThanOrEqual(-46.35)
      expect(lat).toBeGreaterThanOrEqual(-22.08)
      expect(lat).toBeLessThanOrEqual(-21.62)
      if (p.easting_utm != null) {
        expect(typeof p.easting_utm).toBe('number')
        expect(typeof p.northing_utm).toBe('number')
        expect(p.crs_epsg).toBe(31983)
      }
    }
  })

  it('AGOAC0107 collar matches appendix UTM band (EPSG:31983 → WGS84)', () => {
    const fc = loadJson('caldeira-drillholes.geojson') as {
      features: { properties: { id?: string }; geometry: { coordinates: number[] } }[]
    }
    const f = fc.features.find((x) => x.properties.id === 'AGOAC0107')
    expect(f).toBeDefined()
    const [lon, lat] = f!.geometry.coordinates
    expect(lon).toBeCloseTo(-46.586, 2)
    expect(lat).toBeCloseTo(-21.911, 2)
  })

  it('split environmental / PFS GeoJSON are valid FeatureCollections', () => {
    for (const file of [
      'caldeira-environmental.geojson',
      'caldeira-apa-pedra-branca.geojson',
      'caldeira-apa-buffer.geojson',
      'caldeira-pfs-engineering.geojson',
      'caldeira-urban-context.geojson',
      'caldeira-boundary.geojson',
      'caldeira-ops-plant-sites.geojson',
    ]) {
      const fc = loadJson(file) as { type: string; features: unknown[] }
      expect(fc.type).toBe('FeatureCollection')
      expect(Array.isArray(fc.features)).toBe(true)
    }
  })

  it('caldeira-ops-plant-sites has pilot + commercial Points with Infra-shaped props', () => {
    const fc = loadJson('caldeira-ops-plant-sites.geojson') as {
      features: { geometry: { type: string }; properties: Record<string, unknown> }[]
    }
    expect(fc.features.length).toBe(2)
    for (const f of fc.features) {
      expect(f.geometry.type).toBe('Point')
      expect(typeof f.properties.id).toBe('string')
      expect(typeof f.properties.label).toBe('string')
      expect(typeof f.properties.kind).toBe('string')
    }
  })
})
