import {
  useState, useRef, useEffect, useCallback,
  type KeyboardEvent, type ChangeEvent,
} from 'react'
import { motion } from 'motion/react'
import { X, Send, Plus, FileText, MapPin } from 'lucide-react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { W } from '../../app/canvas/canvasTheme'
import { buildApiUrl } from '../../config/env'
import { ToolProvenance } from './ToolProvenance'
import { extractToolParts } from './toolProvenanceUtils'
import { mapCommandBus } from './mapCommandBus'
import { mapCommandStatusBus } from './mapCommandStatusBus'
import type { MapCommand } from './mapActionTypes'
import styles from './VeroChat.module.css'

const CHAT_API_KEY = import.meta.env.VITE_CHAT_API_KEY as string | undefined
const AUTH_HEADERS: Record<string, string> = CHAT_API_KEY ? { 'x-api-key': CHAT_API_KEY } : {}
const CHAT_API_URL = buildApiUrl('/api/chat')
const CHAT_UPLOAD_API_URL = buildApiUrl('/api/chat/upload')

interface AttachedFile {
  fileId: string
  filename: string
  type: string
  preview: string
}

interface VeroChatProps {
  activeMapId: string
}

interface ChatNotice {
  level: 'error' | 'info'
  message: string
}

const STICKY_SCROLL_THRESHOLD = 40
const COMPOSER_MAX_HEIGHT = 120

function getMessageText(parts: Array<{ type: string; text?: string }>): string {
  return parts
    .filter((p): p is { type: 'text'; text: string } => p.type === 'text' && typeof p.text === 'string')
    .map(p => p.text)
    .join('')
}

function describeMapAction(action: {
  type: string
  layerId?: string
  visible?: boolean
  center?: { lng: number; lat: number }
  featureId?: string
  bookmarkId?: string
}): string {
  switch (action.type) {
    case 'toggleLayer':
      return `${action.visible ? 'Showed' : 'Hid'} layer: ${action.layerId}`
    case 'flyTo':
      return 'Moved camera to location'
    case 'bookmark':
      return `Moved camera to bookmark: ${action.bookmarkId}`
    case 'highlight':
      return `Highlighted feature: ${action.featureId}`
    case 'fitBounds':
      return 'Fitted map to bounds'
    case 'clearHighlight':
      return 'Cleared highlights'
    default:
      return 'Map viewport updated'
  }
}

export function VeroChat({ activeMapId }: VeroChatProps) {
  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: CHAT_API_URL, headers: AUTH_HEADERS }),
  })
  const [input, setInput] = useState('')
  const [notice, setNotice] = useState<ChatNotice | null>(null)
  const isLoading = status === 'streaming' || status === 'submitted'
  const hasActivity = messages.length > 0 || isLoading || Boolean(error) || Boolean(notice)

  const [attachedFile, setAttachedFile] = useState<AttachedFile | null>(null)
  const [uploading, setUploading] = useState(false)

  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const sessionIdRef = useRef<string | null>(null)
  const dispatchedActionsRef = useRef(new Set<string>())
  const stickToBottomRef = useRef(true)

  const syncTextareaHeight = useCallback((textarea = inputRef.current) => {
    if (!textarea) return
    textarea.style.height = '0px'
    textarea.style.height = `${Math.min(textarea.scrollHeight, COMPOSER_MAX_HEIGHT)}px`
  }, [])

  const handleMessageScroll = useCallback(() => {
    const node = scrollRef.current
    if (!node) return
    const remaining = node.scrollHeight - node.scrollTop - node.clientHeight
    stickToBottomRef.current = remaining <= STICKY_SCROLL_THRESHOLD
  }, [])

  useEffect(() => {
    syncTextareaHeight()
  }, [input, syncTextareaHeight])

  useEffect(() => {
    const node = scrollRef.current
    if (!node || !stickToBottomRef.current) return
    const raf = window.requestAnimationFrame(() => {
      node.scrollTop = node.scrollHeight
    })
    return () => window.cancelAnimationFrame(raf)
  }, [messages, isLoading, notice])

  useEffect(() => mapCommandStatusBus.subscribe(status => {
    if (status.targetMapId && status.targetMapId !== activeMapId) return
    setNotice({ level: status.level, message: status.message })
  }), [activeMapId])

  useEffect(() => {
    for (const msg of messages) {
      if (msg.role !== 'assistant') continue
      const toolParts = extractToolParts(msg.parts as Array<{ type: string; [k: string]: unknown }>)
      for (const t of toolParts) {
        if (t.toolName !== 'mapAction' || t.state !== 'output-available') continue
        const key = t.toolCallId
        if (dispatchedActionsRef.current.has(key)) continue
        dispatchedActionsRef.current.add(key)
        const output = t.output as { mapActions?: MapCommand[] } | null
        if (!output?.mapActions) continue
        for (const action of output.mapActions) {
          mapCommandBus.dispatch(action, { targetMapId: activeMapId, source: 'chat' })
        }
      }
    }
  }, [activeMapId, messages])

  const doSend = useCallback((text?: string) => {
    const msg = (text ?? input).trim()
    if (!msg) return
    const fileContext = attachedFile
      ? `\n\n[Attached file: ${attachedFile.filename} (${attachedFile.type})]\n${attachedFile.preview}`
      : ''
    setNotice(null)
    sendMessage({ text: msg + fileContext })
    setInput('')
    setAttachedFile(null)
    window.requestAnimationFrame(() => syncTextareaHeight())
  }, [attachedFile, input, sendMessage, syncTextareaHeight])

  const onKeyDownInput = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      doSend()
    }
  }

  const handleFileSelect = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setNotice(null)
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const headers: Record<string, string> = { ...AUTH_HEADERS }
      if (sessionIdRef.current) headers['x-chat-session'] = sessionIdRef.current
      const res = await fetch(CHAT_UPLOAD_API_URL, { method: 'POST', body: formData, headers })
      if (!res.ok) throw new Error(`Upload failed: ${res.status}`)
      const sid = res.headers.get('x-chat-session')
      if (sid) sessionIdRef.current = sid
      const data = await res.json() as AttachedFile
      setAttachedFile(data)
      setNotice(null)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'File upload failed.'
      console.error('File upload failed:', err)
      setNotice({ level: 'error', message })
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }, [])

  return (
    <div className={styles.shell}>
      <input
        id="vero-file-upload"
        ref={fileInputRef}
        type="file"
        accept=".csv,.pdf,.json,.txt"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
      <motion.div
        layout="position"
        role="dialog"
        aria-label="VeroChain AI chat"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className={`${styles.panel} ${hasActivity ? styles.panelExpanded : styles.panelCompact}`}
      >
        {hasActivity && (
          <div ref={scrollRef} className={styles.messages} onScroll={handleMessageScroll}>
            {notice && (
              <div className={`${styles.noticeCard} ${notice.level === 'error' ? styles.noticeError : styles.noticeInfo}`}>
                <span className={styles.noticeText}>{notice.message}</span>
                <button
                  type="button"
                  className={styles.noticeDismiss}
                  onClick={() => setNotice(null)}
                  aria-label="Dismiss chat notice"
                >
                  <X size={10} />
                </button>
              </div>
            )}
            {messages.map(m => {
              const text = getMessageText(m.parts as Array<{ type: string; text?: string }>)
              const toolParts = m.role === 'assistant'
                ? extractToolParts(m.parts as Array<{ type: string; [k: string]: unknown }>)
                : []
              const mapActions = toolParts
                .filter(t => t.toolName === 'mapAction' && t.state === 'output-available')
                .flatMap(t => {
                  const out = t.output as {
                    mapActions?: Array<{
                      type: string
                      layerId?: string
                      visible?: boolean
                      center?: { lng: number; lat: number }
                      featureId?: string
                      bookmarkId?: string
                    }>
                  } | null
                  return out?.mapActions ?? []
                })
              const otherTools = toolParts.filter(t => t.toolName !== 'mapAction')

              return (
                <div key={m.id}>
                  {text && (
                    <div className={m.role === 'user' ? styles.msgUser : styles.msgAssistant}>
                      {text.split('\n').map((line, i, arr) => (
                        <span key={i}>
                          {line}
                          {i < arr.length - 1 && <br />}
                        </span>
                      ))}
                      {otherTools.length > 0 && <ToolProvenance tools={otherTools} />}
                    </div>
                  )}
                  {mapActions.length > 0 && (
                    <div className={styles.mapActionCard}>
                      <MapPin size={12} style={{ flexShrink: 0 }} />
                      <span className={styles.mapActionLabel}>
                        {mapActions.map(a => describeMapAction(a)).join(' · ')}
                      </span>
                    </div>
                  )}
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
              <div className={`${styles.msgAssistant} ${styles.msgError}`}>
                Error: {error.message || 'Something went wrong. Check if the API server is running.'}
              </div>
            )}
          </div>
        )}

        {attachedFile && (
          <div className={styles.attachedChip}>
            <FileText size={12} style={{ color: W.violet, flexShrink: 0 }} />
            <span className={styles.attachedFilename}>{attachedFile.filename}</span>
            <button
              type="button"
              onClick={() => setAttachedFile(null)}
              className={styles.iconBtn}
              aria-label="Remove attached file"
            >
              <X size={10} />
            </button>
          </div>
        )}

        <form
          onSubmit={e => { e.preventDefault(); doSend() }}
          className={styles.composerRow}
        >
          <button
            type="button"
            className={styles.iconBtn}
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || isLoading}
            aria-label="Attach file"
            style={{ opacity: uploading ? 0.4 : 1 }}
          >
            <Plus size={15} />
          </button>
          <div className={styles.composerCard}>
            <textarea
              ref={inputRef}
              className={styles.composerTextarea}
              value={input}
              onChange={e => {
                setInput(e.target.value)
                syncTextareaHeight(e.target)
              }}
              onKeyDown={onKeyDownInput}
              placeholder={attachedFile ? `Ask about ${attachedFile.filename}...` : 'Ask VeroChain AI...'}
              rows={1}
              disabled={isLoading}
            />
          </div>
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
    </div>
  )
}
