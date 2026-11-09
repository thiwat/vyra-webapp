import { request } from '../request'
import {
  MonthSummary,
  ConnectionResult,
  Overview,
  RiskRules,
  RulesDetail,
  Trade
} from './types'

// Polled and previewed calls stay silent: a repeating toast helps nobody.
export const requestOverview = (): Promise<Overview> =>
  request('/trading/overview', 'GET', undefined, { silent: true })

export const requestCalendar = (query: { month: string }): Promise<MonthSummary> =>
  request('/trading/calendar', 'GET', query, { silent: true })

export const requestCloseTrade = (data: { trade_id: string }): Promise<Trade> =>
  request('/trading/close', 'POST', data)

export const requestRetryProtection = (data: { trade_id: string }): Promise<Trade> =>
  request('/trading/protection/retry', 'POST', data)

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
