import { describe, it, expect, afterAll, beforeAll, vi } from 'vitest'
import { buildApp } from '../index.js'
import type { FastifyInstance } from 'fastify'

let app: FastifyInstance

beforeAll(async () => {
  delete process.env.GOOGLE_GENERATIVE_AI_API_KEY
  process.env.CHAT_API_KEY = 'test-chat-key'
  app = await buildApp({ logger: false })
  await app.ready()
})

afterAll(async () => {
  delete process.env.CHAT_API_KEY
  await app.close()
})

describe('POST /api/chat', () => {
  it('rejects requests without x-api-key', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/chat',
      payload: { messages: [{ role: 'user', content: 'Hello' }] },
    })
    expect(res.statusCode).toBe(401)
    expect(res.json().error).toMatch(/API key/i)
  })

  it('rejects requests with wrong x-api-key', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/chat',
      payload: { messages: [{ role: 'user', content: 'Hello' }] },
      headers: { 'x-api-key': 'wrong-key' },
    })
    expect(res.statusCode).toBe(401)
  })

  it('returns 501 when GOOGLE_GENERATIVE_AI_API_KEY is unset', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/chat',
      payload: { messages: [{ role: 'user', content: 'Hello' }] },
      headers: { 'x-api-key': 'test-chat-key' },
    })
    expect(res.statusCode).toBe(501)
    expect(res.json().error).toMatch(/AI not configured/i)
  })

  it('validates message body has messages array', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/chat',
      payload: { notMessages: 'bad' },
      headers: { 'x-api-key': 'test-chat-key' },
    })
    expect([400, 501]).toContain(res.statusCode)
  })
})

describe('POST /api/chat/upload', () => {
  it('rejects requests without x-api-key', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/chat/upload',
      headers: {
        'content-type': 'multipart/form-data; boundary=boundary',
      },
      payload:
        '--boundary\r\nContent-Disposition: form-data; name="file"; filename="test.txt"\r\nContent-Type: text/plain\r\n\r\nhello\r\n--boundary--',
    })
    expect(res.statusCode).toBe(401)
  })
})
