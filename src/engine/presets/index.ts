import type { ViewManifest } from '../types'
import { PREFEITURA_MANIFEST } from './prefeitura'

const PRESETS: Record<string, ViewManifest> = {
  [PREFEITURA_MANIFEST.id]: PREFEITURA_MANIFEST,
}

export function getPresetManifest(id: string): ViewManifest | undefined {
  return PRESETS[id]
}

export function listPresets(): string[] {
  return Object.keys(PRESETS)
}
