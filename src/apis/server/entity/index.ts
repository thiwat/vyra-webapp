import { buildQuery } from '@/utils/request'
import { ServerRequestError } from '../../types'
import { request } from '../request'
import { RequestListInput } from './types'

/**
 * Map an `[entity]` route segment to a backend path when they differ,
 * e.g. `{ user_address: 'user/address' }`. Unmapped entities use the name as-is.
 */
const MAP_ENTITY: Record<string, string> = {}

const getPath = (entity: string) => {
  if (!/^[a-z0-9_]+$/i.test(entity || '')) {
    throw {
      status: 404,
      error: { statusCode: 404, code: 'entity_not_found', message: ['Entity not found'] }
    } as ServerRequestError
  }
  return MAP_ENTITY[entity] || entity
}

export const requestList = (entity: string, query: RequestListInput, headers: any) => {
  // `filter` arrives as a qs string (already URL-decoded by Next) and is re-encoded as-is
  return request(`/${getPath(entity)}?${buildQuery(query)}`, 'GET', undefined, headers)
}

export const requestGet = (entity: string, key: string, headers: any) => {
  return request(`/${getPath(entity)}/${encodeURIComponent(key)}`, 'GET', undefined, headers)
}

export const requestCreate = (entity: string, data: any, headers: any) => {
  return request(`/${getPath(entity)}`, 'POST', data, headers)
}

export const requestUpdate = (entity: string, key: string, data: any, headers: any) => {
  return request(`/${getPath(entity)}/${encodeURIComponent(key)}`, 'PUT', data, headers)
}

export const requestDelete = (entity: string, key: string, headers: any) => {
  return request(`/${getPath(entity)}/${encodeURIComponent(key)}`, 'DELETE', undefined, headers)
}
