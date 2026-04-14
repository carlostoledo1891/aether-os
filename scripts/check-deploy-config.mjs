import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

function read(filePath) {
  return readFileSync(path.join(root, filePath), 'utf8')
}

const errors = []

const vercelConfig = JSON.parse(read('vercel.json'))
const cspValue = vercelConfig.headers
  ?.flatMap((entry) => entry.headers ?? [])
  .find((header) => header.key === 'Content-Security-Policy')
  ?.value

if (vercelConfig.rewrites?.some((rewrite) => rewrite.source === '/api/:path*')) {
  errors.push('`vercel.json` must not rewrite `/api/*`; hosted deploys should use `VITE_API_BASE_URL` instead.')
}

if (typeof cspValue === 'string' && cspValue.includes('railway.app')) {
  errors.push('`vercel.json` CSP must not hard-code a Railway host.')
}

const envExample = read('.env.example')
if (!envExample.includes('VITE_API_BASE_URL=')) {
  errors.push('`.env.example` must document `VITE_API_BASE_URL`.')
}
if (!envExample.includes('VITE_WS_URL=')) {
  errors.push('`.env.example` must document `VITE_WS_URL`.')
}

const readme = read('README.md')
if (readme.includes('Reserved for future HTTP/WebSocket wiring')) {
  errors.push('`README.md` still describes `VITE_API_BASE_URL`/`VITE_WS_URL` as future-only.')
}

if (errors.length) {
  console.error('Deployment config checks failed:')
  errors.forEach((error) => console.error(`- ${error}`))
  process.exit(1)
}

console.log('Deployment config checks passed.')
