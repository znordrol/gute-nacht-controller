import cloudinary from 'cloudinary';
import httpStatus from 'http-status';
import { withIronSessionApiRoute } from 'iron-session/next';
import type { NextApiRequest, NextApiResponse } from 'next';

import { COOKIE_OPTIONS } from '@/constant/cookie';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb', // Set desired value here
    },
  },
};

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
        const image = req.body.image as string | undefined;
        const tags: string[] | undefined = req.body.tags;

        if (!image || typeof image !== 'string') {
          return res.status(httpStatus.BAD_REQUEST).json({
            status: httpStatus.BAD_REQUEST,
            message: 'Image is required',
          });
        }

        const uploadResponse = await cloudinary.v2.uploader.upload(image, {
          ...(req.body.name && {
            filename_override: req.body.name as string,
            use_filename: true,
            unique_filename: false,
          }),
          tags,
          folder: 'tia',
        });

        // req.session.destroy();
        res.send({ ok: true, data: uploadResponse });
        break;
      }
      case 'GET': {
        const queryTag = req.query?.tags;
        const shouldFetchByTag =
          queryTag &&
          typeof queryTag === 'string' &&
          queryTag.toLowerCase() !== 'all';

        const imagesPromise = shouldFetchByTag
          ? cloudinary.v2.api.resources_by_tag(queryTag as string)
          : cloudinary.v2.api.resources({
              type: 'upload',
              resource_type: 'image',
              prefix: 'tia/',
              max_results: 500,
              tags: true,
            });

        const tagsPromise = cloudinary.v2.api.tags();

        const [images, tags] = await Promise.all([imagesPromise, tagsPromise]);

        res.send({ ok: true, data: { images, tags } });

        break;
      }
      default:
        res.setHeader('Allow', ['POST', 'GET']);
        res
          .status(httpStatus.METHOD_NOT_ALLOWED)
          .end(`Method ${method} Not Allowed`);
    }
  },
  COOKIE_OPTIONS,
);
