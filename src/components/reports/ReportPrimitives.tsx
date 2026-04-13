/**
 * Shared report layout primitives.
 *
 * Replaces the duplicated sectionStyle / cardStyle / sectionTitle()
 * pattern across EnvironmentReport, OperationsReport, DrillTestsReport.
 *
 * Non-component exports (SECTION_STYLE, CARD_STYLE) live in
 * ./reportPrimitivesHelpers.ts to satisfy react-refresh/only-export-components.
 */

import type { ReactNode, CSSProperties } from 'react'
import { WL } from './reportTheme'
import { SECTION_STYLE, CARD_STYLE } from './reportPrimitivesHelpers'

export function ReportSection({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <div style={{ ...SECTION_STYLE, ...style }}>{children}</div>
}

export function ReportCard({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <div style={{ ...CARD_STYLE, ...style }}>{children}</div>
}

export function ReportSectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 style={{
      fontSize: 14, fontWeight: 700, color: WL.text1,
      letterSpacing: '-0.01em', margin: '0 0 20px',
      fontFamily: 'var(--font-ui)',
      display: 'flex', alignItems: 'center', gap: 8,
    }}>
      {children}
    </h2>
  )
}
