import { Trade } from '../trading/types'

export type BotStatus = 'running' | 'stopped' | 'halted'

export type Bot = {
  id: string
  name: string
  symbol: string
  strategy: string
  capital_usdt: number
  risk_pct: number
  max_daily_loss_pct: number
  status: BotStatus
  halt_reason?: string
  connector_id: string
  started_at?: string
  last_run_at?: string
  last_message?: string
  pnl_today: number
  pnl_total: number
  trades: number
  wins: number
  losses: number
  active_trade: Trade | null
}
