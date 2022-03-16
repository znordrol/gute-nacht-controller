import httpStatus from 'http-status';
import { withIronSessionApiRoute } from 'iron-session/next';
import type { NextApiRequest, NextApiResponse } from 'next';

import { COOKIE_NAME } from '@/constant/cookie';
import { triggerWorkflow } from '@/lib/github';

const NoGuteNachtHandler = withIronSessionApiRoute(
  async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {
      const user = req.session.user;

      if (!user || user?.admin !== true) {
        return res
          .status(httpStatus.UNAUTHORIZED)
          .send({ message: 'Unauthorized' });
      }
      await triggerWorkflow({ workflow_id: 'dont_run_today.yml' });
      res.status(httpStatus.CREATED).send('OK');
    } else {
      res
        .status(httpStatus.METHOD_NOT_ALLOWED)
        .json({ message: 'Method Not Allowed' });
    }
  },
  {
    cookieName: COOKIE_NAME,
    password: process.env.COOKIE_PASS as string,
    // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
    },
  }
);

export default NoGuteNachtHandler;
