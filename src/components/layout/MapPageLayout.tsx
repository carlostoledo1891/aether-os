import type { ReactNode } from 'react'
import { W } from '../../app/canvas/canvasTheme'

export interface MapPageLayoutProps {
  mapContent: ReactNode
  sidebarContent?: ReactNode
  bottomContent?: ReactNode
  sidebarWidth?: number
  mapBorderColor?: string
}

export function MapPageLayout({
  mapContent,
  sidebarContent,
  bottomContent,
  sidebarWidth = 300,
  mapBorderColor,
}: MapPageLayoutProps) {
  const edge = mapBorderColor ?? W.border

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        gap: 10,
        minHeight: 0,
      }}
    >
      <div
        style={{
          flex: '1 1 0',
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          minHeight: 0,
        }}
      >
        <div
          style={{
            flex: 1,
            minHeight: 0,
            position: 'relative',
            overflow: 'hidden',
            borderRadius: W.radius.lg,
            border: `1px solid ${W.border2}`,
            boxShadow: `0 4px 24px rgba(0,0,0,0.5)`,
          }}
        >
          {mapContent}
        </div>
        {bottomContent}
      </div>
      {sidebarContent != null ? (
        <div
          style={{
            width: sidebarWidth,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            flexShrink: 0,
            minHeight: 0,
          }}
        >
          {sidebarContent}
        </div>
      ) : null}
    </div>
  )
}
