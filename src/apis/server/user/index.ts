import { request } from '../request'
import { RequestChangePasswordInput } from './types'

export const requestMyProfile = async (headers: any) => {
  return request('/auth/me', 'GET', undefined, headers)
}

export const requestUpdateMyProfile = async (data: any, headers: any) => {
  return request('/auth/me', 'PUT', data, headers)
}

export const requestChangePassword = async (data: RequestChangePasswordInput, headers: any) => {
  return request('/auth/password/change', 'POST', data, headers)
}
