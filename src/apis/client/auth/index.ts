import { request } from '../request'
import { RequestLoginInput } from './types'

/** Errors are shown on the login form, so the global toast is skipped. */
export const requestLogin = async (data: RequestLoginInput): Promise<any> => {
  return request('/auth/login', 'POST', data, { silent: true, skipAuthRedirect: true })
}

export const requestRevokeToken = async (): Promise<any> => {
  return request('/auth/revoke', 'POST', {}, { skipAuthRedirect: true })
}
