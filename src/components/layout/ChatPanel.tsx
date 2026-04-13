import { useState, useRef, useEffect, useCallback, type KeyboardEvent, type ChangeEvent } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X, Send, Sparkles, Paperclip, FileText, ChevronDown, ChevronRight, Database } from 'lucide-react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { W } from '../../app/canvas/canvasTheme'
import { ProvenanceBadge } from '../ui/ProvenanceBadge'
import { KIND_COLOR } from '../ui/provenanceColors'
import type { DataProvenanceKind } from '../../services/dataService'
import styles from './ChatPanel.module.css'

interface ChatPanelProps {
  isOpen: boolean
  onClose: () => void
}

interface AttachedFile {
  fileId: string
  filename: string
  type: string
  preview: string
}

interface ToolPart {
  toolName: string
  toolCallId: string
  state: string
  input?: unknown
  output?: unknown
}

const TOOL_LABELS: Record<string, string> = {
  queryFinancials: 'Financials',
  queryResourceClassification: 'Resource Classification',
  queryPlantPerformance: 'Plant Performance',
  queryBatches: 'Compliance Batches',
  queryRisks: 'Risk Register',
  queryTimeline: 'Project Timeline',
  queryOfftakers: 'Offtakers',
  queryCapital: 'Capital Structure',
  queryDfsWorkstreams: 'DFS Workstreams',
  queryBenchmarks: 'Benchmarks',
  queryIssuerSnapshot: 'Issuer Snapshot',
  queryTelemetry: 'Telemetry',
  queryWeather: 'Weather',
  queryMarketData: 'Market Data',
  queryRegulatory: 'Regulatory',
  queryUThSafety: 'U/Th Safety',
  webSearch: 'Web Search',
  queryDSCR: 'DSCR Projections',
  queryDrawdown: 'Drawdown Schedule',
  queryPricing: 'Pricing Model',
  queryMarketSizing: 'Market Sizing',
  queryLithology: 'Lithology',
  queryDPPValidation: 'DPP Validation',
  queryStakeholders: 'Stakeholders',
  querySecurityArchitecture: 'Security',
  queryWeatherForecast: 'Weather Forecast',
  queryWeatherHistory: 'Climate History',
  analyzeEnvironmentalRisk: 'Environmental Risk',
  querySpringHealthPrediction: 'Spring Prediction',
  queryKnowledgeBase: 'Knowledge Base',
}

function getToolLabel(toolName: string): string {
  return TOOL_LABELS[toolName] ?? toolName.replace(/^query/, '').replace(/([A-Z])/g, ' $1').trim()
}

function summarizeOutput(output: unknown): string {
  if (output == null) return 'No data'
  const str = typeof output === 'string' ? output : JSON.stringify(output)
  return str.length > 120 ? str.slice(0, 117) + '...' : str
}

function extractToolParts(parts: Array<{ type: string; [k: string]: unknown }>): ToolPart[] {
  return parts
    .filter(p => p.type === 'dynamic-tool' || (typeof p.type === 'string' && p.type.startsWith('tool-')))
    .map(p => ({
      toolName: (p.toolName as string) ?? p.type.replace(/^tool-/, ''),
      toolCallId: p.toolCallId as string,
      state: (p.state as string) ?? 'unknown',
      input: p.input,
      output: p.output,
    }))
}

interface KBResult {
  id: string
  title: string
  authority: string
  provenance_kind?: string
  source_url?: string | null
}

function extractKBResults(output: unknown): KBResult[] {
  if (!output || typeof output !== 'object') return []
  const obj = output as Record<string, unknown>
  if (!Array.isArray(obj.results)) return []
  return (obj.results as KBResult[]).filter(r => r.id && r.title)
}

function ToolProvenance({ tools }: { tools: ToolPart[] }) {
  const [expanded, setExpanded] = useState(false)
  if (tools.length === 0) return null

  const completed = tools.filter(t => t.state === 'output-available')
  const label = completed.length > 0
    ? completed.map(t => getToolLabel(t.toolName)).join(', ')
    : tools.map(t => getToolLabel(t.toolName)).join(', ')

  return (
    <div className={styles.provenanceSection}>
      <button
        type="button"
        className={styles.provenanceToggle}
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
      >
        <Database size={10} style={{ color: W.violet, flexShrink: 0 }} />
        <span className={styles.provenanceLabel}>Sources: {label}</span>
        {expanded
          ? <ChevronDown size={10} style={{ color: W.text4 }} />
          : <ChevronRight size={10} style={{ color: W.text4 }} />}
      </button>
      {expanded && (
        <div className={styles.provenanceDetail}>
          {tools.map(t => {
            const kbResults = t.toolName === 'queryKnowledgeBase' && t.state === 'output-available'
              ? extractKBResults(t.output)
              : []

            return (
              <div key={t.toolCallId} className={styles.provenanceItem}>
                <span className={styles.provenanceToolName}>{getToolLabel(t.toolName)}</span>
                {kbResults.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginTop: 3 }}>
                    {kbResults.map(r => (
                      <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 9 }}>
                        {r.provenance_kind && (
                          <ProvenanceBadge kind={r.provenance_kind as DataProvenanceKind} />
                        )}
                        <span style={{ color: W.text2 }}>{r.title}</span>
                        {r.source_url && (
                          <a href={r.source_url} target="_blank" rel="noopener noreferrer"
                            style={{ color: `${KIND_COLOR[r.provenance_kind as DataProvenanceKind] ?? W.text4}`, fontSize: 8 }}>
                            [link]
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    {t.state === 'output-available' && t.output != null && (
                      <span className={styles.provenanceOutput}>{summarizeOutput(t.output)}</span>
                    )}
                    {t.state === 'output-error' && (
                      <span className={styles.provenanceError}>Error</span>
                    )}
                  </>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function getMessageText(parts: Array<{ type: string; text?: string }>): string {
  return parts
    .filter((p): p is { type: 'text'; text: string } => p.type === 'text' && typeof p.text === 'string')
    .map((p) => p.text)
    .join('')
}

export function ChatPanel({ isOpen, onClose }: ChatPanelProps) {
  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  })
  const [input, setInput] = useState('')
  const isLoading = status === 'streaming' || status === 'submitted'

  const [attachedFile, setAttachedFile] = useState<AttachedFile | null>(null)
  const [uploading, setUploading] = useState(false)

  const closeRef = useRef<HTMLButtonElement>(null)
  const drawerRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isLoading])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return }
      if (e.key === 'Tab' && drawerRef.current) {
        const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        )
        if (focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault(); last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isOpen, onClose])

  const sessionIdRef = useRef<string | null>(null)

  const doSend = useCallback(() => {
    const text = input.trim()
    if (!text) return
    const fileContext = attachedFile
      ? `\n\n[Attached file: ${attachedFile.filename} (${attachedFile.type})]\n${attachedFile.preview}`
      : ''
    sendMessage({ text: text + fileContext })
    setInput('')
    setAttachedFile(null)
  }, [input, sendMessage, attachedFile])

  const onKeyDownInput = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      doSend()
    }
  }

  const handleFileSelect = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const headers: Record<string, string> = {}
      if (sessionIdRef.current) headers['x-chat-session'] = sessionIdRef.current
      const res = await fetch('/api/chat/upload', { method: 'POST', body: formData, headers })
      if (!res.ok) throw new Error(`Upload failed: ${res.status}`)
      const sid = res.headers.get('x-chat-session')
      if (sid) sessionIdRef.current = sid
      const data = await res.json() as AttachedFile
      setAttachedFile(data)
    } catch (err) {
      console.error('File upload failed:', err)
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }, [])

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }
  void formatBytes

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className={styles.scrim}
            style={{ background: W.scrim }}
          />
          <motion.div
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Vero AI chat"
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 30 }}
            className={styles.drawer}
          >
            {/* Header */}
            <div className={styles.header}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Sparkles size={14} style={{ color: W.violet }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: W.text1 }}>Vero AI</span>
                <span className={`${styles.provenanceBadge} ${styles.provenanceVero}`}>
                  Analyst
                </span>
              </div>
              <button
                ref={closeRef}
                type="button"
                aria-label="Close chat"
                onClick={onClose}
                style={{
                  width: 28, height: 28,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: W.glass04, border: W.chromeBorder,
                  borderRadius: W.radius.sm, cursor: 'pointer', outline: 'none',
                }}
              >
                <X size={12} style={{ color: W.text3 }} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className={styles.messages}>
              {messages.length === 0 && !isLoading && (
                <div className={styles.emptyState}>
                  <Sparkles size={28} style={{ opacity: 0.4 }} />
                  <p>
                    Ask about Caldeira project data: financials, deposits,
                    pilot plant KPIs, compliance batches, risks, or telemetry.
                  </p>
                </div>
              )}

              {messages.map((m) => {
                const text = getMessageText(m.parts)
                const toolParts = m.role === 'assistant' ? extractToolParts(m.parts as Array<{ type: string; [k: string]: unknown }>) : []
                return (
                  <div
                    key={m.id}
                    className={m.role === 'user' ? styles.msgUser : styles.msgAssistant}
                  >
                    {text.split('\n').map((line: string, i: number) => (
                      <span key={i}>
                        {line}
                        {i < text.split('\n').length - 1 && <br />}
                      </span>
                    ))}
                    {toolParts.length > 0 && <ToolProvenance tools={toolParts} />}
                  </div>
                )
              })}

              {isLoading && (
                <div className={styles.loadingDots}>
                  <span />
                  <span />
                  <span />
                </div>
              )}

              {error && (
                <div className={styles.msgAssistant} style={{ borderColor: `${W.red}40`, color: W.red }}>
                  Error: {error.message || 'Something went wrong. Check if the API server is running.'}
                </div>
              )}
            </div>

            {/* Attached file chip */}
            {attachedFile && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '6px 16px',
                borderTop: W.hairlineBorder,
                background: W.glass02,
              }}>
                <FileText size={12} style={{ color: W.violet, flexShrink: 0 }} />
                <span style={{ fontSize: 10, color: W.text2, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {attachedFile.filename}
                </span>
                <span className={`${styles.provenanceBadge} ${styles.provenanceExternal}`}>
                  {attachedFile.type}
                </span>
                <button
                  type="button"
                  onClick={() => setAttachedFile(null)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: W.text4, outline: 'none' }}
                  aria-label="Remove attached file"
                >
                  <X size={10} />
                </button>
              </div>
            )}

            {/* Input */}
            <form onSubmit={(e) => { e.preventDefault(); doSend() }} className={styles.inputRow}>
              <input
                id="vero-file-upload"
                ref={fileInputRef}
                type="file"
                accept=".csv,.pdf,.json,.txt"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading || isLoading}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: 32, height: 32,
                  background: W.glass04, border: W.chromeBorder,
                  borderRadius: W.radius.sm, cursor: 'pointer', outline: 'none',
                  flexShrink: 0, opacity: uploading ? 0.4 : 1,
                }}
                aria-label="Attach file"
              >
                <Paperclip size={13} style={{ color: W.text3 }} />
              </button>
              <textarea
                id="vero-chat-input"
                name="vero-chat-input"
                ref={inputRef}
                className={styles.inputField}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDownInput}
                placeholder={attachedFile ? `Ask about ${attachedFile.filename}...` : 'Ask Vero AI...'}
                rows={1}
                disabled={isLoading}
              />
              <button
                type="submit"
                className={styles.sendBtn}
                disabled={isLoading || !input.trim()}
                aria-label="Send message"
              >
                <Send size={14} />
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
