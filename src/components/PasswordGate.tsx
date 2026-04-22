import { useState, useEffect, useRef, type ReactNode } from 'react'
import { W } from '../theme/publicTheme'

const V = W.violet

const STORAGE_KEY = 'verochain_session'
const SESSION_TTL = 30 * 24 * 60 * 60 * 1000 // 30 days in ms
const SITE_PASSWORD = import.meta.env.VITE_SITE_PASSWORD ?? '65d5191ed4e2'

function isSessionValid(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return false
    const ts = parseInt(raw, 10)
    return !isNaN(ts) && Date.now() - ts < SESSION_TTL
  } catch {
    return false
  }
}

function grantSession() {
  localStorage.setItem(STORAGE_KEY, String(Date.now()))
}

export function PasswordGate({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState(() => isSessionValid())
  const [input, setInput] = useState('')
  const [shake, setShake] = useState(false)
  const [error, setError] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (unlocked) return
    const id = setInterval(() => {
      if (!isSessionValid()) setUnlocked(false)
    }, 60_000)
    return () => clearInterval(id)
  }, [unlocked])

  useEffect(() => {
    if (!unlocked) inputRef.current?.focus()
  }, [unlocked])

  if (unlocked) return <>{children}</>

  function attempt() {
    if (input.trim() === SITE_PASSWORD) {
      grantSession()
      setUnlocked(true)
    } else {
      setError(true)
      setShake(true)
      setInput('')
      setTimeout(() => setShake(false), 500)
      setTimeout(() => setError(false), 2500)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: W.bg,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-sans)',
      padding: '24px',
    }}>
      {/* Ambient glow */}
      <div style={{
        position: 'fixed', top: '-20vw', left: '20vw',
        width: '55vw', height: '55vw', borderRadius: '50%',
        background: `radial-gradient(circle, ${V}10, transparent 70%)`,
        filter: 'blur(80px)', pointerEvents: 'none',
      }} />

      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: 380,
        background: W.glass04,
        border: `1px solid ${error ? W.red + '40' : W.glass08}`,
        borderRadius: 18,
        padding: '40px 36px',
        textAlign: 'center',
        transition: 'border-color 0.3s',
        animation: shake ? 'vgShake 0.45s ease' : 'none',
      }}>
        <div style={{ fontSize: 11, color: W.text4, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>
          Private Preview
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: W.text1, marginBottom: 8 }}>
          VeroChain
        </h1>
        <p style={{ fontSize: 13, color: W.text3, lineHeight: 1.6, marginBottom: 32 }}>
          This environment is invite-only. Enter the access password to continue.
        </p>

        <input
          ref={inputRef}
          type="password"
          value={input}
          onChange={e => { setInput(e.target.value); setError(false) }}
          onKeyDown={e => e.key === 'Enter' && attempt()}
          placeholder="Access password"
          style={{
            width: '100%',
            boxSizing: 'border-box',
            padding: '12px 16px',
            borderRadius: 9,
            border: `1px solid ${error ? W.red + '60' : W.glass12}`,
            background: W.glass04,
            color: W.text1,
            fontSize: 14,
            fontFamily: 'var(--font-mono)',
            outline: 'none',
            letterSpacing: '0.08em',
            transition: 'border-color 0.2s',
            marginBottom: 12,
          }}
        />

        {error && (
          <div style={{ fontSize: 12, color: W.red, marginBottom: 12, fontWeight: 600 }}>
            Incorrect password. Try again.
          </div>
        )}

        <button
          type="button"
          onClick={attempt}
          style={{
            width: '100%',
            padding: '12px',
            background: V,
            border: 'none',
            borderRadius: 9,
            color: '#fff',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            letterSpacing: '0.02em',
          }}
        >
          Continue
        </button>

        <p style={{ fontSize: 11, color: W.text4, marginTop: 24, lineHeight: 1.5 }}>
          Session expires after 30 days.
        </p>
      </div>

      <style>{`
        @keyframes vgShake {
          0%   { transform: translateX(0); }
          15%  { transform: translateX(-7px); }
          30%  { transform: translateX(7px); }
          45%  { transform: translateX(-5px); }
          60%  { transform: translateX(5px); }
          75%  { transform: translateX(-2px); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </div>
  )
}
