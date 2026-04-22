import { useEffect, useState } from 'react'

/**
 * Tracks `(prefers-reduced-motion: reduce)` for decorative animations.
 * Defaults to `false` on SSR / first paint, then syncs from `matchMedia`.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => setReduced(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  return reduced
}
