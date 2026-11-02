import { request } from '../request'
import { RequestUploadInput } from './types'

export const requestUpload = async (body: RequestUploadInput, headers: any): Promise<any> => {
  return request('/attachment/upload', 'POST', body, headers)
}
