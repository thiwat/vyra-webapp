import type { NextApiRequest, NextApiResponse } from 'next'
import { getHeadersFromRequest, methodNotAllowed, sendError } from '@/apis/server/request'
import { requestChangePassword } from '@/apis/server/user'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST'])

  try {
    const result = await requestChangePassword(req.body, getHeadersFromRequest(req))
    return res.status(200).json(result)
  } catch (e) {
    return sendError(res, e)
  }
}

export default handler
