import type { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'

interface ParsedFile {
  fileId: string
  filename: string
  type: string
  preview: string
  rowCount?: number
  uploadedAt: string
}

const sessionFiles = new Map<string, { files: ParsedFile[]; lastAccess: number }>()

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB
const SESSION_TTL = 30 * 60 * 1000 // 30 min

setInterval(() => {
  const now = Date.now()
  for (const [sid, session] of sessionFiles) {
    if (now - session.lastAccess > SESSION_TTL) sessionFiles.delete(sid)
  }
}, 60_000)

function getOrCreateSession(sessionId: string | undefined): { sid: string; session: { files: ParsedFile[]; lastAccess: number } } {
  const sid = sessionId || randomUUID()
  if (!sessionFiles.has(sid)) sessionFiles.set(sid, { files: [], lastAccess: Date.now() })
  const session = sessionFiles.get(sid)!
  session.lastAccess = Date.now()
  return { sid, session }
}

async function parseCSV(text: string): Promise<{ preview: string; rowCount: number }> {
  const lines = text.split('\n').filter(l => l.trim())
  const preview = lines.slice(0, 10).join('\n')
  return { preview, rowCount: lines.length }
}

async function parsePDF(buffer: Buffer): Promise<{ preview: string; pageCount: number }> {
  try {
    const { PDFParse } = await import('pdf-parse')
    const parser = new PDFParse({ data: new Uint8Array(buffer) }) as unknown as {
      load: () => Promise<void>
      getText: () => Promise<{ text: string; total: number }>
      doc: { numPages: number } | null
    }
    await parser.load()
    const result = await parser.getText()
    const text = result.text ?? ''
    const preview = text.substring(0, 2000)
    return { preview, pageCount: parser.doc?.numPages ?? 0 }
  } catch {
    return { preview: '[PDF parsing failed]', pageCount: 0 }
  }
}

function parseJSON(text: string): { preview: string } {
  try {
    const parsed = JSON.parse(text)
    return { preview: JSON.stringify(parsed, null, 2).substring(0, 2000) }
  } catch {
    return { preview: text.substring(0, 2000) }
  }
}

export function getSessionFile(sessionId: string, fileId: string): ParsedFile | undefined {
  const session = sessionFiles.get(sessionId)
  if (!session) return undefined
  session.lastAccess = Date.now()
  return session.files.find(f => f.fileId === fileId)
}

const ALLOWED_TYPES = new Set(['text/csv', 'application/pdf', 'application/json', 'text/plain', 'text/tab-separated-values'])
const ALLOWED_EXTENSIONS = new Set(['.csv', '.pdf', '.json', '.txt', '.tsv'])

export async function chatUploadRoutes(app: FastifyInstance) {
  app.post('/api/chat/upload', {
    schema: {
      tags: ['ai'],
      summary: 'Upload a file for AI chat context',
      description: 'Accepts CSV, PDF, JSON, or TXT files (max 10MB). Returns a fileId to attach to chat messages.',
      consumes: ['multipart/form-data'],
    },
  }, async (req, reply) => {
    const file = await req.file()
    if (!file) return reply.code(400).send({ error: 'No file provided' })

    const ext = '.' + (file.filename.split('.').pop()?.toLowerCase() ?? '')
    if (!ALLOWED_TYPES.has(file.mimetype) && !ALLOWED_EXTENSIONS.has(ext)) {
      return reply.code(400).send({
        error: 'Unsupported file type',
        hint: 'Accepted: .csv, .pdf, .json, .txt',
      })
    }

    const chunks: Buffer[] = []
    let totalSize = 0
    for await (const chunk of file.file) {
      totalSize += chunk.length
      if (totalSize > MAX_FILE_SIZE) {
        return reply.code(413).send({ error: 'File too large', hint: 'Maximum 10MB' })
      }
      chunks.push(Buffer.from(chunk))
    }
    const buffer = Buffer.concat(chunks)

    const sessionId = req.headers['x-chat-session'] as string | undefined
    const { sid, session } = getOrCreateSession(sessionId)
    const fileId = randomUUID()

    let preview: string
    let rowCount: number | undefined

    if (ext === '.pdf' || file.mimetype === 'application/pdf') {
      const result = await parsePDF(buffer)
      preview = result.preview
    } else if (ext === '.csv' || file.mimetype === 'text/csv' || file.mimetype === 'text/tab-separated-values') {
      const text = buffer.toString('utf8')
      const result = await parseCSV(text)
      preview = result.preview
      rowCount = result.rowCount
    } else if (ext === '.json' || file.mimetype === 'application/json') {
      const result = parseJSON(buffer.toString('utf8'))
      preview = result.preview
    } else {
      preview = buffer.toString('utf8').substring(0, 2000)
    }

    const parsed: ParsedFile = {
      fileId,
      filename: file.filename,
      type: ext.substring(1),
      preview,
      rowCount,
      uploadedAt: new Date().toISOString(),
    }
    session.files.push(parsed)

    reply.header('x-chat-session', sid)
    return {
      fileId: parsed.fileId,
      filename: parsed.filename,
      type: parsed.type,
      preview: parsed.preview.substring(0, 500),
      rowCount: parsed.rowCount,
    }
  })
}
