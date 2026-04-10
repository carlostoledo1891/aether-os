import type { CSSProperties, ReactNode } from 'react'

export interface DataGridProps {
  columns?: 2 | 3 | 4
  gap?: number
  children: ReactNode
  className?: string
  style?: CSSProperties
}

export function DataGrid({
  columns = 2,
  gap = 8,
  children,
  className,
  style,
}: DataGridProps) {
  return (
    <div
      className={className}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap,
        ...style,
      }}
    >
      {children}
    </div>
  )
}
