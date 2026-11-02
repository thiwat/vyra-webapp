import { describe, expect, it } from 'vitest'
import { priceAtY, riskRewardFor, snapToTick, yAtPrice } from './chart'

const scale = { high: 2300, low: 2200, pad: 6, height: 500 }

describe('chart maths', () => {
  it('converts price to pixels and back', () => {
    expect(priceAtY(yAtPrice(2250.5, scale), scale)).toBeCloseTo(2250.5, 6)
  })

  it('puts higher prices nearer the top', () => {
    expect(yAtPrice(2290, scale)).toBeLessThan(yAtPrice(2210, scale))
  })

  it('snaps to the exchange tick without float drift', () => {
    expect(snapToTick(2268.397, 0.01)).toBe(2268.4)
    expect(snapToTick(78276.26, 0.1)).toBe(78276.3)
  })

  it('derives R:R for longs and shorts', () => {
    expect(riskRewardFor('long', 2300, 2280, 2348)).toBe(2.4)
    expect(riskRewardFor('short', 2300, 2320, 2252)).toBe(2.4)
  })

  it('refuses a target on the wrong side', () => {
    expect(riskRewardFor('long', 2300, 2280, 2290)).toBeNull()
    expect(riskRewardFor('short', 2300, 2320, 2310)).toBeNull()
    expect(riskRewardFor('long', 2300, 2310, 2350)).toBeNull()
  })
})
