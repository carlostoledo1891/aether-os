import type { CSSProperties, ReactNode } from 'react'

export interface PanelShellProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
}

export function PanelShell({ children, className, style }: PanelShellProps) {
  return (
    <div
      className={className}
      style={{
        flex: 1,
        minHeight: 0,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        ...style,
      }}
    >
      {children}
    </div>
  )
}
