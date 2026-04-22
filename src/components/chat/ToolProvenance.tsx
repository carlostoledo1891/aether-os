import { useState } from 'react'
import { ChevronDown, ChevronRight, Database } from 'lucide-react'
import { W } from '../../app/canvas/canvasTheme'
import { ProvenanceBadge } from '../ui/ProvenanceBadge'
import {
  getToolLabel,
  summarizeOutput,
  extractKBResults,
  type ToolPart,
  type DataProvenanceKind,
} from './toolProvenanceUtils'
import styles from './VeroChat.module.css'

export function ToolProvenance({ tools }: { tools: ToolPart[] }) {
  const [expanded, setExpanded] = useState(false)
  if (tools.length === 0) return null

  const completed = tools.filter(t => t.state === 'output-available')
  const label = completed.length > 0
    ? completed.map(t => getToolLabel(t.toolName)).join(', ')
    : tools.map(t => getToolLabel(t.toolName)).join(', ')

  return (
    <div className={styles.provenanceSection}>
      <button
        type="button"
        className={styles.provenanceToggle}
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
      >
        <Database size={10} style={{ color: W.text2, flexShrink: 0 }} />
        <span className={styles.provenanceLabel}>Sources: {label}</span>
        {expanded
          ? <ChevronDown size={10} style={{ color: W.text4 }} />
          : <ChevronRight size={10} style={{ color: W.text4 }} />}
      </button>
      {expanded && (
        <div className={styles.provenanceDetail}>
          {tools.map(t => {
            const kbResults = t.toolName === 'queryKnowledgeBase' && t.state === 'output-available'
              ? extractKBResults(t.output)
              : []

            return (
              <div key={t.toolCallId} className={styles.provenanceItem}>
                <span className={styles.provenanceToolName}>{getToolLabel(t.toolName)}</span>
                {kbResults.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginTop: 3 }}>
                    {kbResults.map(r => (
                      <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 9 }}>
                        {r.provenance_kind && (
                          <ProvenanceBadge kind={r.provenance_kind as DataProvenanceKind} />
                        )}
                        <span style={{ color: W.text2 }}>{r.title}</span>
                        {r.source_url && (
                          <a href={r.source_url} target="_blank" rel="noopener noreferrer"
                            style={{ color: W.text3, fontSize: 8 }}>
                            [link]
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    {t.state === 'output-available' && t.output != null && (
                      <span className={styles.provenanceOutput}>{summarizeOutput(t.output)}</span>
                    )}
                    {t.state === 'output-error' && (
                      <span className={styles.provenanceError}>Error</span>
                    )}
                  </>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
