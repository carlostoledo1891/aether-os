import { describe, it, expect } from 'vitest'
import { resolveQuery, resolvePath } from '../DataBridge'

describe('resolvePath', () => {
  it('returns root data when path is empty', () => {
    const data = { a: 1 }
    expect(resolvePath(data, '')).toBe(data)
  })

  it('resolves single-level path', () => {
    expect(resolvePath({ a: 1 }, 'a')).toBe(1)
  })

  it('resolves nested path', () => {
    expect(resolvePath({ a: { b: { c: 3 } } }, 'a.b.c')).toBe(3)
  })

  it('returns undefined for missing path', () => {
    expect(resolvePath({ a: 1 }, 'b')).toBeUndefined()
  })

  it('handles null data gracefully', () => {
    expect(resolvePath(null, 'a')).toBeUndefined()
  })

  it('handles undefined data gracefully', () => {
    expect(resolvePath(undefined, 'a')).toBeUndefined()
  })

  it('resolves array index', () => {
    expect(resolvePath({ items: ['x', 'y', 'z'] }, 'items.1')).toBe('y')
  })
})

describe('resolveQuery', () => {
  it('calls named method on service', async () => {
    const svc = { getBatches: () => [1, 2, 3] } as any
    const result = await resolveQuery(svc, 'getBatches')
    expect(result).toEqual([1, 2, 3])
  })

  it('returns undefined for unknown method', async () => {
    const svc = {} as any
    const result = await resolveQuery(svc, 'nonExistent')
    expect(result).toBeUndefined()
  })

  it('handles async methods', async () => {
    const svc = { fetchData: async () => ({ status: 'ok' }) } as any
    const result = await resolveQuery(svc, 'fetchData')
    expect(result).toEqual({ status: 'ok' })
  })
})
