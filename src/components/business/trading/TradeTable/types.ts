import { Trade } from '@/apis/client/trading/types'

export type TradeTableProps = {
  rows: Trade[]
  sort?: string
  onSort?: (value: string) => void
  onNoteSaved?: () => void
}
