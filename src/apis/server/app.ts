import Cookies from 'cookies'
import type { IncomingMessage, ServerResponse } from 'http'
import { Profile } from '@/atoms/profile/types'
import { Settings } from '@/atoms/settings/types'
import { Theme } from '@/atoms/theme/types'
import { THEME_COOKIE, TOKEN_COOKIE } from '@/constants/auth'
import { Setting } from '@/enums/entity'
import { ThemeMode } from '@/enums/theme'
import { getCookieOptions } from './cookie'
import { requestGetSetting } from './setting'
import { requestMyProfile } from './user'

/** Props computed by `_app` getInitialProps on the server (first request only). */
export type AppPageProps = {
  /** true when the token cookie is valid. The token itself never reaches the browser. */
  authenticated?: boolean
  profile?: Profile
  settings?: Settings
  theme?: Theme
}

/**
 * SSR bootstrap for `_app`: token cookie -> profile, public site settings, theme cookie.
 * Loaded with a dynamic import from `_app` so this server code stays out of the client bundle.
 */
export const getServerAppProps = async (
  req: IncomingMessage,
  res: ServerResponse
): Promise<AppPageProps> => {
  const cookies = new Cookies(req, res)
  const token = cookies.get(TOKEN_COOKIE)
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined

  const [profile, settings] = await Promise.all([
    token ? requestMyProfile(headers).catch(() => null) : null,
    requestGetSetting({ code: Setting.site }, headers).catch(() => ({}))
  ])

  if (token && !profile) {
    // invalid/expired token: drop the cookie so the user lands on /login cleanly
    cookies.set(TOKEN_COOKIE, null, getCookieOptions())
  }

  return {
    authenticated: !!profile,
    profile: profile || {},
    settings: settings || {},
    theme: cookies.get(THEME_COOKIE) === ThemeMode.light ? ThemeMode.light : ThemeMode.dark
  }
}
