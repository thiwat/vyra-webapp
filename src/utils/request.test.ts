import { describe, expect, it } from 'vitest'
import { buildQuery, qsParse, qsStringify } from './request'

describe('utils/request', () => {
  it('buildQuery applies list defaults', () => {
    expect(buildQuery({})).toBe('page=1&page_size=10&keywords=&filter=&sort=')
  })

  it('buildQuery encodes keywords, filter (qs) and sort', () => {
    const query = buildQuery({
      page: 2,
      page_size: 20,
      keywords: 'john doe',
      sort: '-created_at',
      filter: { status: 'active', role: null }
    })
    const params = new URLSearchParams(query)

    expect(params.get('page')).toBe('2')
    expect(params.get('page_size')).toBe('20')
    expect(params.get('keywords')).toBe('john doe')
    expect(params.get('sort')).toBe('-created_at')
    expect(params.get('filter')).toBe('status=active&role')
  })

  it('qsStringify / qsParse round-trip nested objects with strict nulls', () => {
    const filter = { $and: [{ status: 'active' }, { deleted_at: null }] }
    expect(qsParse(qsStringify(filter))).toEqual(filter)
  })

  it('qsStringify encodes plain strings and qsParse ignores empty input', () => {
    expect(qsStringify('a&b')).toBe('a%26b')
    expect(qsParse('')).toBeUndefined()
  })
})
