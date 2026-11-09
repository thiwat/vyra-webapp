import { request } from '../request'
import { Bot } from './types'

export const requestStartBot = ({ id }: { id: string }): Promise<Bot> =>
  request(`/bot/${encodeURIComponent(id)}/start`, 'POST', { confirm: true })

export const requestStopBot = ({ id }: { id: string }): Promise<Bot> =>
  request(`/bot/${encodeURIComponent(id)}/stop`, 'POST')
