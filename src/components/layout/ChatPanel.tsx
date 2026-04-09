import { useState, useRef, useEffect, useCallback, type KeyboardEvent, type ChangeEvent } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X, Send, Sparkles, Paperclip, FileText } from 'lucide-react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { W } from '../../app/canvas/canvasTheme'
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

  const doSend = useCallback(() => {
    const text = input.trim()
    if (!text) return
    sendMessage({ text })
    setInput('')
    setAttachedFile(null)
  }, [input, sendMessage])

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
      const res = await fetch('/api/chat/upload', { method: 'POST', body: formData })
      if (!res.ok) throw new Error(`Upload failed: ${res.status}`)
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
