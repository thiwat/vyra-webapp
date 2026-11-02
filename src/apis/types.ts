/**
 * The one error shape used end-to-end:
 * backend -> apis/server/request (throws ServerRequestError) -> API route `sendError`
 * -> browser -> apis/client/request (throws RequestError).
 */
export type ApiError = {
  statusCode: number
  code: string
  message: string[]
}

export type ServerRequestError = {
  status: number
  error: ApiError
}

/** Backend list response for `{ keywords, filter, sort, page, page_size }` queries. */
export type ListResponse<T = any> = {
  page: number
  page_size: number
  total: number
  total_page: number
  rows: T[]
}

export const toApiError = (status: number, body: any): ApiError => {
  const raw = body?.message ?? body?.error ?? body
  const message = Array.isArray(raw) ? raw.map(i => `${i}`) : raw ? [`${raw}`] : []
  return {
    statusCode: body?.statusCode || status,
    code: body?.code || '',
    message
  }
}
