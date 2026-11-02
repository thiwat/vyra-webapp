import queryString from 'query-string'
import { LOGIN_PATH } from '@/constants/auth'

/** Only same-origin relative paths are allowed as post-login redirect targets. */
export const getSafeRedirect = (value: unknown, fallback = '/'): string => {
  const path = Array.isArray(value) ? value[0] : value
  if (typeof path !== 'string' || !path.startsWith('/') || path.startsWith('//')) {
    return fallback
  }
  if (path.startsWith(LOGIN_PATH)) return fallback
  return path
}

/** `/login?redirect_url=<current path>` */
export const getLoginUrl = (redirectUrl?: string): string => {
  if (!redirectUrl || redirectUrl === '/' || redirectUrl.startsWith(LOGIN_PATH)) return LOGIN_PATH
  return queryString.stringifyUrl({ url: LOGIN_PATH, query: { redirect_url: redirectUrl } })
}
