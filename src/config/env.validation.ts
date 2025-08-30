import { z } from 'zod';

export const envSchema = z.object({
  // App
  APP_NAME: z.string(),
  APP_ENV: z.string(),
  APP_PORT: z.coerce.number(),
  APP_URL: z.string(),
  // Database
  DATABASE_USERNAME: z.string(),
  DATABASE_PASSWORD: z.string(),
  DATABASE_HOST: z.string(),
  DATABASE_PORT: z.coerce.number(),
  DATABASE_NAME: z.string(),
  DATABASE_URL: z.string(),
  // JWT
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string().default('1h'),
  // Email
  EMAIL_HOST: z.string(),
  EMAIL_PORT: z.coerce.number(),
  EMAIL_USER: z.string(),
  EMAIL_PASSWORD: z.string(),
});
