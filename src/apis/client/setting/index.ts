import { request } from '../request'
import { RequestGetSettingInput, RequestSetThemeInput } from './types'

export const requestGetSetting = (data: RequestGetSettingInput) => {
  return request(`/setting/${data.code}`, 'GET')
}

export const requestSetTheme = (data: RequestSetThemeInput) => {
  return request('/theme', 'POST', data, { silent: true })
}
