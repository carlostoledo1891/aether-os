import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { resolve, dirname, extname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createHash } from 'node:crypto'
import { chunkText } from './chunker.js'
import { insertChunks, deleteDocChunks } from '../store/knowledgeStore.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const KNOWLEDGE_DIR = resolve(__dirname, '..', '..', '..', 'data', 'knowledge')
const ORIGINALS_DIR = resolve(KNOWLEDGE_DIR, 'uploads', 'originals')
const INDEX_PATH = resolve(KNOWLEDGE_DIR, 'index.json')

export interface IngestMetadata {
  id?: string
  title: string
  authority: string
  jurisdiction: string
  tags: string[]
  category: string
  provenanceKind: string
  sourceUrl?: string
  originalDate?: string
  ingestedBy: string
}

export interface IngestResult {
  docId: string
  title: string
  chunkCount: number
  filePath: string
  preview: string
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60)
}

function computeSha256(buffer: Buffer): string {
  return createHash('sha256').update(buffer).digest('hex')
}

function cleanPdfText(raw: string): string {
  return raw
    .replace(/\f/g, '\n\n')
    .replace(/(\r\n|\r)/g, '\n')
    .replace(/ {2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

async function parsePdfBuffer(buffer: Buffer): Promise<string> {
  try {
    const { PDFParse } = await import('pdf-parse')
    const parser = new PDFParse({ data: new Uint8Array(buffer) }) as unknown as {
      load: () => Promise<void>
      getText: () => Promise<{ text: string; total: number }>
    }
    await parser.load()
    const result = await parser.getText()
    return cleanPdfText(result.text ?? '')
  } catch {
    throw new Error('PDF parsing failed')
  }
}

function buildMarkdown(content: string, meta: IngestMetadata): string {
  const frontmatter = [
    '---',
    `source: "${meta.title}"`,
    `authority: ${meta.authority}`,
    `jurisdiction: ${meta.jurisdiction}`,
    `tags: [${meta.tags.join(', ')}]`,
    meta.originalDate ? `date: ${meta.originalDate}` : null,
    meta.sourceUrl ? `source_url: ${meta.sourceUrl}` : null,
    '---',
    '',
    `# ${meta.title}`,
    '',
    content,
  ].filter(Boolean).join('\n')
  return frontmatter
}

function updateIndex(docId: string, meta: IngestMetadata, relativeFile: string, sha256: string | null) {
  let index: Array<Record<string, unknown>> = []
  if (existsSync(INDEX_PATH)) {
    index = JSON.parse(readFileSync(INDEX_PATH, 'utf-8'))
  }

  const existing = index.findIndex((e: Record<string, unknown>) => e.id === docId)
  const entry = {
    id: docId,
    jurisdiction: meta.jurisdiction,
    authority: meta.authority,
    title: meta.title,
    relevant_thresholds: [],
    file: relativeFile,
    tags: meta.tags,
    provenance: {
      kind: meta.provenanceKind,
      source_url: meta.sourceUrl ?? null,
      original_date: meta.originalDate ?? null,
      ingested_at: new Date().toISOString(),
      ingested_by: meta.ingestedBy,
      ingestion_method: 'pipeline',
      sha256,
      verified_by: null,
      verified_at: null,
    },
  }

  if (existing >= 0) {
    index[existing] = entry
  } else {
    index.push(entry)
  }

  writeFileSync(INDEX_PATH, JSON.stringify(index, null, 2) + '\n')
}

/**
 * Ingest a file buffer into the knowledge base.
 */
export async function ingestFile(
  buffer: Buffer,
  filename: string,
  meta: IngestMetadata,
): Promise<IngestResult> {
  const ext = extname(filename).toLowerCase()
  const docId = meta.id ?? slugify(meta.title)

  mkdirSync(ORIGINALS_DIR, { recursive: true })
  const originalPath = resolve(ORIGINALS_DIR, `${docId}${ext}`)
  writeFileSync(originalPath, buffer)
  const sha256 = computeSha256(buffer)

  let content: string
  if (ext === '.pdf') {
    content = await parsePdfBuffer(buffer)
  } else if (ext === '.csv' || ext === '.tsv') {
    content = buffer.toString('utf-8')
  } else if (ext === '.json') {
    try {
      const parsed = JSON.parse(buffer.toString('utf-8'))
      content = JSON.stringify(parsed, null, 2)
    } catch {
      content = buffer.toString('utf-8')
    }
  } else {
    content = buffer.toString('utf-8')
  }

  const isMdAlready = ext === '.md' && content.startsWith('---')
  const markdown = isMdAlready ? content : buildMarkdown(content, meta)

  const categoryDir = resolve(KNOWLEDGE_DIR, meta.category)
  mkdirSync(categoryDir, { recursive: true })
  const convertedPath = resolve(categoryDir, `${docId}.md`)
  writeFileSync(convertedPath, markdown)

  const relativeFile = `${meta.category}/${docId}.md`

  const chunks = chunkText(content)

  deleteDocChunks(docId)
  insertChunks(
    docId,
    chunks.map(c => ({ content: c.content, heading: c.heading, tokenCount: c.tokenCount })),
  )

  updateIndex(docId, meta, relativeFile, sha256)

  return {
    docId,
    title: meta.title,
    chunkCount: chunks.length,
    filePath: relativeFile,
    preview: content.slice(0, 500),
  }
}

/**
 * Ingest a URL — fetches content and processes it.
 */
export async function ingestUrl(
  url: string,
  meta: IngestMetadata,
): Promise<IngestResult> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15_000)
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'VeroKB/1.0' },
    })
    clearTimeout(timeout)
    if (!res.ok) throw new Error(`Fetch failed: HTTP ${res.status}`)

    const contentType = res.headers.get('content-type') ?? ''
    const buffer = Buffer.from(await res.arrayBuffer())

    const isPdf = contentType.includes('pdf') || url.endsWith('.pdf')
    const filename = isPdf ? 'download.pdf' : 'download.txt'

    return ingestFile(buffer, filename, { ...meta, sourceUrl: url })
  } finally {
    clearTimeout(timeout)
  }
}

/**
 * Re-index all existing documents in the knowledge base.
 * Reads index.json, re-chunks each file, and updates SQLite.
 */
export function reindexAll(): { indexed: number; errors: string[] } {
  if (!existsSync(INDEX_PATH)) return { indexed: 0, errors: ['index.json not found'] }

  const index = JSON.parse(readFileSync(INDEX_PATH, 'utf-8')) as Array<{
    id: string; file: string
  }>

  let indexed = 0
  const errors: string[] = []

  for (const entry of index) {
    const filePath = resolve(KNOWLEDGE_DIR, entry.file)
    if (!existsSync(filePath)) {
      errors.push(`File not found: ${entry.file}`)
      continue
    }
    const content = readFileSync(filePath, 'utf-8')
    const chunks = chunkText(content)

    deleteDocChunks(entry.id)
    insertChunks(
      entry.id,
      chunks.map(c => ({ content: c.content, heading: c.heading, tokenCount: c.tokenCount })),
    )
    indexed++
  }

  return { indexed, errors }
}
