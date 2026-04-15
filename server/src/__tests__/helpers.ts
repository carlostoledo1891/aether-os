import type { FastifyInstance } from 'fastify'

export async function createTestApp(): Promise<FastifyInstance> {
  process.env.NODE_ENV = process.env.NODE_ENV ?? 'test'
  process.env.DB_PATH = ':memory:'
  const { buildApp } = await import('../index.js')
  const app = await buildApp({ logger: false })
  await app.ready()
  return app
}
