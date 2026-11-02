import type { NextApiRequest, NextApiResponse } from 'next'
import { getHeadersFromRequest, methodNotAllowed, sendError } from '@/apis/server/request'
import { requestGetRules, requestSaveRules } from '@/apis/server/trading'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === 'GET') {
      const result = await requestGetRules(getHeadersFromRequest(req))
      return res.status(200).json(result)
    }
    if (req.method === 'PUT') {
      const result = await requestSaveRules(req.body, getHeadersFromRequest(req))
      return res.status(200).json(result)
    }
    return methodNotAllowed(res, ['GET', 'PUT'])
  } catch (e) {
    return sendError(res, e)
  }
}

export default handler
