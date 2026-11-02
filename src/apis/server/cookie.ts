import Cookies from 'cookies'

/** Cookie options driven by COOKIE_SAME_SITE / COOKIE_SECURE / COOKIE_HTTP_ONLY. */
export const getCookieOptions = (maxAge?: number): Cookies.SetOption => ({
  path: '/',
  sameSite: (process.env.COOKIE_SAME_SITE || 'lax') as Cookies.SetOption['sameSite'],
  secure: process.env.COOKIE_SECURE === 'true',
  httpOnly: process.env.COOKIE_HTTP_ONLY === 'true',
  maxAge
})
