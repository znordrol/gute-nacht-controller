// pages/api/logout.ts

import { withIronSessionApiRoute } from 'iron-session/next';
import type { NextApiRequest, NextApiResponse } from 'next';

export default withIronSessionApiRoute(
  (req: NextApiRequest, res: NextApiResponse) => {
    req.session.destroy();
    res.send({ ok: true });
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
