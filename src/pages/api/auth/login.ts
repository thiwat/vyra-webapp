import Cookies from 'cookies'
import _omit from 'lodash/omit'
import type { NextApiRequest, NextApiResponse } from 'next'
import { requestLogin } from '@/apis/server/auth'
import { getCookieOptions } from '@/apis/server/cookie'
import { methodNotAllowed, sendError } from '@/apis/server/request'
import { TOKEN_COOKIE } from '@/constants/auth'

/** POST { username, password } -> sets the httpOnly token cookie. The token is never returned. */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST'])

  try {
    const result = await requestLogin(req.body)
    if (result?.token) {
      const cookies = new Cookies(req, res)
      // backend `expires_in` is in seconds, `cookies` maxAge is in milliseconds
      const maxAge = result.expires_in ? result.expires_in * 1000 : undefined
      cookies.set(TOKEN_COOKIE, result.token, getCookieOptions(maxAge))
    }
    return res.status(200).json(_omit(result, ['token', 'refresh_token']))
  } catch (e) {
    return sendError(res, e)
  }
}

export default handler
