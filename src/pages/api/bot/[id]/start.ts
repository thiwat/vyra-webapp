import type { NextApiRequest, NextApiResponse } from 'next'
import { requestStartBot } from '@/apis/server/bot'
import { getHeadersFromRequest, methodNotAllowed, sendError } from '@/apis/server/request'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST'])
  try {
    const result = await requestStartBot(
      req.query.id as string,
      req.body,
      getHeadersFromRequest(req)
    )
    return res.status(200).json(result)
  } catch (e) {
    return sendError(res, e)
  }
}

export default handler
