import { writeFileSync, readFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const OUT = resolve(__dirname, '../../data/caldeira/pilot-plant-pdf-index.json')
const LINKCHECK_PATH = resolve(__dirname, '../../data/caldeira/pilot-plant-sources.linkcheck.json')

const BROWSER_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'

const ANCHOR_KEYWORDS = [
  'pilot plant', 'MREC', 'throughput', 'recovery', 'FJH', 'flash joule',
  'leach', 'ammonium sulfate', 'MREO', 'ionic clay', 'scrub', 'precipitation',
  'dewater', 'carbonate', 'rare earth', 'TREO', 'NdPr', 'Nd', 'Pr', 'Dy', 'Tb',
  'impurity', 'water recycle', 'AMSUL', 'reagent', '25 kg', '1.8 kg', '2.6 kg',
  'flowsheet', 'commissioning', 'ANSTO', 'SEMAD', 'COPAM',
]

interface PdfExtractionResult {
  id: string
  url: string
  title_extracted: string | null
  page_count: number | null
  text_length: number | null
  anchor_hits: Record<string, number>
  extracted_at: string
  error?: string
  manual_required?: boolean
}

async function downloadPdf(url: string): Promise<Buffer | null> {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 30_000)
    const res = await fetch(url, {
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'User-Agent': BROWSER_UA, Accept: 'application/pdf' },
    })
    clearTimeout(timeout)
    if (!res.ok) return null
    return Buffer.from(await res.arrayBuffer())
  } catch {
    return null
  }
}

async function extractPdf(buffer: Buffer): Promise<{ numpages: number; text: string; info?: { Title?: string } }> {
  const { PDFParse } = await import('pdf-parse')
  const parser = new PDFParse({ data: new Uint8Array(buffer) })
  await parser.load()
  const numPages: number = parser.doc?.numPages ?? 0
  const result = await parser.getText() as { text: string; total: number }
  const text = result.text ?? ''
  let info: { Title?: string } | undefined
  try {
    const meta = await parser.getInfo()
    if (meta) info = { Title: (meta as Record<string, string>).Title ?? (meta as Record<string, string>).title ?? undefined }
  } catch { /* metadata optional */ }
  return { numpages: numPages, text, info }
}

function countAnchors(text: string): Record<string, number> {
  const lower = text.toLowerCase()
  const hits: Record<string, number> = {}
  for (const kw of ANCHOR_KEYWORDS) {
    const count = lower.split(kw.toLowerCase()).length - 1
    if (count > 0) hits[kw] = count
  }
  return hits
}

interface LinkCheckResult {
  id: string
  url: string
  type: string
  http_status: number | null
}

async function main() {
  // Load linkcheck results to know which PDFs are accessible
  let linkResults: LinkCheckResult[] = []
  if (existsSync(LINKCHECK_PATH)) {
    const data = JSON.parse(readFileSync(LINKCHECK_PATH, 'utf8'))
    linkResults = data.results ?? []
  }

  const pdfEntries = linkResults.filter(
    (r) => r.type.endsWith('_pdf') || r.type === 'asx_pdf' || r.type === 'cetem_pdf' || r.type === 'simexmin_pdf',
  )

  console.log(`Processing ${pdfEntries.length} PDF entries…`)
  const results: PdfExtractionResult[] = []

  for (const entry of pdfEntries) {
    process.stdout.write(`  ${entry.id} … `)
    const result: PdfExtractionResult = {
      id: entry.id,
      url: entry.url,
      title_extracted: null,
      page_count: null,
      text_length: null,
      anchor_hits: {},
      extracted_at: new Date().toISOString(),
    }

    if (entry.http_status && entry.http_status >= 400) {
      result.error = `HTTP ${entry.http_status} — blocked or unavailable`
      result.manual_required = true
      console.log(`skipped (HTTP ${entry.http_status})`)
      results.push(result)
      continue
    }
    if (!entry.http_status) {
      result.error = 'No HTTP status from link check — network failure'
      result.manual_required = true
      console.log('skipped (no status)')
      results.push(result)
      continue
    }

    const buf = await downloadPdf(entry.url)
    if (!buf) {
      result.error = 'Download failed'
      result.manual_required = true
      console.log('download failed')
      results.push(result)
      continue
    }

    try {
      const parsed = await extractPdf(buf)
      result.title_extracted = parsed.info?.Title || null
      result.page_count = parsed.numpages
      result.text_length = parsed.text.length
      result.anchor_hits = countAnchors(parsed.text)
      console.log(`${parsed.numpages} pages, ${parsed.text.length} chars, ${Object.keys(result.anchor_hits).length} anchor keywords`)
    } catch (err) {
      result.error = err instanceof Error ? err.message : String(err)
      result.manual_required = true
      console.log(`parse error: ${result.error}`)
    }
    results.push(result)
  }

  const output = {
    _comment: 'Auto-generated by scripts/caldeira-build/extractPilotPlantPdfs.ts — do not edit by hand',
    extracted_at: new Date().toISOString(),
    results,
  }
  writeFileSync(OUT, `${JSON.stringify(output, null, 2)}\n`, 'utf8')
  console.log(`\nWrote ${results.length} extraction results → ${OUT}`)

  const manual = results.filter((r) => r.manual_required)
  if (manual.length) {
    console.warn(`\n⚠  ${manual.length} PDF(s) require manual download:`)
    for (const m of manual) console.warn(`   ${m.id}: ${m.error}`)
    console.warn('\nInstructions: Download in browser, then place in data/caldeira/staging/ for local extraction.')
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
