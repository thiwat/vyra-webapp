import { describe, expect, it } from 'vitest'
import { formatDatetime, formatNumber } from './format'

describe('utils/format', () => {
  it('formatNumber adds separators and keeps max 2 decimals', () => {
    expect(formatNumber(1234567)).toBe('1,234,567')
    expect(formatNumber(1234.567)).toBe('1,234.57')
    expect(formatNumber(0)).toBe('0')
  })

  it('formatNumber returns empty for empty/invalid input', () => {
    expect(formatNumber(undefined)).toBe('')
    expect(formatNumber('')).toBe('')
    expect(formatNumber('abc')).toBe('')
  })

  it('formatNumber keeps an in-progress decimal when allowDecimal', () => {
    expect(formatNumber('1234.', true)).toBe('1,234.')
    expect(formatNumber('1234.0', true)).toBe('1,234.0')
    expect(formatNumber(1234.5, true)).toBe('1,234.5')
  })

  it('formatDatetime renders Asia/Bangkok time with Thai locale', () => {
    expect(formatDatetime('2026-01-01T00:00:00Z')).toBe('07:00, 01 ม.ค. 2026')
    expect(formatDatetime('2026-01-01T00:00:00Z', 'YYYY-MM-DD HH:mm')).toBe('2026-01-01 07:00')
    expect(formatDatetime(undefined)).toBe('-')
  })
})
