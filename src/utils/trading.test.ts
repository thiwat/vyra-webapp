import { describe, expect, it } from 'vitest'
import { decimalsOf, formatClock, formatSigned, unrealizedPnl } from './trading'

describe('trading format', () => {
  it('reads decimals from exchange steps', () => {
    expect(decimalsOf(0.01)).toBe(2)
    expect(decimalsOf(0.001)).toBe(3)
    expect(decimalsOf(1)).toBe(0)
  })

  it('signs P&L and drops the sign at zero', () => {
    expect(formatSigned(0.456)).toBe('+0.46')
    expect(formatSigned(-1.5)).toBe('−1.50')
    expect(formatSigned(-0.001)).toBe('0.00')
  })

  it('formats session clocks', () => {
    expect(formatClock(3725)).toBe('01:02:05')
  })

  it('flips unrealized P&L for shorts', () => {
    expect(unrealizedPnl('long', 100, 110, 2)).toBe(20)
    expect(unrealizedPnl('short', 100, 110, 2)).toBe(-20)
  })
})
