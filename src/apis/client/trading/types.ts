export type SymbolRules = {
  symbol: string
  tick_size: number
  step_size: number
  min_qty: number
  min_notional: number
}

export type RiskRules = {
  equity: number
  risk_per_trade_pct: number
  daily_loss_pct: number
  max_notional_pct: number
  max_risk_usdt: number
  max_daily_loss_usdt: number
  max_trades_per_day: number
  max_active_positions: number
  cooldown_minutes: number
  session_hours: number
  min_stop_pct: number
  max_notional_usdt: number
  slippage_pct: number
  default_leverage: number
  default_symbol: string
}

export type RulesDetail = {
  current: RiskRules
  pending: RiskRules | null
  pending_day: string | null
}

export type Connector = {
  id: string
  name: string
  exchange: string
  market: string
  environment: string
  api_key_masked: string
  last_tested_at?: string
  last_test_ok?: boolean
  last_test_balance?: number
  last_test_message?: string
  max_amount_usdt?: number
  is_active?: boolean
}

export type ConnectionResult = {
  ok: boolean
  balance?: number
  code?: string
  message?: string
}

export type DaySummary = { day: string; pnl: number; trades: number }

export type MonthSummary = {
  month: string
  days: DaySummary[]
  total: number
  win_days: number
  loss_days: number
}

export type PlanCheck = { code: string; message: string }

export type Discipline = {
  trades_taken: number
  trades_remaining: number
  daily_realized_pnl: number
  daily_loss_remaining: number
  next_trade_risk_budget: number
  cooldown_seconds: number
  session_seconds: number
  session_limit_seconds: number
  session_active: boolean
  session_used: boolean
  locked: boolean
  can_open: boolean
  blocks: PlanCheck[]
}

export type Trade = {
  id: string
  client_order_id: string
  symbol: string
  side: 'long' | 'short'
  entry_type: 'market' | 'limit'
  status:
    'pending_entry' | 'entry_unknown' | 'open' | 'unprotected' | 'closed' | 'canceled' | 'rejected'
  source: 'terminal' | 'external' | 'bot'
  bot_id?: string
  leverage?: number
  entry_price?: number
  stop_loss_price?: number
  take_profit_price?: number
  filled_quantity: number
  average_entry_price: number
  stop_loss_confirmed: boolean
  take_profit_confirmed: boolean
  protection_error?: string
  risk_limit?: number
  actual_risk?: number
  exit_price?: number
  close_reason?: string
  closed_at?: string
  fees?: number
  realized_pnl?: number
  note?: string
}

export type Position = { symbol: string; quantity: number; entry_price: number }

export type AlgoOrder = {
  client_algo_id: string
  symbol: string
  type: 'stop_market' | 'take_profit_market'
  trigger_price: number
  status: string
}

export type Account = {
  id: string
  name: string
  exchange: string
  environment: string
  is_active: boolean
}

export type Overview = {
  accounts: Account[]
  connector_id?: string
  live_enabled: boolean
  reconcile_age_seconds: number | null
  mode?: string
  connected: boolean
  rules: RiskRules
  discipline: Discipline
  active_trade: Trade | null
  active_trades: Trade[]
  /** Allowed symbols per bot strategy. */
  bot_symbols: Record<string, string[]>
  bot_strategies: string[]
  symbols: SymbolRules[]
  account?: { wallet_balance: number; available_balance: number }
  positions: Position[]
  algo_orders: AlgoOrder[]
  mark_prices: Record<string, number>
}

export type TradePlan = {
  ok: boolean
  entry_price: number
  stop_loss_price: number
  take_profit_price: number
  stop_distance_pct: number
  risk_budget: number
  quantity: number
  notional: number
  margin: number
  estimated_fees: number
  estimated_loss: number
  estimated_profit: number
  estimated_liquidation_price: number
  min_notional: number
  capped_by_max_notional: boolean
  stop_range: { nearest_price: number; farthest_price: number } | null
  errors: PlanCheck[]
}

