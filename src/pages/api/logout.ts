// pages/api/logout.ts

import { withIronSessionApiRoute } from 'iron-session/next';
import type { NextApiRequest, NextApiResponse } from 'next';

import { COOKIE_OPTIONS } from '@/constant/cookie';

export default withIronSessionApiRoute(
  (req: NextApiRequest, res: NextApiResponse) => {
    req.session.destroy();
    res.send({ ok: true });
  },
  COOKIE_OPTIONS
);
