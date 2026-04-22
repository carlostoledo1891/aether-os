import { useState, type ReactNode } from 'react'

interface SectionShellProps {
  label: string
  children: ReactNode
  defaultOpen?: boolean
  resetKey?: string
}

export function SectionShell({ label, children, defaultOpen = true, resetKey }: SectionShellProps) {
  const [open, setOpen] = useState(defaultOpen)

  // React-canonical "reset on prop change" pattern (replaces a setState-in-effect
  // that triggered react-hooks/set-state-in-effect).
  const resetSignature = `${defaultOpen}|${resetKey ?? ''}`
  const [prevSignature, setPrevSignature] = useState(resetSignature)
  if (prevSignature !== resetSignature) {
    setPrevSignature(resetSignature)
    setOpen(defaultOpen)
  }

  return (
    <div style={{ borderBottom: '1px solid var(--w-border)' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--w-text3)', fontSize: 11,
          textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600,
        }}
      >
        {label}
        <span style={{ fontSize: 10, opacity: 0.5 }}>{open ? '▾' : '▸'}</span>
      </button>
      {open && (
        <div style={{ padding: '0 16px 12px' }}>
          {children}
        </div>
      )}
    </div>
  )
}
