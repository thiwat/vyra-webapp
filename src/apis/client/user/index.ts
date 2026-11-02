import { Profile } from '@/atoms/profile/types'
import { request } from '../request'
import { RequestChangePasswordInput, RequestUpdateMyProfileInput } from './types'

export const requestMyProfile = async (): Promise<Profile> => {
  return request('/user/me', 'GET')
}

export const requestUpdateMyProfile = async ({
  data
}: RequestUpdateMyProfileInput): Promise<Profile> => {
  return request('/user/me', 'PUT', data)
}

/** Errors are shown on the form field, so the global toast is skipped. */
export const requestChangePassword = async (data: RequestChangePasswordInput) => {
  return request('/user/password', 'POST', data, { silent: true })
}
