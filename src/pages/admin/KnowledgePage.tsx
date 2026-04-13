import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Plus, Globe, Trash2, Pencil, RefreshCw, FileText, X, ArrowLeft, ChevronDown, ChevronRight } from 'lucide-react'
import { W } from '../../app/canvas/canvasTheme'
import { ProvenanceBadge } from '../../components/ui/ProvenanceBadge'
import { FileDropZone } from '../../components/ui/FileDropZone'
import type { DataProvenanceKind } from '../../services/dataService'

interface KBEntry {
  id: string
  title: string
  authority: string
  jurisdiction: string
  tags: string[]
  file: string
  chunkCount: number
  provenance?: {
    kind: string
    source_url: string | null
    ingested_at: string
    ingested_by: string
  }
}

type ModalMode = 'none' | 'upload' | 'url' | 'edit'

function adminHeaders(): HeadersInit {
  const key = (import.meta.env.VITE_ADMIN_API_KEY as string | undefined) ?? ''
  return key ? { 'x-api-key': key } : {}
}

const PROVENANCE_OPTIONS: { value: DataProvenanceKind; label: string }[] = [
  { value: 'from_public_record', label: 'Public Record' },
  { value: 'issuer_attested', label: 'Issuer Attested' },
  { value: 'verified_real', label: 'Verified Real' },
  { value: 'modeled', label: 'Modeled' },
  { value: 'ai_predicted', label: 'AI Predicted' },
  { value: 'illustrative', label: 'Illustrative' },
]

function inputStyle(): React.CSSProperties {
  return {
    width: '100%',
    padding: '8px 10px',
    fontSize: 12,
    background: W.glass04,
    border: W.chromeBorder,
    borderRadius: W.radius.sm,
    color: W.text1,
    outline: 'none',
  }
}

function labelStyle(): React.CSSProperties {
  return { fontSize: 10, fontWeight: 600, color: W.text3, textTransform: 'uppercase' as const, letterSpacing: '0.05em' }
}

export default function KnowledgePage() {
  const [entries, setEntries] = useState<KBEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<ModalMode>('none')
  const [reindexing, setReindexing] = useState(false)

  const [title, setTitle] = useState('')
  const [authority, setAuthority] = useState('')
  const [jurisdiction, setJurisdiction] = useState('')
  const [tags, setTags] = useState('')
  const [category, setCategory] = useState('general')
  const [provenanceKind, setProvenanceKind] = useState<DataProvenanceKind>('from_public_record')
  const [sourceUrl, setSourceUrl] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [editEntry, setEditEntry] = useState<KBEntry | null>(null)
  const [editContent, setEditContent] = useState('')
  const [contentExpanded, setContentExpanded] = useState(false)

  const fetchEntries = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/knowledge', { headers: adminHeaders() })
      if (res.ok) {
        const data = await res.json() as { entries: KBEntry[] }
        setEntries(data.entries)
      }
    } catch (err) {
      console.error('[KB Admin] fetchEntries', err)
      setFeedback({ type: 'error', message: `Failed to load entries: ${err instanceof Error ? err.message : String(err)}` })
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetchEntries() }, [fetchEntries])

  const resetForm = () => {
    setTitle('')
    setAuthority('')
    setJurisdiction('')
    setTags('')
    setCategory('general')
    setProvenanceKind('from_public_record')
    setSourceUrl('')
    setSelectedFile(null)
    setEditEntry(null)
    setEditContent('')
    setContentExpanded(false)
  }

  const handleFileIngest = async () => {
    if (!selectedFile || !title || !authority) return
    setSubmitting(true)
    setFeedback(null)
    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('title', title)
      formData.append('authority', authority)
      formData.append('jurisdiction', jurisdiction)
      formData.append('tags', tags)
      formData.append('category', category)
      formData.append('provenanceKind', provenanceKind)
      if (sourceUrl) formData.append('sourceUrl', sourceUrl)
      formData.append('ingestedBy', 'admin-ui')

      const res = await fetch('/api/admin/knowledge/ingest', { method: 'POST', body: formData, headers: adminHeaders() })
      if (!res.ok) throw new Error((await res.json() as { error: string }).error)
      const result = await res.json() as { docId: string; chunkCount: number }
      setFeedback({ type: 'success', message: `Ingested "${result.docId}" — ${result.chunkCount} chunks` })
      setModal('none')
      resetForm()
      fetchEntries()
    } catch (err) {
      setFeedback({ type: 'error', message: err instanceof Error ? err.message : 'Ingestion failed' })
    }
    setSubmitting(false)
  }

  const handleUrlIngest = async () => {
    if (!sourceUrl || !title || !authority) return
    setSubmitting(true)
    setFeedback(null)
    try {
      const res = await fetch('/api/admin/knowledge/ingest-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...adminHeaders() },
        body: JSON.stringify({
          url: sourceUrl, title, authority, jurisdiction,
          tags: tags.split(',').map(t => t.trim()).filter(Boolean),
          category, provenanceKind, ingestedBy: 'admin-ui',
        }),
      })
      if (!res.ok) throw new Error((await res.json() as { error: string }).error)
      const result = await res.json() as { docId: string; chunkCount: number }
      setFeedback({ type: 'success', message: `Ingested "${result.docId}" — ${result.chunkCount} chunks` })
      setModal('none')
      resetForm()
      fetchEntries()
    } catch (err) {
      setFeedback({ type: 'error', message: err instanceof Error ? err.message : 'URL ingestion failed' })
    }
    setSubmitting(false)
  }

  const handleDelete = async (docId: string) => {
    if (!confirm(`Delete "${docId}" from the knowledge base?`)) return
    try {
      await fetch(`/api/admin/knowledge/${docId}`, { method: 'DELETE', headers: adminHeaders() })
      fetchEntries()
    } catch (err) {
      console.error('[KB Admin] handleDelete', err)
      setFeedback({ type: 'error', message: `Delete failed: ${err instanceof Error ? err.message : String(err)}` })
    }
  }

  const handleReindex = async () => {
    setReindexing(true)
    try {
      const res = await fetch('/api/admin/knowledge/reindex', { method: 'POST', headers: adminHeaders() })
      const result = await res.json() as { indexed: number; errors: string[] }
      setFeedback({ type: 'success', message: `Re-indexed ${result.indexed} documents` })
      fetchEntries()
    } catch {
      setFeedback({ type: 'error', message: 'Re-index failed' })
    }
    setReindexing(false)
  }

  const openEdit = async (entry: KBEntry) => {
    setEditEntry(entry)
    setTitle(entry.title)
    setAuthority(entry.authority)
    setJurisdiction(entry.jurisdiction)
    setTags(entry.tags.join(', '))
    setProvenanceKind((entry.provenance?.kind ?? 'from_public_record') as DataProvenanceKind)
    setSourceUrl(entry.provenance?.source_url ?? '')
    setContentExpanded(false)
    setEditContent('')
    setModal('edit')
    try {
      const res = await fetch(`/api/admin/knowledge/${entry.id}/content`, { headers: adminHeaders() })
      if (res.ok) {
        const data = await res.json() as { content: string }
        setEditContent(data.content)
      }
    } catch (err) {
      console.error('[KB Admin] openEdit content fetch', err)
      setFeedback({ type: 'error', message: `Failed to load content: ${err instanceof Error ? err.message : String(err)}` })
    }
  }

  const handleEditSave = async () => {
    if (!editEntry || !title || !authority) return
    setSubmitting(true)
    setFeedback(null)
    try {
      const res = await fetch(`/api/admin/knowledge/${editEntry.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...adminHeaders() },
        body: JSON.stringify({
          title, authority, jurisdiction,
          tags: tags.split(',').map(t => t.trim()).filter(Boolean),
          provenanceKind, sourceUrl: sourceUrl || undefined,
        }),
      })
      if (!res.ok) throw new Error((await res.json() as { error: string }).error)
      setFeedback({ type: 'success', message: `Updated "${editEntry.id}"` })
      setModal('none')
      resetForm()
      fetchEntries()
    } catch (err) {
      setFeedback({ type: 'error', message: err instanceof Error ? err.message : 'Update failed' })
    }
    setSubmitting(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: W.bg, color: W.text1, padding: '24px 32px', fontFamily: 'var(--font-sans)' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <a href="/" style={{ color: W.text3, textDecoration: 'none' }}><ArrowLeft size={18} /></a>
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Knowledge Base</h1>
          <span style={{ fontSize: 11, color: W.text4, marginLeft: 4 }}>{entries.length} documents</span>
          <div style={{ flex: 1 }} />
          <button
            onClick={handleReindex}
            disabled={reindexing}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 12px', fontSize: 11, fontWeight: 600,
              background: W.glass04, border: W.chromeBorder, borderRadius: W.radius.sm,
              color: W.text2, cursor: 'pointer', outline: 'none',
            }}
          >
            <RefreshCw size={12} className={reindexing ? 'animate-spin' : ''} />
            Re-index
          </button>
          <button
            onClick={() => { resetForm(); setModal('url') }}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 12px', fontSize: 11, fontWeight: 600,
              background: W.glass04, border: W.chromeBorder, borderRadius: W.radius.sm,
              color: W.text2, cursor: 'pointer', outline: 'none',
            }}
          >
            <Globe size={12} />
            Add URL
          </button>
          <button
            onClick={() => { resetForm(); setModal('upload') }}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 14px', fontSize: 11, fontWeight: 700,
              background: W.violet, border: 'none', borderRadius: W.radius.sm,
              color: '#fff', cursor: 'pointer', outline: 'none',
            }}
          >
            <Plus size={12} />
            Upload File
          </button>
        </div>

        {feedback && (
          <div style={{
            padding: '8px 14px', marginBottom: 16, borderRadius: W.radius.sm,
            fontSize: 11, fontWeight: 600,
            background: feedback.type === 'success' ? `${W.green}20` : `${W.red}20`,
            color: feedback.type === 'success' ? W.green : W.red,
            border: `1px solid ${feedback.type === 'success' ? W.green : W.red}40`,
          }}>
            {feedback.message}
          </div>
        )}

        {loading ? (
          <p style={{ color: W.text4, fontSize: 12 }}>Loading...</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {entries.map(entry => (
              <div
                key={entry.id}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 14px',
                  background: W.surface,
                  border: `1px solid ${W.border}`,
                  borderRadius: W.radius.md,
                }}
              >
                <FileText size={14} style={{ color: W.text3, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: W.text1 }}>{entry.title}</div>
                  <div style={{ fontSize: 10, color: W.text4, marginTop: 2 }}>
                    {entry.authority} · {entry.jurisdiction} · {entry.chunkCount} chunks
                  </div>
                </div>
                {entry.provenance?.kind && (
                  <ProvenanceBadge kind={entry.provenance.kind as DataProvenanceKind} />
                )}
                <div style={{ display: 'flex', gap: 4 }}>
                  {entry.tags.slice(0, 3).map(t => (
                    <span key={t} style={{
                      fontSize: 9, padding: '2px 6px', borderRadius: 4,
                      background: W.glass04, color: W.text3,
                    }}>
                      {t}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => openEdit(entry)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    padding: 4, color: W.text4, outline: 'none', flexShrink: 0,
                  }}
                  aria-label={`Edit ${entry.id}`}
                >
                  <Pencil size={13} />
                </button>
                <button
                  onClick={() => handleDelete(entry.id)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    padding: 4, color: W.text4, outline: 'none', flexShrink: 0,
                  }}
                  aria-label={`Delete ${entry.id}`}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Overlay */}
      <AnimatePresence>
        {modal !== 'none' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 1000,
              background: W.scrim,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            onClick={() => { setModal('none'); resetForm() }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              style={{
                width: 520, maxHeight: '85vh', overflow: 'auto',
                background: W.panel, border: `1px solid ${W.border}`,
                borderRadius: W.radius.lg, padding: 24,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <h2 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>
                  {modal === 'edit' ? 'Edit Document' : modal === 'upload' ? 'Upload Document' : 'Ingest from URL'}
                </h2>
                <button
                  onClick={() => { setModal('none'); resetForm() }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: W.text3, outline: 'none' }}
                >
                  <X size={16} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {modal === 'upload' && (
                  <div>
                    <FileDropZone onFile={setSelectedFile} disabled={submitting} />
                    {selectedFile && (
                      <p style={{ fontSize: 11, color: W.cyan, marginTop: 6 }}>
                        Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                      </p>
                    )}
                  </div>
                )}

                {modal === 'url' && (
                  <div>
                    <label htmlFor="kb-url" style={labelStyle()}>URL</label>
                    <input
                      id="kb-url"
                      value={sourceUrl}
                      onChange={e => setSourceUrl(e.target.value)}
                      placeholder="https://..."
                      style={inputStyle()}
                    />
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label htmlFor="kb-title" style={labelStyle()}>Title *</label>
                    <input id="kb-title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Document title" style={inputStyle()} />
                  </div>
                  <div>
                    <label htmlFor="kb-authority" style={labelStyle()}>Authority *</label>
                    <input id="kb-authority" value={authority} onChange={e => setAuthority(e.target.value)} placeholder="CONAMA, ANM, Meteoric..." style={inputStyle()} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label htmlFor="kb-jurisdiction" style={labelStyle()}>Jurisdiction</label>
                    <input id="kb-jurisdiction" value={jurisdiction} onChange={e => setJurisdiction(e.target.value)} placeholder="brazil, EU, USA..." style={inputStyle()} />
                  </div>
                  <div>
                    <label htmlFor="kb-category" style={labelStyle()}>Category</label>
                    <input id="kb-category" value={category} onChange={e => setCategory(e.target.value)} placeholder="brazil, international, caldeira..." style={inputStyle()} />
                  </div>
                </div>

                <div>
                  <label htmlFor="kb-tags" style={labelStyle()}>Tags (comma-separated)</label>
                  <input id="kb-tags" value={tags} onChange={e => setTags(e.target.value)} placeholder="water, regulation, mining..." style={inputStyle()} />
                </div>

                <div>
                  <label htmlFor="kb-provenance" style={labelStyle()}>Provenance Kind</label>
                  <select
                    id="kb-provenance"
                    value={provenanceKind}
                    onChange={e => setProvenanceKind(e.target.value as DataProvenanceKind)}
                    style={{ ...inputStyle(), appearance: 'auto' as never }}
                  >
                    {PROVENANCE_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>

                {(modal === 'upload' || modal === 'edit') && (
                  <div>
                    <label style={labelStyle()}>Source URL {modal === 'upload' ? '(optional)' : ''}</label>
                    <input value={sourceUrl} onChange={e => setSourceUrl(e.target.value)} placeholder="https://..." style={inputStyle()} />
                  </div>
                )}

                {modal === 'edit' && (
                  <div>
                    <button
                      type="button"
                      onClick={() => setContentExpanded(!contentExpanded)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        background: 'none', border: 'none', cursor: 'pointer',
                        padding: 0, color: W.text2, fontSize: 11, fontWeight: 600, outline: 'none',
                      }}
                    >
                      {contentExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                      Content Preview
                    </button>
                    {contentExpanded && (
                      <pre style={{
                        marginTop: 8, padding: 12, borderRadius: W.radius.sm,
                        background: W.glass04, border: W.chromeBorder,
                        fontSize: 11, fontFamily: 'monospace', color: W.text2,
                        maxHeight: 300, overflow: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                      }}>
                        {editContent || 'Loading...'}
                      </pre>
                    )}
                  </div>
                )}

                {modal === 'edit' ? (
                  <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                    <button
                      onClick={handleEditSave}
                      disabled={submitting || !title || !authority}
                      style={{
                        flex: 1, padding: '10px 16px', fontSize: 12, fontWeight: 700,
                        background: W.violet, border: 'none', borderRadius: W.radius.sm,
                        color: '#fff', cursor: 'pointer', outline: 'none',
                        opacity: submitting ? 0.5 : 1,
                      }}
                    >
                      {submitting ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={handleReindex}
                      disabled={reindexing}
                      style={{
                        padding: '10px 16px', fontSize: 12, fontWeight: 600,
                        background: W.glass04, border: W.chromeBorder, borderRadius: W.radius.sm,
                        color: W.text2, cursor: 'pointer', outline: 'none',
                      }}
                    >
                      <RefreshCw size={12} style={{ display: 'inline', verticalAlign: -2, marginRight: 4 }} />
                      Re-process
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={modal === 'upload' ? handleFileIngest : handleUrlIngest}
                    disabled={submitting || !title || !authority || (modal === 'upload' ? !selectedFile : !sourceUrl)}
                    style={{
                      padding: '10px 16px', fontSize: 12, fontWeight: 700,
                      background: W.violet, border: 'none', borderRadius: W.radius.sm,
                      color: '#fff', cursor: 'pointer', outline: 'none',
                      opacity: submitting ? 0.5 : 1, marginTop: 4,
                    }}
                  >
                    {submitting ? 'Processing...' : 'Ingest Document'}
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
