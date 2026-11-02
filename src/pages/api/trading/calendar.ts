import type { NextApiRequest, NextApiResponse } from 'next'
import { getHeadersFromRequest, methodNotAllowed, sendError } from '@/apis/server/request'
import { requestTradingCalendar } from '@/apis/server/trading'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET'])
  try {
    const result = await requestTradingCalendar(req.query, getHeadersFromRequest(req))
    return res.status(200).json(result)
  } catch (e) {
    return sendError(res, e)
  }
}

export default handler
