import { request } from '../request'
import {
  Candle,
  MonthSummary,
  ConnectionResult,
  Overview,
  RiskRules,
  RulesDetail,
  Trade,
  TradeInput,
  TradePlan
} from './types'

// Polled and previewed calls stay silent: a repeating toast helps nobody.
export const requestOverview = (): Promise<Overview> =>
  request('/trading/overview', 'GET', undefined, { silent: true })

export const requestCandles = (query: { symbol: string; interval: string }): Promise<Candle[]> =>
  request('/trading/candles', 'GET', query, { silent: true })

export const requestCalendar = (query: { month: string }): Promise<MonthSummary> =>
  request('/trading/calendar', 'GET', query, { silent: true })

export const requestTradePreview = (data: TradeInput): Promise<TradePlan> =>
  request('/trading/preview', 'POST', data, { silent: true })

export const requestPlaceTrade = (
  data: TradeInput & { client_order_id: string; confirm: boolean }
): Promise<Trade> => request('/trading/order', 'POST', data)

export const requestCloseTrade = (): Promise<Trade> => request('/trading/close', 'POST')

export const requestRetryProtection = (): Promise<Trade> =>
  request('/trading/protection/retry', 'POST')

export const requestEndSession = () => request('/trading/session/end', 'POST')

export const requestActivateConnector = ({
  id,
  confirm_live
}: {
  id: string
  confirm_live?: boolean
}) => request(`/connector/${id}/activate`, 'POST', { confirm_live })

export const requestTestConnection = (data: Record<string, any>): Promise<ConnectionResult> =>
  request('/connector/test', 'POST', data)

export const requestRules = (): Promise<RulesDetail> => request('/trading/rules', 'GET')

export const requestSaveRules = (data: RiskRules): Promise<RulesDetail> =>
  request('/trading/rules', 'PUT', data)
