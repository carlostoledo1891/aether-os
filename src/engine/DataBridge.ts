import type { AetherDataService } from '../services/dataService'

/**
 * Resolves a `dataQuery` string from a WidgetConfig into actual data
 * by calling the matching method on AetherDataService.
 */
export async function resolveQuery(
  service: AetherDataService,
  queryName: string,
): Promise<unknown> {
  const method = (service as Record<string, unknown>)[queryName]
  if (typeof method !== 'function') {
    console.warn(`DataBridge: unknown query "${queryName}"`)
    return undefined
  }
  return method.call(service)
}

/**
 * Resolve a dot-path on a data object: "items.0.name" → obj.items[0].name
 */
export function resolvePath(data: unknown, path: string): unknown {
  if (!path) return data
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc == null) return undefined
    if (typeof acc === 'object') return (acc as Record<string, unknown>)[key]
    return undefined
  }, data)
}
