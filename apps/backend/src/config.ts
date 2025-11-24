import dotenv from 'dotenv';

dotenv.config();

const defaults: Record<string, string> = {
  PORT: '4000',
  JWT_SECRET: 'dev-secret',
  DATABASE_URL: 'mysql://root:example@localhost:3306/voting'
};

const required = ['PORT', 'JWT_SECRET', 'DATABASE_URL'];
required.forEach((key) => {
  if (!process.env[key]) {
    process.env[key] = defaults[key];
  }

  if (!process.env[key]) {
    throw new Error(`Missing required env var: ${key}`);
  }
});

export const config = {
  env: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT) || 4000,
  jwtSecret: process.env.JWT_SECRET as string,
  databaseUrl: process.env.DATABASE_URL as string,
  smtp: {
    host: process.env.SMTP_HOST ?? '',
    port: Number(process.env.SMTP_PORT) || 587,
    user: process.env.SMTP_USER ?? '',
    password: process.env.SMTP_PASSWORD ?? '',
    from: process.env.SMTP_FROM ?? 'Strata Voting <noreply@example.com>'
  },
  app: {
    baseUrl: process.env.APP_BASE_URL ?? 'http://localhost:5173'
  }
};
