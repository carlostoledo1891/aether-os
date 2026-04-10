import type { ViewManifest } from '../types'
import { PREFEITURA_MANIFEST } from './prefeitura'

const PRESETS: Record<string, ViewManifest> = {
  [PREFEITURA_MANIFEST.id]: PREFEITURA_MANIFEST,
}

const sandboxCache = new Map<string, ViewManifest>()

const SANDBOX_LOADERS: Record<string, () => Promise<{ default: ViewManifest }>> = {
  'prefeitura-pocos': () => import('../sandbox/prefeitura/manifest.json'),
}

export function getPresetManifest(id: string): ViewManifest | undefined {
  return PRESETS[id] ?? sandboxCache.get(id)
}

export async function loadSandboxManifest(id: string): Promise<ViewManifest | undefined> {
  const cached = sandboxCache.get(id)
  if (cached) return cached

  const loader = SANDBOX_LOADERS[id]
  if (!loader) return undefined

  const mod = await loader()
  const manifest = mod.default as ViewManifest
  sandboxCache.set(id, manifest)
  return manifest
}

export function listPresets(): string[] {
  return [...Object.keys(PRESETS), ...Object.keys(SANDBOX_LOADERS).filter(k => !PRESETS[k])]
}
