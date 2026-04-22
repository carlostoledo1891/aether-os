/**
 * InstanceContext — provides the active InstanceConfig to anything
 * inside the workspace tree. Routes mount the provider; children read
 * via useInstance().
 *
 * Composition only: this provider does not own any data fetching, any
 * DataServiceProvider wiring, or any chrome rendering. It is a thin
 * carrier for the per-instance config object.
 */

import { createContext, useContext, useEffect, type ReactNode } from 'react'
import { getInstance, rememberInstance } from '../config/instances'
import type { InstanceConfig, InstanceSlug } from '../config/instances'

const InstanceContext = createContext<InstanceConfig | null>(null)

interface InstanceProviderProps {
  slug: InstanceSlug
  /** When true, persist this instance as the "last visited" hint. Defaults true for selectable instances. */
  remember?: boolean
  children: ReactNode
}

export function InstanceProvider({ slug, remember, children }: InstanceProviderProps) {
  const instance = getInstance(slug)

  useEffect(() => {
    const shouldRemember = remember ?? instance.selectable
    if (shouldRemember) {
      rememberInstance(instance.slug)
    }
  }, [instance.slug, instance.selectable, remember])

  return (
    <InstanceContext.Provider value={instance}>
      {children}
    </InstanceContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useInstance(): InstanceConfig {
  const ctx = useContext(InstanceContext)
  if (!ctx) {
    throw new Error('useInstance must be used inside an <InstanceProvider>')
  }
  return ctx
}

/** Non-throwing variant for callers (e.g. cross-instance chrome) that may render outside any instance. */
// eslint-disable-next-line react-refresh/only-export-components
export function useOptionalInstance(): InstanceConfig | null {
  return useContext(InstanceContext)
}
