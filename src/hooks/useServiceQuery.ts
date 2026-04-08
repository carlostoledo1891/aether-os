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

function isThenable(val: unknown): val is Promise<unknown> {
  return val != null && typeof (val as Promise<unknown>).then === 'function'
}

/**
 * Hook that bridges sync (mock) and async (live) service methods.
 * Returns { data, isLoading, error } — components render safely
 * regardless of whether the service returns data immediately or via fetch.
 */
export function useServiceQuery<T>(key: string, selector: Selector<T>): QueryState<T> {
  const service = useAetherService()
  const [state, setState] = useState<QueryState<T>>(() => {
    const cached = dataCache.get(key)
    if (cached) return { data: cached.data as T, isLoading: false, error: null }
    return { data: undefined, isLoading: true, error: null }
  })
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => { mountedRef.current = false }
  }, [])

  useEffect(() => {
    let cancelled = false

    const cached = dataCache.get(key)
    if (cached && Date.now() - cached.at < DEDUP_WINDOW_MS) {
      setState({ data: cached.data as T, isLoading: false, error: null })
      return
    }

    let result: T | Promise<T>
    try {
      result = selector(service)
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
        if (mountedRef.current) setState({ data, isLoading: false, error: null })
      })
      .catch((err) => {
        if (cancelled) return
        inflightCache.delete(key)
        if (mountedRef.current) {
          setState({
            data: undefined,
            isLoading: false,
            error: err instanceof Error ? err : new Error(String(err)),
          })
        }
      })

    return () => { cancelled = true }
  }, [key, service, selector])

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
  const compositeKey = `${key}:${String(arg)}`
  const [state, setState] = useState<QueryState<T>>(() => {
    const cached = dataCache.get(compositeKey)
    if (cached) return { data: cached.data as T, isLoading: false, error: null }
    return { data: undefined, isLoading: true, error: null }
  })
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => { mountedRef.current = false }
  }, [])

  useEffect(() => {
    let cancelled = false

    const cached = dataCache.get(compositeKey)
    if (cached && Date.now() - cached.at < DEDUP_WINDOW_MS) {
      setState({ data: cached.data as T, isLoading: false, error: null })
      return
    }

    let result: T | Promise<T>
    try {
      result = selector(service, arg)
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
        if (mountedRef.current) setState({ data, isLoading: false, error: null })
      })
      .catch((err) => {
        if (cancelled) return
        inflightCache.delete(compositeKey)
        if (mountedRef.current) {
          setState({
            data: undefined,
            isLoading: false,
            error: err instanceof Error ? err : new Error(String(err)),
          })
        }
      })

    return () => { cancelled = true }
  }, [compositeKey, service, arg, selector])

  return state
}
