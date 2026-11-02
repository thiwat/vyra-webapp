/*
 * OPTIONAL: LINE LIFF integration.
 *
 * `_app.tsx` calls `initLiff(settings.liff_id)` only when the backend site setting `liff_id`
 * is set; otherwise nothing here runs and `@line/liff` is never loaded (dynamic import).
 * To remove LIFF completely: delete this file, the `initLiff` call in `_app.tsx`
 * and the `@line/liff` dependency.
 */
import type { Liff } from '@line/liff'

let liffInstance: Liff | null = null

export const initLiff = async (liffId?: string): Promise<boolean> => {
  if (!liffId || typeof window === 'undefined') return false
  try {
    const { default: liff } = await import('@line/liff')
    await liff.init({ liffId })
    liffInstance = liff
    return true
  } catch (e) {
    console.warn('LIFF init failed', e)
    return false
  }
}

export const getLiff = (): Liff | null => liffInstance

/** Opened inside the LINE app and logged in to LINE. */
export const isInLiff = (): boolean => {
  return !!liffInstance && liffInstance.isInClient() && liffInstance.isLoggedIn()
}

export const lineLogin = (redirectUri?: string) => {
  liffInstance?.login({ redirectUri })
}

/** LINE access token, e.g. to exchange for an app token on a BFF route. */
export const getLineToken = (): string | null => {
  return liffInstance?.getAccessToken() || null
}

export const closeLiff = () => {
  liffInstance?.closeWindow()
}
