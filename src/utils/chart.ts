export type ChartScale = { high: number; low: number; pad: number; height: number }

const CHART_MARGIN = 12

/** Pixel row for a price. Exact inverse of priceAtY. */
export const yAtPrice = (price: number, { high, low, pad, height }: ChartScale): number =>
  CHART_MARGIN + ((high + pad - price) / (high - low + 2 * pad)) * (height - 2 * CHART_MARGIN)

export const priceAtY = (y: number, { high, low, pad, height }: ChartScale): number =>
  high + pad - ((y - CHART_MARGIN) / (height - 2 * CHART_MARGIN)) * (high - low + 2 * pad)

export const snapToTick = (price: number, tick: number): number =>
  Number((Math.round(price / tick) * tick).toFixed(8))

/** R:R that puts the target at `takeProfit`, or null when it sits on the wrong side of entry. */
export const riskRewardFor = (
  side: string,
  entry: number,
  stopLoss: number,
  takeProfit: number
): number | null => {
  const direction = side == 'long' ? 1 : -1
  const risk = (entry - stopLoss) * direction
  const reward = (takeProfit - entry) * direction
  if (risk <= 0 || reward <= 0) return null
  return Number((reward / risk).toFixed(4))
}
