/**
 * Shared report layout primitives.
 *
 * Replaces the duplicated sectionStyle / cardStyle / sectionTitle()
 * pattern across EnvironmentReport, OperationsReport, DrillTestsReport.
 */

import type { ReactNode, CSSProperties } from 'react'
import { WL } from './reportTheme'

export const SECTION_STYLE: CSSProperties = {
  padding: '32px 40px',
  borderBottom: `1px solid ${WL.border}`,
}

export const CARD_STYLE: CSSProperties = {
  background: WL.surface,
  border: `1px solid ${WL.border}`,
  borderRadius: WL.radius.lg,
  padding: 20,
}

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
