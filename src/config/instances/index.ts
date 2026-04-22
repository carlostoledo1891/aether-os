/**
 * Instance registry. Lookup by slug; falls back to the empty instance
 * for unknown values rather than throwing — so a malformed share-link
 * never crashes the workspace shell.
 */

import { METEORIC_INSTANCE } from './meteoric'
import { MARITIME_INSTANCE } from './maritime'
import { EMPTY_INSTANCE } from './_empty'
import type { InstanceConfig, InstanceSlug } from './types'

export const INSTANCES: Record<InstanceSlug, InstanceConfig> = {
  meteoric: METEORIC_INSTANCE,
  maritime: MARITIME_INSTANCE,
  _empty: EMPTY_INSTANCE,
}

/** Selectable instances, in the order they appear in the EmptyShell picker. */
export const SELECTABLE_INSTANCES: InstanceConfig[] = [
  METEORIC_INSTANCE,
  MARITIME_INSTANCE,
]

/** localStorage key used to remember the most-recently-visited instance. */
export const LAST_INSTANCE_KEY = 'vero.lastInstance'

export function getInstance(slug: string | undefined | null): InstanceConfig {
  if (!slug) return EMPTY_INSTANCE
  const cleaned = slug.trim() as InstanceSlug
  return INSTANCES[cleaned] ?? EMPTY_INSTANCE
}

/** Read the remembered instance slug from localStorage; null if absent or SSR. */
export function readLastInstance(): InstanceSlug | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(LAST_INSTANCE_KEY)
    if (!raw) return null
    if (raw === 'meteoric' || raw === 'maritime') return raw
    return null
  } catch {
    return null
  }
}

/** Persist the most-recently-visited instance slug (best-effort, never throws). */
export function rememberInstance(slug: InstanceSlug): void {
  if (typeof window === 'undefined') return
  try {
    if (slug === '_empty') {
      window.localStorage.removeItem(LAST_INSTANCE_KEY)
    } else {
      window.localStorage.setItem(LAST_INSTANCE_KEY, slug)
    }
  } catch {
    // localStorage may be unavailable (private mode, quota); silent fallback.
  }
}

export type { InstanceConfig, InstanceSlug } from './types'
