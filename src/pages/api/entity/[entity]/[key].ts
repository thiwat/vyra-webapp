import type { NextApiRequest, NextApiResponse } from 'next'
import { requestDelete, requestGet, requestUpdate } from '@/apis/server/entity'
import { getHeadersFromRequest, methodNotAllowed, sendError } from '@/apis/server/request'

/** GET (detail) / PUT (update) / DELETE for any backend entity. */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const entity = req.query.entity as string
  const key = req.query.key as string
  try {
    if (req.method === 'GET') {
      const result = await requestGet(entity, key, getHeadersFromRequest(req))
      return res.status(200).json(result)
    }
    if (req.method === 'PUT') {
      const result = await requestUpdate(entity, key, req.body, getHeadersFromRequest(req))
      return res.status(200).json(result)
    }
    if (req.method === 'DELETE') {
      const result = await requestDelete(entity, key, getHeadersFromRequest(req))
      return res.status(200).json(result ?? {})
    }
    return methodNotAllowed(res, ['GET', 'PUT', 'DELETE'])
  } catch (e) {
    return sendError(res, e)
  }
}

export default handler
