import type { NextApiRequest, NextApiResponse } from 'next'
import { requestUpload } from '@/apis/server/attachment'
import { getHeadersFromRequest, methodNotAllowed, sendError } from '@/apis/server/request'

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb'
    }
  }
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST'])

  try {
    const result = await requestUpload(req.body, getHeadersFromRequest(req))
    return res.status(200).json(result)
  } catch (e) {
    return sendError(res, e)
  }
}

export default handler
