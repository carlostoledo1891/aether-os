import { describe, it, expect, afterAll, beforeAll } from 'vitest'
import { buildApp } from '../index.js'
import type { FastifyInstance } from 'fastify'
import { mapActionInputSchema } from '../routes/chat.js'

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
  it('allows CORS preflight OPTIONS without API key', async () => {
    const res = await app.inject({
      method: 'OPTIONS',
      url: '/api/chat',
      headers: {
        origin: 'https://verochain.co',
        'access-control-request-method': 'POST',
        'access-control-request-headers': 'content-type,x-api-key',
      },
    })
    expect(res.statusCode).toBe(204)
    expect(res.headers['access-control-allow-origin']).toBeDefined()
    expect(String(res.headers['access-control-allow-methods'] ?? '')).toContain('POST')
  })

  it('rejects requests without x-api-key', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/chat',
      headers: { origin: 'https://verochain.co' },
      payload: { messages: [{ role: 'user', content: 'Hello' }] },
    })
    expect(res.statusCode).toBe(401)
    expect(res.json().error).toMatch(/API key/i)
    expect(res.headers['access-control-allow-origin']).toBeDefined()
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

  it('accepts UIMessage-style payloads with parts arrays', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/chat',
      payload: {
        messages: [{
          id: 'msg-1',
          role: 'user',
          parts: [{ type: 'text', text: 'Hello' }],
        }],
      },
      headers: { 'x-api-key': 'test-chat-key' },
    })
    expect(res.statusCode).toBe(501)
  })
})

describe('mapActionInputSchema', () => {
  it('accepts object-based flyTo, bookmark, and fitBounds actions', () => {
    const parsed = mapActionInputSchema.parse({
      actions: [
        {
          type: 'flyTo',
          center: { lng: -46.573, lat: -21.895 },
          zoom: 9,
        },
        {
          type: 'bookmark',
          bookmarkId: 'site-overview',
        },
        {
          type: 'fitBounds',
          bbox: { west: -46.7, south: -22.0, east: -46.4, north: -21.7 },
        },
      ],
    })
    expect(parsed.actions).toHaveLength(3)
  })

  it('rejects legacy tuple-based flyTo and fitBounds payloads', () => {
    expect(() => mapActionInputSchema.parse({
      actions: [
        {
          type: 'flyTo',
          center: [-46.573, -21.895],
          zoom: 9,
        },
      ],
    })).toThrow()

    expect(() => mapActionInputSchema.parse({
      actions: [
        {
          type: 'fitBounds',
          bbox: [[-46.7, -22.0], [-46.4, -21.7]],
        },
      ],
    })).toThrow()
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
