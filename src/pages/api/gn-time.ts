import httpStatus from 'http-status';
import { withIronSessionApiRoute } from 'iron-session/next';
import type { NextApiRequest, NextApiResponse } from 'next';

import { COOKIE_NAME } from '@/constant/cookie';
import { getFile, updateFile } from '@/lib/github';

const cronRegex =
  /(@(annually|yearly|monthly|weekly|daily|hourly|reboot))|(@every (\d+(ns|us|µs|ms|s|m|h))+)|((((\d+,)+\d+|(\d+(\/|-)\d+)|\d+|\*) ?){5,7})/;

const toUTC = (h: string | number) => (+h - 7 < 0 ? +h - 7 + 24 : +h - 7);

const GuteNachtTime = withIronSessionApiRoute(
  async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
      const user = req.session.user;

      if (!user || user?.admin !== true) {
        return res
          .status(httpStatus.UNAUTHORIZED)
          .send({ message: 'Unauthorized' });
      }
      const data = req.body;
      if (!data.time) {
        return res.status(httpStatus.BAD_REQUEST).json({
          status: httpStatus.BAD_REQUEST,
          message: 'Invalid request, please give me the time yo',
        });
      }
      const t = data.time as string;
      const [h, m] = t.split(':');
      if (!h || !m) {
        return res.status(httpStatus.BAD_REQUEST).json({
          status: httpStatus.BAD_REQUEST,
          message: 'Invalid request, please give me a valid time string',
        });
      }

      const content = await getFile({
        path: '.github/workflows/gute_nacht.yml',
      });

      const newContent = content.replace(cronRegex, `${+m} ${toUTC(+h)} * * *`);

      await updateFile({
        path: '.github/workflows/gute_nacht.yml',
        content: newContent,
        message: 'api: update gute nacht cron :rocket:',
      });

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

export default GuteNachtTime;
