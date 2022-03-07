import { withIronSessionApiRoute } from 'iron-session/next';
import type { NextApiRequest, NextApiResponse } from 'next';

import { triggerWorkflow } from '@/lib/github';

const YesGuteNachtHandler = withIronSessionApiRoute(
  async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {
      const user = req.session.user;

      if (!user || user?.admin !== true) {
        return res.status(401).send({ message: 'Unauthorized' });
      }
      await triggerWorkflow({ workflow_id: 'gute_nacht_today.yml' });
      res.status(201).send('OK');
    } else {
      res.status(405).json({ message: 'Method Not Allowed' });
    }
  },
  {
    cookieName: 'cookie_ini_khusus_buatmu',
    password: process.env.COOKIE_PASS as string,
    // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
    },
  }
);

export default YesGuteNachtHandler;
