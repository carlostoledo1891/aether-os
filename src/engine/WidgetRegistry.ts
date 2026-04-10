import type { ComponentType } from 'react'

import { MetricCard } from '../components/ui/MetricCard'
import { MetricDisplay } from '../components/ui/MetricDisplay'
import { GlassCard } from '../components/ui/GlassCard'
import { SectionBlock } from '../components/ui/SectionBlock'
import { DataGrid } from '../components/ui/DataGrid'
import { StatusChip } from '../components/ui/StatusChip'
import { SparkLine } from '../components/charts/SparkLine'
import { GaugeChart } from '../components/charts/GaugeChart'
import { BarComparison } from '../components/charts/BarComparison'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type WidgetComponent = ComponentType<any>

const registry = new Map<string, WidgetComponent>()

export function registerWidget(type: string, component: WidgetComponent) {
  registry.set(type, component)
}

export function getWidget(type: string): WidgetComponent | undefined {
  return registry.get(type)
}

export function listWidgets(): string[] {
  return Array.from(registry.keys())
}

/* ── Phase 3 primitives ──────────────────────────────────────────────── */
registerWidget('metric-card', MetricCard)
registerWidget('metric-display', MetricDisplay)
registerWidget('glass-card', GlassCard)
registerWidget('section-block', SectionBlock)
registerWidget('data-grid', DataGrid)
registerWidget('status-chip', StatusChip)
registerWidget('spark-line', SparkLine)
registerWidget('gauge-chart', GaugeChart)
registerWidget('bar-comparison', BarComparison)
