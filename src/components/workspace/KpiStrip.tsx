import { useServiceQuery } from '../../hooks/useServiceQuery'

interface KpiStripProps {
  activeTypeIds: string[]
}

export function KpiStrip({ activeTypeIds }: KpiStripProps) {
  const { data: stats, isLoading } = useServiceQuery('unitStats', s => s.getUnitStats())

  if (isLoading || !stats) {
    return (
      <div style={{ display: 'flex', gap: 12, padding: '6px 12px', opacity: 0.4, fontSize: 12 }}>
        Loading unit stats...
      </div>
    )
  }

  const items: Array<{ label: string; value: number; color?: string }> = []
  let total = 0
  let attentionCount = 0
  let actionCount = 0

  for (const typeId of activeTypeIds) {
    const typeSeverities = stats[typeId]
    if (!typeSeverities) continue
    let typeTotal = 0
    for (const [sev, count] of Object.entries(typeSeverities)) {
      typeTotal += count
      if (sev === 'attention') attentionCount += count
      if (sev === 'action_required') actionCount += count
      if (sev === 'blocked') actionCount += count
    }
    total += typeTotal
    items.push({ label: typeId.replace(/_/g, ' '), value: typeTotal })
  }

  return (
    <div style={{
      display: 'flex', gap: 16, padding: '4px 12px', alignItems: 'center',
      fontSize: 12, color: 'var(--text-secondary, rgba(255,255,255,0.65))',
      borderTop: '1px solid var(--border, rgba(255,255,255,0.08))',
    }}>
      <span style={{ fontWeight: 600, color: 'var(--text-primary, #fff)' }}>
        {total} units
      </span>
      {attentionCount > 0 && (
        <span style={{ color: 'var(--status-attention, #f59e0b)' }}>
          {attentionCount} attention
        </span>
      )}
      {actionCount > 0 && (
        <span style={{ color: 'var(--status-action, #ef4444)' }}>
          {actionCount} action
        </span>
      )}
      <span style={{ flex: 1 }} />
      {items.slice(0, 6).map(item => (
        <span key={item.label} style={{ opacity: 0.7 }}>
          {item.value} {item.label}
        </span>
      ))}
    </div>
  )
}
