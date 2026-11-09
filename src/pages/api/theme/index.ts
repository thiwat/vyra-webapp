import type { NextApiRequest, NextApiResponse } from 'next'
import { getCookieOptions, openCookies } from '@/apis/server/cookie'
import { methodNotAllowed } from '@/apis/server/request'
import { THEME_COOKIE } from '@/constants/auth'
import { ThemeMode } from '@/enums/theme'

/** POST { theme: 'light' | 'dark' } -> persists the theme in a cookie read by `_app` SSR. */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST'])

  const theme = req.body?.theme === ThemeMode.dark ? ThemeMode.dark : ThemeMode.light
  const cookies = openCookies(req, res)
  cookies.set(THEME_COOKIE, theme, getCookieOptions(1000 * 60 * 60 * 24 * 365))
  return res.status(200).json({ theme })
}

export default handler
