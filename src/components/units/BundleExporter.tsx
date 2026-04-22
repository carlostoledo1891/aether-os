import { useState } from 'react'
import type { EvidenceBundleDetail } from 'shared/units/types'

type BundlePreset = 'boardPack'

interface BundleExporterProps {
  rootUnitId?: string
  rootLabel?: string
  preset?: BundlePreset
  onClose: () => void
}

const PRESET_COPY: Record<BundlePreset, { title: string; claim: string; subtitle: string }> = {
  boardPack: {
    title: 'Board Pack — Caldeira Project',
    subtitle: 'Consolidated project snapshot for board review (deposits, milestones, risks, offtakes, permits).',
    claim: 'Caldeira Project board pack: consolidated state of deposits, milestones, risks, offtakes, and permit conditions as of bundle creation.',
  },
}

export function BundleExporter({ rootUnitId, rootLabel, preset, onClose }: BundleExporterProps) {
  const presetCopy = preset ? PRESET_COPY[preset] : null
  const [claim, setClaim] = useState(
    presetCopy?.claim
      ?? (rootLabel ? `This unit (${rootLabel}) meets all provenance and compliance requirements.` : ''),
  )
  const [bundle, setBundle] = useState<EvidenceBundleDetail | null>(null)
  const [verificationStatus, setVerificationStatus] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const title = presetCopy?.title ?? 'Evidence Bundle'
  const subtitle = presetCopy?.subtitle
    ?? (rootLabel ? `Root unit: ${rootLabel}${rootUnitId ? ` (${rootUnitId})` : ''}` : '')

  const handleGenerate = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = preset
        ? await fetch('/api/bundles/preset', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ preset, claim }),
          })
        : await fetch('/api/bundles', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rootUnitId, claim }),
          })
      if (!res.ok) { const e = await res.json(); throw new Error(e.error ?? 'Failed') }
      const data = await res.json()
      setBundle(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate bundle')
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async () => {
    if (!bundle) return
    setLoading(true)
    try {
      const res = await fetch(`/api/bundles/${bundle.id}/verify`)
      const data = await res.json()
      setVerificationStatus(data.verificationStatus)
    } catch {
      setVerificationStatus('error')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (!bundle) return
    const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `bundle-${bundle.id}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      style={{
        position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.6)', zIndex: 1000,
      }}
    >
      {/* Click-outside backdrop: an actual button so a11y is happy */}
      <button
        type="button"
        aria-label="Close dialog"
        onClick={onClose}
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          background: 'transparent', border: 'none', cursor: 'default', padding: 0,
        }}
      />
      <div
        style={{
          position: 'relative',
          background: 'var(--surface-1, #1a1a2e)', borderRadius: 12, padding: 24, width: 480, maxHeight: '80vh', overflowY: 'auto',
          border: '1px solid var(--border, rgba(255,255,255,0.1))',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}
      >
        <h3 style={{ margin: '0 0 8px', fontSize: 16, color: '#fff' }}>
          {title}
        </h3>
        {subtitle && (
          <p style={{ fontSize: 12, opacity: 0.5, margin: '0 0 16px' }}>
            {subtitle}
          </p>
        )}

        {!bundle ? (
          <>
            <textarea
              value={claim}
              onChange={e => setClaim(e.target.value)}
              rows={3}
              style={{
                width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid var(--border)',
                background: 'transparent', color: '#fff', fontSize: 13, resize: 'vertical', marginBottom: 12,
                boxSizing: 'border-box',
              }}
              placeholder="Claim for this evidence bundle..."
            />

            {error && (
              <div style={{ padding: '6px 10px', borderRadius: 6, background: '#ef444422', color: '#ef4444', fontSize: 12, marginBottom: 12 }}>
                {error}
              </div>
            )}

            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button onClick={onClose} style={btnSecondary}>Cancel</button>
              <button onClick={handleGenerate} disabled={loading} style={{ ...btnPrimary, opacity: loading ? 0.5 : 1 }}>
                {loading ? 'Generating...' : 'Generate Bundle'}
              </button>
            </div>
          </>
        ) : (
          <>
            <div style={{
              padding: 12, borderRadius: 8, background: 'var(--surface-2, rgba(255,255,255,0.04))',
              marginBottom: 12,
            }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#fff', marginBottom: 4 }}>
                Bundle ID: {bundle.id}
              </div>
              <div style={{ fontSize: 11, opacity: 0.5 }}>
                {bundle.chainProof.eventCount} audit events · Created {new Date(bundle.createdAt).toLocaleString()}
              </div>
            </div>

            {bundle.narrative && (
              <div style={{ padding: 12, borderRadius: 8, background: 'rgba(124,92,252,0.08)', marginBottom: 12, fontSize: 12, whiteSpace: 'pre-wrap', lineHeight: 1.5, color: 'rgba(255,255,255,0.8)' }}>
                {bundle.narrative}
              </div>
            )}

            {verificationStatus && (
              <div style={{
                padding: '6px 10px', borderRadius: 6, marginBottom: 12, fontSize: 12,
                background: verificationStatus === 'valid' ? '#22c55e22' : '#ef444422',
                color: verificationStatus === 'valid' ? '#22c55e' : '#ef4444',
              }}>
                Verification: {verificationStatus}
              </div>
            )}

            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button onClick={handleVerify} disabled={loading} style={btnSecondary}>
                {loading ? 'Verifying...' : 'Verify'}
              </button>
              <button onClick={handleDownload} style={btnSecondary}>Download JSON</button>
              <button onClick={onClose} style={btnPrimary}>Done</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

const btnSecondary: React.CSSProperties = {
  padding: '6px 16px', borderRadius: 6, border: '1px solid var(--border, rgba(255,255,255,0.15))',
  background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 13,
}

const btnPrimary: React.CSSProperties = {
  padding: '6px 16px', borderRadius: 6, border: 'none',
  background: 'var(--accent, #7c5cfc)', color: '#fff', cursor: 'pointer', fontSize: 13,
}
