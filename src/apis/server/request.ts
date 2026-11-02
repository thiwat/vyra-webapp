import Cookies from 'cookies'
import _get from 'lodash/get'
import queryString from 'query-string'
import type { IncomingMessage } from 'http'
import type { NextApiResponse } from 'next'
import { TOKEN_COOKIE } from '@/constants/auth'
import { ApiError, ServerRequestError, toApiError } from '../types'

const joinUrl = (base: string = '', path: string = '') => {
  return `${base.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`
}

const parseBody = async (res: Response) => {
  const text = await res.text()
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

/**
 * Server-side (BFF) call to `process.env.API_GATEWAY`.
 * Throws `{ status, error: ApiError }` on non-2xx / network failure.
 */
export const request = async (path: string, method: string, body?: any, reqHeaders?: any) => {
  const headers = {
    'Content-Type': 'application/json',
    ...reqHeaders
  }

  method = (method || 'GET').toUpperCase()
  let url = joinUrl(process.env.API_GATEWAY, path)

  if (method === 'GET' && body) {
    url += `${url.includes('?') ? '&' : '?'}${queryString.stringify(body)}`
  }

  let res: Response
  try {
    res = await fetch(url, {
      method,
      headers,
      body:
        method === 'GET'
          ? null
          : headers['Content-Type'].startsWith('multipart/form-data')
            ? body
            : JSON.stringify(body ?? {})
    })
  } catch (e) {
    throw {
      status: 502,
      error: { statusCode: 502, code: 'bad_gateway', message: [e?.message || 'Bad gateway'] }
    } as ServerRequestError
  }

  const resJson = await parseBody(res)

  if (!res.ok) {
    throw { status: res.status, error: toApiError(res.status, resJson) } as ServerRequestError
  }

  return resJson
}

/** Forward auth (from the httpOnly cookie) and client identity to the backend. */
export const getHeadersFromRequest = (req: IncomingMessage & { ip?: string }) => {
  const res = {}

  const cookies = new Cookies(req, null)
  const token = cookies.get(TOKEN_COOKIE)

  if (token) {
    res['Authorization'] = `Bearer ${token}`
  }

  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket?.remoteAddress

  res['X-Client-IP'] = clientIp === '::1' ? '127.0.0.1' : clientIp
  res['User-Agent'] = _get(req, 'headers.user-agent')

  res['client-ip'] = `${
    _get(req, 'headers.client-ip') ||
    _get(req, 'headers.x-forwarded-for') ||
    _get(req, 'ip') ||
    _get(req, 'socket.remoteAddress') ||
    ''
  }`.split(',')[0]

  return res
}

/** `catch (e) { return sendError(res, e) }` - always answers with an ApiError body. */
export const sendError = (res: NextApiResponse, e: any) => {
  const status = e?.status || 500
  const error: ApiError = e?.error || {
    statusCode: status,
    code: 'internal_server_error',
    message: [e?.message || 'Internal server error']
  }
  return res.status(status).json(error)
}

export const methodNotAllowed = (res: NextApiResponse, allow: string[]) => {
  res.setHeader('Allow', allow)
  return res.status(405).json({
    statusCode: 405,
    code: 'method_not_allowed',
    message: ['Method not allowed']
  } as ApiError)
}
