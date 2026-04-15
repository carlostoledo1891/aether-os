import type { FastifyInstance } from 'fastify'
import { readFileSync, existsSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { ingestFile, ingestUrl, reindexAll } from '../knowledge/ingestPipeline.js'
import { getAllChunkCounts, deleteDocChunks } from '../store/knowledgeStore.js'
import { appendAuditEvent } from '../store/auditChain.js'
import { requireAdminKey } from '../auth/adminApiKey.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const INDEX_PATH = resolve(__dirname, '..', '..', '..', 'data', 'knowledge', 'index.json')

export async function knowledgeAdminRoutes(app: FastifyInstance) {
  app.get('/api/admin/knowledge', {
    schema: {
      tags: ['knowledge'],
      summary: 'List all knowledge base entries',
      security: [{ apiKey: [] }],
    },
  }, async (req, reply) => {
    if (!requireAdminKey(req as never, reply as never)) return

    let index: Array<Record<string, unknown>> = []
    if (existsSync(INDEX_PATH)) {
      index = JSON.parse(readFileSync(INDEX_PATH, 'utf-8'))
    }

    const chunkCounts = getAllChunkCounts()

    const entries = index.map((e: Record<string, unknown>) => ({
      ...e,
      chunkCount: chunkCounts[(e as { id: string }).id] ?? 0,
    }))

    return { total: entries.length, entries }
  })

  app.post('/api/admin/knowledge/ingest', {
    config: { rateLimit: { max: 5, timeWindow: '1 minute' } },
    schema: {
      tags: ['knowledge'],
      summary: 'Ingest a file into the knowledge base',
      consumes: ['multipart/form-data'],
      security: [{ apiKey: [] }],
    },
  }, async (req, reply) => {
    if (!requireAdminKey(req as never, reply as never)) return

    const parts = req.parts()
    let fileBuffer: Buffer | null = null
    let filename = ''
    const metadata: Record<string, string> = {}

    for await (const part of parts) {
      if (part.type === 'file') {
        const chunks: Buffer[] = []
        for await (const chunk of part.file) {
          chunks.push(Buffer.from(chunk))
        }
        fileBuffer = Buffer.concat(chunks)
        filename = part.filename
      } else {
        metadata[part.fieldname] = (part as { value: string }).value
      }
    }

    if (!fileBuffer || !filename) {
      return reply.code(400).send({ error: 'No file provided' })
    }
    if (!metadata.title || !metadata.authority) {
      return reply.code(400).send({ error: 'Missing required fields: title, authority' })
    }

    try {
      const result = await ingestFile(fileBuffer, filename, {
        id: metadata.id || undefined,
        title: metadata.title,
        authority: metadata.authority,
        jurisdiction: metadata.jurisdiction || 'unknown',
        tags: metadata.tags ? metadata.tags.split(',').map(t => t.trim()) : [],
        category: metadata.category || 'general',
        provenanceKind: metadata.provenanceKind || 'from_public_record',
        sourceUrl: metadata.sourceUrl || undefined,
        originalDate: metadata.originalDate || undefined,
        ingestedBy: metadata.ingestedBy || 'admin',
      })

      appendAuditEvent({
        event_id: `kb-ingest-${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: 'knowledge_ingested',
        actor: metadata.ingestedBy || 'admin',
        action: 'knowledge_file_ingested',
        detail: `Ingested ${filename} as ${result.docId} (${result.chunkCount} chunks)`,
      })

      return result
    } catch (err) {
      return reply.code(500).send({
        error: err instanceof Error ? err.message : 'Ingestion failed',
      })
    }
  })

  app.post('/api/admin/knowledge/ingest-url', {
    config: { rateLimit: { max: 5, timeWindow: '1 minute' } },
    schema: {
      tags: ['knowledge'],
      summary: 'Ingest a URL into the knowledge base',
      security: [{ apiKey: [] }],
    },
  }, async (req, reply) => {
    if (!requireAdminKey(req as never, reply as never)) return

    const body = req.body as {
      url: string; title: string; authority: string
      jurisdiction?: string; tags?: string[]; category?: string
      provenanceKind?: string; originalDate?: string; ingestedBy?: string
    }

    if (!body.url || !body.title || !body.authority) {
      return reply.code(400).send({ error: 'Missing required fields: url, title, authority' })
    }

    try {
      const result = await ingestUrl(body.url, {
        title: body.title,
        authority: body.authority,
        jurisdiction: body.jurisdiction ?? 'unknown',
        tags: body.tags ?? [],
        category: body.category ?? 'general',
        provenanceKind: body.provenanceKind ?? 'from_public_record',
        sourceUrl: body.url,
        originalDate: body.originalDate,
        ingestedBy: body.ingestedBy ?? 'admin',
      })

      appendAuditEvent({
        event_id: `kb-ingest-url-${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: 'knowledge_ingested',
        actor: body.ingestedBy ?? 'admin',
        action: 'knowledge_url_ingested',
        detail: `Ingested URL ${body.url} as ${result.docId} (${result.chunkCount} chunks)`,
      })

      return result
    } catch (err) {
      return reply.code(500).send({
        error: err instanceof Error ? err.message : 'URL ingestion failed',
      })
    }
  })

  app.delete<{ Params: { docId: string } }>('/api/admin/knowledge/:docId', {
    schema: {
      tags: ['knowledge'],
      summary: 'Delete a document from the knowledge base',
      security: [{ apiKey: [] }],
      params: { type: 'object', properties: { docId: { type: 'string' } } },
    },
  }, async (req, reply) => {
    if (!requireAdminKey(req as never, reply as never)) return

    const { docId } = req.params

    deleteDocChunks(docId)

    if (existsSync(INDEX_PATH)) {
      const index = JSON.parse(readFileSync(INDEX_PATH, 'utf-8')) as Array<{ id: string }>
      const filtered = index.filter(e => e.id !== docId)
      writeFileSync(INDEX_PATH, JSON.stringify(filtered, null, 2) + '\n')
    }

    appendAuditEvent({
      event_id: `kb-delete-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'knowledge_deleted',
      actor: 'admin',
      action: 'knowledge_deleted',
      detail: `Deleted ${docId} from knowledge base`,
    })

    return { ok: true, deleted: docId }
  })

  app.get<{ Params: { docId: string } }>('/api/admin/knowledge/:docId/content', {
    schema: {
      tags: ['knowledge'],
      summary: 'Get the converted markdown content of a KB document',
      security: [{ apiKey: [] }],
      params: { type: 'object', properties: { docId: { type: 'string' } } },
    },
  }, async (req, reply) => {
    if (!requireAdminKey(req as never, reply as never)) return

    const { docId } = req.params
    if (!existsSync(INDEX_PATH)) return reply.code(404).send({ error: 'Index not found' })

    const index = JSON.parse(readFileSync(INDEX_PATH, 'utf-8')) as Array<{ id: string; file: string }>
    const entry = index.find(e => e.id === docId)
    if (!entry) return reply.code(404).send({ error: `Document "${docId}" not found` })

    const KNOWLEDGE_DIR = resolve(__dirname, '..', '..', '..', 'data', 'knowledge')
    const filePath = resolve(KNOWLEDGE_DIR, entry.file)
    if (!existsSync(filePath)) return reply.code(404).send({ error: `File not found: ${entry.file}` })

    const content = readFileSync(filePath, 'utf-8')
    return { docId, file: entry.file, content }
  })

  app.put<{ Params: { docId: string } }>('/api/admin/knowledge/:docId', {
    schema: {
      tags: ['knowledge'],
      summary: 'Update metadata for a KB document',
      security: [{ apiKey: [] }],
      params: { type: 'object', properties: { docId: { type: 'string' } } },
    },
  }, async (req, reply) => {
    if (!requireAdminKey(req as never, reply as never)) return

    const { docId } = req.params
    if (!existsSync(INDEX_PATH)) return reply.code(404).send({ error: 'Index not found' })

    const index = JSON.parse(readFileSync(INDEX_PATH, 'utf-8')) as Array<Record<string, unknown>>
    const idx = index.findIndex((e: Record<string, unknown>) => e.id === docId)
    if (idx < 0) return reply.code(404).send({ error: `Document "${docId}" not found` })

    const body = req.body as {
      title?: string; authority?: string; jurisdiction?: string
      tags?: string[]; provenanceKind?: string; sourceUrl?: string
    }

    const entry = index[idx] as Record<string, unknown>
    if (body.title !== undefined) entry.title = body.title
    if (body.authority !== undefined) entry.authority = body.authority
    if (body.jurisdiction !== undefined) entry.jurisdiction = body.jurisdiction
    if (body.tags !== undefined) entry.tags = body.tags

    const prov = (entry.provenance ?? {}) as Record<string, unknown>
    if (body.provenanceKind !== undefined) prov.kind = body.provenanceKind
    if (body.sourceUrl !== undefined) prov.source_url = body.sourceUrl
    entry.provenance = prov

    index[idx] = entry
    writeFileSync(INDEX_PATH, JSON.stringify(index, null, 2) + '\n')

    appendAuditEvent({
      event_id: `kb-update-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'knowledge_updated',
      actor: 'admin',
      action: 'knowledge_metadata_updated',
      detail: `Updated metadata for ${docId}`,
    })

    return { ok: true, entry }
  })

  app.post('/api/admin/knowledge/reindex', {
    schema: {
      tags: ['knowledge'],
      summary: 'Re-index all knowledge base documents (re-chunk and store)',
      security: [{ apiKey: [] }],
    },
  }, async (req, reply) => {
    if (!requireAdminKey(req as never, reply as never)) return
    const result = reindexAll()
    return result
  })
}
