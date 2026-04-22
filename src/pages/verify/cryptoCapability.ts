/**
 * `crypto.subtle` capability probe shared between the verifier page and
 * its tests. Lives in its own module so React Fast Refresh can keep the
 * page export hot — eslint's `react-refresh/only-export-components` rule
 * forbids mixing component and helper exports in the same file.
 *
 * Discipline rule (`.cursor/plans/wave_1_final_sprint_c23e42d0.plan.md`
 * § 1.2): when this returns `false` the verifier MUST refuse to compute
 * a verdict and MUST surface the "Verifier unavailable" card. We never
 * silently fall back to "trust the server".
 */
export function hasSubtleCryptoSupport(): boolean {
  if (typeof globalThis === 'undefined') return false
  const c = (globalThis as { crypto?: { subtle?: { digest?: unknown } } }).crypto
  return typeof c?.subtle?.digest === 'function'
}
