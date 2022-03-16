// pages/api/login.ts

import { compare, hash } from 'bcrypt';
import httpStatus from 'http-status';
import { withIronSessionApiRoute } from 'iron-session/next';
import type { NextApiRequest, NextApiResponse } from 'next';

import { COOKIE_NAME } from '@/constant/cookie';
import { changePassword, getUser } from '@/lib/fauna';

declare module 'iron-session' {
  interface IronSessionData {
    user?: {
      id: number;
      name: string;
      admin?: boolean;
    };
  }
}

export type UserSession = {
  id: number;
  name: string;
  admin?: boolean;
};

export type LoginResponse = {
  message?: string;
  status?: number;
  ok?: boolean;
};

export default withIronSessionApiRoute(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const { method } = req;
    const user = req.session.user;

    if (!user || user?.admin !== true) {
      return res.status(401).send({ message: 'Unauthorized' });
    }

    switch (method) {
      case 'POST': {
        const data = await getUser(user);

        if (!data || !(await compare(req.body.password, data.data.password))) {
          return res.status(httpStatus.BAD_REQUEST).json({
            status: httpStatus.BAD_REQUEST,
            message: 'User or password are invalid, who are u 🤔',
          });
        }

        if (!req.body.newPassword) {
          return res.status(httpStatus.BAD_REQUEST).json({
            status: httpStatus.BAD_REQUEST,
            message: 'You must include your new password 🤔',
          });
        }

        const newPassword = await hash(req.body.newPassword, 10);

        await changePassword({
          name: data.data.name,
          newPassword,
        });

        // req.session.destroy();
        res.send({ ok: true });
        break;
      }
      default:
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${method} Not Allowed`);
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
