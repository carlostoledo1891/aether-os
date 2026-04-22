/**
 * Day-1 sprint coverage for the `crypto.subtle` capability fallback
 * (`.cursor/plans/wave_1_final_sprint_c23e42d0.plan.md` § 1.2).
 *
 * Discipline rule under test: when `crypto.subtle.digest` is missing the
 * page must surface a dedicated "Verifier unavailable" card carrying the
 * chain hash, the spec link, and a copyable curl command. It MUST NOT
 * silently call the verifier (which would let a tampered chain look valid)
 * and MUST NOT render the Verifying / Valid verdict states.
 */

import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { render, screen, cleanup, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

import VerifyPage from './VerifyPage'
import { hasSubtleCryptoSupport } from './cryptoCapability'

const SAMPLE_HASH = 'a'.repeat(64)

const SAMPLE_BUNDLE = {
  id: 'BDL-test-1',
  rootUnitId: 'SITE-CALDEIRA',
  claim: 'Test claim',
  createdAt: '2026-01-01T00:00:00.000Z',
  verificationStatus: 'pending' as const,
  snapshot: { units: {}, edges: [], evidence: [], generatedAt: '2026-01-01T00:00:00.000Z' },
  chainProof: {
    startSequence: 1,
    endSequence: 1,
    eventCount: 1,
    startHash: SAMPLE_HASH,
    endHash: SAMPLE_HASH,
    valid: true,
  },
  narrative: null,
  verifiedAt: null,
  events: [
    {
      sequence: 1,
      event_id: 'EV-1',
      timestamp: '2026-01-01T00:00:00.000Z',
      type: 'system_event',
      actor: 'system',
      action: 'genesis',
      detail: 'genesis',
      payload_hash: SAMPLE_HASH,
      prev_hash: '0'.repeat(64),
      chain_hash: SAMPLE_HASH,
      anchor_batch_id: null,
    },
  ],
}

function renderAt(hash: string) {
  return render(
    <MemoryRouter initialEntries={[`/verify/${hash}`]}>
      <Routes>
        <Route path="/verify/:hash" element={<VerifyPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

const ORIGINAL_CRYPTO = globalThis.crypto

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  // happy-dom installs a real crypto with subtle; restore between cases.
  Object.defineProperty(globalThis, 'crypto', {
    value: ORIGINAL_CRYPTO,
    configurable: true,
    writable: true,
  })
})

describe('hasSubtleCryptoSupport', () => {
  it('returns true when crypto.subtle.digest is callable', () => {
    expect(hasSubtleCryptoSupport()).toBe(true)
  })

  it('returns false when crypto is undefined', () => {
    Object.defineProperty(globalThis, 'crypto', {
      value: undefined,
      configurable: true,
      writable: true,
    })
    expect(hasSubtleCryptoSupport()).toBe(false)
  })

  it('returns false when crypto.subtle.digest is not a function', () => {
    Object.defineProperty(globalThis, 'crypto', {
      value: { subtle: { digest: 'nope' } },
      configurable: true,
      writable: true,
    })
    expect(hasSubtleCryptoSupport()).toBe(false)
  })
})

describe('VerifyPage — crypto.subtle unavailable fallback', () => {
  beforeEach(() => {
    Object.defineProperty(globalThis, 'crypto', {
      value: undefined,
      configurable: true,
      writable: true,
    })

    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(SAMPLE_BUNDLE), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
    )
  })

  it('renders the Verifier unavailable card with the chain hash and curl line', async () => {
    renderAt(SAMPLE_HASH)

    // The unavailable card surfaces the raw chain hash + a copyable curl
    // line via inner <pre data-testid> elements; we discover the card via
    // those, since GlassCard does not forward data-* props.
    const hashEl = await screen.findByTestId('verify-unavailable-hash')
    expect(hashEl.textContent).toBe(SAMPLE_HASH)

    expect(screen.getByTestId('verify-unavailable-curl').textContent)
      .toBe(`curl https://verochain.co/api/public/bundles/by-hash/${SAMPLE_HASH}`)

    expect(screen.getByText(/Verifier unavailable in this browser/i))
      .toBeInTheDocument()

    // The verdict-card "Re-verify in your tab" button must NOT appear when
    // the verifier is unavailable (no silent server-trust fallback).
    expect(screen.queryByText(/Re-verify in your tab/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/^Valid/)).not.toBeInTheDocument()
  })

  it('does not run the chain verification when crypto.subtle is missing', async () => {
    renderAt(SAMPLE_HASH)
    await screen.findByTestId('verify-unavailable-hash')

    // No "Verifying" status should ever surface in this state; the
    // verifier must not run silently.
    await waitFor(() => {
      expect(screen.queryByText(/^Verifying/i)).not.toBeInTheDocument()
    })
  })
})
