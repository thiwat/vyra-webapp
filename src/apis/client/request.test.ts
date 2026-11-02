import toast from 'react-hot-toast'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { request, RequestError, setRequestErrorHandler } from './request'

const mockFetch = (status: number, body: any) => {
  const fetchMock = vi
    .fn()
    .mockResolvedValue(new Response(body === undefined ? '' : JSON.stringify(body), { status }))
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

describe('apis/client/request', () => {
  const assign = vi.fn()

  beforeEach(() => {
    vi.stubGlobal('location', { ...window.location, pathname: '/profile', search: '?a=1', assign })
    vi.spyOn(toast, 'error').mockImplementation(() => '')
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    assign.mockReset()
    setRequestErrorHandler()
  })

  it('calls the BFF under /api and returns JSON', async () => {
    const fetchMock = mockFetch(200, { ok: true })
    await expect(request('/user/me', 'get')).resolves.toEqual({ ok: true })
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/user/me',
      expect.objectContaining({ method: 'GET' })
    )
  })

  it('serialises GET bodies as query string', async () => {
    const fetchMock = mockFetch(200, {})
    await request('/setting/site', 'GET', { a: 1, b: 'x y' })
    expect(fetchMock.mock.calls[0][0]).toBe('/api/setting/site?a=1&b=x%20y')
  })

  it('throws RequestError with the backend error shape and toasts by default', async () => {
    mockFetch(400, { statusCode: 400, code: 'duplicate_username', message: ['Duplicate username'] })

    const error = await request('/entity/user', 'POST', {}).catch(e => e)

    expect(error).toBeInstanceOf(RequestError)
    expect(error.status).toBe(400)
    expect(error.code).toBe('duplicate_username')
    expect(error.message).toBe('Duplicate username')
    expect(toast.error).toHaveBeenCalledWith('Duplicate username', expect.anything())
  })

  it('silent requests skip the global handler', async () => {
    mockFetch(400, { statusCode: 400, code: 'x', message: ['bad'] })
    await expect(request('/x', 'POST', {}, { silent: true })).rejects.toThrow('bad')
    expect(toast.error).not.toHaveBeenCalled()
  })

  it('the global handler is overridable', async () => {
    const handler = vi.fn()
    setRequestErrorHandler(handler)
    mockFetch(500, { message: 'boom' })
    await expect(request('/x', 'GET')).rejects.toThrow('boom')
    expect(handler).toHaveBeenCalledWith(expect.any(RequestError))
  })

  it('redirects to /login with redirect_url on 401/403', async () => {
    mockFetch(401, { statusCode: 401, code: 'unauthorized', message: ['Unauthorized'] })
    await expect(request('/user/me', 'GET')).rejects.toBeInstanceOf(RequestError)
    expect(assign).toHaveBeenCalledWith('/login?redirect_url=%2Fprofile%3Fa%3D1')
    expect(toast.error).not.toHaveBeenCalled()
  })
})
