/**
 * Two-layer cache architecture:
 * - Layer 1 (authoritative): `liveDataService` — TTL per endpoint.
 *   This is the staleness boundary. When TTL expires, the next call hits
 *   the network. Most endpoints use 30s; geological, financial, and
 *   resource-classification endpoints use TTL=0 (always fresh) per
 *   De Carvalho's principle: "Never show a stale number for geology."
 * - Layer 2 (dedup only): `useServiceQuery` — 200ms window to coalesce
 *   identical hook mounts. NOT a freshness cache. If the dedup window
 *   expires, a re-fetch hits Layer 1 (which may still be within its TTL).
 *
 * SCADA integrator contract: Layer 1 is authoritative for staleness.
 * Layer 2 is a mount-coalescing optimization only — it never extends the
 * freshness window beyond what Layer 1 allows.
 */
import { useState, useEffect, useRef } from 'react'
import { useAetherService } from '../services/DataServiceProvider'
import type { AetherDataService } from '../services/dataService'

interface QueryState<T> {
  data: T | undefined
  isLoading: boolean
  error: Error | null
}

type Selector<T> = (service: AetherDataService) => T | Promise<T>

const inflightCache = new Map<string, Promise<unknown>>()
const dataCache = new Map<string, { data: unknown; at: number }>()

const DEDUP_WINDOW_MS = 200

/** @internal Test-only — clears both dedup and inflight caches between tests. */
export function __clearCacheForTesting(): void {
  inflightCache.clear()
  dataCache.clear()
}

/**
 * Duck-type check for promise-like values.
 * Uses `.then` property detection (not `instanceof Promise`) for cross-realm
 * compatibility. Any object with a `.then` method will be treated as async.
 * This is intentional -- service methods should never return plain objects
 * with a `.then` property.
 */
function isThenable(val: unknown): val is Promise<unknown> {
  return val != null && typeof (val as Promise<unknown>).then === 'function'
}

/**
 * Hook that bridges sync (mock) and async (live) service methods.
 * Returns { data, isLoading, error } — components render safely
 * regardless of whether the service returns data immediately or via fetch.
 *
 * INVARIANT: `selector` is stored in a `useRef` and excluded from effect deps
 * to prevent infinite re-renders from inline arrow functions. This means
 * `selector` must ONLY reference stable service methods, not local variables
 * or props that change. For selectors that depend on dynamic arguments, use
 * `useServiceQueryWithArg` instead.
 *
 * @example
 * // CORRECT — selector references only the service parameter:
 * useServiceQuery('risks', s => s.getRiskRegister())
 *
 * // WRONG — selector captures `range` from component scope.
 * // The ref pattern means the hook will silently use the INITIAL value
 * // of `range` forever. Use useServiceQueryWithArg instead:
 * // BAD:  useServiceQuery('history', s => s.getHistory(range))
 * // GOOD: useServiceQueryWithArg('history', range, (s, r) => s.getHistory(r))
 */
export function useServiceQuery<T>(key: string, selector: Selector<T>): QueryState<T> {
  const service = useAetherService()
  // INVARIANT: selector must be a stable reference to a service method.
  // Do NOT capture local variables in the selector closure.
  const selectorRef = useRef(selector)
  // eslint-disable-next-line react-hooks/refs -- intentional "latest ref" pattern to prevent infinite re-render loops
  selectorRef.current = selector

  const [state, setState] = useState<QueryState<T>>(() => {
    const cached = dataCache.get(key)
    if (cached) return { data: cached.data as T, isLoading: false, error: null }
    return { data: undefined, isLoading: true, error: null }
  })

  useEffect(() => {
    let cancelled = false

    const cached = dataCache.get(key)
    if (cached && Date.now() - cached.at < DEDUP_WINDOW_MS) {
      setState({ data: cached.data as T, isLoading: false, error: null })
      return
    }

    let result: T | Promise<T>
    try {
      result = selectorRef.current(service)
    } catch (err) {
      setState({ data: undefined, isLoading: false, error: err instanceof Error ? err : new Error(String(err)) })
      return
    }

    if (!isThenable(result)) {
      dataCache.set(key, { data: result, at: Date.now() })
      setState({ data: result, isLoading: false, error: null })
      return
    }

    setState(prev => prev.isLoading ? prev : { ...prev, isLoading: true })

    const existing = inflightCache.get(key) as Promise<T> | undefined
    const promise = existing ?? result
    if (!existing) inflightCache.set(key, promise)

    promise
      .then((data) => {
        if (cancelled) return
        dataCache.set(key, { data, at: Date.now() })
        inflightCache.delete(key)
        setState({ data, isLoading: false, error: null })
      })
      .catch((err) => {
        if (cancelled) return
        inflightCache.delete(key)
        setState({
          data: undefined,
          isLoading: false,
          error: err instanceof Error ? err : new Error(String(err)),
        })
      })

    return () => { cancelled = true }
  }, [key, service])

  return state
}

/**
 * Variant of useServiceQuery for methods that depend on a dynamic argument
 * (e.g. getFinancialScenario(scenarioKey), getHistory(range)).
 * The key should incorporate the argument to cache per-variant.
 */
export function useServiceQueryWithArg<T, A>(
  key: string,
  arg: A,
  selector: (service: AetherDataService, arg: A) => T | Promise<T>,
): QueryState<T> {
  const service = useAetherService()
  const compositeKey = `${key}:${typeof arg === 'object' ? JSON.stringify(arg) : String(arg)}`
  const selectorRef = useRef(selector)
  // eslint-disable-next-line react-hooks/refs -- intentional "latest ref" pattern (see useServiceQuery JSDoc)
  selectorRef.current = selector
  const argRef = useRef(arg)
  // eslint-disable-next-line react-hooks/refs -- keep arg in sync for use inside effect
  argRef.current = arg

  const [state, setState] = useState<QueryState<T>>(() => {
    const cached = dataCache.get(compositeKey)
    if (cached) return { data: cached.data as T, isLoading: false, error: null }
    return { data: undefined, isLoading: true, error: null }
  })

  useEffect(() => {
    let cancelled = false

    const cached = dataCache.get(compositeKey)
    if (cached && Date.now() - cached.at < DEDUP_WINDOW_MS) {
      setState({ data: cached.data as T, isLoading: false, error: null })
      return
    }

    let result: T | Promise<T>
    try {
      result = selectorRef.current(service, argRef.current)
    } catch (err) {
      setState({ data: undefined, isLoading: false, error: err instanceof Error ? err : new Error(String(err)) })
      return
    }

    if (!isThenable(result)) {
      dataCache.set(compositeKey, { data: result, at: Date.now() })
      setState({ data: result, isLoading: false, error: null })
      return
    }

    setState(prev => prev.isLoading ? prev : { ...prev, isLoading: true })

    const existing = inflightCache.get(compositeKey) as Promise<T> | undefined
    const promise = existing ?? result
    if (!existing) inflightCache.set(compositeKey, promise)

    promise
      .then((data) => {
        if (cancelled) return
        dataCache.set(compositeKey, { data, at: Date.now() })
        inflightCache.delete(compositeKey)
        setState({ data, isLoading: false, error: null })
      })
      .catch((err) => {
        if (cancelled) return
        inflightCache.delete(compositeKey)
        setState({
          data: undefined,
          isLoading: false,
          error: err instanceof Error ? err : new Error(String(err)),
        })
      })

    return () => { cancelled = true }
  }, [compositeKey, service])

  return state
}
