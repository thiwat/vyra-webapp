import { Trade, TradePlan } from '@/apis/client/trading/types'

export type TradeReviewProps = {
  open: boolean
  plan?: TradePlan
  side?: string
  symbol?: string
  entryType?: string
  leverage?: number
  tickSize: number
  stepSize: number
  result?: Trade | null
  placing?: boolean
  isLive?: boolean
  onConfirm: () => void
  onClose: () => void
  onViewPosition: () => void
}
