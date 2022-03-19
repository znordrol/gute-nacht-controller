import httpStatus from 'http-status';
import { withIronSessionApiRoute } from 'iron-session/next';
import type { NextApiRequest, NextApiResponse } from 'next';

import { COOKIE_OPTIONS } from '@/constant/cookie';

const CheckTTT = withIronSessionApiRoute(
  async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
      const user = req.session.user;

      if (!user || user?.admin !== true) {
        return res
          .status(httpStatus.UNAUTHORIZED)
          .send({ message: 'Unauthorized' });
      }

      res.status(201).send('OK');
    } else {
      res.status(405).json({ message: 'Method Not Allowed' });
    }
  },
  COOKIE_OPTIONS
);

export default CheckTTT;
