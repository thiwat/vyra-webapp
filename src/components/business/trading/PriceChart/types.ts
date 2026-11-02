import { TradePlan } from '@/apis/client/trading/types'

export type ChartLevel = 'entry' | 'sl' | 'tp'

export type PriceChartProps = {
  symbol: string
  price?: number
  tickSize: number
  plan?: TradePlan
  /** Limit orders can drag the entry line too. */
  entryEditable?: boolean
  onLevelChange?: (level: ChartLevel, price: number) => void
}
