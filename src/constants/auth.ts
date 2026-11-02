export const LOGIN_PATH = '/login'

/** Pages reachable without a token. A logged-in user visiting one is sent to `/`. */
export const NOT_REQUIRE_AUTH = [LOGIN_PATH]

/** Pages rendered with the Login layout (see hooks/layout). */
export const LOGIN_LAYOUT_PAGES = [LOGIN_PATH]

export const TOKEN_COOKIE = 'token'
export const THEME_COOKIE = 'theme'
