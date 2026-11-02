import queryString from 'query-string'
import toast from 'react-hot-toast'
import { NOT_REQUIRE_AUTH } from '@/constants/auth'
import { t } from '@/utils/translate'
import { getLoginUrl } from '@/utils/url'
import { ApiError, toApiError } from '../types'

export type RequestOptions = {
  /** Send `body` as-is (FormData) instead of JSON. */
  multipart?: boolean
  /** Do not run the global error handler (toast) - the caller shows its own error UI. */
  silent?: boolean
  /** Do not redirect to /login on 401/403. */
  skipAuthRedirect?: boolean
}

/** Thrown by `request` for every non-2xx response. `message` is the first backend message. */
export class RequestError extends Error {
  status: number
  code: string
  messages: string[]
  data: ApiError

  constructor(status: number, data: ApiError) {
    super(data?.message?.[0] || data?.code || t('common_error_default'))
    this.name = 'RequestError'
    this.status = status
    this.code = data?.code || ''
    this.messages = data?.message || []
    this.data = data
  }
}

export type RequestErrorHandler = (error: RequestError) => void

const defaultErrorHandler: RequestErrorHandler = error => {
  toast.error(error.message, { id: `${error.status}-${error.code}-${error.message}` })
}

let errorHandler: RequestErrorHandler | null = defaultErrorHandler

/** Replace the global error fallback; `null` disables it, no argument restores the default toast. */
export const setRequestErrorHandler = (handler?: RequestErrorHandler | null) => {
  errorHandler = handler === undefined ? defaultErrorHandler : handler
}

export const isAuthError = (status: number) => status === 401 || status === 403

const parseBody = async (res: Response) => {
  const text = await res.text()
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

/** Browser -> BFF (`/api/*`) call. Never talks to the backend directly. */
export const request = async (
  path: string,
  method: string = 'GET',
  body?: any,
  options: RequestOptions = {}
) => {
  method = method.toUpperCase()

  let reqPath = `/api/${path.replace(/^\/+/, '')}`

  if (method === 'GET' && body) {
    reqPath += `${reqPath.includes('?') ? '&' : '?'}${queryString.stringify(body)}`
  }

  const res = await fetch(reqPath, {
    method,
    headers: options.multipart ? {} : { 'Content-Type': 'application/json' },
    body: method === 'GET' ? null : options.multipart ? body : JSON.stringify(body ?? {})
  })

  const resJson = await parseBody(res)

  if (res.ok) return resJson

  const error = new RequestError(res.status, toApiError(res.status, resJson))

  const pathname = typeof window !== 'undefined' ? window.location.pathname : ''

  if (
    isAuthError(res.status) &&
    !options.skipAuthRedirect &&
    !NOT_REQUIRE_AUTH.includes(pathname)
  ) {
    window.location.assign(getLoginUrl(`${pathname}${window.location.search}`))
    throw error
  }

  if (!options.silent && errorHandler) {
    errorHandler(error)
  }

  throw error
}
