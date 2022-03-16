import Redis from 'ioredis';

export const redis = new Redis(process.env.REDIS_URL);

export const setValue = <T>(key: string, obj: T, ex: number = 30 * 60) => {
  const value = JSON.stringify(obj);
  return redis.setex(key, ex, value);
};

export const getValue = async <T>(key: string, isJson = true) =>
  isJson ? (JSON.parse((await redis.get(key)) as string) as T) : redis.get(key);

export const delKey = (key: string) => redis.del(key);
