import type { NextApiRequest, NextApiResponse } from 'next'
import { getHeadersFromRequest, methodNotAllowed, sendError } from '@/apis/server/request'
import { requestGetSetting } from '@/apis/server/setting'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET'])

  try {
    const result = await requestGetSetting(
      { code: req.query.code as string },
      getHeadersFromRequest(req)
    )
    return res.status(200).json(result)
  } catch (e) {
    return sendError(res, e)
  }
}

export default handler
