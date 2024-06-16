import faunadb, { query as q } from 'faunadb';

import type {
  AllCanvasResRaw,
  CanvasDataRes,
  CanvasDataResRaw,
  User,
  UserRes,
} from '@/types/fauna';

const faunaClient = new faunadb.Client({
  secret: process.env.FAUNA_SECRET as string,
  domain: 'db.us.fauna.com',
});

export const getUser = async (body: Partial<User> & { name: string }) => {
  const { name } = body;
  const data: UserRes | null = await faunaClient.query<UserRes | null>(
    q.Let(
      {
        userRef: q.Match(q.Index('get_user_by_name'), name),
        userExists: q.Exists(q.Var('userRef')),
      },
      q.If(q.Var('userExists'), q.Get(q.Var('userRef')), null),
    ),
  );

  return data;
};

type ChangePasswordOption = {
  name: string;
  newPassword: string;
};

export const changePassword = async ({
  name,
  newPassword,
}: ChangePasswordOption) => {
  try {
    const data: UserRes | null = await faunaClient.query<UserRes | null>(
      q.Let(
        {
          userRef: q.Match(q.Index('get_user_by_name'), name),
          userExists: q.Exists(q.Var('userRef')),
        },
        q.If(
          q.Var('userExists'),
          q.Update(q.Select(['ref'], q.Get(q.Var('userRef'))), {
            data: { password: newPassword },
          }),
          null,
        ),
      ),
    );
    return data;
  } catch (e) {
    console.log(e);
  }
};

export type SaveCanvasOptions = {
  name: string;
  saveData: string;
};

export const saveCanvas = async ({ name, saveData }: SaveCanvasOptions) => {
  const result: CanvasDataRes | null =
    await faunaClient.query<CanvasDataRes | null>(
      q.Let(
        {
          canvasRef: q.Match(q.Index('get_canvas_by_name'), name),
          canvasExists: q.Exists(q.Var('canvasRef')),
        },
        q.If(
          q.Var('canvasExists'),
          q.Update(q.Select(['ref'], q.Get(q.Var('canvasRef'))), {
            data: { saveData },
          }),
          q.Create(q.Collection('canvas'), { data: { name, saveData } }),
        ),
      ),
    );

  return result;
};

export const getCanvas = async (name: string) => {
  const data: CanvasDataRes | null =
    await faunaClient.query<CanvasDataRes | null>(
      q.Let(
        {
          canvasRef: q.Match(q.Index('get_canvas_by_name'), name),
          canvasExists: q.Exists(q.Var('canvasRef')),
        },
        q.If(q.Var('canvasExists'), q.Get(q.Var('canvasRef')), null),
      ),
    );

  return data;
};

export const getCanvases = async (): Promise<CanvasDataRes[]> => {
  const { data } = await faunaClient.query<AllCanvasResRaw>(
    q.Map(
      q.Paginate(q.Documents(q.Collection('canvas'))),
      q.Lambda((x) => q.Get(x)),
    ),
  );

  return data.map((datum) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { ref: _ref, ...newDatum } = datum as CanvasDataRes &
      CanvasDataResRaw;
    newDatum.id = datum.ref.id;
    return newDatum;
  });
};
