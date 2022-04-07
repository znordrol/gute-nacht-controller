import { withIronSessionApiRoute } from 'iron-session/next';
import type { NextApiRequest, NextApiResponse } from 'next';

import { COOKIE_OPTIONS } from '@/constant/cookie';
import { saveCanvas } from '@/lib/fauna';

const CanvasHandler = withIronSessionApiRoute(
  async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
      const user = req.session.user;

      if (!user || user?.admin !== true) {
        return res.status(401).send({ message: 'Unauthorized' });
      }
      const name = req.body.name as string;
      const saveData = req.body.saveData as string;
      if (!name || !saveData) {
        return res.status(400).send({
          message: 'Please provide the name and the save data of the canvas',
        });
      }
      await saveCanvas({ name, saveData });
      res.status(201).send('OK');
    } else {
      res.status(405).json({ message: 'Method Not Allowed' });
    }
  },
  COOKIE_OPTIONS
);

export default CanvasHandler;
