/**
 * Public verifier page — Wave 1 of the Vero verification stack.
 *
 * Lives at `/verify/:hash` (and accepts a bundle UUID as a graceful
 * fallback). Fetches a bundle from `/api/public/bundles/...`, then
 * recomputes every payload_hash and chain_hash *in this tab* using
 * `crypto.subtle`. The server is never the one that says "valid" — that's
 * the entire point of the chirp moment described in the alignment doc.
 *
 * No new chrome layer. Reuses GlassCard, design tokens (`var(--w-*)`), and
 * the chip pattern from `ProvenanceHeader`. See
 * `.cursor/plans/wave_1_public_verifier_3da0c0e1.plan.md` for context.
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { GlassCard } from '../../components/ui/GlassCard'
import { verifyChainClient } from '../../verify/clientVerifier'
import { hasSubtleCryptoSupport } from './cryptoCapability'
import type {
  EvidenceBundleDetail,
  BundleAuditEvent,
} from 'shared/units/types'
import type { ChainVerification, AuditEventRow } from 'shared/audit/types'

interface PublicBundle extends EvidenceBundleDetail {
  events: BundleAuditEvent[]
}

/**
 * Where the open specs live. We point at the GitHub repo so the URL is
 * stable for external readers, even when the verifier is hosted on
 * verochain.co. Update if the repo moves.
 */
const SPEC_AUDIT_EVENT_URL = 'https://github.com/carlostoledo1891/aether-os/blob/main/docs/spec/audit-event-v1.md'
const SPEC_BUNDLE_URL = 'https://github.com/carlostoledo1891/aether-os/blob/main/docs/spec/bundle-v1.md'

type FetchState =
  | { kind: 'loading' }
  | { kind: 'error'; message: string }
  | { kind: 'ready'; bundle: PublicBundle }

type VerifyState =
  | { kind: 'idle' }
  | { kind: 'verifying'; current: number; total: number }
  | { kind: 'done'; result: ChainVerification }
  | { kind: 'unavailable' }

const HASH_RX = /^[0-9a-f]{64}$/i

function shortHash(h: string | undefined | null, take = 12): string {
  if (!h) return '—'
  if (h.length <= take * 2 + 1) return h
  return `${h.slice(0, take)}…${h.slice(-take)}`
}

/**
 * Anonymous verifier-timing beacon.
 *
 * Posts (chain hash, duration, outcome, event count) to
 * `/api/public/verifier-telemetry`. The server uses this to compute the
 * p50/p95 figures on `/admin/verifier-stats`. We never block UI on the
 * response, never await it, and never surface errors — telemetry is a
 * best-effort signal, not a contract with the visitor. (Day-3 sprint
 * deliverable, plan § 3.2.)
 */
type TelemetryOutcome = 'valid' | 'broken' | 'unavailable' | 'error'
function postVerifierTelemetry(payload: {
  chainHash: string
  durationMs: number
  eventCount: number
  outcome: TelemetryOutcome
}): void {
  if (!payload.chainHash) return
  if (!/^[0-9a-f]{64}$/i.test(payload.chainHash)) return
  try {
    void fetch('/api/public/verifier-telemetry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => undefined)
  } catch {
    // Telemetry must never throw into the UI.
  }
}

async function fetchBundle(idOrHash: string): Promise<PublicBundle> {
  const url = HASH_RX.test(idOrHash)
    ? `/api/public/bundles/by-hash/${idOrHash}`
    : `/api/public/bundles/${idOrHash}`
  const res = await fetch(url, { headers: { Accept: 'application/json' } })
  if (!res.ok) {
    let detail = `${res.status} ${res.statusText}`
    try {
      const body = await res.json() as { error?: string }
      if (body.error) detail = body.error
    } catch { /* not JSON */ }
    throw new Error(detail)
  }
  const body = (await res.json()) as PublicBundle
  if (!Array.isArray(body.events)) {
    throw new Error('Bundle response missing embedded audit events')
  }
  return body
}

export default function VerifyPage() {
  const params = useParams<{ hash: string }>()
  const idOrHash = params.hash ?? ''

  // Capture once at mount so re-verify doesn't re-poll the global. SSR-safe
  // because the helper guards against `globalThis` being undefined.
  const [cryptoOk] = useState<boolean>(() => hasSubtleCryptoSupport())

  const [fetchState, setFetchState] = useState<FetchState>(() =>
    idOrHash
      ? { kind: 'loading' }
      : { kind: 'error', message: 'No bundle hash or ID supplied.' },
  )
  const [verifyState, setVerifyState] = useState<VerifyState>(() =>
    cryptoOk ? { kind: 'idle' } : { kind: 'unavailable' },
  )

  // React-canonical "reset on prop change" pattern: track the prior key and
  // adjust state during render when it changes. Avoids cascading-render lint
  // and keeps all setState calls out of the fetch effect's body.
  const [prevHash, setPrevHash] = useState(idOrHash)
  if (prevHash !== idOrHash) {
    setPrevHash(idOrHash)
    setFetchState(idOrHash
      ? { kind: 'loading' }
      : { kind: 'error', message: 'No bundle hash or ID supplied.' })
    setVerifyState(cryptoOk ? { kind: 'idle' } : { kind: 'unavailable' })
  }

  // Track which (hash, run) we already reported so a re-render or React
  // strict-mode double-effect can't double-count one verification session.
  const reportedKeysRef = useRef<Set<string>>(new Set())

  const runVerify = useCallback(async (events: BundleAuditEvent[], chainHash: string) => {
    if (!cryptoOk) {
      setVerifyState({ kind: 'unavailable' })
      const k = `unavailable:${chainHash}`
      if (!reportedKeysRef.current.has(k)) {
        reportedKeysRef.current.add(k)
        postVerifierTelemetry({
          chainHash,
          durationMs: 0,
          eventCount: events.length,
          outcome: 'unavailable',
        })
      }
      return
    }
    setVerifyState({ kind: 'verifying', current: 0, total: events.length })
    const startedAt = (typeof performance !== 'undefined' ? performance.now() : Date.now())
    const result = await verifyChainClient(events as AuditEventRow[], {
      onProgress: (current, total) => {
        setVerifyState({ kind: 'verifying', current, total })
      },
    })
    setVerifyState({ kind: 'done', result })
    const elapsed = (typeof performance !== 'undefined' ? performance.now() : Date.now()) - startedAt
    postVerifierTelemetry({
      chainHash,
      durationMs: Math.max(0, Math.round(elapsed)),
      eventCount: events.length,
      outcome: result.valid ? 'valid' : 'broken',
    })
  }, [cryptoOk])

  useEffect(() => {
    if (!idOrHash) return
    let cancelled = false

    fetchBundle(idOrHash)
      .then(bundle => {
        if (cancelled) return
        setFetchState({ kind: 'ready', bundle })
        const hash = bundle.chainProof.endHash
        if (cryptoOk) void runVerify(bundle.events, hash)
        else {
          const k = `unavailable:${hash}`
          if (!reportedKeysRef.current.has(k)) {
            reportedKeysRef.current.add(k)
            postVerifierTelemetry({
              chainHash: hash,
              durationMs: 0,
              eventCount: bundle.events.length,
              outcome: 'unavailable',
            })
          }
        }
      })
      .catch((err: Error) => {
        if (cancelled) return
        setFetchState({ kind: 'error', message: err.message })
      })

    return () => { cancelled = true }
  }, [idOrHash, runVerify, cryptoOk])

  const downloadJson = useCallback(() => {
    if (fetchState.kind !== 'ready') return
    const blob = new Blob([JSON.stringify(fetchState.bundle, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `bundle-${fetchState.bundle.id}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [fetchState])

  const reVerify = useCallback(() => {
    if (fetchState.kind !== 'ready') return
    void runVerify(fetchState.bundle.events, fetchState.bundle.chainProof.endHash)
  }, [fetchState, runVerify])

  return (
    <main
      data-testid="verify-page"
      style={{
        maxWidth: 880,
        margin: '0 auto',
        padding: '64px 24px 96px',
        color: 'var(--w-text1)',
        fontFamily: 'var(--font-sans, system-ui, sans-serif)',
      }}
    >
      <Header />

      <section style={{ marginTop: 32 }}>
        {fetchState.kind === 'loading' && <LoadingCard idOrHash={idOrHash} />}
        {fetchState.kind === 'error' && <ErrorCard message={fetchState.message} idOrHash={idOrHash} />}
        {fetchState.kind === 'ready' && verifyState.kind === 'unavailable' && (
          <UnavailableCard bundle={fetchState.bundle} />
        )}
        {fetchState.kind === 'ready' && verifyState.kind !== 'unavailable' && (
          <VerdictCard
            bundle={fetchState.bundle}
            verifyState={verifyState}
            onReVerify={reVerify}
            onDownload={downloadJson}
          />
        )}
      </section>

      {fetchState.kind === 'ready' && <BundleMeta bundle={fetchState.bundle} />}

      <Explainer />
    </main>
  )
}

/* ─── Header ──────────────────────────────────────────────────────────────── */

function Header() {
  return (
    <header>
      <p
        style={{
          fontFamily: 'var(--font-mono, ui-monospace, monospace)',
          fontSize: 11,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'var(--w-text2, #d8d8e0)',
          margin: 0,
        }}
      >
        Vero Public Verifier
      </p>
      <h1
        style={{
          fontSize: 36,
          fontWeight: 600,
          letterSpacing: '-0.01em',
          margin: '8px 0 0',
        }}
      >
        Cryptographic proof, in your own browser.
      </h1>
      <p
        style={{
          marginTop: 12,
          color: 'var(--w-text2, #d8d8e0)',
          maxWidth: 640,
          lineHeight: 1.6,
          fontSize: 16,
        }}
      >
        This page fetches an evidence bundle from Vero, then re-walks every
        link in its audit chain using <code style={inlineCode}>crypto.subtle</code>.
        If anything has been changed since publication, the verdict below
        turns red and points at the broken sequence.
      </p>
    </header>
  )
}

/* ─── Cards ───────────────────────────────────────────────────────────────── */

function LoadingCard({ idOrHash }: { idOrHash: string }) {
  return (
    <GlassCard animate={false} style={{ padding: 24 }}>
      <Status label="Loading" tone="neutral" />
      <p style={{ marginTop: 12, color: 'var(--w-text2)' }}>
        Fetching bundle <Mono>{shortHash(idOrHash, 8)}</Mono> from{' '}
        <Mono>/api/public/bundles</Mono>…
      </p>
    </GlassCard>
  )
}

function ErrorCard({ message, idOrHash }: { message: string; idOrHash: string }) {
  return (
    <GlassCard animate={false} glow="red" style={{ padding: 24 }}>
      <Status label="Bundle not found" tone="bad" />
      <p style={{ marginTop: 12, color: 'var(--w-text2)' }}>
        Could not load <Mono>{shortHash(idOrHash, 8)}</Mono>: {message}
      </p>
      <p style={{ marginTop: 12, color: 'var(--w-text2)', fontSize: 13 }}>
        Verify the hash is correct, or visit the{' '}
        <Link to="/" style={{ color: 'var(--w-cyan, #6ce6ff)' }}>landing page</Link>
        {' '}to request a fresh bundle.
      </p>
    </GlassCard>
  )
}

interface VerdictCardProps {
  bundle: PublicBundle
  verifyState: VerifyState
  onReVerify: () => void
  onDownload: () => void
}

function VerdictCard({ bundle, verifyState, onReVerify, onDownload }: VerdictCardProps) {
  const verifying = verifyState.kind === 'verifying'
  const done = verifyState.kind === 'done' ? verifyState.result : null
  const valid = done?.valid === true
  const broken = done?.valid === false

  const glow = broken ? 'red' : valid ? 'green' : 'cyan'

  return (
    <GlassCard animate={false} glow={glow} style={{ padding: 28 }}>
      <Status
        label={
          verifying
            ? `Verifying ${verifyState.current} / ${verifyState.total}`
            : valid
              ? `Valid — ${done.length} events`
              : broken
                ? `Broken at sequence ${done.brokenAt}`
                : 'Idle'
        }
        tone={verifying ? 'neutral' : valid ? 'good' : broken ? 'bad' : 'neutral'}
      />

      {verifying && (
        <p style={{ marginTop: 16, color: 'var(--w-text2)' }}>
          Recomputing payload and chain hashes for every event in the segment.
          This is happening in your tab, not on our server.
        </p>
      )}

      {valid && (
        <p style={{ marginTop: 16, color: 'var(--w-text2)', lineHeight: 1.6 }}>
          Every payload hash and chain link in this bundle reproduced exactly.
          The bundle's root hash is{' '}
          <Mono>{shortHash(bundle.chainProof.endHash, 8)}</Mono>. If anyone
          edits a single byte of the underlying audit data, this page will
          stop saying "valid".
        </p>
      )}

      {broken && (
        <p style={{ marginTop: 16, color: 'var(--w-text2)', lineHeight: 1.6 }}>
          {done.detail ?? 'A hash did not reproduce.'}{' '}
          The chain has been tampered with or the bundle was assembled
          incorrectly. Do not trust its claims without an independent re-pull.
        </p>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 24 }}>
        <ActionButton label="Re-verify in your tab" onClick={onReVerify} disabled={verifying} primary />
        <ActionButton label="Download bundle JSON" onClick={onDownload} />
        <a
          href={SPEC_AUDIT_EVENT_URL}
          target="_blank"
          rel="noreferrer noopener"
          style={{ ...buttonStyle(), textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
        >
          Read the open spec ↗
        </a>
      </div>
    </GlassCard>
  )
}

function UnavailableCard({ bundle }: { bundle: PublicBundle }) {
  const hash = bundle.chainProof.endHash
  const curlLine = `curl https://verochain.co/api/public/bundles/by-hash/${hash}`
  return (
    <GlassCard
      animate={false}
      glow="cyan"
      style={{ padding: 28 }}
      data-testid="verify-unavailable-card"
    >
      <Status label="Verifier unavailable in this browser" tone="neutral" />
      <p style={{ marginTop: 16, color: 'var(--w-text2)', lineHeight: 1.6 }}>
        Your browser does not expose <code style={inlineCode}>crypto.subtle</code>
        {' '}— typically because of an old build, a locked-down corporate webview,
        or an embedded in-app browser. We will <strong>not</strong> ask the
        server to say "valid" on your behalf. The chain hash and the open
        spec are below; verify out-of-band on a different device or by
        running the reference algorithm yourself.
      </p>

      <div style={{ marginTop: 20 }}>
        <div style={metaH2}>Chain hash</div>
        <pre style={preCodeStyle} data-testid="verify-unavailable-hash">{hash}</pre>
      </div>

      <div style={{ marginTop: 16 }}>
        <div style={metaH2}>Fetch the bundle yourself</div>
        <pre style={preCodeStyle} data-testid="verify-unavailable-curl">{curlLine}</pre>
      </div>

      <p style={{ marginTop: 16, color: 'var(--w-text2)', lineHeight: 1.6, fontSize: 13 }}>
        Spec:{' '}
        <a
          href={SPEC_AUDIT_EVENT_URL}
          target="_blank"
          rel="noreferrer noopener"
          style={{ color: 'var(--w-cyan, #6ce6ff)' }}
        >
          docs/spec/audit-event-v1.md
        </a>
        {'  ·  Reference implementation: '}
        <a
          href="https://github.com/carlostoledo1891/aether-os/blob/main/src/verify/clientVerifier.ts"
          target="_blank"
          rel="noreferrer noopener"
          style={{ color: 'var(--w-cyan, #6ce6ff)' }}
        >
          src/verify/clientVerifier.ts
        </a>
        .
      </p>
    </GlassCard>
  )
}

function BundleMeta({ bundle }: { bundle: PublicBundle }) {
  // Live-mode badge: any bundle that made it past the public route's
  // live-only guard is necessarily 'live'. We surface it explicitly so the
  // visitor sees the same "operational data, not a fixture" affordance the
  // app's DataModeBanner provides for logged-in workspace users.
  // See `.cursor/plans/wave_1_final_sprint_c23e42d0.plan.md` § 2.2.
  const dataMode = bundle.dataMode ?? 'live'
  return (
    <section style={{ marginTop: 24 }}>
      <GlassCard animate={false} style={{ padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
          <h2 style={metaH2}>Bundle</h2>
          <DataModeBadge mode={dataMode} />
        </div>
        <dl style={metaDl}>
          <MetaRow label="Bundle ID" value={<Mono>{bundle.id}</Mono>} />
          <MetaRow label="Root unit" value={<Mono>{bundle.rootUnitId}</Mono>} />
          <MetaRow label="Created" value={new Date(bundle.createdAt).toUTCString()} />
          <MetaRow label="Claim" value={bundle.claim} />
          <MetaRow
            label="Chain segment"
            value={
              <span>
                <Mono>{bundle.chainProof.startSequence}</Mono>
                {' → '}
                <Mono>{bundle.chainProof.endSequence}</Mono>
                {' '}
                ({bundle.events.length} events)
              </span>
            }
          />
          <MetaRow label="Root hash" value={<Mono>{bundle.chainProof.endHash}</Mono>} />
        </dl>
        {bundle.narrative && (
          <pre style={narrativeStyle}>{bundle.narrative}</pre>
        )}
      </GlassCard>
    </section>
  )
}

function DataModeBadge({ mode }: { mode: 'live' | 'mock' }) {
  // Mock-mode bundles should never reach this UI because the public route
  // 403s them; we still render an honest red badge if the API ever lets one
  // slip through, so the visitor is never lied to.
  const live = mode === 'live'
  return (
    <span
      data-testid={`verify-data-mode-${mode}`}
      title={live
        ? 'This bundle was generated against live operational data.'
        : 'This bundle was generated in mock mode and should not be public — report this URL.'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 10px',
        borderRadius: 999,
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: live ? 'var(--w-green, #6cf2a3)' : 'var(--w-red, #ff8b8b)',
        border: `1px solid ${live ? 'rgba(108,242,163,0.45)' : 'rgba(255,139,139,0.45)'}`,
        background: live ? 'rgba(108,242,163,0.08)' : 'rgba(255,139,139,0.08)',
        fontFamily: 'var(--font-mono, ui-monospace, monospace)',
      }}
    >
      <span aria-hidden style={{
        width: 6, height: 6, borderRadius: '50%',
        background: live ? 'var(--w-green, #6cf2a3)' : 'var(--w-red, #ff8b8b)',
      }} />
      {live ? 'Live data' : 'Mock data'}
    </span>
  )
}

function Explainer() {
  return (
    <section style={{ marginTop: 32 }}>
      <GlassCard animate={false} style={{ padding: 24 }}>
        <h2 style={metaH2}>What is this?</h2>
        <p style={{ color: 'var(--w-text2)', lineHeight: 1.7, marginTop: 12 }}>
          Every state change in the Vero workspace appends a row to a SQLite
          audit table. Each row carries a <Mono>payload_hash</Mono> of its
          contents and a <Mono>chain_hash</Mono> that depends on the previous
          row's chain hash — exactly the same construction Git uses for
          commits. Tampering with any past row breaks every link after it.
        </p>
        <p style={{ color: 'var(--w-text2)', lineHeight: 1.7, marginTop: 12 }}>
          A "bundle" packages a slice of that chain plus a snapshot of the
          state it vouches for. This page asks Vero for the slice, then walks
          every hash in your browser. If we tampered with the data, you
          would see it in your tab, not in our logs. The algorithm and wire
          format are MIT-licensed in{' '}
          <a
            href={SPEC_AUDIT_EVENT_URL}
            target="_blank"
            rel="noreferrer noopener"
            style={{ color: 'var(--w-cyan, #6ce6ff)' }}
          >
            docs/spec/audit-event-v1.md
          </a>
          {' '}and{' '}
          <a
            href={SPEC_BUNDLE_URL}
            target="_blank"
            rel="noreferrer noopener"
            style={{ color: 'var(--w-cyan, #6ce6ff)' }}
          >
            docs/spec/bundle-v1.md
          </a>
          . You are encouraged to write your own verifier.
        </p>
      </GlassCard>
    </section>
  )
}

/* ─── Small primitives ────────────────────────────────────────────────────── */

type Tone = 'good' | 'bad' | 'neutral'

function Status({ label, tone }: { label: string; tone: Tone }) {
  const palette: Record<Tone, { color: string; border: string; bg: string; dot: string }> = {
    good: {
      color: 'var(--w-green, #6cf2a3)',
      border: 'rgba(108,242,163,0.45)',
      bg: 'rgba(108,242,163,0.08)',
      dot: 'var(--w-green, #6cf2a3)',
    },
    bad: {
      color: 'var(--w-red, #ff8b8b)',
      border: 'rgba(255,139,139,0.45)',
      bg: 'rgba(255,139,139,0.08)',
      dot: 'var(--w-red, #ff8b8b)',
    },
    neutral: {
      color: 'var(--w-text2, #d8d8e0)',
      border: 'var(--w-border2, rgba(255,255,255,0.18))',
      bg: 'rgba(255,255,255,0.03)',
      dot: 'var(--w-text2, #d8d8e0)',
    },
  }
  const s = palette[tone]
  return (
    <span
      data-testid={`verify-status-${tone}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px 12px',
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: s.color,
        border: `1px solid ${s.border}`,
        background: s.bg,
        fontFamily: 'var(--font-mono, ui-monospace, monospace)',
      }}
    >
      <span aria-hidden style={{ width: 8, height: 8, borderRadius: '50%', background: s.dot }} />
      {label}
    </span>
  )
}

function ActionButton({
  label,
  onClick,
  disabled,
  primary,
}: {
  label: string
  onClick: () => void
  disabled?: boolean
  primary?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={buttonStyle(primary, disabled)}
    >
      {label}
    </button>
  )
}

function buttonStyle(primary?: boolean, disabled?: boolean): React.CSSProperties {
  return {
    padding: '8px 14px',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: '0.02em',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    background: primary ? 'var(--w-cyan, #6ce6ff)' : 'transparent',
    color: primary ? '#0a0a0f' : 'var(--w-text1, #ffffff)',
    border: primary
      ? '1px solid var(--w-cyan, #6ce6ff)'
      : '1px solid var(--w-border2, rgba(255,255,255,0.18))',
    fontFamily: 'inherit',
  }
}

function MetaRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={metaRow}>
      <dt style={metaDt}>{label}</dt>
      <dd style={metaDd}>{value}</dd>
    </div>
  )
}

function Mono({ children }: { children: React.ReactNode }) {
  return (
    <code
      style={{
        fontFamily: 'var(--font-mono, ui-monospace, monospace)',
        fontSize: '0.92em',
        color: 'var(--w-text1)',
      }}
    >
      {children}
    </code>
  )
}

/* ─── Inline style atoms ──────────────────────────────────────────────────── */

const inlineCode: React.CSSProperties = {
  fontFamily: 'var(--font-mono, ui-monospace, monospace)',
  fontSize: '0.9em',
  color: 'var(--w-text1)',
  background: 'rgba(255,255,255,0.05)',
  padding: '1px 6px',
  borderRadius: 4,
}

const metaH2: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: 'var(--w-text2, #d8d8e0)',
  margin: 0,
}

const metaDl: React.CSSProperties = {
  marginTop: 16,
  display: 'grid',
  gap: 12,
}

const metaRow: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '160px 1fr',
  gap: 12,
  alignItems: 'baseline',
  margin: 0,
}

const metaDt: React.CSSProperties = {
  margin: 0,
  fontSize: 11,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: 'var(--w-text2, #d8d8e0)',
  fontFamily: 'var(--font-mono, ui-monospace, monospace)',
}

const metaDd: React.CSSProperties = {
  margin: 0,
  fontSize: 14,
  color: 'var(--w-text1)',
  wordBreak: 'break-word',
  lineHeight: 1.5,
}

const preCodeStyle: React.CSSProperties = {
  marginTop: 6,
  padding: 12,
  borderRadius: 8,
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid var(--w-border, rgba(255,255,255,0.10))',
  color: 'var(--w-text1)',
  fontFamily: 'var(--font-mono, ui-monospace, monospace)',
  fontSize: 12,
  lineHeight: 1.6,
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-all',
  overflowX: 'auto',
}

const narrativeStyle: React.CSSProperties = {
  marginTop: 18,
  padding: 16,
  borderRadius: 8,
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid var(--w-border, rgba(255,255,255,0.10))',
  color: 'var(--w-text2, #d8d8e0)',
  fontFamily: 'var(--font-mono, ui-monospace, monospace)',
  fontSize: 12,
  lineHeight: 1.6,
  whiteSpace: 'pre-wrap',
  overflowX: 'auto',
}
