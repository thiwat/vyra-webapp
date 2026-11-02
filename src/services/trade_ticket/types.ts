export type TicketValues = {
  symbol: string
  side: 'long' | 'short'
  entry_type: 'market' | 'limit'
  entry_price?: number | string
  stop_mode: 'pct' | 'price'
  stop_value?: number | string
  risk_reward?: number | string
  leverage?: number | string
}
