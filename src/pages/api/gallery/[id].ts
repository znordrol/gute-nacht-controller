import cloudinary from 'cloudinary';
import httpStatus from 'http-status';
import { withIronSessionApiRoute } from 'iron-session/next';
import type { NextApiRequest, NextApiResponse } from 'next';

import { COOKIE_OPTIONS } from '@/constant/cookie';

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
      return res
        .status(httpStatus.UNAUTHORIZED)
        .send({ message: 'Unauthorized' });
    }

    switch (method) {
      case 'POST': {
        const { id } = req.query as { id: string };

        if (!id) {
          return res
            .status(httpStatus.BAD_REQUEST)
            .send({ message: 'Bad Request' });
        }

        const tags: string[] | undefined = req.body?.tags;

        if (!tags) {
          return res
            .status(httpStatus.BAD_REQUEST)
            .send({ message: 'Bad Request' });
        }

        await cloudinary.v2.api.update(`tia/${id}`, { tags });

        res.send({ ok: true });
        break;
      }
      default:
        res.setHeader('Allow', ['POST']);
        res
          .status(httpStatus.METHOD_NOT_ALLOWED)
          .end(`Method ${method} Not Allowed`);
    }
  },
  COOKIE_OPTIONS,
);
