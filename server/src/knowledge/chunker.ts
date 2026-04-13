/**
 * Recursive text splitter with heading-aware boundaries.
 * Splits markdown text into chunks of ~maxTokens, preferring to break
 * at heading boundaries (##, ###) and paragraph breaks.
 */

export interface Chunk {
  content: string
  heading?: string
  tokenCount: number
}

const APPROX_CHARS_PER_TOKEN = 4

function estimateTokens(text: string): number {
  return Math.ceil(text.length / APPROX_CHARS_PER_TOKEN)
}

/**
 * Split text into chunks, respecting heading boundaries.
 * @param text Full document text (markdown or plain)
 * @param maxTokens Target max tokens per chunk (default 512)
 * @param overlapTokens Overlap between chunks (default 64)
 */
export function chunkText(text: string, maxTokens = 512, overlapTokens = 64): Chunk[] {
  const maxChars = maxTokens * APPROX_CHARS_PER_TOKEN
  const overlapChars = overlapTokens * APPROX_CHARS_PER_TOKEN

  const sections = splitBySections(text)
  const chunks: Chunk[] = []

  for (const section of sections) {
    if (estimateTokens(section.content) <= maxTokens) {
      chunks.push({
        content: section.content.trim(),
        heading: section.heading,
        tokenCount: estimateTokens(section.content),
      })
      continue
    }

    const paragraphs = section.content.split(/\n\n+/)
    let current = ''
    for (const para of paragraphs) {
      if (current.length + para.length > maxChars && current.length > 0) {
        chunks.push({
          content: current.trim(),
          heading: section.heading,
          tokenCount: estimateTokens(current),
        })
        const overlap = current.slice(-overlapChars)
        current = overlap + '\n\n' + para
      } else {
        current += (current ? '\n\n' : '') + para
      }
    }
    if (current.trim()) {
      chunks.push({
        content: current.trim(),
        heading: section.heading,
        tokenCount: estimateTokens(current),
      })
    }
  }

  return chunks.filter(c => c.content.length > 20)
}

interface Section {
  heading?: string
  content: string
}

function splitBySections(text: string): Section[] {
  const headingRegex = /^(#{1,3})\s+(.+)$/gm
  const sections: Section[] = []
  let lastIndex = 0
  let lastHeading: string | undefined

  let match
  while ((match = headingRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      const content = text.slice(lastIndex, match.index)
      if (content.trim()) {
        sections.push({ heading: lastHeading, content: content.trim() })
      }
    }
    lastHeading = match[2].trim()
    lastIndex = match.index + match[0].length
  }

  const remaining = text.slice(lastIndex)
  if (remaining.trim()) {
    sections.push({ heading: lastHeading, content: remaining.trim() })
  }

  if (sections.length === 0 && text.trim()) {
    sections.push({ content: text.trim() })
  }

  return sections
}
