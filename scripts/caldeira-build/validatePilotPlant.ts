import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const DATA_PATH = resolve(__dirname, '../../data/caldeira/pilot-plant-mirror.json')
const SCHEMA_PATH = resolve(__dirname, '../../data/caldeira/schemas/pilot-plant-mirror.schema.json')

const schema = JSON.parse(readFileSync(SCHEMA_PATH, 'utf8'))
const data = JSON.parse(readFileSync(DATA_PATH, 'utf8'))

const ajv = new Ajv({ allErrors: true, strict: false })
addFormats(ajv)

const validate = ajv.compile(schema)
const valid = validate(data)

if (valid) {
  console.log('✅ pilot-plant-mirror.json is valid against schema')
  process.exit(0)
} else {
  console.error('❌ pilot-plant-mirror.json validation failed:')
  for (const err of validate.errors ?? []) {
    console.error(`  ${err.instancePath || '/'}: ${err.message}`)
  }
  process.exit(1)
}
