import Cookies from 'cookies'
import { IncomingMessage, ServerResponse } from 'http'

/** Behind the server's nginx the app sees plain HTTP; nginx's X-Forwarded-Proto says the browser used HTTPS. */
export const openCookies = (req: IncomingMessage, res: ServerResponse) =>
  new Cookies(req, res, { secure: req.headers['x-forwarded-proto'] === 'https' || undefined })

/** Cookie options driven by COOKIE_SAME_SITE / COOKIE_SECURE / COOKIE_HTTP_ONLY. */
export const getCookieOptions = (maxAge?: number): Cookies.SetOption => ({
  path: '/',
  sameSite: (process.env.COOKIE_SAME_SITE || 'lax') as Cookies.SetOption['sameSite'],
  secure: process.env.COOKIE_SECURE === 'true',
  httpOnly: process.env.COOKIE_HTTP_ONLY === 'true',
  maxAge
})
