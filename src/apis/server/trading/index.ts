import { request } from '../request'

export const requestTradingOverview = (headers: any) =>
  request('/trading/overview', 'GET', undefined, headers)

export const requestTradingCalendar = (query: any, headers: any) =>
  request('/trading/calendar', 'GET', query, headers)


export const requestCloseTrade = (data: any, headers: any) =>
  request('/trading/close', 'POST', data, headers)

export const requestRetryProtection = (data: any, headers: any) =>
  request('/trading/protection/retry', 'POST', data, headers)

export const requestTestConnection = (data: any, headers: any) =>
  request('/connector/test', 'POST', data, headers)

export const requestActivateConnector = (id: string, data: any, headers: any) =>
  request(`/connector/${encodeURIComponent(id)}/activate`, 'POST', data, headers)

export const requestGetRules = (headers: any) =>
  request('/trading/rules', 'GET', undefined, headers)

export const requestSaveRules = (data: any, headers: any) =>
  request('/trading/rules', 'PUT', data, headers)
