/**
 * Knowledge Base ingestion CLI.
 *
 * Usage:
 *   npm run ingest:knowledge -- --file ./path/to/doc.pdf --title "Title" --authority CONAMA --category brazil
 *   npm run ingest:knowledge -- --url "https://..." --title "Title" --authority Meteoric --category meteoric
 *   npm run ingest:knowledge -- --dir ./data/knowledge/incoming/ --authority "Various" --category general
 *   npm run ingest:knowledge -- --reindex
 */

import { readFileSync, readdirSync, statSync } from 'node:fs'
import { resolve, basename, extname } from 'node:path'

// Bootstrap the DB so knowledge store and pipeline can use it
import '../server/src/store/db.js'
import { ingestFile, ingestUrl, reindexAll } from '../server/src/knowledge/ingestPipeline.js'

function parseArgs(argv: string[]): Record<string, string> {
  const args: Record<string, string> = {}
  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i]
    if (arg.startsWith('--')) {
      const key = arg.slice(2)
      const next = argv[i + 1]
      if (next && !next.startsWith('--')) {
        args[key] = next
        i++
      } else {
        args[key] = 'true'
      }
    }
  }
  return args
}

async function main() {
  const args = parseArgs(process.argv)

  if (args.reindex) {
    console.log('Re-indexing all knowledge base documents...')
    const result = reindexAll()
    console.log(`Done: ${result.indexed} indexed, ${result.errors.length} errors`)
    if (result.errors.length > 0) {
      for (const err of result.errors) console.warn(`  - ${err}`)
    }
    return
  }

  const title = args.title ?? ''
  const authority = args.authority ?? 'Unknown'
  const jurisdiction = args.jurisdiction ?? 'unknown'
  const tags = args.tags ? args.tags.split(',').map(t => t.trim()) : []
  const category = args.category ?? 'general'
  const provenanceKind = args.type ?? 'from_public_record'
  const ingestedBy = args.by ?? 'cli'

  if (args.file) {
    const filePath = resolve(args.file)
    const buffer = readFileSync(filePath)
    const filename = basename(filePath)
    const docTitle = title || filename.replace(extname(filename), '')

    console.log(`Ingesting file: ${filename}`)
    const result = await ingestFile(buffer, filename, {
      title: docTitle, authority, jurisdiction, tags, category,
      provenanceKind, sourceUrl: args.url, ingestedBy,
    })
    console.log(`Done: ${result.docId} — ${result.chunkCount} chunks → ${result.filePath}`)
    return
  }

  if (args.url) {
    const docTitle = title || args.url
    console.log(`Ingesting URL: ${args.url}`)
    const result = await ingestUrl(args.url, {
      title: docTitle, authority, jurisdiction, tags, category,
      provenanceKind, sourceUrl: args.url, ingestedBy,
    })
    console.log(`Done: ${result.docId} — ${result.chunkCount} chunks → ${result.filePath}`)
    return
  }

  if (args.dir) {
    const dirPath = resolve(args.dir)
    const files = readdirSync(dirPath).filter(f => {
      const ext = extname(f).toLowerCase()
      return ['.pdf', '.md', '.txt', '.csv', '.json'].includes(ext)
    })

    console.log(`Ingesting ${files.length} files from ${dirPath}`)
    let success = 0
    for (const filename of files) {
      const filePath = resolve(dirPath, filename)
      if (!statSync(filePath).isFile()) continue
      const buffer = readFileSync(filePath)
      const docTitle = title || filename.replace(extname(filename), '')

      try {
        const result = await ingestFile(buffer, filename, {
          title: docTitle, authority, jurisdiction, tags, category,
          provenanceKind, ingestedBy,
        })
        console.log(`  ✓ ${result.docId} — ${result.chunkCount} chunks`)
        success++
      } catch (err) {
        console.error(`  ✗ ${filename}: ${err instanceof Error ? err.message : 'failed'}`)
      }
    }
    console.log(`Done: ${success}/${files.length} ingested`)
    return
  }

  console.log(`Usage:
  npm run ingest:knowledge -- --file ./doc.pdf --title "Title" --authority CONAMA
  npm run ingest:knowledge -- --url "https://..." --title "Title" --authority Meteoric
  npm run ingest:knowledge -- --dir ./incoming/ --authority "Various"
  npm run ingest:knowledge -- --reindex

Options:
  --title       Document title
  --authority   Source authority (CONAMA, ANM, Meteoric, etc.)
  --jurisdiction Jurisdiction (brazil, EU, USA, etc.)
  --tags        Comma-separated tags
  --category    Storage category (brazil, international, caldeira, etc.)
  --type        Provenance kind (from_public_record, issuer_attested, etc.)
  --by          Who ingested (default: cli)`)
}

main().catch(err => {
  console.error('Fatal:', err)
  process.exit(1)
})
