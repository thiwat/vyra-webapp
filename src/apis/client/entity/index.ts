import { ListResponse } from '@/apis/types'
import { buildQuery } from '@/utils/request'
import { request } from '../request'
import {
  RequestCreateInput,
  RequestDeleteInput,
  RequestGetInput,
  RequestListInput,
  RequestUpdateInput
} from './types'

export const requestList = async ({
  entity,
  ...other
}: RequestListInput): Promise<ListResponse> => {
  return request(`/entity/${entity}?${buildQuery(other)}`, 'GET')
}

export const requestGet = async ({ entity, key }: RequestGetInput) => {
  return request(`/entity/${entity}/${encodeURIComponent(key)}`, 'GET')
}

export const requestCreate = async ({ entity, data }: RequestCreateInput) => {
  return request(`/entity/${entity}`, 'POST', data)
}

export const requestUpdate = async ({ entity, key, data }: RequestUpdateInput) => {
  return request(`/entity/${entity}/${encodeURIComponent(key)}`, 'PUT', data)
}

export const requestDelete = async ({ entity, key }: RequestDeleteInput) => {
  return request(`/entity/${entity}/${encodeURIComponent(key)}`, 'DELETE')
}
