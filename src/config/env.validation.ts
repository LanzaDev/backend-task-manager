import { z } from 'zod';

export const envSchema = z.object({
  // APP
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

  // Cache
  CACHE_HOST: z.string(),
  CACHE_PORT: z.coerce.number(),
  CACHE_PASSWORD: z.string(),
  CACHE_DB: z.coerce.number().default(0),
  CACHE_TTL: z.coerce.number().default(5),
  CACHE_URL: z.string(),

  // JWT
  JWT_SECRET: z.string(),
  ACCESS_TOKEN_EXP: z.coerce.number().default(15),
  REFRESH_TOKEN_EXP: z.coerce.number().default(7),

  // Email
  EMAIL_HOST: z.string(),
  EMAIL_PORT: z.coerce.number(),
  EMAIL_USER: z.string(),
  EMAIL_PASSWORD: z.string(),
});
