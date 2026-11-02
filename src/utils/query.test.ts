import { describe, expect, it } from 'vitest'
import { decodeFilter, encodeFilter } from './query'

describe('utils/query', () => {
  it('round-trips scalar and object filters', () => {
    const filter = { status: 'active', created_at: { $gte: '2026-01-01' }, tags: ['a', 'b'] }
    const encoded = encodeFilter(filter)

    expect(encoded).toContain('|')
    expect(decodeFilter(encoded)).toEqual(filter)
  })

  it('encodes scalars readably', () => {
    expect(encodeFilter({ status: 'active', role: 'member' })).toBe('status=active|role=member')
  })

  it('handles empty values', () => {
    expect(encodeFilter(undefined)).toBe('')
    expect(decodeFilter('')).toEqual({})
    expect(decodeFilter(undefined)).toEqual({})
  })
})
