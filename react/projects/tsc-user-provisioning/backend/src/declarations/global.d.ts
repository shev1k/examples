declare global {
  namespace NodeJS {
    type Service = 'gmail' | 'outlook' | string;

    interface ProcessEnv {
      EXPRESS_PORT: number;
      NODE_ENV: 'development' | 'production';
      DATABASE_HOST: string;
      DATABASE_USER: string;
      DATABASE_PASSWORD: string;
      DATABASE_NAME: string;
      DATABASE_POOL_MAX: number;
      DATABASE_POOL_MIN: number;
      DATABASE_POOL_ACQUIRE: number;
      DATABASE_POOL_IDL: number;
      JWT_ACCESS_SECRET: string;
      JWT_REFRESH_SECRET: string;
      MAIL_SERVICE: Service;
      MAIL_AUTH_TYPE: string;
      MAIL_AUTH_USER: string;
      MAIL_AUTH_CLIENT_ID: string;
      MAIL_AUTH_CLIENT_SECRET: string;
      MAIL_AUTH_ACCESS_TOKEN: string;
      MAIL_AUTH_REFRESH_TOKEN: string;
    }
  }

  namespace Express {
    export interface Request {
      user?: {
        uuid: string;
        role: import('@/dtos/user.dto').IUserDto['role'];
        accountType: import('@/enums').AccountType;
      };
    }
  }
}

export {};
