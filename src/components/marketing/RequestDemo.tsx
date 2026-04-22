import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
  type ReactNode,
} from 'react'
import { W, V } from '../../theme/publicTheme'
import {
  REQUEST_DEMO_OPEN_EVENT,
  REQUEST_DEMO_CLOSE_EVENT,
  openRequestDemo,
} from './requestDemoBus'
import { RequestDemoContext } from './useRequestDemo'

type DemoStatus = 'idle' | 'sending' | 'sent' | 'error'

export function RequestDemoProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])

  useEffect(() => {
    const handleOpen = () => setIsOpen(true)
    const handleClose = () => setIsOpen(false)
    window.addEventListener(REQUEST_DEMO_OPEN_EVENT, handleOpen)
    window.addEventListener(REQUEST_DEMO_CLOSE_EVENT, handleClose)
    return () => {
      window.removeEventListener(REQUEST_DEMO_OPEN_EVENT, handleOpen)
      window.removeEventListener(REQUEST_DEMO_CLOSE_EVENT, handleClose)
    }
  }, [])

  const value = useMemo(() => ({ open, close, isOpen }), [open, close, isOpen])

  return (
    <RequestDemoContext.Provider value={value}>
      {children}
      {isOpen && <RequestDemoOverlay onClose={close} />}
    </RequestDemoContext.Provider>
  )
}

const overlayStyle: CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 1000,
  background: 'rgba(7, 7, 14, 0.78)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 24,
  animation: 'requestDemoFade 200ms ease-out',
}

const cardStyle: CSSProperties = {
  width: '100%',
  maxWidth: 480,
  background: W.surface,
  border: `1px solid ${W.glass12}`,
  borderRadius: 16,
  boxShadow: '0 24px 80px rgba(0, 0, 0, 0.55)',
  padding: '28px 28px 24px',
  position: 'relative',
  color: W.text1,
  fontFamily: 'var(--font-sans)',
}

const labelStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: W.text3,
  marginBottom: 6,
}

const inputBase: CSSProperties = {
  width: '100%',
  background: W.glass04,
  border: `1px solid ${W.glass08}`,
  borderRadius: 8,
  padding: '10px 12px',
  fontSize: 14,
  color: W.text1,
  fontFamily: 'inherit',
  outline: 'none',
  transition: 'border-color 120ms ease',
}

function RequestDemoOverlay({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<DemoStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const firstFieldRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    firstFieldRef.current?.focus()
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKey)
      document.body.style.overflow = prevOverflow
    }
  }, [onClose])

  const submit = useCallback(async (e: FormEvent) => {
    e.preventDefault()
    if (status === 'sending') return
    setStatus('sending')
    setError(null)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
          source: typeof window !== 'undefined' ? window.location.pathname : '',
        }),
      })
      if (!res.ok) {
        const detail = await res.text().catch(() => '')
        throw new Error(detail || `Request failed (${res.status})`)
      }
      setStatus('sent')
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Failed to send. Please try again.')
    }
  }, [name, email, message, status])

  return (
    <div style={overlayStyle} role="presentation">
      <style>{`@keyframes requestDemoFade { from { opacity: 0 } to { opacity: 1 } }`}</style>
      <button
        type="button"
        aria-label="Close request demo dialog"
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'transparent',
          border: 'none',
          padding: 0,
          margin: 0,
          cursor: 'default',
        }}
      />
      <div
        style={{ ...cardStyle, position: 'relative' }}
        role="dialog"
        aria-modal="true"
        aria-label="Request a demo"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute',
            top: 14,
            right: 14,
            width: 28,
            height: 28,
            borderRadius: 8,
            border: `1px solid ${W.glass08}`,
            background: 'transparent',
            color: W.text3,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 16,
            lineHeight: 1,
          }}
        >
          ×
        </button>

        {status === 'sent' ? (
          <div style={{ textAlign: 'center', padding: '24px 8px 8px' }}>
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: V, marginBottom: 12 }}>
              Request received
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 12px', color: W.text1 }}>
              Thanks — we'll be in touch.
            </h2>
            <p style={{ fontSize: 14, color: W.text3, lineHeight: 1.5, margin: '0 auto 24px', maxWidth: 360 }}>
              Carlos will reply directly with a calendar link and a short demo agenda. Usually within 1 business day.
            </p>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: V,
                color: '#fff',
                border: 'none',
                padding: '12px 28px',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: V, marginBottom: 8 }}>
              Vero
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 6px', color: W.text1 }}>
              Request a demo
            </h2>
            <p style={{ fontSize: 13, color: W.text3, margin: '0 0 22px', lineHeight: 1.5 }}>
              Tell us about the operation you want to instrument. We'll send a short walkthrough and a calendar link.
            </p>

            <div style={{ marginBottom: 14 }}>
              <div style={labelStyle}>Name</div>
              <input
                ref={firstFieldRef}
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                style={inputBase}
                autoComplete="name"
              />
            </div>

            <div style={{ marginBottom: 14 }}>
              <div style={labelStyle}>Email</div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                style={inputBase}
                autoComplete="email"
              />
            </div>

            <div style={{ marginBottom: 18 }}>
              <div style={labelStyle}>Message</div>
              <textarea
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Operation, vertical, what you want to see in the demo."
                rows={4}
                style={{ ...inputBase, resize: 'vertical', minHeight: 96, fontFamily: 'inherit' }}
              />
            </div>

            {error && (
              <div style={{ fontSize: 12, color: W.red, marginBottom: 14 }}>{error}</div>
            )}

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', alignItems: 'center' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  background: 'transparent',
                  color: W.text3,
                  border: `1px solid ${W.glass08}`,
                  padding: '10px 18px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={status === 'sending'}
                style={{
                  background: V,
                  color: '#fff',
                  border: 'none',
                  padding: '10px 22px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: status === 'sending' ? 'wait' : 'pointer',
                  opacity: status === 'sending' ? 0.7 : 1,
                  letterSpacing: '0.01em',
                }}
              >
                {status === 'sending' ? 'Sending…' : 'Send'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

interface RequestDemoButtonProps {
  variant?: 'primary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  label?: string
  style?: CSSProperties
}

const sizeMap = {
  sm: { padding: '7px 16px', fontSize: 12 },
  md: { padding: '10px 22px', fontSize: 13 },
  lg: { padding: '14px 28px', fontSize: 14 },
}

export function RequestDemoButton({
  variant = 'primary',
  size = 'md',
  label = 'Request a demo',
  style,
}: RequestDemoButtonProps) {
  const sz = sizeMap[size]
  const base: CSSProperties = {
    border: 'none',
    borderRadius: 8,
    fontWeight: 700,
    cursor: 'pointer',
    letterSpacing: '0.01em',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...sz,
  }
  // Primary uses a slightly darker, more saturated violet than the brand
  // token (`V` = #7C5CFC). Reads with more weight against the dark globe
  // basemap without breaking from the brand family.
  const variantStyle: CSSProperties =
    variant === 'ghost'
      ? { background: 'transparent', color: W.text2, border: `1px solid ${W.glass12}` }
      : { background: '#5A2EE6', color: '#fff' }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        openRequestDemo()
      }}
      style={{ ...base, ...variantStyle, ...style }}
    >
      {label}
    </button>
  )
}
