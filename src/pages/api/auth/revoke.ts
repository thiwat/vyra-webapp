import type { NextApiRequest, NextApiResponse } from 'next'
import { requestRevokeToken } from '@/apis/server/auth'
import { getCookieOptions, openCookies } from '@/apis/server/cookie'
import { methodNotAllowed } from '@/apis/server/request'
import { TOKEN_COOKIE } from '@/constants/auth'

/** POST -> revokes the token on the backend (best effort) and always clears the cookie. */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST'])

  const cookies = openCookies(req, res)
  const token = cookies.get(TOKEN_COOKIE)

  try {
    if (token) await requestRevokeToken({ token })
  } catch {
    // token already invalid/expired - logging out locally is still correct
  }

  cookies.set(TOKEN_COOKIE, null, getCookieOptions())
  return res.status(200).json({})
}

export default handler
