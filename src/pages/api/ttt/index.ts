import httpStatus from 'http-status';
import { withIronSessionApiRoute } from 'iron-session/next';
import type { NextApiRequest, NextApiResponse } from 'next';

import { COOKIE_OPTIONS } from '@/constant/cookie';
import { delKey, getValue, setValue } from '@/lib/redis';
import { Coordinate, insertPlay, newTtt, TTT } from '@/lib/ttt';

export type GetResponse = {
  message: string;
  ttt: TTT;
};

const tttHandler = withIronSessionApiRoute(
  async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {
      const user = req.session.user;

      if (!user || user?.admin !== true) {
        return res
          .status(httpStatus.UNAUTHORIZED)
          .send({ message: 'Unauthorized' });
      }
      const ttt = (await getValue<TTT>('ttt')) || newTtt();
      res.json({
        message: 'success',
        ttt,
      });
    } else if (req.method === 'POST') {
      const user = req.session.user;

      if (!user || user?.admin !== true) {
        return res
          .status(httpStatus.UNAUTHORIZED)
          .send({ message: 'Unauthorized' });
      }
      if (req.body === undefined || req.body.y === undefined) {
        return res.status(400).json({ message: 'Give me a coordinate!' });
      }

      const { x, y }: Coordinate = req.body;
      const ttt: TTT = ((await getValue<TTT>('ttt')) as TTT) || newTtt();

      await setValue('ttt', insertPlay(ttt, [x, y]));
      res.json({
        message: 'success',
        ttt: await getValue<TTT>('ttt'),
      });
    } else if (req.method === 'DELETE') {
      const user = req.session.user;

      if (!user || user?.admin !== true) {
        return res
          .status(httpStatus.UNAUTHORIZED)
          .send({ message: 'Unauthorized' });
      }
      await delKey('ttt');
      res.json({
        message: 'success',
        ttt: await getValue<TTT>('ttt'),
      });
    } else {
      res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
  },
  COOKIE_OPTIONS,
);

export default tttHandler;
