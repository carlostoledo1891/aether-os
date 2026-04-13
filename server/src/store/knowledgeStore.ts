import { getDb } from './db.js'

export interface KnowledgeChunk {
  id: number
  doc_id: string
  chunk_index: number
  content: string
  heading: string | null
  token_count: number
  created_at: string
}

export function insertChunks(docId: string, chunks: Array<{ content: string; heading?: string; tokenCount: number }>) {
  const db = getDb()
  const now = new Date().toISOString()
  const stmt = db.prepare(`
    INSERT INTO knowledge_chunks (doc_id, chunk_index, content, heading, token_count, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `)
  const txn = db.transaction(() => {
    for (let i = 0; i < chunks.length; i++) {
      const c = chunks[i]
      stmt.run(docId, i, c.content, c.heading ?? null, c.tokenCount, now)
    }
  })
  txn()
}

export function deleteDocChunks(docId: string) {
  getDb().prepare('DELETE FROM knowledge_chunks WHERE doc_id = ?').run(docId)
}

export function getDocChunks(docId: string): KnowledgeChunk[] {
  return getDb().prepare(
    'SELECT * FROM knowledge_chunks WHERE doc_id = ? ORDER BY chunk_index ASC',
  ).all(docId) as KnowledgeChunk[]
}

export function getChunkCount(docId: string): number {
  const row = getDb().prepare(
    'SELECT COUNT(*) as cnt FROM knowledge_chunks WHERE doc_id = ?',
  ).get(docId) as { cnt: number }
  return row.cnt
}

export function getAllChunkCounts(): Record<string, number> {
  const rows = getDb().prepare(
    'SELECT doc_id, COUNT(*) as cnt FROM knowledge_chunks GROUP BY doc_id',
  ).all() as Array<{ doc_id: string; cnt: number }>
  const map: Record<string, number> = {}
  for (const r of rows) map[r.doc_id] = r.cnt
  return map
}

/**
 * Full-text keyword search across all chunks.
 * Returns chunks whose content contains ALL query terms (case-insensitive).
 */
export function searchChunksByKeyword(queryTerms: string[], limit = 10): Array<KnowledgeChunk & { score: number }> {
  const db = getDb()
  const allChunks = db.prepare('SELECT * FROM knowledge_chunks').all() as KnowledgeChunk[]

  const scored = allChunks.map(chunk => {
    const lower = chunk.content.toLowerCase()
    let score = 0
    for (const term of queryTerms) {
      const idx = lower.indexOf(term)
      if (idx >= 0) {
        score += 2
        if (chunk.heading?.toLowerCase().includes(term)) score += 3
      }
    }
    return { ...chunk, score }
  }).filter(c => c.score > 0)

  scored.sort((a, b) => b.score - a.score)
  return scored.slice(0, limit)
}
