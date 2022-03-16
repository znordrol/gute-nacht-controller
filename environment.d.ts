declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: 'development' | 'production';
    PERSONAL_ACCESS_TOKEN: string;
    COOKIE_PASS: string;
    FAUNA_SECRET: string;
    REDIS_URL: string;
  }
}
