import { describe, expect, it } from 'vitest'
import { getLoginUrl, getSafeRedirect } from './url'

describe('utils/url', () => {
  it('getSafeRedirect only allows same-origin relative paths', () => {
    expect(getSafeRedirect('/profile?tab=1')).toBe('/profile?tab=1')
    expect(getSafeRedirect(['/a', '/b'])).toBe('/a')
    expect(getSafeRedirect('https://evil.com')).toBe('/')
    expect(getSafeRedirect('//evil.com')).toBe('/')
    expect(getSafeRedirect('/login')).toBe('/')
    expect(getSafeRedirect(undefined)).toBe('/')
  })

  it('getLoginUrl adds an encoded redirect_url', () => {
    expect(getLoginUrl('/profile/edit?x=1')).toBe('/login?redirect_url=%2Fprofile%2Fedit%3Fx%3D1')
    expect(getLoginUrl('/')).toBe('/login')
    expect(getLoginUrl()).toBe('/login')
  })
})
