import { request } from '../request'

export const requestStartBot = (id: string, data: any, headers: any) =>
  request(`/bot/${encodeURIComponent(id)}/start`, 'POST', data, headers)

export const requestStopBot = (id: string, data: any, headers: any) =>
  request(`/bot/${encodeURIComponent(id)}/stop`, 'POST', data, headers)
