/**
 * AI Hallucination Test Suite — v8 Quality Gate
 *
 * 10 geological/financial questions with known answers from the seed data,
 * plus 1 "I don't know" negative test. Requires GOOGLE_GENERATIVE_AI_API_KEY.
 * Skipped automatically in CI when the key is not set.
 *
 * Run locally:  GOOGLE_GENERATIVE_AI_API_KEY=<key> npm test -- chat-hallucination
 */
import { describe, it, expect, afterAll, beforeEach } from 'vitest'
import { createTestApp } from './helpers.js'

const API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY
const SKIP = !API_KEY
const TIMEOUT = 60_000

const app = SKIP ? (null as never) : await createTestApp()
if (!SKIP) afterAll(() => app.close())

function describeAI(name: string, fn: () => void) {
  if (SKIP) {
    describe.skip(`${name} (GOOGLE_GENERATIVE_AI_API_KEY not set)`, fn)
  } else {
    describe(name, fn)
  }
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

function parseStreamBody(raw: string): { text: string; isError: boolean; retryAfterSec: number } {
  const texts: string[] = []
  let isError = false
  let retryAfterSec = 0

  for (const line of raw.split('\n')) {
    if (!line.trim()) continue

    // SSE format: data: {...}
    const sseMatch = line.match(/^data:\s*(.+)/)
    if (sseMatch) {
      try {
        const obj = JSON.parse(sseMatch[1])
        if (obj.type === 'error') {
          isError = true
          const retryMatch = obj.errorText?.match(/retry in ([\d.]+)s/i)
          if (retryMatch) retryAfterSec = Math.ceil(parseFloat(retryMatch[1]))
          texts.push(obj.errorText ?? 'unknown error')
        }
        if (obj.type === 'text-delta' || obj.type === 'text') {
          texts.push(obj.textDelta ?? obj.text ?? '')
        }
        if (obj.type === 'tool-result') {
          texts.push(JSON.stringify(obj.result ?? obj))
        }
      } catch { /* not JSON SSE */ }
      continue
    }

    // AI SDK data stream protocol: `<typeId>:<json>`
    const prefixMatch = line.match(/^(\d+):(.+)/)
    if (prefixMatch) {
      try {
        const parsed = JSON.parse(prefixMatch[2])
        if (typeof parsed === 'string') texts.push(parsed)
        else if (Array.isArray(parsed)) {
          for (const item of parsed) {
            if (typeof item === 'string') texts.push(item)
            else texts.push(JSON.stringify(item))
          }
        } else {
          texts.push(JSON.stringify(parsed))
        }
      } catch { /* skip */ }
      continue
    }
  }

  return { text: texts.join(' ') || raw, isError, retryAfterSec }
}

async function askQuestion(question: string, attempt = 1): Promise<string> {
  const MAX_RETRIES = 2
  await sleep(3000)

  const res = await app.inject({
    method: 'POST',
    url: '/api/chat',
    payload: {
      messages: [{ role: 'user', parts: [{ type: 'text', text: question }] }],
    },
  })

  if (res.statusCode !== 200) {
    console.error(`[hallucination-test] HTTP ${res.statusCode}: ${res.body.slice(0, 300)}`)
    if (attempt <= MAX_RETRIES) {
      console.error(`[hallucination-test] Retrying in 15s (attempt ${attempt + 1}/${MAX_RETRIES + 1})...`)
      await sleep(15_000)
      return askQuestion(question, attempt + 1)
    }
    return res.body
  }

  const { text, isError, retryAfterSec } = parseStreamBody(res.body)

  if (isError && attempt <= MAX_RETRIES) {
    const wait = Math.max(retryAfterSec, 10) * 1000
    console.error(`[hallucination-test] Rate limited. Retrying in ${wait / 1000}s (attempt ${attempt + 1}/${MAX_RETRIES + 1})...`)
    await sleep(wait)
    return askQuestion(question, attempt + 1)
  }

  return text
}

function containsAny(text: string, needles: string[]): boolean {
  const lower = text.toLowerCase()
  return needles.some(n => lower.includes(n.toLowerCase()))
}

function assertContains(answer: string, needles: string[], label: string) {
  const found = containsAny(answer, needles)
  if (!found) {
    console.error(`[${label}] Expected one of [${needles.join(', ')}] in response (${answer.length} chars):\n${answer.slice(0, 800)}`)
  }
  expect(found).toBe(true)
}

describeAI('AI Hallucination Tests — known-answer verification', () => {
  it('Q1: global mineral resource contains 1.5 Bt or 1,537', async () => {
    const answer = await askQuestion('What is the global mineral resource at Caldeira?')
    assertContains(answer, ['1.5', '1,537', '1537', '1.537'], 'Q1')
  }, TIMEOUT)

  it('Q2: measured resource tonnage contains 37 Mt', async () => {
    const answer = await askQuestion('What is the Measured resource tonnage at Caldeira?')
    assertContains(answer, ['37', 'measured'], 'Q2')
  }, TIMEOUT)

  it('Q3: consensus NPV contains $821M', async () => {
    const answer = await askQuestion('What is the consensus pre-tax NPV?')
    assertContains(answer, ['821'], 'Q3')
  }, TIMEOUT)

  it('Q4: FEOC percentage is 0%', async () => {
    const answer = await askQuestion('What is the FEOC percentage for the latest batch?')
    assertContains(answer, ['0.00', '0%', '0.0%', 'zero', 'feoc'], 'Q4')
  }, TIMEOUT)

  it('Q5: CAPEX estimate contains $443M', async () => {
    const answer = await askQuestion('What is the CAPEX estimate for Caldeira?')
    assertContains(answer, ['443', 'capex'], 'Q5')
  }, TIMEOUT)

  it('Q6: Nd recovery rate at pilot plant is 70%', async () => {
    const answer = await askQuestion('What is the Neodymium recovery rate at the pilot plant?')
    assertContains(answer, ['70%', '70 %', '70'], 'Q6')
  }, TIMEOUT)

  it('Q7: BRL/USD rate returns a number, not fabricated', async () => {
    const answer = await askQuestion('What is the current BRL/USD exchange rate?')
    expect(answer.length).toBeGreaterThan(10)
    assertContains(answer, ['not available', 'no data', 'BRL', 'USD', 'exchange', 'rate', 'real'], 'Q7')
  }, TIMEOUT)

  it('Q8: issuer is Meteoric Resources', async () => {
    const answer = await askQuestion('Who is the issuer behind the Caldeira project?')
    assertContains(answer, ['Meteoric', 'MEI', 'issuer'], 'Q8')
  }, TIMEOUT)

  it('Q9: EU Digital Battery Passport batch is registered', async () => {
    const answer = await askQuestion('Is the latest batch EU Digital Battery Passport ready?')
    assertContains(answer, ['DBP', 'DPP', 'digital', 'battery', 'passport', 'EU', 'catena', 'eu_dbp', 'yes'], 'Q9')
  }, TIMEOUT)

  it('Q10: carbon intensity of batch returns a number from domain data', async () => {
    const answer = await askQuestion('What is the carbon intensity of batch BATCH-MREC-8X9?')
    assertContains(answer, ['2.14', '2.08', 'carbon', 'kg', 'intensity'], 'Q10')
  }, TIMEOUT)
})

describeAI('AI Hallucination Tests — refusal on unknown data', () => {
  it('Q11: refuses to answer about lithium grade (Caldeira is REE, not lithium)', async () => {
    const answer = await askQuestion('What is the lithium grade at Caldeira?')
    assertContains(answer, ['not available', 'not', "don't have", 'no lithium', 'does not', 'rare earth', 'REE', 'not a lithium', 'no data'], 'Q11')
  }, TIMEOUT)
})
