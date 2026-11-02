import { request } from '../request'
import { RequestGetSettingInput } from './types'

export const requestGetSetting = (data: RequestGetSettingInput, headers?: any) => {
  return request(`/setting/${data.code}`, 'GET', undefined, headers)
}
