import { request } from '../request'
import { LoginResponse, RequestLoginInput, RequestRevokeTokenInput } from './types'

export const requestLogin = (data: RequestLoginInput): Promise<LoginResponse> => {
  return request('/auth/access_token', 'POST', {
    username: data?.username,
    password: data?.password,
    app_key: process.env.SYSTEM_APP_KEY,
    secret_key: process.env.SYSTEM_SECRET_KEY
  })
}

export const requestRevokeToken = ({ token }: RequestRevokeTokenInput) => {
  return request('/auth/revoke', 'POST', { token })
}
