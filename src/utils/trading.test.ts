import { describe, expect, it } from 'vitest'
import { toTradeInput } from '@/services/trade_ticket'
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

describe('toTradeInput', () => {
  const values = {
    symbol: 'ETHUSDT',
    side: 'long',
    entry_type: 'market',
    stop_mode: 'pct',
    stop_value: 0.9,
    risk_reward: 2,
    leverage: 5
  } as const

  it('maps the stop mode to the matching field', () => {
    expect(toTradeInput(values).stop_loss_pct).toBe(0.9)
    const price = toTradeInput({ ...values, stop_mode: 'price', stop_value: 2200 })
    expect(price.stop_loss_price).toBe(2200)
    expect(price.stop_loss_pct).toBeUndefined()
  })

  it('never sends an entry price with a market order', () => {
    expect(toTradeInput({ ...values, entry_price: 1 }).entry_price).toBeUndefined()
  })

  it('holds back incomplete input', () => {
    expect(toTradeInput({ ...values, stop_value: '' })).toBeNull()
    expect(toTradeInput({ ...values, risk_reward: 0 })).toBeNull()
    expect(toTradeInput({ ...values, entry_type: 'limit' })).toBeNull()
  })
})
