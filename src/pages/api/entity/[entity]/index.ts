import type { NextApiRequest, NextApiResponse } from 'next'
import { requestCreate, requestList } from '@/apis/server/entity'
import { getHeadersFromRequest, methodNotAllowed, sendError } from '@/apis/server/request'

/** GET (list) / POST (create) for any backend entity. */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const entity = req.query.entity as string
  try {
    if (req.method === 'GET') {
      const result = await requestList(entity, req.query as any, getHeadersFromRequest(req))
      return res.status(200).json(result)
    }
    if (req.method === 'POST') {
      const result = await requestCreate(entity, req.body, getHeadersFromRequest(req))
      return res.status(200).json(result)
    }
    return methodNotAllowed(res, ['GET', 'POST'])
  } catch (e) {
    return sendError(res, e)
  }
}

export default handler
