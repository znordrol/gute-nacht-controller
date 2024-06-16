import { withIronSessionApiRoute } from 'iron-session/next';
import type { NextApiRequest, NextApiResponse } from 'next';

import { COOKIE_OPTIONS } from '@/constant/cookie';
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
  COOKIE_OPTIONS,
);

export default YesGuteNachtHandler;
