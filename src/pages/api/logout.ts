// pages/api/logout.ts

import { withIronSessionApiRoute } from 'iron-session/next';
import type { NextApiRequest, NextApiResponse } from 'next';

import { COOKIE_NAME } from '@/constant/cookie';

export default withIronSessionApiRoute(
  (req: NextApiRequest, res: NextApiResponse) => {
    req.session.destroy();
    res.send({ ok: true });
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
