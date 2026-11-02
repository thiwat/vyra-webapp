import { request } from '../request'
import { RequestUploadInput } from './types'

/** Upload a base64 file (value produced by the Upload control). */
export const requestUpload = async (body: RequestUploadInput): Promise<any> => {
  return request('/attachment/upload', 'POST', body)
}
