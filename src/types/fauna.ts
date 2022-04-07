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
};
