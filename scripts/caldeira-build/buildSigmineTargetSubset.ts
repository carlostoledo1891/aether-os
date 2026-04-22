import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '../..')

const TARGET_MANIFEST = join(ROOT, 'data/caldeira/target-licenses.json')
const SIGMINE_SNAPSHOT = join(ROOT, 'src/data/geojson/external/caldeira-sigmine-tenements.geojson')
const OUT_TARGETS = join(ROOT, 'src/data/geojson/external/caldeira-sigmine-target-tenements.geojson')

interface Feature {
  type: 'Feature'
  geometry: Record<string, unknown> | null
  properties: Record<string, unknown>
}

interface FeatureCollection {
  type: 'FeatureCollection'
  features: Feature[]
  metadata?: Record<string, unknown>
}

interface TargetLicenseEntry {
  license_id: string
  license_name: string
  selected_process_numbers: string[]
  candidate_process_numbers?: string[]
  notes?: string
}

interface TargetLicenseManifest {
  version: number
  updated_at: string
  source_snapshot: string
  match_method: string
  licenses: TargetLicenseEntry[]
}

function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(path, 'utf8')) as T
}

function writeJson(path: string, value: unknown) {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, 'utf8')
}

function unique<T>(items: T[]): T[] {
  return [...new Set(items)]
}

function main() {
  const manifest = readJson<TargetLicenseManifest>(TARGET_MANIFEST)
  const sigmine = readJson<FeatureCollection>(SIGMINE_SNAPSHOT)

  const licensesByProcess = new Map<string, TargetLicenseEntry[]>()
  for (const license of manifest.licenses) {
    for (const process of license.selected_process_numbers) {
      const existing = licensesByProcess.get(process) ?? []
      existing.push(license)
      licensesByProcess.set(process, existing)
    }
  }

  const features = sigmine.features
    .filter(feature => {
      const process = feature.properties.process_number
      return typeof process === 'string' && licensesByProcess.has(process)
    })
    .map(feature => {
      const process = String(feature.properties.process_number)
      const matchedLicenses = licensesByProcess.get(process) ?? []
      return {
        ...feature,
        properties: {
          ...feature.properties,
          target_license_ids: matchedLicenses.map(license => license.license_id),
          target_license_names: matchedLicenses.map(license => license.license_name),
          target_license_notes: matchedLicenses
            .map(license => license.notes)
            .filter((note): note is string => typeof note === 'string' && note.length > 0),
          source_ref: 'sigmine_target_processos_curated',
        },
      } satisfies Feature
    })

  const output: FeatureCollection = {
    type: 'FeatureCollection',
    metadata: {
      generated_at: new Date().toISOString(),
      source_manifest: 'data/caldeira/target-licenses.json',
      source_snapshot: 'src/data/geojson/external/caldeira-sigmine-tenements.geojson',
      manifest_updated_at: manifest.updated_at,
      manifest_version: manifest.version,
      feature_count: features.length,
      selected_process_count: unique(
        manifest.licenses.flatMap(license => license.selected_process_numbers),
      ).length,
      target_license_ids: manifest.licenses.map(license => license.license_id),
      match_method: manifest.match_method,
    },
    features,
  }

  writeJson(OUT_TARGETS, output)
  console.log(`Wrote ${features.length} SIGMINE target features -> ${OUT_TARGETS}`)
}

main()
