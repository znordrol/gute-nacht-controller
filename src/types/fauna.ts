export type User = {
  name: string;
  password: string;
  admin?: boolean;
};

export type UserRes = {
  data: User;
  ts: number;
};

export type CanvasData = {
  name: string;
  saveData: string;
};

export type CanvasDataRes = {
  data: CanvasData;
  ts: number;
  id: string;
};

export type CanvasDataResRaw = {
  data: CanvasData;
  ts: number;
  ref: {
    id: string;
  };
};

export type AllCanvasRes = {
  data: CanvasDataRes[];
};

export type AllCanvasResRaw = {
  data: CanvasDataResRaw[];
};
