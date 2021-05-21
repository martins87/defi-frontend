// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from 'next';

interface ResponseData {
  name: string
}

export default (req: NextApiRequest, res: NextApiResponse<ResponseData>) => {
  const responseObj: ResponseData = { name: 'Daniel Martins' };
  res.status(200).json(responseObj)
}
