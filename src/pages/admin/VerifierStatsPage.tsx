/**
 * Wave 1 admin widget — external verifications per published bundle.
 *
 * Reads `/api/admin/verifier-stats`, which aggregates `bundle_published`
 * audit events appended by the public verifier endpoint. Office-dashboard
 * surface, not buyer-facing.
 *
 * See `.cursor/plans/wave_1_public_verifier_3da0c0e1.plan.md` § 8.
 */

import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { GlassCard } from '../../components/ui/GlassCard'

interface PerBundle {
  bundleId: string
  verifications: number
  lastSeen: string
}

type Outcome = 'valid' | 'broken' | 'unavailable' | 'error'
type UserAgentClass = 'safari' | 'chromium' | 'firefox' | 'webview' | 'other'

interface TelemetrySummary {
  sampleSize: number
  p50DurationMs: number
  p95DurationMs: number
  outcomes: Record<Outcome, number>
  byUserAgent: Record<UserAgentClass, number>
}

interface VerifierStats {
  totalPublishedEvents: number
  uniqueBundles: number
  perBundle: PerBundle[]
  telemetry: TelemetrySummary
  generatedAt: string
}

type State =
  | { kind: 'loading' }
  | { kind: 'error'; message: string }
  | { kind: 'ready'; stats: VerifierStats }

export default function VerifierStatsPage() {
  const [state, setState] = useState<State>({ kind: 'loading' })

  const refresh = useCallback(async () => {
    setState({ kind: 'loading' })
    try {
      const res = await fetch('/api/admin/verifier-stats')
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
      const stats = (await res.json()) as VerifierStats
      setState({ kind: 'ready', stats })
    } catch (err) {
      setState({ kind: 'error', message: err instanceof Error ? err.message : String(err) })
    }
  }, [])

  useEffect(() => { void refresh() }, [refresh])

  return (
    <main
      style={{
        maxWidth: 880,
        margin: '0 auto',
        padding: '40px 24px',
        color: 'var(--w-text1)',
        fontFamily: 'var(--font-sans, system-ui, sans-serif)',
      }}
    >
      <header style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16 }}>
        <div>
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
            Wave 1 conversion metric
          </p>
          <h1 style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.01em', margin: '6px 0 0' }}>
            Verifier stats
          </h1>
        </div>
        <button
          type="button"
          onClick={() => void refresh()}
          style={{
            padding: '8px 14px',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            background: 'transparent',
            color: 'var(--w-text1)',
            border: '1px solid var(--w-border2, rgba(255,255,255,0.18))',
            fontFamily: 'inherit',
          }}
        >
          Refresh
        </button>
      </header>

      <p style={{ marginTop: 12, color: 'var(--w-text2)', fontSize: 13 }}>
        Counts external fetches of public evidence bundles via{' '}
        <code>/api/public/bundles/...</code>. Per-(bundle, source-ip) deduped
        within a 1h window so refreshes don't inflate the metric.
      </p>

      <section style={{ marginTop: 24 }}>
        {state.kind === 'loading' && (
          <GlassCard animate={false} style={{ padding: 24 }}>Loading…</GlassCard>
        )}
        {state.kind === 'error' && (
          <GlassCard animate={false} glow="red" style={{ padding: 24 }}>
            Could not load stats: {state.message}
          </GlassCard>
        )}
        {state.kind === 'ready' && <StatsBody stats={state.stats} />}
      </section>
    </main>
  )
}

function StatsBody({ stats }: { stats: VerifierStats }) {
  const t = stats.telemetry
  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
        <Kpi label="Total verifications" value={stats.totalPublishedEvents} />
        <Kpi label="Unique bundles" value={stats.uniqueBundles} />
      </div>

      <h2 style={sectionH2}>Client-side timing (last 30 days)</h2>
      <p style={sectionLead}>
        Measured in the visitor&apos;s browser between bundle fetch and
        verdict render. Sample size{' '}
        <strong data-testid="verifier-telemetry-sample">{t.sampleSize}</strong>{' '}
        sessions. <code>unavailable</code> rows (no <code>crypto.subtle</code>)
        are excluded from the percentile math.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
        <Kpi
          label="p50 duration"
          value={`${t.p50DurationMs} ms`}
          testId="verifier-telemetry-p50"
        />
        <Kpi
          label="p95 duration"
          value={`${t.p95DurationMs} ms`}
          testId="verifier-telemetry-p95"
        />
      </div>
      <GlassCard animate={false} style={{ marginTop: 16, padding: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          <BreakdownList
            title="Outcomes"
            entries={[
              ['Valid', t.outcomes.valid],
              ['Broken', t.outcomes.broken],
              ['Unavailable (no crypto.subtle)', t.outcomes.unavailable],
              ['Error before verify', t.outcomes.error],
            ]}
          />
          <BreakdownList
            title="Browser bucket"
            entries={[
              ['Chromium', t.byUserAgent.chromium],
              ['Safari', t.byUserAgent.safari],
              ['Firefox', t.byUserAgent.firefox],
              ['Embedded webview', t.byUserAgent.webview],
              ['Other / unknown', t.byUserAgent.other],
            ]}
          />
        </div>
      </GlassCard>

      <h2 style={sectionH2}>Per-bundle external fetches</h2>
      <GlassCard animate={false} style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
              <Th>Bundle</Th>
              <Th align="right">Verifications</Th>
              <Th>Last seen</Th>
              <Th>Open</Th>
            </tr>
          </thead>
          <tbody>
            {stats.perBundle.length === 0 && (
              <tr>
                <td colSpan={4} style={{ padding: 24, textAlign: 'center', color: 'var(--w-text2)' }}>
                  No external verifications yet. Share a <code>/verify/&lt;hash&gt;</code> URL to start.
                </td>
              </tr>
            )}
            {stats.perBundle.map(row => (
              <tr key={row.bundleId} style={{ borderTop: '1px solid var(--w-border, rgba(255,255,255,0.10))' }}>
                <Td>
                  <code style={{ fontFamily: 'var(--font-mono, ui-monospace, monospace)' }}>
                    {row.bundleId}
                  </code>
                </Td>
                <Td align="right">{row.verifications}</Td>
                <Td>{new Date(row.lastSeen).toUTCString()}</Td>
                <Td>
                  <Link
                    to={`/verify/${row.bundleId}`}
                    style={{ color: 'var(--w-cyan, #6ce6ff)' }}
                  >
                    /verify
                  </Link>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>

      <p style={{ marginTop: 12, color: 'var(--w-text2)', fontSize: 11, fontFamily: 'var(--font-mono, ui-monospace, monospace)' }}>
        generated_at = {stats.generatedAt}
      </p>
    </>
  )
}

function Kpi({ label, value, testId }: { label: string; value: number | string; testId?: string }) {
  return (
    <GlassCard animate={false} style={{ padding: 20 }}>
      <div
        style={{
          fontFamily: 'var(--font-mono, ui-monospace, monospace)',
          fontSize: 11,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'var(--w-text2, #d8d8e0)',
        }}
      >
        {label}
      </div>
      <div data-testid={testId} style={{ marginTop: 6, fontSize: 32, fontWeight: 600 }}>{value}</div>
    </GlassCard>
  )
}

function BreakdownList({ title, entries }: { title: string; entries: Array<[string, number]> }) {
  return (
    <div>
      <div
        style={{
          fontFamily: 'var(--font-mono, ui-monospace, monospace)',
          fontSize: 11,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'var(--w-text2, #d8d8e0)',
          marginBottom: 8,
        }}
      >
        {title}
      </div>
      <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
        {entries.map(([label, count]) => (
          <li
            key={label}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '4px 0',
              fontSize: 13,
              color: 'var(--w-text1)',
              borderBottom: '1px solid var(--w-border, rgba(255,255,255,0.06))',
            }}
          >
            <span>{label}</span>
            <span style={{ fontFamily: 'var(--font-mono, ui-monospace, monospace)', color: 'var(--w-text2)' }}>
              {count}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

const sectionH2: React.CSSProperties = {
  marginTop: 32,
  marginBottom: 8,
  fontSize: 13,
  fontWeight: 600,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: 'var(--w-text2, #d8d8e0)',
}

const sectionLead: React.CSSProperties = {
  marginTop: 0,
  marginBottom: 12,
  fontSize: 13,
  color: 'var(--w-text2)',
  lineHeight: 1.6,
}

function Th({ children, align }: { children: React.ReactNode; align?: 'left' | 'right' }) {
  return (
    <th
      style={{
        textAlign: align ?? 'left',
        padding: '10px 16px',
        fontSize: 11,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        fontWeight: 600,
        color: 'var(--w-text2, #d8d8e0)',
        fontFamily: 'var(--font-mono, ui-monospace, monospace)',
      }}
    >
      {children}
    </th>
  )
}

function Td({ children, align }: { children: React.ReactNode; align?: 'left' | 'right' }) {
  return (
    <td style={{ padding: '10px 16px', textAlign: align ?? 'left' }}>{children}</td>
  )
}
